import { AxiosResponse } from 'axios';
import { useCallback, useEffect, useRef, useState } from 'react';
import { PaginationParams, ResponseSchema } from 'src/Shared/services/post';

export function useClickoutside<T extends HTMLElement>(cb: () => any) {
  const ref = useRef<T>(null);
  useEffect(() => {
    function handleClickOutside(event: any) {
      if (ref.current && !ref.current.contains(event.target)) {
        cb();
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

export function useQuery<T, K>(
  baseState: T,
  fetcher: (...args: any[]) => Promise<AxiosResponse<T>>,
) {
  const [data, setData] = useState<T>(baseState);
  const [error, setError] = useState<K | null>(null);
  const [isLoading, setLoading] = useState(false);

  async function validate() {
    try {
      setLoading(true);
      const { data } = await fetcher();
      setData(data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }

  return {
    data,
    validate: useCallback(validate, [data]),
    error,
    isLoading,
  };
}

export function usePaginatedQuery<T, K>(
  baseState: T[],
  fetcher: (opts: PaginationParams) => Promise<AxiosResponse<ResponseSchema<T[]>>>,
  opts?: {
    initialPage?: number;
    limit?: number;
  },
) {
  const [page, setPage] = useState(opts?.initialPage || 0);
  const [data, setData] = useState(baseState);
  const [error, setError] = useState<K | null>(null);
  const [isLoading, setLoading] = useState(false);

  const getPageArgs = (page: number, limit = 10): PaginationParams => ({ page, limit });

  async function validate() {
    try {
      setLoading(true);
      const {
        data: { data: apiData },
      } = await fetcher(getPageArgs(page, opts?.limit));

      setPage(page + 1);

      setData([...data, ...apiData]);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }

  return {
    data,
    validate: useCallback(validate, [page, data]),
    error,
    isLoading,
  };
}

export function useDebounce(cb: (...args: any[]) => any, ms?: number) {
  const memoizedCb = useCallback(cb, []);

  let timeout: NodeJS.Timeout;

  return (...args: []) => {
    clearTimeout(timeout);
    //@ts-ignore
    timeout = setTimeout(() => memoizedCb.apply(this, args), ms || 2000);
  };
}
