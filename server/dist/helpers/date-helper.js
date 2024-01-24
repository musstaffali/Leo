"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DateHelper = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const utc_1 = __importDefault(require("dayjs/plugin/utc"));
const timezone_1 = __importDefault(require("dayjs/plugin/timezone"));
const constants_1 = require("../constants");
const log_helper_1 = require("./log-helper");
dayjs_1.default.extend(utc_1.default);
dayjs_1.default.extend(timezone_1.default);
class DateHelper {
    /**
     * Get date time
     * @example getDateTime() // 2022-09-12T12:42:57+08:00
     */
    static getDateTime() {
        return (0, dayjs_1.default)().tz(this.getTimeZone()).format();
    }
    /**
     * Get time zone
     * @example getTimeZone() // Asia/Shanghai
     */
    static getTimeZone() {
        let { timeZone } = Intl.DateTimeFormat().resolvedOptions();
        if (constants_1.TIME_ZONE) {
            // Verify if the time zone is valid
            try {
                Intl.DateTimeFormat(undefined, { timeZone: constants_1.TIME_ZONE });
                timeZone = constants_1.TIME_ZONE;
            }
            catch (e) {
                log_helper_1.LogHelper.warning(`The time zone "${constants_1.TIME_ZONE}" is not valid. Falling back to "${timeZone}"`);
            }
        }
        return timeZone;
    }
}
exports.DateHelper = DateHelper;
