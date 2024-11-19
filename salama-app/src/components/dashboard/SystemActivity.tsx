'use client';

interface ActivityItem {
  type: 'critical' | 'success' | 'warning';
  title: string;
  time: string;
  description: string;
  priority?: string;
  status?: string;
  action?: string;
}

const activities: ActivityItem[] = [
  {
    type: 'critical',
    title: 'Critical Alert',
    time: '2 mins ago',
    description: 'Platform edge violation detected at Platform A',
    priority: 'High Priority',
    action: 'View Details'
  },
  {
    type: 'success',
    title: 'System Update',
    time: '15 mins ago',
    description: 'AI model performance optimization completed',
    status: 'Success'
  },
  {
    type: 'warning',
    title: 'Maintenance',
    time: '1 hour ago',
    description: 'Camera 3 diagnostic check scheduled',
    status: 'Pending',
    action: 'View Schedule'
  }
];

function ActivityTimelineItem({ activity }: { activity: ActivityItem }) {
  const getTypeStyles = (type: ActivityItem['type']) => {
    switch (type) {
      case 'critical':
        return {
          border: 'border-[rgb(var(--color-danger))]',
          text: 'text-[rgb(var(--color-danger))]',
          bg: 'bg-[rgb(var(--color-danger)_/_0.2)]'
        };
      case 'success':
        return {
          border: 'border-[rgb(var(--color-success))]',
          text: 'text-[rgb(var(--color-success))]',
          bg: 'bg-[rgb(var(--color-success)_/_0.2)]'
        };
      case 'warning':
        return {
          border: 'border-[rgb(var(--color-warning))]',
          text: 'text-[rgb(var(--color-warning))]',
          bg: 'bg-[rgb(var(--color-warning)_/_0.2)]'
        };
    }
  };

  const styles = getTypeStyles(activity.type);

  return (
    <div className="relative flex items-start group">
      <div className="absolute left-0 mt-1.5">
        <div className={`h-5 w-5 rounded-full border-2 ${styles.border} bg-card transition-colors group-hover:bg-hover`}></div>
      </div>
      <div className="ml-10">
        <div className="flex items-center space-x-2">
          <span className={`${styles.text} text-xs font-semibold`}>
            {activity.title}
          </span>
          <span className="text-app-tertiary text-xs">{activity.time}</span>
        </div>
        <p className="text-sm mt-1 text-app-secondary">{activity.description}</p>
        <div className="flex items-center space-x-2 mt-1">
          {activity.priority && (
            <span className={`text-xs ${styles.bg} ${styles.text} px-2 py-0.5 rounded-full`}>
              {activity.priority}
            </span>
          )}
          {activity.status && (
            <span className={`text-xs ${styles.bg} ${styles.text} px-2 py-0.5 rounded-full`}>
              {activity.status}
            </span>
          )}
          {activity.action && (
            <button className="text-xs text-[rgb(var(--color-primary))] hover:text-[rgb(var(--color-primary)_/_0.8)] transition-colors">
              {activity.action}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SystemActivity() {
  return (
    <div className="bg-card rounded-lg p-6 border border-app">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-app-primary">System Activity</h2>
        <button className="text-sm text-[rgb(var(--color-primary))] hover:text-[rgb(var(--color-primary)_/_0.8)] transition-colors">
          View All
        </button>
      </div>

      <div className="space-y-4">
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-2.5 top-0 h-full w-0.5 bg-hover"></div>

          {/* Activity Items */}
          <div className="space-y-6">
            {activities.map((activity, index) => (
              <ActivityTimelineItem key={index} activity={activity} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
