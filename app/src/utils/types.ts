import React, { HTMLProps } from 'react';

export interface BaseJButtonProps
  extends Omit<HTMLProps<HTMLButtonElement>, 'size' | 'onInput' | 'type'> {
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
   * should be prefixed with icn: for icon or img: for image when avatar prop is used
   */
  avatar?: string;
  avatarRound?: boolean;
  iconRight?: boolean;
  dense?: boolean;
  noBg?: boolean;
  to?: string;
}

interface TimeStamps {
  createdAt?: Date;
  updatedAt?: Date;
}
export interface User extends TimeStamps {
  id: string;
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

export interface UpdateUserData {
  name?: string;
  username?: string;
  email?: string;
  bio?: string;
  image?: string;
}

export type Reply = Omit<Comment, 'replies' | 'total_replies'>;

export interface Comment extends TimeStamps {
  id: string;
  comment: string;
  user: User;
  likes: string[];
  replies?: Reply[];
  total_likes: number;
  total_replies: number;
}
export interface Post extends TimeStamps {
  id: string;
  user: User;
  content: string;
  url?: string;
  likes: string[];
  comments: Comment[];
  total_comments?: number;
  total_likes?: number;
  is_archived?: boolean;
}

export interface Trigger {
  keyCode?: number | null;
  shiftKey?: boolean;
  ctrlKey?: boolean;
  metaKey?: boolean;
}

export interface Result {
  hookType: hookType;
  cursor: {
    selectionStart: number;
    selectionEnd: number;
    top: number;
    left: number;
    height: number;
  };
  text?: string;
}

export type hookType = 'start' | 'cancel' | 'typing';

export interface ResponseSchema<T = any> {
  data: T;
  total_count?: number;
  has_more?: boolean;
  next_cursor?: number | null;
}

export interface PaginationParams {
  cursor: number | null;
  limit?: number;
}
