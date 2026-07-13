// components/CipherLab.tsx
//
// BIG PICTURE
// -----------
// Encryption turns readable text ("plaintext") into scrambled text
// ("ciphertext") using a rule and a key. This lab lets pupils encode/decode
// with classic ciphers to build intuition, then CRACK a Caesar cipher with no
// key at all — proving that a code with only 25 possible keys is broken in
// seconds. That contrast (25 keys vs the astronomically many in real
// encryption) is the whole lesson.

"use client";

import { useState } from "react";
import { Activity } from "@/lib/activities/types";

// Shift every letter along the alphabet by `amount` (Caesar cipher).
// Non-letters (spaces, punctuation) pass through untouched.
function caesar(text: string, amount: number): string {
  return text.replace(/[a-z]/gi, (ch) => {
    const base = ch <= "Z" ? 65 : 97;             // uppercase vs lowercase
    const code = ch.charCodeAt(0) - base;
    const shifted = (code + amount + 26) % 26;    // +26 keeps it positive
    return String.fromCharCode(shifted + base);
  });
}

// Atbash: A↔Z, B↔Y … a mirror of the alphabet. Its own inverse.
function atbash(text: string): string {
  return text.replace(/[a-z]/gi, (ch) => {
    const base = ch <= "Z" ? 65 : 97;
    return String.fromCharCode(base + 25 - (ch.charCodeAt(0) - base));
  });
}

// The pre-made challenge: a Caesar-encoded message with a hidden shift of 7.
const CHALLENGE_PLAINTEXT = "MEET AT THE OLD CLOCK TOWER AT NOON";
const CHALLENGE_SHIFT = 7;
const CHALLENGE_CIPHERTEXT = caesar(CHALLENGE_PLAINTEXT, CHALLENGE_SHIFT);

type Cipher = "caesar" | "atbash" | "rot13";

export default function CipherLab({ activity }: { activity: Activity }) {
  // ── Playground state ──
  const [text, setText] = useState("Attack at dawn");
  const [cipher, setCipher] = useState<Cipher>("caesar");
  const [shift, setShift] = useState(3);

  // Compute the scrambled output live.
  const output =
    cipher === "atbash" ? atbash(text)
    : cipher === "rot13" ? caesar(text, 13)
    : caesar(text, shift);

  // ── Challenge state ──
  const [cracked, setCracked] = useState(false);

  return (
    <div className="flex flex-col gap-6" style={{ fontFamily: "var(--font-body)" }}>
      {/* ── Encode/decode playground ──────────────────────────────────── */}
      <div className="rounded-2xl border p-6" style={{ background: "#0d1421", borderColor: "#1a2744" }}>
        <p style={{ color: "#e2e8f0", fontFamily: "var(--font-display)", fontSize: "1.1rem", marginBottom: "1rem" }}>
          🔐 Cipher playground
        </p>

        {/* Cipher picker */}
        <div className="flex flex-wrap gap-2" style={{ marginBottom: "1rem" }}>
          {([["caesar", "Caesar shift"], ["rot13", "ROT13"], ["atbash", "Atbash mirror"]] as [Cipher, string][]).map(
            ([id, label]) => (
              <button
                key={id}
                onClick={() => setCipher(id)}
                style={{
                  background: cipher === id ? "rgba(0,212,170,0.12)" : "#111927",
                  border: `1px solid ${cipher === id ? "#00d4aa" : "#1a2744"}`,
                  color: cipher === id ? "#00d4aa" : "#8ab4f8",
                  borderRadius: "0.5rem",
                  padding: "0.4rem 0.8rem",
                  fontSize: "0.8rem",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                {label}
              </button>
            )
          )}
        </div>

        {/* Shift slider — only meaningful for the Caesar cipher */}
        {cipher === "caesar" && (
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ color: "#6b7fa3", fontSize: "0.8rem", fontFamily: "var(--font-mono)" }}>
              Key (shift): {shift}
            </label>
            <input
              type="range" min={1} max={25} value={shift}
              onChange={(e) => setShift(Number(e.target.value))}
              style={{ width: "100%", accentColor: "#00d4aa", marginTop: "0.4rem" }}
            />
          </div>
        )}

        {/* Input */}
        <label style={{ color: "#6b7fa3", fontSize: "0.8rem", fontFamily: "var(--font-mono)" }}>Your message:</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={2}
          spellCheck={false}
          style={{
            width: "100%", marginTop: "0.4rem", background: "#050810", border: "1px solid #1a2744",
            borderRadius: "0.6rem", padding: "0.65rem 0.85rem", color: "#e2e8f0",
            fontFamily: "var(--font-mono)", fontSize: "0.9rem", outline: "none", resize: "vertical",
          }}
        />

        {/* Output */}
        <label style={{ color: "#6b7fa3", fontSize: "0.8rem", fontFamily: "var(--font-mono)", display: "block", marginTop: "0.9rem" }}>
          Scrambled result:
        </label>
        <div
          style={{
            marginTop: "0.4rem", background: "#111927", border: "1px solid #1a2744",
            borderRadius: "0.6rem", padding: "0.75rem 0.85rem", color: "#00d4aa",
            fontFamily: "var(--font-mono)", fontSize: "0.95rem", minHeight: "2.6rem", wordBreak: "break-word",
          }}
        >
          {output || <span style={{ color: "#3d4f6b" }}>…</span>}
        </div>
        <p style={{ color: "#3d4f6b", fontSize: "0.72rem", marginTop: "0.5rem" }}>
          Tip: to DECODE a Caesar message, shift back by the same key (or use 26 − key).
        </p>
      </div>

      {/* ── Crack-the-code challenge ──────────────────────────────────── */}
      <div className="rounded-2xl border p-6" style={{ background: "#0d1421", borderColor: cracked ? "#166534" : "#1a2744" }}>
        <p style={{ color: "#e2e8f0", fontFamily: "var(--font-display)", fontSize: "1.1rem", marginBottom: "0.5rem" }}>
          🕵️ Challenge: crack this — no key given
        </p>
        <p style={{ color: "#6b7fa3", fontSize: "0.85rem", marginBottom: "1rem" }}>
          An intercepted Caesar message. You don't know the shift. But a Caesar
          cipher has only 25 possible keys… so just try them all.
        </p>

        <div
          style={{
            background: "#050810", border: "1px solid #1a2744", borderRadius: "0.6rem",
            padding: "0.75rem 0.85rem", color: "#fca5a5", fontFamily: "var(--font-mono)",
            fontSize: "0.9rem", marginBottom: "1rem", wordBreak: "break-word",
          }}
        >
          {CHALLENGE_CIPHERTEXT}
        </div>

        {!cracked ? (
          <button
            onClick={() => setCracked(true)}
            style={{
              background: "#00d4aa", color: "#050810", border: "none", borderRadius: "0.6rem",
              padding: "0.55rem 1.2rem", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer",
            }}
          >
            Try all 25 shifts →
          </button>
        ) : (
          <div className="animate-fade-up">
            <p style={{ color: "#6b7fa3", fontSize: "0.75rem", marginBottom: "0.5rem", fontFamily: "var(--font-mono)" }}>
              ALL POSSIBLE DECODINGS — the readable one is the answer:
            </p>
            <div style={{ display: "grid", gap: "2px" }}>
              {Array.from({ length: 25 }, (_, i) => i + 1).map((k) => {
                const guess = caesar(CHALLENGE_CIPHERTEXT, -k);
                const isAnswer = k === CHALLENGE_SHIFT;
                return (
                  <div
                    key={k}
                    style={{
                      display: "flex", gap: "0.75rem", alignItems: "baseline",
                      background: isAnswer ? "rgba(0,212,170,0.1)" : "transparent",
                      borderRadius: "4px", padding: "2px 6px",
                    }}
                  >
                    <span style={{ color: "#3d4f6b", fontFamily: "var(--font-mono)", fontSize: "0.72rem", width: "3.5rem", flexShrink: 0 }}>
                      shift {String(k).padStart(2, " ")}
                    </span>
                    <span style={{ color: isAnswer ? "#00d4aa" : "#6b7fa3", fontFamily: "var(--font-mono)", fontSize: "0.8rem", fontWeight: isAnswer ? 700 : 400, wordBreak: "break-word" }}>
                      {guess}{isAnswer ? "   ← cracked!" : ""}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ── The takeaway ──────────────────────────────────────────────── */}
      <div
        className="rounded-xl border p-4 text-sm"
        style={{ background: "rgba(0,212,170,0.05)", borderColor: "rgba(0,212,170,0.25)", color: "#9fe8d6", lineHeight: 1.6 }}
      >
        <strong style={{ color: "#00d4aa" }}>Why this matters:</strong> a Caesar
        cipher is weak because there are only 25 keys to try — a computer breaks
        it instantly. Modern encryption (like the AES that protects your
        messages and bank details) uses keys with more possible combinations
        than there are atoms in the observable universe, so "just try them all"
        would take longer than the age of the cosmos. Strong encryption isn't
        about a cleverer secret — it's about a key space too vast to search.
      </div>
    </div>
  );
}
