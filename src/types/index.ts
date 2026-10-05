// Shared domain types for the Taskmaster competition UI.
// These intentionally describe plain data shapes so the current mock
// data layer can later be swapped for Supabase queries without touching
// the UI components.

export type TaskStatus = "upcoming" | "live" | "completed";

export interface Player {
  id: string;
  name: string;
  /** Optional team grouping, reserved for a future feature. */
  team?: string;
  /** Optional avatar image. When absent, initials are rendered. */
  avatarUrl?: string;
}

export interface Task {
  id: string;
  weekNumber: number;
  title: string;
  /** Short summary shown on cards. Hidden for upcoming tasks. */
  description: string;
  /** Longer Taskmaster-style brief, shown on the task detail page. */
  brief?: string;
  releaseDate: string; // ISO 8601
  deadline: string; // ISO 8601
  status: TaskStatus;
}

export interface Score {
  taskId: string;
  playerId: string;
  points: number;
  /** Finishing position for the task (1 = winner). */
  position: number;
  comment?: string;
}

// Derived view models used by the UI. Keeping these separate from the
// raw records means pages receive ready-to-render data.

export interface LeaderboardRow {
  rank: number;
  player: Player;
  points: number;
  tasksCompleted: number;
  wins: number;
  averagePosition: number;
  /** Recent finishing positions, most recent last. */
  form: number[];
}

export interface TaskResult {
  task: Task;
  winner: Player;
  winningScore: number;
  completionDate: string;
}

/** A task plus its outcome, used by task cards and the tasks grid. */
export interface TaskSummary {
  task: Task;
  /** Winner of a completed task, if any. */
  winner?: Player;
  /** The winner's score for a completed task, if any. */
  winningScore?: number;
}

/** One row of a completed task's full results table. */
export interface TaskResultRow {
  position: number;
  player: Player;
  points: number;
  comment?: string;
}

/** A single player's outcome on one task, for the player detail page. */
export interface PlayerTaskResult {
  task: Task;
  position: number;
  points: number;
  comment?: string;
}

/** One player's figures on a single task within a head-to-head comparison. */
export interface ComparisonSide {
  position: number;
  points: number;
}

/** A single task row comparing two players side by side. */
export interface ComparisonTaskRow {
  task: Task;
  /** Player A's result, if they were scored on this task. */
  a?: ComparisonSide;
  /** Player B's result, if they were scored on this task. */
  b?: ComparisonSide;
  /** Who finished higher on this task (lower position wins). */
  leader: "a" | "b" | "tie";
}

/** Two players compared head to head, with a per-task breakdown. */
export interface PlayerComparison {
  a: LeaderboardRow;
  b: LeaderboardRow;
  /** Each task either player was scored on, ordered by week. */
  tasks: ComparisonTaskRow[];
  /** Record over tasks both players completed. */
  headToHead: {
    aWins: number;
    bWins: number;
    ties: number;
    shared: number;
  };
}

export interface CompetitionStats {
  totalPlayers: number;
  tasksCompleted: number;
  pointsAwarded: number;
  differentWinners: number;
}
