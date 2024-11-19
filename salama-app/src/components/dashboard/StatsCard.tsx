'use client';

interface StatCardProps {
  title: string;
  value: string;
  change: {
    value: string;
    type: 'increase' | 'decrease' | 'neutral';
    icon: string;
  };
  icon: {
    name: string;
    color: string;
    background: string;
  };
}

const stats: StatCardProps[] = [
  {
    title: 'Total Alerts Today',
    value: '247',
    change: {
      value: '12% vs yesterday',
      type: 'increase',
      icon: 'fa-arrow-up'
    },
    icon: {
      name: 'fa-bell',
      color: 'text-[rgb(var(--color-primary))]',
      background: 'bg-[rgb(var(--color-primary)_/_0.2)]'
    }
  },
  {
    title: 'Active Cameras',
    value: '14/15',
    change: {
      value: '93.3% uptime',
      type: 'neutral',
      icon: 'fa-check-circle'
    },
    icon: {
      name: 'fa-camera',
      color: 'text-[rgb(var(--color-success))]',
      background: 'bg-[rgb(var(--color-success)_/_0.2)]'
    }
  },
  {
    title: 'Response Time',
    value: '1.8s',
    change: {
      value: 'Average',
      type: 'neutral',
      icon: 'fa-clock'
    },
    icon: {
      name: 'fa-bolt',
      color: 'text-[rgb(var(--color-warning))]',
      background: 'bg-[rgb(var(--color-warning)_/_0.2)]'
    }
  },
  {
    title: 'AI Accuracy',
    value: '95.8%',
    change: {
      value: '2.3% improvement',
      type: 'increase',
      icon: 'fa-arrow-up'
    },
    icon: {
      name: 'fa-brain',
      color: 'text-[rgb(var(--color-secondary))]',
      background: 'bg-[rgb(var(--color-secondary)_/_0.2)]'
    }
  }
];

function StatCard({ title, value, change, icon }: StatCardProps) {
  return (
    <div className="bg-card rounded-lg p-6 border border-app hover-scale">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-app-secondary">{title}</p>
          <h3 className="text-2xl font-bold text-app-primary mt-1">{value}</h3>
          <p className={`text-sm ${
            change.type === 'increase' ? 'text-[rgb(var(--color-success))]' :
            change.type === 'decrease' ? 'text-[rgb(var(--color-danger))]' :
            'text-app-secondary'
          } mt-1`}>
            <i className={`fas ${change.icon} mr-1`}></i>
            {change.value}
          </p>
        </div>
        <div className={`${icon.background} p-3 rounded-lg`}>
          <i className={`fas ${icon.name} ${icon.color} text-xl`}></i>
        </div>
      </div>
    </div>
  );
}

export default function StatsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
}
