"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.keyMidd = void 0;
const constants_1 = require("../../../constants");
const keyMidd = async (request, reply) => {
    const apiKey = request.headers['x-api-key'];
    if (!apiKey || apiKey !== constants_1.HTTP_API_KEY) {
        reply.statusCode = 401;
        reply.send({
            message: 'Unauthorized, please check the HTTP API key is correct',
            success: false
        });
    }
};
exports.keyMidd = keyMidd;
