import type { ShortLanguageCode } from './types';
/**
 * Files
 */
export declare function isFileEmpty(path: string): Promise<boolean>;
/**
 * Paths
 */
export declare function getGlobalEntitiesPath(lang: ShortLanguageCode): string;
export declare function getGlobalResolversPath(lang: ShortLanguageCode): string;
