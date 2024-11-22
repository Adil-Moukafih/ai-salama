'use client';

import React, { useState } from 'react';
import { useAlerts, Alert } from '../../hooks/useAlerts';

function AlertCard({ alert }: { alert: Alert }) {
  const getTypeStyles = (type: Alert['type']) => {
    switch (type) {
      case 'critical':
        return {
          text: 'text-[rgb(var(--color-danger))]',
          bg: 'bg-[rgb(var(--color-danger)_/_0.2)]',
          border: 'border-[rgb(var(--color-danger))]'
        };
      case 'warning':
        return {
          text: 'text-[rgb(var(--color-warning))]',
          bg: 'bg-[rgb(var(--color-warning)_/_0.2)]',
          border: 'border-[rgb(var(--color-warning))]'
        };
      case 'info':
        return {
          text: 'text-[rgb(var(--color-info))]',
          bg: 'bg-[rgb(var(--color-info)_/_0.2)]',
          border: 'border-[rgb(var(--color-info))]'
        };
    }
  };

  const styles = getTypeStyles(alert.type);

  return (
    <div 
      className={`
        bg-card/50 rounded-lg p-4 border-l-4 ${styles.border} 
        transition-all duration-200
      `}
    >
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
        </div>
      </div>
    </div>
  );
}

export default function AlertPanel() {
  const [autoRefreshInterval, setAutoRefreshInterval] = useState<number | null>(null);
  const { alerts, loading, error, refetch } = useAlerts(5, 0, autoRefreshInterval || undefined);

  const toggleAutoRefresh = () => {
    setAutoRefreshInterval(current => current ? null : 1000);
  };

  if (loading) {
    return (
      <div className="bg-card rounded-lg p-6 border border-app">
        
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
          <button 
            onClick={toggleAutoRefresh}
            className={`text-xs px-2 py-1 rounded ${
              autoRefreshInterval 
                ? 'bg-green-500 text-white' 
                : 'bg-blue-500 text-white'
            }`}
          >
            {autoRefreshInterval ? 'Pause' : 'Auto Refresh'}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {alerts.length === 0 ? (
          <p className="text-center text-app-secondary">No active alerts</p>
        ) : (
          alerts.map((alert) => (
            <AlertCard key={`${alert.id}-${alert.timestamp}`} alert={alert} />
          ))
        )}
      </div>
    </div>
  );
}
