"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TTSSynthesizerBase = void 0;
const fluent_ffmpeg_1 = __importDefault(require("fluent-ffmpeg"));
const ffmpeg_1 = require("@ffmpeg-installer/ffmpeg");
const ffprobe_1 = require("@ffprobe-installer/ffprobe");
const log_helper_1 = require("../../helpers/log-helper");
class TTSSynthesizerBase {
    async getAudioDuration(audioFilePath) {
        fluent_ffmpeg_1.default.setFfmpegPath(ffmpeg_1.path);
        fluent_ffmpeg_1.default.setFfprobePath(ffprobe_1.path);
        // Use ffprobe to get the duration of the audio file and return the duration in milliseconds
        return new Promise((resolve, reject) => {
            fluent_ffmpeg_1.default.ffprobe(audioFilePath, (err, data) => {
                if (err) {
                    log_helper_1.LogHelper.error(`${this.name} - Failed to get audio duration: ${err}`);
                    return reject(0);
                }
                const { duration } = data.format;
                if (!duration) {
                    log_helper_1.LogHelper.error(`${this.name} - Audio duration is undefined`);
                    return reject(0);
                }
                return resolve(duration * 1000);
            });
        });
    }
}
exports.TTSSynthesizerBase = TTSSynthesizerBase;
