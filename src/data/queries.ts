import type {
  CompetitionStats,
  LeaderboardRow,
  Player,
  PlayerComparison,
  PlayerTaskResult,
  TaskResult,
  TaskResultRow,
  TaskSummary,
} from "../types";
import { players, getPlayerById } from "./players";
import { tasks, getTaskById } from "./tasks";
import { scores } from "./scores";

// This module is the single "data layer" the UI talks to. Pages import these
// derived selectors rather than raw records, so moving to Supabase later only
// means re-implementing these functions.

/**
 * Full leaderboard, sorted by points (then wins, then average position).
 * Every player appears even if they have not scored yet.
 */
export function getLeaderboard(): LeaderboardRow[] {
  const completedWeek = new Map(tasks.map((t) => [t.id, t.weekNumber]));

  const rows = players.map((player) => {
    const playerScores = scores
      .filter((s) => s.playerId === player.id)
      .sort(
        (a, b) =>
          (completedWeek.get(a.taskId) ?? 0) - (completedWeek.get(b.taskId) ?? 0),
      );

    const points = playerScores.reduce((sum, s) => sum + s.points, 0);
    const wins = playerScores.filter((s) => s.position === 1).length;
    const tasksCompleted = playerScores.length;
    const averagePosition =
      tasksCompleted > 0
        ? playerScores.reduce((sum, s) => sum + s.position, 0) / tasksCompleted
        : 0;
    const form = playerScores.slice(-4).map((s) => s.position);

    return {
      player,
      points,
      wins,
      tasksCompleted,
      averagePosition,
      form,
    };
  });

  rows.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.wins !== a.wins) return b.wins - a.wins;
    return a.averagePosition - b.averagePosition;
  });

  return rows.map((row, index) => ({ rank: index + 1, ...row }));
}

/** Top N leaderboard rows (defaults to 5 for the homepage). */
export function getTopPlayers(limit = 5): LeaderboardRow[] {
  return getLeaderboard().slice(0, limit);
}

/** A single player's standing row (rank, points, form, …) if they exist. */
export function getPlayerStanding(playerId: string): LeaderboardRow | undefined {
  return getLeaderboard().find((row) => row.player.id === playerId);
}

/**
 * Every scored task for a player, newest week last, with the task record
 * attached. Empty if the player has not been scored yet.
 */
export function getPlayerResults(playerId: string): PlayerTaskResult[] {
  const results: PlayerTaskResult[] = [];
  for (const s of scores.filter((s) => s.playerId === playerId)) {
    const task = getTaskById(s.taskId);
    if (!task) continue;
    results.push({
      task,
      position: s.position,
      points: s.points,
      comment: s.comment,
    });
  }
  return results.sort((a, b) => a.task.weekNumber - b.task.weekNumber);
}

/** Most recent completed tasks with their winner, newest first. */
export function getRecentResults(limit = 3): TaskResult[] {
  const completed = tasks
    .filter((t) => t.status === "completed")
    .sort((a, b) => b.weekNumber - a.weekNumber);

  const results: TaskResult[] = [];
  for (const task of completed) {
    const winnerScore = scores.find(
      (s) => s.taskId === task.id && s.position === 1,
    );
    const winner = winnerScore ? getPlayerById(winnerScore.playerId) : undefined;
    if (winnerScore && winner) {
      results.push({
        task,
        winner,
        winningScore: winnerScore.points,
        completionDate: task.deadline,
      });
    }
  }
  return results.slice(0, limit);
}

/** Ordered results for a single task (winner first). Empty if not scored. */
export function getTaskResults(taskId: string): TaskResultRow[] {
  const rows: TaskResultRow[] = [];
  for (const s of scores.filter((s) => s.taskId === taskId)) {
    const player = getPlayerById(s.playerId);
    if (!player) continue;
    rows.push({
      position: s.position,
      player,
      points: s.points,
      comment: s.comment,
    });
  }
  return rows.sort((a, b) => a.position - b.position);
}

/** A single task with its winner/score, for the detail page and cards. */
export function getTaskSummary(taskId: string): TaskSummary | undefined {
  const task = getTaskById(taskId);
  if (!task) return undefined;
  const [top] = getTaskResults(taskId);
  return {
    task,
    winner: top?.player,
    winningScore: top?.points,
  };
}

/** Every task as a summary, ordered by week number (ascending). */
export function getTaskSummaries(): TaskSummary[] {
  return [...tasks]
    .sort((a, b) => a.weekNumber - b.weekNumber)
    .map((task) => {
      const [top] = getTaskResults(task.id);
      return { task, winner: top?.player, winningScore: top?.points };
    });
}

/**
 * Compare two players head to head. Returns their full standings, a per-task
 * breakdown (every task either player was scored on), and the record over
 * tasks they both completed. Returns undefined if either player is unknown
 * or the two ids are the same.
 */
export function getPlayerComparison(
  aId: string,
  bId: string,
): PlayerComparison | undefined {
  const a = getPlayerStanding(aId);
  const b = getPlayerStanding(bId);
  if (!a || !b || aId === bId) return undefined;

  const aResults = new Map(
    getPlayerResults(aId).map((r) => [r.task.id, r] as const),
  );
  const bResults = new Map(
    getPlayerResults(bId).map((r) => [r.task.id, r] as const),
  );

  const taskIds = new Set<string>([...aResults.keys(), ...bResults.keys()]);

  let aWins = 0;
  let bWins = 0;
  let ties = 0;
  let shared = 0;

  const rows = [...taskIds].flatMap((taskId) => {
    const task = getTaskById(taskId);
    if (!task) return [];

    const ar = aResults.get(taskId);
    const br = bResults.get(taskId);

    let leader: "a" | "b" | "tie" = "tie";
    if (ar && br) {
      shared += 1;
      if (ar.position < br.position) {
        leader = "a";
        aWins += 1;
      } else if (br.position < ar.position) {
        leader = "b";
        bWins += 1;
      } else {
        ties += 1;
      }
    } else if (ar) {
      leader = "a";
    } else if (br) {
      leader = "b";
    }

    return [
      {
        task,
        a: ar ? { position: ar.position, points: ar.points } : undefined,
        b: br ? { position: br.position, points: br.points } : undefined,
        leader,
      },
    ];
  });

  rows.sort((x, y) => x.task.weekNumber - y.task.weekNumber);

  return { a, b, tasks: rows, headToHead: { aWins, bWins, ties, shared } };
}

/** High-level competition statistics for the homepage stat cards. */
export function getCompetitionStats(): CompetitionStats {
  const completed = tasks.filter((t) => t.status === "completed");
  const winners = new Set(
    scores.filter((s) => s.position === 1).map((s) => s.playerId),
  );
  const pointsAwarded = scores.reduce((sum, s) => sum + s.points, 0);

  return {
    totalPlayers: players.length,
    tasksCompleted: completed.length,
    pointsAwarded,
    differentWinners: winners.size,
  };
}

export function getPlayerInitials(player: Player): string {
  return player.name
    .split(/\s+/)
    .map((part) => part[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
