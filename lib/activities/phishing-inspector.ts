// lib/activities/phishing-inspector.ts
import { Activity } from "./types";

// Room 11 — the hands-on finale. Instead of picking A/B/C, pupils click
// directly on the suspicious parts of a fake email to flag every red flag,
// turning "spot the phish" into an interactive investigation.
export const phishingInspector: Activity = {
  slug: "phishing-inspector",
  title: "Phishing Inspector",
  description: "Hunt down every red flag hidden inside a suspicious email.",
  emoji: "🔎",
  roomNumber: 11,
  difficulty: "hard",
  kind: "phishing-lab",
  intro:
    "You're the security analyst. Below is a fictional email. Click every part you think is a red flag — sender, links, tone, requests — and we'll tell you if you caught them all. Miss one and a real inbox might not be so forgiving.",
};
