/// <reference types="node" />
import { STTParserBase } from '../stt-parser-base';
export default class GoogleCloudSTTParser extends STTParserBase {
    protected readonly name = "Google Cloud STT Parser";
    private readonly client;
    constructor();
    /**
     * Read audio buffer and return the transcript (decoded string)
     */
    parse(buffer: Buffer): Promise<string | null>;
}
