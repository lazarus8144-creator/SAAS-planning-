import { QCPlan, SectionType, QCStats } from '../types';
import { getSamplePlans, createNewPlan } from '../constants/qcConfig';
import { isPlanBackDated, isPlanDateToday, getTodayDateString } from './dateUtils';

const STORAGE_KEYS = {
  PLANS: 'agp_qc_plans_v1',
  ACTIVE_SECTION: 'agp_qc_active_section',
  LAST_LOADED_PLAN: 'agp_qc_last_loaded_plan_id',
  AUTOSAVE_PREFIX: 'agp_qc_autosave_',
};

/**
 * Initialize storage with sample data if first time
 */
export function initializeStorage(): QCPlan[] {
  try {
    const existing = localStorage.getItem(STORAGE_KEYS.PLANS);
    if (!existing) {
      const samplePlans = getSamplePlans();
      localStorage.setItem(STORAGE_KEYS.PLANS, JSON.stringify(samplePlans));
      return samplePlans;
    }
    return JSON.parse(existing);
  } catch (error) {
    console.error('Error initializing storage:', error);
    return getSamplePlans();
  }
}

/**
 * Get all stored plans
 */
export function getAllPlans(): QCPlan[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PLANS);
    if (!data) {
      return initializeStorage();
    }
    return JSON.parse(data);
  } catch (error) {
    console.error('Error fetching plans:', error);
    return [];
  }
}

/**
 * Save or update a plan (with same-date permission enforcement)
 */
export function savePlan(plan: QCPlan): { success: boolean; message: string; plan: QCPlan } {
  try {
    const allPlans = getAllPlans();
    
    // Check if the plan is back-dated
    if (isPlanBackDated(plan.date)) {
      return {
        success: false,
        message: 'Permission Denied: Back-dated plans cannot be edited. As per GMP Data Integrity compliance, modifications are only permitted on the same date and day.',
        plan,
      };
    }

    const updatedPlan: QCPlan = {
      ...plan,
      updatedAt: new Date().toISOString(),
    };

    const index = allPlans.findIndex(p => p.id === updatedPlan.id || p.planId === updatedPlan.planId);
    if (index >= 0) {
      // Also verify if the existing stored record was back-dated
      const existingPlan = allPlans[index];
      if (isPlanBackDated(existingPlan.date)) {
        return {
          success: false,
          message: 'Permission Denied: Cannot modify a historical back-dated plan. Editing is restricted to the same date.',
          plan: existingPlan,
        };
      }
      allPlans[index] = updatedPlan;
    } else {
      allPlans.unshift(updatedPlan);
    }

    localStorage.setItem(STORAGE_KEYS.PLANS, JSON.stringify(allPlans));
    localStorage.setItem(STORAGE_KEYS.LAST_LOADED_PLAN, updatedPlan.id);
    
    // Clear autosave draft for this section since it is saved
    clearAutosaveDraft(updatedPlan.section);

    return {
      success: true,
      message: `Plan ${updatedPlan.planId} for ${updatedPlan.section} Section saved successfully.`,
      plan: updatedPlan,
    };
  } catch (error) {
    console.error('Error saving plan:', error);
    return {
      success: false,
      message: 'Failed to save plan due to storage error.',
      plan,
    };
  }
}

/**
 * Delete a plan by ID (with same-date permission enforcement)
 */
export function deletePlan(planId: string): { success: boolean; message: string } {
  try {
    const allPlans = getAllPlans();
    const targetPlan = allPlans.find(p => p.id === planId || p.planId === planId);

    if (!targetPlan) {
      return {
        success: false,
        message: 'Plan not found in storage.',
      };
    }

    // Enforce permission: cannot delete back-dated plans
    if (isPlanBackDated(targetPlan.date)) {
      return {
        success: false,
        message: 'Permission Denied: Back-dated plans cannot be deleted as per GMP regulatory compliance. Deletions are strictly limited to same-day records.',
      };
    }

    const filtered = allPlans.filter(p => p.id !== planId && p.planId !== planId);
    localStorage.setItem(STORAGE_KEYS.PLANS, JSON.stringify(filtered));
    return {
      success: true,
      message: `Plan ${targetPlan.planId} deleted successfully.`,
    };
  } catch (error) {
    console.error('Error deleting plan:', error);
    return {
      success: false,
      message: 'Failed to delete plan due to storage error.',
    };
  }
}

/**
 * Get the latest plan for a section, or create a fresh default one
 */
export function getLatestPlanForSection(section: SectionType): QCPlan {
  const allPlans = getAllPlans();
  const today = new Date().toISOString().split('T')[0];
  
  // Try to find today's plan for this section
  const todayPlan = allPlans.find(p => p.section === section && p.date === today);
  if (todayPlan) {
    return todayPlan;
  }

  // Else find most recent plan for this section
  const sectionPlans = allPlans.filter(p => p.section === section);
  if (sectionPlans.length > 0) {
    // Sort by updatedAt desc
    sectionPlans.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    return sectionPlans[0];
  }

  // Otherwise create a new plan
  return createNewPlan(section);
}

/**
 * Autosave draft support
 */
export function saveAutosaveDraft(plan: QCPlan): void {
  try {
    localStorage.setItem(`${STORAGE_KEYS.AUTOSAVE_PREFIX}${plan.section}`, JSON.stringify({
      plan,
      savedAt: new Date().toISOString(),
    }));
  } catch (e) {
    console.warn('Autosave failed:', e);
  }
}

export function getAutosaveDraft(section: SectionType): QCPlan | null {
  try {
    const item = localStorage.getItem(`${STORAGE_KEYS.AUTOSAVE_PREFIX}${section}`);
    if (item) {
      const parsed = JSON.parse(item);
      return parsed.plan;
    }
  } catch (e) {
    console.warn('Get autosave failed:', e);
  }
  return null;
}

export function clearAutosaveDraft(section: SectionType): void {
  try {
    localStorage.removeItem(`${STORAGE_KEYS.AUTOSAVE_PREFIX}${section}`);
  } catch (e) {
    console.warn('Clear autosave failed:', e);
  }
}

/**
 * Compute real-time QC dashboard statistics
 */
export function calculateQCStats(plans: QCPlan[]): QCStats {
  const stats: QCStats = {
    totalTasks: 0,
    pendingTasks: 0,
    inProgressTasks: 0,
    completedTasks: 0,
    onHoldTasks: 0,
    rejectedTasks: 0,
    totalPlans: plans.length,
    todayPlansCount: 0,
    sectionStats: {
      Validation: { total: 0, pending: 0, inProgress: 0, completed: 0, onHold: 0, rejected: 0, plansCount: 0 },
      Finish: { total: 0, pending: 0, inProgress: 0, completed: 0, onHold: 0, rejected: 0, plansCount: 0 },
      RM: { total: 0, pending: 0, inProgress: 0, completed: 0, onHold: 0, rejected: 0, plansCount: 0 },
      Stability: { total: 0, pending: 0, inProgress: 0, completed: 0, onHold: 0, rejected: 0, plansCount: 0 },
    },
  };

  const today = new Date().toISOString().split('T')[0];

  plans.forEach(plan => {
    if (plan.date === today) {
      stats.todayPlansCount++;
    }

    const sec = plan.section;
    if (stats.sectionStats[sec]) {
      stats.sectionStats[sec].plansCount++;
    }

    plan.tasks.forEach(task => {
      // Only count if there's actual activity or task specified
      const hasContent = task.materialProduct.trim() !== '' || task.stage.trim() !== '' || task.analyst.trim() !== '';
      if (hasContent) {
        stats.totalTasks++;
        if (stats.sectionStats[sec]) {
          stats.sectionStats[sec].total++;
        }

        switch (task.status) {
          case 'Pending':
            stats.pendingTasks++;
            if (stats.sectionStats[sec]) stats.sectionStats[sec].pending++;
            break;
          case 'In Progress':
            stats.inProgressTasks++;
            if (stats.sectionStats[sec]) stats.sectionStats[sec].inProgress++;
            break;
          case 'Completed':
            stats.completedTasks++;
            if (stats.sectionStats[sec]) stats.sectionStats[sec].completed++;
            break;
          case 'On Hold':
            stats.onHoldTasks++;
            if (stats.sectionStats[sec]) stats.sectionStats[sec].onHold++;
            break;
          case 'Rejected':
            stats.rejectedTasks++;
            if (stats.sectionStats[sec]) stats.sectionStats[sec].rejected++;
            break;
        }
      }
    });
  });

  return stats;
}
