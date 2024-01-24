export default class STT {
    private static instance;
    private parser;
    constructor();
    get isParserReady(): boolean;
    /**
     * Initialize the STT provider
     */
    init(): Promise<boolean>;
    /**
     * Read the speech file and transcribe
     */
    transcribe(audioFilePath: string): Promise<boolean>;
    /**
     * Forward string output to the client
     * and delete audio files once it has been forwarded
     */
    private forward;
    /**
     * Delete audio files
     */
    private deleteAudios;
}
