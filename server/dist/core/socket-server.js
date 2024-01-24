"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const constants_1 = require("../constants");
const core_1 = require("./");
const log_helper_1 = require("../helpers/log-helper");
const lang_helper_1 = require("../helpers/lang-helper");
const telemetry_1 = require("../telemetry");
class SocketServer {
    constructor() {
        this.socket = undefined;
        if (!SocketServer.instance) {
            log_helper_1.LogHelper.title('Socket Server');
            log_helper_1.LogHelper.success('New instance');
            SocketServer.instance = this;
        }
    }
    async init() {
        const io = constants_1.IS_DEVELOPMENT_ENV
            ? new socket_io_1.Server(core_1.HTTP_SERVER.httpServer, {
                cors: { origin: `${core_1.HTTP_SERVER.host}:3000` }
            })
            : new socket_io_1.Server(core_1.HTTP_SERVER.httpServer);
        let sttState = 'disabled';
        let ttsState = 'disabled';
        if (constants_1.HAS_STT) {
            sttState = 'enabled';
            await core_1.STT.init();
        }
        if (constants_1.HAS_TTS) {
            ttsState = 'enabled';
            await core_1.TTS.init(lang_helper_1.LangHelper.getShortCode(constants_1.LANG));
        }
        log_helper_1.LogHelper.title('Initialization');
        log_helper_1.LogHelper.success(`STT ${sttState}`);
        log_helper_1.LogHelper.success(`TTS ${ttsState}`);
        try {
            await core_1.MODEL_LOADER.loadNLPModels();
        }
        catch (e) {
            log_helper_1.LogHelper.error(`Failed to load NLP models: ${e}`);
        }
        io.on('connection', (socket) => {
            log_helper_1.LogHelper.title('Client');
            log_helper_1.LogHelper.success('Connected');
            this.socket = socket;
            // Init
            this.socket.on('init', (data) => {
                log_helper_1.LogHelper.info(`Type: ${data}`);
                log_helper_1.LogHelper.info(`Socket ID: ${this.socket?.id}`);
                // TODO
                // const provider = await addProvider(socket.id)
                // Check whether the TCP client is connected to the TCP server
                if (core_1.TCP_CLIENT.isConnected) {
                    this.socket?.emit('ready');
                }
                else {
                    core_1.TCP_CLIENT.ee.on('connected', () => {
                        this.socket?.emit('ready');
                    });
                }
                if (data === 'hotword-node') {
                    // Hotword triggered
                    this.socket?.on('hotword-detected', (data) => {
                        log_helper_1.LogHelper.title('Socket');
                        log_helper_1.LogHelper.success(`Hotword ${data.hotword} detected`);
                        this.socket?.broadcast.emit('enable-record');
                    });
                }
                else {
                    // Listen for new utterance
                    this.socket?.on('utterance', async (data) => {
                        log_helper_1.LogHelper.title('Socket');
                        log_helper_1.LogHelper.info(`${data.client} emitted: ${data.value}`);
                        this.socket?.emit('is-typing', true);
                        const { value: utterance } = data;
                        try {
                            log_helper_1.LogHelper.time('Utterance processed in');
                            core_1.BRAIN.isMuted = false;
                            const processedData = await core_1.NLU.process(utterance);
                            if (processedData) {
                                telemetry_1.Telemetry.utterance(processedData);
                            }
                            log_helper_1.LogHelper.title('Execution Time');
                            log_helper_1.LogHelper.timeEnd('Utterance processed in');
                        }
                        catch (e) {
                            log_helper_1.LogHelper.error(`Failed to process utterance: ${e}`);
                        }
                    });
                    // Handle automatic speech recognition
                    this.socket?.on('recognize', async (data) => {
                        try {
                            await core_1.ASR.encode(data);
                        }
                        catch (e) {
                            log_helper_1.LogHelper.error(`ASR - Failed to encode audio blob to WAVE file: ${e}`);
                        }
                    });
                }
            });
            this.socket.once('disconnect', () => {
                // TODO
                // deleteProvider(this.socket.id)
            });
        });
    }
}
exports.default = SocketServer;
