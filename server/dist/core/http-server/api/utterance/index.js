"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.utterancePlugin = void 0;
const post_1 = require("./post");
const utterancePlugin = async (fastify, options) => {
    await fastify.register(post_1.postUtterance, options);
};
exports.utterancePlugin = utterancePlugin;
