import React from 'react';
import { useAlerts } from './hook';

export default function AlertsDashboard() {
    const { data: alerts = [], isLoading } = useAlerts();
    if (isLoading) return <div>Loading alerts…</div>;

    if (alerts.length === 0) {
        return <div>No low-stock materials 🎉</div>;
    }

    return (
        <div className="max-w-md mx-auto space-y-4">
            <h2 className="text-xl font-heading">Low-Stock Alerts</h2>
            <ul className="space-y-2">
                {alerts.map(a => (
                    <li key={a.id} className="bg-parchment p-4 rounded shadow">
                        <strong>{a.rawMaterialName}</strong> is low: {a.currentQty} ≤ {a.minThreshold}
                    </li>
                ))}
            </ul>
        </div>
    );
}
