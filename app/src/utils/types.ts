import { MouseEventHandler } from 'react';

export interface BaseJButtonProps {
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
  avatar?: string;
  avatarRound?: boolean;
  iconRight?: boolean;
  dense?: boolean;
  noBg?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}
