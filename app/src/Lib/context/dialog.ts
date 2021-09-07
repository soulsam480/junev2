import { createContext } from 'react';

export interface Dialog {
  id: string;
  close: () => void;
}

export const DialogAPI = createContext<{
  dialogs: Dialog[];
  addToDialog: (dialog: Dialog) => void;
  removeFromDialog(id: string): void;
}>({ dialogs: [], addToDialog: null as any, removeFromDialog: null as any });
