'use client';

import { useAlerts, Alert } from '@/hooks/useAlerts';

interface AlertCardProps {
  alert: Alert;
}

function AlertCard({ alert }: AlertCardProps) {
  const getTypeStyles = (type: Alert['type']) => {
    switch (type) {
      case 'critical':
        return {
          text: 'text-[rgb(var(--color-danger))]',
          bg: 'bg-[rgb(var(--color-danger)_/_0.2)]',
          border: 'border-[rgb(var(--color-danger))]',
          glow: 'alert-glow-red'
        };
      case 'warning':
        return {
          text: 'text-[rgb(var(--color-warning))]',
          bg: 'bg-[rgb(var(--color-warning)_/_0.2)]',
          border: 'border-[rgb(var(--color-warning))]',
          glow: 'alert-glow-yellow'
        };
      case 'info':
        return {
          text: 'text-[rgb(var(--color-info))]',
          bg: 'bg-[rgb(var(--color-info)_/_0.2)]',
          border: 'border-[rgb(var(--color-info))]',
          glow: ''
        };
    }
  };

  const styles = getTypeStyles(alert.type);

  return (
    <div className={`bg-card/50 rounded-lg p-4 border-l-4 ${styles.border} hover-scale ${styles.glow}`}>
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <span className={`${styles.text} text-xs font-semibold`}>
              {alert.type.toUpperCase()}
            </span>
            <span className="text-app-tertiary text-xs">{alert.timestamp}</span>
          </div>
          <h3 className="font-medium mt-1 text-app-primary">{alert.object_detected || 'Unspecified Object'}</h3>
          <p className="text-sm text-app-secondary mt-1">{alert.details}</p>
        </div>
        <div className="flex flex-col items-end">
          <span className={`text-xs ${styles.bg} ${styles.text} px-2 py-1 rounded-full`}>
            {alert.location}
          </span>
          <button className="mt-2 text-xs text-[rgb(var(--color-primary))] hover:text-[rgb(var(--color-primary)_/_0.8)]">
            View Details
          </button>
        </div>
      </div>
      <div className="mt-3 flex items-center space-x-3">
        {alert.actions?.map((action, idx) => (
          <button
            key={idx}
            className={`text-xs px-3 py-1 rounded-lg text-white transition-colors ${
              action === 'Acknowledge'
                ? 'bg-[rgb(var(--color-success))] hover:bg-[rgb(var(--color-success)_/_0.8)]'
                : action === 'Monitor'
                ? 'bg-[rgb(var(--color-info))] hover:bg-[rgb(var(--color-info)_/_0.8)]'
                : 'bg-[rgb(var(--color-primary))] hover:bg-[rgb(var(--color-primary)_/_0.8)]'
            }`}
          >
            {action}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function AlertPanel() {
  const { alerts, loading, error, refetch } = useAlerts(5);  // Fetch 5 most recent alerts

  if (loading) {
    return (
      <div className="bg-card rounded-lg p-6 border border-app">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-app-primary">Active Alerts</h2>
        </div>
        <div className="space-y-4">
          <div className="animate-pulse bg-gray-200 h-24 w-full rounded-lg"></div>
          <div className="animate-pulse bg-gray-200 h-24 w-full rounded-lg"></div>
          <div className="animate-pulse bg-gray-200 h-24 w-full rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-card rounded-lg p-6 border border-app text-red-500">
        Failed to load alerts. {error}
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg p-6 border border-app">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-app-primary">Active Alerts</h2>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-app-secondary">Auto-refresh:</span>
          <button 
            onClick={refetch}
            className="text-xs px-2 py-1 bg-[rgb(var(--color-primary))] text-white rounded hover:bg-[rgb(var(--color-primary)_/_0.8)] transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {alerts.length === 0 ? (
          <p className="text-center text-app-secondary">No active alerts</p>
        ) : (
          alerts.map((alert) => (
            <AlertCard key={alert.id} alert={alert} />
          ))
        )}
      </div>
    </div>
  );
}
