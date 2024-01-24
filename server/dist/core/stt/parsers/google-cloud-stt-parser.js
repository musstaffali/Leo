"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_path_1 = __importDefault(require("node:path"));
const speech_1 = __importDefault(require("@google-cloud/speech"));
const stt_parser_base_1 = require("../stt-parser-base");
const constants_1 = require("../../../constants");
const log_helper_1 = require("../../../helpers/log-helper");
class GoogleCloudSTTParser extends stt_parser_base_1.STTParserBase {
    constructor() {
        super();
        this.name = 'Google Cloud STT Parser';
        this.client = undefined;
        log_helper_1.LogHelper.title(this.name);
        log_helper_1.LogHelper.success('New instance');
        /**
         * Initialize Google Cloud Speech-to-Text based on the credentials in the JSON file
         * the env variable "GOOGLE_APPLICATION_CREDENTIALS" provides the JSON file path
         */
        process.env['GOOGLE_APPLICATION_CREDENTIALS'] = node_path_1.default.join(constants_1.VOICE_CONFIG_PATH, 'google-cloud.json');
        try {
            this.client = new speech_1.default.SpeechClient();
            log_helper_1.LogHelper.success('Parser initialized');
        }
        catch (e) {
            log_helper_1.LogHelper.error(`${this.name} - Failed to initialize: ${e}`);
        }
    }
    /**
     * Read audio buffer and return the transcript (decoded string)
     */
    async parse(buffer) {
        if (this.client) {
            const audioBytes = buffer.toString('base64');
            const audio = { content: audioBytes };
            try {
                const [res] = await this.client.recognize({
                    audio,
                    config: {
                        languageCode: constants_1.LANG,
                        encoding: 'LINEAR16',
                        sampleRateHertz: 16000
                    }
                });
                // Decoded string
                return (res.results || [])
                    .map((data) => data.alternatives && data.alternatives[0]?.transcript)
                    .join('\n');
            }
            catch (e) {
                log_helper_1.LogHelper.error(`${this.name} - Failed to parse: ${e}`);
            }
        }
        else {
            log_helper_1.LogHelper.error(`${this.name} - Not initialized`);
        }
        return null;
    }
}
exports.default = GoogleCloudSTTParser;
