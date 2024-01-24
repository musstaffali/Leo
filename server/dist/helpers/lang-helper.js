"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LangHelper = void 0;
const langs_json_1 = require("../../../core/langs.json");
class LangHelper {
    /**
     * Get short language codes
     * @example getShortCodes() // ["en", "fr"]
     */
    static getShortCodes() {
        const longLanguages = Object.keys(langs_json_1.langs);
        return longLanguages.map((lang) => langs_json_1.langs[lang].short);
    }
    /**
     * Get long language code of the given short language code
     * @param shortCode The short language code of the language
     * @example getLongCode('en') // en-US
     */
    static getLongCode(shortCode) {
        for (const longLanguage in langs_json_1.langs) {
            const longLanguageType = longLanguage;
            const lang = langs_json_1.langs[longLanguageType];
            if (lang.short === shortCode) {
                return longLanguageType;
            }
        }
        return 'en-US';
    }
    /**
     * Get short language code of the given long language code
     * @param longCode The long language code of the language
     * @example getShortCode('en-US') // en
     */
    static getShortCode(longCode) {
        return langs_json_1.langs[longCode].short;
    }
}
exports.LangHelper = LangHelper;
