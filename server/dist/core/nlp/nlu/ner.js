"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MICROSOFT_BUILT_IN_ENTITIES = void 0;
const types_1 = require("../types");
const core_1 = require("../..");
const log_helper_1 = require("../../../helpers/log-helper");
const string_helper_1 = require("../../../helpers/string-helper");
const skill_domain_helper_1 = require("../../../helpers/skill-domain-helper");
// https://github.com/axa-group/nlp.js/blob/master/packages/builtin-microsoft/src/builtin-microsoft.js
exports.MICROSOFT_BUILT_IN_ENTITIES = [
    'Number',
    'Ordinal',
    'Percentage',
    'Age',
    'Currency',
    'Dimension',
    'Temperature',
    'DateTime',
    'PhoneNumber',
    'IpAddress',
    // Disable booleans to handle it ourselves
    // 'Boolean',
    'Email',
    'Hashtag',
    'URL'
];
class NER {
    constructor() {
        this.spacyData = new Map();
        if (!NER.instance) {
            log_helper_1.LogHelper.title('NER');
            log_helper_1.LogHelper.success('New instance');
            NER.instance = this;
        }
    }
    static logExtraction(entities) {
        log_helper_1.LogHelper.title('NER');
        log_helper_1.LogHelper.success('Entities found:');
        entities.forEach((entity) => log_helper_1.LogHelper.success(`{ value: ${entity.sourceText}, entity: ${entity.entity} }`));
    }
    /**
     * Grab entities and match them with the utterance
     */
    extractEntities(lang, skillConfigPath, nluResult) {
        return new Promise(async (resolve) => {
            log_helper_1.LogHelper.title('NER');
            log_helper_1.LogHelper.info('Looking for entities...');
            const { classification } = nluResult;
            // Remove end-punctuation and add an end-whitespace
            const utterance = `${string_helper_1.StringHelper.removeEndPunctuation(nluResult.utterance)} `;
            const { actions } = await skill_domain_helper_1.SkillDomainHelper.getSkillConfig(skillConfigPath, lang);
            const { action } = classification;
            const promises = [];
            const actionEntities = actions[action]?.entities || [];
            /**
             * Browse action entities
             * Dynamic injection of the action entities depending on the entity type
             */
            for (let i = 0; i < actionEntities.length; i += 1) {
                const entity = actionEntities[i];
                if (entity?.type === 'regex') {
                    promises.push(this.injectRegexEntity(lang, entity));
                }
                else if (entity?.type === 'trim') {
                    promises.push(this.injectTrimEntity(lang, entity));
                }
                else if (entity?.type === 'enum') {
                    promises.push(this.injectEnumEntity(lang, entity));
                }
            }
            await Promise.all(promises);
            const { entities } = await this.manager.process({
                locale: lang,
                text: utterance
            });
            // Normalize entities
            entities.map((entity) => {
                // Trim whitespace at the beginning and the end of the entity value
                entity.sourceText = entity.sourceText.trim();
                entity.utteranceText = entity.utteranceText.trim();
                // Add resolution property to stay consistent with all entities
                if (!entity.resolution) {
                    entity.resolution = { value: entity.sourceText };
                }
                if (types_1.BUILT_IN_ENTITY_TYPES.includes(entity.entity)) {
                    entity.type = entity.entity;
                }
                if (types_1.SPACY_ENTITY_TYPES.includes(entity.entity)) {
                    entity.type = entity.entity;
                    if ('value' in entity.resolution &&
                        this.spacyData.has(`${entity.type}-${entity.resolution.value}`)) {
                        entity.resolution = this.spacyData.get(`${entity.type}-${entity.resolution.value}`);
                    }
                }
                return entity;
            });
            if (entities.length > 0) {
                NER.logExtraction(entities);
                return resolve(entities);
            }
            log_helper_1.LogHelper.title('NER');
            log_helper_1.LogHelper.info('No entity found');
            return resolve([]);
        });
    }
    /**
     * Merge spaCy entities with the NER instance
     */
    async mergeSpacyEntities(utterance) {
        this.spacyData = new Map();
        const spacyEntities = await this.getSpacyEntities(utterance);
        if (spacyEntities.length > 0) {
            spacyEntities.forEach(({ entity, resolution }) => {
                const value = string_helper_1.StringHelper.ucFirst(resolution.value);
                const spacyEntity = {
                    [entity]: {
                        options: {
                            [resolution.value]: [value]
                        }
                    }
                };
                this.spacyData.set(`${entity}-${value}`, resolution);
                core_1.MODEL_LOADER.mainNLPContainer.addEntities(spacyEntity, core_1.BRAIN.lang);
            });
        }
    }
    /**
     * Get spaCy entities from the TCP server
     */
    getSpacyEntities(utterance) {
        return new Promise((resolve) => {
            const spacyEntitiesReceivedHandler = async ({ spacyEntities }) => {
                resolve(spacyEntities);
            };
            core_1.TCP_CLIENT.ee.removeAllListeners();
            core_1.TCP_CLIENT.ee.on('spacy-entities-received', spacyEntitiesReceivedHandler);
            core_1.TCP_CLIENT.emit('get-spacy-entities', utterance);
        });
    }
    /**
     * Inject trim type entities
     */
    injectTrimEntity(lang, entityConfig) {
        return new Promise((resolve) => {
            for (let j = 0; j < entityConfig.conditions.length; j += 1) {
                const condition = entityConfig.conditions[j];
                const conditionMethod = `add${string_helper_1.StringHelper.snakeToPascalCase(condition?.type || '')}Condition`;
                if (condition?.type === 'between') {
                    /**
                     * Conditions: https://github.com/axa-group/nlp.js/blob/master/docs/v3/ner-manager.md#trim-named-entities
                     * e.g. list.addBetweenCondition('en', 'list', 'create a', 'list')
                     */
                    this.manager[conditionMethod](lang, entityConfig.name, condition?.from, condition?.to);
                }
                else if (condition?.type.indexOf('after') !== -1) {
                    const rule = {
                        type: 'afterLast',
                        words: condition?.from,
                        options: {}
                    };
                    this.manager.addRule(lang, entityConfig.name, 'trim', rule);
                    this.manager[conditionMethod](lang, entityConfig.name, condition?.from);
                }
                else if (condition.type.indexOf('before') !== -1) {
                    this.manager[conditionMethod](lang, entityConfig.name, condition.to);
                }
            }
            resolve();
        });
    }
    /**
     * Inject regex type entities
     */
    injectRegexEntity(lang, entityConfig) {
        return new Promise((resolve) => {
            this.manager.addRegexRule(lang, entityConfig.name, new RegExp(entityConfig.regex, 'g'));
            resolve();
        });
    }
    /**
     * Inject enum type entities
     */
    injectEnumEntity(lang, entityConfig) {
        return new Promise((resolve) => {
            const { name: entityName, options } = entityConfig;
            const optionKeys = Object.keys(options);
            optionKeys.forEach((optionName) => {
                const { synonyms } = options[optionName];
                this.manager.addRuleOptionTexts(lang, entityName, optionName, synonyms);
            });
            resolve();
        });
    }
}
exports.default = NER;
