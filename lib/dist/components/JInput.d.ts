import React, { HTMLProps } from 'react';
declare type InputElement = HTMLInputElement | HTMLTextAreaElement;
interface Props {
    onInput: (e: string) => void;
    className?: string;
    is?: 'input' | 'textarea';
    contentClass?: string;
    label?: string;
    dense?: boolean;
    onEnter?: (e: React.KeyboardEvent<InputElement>) => void;
}
declare const JInput: React.FC<Props & Omit<HTMLProps<InputElement>, 'onInput'>>;
export default JInput;
