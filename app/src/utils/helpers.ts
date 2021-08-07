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
 *
 * @borrows https://github.com/lovasoa/react-contenteditable/blob/master/src/react-contenteditable.tsx
 * @license MIT
 */
export function replaceCaret(el: HTMLElement) {
  // Place the caret at the end of the element
  const target = document.createTextNode('');
  el.appendChild(target);
  // do not move caret if element was not focused
  const isTargetFocused = document.activeElement === el;
  if (target !== null && target.nodeValue !== null && isTargetFocused) {
    var sel = window.getSelection();
    if (sel !== null) {
      var range = document.createRange();
      range.setStart(target, target.nodeValue.length);
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);
    }
    if (el instanceof HTMLElement) el.focus();
  }
}
