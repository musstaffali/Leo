/// <reference types="node" />
import events from 'node:events';
import type { ShortLanguageCode } from '../../types';
interface Speech {
    text: string;
    isFinalAnswer: boolean;
}
export default class TTS {
    private static instance;
    private synthesizer;
    private speeches;
    lang: ShortLanguageCode;
    em: events;
    constructor();
    /**
     * Initialize the TTS provider
     */
    init(newLang: ShortLanguageCode): Promise<boolean>;
    /**
     * Forward buffer audio file and duration to the client
     * and delete audio file once it has been forwarded
     */
    private forward;
    /**
     * When the synthesizer saved a new audio file
     * then shift the queue according to the audio file duration
     */
    private onSaved;
    /**
     * Add speeches to the queue
     */
    add(text: Speech['text'], isFinalAnswer: Speech['isFinalAnswer']): Promise<Speech[]>;
}
export {};
