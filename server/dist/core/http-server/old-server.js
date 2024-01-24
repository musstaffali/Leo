"use strict";
/* eslint-disable */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// TODO: delete this file once multi clients are reimplemented
const node_path_1 = require("node:path");
const fastify_1 = __importDefault(require("fastify"));
const static_1 = __importDefault(require("@fastify/static"));
const socket_io_1 = __importDefault(require("socket.io"));
const package_json_1 = require("../../../../package.json");
const skills_endpoints_json_1 = require("../../../../core/skills-endpoints.json");
const constants_1 = require("../../constants");
const core_1 = require("./..");
const nlu_1 = __importDefault(require("@/core/nlu"));
const brain_1 = __importDefault(require("@/core/brain"));
const asr_1 = __importDefault(require("../asr/asr"));
const stt_1 = __importDefault(require("@/stt/stt"));
const tts_1 = __importDefault(require("@/tts/tts"));
const cors_1 = __importDefault(require("./plugins/cors"));
const other_1 = __importDefault(require("./plugins/other"));
const key_1 = __importDefault(require("./plugins/key"));
const info_1 = __importDefault(require("./api/info"));
const log_helper_1 = require("../../helpers/log-helper");
const date_helper_1 = require("../../helpers/date-helper");
const server = {};
let mainProvider = {
    id: 1,
    brain: {},
    nlu: {}
};
let providers = [];
const createProvider = async (id) => {
    const brain = new brain_1.default();
    const nlu = new nlu_1.default(brain);
    // Load NLP models
    try {
        await Promise.all([
            nlu.loadGlobalResolversModel((0, node_path_1.join)(process.cwd(), 'core/data/models/leon-global-resolvers-model.nlp')),
            nlu.loadSkillsResolversModel((0, node_path_1.join)(process.cwd(), 'core/data/models/leon-skills-resolvers-model.nlp')),
            nlu.loadMainModel((0, node_path_1.join)(process.cwd(), 'core/data/models/leon-main-model.nlp'))
        ]);
        return {
            id,
            brain,
            nlu
        };
    }
    catch (e) {
        log_helper_1.LogHelper[e.type](e.obj.message);
        return null;
    }
};
const addProvider = async (id) => {
    providers = providers || [];
    const index = providers.indexOf((p) => p.id === id);
    const obj = await createProvider(id);
    if (id === '1' && obj) {
        mainProvider = obj;
    }
    if (index < 0) {
        providers.push(obj);
    }
    else {
        providers.splice(index, 1, obj);
    }
    return obj;
};
const deleteProvider = (id) => {
    providers = providers || [];
    providers = providers.filter((p) => p.id !== id);
    if (id === '1') {
        mainProvider = {
            id: 1,
            brain: {},
            nlu: {}
        };
    }
};
server.fastify = (0, fastify_1.default)();
server.httpServer = {};
/**
 * Generate skills routes
 */
/* istanbul ignore next */
server.generateSkillsRoutes = (instance) => {
    // Dynamically expose Leon skills over HTTP
    skills_endpoints_json_1.endpoints.forEach((endpoint) => {
        instance.route({
            method: endpoint.method,
            url: endpoint.route,
            async handler(request, reply) {
                const timeout = endpoint.timeout || 60000;
                const [, , , domain, skill, action] = endpoint.route.split('/');
                const handleRoute = async () => {
                    const { params } = endpoint;
                    const entities = [];
                    params.forEach((param) => {
                        const value = request.body[param];
                        const trimEntity = {
                            entity: param,
                            sourceText: value,
                            utteranceText: value,
                            resolution: { value }
                        };
                        const builtInEntity = {
                            entity: param,
                            resolution: { ...value }
                        };
                        let entity = endpoint?.entitiesType === 'trim' ? trimEntity : builtInEntity;
                        if (Array.isArray(value)) {
                            value.forEach((v) => {
                                entity = {
                                    entity: param,
                                    resolution: { ...v }
                                };
                                entities.push(entity);
                            });
                        }
                        else {
                            entities.push(entity);
                        }
                    });
                    const obj = {
                        utterance: '',
                        entities,
                        classification: {
                            domain,
                            skill,
                            action,
                            confidence: 1
                        }
                    };
                    const responseData = {
                        domain,
                        skill,
                        action,
                        speeches: []
                    };
                    try {
                        const data = await mainProvider.brain.execute(obj, { mute: true });
                        reply.send({
                            ...data,
                            success: true
                        });
                    }
                    catch (e) /* istanbul ignore next */ {
                        log_helper_1.LogHelper[e.type](e.obj.message);
                        reply.statusCode = 500;
                        reply.send({
                            ...responseData,
                            speeches: e.speeches,
                            executionTime: e.executionTime,
                            message: e.obj.message,
                            success: false
                        });
                    }
                };
                handleRoute();
                setTimeout(() => {
                    reply.statusCode = 408;
                    reply.send({
                        domain,
                        skill,
                        action,
                        message: 'The action has timed out',
                        timeout,
                        success: false
                    });
                }, timeout);
            }
        });
    });
};
/**
 * Bootstrap socket
 */
server.handleOnConnection = (socket) => {
    log_helper_1.LogHelper.title('Client');
    log_helper_1.LogHelper.success('Connected');
    // Init
    socket.on('init', async (data) => {
        log_helper_1.LogHelper.info(`Type: ${data}`);
        log_helper_1.LogHelper.info(`Socket id: ${socket.id}`);
        const provider = await addProvider(socket.id);
        // Check whether the TCP client is connected to the TCP server
        if (core_1.TCP_CLIENT.isConnected) {
            socket.emit('ready');
        }
        else {
            core_1.TCP_CLIENT.ee.on('connected', () => {
                socket.emit('ready');
            });
        }
        if (data === 'hotword-node') {
            // Hotword triggered
            socket.on('hotword-detected', (data) => {
                log_helper_1.LogHelper.title('Socket');
                log_helper_1.LogHelper.success(`Hotword ${data.hotword} detected`);
                socket.broadcast.emit('enable-record');
            });
        }
        else {
            const asr = new asr_1.default();
            let sttState = 'disabled';
            let ttsState = 'disabled';
            provider.brain.socket = socket;
            /* istanbul ignore if */
            if (constants_1.HAS_STT) {
                sttState = 'enabled';
                provider.brain.stt = new stt_1.default(socket, constants_1.STT_PROVIDER);
                provider.brain.stt.init(() => null);
            }
            if (constants_1.HAS_TTS) {
                ttsState = 'enabled';
                provider.brain.tts = new tts_1.default(socket, constants_1.TTS_PROVIDER);
                provider.brain.tts.init('en', () => null);
            }
            log_helper_1.LogHelper.title('Initialization');
            log_helper_1.LogHelper.success(`STT ${sttState}`);
            log_helper_1.LogHelper.success(`TTS ${ttsState}`);
            // Listen for new utterance
            socket.on('utterance', async (data) => {
                log_helper_1.LogHelper.title('Socket');
                log_helper_1.LogHelper.info(`${data.client} emitted: ${data.value}`);
                socket.emit('is-typing', true);
                const utterance = data.value;
                try {
                    log_helper_1.LogHelper.time('Utterance processed in');
                    await provider.nlu.process(utterance);
                    log_helper_1.LogHelper.title('Execution Time');
                    log_helper_1.LogHelper.timeEnd('Utterance processed in');
                }
                catch (e) {
                    /* */
                }
            });
            // Handle automatic speech recognition
            socket.on('recognize', async (data) => {
                try {
                    await asr.run(data, provider.brain.stt);
                }
                catch (e) {
                    log_helper_1.LogHelper[e.type](e.obj.message);
                }
            });
        }
    });
    socket.once('disconnect', () => {
        deleteProvider(socket.id);
    });
};
/**
 * Launch server
 */
server.listen = async (port) => {
    const io = constants_1.IS_DEVELOPMENT_ENV
        ? (0, socket_io_1.default)(server.httpServer, {
            cors: { origin: `${constants_1.HOST}:3000` }
        })
        : (0, socket_io_1.default)(server.httpServer);
    io.on('connection', server.handleOnConnection);
    server.fastify.listen({
        port,
        host: '0.0.0.0'
    }, () => {
        log_helper_1.LogHelper.title('Initialization');
        log_helper_1.LogHelper.success(`Server is available at ${constants_1.HOST}:${port}`);
    });
};
/**
 * Bootstrap API
 */
server.bootstrap = async () => {
    const apiVersion = 'v1';
    // Render the web app
    server.fastify.register(static_1.default, {
        root: (0, node_path_1.join)(process.cwd(), 'app/dist'),
        prefix: '/'
    });
    server.fastify.get('/', (request, reply) => {
        reply.sendFile('index.html');
    });
    server.fastify.register(info_1.default, { apiVersion });
    if (constants_1.HAS_OVER_HTTP) {
        server.fastify.register((instance, opts, next) => {
            instance.addHook('preHandler', key_1.default);
            instance.post('/api/query', async (request, reply) => {
                const { utterance } = request.body;
                try {
                    const data = await mainProvider.nlu.process(utterance, { mute: true });
                    reply.send({
                        ...data,
                        success: true
                    });
                }
                catch (e) {
                    reply.statusCode = 500;
                    reply.send({
                        message: e.message,
                        success: false
                    });
                }
            });
            server.generateSkillsRoutes(instance);
            next();
        });
    }
    server.httpServer = server.fastify.server;
    try {
        await server.listen(constants_1.PORT);
    }
    catch (e) {
        log_helper_1.LogHelper.error(e.message);
    }
};
/**
 * Server entry point
 */
server.init = async () => {
    server.fastify.addHook('onRequest', cors_1.default);
    server.fastify.addHook('preValidation', other_1.default);
    log_helper_1.LogHelper.title('Initialization');
    log_helper_1.LogHelper.success(`The current env is ${constants_1.LEON_NODE_ENV}`);
    log_helper_1.LogHelper.success(`The current version is ${package_json_1.version}`);
    log_helper_1.LogHelper.success(`The current time zone is ${date_helper_1.DateHelper.getTimeZone()}`);
    const sLogger = !constants_1.HAS_LOGGER ? 'disabled' : 'enabled';
    log_helper_1.LogHelper.success(`Collaborative logger ${sLogger}`);
    await addProvider('1');
    await server.bootstrap();
};
exports.default = server;
