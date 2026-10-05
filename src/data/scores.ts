import type { Score } from "../types";
import { players } from "./players";
import { tasks } from "./tasks";

// Points awarded by finishing position (1 = winner). Positions beyond the
// listed range score a single participation point.
const POINTS_BY_POSITION = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1];

function pointsForPosition(position: number): number {
  return POINTS_BY_POSITION[position - 1] ?? 1;
}

// Explicit podium ordering (top 5) for each completed task. Each task has a
// different winner so standings stay interesting. Remaining players are
// filled in deterministically below.
const PODIUMS: Record<string, string[]> = {
  "week-01": ["callum", "ryan", "james", "aideen", "sarah"],
  "week-02": ["ryan", "callum", "aideen", "james", "sarah"],
  "week-03": ["aideen", "callum", "sarah", "ryan", "james"],
};

/**
 * Builds a full finishing order for a task: the fixed podium first, then the
 * rest of the roster rotated by week so everyone's position varies over time.
 */
function finishingOrder(taskId: string, weekNumber: number): string[] {
  const podium = PODIUMS[taskId] ?? [];
  const rest = players.map((p) => p.id).filter((id) => !podium.includes(id));
  const offset = (weekNumber - 1) % Math.max(rest.length, 1);
  const rotated = [...rest.slice(offset), ...rest.slice(0, offset)];
  return [...podium, ...rotated];
}

function buildScores(): Score[] {
  const completed = tasks.filter((t) => t.status === "completed");
  const result: Score[] = [];
  for (const task of completed) {
    const order = finishingOrder(task.id, task.weekNumber);
    order.forEach((playerId, index) => {
      const position = index + 1;
      result.push({
        taskId: task.id,
        playerId,
        position,
        points: pointsForPosition(position),
      });
    });
  }
  return result;
}

// All scores for completed tasks. Later this becomes a Supabase query.
export const scores: Score[] = buildScores();

export function getScoresForTask(taskId: string): Score[] {
  return scores.filter((s) => s.taskId === taskId);
}

export function getScoresForPlayer(playerId: string): Score[] {
  return scores.filter((s) => s.playerId === playerId);
}
