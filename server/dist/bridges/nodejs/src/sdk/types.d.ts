/**
 * Action types
 */
import type { ActionParams, IntentObject, SkillAnswerCoreData, SkillAnswerOutput } from '../../../../server/src/core/brain/types';
import type { SkillAnswerConfigSchema } from '../../../../server/src/schemas/skill-schemas';
export type { ActionParams, IntentObject };
export * from '../../../../server/src/core/nlp/types';
export type ActionFunction = (params: ActionParams) => Promise<void>;
/**
 * Answer types
 */
export interface Answer {
    key?: string;
    widget?: unknown;
    data?: AnswerData;
    core?: SkillAnswerCoreData;
}
export interface TextAnswer extends Answer {
    key: string;
}
export interface WidgetAnswer extends Answer {
    widget: unknown;
    key?: string;
}
export type AnswerData = Record<string, string | number> | null;
export type AnswerInput = TextAnswer | WidgetAnswer;
export type AnswerOutput = SkillAnswerOutput;
export type AnswerConfig = SkillAnswerConfigSchema;
