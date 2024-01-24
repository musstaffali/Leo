"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.watsonVoiceConfiguration = exports.googleCloudVoiceConfiguration = exports.amazonVoiceConfiguration = void 0;
const typebox_1 = require("@sinclair/typebox");
exports.amazonVoiceConfiguration = typebox_1.Type.Strict(typebox_1.Type.Object({
    credentials: typebox_1.Type.Object({
        accessKeyId: typebox_1.Type.String(),
        secretAccessKey: typebox_1.Type.String()
    }),
    region: typebox_1.Type.String()
}));
exports.googleCloudVoiceConfiguration = typebox_1.Type.Strict(typebox_1.Type.Object({
    type: typebox_1.Type.Literal('service_account'),
    project_id: typebox_1.Type.String(),
    private_key_id: typebox_1.Type.String(),
    private_key: typebox_1.Type.String(),
    client_email: typebox_1.Type.String({ format: 'email' }),
    client_id: typebox_1.Type.String(),
    auth_uri: typebox_1.Type.String({ format: 'uri' }),
    token_uri: typebox_1.Type.String({ format: 'uri' }),
    auth_provider_x509_cert_url: typebox_1.Type.String({ format: 'uri' }),
    client_x509_cert_url: typebox_1.Type.String({ format: 'uri' })
}));
exports.watsonVoiceConfiguration = typebox_1.Type.Strict(typebox_1.Type.Object({
    apikey: typebox_1.Type.String(),
    url: typebox_1.Type.String({ format: 'uri' })
}));
