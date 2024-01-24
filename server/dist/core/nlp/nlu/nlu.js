"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_NLU_RESULT = void 0;
const node_path_1 = require("node:path");
const node_child_process_1 = require("node:child_process");
const tree_kill_1 = __importDefault(require("tree-kill"));
const langs_json_1 = require("../../../../../core/langs.json");
const constants_1 = require("../../../constants");
const core_1 = require("../..");
const log_helper_1 = require("../../../helpers/log-helper");
const lang_helper_1 = require("../../../helpers/lang-helper");
const action_loop_1 = require("./action-loop");
const slot_filling_1 = require("./slot-filling");
const conversation_1 = __importStar(require("../conversation"));
const telemetry_1 = require("../../../telemetry");
exports.DEFAULT_NLU_RESULT = {
    utterance: '',
    currentEntities: [],
    entities: [],
    currentResolvers: [],
    resolvers: [],
    slots: {},
    skillConfigPath: '',
    answers: [],
    sentiment: {},
    classification: {
        domain: '',
        skill: '',
        action: '',
        confidence: 0
    }
};
class NLU {
    constructor() {
        this.nluResult = exports.DEFAULT_NLU_RESULT;
        this.conversation = new conversation_1.default('conv0');
        if (!NLU.instance) {
            log_helper_1.LogHelper.title('NLU');
            log_helper_1.LogHelper.success('New instance');
            NLU.instance = this;
        }
    }
    /**
     * Set new language; recreate a new TCP server with new language; and reprocess understanding
     */
    switchLanguage(utterance, locale) {
        const connectedHandler = async () => {
            await this.process(utterance);
        };
        core_1.BRAIN.lang = locale;
        core_1.BRAIN.talk(`${core_1.BRAIN.wernicke('random_language_switch')}.`, true);
        // Recreate a new TCP server process and reconnect the TCP client
        (0, tree_kill_1.default)(global.tcpServerProcess.pid, () => {
            global.tcpServerProcess = (0, node_child_process_1.spawn)(`${constants_1.TCP_SERVER_BIN_PATH} ${locale}`, {
                shell: true
            });
            core_1.TCP_CLIENT.connect();
            core_1.TCP_CLIENT.ee.removeListener('connected', connectedHandler);
            core_1.TCP_CLIENT.ee.on('connected', connectedHandler);
        });
    }
    /**
     * Classify the utterance,
     * pick-up the right classification
     * and extract entities
     */
    process(utterance) {
        const processingTimeStart = Date.now();
        return new Promise(async (resolve, reject) => {
            log_helper_1.LogHelper.title('NLU');
            log_helper_1.LogHelper.info('Processing...');
            if (!core_1.MODEL_LOADER.hasNlpModels()) {
                if (!core_1.BRAIN.isMuted) {
                    core_1.BRAIN.talk(`${core_1.BRAIN.wernicke('random_errors')}!`);
                    core_1.SOCKET_SERVER.socket?.emit('is-typing', false);
                }
                const msg = 'An NLP model is missing, please rebuild the project or if you are in dev run: npm run train';
                log_helper_1.LogHelper.error(msg);
                return reject(msg);
            }
            // Add spaCy entities
            await core_1.NER.mergeSpacyEntities(utterance);
            // Pre NLU processing according to the active context if there is one
            if (this.conversation.hasActiveContext()) {
                // When the active context is in an action loop, then directly trigger the action
                if (this.conversation.activeContext.isInActionLoop) {
                    return resolve(await action_loop_1.ActionLoop.handle(utterance));
                }
                // When the active context has slots filled
                if (Object.keys(this.conversation.activeContext.slots).length > 0) {
                    try {
                        return resolve(await slot_filling_1.SlotFilling.handle(utterance));
                    }
                    catch (e) {
                        return reject({});
                    }
                }
            }
            const result = await core_1.MODEL_LOADER.mainNLPContainer.process(utterance);
            const { locale, answers, classifications } = result;
            const sentiment = {
                vote: result.sentiment.vote,
                score: result.sentiment.score
            };
            let { score, intent, domain } = result;
            /**
             * If a context is active, then use the appropriate classification based on score probability.
             * E.g. 1. Create my shopping list; 2. Actually delete it.
             * If there are several "delete it" across skills, Leon needs to make use of
             * the current context ({domain}.{skill}) to define the most accurate classification
             */
            if (this.conversation.hasActiveContext()) {
                classifications.forEach(({ intent: newIntent, score: newScore }) => {
                    if (newScore > 0.6) {
                        const [skillName] = newIntent.split('.');
                        const newDomain = core_1.MODEL_LOADER.mainNLPContainer.getIntentDomain(locale, newIntent);
                        const contextName = `${newDomain}.${skillName}`;
                        if (this.conversation.activeContext.name === contextName) {
                            score = newScore;
                            intent = newIntent;
                            domain = newDomain;
                        }
                    }
                });
            }
            const [skillName, actionName] = intent.split('.');
            this.nluResult = {
                ...exports.DEFAULT_NLU_RESULT,
                utterance,
                answers,
                sentiment,
                classification: {
                    domain,
                    skill: skillName || '',
                    action: actionName || '',
                    confidence: score
                }
            };
            const isSupportedLanguage = lang_helper_1.LangHelper.getShortCodes().includes(locale);
            if (!isSupportedLanguage) {
                core_1.BRAIN.talk(`${core_1.BRAIN.wernicke('random_language_not_supported')}.`, true);
                core_1.SOCKET_SERVER.socket?.emit('is-typing', false);
                return resolve({});
            }
            // Trigger language switching
            if (core_1.BRAIN.lang !== locale) {
                this.switchLanguage(utterance, locale);
                return resolve(null);
            }
            if (intent === 'None') {
                const fallback = this.fallback(langs_json_1.langs[lang_helper_1.LangHelper.getLongCode(locale)].fallbacks);
                if (!fallback) {
                    if (!core_1.BRAIN.isMuted) {
                        core_1.BRAIN.talk(`${core_1.BRAIN.wernicke('random_unknown_intents')}.`, true);
                        core_1.SOCKET_SERVER.socket?.emit('is-typing', false);
                    }
                    log_helper_1.LogHelper.title('NLU');
                    const msg = 'Intent not found';
                    log_helper_1.LogHelper.warning(msg);
                    telemetry_1.Telemetry.utterance({ utterance, lang: core_1.BRAIN.lang });
                    return resolve(null);
                }
                this.nluResult = fallback;
            }
            log_helper_1.LogHelper.title('NLU');
            log_helper_1.LogHelper.success(`Intent found: ${this.nluResult.classification.skill}.${this.nluResult.classification.action} (domain: ${this.nluResult.classification.domain})`);
            const skillConfigPath = (0, node_path_1.join)(process.cwd(), 'skills', this.nluResult.classification.domain, this.nluResult.classification.skill, 'config', core_1.BRAIN.lang + '.json');
            this.nluResult.skillConfigPath = skillConfigPath;
            try {
                this.nluResult.entities = await core_1.NER.extractEntities(core_1.BRAIN.lang, skillConfigPath, this.nluResult);
            }
            catch (e) {
                log_helper_1.LogHelper.error(`Failed to extract entities: ${e}`);
            }
            const shouldSlotLoop = await slot_filling_1.SlotFilling.route(intent);
            if (shouldSlotLoop) {
                return resolve({});
            }
            // In case all slots have been filled in the first utterance
            if (this.conversation.hasActiveContext() &&
                Object.keys(this.conversation.activeContext.slots).length > 0) {
                try {
                    return resolve(await slot_filling_1.SlotFilling.handle(utterance));
                }
                catch (e) {
                    return reject({});
                }
            }
            const newContextName = `${this.nluResult.classification.domain}.${skillName}`;
            if (this.conversation.activeContext.name !== newContextName) {
                this.conversation.cleanActiveContext();
            }
            await this.conversation.setActiveContext({
                ...conversation_1.DEFAULT_ACTIVE_CONTEXT,
                lang: core_1.BRAIN.lang,
                slots: {},
                isInActionLoop: false,
                originalUtterance: this.nluResult.utterance,
                skillConfigPath: this.nluResult.skillConfigPath,
                actionName: this.nluResult.classification.action,
                domain: this.nluResult.classification.domain,
                intent,
                entities: this.nluResult.entities
            });
            // Pass current utterance entities to the NLU result object
            this.nluResult.currentEntities =
                this.conversation.activeContext.currentEntities;
            // Pass context entities to the NLU result object
            this.nluResult.entities = this.conversation.activeContext.entities;
            try {
                const processedData = await core_1.BRAIN.execute(this.nluResult);
                // Prepare next action if there is one queuing
                if (processedData.nextAction) {
                    this.conversation.cleanActiveContext();
                    await this.conversation.setActiveContext({
                        ...conversation_1.DEFAULT_ACTIVE_CONTEXT,
                        lang: core_1.BRAIN.lang,
                        slots: {},
                        isInActionLoop: !!processedData.nextAction.loop,
                        originalUtterance: processedData.utterance ?? '',
                        skillConfigPath: processedData.skillConfigPath || '',
                        actionName: processedData.action?.next_action || '',
                        domain: processedData.classification?.domain || '',
                        intent: `${processedData.classification?.skill}.${processedData.action?.next_action}`,
                        entities: []
                    });
                }
                const processingTimeEnd = Date.now();
                const processingTime = processingTimeEnd - processingTimeStart;
                return resolve({
                    processingTime,
                    ...processedData,
                    nluProcessingTime: processingTime - (processedData?.executionTime || 0) // In ms, NLU processing time only
                });
            }
            catch (e) {
                const errorMessage = `Failed to execute action: ${e}`;
                log_helper_1.LogHelper.error(errorMessage);
                if (!core_1.BRAIN.isMuted) {
                    core_1.SOCKET_SERVER.socket?.emit('is-typing', false);
                }
                return reject(new Error(errorMessage));
            }
        });
    }
    /**
     * Pickup and compare the right fallback
     * according to the wished skill action
     */
    fallback(fallbacks) {
        const words = this.nluResult.utterance.toLowerCase().split(' ');
        if (fallbacks.length > 0) {
            log_helper_1.LogHelper.info('Looking for fallbacks...');
            const tmpWords = [];
            for (let i = 0; i < fallbacks.length; i += 1) {
                for (let j = 0; j < fallbacks[i].words.length; j += 1) {
                    if (words.includes(fallbacks[i].words[j])) {
                        tmpWords.push(fallbacks[i]?.words[j]);
                    }
                }
                if (JSON.stringify(tmpWords) === JSON.stringify(fallbacks[i]?.words)) {
                    this.nluResult.entities = [];
                    this.nluResult.classification.domain = fallbacks[i]
                        ?.domain;
                    this.nluResult.classification.skill = fallbacks[i]?.skill;
                    this.nluResult.classification.action = fallbacks[i]
                        ?.action;
                    this.nluResult.classification.confidence = 1;
                    log_helper_1.LogHelper.success('Fallback found');
                    return this.nluResult;
                }
            }
        }
        return null;
    }
}
exports.default = NLU;
