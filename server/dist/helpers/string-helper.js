"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StringHelper = void 0;
class StringHelper {
    /**
     * Parse, map (with object) and replace value(s) in a string
     * @param toReplace The string containing the placeholders to replace
     * @param obj The object containing the value(s) to replace with
     * @example findAndMap('Hello %name%!', { '%name%': 'Louis' }) // Hello Louis!
     */
    static findAndMap(toReplace, obj) {
        return toReplace.replace(new RegExp(Object.keys(obj).join('|'), 'gi'), (matched) => obj[matched]);
    }
    /**
     * Set first letter as uppercase
     * @param str String to transform
     * @example ucFirst('hello world') // Hello world
     */
    static ucFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    /**
     * Transform snake_case string to PascalCase
     * @param str String to transform
     * @example snakeToPascalCase('hello_world') // HelloWorld
     */
    static snakeToPascalCase(str) {
        return str
            .split('_')
            .map((chunk) => this.ucFirst(chunk))
            .join('');
    }
    /**
     * Random string
     * @param length Length of the string
     * @example random(6) // 4f3a2b
     */
    static random(length) {
        return Math.random().toString(36).slice(-length);
    }
    /**
     * Remove accents
     * @param str String to remove accents
     * @example removeAccents('éèà') // eea
     */
    static removeAccents(str) {
        return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    }
    /**
     * Remove punctuation at the end of the string
     * @param str String to remove punctuation
     * @example removeEndPunctuation('Hello world!') // Hello world
     */
    static removeEndPunctuation(str) {
        const punctuations = ['.', ';', ':', '?', '!'];
        const lastChar = str.charAt(str.length - 1);
        if (punctuations.includes(lastChar)) {
            return str.slice(0, -1);
        }
        return str;
    }
}
exports.StringHelper = StringHelper;
