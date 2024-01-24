"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_path_1 = __importDefault(require("node:path"));
const node_fs_1 = __importDefault(require("node:fs"));
const node_child_process_1 = require("node:child_process");
const constants_1 = require("../../../constants");
const core_1 = require("../..");
const tts_synthesizer_base_1 = require("../tts-synthesizer-base");
const log_helper_1 = require("../../../helpers/log-helper");
const string_helper_1 = require("../../../helpers/string-helper");
const FLITE_CONFIG = {
    int_f0_target_mean: 115.0,
    f0_shift: 1.0,
    duration_stretch: 1.0,
    int_f0_target_stddev: 15.0 // Pitch variability (lower = more flat)
};
class FliteSynthesizer extends tts_synthesizer_base_1.TTSSynthesizerBase {
    constructor(lang) {
        super();
        this.name = 'Flite TTS Synthesizer';
        this.lang = constants_1.LANG;
        this.binPath = node_path_1.default.join(constants_1.BIN_PATH, 'flite', 'flite');
        log_helper_1.LogHelper.title(this.name);
        log_helper_1.LogHelper.success('New instance');
        this.lang = lang;
        if (this.lang !== 'en-US') {
            log_helper_1.LogHelper.warning('The Flite synthesizer only accepts the "en-US" language at the moment');
        }
        if (!node_fs_1.default.existsSync(this.binPath)) {
            log_helper_1.LogHelper.error(`Cannot find ${this.binPath} You can set up the offline TTS by running: "npm run setup:offline-tts"`);
        }
        else {
            log_helper_1.LogHelper.success('Synthesizer initialized');
        }
    }
    async synthesize(speech) {
        const audioFilePath = node_path_1.default.join(constants_1.TMP_PATH, `${Date.now()}-${string_helper_1.StringHelper.random(4)}.wav`);
        const process = (0, node_child_process_1.spawn)(this.binPath, [
            speech,
            '--setf',
            `int_f0_target_mean=${FLITE_CONFIG.int_f0_target_mean}`,
            '--setf',
            `f0_shift=${FLITE_CONFIG.f0_shift}`,
            '--setf',
            `duration_stretch=${FLITE_CONFIG.duration_stretch}`,
            '--setf',
            `int_f0_target_stddev=${FLITE_CONFIG.int_f0_target_stddev}`,
            '-o',
            audioFilePath
        ]);
        await new Promise((resolve, reject) => {
            process.stdout.on('end', resolve);
            process.stderr.on('data', reject);
        });
        const duration = await this.getAudioDuration(audioFilePath);
        core_1.TTS.em.emit('saved', duration);
        return {
            audioFilePath,
            duration
        };
    }
}
exports.default = FliteSynthesizer;
