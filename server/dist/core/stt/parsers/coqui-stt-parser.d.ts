/// <reference types="node" />
import { STTParserBase } from '../stt-parser-base';
export default class CoquiSTTParser extends STTParserBase {
    protected readonly name = "Coqui STT Parser";
    private readonly model;
    private readonly desiredSampleRate;
    constructor();
    /**
     * Read audio buffer and return the transcript (decoded string)
     */
    parse(buffer: Buffer): Promise<string | null>;
}
