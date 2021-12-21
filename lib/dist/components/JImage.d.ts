import React from 'react';
interface Props {
    src: string;
    loading?: 'lazy' | 'eager';
    onError?: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
    onLoad?: (e: React.SyntheticEvent<HTMLImageElement>) => void;
    height?: string;
    width?: string;
    minHeight?: string;
    minWidth?: string;
    style?: React.CSSProperties;
}
declare const JImage: React.FC<Props>;
export default JImage;
