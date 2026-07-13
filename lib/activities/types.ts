// lib/activities/types.ts
//
// This file defines the "shape" of the data every room uses. TypeScript reads
// these interfaces and warns us if a room is missing a field or has a typo —
// think of it as a spell-checker for our data.

// ─── Shared metadata every room has ──────────────────────────────────────

// How hard a room is. Controls the little coloured badge on the room page.
export type Difficulty = "easy" | "medium" | "hard";

// What TYPE of room it is. This decides which component renders it:
//   quiz          → ActivityEngine       (multiple-choice questions)
//   terminal      → TerminalLab          (fake hacker terminal to investigate)
//   password-lab  → PasswordCrackerLab   (live password-strength playground)
//   web-vuln-lab  → WebVulnLab           (safe, simulated website weakness demo)
//   cipher-lab    → CipherLab            (encode/decode secret messages)
//   phishing-lab  → PhishingInspector    (click the red flags in a fake email)
export type ActivityKind =
  | "quiz"
  | "terminal"
  | "password-lab"
  | "web-vuln-lab"
  | "cipher-lab"
  | "phishing-lab";

// ─── Quiz-specific data ──────────────────────────────────────────────────

// A single answer option a pupil can pick.
export interface AnswerOption {
  id: string;    // unique within the question, e.g. "a", "b"
  label: string; // what the pupil sees on the button
}

// One question/challenge inside a quiz.
export interface Question {
  id: string;
  // Optional "scenario" box — shows a fake email/text/situation above the question.
  scenario?: {
    from?: string;    // e.g. a fake sender (optional)
    subject?: string; // e.g. a fake subject line (optional)
    body: string;     // the fictional message or situation
  };
  prompt: string;          // the question being asked
  options: AnswerOption[]; // the choices
  correctOptionId: string; // which option id is correct
  explanation: string;     // shown after answering — the teaching moment
}

// ─── The Activity object ─────────────────────────────────────────────────
//
// Every room exports ONE of these. The fields marked `?` are optional:
// a quiz uses `questions`; the interactive labs mostly carry their content
// inside their own component, so they don't need `questions` at all.

export interface Activity {
  slug: string;            // URL-safe id, e.g. "spot-the-phish"
  title: string;           // display name
  description: string;     // one-liner for the homepage card
  emoji: string;           // a friendly icon (decorative only)
  roomNumber: number;      // controls ordering + the [01] label
  difficulty: Difficulty;  // easy | medium | hard
  kind: ActivityKind;      // decides which component renders the room
  intro: string;           // short framing shown before the room starts
  questions?: Question[];  // ONLY used by quiz rooms
}
