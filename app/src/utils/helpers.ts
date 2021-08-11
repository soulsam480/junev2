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
