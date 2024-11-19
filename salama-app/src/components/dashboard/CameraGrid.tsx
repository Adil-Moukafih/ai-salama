'use client';

import { useRouter } from 'next/navigation';

interface Detection {
  type: 'person' | 'object' | 'behavior';
  count: number;
  confidence: number;
  label?: string;
  alert?: {
    type: 'critical' | 'warning' | 'normal';
    message: string;
  };
  overlay?: {
    x: number;
    y: number;
    width: number;
    height: number;
    label: string;
  };
}

interface CameraFeed {
  id: number;
  location: string;
  status: 'active' | 'inactive';
  detections: Detection[];
  alert?: 'critical' | 'warning' | 'normal';
}

export const cameraFeeds: CameraFeed[] = [
  {
    id: 1,
    location: 'Platform 1 - Main Entrance',
    status: 'active',
    alert: 'critical',
    detections: [
      { 
        type: 'person', 
        count: 1, 
        confidence: 98.5,
        alert: {
          type: 'critical',
          message: 'Critical Alert: Person too close to edge'
        },
        overlay: {
          x: 30,
          y: 60,
          width: 20,
          height: 30,
          label: 'Person Detected'
        }
      }
    ]
  },
  {
    id: 2,
    location: 'Platform 2 - Waiting Area',
    status: 'active',
    alert: 'warning',
    detections: [
      { 
        type: 'object', 
        count: 1, 
        confidence: 95.2,
        label: 'unattended',
        alert: {
          type: 'warning',
          message: 'Warning: Object detected on track'
        },
        overlay: {
          x: 40,
          y: 70,
          width: 15,
          height: 15,
          label: 'Object Detected'
        }
      }
    ]
  },
  {
    id: 3,
    location: 'Security Checkpoint',
    status: 'active',
    alert: 'normal',
    detections: [
      { type: 'person', count: 5, confidence: 99.1 }
    ]
  },
  {
    id: 4,
    location: 'Platform 3 - South Exit',
    status: 'active',
    alert: 'normal',
    detections: [
      { type: 'person', count: 15, confidence: 96.7 }
    ]
  }
];

export default function CameraGrid() {
  const router = useRouter();

  const getAlertStyles = (alert?: 'critical' | 'warning' | 'normal') => {
    switch (alert) {
      case 'critical':
        return 'alert-glow-red';
      case 'warning':
        return 'alert-glow-yellow';
      default:
        return '';
    }
  };

  const getStatusColor = (alert?: 'critical' | 'warning' | 'normal') => {
    switch (alert) {
      case 'critical':
        return 'bg-[rgb(var(--color-danger))]';
      case 'warning':
        return 'bg-[rgb(var(--color-warning))]';
      default:
        return 'bg-[rgb(var(--color-success))]';
    }
  };

  const handleCameraClick = (cameraId: number) => {
    router.push(`/cameras/${cameraId}`);
  };

  return (
    <div className="xl:col-span-2 bg-card rounded-lg p-6 border border-app">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-app-primary">Live Camera Feeds</h2>
        <div className="flex items-center space-x-3">
          <button className="text-sm px-3 py-1.5 bg-hover rounded text-app-secondary hover:bg-opacity-90 transition-colors">
            <i className="fas fa-th mr-2"></i>Grid View
          </button>
          <button className="text-sm px-3 py-1.5 bg-hover rounded text-app-secondary hover:bg-opacity-90 transition-colors">
            <i className="fas fa-list mr-2"></i>List View
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {cameraFeeds.map((camera) => (
          <div 
            key={camera.id} 
            className="relative hover-scale cursor-pointer"
            onClick={() => handleCameraClick(camera.id)}
          >
            <div className="absolute top-3 left-3 z-10 flex items-center space-x-2">
              <span className="bg-[rgb(var(--bg-primary)_/_0.5)] text-app-primary text-xs px-2 py-1 rounded-full">
                {camera.location}
              </span>
              {camera.alert === 'critical' || camera.alert === 'warning' ? (
                <>
                  <span className={`animate-ping absolute inline-flex h-3 w-3 rounded-full ${getStatusColor(camera.alert)} opacity-75`}></span>
                  <span className={`relative inline-flex rounded-full h-3 w-3 ${getStatusColor(camera.alert)}`}></span>
                </>
              ) : (
                <span className={`relative inline-flex rounded-full h-3 w-3 ${getStatusColor(camera.alert)}`}></span>
              )}
            </div>
            <div className={`relative rounded-lg overflow-hidden ${getAlertStyles(camera.alert)}`}>
              <div className="bg-[rgb(var(--bg-tertiary))] h-48 flex items-center justify-center">
                <i className="fas fa-camera text-app-tertiary text-4xl"></i>
              </div>
              {/* Detection Overlay */}
              {camera.detections.map((detection, idx) => (
                detection.overlay && (
                  <div key={idx} className="absolute inset-0">
                    <svg className="w-full h-full">
                      <rect 
                        x={`${detection.overlay.x}%`} 
                        y={`${detection.overlay.y}%`} 
                        width={`${detection.overlay.width}%`} 
                        height={`${detection.overlay.height}%`} 
                        stroke={
                          camera.alert === 'critical' ? 'rgb(var(--color-danger))' : 
                          camera.alert === 'warning' ? 'rgb(var(--color-warning))' : 
                          'rgb(var(--color-success))'
                        }
                        strokeWidth="2" 
                        fill="none" 
                        strokeDasharray="5,5" 
                        className="animate-pulse"
                      />
                      <text 
                        x={`${detection.overlay.x + 1}%`} 
                        y={`${detection.overlay.y - 2}%`} 
                        fill={
                          camera.alert === 'critical' ? 'rgb(var(--color-danger))' : 
                          camera.alert === 'warning' ? 'rgb(var(--color-warning))' : 
                          'rgb(var(--color-success))'
                        }
                        className="text-xs"
                      >
                        {detection.overlay.label}
                      </text>
                    </svg>
                  </div>
                )
              ))}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[rgb(var(--bg-primary)_/_0.7)] to-transparent p-3">
                <div className="flex justify-between items-end">
                  <div>
                    <h3 className="text-sm font-medium text-app-primary">{camera.location}</h3>
                    {camera.detections[0].alert ? (
                      <p className={`text-xs ${
                        camera.alert === 'critical' ? 'text-[rgb(var(--color-danger))]' :
                        camera.alert === 'warning' ? 'text-[rgb(var(--color-warning))]' :
                        'text-app-secondary'
                      }`}>
                        {camera.detections[0].alert.message}
                      </p>
                    ) : (
                      <p className="text-xs text-app-secondary">Normal Operation</p>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      className="p-1.5 bg-[rgb(var(--bg-secondary)_/_0.5)] rounded hover:bg-[rgb(var(--bg-secondary)_/_0.7)] transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCameraClick(camera.id);
                      }}
                    >
                      <i className="fas fa-expand text-xs text-app-secondary"></i>
                    </button>
                    <button 
                      className="p-1.5 bg-[rgb(var(--bg-secondary)_/_0.5)] rounded hover:bg-[rgb(var(--bg-secondary)_/_0.7)] transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <i className="fas fa-cog text-xs text-app-secondary"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
