/// <reference types="node" />
export interface APIOptions {
    apiVersion: string;
}
export default class HTTPServer {
    readonly host: string;
    readonly port: number;
    private static instance;
    private fastify;
    httpServer: import("http").Server<typeof import("http").IncomingMessage, typeof import("http").ServerResponse>;
    constructor(host: string, port: number);
    /**
     * Server entry point
     */
    init(): Promise<void>;
    /**
     * Bootstrap API
     */
    private bootstrap;
    /**
     * Launch server
     */
    private listen;
}
