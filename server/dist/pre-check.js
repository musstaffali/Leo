"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
const ajv_human_errors_1 = require("@segment/ajv-human-errors");
const ajv_1 = require("./ajv");
const voice_config_schemas_1 = require("./schemas/voice-config-schemas");
const global_data_schemas_1 = require("./schemas/global-data-schemas");
const skill_schemas_1 = require("./schemas/skill-schemas");
const log_helper_1 = require("./helpers/log-helper");
const lang_helper_1 = require("./helpers/lang-helper");
const skill_domain_helper_1 = require("./helpers/skill-domain-helper");
const constants_1 = require("./constants");
const utilities_1 = require("./utilities");
const system_helper_1 = require("./helpers/system-helper");
const validateSchema = (schemaName, schema, contentToValidate, customErrorMessage) => {
    const schemaFile = `${schemaName}.json`;
    const validate = ajv_1.ajv.compile(schema);
    const isValidSchemaKey = typeof contentToValidate['$schema'] === 'string' &&
        contentToValidate['$schema'].endsWith(schemaFile);
    const isValid = validate(contentToValidate) && isValidSchemaKey;
    if (!isValid) {
        log_helper_1.LogHelper.error(customErrorMessage);
        if (!isValidSchemaKey) {
            log_helper_1.LogHelper.error(`The schema key "$schema" is not valid. Expected "${schemaName}", but got "${contentToValidate['$schema']}".`);
        }
        log_helper_1.LogHelper.error(customErrorMessage);
        const errors = new ajv_human_errors_1.AggregateAjvError(validate.errors ?? []);
        for (const error of errors) {
            log_helper_1.LogHelper.error(error.message);
        }
        process.exit(1);
    }
};
/**
 * Pre-checking
 *
 * - Ensure the system requirements are met
 * - Ensure JSON files are correctly formatted
 */
const VOICE_CONFIG_SCHEMAS = {
    amazon: voice_config_schemas_1.amazonVoiceConfiguration,
    'google-cloud': voice_config_schemas_1.googleCloudVoiceConfiguration,
    'watson-stt': voice_config_schemas_1.watsonVoiceConfiguration,
    'watson-tts': voice_config_schemas_1.watsonVoiceConfiguration
};
const GLOBAL_DATA_SCHEMAS = {
    answers: global_data_schemas_1.globalAnswersSchemaObject,
    globalEntities: global_data_schemas_1.globalEntitySchemaObject,
    globalResolvers: global_data_schemas_1.globalResolverSchemaObject
};
(async () => {
    log_helper_1.LogHelper.title('Pre-checking');
    /**
     * System requirements checking
     */
    log_helper_1.LogHelper.info('Checking system requirements...');
    const totalRAMInGB = Math.round(system_helper_1.SystemHelper.getTotalRAM());
    const freeRAMInGB = Math.round(system_helper_1.SystemHelper.getFreeRAM());
    if (freeRAMInGB < constants_1.MINIMUM_REQUIRED_RAM) {
        log_helper_1.LogHelper.warning(`Free RAM: ${freeRAMInGB} GB | Total RAM: ${totalRAMInGB} GB. Leon needs at least ${constants_1.MINIMUM_REQUIRED_RAM} GB of RAM. It may not work as expected.`);
    }
    else {
        log_helper_1.LogHelper.success(`Minimum required RAM: ${constants_1.MINIMUM_REQUIRED_RAM} GB | Free RAM: ${freeRAMInGB} GB | Total RAM: ${totalRAMInGB} GB`);
    }
    /**
     * Voice configuration checking
     */
    log_helper_1.LogHelper.info('Checking voice configuration schemas...');
    const voiceConfigFiles = (await node_fs_1.default.promises.readdir(constants_1.VOICE_CONFIG_PATH)).filter((file) => file.endsWith('.json'));
    for (const file of voiceConfigFiles) {
        const voiceConfigPath = node_path_1.default.join(constants_1.VOICE_CONFIG_PATH, file);
        const config = JSON.parse(await node_fs_1.default.promises.readFile(voiceConfigPath, 'utf8'));
        const [configName] = file.split('.');
        validateSchema(`voice-config-schemas/${configName}`, VOICE_CONFIG_SCHEMAS[configName], config, `The voice configuration schema "${voiceConfigPath}" is not valid:`);
    }
    log_helper_1.LogHelper.success('Voice configuration schemas checked');
    /**
     * Global data checking
     */
    log_helper_1.LogHelper.info('Checking global data schemas...');
    const supportedLangs = lang_helper_1.LangHelper.getShortCodes();
    for (const lang of supportedLangs) {
        /**
         * Global entities checking
         */
        const globalEntitiesPath = (0, utilities_1.getGlobalEntitiesPath)(lang);
        const globalEntityFiles = (await node_fs_1.default.promises.readdir(globalEntitiesPath)).filter((file) => file.endsWith('.json'));
        for (const file of globalEntityFiles) {
            const globalEntityPath = node_path_1.default.join(globalEntitiesPath, file);
            const globalEntity = JSON.parse(await node_fs_1.default.promises.readFile(globalEntityPath, 'utf8'));
            validateSchema('global-data/global-entity', global_data_schemas_1.globalEntitySchemaObject, globalEntity, `The global entity schema "${globalEntityPath}" is not valid:`);
        }
        /**
         * Global resolvers checking
         */
        const globalResolversPath = (0, utilities_1.getGlobalResolversPath)(lang);
        const globalResolverFiles = (await node_fs_1.default.promises.readdir(globalResolversPath)).filter((file) => file.endsWith('.json'));
        for (const file of globalResolverFiles) {
            const globalResolverPath = node_path_1.default.join(globalResolversPath, file);
            const globalResolver = JSON.parse(await node_fs_1.default.promises.readFile(globalResolverPath, 'utf8'));
            validateSchema('global-data/global-resolver', global_data_schemas_1.globalResolverSchemaObject, globalResolver, `The global resolver schema "${globalResolverPath}" is not valid:`);
        }
        /**
         * Global answers checking
         */
        const globalAnswersPath = node_path_1.default.join(constants_1.GLOBAL_DATA_PATH, lang, 'answers.json');
        const answers = JSON.parse(await node_fs_1.default.promises.readFile(globalAnswersPath, 'utf8'));
        validateSchema('global-data/global-answers', GLOBAL_DATA_SCHEMAS.answers, answers, `The global answers schema "${globalAnswersPath}" is not valid:`);
    }
    log_helper_1.LogHelper.success('Global data schemas checked');
    /**
     * Skills data checking
     */
    log_helper_1.LogHelper.info('Checking skills data schemas...');
    const skillDomains = await skill_domain_helper_1.SkillDomainHelper.getSkillDomains();
    for (const [, currentDomain] of skillDomains) {
        /**
         * Domain checking
         */
        const pathToDomain = node_path_1.default.join(currentDomain.path, 'domain.json');
        const domainObject = JSON.parse(await node_fs_1.default.promises.readFile(pathToDomain, 'utf8'));
        validateSchema('skill-schemas/domain', skill_schemas_1.domainSchemaObject, domainObject, `The domain schema "${pathToDomain}" is not valid:`);
        const skillKeys = Object.keys(currentDomain.skills);
        for (const skillKey of skillKeys) {
            const currentSkill = currentDomain.skills[skillKey];
            /**
             * Skills checking
             */
            if (currentSkill) {
                const pathToSkill = node_path_1.default.join(currentSkill.path, 'skill.json');
                const skillObject = JSON.parse(await node_fs_1.default.promises.readFile(pathToSkill, 'utf8'));
                validateSchema('skill-schemas/skill', skill_schemas_1.skillSchemaObject, skillObject, `The skill schema "${pathToSkill}" is not valid:`);
                /**
                 * Skills config checking
                 */
                const pathToSkillConfig = node_path_1.default.join(currentSkill.path, 'config');
                const skillConfigFiles = (await node_fs_1.default.promises.readdir(pathToSkillConfig)).filter((file) => file.endsWith('.json'));
                for (const file of skillConfigFiles) {
                    const skillConfigPath = node_path_1.default.join(pathToSkillConfig, file);
                    const skillConfig = JSON.parse(await node_fs_1.default.promises.readFile(skillConfigPath, 'utf8'));
                    validateSchema('skill-schemas/skill-config', skill_schemas_1.skillConfigSchemaObject, skillConfig, `The skill config schema "${skillConfigPath}" is not valid:`);
                }
            }
        }
    }
    log_helper_1.LogHelper.success('Skills data schemas checked');
    process.exit(0);
})();
