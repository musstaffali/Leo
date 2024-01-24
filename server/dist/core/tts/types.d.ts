import type AmazonPollySynthesizer from './synthesizers/amazon-polly-synthesizer';
import type FliteSynthesizer from './synthesizers/flite-synthesizer';
import type GoogleCloudTTSSynthesizer from './synthesizers/google-cloud-tts-synthesizer';
import type WatsonTTSSynthesizer from './synthesizers/watson-tts-synthesizer';
export declare enum TTSProviders {
    AmazonPolly = "amazon-polly",
    GoogleCloudTTS = "google-cloud-tts",
    WatsonTTS = "watson-tts",
    Flite = "flite"
}
export declare enum TTSSynthesizers {
    AmazonPolly = "amazon-polly-synthesizer",
    GoogleCloudTTS = "google-cloud-tts-synthesizer",
    WatsonTTS = "watson-tts-synthesizer",
    Flite = "flite-synthesizer"
}
export interface SynthesizeResult {
    audioFilePath: string;
    duration: number;
}
export type TTSSynthesizer = AmazonPollySynthesizer | FliteSynthesizer | GoogleCloudTTSSynthesizer | WatsonTTSSynthesizer | undefined;
