'use client';

import StatCard from '@/components/ui/StatCard';
import TaskCard from '@/components/ui/TaskCard';
import { useAppStore } from '@/store/app-store';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const { tasks, setSelectedTask } = useAppStore();
  const router = useRouter();

  const sortedTasks = [...tasks].sort((a, b) => b.priority - a.priority);

  const handleAssign = (task: typeof tasks[0]) => {
    setSelectedTask(task);
    router.push('/assignments');
  };

  return (
    <div className="p-8 max-w-[1440px] mx-auto w-full">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard label="Active Urgent Needs" value={124} icon="warning" variant="error" delay={0} />
        <StatCard label="Volunteers Online" value={342} icon="person_check" variant="secondary" delay={100} />
        <StatCard label="Tasks Resolved Today" value={89} icon="task_alt" variant="primary" delay={200} />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Urgent Response Queue */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-headline-lg text-on-surface">Urgent Response Queue</h2>
            <button className="text-primary-container text-body-sm hover:underline">View All</button>
          </div>
          {sortedTasks.map((task, i) => (
            <TaskCard
              key={task.id}
              task={task}
              delay={300 + i * 100}
              onAssign={() => handleAssign(task)}
              onDetails={() => {
                setSelectedTask(task);
                router.push('/assignments');
              }}
            />
          ))}
        </div>

        {/* Regional Activity */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-4">
          <h2 className="text-headline-lg text-on-surface mb-2">Regional Activity</h2>
          <div className="card overflow-hidden flex flex-col h-full min-h-[400px] p-0">
            {/* Map Preview */}
            <div className="relative flex-1 bg-surface-dim min-h-[280px]">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-container/5 to-mc-secondary/5" />
              {/* Simulated map with colored dots */}
              <div className="absolute inset-0 flex items-center justify-center opacity-20">
                <span className="material-symbols-outlined text-[120px] text-outline">map</span>
              </div>
              {/* Need markers */}
              <div className="absolute top-[30%] left-[55%] w-4 h-4 rounded-full bg-mc-error border-2 border-white shadow-md animate-bounce" />
              <div className="absolute top-[50%] left-[35%] w-3 h-3 rounded-full bg-mc-tertiary border-2 border-white shadow-md" />
              {/* Volunteer markers */}
              <div className="absolute bottom-[30%] right-[30%] w-3 h-3 rounded-full bg-mc-secondary border-2 border-white shadow-md" />
              <div className="absolute top-[25%] left-[30%] w-3 h-3 rounded-full bg-mc-secondary border-2 border-white shadow-md" />
            </div>
            {/* Legend */}
            <div className="p-6 border-t border-outline-variant bg-surface-container-lowest">
              <h4 className="font-semibold text-on-surface mb-3 text-sm">Active Zones Overview</h4>
              <ul className="space-y-2">
                <li className="flex items-center justify-between text-body-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-mc-error" />
                    <span className="text-on-surface-variant">Kerala (Flood)</span>
                  </div>
                  <span className="text-data-mono">Critical</span>
                </li>
                <li className="flex items-center justify-between text-body-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-mc-tertiary" />
                    <span className="text-on-surface-variant">Haiti (Medical)</span>
                  </div>
                  <span className="text-data-mono">High</span>
                </li>
                <li className="flex items-center justify-between text-body-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-mc-secondary" />
                    <span className="text-on-surface-variant">Chennai (Food)</span>
                  </div>
                  <span className="text-data-mono">Medium</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
