// lib/activities/web-vuln-lab.ts
import { Activity } from "./types";

// Room 9 — a SAFE, fully-simulated demonstration of why a website must never
// trust user input, and how the fix works. Nothing here touches a real
// database or a real site; it's a teaching sandbox that shows the defence.
export const webVulnLab: Activity = {
  slug: "web-vuln-lab",
  title: "Web Weakness Lab",
  description: "See why websites must never trust input — then apply the fix.",
  emoji: "🛠️",
  roomNumber: 9,
  difficulty: "medium",
  kind: "web-vuln-lab",
  intro:
    "This is a pretend login box for a fictional site. First you'll see why sloppy code lets people slip past a login, then you'll flip on the defence and watch the same trick fail. Simulated end-to-end — no real systems involved.",
};
