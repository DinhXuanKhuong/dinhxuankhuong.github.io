/** Validate goal data and calculate fractional progress (50% counts as half a goal). */
export function summarizeGoals(goals = []) {
  if (!Array.isArray(goals)) throw new Error("Life goals: goals must be a list.");
  const entries = goals.map((goal, index) => {
    const label = `Life goal ${index + 1}`;
    if (!goal || typeof goal.title !== "string" || !goal.title.trim()) {
      throw new Error(`${label}: add a title.`);
    }
    const progress = goal.progress ?? 0;
    if (typeof progress !== "number" || !Number.isFinite(progress) || progress < 0 || progress > 100) {
      throw new Error(`${label}: progress must be a number from 0 to 100.`);
    }
    if (goal.url && (typeof goal.url !== "string" || !/^(https?:\/\/|\/(?!\/))/.test(goal.url))) {
      throw new Error(`${label}: use an https:// link or a site path starting with /.`);
    }
    const status = progress === 100 ? "complete" : progress === 0 ? "pending" : "in-progress";
    return { ...goal, progress, status, symbol: progress === 100 ? "✓" : progress === 0 ? "✗" : "~" };
  });
  const earned = Number((entries.reduce((sum, goal) => sum + goal.progress, 0) / 100).toFixed(4));
  return {
    goals: entries,
    total: entries.length,
    earned,
    complete: entries.filter((goal) => goal.status === "complete").length,
    inProgress: entries.filter((goal) => goal.status === "in-progress").length,
    percent: entries.length ? Math.round(earned / entries.length * 100) : 0,
  };
}
