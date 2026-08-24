import React, { useState } from 'react';
import { QCPlan, SectionType, QCTaskItem, TaskStatus, TaskCategory } from '../types';
import { SECTION_CONFIGS, COMPANY_INFO, COMMON_ANALYSTS, COMMON_STAGES, COMMON_PRODUCTS, createDefaultTasksForSection } from '../constants/qcConfig';
import { ReviewApprovalSection } from './ReviewApprovalSection';
import { exportPlanToExcel } from '../utils/excelExport';
import { 
  Building2, 
  Save, 
  FolderOpen, 
  FileSpreadsheet, 
  Printer, 
  RotateCcw, 
  Plus, 
  Trash2, 
  Calendar, 
  User, 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  PauseCircle, 
  XCircle,
  HelpCircle,
  Sparkles,
  ChevronDown
} from 'lucide-react';

interface QCPlanFormProps {
  plan: QCPlan;
  onChange: (updatedPlan: QCPlan) => void;
  onSave: () => void;
  onOpenHistory: () => void;
  onPrint: () => void;
  onReset: () => void;
}

export const QCPlanForm: React.FC<QCPlanFormProps> = ({
  plan,
  onChange,
  onSave,
  onOpenHistory,
  onPrint,
  onReset,
}) => {
  const config = SECTION_CONFIGS[plan.section];
  const isStability = plan.section === 'Stability';

  const [activeCellSuggestions, setActiveCellSuggestions] = useState<{
    rowId: string;
    field: 'materialProduct' | 'stage' | 'analyst';
  } | null>(null);

  // Update header fields
  const handleHeaderChange = (field: keyof QCPlan, value: string) => {
    onChange({
      ...plan,
      [field]: value,
      updatedAt: new Date().toISOString(),
    });
  };

  // Update specific task row
  const handleTaskChange = (index: number, field: keyof QCTaskItem, value: any) => {
    const updatedTasks = [...plan.tasks];
    updatedTasks[index] = {
      ...updatedTasks[index],
      [field]: value,
    };
    onChange({
      ...plan,
      tasks: updatedTasks,
      updatedAt: new Date().toISOString(),
    });
  };

  // Status cycling helper
  const handleCycleStatus = (index: number) => {
    const statuses: TaskStatus[] = ['Pending', 'In Progress', 'Completed', 'On Hold', 'Rejected'];
    const current = plan.tasks[index].status;
    const nextIndex = (statuses.indexOf(current) + 1) % statuses.length;
    handleTaskChange(index, 'status', statuses[nextIndex]);
  };

  // Add row to specific category
  const handleAddRow = (afterIndex: number, category: TaskCategory, categoryLabel?: string) => {
    const newTasks = [...plan.tasks];
    const newTask: QCTaskItem = {
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      sNo: 0, // will be re-indexed
      category,
      categoryLabel: categoryLabel || 'Additional Task',
      materialProduct: '',
      batchNo: '',
      stage: '',
      analyst: '',
      status: 'Pending',
      remarks: '',
    };

    newTasks.splice(afterIndex + 1, 0, newTask);

    // Re-index all S.No sequentially
    const reindexedTasks = newTasks.map((t, idx) => ({
      ...t,
      sNo: idx + 1,
    }));

    onChange({
      ...plan,
      tasks: reindexedTasks,
      updatedAt: new Date().toISOString(),
    });
  };

  // Delete row
  const handleDeleteRow = (index: number) => {
    if (plan.tasks.length <= 1) return;
    const newTasks = plan.tasks.filter((_, idx) => idx !== index);
    
    // Re-index all S.No
    const reindexedTasks = newTasks.map((t, idx) => ({
      ...t,
      sNo: idx + 1,
    }));

    onChange({
      ...plan,
      tasks: reindexedTasks,
      updatedAt: new Date().toISOString(),
    });
  };

  // Clear a single row's contents
  const handleClearRow = (index: number) => {
    const updatedTasks = [...plan.tasks];
    updatedTasks[index] = {
      ...updatedTasks[index],
      materialProduct: '',
      batchNo: '',
      stage: '',
      analyst: '',
      status: 'Pending',
      remarks: '',
    };
    onChange({
      ...plan,
      tasks: updatedTasks,
      updatedAt: new Date().toISOString(),
    });
  };

  // Group tasks by category to display bold section dividers
  // For Val/Finish/RM: Planning of Supervisor (5), Analysis (9), Extra (1)
  // For Stability: Stability sample (6)
  const getStatusBadge = (status: TaskStatus) => {
    switch (status) {
      case 'Completed':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'In Progress':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Pending':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      case 'On Hold':
        return 'bg-slate-200 text-slate-700 border-slate-300';
      case 'Rejected':
        return 'bg-red-200 text-red-900 border-red-400';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  // Quick analysts list for current section
  const sectionAnalysts = COMMON_ANALYSTS[plan.section] || [];
  const sectionStages = COMMON_STAGES[plan.section] || [];
  const sectionProducts = COMMON_PRODUCTS[plan.section] || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Form Container with Pharmaceutical Header */}
      <div className="bg-white rounded-xl shadow-md border border-slate-300 overflow-hidden">
        
        {/* TOP OFFICIAL HEADER */}
        <div className="bg-slate-900 text-white p-5 sm:p-6 border-b border-slate-800">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            
            {/* Company & Document Title */}
            <div>
              <div className="flex items-center space-x-2 text-blue-400 text-xs font-bold uppercase tracking-wider mb-1">
                <Building2 className="w-4 h-4" />
                <span>AGP QUALITY CONTROL LABORATORY</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                {COMPANY_INFO.fullTitle}
              </h1>
              <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs text-slate-300">
                <span className="font-semibold text-blue-300">
                  {config.displayName.toUpperCase()} DAILY PLANNING SHEET
                </span>
                <span>•</span>
                <span className="bg-blue-900/80 text-blue-200 px-2 py-0.5 rounded font-mono font-bold border border-blue-700/60">
                  REF: {plan.documentRef}
                </span>
              </div>
            </div>

            {/* Plan ID & Status Pills */}
            <div className="flex flex-wrap lg:flex-col lg:items-end gap-2 text-xs">
              <div className="bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 flex items-center space-x-2">
                <span className="text-slate-400 font-mono">Plan ID:</span>
                <span className="font-mono font-bold text-blue-300">{plan.planId}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2.5 py-1 rounded-full font-bold uppercase tracking-wider text-[11px] ${
                  plan.status === 'Reviewed' || plan.status === 'Approved'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                }`}>
                  {plan.status === 'Reviewed' ? '✓ Reviewed & Verified' : 'Draft / Active Plan'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* HEADER METADATA FIELDS BAR */}
        <div className="bg-slate-50 p-4 sm:p-5 border-b border-slate-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Section Name (Display-only) */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                SECTION:
              </label>
              <div className="flex items-center px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900 shadow-inner">
                <span className={`w-2.5 h-2.5 rounded-full mr-2 ${
                  plan.section === 'Validation' ? 'bg-cyan-500' :
                  plan.section === 'Finish' ? 'bg-blue-600' :
                  plan.section === 'RM' ? 'bg-emerald-500' : 'bg-purple-600'
                }`} />
                <span>{plan.section} Section</span>
              </div>
              <p className="text-[10px] text-slate-500 mt-1 font-mono">
                Controlled Section Form
              </p>
            </div>

            {/* Document Reference (Auto-filled per section) */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                DOCUMENT REFERENCE:
              </label>
              <div className="flex items-center px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-mono font-bold text-blue-900">
                <FileText className="w-3.5 h-3.5 mr-2 text-slate-400" />
                <span>{plan.documentRef}</span>
              </div>
              <p className="text-[10px] text-slate-500 mt-1">
                {isStability ? 'Stability sample record' : 'Standard QC daily planning SOP'}
              </p>
            </div>

            {/* Date Field (Defaults to today, editable) */}
            <div>
              <label htmlFor="input-plan-date" className="block text-xs font-bold text-slate-700 mb-1">
                PLANNING DATE:
              </label>
              <div className="relative">
                <input
                  id="input-plan-date"
                  type="date"
                  value={plan.date}
                  onChange={(e) => handleHeaderChange('date', e.target.value)}
                  className="w-full text-xs font-semibold px-3 py-2 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <p className="text-[10px] text-slate-500 mt-1">
                Execution date for QC tasks
              </p>
            </div>

            {/* Planned By (Auto-filled per section default, editable) */}
            <div>
              <label htmlFor="input-planned-by" className="block text-xs font-bold text-slate-700 mb-1">
                PLANNED BY (SUPERVISOR):
              </label>
              <div className="relative">
                <input
                  id="input-planned-by"
                  type="text"
                  value={plan.plannedBy}
                  onChange={(e) => handleHeaderChange('plannedBy', e.target.value)}
                  placeholder={`Default: ${config.defaultPlannedBy}`}
                  className="w-full text-xs font-semibold px-3 py-2 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1">
                <span>Default: <strong className="text-slate-700">{config.defaultPlannedBy}</strong></span>
                <button
                  type="button"
                  onClick={() => handleHeaderChange('plannedBy', config.defaultPlannedBy)}
                  className="text-blue-600 hover:underline font-medium"
                >
                  Reset Default
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* MAIN PLANNING TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse border-y border-slate-300">
            {/* Table Column Headers */}
            <thead className="bg-slate-800 text-white text-xs font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-3 w-14 text-center border-r border-slate-700">
                  S. No.
                </th>
                <th className="py-3 px-4 min-w-[240px] border-r border-slate-700">
                  MATERIAL / PRODUCT
                </th>
                <th className="py-3 px-3 min-w-[170px] border-r border-slate-700">
                  {config.batchColumnHeader}
                </th>
                <th className="py-3 px-3 min-w-[200px] border-r border-slate-700">
                  STAGE
                </th>
                <th className="py-3 px-3 min-w-[170px] border-r border-slate-700">
                  {config.analystColumnHeader}
                </th>
                <th className="py-3 px-3 w-36 text-center border-r border-slate-700">
                  STATUS
                </th>
                <th className="py-3 px-4 min-w-[200px] border-r border-slate-700">
                  REMARKS
                </th>
                <th className="py-3 px-2 w-20 text-center print:hidden">
                  ACTIONS
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200 text-xs">
              {plan.tasks.map((task, index) => {
                // Check if we need to display a Category Subheading Row
                const prevTask = index > 0 ? plan.tasks[index - 1] : null;
                const isNewCategory = !prevTask || prevTask.category !== task.category;

                let categoryHeading = '';
                let categoryColor = 'bg-slate-100 text-slate-800 border-slate-300';
                
                if (task.category === 'Planning') {
                  categoryHeading = 'Planning of Supervisor (5 Rows)';
                  categoryColor = 'bg-blue-50/90 text-blue-900 border-blue-200';
                } else if (task.category === 'Analysis') {
                  categoryHeading = `${config.analysisSectionLabel} (${config.numAnalysisRows} Rows)`;
                  categoryColor = 'bg-slate-100 text-slate-900 border-slate-300';
                } else if (task.category === 'Extra') {
                  categoryHeading = `${config.extraTaskSectionLabel || 'Other Task'} (1 Row)`;
                  categoryColor = 'bg-amber-50/90 text-amber-900 border-amber-200';
                } else if (task.category === 'StabilitySample') {
                  categoryHeading = 'Stability sample (6 Rows)';
                  categoryColor = 'bg-purple-50/90 text-purple-900 border-purple-200';
                }

                return (
                  <React.Fragment key={task.id || `row-${index}`}>
                    {/* Category Divider Heading Row (Non-Editable Section Header) */}
                    {isNewCategory && (
                      <tr className={`${categoryColor} border-y-2 border-slate-300 font-bold`}>
                        <td colSpan={8} className="py-2.5 px-4">
                          <div className="flex items-center justify-between">
                            <span className="tracking-wide uppercase text-xs sm:text-sm font-extrabold">
                              ✦ {categoryHeading}
                            </span>
                            <div className="flex items-center space-x-2 text-[11px] font-normal print:hidden">
                              <button
                                type="button"
                                onClick={() => handleAddRow(index, task.category, task.categoryLabel)}
                                className="inline-flex items-center space-x-1 text-blue-700 hover:text-blue-900 bg-white/80 hover:bg-white px-2 py-0.5 rounded border border-slate-300 shadow-xs font-semibold"
                                title="Add row to this section"
                              >
                                <Plus className="w-3 h-3" />
                                <span>Add Row</span>
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}

                    {/* Standard Editable Row */}
                    <tr className="hover:bg-blue-50/40 transition-colors group">
                      
                      {/* S. No. */}
                      <td className="py-2 px-2 text-center font-mono font-bold text-slate-700 bg-slate-50/50 border-r border-slate-200">
                        {task.sNo}
                      </td>

                      {/* MATERIAL / PRODUCT */}
                      <td className="py-1.5 px-2.5 border-r border-slate-200">
                        <div className="relative">
                          <input
                            id={`input-material-${index}`}
                            type="text"
                            value={task.materialProduct}
                            placeholder="Enter material / product name..."
                            onChange={(e) => handleTaskChange(index, 'materialProduct', e.target.value)}
                            onFocus={() => setActiveCellSuggestions({ rowId: task.id, field: 'materialProduct' })}
                            className="w-full px-2.5 py-1.5 text-xs font-medium border border-transparent hover:border-slate-300 focus:border-blue-500 rounded bg-transparent focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </div>
                      </td>

                      {/* Dynamic Batch Column: GRN / BATCH No. or MATERIAL/BATCH No. */}
                      <td className="py-1.5 px-2.5 border-r border-slate-200">
                        <input
                          id={`input-batch-${index}`}
                          type="text"
                          value={task.batchNo}
                          placeholder={isStability ? 'Batch / Stability Code' : 'GRN or Batch No.'}
                          onChange={(e) => handleTaskChange(index, 'batchNo', e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs font-mono font-medium border border-transparent hover:border-slate-300 focus:border-blue-500 rounded bg-transparent focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </td>

                      {/* STAGE */}
                      <td className="py-1.5 px-2.5 border-r border-slate-200">
                        <div className="relative">
                          <input
                            id={`input-stage-${index}`}
                            type="text"
                            value={task.stage}
                            placeholder="e.g. Assay, Dissolution, 6M 40°C..."
                            onChange={(e) => handleTaskChange(index, 'stage', e.target.value)}
                            onFocus={() => setActiveCellSuggestions({ rowId: task.id, field: 'stage' })}
                            className="w-full px-2.5 py-1.5 text-xs font-medium border border-transparent hover:border-slate-300 focus:border-blue-500 rounded bg-transparent focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </div>
                      </td>

                      {/* Dynamic Analyst Column: ANALYZED BY or ASSIGNED TO */}
                      <td className="py-1.5 px-2.5 border-r border-slate-200">
                        <div className="relative">
                          <input
                            id={`input-analyst-${index}`}
                            type="text"
                            value={task.analyst}
                            placeholder={isStability ? 'Assigned analyst...' : 'Analyzed by...'}
                            onChange={(e) => handleTaskChange(index, 'analyst', e.target.value)}
                            onFocus={() => setActiveCellSuggestions({ rowId: task.id, field: 'analyst' })}
                            className="w-full px-2.5 py-1.5 text-xs font-medium border border-transparent hover:border-slate-300 focus:border-blue-500 rounded bg-transparent focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </div>
                      </td>

                      {/* STATUS (Interactive Dropdown & Quick Cycle) */}
                      <td className="py-1.5 px-2 text-center border-r border-slate-200">
                        <div className="flex items-center justify-center">
                          <select
                            id={`select-status-${index}`}
                            value={task.status}
                            onChange={(e) => handleTaskChange(index, 'status', e.target.value as TaskStatus)}
                            className={`text-[11px] font-bold py-1 px-2 rounded-full border cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 ${getStatusBadge(task.status)}`}
                          >
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                            <option value="On Hold">On Hold</option>
                            <option value="Rejected">Rejected</option>
                          </select>
                        </div>
                      </td>

                      {/* REMARKS */}
                      <td className="py-1.5 px-2.5 border-r border-slate-200">
                        <input
                          id={`input-remarks-${index}`}
                          type="text"
                          value={task.remarks}
                          placeholder="Testing notes, spec limits, etc."
                          onChange={(e) => handleTaskChange(index, 'remarks', e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs text-slate-700 border border-transparent hover:border-slate-300 focus:border-blue-500 rounded bg-transparent focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </td>

                      {/* ACTIONS (Add below / Delete / Clear) */}
                      <td className="py-1.5 px-2 text-center print:hidden">
                        <div className="flex items-center justify-center space-x-1 opacity-60 group-hover:opacity-100 transition-opacity">
                          <button
                            type="button"
                            onClick={() => handleAddRow(index, task.category, task.categoryLabel)}
                            className="p-1 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded"
                            title="Insert row below"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleClearRow(index)}
                            className="p-1 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded"
                            title="Clear row content"
                          >
                            <RotateCcw className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteRow(index)}
                            className="p-1 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded"
                            title="Delete row"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* QUICK SUGGESTIONS DRAWER (Optional Helper) */}
        <div className="bg-slate-50 p-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs print:hidden">
          <div className="flex items-center space-x-2 text-slate-600">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span className="font-semibold text-slate-700">Quick Helper Tags for {plan.section}:</span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] text-slate-500 mr-1">Suggested Analysts:</span>
            {sectionAnalysts.slice(0, 4).map((analyst) => (
              <button
                key={analyst}
                type="button"
                onClick={() => {
                  // Find first empty analyst task and fill it
                  const firstEmpty = plan.tasks.findIndex(t => !t.analyst);
                  if (firstEmpty >= 0) {
                    handleTaskChange(firstEmpty, 'analyst', analyst);
                  }
                }}
                className="text-[10px] bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-300 px-2 py-0.5 rounded shadow-xs"
              >
                + {analyst}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* REVIEW & APPROVAL SECTION */}
      <ReviewApprovalSection
        plan={plan}
        onChange={onChange}
      />

      {/* BOTTOM ACTION BUTTONS TOOLBAR */}
      <div className="bg-white rounded-xl border border-slate-300 p-4 sm:p-5 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden sticky bottom-4 z-30">
        
        {/* Left Status & Reset Actions */}
        <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-start">
          <button
            id="btn-reset-plan"
            type="button"
            onClick={onReset}
            className="flex items-center space-x-1.5 text-xs text-slate-600 hover:text-rose-700 font-semibold px-3 py-2 rounded-lg border border-slate-200 hover:border-rose-300 hover:bg-rose-50 transition-colors"
            title="Reset table to default SOP row structure"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset SOP Rows</span>
          </button>

          <button
            id="btn-load-history"
            type="button"
            onClick={onOpenHistory}
            className="flex items-center space-x-1.5 text-xs text-slate-700 hover:text-blue-700 font-semibold px-3 py-2 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
            title="Load saved plans from history"
          >
            <FolderOpen className="w-3.5 h-3.5" />
            <span>Load / Saved Plans</span>
          </button>
        </div>

        {/* Primary Action Buttons: Print, Excel, Save */}
        <div className="flex items-center space-x-2.5 w-full sm:w-auto justify-end">
          
          {/* Print Button */}
          <button
            id="btn-print-plan"
            type="button"
            onClick={onPrint}
            className="flex items-center space-x-1.5 text-xs font-semibold px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-slate-800 shadow-sm transition-colors"
            title="Print SOP formatted sheet"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span>Print Form</span>
          </button>

          {/* Export to Excel Button */}
          <button
            id="btn-export-excel"
            type="button"
            onClick={() => exportPlanToExcel(plan)}
            className="flex items-center space-x-1.5 text-xs font-semibold px-3.5 py-2.5 rounded-lg border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 shadow-sm transition-colors"
            title="Export to SheetJS formatted Excel file (.xlsx)"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
            <span>Export to Excel</span>
          </button>

          {/* Save Button */}
          <button
            id="btn-save-plan"
            type="button"
            onClick={onSave}
            className="flex items-center space-x-1.5 text-xs font-bold px-5 py-2.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white shadow-md transition-colors"
            title="Save plan to local storage"
          >
            <Save className="w-4 h-4 text-white" />
            <span>Save Plan</span>
          </button>

        </div>

      </div>

    </div>
  );
};
