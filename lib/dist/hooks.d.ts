/// <reference types="react" />
export declare function useClickoutside<T extends HTMLElement>(cb: () => any): import("react").RefObject<T>[];
/**
 * @license MIT
 * @borrows https://github.com/tailwindlabs/headlessui/blob/main/packages/@headlessui-react/src/hooks/use-window-event.ts
 */
export declare function useWindowEvent<TType extends keyof WindowEventMap>(type: TType, listener: (this: Window, ev: WindowEventMap[TType]) => any, options?: boolean | AddEventListenerOptions): void;
