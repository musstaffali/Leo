"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CPUArchitectures = exports.OSTypes = void 0;
/**
 * System
 */
var OSTypes;
(function (OSTypes) {
    OSTypes["Windows"] = "windows";
    OSTypes["MacOS"] = "macos";
    OSTypes["Linux"] = "linux";
    OSTypes["Unknown"] = "unknown";
})(OSTypes || (exports.OSTypes = OSTypes = {}));
var CPUArchitectures;
(function (CPUArchitectures) {
    CPUArchitectures["X64"] = "x64";
    CPUArchitectures["ARM64"] = "arm64";
})(CPUArchitectures || (exports.CPUArchitectures = CPUArchitectures = {}));
