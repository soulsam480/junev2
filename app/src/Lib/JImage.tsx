import React, { useMemo, useState } from 'react';
import { classNames } from 'src/utils/hepers';

interface Props {
  src: string;
  loading?: 'lazy' | 'eager';
  onError?: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
  onLoad?: (e: React.SyntheticEvent<HTMLImageElement>) => void;
  height?: string;
  width?: string;
  minHeight?: string;
  minWidth?: string;
}

const JImage: React.FC<Props> = ({
  src,
  loading,
  onError,
  onLoad,
  height,
  width,
  minHeight,
  minWidth,
}) => {
  const [isLoading, setLoading] = useState(true);

  let loadTimer: any;

  function handleLoad(e: React.SyntheticEvent<HTMLImageElement, Event>) {
    if (loadTimer === null) {
      return;
    }
    clearTimeout(loadTimer);

    if (!!onLoad) {
      onLoad(e);
    }
    waitForCompleteness(e.target, 1);
  }

  function handleError(e: React.SyntheticEvent<HTMLImageElement, Event>) {
    setLoading(false);
    if (!!onError) {
      onError(e);
    }
  }

  function waitForCompleteness(target: any, count: number) {
    if (loadTimer === null || count === 1000) {
      return;
    }

    // here image laod means there is no error and image downlaod has started
    if (target.complete === true && target.naturalHeight && target.naturalWidth) {
      setLoading(false);
    } else {
      loadTimer = setTimeout(() => {
        waitForCompleteness(target, count + 1);
      }, 50);
    }
  }

  const computedMinHeight = useMemo(() => {
    if (!!isLoading) {
      return minHeight;
    }
    return 'auto';
  }, [minHeight, isLoading]);

  return (
    <div
      className="j-image transition-all ease-in duration-300"
      style={{ height, width, minWidth, minHeight: computedMinHeight }}
    >
      <img
        src={src}
        loading={loading}
        onLoad={handleLoad}
        onError={handleError}
        className={classNames(['j-image__content', isLoading ? 'opacity-0' : 'opacity-100'])}
        style={{ objectFit: 'cover', objectPosition: '50% 50%' }}
      />

      {isLoading && (
        <div className="j-image__loading">
          <div className="w-full h-full bg-warm-gray-400 animate-pulse duration-300 transition-all ease-in"></div>
        </div>
      )}
    </div>
  );
};

export default JImage;
