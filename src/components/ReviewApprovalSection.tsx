import React from 'react';
import { QCPlan, SectionType, ReviewerSignature } from '../types';
import { CheckCircle, ShieldCheck, PenLine, UserCheck, Calendar } from 'lucide-react';

interface ReviewApprovalSectionProps {
  plan: QCPlan;
  onChange: (updatedPlan: QCPlan) => void;
}

export const ReviewApprovalSection: React.FC<ReviewApprovalSectionProps> = ({
  plan,
  onChange,
}) => {
  const isStability = plan.section === 'Stability';

  // Handle single reviewer for Validation, Finish, RM
  const handleSingleReviewerChange = (field: 'reviewedBy' | 'reviewDate' | 'reviewRemarks', value: string) => {
    const updated = {
      ...plan,
      [field]: value,
      status: (value.trim() !== '' && (field === 'reviewedBy' || plan.reviewedBy)) ? 'Reviewed' as const : plan.status,
    };
    onChange(updated);
  };

  // Quick Sign helper for single reviewer
  const handleQuickSign = () => {
    const today = new Date().toISOString().split('T')[0];
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const defaultReviewer = plan.reviewedBy || 'Dr. Tariq Jamil (Head of QC)';
    
    onChange({
      ...plan,
      reviewedBy: defaultReviewer,
      reviewDate: `${today} ${nowTime}`,
      status: 'Reviewed',
    });
  };

  // Handle Stability 3-signature lines
  const handleStabilityReviewerChange = (index: number, key: keyof ReviewerSignature, value: any) => {
    const defaultSignatures: [ReviewerSignature, ReviewerSignature, ReviewerSignature] = plan.stabilityReviewers || [
      { name: '', designation: 'Supervisor / Section Incharge', signed: false },
      { name: '', designation: 'Manager Quality Control', signed: false },
      { name: '', designation: 'QA Compliance Officer', signed: false },
    ];

    const updatedSignatures: [ReviewerSignature, ReviewerSignature, ReviewerSignature] = [...defaultSignatures] as any;
    updatedSignatures[index] = {
      ...updatedSignatures[index],
      [key]: value,
    };

    // If marked signed, stamp date if not already present
    if (key === 'signed' && value === true && !updatedSignatures[index].date) {
      updatedSignatures[index].date = new Date().toISOString().split('T')[0];
    }

    const hasAnySignature = updatedSignatures.some(s => s.name.trim() !== '' || s.signed);

    onChange({
      ...plan,
      stabilityReviewers: updatedSignatures,
      status: hasAnySignature ? 'Reviewed' : 'Draft',
    });
  };

  return (
    <div className="bg-white rounded-xl border border-slate-300 p-5 shadow-sm mt-6">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-5 h-5 text-blue-700" />
          <h3 className="text-sm font-bold tracking-wide uppercase text-slate-900">
            Review & Authorization Section
          </h3>
        </div>
        <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase ${
          plan.status === 'Reviewed' || plan.status === 'Approved'
            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
            : 'bg-amber-100 text-amber-800 border border-amber-300'
        }`}>
          Status: {plan.status}
        </span>
      </div>

      {isStability ? (
        /* STABILITY SECTION: STRICTLY 3 SIGNATURE LINES AS PER FORM: 2006B/117EV-5 */
        <div className="space-y-4">
          <div className="text-xs text-slate-600 font-semibold mb-2">
            REVIEWED BY (FORM: 2006B/117EV-5 SOP Requirement - 3 Signatory Level):
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {([0, 1, 2] as const).map((idx) => {
              const sig = plan.stabilityReviewers?.[idx] || {
                name: '',
                designation: idx === 0 ? 'Supervisor / Section Incharge' : idx === 1 ? 'Manager Quality Control' : 'QA Compliance Officer',
                signed: false,
                date: '',
              };

              return (
                <div key={idx} className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">
                      Signatory #{idx + 1}: {sig.designation}
                    </span>
                    <label className="flex items-center space-x-1.5 text-xs text-slate-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={sig.signed || false}
                        onChange={(e) => handleStabilityReviewerChange(idx, 'signed', e.target.checked)}
                        className="rounded text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
                      />
                      <span className="text-[11px] font-medium text-blue-700">Verified</span>
                    </label>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-500 mb-1">
                      Reviewer Name / Signatory
                    </label>
                    <input
                      type="text"
                      value={sig.name || ''}
                      placeholder={`Enter name for line ${idx + 1}`}
                      onChange={(e) => handleStabilityReviewerChange(idx, 'name', e.target.value)}
                      className="w-full text-xs font-medium px-2.5 py-1.5 border border-slate-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-500 mb-1">
                      Review Date
                    </label>
                    <input
                      type="date"
                      value={sig.date || ''}
                      onChange={(e) => handleStabilityReviewerChange(idx, 'date', e.target.value)}
                      className="w-full text-xs font-medium px-2.5 py-1 border border-slate-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Physical blank line simulation for print view */}
                  <div className="pt-2 border-t border-dashed border-slate-300 text-center">
                    <div className="h-6 border-b border-slate-400 mb-1 flex items-end justify-center">
                      <span className="text-[10px] text-slate-400 font-mono italic">
                        {sig.signed ? `[E-Signed: ${sig.name || 'QC Officer'}]` : 'Signature Line'}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-sans">
                      Signature #{idx + 1}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* VALIDATION, FINISH, RM: STANDARD SINGLE REVIEWER SECTION */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              REVIEWED BY:
            </label>
            <div className="relative">
              <input
                id="input-reviewed-by"
                type="text"
                value={plan.reviewedBy || ''}
                placeholder="e.g. Dr. Tariq Jamil / Head of QC"
                onChange={(e) => handleSingleReviewerChange('reviewedBy', e.target.value)}
                className="w-full text-xs font-semibold px-3 py-2 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-1.5 mt-1.5">
              <button
                type="button"
                onClick={() => handleSingleReviewerChange('reviewedBy', 'Dr. Tariq Jamil (Head of QC)')}
                className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-0.5 rounded border border-slate-200"
              >
                + Head of QC
              </button>
              <button
                type="button"
                onClick={() => handleSingleReviewerChange('reviewedBy', 'Syed Arsalan (QC Manager)')}
                className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-0.5 rounded border border-slate-200"
              >
                + QC Manager
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              REVIEW DATE & TIME:
            </label>
            <input
              id="input-review-date"
              type="text"
              value={plan.reviewDate || ''}
              placeholder="e.g. 2026-08-24 16:30"
              onChange={(e) => handleSingleReviewerChange('reviewDate', e.target.value)}
              className="w-full text-xs font-mono px-3 py-2 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={handleQuickSign}
              className="mt-1.5 text-[10px] text-blue-700 font-semibold hover:underline flex items-center space-x-1"
            >
              <PenLine className="w-3 h-3" />
              <span>Stamp Current Date & Sign Off</span>
            </button>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              REVIEW REMARKS / APPROVAL NOTES:
            </label>
            <input
              id="input-review-remarks"
              type="text"
              value={plan.reviewRemarks || ''}
              placeholder="e.g. Plan reviewed and approved for daily QC testing execution"
              onChange={(e) => handleSingleReviewerChange('reviewRemarks', e.target.value)}
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-[10px] text-slate-500 mt-1">
              Compliance check as per SOP {plan.documentRef}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
