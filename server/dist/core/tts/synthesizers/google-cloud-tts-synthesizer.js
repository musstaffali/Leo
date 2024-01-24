"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_path_1 = __importDefault(require("node:path"));
const node_fs_1 = __importDefault(require("node:fs"));
const text_to_speech_1 = __importDefault(require("@google-cloud/text-to-speech"));
const protos_1 = require("@google-cloud/text-to-speech/build/protos/protos");
const constants_1 = require("../../../constants");
const core_1 = require("../..");
const tts_synthesizer_base_1 = require("../tts-synthesizer-base");
const log_helper_1 = require("../../../helpers/log-helper");
const string_helper_1 = require("../../../helpers/string-helper");
var SsmlVoiceGender = protos_1.google.cloud.texttospeech.v1.SsmlVoiceGender;
const VOICES = {
    'en-US': {
        languageCode: 'en-US',
        name: 'en-US-Wavenet-A',
        // name: 'en-GB-Standard-B', // Standard
        ssmlGender: SsmlVoiceGender.MALE
    },
    'fr-FR': {
        languageCode: 'fr-FR',
        name: 'fr-FR-Wavenet-B',
        ssmlGender: SsmlVoiceGender.MALE
    }
};
class GoogleCloudTTSSynthesizer extends tts_synthesizer_base_1.TTSSynthesizerBase {
    constructor(lang) {
        super();
        this.name = 'Google Cloud TTS Synthesizer';
        this.lang = constants_1.LANG;
        this.client = undefined;
        log_helper_1.LogHelper.title(this.name);
        log_helper_1.LogHelper.success('New instance');
        process.env['GOOGLE_APPLICATION_CREDENTIALS'] = node_path_1.default.join(constants_1.VOICE_CONFIG_PATH, 'google-cloud.json');
        try {
            this.lang = lang;
            this.client = new text_to_speech_1.default.TextToSpeechClient();
            log_helper_1.LogHelper.success('Synthesizer initialized');
        }
        catch (e) {
            log_helper_1.LogHelper.error(`${this.name}: ${e}`);
        }
    }
    async synthesize(speech) {
        const audioFilePath = node_path_1.default.join(constants_1.TMP_PATH, `${Date.now()}-${string_helper_1.StringHelper.random(4)}.mp3`);
        try {
            if (this.client) {
                const [response] = await this.client.synthesizeSpeech({
                    input: {
                        text: speech
                    },
                    voice: VOICES[this.lang],
                    audioConfig: {
                        audioEncoding: 'MP3'
                    }
                });
                await node_fs_1.default.promises.writeFile(audioFilePath, response.audioContent, 'binary');
                const duration = await this.getAudioDuration(audioFilePath);
                core_1.TTS.em.emit('saved', duration);
                return {
                    audioFilePath,
                    duration
                };
            }
            log_helper_1.LogHelper.error(`${this.name} - client is not defined yet`);
        }
        catch (e) {
            log_helper_1.LogHelper.error(`${this.name} - Failed to synthesize speech: ${e} `);
        }
        return null;
    }
}
exports.default = GoogleCloudTTSSynthesizer;
