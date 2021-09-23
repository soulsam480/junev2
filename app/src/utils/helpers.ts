import axios from 'axios';

export const api = axios.create({ baseURL: import.meta.env.VITE_API });

export function setApiToken(token: string | null) {
  api.defaults.headers['authorization'] = !!token ? `Bearer ${token}` : null;
}

export const getToken = () => localStorage.getItem('__auth');

export function intervalRef(op: 'get' | 'set' = 'get', val?: number) {
  const watcher = localStorage.getItem('__watcher');
  if (op === 'get') return !!watcher ? parseInt(watcher) : null;

  localStorage.setItem('__watcher', `${val}`);
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

export function between(v: number, min: number, max: number) {
  return max <= min ? min : Math.min(max, Math.max(min, v));
}

/**
 * @borrows https://github.com/vueuse/vueuse/blob/main/packages/core/useTimeAgo/index.ts
 * @author anthony fu
 * @license MIT
 */

interface Unit {
  max: number;
  value: number;
  name: string;
}

const UNITS: Unit[] = [
  { max: 60000, value: 1000, name: 'second' },
  { max: 2760000, value: 60000, name: 'minute' },
  { max: 72000000, value: 3600000, name: 'hour' },
  { max: 518400000, value: 86400000, name: 'day' },
  { max: 2419200000, value: 604800000, name: 'week' },
  { max: 28512000000, value: 2592000000, name: 'month' },
  { max: Infinity, value: 31536000000, name: 'year' },
];

const DEFAULT_MESSAGES: { [x: string]: string | ((value: any, isPast: boolean) => string) } = {
  justNow: 'just now',
  past: (n) => (n.match(/\d/) ? `${n} ago` : n),
  future: (n) => (n.match(/\d/) ? `in ${n}` : n),
  month: (n, past) =>
    n === 1 ? (past ? 'last month' : 'next month') : `${n} month${n > 1 ? 's' : ''}`,
  year: (n, past) =>
    n === 1 ? (past ? 'last year' : 'next year') : `${n} year${n > 1 ? 's' : ''}`,
  day: (n, past) => (n === 1 ? (past ? 'yesterday' : 'tomorrow') : `${n} day${n > 1 ? 's' : ''}`),
  week: (n, past) =>
    n === 1 ? (past ? 'last week' : 'next week') : `${n} week${n > 1 ? 's' : ''}`,
  hour: (n) => `${n} hour${n > 1 ? 's' : ''}`,
  minute: (n) => `${n} minute${n > 1 ? 's' : ''}`,
  second: (n) => `${n} second${n > 1 ? 's' : ''}`,
};

export function timeAgo(time: Date | string) {
  const { abs, round } = Math;

  function getTimeago(from: Date, now: Date) {
    const diff = +now - +from;
    const absDiff = abs(diff);

    // less than a minute
    if (absDiff < 60000) return DEFAULT_MESSAGES.justNow;

    for (const unit of UNITS) {
      if (absDiff < unit.max) return format(diff, unit);
    }
  }

  function applyFormat(name: string, val: number | string, isPast: boolean) {
    const formatter = DEFAULT_MESSAGES[name];
    if (typeof formatter === 'function') return formatter(val as never, isPast);
    return formatter.replace('{0}', val.toString());
  }

  function format(diff: number, unit: Unit) {
    const val = round(abs(diff) / unit.value);
    const past = diff > 0;

    const str = applyFormat(unit.name, val, past);
    return applyFormat(past ? 'past' : 'future', str, past);
  }

  return getTimeago(new Date(time), new Date());
}

function dec2hex(dec: any) {
  return dec.toString(16).padStart(2, '0');
}

export function randomId(len?: number) {
  var arr = new Uint8Array((len || 30) / 2);
  window.crypto.getRandomValues(arr);
  return Array.from(arr, dec2hex).join('');
}

export function diffMatcher<T extends Record<string, any>, K>(
  toMatch: T,
  newData: { [x in keyof T]?: T[x] },
): Partial<T> {
  return Object.entries(newData).reduce<Partial<T>>((acc, [key, value]) => {
    if (!(value !== toMatch[key] && value.length > 0)) return acc;
    acc = { ...acc, [key]: value };

    return acc;
  }, {});
}
