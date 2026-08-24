import React, { useState, useEffect } from 'react';
import { SectionType } from '../types';
import { SECTION_CONFIGS, COMPANY_INFO } from '../constants/qcConfig';
import { 
  Building2, 
  FlaskConical, 
  Calendar, 
  Clock, 
  LayoutDashboard, 
  History, 
  FileSpreadsheet, 
  PlusCircle, 
  ShieldCheck,
  Sparkles
} from 'lucide-react';

interface HeaderProps {
  activeSection: SectionType;
  currentView: 'form' | 'dashboard' | 'history';
  onSelectSection: (section: SectionType) => void;
  onSelectView: (view: 'form' | 'dashboard' | 'history') => void;
  onNewPlan: (section: SectionType) => void;
  onOpenQuickSamples?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeSection,
  currentView,
  onSelectSection,
  onSelectView,
  onNewPlan,
  onOpenQuickSamples,
}) => {
  const [timeStr, setTimeStr] = useState<string>('');
  const [dateStr, setDateStr] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      );
      setDateStr(
        now.toLocaleDateString('en-GB', {
          weekday: 'short',
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const sections: SectionType[] = ['Validation', 'Finish', 'RM', 'Stability'];

  return (
    <header className="bg-slate-900 text-white shadow-xl border-b border-slate-800 print:hidden sticky top-0 z-40">
      {/* Top Bar: Company Identity & Live Clock */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          
          {/* Company Branding */}
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded-lg bg-blue-600 flex items-center justify-center shadow-md border border-blue-400/30 shrink-0">
              <FlaskConical className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg tracking-wide text-white font-sans">
                  {COMPANY_INFO.name}
                </span>
                <span className="text-xs bg-blue-900/80 text-blue-200 px-2 py-0.5 rounded border border-blue-700/50 font-mono">
                  QC-LAB
                </span>
              </div>
              <p className="text-xs text-slate-300 font-medium">
                {COMPANY_INFO.address} • <span className="text-slate-400">Daily Planning System</span>
              </p>
            </div>
          </div>

          {/* Controls, Live Clock & Top Navigation Actions */}
          <div className="flex items-center flex-wrap gap-2.5 sm:gap-4 self-end md:self-auto">
            {/* Live Clock Badge */}
            <div className="hidden sm:flex items-center space-x-2 bg-slate-800/90 px-3 py-1.5 rounded-md border border-slate-700 text-xs font-mono text-slate-200">
              <Calendar className="w-3.5 h-3.5 text-blue-400" />
              <span>{dateStr}</span>
              <span className="text-slate-500">|</span>
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-300 font-semibold">{timeStr}</span>
            </div>

            {/* View Switching Buttons */}
            <div className="flex items-center bg-slate-800 p-1 rounded-lg border border-slate-700 space-x-1 text-xs font-medium">
              <button
                id="btn-nav-dashboard"
                onClick={() => onSelectView('dashboard')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md transition-all ${
                  currentView === 'dashboard'
                    ? 'bg-blue-600 text-white shadow font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                }`}
                title="Overview & Summary Metrics"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </button>

              <button
                id="btn-nav-history"
                onClick={() => onSelectView('history')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md transition-all ${
                  currentView === 'history'
                    ? 'bg-blue-600 text-white shadow font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                }`}
                title="Search and View Historical Plans"
              >
                <History className="w-3.5 h-3.5" />
                <span>History & Search</span>
              </button>
            </div>

            {/* Quick Demo Samples Button */}
            {onOpenQuickSamples && (
              <button
                id="btn-quick-samples"
                onClick={onOpenQuickSamples}
                className="hidden lg:flex items-center space-x-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 px-2.5 py-1.5 rounded-md transition-colors font-medium"
                title="Load realistic AGP QC sample plans"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Load Sample Plans</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Section Tabs Navigation Bar */}
      <div className="bg-slate-950/80 border-t border-slate-800/80 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between overflow-x-auto py-1">
          <div className="flex items-center space-x-1 sm:space-x-2 py-1 min-w-max">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-2 hidden sm:inline">
              Sections:
            </span>
            {sections.map((sec) => {
              const config = SECTION_CONFIGS[sec];
              const isSelected = activeSection === sec && currentView === 'form';
              
              return (
                <button
                  key={sec}
                  id={`tab-section-${sec.toLowerCase()}`}
                  onClick={() => {
                    onSelectSection(sec);
                    onSelectView('form');
                  }}
                  className={`relative flex items-center space-x-2 px-3.5 py-2 rounded-md text-xs sm:text-sm font-medium transition-all ${
                    isSelected
                      ? 'bg-blue-600 text-white font-semibold shadow-md ring-1 ring-blue-400/40'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${
                    sec === 'Validation' ? 'bg-cyan-400' :
                    sec === 'Finish' ? 'bg-blue-400' :
                    sec === 'RM' ? 'bg-emerald-400' : 'bg-purple-400'
                  }`} />
                  <span>{sec === 'RM' ? 'RM (Raw Material)' : sec}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono hidden md:inline ${
                    isSelected ? 'bg-blue-800/70 text-blue-100' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {config.documentRef}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Quick "New Plan" Dropdown / Action for current section */}
          <div className="flex items-center space-x-2 pl-4">
            <button
              id="btn-create-fresh-plan"
              onClick={() => {
                onNewPlan(activeSection);
                onSelectView('form');
              }}
              className="flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium px-3 py-1.5 rounded-md shadow-sm transition-colors"
              title={`Create blank daily plan for ${activeSection}`}
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>New {activeSection} Plan</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
