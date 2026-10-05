import type { WeekRecapContent } from "../types";

/**
 * Hand-written editorial colour for the weekly "episode" recaps — headlines,
 * narrative summaries, and the funniest moment from each week. Keyed by task
 * id (`week-NN`).
 *
 * Only weeks that have actually been "aired" (scored) need an entry; any week
 * without one still gets a recap page, falling back to auto-generated copy
 * derived from that week's results in `queries.ts`. To write up a new week,
 * add its object here — nothing else needs to change.
 *
 * This becomes a Supabase table/query later; keep the exported shape stable.
 */
export const weekRecaps: Record<string, WeekRecapContent> = {
  "week-01": {
    headline: "Rose keeps it together while the academy cracks up",
    summary:
      "The opening brief looked gentle — keep an egg alive for seven days — and promptly produced carnage. A third of the roster scored a clean zero, several admitting their charge did not survive the first commute. Rose turned the challenge into performance art and ran away with a perfect 10, with Karen close behind. A nervy, shell-shocked start to the competition.",
    moment: "Connor running away with a bag, yet there was no egg inside.",
    momentPlayerId: "connor",
  },
  "week-02": {
    headline: "Eva draws first blood on the map",
    summary:
      "With the cartography brief, the field finally found its feet. Eva posted the week's standout score of 13 to vault to the top of the table with a convincing horse (or possible yorkshire terrier), overturning Rose's early lead. Finnbar and Eve bounced back from egg-based tragedy with a tidy 8 apiece, and the midfield bunched up as nearly everyone banked points. The title race has a new frontrunner.",
    moment:
      "Luke basing his Strava routes off photos taken in his first few weeks of the academy with a very fitting presentation.",
    momentPlayerId: "luke",
  },
};

/** Editorial recap content for a task, if any has been written. */
export function getRecapContent(taskId: string): WeekRecapContent | undefined {
  return weekRecaps[taskId];
}
