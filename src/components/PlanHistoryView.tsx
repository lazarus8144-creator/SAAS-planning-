import React, { useState, useMemo } from 'react';
import { QCPlan, SectionType, TaskStatus, FilterOptions } from '../types';
import { SECTION_CONFIGS } from '../constants/qcConfig';
import { exportPlanToExcel } from '../utils/excelExport';
import { 
  Search, 
  Filter, 
  Eye, 
  Trash2, 
  FileSpreadsheet, 
  ArrowUpDown, 
  Calendar, 
  Layers, 
  CheckCircle, 
  Clock, 
  X,
  FileCheck,
  Building2,
  Sparkles
} from 'lucide-react';

interface PlanHistoryViewProps {
  plans: QCPlan[];
  onSelectPlan: (plan: QCPlan) => void;
  onDeletePlan: (planId: string) => void;
  onNewPlan: (section: SectionType) => void;
}

export const PlanHistoryView: React.FC<PlanHistoryViewProps> = ({
  plans,
  onSelectPlan,
  onDeletePlan,
  onNewPlan,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSection, setSelectedSection] = useState<SectionType | 'ALL'>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<TaskStatus | 'ALL'>('ALL');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [sortField, setSortField] = useState<'date' | 'section' | 'planId'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Filter plans based on search criteria
  const filteredPlans = useMemo(() => {
    return plans.filter((plan) => {
      // 1. Section filter
      if (selectedSection !== 'ALL' && plan.section !== selectedSection) {
        return false;
      }

      // 2. Date Range
      if (dateFrom && plan.date < dateFrom) return false;
      if (dateTo && plan.date > dateTo) return false;

      // 3. Status filter
      if (selectedStatus !== 'ALL') {
        const hasTaskWithStatus = plan.tasks.some(t => t.status === selectedStatus);
        if (!hasTaskWithStatus) return false;
      }

      // 4. Search Query (matches product, batch, analyst, planId, plannedBy, remarks)
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchesPlan = 
          plan.planId.toLowerCase().includes(q) ||
          plan.plannedBy.toLowerCase().includes(q) ||
          (plan.reviewedBy && plan.reviewedBy.toLowerCase().includes(q)) ||
          plan.documentRef.toLowerCase().includes(q);

        const matchesTasks = plan.tasks.some(t =>
          t.materialProduct.toLowerCase().includes(q) ||
          t.batchNo.toLowerCase().includes(q) ||
          t.stage.toLowerCase().includes(q) ||
          t.analyst.toLowerCase().includes(q) ||
          t.remarks.toLowerCase().includes(q)
        );

        if (!matchesPlan && !matchesTasks) return false;
      }

      return true;
    }).sort((a, b) => {
      let comparison = 0;
      if (sortField === 'date') {
        comparison = a.date.localeCompare(b.date);
      } else if (sortField === 'section') {
        comparison = a.section.localeCompare(b.section);
      } else if (sortField === 'planId') {
        comparison = a.planId.localeCompare(b.planId);
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [plans, searchQuery, selectedSection, selectedStatus, dateFrom, dateTo, sortField, sortOrder]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedSection('ALL');
    setSelectedStatus('ALL');
    setDateFrom('');
    setDateTo('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            QC Daily Planning History & Search Archive
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Search, review, filter, and export historical laboratory daily plans across all 4 sections
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNewPlan('Finish')}
            className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
          >
            + Create New Plan
          </button>
        </div>
      </div>

      {/* FILTER & SEARCH CONTROLS BAR */}
      <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          
          {/* Global Search Box */}
          <div className="lg:col-span-2 relative">
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Search by Material, Batch, Analyst, or ID:
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                placeholder="e.g. Rigix, CF-11492, Rashid, Assay..."
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Section Filter */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Filter by Section:
            </label>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value as any)}
              className="w-full py-2 px-3 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="ALL">All Sections (4)</option>
              <option value="Validation">Validation</option>
              <option value="Finish">Finish</option>
              <option value="RM">RM (Raw Material)</option>
              <option value="Stability">Stability</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Task Status:
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as any)}
              className="w-full py-2 px-3 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="ALL">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="On Hold">On Hold</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          {/* Date Filter */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Date Filter:
            </label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full py-1.5 px-2.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

        </div>

        {/* Filter Summary & Reset Action */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs text-slate-600">
          <div className="flex items-center space-x-2">
            <span>Found <strong>{filteredPlans.length}</strong> matching plans</span>
            {(searchQuery || selectedSection !== 'ALL' || selectedStatus !== 'ALL' || dateFrom || dateTo) && (
              <button
                onClick={handleResetFilters}
                className="text-rose-600 hover:underline font-semibold ml-2"
              >
                Clear all filters
              </button>
            )}
          </div>

          {/* Sort Controls */}
          <div className="flex items-center space-x-2">
            <span className="text-slate-500">Sort by:</span>
            <button
              onClick={() => {
                if (sortField === 'date') setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                else { setSortField('date'); setSortOrder('desc'); }
              }}
              className={`px-2 py-1 rounded border text-xs font-medium ${sortField === 'date' ? 'bg-blue-50 border-blue-300 text-blue-800' : 'border-slate-200'}`}
            >
              Date {sortField === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}
            </button>
            <button
              onClick={() => {
                if (sortField === 'section') setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                else { setSortField('section'); setSortOrder('asc'); }
              }}
              className={`px-2 py-1 rounded border text-xs font-medium ${sortField === 'section' ? 'bg-blue-50 border-blue-300 text-blue-800' : 'border-slate-200'}`}
            >
              Section {sortField === 'section' && (sortOrder === 'asc' ? '↑' : '↓')}
            </button>
          </div>
        </div>
      </div>

      {/* PLANS TABLE LIST */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800 text-white font-semibold">
              <tr>
                <th className="py-3.5 px-4">Plan ID</th>
                <th className="py-3.5 px-3">Section</th>
                <th className="py-3.5 px-3">Planning Date</th>
                <th className="py-3.5 px-4">Planned By</th>
                <th className="py-3.5 px-3">Document Ref</th>
                <th className="py-3.5 px-4">Key Products / Tests Planned</th>
                <th className="py-3.5 px-3">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-700">
              {filteredPlans.map((plan) => {
                const config = SECTION_CONFIGS[plan.section];
                const activeProducts = plan.tasks
                  .filter(t => t.materialProduct.trim() !== '')
                  .map(t => t.materialProduct);
                const completedTasks = plan.tasks.filter(t => t.status === 'Completed').length;
                const totalActiveTasks = plan.tasks.filter(t => t.materialProduct || t.analyst).length;

                return (
                  <tr key={plan.id} className="hover:bg-blue-50/40 transition-colors group">
                    {/* Plan ID */}
                    <td className="py-3 px-4 font-mono font-bold text-blue-800">
                      {plan.planId}
                    </td>

                    {/* Section */}
                    <td className="py-3 px-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold border ${config.colorScheme.badge}`}>
                        {plan.section}
                      </span>
                    </td>

                    {/* Planning Date */}
                    <td className="py-3 px-3 font-semibold text-slate-900">
                      {plan.date}
                    </td>

                    {/* Planned By */}
                    <td className="py-3 px-4 font-medium text-slate-900">
                      {plan.plannedBy}
                    </td>

                    {/* Document Ref */}
                    <td className="py-3 px-3 font-mono text-slate-500 text-[11px]">
                      {plan.documentRef}
                    </td>

                    {/* Products Preview */}
                    <td className="py-3 px-4 max-w-xs">
                      {activeProducts.length > 0 ? (
                        <div className="space-y-0.5">
                          <p className="truncate font-medium text-slate-800" title={activeProducts.join(', ')}>
                            {activeProducts.slice(0, 2).join(' • ')}
                          </p>
                          <span className="text-[10px] text-slate-500">
                            {completedTasks} / {totalActiveTasks || plan.tasks.length} tasks completed
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Empty template structure</span>
                      )}
                    </td>

                    {/* Plan Status */}
                    <td className="py-3 px-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        plan.status === 'Reviewed' || plan.status === 'Approved'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-amber-100 text-amber-800 border border-amber-300'
                      }`}>
                        {plan.status === 'Reviewed' ? '✓ Reviewed' : 'Draft'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        {/* Open in Editor */}
                        <button
                          id={`btn-open-plan-${plan.id}`}
                          onClick={() => onSelectPlan(plan)}
                          className="inline-flex items-center space-x-1 text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 font-semibold px-2.5 py-1 rounded text-xs transition-colors"
                          title="Open in Planning Form"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Open</span>
                        </button>

                        {/* Export to Excel */}
                        <button
                          id={`btn-excel-plan-${plan.id}`}
                          onClick={() => exportPlanToExcel(plan)}
                          className="p-1 text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 rounded transition-colors"
                          title="Export this plan to Excel (.xlsx)"
                        >
                          <FileSpreadsheet className="w-4 h-4" />
                        </button>

                        {/* Delete */}
                        <button
                          id={`btn-delete-plan-${plan.id}`}
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to delete plan ${plan.planId}?`)) {
                              onDeletePlan(plan.id);
                            }
                          }}
                          className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                          title="Delete plan"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredPlans.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    <p className="font-semibold text-sm text-slate-700">No matching plans found</p>
                    <p className="text-xs text-slate-400 mt-1">Try adjusting your search terms or filters</p>
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
