'use client';

import { useAppStore } from '@/frontend/store/app-store';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

// Dynamic import required for Leaflet (no SSR)
const MissionMap = dynamic(() => import('@/frontend/components/maps/MissionMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-surface-container">
      <div className="flex flex-col items-center gap-3">
        <span className="material-symbols-outlined text-[48px] text-outline animate-pulse">map</span>
        <span className="text-body-sm text-on-surface-variant">Loading Map...</span>
      </div>
    </div>
  ),
});

export default function MapPage() {
  const { tasks, volunteers, setSelectedTask } = useAppStore();
  const router = useRouter();

  const handleTaskSelect = (task: typeof tasks[0]) => {
    setSelectedTask(task);
    router.push('/assignments');
  };

  return (
    <div className="relative w-full h-full">
      <MissionMap
        tasks={tasks}
        volunteers={volunteers}
        onTaskSelect={handleTaskSelect}
      />
    </div>
  );
}
