"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_path_1 = __importDefault(require("node:path"));
const node_fs_1 = __importDefault(require("node:fs"));
const node_wav_1 = __importDefault(require("node-wav"));
const stt_1 = require("stt");
const stt_parser_base_1 = require("../stt-parser-base");
const constants_1 = require("../../../constants");
const log_helper_1 = require("../../../helpers/log-helper");
class CoquiSTTParser extends stt_parser_base_1.STTParserBase {
    constructor() {
        super();
        this.name = 'Coqui STT Parser';
        this.model = undefined;
        this.desiredSampleRate = 16000;
        log_helper_1.LogHelper.title(this.name);
        log_helper_1.LogHelper.success('New instance');
        const modelPath = node_path_1.default.join(constants_1.BIN_PATH, 'coqui', 'model.tflite');
        const scorerPath = node_path_1.default.join(constants_1.BIN_PATH, 'coqui', 'huge-vocabulary.scorer');
        log_helper_1.LogHelper.info(`Loading model from file ${modelPath}...`);
        if (!node_fs_1.default.existsSync(modelPath)) {
            log_helper_1.LogHelper.error(`Cannot find ${modelPath}. You can set up the offline STT by running: "npm run setup:offline-stt"`);
        }
        if (!node_fs_1.default.existsSync(scorerPath)) {
            log_helper_1.LogHelper.error(`Cannot find ${scorerPath}. You can setup the offline STT by running: "npm run setup:offline-stt"`);
        }
        try {
            this.model = new stt_1.Model(modelPath);
        }
        catch (e) {
            throw Error(`${this.name} - Failed to load the model: ${e}`);
        }
        this.desiredSampleRate = this.model.sampleRate();
        try {
            this.model.enableExternalScorer(scorerPath);
        }
        catch (e) {
            throw Error(`${this.name} - Failed to enable external scorer: ${e}`);
        }
        log_helper_1.LogHelper.success('Parser initialized');
    }
    /**
     * Read audio buffer and return the transcript (decoded string)
     */
    async parse(buffer) {
        const wavDecode = node_wav_1.default.decode(buffer);
        if (this.model) {
            if (wavDecode.sampleRate < this.desiredSampleRate) {
                log_helper_1.LogHelper.warning(`Original sample rate (${wavDecode.sampleRate}) is lower than ${this.desiredSampleRate}Hz. Up-sampling might produce erratic speech recognition`);
            }
            // Decoded string
            return this.model.stt(buffer);
        }
        return null;
    }
}
exports.default = CoquiSTTParser;
