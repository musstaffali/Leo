"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalAnswersSchemaObject = exports.globalResolverSchemaObject = exports.globalEntitySchemaObject = void 0;
const typebox_1 = require("@sinclair/typebox");
exports.globalEntitySchemaObject = typebox_1.Type.Strict(typebox_1.Type.Object({
    options: typebox_1.Type.Record(typebox_1.Type.String(), typebox_1.Type.Object({
        synonyms: typebox_1.Type.Array(typebox_1.Type.String()),
        data: typebox_1.Type.Optional(typebox_1.Type.Record(typebox_1.Type.String(), typebox_1.Type.Array(typebox_1.Type.String())))
    }, { additionalProperties: false }))
}, {
    description: 'Global entities can hold data that can directly be reused in skills.'
}));
exports.globalResolverSchemaObject = typebox_1.Type.Strict(typebox_1.Type.Object({
    name: typebox_1.Type.String(),
    intents: typebox_1.Type.Record(typebox_1.Type.String(), typebox_1.Type.Object({
        utterance_samples: typebox_1.Type.Array(typebox_1.Type.String()),
        value: typebox_1.Type.Unknown()
    }, { additionalProperties: false }))
}));
exports.globalAnswersSchemaObject = typebox_1.Type.Strict(typebox_1.Type.Object({
    answers: typebox_1.Type.Record(typebox_1.Type.String(), typebox_1.Type.Union([
        typebox_1.Type.Record(typebox_1.Type.String(), typebox_1.Type.String()),
        typebox_1.Type.Array(typebox_1.Type.String())
    ]))
}));
