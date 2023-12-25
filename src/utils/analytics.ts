import { WeeklyAnalyticsItem } from "types/analytics";

export function calculatePercentageForWeeklyAnalytics(currentValue: number, previousValue: number): number {
  return ((currentValue - previousValue) / previousValue) * 100;
}

export function calculatePercentageForUsersAnalytics(currentValue: number, total: number): number {
  return (currentValue / total) * 100 || 0;
}

function getSchedulePosition(percentageChange: number) {
  if (percentageChange > 0) {
    return { isUp: true, label: `+ ${percentageChange.toFixed(2)}%` };
  } else if (percentageChange < 0) {
    return { isUp: false, label: `- ${Math.abs(percentageChange).toFixed(2)}%` };
  } else {
    return { isUp: true, label: `${percentageChange.toFixed(2)}%` };
  }
}

export function determineChangeStatus(week: WeeklyAnalyticsItem): {
  isUp: boolean;
  label: string;
} {
  const percentageChange = calculatePercentageForWeeklyAnalytics(week.currentWeek, week.previousWeek);
  return getSchedulePosition(percentageChange)
}

export function determineChangeUsersStatus(total: number, currentValue: number): {
  isUp: boolean;
  label: string;
} {
  const percentageChange = calculatePercentageForUsersAnalytics(currentValue, total);
  return getSchedulePosition(percentageChange)
}