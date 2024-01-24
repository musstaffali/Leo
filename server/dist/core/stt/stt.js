"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
const constants_1 = require("../../constants");
const core_1 = require("./..");
const types_1 = require("./types");
const log_helper_1 = require("../../helpers/log-helper");
const PROVIDERS_MAP = {
    [types_1.STTProviders.GoogleCloudSTT]: types_1.STTParserNames.GoogleCloudSTT,
    [types_1.STTProviders.WatsonSTT]: types_1.STTParserNames.WatsonSTT,
    [types_1.STTProviders.CoquiSTT]: types_1.STTParserNames.CoquiSTT
};
class STT {
    constructor() {
        this.parser = undefined;
        if (!STT.instance) {
            log_helper_1.LogHelper.title('STT');
            log_helper_1.LogHelper.success('New instance');
            STT.instance = this;
        }
    }
    get isParserReady() {
        return !!this.parser;
    }
    /**
     * Initialize the STT provider
     */
    async init() {
        log_helper_1.LogHelper.title('STT');
        log_helper_1.LogHelper.info('Initializing STT...');
        if (!Object.values(types_1.STTProviders).includes(constants_1.STT_PROVIDER)) {
            log_helper_1.LogHelper.error(`The STT provider "${constants_1.STT_PROVIDER}" does not exist or is not yet supported`);
            return false;
        }
        if (constants_1.STT_PROVIDER === types_1.STTProviders.GoogleCloudSTT &&
            typeof process.env['GOOGLE_APPLICATION_CREDENTIALS'] === 'undefined') {
            process.env['GOOGLE_APPLICATION_CREDENTIALS'] = node_path_1.default.join(constants_1.VOICE_CONFIG_PATH, 'google-cloud.json');
        }
        else if (typeof process.env['GOOGLE_APPLICATION_CREDENTIALS'] !== 'undefined' &&
            process.env['GOOGLE_APPLICATION_CREDENTIALS'].indexOf('google-cloud.json') === -1) {
            log_helper_1.LogHelper.warning(`The "GOOGLE_APPLICATION_CREDENTIALS" env variable is already settled with the following value: "${process.env['GOOGLE_APPLICATION_CREDENTIALS']}"`);
        }
        // Dynamically attribute the parser
        const { default: parser } = await Promise.resolve(`${node_path_1.default.join(__dirname, 'parsers', PROVIDERS_MAP[constants_1.STT_PROVIDER])}`).then(s => __importStar(require(s)));
        this.parser = new parser();
        log_helper_1.LogHelper.title('STT');
        log_helper_1.LogHelper.success('STT initialized');
        return true;
    }
    /**
     * Read the speech file and transcribe
     */
    async transcribe(audioFilePath) {
        log_helper_1.LogHelper.info('Parsing WAVE file...');
        if (!node_fs_1.default.existsSync(audioFilePath)) {
            log_helper_1.LogHelper.error(`The WAVE file "${audioFilePath}" does not exist`);
            return false;
        }
        const buffer = node_fs_1.default.readFileSync(audioFilePath);
        const transcript = await this.parser?.parse(buffer);
        if (transcript && transcript !== '') {
            // Forward the string to the client
            this.forward(transcript);
        }
        else {
            this.deleteAudios();
        }
        return true;
    }
    /**
     * Forward string output to the client
     * and delete audio files once it has been forwarded
     */
    forward(str) {
        core_1.SOCKET_SERVER.socket?.emit('recognized', str, (confirmation) => {
            if (confirmation === 'string-received') {
                this.deleteAudios();
            }
        });
        log_helper_1.LogHelper.success(`Parsing result: ${str}`);
    }
    /**
     * Delete audio files
     */
    deleteAudios() {
        const audioPaths = Object.keys(core_1.ASR.audioPaths);
        for (let i = 0; i < audioPaths.length; i += 1) {
            const audioType = audioPaths[i];
            const audioPath = core_1.ASR.audioPaths[audioType];
            if (node_fs_1.default.existsSync(audioPath)) {
                node_fs_1.default.unlinkSync(audioPath);
            }
        }
    }
}
exports.default = STT;
