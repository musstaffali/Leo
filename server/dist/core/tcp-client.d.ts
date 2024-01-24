/// <reference types="node" />
/// <reference types="node" />
import Net from 'node:net';
import { EventEmitter } from 'node:events';
export default class TCPClient {
    private readonly host;
    private readonly port;
    private static instance;
    private reconnectCounter;
    private tcpSocket;
    private _isConnected;
    readonly ee: EventEmitter;
    get isConnected(): boolean;
    get status(): Net.SocketReadyState;
    constructor(host: string, port: number);
    connect(): void;
    emit(topic: string, data: unknown): void;
    private connectSocket;
}
