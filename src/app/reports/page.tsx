'use client';

import { useState } from 'react';
import { useAppStore } from '@/frontend/store/app-store';
import { processReportWithAI } from '@/backend/services/gemini';
import { computePriority } from '@/backend/services/matching-algorithm';

const categories = ['All', 'disaster', 'health', 'food', 'shelter', 'logistics', 'education'];

export default function ReportsPage() {
  const { reports, addReport, addTask } = useAppStore();
  const [reportText, setReportText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiResult, setAiResult] = useState<Record<string, unknown> | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [filterCat, setFilterCat] = useState('All');

  const handleSubmit = async () => {
    if (!reportText.trim()) return;
    setIsProcessing(true);
    setAiResult(null);

    try {
      const result = await processReportWithAI(reportText);
      setAiResult(result as unknown as Record<string, unknown>);

      const reportId = `r-${Date.now()}`;
      const newReport = {
        id: reportId,
        title: result.title,
        description: result.description,
        category: result.category as 'health' | 'food' | 'disaster' | 'shelter' | 'logistics' | 'education',
        severity: result.severity,
        urgency: result.urgency,
        peopleAffected: result.peopleAffected,
        location: { lat: 10.015, lng: 76.345, address: result.location },
        status: 'processed' as const,
        createdAt: new Date().toISOString(),
        createdBy: 'user@ngo.org',
      };
      addReport(newReport);

      const priority = computePriority(result.severity, result.peopleAffected, result.urgency);
      addTask({
        id: `INC-${Date.now().toString().slice(-4)}`,
        reportId,
        title: result.title,
        description: result.description,
        category: result.category,
        priority,
        severity: result.severity,
        urgency: result.urgency,
        peopleAffected: result.peopleAffected,
        location: { lat: 10.015, lng: 76.345, address: result.location },
        requiredSkills: ['First Aid', 'Driving'],
        status: 'pending',
        createdAt: new Date().toISOString(),
      });

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch {
      console.error('Processing failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const filtered = filterCat === 'All' ? reports : reports.filter(r => r.category === filterCat);

  return (
    <div className="p-8 max-w-[1440px] mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-headline-xl text-on-surface">Field Reports</h1>
          <p className="text-body-sm text-on-surface-variant mt-1">Submit and manage incoming field reports with AI-powered structuring</p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Submit Form */}
        <div className="col-span-12 lg:col-span-5">
          <div className="card">
            <h2 className="text-headline-lg text-on-surface border-b border-outline-variant pb-4 mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-outline">add_circle</span>
              New Report
            </h2>

            <div className="space-y-4">
              <div>
                <label className="text-label-caps text-outline block mb-2">REPORT CONTENT</label>
                <textarea
                  value={reportText}
                  onChange={(e) => setReportText(e.target.value)}
                  placeholder="Describe the situation... e.g., 'Severe flooding in Ernakulam district. Multiple villages submerged. Approximately 450 people stranded on rooftops. Urgent need for boats and medical supplies.'"
                  className="w-full h-36 p-4 border border-outline-variant rounded-lg bg-surface-container-low text-on-surface text-body-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary-container focus:border-transparent placeholder:text-outline"
                />
              </div>

              <div className="flex items-center gap-3">
                <button className="btn-secondary flex-1 justify-center">
                  <span className="material-symbols-outlined text-[18px]">image</span>
                  Upload Image
                </button>
              </div>

              <button
                onClick={handleSubmit}
                disabled={!reportText.trim() || isProcessing}
                className="btn-primary w-full justify-center py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>
                    <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                    AI Processing...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
                    Process with AI
                  </>
                )}
              </button>
            </div>

            {/* AI Result */}
            {aiResult && (
              <div className="mt-6 animate-slide-up">
                <div className="bg-surface-container-low border border-primary-fixed-dim rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="material-symbols-outlined text-primary-container text-[20px]">auto_awesome</span>
                    <h3 className="text-data-mono text-on-surface">AI Structured Output</h3>
                  </div>
                  <pre className="text-body-sm text-on-surface-variant bg-surface-container rounded-lg p-3 overflow-auto text-xs">
                    {JSON.stringify(aiResult, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Reports List */}
        <div className="col-span-12 lg:col-span-7">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-headline-lg text-on-surface">Recent Reports</h2>
            <span className="text-data-mono text-outline bg-surface-container px-2 py-1 rounded">{filtered.length}</span>
          </div>

          {/* Filter pills */}
          <div className="flex gap-2 mb-4 flex-wrap">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilterCat(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                  filterCat === cat
                    ? 'bg-primary-container text-on-primary'
                    : 'bg-surface-container border border-outline-variant text-on-surface-variant hover:bg-surface-container-high'
                }`}
              >
                {cat === 'All' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {filtered.map((report, i) => (
              <div key={report.id} className="card card-hover animate-slide-up" style={{ animationDelay: `${i * 80}ms`, animationFillMode: 'both' }}>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`w-2 h-2 rounded-full ${
                        report.severity >= 8 ? 'bg-mc-error' : report.severity >= 5 ? 'bg-mc-tertiary' : 'bg-mc-secondary'
                      }`} />
                      <h3 className="font-semibold text-on-surface">{report.title}</h3>
                    </div>
                    <p className="text-body-sm text-on-surface-variant line-clamp-2 mb-2">{report.description}</p>
                    <div className="flex items-center gap-4 text-xs text-outline">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">location_on</span>
                        {report.location.address}
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">group</span>
                        {report.peopleAffected} affected
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 ml-4">
                    <span className={`text-label-caps px-2 py-0.5 rounded ${
                      report.severity >= 8 ? 'bg-error-container text-mc-error' :
                      report.severity >= 5 ? 'bg-tertiary-fixed text-on-tertiary-fixed-variant' :
                      'bg-secondary-fixed text-on-secondary-container'
                    }`}>
                      {report.severity}/10
                    </span>
                    <span className={`text-label-caps px-2 py-0.5 rounded ${
                      report.status === 'processed' ? 'bg-primary-fixed text-primary-container' :
                      report.status === 'assigned' ? 'bg-secondary-fixed text-mc-secondary' :
                      'bg-surface-container text-outline'
                    }`}>
                      {report.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed bottom-6 right-6 bg-mc-secondary text-on-secondary px-6 py-3 rounded-lg shadow-xl flex items-center gap-2 animate-slide-up z-50">
          <span className="material-symbols-outlined text-[20px]">check_circle</span>
          Report processed and task created successfully!
        </div>
      )}
    </div>
  );
}
