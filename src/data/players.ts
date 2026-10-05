import type { Player } from "../types";

// Mock roster of 25 academy players. Replace with a Supabase query later;
// keep the exported shape (Player[]) stable so the UI does not change.
export const players: Player[] = [
  { id: "eva", name: "Eva" },
  { id: "rebekah", name: "Rebekah" },
  { id: "karen", name: "Karen" },
  { id: "finnbar", name: "Finnbar" },
  { id: "eve", name: "Eve" },
  { id: "luke", name: "Luke" },
  { id: "rose", name: "Rose" },
  { id: "emma", name: "Emma" },
  { id: "jack", name: "Jack" },
  { id: "caolan_d", name: "Caolan D" },
  { id: "erin", name: "Erin" },
  { id: "john", name: "John" },
  { id: "connor", name: "Connor" },
  { id: "sophia", name: "Sophia" },
  { id: "orlagh", name: "Orlagh" },
  { id: "amelia", name: "Amelia" },
  { id: "daire", name: "Daire" },
  { id: "jake", name: "Jake" },
  { id: "ryan", name: "Ryan" },
  { id: "caolan_t", name: "Caolan T" },
  { id: "criostoir", name: "Criostoir" },
  { id: "eimhear", name: "Eimhear" },
  { id: "grace", name: "Grace" },
  { id: "adam", name: "Adam" },
  { id: "andrew", name: "Andrew" },
];

export function getPlayerById(id: string): Player | undefined {
  return players.find((p) => p.id === id);
}
