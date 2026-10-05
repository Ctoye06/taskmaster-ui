import type { Player } from "../types";

// Mock roster of 25 academy players. Replace with a Supabase query later;
// keep the exported shape (Player[]) stable so the UI does not change.
export const players: Player[] = [
  { id: "callum", name: "Callum" },
  { id: "ryan", name: "Ryan" },
  { id: "aideen", name: "Aideen" },
  { id: "james", name: "James" },
  { id: "sarah", name: "Sarah" },
  { id: "priya", name: "Priya" },
  { id: "marcus", name: "Marcus" },
  { id: "elena", name: "Elena" },
  { id: "tom", name: "Tom" },
  { id: "hana", name: "Hana" },
  { id: "dev", name: "Dev" },
  { id: "olivia", name: "Olivia" },
  { id: "noah", name: "Noah" },
  { id: "grace", name: "Grace" },
  { id: "liam", name: "Liam" },
  { id: "chloe", name: "Chloe" },
  { id: "raj", name: "Raj" },
  { id: "mia", name: "Mia" },
  { id: "ethan", name: "Ethan" },
  { id: "zara", name: "Zara" },
  { id: "ben", name: "Ben" },
  { id: "freya", name: "Freya" },
  { id: "omar", name: "Omar" },
  { id: "isla", name: "Isla" },
  { id: "kai", name: "Kai" },
];

export function getPlayerById(id: string): Player | undefined {
  return players.find((p) => p.id === id);
}
