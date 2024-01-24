import type CoquiSTTParser from './parsers/coqui-stt-parser';
import type GoogleCloudSTTParser from './parsers/google-cloud-stt-parser';
import type WatsonSTTParser from './parsers/watson-stt-parser';
export declare enum STTProviders {
    GoogleCloudSTT = "google-cloud-stt",
    WatsonSTT = "watson-stt",
    CoquiSTT = "coqui-stt"
}
export declare enum STTParserNames {
    GoogleCloudSTT = "google-cloud-stt-parser",
    WatsonSTT = "watson-stt-parser",
    CoquiSTT = "coqui-stt-parser"
}
export type STTParser = GoogleCloudSTTParser | WatsonSTTParser | CoquiSTTParser | undefined;
