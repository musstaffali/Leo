"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGlobalResolversPath = exports.getGlobalEntitiesPath = exports.isFileEmpty = void 0;
const node_path_1 = __importDefault(require("node:path"));
const node_fs_1 = __importDefault(require("node:fs"));
const constants_1 = require("./constants");
/**
 * Files
 */
async function isFileEmpty(path) {
    return (await node_fs_1.default.promises.readFile(path)).length === 0;
}
exports.isFileEmpty = isFileEmpty;
/**
 * Paths
 */
function getGlobalEntitiesPath(lang) {
    return node_path_1.default.join(constants_1.GLOBAL_DATA_PATH, lang, 'global-entities');
}
exports.getGlobalEntitiesPath = getGlobalEntitiesPath;
function getGlobalResolversPath(lang) {
    return node_path_1.default.join(constants_1.GLOBAL_DATA_PATH, lang, 'global-resolvers');
}
exports.getGlobalResolversPath = getGlobalResolversPath;
