import type { NLPUtterance } from '../types';
import type { BrainProcessResult } from '../../brain/types';
export declare class SlotFilling {
    /**
     * Handle slot filling
     */
    static handle(utterance: NLPUtterance): Promise<Partial<BrainProcessResult> | null>;
    /**
     * Build NLU data result object based on slots
     * and ask for more entities if necessary
     */
    static fillSlot(utterance: NLPUtterance): Promise<Partial<BrainProcessResult> | null>;
    /**
     * Decide what to do with slot filling.
     * 1. Activate context
     * 2. If the context is expecting slots, then loop over questions to slot fill
     * 3. Or go to the brain executor if all slots have been filled in one shot
     */
    static route(intent: string): Promise<boolean>;
}
