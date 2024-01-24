"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_path_1 = __importDefault(require("node:path"));
const node_fs_1 = __importDefault(require("node:fs"));
const node_stream_1 = require("node:stream");
const v1_1 = __importDefault(require("ibm-watson/speech-to-text/v1"));
const auth_1 = require("ibm-watson/auth");
const stt_parser_base_1 = require("../stt-parser-base");
const constants_1 = require("../../../constants");
const log_helper_1 = require("../../../helpers/log-helper");
class WatsonSTTParser extends stt_parser_base_1.STTParserBase {
    constructor() {
        super();
        this.name = 'Watson STT Parser';
        this.client = undefined;
        log_helper_1.LogHelper.title(this.name);
        log_helper_1.LogHelper.success('New instance');
        const config = JSON.parse(node_fs_1.default.readFileSync(node_path_1.default.join(constants_1.VOICE_CONFIG_PATH, 'watson-stt.json'), 'utf8'));
        try {
            this.client = new v1_1.default({
                authenticator: new auth_1.IamAuthenticator({ apikey: config.apikey }),
                serviceUrl: config.url
            });
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
            const stream = new node_stream_1.Duplex();
            stream.push(buffer);
            stream.push(null);
            try {
                const { result } = await this.client.recognize({
                    contentType: 'audio/wav',
                    model: `${constants_1.LANG}_BroadbandModel`,
                    audio: stream
                });
                // Decoded string
                return (result.results || [])
                    .map((data) => data.alternatives && data.alternatives[0]?.transcript)
                    .join('\n');
            }
            catch (e) {
                log_helper_1.LogHelper.error(`${this.name} - Failed to parse: ${e}`);
            }
        }
        return null;
    }
}
exports.default = WatsonSTTParser;
