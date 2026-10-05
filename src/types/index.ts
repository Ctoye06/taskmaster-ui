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
  /** Rank on the standings before the most recent completed task. */
  previousRank?: number;
  /** Places gained since the previous standings (positive = moved up). */
  movement?: number;
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

/**
 * The "what changed since you last visited" signal: the current task used to
 * highlight when a new week has gone live. `taskId` is the change key the
 * client compares against the visitor's last acknowledged task.
 */
export interface WhatsNewInfo {
  taskId: string;
  weekNumber: number;
  /** Display title, falling back to the week label for unrevealed tasks. */
  title: string;
  status: TaskStatus;
  /** Link to the task detail page. */
  href: string;
}

/** One side of the previous/next task pager on a task detail page. */
export interface TaskPagerLink {
  href: string;
  weekNumber: number;
  /** Display title, falling back to the week label for unrevealed tasks. */
  title: string;
  status: TaskStatus;
}

/** Adjacent tasks either side of the one being viewed. */
export interface TaskPager {
  prev?: TaskPagerLink;
  next?: TaskPagerLink;
}

/** One selectable opponent in the player-profile compare picker. */
export interface CompareOpponent {
  id: string;
  name: string;
  rank: number;
}

/** Data for the "compare with…" entry point on a player profile. */
export interface PlayerCompareOptions {
  /** Suggested opponent: the player directly adjacent on the standings. */
  rival?: CompareOpponent;
  /** Every other player, ordered by rank, for the dropdown. */
  opponents: CompareOpponent[];
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

/** Which bucket a command-palette entry belongs to (section + icon). */
export type CommandPaletteGroup = "page" | "task" | "player";

/** A single searchable destination in the global command palette. */
export interface CommandPaletteItem {
  /** Stable unique id, used as the DOM key for the rendered row. */
  id: string;
  /** Primary label shown in the list. */
  label: string;
  /** Grouping used for the section heading and leading glyph. */
  group: CommandPaletteGroup;
  /** Destination URL. */
  href: string;
  /** Optional supporting text, e.g. a week label, rank or status. */
  hint?: string;
  /** Extra terms folded into the fuzzy-search haystack but not displayed. */
  keywords?: string;
}

/** The player a follower needs to overtake next (directly ahead of them). */
export interface FollowRival {
  id: string;
  name: string;
  rank: number;
  /** Link to the rival's profile page. */
  href: string;
  /** Points the rival is ahead by (0 when level on points but ahead on tie-break). */
  gap: number;
}

/**
 * One player's at-a-glance standing for the "this is me" follow widget. The
 * visitor's chosen identity is resolved on the client (localStorage), so the
 * widget ships every player's row and renders whichever one was picked.
 */
export interface FollowStanding {
  id: string;
  name: string;
  initials: string;
  rank: number;
  points: number;
  wins: number;
  tasksCompleted: number;
  /** Link to this player's profile page. */
  href: string;
  /** True when this player tops the standings (no one to overtake). */
  isLeader: boolean;
  /** The player directly ahead on the standings, if any. */
  rival?: FollowRival;
}

export interface CompetitionStats {
  totalPlayers: number;
  tasksCompleted: number;
  pointsAwarded: number;
  differentWinners: number;
}

/** A single Hall of Fame / superlative award for the stats page. */
export interface Award {
  id: string;
  /** Award name, e.g. "Most Wins". */
  title: string;
  /** Command-style sub-label, e.g. "max wins". */
  command: string;
  /** The honoured player, when the award belongs to someone. */
  player?: Player;
  /** Headline value, pre-formatted, e.g. "3 wins". */
  value: string;
  /** Supporting context, e.g. the task it relates to. */
  detail?: string;
  accent: "acid" | "magenta" | "amber" | "cyan";
}
