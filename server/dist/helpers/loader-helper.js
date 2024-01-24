"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoaderHelper = void 0;
const cli_spinner_1 = require("cli-spinner");
const log_helper_1 = require("./log-helper");
function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
class LoaderHelper {
    /**
     * Start the loader
     */
    static start() {
        this.interval = setInterval(() => {
            if (this.spinner.isSpinning()) {
                const randomSentenceIndex = randomNumber(0, LoaderHelper.SENTENCES.length - 1);
                const randomSentence = LoaderHelper.SENTENCES[randomSentenceIndex];
                log_helper_1.LogHelper.info(randomSentence ?? 'Loading...');
            }
        }, 60000);
        this.spinner.start();
    }
    /**
     * Stop the loader
     */
    static stop() {
        clearInterval(this.interval);
        this.spinner.stop();
    }
}
exports.LoaderHelper = LoaderHelper;
LoaderHelper.SENTENCES = [
    'This process takes time, please go for a coffee (or a fruit juice)',
    'This may take a while, grab a drink and come back later',
    'Go for a walk, this action takes time',
    "That may take some time, let's chill and relax",
    'Leon will be ready for you in a moment'
];
LoaderHelper.spinner = new cli_spinner_1.Spinner('\x1b[95m%s\x1b[0m\r').setSpinnerString(18);
