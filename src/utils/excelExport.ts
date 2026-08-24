import * as XLSX from 'xlsx';
import { QCPlan } from '../types';
import { SECTION_CONFIGS, COMPANY_INFO } from '../constants/qcConfig';

export function exportPlanToExcel(plan: QCPlan): void {
  const config = SECTION_CONFIGS[plan.section];

  // Prepare sheet data rows
  const rows: (string | number)[][] = [];

  // 1. Company Header
  rows.push([COMPANY_INFO.fullTitle]);
  rows.push([`QUALITY CONTROL LABORATORY - DAILY PLANNING SHEET (${plan.section.toUpperCase()} SECTION)`]);
  rows.push([`DOCUMENT REFERENCE: ${plan.documentRef}`, '', '', `PLAN ID: ${plan.planId}`]);
  rows.push([]); // Empty row for spacing

  // 2. Metadata Section
  rows.push([
    'SECTION:',
    plan.section,
    'DATE:',
    plan.date,
    'PLANNED BY:',
    plan.plannedBy,
    'STATUS:',
    plan.status,
  ]);
  rows.push([]);

  // 3. Table Column Headers
  const headers = [
    'S. No.',
    'MATERIAL / PRODUCT',
    config.batchColumnHeader,
    'STAGE',
    config.analystColumnHeader,
    'STATUS',
    'REMARKS',
  ];
  rows.push(headers);

  // 4. Data Rows with Category Headings
  let lastCategory = '';
  
  plan.tasks.forEach((task) => {
    // Check if category changed to print Section Subheading
    const categoryTitle = task.categoryLabel || 
      (task.category === 'Planning' ? 'Planning of Supervisor' :
       task.category === 'Analysis' ? config.analysisSectionLabel :
       task.category === 'Extra' ? (config.extraTaskSectionLabel || 'Other Task') :
       'Stability sample');

    if (categoryTitle !== lastCategory) {
      rows.push([`--- ${categoryTitle.toUpperCase()} ---`, '', '', '', '', '', '']);
      lastCategory = categoryTitle;
    }

    rows.push([
      task.sNo,
      task.materialProduct || '',
      task.batchNo || '',
      task.stage || '',
      task.analyst || '',
      task.status || 'Pending',
      task.remarks || '',
    ]);
  });

  rows.push([]); // Empty row before signatures

  // 5. Review & Signature Footer
  if (plan.section === 'Stability') {
    rows.push(['REVIEWED BY (STABILITY SECTION - FORM: 2006B/117EV-5):']);
    rows.push([]);
    rows.push(['1. Supervisor / In-Charge:', plan.stabilityReviewers?.[0]?.name || '_________________________', 'Date:', plan.stabilityReviewers?.[0]?.date || '__________', 'Sign: ______________']);
    rows.push(['2. Manager Quality Control:', plan.stabilityReviewers?.[1]?.name || '_________________________', 'Date:', plan.stabilityReviewers?.[1]?.date || '__________', 'Sign: ______________']);
    rows.push(['3. QA Compliance Officer:', plan.stabilityReviewers?.[2]?.name || '_________________________', 'Date:', plan.stabilityReviewers?.[2]?.date || '__________', 'Sign: ______________']);
  } else {
    rows.push(['REVIEWED BY:', plan.reviewedBy || '_________________________', 'REVIEW DATE:', plan.reviewDate || '__________', 'SIGNATURE: __________________']);
    if (plan.reviewRemarks) {
      rows.push(['REVIEW REMARKS:', plan.reviewRemarks]);
    }
  }

  // Create worksheet
  const ws = XLSX.utils.aoa_to_sheet(rows);

  // Set column widths
  ws['!cols'] = [
    { wch: 8 },  // S. No.
    { wch: 34 }, // MATERIAL / PRODUCT
    { wch: 22 }, // BATCH NO
    { wch: 28 }, // STAGE
    { wch: 22 }, // ANALYST
    { wch: 15 }, // STATUS
    { wch: 40 }, // REMARKS
  ];

  // Create workbook and append sheet
  const wb = XLSX.utils.book_new();
  const sheetName = `${plan.section}_Plan_${plan.date}`;
  XLSX.utils.book_append_sheet(wb, ws, sheetName.substring(0, 31));

  // Generate file name
  const fileName = `AGP_QC_Plan_${plan.section}_${plan.date}_${plan.planId}.xlsx`;
  XLSX.writeFile(wb, fileName);
}
