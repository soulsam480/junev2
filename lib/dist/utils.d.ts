export declare function randomId(len?: number): string;
/**
 * Ensures component type is not overwritten
 * @borrows https://gist.github.com/TheSpicyMeatball/47f74d36aa9ebfab5ab4c158b5c5906a#file-utils-js
 *
 * @param {string} expectedType - The expected type to validate against
 * @returns {func} Custom PropTypes validation function
 */
export declare const typeValidation: (expectedType: string) => (props: any, propName: any, componentName: any) => Error | null;
export declare const JuneTWindSafelist: (string | (string | false)[])[];
