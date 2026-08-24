export type SectionType = 'Validation' | 'Finish' | 'RM' | 'Stability';

export type TaskCategory = 'Planning' | 'Analysis' | 'Extra' | 'StabilitySample';

export type TaskStatus = 'Pending' | 'In Progress' | 'Completed' | 'On Hold' | 'Rejected';

export interface QCTaskItem {
  id: string;
  sNo: number;
  category: TaskCategory;
  categoryLabel?: string;
  materialProduct: string;
  batchNo: string;
  stage: string;
  analyst: string;
  status: TaskStatus;
  remarks: string;
}

export interface ReviewerSignature {
  name: string;
  designation?: string;
  date?: string;
  signed: boolean;
}

export interface QCPlan {
  id: string;
  planId: string;
  section: SectionType;
  date: string; // YYYY-MM-DD
  plannedBy: string;
  documentRef: string;
  reviewedBy: string;
  reviewDate?: string;
  reviewRemarks?: string;
  stabilityReviewers?: [ReviewerSignature, ReviewerSignature, ReviewerSignature];
  status: 'Draft' | 'Reviewed' | 'Approved';
  tasks: QCTaskItem[];
  createdAt: string;
  updatedAt: string;
  shift?: 'Morning' | 'Evening' | 'Night' | 'General';
}

export interface SectionConfig {
  section: SectionType;
  displayName: string;
  defaultPlannedBy: string;
  documentRef: string;
  analysisSectionLabel: string;
  extraTaskSectionLabel: string | null;
  numAnalysisRows: number;
  analystColumnHeader: 'ANALYZED BY' | 'ASSIGNED TO';
  batchColumnHeader: 'GRN / BATCH No.' | 'MATERIAL/BATCH No.';
  hasSupervisorPlanning: boolean;
  numSupervisorRows: number;
  colorScheme: {
    primary: string;
    light: string;
    border: string;
    badge: string;
    accent: string;
  };
  description: string;
}

export interface QCStats {
  totalTasks: number;
  pendingTasks: number;
  inProgressTasks: number;
  completedTasks: number;
  onHoldTasks: number;
  rejectedTasks: number;
  totalPlans: number;
  todayPlansCount: number;
  sectionStats: Record<SectionType, {
    total: number;
    pending: number;
    inProgress: number;
    completed: number;
    onHold: number;
    rejected: number;
    plansCount: number;
  }>;
}

export interface FilterOptions {
  searchQuery: string;
  section: SectionType | 'ALL';
  status: TaskStatus | 'ALL';
  dateFrom: string;
  dateTo: string;
  analyst: string;
  materialProduct: string;
}
