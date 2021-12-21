import React from 'react';
interface Props {
    /**
     * Avatar image src
     */
    src?: string;
    /**
     * Avatar size in pixels
     */
    size?: string;
    /**
     * Make the avar round/circle
     */
    rounded?: boolean;
    /**
     * Slot content for the avatar
     */
    imageSlot?: React.ReactNode;
    /**
     * icon follwing iconify naming convention
     */
    icon?: string;
    /**
     * Icon size in pixels
     */
    iconSize?: string;
    /**
     * Custom css class
     */
    contentClass?: string;
    /**
     * For custom text
     */
    content?: string;
}
declare const JAvatar: React.FC<Props>;
export default JAvatar;
