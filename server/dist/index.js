"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_child_process_1 = require("node:child_process");
const node_fs_1 = __importDefault(require("node:fs"));
const constants_1 = require("./constants");
const core_1 = require("./core");
const telemetry_1 = require("./telemetry");
const lang_helper_1 = require("./helpers/lang-helper");
const log_helper_1 = require("./helpers/log-helper");
(async () => {
    process.title = 'leon';
    // Start the TCP server
    global.tcpServerProcess = (0, node_child_process_1.spawn)(`${constants_1.TCP_SERVER_BIN_PATH} ${lang_helper_1.LangHelper.getShortCode(constants_1.LANG)}`, {
        shell: true,
        detached: constants_1.IS_DEVELOPMENT_ENV
    });
    // Connect the TCP client to the TCP server
    core_1.TCP_CLIENT.connect();
    // Start the HTTP server
    await core_1.HTTP_SERVER.init();
    // TODO
    // Register HTTP API endpoints
    // await HTTP_API.register()
    // Start the socket server
    core_1.SOCKET_SERVER.init();
    // Telemetry events
    if (constants_1.IS_TELEMETRY_ENABLED) {
        telemetry_1.Telemetry.start();
        // Watch for errors in the error log file and report them to the telemetry service
        node_fs_1.default.watchFile(log_helper_1.LogHelper.ERRORS_FILE_PATH, async () => {
            const logErrors = await log_helper_1.LogHelper.parseErrorLogs();
            const lastError = logErrors[logErrors.length - 1] || '';
            telemetry_1.Telemetry.error(lastError);
        });
        setInterval(() => {
            telemetry_1.Telemetry.heartbeat();
        }, 1000 * 3600 * 6);
        [
            'exit',
            'SIGINT',
            'SIGUSR1',
            'SIGUSR2',
            'uncaughtException',
            'SIGTERM'
        ].forEach((eventType) => {
            process.on(eventType, () => {
                telemetry_1.Telemetry.stop();
                global.tcpServerProcess.kill();
                setTimeout(() => {
                    process.exit(0);
                }, 1000);
            });
        });
    }
})();
