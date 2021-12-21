export function randomId(len?: number) {
  function dec2hex(dec: any) {
    return dec.toString(16).padStart(2, '0');
  }

  const arr = new Uint8Array((len || 30) / 2);

  window.crypto.getRandomValues(arr);

  return Array.from(arr, dec2hex).join('');
}

/**
 * Ensures component type is not overwritten
 * @borrows https://gist.github.com/TheSpicyMeatball/47f74d36aa9ebfab5ab4c158b5c5906a#file-utils-js
 *
 * @param {string} expectedType - The expected type to validate against
 * @returns {func} Custom PropTypes validation function
 */
export const typeValidation =
  (expectedType: string) => (props: any, propName: any, componentName: any) => {
    if (props[propName] !== expectedType) {
      return new Error(
        `'${propName}' in '${componentName}'\n\nYou may NOT pass in a prop value for '${propName}'. ` +
          'It had 2 underscores in the prop name for a reason. So, if you would kindly remove it, we can all go about our error free day.\n',
      );
    }
    return null;
  };

function generateShades(color: string, type: 'text' | 'bg', shaderange: number) {
  return [...Array(shaderange).keys()]
    .map((e) => !!e && `${type}-${color}-${e * 100}`)
    .filter((x) => typeof x === 'string');
}

export const JuneTWindSafelist = ['fill-current text-red-700', generateShades('lime', 'text', 10)];
