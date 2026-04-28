'use client';

import { useEffect, useRef, useState } from 'react';
import type { Map as LeafletMap } from 'leaflet';
import { Task, Volunteer } from '@/backend/data/mock-data';

interface MissionMapProps {
  tasks: Task[];
  volunteers: Volunteer[];
  onTaskSelect?: (task: Task) => void;
}

export default function MissionMap({ tasks, volunteers, onTaskSelect }: MissionMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<LeafletMap | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Dynamic import of Leaflet (client-only)
    Promise.all([
      import('leaflet'),
      import('leaflet/dist/leaflet.css'),
    ]).then(([leafletModule]) => {
      const leaflet = leafletModule.default || leafletModule;

      // Fix Leaflet default icon paths in Next.js
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (leaflet.Icon.Default.prototype as any)._getIconUrl;
      leaflet.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      });

      const map = leaflet.map(mapRef.current!, {
        center: [12.5, 55],
        zoom: 3,
        zoomControl: false,
        attributionControl: true,
      });

      // OpenStreetMap tiles — 100% free, no API key
      leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      // Zoom control bottom-right
      leaflet.control.zoom({ position: 'bottomright' }).addTo(map);

      // Custom circle icon factory
      const createCircleIcon = (color: string, size: number = 14, pulse: boolean = false) => {
        return leaflet.divIcon({
          className: 'custom-marker',
          html: `
            <div style="position:relative;">
              <div style="
                width: ${size}px; height: ${size}px;
                background: ${color};
                border: 2.5px solid white;
                border-radius: 50%;
                box-shadow: 0 2px 6px rgba(0,0,0,0.3);
              "></div>
              ${pulse ? `<div style="
                position:absolute; top:-3px; left:-3px;
                width: ${size + 6}px; height: ${size + 6}px;
                background: ${color};
                border-radius: 50%;
                opacity: 0.3;
                animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
              "></div>` : ''}
            </div>
          `,
          iconSize: [size, size],
          iconAnchor: [size / 2, size / 2],
        });
      };

      // Task markers (red/orange)
      tasks.forEach((task) => {
        const isCritical = task.severity >= 8;
        const color = isCritical ? '#ba1a1a' : task.severity >= 5 ? '#943700' : '#006c49';

        const marker = leaflet.marker([task.location.lat, task.location.lng], {
          icon: createCircleIcon(color, isCritical ? 16 : 12, isCritical),
        }).addTo(map);

        marker.bindPopup(`
          <div style="font-family: 'Public Sans', system-ui; min-width: 220px; padding: 4px;">
            <div style="display:flex; align-items:center; gap:6px; margin-bottom:8px;">
              <div style="width:8px;height:8px;border-radius:50%;background:${color}"></div>
              <strong style="font-size:14px; color:#191b23;">${task.title}</strong>
            </div>
            <div style="font-size:12px; color:#434655; margin-bottom:4px;">
              📍 ${task.location.address}
            </div>
            <div style="display:flex; gap:12px; font-size:11px; color:#737686; margin-bottom:8px;">
              <span>⚠️ Severity: ${task.severity}/10</span>
              <span>👥 ${task.peopleAffected} affected</span>
            </div>
            <div style="font-size:11px; color:#737686;">
              Status: <span style="font-weight:600; color:${task.status === 'pending' ? '#ba1a1a' : '#006c49'}">
                ${task.status === 'pending' ? 'UNASSIGNED' : 'ASSIGNED'}
              </span>
            </div>
          </div>
        `, { closeButton: true, className: 'mission-popup' });

        marker.on('click', () => setSelectedTask(task));
      });

      // Volunteer markers (green)
      volunteers
        .filter((v) => v.availability === 'available')
        .forEach((vol) => {
          const marker = leaflet.marker([vol.location.lat, vol.location.lng], {
            icon: createCircleIcon('#006c49', 10, false),
          }).addTo(map);

          marker.bindPopup(`
            <div style="font-family: 'Public Sans', system-ui; padding: 4px;">
              <strong style="font-size:13px;">${vol.name}</strong>
              <div style="font-size:11px; color:#434655; margin-top:2px;">${vol.role}</div>
              <div style="font-size:11px; color:#737686; margin-top:4px;">
                ⭐ ${vol.rating}/5 · ${vol.completedTasks} tasks
              </div>
            </div>
          `);
        });

      // Auto-fit bounds to show all markers
      const allCoords: [number, number][] = [
        ...tasks.map((t) => [t.location.lat, t.location.lng] as [number, number]),
        ...volunteers
          .filter((v) => v.availability === 'available')
          .map((v) => [v.location.lat, v.location.lng] as [number, number]),
      ];

      if (allCoords.length > 0) {
        map.fitBounds(leaflet.latLngBounds(allCoords), { padding: [50, 50], maxZoom: 6 });
      }

      mapInstanceRef.current = map;
      setIsLoaded(true);
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [tasks, volunteers]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="w-full h-full z-0" />

      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-surface-container z-10">
          <div className="flex flex-col items-center gap-3">
            <span className="material-symbols-outlined text-[48px] text-outline animate-pulse">map</span>
            <span className="text-body-sm text-on-surface-variant">Loading OpenStreetMap...</span>
          </div>
        </div>
      )}

      {selectedTask && selectedTask.status === 'pending' && onTaskSelect && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-[1000] animate-slide-up">
          <button
            onClick={() => onTaskSelect(selectedTask)}
            className="btn-primary py-3 px-6 shadow-xl"
          >
            <span className="material-symbols-outlined text-[18px]">group_add</span>
            Assign: {selectedTask.title}
          </button>
        </div>
      )}

      <div className="absolute bottom-8 left-4 z-[1000] bg-surface-container-lowest/95 backdrop-blur-sm border border-outline-variant rounded-xl shadow-md p-4">
        <h4 className="text-label-caps text-outline mb-3">LIVE MAP</h4>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-mc-error" />
            <span className="text-body-sm text-on-surface-variant">Critical Needs</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-mc-tertiary" />
            <span className="text-body-sm text-on-surface-variant">Medium Needs</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-mc-secondary" />
            <span className="text-body-sm text-on-surface-variant">Available Volunteers</span>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes ping {
          75%, 100% { transform: scale(2); opacity: 0; }
        }
        .mission-popup .leaflet-popup-content-wrapper {
          border-radius: 12px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.12);
          border: 1px solid #c3c6d7;
        }
        .mission-popup .leaflet-popup-tip {
          box-shadow: none;
          border: 1px solid #c3c6d7;
        }
        .leaflet-control-attribution {
          font-size: 10px !important;
          opacity: 0.7;
        }
      `}</style>
    </div>
  );
}
