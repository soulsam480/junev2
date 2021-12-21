import React, { MouseEventHandler } from 'react';
interface Props {
    onClick?: MouseEventHandler<HTMLDivElement | HTMLAnchorElement>;
    className?: string;
    closeMenuCallback?: () => void;
}
declare const JMenuItem: React.FC<Props>;
export default JMenuItem;
