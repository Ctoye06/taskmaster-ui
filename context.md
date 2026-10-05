# Taskmaster Activity Website — UI Development

## Overview

Build the frontend UI for a Taskmaster-style competition website for an engineering/apprentice academy.

The competition runs over multiple weeks. Every Friday afternoon, a new task is released and participants have until the following Friday afternoon to complete it. There are approximately 25 players.

The website should feel fun, competitive and polished rather than like a generic admin dashboard.

The UI should initially use **mock/local data only**. Do not implement Supabase, authentication, APIs or backend functionality yet. Structure the application so these can be integrated later.

---

## Technology

Use:

* Astro
* TypeScript
* Tailwind CSS
* CSS where custom styling is required
* No React unless there is a strong technical reason
* No unnecessary UI libraries
* No backend
* No Supabase yet

The site must be responsive and work well on desktop and mobile.

Use Astro's static-first approach wherever possible.

---

# Project structure

Create a clean structure similar to:

```text
src/
├── components/
│   ├── Navbar.astro
│   ├── Footer.astro
│   ├── TaskCard.astro
│   ├── PlayerCard.astro
│   ├── LeaderboardTable.astro
│   ├── ScoreBadge.astro
│   ├── Countdown.astro
│   ├── StatCard.astro
│   └── TaskStatusBadge.astro
│
├── layouts/
│   └── Layout.astro
│
├── data/
│   ├── players.ts
│   ├── tasks.ts
│   └── scores.ts
│
├── pages/
│   ├── index.astro
│   ├── leaderboard.astro
│   ├── tasks/
│   │   ├── index.astro
│   │   └── [id].astro
│   └── players/
│       ├── index.astro
│       └── [id].astro
│
├── styles/
│   └── global.css
│
└── types/
    └── index.ts
```

Adjust this structure if Astro conventions make another approach cleaner.

---

# Visual direction

The website should have a strong **Taskmaster / competition-show aesthetic**.

It should feel:

* playful
* competitive
* slightly ridiculous
* energetic
* polished
* modern
* easy to scan

Avoid making it look like:

* a corporate intranet
* a generic Tailwind CSS template
* an e-commerce site
* a standard CRUD dashboard

Use bold typography, large headings, cards, badges, rankings and visual hierarchy.

Use Tailwind CSS for the layout/grid/components but customise the appearance with CSS.

Use a consistent colour palette throughout the site.

Consider using:

* large task numbers
* trophy/medal icons
* prominent rankings
* score badges
* playful microcopy
* subtle animations/hover effects
* visual emphasis on the current week's task

Do not overdo animations.

---

# Global navigation

Create a responsive navbar containing:

* Home
* Tasks
* Leaderboard
* Players

Use a strong site title/logo such as:

**EAYL TASKMASTER**

Include a small subtitle such as:

**Engineering Academy Challenge**

On mobile, use a Tailwind CSS responsive navigation menu.

---

# Homepage

Create a visually strong homepage.

The hero section should show:

```text
EAYL TASKMASTER

16 weeks.
25 players.
One winner.

Think creatively. Complete the task.
Beat your competitors.
```

Then show the current task prominently.

Example:

```text
WEEK 4

SHELL WE SURVIVE?

Keep your egg alive for the entire week.

Released:
Friday 3:00 PM

Deadline:
Friday 3:00 PM

[ VIEW TASK ]

6 DAYS
14 HOURS
32 MINUTES
```

The countdown should be implemented as an Astro component with client-side JavaScript where necessary.

Use mock dates initially.

---

# Homepage sections

Include:

### Current Task

Large feature card showing:

* week number
* title
* short description
* release date
* deadline
* countdown
* status
* "View Task" button

### Current Leaderboard

Show the top 5 players.

Example:

```text
1   Callum        47 pts
2   Ryan          42 pts
3   Aideen        39 pts
4   James         35 pts
5   Sarah         31 pts
```

Highlight the top three differently.

Include:

**View Full Leaderboard**

### Recent Results

Show the previous 3 completed tasks.

For each:

* task name
* winner
* winning score
* completion date

### Competition Stats

Show interesting high-level statistics:

* 25 Players
* 4 Tasks Completed
* 188 Points Awarded
* 4 Different Winners

---

# Tasks page

Create `/tasks`.

Display all weekly tasks in a grid/list.

Each task card should show:

```text
WEEK 01

SHELL WE SURVIVE?

Completed

Winner:
Callum

10 points

[ View Task ]
```

Use different visual states:

* Upcoming
* Live
* Completed

Upcoming tasks should not reveal their description.

Live tasks should be visually prominent.

Completed tasks should show their winner and results.

---

# Individual task page

Create:

```text
/tasks/[id]
```

The page should contain:

* Week number
* Task title
* Task description
* Taskmaster-style instructions
* Release date
* Deadline
* Countdown
* Rules
* Results if completed

Example task:

```text
WEEK 01

SHELL WE SURVIVE?

"For the next seven days, you are responsible
for someone who cannot speak, cannot walk,
and absolutely cannot be allowed to crack
under pressure."

Your task is to keep your egg safe until
Friday afternoon.

Your time starts now.
```

Make the task text visually prominent.

For completed tasks, display:

```text
WINNER

🥇 Callum
10 points
```

and a results table.

---

# Leaderboard page

Create `/leaderboard`.

This is one of the most important pages.

Create a polished leaderboard with:

* rank
* player
* total points
* tasks completed
* wins
* average position

Example:

| Rank | Player | Points | Wins | Avg. Position |
| ---- | ------ | ------ | ---- | ------------- |
| 🥇 1 | Callum | 47     | 2    | 2.4           |
| 🥈 2 | Ryan   | 42     | 1    | 3.1           |
| 🥉 3 | Aideen | 39     | 1    | 3.8           |

Highlight the top 3.

Make the current leader visually obvious.

Add a small "form" indicator showing recent positions, e.g.:

```text
🥇 🥉 🥈 5️⃣
```

On mobile, convert the table into cards or ensure it remains usable horizontally.

---

# Player pages

Create `/players`.

Show all 25 players.

Each player card should include:

* name
* current rank
* total points
* number of wins
* avatar/initials

Clicking a player opens:

```text
/players/[id]
```

The profile should show:

```text
CALLUM

#1 Overall

47 POINTS

2 Wins
4 Tasks Completed
2.4 Average Position
```

Then display their performance by week:

```text
Week 1    🥇    10 pts
Week 2    4th    7 pts
Week 3    🥈     9 pts
Week 4    3rd    8 pts
```

Include a simple visual progression/chart if practical without introducing a chart library.

---

# Mock data

Create realistic mock data for:

* 25 players
* 8-16 tasks
* scores for completed tasks

Use TypeScript types.

For example:

```typescript
export interface Player {
  id: string;
  name: string;
  team?: string;
  avatarUrl?: string;
}
```

```typescript
export interface Task {
  id: string;
  weekNumber: number;
  title: string;
  description: string;
  releaseDate: string;
  deadline: string;
  status: "upcoming" | "live" | "completed";
}
```

```typescript
export interface Score {
  taskId: string;
  playerId: string;
  points: number;
  position: number;
  comment?: string;
}
```

Keep mock data separate from UI components.

---

# Reusable components

Create reusable components rather than duplicating markup.

At minimum:

* `Navbar`
* `Footer`
* `TaskCard`
* `LeaderboardTable`
* `PlayerCard`
* `ScoreBadge`
* `Countdown`
* `StatCard`
* `TaskStatusBadge`

Components should receive data through props.

---

# Responsive design

The site must work properly at:

* desktop
* tablet
* mobile

Pay particular attention to:

* leaderboard tables
* navigation
* task cards
* countdown
* player profiles

Do not simply shrink desktop layouts.

Use appropriate Tailwind CSS responsive utilities and grids.

---

# Accessibility

Follow good accessibility practices:

* semantic HTML
* proper heading hierarchy
* accessible buttons/links
* meaningful alt text
* sufficient colour contrast
* keyboard navigation
* don't rely solely on colour to indicate status

---

# Future Supabase integration

Do NOT implement Supabase yet.

However, structure the code so mock data can later be replaced with Supabase queries without rewriting the UI.

For example:

```text
UI components
      ↓
page/data layer
      ↓
mock data currently
      ↓
Supabase later
```

Avoid putting hard-coded player/task data directly inside components.

---

# Future functionality

Keep the architecture ready for:

* Supabase authentication
* player accounts
* admin accounts
* task submissions
* score entry
* live leaderboards
* weekly automatic task releases
* player statistics
* task history
* achievements
* teams
* bonus points
* penalties

Do not implement these yet.

---

# Development requirements

Before finishing:

1. Ensure the project builds successfully.
2. Ensure there are no TypeScript errors.
3. Ensure all navigation links work.
4. Ensure dynamic task/player routes work.
5. Ensure the site is responsive.
6. Ensure mock data is sufficient to demonstrate the UI.
7. Do not leave placeholder sections that look unfinished.
8. Keep components small and reusable.
9. Avoid unnecessary dependencies.
10. Add comments only where they provide useful context.

---

# Git/implementation approach

Work incrementally.

First create:

1. Astro project structure
2. Global layout
3. Tailwind CSS integration
4. Global styling
5. Mock data/types
6. Navbar/footer
7. Homepage
8. Tasks pages
9. Leaderboard
10. Player pages
11. Responsive improvements
12. Final build/test

After each major stage, verify the application still builds.

Do not introduce backend functionality.

The final result should look like a polished competition website ready to connect to Supabase.
