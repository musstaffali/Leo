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
const node_path_1 = __importDefault(require("node:path"));
const node_events_1 = __importDefault(require("node:events"));
const node_fs_1 = __importDefault(require("node:fs"));
const core_1 = require("./..");
const constants_1 = require("../../constants");
const types_1 = require("./types");
const log_helper_1 = require("../../helpers/log-helper");
const lang_helper_1 = require("../../helpers/lang-helper");
const PROVIDERS_MAP = {
    [types_1.TTSProviders.GoogleCloudTTS]: types_1.TTSSynthesizers.GoogleCloudTTS,
    [types_1.TTSProviders.WatsonTTS]: types_1.TTSSynthesizers.WatsonTTS,
    [types_1.TTSProviders.AmazonPolly]: types_1.TTSSynthesizers.AmazonPolly,
    [types_1.TTSProviders.Flite]: types_1.TTSSynthesizers.Flite
};
class TTS {
    constructor() {
        this.synthesizer = undefined;
        this.speeches = [];
        this.lang = 'en';
        this.em = new node_events_1.default.EventEmitter();
        if (!TTS.instance) {
            log_helper_1.LogHelper.title('TTS');
            log_helper_1.LogHelper.success('New instance');
            TTS.instance = this;
        }
    }
    /**
     * Initialize the TTS provider
     */
    async init(newLang) {
        log_helper_1.LogHelper.title('TTS');
        log_helper_1.LogHelper.info('Initializing TTS...');
        this.lang = newLang || this.lang;
        if (!Object.values(types_1.TTSProviders).includes(constants_1.TTS_PROVIDER)) {
            log_helper_1.LogHelper.error(`The TTS provider "${constants_1.TTS_PROVIDER}" does not exist or is not yet supported`);
            return false;
        }
        if (constants_1.TTS_PROVIDER === types_1.TTSProviders.GoogleCloudTTS &&
            typeof process.env['GOOGLE_APPLICATION_CREDENTIALS'] === 'undefined') {
            process.env['GOOGLE_APPLICATION_CREDENTIALS'] = node_path_1.default.join(constants_1.VOICE_CONFIG_PATH, 'google-cloud.json');
        }
        else if (typeof process.env['GOOGLE_APPLICATION_CREDENTIALS'] !== 'undefined' &&
            process.env['GOOGLE_APPLICATION_CREDENTIALS'].indexOf('google-cloud.json') === -1) {
            log_helper_1.LogHelper.warning(`The "GOOGLE_APPLICATION_CREDENTIALS" env variable is already settled with the following value: "${process.env['GOOGLE_APPLICATION_CREDENTIALS']}"`);
        }
        // Dynamically attribute the synthesizer
        const { default: synthesizer } = await Promise.resolve(`${node_path_1.default.join(__dirname, 'synthesizers', PROVIDERS_MAP[constants_1.TTS_PROVIDER])}`).then(s => __importStar(require(s)));
        this.synthesizer = new synthesizer(lang_helper_1.LangHelper.getLongCode(this.lang));
        this.onSaved();
        log_helper_1.LogHelper.title('TTS');
        log_helper_1.LogHelper.success('TTS initialized');
        return true;
    }
    /**
     * Forward buffer audio file and duration to the client
     * and delete audio file once it has been forwarded
     */
    async forward(speech) {
        if (this.synthesizer) {
            const result = await this.synthesizer.synthesize(speech.text);
            if (!result) {
                log_helper_1.LogHelper.error('The TTS synthesizer failed to synthesize the speech as the result is null');
            }
            else {
                const { audioFilePath, duration } = result;
                const bitmap = await node_fs_1.default.promises.readFile(audioFilePath);
                core_1.SOCKET_SERVER.socket?.emit('audio-forwarded', {
                    buffer: Buffer.from(bitmap),
                    is_final_answer: speech.isFinalAnswer,
                    duration
                }, (confirmation) => {
                    if (confirmation === 'audio-received') {
                        node_fs_1.default.unlinkSync(audioFilePath);
                    }
                });
            }
        }
        else {
            log_helper_1.LogHelper.error('The TTS synthesizer is not initialized yet');
        }
    }
    /**
     * When the synthesizer saved a new audio file
     * then shift the queue according to the audio file duration
     */
    onSaved() {
        this.em.on('saved', (duration) => {
            setTimeout(async () => {
                this.speeches.shift();
                if (this.speeches[0]) {
                    await this.forward(this.speeches[0]);
                }
            }, duration);
        });
    }
    /**
     * Add speeches to the queue
     */
    async add(text, isFinalAnswer) {
        /**
         * Flite fix. When the string is only one word,
         * Flite cannot save to a file. So we add a space at the end of the string
         */
        if (constants_1.TTS_PROVIDER === types_1.TTSProviders.Flite && text.indexOf(' ') === -1) {
            text += ' ';
        }
        const speech = { text, isFinalAnswer };
        if (this.speeches.length > 0) {
            this.speeches.push(speech);
        }
        else {
            this.speeches.push(speech);
            await this.forward(speech);
        }
        return this.speeches;
    }
}
exports.default = TTS;
