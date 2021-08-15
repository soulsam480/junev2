import { AxiosResponse } from 'axios';
import { useCallback, useEffect, useRef, useState } from 'react';
import { PaginationParams, ResponseSchema } from 'src/utils/types';

export function useClickoutside<T extends HTMLElement>(cb: () => any) {
  const ref = useRef<T>(null);
  const memoCb = useCallback(cb, []);

  useEffect(() => {
    function handleClickOutside(event: any) {
      if (ref.current && !ref.current.contains(event.target)) {
        memoCb();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref]);

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

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowDimensions;
}

export const useHideOnScroll = () => {
  const [isHidden, setIsHidden] = useState(false);
  const prevScrollY = useRef<number>();

  useEffect(() => {
    const onScroll = () => {
      const scrolledDown = window.scrollY > prevScrollY.current!;
      const scrolledUp = !scrolledDown;

      if (scrolledDown && !isHidden) {
        setIsHidden(true);
      } else if (scrolledUp && isHidden) {
        setIsHidden(false);
      }

      prevScrollY.current = window.scrollY;
    };

    window.addEventListener('scroll', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [isHidden]);

  return isHidden;
};

export function useQuery<T, K = any>(
  baseState: T,
  fetcher: (...args: any[]) => Promise<AxiosResponse<T>>,
) {
  const [data, setData] = useState<T>(baseState);
  const [error, setError] = useState<K | null>(null);
  const [isLoading, setLoading] = useState(false);

  function reset() {
    setLoading(false);
    setError(null);
  }

  async function validate(): Promise<T> {
    reset();
    return new Promise(async (resolve, reject) => {
      try {
        setLoading(true);
        const { data: apiData } = await fetcher();

        setData(apiData);
        resolve(apiData);
      } catch (error) {
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

export function usePaginatedQuery<T, K = any>(
  baseState: T[],
  fetcher: (opts: PaginationParams) => Promise<AxiosResponse<ResponseSchema<T[]>>>,
  opts?: {
    limit?: number;
  },
) {
  const [cursor, setCursor] = useState<number | null>(null);
  const [data, setData] = useState(baseState);
  const [error, setError] = useState<K | null>(null);
  const [isLoading, setLoading] = useState(false);
  const [isEnd, setEnd] = useState(false);

  const getPageArgs = (cursor: number | null, limit = 10): PaginationParams => ({ cursor, limit });

  function reset() {
    setLoading(false);
    setError(null);
  }

  async function validate(): Promise<T[]> {
    reset();
    return new Promise(async (resolve, reject) => {
      if (isEnd) return;
      try {
        setLoading(true);
        const {
          data: { data: apiData, next_cursor, has_more },
        } = await fetcher(getPageArgs(cursor, opts?.limit));

        setCursor(next_cursor);
        setData((data) => [...data, ...apiData]);
        resolve(apiData);

        if (!has_more) setEnd(true);
      } catch (error) {
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
