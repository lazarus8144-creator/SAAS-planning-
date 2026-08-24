import React, { useState, useEffect, useCallback } from 'react';
import { SectionType, QCPlan, TaskCategory } from './types';
import { SECTION_CONFIGS, createNewPlan, getSamplePlans } from './constants/qcConfig';
import { 
  getAllPlans, 
  savePlan, 
  deletePlan, 
  getLatestPlanForSection, 
  calculateQCStats,
  saveAutosaveDraft,
  getAutosaveDraft,
  initializeStorage
} from './utils/storage';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { QCPlanForm } from './components/QCPlanForm';
import { PlanHistoryView } from './components/PlanHistoryView';
import { PrintSheet } from './components/PrintSheet';
import { SampleDataModal } from './components/SampleDataModal';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function App() {
  const [activeSection, setActiveSection] = useState<SectionType>('Finish');
  const [currentView, setCurrentView] = useState<'form' | 'dashboard' | 'history'>('dashboard');
  const [allPlans, setAllPlans] = useState<QCPlan[]>([]);
  const [activePlan, setActivePlan] = useState<QCPlan>(() => createNewPlan('Finish'));
  const [isSampleModalOpen, setIsSampleModalOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Show toast notification
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Initial load from storage
  useEffect(() => {
    const plans = initializeStorage();
    setAllPlans(plans);
    
    // Default load latest plan for Finish section
    const finishPlan = getLatestPlanForSection('Finish');
    setActivePlan(finishPlan);
  }, []);

  // Save current active plan to storage
  const handleSaveActivePlan = useCallback(() => {
    const result = savePlan(activePlan);
    if (result.success) {
      const updatedPlans = getAllPlans();
      setAllPlans(updatedPlans);
      setActivePlan(result.plan);
      showToast(`✓ Plan ${result.plan.planId} for ${result.plan.section} section saved successfully!`);
    } else {
      showToast('Failed to save plan. Please check storage permissions.', 'error');
    }
  }, [activePlan]);

  // Keyboard shortcut for saving (Ctrl+S / Cmd+S)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (currentView === 'form') {
          handleSaveActivePlan();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentView, handleSaveActivePlan]);

  // Switch section
  const handleSelectSection = (section: SectionType) => {
    setActiveSection(section);
    
    // Check if there is an autosave draft or existing plan for this section
    const draft = getAutosaveDraft(section);
    if (draft) {
      setActivePlan(draft);
    } else {
      const existing = getLatestPlanForSection(section);
      setActivePlan(existing);
    }
    setCurrentView('form');
  };

  // Create a brand new plan for a section
  const handleNewPlan = (section: SectionType) => {
    const freshPlan = createNewPlan(section);
    setActiveSection(section);
    setActivePlan(freshPlan);
    setCurrentView('form');
    showToast(`Created new blank daily planning sheet for ${section} Section.`);
  };

  // Open an existing plan from history or dashboard
  const handleOpenPlan = (plan: QCPlan) => {
    setActiveSection(plan.section);
    setActivePlan(plan);
    setCurrentView('form');
  };

  // Delete plan handler
  const handleDeletePlan = (planId: string) => {
    const success = deletePlan(planId);
    if (success) {
      const updated = getAllPlans();
      setAllPlans(updated);
      showToast('Plan deleted from database.', 'info');
      
      // If deleted active plan, reload a default one
      if (activePlan.id === planId) {
        const fallback = getLatestPlanForSection(activeSection);
        setActivePlan(fallback);
      }
    }
  };

  // Reset current active plan to SOP default rows
  const handleResetCurrentPlan = () => {
    if (window.confirm(`Reset table for ${activePlan.section} section to default SOP structure? All entered data in this form will be cleared.`)) {
      const fresh = createNewPlan(activePlan.section, activePlan.date);
      fresh.planId = activePlan.planId;
      setActivePlan(fresh);
      showToast(`Form reset to SOP standard layout for ${activePlan.section} Section.`);
    }
  };

  // Restore factory sample database
  const handleRestoreAllDefaults = () => {
    const samplePlans = getSamplePlans();
    localStorage.setItem('agp_qc_plans_v1', JSON.stringify(samplePlans));
    setAllPlans(samplePlans);
    const defaultFinish = samplePlans.find(p => p.section === 'Finish') || samplePlans[0];
    setActivePlan(defaultFinish);
    setActiveSection(defaultFinish.section);
    showToast('Database reset: default AGP sample plans loaded successfully.');
  };

  // Print trigger
  const handlePrint = () => {
    window.print();
  };

  // Calculate stats
  const qcStats = calculateQCStats(allPlans);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-between text-slate-900 font-sans selection:bg-blue-600 selection:text-white">
      
      {/* Printable Sheet (Visible only when printing) */}
      <PrintSheet plan={activePlan} />

      {/* Screen Interactive App Container */}
      <div className="print:hidden flex flex-col flex-1">
        
        {/* Navigation Header */}
        <Header
          activeSection={activeSection}
          currentView={currentView}
          onSelectSection={handleSelectSection}
          onSelectView={setCurrentView}
          onNewPlan={handleNewPlan}
          onOpenQuickSamples={() => setIsSampleModalOpen(true)}
        />

        {/* Main Content Area based on current view */}
        <main className="flex-1 pb-12">
          {currentView === 'dashboard' && (
            <Dashboard
              stats={qcStats}
              recentPlans={allPlans}
              onSelectSection={handleSelectSection}
              onOpenPlan={handleOpenPlan}
              onNewPlan={handleNewPlan}
              onOpenQuickSamples={() => setIsSampleModalOpen(true)}
            />
          )}

          {currentView === 'form' && (
            <QCPlanForm
              plan={activePlan}
              onChange={(updated) => {
                setActivePlan(updated);
                saveAutosaveDraft(updated);
              }}
              onSave={handleSaveActivePlan}
              onOpenHistory={() => setCurrentView('history')}
              onPrint={handlePrint}
              onReset={handleResetCurrentPlan}
            />
          )}

          {currentView === 'history' && (
            <PlanHistoryView
              plans={allPlans}
              onSelectPlan={handleOpenPlan}
              onDeletePlan={handleDeletePlan}
              onNewPlan={handleNewPlan}
            />
          )}
        </main>

        {/* Pharmaceutical Footer */}
        <footer className="bg-slate-900 text-slate-400 text-xs py-4 border-t border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
            <div>
              <span className="font-bold text-slate-200">AGP Limited</span> • Quality Control Laboratory • B-23-C, S.I.T.E., Karachi.
            </div>
            <div className="flex items-center space-x-3 text-[11px] text-slate-400">
              <span>SOP Compliance: QC/SOP/DPT/132 & FORM: 2006B/117EV-5</span>
              <span>•</span>
              <span className="font-mono">cGMP Validated</span>
            </div>
          </div>
        </footer>

      </div>

      {/* Quick Sample Data Modal */}
      <SampleDataModal
        isOpen={isSampleModalOpen}
        onClose={() => setIsSampleModalOpen(false)}
        onLoadSample={(samplePlan) => {
          setActiveSection(samplePlan.section);
          setActivePlan(samplePlan);
          setCurrentView('form');
          showToast(`Loaded sample data for ${samplePlan.section} Section.`);
        }}
        onRestoreAllDefaults={handleRestoreAllDefaults}
      />

      {/* Floating Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-200 print:hidden">
          <div className={`flex items-center space-x-2.5 px-4 py-3 rounded-xl shadow-2xl text-xs font-semibold text-white border ${
            toast.type === 'error'
              ? 'bg-rose-700 border-rose-600'
              : toast.type === 'info'
              ? 'bg-slate-800 border-slate-700'
              : 'bg-emerald-700 border-emerald-600'
          }`}>
            {toast.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-white shrink-0" />
            ) : toast.type === 'info' ? (
              <Info className="w-4 h-4 text-blue-300 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
            )}
            <span>{toast.message}</span>
            <button
              onClick={() => setToast(null)}
              className="ml-2 text-white/80 hover:text-white p-0.5 rounded"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
