import { AxiosResponse } from 'axios';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useUserStore } from 'src/User/store/useUserStore';
import { PaginationParams, ResponseSchema } from 'src/utils/types';
import { intervalRef, setApiToken } from './helpers';

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

export function useScreenWidth() {
  function getWindowDimensions() {
    const { innerWidth: width } = window;
    return {
      width,
    };
  }
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

  useWindowEvent('resize', () => {
    setWindowDimensions(getWindowDimensions());
  });

  return windowDimensions;
}

export const useHideOnScroll = () => {
  const [isHidden, setIsHidden] = useState(false);
  const prevScrollY = useRef<number>();

  useWindowEvent('scroll', (e) => {
    const scrolledDown = window.scrollY > prevScrollY.current!;
    const scrolledUp = !scrolledDown;

    if (scrolledDown && !isHidden) {
      setIsHidden(true);
    } else if (scrolledUp && isHidden) {
      setIsHidden(false);
    }

    prevScrollY.current = window.scrollY;
  });

  return isHidden;
};

type QueryInstance<T, P extends any[], K> = {
  data: T;
  validate: (...args: P) => Promise<T>;
  error: K | null;
  isLoading: boolean;
  forceValidate: React.Dispatch<React.SetStateAction<T>>;
};

export function useQuery<T, P extends any[] = [], K = any>(
  baseState: T,
  fetcher: (...args: P[]) => Promise<AxiosResponse<T>>,
): QueryInstance<T, P, K> {
  const [data, setData] = useState<T>(baseState);
  const [error, setError] = useState<K | null>(null);
  const [isLoading, setLoading] = useState(false);
  const { mountedRef } = useMountedRef();

  function reset() {
    setLoading(false);
    setError(null);
  }

  async function validate(...args: P): Promise<T> {
    reset();
    return new Promise(async (resolve, reject) => {
      try {
        setLoading(true);
        const { data: apiData } = await fetcher.call(null, args);

        if (!mountedRef.current) return;
        setData(apiData);
        resolve(apiData);
      } catch (error) {
        //@ts-ignore
        setError(error);
        reject(error);
      } finally {
        setLoading(false);
      }
    });
  }

  return {
    data,
    validate: useCallback(validate, [data]),
    error,
    isLoading,
    forceValidate: setData,
  };
}

type PaginatedQueryInstance<T, K> = {
  data: T[];
  validate: () => Promise<T[]>;
  error: K | null;
  isLoading: boolean;
  isEnd: boolean;
  forceValidate: React.Dispatch<React.SetStateAction<T[]>>;
  reset(): void;
};

/**
 * Cursor based query hook for listing API calls
 * @param baseState  base hook state
 * @param fetcher fetcher that return a promise
 * @param opts hook options
 * @returns hook instance with an array of results
 */
export function usePaginatedQuery<T, K = any>(
  baseState: T[],
  fetcher: (opts: PaginationParams) => Promise<AxiosResponse<ResponseSchema<T[]>>>,
  opts?: {
    limit?: number;
  },
): PaginatedQueryInstance<T, K> {
  const cursor = useRef<number | null>(null);
  const [data, setData] = useState(baseState);
  const [error, setError] = useState<K | null>(null);
  const [isLoading, setLoading] = useState(false);
  const [isEnd, setEnd] = useState(false);
  const { mountedRef } = useMountedRef();

  const getPageArgs = (cursor: number | null, limit = 10): PaginationParams => ({ cursor, limit });

  function reset() {
    setLoading(false);
    setError(null);
  }

  function resetQuery() {
    cursor.current = null;
    setData([]);
    setEnd(false);

    reset();
  }

  async function validate(): Promise<T[]> {
    reset();

    return new Promise(async (resolve, reject) => {
      if (isEnd) return;

      try {
        setLoading(true);
        const {
          data: { data: apiData, next_cursor, has_more },
        } = await fetcher(getPageArgs(cursor.current, opts?.limit));

        if (mountedRef.current === false) return;

        (cursor.current as any) = next_cursor;
        setData((data) => [...data, ...apiData]);
        resolve(apiData);

        if (!has_more) setEnd(true);
      } catch (error) {
        //@ts-ignore
        setError(error);
        reject(error);
      } finally {
        setLoading(false);
      }
    });
  }

  return {
    data,
    validate: useCallback(validate, [cursor, data]),
    error,
    isLoading,
    isEnd,
    forceValidate: setData,
    reset: resetQuery,
  };
}

/**
 * @borrows https://github.com/jaredLunde/react-hook/blob/master/packages/debounce/src/index.tsx
 * @borrows https://github.com/jaredLunde/react-hook/blob/master/packages/latest/src/index.tsx
 */

const useLatest = <T extends any>(current: T) => {
  const storedValue = useRef(current);
  useEffect(() => {
    storedValue.current = current;
  });
  return storedValue;
};

export const useDebounceCallback = <CallbackArgs extends any[]>(
  callback: (...args: CallbackArgs) => void,
  wait = 100,
  leading = false,
): ((...args: CallbackArgs) => void) => {
  const storedCallback = useLatest(callback);
  const timeout = useRef<ReturnType<typeof setTimeout>>();
  const deps = [wait, leading, storedCallback];

  // Cleans up pending timeouts when the deps change
  useEffect(
    () => () => {
      timeout.current && clearTimeout(timeout.current);
      timeout.current = void 0;
    },
    deps,
  );

  return useCallback(function () {
    // eslint-disable-next-line prefer-rest-params
    const args = arguments;
    const { current } = timeout;
    // Calls on leading edge
    if (current === void 0 && leading) {
      timeout.current = setTimeout(() => {
        timeout.current = void 0;
      }, wait);
      return storedCallback.current.apply(null, args as any);
    }

    // Clear the timeout every call and start waiting again
    current && clearTimeout(current);

    // Waits for `wait` before invoking the callback
    timeout.current = setTimeout(() => {
      timeout.current = void 0;
      storedCallback.current.apply(null, args as any);
    }, wait);
  }, deps);
};

export function logout() {
  if (!useUserStore.getState().isLoggedIn) return;

  setApiToken(null);
  localStorage.removeItem('__auth');

  useUserStore.setState({ user: {} as any, isLoggedIn: false });
}

export function useObserver<T extends HTMLElement>(
  cb: () => Promise<any> | void,
  opts?: IntersectionObserverInit,
) {
  opts = {
    root: opts?.root || null,
    rootMargin: opts?.rootMargin || '0px',
    threshold: opts?.threshold || 0.25,
  };

  const elementRef = useRef<T | null>(null);

  const handleIntersect: IntersectionObserverCallback = (entries) => {
    entries.forEach(async (entry) => {
      if (entry.isIntersecting) {
        await cb();
      }
    });
  };

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersect, opts);
    elementRef.current && observer.observe(elementRef.current);

    return () => {
      elementRef.current && observer.unobserve(elementRef.current);
    };
  }, [elementRef, opts]);

  return [elementRef];
}

export function useMountedRef() {
  const mountedRef = useRef(true);

  useEffect(() => {
    () => (mountedRef.current = false);
  }, []);

  return { mountedRef };
}

/**
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
