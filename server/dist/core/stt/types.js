"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.STTParserNames = exports.STTProviders = void 0;
var STTProviders;
(function (STTProviders) {
    STTProviders["GoogleCloudSTT"] = "google-cloud-stt";
    STTProviders["WatsonSTT"] = "watson-stt";
    STTProviders["CoquiSTT"] = "coqui-stt";
})(STTProviders || (exports.STTProviders = STTProviders = {}));
var STTParserNames;
(function (STTParserNames) {
    STTParserNames["GoogleCloudSTT"] = "google-cloud-stt-parser";
    STTParserNames["WatsonSTT"] = "watson-stt-parser";
    STTParserNames["CoquiSTT"] = "coqui-stt-parser";
})(STTParserNames || (exports.STTParserNames = STTParserNames = {}));
