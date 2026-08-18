import { create } from 'zustand';

export interface SystemAlert {
  id: string;
  type: 'info' | 'warning' | 'danger' | 'success';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

interface AlertState {
  alerts: SystemAlert[];
  addAlert: (alert: Omit<SystemAlert, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  clearAlerts: () => void;
}

export const useAlertStore = create<AlertState>((set) => ({
  alerts: [
    {
      id: 'alt-01',
      type: 'danger',
      title: 'Safety Stock Breach',
      message: 'SKU-LAPT-001 available quantity is 8 units (Threshold: 10 units).',
      timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
      read: false,
    },
    {
      id: 'alt-02',
      type: 'warning',
      title: 'SLA Risk Countdown',
      message: 'Order ORD-20260818-8001 has 3 hours remaining to SLA breach.',
      timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
      read: false,
    },
    {
      id: 'alt-03',
      type: 'info',
      title: 'Purchase Order Issued',
      message: 'PO-20260818-9182 sent to TechMart Microelectronics India.',
      timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      read: true,
    },
  ],
  addAlert: (alert) =>
    set((state) => ({
      alerts: [
        {
          ...alert,
          id: `alt-${Date.now()}`,
          timestamp: new Date().toISOString(),
          read: false,
        },
        ...state.alerts,
      ],
    })),
  markAsRead: (id) =>
    set((state) => ({
      alerts: state.alerts.map((a) => (a.id === id ? { ...a, read: true } : a)),
    })),
  clearAlerts: () => set({ alerts: [] }),
}));
