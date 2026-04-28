'use client';

import { useAppStore } from '@/store/app-store';
import { matchVolunteers, MatchResult } from '@/lib/matching-algorithm';
import { useState, useEffect } from 'react';

function timeRemaining(createdAt: string): string {
  const created = new Date(createdAt).getTime();
  const now = Date.now();
  const elapsed = now - created;
  const remaining = Math.max(0, 4 * 60 * 60 * 1000 - elapsed);
  const hours = Math.floor(remaining / (1000 * 60 * 60));
  const mins = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
  if (hours > 0) return `${hours}h ${mins}m remaining`;
  if (mins > 0) return `${mins}m remaining`;
  return 'Overdue';
}

export default function AssignmentsPage() {
  const { tasks, volunteers, selectedTask, setSelectedTask, assignVolunteer } = useAppStore();
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [assigned, setAssigned] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const task = selectedTask || tasks.find(t => t.status === 'pending') || tasks[0];

  useEffect(() => {
    if (task) {
      const results = matchVolunteers(task, volunteers, 3);
      setMatches(results);
      setAssigned(false);
    }
  }, [task, volunteers]);

  const handleAssign = (vol: MatchResult) => {
    if (!task) return;
    assignVolunteer(task.id, vol.volunteer.id, vol.score);
    setAssigned(true);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  if (!task) {
    return (
      <div className="p-8 max-w-[1440px] mx-auto text-center py-32">
        <span className="material-symbols-outlined text-[80px] text-outline mb-4 block">assignment_turned_in</span>
        <h2 className="text-headline-xl text-on-surface mb-2">No Pending Tasks</h2>
        <p className="text-body-base text-on-surface-variant">All tasks have been assigned. Check back later.</p>
      </div>
    );
  }

  const topMatch = matches[0];
  const runnerUps = matches.slice(1);

  return (
    <div className="p-8 max-w-[1440px] mx-auto animate-fade-in">
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-label-caps text-primary-container bg-primary-fixed-dim px-2 py-1 rounded">
            {task.category.toUpperCase()} REQUEST
          </span>
          <span className="text-label-caps text-on-surface-variant flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">schedule</span>
            {timeRemaining(task.createdAt)}
          </span>
        </div>
        <h1 className="text-headline-xl text-on-surface">Assign Resource: {task.title}</h1>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left Panel: Task Details */}
        <div className="col-span-12 lg:col-span-4">
          <div className="card">
            <h2 className="text-headline-lg text-on-surface border-b border-outline-variant pb-4 mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-outline">info</span>
              Task Overview
            </h2>

            <div className="space-y-4">
              {/* Urgency */}
              <div className={`flex justify-between items-center p-3 rounded-lg border ${
                task.severity >= 8
                  ? 'bg-error-container/20 border-error-container'
                  : task.severity >= 5
                  ? 'bg-tertiary-fixed/20 border-tertiary-fixed'
                  : 'bg-secondary-fixed/20 border-secondary-fixed'
              }`}>
                <span className="text-body-sm text-on-surface-variant">Urgency Level</span>
                <span className={`text-data-mono flex items-center gap-1 ${
                  task.severity >= 8 ? 'text-mc-error' : task.severity >= 5 ? 'text-mc-tertiary' : 'text-mc-secondary'
                }`}>
                  <span className="material-symbols-outlined text-[18px]">warning</span>
                  {task.severity >= 8 ? 'HIGH' : task.severity >= 5 ? 'MEDIUM' : 'LOW'}
                </span>
              </div>

              {/* Details */}
              <div className="space-y-3">
                <div>
                  <span className="text-label-caps text-outline block mb-1">DESTINATION</span>
                  <span className="text-body-base text-on-surface font-semibold">{task.location.address}</span>
                </div>
                <div>
                  <span className="text-label-caps text-outline block mb-1">REQUIRED SKILLS</span>
                  <div className="flex gap-2 mt-1 flex-wrap">
                    {task.requiredSkills.map(skill => (
                      <span key={skill} className="bg-surface-container px-2 py-1 rounded text-xs text-data-mono text-on-surface-variant border border-outline-variant">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                {task.payload && (
                  <div>
                    <span className="text-label-caps text-outline block mb-1">PAYLOAD</span>
                    <span className="text-body-base text-on-surface">{task.payload}</span>
                  </div>
                )}
                <div>
                  <span className="text-label-caps text-outline block mb-1">PEOPLE AFFECTED</span>
                  <span className="text-body-base text-on-surface font-semibold">{task.peopleAffected}</span>
                </div>
              </div>

              {/* Mini Map */}
              <div className="w-full h-40 bg-surface-variant rounded-lg border border-outline-variant relative overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 bg-primary-container/5" />
                <span className="material-symbols-outlined text-outline opacity-30 text-[48px]">map</span>
                <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-mc-error rounded-full border-2 border-white shadow-sm -translate-x-1/2 -translate-y-1/2" />
              </div>
            </div>
          </div>

          {/* Task Selector */}
          <div className="mt-4">
            <h3 className="text-label-caps text-outline mb-2">OTHER PENDING TASKS</h3>
            <div className="space-y-2">
              {tasks.filter(t => t.status === 'pending' && t.id !== task.id).slice(0, 3).map(t => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTask(t)}
                  className="w-full card card-hover text-left p-3"
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${t.severity >= 8 ? 'bg-mc-error' : 'bg-mc-tertiary'}`} />
                    <span className="text-sm font-medium text-on-surface truncate">{t.title}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel: AI Recommendations */}
        <div className="col-span-12 lg:col-span-8 space-y-4">
          {/* AI Insights */}
          {topMatch && (
            <div className="bg-surface-container-low border border-primary-fixed-dim rounded-lg p-4 flex items-start gap-3 shadow-sm animate-slide-in-right">
              <span className="material-symbols-outlined text-primary-container mt-0.5">auto_awesome</span>
              <div>
                <h3 className="text-data-mono text-on-surface mb-1">AI Recommendation Context</h3>
                <p className="text-body-sm text-on-surface-variant">{topMatch.reasoning}</p>
              </div>
            </div>
          )}

          {/* Top Match */}
          {topMatch && (
            <div className={`card relative overflow-hidden border-2 ${assigned ? 'border-mc-secondary' : 'border-primary-container'} animate-slide-up`}>
              {/* Background glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary-fixed opacity-20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

              <div className="flex items-start justify-between mb-6 relative z-10">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-primary-fixed flex items-center justify-center text-primary-container font-bold text-xl border-2 border-surface-container-lowest shadow-sm">
                    {topMatch.volunteer.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-headline-lg text-on-surface">{topMatch.volunteer.name}</h3>
                      {topMatch.volunteer.verified && (
                        <span className="material-symbols-outlined text-mc-secondary text-[18px]">verified</span>
                      )}
                    </div>
                    <span className="text-body-sm text-on-surface-variant">{topMatch.volunteer.role} · ID: {topMatch.volunteer.id.toUpperCase()}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <div className="bg-mc-secondary text-on-secondary px-3 py-1.5 rounded-full flex items-center gap-1 shadow-sm">
                    <span className="text-data-mono text-lg">{topMatch.score}%</span>
                    <span className="text-[10px] font-bold uppercase opacity-90">Match</span>
                  </div>
                  <span className="text-body-sm text-on-surface-variant mt-2 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">location_on</span>
                    {(topMatch.breakdown.proximity / 10).toFixed(1)} km away
                  </span>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-3 mb-6 relative z-10">
                <div className="bg-surface-container p-3 rounded-lg border border-outline-variant/50">
                  <span className="text-label-caps text-outline block mb-1">SKILLS MATCH</span>
                  <span className="text-data-mono text-on-surface">
                    {topMatch.volunteer.skills.filter(s =>
                      task.requiredSkills.some(r => s.toLowerCase().includes(r.toLowerCase()) || r.toLowerCase().includes(s.toLowerCase()))
                    ).join(', ') || 'General'}
                  </span>
                </div>
                <div className="bg-surface-container p-3 rounded-lg border border-outline-variant/50">
                  <span className="text-label-caps text-outline block mb-1">RATING</span>
                  <div className="flex items-center gap-1 text-data-mono text-on-surface">
                    {topMatch.volunteer.rating}/5
                    <span className="material-symbols-outlined filled text-tertiary-container text-[16px]">star</span>
                    <span className="text-xs text-outline font-normal">({topMatch.volunteer.reviewCount})</span>
                  </div>
                </div>
                <div className="bg-surface-container p-3 rounded-lg border border-outline-variant/50">
                  <span className="text-label-caps text-outline block mb-1">VEHICLE</span>
                  <span className="text-data-mono text-on-surface">{topMatch.volunteer.vehicle || 'None'}</span>
                </div>
              </div>

              {/* Action */}
              <div className="flex justify-end border-t border-outline-variant pt-4 relative z-10">
                {assigned ? (
                  <div className="flex items-center gap-2 text-mc-secondary text-data-mono">
                    <span className="material-symbols-outlined text-[20px]">check_circle</span>
                    Assignment Confirmed
                  </div>
                ) : (
                  <button onClick={() => handleAssign(topMatch)} className="btn-primary py-3 px-6">
                    Confirm Assignment
                    <span className="material-symbols-outlined text-[18px]">send</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Runner Ups */}
          {runnerUps.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {runnerUps.map((match, i) => (
                <div key={match.volunteer.id} className="card card-hover animate-slide-up" style={{ animationDelay: `${300 + i * 150}ms`, animationFillMode: 'both' }}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-primary-container font-bold text-sm">
                        {match.volunteer.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h4 className="text-data-mono text-on-surface">{match.volunteer.name}</h4>
                        <span className="text-xs text-on-surface-variant">{match.volunteer.role}</span>
                      </div>
                    </div>
                    <div className="bg-surface-variant text-on-surface px-2 py-1 rounded text-sm text-data-mono border border-outline-variant">
                      {match.score}%
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 mb-4">
                    <span className="text-body-sm text-on-surface-variant flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px] text-outline">build</span>
                      {match.volunteer.skills[0] || 'General'}
                    </span>
                    <span className="text-body-sm text-on-surface-variant flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px] text-outline">location_on</span>
                      {(match.breakdown.proximity / 10).toFixed(1)} km away
                    </span>
                  </div>
                  <button
                    onClick={() => handleAssign(match)}
                    className="w-full bg-surface-container border border-outline-variant hover:bg-surface-variant text-primary-container text-data-mono text-sm py-2 rounded-lg transition-colors"
                  >
                    View Profile
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Success Toast */}
      {showToast && (
        <div className="fixed bottom-6 right-6 bg-mc-secondary text-on-secondary px-6 py-3 rounded-lg shadow-xl flex items-center gap-2 animate-slide-up z-50">
          <span className="material-symbols-outlined text-[20px]">check_circle</span>
          Volunteer assigned successfully! Notification sent.
        </div>
      )}
    </div>
  );
}
