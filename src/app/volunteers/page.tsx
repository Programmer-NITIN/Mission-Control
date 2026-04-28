'use client';

import { useAppStore } from '@/store/app-store';
import { useState } from 'react';

const skillFilters = ['All', 'First Aid', 'Driving', 'Medical', 'Construction', 'Swimming', 'Logistics'];

export default function VolunteersPage() {
  const { volunteers, addVolunteer } = useAppStore();
  const [search, setSearch] = useState('');
  const [skillFilter, setSkillFilter] = useState('All');
  const [availFilter, setAvailFilter] = useState('all');

  const [showAddModal, setShowAddModal] = useState(false);
  const [newVolunteer, setNewVolunteer] = useState({
    name: '',
    role: '',
    skills: '',
    vehicle: '',
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVolunteer.name || !newVolunteer.role) return;

    addVolunteer({
      id: `v-${Date.now()}`,
      name: newVolunteer.name,
      email: `${newVolunteer.name.toLowerCase().replace(/\s/g, '')}@example.com`,
      role: newVolunteer.role,
      skills: newVolunteer.skills.split(',').map(s => s.trim()).filter(Boolean),
      availability: 'available',
      location: { lat: 10.0 + Math.random() * 0.1, lng: 76.3 + Math.random() * 0.1 },
      rating: 5.0,
      reviewCount: 0,
      completedTasks: 0,
      verified: false,
      avatar: '',
      vehicle: newVolunteer.vehicle || undefined,
    });
    
    setShowAddModal(false);
    setNewVolunteer({ name: '', role: '', skills: '', vehicle: '' });
  };

  const filtered = volunteers.filter(v => {
    const matchSearch = v.name.toLowerCase().includes(search.toLowerCase()) || v.role.toLowerCase().includes(search.toLowerCase());
    const matchSkill = skillFilter === 'All' || v.skills.some(s => s.toLowerCase().includes(skillFilter.toLowerCase()));
    const matchAvail = availFilter === 'all' || v.availability === availFilter;
    return matchSearch && matchSkill && matchAvail;
  });

  return (
    <div className="p-8 max-w-[1440px] mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-headline-xl text-on-surface">Volunteer Network</h1>
          <p className="text-body-sm text-on-surface-variant mt-1">{volunteers.length} registered volunteers across all regions</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="btn-primary">
          <span className="material-symbols-outlined text-[18px]">person_add</span>
          Add Volunteer
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">search</span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search volunteers..."
            className="pl-10 pr-4 py-2 rounded-lg border border-outline-variant bg-surface-container-lowest text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container w-64 placeholder:text-outline"
          />
        </div>
        <div className="flex gap-2">
          {skillFilters.map(s => (
            <button
              key={s}
              onClick={() => setSkillFilter(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                skillFilter === s
                  ? 'bg-primary-container text-on-primary'
                  : 'bg-surface-container border border-outline-variant text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <select
          value={availFilter}
          onChange={(e) => setAvailFilter(e.target.value)}
          className="px-3 py-2 rounded-lg border border-outline-variant bg-surface-container-lowest text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container"
        >
          <option value="all">All Status</option>
          <option value="available">Available</option>
          <option value="busy">Busy</option>
          <option value="offline">Offline</option>
        </select>
      </div>

      {/* Volunteer Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((vol, i) => (
          <div
            key={vol.id}
            className="card card-hover animate-slide-up"
            style={{ animationDelay: `${i * 60}ms`, animationFillMode: 'both' }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary-fixed flex items-center justify-center text-primary-container font-bold text-lg">
                  {vol.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-semibold text-on-surface text-sm">{vol.name}</h3>
                    {vol.verified && (
                      <span className="material-symbols-outlined text-mc-secondary text-[16px]" title="Verified">verified</span>
                    )}
                  </div>
                  <p className="text-xs text-on-surface-variant">{vol.role}</p>
                </div>
              </div>
              <span className={`w-2.5 h-2.5 rounded-full mt-1 ${
                vol.availability === 'available' ? 'bg-mc-secondary' :
                vol.availability === 'busy' ? 'bg-mc-tertiary' : 'bg-outline'
              }`} />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="bg-surface-container rounded-lg p-2 text-center">
                <div className="text-data-mono text-on-surface">{vol.rating}</div>
                <div className="text-[10px] text-outline mt-0.5">Rating</div>
              </div>
              <div className="bg-surface-container rounded-lg p-2 text-center">
                <div className="text-data-mono text-on-surface">{vol.completedTasks}</div>
                <div className="text-[10px] text-outline mt-0.5">Tasks</div>
              </div>
              <div className="bg-surface-container rounded-lg p-2 text-center">
                <div className="text-data-mono text-on-surface">{vol.reviewCount}</div>
                <div className="text-[10px] text-outline mt-0.5">Reviews</div>
              </div>
            </div>

            {/* Skills */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {vol.skills.slice(0, 3).map(skill => (
                <span key={skill} className="bg-surface-container-low border border-outline-variant px-2 py-0.5 rounded text-[11px] text-on-surface-variant">
                  {skill}
                </span>
              ))}
              {vol.skills.length > 3 && (
                <span className="text-[11px] text-outline">+{vol.skills.length - 3}</span>
              )}
            </div>

            {vol.vehicle && (
              <div className="flex items-center gap-1.5 text-xs text-on-surface-variant mb-3">
                <span className="material-symbols-outlined text-[14px]">directions_car</span>
                {vol.vehicle}
              </div>
            )}

            <button className="w-full bg-surface-container border border-outline-variant hover:bg-surface-container-high text-primary-container text-data-mono text-sm py-2 rounded-lg transition-colors">
              View Profile
            </button>
          </div>
        ))}
      </div>

      {/* Add Volunteer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center animate-fade-in p-4">
          <div className="bg-surface-container-lowest w-full max-w-md rounded-2xl p-6 shadow-2xl animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-headline-sm text-on-surface">Add New Volunteer</h2>
              <button onClick={() => setShowAddModal(false)} className="text-on-surface-variant hover:text-on-surface">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="text-label-sm text-on-surface-variant block mb-1">Full Name</label>
                <input required type="text" value={newVolunteer.name} onChange={e => setNewVolunteer({...newVolunteer, name: e.target.value})} className="w-full px-4 py-2 rounded-lg border border-outline-variant bg-surface-container text-on-surface focus:ring-2 focus:ring-primary-container" placeholder="e.g. Sarah Jenkins" />
              </div>
              <div>
                <label className="text-label-sm text-on-surface-variant block mb-1">Role</label>
                <input required type="text" value={newVolunteer.role} onChange={e => setNewVolunteer({...newVolunteer, role: e.target.value})} className="w-full px-4 py-2 rounded-lg border border-outline-variant bg-surface-container text-on-surface focus:ring-2 focus:ring-primary-container" placeholder="e.g. Paramedic" />
              </div>
              <div>
                <label className="text-label-sm text-on-surface-variant block mb-1">Skills (comma separated)</label>
                <input required type="text" value={newVolunteer.skills} onChange={e => setNewVolunteer({...newVolunteer, skills: e.target.value})} className="w-full px-4 py-2 rounded-lg border border-outline-variant bg-surface-container text-on-surface focus:ring-2 focus:ring-primary-container" placeholder="e.g. First Aid, Driving" />
              </div>
              <div>
                <label className="text-label-sm text-on-surface-variant block mb-1">Vehicle (optional)</label>
                <input type="text" value={newVolunteer.vehicle} onChange={e => setNewVolunteer({...newVolunteer, vehicle: e.target.value})} className="w-full px-4 py-2 rounded-lg border border-outline-variant bg-surface-container text-on-surface focus:ring-2 focus:ring-primary-container" placeholder="e.g. 4x4 Truck" />
              </div>
              
              <div className="flex gap-3 mt-6">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 btn-secondary justify-center">Cancel</button>
                <button type="submit" className="flex-1 btn-primary justify-center">Add Volunteer</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
