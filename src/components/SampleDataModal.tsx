import React from 'react';
import { QCPlan, SectionType } from '../types';
import { SECTION_CONFIGS, getSamplePlans } from '../constants/qcConfig';
import { Sparkles, X, Check, FileCheck, ArrowRight, RotateCcw } from 'lucide-react';

interface SampleDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadSample: (plan: QCPlan) => void;
  onRestoreAllDefaults: () => void;
}

export const SampleDataModal: React.FC<SampleDataModalProps> = ({
  isOpen,
  onClose,
  onLoadSample,
  onRestoreAllDefaults,
}) => {
  if (!isOpen) return null;

  const samples = getSamplePlans();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-150">
        
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-amber-50 border border-amber-200">
              <Sparkles className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Load Realistic AGP QC Sample Plans
              </h2>
              <p className="text-xs text-slate-500">
                Instantly populate any section with realistic pharmaceutical testing data
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {samples.map((sample) => {
            const config = SECTION_CONFIGS[sample.section];
            const filledTasks = sample.tasks.filter(t => t.materialProduct);

            return (
              <div
                key={sample.section}
                className="bg-slate-50 hover:bg-blue-50/50 p-4 rounded-xl border border-slate-200 hover:border-blue-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded border uppercase ${config.colorScheme.badge}`}>
                      {sample.section} Section
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 font-semibold">
                      {sample.documentRef}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {config.displayName}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1">
                    Supervisor: <strong>{sample.plannedBy}</strong>
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Includes {filledTasks.length} pre-filled tests (HPLC, Dissolution, etc.)
                  </p>
                </div>

                <button
                  onClick={() => {
                    onLoadSample(sample);
                    onClose();
                  }}
                  className="mt-3.5 w-full flex items-center justify-center space-x-1.5 bg-white hover:bg-blue-600 text-slate-800 hover:text-white border border-slate-300 hover:border-blue-600 text-xs font-semibold py-1.5 rounded-lg shadow-xs transition-colors"
                >
                  <span>Load {sample.section} Sample</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Factory Reset Action */}
        <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={() => {
              if (window.confirm('Reset all saved data and restore default AGP sample database?')) {
                onRestoreAllDefaults();
                onClose();
              }
            }}
            className="flex items-center space-x-1.5 text-xs text-rose-600 hover:text-rose-800 font-semibold hover:underline"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Database to Initial State</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
