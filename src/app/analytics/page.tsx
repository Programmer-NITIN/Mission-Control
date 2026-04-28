'use client';

const metrics = [
  { label: 'Total Reports Processed', value: '1,247', change: '+12%', icon: 'description', color: 'primary' },
  { label: 'Volunteers Deployed', value: '856', change: '+8%', icon: 'group', color: 'secondary' },
  { label: 'Avg Response Time', value: '2.4h', change: '-15%', icon: 'schedule', color: 'tertiary' },
  { label: 'Success Rate', value: '94%', change: '+3%', icon: 'verified', color: 'primary' },
];

const regionData = [
  { region: 'Kerala', tasks: 45, resolved: 38, severity: 'Critical' },
  { region: 'Tamil Nadu', tasks: 28, resolved: 24, severity: 'High' },
  { region: 'Haiti', tasks: 15, resolved: 10, severity: 'High' },
  { region: 'Chennai', tasks: 12, resolved: 11, severity: 'Medium' },
  { region: 'Delhi NCR', tasks: 8, resolved: 8, severity: 'Low' },
];

const categoryBreakdown = [
  { cat: 'Disaster Response', pct: 35, color: 'bg-mc-error' },
  { cat: 'Medical Aid', pct: 25, color: 'bg-primary-container' },
  { cat: 'Food Distribution', pct: 20, color: 'bg-mc-tertiary' },
  { cat: 'Shelter', pct: 12, color: 'bg-mc-secondary' },
  { cat: 'Logistics', pct: 8, color: 'bg-outline' },
];

export default function AnalyticsPage() {
  return (
    <div className="p-8 max-w-[1440px] mx-auto">
      <div className="mb-8">
        <h1 className="text-headline-xl text-on-surface">Impact Analytics</h1>
        <p className="text-body-sm text-on-surface-variant mt-1">Real-time operational metrics and impact measurement</p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {metrics.map((m, i) => (
          <div key={i} className="card card-hover animate-slide-up" style={{ animationDelay: `${i * 80}ms`, animationFillMode: 'both' }}>
            <div className="flex items-center justify-between mb-3">
              <span className="material-symbols-outlined text-outline text-[20px]">{m.icon}</span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                m.change.startsWith('+') ? 'bg-secondary-fixed text-mc-secondary' : 'bg-primary-fixed text-primary-container'
              }`}>
                {m.change}
              </span>
            </div>
            <div className="text-display-lg text-on-surface" style={{ fontSize: '32px' }}>{m.value}</div>
            <div className="text-body-sm text-on-surface-variant mt-1">{m.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Regional Performance */}
        <div className="col-span-12 lg:col-span-7">
          <div className="card">
            <h2 className="text-headline-lg text-on-surface border-b border-outline-variant pb-4 mb-4">Regional Performance</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-label-caps text-outline">
                    <th className="text-left pb-3">Region</th>
                    <th className="text-center pb-3">Tasks</th>
                    <th className="text-center pb-3">Resolved</th>
                    <th className="text-center pb-3">Rate</th>
                    <th className="text-right pb-3">Severity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container">
                  {regionData.map((r, i) => (
                    <tr key={i} className="hover:bg-surface-container-low transition-colors">
                      <td className="py-3 text-on-surface font-medium">{r.region}</td>
                      <td className="py-3 text-center text-data-mono text-on-surface">{r.tasks}</td>
                      <td className="py-3 text-center text-data-mono text-mc-secondary">{r.resolved}</td>
                      <td className="py-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-16 h-2 bg-surface-container rounded-full overflow-hidden">
                            <div className="h-full bg-mc-secondary rounded-full" style={{ width: `${(r.resolved / r.tasks) * 100}%` }} />
                          </div>
                          <span className="text-xs text-on-surface-variant">{Math.round((r.resolved / r.tasks) * 100)}%</span>
                        </div>
                      </td>
                      <td className="py-3 text-right">
                        <span className={`text-label-caps px-2 py-0.5 rounded ${
                          r.severity === 'Critical' ? 'bg-error-container text-mc-error' :
                          r.severity === 'High' ? 'bg-tertiary-fixed text-on-tertiary-fixed-variant' :
                          r.severity === 'Medium' ? 'bg-secondary-fixed text-on-secondary-container' :
                          'bg-surface-container text-outline'
                        }`}>
                          {r.severity}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="col-span-12 lg:col-span-5">
          <div className="card">
            <h2 className="text-headline-lg text-on-surface border-b border-outline-variant pb-4 mb-4">Task Categories</h2>
            <div className="space-y-4">
              {categoryBreakdown.map((c, i) => (
                <div key={i}>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-body-sm text-on-surface">{c.cat}</span>
                    <span className="text-data-mono text-on-surface-variant">{c.pct}%</span>
                  </div>
                  <div className="w-full h-3 bg-surface-container rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${c.color} transition-all duration-1000`}
                      style={{ width: `${c.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="card mt-4">
            <h2 className="text-headline-lg text-on-surface border-b border-outline-variant pb-4 mb-4">This Week</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-surface-container rounded-lg p-4 text-center">
                <div className="text-display-lg text-primary-container" style={{ fontSize: '28px' }}>23</div>
                <div className="text-xs text-outline mt-1">New Reports</div>
              </div>
              <div className="bg-surface-container rounded-lg p-4 text-center">
                <div className="text-display-lg text-mc-secondary" style={{ fontSize: '28px' }}>18</div>
                <div className="text-xs text-outline mt-1">Resolved</div>
              </div>
              <div className="bg-surface-container rounded-lg p-4 text-center">
                <div className="text-display-lg text-mc-tertiary" style={{ fontSize: '28px' }}>5</div>
                <div className="text-xs text-outline mt-1">In Progress</div>
              </div>
              <div className="bg-surface-container rounded-lg p-4 text-center">
                <div className="text-display-lg text-on-surface" style={{ fontSize: '28px' }}>42</div>
                <div className="text-xs text-outline mt-1">Volunteers Active</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
