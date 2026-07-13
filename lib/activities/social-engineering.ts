// lib/activities/social-engineering.ts
import { Activity } from "./types";

export const socialEngineering: Activity = {
  slug: "social-engineering",
  title: "Social Engineering Choices",
  description: "Spot the manipulation. Choose the safe response.",
  emoji: "🎭",
  roomNumber: 5,
  difficulty: "medium",
  kind: "quiz",
  intro:
    "Social engineering tricks people, not computers — using authority, urgency, or helpfulness. For each fictional situation, pick the safest response.",
  questions: [
    // ─── ORIGINAL 4 (unchanged) ──────────────────────────────────────
    {
      id: "q1",
      scenario: {
        body: "Someone phones claiming to be from 'IT Support' and says they urgently need your password to fix your account before it locks.",
      },
      prompt: "What do you do?",
      options: [
        { id: "a", label: "Give the password — they're from IT" },
        { id: "b", label: "Refuse, hang up, and contact IT through a number you trust" },
        { id: "c", label: "Give them half the password to be safe" },
      ],
      correctOptionId: "b",
      explanation:
        "Real IT teams never need your password — they have their own access. Urgency + a request for credentials is the giveaway. Verify through a channel you already trust.",
    },
    {
      id: "q2",
      scenario: {
        body: "At a secure door, a stranger carrying boxes asks you to hold it open so they don't have to find their pass.",
      },
      prompt: "What's the safest choice?",
      options: [
        { id: "a", label: "Hold it open — it's polite" },
        { id: "b", label: "Politely direct them to reception to sign in" },
        { id: "c", label: "Let them in but watch them closely" },
      ],
      correctOptionId: "b",
      explanation:
        "This is 'tailgating' — slipping past access control using social pressure. Being polite is fine; bypassing security isn't. Point them to the proper sign-in.",
    },
    {
      id: "q3",
      scenario: {
        body: "You find a USB stick in the car park labelled 'Exam Results — Confidential'.",
      },
      prompt: "What do you do with it?",
      options: [
        { id: "a", label: "Plug it in to see who it belongs to" },
        { id: "b", label: "Hand it to a teacher or IT without plugging it in" },
        { id: "c", label: "Keep it — finders keepers" },
      ],
      correctOptionId: "b",
      explanation:
        "A tempting label is the bait. Unknown USB devices can carry malware, so never plug them in. Hand it to staff to deal with safely.",
    },
    {
      id: "q4",
      scenario: {
        from: "Email appearing to be from 'The Head Teacher'",
        body: "I'm in a meeting and can't talk. I urgently need you to buy £100 in gift cards and send me the codes. Keep this between us.",
      },
      prompt: "How should you respond?",
      options: [
        { id: "a", label: "Buy them — it's the Head Teacher" },
        { id: "b", label: "Don't act; verify in person or via a known number" },
        { id: "c", label: "Reply asking for more details" },
      ],
      correctOptionId: "b",
      explanation:
        "Classic 'CEO fraud': authority + urgency + secrecy + gift cards. Genuine requests survive a quick verification. Confirm through a channel you already trust before doing anything.",
    },

    // ─── NEW 4 ───────────────────────────────────────────────────────

    // q5 — The "safe account" bank scam. Uses fear + authority. Golden
    // rule: banks never ask you to move money.
    {
      id: "q5",
      scenario: {
        body: "A caller says they're from your bank's fraud team: 'Your account has been compromised. You need to move your money RIGHT NOW to a safe account — I'll give you the details.'",
      },
      prompt: "What's the safe response?",
      options: [
        { id: "a", label: "Move the money fast — the fraud team is helping you" },
        { id: "b", label: "Send a small test amount first to check it works" },
        { id: "c", label: "Hang up and call the bank yourself using the number on your card" },
      ],
      correctOptionId: "c",
      explanation:
        "A real bank will NEVER ask you to move money to a 'safe account' — that account belongs to the scammer. Fear plus urgency is the manipulation. Hang up and dial the number printed on your bank card, not one the caller gives you.",
    },

    // q6 — Pretexting via a "fun survey". Those quirky questions are the
    // exact answers to common security questions.
    {
      id: "q6",
      scenario: {
        body: "A cheerful caller says they're running a 'student lifestyle survey' and asks: your first pet's name, your mum's maiden name, your favourite teacher, and your date of birth. It's only five minutes and you might win a voucher!",
      },
      prompt: "What's really going on, and what should you do?",
      options: [
        { id: "a", label: "Don't share — those are classic security-question answers being harvested" },
        { id: "b", label: "Answer everything — it's just a harmless survey" },
        { id: "c", label: "Only the date of birth is risky; share the rest" },
      ],
      correctOptionId: "a",
      explanation:
        "This is 'pretexting' — a believable cover story built to extract specific data. First pet, maiden name, and birthday are exactly what account-recovery questions ask. Legitimate surveys don't need them. Politely decline and hang up.",
    },

    // q7 — Shoulder surfing. Low-tech, extremely common, easily beaten
    // by simple awareness.
    {
      id: "q7",
      scenario: {
        body: "On a busy bus you're about to type your phone passcode, and you notice the person beside you keeps glancing at your screen.",
      },
      prompt: "What's the smart move?",
      options: [
        { id: "a", label: "Type it extra fast so they can't follow" },
        { id: "b", label: "Shield the screen with your hand or wait — that's 'shoulder surfing'" },
        { id: "c", label: "Turn the brightness up so you can see it better" },
      ],
      correctOptionId: "b",
      explanation:
        "'Shoulder surfing' is stealing codes just by watching. It's how many phone thefts start: watch the PIN first, snatch the phone second. Angle the screen away, cover your hand, or use Face/fingerprint unlock in public.",
    },

    // q8 — Fake "moderator/support" in games and chat apps. Bonus teach:
    // the 'code you're about to receive' is them triggering a reset on
    // YOUR account.
    {
      id: "q8",
      scenario: {
        from: "Direct message from 'Discord_Moderator_Team'",
        body: "Your account has been flagged and will be banned in 1 hour. To verify you're the real owner, reply with your password and the 6-digit code you're about to receive by text.",
      },
      prompt: "How do you respond?",
      options: [
        { id: "a", label: "Refuse and report — real staff never ask for passwords or login codes" },
        { id: "b", label: "Send both — moderators can be trusted" },
        { id: "c", label: "Send only the 6-digit code, not the password" },
      ],
      correctOptionId: "a",
      explanation:
        "No legitimate staff member on any platform will ever ask for your password or a login code. That 'code you're about to receive' is them triggering a reset on YOUR account — handing it over gives them control. Sending only the code (option c) is just as fatal. Report and block.",
    },
  ],
};
