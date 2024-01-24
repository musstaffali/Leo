export declare class StringHelper {
    /**
     * Parse, map (with object) and replace value(s) in a string
     * @param toReplace The string containing the placeholders to replace
     * @param obj The object containing the value(s) to replace with
     * @example findAndMap('Hello %name%!', { '%name%': 'Louis' }) // Hello Louis!
     */
    static findAndMap(toReplace: string, obj: Record<string, unknown>): string;
    /**
     * Set first letter as uppercase
     * @param str String to transform
     * @example ucFirst('hello world') // Hello world
     */
    static ucFirst(str: string): string;
    /**
     * Transform snake_case string to PascalCase
     * @param str String to transform
     * @example snakeToPascalCase('hello_world') // HelloWorld
     */
    static snakeToPascalCase(str: string): string;
    /**
     * Random string
     * @param length Length of the string
     * @example random(6) // 4f3a2b
     */
    static random(length: number): string;
    /**
     * Remove accents
     * @param str String to remove accents
     * @example removeAccents('éèà') // eea
     */
    static removeAccents(str: string): string;
    /**
     * Remove punctuation at the end of the string
     * @param str String to remove punctuation
     * @example removeEndPunctuation('Hello world!') // Hello world
     */
    static removeEndPunctuation(str: string): string;
}
