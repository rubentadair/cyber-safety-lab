// lib/activities/password-cracker.ts
import { Activity } from "./types";

// Room 8 — a live password-strength playground. Pupils type MADE-UP passwords
// and watch an estimated "time to crack" update instantly, proving that length
// beats fiddly symbols. All logic lives in the PasswordCrackerLab component.
export const passwordCracker: Activity = {
  slug: "password-cracker",
  title: "Password Cracker Lab",
  description: "Watch how fast weak passwords fall — and what makes a strong one.",
  emoji: "⚡",
  roomNumber: 8,
  difficulty: "easy",
  kind: "password-lab",
  intro:
    "Type a PRETEND password (never a real one!) and watch our estimator show how long a modern attacker might take to crack it. Then try the challenges to feel why length beats complexity every time.",
};
