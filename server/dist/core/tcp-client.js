"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_net_1 = __importDefault(require("node:net"));
const node_events_1 = require("node:events");
const constants_1 = require("../constants");
const types_1 = require("../types");
const log_helper_1 = require("../helpers/log-helper");
const system_helper_1 = require("../helpers/system-helper");
// Time interval between each try (in ms)
const INTERVAL = constants_1.IS_PRODUCTION_ENV ? 3000 : 500;
// Number of retries to connect to the TCP server
const RETRIES_NB = constants_1.IS_PRODUCTION_ENV ? 8 : 30;
class TCPClient {
    get isConnected() {
        return this._isConnected;
    }
    get status() {
        return this.tcpSocket.readyState;
    }
    constructor(host, port) {
        this.host = host;
        this.port = port;
        this.reconnectCounter = 0;
        this.tcpSocket = new node_net_1.default.Socket();
        this._isConnected = false;
        this.ee = new node_events_1.EventEmitter();
        if (!TCPClient.instance) {
            log_helper_1.LogHelper.title('TCP Client');
            log_helper_1.LogHelper.success('New instance');
            TCPClient.instance = this;
        }
        this.host = host;
        this.port = port;
        this.tcpSocket.on('connect', () => {
            log_helper_1.LogHelper.title('TCP Client');
            log_helper_1.LogHelper.success(`Connected to the TCP server tcp://${this.host}:${this.port}`);
            this.reconnectCounter = 0;
            this._isConnected = true;
            this.ee.emit('connected', null);
        });
        this.tcpSocket.on('data', (chunk) => {
            log_helper_1.LogHelper.title('TCP Client');
            log_helper_1.LogHelper.info(`Received data: ${String(chunk)}`);
            const data = JSON.parse(String(chunk));
            this.ee.emit(data.topic, data.data);
        });
        this.tcpSocket.on('error', (err) => {
            log_helper_1.LogHelper.title('TCP Client');
            if (err.code === 'ECONNREFUSED') {
                this.reconnectCounter += 1;
                const { type: osType } = system_helper_1.SystemHelper.getInformation();
                if (this.reconnectCounter >= RETRIES_NB) {
                    log_helper_1.LogHelper.error('Failed to connect to the TCP server');
                    this.tcpSocket.end();
                }
                if (this.reconnectCounter >= 1) {
                    log_helper_1.LogHelper.info('Trying to connect to the TCP server...');
                    if (this.reconnectCounter >= 5) {
                        if (osType === types_1.OSTypes.MacOS) {
                            log_helper_1.LogHelper.warning('The cold start of the TCP server can take a few more seconds on macOS. It should be a one-time thing, no worries');
                        }
                    }
                    setTimeout(() => {
                        this.connectSocket();
                    }, INTERVAL * this.reconnectCounter);
                }
            }
            else {
                log_helper_1.LogHelper.error(`Failed to connect to the TCP server: ${err}`);
            }
            this._isConnected = false;
        });
        this.tcpSocket.on('end', () => {
            log_helper_1.LogHelper.title('TCP Client');
            log_helper_1.LogHelper.success('Disconnected from the TCP server');
            this._isConnected = false;
        });
    }
    connect() {
        setTimeout(() => {
            this.connectSocket();
        }, INTERVAL);
    }
    emit(topic, data) {
        const obj = {
            topic,
            data
        };
        this.tcpSocket.write(JSON.stringify(obj));
    }
    connectSocket() {
        this.tcpSocket.connect({
            host: this.host,
            port: this.port
        });
    }
}
exports.default = TCPClient;
