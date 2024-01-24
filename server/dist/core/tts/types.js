"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TTSSynthesizers = exports.TTSProviders = void 0;
var TTSProviders;
(function (TTSProviders) {
    TTSProviders["AmazonPolly"] = "amazon-polly";
    TTSProviders["GoogleCloudTTS"] = "google-cloud-tts";
    TTSProviders["WatsonTTS"] = "watson-tts";
    TTSProviders["Flite"] = "flite";
})(TTSProviders || (exports.TTSProviders = TTSProviders = {}));
var TTSSynthesizers;
(function (TTSSynthesizers) {
    TTSSynthesizers["AmazonPolly"] = "amazon-polly-synthesizer";
    TTSSynthesizers["GoogleCloudTTS"] = "google-cloud-tts-synthesizer";
    TTSSynthesizers["WatsonTTS"] = "watson-tts-synthesizer";
    TTSSynthesizers["Flite"] = "flite-synthesizer";
})(TTSSynthesizers || (exports.TTSSynthesizers = TTSSynthesizers = {}));
