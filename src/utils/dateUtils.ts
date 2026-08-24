/**
 * Pharmaceutical QC Laboratory Date & Compliance Permission Utilities
 * Enforces rule: Edit and Delete permissions are ONLY allowed on the same date and day (Today).
 * Back-dated records are strictly locked in Read-Only mode to satisfy GMP data integrity.
 */

/**
 * Returns today's date in local YYYY-MM-DD format
 */
export function getTodayDateString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Check if the given date string is today (current day)
 */
export function isPlanDateToday(planDate: string): boolean {
  if (!planDate) return false;
  return planDate === getTodayDateString();
}

/**
 * Check if the given date string is in the past (back-dated)
 */
export function isPlanBackDated(planDate: string): boolean {
  if (!planDate) return false;
  const today = getTodayDateString();
  return planDate < today;
}

/**
 * Check if the given date string is in the future
 */
export function isPlanFutureDated(planDate: string): boolean {
  if (!planDate) return false;
  const today = getTodayDateString();
  return planDate > today;
}

/**
 * Get the date permission status
 */
export function getPlanDatePermission(planDate: string): {
  isToday: boolean;
  isBackDated: boolean;
  canEdit: boolean;
  canDelete: boolean;
  statusBadge: 'editable' | 'locked-past' | 'future';
  reason?: string;
} {
  const today = getTodayDateString();
  const isToday = planDate === today;
  const isBackDated = planDate < today;

  if (isBackDated) {
    return {
      isToday: false,
      isBackDated: true,
      canEdit: false,
      canDelete: false,
      statusBadge: 'locked-past',
      reason: 'Locked: This plan is on a back date. In accordance with GMP data integrity and AGP QC SOPs, editing and deleting historical records from past dates is prohibited.',
    };
  }

  return {
    isToday,
    isBackDated: false,
    canEdit: true,
    canDelete: true,
    statusBadge: isToday ? 'editable' : 'future',
  };
}

/**
 * Format a YYYY-MM-DD string into a human-readable date with weekday
 */
export function formatReadableDate(dateStr: string): string {
  if (!dateStr) return '';
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const date = new Date(year, month, day);
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    }
    return dateStr;
  } catch {
    return dateStr;
  }
}

/**
 * Get a relative badge text (Today, Yesterday, N days ago)
 */
export function getRelativeDateBadge(dateStr: string): { text: string; isPast: boolean; isToday: boolean } {
  const todayStr = getTodayDateString();
  if (dateStr === todayStr) {
    return { text: 'Today (Active Day)', isPast: false, isToday: true };
  }

  const today = new Date(todayStr);
  const target = new Date(dateStr);
  const diffTime = target.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === -1) {
    return { text: 'Yesterday (Back-dated)', isPast: true, isToday: false };
  } else if (diffDays < -1) {
    return { text: `${Math.abs(diffDays)} days ago (Back-dated)`, isPast: true, isToday: false };
  } else if (diffDays === 1) {
    return { text: 'Tomorrow', isPast: false, isToday: false };
  } else {
    return { text: `In ${diffDays} days`, isPast: false, isToday: false };
  }
}
