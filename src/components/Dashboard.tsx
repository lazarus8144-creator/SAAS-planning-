import React from 'react';
import { SectionType, QCStats, QCPlan } from '../types';
import { SECTION_CONFIGS, COMPANY_INFO } from '../constants/qcConfig';
import { 
  Building2, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  PauseCircle, 
  XCircle, 
  FileText, 
  ArrowRight, 
  Plus, 
  Eye, 
  Sparkles,
  Layers,
  CalendarDays,
  FileCheck
} from 'lucide-react';

interface DashboardProps {
  stats: QCStats;
  recentPlans: QCPlan[];
  onSelectSection: (section: SectionType) => void;
  onOpenPlan: (plan: QCPlan) => void;
  onNewPlan: (section: SectionType) => void;
  onOpenQuickSamples?: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  stats,
  recentPlans,
  onSelectSection,
  onOpenPlan,
  onNewPlan,
  onOpenQuickSamples,
}) => {
  const sections: SectionType[] = ['Validation', 'Finish', 'RM', 'Stability'];
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Welcome & Section Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-xl p-6 text-white shadow-lg border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <Building2 className="w-4 h-4" />
              <span>{COMPANY_INFO.department}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              {COMPANY_INFO.name} Daily Planning System
            </h1>
            <p className="text-sm text-slate-300 mt-1">
              {COMPANY_INFO.address} • Standard Operating Procedure (SOP) & Sample Tracking
            </p>
          </div>
          <div className="flex items-center gap-3">
            {onOpenQuickSamples && (
              <button
                id="btn-dash-load-samples"
                onClick={onOpenQuickSamples}
                className="flex items-center space-x-2 bg-blue-600/30 hover:bg-blue-600/50 text-blue-200 border border-blue-400/30 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Load Sample Plans</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Global Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* Total Tasks */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Total Planned</span>
            <Layers className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">{stats.totalTasks}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Across all 4 sections</div>
        </div>

        {/* Completed */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-emerald-700">Completed</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-700 mt-2">{stats.completedTasks}</div>
          <div className="text-[11px] text-emerald-600 mt-0.5">
            {stats.totalTasks > 0 ? `${Math.round((stats.completedTasks / stats.totalTasks) * 100)}% complete` : '0%'}
          </div>
        </div>

        {/* In Progress */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-amber-700">In Progress</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-amber-700 mt-2">{stats.inProgressTasks}</div>
          <div className="text-[11px] text-amber-600 mt-0.5">Active analysis</div>
        </div>

        {/* Pending */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-rose-700">Pending</span>
            <AlertCircle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-bold text-rose-700 mt-2">{stats.pendingTasks}</div>
          <div className="text-[11px] text-rose-600 mt-0.5">Awaiting start</div>
        </div>

        {/* On Hold */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-600">On Hold</span>
            <PauseCircle className="w-4 h-4 text-slate-500" />
          </div>
          <div className="text-2xl font-bold text-slate-700 mt-2">{stats.onHoldTasks}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Sample / Standard hold</div>
        </div>

        {/* Today Plans */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-indigo-700">Today Plans</span>
            <CalendarDays className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold text-indigo-700 mt-2">{stats.todayPlansCount}</div>
          <div className="text-[11px] text-indigo-600 mt-0.5">{today}</div>
        </div>
      </div>

      {/* 4 Laboratory Section Navigation Cards */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-slate-900">Laboratory Sections</h2>
          <span className="text-xs text-slate-500">Select a section to enter or create daily plans</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {sections.map((sec) => {
            const config = SECTION_CONFIGS[sec];
            const secStat = stats.sectionStats[sec];
            const completionRate = secStat.total > 0 ? Math.round((secStat.completed / secStat.total) * 100) : 0;

            return (
              <div
                key={sec}
                id={`card-section-${sec.toLowerCase()}`}
                className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
              >
                {/* Header with color accent */}
                <div className={`p-4 border-b ${
                  sec === 'Validation' ? 'bg-cyan-50/70 border-cyan-100' :
                  sec === 'Finish' ? 'bg-blue-50/70 border-blue-100' :
                  sec === 'RM' ? 'bg-emerald-50/70 border-emerald-100' : 'bg-purple-50/70 border-purple-100'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${config.colorScheme.badge}`}>
                      {sec === 'RM' ? 'RM Section' : `${sec} Section`}
                    </span>
                    <span className="text-[11px] font-mono text-slate-500 font-semibold">
                      {config.documentRef}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mt-2">
                    {config.displayName}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                    {config.description}
                  </p>
                </div>

                {/* Supervisor & Config Details */}
                <div className="p-4 space-y-3 flex-1">
                  <div className="text-xs space-y-1.5 bg-slate-50 p-2.5 rounded-lg border border-slate-200/80">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Default Planned By:</span>
                      <span className="font-semibold text-slate-800">{config.defaultPlannedBy}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Analysis Header:</span>
                      <span className="font-medium text-slate-700">{config.analysisSectionLabel}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Analyst Column:</span>
                      <span className="font-mono text-slate-700 font-semibold">{config.analystColumnHeader}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Batch Column:</span>
                      <span className="font-mono text-slate-700 font-semibold">{config.batchColumnHeader}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Supervisor Rows:</span>
                      <span className="font-medium text-slate-700">
                        {config.hasSupervisorPlanning ? `${config.numSupervisorRows} rows (S.No 1-5)` : 'None (Stability Form)'}
                      </span>
                    </div>
                  </div>

                  {/* Progress stats for section */}
                  <div>
                    <div className="flex justify-between text-xs font-medium text-slate-600 mb-1">
                      <span>Tasks Completion</span>
                      <span className="font-bold text-slate-900">{completionRate}% ({secStat.completed}/{secStat.total})</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          sec === 'Validation' ? 'bg-cyan-500' :
                          sec === 'Finish' ? 'bg-blue-600' :
                          sec === 'RM' ? 'bg-emerald-500' : 'bg-purple-600'
                        }`}
                        style={{ width: `${Math.min(100, completionRate)}%` }}
                      />
                    </div>

                    <div className="flex justify-between text-[11px] text-slate-500 mt-2 pt-1 border-t border-slate-100">
                      <span>Pending: <strong className="text-rose-600">{secStat.pending}</strong></span>
                      <span>In Progress: <strong className="text-amber-600">{secStat.inProgress}</strong></span>
                      <span>Total Plans: <strong className="text-slate-700">{secStat.plansCount}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="p-4 pt-0 flex gap-2">
                  <button
                    id={`btn-open-section-${sec.toLowerCase()}`}
                    onClick={() => onSelectSection(sec)}
                    className="flex-1 flex items-center justify-center space-x-1.5 bg-slate-900 hover:bg-blue-700 text-white text-xs font-semibold py-2 rounded-lg transition-colors"
                  >
                    <span>Open Form</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    id={`btn-new-plan-${sec.toLowerCase()}`}
                    onClick={() => onNewPlan(sec)}
                    className="flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-700 p-2 rounded-lg transition-colors"
                    title={`Create fresh plan for ${sec}`}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Plans Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 sm:px-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-slate-900">Recent Laboratory Daily Plans</h2>
            <p className="text-xs text-slate-500">Historical records of QC daily planning entries</p>
          </div>
          <span className="text-xs font-medium text-slate-500">
            Showing latest {Math.min(recentPlans.length, 6)} plans
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Plan ID</th>
                <th className="py-3 px-4">Section</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Planned By</th>
                <th className="py-3 px-4">Doc Ref</th>
                <th className="py-3 px-4">Tasks</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-700">
              {recentPlans.slice(0, 8).map((plan) => {
                const config = SECTION_CONFIGS[plan.section];
                const activeTasks = plan.tasks.filter(t => t.materialProduct.trim() !== '' || t.analyst.trim() !== '');
                const completedCount = plan.tasks.filter(t => t.status === 'Completed').length;

                return (
                  <tr key={plan.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-blue-700">
                      {plan.planId}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold border ${config.colorScheme.badge}`}>
                        {plan.section}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium">
                      {plan.date}
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-900">
                      {plan.plannedBy}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-500">
                      {plan.documentRef}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-900">{completedCount}</span>
                      <span className="text-slate-500"> / {activeTasks.length || plan.tasks.length} done</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        plan.status === 'Reviewed' || plan.status === 'Approved'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-amber-100 text-amber-800 border border-amber-300'
                      }`}>
                        {plan.status === 'Reviewed' ? 'Reviewed / Signed' : 'Draft'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        id={`btn-view-plan-${plan.id}`}
                        onClick={() => onOpenPlan(plan)}
                        className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-800 font-semibold text-xs px-2.5 py-1 rounded hover:bg-blue-50 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View / Edit</span>
                      </button>
                    </td>
                  </tr>
                );
              })}

              {recentPlans.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500">
                    No plans found in storage. Click "New Plan" or "Load Sample Plans" to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
