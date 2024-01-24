/// <reference types="node" />
export default class ASR {
    private static instance;
    audioPaths: {
        webm: string;
        wav: string;
    };
    constructor();
    /**
     * Encode audio blob to WAVE file
     * and forward the WAVE file to the STT parser
     */
    encode(blob: Buffer): Promise<void>;
}
