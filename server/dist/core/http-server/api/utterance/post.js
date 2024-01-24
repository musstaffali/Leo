"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postUtterance = void 0;
const typebox_1 = require("@sinclair/typebox");
const core_1 = require("../../..");
const postUtteranceSchema = {
    body: typebox_1.Type.Object({
        utterance: typebox_1.Type.String()
    })
};
const postUtterance = async (fastify, options) => {
    fastify.route({
        method: 'POST',
        url: `/api/${options.apiVersion}/utterance`,
        schema: postUtteranceSchema,
        handler: async (request, reply) => {
            const { utterance } = request.body;
            try {
                core_1.BRAIN.isMuted = true;
                const data = await core_1.NLU.process(utterance);
                reply.send({
                    ...data,
                    success: true
                });
            }
            catch (error) {
                const message = error instanceof Error ? error.message : error;
                reply.statusCode = 500;
                reply.send({
                    message,
                    success: false
                });
            }
        }
    });
};
exports.postUtterance = postUtterance;
