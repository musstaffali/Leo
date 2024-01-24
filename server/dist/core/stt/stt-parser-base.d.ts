/// <reference types="node" />
export declare abstract class STTParserBase {
    protected abstract name: string;
    protected abstract parse(buffer: Buffer): Promise<string | null>;
}
