import React, { HTMLProps } from 'react';
export declare enum ElementTypes {
    JPanel = "JPanel",
    JTabs = "JTabs"
}
interface Props extends Omit<HTMLProps<HTMLDivElement>, 'selected'> {
    children: React.ReactNode;
    selected: string;
}
export declare const JPanels: React.FC<Props>;
interface JPanelProps {
    children: React.ReactNode;
    __TYPE?: any;
}
export declare const JPanel: React.FC<JPanelProps>;
declare type TabType = string | {
    label: string;
    icon: string;
};
interface JTabsProps {
    tabs?: TabType[];
    onClick?: (val: string) => void;
    activeClass?: string;
    noLabel?: boolean;
    __TYPE?: any;
}
export declare const JTabs: React.FC<JTabsProps>;
export {};
