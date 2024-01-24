"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ajv = void 0;
const ajv_formats_1 = __importDefault(require("ajv-formats"));
const ajv_1 = __importDefault(require("ajv"));
exports.ajv = (0, ajv_formats_1.default)(new ajv_1.default({
    allErrors: true,
    verbose: true
}), [
    'date-time',
    'time',
    'date',
    'email',
    'hostname',
    'ipv4',
    'ipv6',
    'uri',
    'uri-reference',
    'uuid',
    'uri-template',
    'json-pointer',
    'relative-json-pointer',
    'regex'
]);
