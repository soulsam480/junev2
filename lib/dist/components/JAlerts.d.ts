import React from 'react';
export interface Alert {
    icon?: string;
    message: string;
    id?: string;
    type: 'success' | 'danger' | 'warning';
}
export declare const JAlert: React.FC<Alert>;
interface AlertGroupProps {
    alerts: Alert[];
}
export declare const JAlertGroup: React.FC<AlertGroupProps>;
export {};
