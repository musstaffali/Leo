"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BRAIN = exports.NLU = exports.MODEL_LOADER = exports.NER = exports.ASR = exports.TTS = exports.STT = exports.SOCKET_SERVER = exports.HTTP_SERVER = exports.TCP_CLIENT = void 0;
const constants_1 = require("../constants");
const tcp_client_1 = __importDefault(require("./tcp-client"));
const http_server_1 = __importDefault(require("./http-server/http-server"));
const socket_server_1 = __importDefault(require("./socket-server"));
const stt_1 = __importDefault(require("./stt/stt"));
const tts_1 = __importDefault(require("./tts/tts"));
const asr_1 = __importDefault(require("./asr/asr"));
const ner_1 = __importDefault(require("./nlp/nlu/ner"));
const model_loader_1 = __importDefault(require("./nlp/nlu/model-loader"));
const nlu_1 = __importDefault(require("./nlp/nlu/nlu"));
const brain_1 = __importDefault(require("./brain/brain"));
/**
 * Register core singletons
 */
exports.TCP_CLIENT = new tcp_client_1.default(String(constants_1.TCP_SERVER_HOST), constants_1.TCP_SERVER_PORT);
exports.HTTP_SERVER = new http_server_1.default(String(constants_1.HOST), constants_1.PORT);
exports.SOCKET_SERVER = new socket_server_1.default();
exports.STT = new stt_1.default();
exports.TTS = new tts_1.default();
exports.ASR = new asr_1.default();
exports.NER = new ner_1.default();
exports.MODEL_LOADER = new model_loader_1.default();
exports.NLU = new nlu_1.default();
exports.BRAIN = new brain_1.default();
