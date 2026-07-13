// lib/activities/types.ts

// A single answer option a pupil can pick.
export interface AnswerOption {
  id: string;    // unique within the question, e.g. "a", "b"
  label: string; // what the pupil sees on the button
}

// One question/challenge inside an activity.
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

// A full activity = metadata + a list of questions.
export interface Activity {
  slug: string;        // URL-safe id, e.g. "spot-the-phish"
  title: string;       // display name
  description: string; // one-liner for the homepage card
  emoji: string;       // a friendly icon (decorative only)
  intro: string;       // short framing shown before questions start
  questions: Question[];
}
