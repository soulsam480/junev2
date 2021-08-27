/**
 * @borrows https://github.com/quasarframework/quasar/blob/dev/ui/src/components/ajax-bar
 * @author Quasar original authors
 */

// toDO: Fix this

import React, { CSSProperties, HTMLProps, useEffect, useMemo, useRef, useState } from 'react';
import { between } from 'src/utils/helpers';
import { useMountedRef } from 'src/utils/hooks';

interface Props {}

const xhr = XMLHttpRequest,
  send = xhr.prototype.send,
  stackStart: any[] = [],
  stackStop: any[] = [];

let highjackCount = 0;

interface TranslateParams {
  p: number;
  pos: string;
  active: boolean;
  horiz: boolean;
  reverse: boolean;
  dir: number;
}

function translate({ p, pos, active, horiz, reverse, dir }: TranslateParams): {
  transform: string;
} {
  let x = 1,
    y = 1;

  if (horiz) {
    if (reverse) {
      x = -1;
    }
    if (pos === 'bottom') {
      y = -1;
    }
    return { transform: `translate3d(${x * (p - 100)}%,${active ? 0 : y * -200}%,0)` };
  }

  if (reverse) {
    y = -1;
  }
  if (pos === 'right') {
    x = -1;
  }

  return { transform: `translate3d(${active ? 0 : dir * x * -200}%,${y * (p - 100)}%,0)` };
}

function inc(p: number, amount?: any) {
  if (typeof amount !== 'number') {
    if (p < 25) {
      amount = Math.random() * 3 + 3;
    } else if (p < 65) {
      amount = Math.random() * 3;
    } else if (p < 85) {
      amount = Math.random() * 2;
    } else if (p < 99) {
      amount = 0.6;
    } else {
      amount = 0;
    }
  }
  return between(p + amount, 0, 100);
}

function highjackAjax(start: () => any, stop: () => any) {
  stackStart.push(start);
  stackStop.push(stop);

  highjackCount++;

  if (highjackCount > 1) {
    return;
  }

  function endHandler() {
    stackStop.forEach((fn) => {
      fn();
    });
  }

  xhr.prototype.send = function (/* ...args */) {
    stackStart.forEach((fn) => {
      fn();
    });

    this.addEventListener('loadend', endHandler, false);

    //@ts-ignore
    send.apply(this, arguments);
  };
}

function restoreAjax(start: () => any, stop: () => any) {
  stackStart.splice(stackStart.indexOf(start), 1);
  stackStop.splice(stackStop.indexOf(stop), 1);

  highjackCount = Math.max(0, highjackCount - 1);

  if (highjackCount === 0) {
    xhr.prototype.send = send;
  }
}

const JBarLoader: React.FC<Props> = () => {
  const [progress, setProgress] = useState(0);
  const [onScreen, setOnScreen] = useState(false);

  const { mountedRef } = useMountedRef();

  let calls = useRef(0);
  let timer = useRef<number>();
  let speed = useRef<number>();

  const styles = useMemo<CSSProperties>(() => {
    const active = onScreen;

    const obj = translate({
      p: progress,
      pos: 'top',
      active,
      horiz: true,
      reverse: false,
      dir: 1,
    });

    return { ...obj, height: '3px', opacity: active ? 1 : 0 };
  }, [onScreen, progress]);

  const attributes = useMemo<HTMLProps<HTMLDivElement>>(
    () =>
      onScreen === true
        ? {
            role: 'progressbar',
            'aria-valuemin': 0,
            'aria-valuemax': 100,
            'aria-valuenow': progress,
          }
        : { 'aria-hidden': 'true' },
    [onScreen, progress],
  );

  function start(newSpeed = 300) {
    const oldSpeed = speed.current;
    speed.current = Math.max(0, newSpeed) || 0;

    calls.current++;

    if (calls.current > 1) {
      if (oldSpeed === 0 && newSpeed > 0) {
        planNextStep();
      } else if (oldSpeed! > 0 && newSpeed <= 0) {
        clearTimeout(timer.current);
      }
      return;
    }

    clearTimeout(timer.current);

    if (!mountedRef.current) return;
    setProgress(0);

    if (onScreen === true) {
      return;
    }

    if (!mountedRef.current) return;
    setOnScreen(true);

    timer.current = setTimeout(() => {
      newSpeed > 0 && planNextStep();
    }, 100);
  }

  function increment(amount?: any) {
    if (calls.current > 0) {
      if (!mountedRef.current) return;
      setProgress(inc(progress, amount));
    }
  }

  function stop() {
    calls.current = Math.max(0, calls.current - 1);
    if (calls.current > 0) {
      return;
    }

    clearTimeout(timer.current);

    const end = () => {
      if (!mountedRef.current) return;
      setProgress(100);

      timer.current = setTimeout(() => {
        if (!mountedRef.current) return;
        setOnScreen(false);
      }, 1000);
    };

    if (progress === 0) {
      timer.current = setTimeout(end, 1);
    } else {
      end();
    }
  }

  function planNextStep() {
    if (progress < 100) {
      timer.current = setTimeout(() => {
        increment();

        planNextStep();
      }, speed.current);
    }
  }

  useEffect(() => {
    if (!mountedRef.current) return;
    highjackAjax(start, stop);

    () => {
      clearTimeout(timer.current);
      restoreAjax(start, stop);
    };
  }, []);

  return <div style={styles} {...attributes} className="j-bar-loader"></div>;
};

export default JBarLoader;
