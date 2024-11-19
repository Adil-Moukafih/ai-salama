'use client';

import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { useTheme } from '../shared/ThemeProvider';

interface MetricDetail {
  label: string;
  value: string | number;
  color: string;
}

interface PerformanceMetric {
  label: string;
  data: number[];
  color: string;
  details: {
    accuracy: number;
    speed?: string;
    precision?: number;
    contextScore?: number;
    responseTime?: string;
    reliability?: number;
    latency?: string;
    falsePositives?: string;
  };
}

const performanceData: PerformanceMetric[] = [
  {
    label: 'YOLOv5 Detection',
    data: [95, 94, 96, 95, 97, 95],
    color: '#10B981', // Emerald green
    details: {
      accuracy: 98,
      speed: '45ms',
      precision: 96
    }
  },
  {
    label: 'LLaMA Analysis',
    data: [93, 94, 92, 95, 94, 93],
    color: '#6366F1', // Indigo
    details: {
      accuracy: 95,
      contextScore: 95,
      responseTime: '120ms',
      reliability: 94
    }
  },
  {
    label: 'Alert System',
    data: [96, 95, 97, 96, 96, 97],
    color: '#F59E0B', // Amber
    details: {
      accuracy: 97,
      latency: '80ms',
      falsePositives: '3.5%'
    }
  }
];

const timeLabels = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'];

function MetricCard({ metric }: { metric: PerformanceMetric }) {
  const getMetricDetails = (metric: PerformanceMetric): MetricDetail[] => {
    const details: MetricDetail[] = [];
    
    if (metric.details.accuracy) {
      details.push({ label: 'Accuracy', value: `${metric.details.accuracy}%`, color: 'bg-[rgb(var(--color-success))]' });
    }
    if (metric.details.speed) {
      details.push({ label: 'Speed', value: metric.details.speed, color: 'bg-[rgb(var(--color-primary))]' });
    }
    if (metric.details.precision) {
      details.push({ label: 'Precision', value: `${metric.details.precision}%`, color: 'bg-[rgb(var(--color-secondary))]' });
    }
    if (metric.details.contextScore) {
      details.push({ label: 'Context Score', value: `${metric.details.contextScore}%`, color: 'bg-[rgb(var(--color-success))]' });
    }
    if (metric.details.responseTime) {
      details.push({ label: 'Response Time', value: metric.details.responseTime, color: 'bg-[rgb(var(--color-primary))]' });
    }
    if (metric.details.reliability) {
      details.push({ label: 'Reliability', value: `${metric.details.reliability}%`, color: 'bg-[rgb(var(--color-secondary))]' });
    }
    if (metric.details.latency) {
      details.push({ label: 'Latency', value: metric.details.latency, color: 'bg-[rgb(var(--color-primary))]' });
    }
    if (metric.details.falsePositives) {
      details.push({ label: 'False Positives', value: metric.details.falsePositives, color: 'bg-[rgb(var(--color-secondary))]' });
    }

    return details;
  };

  return (
    <div className="bg-card rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-app-primary">{metric.label}</h3>
        <span className="text-[rgb(var(--color-success))] text-sm">{metric.data[metric.data.length - 1]}%</span>
      </div>
      <div className="space-y-2">
        {getMetricDetails(metric).map((detail, idx) => (
          <div key={idx}>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-app-secondary">{detail.label}</span>
              <span className="text-app-primary">{detail.value}</span>
            </div>
            <div className="w-full bg-hover rounded-full h-1">
              <div 
                className={`${detail.color} h-1 rounded-full ${idx === 0 ? 'animate-pulse' : ''}`}
                style={{ 
                  width: typeof detail.value === 'string' && detail.value.includes('%') 
                    ? detail.value 
                    : '92%'
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PerformanceChart() {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');
      if (ctx) {
        if (chartInstance.current) {
          chartInstance.current.destroy();
        }

        const gridColor = theme === 'dark' 
          ? 'rgba(255, 255, 255, 0.1)'  // Light color for dark mode
          : 'rgba(0, 0, 0, 0.1)';       // Dark color for light mode

        const textColor = theme === 'dark'
          ? 'rgba(255, 255, 255, 0.7)'  // Light text for dark mode
          : 'rgba(0, 0, 0, 0.7)';       // Dark text for light mode

        chartInstance.current = new Chart(ctx, {
          type: 'line',
          data: {
            labels: timeLabels,
            datasets: performanceData.map(dataset => ({
              label: dataset.label,
              data: dataset.data,
              borderColor: dataset.color,
              backgroundColor: `${dataset.color}33`,
              borderWidth: 2,
              tension: 0.4,
              fill: true,
              pointBackgroundColor: dataset.color,
              pointBorderColor: dataset.color,
              pointHoverRadius: 6,
              pointHoverBorderWidth: 2,
              pointRadius: 4
            }))
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: true,
                position: 'top',
                labels: {
                  color: textColor,
                  font: { size: 11, weight: 500 },
                  padding: 15,
                  usePointStyle: true,
                  pointStyle: 'circle'
                }
              }
            },
            scales: {
              y: {
                beginAtZero: false,
                min: 90,
                max: 100,
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
                  color: gridColor
                }
              }
            },
            interaction: {
              intersect: false,
              mode: 'index'
            }
          }
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
    <div className="xl:col-span-2 bg-card rounded-lg p-6 border border-app">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-app-primary">AI System Performance</h2>
        <div className="flex items-center space-x-3">
          <select className="text-sm px-3 py-1.5 bg-hover rounded text-app-secondary transition-colors">
            <option>Last 24 Hours</option>
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
          </select>
          <button className="text-sm px-3 py-1.5 bg-hover rounded text-app-secondary transition-colors">
            <i className="fas fa-download mr-2"></i>Export
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {performanceData.map((metric, index) => (
          <MetricCard key={index} metric={metric} />
        ))}
      </div>

      <div className="h-[300px]">
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  );
}
