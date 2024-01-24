"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_path_1 = __importDefault(require("node:path"));
const node_fs_1 = __importDefault(require("node:fs"));
const ffmpeg_1 = require("@ffmpeg-installer/ffmpeg");
const fluent_ffmpeg_1 = __importDefault(require("fluent-ffmpeg"));
const constants_1 = require("../../constants");
const core_1 = require("./..");
const log_helper_1 = require("../../helpers/log-helper");
class ASR {
    constructor() {
        this.audioPaths = {
            webm: node_path_1.default.join(constants_1.TMP_PATH, 'speech.webm'),
            wav: node_path_1.default.join(constants_1.TMP_PATH, 'speech.wav')
        };
        if (!ASR.instance) {
            log_helper_1.LogHelper.title('ASR');
            log_helper_1.LogHelper.success('New instance');
            ASR.instance = this;
        }
    }
    /**
     * Encode audio blob to WAVE file
     * and forward the WAVE file to the STT parser
     */
    encode(blob) {
        return new Promise((resolve, reject) => {
            log_helper_1.LogHelper.title('ASR');
            node_fs_1.default.writeFile(this.audioPaths.webm, Buffer.from(blob), 'binary', async (err) => {
                if (err) {
                    reject(new Error(`${err}`));
                    return;
                }
                fluent_ffmpeg_1.default.setFfmpegPath(ffmpeg_1.path);
                /**
                 * Encode WebM file to WAVE file
                 * ffmpeg -i speech.webm -acodec pcm_s16le -ar 16000 -ac 1 speech.wav
                 */
                (0, fluent_ffmpeg_1.default)()
                    .addInput(this.audioPaths.webm)
                    .on('start', () => {
                    log_helper_1.LogHelper.info('Encoding WebM file to WAVE file...');
                })
                    .on('end', () => {
                    log_helper_1.LogHelper.success('Encoding done');
                    if (!core_1.STT.isParserReady) {
                        reject(new Error('The speech recognition is not ready yet'));
                    }
                    else {
                        core_1.STT.transcribe(this.audioPaths.wav);
                        resolve();
                    }
                })
                    .on('error', (err) => {
                    reject(new Error(`Encoding error ${err}`));
                })
                    .outputOptions(['-acodec pcm_s16le', '-ar 16000', '-ac 1'])
                    .output(this.audioPaths.wav)
                    .run();
            });
        });
    }
}
exports.default = ASR;
