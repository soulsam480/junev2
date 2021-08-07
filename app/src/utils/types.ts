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

export interface User {
  id?: string;
  name: string;
  username: string;
  email: string;
  bio?: string;
  image?: string;
  followers?: User[];
  followings?: User[];
  password: string;
  ga_id: string;
  liked_posts?: Post[];
  commented_posts?: Post[];
  liked_comments?: Comment[];
}

export interface Comment {
  id?: string;
  comment: string;
  user: User;
  likes?: User[];
  replies: Comment[];
}
export interface Post {
  id?: string;
  user: User;
  content: string;
  url?: string;
  likes?: User[];
  comments?: Comment[];
}
