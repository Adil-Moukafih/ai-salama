'use client';

import Header from '@/components/shared/Header';
import Sidebar from '@/components/shared/Sidebar';
import StatsCards from '@/components/dashboard/StatsCard';
import CameraGrid from '@/components/dashboard/CameraGrid';
import AlertPanel from '@/components/dashboard/AlertPanel';
import PerformanceChart from '@/components/dashboard/PerformanceChart';
import SystemActivity from '@/components/dashboard/SystemActivity';
import { ThemeProvider } from '@/components/shared/ThemeProvider';

export default function DashboardPage() {
  return (
    <ThemeProvider>
      <div className="flex h-screen bg-app">
        <Sidebar />
        
        <div className="flex-1 flex flex-col">
          <Header />
          
          <main className="flex-1 overflow-auto p-6 bg-app">
            {/* Quick Stats */}
            <StatsCards />

            {/* Camera Grid and Alerts */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
              <CameraGrid />
              <AlertPanel />
            </div>

            {/* Analytics Section */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <PerformanceChart />
              <SystemActivity />
            </div>
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}
