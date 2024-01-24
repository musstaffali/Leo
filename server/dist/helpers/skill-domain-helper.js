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
exports.SkillDomainHelper = void 0;
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
const constants_1 = require("../constants");
class SkillDomainHelper {
    /**
     * List all skills domains with skills data inside
     */
    static async getSkillDomains() {
        const skillDomains = new Map();
        await Promise.all((await node_fs_1.default.promises.readdir(constants_1.SKILLS_PATH)).map(async (entity) => {
            const domainPath = node_path_1.default.join(constants_1.SKILLS_PATH, entity);
            if ((await node_fs_1.default.promises.stat(domainPath)).isDirectory()) {
                const skills = {};
                const { name: domainName } = (await Promise.resolve(`${node_path_1.default.join(domainPath, 'domain.json')}`).then(s => __importStar(require(s))));
                const skillFolders = await node_fs_1.default.promises.readdir(domainPath);
                for (let i = 0; i < skillFolders.length; i += 1) {
                    const skillAliasName = skillFolders[i];
                    const skillPath = node_path_1.default.join(domainPath, skillAliasName);
                    if ((await node_fs_1.default.promises.stat(skillPath)).isDirectory()) {
                        const skillJSONPath = node_path_1.default.join(skillPath, 'skill.json');
                        if (!node_fs_1.default.existsSync(skillJSONPath)) {
                            continue;
                        }
                        const { name: skillName, bridge: skillBridge } = JSON.parse(await node_fs_1.default.promises.readFile(skillJSONPath, 'utf8'));
                        skills[skillName] = {
                            name: skillAliasName,
                            path: skillPath,
                            bridge: skillBridge
                        };
                    }
                    const skillDomain = {
                        name: entity,
                        path: domainPath,
                        skills
                    };
                    skillDomains.set(domainName, skillDomain);
                }
            }
            return null;
        }));
        return skillDomains;
    }
    /**
     * Get information of a specific domain
     * @param domain Domain to get info from
     */
    static async getSkillDomainInfo(domain) {
        return JSON.parse(await node_fs_1.default.promises.readFile(node_path_1.default.join(constants_1.SKILLS_PATH, domain, 'domain.json'), 'utf8'));
    }
    /**
     * Get information of a specific skill
     * @param domain Domain where the skill belongs
     * @param skill Skill to get info from
     */
    static async getSkillInfo(domain, skill) {
        return JSON.parse(await node_fs_1.default.promises.readFile(node_path_1.default.join(constants_1.SKILLS_PATH, domain, skill, 'skill.json'), 'utf8'));
    }
    /**
     * Get skill path
     * @param domain Domain where the skill belongs
     * @param skill Skill to get path from
     */
    static getSkillPath(domain, skill) {
        return node_path_1.default.join(constants_1.SKILLS_PATH, domain, skill);
    }
    /**
     * Get skill config
     * @param configFilePath Path of the skill config file
     * @param lang Language short code
     */
    static async getSkillConfig(configFilePath, lang) {
        const sharedDataPath = node_path_1.default.join(process.cwd(), 'core', 'data', lang);
        const configData = JSON.parse(await node_fs_1.default.promises.readFile(configFilePath, 'utf8'));
        const result = {
            ...configData,
            entities: {}
        };
        const { entities } = configData;
        // Load shared data entities if entity = 'xxx.json'
        if (entities) {
            const entitiesKeys = Object.keys(entities);
            await Promise.all(entitiesKeys.map(async (entity) => {
                if (typeof entities[entity] === 'string') {
                    const entityFilePath = node_path_1.default.join(sharedDataPath, entities[entity]);
                    const entityRawData = await node_fs_1.default.promises.readFile(entityFilePath, {
                        encoding: 'utf8'
                    });
                    result.entities[entity] = JSON.parse(entityRawData);
                }
            }));
            configData.entities = entities;
        }
        return result;
    }
}
exports.SkillDomainHelper = SkillDomainHelper;
