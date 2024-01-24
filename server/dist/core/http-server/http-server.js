"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_path_1 = require("node:path");
const fastify_1 = __importDefault(require("fastify"));
const static_1 = __importDefault(require("@fastify/static"));
const constants_1 = require("../../constants");
const log_helper_1 = require("../../helpers/log-helper");
const date_helper_1 = require("../../helpers/date-helper");
const cors_1 = require("./plugins/cors");
const other_1 = require("./plugins/other");
const info_1 = require("./api/info");
const key_1 = require("./plugins/key");
const utterance_1 = require("./api/utterance");
const API_VERSION = 'v1';
class HTTPServer {
    constructor(host, port) {
        this.host = host;
        this.port = port;
        this.fastify = (0, fastify_1.default)();
        this.httpServer = this.fastify.server;
        if (!HTTPServer.instance) {
            log_helper_1.LogHelper.title('HTTP Server');
            log_helper_1.LogHelper.success('New instance');
            HTTPServer.instance = this;
        }
        this.host = host;
        this.port = port;
    }
    /**
     * Server entry point
     */
    async init() {
        this.fastify.addHook('onRequest', cors_1.corsMidd);
        this.fastify.addHook('preValidation', other_1.otherMidd);
        log_helper_1.LogHelper.title('Initialization');
        log_helper_1.LogHelper.info(`The current env is ${constants_1.LEON_NODE_ENV}`);
        log_helper_1.LogHelper.info(`The current version is ${constants_1.LEON_VERSION}`);
        log_helper_1.LogHelper.info(`The current time zone is ${date_helper_1.DateHelper.getTimeZone()}`);
        const isTelemetryEnabled = constants_1.IS_TELEMETRY_ENABLED ? 'enabled' : 'disabled';
        log_helper_1.LogHelper.info(`Telemetry ${isTelemetryEnabled}`);
        await this.bootstrap();
    }
    /**
     * Bootstrap API
     */
    async bootstrap() {
        // Render the web app
        this.fastify.register(static_1.default, {
            root: (0, node_path_1.join)(process.cwd(), 'app', 'dist'),
            prefix: '/'
        });
        this.fastify.get('/', (_request, reply) => {
            reply.sendFile('index.html');
        });
        this.fastify.register(info_1.infoPlugin, { apiVersion: API_VERSION });
        if (constants_1.HAS_OVER_HTTP) {
            this.fastify.register((instance, _opts, next) => {
                instance.addHook('preHandler', key_1.keyMidd);
                instance.register(utterance_1.utterancePlugin, { apiVersion: API_VERSION });
                // TODO: reimplement skills routes once the new core is ready
                // server.generateSkillsRoutes(instance)
                next();
            });
        }
        try {
            await this.listen();
        }
        catch (e) {
            log_helper_1.LogHelper.error(e.message);
        }
    }
    /**
     * Launch server
     */
    async listen() {
        this.fastify.listen({
            port: this.port,
            host: '0.0.0.0'
        }, () => {
            log_helper_1.LogHelper.title('Initialization');
            log_helper_1.LogHelper.success(`Server is available at ${this.host}:${this.port}`);
        });
    }
}
exports.default = HTTPServer;
