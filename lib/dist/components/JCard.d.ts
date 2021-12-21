import React, { HTMLProps } from 'react';
export interface JCardProps extends HTMLProps<HTMLDivElement> {
    className?: string;
    loading?: boolean;
    height?: string;
    width?: string;
    headerSlot?: React.ReactNode;
    footerSlot?: React.ReactNode;
    contentSlot?: React.ReactNode;
    noBg?: boolean;
    invert?: boolean;
    flat?: boolean;
    outline?: boolean;
    round?: boolean;
    block?: boolean;
    separators?: boolean;
}
declare const JCard: React.FC<JCardProps>;
export default JCard;
