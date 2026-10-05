import type {
  Award,
  CommandPaletteItem,
  CompareOpponent,
  CompetitionStats,
  FollowStanding,
  LeaderboardRow,
  Player,
  PlayerCompareOptions,
  PlayerComparison,
  PlayerTaskResult,
  Score,
  TaskResult,
  TaskResultRow,
  TaskSummary,
  Task,
  TaskPager,
  TaskPagerLink,
  WhatsNewInfo,
} from "../types";
import { players, getPlayerById } from "./players";
import { tasks, getTaskById, getCurrentTask } from "./tasks";
import { scores } from "./scores";
import { withBase } from "../lib/url";

// This module is the single "data layer" the UI talks to. Pages import these
// derived selectors rather than raw records, so moving to Supabase later only
// means re-implementing these functions.

const completedWeekByTask = new Map(tasks.map((t) => [t.id, t.weekNumber]));

/**
 * Builds and ranks the standings from an arbitrary set of scores. Used both
 * for the current table and for historical snapshots (rank movement).
 */
function computeStandings(scoreSet: Score[]): LeaderboardRow[] {
  const rows = players.map((player) => {
    const playerScores = scoreSet
      .filter((s) => s.playerId === player.id)
      .sort(
        (a, b) =>
          (completedWeekByTask.get(a.taskId) ?? 0) -
          (completedWeekByTask.get(b.taskId) ?? 0),
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

  // Standard competition ranking: players level on points share a rank
  // (e.g. two on the same points are both 3rd), and the next player's rank
  // skips accordingly (…3, 3, 5). Order within a tie still follows the
  // wins / average-position sort above.
  let previousPoints: number | null = null;
  let sharedRank = 0;
  return rows.map((row, index) => {
    const rank = row.points === previousPoints ? sharedRank : index + 1;
    previousPoints = row.points;
    sharedRank = rank;
    return { rank, ...row };
  });
}

/**
 * Full leaderboard, sorted by points (then wins, then average position).
 * Every player appears even if they have not scored yet.
 */
export function getLeaderboard(): LeaderboardRow[] {
  return computeStandings(scores);
}

/**
 * The leaderboard annotated with each player's movement since the standings
 * before the most recent completed task (positive movement = climbed).
 * Movement is omitted when there is no earlier task to compare against.
 */
export function getLeaderboardWithMovement(): LeaderboardRow[] {
  const current = getLeaderboard();
  const completedWeeks = tasks
    .filter((t) => t.status === "completed")
    .map((t) => t.weekNumber);

  if (completedWeeks.length < 2) return current;

  const latestWeek = Math.max(...completedWeeks);
  const previousScores = scores.filter(
    (s) => (completedWeekByTask.get(s.taskId) ?? Infinity) < latestWeek,
  );
  const previousRankByPlayer = new Map(
    computeStandings(previousScores).map((row) => [row.player.id, row.rank]),
  );

  return current.map((row) => {
    const previousRank = previousRankByPlayer.get(row.player.id);
    return {
      ...row,
      previousRank,
      movement:
        previousRank !== undefined ? previousRank - row.rank : undefined,
    };
  });
}

/** Top N leaderboard rows (defaults to 5 for the homepage). */
export function getTopPlayers(limit = 5): LeaderboardRow[] {
  return getLeaderboard().slice(0, limit);
}

/** A single player's standing row (rank, points, form, …) if they exist. */
export function getPlayerStanding(
  playerId: string,
): LeaderboardRow | undefined {
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
    const winner = winnerScore
      ? getPlayerById(winnerScore.playerId)
      : undefined;
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

/**
 * Per-player "this is me" standings for the homepage follow widget. The
 * visitor's identity is resolved on the client, so every player's row ships
 * up front. Each entry carries the player's current standing plus the rival
 * directly ahead of them (the one to overtake next).
 */
export function getFollowStandings(): FollowStanding[] {
  const leaderboard = getLeaderboard();
  return leaderboard.map((row, index) => {
    const ahead = leaderboard[index - 1];
    return {
      id: row.player.id,
      name: row.player.name,
      initials: getPlayerInitials(row.player),
      rank: row.rank,
      points: row.points,
      wins: row.wins,
      tasksCompleted: row.tasksCompleted,
      href: withBase(`/players/${row.player.id}`),
      isLeader: index === 0,
      rival: ahead
        ? {
            id: ahead.player.id,
            name: ahead.player.name,
            rank: ahead.rank,
            href: withBase(`/players/${ahead.player.id}`),
            gap: ahead.points - row.points,
          }
        : undefined,
    };
  });
}

/**
 * Playful Hall of Fame superlatives for the stats page. Each award is derived
 * from the current data; awards with no qualifying data are omitted.
 */
export function getAwards(): Award[] {
  const awards: Award[] = [];
  const leaderboard = getLeaderboardWithMovement();
  const played = leaderboard.filter((row) => row.tasksCompleted > 0);

  // Reigning champion — whoever tops the table.
  const champion = leaderboard[0];
  if (champion && champion.tasksCompleted > 0) {
    awards.push({
      id: "champion",
      title: "Reigning Champion",
      command: "rank --top 1",
      player: champion.player,
      value: `${champion.points} pts`,
      detail: "Leads the academy",
      accent: "amber",
    });
  }

  // Most task wins.
  const mostWins = [...played].sort((a, b) => b.wins - a.wins)[0];
  if (mostWins && mostWins.wins > 0) {
    awards.push({
      id: "most-wins",
      title: "Serial Winner",
      command: "max wins",
      player: mostWins.player,
      value: `${mostWins.wins} ${mostWins.wins === 1 ? "win" : "wins"}`,
      detail: "Most task victories",
      accent: "acid",
    });
  }

  // Highest single-task score.
  const topScore = [...scores].sort((a, b) => b.points - a.points)[0];
  if (topScore) {
    const player = getPlayerById(topScore.playerId);
    const task = getTaskById(topScore.taskId);
    if (player && task) {
      awards.push({
        id: "top-score",
        title: "Highest Score",
        command: "max points",
        player,
        value: `${topScore.points} pts`,
        detail: `Week ${String(task.weekNumber).padStart(2, "0")} · ${task.title}`,
        accent: "magenta",
      });
    }
  }

  // Most consistent — best average finishing position (min 2 tasks).
  const consistent = played
    .filter((row) => row.tasksCompleted >= 2)
    .sort((a, b) => a.averagePosition - b.averagePosition)[0];
  if (consistent) {
    awards.push({
      id: "most-consistent",
      title: "Mr/Ms Reliable",
      command: "min avg-position",
      player: consistent.player,
      value: `${consistent.averagePosition.toFixed(1)} avg`,
      detail: "Best average finish",
      accent: "cyan",
    });
  }

  // Biggest climber since the previous standings.
  const climber = [...leaderboard]
    .filter((row) => typeof row.movement === "number" && row.movement > 0)
    .sort((a, b) => (b.movement ?? 0) - (a.movement ?? 0))[0];
  if (climber && climber.movement) {
    awards.push({
      id: "climber",
      title: "Biggest Climber",
      command: "max rank-gain",
      player: climber.player,
      value: `+${climber.movement}`,
      detail: "Places gained last task",
      accent: "acid",
    });
  }

  // Biggest winning margin across completed tasks.
  const completedTasks = tasks.filter((t) => t.status === "completed");
  let widest: { task: (typeof completedTasks)[number]; margin: number } | null =
    null;
  let closest: {
    task: (typeof completedTasks)[number];
    margin: number;
  } | null = null;
  for (const task of completedTasks) {
    const results = getTaskResults(task.id);
    if (results.length < 2) continue;
    const margin = results[0].points - results[1].points;
    if (!widest || margin > widest.margin) widest = { task, margin };
    if (!closest || margin < closest.margin) closest = { task, margin };
  }

  if (widest) {
    const [winner] = getTaskResults(widest.task.id);
    if (winner) {
      awards.push({
        id: "biggest-margin",
        title: "Runaway Victory",
        command: "max margin",
        player: winner.player,
        value: `+${widest.margin} pts`,
        detail: `Week ${String(widest.task.weekNumber).padStart(2, "0")} · ${widest.task.title}`,
        accent: "amber",
      });
    }
  }

  if (closest) {
    const [winner, runnerUp] = getTaskResults(closest.task.id);
    if (winner && runnerUp) {
      awards.push({
        id: "closest-finish",
        title: "Photo Finish",
        command: "min margin",
        player: winner.player,
        value: closest.margin === 0 ? "dead heat" : `${closest.margin} pt`,
        detail: `Edged out ${runnerUp.player.name} · ${closest.task.title}`,
        accent: "magenta",
      });
    }
  }

  return awards;
}

// Static top-level destinations, listed first so the palette is useful even
// before the user types anything.
const PALETTE_PAGES: CommandPaletteItem[] = [
  {
    id: "page-home",
    label: "Home",
    group: "page",
    href: withBase("/"),
    hint: "current task & overview",
    keywords: "start index dashboard",
  },
  {
    id: "page-tasks",
    label: "Tasks",
    group: "page",
    href: withBase("/tasks"),
    hint: "every weekly brief",
    keywords: "weeks briefs challenges",
  },
  {
    id: "page-leaderboard",
    label: "Leaderboard",
    group: "page",
    href: withBase("/leaderboard"),
    hint: "full standings",
    keywords: "ranks table standings top",
  },
  {
    id: "page-compare",
    label: "Compare",
    group: "page",
    href: withBase("/compare"),
    hint: "head-to-head",
    keywords: "versus vs head to head",
  },
  {
    id: "page-stats",
    label: "Stats",
    group: "page",
    href: withBase("/stats"),
    hint: "hall of fame & awards",
    keywords: "summary superlatives records",
  },
  {
    id: "page-players",
    label: "Players",
    group: "page",
    href: withBase("/players"),
    hint: "the roster",
    keywords: "competitors roster people",
  },
];

/**
 * Flat, searchable index of every destination in the app (pages, tasks and
 * players) for the global command palette. Computing it here keeps the data
 * concerns out of the component, which renders the resulting props only.
 */
export function getCommandPaletteItems(): CommandPaletteItem[] {
  const taskItems: CommandPaletteItem[] = [...tasks]
    .sort((a, b) => a.weekNumber - b.weekNumber)
    .map((task) => {
      const weekLabel = `Week ${String(task.weekNumber).padStart(2, "0")}`;
      const named = task.title.length > 0 && task.title !== "???";
      return {
        id: `task-${task.id}`,
        label: named ? task.title : weekLabel,
        group: "task" as const,
        href: withBase(`/tasks/${task.id}`),
        hint: `${weekLabel} · ${task.status}`,
        keywords: `${weekLabel} ${task.status} ${task.description}`,
      };
    });

  const standingByPlayer = new Map(
    getLeaderboard().map((row) => [row.player.id, row]),
  );

  const playerItems: CommandPaletteItem[] = players.map((player) => {
    const row = standingByPlayer.get(player.id);
    return {
      id: `player-${player.id}`,
      label: player.name,
      group: "player" as const,
      href: withBase(`/players/${player.id}`),
      hint: row ? `rank #${row.rank} · ${row.points} pts` : "unranked",
      keywords: player.team ?? "",
    };
  });

  return [...PALETTE_PAGES, ...taskItems, ...playerItems];
}

/**
 * The current task (live, else the next upcoming) distilled into the signal
 * the "what's new" banner compares against the visitor's last-seen task.
 */
export function getWhatsNew(): WhatsNewInfo | undefined {
  const task = getCurrentTask();
  if (!task) return undefined;

  const weekLabel = `Week ${String(task.weekNumber).padStart(2, "0")}`;
  const named = task.title.length > 0 && task.title !== "???";

  return {
    taskId: task.id,
    weekNumber: task.weekNumber,
    title: named ? task.title : weekLabel,
    status: task.status,
    href: withBase(`/tasks/${task.id}`),
  };
}

/**
 * The tasks immediately before and after a given task, by week number, for
 * the previous/next pager on a task detail page.
 */
export function getTaskPager(taskId: string): TaskPager {
  const ordered = [...tasks].sort((a, b) => a.weekNumber - b.weekNumber);
  const index = ordered.findIndex((t) => t.id === taskId);
  if (index === -1) return {};

  const toLink = (task: Task): TaskPagerLink => {
    const named = task.title.length > 0 && task.title !== "???";
    return {
      href: withBase(`/tasks/${task.id}`),
      weekNumber: task.weekNumber,
      title: named
        ? task.title
        : `Week ${String(task.weekNumber).padStart(2, "0")}`,
      status: task.status,
    };
  };

  return {
    prev: index > 0 ? toLink(ordered[index - 1]) : undefined,
    next: index < ordered.length - 1 ? toLink(ordered[index + 1]) : undefined,
  };
}

/**
 * Options for the "compare with…" entry point on a player profile: a
 * suggested nearest rival (the adjacent player on the standings) plus every
 * other player for the dropdown, all ordered by rank.
 */
export function getPlayerCompareOptions(
  playerId: string,
): PlayerCompareOptions {
  const leaderboard = getLeaderboard();
  const index = leaderboard.findIndex((row) => row.player.id === playerId);
  if (index === -1) return { opponents: [] };

  const toOpponent = (row: LeaderboardRow): CompareOpponent => ({
    id: row.player.id,
    name: row.player.name,
    rank: row.rank,
  });

  // Nearest rival: prefer the player directly above, else the one below.
  const rivalRow = leaderboard[index - 1] ?? leaderboard[index + 1];

  return {
    rival: rivalRow ? toOpponent(rivalRow) : undefined,
    opponents: leaderboard
      .filter((row) => row.player.id !== playerId)
      .map(toOpponent),
  };
}
