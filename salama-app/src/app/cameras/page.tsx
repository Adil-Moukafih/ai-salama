'use client';

import Header from '@/components/shared/Header';
import Sidebar from '@/components/shared/Sidebar';
import { ThemeProvider } from '@/components/shared/ThemeProvider';
import CameraGrid from '@/components/dashboard/CameraGrid';
import AddCameraModal from '@/components/cameras/AddCameraModal';
import { useState } from 'react';

const cameraStats = [
  {
    label: 'Total Cameras',
    value: '24',
    icon: 'fas fa-camera',
    color: 'bg-[rgb(var(--color-primary))]',
  },
  {
    label: 'Active Cameras',
    value: '22',
    icon: 'fas fa-check-circle',
    color: 'bg-[rgb(var(--color-success))]',
  },
  {
    label: 'Alerts Today',
    value: '8',
    icon: 'fas fa-exclamation-triangle',
    color: 'bg-[rgb(var(--color-warning))]',
  },
  {
    label: 'Recording Storage',
    value: '1.2TB',
    icon: 'fas fa-hdd',
    color: 'bg-[rgb(var(--color-secondary))]',
  },
];

export default function CamerasPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

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
                <h1 className="text-2xl font-semibold text-app-primary">Camera Management</h1>
                <div className="flex space-x-3">
                  <button 
                    onClick={() => setIsAddModalOpen(true)}
                    className="px-4 py-2 bg-[rgb(var(--color-primary))] text-white rounded hover:bg-opacity-90 transition-colors"
                  >
                    <i className="fas fa-plus mr-2"></i>Add Camera
                  </button>
                  <button className="px-4 py-2 bg-hover text-app-secondary rounded hover:bg-opacity-90 transition-colors">
                    <i className="fas fa-cog mr-2"></i>Settings
                  </button>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {cameraStats.map((stat, index) => (
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

              {/* Controls */}
              <div className="flex justify-between items-center bg-card p-4 rounded-lg border border-app">
                <div className="flex space-x-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-app-secondary">Status:</span>
                    <select 
                      className="bg-hover text-app-primary px-3 py-1.5 rounded"
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value as 'all' | 'active' | 'inactive')}
                    >
                      <option value="all">All Cameras</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-app-secondary">Sort by:</span>
                    <select className="bg-hover text-app-primary px-3 py-1.5 rounded">
                      <option>Location</option>
                      <option>Status</option>
                      <option>Alert Level</option>
                    </select>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button 
                    className={`px-3 py-1.5 rounded transition-colors ${
                      viewMode === 'grid' 
                        ? 'bg-[rgb(var(--color-primary))] text-white' 
                        : 'bg-hover text-app-secondary'
                    }`}
                    onClick={() => setViewMode('grid')}
                  >
                    <i className="fas fa-th mr-2"></i>Grid
                  </button>
                  <button 
                    className={`px-3 py-1.5 rounded transition-colors ${
                      viewMode === 'list' 
                        ? 'bg-[rgb(var(--color-primary))] text-white' 
                        : 'bg-hover text-app-secondary'
                    }`}
                    onClick={() => setViewMode('list')}
                  >
                    <i className="fas fa-list mr-2"></i>List
                  </button>
                </div>
              </div>

              {/* Camera Grid */}
              <CameraGrid />

              {/* Quick Actions Panel */}
              <div className="bg-card p-4 rounded-lg border border-app">
                <h3 className="text-lg font-semibold text-app-primary mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <button className="flex items-center space-x-2 px-4 py-2 bg-hover rounded hover:bg-opacity-90 transition-colors text-app-secondary">
                    <i className="fas fa-download"></i>
                    <span>Export Footage</span>
                  </button>
                  <button className="flex items-center space-x-2 px-4 py-2 bg-hover rounded hover:bg-opacity-90 transition-colors text-app-secondary">
                    <i className="fas fa-clock"></i>
                    <span>View Timeline</span>
                  </button>
                  <button className="flex items-center space-x-2 px-4 py-2 bg-hover rounded hover:bg-opacity-90 transition-colors text-app-secondary">
                    <i className="fas fa-chart-bar"></i>
                    <span>Analytics</span>
                  </button>
                  <button className="flex items-center space-x-2 px-4 py-2 bg-hover rounded hover:bg-opacity-90 transition-colors text-app-secondary">
                    <i className="fas fa-shield-alt"></i>
                    <span>Security Report</span>
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      <AddCameraModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </ThemeProvider>
  );
}
