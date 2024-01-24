import type { ShortLanguageCode } from '../../../types';
import type { NEREntity, NLPUtterance, NLUResult, SpacyEntityType } from '../types';
type NERManager = undefined | any;
export declare const MICROSOFT_BUILT_IN_ENTITIES: string[];
export default class NER {
    private static instance;
    manager: NERManager;
    spacyData: Map<`${SpacyEntityType}-${string}`, Record<string, unknown>>;
    constructor();
    private static logExtraction;
    /**
     * Grab entities and match them with the utterance
     */
    extractEntities(lang: ShortLanguageCode, skillConfigPath: string, nluResult: NLUResult): Promise<NEREntity[]>;
    /**
     * Merge spaCy entities with the NER instance
     */
    mergeSpacyEntities(utterance: NLPUtterance): Promise<void>;
    /**
     * Get spaCy entities from the TCP server
     */
    private getSpacyEntities;
    /**
     * Inject trim type entities
     */
    private injectTrimEntity;
    /**
     * Inject regex type entities
     */
    private injectRegexEntity;
    /**
     * Inject enum type entities
     */
    private injectEnumEntity;
}
export {};
