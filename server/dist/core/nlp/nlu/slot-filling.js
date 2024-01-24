"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlotFilling = void 0;
const node_path_1 = require("node:path");
const core_1 = require("../..");
const nlu_1 = require("./nlu");
const skill_domain_helper_1 = require("../../../helpers/skill-domain-helper");
const conversation_1 = require("../conversation");
class SlotFilling {
    /**
     * Handle slot filling
     */
    static async handle(utterance) {
        const processedData = await this.fillSlot(utterance);
        /**
         * In case the slot filling has been interrupted. e.g. context change, etc.
         * Then reprocess with the new utterance
         */
        if (!processedData) {
            await core_1.NLU.process(utterance);
            return null;
        }
        if (processedData && Object.keys(processedData).length > 0) {
            // Set new context with the next action if there is one
            if (processedData.action?.next_action) {
                await core_1.NLU.conversation.setActiveContext({
                    ...conversation_1.DEFAULT_ACTIVE_CONTEXT,
                    lang: core_1.BRAIN.lang,
                    slots: processedData.slots || {},
                    isInActionLoop: !!processedData.nextAction?.loop,
                    originalUtterance: processedData.utterance ?? null,
                    skillConfigPath: processedData.skillConfigPath || '',
                    actionName: processedData.action.next_action,
                    domain: processedData.classification?.domain || '',
                    intent: `${processedData.classification?.skill}.${processedData.action.next_action}`,
                    entities: []
                });
            }
        }
        return processedData;
    }
    /**
     * Build NLU data result object based on slots
     * and ask for more entities if necessary
     */
    static async fillSlot(utterance) {
        if (!core_1.NLU.conversation.activeContext.nextAction) {
            return null;
        }
        const { domain, intent } = core_1.NLU.conversation.activeContext;
        const [skillName, actionName] = intent.split('.');
        const skillConfigPath = (0, node_path_1.join)(process.cwd(), 'skills', domain, skillName, 'config', core_1.BRAIN.lang + '.json');
        core_1.NLU.nluResult = {
            ...nlu_1.DEFAULT_NLU_RESULT,
            utterance,
            classification: {
                domain,
                skill: skillName,
                action: actionName,
                confidence: 1
            }
        };
        const entities = await core_1.NER.extractEntities(core_1.BRAIN.lang, skillConfigPath, core_1.NLU.nluResult);
        // Continue to loop for questions if a slot has been filled correctly
        let notFilledSlot = core_1.NLU.conversation.getNotFilledSlot();
        if (notFilledSlot && entities.length > 0) {
            const hasMatch = entities.some(({ entity }) => entity === notFilledSlot?.expectedEntity);
            if (hasMatch) {
                core_1.NLU.conversation.setSlots(core_1.BRAIN.lang, entities);
                notFilledSlot = core_1.NLU.conversation.getNotFilledSlot();
                if (notFilledSlot) {
                    core_1.BRAIN.talk(notFilledSlot.pickedQuestion);
                    core_1.SOCKET_SERVER.socket?.emit('is-typing', false);
                    return {};
                }
            }
        }
        if (!core_1.NLU.conversation.areSlotsAllFilled()) {
            core_1.BRAIN.talk(`${core_1.BRAIN.wernicke('random_context_out_of_topic')}.`);
        }
        else {
            core_1.NLU.nluResult = {
                ...nlu_1.DEFAULT_NLU_RESULT,
                // Assign slots only if there is a next action
                slots: core_1.NLU.conversation.activeContext.nextAction
                    ? core_1.NLU.conversation.activeContext.slots
                    : {},
                utterance: core_1.NLU.conversation.activeContext.originalUtterance ?? '',
                skillConfigPath,
                classification: {
                    domain,
                    skill: skillName,
                    action: core_1.NLU.conversation.activeContext.nextAction,
                    confidence: 1
                }
            };
            core_1.NLU.conversation.cleanActiveContext();
            return core_1.BRAIN.execute(core_1.NLU.nluResult);
        }
        core_1.NLU.conversation.cleanActiveContext();
        return null;
    }
    /**
     * Decide what to do with slot filling.
     * 1. Activate context
     * 2. If the context is expecting slots, then loop over questions to slot fill
     * 3. Or go to the brain executor if all slots have been filled in one shot
     */
    static async route(intent) {
        const slots = await core_1.MODEL_LOADER.mainNLPContainer.slotManager.getMandatorySlots(intent);
        const hasMandatorySlots = Object.keys(slots)?.length > 0;
        if (hasMandatorySlots) {
            await core_1.NLU.conversation.setActiveContext({
                ...conversation_1.DEFAULT_ACTIVE_CONTEXT,
                lang: core_1.BRAIN.lang,
                slots,
                isInActionLoop: false,
                originalUtterance: core_1.NLU.nluResult.utterance,
                skillConfigPath: core_1.NLU.nluResult.skillConfigPath,
                actionName: core_1.NLU.nluResult.classification.action,
                domain: core_1.NLU.nluResult.classification.domain,
                intent,
                entities: core_1.NLU.nluResult.entities
            });
            const notFilledSlot = core_1.NLU.conversation.getNotFilledSlot();
            // Loop for questions if a slot hasn't been filled
            if (notFilledSlot) {
                const { actions } = await skill_domain_helper_1.SkillDomainHelper.getSkillConfig(core_1.NLU.nluResult.skillConfigPath, core_1.BRAIN.lang);
                const [currentSlot] = actions[core_1.NLU.nluResult.classification.action]?.slots?.filter(({ name }) => name === notFilledSlot.name) ?? [];
                core_1.SOCKET_SERVER.socket?.emit('suggest', currentSlot?.suggestions);
                core_1.BRAIN.talk(notFilledSlot.pickedQuestion);
                core_1.SOCKET_SERVER.socket?.emit('is-typing', false);
                return true;
            }
        }
        return false;
    }
}
exports.SlotFilling = SlotFilling;
