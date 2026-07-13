// lib/activities/mfa-myth-busters.ts
import { Activity } from "./types";

export const mfaMythBusters: Activity = {
  slug: "mfa-myth-busters",
  title: "MFA & Privacy Myth-Busters",
  description: "True or false? Separate the facts from the fiction.",
  emoji: "🔐",
  roomNumber: 4,
  difficulty: "easy",
  kind: "quiz",
  intro:
    "Decide whether each statement is TRUE or FALSE. These are common beliefs about multi-factor authentication and privacy — some are spot on, some are dangerously wrong.",
  questions: [
    // ─── ORIGINAL 5 (unchanged) ──────────────────────────────────────
    {
      id: "q1",
      prompt:
        '"If my password is really strong, multi-factor authentication (MFA) is pointless."',
      options: [
        { id: "a", label: "True" },
        { id: "b", label: "False" },
      ],
      correctOptionId: "b",
      explanation:
        "False. Even strong passwords get exposed in data breaches. MFA adds a second lock, so a stolen password alone isn't enough to get in.",
    },
    {
      id: "q2",
      prompt:
        '"Codes sent by text message (SMS) are the most secure form of MFA."',
      options: [
        { id: "a", label: "True" },
        { id: "b", label: "False" },
      ],
      correctOptionId: "b",
      explanation:
        "False. SMS codes are better than nothing, but they can be intercepted (e.g. SIM-swap tricks). Authenticator apps and passkeys are stronger.",
    },
    {
      id: "q3",
      prompt:
        '"Private/Incognito mode hides my browsing from my school network or internet provider."',
      options: [
        { id: "a", label: "True" },
        { id: "b", label: "False" },
      ],
      correctOptionId: "b",
      explanation:
        "False. Incognito only stops your own device from saving history. The network, the websites, and your provider can still see activity.",
    },
    {
      id: "q4",
      prompt: '"Using one very strong password for every account is fine."',
      options: [
        { id: "a", label: "True" },
        { id: "b", label: "False" },
      ],
      correctOptionId: "b",
      explanation:
        "False. If one site is breached, attackers try that password everywhere ('credential stuffing'). Use a unique password per account — a password manager makes this easy.",
    },
    {
      id: "q5",
      prompt: '"A free app has no way to make money from my data."',
      options: [
        { id: "a", label: "True" },
        { id: "b", label: "False" },
      ],
      correctOptionId: "b",
      explanation:
        "False. Many free apps earn from advertising and data. A good habit: skim what permissions and data an app asks for before installing.",
    },

    // ─── NEW 5 ───────────────────────────────────────────────────────

    // q6 — MFA fatigue / prompt bombing. A prompt you didn't trigger means
    // someone else has your password RIGHT NOW.
    {
      id: "q6",
      prompt:
        '"If MFA approval prompts keep appearing that I didn\'t trigger, tapping Approve once is the quickest safe way to make them stop."',
      options: [
        { id: "a", label: "True" },
        { id: "b", label: "False" },
      ],
      correctOptionId: "b",
      explanation:
        "False — this is an 'MFA fatigue' attack. The prompts mean someone already has your password and is spamming requests, hoping you'll approve out of annoyance. Deny every prompt and change that password immediately.",
    },

    // q7 — A TRUE statement, so learners can't just pattern-match 'False'.
    // Passkeys are bound to the genuine website's domain.
    {
      id: "q7",
      prompt:
        '"Passkeys are phishing-resistant because they only work on the genuine website they were created for."',
      options: [
        { id: "a", label: "True" },
        { id: "b", label: "False" },
      ],
      correctOptionId: "a",
      explanation:
        "True. A passkey is cryptographically tied to the real site's address, so a lookalike phishing page simply can't use it. That's why passkeys beat both passwords and typed-in codes.",
    },

    // q8 — Another TRUE. Kills the "I'm not important enough to hack" myth.
    {
      id: "q8",
      prompt:
        '"Even ordinary people\'s accounts are valuable to criminals — for scams, spam, and resale."',
      options: [
        { id: "a", label: "True" },
        { id: "b", label: "False" },
      ],
      correctOptionId: "a",
      explanation:
        "True. Most attacks are automated and hit everyone, not just the rich or famous. A hijacked 'ordinary' account is used to scam the owner's friends, send spam, or is simply sold in bulk.",
    },

    // q9 — The padlock myth. HTTPS = encrypted, not honest.
    {
      id: "q9",
      prompt:
        '"The padlock icon in the browser address bar proves a website is trustworthy."',
      options: [
        { id: "a", label: "True" },
        { id: "b", label: "False" },
      ],
      correctOptionId: "b",
      explanation:
        "False. The padlock only means the connection is encrypted — nobody can eavesdrop in transit. Scam sites use encryption too, so a phishing page can happily show a padlock. Check the actual domain, not the icon.",
    },

    // q10 — The VPN myth. Useful tool, not a force field.
    {
      id: "q10",
      prompt:
        '"A VPN makes me completely anonymous and protects me from all online threats."',
      options: [
        { id: "a", label: "True" },
        { id: "b", label: "False" },
      ],
      correctOptionId: "b",
      explanation:
        "False. A VPN encrypts your traffic in transit and hides your IP address from websites — that's it. It doesn't stop phishing, malware, weak passwords, or oversharing, and the VPN company itself can see your activity.",
    },
  ],
};
