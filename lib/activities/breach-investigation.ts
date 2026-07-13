// lib/activities/breach-investigation.ts
import { Activity } from "./types";

// Room 1 — the "wow" opener. A fictional hacker-style terminal the pupils
// type into to investigate a made-up security breach. All content lives
// inside the TerminalLab component; this file is just the room's metadata.
export const breachInvestigation: Activity = {
  slug: "breach-investigation",
  title: "Breach Investigation",
  description: "Step into a real defender's shoes and investigate a hack.",
  emoji: "🖥️",
  roomNumber: 1,
  difficulty: "easy",
  kind: "terminal",
  intro:
    "A fictional company has been hacked. Use the investigation terminal below to read the clues, follow the trail, and work out how the attacker got in. Type 'help' to begin — everything here is 100% simulated and safe.",
};
