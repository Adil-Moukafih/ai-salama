'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SystemMetric {
  label: string;
  value: number;
  color: string;
  textColor: string;
}

const systemMetrics: SystemMetric[] = [
  {
    label: 'CPU Usage',
    value: 28,
    color: 'bg-[rgb(var(--color-success))]',
    textColor: 'text-[rgb(var(--color-success))]'
  },
  {
    label: 'GPU Usage',
    value: 45,
    color: 'bg-[rgb(var(--color-secondary))]',
    textColor: 'text-[rgb(var(--color-secondary))]'
  },
  {
    label: 'Memory',
    value: 62,
    color: 'bg-[rgb(var(--color-warning))]',
    textColor: 'text-[rgb(var(--color-warning))]'
  },
  {
    label: 'Storage',
    value: 85,
    color: 'bg-[rgb(var(--color-danger))]',
    textColor: 'text-[rgb(var(--color-danger))]'
  }
];

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  const menuItems = [
    { path: '/dashboard', icon: 'fas fa-home', label: 'Dashboard' },
    { path: '/cameras', icon: 'fas fa-camera', label: 'Cameras' },
    { path: '/alerts', icon: 'fas fa-bell', label: 'Alerts' },
    { path: '/analytics', icon: 'fas fa-chart-line', label: 'Analytics' },
    { path: '/settings', icon: 'fas fa-cog', label: 'Settings' }
  ];

  return (
    <aside className="w-64 bg-sidebar border-r border-app flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-app">
        <Link href="/dashboard" className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-[rgb(var(--color-primary))] rounded flex items-center justify-center">
            <i className="fas fa-shield-alt text-white"></i>
          </div>
          <span className="text-lg font-semibold text-app-primary">SALAMA</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="p-4">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                href={item.path}
                className={`flex items-center space-x-3 px-4 py-2.5 rounded transition-colors ${
                  isActive(item.path)
                    ? 'bg-[rgb(var(--color-primary))] text-white'
                    : 'text-app-secondary hover:bg-hover hover:text-app-primary'
                }`}
              >
                <i className={`${item.icon} w-5 text-center`}></i>
                <span>{item.label}</span>
                {isActive(item.path) && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white"></div>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* System Status */}
      <div className="mt-auto p-4 border-t border-app">
        <h3 className="text-sm font-semibold text-app-secondary mb-3 px-4">System Status</h3>
        <div className="space-y-3">
          {systemMetrics.map((metric, index) => (
            <div key={index} className="px-4">
              <div className="flex justify-between items-center text-sm mb-1">
                <span className="text-app-secondary">{metric.label}</span>
                <span className={metric.textColor}>{metric.value}%</span>
              </div>
              <div className="w-full bg-hover rounded-full h-1.5">
                <div 
                  className={`${metric.color} h-1.5 rounded-full transition-all duration-500`} 
                  style={{ width: `${metric.value}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* User Profile */}
      <div className="p-4 border-t border-app">
        <div className="flex items-center space-x-3 px-4 py-2 rounded hover:bg-hover transition-colors">
          <div className="w-10 h-10 rounded bg-hover flex items-center justify-center">
            <i className="fas fa-user text-app-secondary"></i>
          </div>
          <div>
            <div className="text-sm font-medium text-app-primary">Admin User</div>
            <div className="text-xs text-app-secondary">admin@salama.ai</div>
          </div>
          <button className="ml-auto p-1.5 rounded hover:bg-hover text-app-secondary hover:text-app-primary transition-colors">
            <i className="fas fa-sign-out-alt"></i>
          </button>
        </div>
      </div>
    </aside>
  );
}
