"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.infoPlugin = void 0;
const get_1 = require("./get");
const infoPlugin = async (fastify, options) => {
    // Get information to init client
    await fastify.register(get_1.getInfo, options);
};
exports.infoPlugin = infoPlugin;
