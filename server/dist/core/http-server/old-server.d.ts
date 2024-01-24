/// <reference types="node" />
export default server;
declare namespace server {
    let fastify: import("fastify").FastifyInstance<import("http").Server<typeof import("http").IncomingMessage, typeof import("http").ServerResponse>, import("http").IncomingMessage, import("http").ServerResponse<import("http").IncomingMessage>, import("fastify").FastifyBaseLogger, import("fastify").FastifyTypeProviderDefault> & PromiseLike<import("fastify").FastifyInstance<import("http").Server<typeof import("http").IncomingMessage, typeof import("http").ServerResponse>, import("http").IncomingMessage, import("http").ServerResponse<import("http").IncomingMessage>, import("fastify").FastifyBaseLogger, import("fastify").FastifyTypeProviderDefault>>;
    let httpServer: {};
    /**
     * Generate skills routes
     */
    function generateSkillsRoutes(instance: any): void;
    /**
     * Bootstrap socket
     */
    function handleOnConnection(socket: any): void;
    /**
     * Launch server
     */
    function listen(port: any): Promise<void>;
    /**
     * Bootstrap API
     */
    function bootstrap(): Promise<void>;
    /**
     * Server entry point
     */
    function init(): Promise<void>;
}
