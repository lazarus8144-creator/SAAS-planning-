import { SectionConfig, SectionType, QCTaskItem, QCPlan } from '../types';

export const COMPANY_INFO = {
  name: 'AGP Limited',
  address: 'B-23-C, S.I.T.E., Karachi.',
  department: 'Quality Control Laboratory',
  fullTitle: 'AGP Limited, B-23-C, S.I.T.E., Karachi.',
  systemName: 'QC Laboratory Daily Planning System',
};

export const SECTION_CONFIGS: Record<SectionType, SectionConfig> = {
  Validation: {
    section: 'Validation',
    displayName: 'Validation Section',
    defaultPlannedBy: 'Afzal Irshad',
    documentRef: 'QC/SOP/DPT/132',
    analysisSectionLabel: 'Validation Analysis',
    extraTaskSectionLabel: 'Other Task',
    numAnalysisRows: 9,
    analystColumnHeader: 'ANALYZED BY',
    batchColumnHeader: 'GRN / BATCH No.',
    hasSupervisorPlanning: true,
    numSupervisorRows: 5,
    colorScheme: {
      primary: '#0d5c75',
      light: '#f0f9ff',
      border: '#bae6fd',
      badge: 'bg-cyan-50 text-cyan-800 border-cyan-300',
      accent: 'cyan',
    },
    description: 'Process validation, cleaning validation, analytical method transfer & protocol testing.',
  },
  Finish: {
    section: 'Finish',
    displayName: 'Finished Product Section',
    defaultPlannedBy: 'Nadia',
    documentRef: 'QC/SOP/DPT/132',
    analysisSectionLabel: 'Finished Analysis',
    extraTaskSectionLabel: 'Night Shift',
    numAnalysisRows: 9,
    analystColumnHeader: 'ANALYZED BY',
    batchColumnHeader: 'GRN / BATCH No.',
    hasSupervisorPlanning: true,
    numSupervisorRows: 5,
    colorScheme: {
      primary: '#1e3a8a',
      light: '#eff6ff',
      border: '#bfdbfe',
      badge: 'bg-blue-50 text-blue-800 border-blue-300',
      accent: 'blue',
    },
    description: 'Finished dosage release testing, dissolution, assay, uniformity, & packaging verification.',
  },
  RM: {
    section: 'RM',
    displayName: 'Raw Material Section',
    defaultPlannedBy: 'Shariq Ali',
    documentRef: 'QC/SOP/DPT/132',
    analysisSectionLabel: 'RM Analysis',
    extraTaskSectionLabel: 'Other Task',
    numAnalysisRows: 9,
    analystColumnHeader: 'ANALYZED BY',
    batchColumnHeader: 'GRN / BATCH No.',
    hasSupervisorPlanning: true,
    numSupervisorRows: 5,
    colorScheme: {
      primary: '#065f46',
      light: '#ecfdf5',
      border: '#a7f3d0',
      badge: 'bg-emerald-50 text-emerald-800 border-emerald-300',
      accent: 'emerald',
    },
    description: 'Incoming Active Pharmaceutical Ingredients (APIs) and excipients quality evaluation & release.',
  },
  Stability: {
    section: 'Stability',
    displayName: 'Stability Study Section',
    defaultPlannedBy: 'Muhammad Fawad',
    documentRef: 'FORM: 2006B/117EV-5',
    analysisSectionLabel: 'Stability sample',
    extraTaskSectionLabel: null,
    numAnalysisRows: 6,
    analystColumnHeader: 'ASSIGNED TO',
    batchColumnHeader: 'MATERIAL/BATCH No.',
    hasSupervisorPlanning: false,
    numSupervisorRows: 0,
    colorScheme: {
      primary: '#5b21b6',
      light: '#f5f3ff',
      border: '#ddd6fe',
      badge: 'bg-purple-50 text-purple-800 border-purple-300',
      accent: 'purple',
    },
    description: 'Accelerated (40°C/75% RH) and real-time (30°C/65% RH) stability time-point tracking.',
  },
};

export const COMMON_ANALYSTS: Record<SectionType, string[]> = {
  Validation: ['Afzal Irshad', 'Asim Khan', 'Zeeshan Ahmed', 'Madiha Tariq', 'Farhan Siddiqui', 'Saad Qureshi'],
  Finish: ['Nadia', 'Rashid Mehmood', 'Samina Naz', 'Bilal Hussain', 'Waqas Ali', 'Sumera Bano', 'Imran Shah'],
  RM: ['Shariq Ali', 'Tariq Mehmood', 'Usman Ghani', 'Hina Fatima', 'Danish Raza', 'Kamran Sheikh'],
  Stability: ['Muhammad Fawad', 'Khurram Shehzad', 'Amna Raheem', 'Zubair Baig', 'Naveed Akhtar', 'Fatima Zahra'],
};

export const COMMON_STAGES: Record<SectionType, string[]> = {
  Validation: [
    'Cleaning Validation (Swab)',
    'Process Validation (Stage 1)',
    'Process Validation (Stage 2)',
    'Process Validation (Stage 3)',
    'Method Verification',
    'Hold Time Study (24h)',
    'Hold Time Study (48h)',
    'Analytical Transfer Assay',
  ],
  Finish: [
    'Assay by HPLC',
    'Dissolution Rate Test',
    'Uniformity of Dosage Units',
    'Related Substances / Impurities',
    'Disintegration Time',
    'Hardness & Friability',
    'Microbial Limit Testing',
    'pH & Viscosity',
    'Identification Test',
  ],
  RM: [
    'Complete Testing / Release',
    'Assay (Titrimetric)',
    'Assay (HPLC/UV)',
    'Identification (FTIR)',
    'Loss on Drying / Moisture (KF)',
    'Heavy Metals / Arsenic',
    'Chromatographic Purity',
    'Residue on Ignition',
    'Particle Size Distribution',
  ],
  Stability: [
    '03 Months (40°C ± 2°C / 75% RH ± 5%)',
    '06 Months (40°C ± 2°C / 75% RH ± 5%)',
    '12 Months (30°C ± 2°C / 65% RH ± 5%)',
    '18 Months (30°C ± 2°C / 65% RH ± 5%)',
    '24 Months (30°C ± 2°C / 65% RH ± 5%)',
    '36 Months (30°C ± 2°C / 65% RH ± 5%)',
    'Photostability Testing',
    'Thermal Stress Study',
  ],
};

export const COMMON_PRODUCTS: Record<SectionType, string[]> = {
  Validation: [
    'Cefiget (Cefixime) 400mg Cap',
    'Clari-AGP (Clarithromycin) 500mg Tab',
    'Rigix (Cetirizine 2HCl) 10mg Tab',
    'Zest (Levofloxacin) 500mg Tab',
    'Linaglip (Linagliptin) 5mg Tab',
  ],
  Finish: [
    'Rigix 10mg Tablets (Batch: RG-26801)',
    'Cefiget 400mg Capsules (Batch: CF-11492)',
    'Clari-AGP 500mg Tablets (Batch: CL-9034)',
    'Panadol 500mg Tablets (Batch: PN-4412)',
    'Zest 500mg Tablets (Batch: ZS-8821)',
    'AGP-Met 500/50mg (Batch: AM-3310)',
    'L-Cet 5mg Oral Sol (Batch: LC-0551)',
    'Gliclazide 80mg MR (Batch: GL-1290)',
  ],
  RM: [
    'Paracetamol Powder BP (GRN: RM-26019)',
    'Cefixime Trihydrate USP (GRN: RM-26020)',
    'Clarithromycin Micronized (GRN: RM-26021)',
    'Microcrystalline Cellulose PH-102 (GRN: EX-0914)',
    'Magnesium Stearate Pharma Grade (GRN: EX-0915)',
    'Croscarmellose Sodium USP (GRN: EX-0916)',
    'Lactose Monohydrate 200 Mesh (GRN: EX-0917)',
    'Povidone K-30 USP (GRN: EX-0918)',
  ],
  Stability: [
    'Rigix 10mg Tabs (Alu-Alu blister)',
    'Cefiget 400mg Caps (PVC-PVDC pack)',
    'Clari-AGP 500mg Tabs (Alu-Alu)',
    'AGP-Met SR 850mg (Blister pack)',
    'Zest 500mg Tablets (Alu-Alu)',
    'Spasmo-Proxyvon Plus Caps (Strip)',
  ],
};

/**
 * Generate default empty task structure strictly adhering to the section configuration rules:
 * - Validation / Finish / RM:
 *    - Category: "Planning" -> 5 rows (S.No 1-5)
 *    - Category: "Analysis" -> 9 rows (S.No 6-14)
 *    - Category: "Extra" -> 1 row (S.No 15)
 * - Stability:
 *    - Category: "StabilitySample" -> 6 rows (S.No 1-6)
 */
export function createDefaultTasksForSection(section: SectionType): QCTaskItem[] {
  const config = SECTION_CONFIGS[section];
  const tasks: QCTaskItem[] = [];
  let currentSNo = 1;

  if (config.hasSupervisorPlanning) {
    // 5 rows for Planning of Supervisor
    for (let i = 0; i < config.numSupervisorRows; i++) {
      tasks.push({
        id: `task-${section}-plan-${currentSNo}`,
        sNo: currentSNo,
        category: 'Planning',
        categoryLabel: 'Planning of Supervisor',
        materialProduct: '',
        batchNo: '',
        stage: '',
        analyst: '',
        status: 'Pending',
        remarks: '',
      });
      currentSNo++;
    }

    // 9 rows for Section Analysis
    for (let i = 0; i < config.numAnalysisRows; i++) {
      tasks.push({
        id: `task-${section}-analysis-${currentSNo}`,
        sNo: currentSNo,
        category: 'Analysis',
        categoryLabel: config.analysisSectionLabel,
        materialProduct: '',
        batchNo: '',
        stage: '',
        analyst: '',
        status: 'Pending',
        remarks: '',
      });
      currentSNo++;
    }

    // 1 row for Extra Task (Other Task / Night Shift)
    if (config.extraTaskSectionLabel) {
      tasks.push({
        id: `task-${section}-extra-${currentSNo}`,
        sNo: currentSNo,
        category: 'Extra',
        categoryLabel: config.extraTaskSectionLabel,
        materialProduct: '',
        batchNo: '',
        stage: '',
        analyst: '',
        status: 'Pending',
        remarks: '',
      });
      currentSNo++;
    }
  } else {
    // Stability Section - Strictly 6 rows under Stability sample heading
    for (let i = 0; i < config.numAnalysisRows; i++) {
      tasks.push({
        id: `task-stability-${currentSNo}`,
        sNo: currentSNo,
        category: 'StabilitySample',
        categoryLabel: config.analysisSectionLabel,
        materialProduct: '',
        batchNo: '',
        stage: '',
        analyst: '',
        status: 'Pending',
        remarks: '',
      });
      currentSNo++;
    }
  }

  return tasks;
}

/**
 * Generate a new QCPlan object for the given section with default configurations
 */
export function createNewPlan(section: SectionType, dateStr?: string): QCPlan {
  const config = SECTION_CONFIGS[section];
  const today = dateStr || new Date().toISOString().split('T')[0];
  const timeStamp = new Date().toISOString();
  const dateFormatted = today.replace(/-/g, '');
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const planId = `AGP-QC-${section.toUpperCase()}-${dateFormatted}-${randomSuffix}`;

  return {
    id: `plan-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    planId,
    section,
    date: today,
    plannedBy: config.defaultPlannedBy,
    documentRef: config.documentRef,
    reviewedBy: '',
    reviewDate: '',
    reviewRemarks: '',
    stabilityReviewers: section === 'Stability' ? [
      { name: '', designation: 'Supervisor / Section Incharge', signed: false },
      { name: '', designation: 'Manager Quality Control', signed: false },
      { name: '', designation: 'QA Compliance Officer', signed: false },
    ] : undefined,
    status: 'Draft',
    tasks: createDefaultTasksForSection(section),
    createdAt: timeStamp,
    updatedAt: timeStamp,
    shift: 'Morning',
  };
}

/**
 * Realistic seed plans for each section demonstrating a working GMP environment
 */
export function getSamplePlans(): QCPlan[] {
  const today = new Date().toISOString().split('T')[0];

  // 1. Finish Section Sample Plan
  const finishPlan = createNewPlan('Finish', today);
  finishPlan.planId = 'AGP-QC-FINISH-20260824-001';
  finishPlan.plannedBy = 'Nadia';
  finishPlan.status = 'Draft';
  finishPlan.tasks[0] = {
    ...finishPlan.tasks[0],
    materialProduct: 'Rigix 10mg Tablets',
    batchNo: 'RG-26801',
    stage: 'Assay by HPLC',
    analyst: 'Rashid Mehmood',
    status: 'In Progress',
    remarks: 'Sample received at 08:30 AM, standard prep ready',
  };
  finishPlan.tasks[1] = {
    ...finishPlan.tasks[1],
    materialProduct: 'Cefiget 400mg Capsules',
    batchNo: 'CF-11492',
    stage: 'Dissolution Rate Test',
    analyst: 'Samina Naz',
    status: 'Completed',
    remarks: 'Complies with USP limits (>80% in 45 min)',
  };
  finishPlan.tasks[2] = {
    ...finishPlan.tasks[2],
    materialProduct: 'Clari-AGP 500mg Tablets',
    batchNo: 'CL-9034',
    stage: 'Uniformity of Dosage Units',
    analyst: 'Bilal Hussain',
    status: 'In Progress',
    remarks: 'Testing 10 units as per SOP',
  };
  finishPlan.tasks[5] = {
    ...finishPlan.tasks[5],
    materialProduct: 'Panadol 500mg Tablets',
    batchNo: 'PN-4412',
    stage: 'Assay & Identification',
    analyst: 'Waqas Ali',
    status: 'Pending',
    remarks: 'Scheduled for 11:00 AM after system suitability',
  };
  finishPlan.tasks[6] = {
    ...finishPlan.tasks[6],
    materialProduct: 'Zest 500mg Tablets',
    batchNo: 'ZS-8821',
    stage: 'Related Substances',
    analyst: 'Sumera Bano',
    status: 'In Progress',
    remarks: 'Sequence running on HPLC-04',
  };
  finishPlan.tasks[14] = {
    ...finishPlan.tasks[14],
    materialProduct: 'AGP-Met 500/50mg Tab',
    batchNo: 'AM-3310',
    stage: 'Disintegration & Hardness',
    analyst: 'Imran Shah',
    status: 'Pending',
    remarks: 'Night shift analysis for morning packaging line release',
  };

  // 2. Validation Section Sample Plan
  const validationPlan = createNewPlan('Validation', today);
  validationPlan.planId = 'AGP-QC-VAL-20260824-002';
  validationPlan.plannedBy = 'Afzal Irshad';
  validationPlan.reviewedBy = 'Dr. Tariq Jamil (Head of QC)';
  validationPlan.reviewDate = `${today} 16:45`;
  validationPlan.status = 'Reviewed';
  validationPlan.tasks[0] = {
    ...validationPlan.tasks[0],
    materialProduct: 'Cefiget 400mg Cap (Line 3)',
    batchNo: 'VAL-CF-03A',
    stage: 'Process Validation (Stage 1)',
    analyst: 'Asim Khan',
    status: 'Completed',
    remarks: 'Protocol # VP-CF-2026-03 passed all CQA tests',
  };
  validationPlan.tasks[1] = {
    ...validationPlan.tasks[1],
    materialProduct: 'Granulator Area B-12',
    batchNo: 'SWAB-GRN-12',
    stage: 'Cleaning Validation (Swab)',
    analyst: 'Zeeshan Ahmed',
    status: 'Completed',
    remarks: 'TOC and HPLC swab residue below acceptance limit',
  };
  validationPlan.tasks[5] = {
    ...validationPlan.tasks[5],
    materialProduct: 'Clari-AGP Suspension',
    batchNo: 'VAL-CL-01B',
    stage: 'Hold Time Study (48h)',
    analyst: 'Madiha Tariq',
    status: 'In Progress',
    remarks: 'Assay and microbiological bioburden within limits',
  };

  // 3. RM Section Sample Plan
  const rmPlan = createNewPlan('RM', today);
  rmPlan.planId = 'AGP-QC-RM-20260824-003';
  rmPlan.plannedBy = 'Shariq Ali';
  rmPlan.status = 'Draft';
  rmPlan.tasks[0] = {
    ...rmPlan.tasks[0],
    materialProduct: 'Paracetamol Powder BP',
    batchNo: 'RM-26019',
    stage: 'Complete Testing / Release',
    analyst: 'Tariq Mehmood',
    status: 'In Progress',
    remarks: 'Supplier: Granules India, COA verified',
  };
  rmPlan.tasks[1] = {
    ...rmPlan.tasks[1],
    materialProduct: 'Cefixime Trihydrate USP',
    batchNo: 'RM-26020',
    stage: 'Assay (HPLC) & Moisture',
    analyst: 'Usman Ghani',
    status: 'Pending',
    remarks: 'Urgent release for tomorrow production schedule',
  };
  rmPlan.tasks[5] = {
    ...rmPlan.tasks[5],
    materialProduct: 'Microcrystalline Cellulose PH-102',
    batchNo: 'EX-0914',
    stage: 'Loss on Drying / Identification',
    analyst: 'Hina Fatima',
    status: 'Completed',
    remarks: 'LOD 3.8% (Spec: ≤ 5.0%), FTIR confirms identity',
  };

  // 4. Stability Section Sample Plan
  const stabilityPlan = createNewPlan('Stability', today);
  stabilityPlan.planId = 'AGP-QC-STAB-20260824-004';
  stabilityPlan.plannedBy = 'Muhammad Fawad';
  stabilityPlan.status = 'Draft';
  stabilityPlan.stabilityReviewers = [
    { name: 'Muhammad Fawad', designation: 'Supervisor Stability', date: `${today}`, signed: true },
    { name: 'Dr. Tariq Jamil', designation: 'Manager Quality Control', date: '', signed: false },
    { name: 'Syed Arsalan QA', designation: 'QA Compliance Officer', date: '', signed: false },
  ];
  stabilityPlan.tasks[0] = {
    ...stabilityPlan.tasks[0],
    materialProduct: 'Rigix 10mg Tabs (Alu-Alu)',
    batchNo: 'RG-25109',
    stage: '06 Months (40°C ± 2°C / 75% RH ± 5%)',
    analyst: 'Khurram Shehzad',
    status: 'In Progress',
    remarks: 'Sample pulled on time from Chamber #2',
  };
  stabilityPlan.tasks[1] = {
    ...stabilityPlan.tasks[1],
    materialProduct: 'Cefiget 400mg Caps (PVC-PVDC)',
    batchNo: 'CF-24901',
    stage: '12 Months (30°C ± 2°C / 65% RH ± 5%)',
    analyst: 'Amna Raheem',
    status: 'Completed',
    remarks: 'Assay 99.4%, dissolution 88% in 45 min',
  };
  stabilityPlan.tasks[2] = {
    ...stabilityPlan.tasks[2],
    materialProduct: 'Clari-AGP 500mg Tabs',
    batchNo: 'CL-25033',
    stage: '03 Months (40°C ± 2°C / 75% RH ± 5%)',
    analyst: 'Zubair Baig',
    status: 'Pending',
    remarks: 'Chamber #1 pull, scheduled for HPLC assay',
  };
  stabilityPlan.tasks[3] = {
    ...stabilityPlan.tasks[3],
    materialProduct: 'AGP-Met SR 850mg',
    batchNo: 'AM-24110',
    stage: '24 Months (30°C ± 2°C / 65% RH ± 5%)',
    analyst: 'Naveed Akhtar',
    status: 'Pending',
    remarks: 'Long-term stability evaluation',
  };
  stabilityPlan.tasks[4] = {
    ...stabilityPlan.tasks[4],
    materialProduct: 'Zest 500mg Tablets',
    batchNo: 'ZS-25088',
    stage: '06 Months (40°C ± 2°C / 75% RH ± 5%)',
    analyst: 'Fatima Zahra',
    status: 'Completed',
    remarks: 'Dissolution profile matches initial release',
  };
  stabilityPlan.tasks[5] = {
    ...stabilityPlan.tasks[5],
    materialProduct: 'Spasmo-Proxyvon Plus Caps',
    batchNo: 'SP-25419',
    stage: 'Photostability Testing',
    analyst: 'Muhammad Fawad',
    status: 'In Progress',
    remarks: 'Direct exposure in photostability chamber',
  };

  // 5. Historical Back-Dated Plan (Yesterday - Locked / Read-Only demo)
  const yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yYear = yesterdayDate.getFullYear();
  const yMonth = String(yesterdayDate.getMonth() + 1).padStart(2, '0');
  const yDay = String(yesterdayDate.getDate()).padStart(2, '0');
  const yesterday = `${yYear}-${yMonth}-${yDay}`;

  const historicalFinishPlan = createNewPlan('Finish', yesterday);
  historicalFinishPlan.planId = `AGP-QC-FINISH-${yesterday.replace(/-/g, '')}-ARCH01`;
  historicalFinishPlan.plannedBy = 'Nadia';
  historicalFinishPlan.reviewedBy = 'Dr. Tariq Jamil (Head of QC)';
  historicalFinishPlan.reviewDate = `${yesterday} 17:00`;
  historicalFinishPlan.reviewRemarks = 'All daily finished product QC batch testing completed and approved.';
  historicalFinishPlan.status = 'Reviewed';
  historicalFinishPlan.tasks[0] = {
    ...historicalFinishPlan.tasks[0],
    materialProduct: 'Panadol 500mg Tablets',
    batchNo: 'PN-4409',
    stage: 'Assay by HPLC',
    analyst: 'Rashid Mehmood',
    status: 'Completed',
    remarks: 'Assay 100.2% (BP Spec 95.0% - 105.0%)',
  };
  historicalFinishPlan.tasks[1] = {
    ...historicalFinishPlan.tasks[1],
    materialProduct: 'Rigix 10mg Tablets',
    batchNo: 'RG-26799',
    stage: 'Dissolution Rate Test',
    analyst: 'Samina Naz',
    status: 'Completed',
    remarks: 'Stage 1 release, 89% dissolved in 30 min',
  };
  historicalFinishPlan.tasks[2] = {
    ...historicalFinishPlan.tasks[2],
    materialProduct: 'Zest 500mg Tablets',
    batchNo: 'ZS-8819',
    stage: 'Uniformity of Dosage Units',
    analyst: 'Bilal Hussain',
    status: 'Completed',
    remarks: 'AV = 3.2 (Complies L1 < 15.0)',
  };

  return [finishPlan, validationPlan, rmPlan, stabilityPlan, historicalFinishPlan];
}
