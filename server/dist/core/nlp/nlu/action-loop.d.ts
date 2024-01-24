import type { NLPUtterance } from '../types';
import type { BrainProcessResult } from '../../brain/types';
export declare class ActionLoop {
    /**
     * Handle action loop logic before NLU processing
     */
    static handle(utterance: NLPUtterance): Promise<Partial<BrainProcessResult> | null>;
}
