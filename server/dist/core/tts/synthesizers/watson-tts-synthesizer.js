"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_path_1 = __importDefault(require("node:path"));
const node_fs_1 = __importDefault(require("node:fs"));
const v1_1 = __importDefault(require("ibm-watson/text-to-speech/v1"));
const auth_1 = require("ibm-watson/auth");
const constants_1 = require("../../../constants");
const core_1 = require("../..");
const tts_synthesizer_base_1 = require("../tts-synthesizer-base");
const log_helper_1 = require("../../../helpers/log-helper");
const string_helper_1 = require("../../../helpers/string-helper");
const VOICES = {
    'en-US': {
        voice: 'en-US_MichaelV3Voice'
    },
    'fr-FR': {
        voice: 'fr-FR_NicolasV3Voice'
    }
};
class WatsonTTSSynthesizer extends tts_synthesizer_base_1.TTSSynthesizerBase {
    constructor(lang) {
        super();
        this.name = 'Watson TTS Synthesizer';
        this.lang = constants_1.LANG;
        this.client = undefined;
        log_helper_1.LogHelper.title(this.name);
        log_helper_1.LogHelper.success('New instance');
        const config = JSON.parse(node_fs_1.default.readFileSync(node_path_1.default.join(constants_1.VOICE_CONFIG_PATH, 'watson-stt.json'), 'utf8'));
        try {
            this.lang = lang;
            this.client = new v1_1.default({
                authenticator: new auth_1.IamAuthenticator({ apikey: config.apikey }),
                serviceUrl: config.url
            });
            log_helper_1.LogHelper.success('Synthesizer initialized');
        }
        catch (e) {
            log_helper_1.LogHelper.error(`${this.name} - Failed to initialize: ${e}`);
        }
    }
    async synthesize(speech) {
        const audioFilePath = node_path_1.default.join(constants_1.TMP_PATH, `${Date.now()}-${string_helper_1.StringHelper.random(4)}.mp3`);
        try {
            if (this.client) {
                const response = await this.client.synthesize({
                    voice: VOICES[this.lang].voice,
                    text: speech,
                    accept: 'audio/wav'
                });
                const result = response.result;
                const wStream = node_fs_1.default.createWriteStream(audioFilePath);
                result.pipe(wStream);
                await new Promise((resolve, reject) => {
                    wStream.on('finish', resolve);
                    wStream.on('error', reject);
                });
                const duration = await this.getAudioDuration(audioFilePath);
                core_1.TTS.em.emit('saved', duration);
                return {
                    audioFilePath,
                    duration
                };
            }
            log_helper_1.LogHelper.error(`${this.name} - Client is not defined yet`);
        }
        catch (e) {
            log_helper_1.LogHelper.error(`${this.name} - Failed to synthesize speech: ${e} `);
        }
        return null;
    }
}
exports.default = WatsonTTSSynthesizer;
