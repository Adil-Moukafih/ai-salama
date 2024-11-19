'use client';

import Header from '@/components/shared/Header';
import Sidebar from '@/components/shared/Sidebar';
import { ThemeProvider } from '@/components/shared/ThemeProvider';
import PerformanceChart from '@/components/dashboard/PerformanceChart';
import { useEffect, useRef, useState } from 'react';
import { 
  Chart as ChartJS, 
  ChartData, 
  ChartOptions,
  DoughnutController,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { useTheme } from '@/components/shared/ThemeProvider';

// Register ChartJS components
ChartJS.register(
  DoughnutController,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Theme colors
const colors = {
  danger: {
    light: 'rgba(239, 68, 68, 0.8)',
    solid: 'rgb(239, 68, 68)'
  },
  warning: {
    light: 'rgba(245, 158, 11, 0.8)',
    solid: 'rgb(245, 158, 11)'
  },
  info: {
    light: 'rgba(59, 130, 246, 0.8)',
    solid: 'rgb(59, 130, 246)'
  },
  primary: {
    light: 'rgba(99, 102, 241, 0.8)',
    solid: 'rgb(99, 102, 241)'
  }
};

const analyticsStats = [
  {
    label: 'Total Detections',
    value: '145,287',
    change: '+12.5%',
    trend: 'up',
    icon: 'fas fa-eye',
    color: 'bg-[rgb(var(--color-primary))]',
  },
  {
    label: 'Alert Accuracy',
    value: '98.7%',
    change: '+2.1%',
    trend: 'up',
    icon: 'fas fa-bullseye',
    color: 'bg-[rgb(var(--color-success))]',
  },
  {
    label: 'Avg Response Time',
    value: '1.8s',
    change: '-0.3s',
    trend: 'down',
    icon: 'fas fa-clock',
    color: 'bg-[rgb(var(--color-info))]',
  },
  {
    label: 'System Uptime',
    value: '99.99%',
    change: '+0.01%',
    trend: 'up',
    icon: 'fas fa-server',
    color: 'bg-[rgb(var(--color-secondary))]',
  },
];

function AlertTypeChart() {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<ChartJS<'doughnut'> | null>(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');
      if (ctx) {
        if (chartInstance.current) {
          chartInstance.current.destroy();
        }

        const textColor = theme === 'dark'
          ? 'rgba(255, 255, 255, 0.7)'
          : 'rgba(0, 0, 0, 0.7)';

        const backgroundColor = theme === 'dark'
          ? 'rgba(0, 0, 0, 0.2)'
          : 'rgba(255, 255, 255, 0.2)';

        const data: ChartData<'doughnut'> = {
          labels: ['Critical', 'Warning', 'Info'],
          datasets: [{
            data: [15, 35, 50],
            backgroundColor: [
              colors.danger.light,
              colors.warning.light,
              colors.info.light
            ],
            borderColor: [
              colors.danger.solid,
              colors.warning.solid,
              colors.info.solid
            ],
            borderWidth: 2,
            hoverBackgroundColor: [
              colors.danger.solid,
              colors.warning.solid,
              colors.info.solid
            ]
          }]
        };

        const options: ChartOptions<'doughnut'> = {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                color: textColor,
                font: { size: 11 },
                padding: 15,
                usePointStyle: true,
                pointStyle: 'circle'
              }
            },
            tooltip: {
              backgroundColor: backgroundColor,
              titleColor: textColor,
              bodyColor: textColor,
              borderColor: colors.primary.light,
              borderWidth: 1
            }
          },
          radius: '90%',
          cutout: '75%'
        };

        chartInstance.current = new ChartJS(ctx, {
          type: 'doughnut',
          data,
          options
        });
      }
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [theme]);

  return (
    <div className="bg-card rounded-lg p-6 border border-app">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-app-primary">Alert Distribution</h2>
        <select className="text-sm px-3 py-1.5 bg-hover rounded text-app-secondary">
          <option>Last 24 Hours</option>
          <option>Last 7 Days</option>
          <option>Last 30 Days</option>
        </select>
      </div>
      <div className="h-[300px] relative">
        <canvas ref={chartRef}></canvas>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
          <div className="text-3xl font-bold text-app-primary">2,847</div>
          <div className="text-sm text-app-secondary">Total Alerts</div>
        </div>
      </div>
    </div>
  );
}

function CameraActivityChart() {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<ChartJS | null>(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');
      if (ctx) {
        if (chartInstance.current) {
          chartInstance.current.destroy();
        }

        const gridColor = theme === 'dark' 
          ? 'rgba(255, 255, 255, 0.1)'
          : 'rgba(0, 0, 0, 0.1)';

        const textColor = theme === 'dark'
          ? 'rgba(255, 255, 255, 0.7)'
          : 'rgba(0, 0, 0, 0.7)';

        const backgroundColor = theme === 'dark'
          ? 'rgba(0, 0, 0, 0.2)'
          : 'rgba(255, 255, 255, 0.2)';

        const data: ChartData<'bar'> = {
          labels: ['Platform A', 'Platform B', 'Platform C', 'Track Area', 'Entrance', 'Exit'],
          datasets: [{
            label: 'Detections',
            data: [423, 345, 567, 234, 756, 432],
            backgroundColor: colors.primary.light,
            borderColor: colors.primary.solid,
            borderWidth: 2,
            borderRadius: 4,
            hoverBackgroundColor: colors.primary.solid
          }]
        };

        const options: ChartOptions<'bar'> = {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              backgroundColor: backgroundColor,
              titleColor: textColor,
              bodyColor: textColor,
              borderColor: colors.primary.light,
              borderWidth: 1
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              border: { display: false },
              ticks: { 
                color: textColor,
                font: { size: 10 }
              },
              grid: { 
                color: gridColor
              }
            },
            x: {
              border: { display: false },
              ticks: { 
                color: textColor,
                font: { size: 10 }
              },
              grid: { 
                display: false
              }
            }
          }
        };

        chartInstance.current = new ChartJS(ctx, {
          type: 'bar',
          data,
          options
        });
      }
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [theme]);

  return (
    <div className="bg-card rounded-lg p-6 border border-app">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-app-primary">Camera Activity</h2>
        <select className="text-sm px-3 py-1.5 bg-hover rounded text-app-secondary">
          <option>Last 24 Hours</option>
          <option>Last 7 Days</option>
          <option>Last 30 Days</option>
        </select>
      </div>
      <div className="h-[300px]">
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState('24h');

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
                <div>
                  <h1 className="text-2xl font-semibold text-app-primary">Analytics Dashboard</h1>
                  <p className="text-app-secondary mt-1">Monitor system performance and insights</p>
                </div>
                <div className="flex space-x-3">
                  <select 
                    className="px-4 py-2 bg-hover text-app-secondary rounded"
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                  >
                    <option value="24h">Last 24 Hours</option>
                    <option value="7d">Last 7 Days</option>
                    <option value="30d">Last 30 Days</option>
                    <option value="custom">Custom Range</option>
                  </select>
                  <button className="px-4 py-2 bg-[rgb(var(--color-primary))] text-white rounded hover:bg-opacity-90 transition-colors">
                    <i className="fas fa-download mr-2"></i>Export Report
                  </button>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {analyticsStats.map((stat, index) => (
                  <div key={index} className="bg-card p-4 rounded-lg border border-app hover-scale">
                    <div className="flex items-center space-x-4">
                      <div className={`${stat.color} p-3 rounded-lg`}>
                        <i className={`${stat.icon} text-white text-xl`}></i>
                      </div>
                      <div>
                        <p className="text-sm text-app-secondary">{stat.label}</p>
                        <div className="flex items-center space-x-2">
                          <p className="text-xl font-semibold text-app-primary">{stat.value}</p>
                          <span className={`text-xs ${
                            stat.trend === 'up' 
                              ? 'text-[rgb(var(--color-success))]' 
                              : 'text-[rgb(var(--color-danger))]'
                          }`}>
                            <i className={`fas fa-arrow-${stat.trend}`}></i> {stat.change}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Performance Chart */}
              <PerformanceChart />

              {/* Additional Charts */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <AlertTypeChart />
                <CameraActivityChart />
              </div>

              {/* Quick Insights */}
              <div className="bg-card p-6 rounded-lg border border-app">
                <h2 className="text-lg font-semibold text-app-primary mb-4">Quick Insights</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-app-primary">Peak Activity Times</h3>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-app-secondary">Morning Rush</span>
                      <span className="text-app-primary">08:00 - 09:30</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-app-secondary">Evening Rush</span>
                      <span className="text-app-primary">17:00 - 18:30</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-app-primary">Most Active Cameras</h3>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-app-secondary">Main Entrance</span>
                      <span className="text-[rgb(var(--color-success))]">98% uptime</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-app-secondary">Platform A</span>
                      <span className="text-[rgb(var(--color-success))]">97% uptime</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-app-primary">Alert Response</h3>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-app-secondary">Avg. Response Time</span>
                      <span className="text-[rgb(var(--color-success))]">1.8s</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-app-secondary">Resolution Rate</span>
                      <span className="text-[rgb(var(--color-success))]">94.5%</span>
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
