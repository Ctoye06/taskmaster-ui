import type { Team } from "../types";

// The five teams for team-format tasks. The 25-player roster is split into
// teams of five, spread round-robin across the roster so no squad is stacked
// with early- or late-listed players. `memberIds` is the single source of
// truth for membership — resolve members via `getPlayerById` where needed.
//
// Replace with a Supabase query later; keep the exported shape (Team[]) stable
// so the UI does not change.
export const teams: Team[] = [
  {
    id: "ctrl-alt-elite",
    name: "Ctrl Alt Elite",
    tagline: "we have used all our tokens; this is our slogan",
    memberIds: ["caolan_d", "grace", "eimhear", "criostoir"],
  },
  {
    id: "team-b-for-brilliant",
    name: "Team B (for Brilliant)",
    tagline: "bad point for luke",
    memberIds: ["luke", "erin", "john", "rebekah"],
  },
  {
    id: "team-c-pending",
    name: "Team C (pending)",
    tagline: "we will decide eventually",
    memberIds: ["finnbar", "eve", "jake", "orlagh"],
  },
  {
    id: "team-friendship",
    name: "Team Friendship",
    tagline: "friendship is magic",
    memberIds: ["connor", "caolan_t", "eva", "emma", "andrew"],
  },
  {
    id: "team-star-elephant-diagram",
    name: "Team Star Elephant Diagram",
    tagline: "addressing the elephant on the whiteboard - karen",
    memberIds: ["daire", "rose", "karen", "adam"],
  },
  {
    id: "the-achievers",
    name: "The Achievers",
    tagline: "consistently mediocre from day one",
    memberIds: ["amelia", "sophia", "ryan", "jack"],
  },
];

export function getTeamById(id: string): Team | undefined {
  return teams.find((t) => t.id === id);
}

// Reverse lookup so any player id resolves to its squad. Built once from the
// membership lists above so it stays in sync with the single source of truth.
const teamByPlayerId = new Map<string, Team>(
  teams.flatMap((team) => team.memberIds.map((id) => [id, team] as const)),
);

export function getTeamForPlayer(playerId: string): Team | undefined {
  return teamByPlayerId.get(playerId);
}
