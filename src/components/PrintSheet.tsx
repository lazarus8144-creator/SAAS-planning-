import React from 'react';
import { QCPlan } from '../types';
import { SECTION_CONFIGS, COMPANY_INFO } from '../constants/qcConfig';

interface PrintSheetProps {
  plan: QCPlan;
}

export const PrintSheet: React.FC<PrintSheetProps> = ({ plan }) => {
  const config = SECTION_CONFIGS[plan.section];
  const isStability = plan.section === 'Stability';

  return (
    <div className="hidden print:block font-sans text-black p-4 max-w-full bg-white print:p-0">
      
      {/* Official Pharmaceutical Header Box */}
      <div className="border-2 border-black p-3 mb-3">
        <div className="flex items-center justify-between border-b-2 border-black pb-2 mb-2">
          <div>
            <h1 className="text-lg font-bold uppercase tracking-wider">
              {COMPANY_INFO.name}
            </h1>
            <p className="text-xs font-semibold text-gray-700">
              {COMPANY_INFO.address}
            </p>
          </div>
          <div className="text-right">
            <h2 className="text-sm font-bold uppercase tracking-wide">
              QUALITY CONTROL DEPARTMENT
            </h2>
            <div className="text-xs font-mono font-bold mt-0.5">
              DOC REF: {plan.documentRef}
            </div>
          </div>
        </div>

        <div className="text-center py-1">
          <h2 className="text-base font-extrabold uppercase tracking-wide underline">
            {config.displayName.toUpperCase()} - DAILY PLANNING FORM
          </h2>
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-4 gap-2 text-xs pt-2 border-t border-black font-medium">
          <div>
            <span className="font-bold">SECTION: </span>
            <span>{plan.section}</span>
          </div>
          <div>
            <span className="font-bold">DATE: </span>
            <span>{plan.date}</span>
          </div>
          <div>
            <span className="font-bold">PLANNED BY: </span>
            <span>{plan.plannedBy}</span>
          </div>
          <div>
            <span className="font-bold">PLAN ID: </span>
            <span className="font-mono">{plan.planId}</span>
          </div>
        </div>
      </div>

      {/* Main QC Planning Table */}
      <table className="w-full border-collapse border-2 border-black text-xs">
        <thead>
          <tr className="bg-gray-200 border-b-2 border-black font-bold uppercase text-center">
            <th className="border border-black py-1.5 px-1 w-10">S.No.</th>
            <th className="border border-black py-1.5 px-2 text-left">MATERIAL / PRODUCT</th>
            <th className="border border-black py-1.5 px-2 w-32">{config.batchColumnHeader}</th>
            <th className="border border-black py-1.5 px-2 w-36">STAGE</th>
            <th className="border border-black py-1.5 px-2 w-32">{config.analystColumnHeader}</th>
            <th className="border border-black py-1.5 px-1 w-24">STATUS</th>
            <th className="border border-black py-1.5 px-2">REMARKS</th>
          </tr>
        </thead>
        <tbody>
          {plan.tasks.map((task, index) => {
            const prevTask = index > 0 ? plan.tasks[index - 1] : null;
            const isNewCategory = !prevTask || prevTask.category !== task.category;

            let categoryHeading = '';
            if (task.category === 'Planning') {
              categoryHeading = 'Planning of Supervisor';
            } else if (task.category === 'Analysis') {
              categoryHeading = config.analysisSectionLabel;
            } else if (task.category === 'Extra') {
              categoryHeading = config.extraTaskSectionLabel || 'Other Task';
            } else if (task.category === 'StabilitySample') {
              categoryHeading = 'Stability sample';
            }

            return (
              <React.Fragment key={task.id || index}>
                {isNewCategory && (
                  <tr className="bg-gray-100 font-bold border-y-2 border-black">
                    <td colSpan={7} className="py-1 px-2 uppercase text-[11px] tracking-wide">
                      ✦ {categoryHeading}
                    </td>
                  </tr>
                )}
                <tr className="border-b border-black">
                  <td className="border-r border-black py-1.5 px-1 text-center font-mono font-bold">
                    {task.sNo}
                  </td>
                  <td className="border-r border-black py-1.5 px-2 font-medium">
                    {task.materialProduct || <span className="opacity-0">-</span>}
                  </td>
                  <td className="border-r border-black py-1.5 px-2 font-mono text-center">
                    {task.batchNo}
                  </td>
                  <td className="border-r border-black py-1.5 px-2">
                    {task.stage}
                  </td>
                  <td className="border-r border-black py-1.5 px-2">
                    {task.analyst}
                  </td>
                  <td className="border-r border-black py-1.5 px-1 text-center font-semibold">
                    {task.status}
                  </td>
                  <td className="py-1.5 px-2 text-[11px]">
                    {task.remarks}
                  </td>
                </tr>
              </React.Fragment>
            );
          })}
        </tbody>
      </table>

      {/* Official Sign-off & Review Section */}
      <div className="border-2 border-black border-t-0 p-3 mt-0 text-xs">
        {isStability ? (
          /* FORM: 2006B/117EV-5 Stability 3 signature lines requirement */
          <div>
            <div className="font-bold uppercase tracking-wider mb-2 text-center underline">
              REVIEWED BY (FORM: 2006B/117EV-5):
            </div>
            <div className="grid grid-cols-3 gap-6 pt-3">
              {([0, 1, 2] as const).map((idx) => {
                const sig = plan.stabilityReviewers?.[idx];
                const designation = idx === 0 ? 'Supervisor / Section Incharge' : idx === 1 ? 'Manager Quality Control' : 'QA Compliance Officer';

                return (
                  <div key={idx} className="text-center">
                    <div className="h-10 border-b border-black flex items-end justify-center pb-1">
                      <span className="font-semibold text-xs">{sig?.name || ''}</span>
                    </div>
                    <p className="font-bold text-[11px] mt-1">{designation}</p>
                    <p className="text-[10px] text-gray-600">
                      Date: {sig?.date || '_________________'}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* Validation / Finish / RM Single Reviewer standard */
          <div className="flex items-center justify-between pt-2">
            <div className="w-1/3">
              <span className="font-bold">REVIEWED BY: </span>
              <span className="font-semibold">{plan.reviewedBy || '___________________________'}</span>
            </div>
            <div className="w-1/3 text-center">
              <span className="font-bold">REVIEW DATE: </span>
              <span>{plan.reviewDate || '___________________________'}</span>
            </div>
            <div className="w-1/3 text-right">
              <span className="font-bold">SIGNATURE: </span>
              <span>___________________________</span>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-3 mt-3 border-t border-dashed border-gray-400 text-[9px] text-gray-600">
          <span>AGP Limited Quality System Document • Confirmed and verified as per cGMP requirements</span>
          <span>Printed on: {new Date().toLocaleString()}</span>
        </div>
      </div>

    </div>
  );
};
