'use client';

import { useRouter } from 'next/navigation';
import { useCameras } from '@/hooks/useCameras';
import AddCameraModal from '../cameras/AddCameraModal';
import { useState, useEffect } from 'react';
import { deleteCamera } from '@/lib/api';
import Image from 'next/image';

export default function CameraGrid() {
  const router = useRouter();
  const { cameras, loading, error, fetchCameras } = useCameras();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const getAlertStyles = (status?: string) => {
    switch (status) {
      case 'critical':
        return 'alert-glow-red';
      case 'warning':
        return 'alert-glow-yellow';
      default:
        return '';
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
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

  const handleDeleteCamera = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this camera?')) {
      await deleteCamera(id);
      fetchCameras(); // Refresh the camera list after deletion
    }
  };

  if (!isClient) return null;

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
      {error}
    </div>
  );

  return (
    <div className="xl:col-span-2 bg-card rounded-lg p-6 border border-app">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-app-primary">Live Camera Feeds</h2>
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="text-sm px-3 py-1.5 bg-hover rounded text-app-secondary hover:bg-opacity-90 transition-colors"
          >
            <i className="fas fa-plus mr-2"></i>Add Camera
          </button>
          <button className="text-sm px-3 py-1.5 bg-hover rounded text-app-secondary hover:bg-opacity-90 transition-colors">
            <i className="fas fa-th mr-2"></i>Grid View
          </button>
          <button className="text-sm px-3 py-1.5 bg-hover rounded text-app-secondary hover:bg-opacity-90 transition-colors">
            <i className="fas fa-list mr-2"></i>List View
          </button>
        </div>
      </div>

      <AddCameraModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)}
        onCameraAdded={fetchCameras}
      />

      {cameras.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          No cameras found. Add a camera to get started.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {cameras.map((camera) => (
            <div 
              key={camera.id} 
              className="relative hover-scale cursor-pointer"
              onClick={() => handleCameraClick(camera.id!)}
            >
              <div className="absolute top-3 left-3 z-10 flex items-center space-x-2">
                <span className="bg-[rgb(var(--bg-primary)_/_0.5)] text-app-primary text-xs px-2 py-1 rounded-full">
                  {camera.location}
                </span>
                <span className={`relative inline-flex rounded-full h-3 w-3 ${getStatusColor(camera.status)}`}></span>
              </div>
              <div className={`relative rounded-lg overflow-hidden ${getAlertStyles(camera.status)}`}>
                {camera.snapshotLoading ? (
                  <div className="bg-[rgb(var(--bg-tertiary))] h-48 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500"></div>
                  </div>
                ) : camera.snapshot ? (
                  <Image 
                    src={camera.snapshot} 
                    alt={`Snapshot of ${camera.name}`} 
                    width={400} 
                    height={200} 
                    className="w-full h-48 object-cover"
                    priority
                  />
                ) : (
                  <div className="bg-[rgb(var(--bg-tertiary))] h-48 flex items-center justify-center">
                    <i className="fas fa-camera text-app-tertiary text-4xl"></i>
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[rgb(var(--bg-primary)_/_0.7)] to-transparent p-3">
                  <div className="flex justify-between items-end">
                    <div>
                      <h3 className="text-sm font-medium text-app-primary">{camera.name}</h3>
                      <p className="text-xs text-app-secondary">{camera.location}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button 
                        className="p-1.5 bg-[rgb(var(--bg-secondary)_/_0.5)] rounded hover:bg-[rgb(var(--bg-secondary)_/_0.7)] transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCameraClick(camera.id!);
                        }}
                      >
                        <i className="fas fa-expand text-xs text-app-secondary"></i>
                      </button>
                      <button 
                        className="p-1.5 bg-[rgb(var(--bg-secondary)_/_0.5)] rounded hover:bg-[rgb(var(--bg-secondary)_/_0.7)] transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteCamera(camera.id!);
                        }}
                      >
                        <i className="fas fa-trash text-xs text-app-secondary"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
