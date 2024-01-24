"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActionLoop = void 0;
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = require("node:path");
const core_1 = require("../..");
const log_helper_1 = require("../../../helpers/log-helper");
const skill_domain_helper_1 = require("../../../helpers/skill-domain-helper");
const nlu_1 = require("./nlu");
class ActionLoop {
    /**
     * Handle action loop logic before NLU processing
     */
    static async handle(utterance) {
        const { domain, intent } = core_1.NLU.conversation.activeContext;
        const [skillName, actionName] = intent.split('.');
        const skillConfigPath = (0, node_path_1.join)(process.cwd(), 'skills', domain, skillName, 'config', core_1.BRAIN.lang + '.json');
        core_1.NLU.nluResult = {
            ...nlu_1.DEFAULT_NLU_RESULT,
            slots: core_1.NLU.conversation.activeContext.slots,
            utterance,
            skillConfigPath,
            classification: {
                domain,
                skill: skillName,
                action: actionName,
                confidence: 1
            }
        };
        core_1.NLU.nluResult.entities = await core_1.NER.extractEntities(core_1.BRAIN.lang, skillConfigPath, core_1.NLU.nluResult);
        const { actions, resolvers } = await skill_domain_helper_1.SkillDomainHelper.getSkillConfig(skillConfigPath, core_1.BRAIN.lang);
        const action = actions[core_1.NLU.nluResult.classification.action];
        if (action?.loop) {
            const { name: expectedItemName, type: expectedItemType } = action.loop.expected_item;
            let hasMatchingEntity = false;
            let hasMatchingResolver = false;
            if (expectedItemType === 'entity') {
                hasMatchingEntity =
                    core_1.NLU.nluResult.entities.filter(({ entity }) => expectedItemName === entity).length > 0;
            }
            else if (expectedItemType.indexOf('resolver') !== -1) {
                const nlpObjs = {
                    global_resolver: core_1.MODEL_LOADER.globalResolversNLPContainer,
                    skill_resolver: core_1.MODEL_LOADER.skillsResolversNLPContainer
                };
                const result = await nlpObjs[expectedItemType].process(utterance);
                const { intent } = result;
                const resolveResolvers = async (resolver, intent) => {
                    const resolversPath = (0, node_path_1.join)(process.cwd(), 'core', 'data', core_1.BRAIN.lang, 'global-resolvers');
                    // Load the skill resolver or the global resolver
                    const resolvedIntents = !intent.includes('resolver.global')
                        ? resolvers && resolvers[resolver]
                        : JSON.parse(await node_fs_1.default.promises.readFile((0, node_path_1.join)(resolversPath, `${resolver}.json`), 'utf8'));
                    // E.g. resolver.global.denial -> denial
                    intent = intent.substring(intent.lastIndexOf('.') + 1);
                    return [
                        {
                            name: expectedItemName,
                            value: resolvedIntents.intents[intent].value
                        }
                    ];
                };
                // Resolve resolver if global resolver or skill resolver has been found
                if (intent &&
                    (intent.includes('resolver.global') ||
                        intent.includes(`resolver.${skillName}`))) {
                    log_helper_1.LogHelper.title('NLU');
                    log_helper_1.LogHelper.success('Resolvers resolved:');
                    core_1.NLU.nluResult.resolvers = await resolveResolvers(expectedItemName, intent);
                    core_1.NLU.nluResult.resolvers.forEach((resolver) => log_helper_1.LogHelper.success(`${intent}: ${JSON.stringify(resolver)}`));
                    hasMatchingResolver = core_1.NLU.nluResult.resolvers.length > 0;
                }
            }
            // Ensure expected items are in the utterance, otherwise clean context and reprocess
            if (!hasMatchingEntity && !hasMatchingResolver) {
                core_1.BRAIN.talk(`${core_1.BRAIN.wernicke('random_context_out_of_topic')}.`);
                core_1.NLU.conversation.cleanActiveContext();
                await core_1.NLU.process(utterance);
                return null;
            }
            try {
                const processedData = await core_1.BRAIN.execute(core_1.NLU.nluResult);
                // Reprocess with the original utterance that triggered the context at first
                if (processedData.core?.restart === true) {
                    const { originalUtterance } = core_1.NLU.conversation.activeContext;
                    core_1.NLU.conversation.cleanActiveContext();
                    if (originalUtterance !== null) {
                        await core_1.NLU.process(originalUtterance);
                    }
                    return null;
                }
                /**
                 * In case there is no next action to prepare anymore
                 * and there is an explicit stop of the loop from the skill
                 */
                if (!processedData.action?.next_action &&
                    processedData.core?.isInActionLoop === false) {
                    core_1.NLU.conversation.cleanActiveContext();
                    return null;
                }
                // Break the action loop and prepare for the next action if necessary
                if (processedData.core?.isInActionLoop === false) {
                    core_1.NLU.conversation.activeContext.isInActionLoop =
                        !!processedData.action?.loop;
                    core_1.NLU.conversation.activeContext.actionName = processedData.action
                        ?.next_action;
                    core_1.NLU.conversation.activeContext.intent = `${processedData.classification?.skill}.${processedData.action?.next_action}`;
                }
                return processedData;
            }
            catch (e) {
                return null;
            }
        }
        return null;
    }
}
exports.ActionLoop = ActionLoop;
