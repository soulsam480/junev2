import React, { MouseEvent } from 'react';
import { JButtonProps } from './JButton';
export declare type optionType = string | {
    [k in 'label' | 'value']: any;
};
export declare type optionValMethod = (option: string | Record<string, any>, optionKey?: string) => string;
interface Props extends JButtonProps {
    options?: optionType[];
    optionKey?: 'label' | 'value';
    value?: string;
    listAlign?: 'left' | 'right';
    onInput?: (val: string, e: MouseEvent) => void;
    optionSlot?: (option: string | Record<string, any>, getOptionVal: optionValMethod) => React.ReactNode;
    children?: (ctx: {
        options?: optionType[];
        optionClasses: (option: string | Record<string, any>, optionKey?: string) => string[];
        closeMenu(val?: boolean): void;
        getOptionVal: optionValMethod;
    }) => React.ReactNode;
}
declare const JMenu: React.FC<Props>;
export default JMenu;
