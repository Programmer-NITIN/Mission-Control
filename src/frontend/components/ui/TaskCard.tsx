'use client';

import { Task } from '@/backend/data/mock-data';

interface TaskCardProps {
  task: Task;
  onAssign?: () => void;
  onDetails?: () => void;
  delay?: number;
}

function getSeverityConfig(severity: number) {
  if (severity >= 8)
    return {
      border: 'border-l-mc-error',
      dot: 'bg-mc-error',
      pulse: true,
      badgeBg: 'bg-error-container',
      badgeText: 'text-mc-error',
    };
  if (severity >= 5)
    return {
      border: 'border-l-mc-tertiary',
      dot: 'bg-mc-tertiary',
      pulse: false,
      badgeBg: 'bg-tertiary-fixed',
      badgeText: 'text-on-tertiary-fixed-variant',
    };
  return {
    border: 'border-l-mc-secondary',
    dot: 'bg-mc-secondary',
    pulse: false,
    badgeBg: 'bg-secondary-fixed',
    badgeText: 'text-on-secondary-container',
  };
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return 'Just now';
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function TaskCard({ task, onAssign, onDetails, delay = 0 }: TaskCardProps) {
  const config = getSeverityConfig(task.severity);

  return (
    <div
      className={`card card-hover border-l-4 ${config.border} animate-slide-up`}
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'both' }}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${config.dot} ${config.pulse ? 'animate-pulse' : ''}`} />
          <h3 className="text-on-surface font-semibold text-lg leading-tight">{task.title}</h3>
        </div>
        <span className={`px-3 py-1 ${config.badgeBg} ${config.badgeText} rounded-full text-label-caps whitespace-nowrap`}>
          Severity: {task.severity}/10
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="flex items-center gap-2 text-on-surface-variant">
          <span className="material-symbols-outlined text-[18px]">group</span>
          <span className="text-data-mono">People Affected: {task.peopleAffected}</span>
        </div>
        <div className="flex items-center gap-2 text-on-surface-variant">
          <span className="material-symbols-outlined text-[18px]">schedule</span>
          <span className="text-data-mono">Reported: {timeAgo(task.createdAt)}</span>
        </div>
      </div>

      <div className="flex gap-3 border-t border-surface-container-highest pt-4">
        {task.status === 'pending' && onAssign && (
          <button onClick={onAssign} className="btn-primary">
            Assign Volunteer
          </button>
        )}
        {task.status === 'assigned' && (
          <span className="text-data-mono text-mc-secondary flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">check_circle</span>
            Assigned
          </span>
        )}
        <button onClick={onDetails} className="btn-secondary">
          Details
        </button>
      </div>
    </div>
  );
}
