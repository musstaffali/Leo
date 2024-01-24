"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
const core_loader_1 = require("@nlpjs/core-loader");
const nlp_1 = require("@nlpjs/nlp");
const builtin_microsoft_1 = require("@nlpjs/builtin-microsoft");
const lang_all_1 = require("@nlpjs/lang-all");
const constants_1 = require("../../../constants");
const core_1 = require("../..");
const ner_1 = require("./ner");
const log_helper_1 = require("../../../helpers/log-helper");
class ModelLoader {
    constructor() {
        if (!ModelLoader.instance) {
            log_helper_1.LogHelper.title('Model Loader');
            log_helper_1.LogHelper.success('New instance');
            ModelLoader.instance = this;
        }
    }
    /**
     * Check if NLP models exists
     */
    hasNlpModels() {
        return (!!this.globalResolversNLPContainer &&
            !!this.skillsResolversNLPContainer &&
            !!this.mainNLPContainer);
    }
    /**
     * Load all NLP models at once
     */
    loadNLPModels() {
        return Promise.all([
            this.loadGlobalResolversModel(node_path_1.default.join(constants_1.MODELS_PATH, 'leon-global-resolvers-model.nlp')),
            this.loadSkillsResolversModel(node_path_1.default.join(constants_1.MODELS_PATH, 'leon-skills-resolvers-model.nlp')),
            this.loadMainModel(node_path_1.default.join(constants_1.MODELS_PATH, 'leon-main-model.nlp'))
        ]);
    }
    /**
     * Load the global resolvers NLP model from the latest training
     */
    loadGlobalResolversModel(modelPath) {
        return new Promise(async (resolve, reject) => {
            if (!node_fs_1.default.existsSync(modelPath)) {
                log_helper_1.LogHelper.title('Model Loader');
                reject(new Error('The global resolvers NLP model does not exist, please run: npm run train'));
            }
            else {
                log_helper_1.LogHelper.title('Model Loader');
                try {
                    const container = await (0, core_loader_1.containerBootstrap)();
                    container.use(nlp_1.Nlp);
                    container.use(lang_all_1.LangAll);
                    this.globalResolversNLPContainer = container.get('nlp');
                    const nluManager = container.get('nlu-manager');
                    nluManager.settings.spellCheck = true;
                    await this.globalResolversNLPContainer.load(modelPath);
                    log_helper_1.LogHelper.success('Global resolvers NLP model loaded');
                    resolve();
                }
                catch (e) {
                    reject(new Error('An error occurred while loading the global resolvers NLP model'));
                }
            }
        });
    }
    /**
     * Load the skills resolvers NLP model from the latest training
     */
    loadSkillsResolversModel(modelPath) {
        return new Promise(async (resolve, reject) => {
            if (!node_fs_1.default.existsSync(modelPath)) {
                log_helper_1.LogHelper.title('Model Loader');
                reject({
                    type: 'warning',
                    obj: new Error('The skills resolvers NLP model does not exist, please run: npm run train')
                });
            }
            else {
                try {
                    const container = await (0, core_loader_1.containerBootstrap)();
                    container.use(nlp_1.Nlp);
                    container.use(lang_all_1.LangAll);
                    this.skillsResolversNLPContainer = container.get('nlp');
                    const nluManager = container.get('nlu-manager');
                    nluManager.settings.spellCheck = true;
                    await this.skillsResolversNLPContainer.load(modelPath);
                    log_helper_1.LogHelper.success('Skills resolvers NLP model loaded');
                    resolve();
                }
                catch (e) {
                    reject(new Error('An error occurred while loading the skills resolvers NLP model'));
                }
            }
        });
    }
    /**
     * Load the main NLP model from the latest training
     */
    loadMainModel(modelPath) {
        return new Promise(async (resolve, reject) => {
            if (!node_fs_1.default.existsSync(modelPath)) {
                log_helper_1.LogHelper.title('Model Loader');
                reject({
                    type: 'warning',
                    obj: new Error('The main NLP model does not exist, please run: npm run train')
                });
            }
            else {
                try {
                    const container = await (0, core_loader_1.containerBootstrap)();
                    container.register('extract-builtin-??', new builtin_microsoft_1.BuiltinMicrosoft({
                        builtins: ner_1.MICROSOFT_BUILT_IN_ENTITIES
                    }), true);
                    container.use(nlp_1.Nlp);
                    container.use(lang_all_1.LangAll);
                    this.mainNLPContainer = container.get('nlp');
                    const nluManager = container.get('nlu-manager');
                    nluManager.settings.spellCheck = true;
                    await this.mainNLPContainer.load(modelPath);
                    log_helper_1.LogHelper.success('Main NLP model loaded');
                    core_1.NER.manager = this.mainNLPContainer.ner;
                    resolve();
                }
                catch (e) {
                    reject(new Error('An error occurred while loading the main NLP model'));
                }
            }
        });
    }
}
exports.default = ModelLoader;
