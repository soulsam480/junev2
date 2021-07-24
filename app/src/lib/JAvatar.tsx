import React from 'react';
import { classNames } from 'src/utils/hepers';
import JIcon from 'src/lib/JIcon';

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

const JAvatar: React.FC<Props> = ({
  src,
  size,
  rounded,
  imageSlot,
  iconSize,
  icon,
  contentClass,
  content,
}) => {
  return (
    <div
      className={classNames([
        'inline-block text-5xl align-middle relative',
        `${contentClass ?? ''}`,
      ])}
      style={{
        fontSize: size || '40px',
        borderRadius: rounded ? '50%' : 'unset',
        height: '1em',
        width: '1em',
      }}
    >
      <div
        className="flex items-center justify-center overflow-hidden"
        style={{
          borderRadius: 'inherit',
          height: 'inherit',
          width: 'inherit',
        }}
      >
        <>
          {imageSlot ? (
            imageSlot
          ) : src ? (
            <img
              style={{ borderRadius: 'inherit', height: 'inherit', width: 'inherit' }}
              src={src}
              alt={src}
            />
          ) : icon ? (
            <JIcon icon={icon} size={iconSize} />
          ) : (
            content && <div style={{ fontSize: iconSize || '16px' }}>{content.toUpperCase()}</div>
          )}
        </>
      </div>
    </div>
  );
};

export default JAvatar;
