"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.otherMidd = void 0;
const log_helper_1 = require("../../../helpers/log-helper");
const otherMidd = async (request, reply) => {
    // Disable from the header, else it makes hacker's life easier to know more about our system
    reply.removeHeader('X-Powered-By');
    log_helper_1.LogHelper.title('Requesting');
    log_helper_1.LogHelper.info(`${request.method} ${request.url}`);
};
exports.otherMidd = otherMidd;
