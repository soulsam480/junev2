import React, { HTMLProps } from 'react';
export interface JButtonProps extends Omit<HTMLProps<HTMLButtonElement>, 'size' | 'onInput' | 'type'> {
    label?: string;
    icon?: string;
    size?: string;
    sm?: boolean;
    invert?: boolean;
    block?: boolean;
    flat?: boolean;
    color?: string;
    round?: boolean;
    outline?: boolean;
    iconSlot?: React.ReactNode;
    loadingSlot?: React.ReactNode;
    /**
     * should be prefixed with icn: for icon or img: for image or con: for text when avatar prop is used
     */
    avatar?: string;
    avatarRound?: boolean;
    iconRight?: boolean;
    dense?: boolean;
    noBg?: boolean;
    align?: 'left' | 'right' | 'center';
    loading?: boolean;
    labelSlot?: React.ReactNode;
    type?: 'button' | 'submit' | 'reset';
}
declare const JButton: React.FC<JButtonProps>;
export default JButton;
