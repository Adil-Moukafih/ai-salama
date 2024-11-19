'use client';

import Header from '@/components/shared/Header';
import Sidebar from '@/components/shared/Sidebar';
import { ThemeProvider } from '@/components/shared/ThemeProvider';
import { useState } from 'react';

interface Alert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  title: string;
  location: string;
  time: string;
  details: string;
  actions: string[];
  status: 'active' | 'acknowledged' | 'resolved';
  assignedTo?: string;
  camera?: string;
  timestamp: number;
}

const mockAlerts: Alert[] = [
  {
    id: 'ALT001',
    type: 'critical',
    title: 'Platform Edge Violation',
    location: 'Platform A',
    time: '2 mins ago',
    details: 'Person detected in danger zone near track. Immediate response required.',
    actions: ['Acknowledge', 'Dispatch Security', 'View Camera'],
    status: 'active',
    camera: 'CAM-001',
    timestamp: Date.now() - 120000,
  },
  {
    id: 'ALT002',
    type: 'warning',
    title: 'Track Obstruction',
    location: 'Track B',
    time: '5 mins ago',
    details: 'Object detected on track. Maintenance team notification recommended.',
    actions: ['Acknowledge', 'Dispatch Maintenance'],
    status: 'acknowledged',
    assignedTo: 'Maintenance Team',
    camera: 'CAM-003',
    timestamp: Date.now() - 300000,
  },
  {
    id: 'ALT003',
    type: 'info',
    title: 'Increased Passenger Flow',
    location: 'Platform C',
    time: '15 mins ago',
    details: 'Above average platform occupancy detected. Monitor situation.',
    actions: ['Monitor', 'View Analytics'],
    status: 'active',
    camera: 'CAM-007',
    timestamp: Date.now() - 900000,
  },
  {
    id: 'ALT004',
    type: 'critical',
    title: 'Unauthorized Access',
    location: 'Service Area',
    time: '20 mins ago',
    details: 'Unauthorized personnel detected in restricted area.',
    actions: ['Acknowledge', 'Dispatch Security', 'View Camera'],
    status: 'resolved',
    assignedTo: 'Security Team',
    camera: 'CAM-012',
    timestamp: Date.now() - 1200000,
  },
];

const alertStats = [
  {
    label: 'Active Alerts',
    value: '3',
    icon: 'fas fa-exclamation-circle',
    color: 'bg-[rgb(var(--color-danger))]',
  },
  {
    label: 'Acknowledged',
    value: '7',
    icon: 'fas fa-check-circle',
    color: 'bg-[rgb(var(--color-warning))]',
  },
  {
    label: 'Resolved Today',
    value: '12',
    icon: 'fas fa-check-double',
    color: 'bg-[rgb(var(--color-success))]',
  },
  {
    label: 'Response Time',
    value: '2.5m',
    icon: 'fas fa-clock',
    color: 'bg-[rgb(var(--color-info))]',
  },
];

function AlertCard({ alert }: { alert: Alert }) {
  const getTypeStyles = (type: Alert['type']) => {
    switch (type) {
      case 'critical':
        return {
          text: 'text-[rgb(var(--color-danger))]',
          bg: 'bg-[rgb(var(--color-danger)_/_0.1)]',
          border: 'border-[rgb(var(--color-danger))]',
          glow: 'alert-glow-red'
        };
      case 'warning':
        return {
          text: 'text-[rgb(var(--color-warning))]',
          bg: 'bg-[rgb(var(--color-warning)_/_0.1)]',
          border: 'border-[rgb(var(--color-warning))]',
          glow: 'alert-glow-yellow'
        };
      case 'info':
        return {
          text: 'text-[rgb(var(--color-info))]',
          bg: 'bg-[rgb(var(--color-info)_/_0.1)]',
          border: 'border-[rgb(var(--color-info))]',
          glow: ''
        };
    }
  };

  const getStatusBadge = (status: Alert['status']) => {
    switch (status) {
      case 'active':
        return 'bg-[rgb(var(--color-danger)_/_0.1)] text-[rgb(var(--color-danger))]';
      case 'acknowledged':
        return 'bg-[rgb(var(--color-warning)_/_0.1)] text-[rgb(var(--color-warning))]';
      case 'resolved':
        return 'bg-[rgb(var(--color-success)_/_0.1)] text-[rgb(var(--color-success))]';
    }
  };

  const styles = getTypeStyles(alert.type);

  return (
    <div className={`bg-card rounded-lg p-4 border ${styles.border} hover-scale ${styles.glow}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3">
            <span className={`${styles.text} text-xs font-semibold`}>
              {alert.type.toUpperCase()}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusBadge(alert.status)}`}>
              {alert.status.toUpperCase()}
            </span>
            <span className="text-app-tertiary text-xs">{alert.time}</span>
          </div>
          <div className="flex items-center space-x-2 mt-1">
            <h3 className="font-medium text-app-primary">{alert.title}</h3>
            <span className="text-xs bg-hover px-2 py-0.5 rounded text-app-secondary">
              {alert.id}
            </span>
          </div>
          <p className="text-sm text-app-secondary mt-1">{alert.details}</p>
          {alert.assignedTo && (
            <p className="text-xs text-app-secondary mt-1">
              Assigned to: <span className="text-app-primary">{alert.assignedTo}</span>
            </p>
          )}
        </div>
        <div className="flex flex-col items-end ml-4">
          <div className="flex items-center space-x-2">
            <span className={`text-xs ${styles.bg} ${styles.text} px-2 py-1 rounded-full`}>
              {alert.location}
            </span>
            {alert.camera && (
              <span className="text-xs bg-hover px-2 py-1 rounded-full text-app-secondary">
                {alert.camera}
              </span>
            )}
          </div>
          <button className="mt-2 text-xs text-[rgb(var(--color-primary))] hover:text-[rgb(var(--color-primary)_/_0.8)]">
            View Details
          </button>
        </div>
      </div>
      <div className="mt-3 flex items-center space-x-3">
        {alert.actions.map((action, idx) => (
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

export default function AlertsPage() {
  const [filterType, setFilterType] = useState<'all' | 'critical' | 'warning' | 'info'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'acknowledged' | 'resolved'>('all');
  const [sortBy, setSortBy] = useState<'time' | 'priority' | 'location'>('time');

  const filteredAlerts = mockAlerts
    .filter(alert => filterType === 'all' || alert.type === filterType)
    .filter(alert => filterStatus === 'all' || alert.status === filterStatus)
    .sort((a, b) => {
      switch (sortBy) {
        case 'time':
          return b.timestamp - a.timestamp;
        case 'priority':
          const priority = { critical: 3, warning: 2, info: 1 };
          return priority[b.type] - priority[a.type];
        case 'location':
          return a.location.localeCompare(b.location);
        default:
          return 0;
      }
    });

  return (
    <ThemeProvider>
      <div className="flex h-screen bg-app">
        <Sidebar />
        
        <div className="flex-1 flex flex-col">
          <Header />
          
          <main className="flex-1 overflow-auto bg-app">
            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold text-app-primary">Alert Management</h1>
                <div className="flex space-x-3">
                  <button className="px-4 py-2 bg-[rgb(var(--color-primary))] text-white rounded hover:bg-opacity-90 transition-colors">
                    <i className="fas fa-bell mr-2"></i>Configure Alerts
                  </button>
                  <button className="px-4 py-2 bg-hover text-app-secondary rounded hover:bg-opacity-90 transition-colors">
                    <i className="fas fa-download mr-2"></i>Export Report
                  </button>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {alertStats.map((stat, index) => (
                  <div key={index} className="bg-card p-4 rounded-lg border border-app hover-scale">
                    <div className="flex items-center space-x-4">
                      <div className={`${stat.color} p-3 rounded-lg`}>
                        <i className={`${stat.icon} text-white text-xl`}></i>
                      </div>
                      <div>
                        <p className="text-sm text-app-secondary">{stat.label}</p>
                        <p className="text-xl font-semibold text-app-primary">{stat.value}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Filters and Controls */}
              <div className="flex justify-between items-center bg-card p-4 rounded-lg border border-app">
                <div className="flex space-x-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-app-secondary">Type:</span>
                    <select 
                      className="bg-hover text-app-primary px-3 py-1.5 rounded"
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value as any)}
                    >
                      <option value="all">All Types</option>
                      <option value="critical">Critical</option>
                      <option value="warning">Warning</option>
                      <option value="info">Info</option>
                    </select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-app-secondary">Status:</span>
                    <select 
                      className="bg-hover text-app-primary px-3 py-1.5 rounded"
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value as any)}
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="acknowledged">Acknowledged</option>
                      <option value="resolved">Resolved</option>
                    </select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-app-secondary">Sort by:</span>
                    <select 
                      className="bg-hover text-app-primary px-3 py-1.5 rounded"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                    >
                      <option value="time">Time</option>
                      <option value="priority">Priority</option>
                      <option value="location">Location</option>
                    </select>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-app-secondary">Auto-refresh:</span>
                  <button className="px-3 py-1.5 bg-[rgb(var(--color-primary))] text-white rounded hover:bg-opacity-90 transition-colors">
                    ON
                  </button>
                </div>
              </div>

              {/* Timeline */}
              <div className="bg-card p-4 rounded-lg border border-app">
                <h3 className="text-lg font-semibold text-app-primary mb-4">Alert Timeline</h3>
                <div className="relative">
                  <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-hover"></div>
                  <div className="space-y-4 ml-6">
                    {filteredAlerts.map((alert) => (
                      <AlertCard key={alert.id} alert={alert} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-card p-4 rounded-lg border border-app">
                <h3 className="text-lg font-semibold text-app-primary mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <button className="flex items-center justify-center space-x-2 px-4 py-3 bg-hover rounded hover:bg-opacity-90 transition-colors text-app-secondary">
                    <i className="fas fa-check-double"></i>
                    <span>Acknowledge All</span>
                  </button>
                  <button className="flex items-center justify-center space-x-2 px-4 py-3 bg-hover rounded hover:bg-opacity-90 transition-colors text-app-secondary">
                    <i className="fas fa-user-plus"></i>
                    <span>Assign Team</span>
                  </button>
                  <button className="flex items-center justify-center space-x-2 px-4 py-3 bg-hover rounded hover:bg-opacity-90 transition-colors text-app-secondary">
                    <i className="fas fa-chart-line"></i>
                    <span>View Analytics</span>
                  </button>
                  <button className="flex items-center justify-center space-x-2 px-4 py-3 bg-hover rounded hover:bg-opacity-90 transition-colors text-app-secondary">
                    <i className="fas fa-cog"></i>
                    <span>Alert Settings</span>
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}
