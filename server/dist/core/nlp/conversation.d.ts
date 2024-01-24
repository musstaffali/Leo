import type { ShortLanguageCode } from '../../types';
import type { NEREntity, NLPAction, NLPDomain, NLPUtterance, NLUSlot, NLUSlots } from './types';
interface ConversationContext {
    name: string | null;
    domain: NLPDomain;
    intent: string;
    currentEntities: NEREntity[];
    entities: NEREntity[];
    slots: NLUSlots;
    isInActionLoop: boolean;
    nextAction: NLPAction | null;
    originalUtterance: NLPUtterance | null;
    activatedAt: number;
    skillConfigPath: string;
    actionName: NLPAction;
    lang: ShortLanguageCode;
}
type ConversationPreviousContext = Record<string, ConversationContext> | null;
export declare const DEFAULT_ACTIVE_CONTEXT: {
    name: null;
    domain: string;
    intent: string;
    currentEntities: never[];
    entities: never[];
    slots: {};
    isInActionLoop: boolean;
    nextAction: null;
    originalUtterance: null;
    activatedAt: number;
    skillConfigPath: string;
    actionName: string;
    lang: string;
};
export default class Conversation {
    id: string;
    private _previousContexts;
    private _activeContext;
    constructor(id?: string);
    get activeContext(): ConversationContext;
    /**
     * Activate context according to the triggered action
     */
    setActiveContext(nluContext: ConversationContext): Promise<void>;
    get previousContexts(): ConversationPreviousContext;
    /**
     * Check whether there is an active context
     */
    hasActiveContext(): boolean;
    /**
     * Set slots in active context
     */
    setSlots(lang: ShortLanguageCode, entities: NEREntity[], slots?: NLUSlots): void;
    /**
     * Get the not yet filled slot if there is any
     */
    getNotFilledSlot(): NLUSlot | null;
    /**
     * Check whether slots are all filled
     */
    areSlotsAllFilled(): boolean;
    /**
     * Clean up active context
     */
    cleanActiveContext(): void;
    /**
     * Push active context to the previous contexts stack
     */
    private pushToPreviousContextsStack;
}
export {};
