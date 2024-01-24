"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogHelper = void 0;
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
const date_helper_1 = require("./date-helper");
class LogHelper {
    /**
     * This one looks obvious :)
     */
    static success(value) {
        console.log('\x1b[32m✅ %s\x1b[0m', value);
    }
    /**
     * This one looks obvious :)
     */
    static info(value) {
        console.info('\x1b[36mℹ️  %s\x1b[0m', value);
    }
    /**
     * This one looks obvious :)
     */
    static warning(value) {
        console.warn('\x1b[33m⚠️  %s\x1b[0m', value);
    }
    /**
     * This one looks obvious :)
     */
    static debug(value) {
        console.info('\u001b[35m🐞 [DEBUG] %s\x1b[0m', value);
    }
    /**
     * Log message on stderr and write in error log file
     */
    static error(value) {
        const data = `${date_helper_1.DateHelper.getDateTime()} - ${value}`;
        if (node_fs_1.default.existsSync(this.ERRORS_FILE_PATH)) {
            node_fs_1.default.appendFileSync(this.ERRORS_FILE_PATH, `\n${data}`);
        }
        else {
            node_fs_1.default.writeFileSync(this.ERRORS_FILE_PATH, data, { flag: 'wx' });
        }
        console.error('\x1b[31m🚨 %s\x1b[0m', value);
    }
    /**
     * This one looks obvious :)
     */
    static title(value) {
        console.log('\n\n\x1b[7m.: %s :.\x1b[0m', value.toUpperCase());
    }
    /**
     * This one looks obvious :)
     */
    static default(value) {
        console.log(value);
    }
    /**
     * Start a log timer
     */
    static time(value) {
        console.time(`🕑 \x1b[36m${value}\x1b[0m`);
    }
    /**
     * Stop log timer
     */
    static timeEnd(value) {
        console.timeEnd(`🕑 \x1b[36m${value}\x1b[0m`);
    }
    /**
     * Parse error logs and return an array of log errors
     * @example parseErrorLogs() // 'Failed to connect to the TCP server: Error: read ECONNRESET'
     */
    static async parseErrorLogs() {
        if (!node_fs_1.default.existsSync(LogHelper.ERRORS_FILE_PATH)) {
            const fileHandle = await node_fs_1.default.promises.open(LogHelper.ERRORS_FILE_PATH, 'w');
            await fileHandle.close();
        }
        const errorFileContent = await node_fs_1.default.promises.readFile(LogHelper.ERRORS_FILE_PATH, 'utf8');
        const errorLogs = errorFileContent
            .trim()
            .split(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[+-]\d{2}:\d{2} - /);
        // Remove the first empty string if there's one
        if (errorLogs[0] === '') {
            errorLogs.shift();
        }
        return errorLogs;
    }
}
exports.LogHelper = LogHelper;
LogHelper.ERRORS_FILE_PATH = node_path_1.default.join(__dirname, '..', '..', '..', 'logs', 'errors.log');
