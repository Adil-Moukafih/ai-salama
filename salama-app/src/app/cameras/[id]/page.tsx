'use client';

import { useParams } from 'next/navigation';
import Header from '../../../components/shared/Header';
import Sidebar from '../../../components/shared/Sidebar';
import { ThemeProvider } from '../../../components/shared/ThemeProvider';
import { cameraFeeds } from '../../../components/dashboard/CameraGrid';

export default function CameraDetailsPage() {
  const params = useParams();
  const cameraId = Number(params.id);
  const camera = cameraFeeds.find(cam => cam.id === cameraId);

  if (!camera) {
    return <div>Camera not found</div>;
  }

  const getAlertColor = (alert?: 'critical' | 'warning' | 'normal') => {
    switch (alert) {
      case 'critical':
        return 'text-[rgb(var(--color-danger))]';
      case 'warning':
        return 'text-[rgb(var(--color-warning))]';
      default:
        return 'text-[rgb(var(--color-success))]';
    }
  };

  // Mock historical alerts
  const historicalAlerts = [
    {
      id: 1,
      timestamp: '2024-01-20 14:30:00',
      type: 'critical',
      message: 'Person detected too close to platform edge',
    },
    {
      id: 2,
      timestamp: '2024-01-20 13:15:00',
      type: 'warning',
      message: 'Unattended object detected',
    },
    {
      id: 3,
      timestamp: '2024-01-20 12:45:00',
      type: 'normal',
      message: 'Routine crowd level check',
    },
  ];

  const alertText = camera.alert ? camera.alert.charAt(0).toUpperCase() + camera.alert.slice(1) : 'Normal';
  const statusText = camera.status.charAt(0).toUpperCase() + camera.status.slice(1);

  return (
    <ThemeProvider>
      <div className="flex h-screen bg-app">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 overflow-auto bg-app p-6">
            <div className="max-w-7xl mx-auto space-y-6">
              {/* Header */}
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold text-app-primary">{camera.location}</h1>
                <div className="flex space-x-3">
                  <button className="px-4 py-2 bg-hover text-app-secondary rounded hover:bg-opacity-90 transition-colors">
                    <i className="fas fa-download mr-2"></i>Export Footage
                  </button>
                  <button className="px-4 py-2 bg-[rgb(var(--color-primary))] text-white rounded hover:bg-opacity-90 transition-colors">
                    <i className="fas fa-cog mr-2"></i>Settings
                  </button>
                </div>
              </div>

              {/* Camera Feed and Details Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Camera Feed */}
                <div className="lg:col-span-2">
                  <div className="bg-card rounded-lg overflow-hidden border border-app">
                    <div className="relative">
                      <div className="bg-[rgb(var(--bg-tertiary))] h-96 flex items-center justify-center">
                        <i className="fas fa-camera text-app-tertiary text-6xl"></i>
                      </div>
                      {/* Camera Controls */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[rgb(var(--bg-primary)_/_0.9)] p-4">
                        <div className="flex justify-between items-center">
                          <div className="flex space-x-4">
                            <button className="p-2 bg-[rgb(var(--bg-secondary)_/_0.5)] rounded hover:bg-[rgb(var(--bg-secondary)_/_0.7)] transition-colors">
                              <i className="fas fa-play text-app-secondary"></i>
                            </button>
                            <button className="p-2 bg-[rgb(var(--bg-secondary)_/_0.5)] rounded hover:bg-[rgb(var(--bg-secondary)_/_0.7)] transition-colors">
                              <i className="fas fa-pause text-app-secondary"></i>
                            </button>
                            <button className="p-2 bg-[rgb(var(--bg-secondary)_/_0.5)] rounded hover:bg-[rgb(var(--bg-secondary)_/_0.7)] transition-colors">
                              <i className="fas fa-expand text-app-secondary"></i>
                            </button>
                          </div>
                          <span className={`flex items-center ${getAlertColor(camera.alert)}`}>
                            <i className="fas fa-circle text-xs mr-2"></i>
                            {statusText}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Camera Details */}
                <div className="space-y-6">
                  {/* Status Card */}
                  <div className="bg-card rounded-lg p-4 border border-app">
                    <h3 className="text-lg font-semibold text-app-primary mb-4">Camera Details</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-app-secondary">Status</span>
                        <span className={getAlertColor(camera.alert)}>
                          {statusText}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-app-secondary">Location</span>
                        <span className="text-app-primary">{camera.location}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-app-secondary">Current Alert Level</span>
                        <span className={getAlertColor(camera.alert)}>
                          {alertText}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-app-secondary">Detection Count</span>
                        <span className="text-app-primary">{camera.detections.reduce((acc, det) => acc + det.count, 0)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Historical Alerts */}
                  <div className="bg-card rounded-lg p-4 border border-app">
                    <h3 className="text-lg font-semibold text-app-primary mb-4">Historical Alerts</h3>
                    <div className="space-y-3">
                      {historicalAlerts.map(alert => (
                        <div key={alert.id} className="flex items-start space-x-3 p-2 rounded bg-hover">
                          <div className={`mt-1 h-2 w-2 rounded-full ${
                            alert.type === 'critical' ? 'bg-[rgb(var(--color-danger))]' :
                            alert.type === 'warning' ? 'bg-[rgb(var(--color-warning))]' :
                            'bg-[rgb(var(--color-success))]'
                          }`}></div>
                          <div className="flex-1">
                            <p className="text-sm text-app-primary">{alert.message}</p>
                            <p className="text-xs text-app-secondary">{alert.timestamp}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}
