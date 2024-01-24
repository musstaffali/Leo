import type { ShortLanguageCode } from '../../types';
import type { NLUResult } from '../nlp/types';
import type { SkillAnswerConfigSchema } from '../../schemas/skill-schemas';
import type { BrainProcessResult } from './types';
export default class Brain {
    private static instance;
    private _lang;
    private broca;
    private skillProcess;
    private domainFriendlyName;
    private skillFriendlyName;
    private skillOutput;
    private answers;
    isMuted: boolean;
    constructor();
    get lang(): ShortLanguageCode;
    set lang(newLang: ShortLanguageCode);
    private updateTTSLang;
    /**
     * Delete intent object file
     */
    private static deleteIntentObjFile;
    /**
     * Make Leon talk
     */
    talk(answer: SkillAnswerConfigSchema, end?: boolean): void;
    /**
     * Pickup speech info we need to return
     */
    wernicke(type: string, key?: string, obj?: Record<string, unknown>): string;
    private shouldAskToRepeat;
    private handleAskToRepeat;
    /**
     * Create the intent object that will be passed to the skill
     */
    private createIntentObject;
    /**
     * Handle the skill process output
     */
    private handleLogicActionSkillProcessOutput;
    /**
     * Speak about an error happened regarding a specific skill
     */
    private speakSkillError;
    /**
     * Handle the skill process error
     */
    private handleLogicActionSkillProcessError;
    /**
     * Execute an action logic skill in a standalone way (CLI):
     *
     * 1. Need to be at the root of the project
     * 2. Edit: server/src/intent-object.sample.json
     * 3. Run: npm run python-bridge
     */
    private executeLogicActionSkill;
    /**
     * Execute Python skills
     */
    execute(nluResult: NLUResult): Promise<Partial<BrainProcessResult>>;
}
