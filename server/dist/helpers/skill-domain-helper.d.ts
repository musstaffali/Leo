import type { ShortLanguageCode } from '../types';
import type { GlobalEntitySchema } from '../schemas/global-data-schemas';
import type { DomainSchema, SkillSchema, SkillConfigSchema, SkillBridgeSchema } from '../schemas/skill-schemas';
interface SkillDomain {
    name: string;
    path: string;
    skills: {
        [key: string]: {
            name: string;
            path: string;
            bridge: SkillBridgeSchema;
        };
    };
}
interface SkillConfigWithGlobalEntities extends Omit<SkillConfigSchema, 'entities'> {
    entities: Record<string, GlobalEntitySchema>;
}
export declare class SkillDomainHelper {
    /**
     * List all skills domains with skills data inside
     */
    static getSkillDomains(): Promise<Map<string, SkillDomain>>;
    /**
     * Get information of a specific domain
     * @param domain Domain to get info from
     */
    static getSkillDomainInfo(domain: SkillDomain['name']): Promise<DomainSchema>;
    /**
     * Get information of a specific skill
     * @param domain Domain where the skill belongs
     * @param skill Skill to get info from
     */
    static getSkillInfo(domain: SkillDomain['name'], skill: SkillSchema['name']): Promise<SkillSchema>;
    /**
     * Get skill path
     * @param domain Domain where the skill belongs
     * @param skill Skill to get path from
     */
    static getSkillPath(domain: SkillDomain['name'], skill: SkillSchema['name']): string;
    /**
     * Get skill config
     * @param configFilePath Path of the skill config file
     * @param lang Language short code
     */
    static getSkillConfig(configFilePath: string, lang: ShortLanguageCode): Promise<SkillConfigWithGlobalEntities>;
}
export {};
