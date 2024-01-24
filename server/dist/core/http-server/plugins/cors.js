"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsMidd = void 0;
const constants_1 = require("../../../constants");
const corsMidd = async (_request, reply) => {
    // Allow only a specific client to request to the API (depending on the env)
    if (!constants_1.IS_PRODUCTION_ENV) {
        reply.header('Access-Control-Allow-Origin', `${constants_1.HOST}:3000`);
    }
    // Allow several headers for our requests
    reply.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    reply.header('Access-Control-Allow-Credentials', true);
};
exports.corsMidd = corsMidd;
