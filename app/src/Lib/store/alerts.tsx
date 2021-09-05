import create, { State } from 'zustand';
import { v1 as uuid } from 'uuid';
import { Alert } from '../JAlerts';

export interface AlertState extends State {
  alerts: Alert[];
  setAlert: (payload: Alert) => void;
}

export const useAlert = create<AlertState>((set, get) => ({
  alerts: [],
  setAlert: (load) => {
    let lastIdx: string | null = uuid();
    set({ alerts: [...get().alerts, { ...load, id: lastIdx }] });

    const timeout = setTimeout(() => {
      const alerts = get().alerts;
      alerts.shift();

      set({ alerts: [...alerts] });
      lastIdx = null;

      clearTimeout(timeout);
    }, 2000);
  },
}));
