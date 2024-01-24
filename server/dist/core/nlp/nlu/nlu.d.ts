import type { NLUProcessResult, NLPUtterance, NLUResult } from '../types';
import Conversation from '../conversation';
export declare const DEFAULT_NLU_RESULT: {
    utterance: string;
    currentEntities: never[];
    entities: never[];
    currentResolvers: never[];
    resolvers: never[];
    slots: {};
    skillConfigPath: string;
    answers: never[];
    sentiment: {};
    classification: {
        domain: string;
        skill: string;
        action: string;
        confidence: number;
    };
};
export default class NLU {
    private static instance;
    nluResult: NLUResult;
    conversation: Conversation;
    constructor();
    /**
     * Set new language; recreate a new TCP server with new language; and reprocess understanding
     */
    private switchLanguage;
    /**
     * Classify the utterance,
     * pick-up the right classification
     * and extract entities
     */
    process(utterance: NLPUtterance): Promise<NLUProcessResult | null>;
    /**
     * Pickup and compare the right fallback
     * according to the wished skill action
     */
    private fallback;
}
