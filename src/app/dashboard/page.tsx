'use client';

import StatCard from '@/frontend/components/ui/StatCard';
import TaskCard from '@/frontend/components/ui/TaskCard';
import { useAppStore } from '@/frontend/store/app-store';
import { Task } from '@/backend/data/mock-data';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';

function DashboardMiniMap({ tasks }: { tasks: Task[] }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<unknown>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    Promise.all([
      import('leaflet'),
      import('leaflet/dist/leaflet.css'),
    ]).then(([leafletModule]) => {
      const L = leafletModule.default || leafletModule;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl;

      const allCoords = tasks.map(t => [t.location.lat, t.location.lng] as [number, number]);
      const center = allCoords.length > 0
        ? [allCoords.reduce((s, c) => s + c[0], 0) / allCoords.length, allCoords.reduce((s, c) => s + c[1], 0) / allCoords.length] as [number, number]
        : [12.5, 55] as [number, number];

      const map = L.map(mapRef.current!, {
        center,
        zoom: 3,
        zoomControl: false,
        attributionControl: false,
        dragging: false,
        scrollWheelZoom: false,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }).addTo(map);

      tasks.forEach(task => {
        const isCritical = task.severity >= 8;
        const color = isCritical ? '#ba1a1a' : task.severity >= 5 ? '#943700' : '#006c49';
        const icon = L.divIcon({
          className: 'custom-marker',
          html: `<div style="width:${isCritical ? 14 : 10}px;height:${isCritical ? 14 : 10}px;background:${color};border:2px solid white;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,0.3);"></div>`,
          iconSize: [isCritical ? 14 : 10, isCritical ? 14 : 10],
          iconAnchor: [isCritical ? 7 : 5, isCritical ? 7 : 5],
        });
        L.marker([task.location.lat, task.location.lng], { icon }).addTo(map);
      });

      if (allCoords.length > 0) {
        map.fitBounds(L.latLngBounds(allCoords), { padding: [20, 20], maxZoom: 6 });
      }

      mapInstanceRef.current = map;
    });

    return () => {
      if (mapInstanceRef.current) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (mapInstanceRef.current as any).remove();
        mapInstanceRef.current = null;
      }
    };
  }, [tasks]);

  return (
    <div ref={mapRef} className="relative flex-1 min-h-[280px]" />
  );
}

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
            <DashboardMiniMap tasks={sortedTasks} />
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
