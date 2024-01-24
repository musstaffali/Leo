"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInfo = void 0;
const constants_1 = require("../../../../constants");
const log_helper_1 = require("../../../../helpers/log-helper");
const getInfo = async (fastify, options) => {
    fastify.route({
        method: 'GET',
        url: `/api/${options.apiVersion}/info`,
        handler: async (_request, reply) => {
            log_helper_1.LogHelper.title('GET /info');
            const message = 'Information pulled.';
            log_helper_1.LogHelper.success(message);
            reply.send({
                success: true,
                status: 200,
                code: 'info_pulled',
                message,
                after_speech: constants_1.HAS_AFTER_SPEECH,
                telemetry: constants_1.IS_TELEMETRY_ENABLED,
                stt: {
                    enabled: constants_1.HAS_STT,
                    provider: constants_1.STT_PROVIDER
                },
                tts: {
                    enabled: constants_1.HAS_TTS,
                    provider: constants_1.TTS_PROVIDER
                },
                version: constants_1.LEON_VERSION
            });
        }
    });
};
exports.getInfo = getInfo;
