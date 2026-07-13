// lib/activities/secure-by-design.ts
import { Activity } from "./types";

export const secureByDesign: Activity = {
  slug: "secure-by-design",
  title: "Secure-by-Design Quiz",
  description: "Think like a defender. Pick the safest design choice.",
  emoji: "🏗️",
  roomNumber: 7,
  difficulty: "medium",
  kind: "quiz",
  intro:
    "Each question describes a design decision. Choose the option that follows secure-by-design thinking — building safety in from the start.",
  questions: [
    // ─── ORIGINAL 5 (unchanged) ──────────────────────────────────────
    {
      id: "q1",
      prompt:
        "A new app gives every user full admin powers 'to keep things simple'. What's the safer principle?",
      options: [
        { id: "a", label: "Least privilege — give each user only what they need" },
        { id: "b", label: "It's fine, admin for everyone saves time" },
        { id: "c", label: "Give admin only to people who ask nicely" },
      ],
      correctOptionId: "a",
      explanation:
        "Least privilege. If an account is compromised, limited permissions limit the damage. Only grant the access each role genuinely needs.",
    },
    {
      id: "q2",
      prompt:
        "A website pastes whatever a user types straight into the page. What's the risk-reducing habit?",
      options: [
        { id: "a", label: "Trust the input — users are honest" },
        { id: "b", label: "Validate and sanitise all input before using it" },
        { id: "c", label: "Only check input on Mondays" },
      ],
      correctOptionId: "b",
      explanation:
        "Never trust input by default. Validating and sanitising what comes in prevents whole classes of problems. The mindset: treat all input as untrusted until checked.",
    },
    {
      id: "q3",
      prompt:
        "If a security check fails or crashes, what should the system do by default?",
      options: [
        { id: "a", label: "Fail open — let everyone through so nothing breaks" },
        { id: "b", label: "Fail safe — deny access by default" },
        { id: "c", label: "Restart and hope" },
      ],
      correctOptionId: "b",
      explanation:
        "Fail safe (default deny). If something goes wrong, the safe choice is to block rather than accidentally let everyone in.",
    },
    {
      id: "q4",
      prompt:
        "Relying on a single firewall as your only protection is an example of...?",
      options: [
        { id: "a", label: "Defence in depth — lots of overlapping layers" },
        { id: "b", label: "A single point of failure — one layer, big risk" },
        { id: "c", label: "Perfect security" },
      ],
      correctOptionId: "b",
      explanation:
        "A single point of failure. Good security uses 'defence in depth' — several independent layers, so one failing doesn't expose everything.",
    },
    {
      id: "q5",
      prompt:
        "Software has a known security update available. The safest habit is to...?",
      options: [
        { id: "a", label: "Ignore it — updates are annoying" },
        { id: "b", label: "Apply updates promptly" },
        { id: "c", label: "Wait a year to be sure it's stable" },
      ],
      correctOptionId: "b",
      explanation:
        "Apply updates promptly. Many attacks target weaknesses that were already fixed — keeping software current closes those doors.",
    },

    // ─── NEW 5 ───────────────────────────────────────────────────────

    // q6 — Password hashing. Links back to Room 3's "site emailed my
    // password" red flag: this is the design decision behind it.
    {
      id: "q6",
      prompt: "How should a well-designed system store users' passwords?",
      options: [
        { id: "a", label: "In plain text, so support staff can read them back to users" },
        { id: "b", label: "Scrambled with a one-way hash, so even the site itself can't read them" },
        { id: "c", label: "In a shared spreadsheet named passwords.xlsx" },
      ],
      correctOptionId: "b",
      explanation:
        "Passwords should be 'hashed' — scrambled one-way so they can be checked but never read back. If the database leaks, attackers get useless scrambles instead of real passwords. That's why a legitimate site can reset your password but never show it to you.",
    },

    // q7 — Data minimisation. You can't leak what you never collected.
    {
      id: "q7",
      prompt:
        "A simple torch app demands access to your contacts, location, and microphone. Secure-by-design says a well-built app should...?",
      options: [
        { id: "a", label: "Collect only the data the feature actually needs" },
        { id: "b", label: "Grab every permission now in case it's useful later" },
        { id: "c", label: "Ask for extra permissions to look more professional" },
      ],
      correctOptionId: "a",
      explanation:
        "'Data minimisation': collect the minimum needed to do the job. A torch needs the flash — nothing else. Less data collected means less to leak, lose, or misuse. As a user, permission requests that don't match the app's purpose are a red flag.",
    },

    // q8 — Secure defaults. Most people never change settings, so the
    // out-of-the-box state IS the security.
    {
      id: "q8",
      prompt:
        "When someone creates a brand-new social media account, how should its privacy settings start out?",
      options: [
        { id: "a", label: "Private and locked-down by default — the user opens things up by choice" },
        { id: "b", label: "Everything public, to help them find friends faster" },
        { id: "c", label: "Random, to keep things interesting" },
      ],
      correctOptionId: "a",
      explanation:
        "'Secure by default'. Most people never touch their settings, so whatever the default is becomes reality for millions. Safe design starts locked-down and lets users consciously choose to share more — not the other way round.",
    },

    // q9 — Monitoring & logging. Prevention isn't enough if you'd never
    // notice a breach happening.
    {
      id: "q9",
      prompt:
        "A system has good defences, but how would its team actually NOTICE an attack in progress?",
      options: [
        { id: "a", label: "Keep logs and alerts of unusual activity, and review them" },
        { id: "b", label: "Assume no news is good news" },
        { id: "c", label: "Do one big check every year" },
      ],
      correctOptionId: "a",
      explanation:
        "Defence isn't just prevention — it's detection. Logs record who did what and when; alerts flag the unusual (like 500 failed logins at 3am). Without them, attackers can roam unnoticed for months. Design in the ability to see trouble early.",
    },

    // q10 — Don't roll your own crypto. Secrecy of the method is not
    // protection; tested standards are.
    {
      id: "q10",
      prompt:
        "A developer invents their own secret encryption method, reasoning 'nobody can break what nobody knows'. The safer approach is...?",
      options: [
        { id: "a", label: "Keep it secret — the mystery makes it stronger" },
        { id: "b", label: "Use well-tested, standard encryption that experts have attacked for years" },
        { id: "c", label: "Encrypt twice with two different home-made methods" },
      ],
      correctOptionId: "b",
      explanation:
        "'Don't roll your own crypto.' Standard encryption is trusted precisely because thousands of experts have tried and failed to break it for decades. A home-made method has been tested by exactly one person — its inventor. Security through obscurity collapses the moment the secret leaks.",
    },
  ],
};
