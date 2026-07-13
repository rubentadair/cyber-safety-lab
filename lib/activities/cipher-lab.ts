// lib/activities/cipher-lab.ts
import { Activity } from "./types";

// Room 10 — an encode/decode playground. Pupils scramble and unscramble
// messages with classic ciphers to build intuition for what encryption does
// (and why weak, ancient ciphers are easy to break).
export const cipherLab: Activity = {
  slug: "cipher-lab",
  title: "Secret Message Lab",
  description: "Scramble and crack coded messages to learn how encryption works.",
  emoji: "🔓",
  roomNumber: 10,
  difficulty: "medium",
  kind: "cipher-lab",
  intro:
    "Encryption turns readable text into secret code. Play with classic ciphers to encode your own messages, then take on the challenge of cracking a coded message with no key — and learn why old ciphers don't stand a chance today.",
};
