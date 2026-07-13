// lib/activities/index.ts
import { Activity } from "./types";
import { spotThePhish } from "./spot-the-phish";
import { mfaMythBusters } from "./mfa-myth-busters";
import { secureByDesign } from "./secure-by-design";
import { socialEngineering } from "./social-engineering";
import { vulnerabilityToFix } from "./vulnerability-to-fix";
import { passphrasePower } from "./passphrase-power";

// The order here is the order they appear on the homepage.
export const activities: Activity[] = [
  spotThePhish,
  passphrasePower,
  mfaMythBusters,
  socialEngineering,
  vulnerabilityToFix,
  secureByDesign,
];

// Helper: find one activity by its URL slug. Returns undefined if not found.
export function getActivityBySlug(slug: string): Activity | undefined {
  return activities.find((activity) => activity.slug === slug);
}
