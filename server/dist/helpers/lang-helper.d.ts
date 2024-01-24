import type { LongLanguageCode, ShortLanguageCode } from '../types';
export declare class LangHelper {
    /**
     * Get short language codes
     * @example getShortCodes() // ["en", "fr"]
     */
    static getShortCodes(): ShortLanguageCode[];
    /**
     * Get long language code of the given short language code
     * @param shortCode The short language code of the language
     * @example getLongCode('en') // en-US
     */
    static getLongCode(shortCode: ShortLanguageCode): LongLanguageCode;
    /**
     * Get short language code of the given long language code
     * @param longCode The long language code of the language
     * @example getShortCode('en-US') // en
     */
    static getShortCode(longCode: LongLanguageCode): ShortLanguageCode;
}
