import axios from 'axios';

export const api = axios.create({ baseURL: import.meta.env.VITE_API });

export function setApiToken(token: string) {
  api.defaults.headers['authorization'] = `Bearer ${token}`;
}

export function classNames(
  classes:
    | string
    | Record<string, boolean | undefined>
    | (string | Record<string, boolean | undefined>)[],
) {
  if (typeof classes === 'string') return classes;
  if (!Array.isArray(classes)) {
    const toBeClasses = Object.keys(classes)
      .map((key) => (classes[key] ? key : null))
      .filter((x) => x);
    return toBeClasses.join(' ');
  }
  const fromArray = classes.map((el) => {
    if (typeof el === 'string') return el;
    return Object.keys(el)
      .map((key) => (el[key] ? key : null))
      .filter((x) => x)
      .join(' ');
  });
  return fromArray.filter((x) => x).join(' ');
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
