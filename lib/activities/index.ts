// lib/activities/index.ts
//
// The central registry. Every room is imported here and added to the
// `activities` array. The homepage and the room-navigation both read this
// list, so adding a room is a one-line change — import it, drop it in the
// array, done.

import { Activity } from "./types";

// ── Interactive labs ──
import { breachInvestigation } from "./breach-investigation";   // Room 1
import { passwordCracker }     from "./password-cracker";        // Room 8
import { webVulnLab }          from "./web-vuln-lab";            // Room 9
import { cipherLab }           from "./cipher-lab";              // Room 10
import { phishingInspector }   from "./phishing-inspector";      // Room 11

// ── Quizzes ──
import { spotThePhish }        from "./spot-the-phish";          // Room 2
import { passphrasePower }     from "./passphrase-power";        // Room 3
import { mfaMythBusters }      from "./mfa-myth-busters";        // Room 4
import { socialEngineering }   from "./social-engineering";      // Room 5
import { vulnerabilityToFix }  from "./vulnerability-to-fix";    // Room 6
import { secureByDesign }      from "./secure-by-design";        // Room 7

// The array is sorted by roomNumber so the homepage shows a clean 1→11 path.
// (The room page also re-sorts defensively, so order here is just for display.)
export const activities: Activity[] = [
  breachInvestigation, // 1  — terminal opener
  spotThePhish,        // 2  — quiz
  passphrasePower,     // 3  — quiz
  mfaMythBusters,      // 4  — quiz
  socialEngineering,   // 5  — quiz
  vulnerabilityToFix,  // 6  — quiz
  secureByDesign,      // 7  — quiz
  passwordCracker,     // 8  — lab
  webVulnLab,          // 9  — lab
  cipherLab,           // 10 — lab
  phishingInspector,   // 11 — lab
].sort((a, b) => a.roomNumber - b.roomNumber);

// Helper: find one activity by its URL slug. Returns undefined if not found.
export function getActivityBySlug(slug: string): Activity | undefined {
  return activities.find((activity) => activity.slug === slug);
}
