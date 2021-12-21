import { useCallback, useEffect, useRef } from 'react';

export function useClickoutside<T extends HTMLElement>(cb: () => any) {
  const ref = useRef<T>(null);
  const memoCb = useCallback(cb, []);

  useWindowEvent('mousedown', (e) => {
    if (ref.current && !ref.current.contains(e.target as any)) {
      memoCb();
    }
  });

  return [ref];
}

/**
 * @license MIT
 * @borrows https://github.com/tailwindlabs/headlessui/blob/main/packages/@headlessui-react/src/hooks/use-window-event.ts
 */
export function useWindowEvent<TType extends keyof WindowEventMap>(
  type: TType,
  listener: (this: Window, ev: WindowEventMap[TType]) => any,
  options?: boolean | AddEventListenerOptions,
) {
  let listenerRef = useRef(listener);
  listenerRef.current = listener;

  useEffect(() => {
    function handler(event: WindowEventMap[TType]) {
      listenerRef.current.call(window, event);
    }

    window.addEventListener(type, handler, options);
    return () => window.removeEventListener(type, handler, options);
  }, [type, options]);
}
