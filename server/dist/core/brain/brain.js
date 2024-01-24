"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
const node_child_process_1 = require("node:child_process");
const types_1 = require("./types");
const langs_json_1 = require("../../../../core/langs.json");
const constants_1 = require("../../constants");
const core_1 = require("./..");
const lang_helper_1 = require("../../helpers/lang-helper");
const log_helper_1 = require("../../helpers/log-helper");
const skill_domain_helper_1 = require("../../helpers/skill-domain-helper");
const string_helper_1 = require("../../helpers/string-helper");
const date_helper_1 = require("../../helpers/date-helper");
class Brain {
    constructor() {
        this._lang = 'en';
        this.broca = JSON.parse(node_fs_1.default.readFileSync(node_path_1.default.join(process.cwd(), 'core', 'data', this._lang, 'answers.json'), 'utf8'));
        this.skillProcess = undefined;
        this.domainFriendlyName = '';
        this.skillFriendlyName = '';
        this.skillOutput = '';
        this.answers = [];
        this.isMuted = false; // Close Leon mouth if true; e.g. over HTTP
        if (!Brain.instance) {
            log_helper_1.LogHelper.title('Brain');
            log_helper_1.LogHelper.success('New instance');
            Brain.instance = this;
        }
    }
    get lang() {
        return this._lang;
    }
    set lang(newLang) {
        this._lang = newLang;
        // Update broca
        this.broca = JSON.parse(node_fs_1.default.readFileSync(node_path_1.default.join(process.cwd(), 'core', 'data', this._lang, 'answers.json'), 'utf8'));
        if (constants_1.HAS_TTS) {
            this.updateTTSLang(this._lang);
        }
    }
    async updateTTSLang(newLang) {
        await core_1.TTS.init(newLang);
        log_helper_1.LogHelper.title('Brain');
        log_helper_1.LogHelper.info('Language has changed');
    }
    /**
     * Delete intent object file
     */
    static deleteIntentObjFile(intentObjectPath) {
        try {
            if (node_fs_1.default.existsSync(intentObjectPath)) {
                node_fs_1.default.unlinkSync(intentObjectPath);
            }
        }
        catch (e) {
            log_helper_1.LogHelper.error(`Failed to delete intent object file: ${e}`);
        }
    }
    /**
     * Make Leon talk
     */
    talk(answer, end = false) {
        log_helper_1.LogHelper.title('Brain');
        log_helper_1.LogHelper.info('Talking...');
        if (answer !== '') {
            const textAnswer = typeof answer === 'string' ? answer : answer.text;
            const speechAnswer = typeof answer === 'string' ? answer : answer.speech;
            if (constants_1.HAS_TTS) {
                // Stripe HTML to a whitespace. Whitespace to let the TTS respects punctuation
                const speech = speechAnswer.replace(/<(?:.|\n)*?>/gm, ' ');
                core_1.TTS.add(speech, end);
            }
            core_1.SOCKET_SERVER.socket?.emit('answer', textAnswer);
        }
    }
    /**
     * Pickup speech info we need to return
     */
    wernicke(type, key, obj) {
        let answerObject = {};
        let answer = '';
        // Choose a random answer or a specific one
        let property = this.broca.answers[type];
        if (property?.constructor === [].constructor) {
            property = property;
            answer = property[Math.floor(Math.random() * property.length)];
        }
        else {
            answerObject = property;
        }
        // Select a specific key
        if (key !== '' && typeof key !== 'undefined') {
            answer = answerObject[key];
        }
        // Parse sentence's value(s) and replace with the given object
        if (typeof obj !== 'undefined' && Object.keys(obj).length > 0) {
            answer = string_helper_1.StringHelper.findAndMap(answer, obj);
        }
        return answer;
    }
    shouldAskToRepeat(nluResult) {
        return (nluResult.classification.confidence <
            langs_json_1.langs[lang_helper_1.LangHelper.getLongCode(this._lang)].min_confidence);
    }
    handleAskToRepeat(nluResult) {
        if (!this.isMuted) {
            const speech = `${this.wernicke('random_not_sure')}.`;
            this.talk(speech, true);
            core_1.SOCKET_SERVER.socket?.emit('ask-to-repeat', nluResult);
        }
    }
    /**
     * Create the intent object that will be passed to the skill
     */
    createIntentObject(nluResult, utteranceID, slots) {
        const date = date_helper_1.DateHelper.getDateTime();
        const dateObject = new Date(date);
        return {
            id: utteranceID,
            lang: this._lang,
            domain: nluResult.classification.domain,
            skill: nluResult.classification.skill,
            action: nluResult.classification.action,
            utterance: nluResult.utterance,
            current_entities: nluResult.currentEntities,
            entities: nluResult.entities,
            current_resolvers: nluResult.currentResolvers,
            resolvers: nluResult.resolvers,
            slots,
            extra_context_data: {
                lang: this._lang,
                sentiment: nluResult.sentiment,
                date: date.slice(0, 10),
                time: date.slice(11, 19),
                timestamp: dateObject.getTime(),
                date_time: date,
                week_day: dateObject.toLocaleString('default', { weekday: 'long' })
            }
        };
    }
    /**
     * Handle the skill process output
     */
    handleLogicActionSkillProcessOutput(data) {
        try {
            const skillAnswer = JSON.parse(data.toString());
            if (typeof skillAnswer === 'object') {
                log_helper_1.LogHelper.title(`${this.skillFriendlyName} skill (on data)`);
                log_helper_1.LogHelper.info(data.toString());
                if (skillAnswer.output.widget) {
                    core_1.SOCKET_SERVER.socket?.emit('widget', skillAnswer.output.widget);
                }
                const { answer } = skillAnswer.output;
                if (!this.isMuted) {
                    this.talk(answer);
                }
                this.answers.push(answer);
                this.skillOutput = data.toString();
                return Promise.resolve(null);
            }
            else {
                return Promise.reject(new Error(`The "${this.skillFriendlyName}" skill from the "${this.domainFriendlyName}" domain is not well configured. Check the configuration file.`));
            }
        }
        catch (e) {
            log_helper_1.LogHelper.title('Brain');
            log_helper_1.LogHelper.debug(`process.stdout: ${String(data)}`);
        }
    }
    /**
     * Speak about an error happened regarding a specific skill
     */
    speakSkillError() {
        const speech = `${this.wernicke('random_skill_errors', '', {
            '%skill_name%': this.skillFriendlyName,
            '%domain_name%': this.domainFriendlyName
        })}!`;
        if (!this.isMuted) {
            this.talk(speech);
            core_1.SOCKET_SERVER.socket?.emit('is-typing', false);
        }
        this.answers.push(speech);
    }
    /**
     * Handle the skill process error
     */
    handleLogicActionSkillProcessError(data, intentObjectPath) {
        this.speakSkillError();
        Brain.deleteIntentObjFile(intentObjectPath);
        log_helper_1.LogHelper.title(`${this.skillFriendlyName} skill`);
        log_helper_1.LogHelper.error(data.toString());
        return new Error(data.toString());
    }
    /**
     * Execute an action logic skill in a standalone way (CLI):
     *
     * 1. Need to be at the root of the project
     * 2. Edit: server/src/intent-object.sample.json
     * 3. Run: npm run python-bridge
     */
    async executeLogicActionSkill(nluResult, skillBridge, utteranceID, intentObjectPath) {
        // Ensure the process is empty (to be able to execute other processes outside of Brain)
        if (!this.skillProcess) {
            const slots = {};
            if (nluResult.slots) {
                Object.keys(nluResult.slots)?.forEach((slotName) => {
                    slots[slotName] = nluResult.slots[slotName]?.value;
                });
            }
            const intentObject = this.createIntentObject(nluResult, utteranceID, slots);
            try {
                await node_fs_1.default.promises.writeFile(intentObjectPath, JSON.stringify(intentObject));
                if (skillBridge === types_1.SkillBridges.Python) {
                    this.skillProcess = (0, node_child_process_1.spawn)(`${constants_1.PYTHON_BRIDGE_BIN_PATH} "${intentObjectPath}"`, { shell: true });
                }
                else if (skillBridge === types_1.SkillBridges.NodeJS) {
                    this.skillProcess = (0, node_child_process_1.spawn)(`${constants_1.NODEJS_BRIDGE_BIN_PATH} "${intentObjectPath}"`, { shell: true });
                }
                else {
                    log_helper_1.LogHelper.error(`The skill bridge is not supported: ${skillBridge}`);
                }
            }
            catch (e) {
                log_helper_1.LogHelper.error(`Failed to save intent object: ${e}`);
            }
        }
    }
    /**
     * Execute Python skills
     */
    execute(nluResult) {
        const executionTimeStart = Date.now();
        return new Promise(async (resolve) => {
            const utteranceID = `${Date.now()}-${string_helper_1.StringHelper.random(4)}`;
            const intentObjectPath = node_path_1.default.join(constants_1.TMP_PATH, `${utteranceID}.json`);
            const speeches = [];
            // Reset skill output
            this.skillOutput = '';
            // Ask to repeat if Leon is not sure about the request
            if (this.shouldAskToRepeat(nluResult)) {
                this.handleAskToRepeat(nluResult);
                const executionTimeEnd = Date.now();
                const executionTime = executionTimeEnd - executionTimeStart;
                resolve({
                    speeches,
                    executionTime
                });
            }
            else {
                const { skillConfigPath, classification: { action: actionName } } = nluResult;
                const { actions } = await skill_domain_helper_1.SkillDomainHelper.getSkillConfig(skillConfigPath, this._lang);
                const action = actions[actionName];
                const { type: actionType } = action;
                const nextAction = action.next_action
                    ? actions[action.next_action]
                    : null;
                if (actionType === types_1.SkillActionTypes.Logic) {
                    /**
                     * "Logic" action skill execution
                     */
                    const domainName = nluResult.classification.domain;
                    const skillName = nluResult.classification.skill;
                    const { name: domainFriendlyName } = await skill_domain_helper_1.SkillDomainHelper.getSkillDomainInfo(domainName);
                    const { name: skillFriendlyName, bridge: skillBridge } = await skill_domain_helper_1.SkillDomainHelper.getSkillInfo(domainName, skillName);
                    await this.executeLogicActionSkill(nluResult, skillBridge, utteranceID, intentObjectPath);
                    this.domainFriendlyName = domainFriendlyName;
                    this.skillFriendlyName = skillFriendlyName;
                    // Read skill output
                    this.skillProcess?.stdout.on('data', (data) => {
                        this.handleLogicActionSkillProcessOutput(data);
                    });
                    // Handle error
                    this.skillProcess?.stderr.on('data', (data) => {
                        this.handleLogicActionSkillProcessError(data, intentObjectPath);
                    });
                    // Catch the end of the skill execution
                    this.skillProcess?.stdout.on('end', () => {
                        log_helper_1.LogHelper.title(`${this.skillFriendlyName} skill (on end)`);
                        log_helper_1.LogHelper.info(this.skillOutput);
                        let skillResult = undefined;
                        // Check if there is an output (no skill error)
                        if (this.skillOutput !== '') {
                            try {
                                skillResult = JSON.parse(this.skillOutput);
                            }
                            catch (e) {
                                log_helper_1.LogHelper.title(`${this.skillFriendlyName} skill`);
                                log_helper_1.LogHelper.error(`There is an error on the final output: ${String(e)}`);
                                this.speakSkillError();
                            }
                        }
                        Brain.deleteIntentObjFile(intentObjectPath);
                        if (!this.isMuted) {
                            core_1.SOCKET_SERVER.socket?.emit('is-typing', false);
                        }
                        const executionTimeEnd = Date.now();
                        const executionTime = executionTimeEnd - executionTimeStart;
                        // Send suggestions to the client
                        if (nextAction?.suggestions &&
                            skillResult?.output.core?.showNextActionSuggestions) {
                            core_1.SOCKET_SERVER.socket?.emit('suggest', nextAction.suggestions);
                        }
                        if (action?.suggestions &&
                            skillResult?.output.core?.showSuggestions) {
                            core_1.SOCKET_SERVER.socket?.emit('suggest', action.suggestions);
                        }
                        resolve({
                            utteranceID,
                            lang: this._lang,
                            ...nluResult,
                            speeches,
                            core: skillResult?.output.core,
                            action,
                            nextAction,
                            executionTime // In ms, skill execution time only
                        });
                    });
                    // Reset the child process
                    this.skillProcess = undefined;
                }
                else {
                    /**
                     * "Dialog" action skill execution
                     */
                    const configFilePath = node_path_1.default.join(process.cwd(), 'skills', nluResult.classification.domain, nluResult.classification.skill, 'config', this._lang + '.json');
                    const { actions, entities: skillConfigEntities } = await skill_domain_helper_1.SkillDomainHelper.getSkillConfig(configFilePath, this._lang);
                    const utteranceHasEntities = nluResult.entities.length > 0;
                    const { answers: rawAnswers } = nluResult;
                    // TODO: handle dialog action skill speech vs text
                    // let answers = rawAnswers as [{ answer: SkillAnswerConfigSchema }]
                    let answers = rawAnswers;
                    let answer = '';
                    if (!utteranceHasEntities) {
                        answers = answers.filter(({ answer }) => answer.indexOf('{{') === -1);
                    }
                    else {
                        answers = answers.filter(({ answer }) => answer.indexOf('{{') !== -1);
                    }
                    // When answers are simple without required entity
                    if (answers.length === 0) {
                        answer =
                            rawAnswers[Math.floor(Math.random() * rawAnswers.length)]?.answer;
                        // In case the expected answer requires a known entity
                        if (answer?.indexOf('{{') !== -1) {
                            // TODO
                            const unknownAnswers = actions[nluResult.classification.action]?.unknown_answers;
                            if (unknownAnswers) {
                                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                // @ts-ignore
                                answer =
                                    unknownAnswers[Math.floor(Math.random() * unknownAnswers.length)];
                            }
                        }
                    }
                    else {
                        answer = answers[Math.floor(Math.random() * answers.length)]?.answer;
                        /**
                         * In case the utterance contains entities, and the picked up answer too,
                         * then map them (utterance <-> answer)
                         */
                        if (utteranceHasEntities && answer?.indexOf('{{') !== -1) {
                            nluResult.currentEntities.forEach((entityObj) => {
                                answer = string_helper_1.StringHelper.findAndMap(answer, {
                                    [`{{ ${entityObj.entity} }}`]: entityObj
                                        .resolution.value
                                });
                                /**
                                 * Find matches and map deeper data from the NLU file (global entities)
                                 * TODO: handle more entity types, not only enums for global entities?
                                 */
                                const matches = answer.match(/{{.+?}}/g);
                                matches?.forEach((match) => {
                                    let newStr = match.substring(3);
                                    newStr = newStr.substring(0, newStr.indexOf('}}') - 1);
                                    const [entity, dataKey] = newStr.split('.');
                                    if (entity && dataKey && entity === entityObj.entity) {
                                        const { option } = entityObj;
                                        const entityOption = skillConfigEntities[entity]?.options[option];
                                        const entityOptionData = entityOption?.data;
                                        let valuesArr = [];
                                        if (entityOptionData) {
                                            // e.g. entities.color.options.red.data.hexa[]
                                            valuesArr = entityOptionData[dataKey];
                                        }
                                        if (valuesArr.length > 0) {
                                            answer = string_helper_1.StringHelper.findAndMap(answer, {
                                                [match]: valuesArr[Math.floor(Math.random() * valuesArr.length)]
                                            });
                                        }
                                    }
                                });
                            });
                        }
                    }
                    const executionTimeEnd = Date.now();
                    const executionTime = executionTimeEnd - executionTimeStart;
                    if (!this.isMuted) {
                        this.talk(answer, true);
                        core_1.SOCKET_SERVER.socket?.emit('is-typing', false);
                    }
                    // Send suggestions to the client
                    if (nextAction?.suggestions) {
                        core_1.SOCKET_SERVER.socket?.emit('suggest', nextAction.suggestions);
                    }
                    resolve({
                        utteranceID,
                        lang: this._lang,
                        ...nluResult,
                        speeches: [answer],
                        core: {},
                        action,
                        nextAction,
                        executionTime // In ms, skill execution time only
                    });
                }
            }
        });
    }
}
exports.default = Brain;
