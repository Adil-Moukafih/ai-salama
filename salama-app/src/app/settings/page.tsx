'use client';

import Header from '@/components/shared/Header';
import Sidebar from '@/components/shared/Sidebar';
import { ThemeProvider } from '@/components/shared/ThemeProvider';
import { useState } from 'react';

interface SettingsSection {
  id: string;
  label: string;
  icon: string;
}

const settingsSections: SettingsSection[] = [
  { id: 'profile', label: 'Profile Settings', icon: 'fas fa-user' },
  { id: 'system', label: 'System Preferences', icon: 'fas fa-cog' },
  { id: 'cameras', label: 'Camera Configuration', icon: 'fas fa-camera' },
  { id: 'alerts', label: 'Alert Settings', icon: 'fas fa-bell' },
  { id: 'appearance', label: 'Appearance', icon: 'fas fa-palette' },
  { id: 'notifications', label: 'Notifications', icon: 'fas fa-envelope' },
];

function Toggle({ checked, onChange, disabled = false }: { checked: boolean; onChange: (checked: boolean) => void; disabled?: boolean }) {
  return (
    <button
      onClick={() => !disabled && onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        checked ? 'bg-[rgb(var(--color-primary))]' : 'bg-[rgb(var(--bg-tertiary))]'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
}

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('profile');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState('30');

  const renderContent = () => {
    switch (activeSection) {
      case 'profile':
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-24 h-24 bg-[rgb(var(--bg-tertiary))] rounded-full flex items-center justify-center">
                <i className="fas fa-user text-4xl text-[rgb(var(--text-secondary))]"></i>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[rgb(var(--text-primary))]">Admin User</h3>
                <p className="text-[rgb(var(--text-secondary))]">admin@salama.ai</p>
                <button className="mt-2 text-sm text-[rgb(var(--color-primary))] hover:underline">
                  Change Profile Picture
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-[rgb(var(--text-secondary))]">First Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 bg-[rgb(var(--bg-tertiary))] rounded border border-[rgb(var(--border-primary))] text-[rgb(var(--text-primary))]"
                  defaultValue="Admin"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-[rgb(var(--text-secondary))]">Last Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 bg-[rgb(var(--bg-tertiary))] rounded border border-[rgb(var(--border-primary))] text-[rgb(var(--text-primary))]"
                  defaultValue="User"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-[rgb(var(--text-secondary))]">Email</label>
                <input
                  type="email"
                  className="w-full px-3 py-2 bg-[rgb(var(--bg-tertiary))] rounded border border-[rgb(var(--border-primary))] text-[rgb(var(--text-primary))]"
                  defaultValue="admin@salama.ai"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-[rgb(var(--text-secondary))]">Phone</label>
                <input
                  type="tel"
                  className="w-full px-3 py-2 bg-[rgb(var(--bg-tertiary))] rounded border border-[rgb(var(--border-primary))] text-[rgb(var(--text-primary))]"
                  defaultValue="+1 (555) 123-4567"
                />
              </div>
            </div>

            <div className="pt-4">
              <button className="btn-primary px-4 py-2 rounded">
                Save Changes
              </button>
            </div>
          </div>
        );

      case 'system':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[rgb(var(--text-primary))]">System Performance</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm text-[rgb(var(--text-secondary))]">Auto-Refresh</label>
                  <div className="flex items-center space-x-2">
                    <Toggle checked={autoRefresh} onChange={setAutoRefresh} />
                    <span className="text-[rgb(var(--text-primary))]">Enable auto-refresh</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-[rgb(var(--text-secondary))]">Refresh Interval</label>
                  <select
                    value={refreshInterval}
                    onChange={(e) => setRefreshInterval(e.target.value)}
                    className="w-full px-3 py-2 bg-[rgb(var(--bg-tertiary))] rounded border border-[rgb(var(--border-primary))] text-[rgb(var(--text-primary))]"
                    disabled={!autoRefresh}
                  >
                    <option value="15">15 seconds</option>
                    <option value="30">30 seconds</option>
                    <option value="60">1 minute</option>
                    <option value="300">5 minutes</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[rgb(var(--text-primary))]">Storage Management</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[rgb(var(--text-secondary))]">Storage Used</span>
                  <span className="text-[rgb(var(--text-primary))]">1.2TB / 2TB</span>
                </div>
                <div className="w-full bg-[rgb(var(--bg-tertiary))] rounded-full h-2">
                  <div className="bg-[rgb(var(--color-primary))] h-2 rounded-full" style={{ width: '60%' }}></div>
                </div>
              </div>
              <button className="text-sm text-[rgb(var(--color-primary))] hover:underline">
                Manage Storage
              </button>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[rgb(var(--text-primary))]">System Maintenance</h3>
              <div className="grid grid-cols-2 gap-4">
                <button className="px-4 py-2 bg-[rgb(var(--bg-tertiary))] text-[rgb(var(--text-secondary))] rounded hover:bg-opacity-90 transition-colors">
                  Clear Cache
                </button>
                <button className="px-4 py-2 bg-[rgb(var(--bg-tertiary))] text-[rgb(var(--text-secondary))] rounded hover:bg-opacity-90 transition-colors">
                  System Diagnostics
                </button>
              </div>
            </div>
          </div>
        );

      case 'appearance':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[rgb(var(--text-primary))]">Theme Settings</h3>
              <div className="grid gap-4">
                <div className="bg-[rgb(var(--bg-card))] p-4 rounded-lg border border-[rgb(var(--border-primary))]">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-[rgb(var(--text-primary))]">Dark Mode</h4>
                      <p className="text-sm text-[rgb(var(--text-secondary))]">Enable dark mode for better visibility in low light</p>
                    </div>
                    <Toggle checked={darkMode} onChange={setDarkMode} />
                  </div>
                </div>

                <div className="bg-[rgb(var(--bg-card))] p-4 rounded-lg border border-[rgb(var(--border-primary))]">
                  <h4 className="font-medium text-[rgb(var(--text-primary))] mb-4">Color Theme</h4>
                  <div className="grid grid-cols-6 gap-4">
                    <button className="w-10 h-10 rounded-full bg-[rgb(var(--color-primary))]"></button>
                    <button className="w-10 h-10 rounded-full bg-[rgb(var(--color-secondary))]"></button>
                    <button className="w-10 h-10 rounded-full bg-[rgb(var(--color-success))]"></button>
                    <button className="w-10 h-10 rounded-full bg-[rgb(var(--color-warning))]"></button>
                    <button className="w-10 h-10 rounded-full bg-[rgb(var(--color-danger))]"></button>
                    <button className="w-10 h-10 rounded-full bg-[rgb(var(--color-info))]"></button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[rgb(var(--text-primary))]">Notification Preferences</h3>
              <div className="grid gap-4">
                <div className="bg-[rgb(var(--bg-card))] p-4 rounded-lg border border-[rgb(var(--border-primary))]">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-medium text-[rgb(var(--text-primary))]">Notifications</h4>
                      <p className="text-sm text-[rgb(var(--text-secondary))]">Enable or disable all notifications</p>
                    </div>
                    <Toggle checked={notificationsEnabled} onChange={setNotificationsEnabled} />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-[rgb(var(--text-primary))]">Email Notifications</h4>
                        <p className="text-sm text-[rgb(var(--text-secondary))]">Receive notifications via email</p>
                      </div>
                      <Toggle
                        checked={emailNotifications}
                        onChange={setEmailNotifications}
                        disabled={!notificationsEnabled}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-[rgb(var(--text-primary))]">Push Notifications</h4>
                        <p className="text-sm text-[rgb(var(--text-secondary))]">Receive push notifications</p>
                      </div>
                      <Toggle
                        checked={pushNotifications}
                        onChange={setPushNotifications}
                        disabled={!notificationsEnabled}
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-[rgb(var(--bg-card))] p-4 rounded-lg border border-[rgb(var(--border-primary))]">
                  <h4 className="font-medium text-[rgb(var(--text-primary))] mb-4">Notification Types</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[rgb(var(--text-primary))]">Critical Alerts</span>
                      <Toggle checked={true} onChange={() => {}} disabled={!notificationsEnabled} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[rgb(var(--text-primary))]">Warning Alerts</span>
                      <Toggle checked={true} onChange={() => {}} disabled={!notificationsEnabled} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[rgb(var(--text-primary))]">System Updates</span>
                      <Toggle checked={true} onChange={() => {}} disabled={!notificationsEnabled} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <ThemeProvider>
      <div className="flex h-screen bg-app">
        <Sidebar />
        
        <div className="flex-1 flex flex-col">
          <Header />
          
          <main className="flex-1 overflow-auto bg-app">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-[rgb(var(--text-primary))]">Settings</h1>
                <button className="btn-primary px-4 py-2 rounded">
                  Save Changes
                </button>
              </div>

              <div className="flex gap-6">
                {/* Settings Navigation */}
                <div className="w-64 shrink-0">
                  <div className="bg-[rgb(var(--bg-card))] rounded-lg border border-[rgb(var(--border-primary))] overflow-hidden">
                    {settingsSections.map((section) => (
                      <button
                        key={section.id}
                        className={`w-full flex items-center space-x-3 px-4 py-3 text-left transition-colors ${
                          activeSection === section.id
                            ? 'bg-[rgb(var(--color-primary))] text-white'
                            : 'text-[rgb(var(--text-secondary))] hover:bg-[rgb(var(--bg-hover))]'
                        }`}
                        onClick={() => setActiveSection(section.id)}
                      >
                        <i className={`${section.icon} w-5`}></i>
                        <span>{section.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Settings Content */}
                <div className="flex-1 bg-[rgb(var(--bg-card))] rounded-lg border border-[rgb(var(--border-primary))] p-6">
                  {renderContent()}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}
