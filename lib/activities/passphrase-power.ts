// lib/activities/passphrase-power.ts
import { Activity } from "./types";

export const passphrasePower: Activity = {
  slug: "passphrase-power",
  title: "Passphrase Power",
  description: "Learn what actually makes a password hard to crack.",
  emoji: "🔑",
  roomNumber: 3,
  difficulty: "easy",
  kind: "quiz",
  intro:
    "We'll never ask you to type a real password. Instead, learn the principles that make one strong — length, uniqueness, and unpredictability.",
  questions: [
    // ─── ORIGINAL 5 (unchanged) ──────────────────────────────────────
    {
      id: "q1",
      prompt: "Which is hardest for an attacker to guess or crack?",
      options: [
        { id: "a", label: "P@ss1! (short but 'complex')" },
        { id: "b", label: "correct-horse-battery-staple (long passphrase)" },
        { id: "c", label: "your pet's name" },
      ],
      correctOptionId: "b",
      explanation:
        "Length wins. A long string of unrelated words is far harder to crack than a short 'complex' one, and it's easier to remember too.",
    },
    {
      id: "q2",
      prompt: "Which of these makes a passphrase WEAK?",
      options: [
        { id: "a", label: "It's based on your birthday or pet's name" },
        { id: "b", label: "It's long and made of random words" },
        { id: "c", label: "It's unique to one account" },
      ],
      correctOptionId: "a",
      explanation:
        "Personal info (birthdays, pet names, favourite team) is often public or guessable. Strong passphrases are long and unpredictable.",
    },
    {
      id: "q3",
      prompt: "You have a brilliant strong password. Should you use it on every site?",
      options: [
        { id: "a", label: "Yes — it's strong enough to reuse" },
        { id: "b", label: "No — one breach would expose every account" },
        { id: "c", label: "Only on important sites" },
      ],
      correctOptionId: "b",
      explanation:
        "Never reuse, however strong. If one site is breached, attackers try that password everywhere. Each account needs its own.",
    },
    {
      id: "q4",
      prompt:
        "How can you have a unique strong password for dozens of accounts without memorising them all?",
      options: [
        { id: "a", label: "Use a reputable password manager" },
        { id: "b", label: "Use the same one and add the site name" },
        { id: "c", label: "Keep a text file called passwords.txt" },
      ],
      correctOptionId: "a",
      explanation:
        "A password manager generates and stores a unique strong password per account, locked behind one master passphrase plus MFA.",
    },
    {
      id: "q5",
      prompt: "What's a good second layer on top of a strong password?",
      options: [
        { id: "a", label: "Writing it bigger" },
        { id: "b", label: "Multi-factor authentication (MFA)" },
        { id: "c", label: "Telling a trusted friend" },
      ],
      correctOptionId: "b",
      explanation:
        "MFA means even a stolen password isn't enough on its own. Pair a strong unique passphrase with MFA for the best everyday protection.",
    },

    // ─── NEW 4 ───────────────────────────────────────────────────────

    // q6 — The leetspeak myth. Cracking tools try common letter→symbol
    // swaps automatically, so "P@55w0rd" buys almost nothing.
    {
      id: "q6",
      prompt:
        "Someone changes 'password' to 'P@55w0rd' and calls it secure. What's the truth?",
      options: [
        { id: "a", label: "Symbol swaps like @ for a make it uncrackable" },
        { id: "b", label: "Cracking tools already try those common swaps automatically" },
        { id: "c", label: "Adding one exclamation mark makes any password strong" },
      ],
      correctOptionId: "b",
      explanation:
        "Attackers' wordlists include every common substitution — @ for a, 0 for o, 5 for s — so 'P@55w0rd' falls almost as fast as 'password'. Real strength comes from length and unpredictability, not decoration.",
    },

    // q7 — Breach response. The habit that matters: change it there AND
    // everywhere it was reused.
    {
      id: "q7",
      prompt:
        "A site you use announces a data breach: 'passwords may have been exposed'. What's the right first move?",
      options: [
        { id: "a", label: "Change that password — and anywhere else you reused it — then turn on MFA" },
        { id: "b", label: "Nothing; the breach is the company's problem, not yours" },
        { id: "c", label: "Delete the email and hope for the best" },
      ],
      correctOptionId: "a",
      explanation:
        "Once a password leaks, attackers try it on other popular sites within hours ('credential stuffing'). Change it on the breached site, change it anywhere you reused it, and add MFA so a future leak matters less.",
    },

    // q8 — Security questions ARE passwords. Real answers are researchable;
    // invented answers stored in a manager are safer.
    {
      id: "q8",
      prompt:
        "A site asks the security question: 'What is your mother's maiden name?' What's the safest approach?",
      options: [
        { id: "a", label: "Answer honestly — it's easiest to remember" },
        { id: "b", label: "Treat it like a password: give a random made-up answer and store it in your password manager" },
        { id: "c", label: "Use your pet's name that you post about online" },
      ],
      correctOptionId: "b",
      explanation:
        "Real answers to security questions can often be found on social media or public records. A made-up answer (e.g. 'PurpleKettleBiscuit') works exactly like a second password — as long as your manager remembers it for you.",
    },

    // q9 — Plain-text password red flag. A site should never be ABLE to
    // show your password back to you.
    {
      id: "q9",
      prompt:
        "You sign up to a website and it emails you your own password in readable text. What does that tell you?",
      options: [
        { id: "a", label: "Great customer service — very helpful" },
        { id: "b", label: "The site stores passwords insecurely — never reuse an important password there" },
        { id: "c", label: "The site must be extra safe if it keeps a copy" },
      ],
      correctOptionId: "b",
      explanation:
        "A well-built site scrambles ('hashes') your password and can never display it back. If a site can email it in plain text, it's storing it readably — so if they're breached, your exact password leaks. Assume weak security and never reuse anything important there.",
    },
  ],
};
