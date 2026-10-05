import type { Task } from "../types";

// 16 weekly tasks. Weeks 1-3 are completed, week 4 is live, the rest are
// upcoming. Dates are mock values (local time, Fridays at 15:00). Swap this
// array for a Supabase query later without changing consumers.
export const tasks: Task[] = [
  {
    id: "week-01",
    weekNumber: 1,
    title: "Shell We Survive?",
    description: "Keep your egg alive for the entire week.",
    brief:
      "For the next seven days you are responsible for someone who cannot speak, cannot walk, and absolutely cannot be allowed to crack under pressure. Keep your egg safe until Friday afternoon. Your time starts now.",
    releaseDate: "2026-09-18T15:00:00",
    deadline: "2026-09-25T15:00:00",
    status: "completed",
  },
  {
    id: "week-02",
    weekNumber: 2,
    title: "Put Yourself On The Map",
    description: "Navigate a route that creates a drawing on a map.",
    brief:
      "Using any mapping tool of your choice, plan and navigate a route that, when traced on a map, forms a recognizable drawing. Creativity and accuracy are key.",
    releaseDate: "2026-09-25T15:00:00",
    deadline: "2026-10-02T15:00:00",
    status: "completed",
  },
  {
    id: "week-03",
    weekNumber: 3,
    title: "Assassin",
    description: "Complete your secret mission. Stay alive.",
    brief:
      "Complete your secret mission and eliminate your target. Once successful, discreetly tell your target and the Taskmaster. Your eliminated target must then hand their mission to you. If eliminated, you may assist others but never reveal that you have been eliminated. Be cunning. Be devious. Trust no one.",
    releaseDate: "2026-10-02T15:00:00",
    deadline: "2026-10-09T15:00:00",
    status: "live",
  },
  {
    id: "week-04",
    weekNumber: 4,
    title: "???",
    description: "",
    brief: "",
    releaseDate: "2026-10-09T15:00:00",
    deadline: "2026-10-16T15:00:00",
    status: "upcoming",
  },
  {
    id: "week-05",
    weekNumber: 5,
    title: "???",
    description: "",
    brief: "",
    releaseDate: "2026-10-09T15:00:00",
    deadline: "2026-10-16T15:00:00",
    status: "upcoming",
  },
  {
    id: "week-06",
    weekNumber: 6,
    title: "???",
    description: "",
    brief: "",
    releaseDate: "2026-10-16T15:00:00",
    deadline: "2026-10-23T15:00:00",
    status: "upcoming",
  },
  {
    id: "week-07",
    weekNumber: 7,
    title: "???",
    description: "",
    brief: "",
    releaseDate: "2026-10-23T15:00:00",
    deadline: "2026-10-30T15:00:00",
    status: "upcoming",
  },
  {
    id: "week-08",
    weekNumber: 8,
    title: "???",
    description: "",
    brief: "",
    releaseDate: "2026-10-30T15:00:00",
    deadline: "2026-11-06T15:00:00",
    status: "upcoming",
  },
  {
    id: "week-09",
    weekNumber: 9,
    title: "???",
    description: "",
    brief: "",
    releaseDate: "2026-11-06T15:00:00",
    deadline: "2026-11-13T15:00:00",
    status: "upcoming",
  },
  {
    id: "week-10",
    weekNumber: 10,
    title: "???",
    description: "",
    brief: "",
    releaseDate: "2026-11-13T15:00:00",
    deadline: "2026-11-20T15:00:00",
    status: "upcoming",
  },
  {
    id: "week-11",
    weekNumber: 11,
    title: "???",
    description: "",
    brief: "",
    releaseDate: "2026-11-20T15:00:00",
    deadline: "2026-11-27T15:00:00",
    status: "upcoming",
  },
  {
    id: "week-12",
    weekNumber: 12,
    title: "???",
    description: "",
    brief: "",
    releaseDate: "2026-11-27T15:00:00",
    deadline: "2026-12-04T15:00:00",
    status: "upcoming",
  },
  {
    id: "week-13",
    weekNumber: 13,
    title: "???",
    description: "",
    brief: "",
    releaseDate: "2026-12-04T15:00:00",
    deadline: "2026-12-11T15:00:00",
    status: "upcoming",
  },
  {
    id: "week-14",
    weekNumber: 14,
    title: "???",
    description: "",
    brief: "",
    releaseDate: "2026-12-11T15:00:00",
    deadline: "2026-12-18T15:00:00",
    status: "upcoming",
  },
  {
    id: "week-15",
    weekNumber: 15,
    title: "???",
    description: "",
    brief: "",
    releaseDate: "2026-12-18T15:00:00",
    deadline: "2026-12-25T15:00:00",
    status: "upcoming",
  },
  {
    id: "week-16",
    weekNumber: 16,
    title: "???",
    description: "",
    brief: "",
    releaseDate: "2026-12-25T15:00:00",
    deadline: "2027-01-01T15:00:00",
    status: "upcoming",
  },
];

export function getTaskById(id: string): Task | undefined {
  return tasks.find((t) => t.id === id);
}

export function getCurrentTask(): Task | undefined {
  return (
    tasks.find((t) => t.status === "live") ??
    tasks.find((t) => t.status === "upcoming")
  );
}
