// components/PasswordCrackerLab.tsx
//
// BIG PICTURE
// -----------
// The pupil types a PRETEND password and we instantly estimate how long a fast
// modern attacker might take to guess it by brute force. The maths is simple:
// count how many possible characters could appear (the "pool"), raise it to the
// length, and divide by a guessing speed. The magic teaching moment is watching
// the time explode when you add LENGTH, but barely move when you add a symbol.
// Everything runs in the browser; nothing is sent anywhere.

"use client";

import { useState } from "react";
import { Activity } from "@/lib/activities/types";

// A tiny list of the world's most-used passwords. If someone types one of
// these, no maths matters — it's the FIRST thing any attacker tries.
const TOP_PASSWORDS = new Set([
  "password", "123456", "123456789", "qwerty", "111111", "12345678",
  "abc123", "password1", "iloveyou", "admin", "letmein", "welcome",
  "monkey", "dragon", "football", "p@ssw0rd", "summer2024!",
]);

// Preset examples the pupil can load with one click, to compare instantly.
const PRESETS: { label: string; value: string }[] = [
  { label: "password",                    value: "password" },
  { label: "P@ssw0rd!",                   value: "P@ssw0rd!" },
  { label: "Totoro07",                    value: "Totoro07" },
  { label: "correct-horse-battery-staple", value: "correct-horse-battery-staple" },
  { label: "7 random words",              value: "velvet-otter-lantern-copper-jungle-mint-drum" },
];

// How many guesses per second we assume. 100 billion/sec is a realistic figure
// for an attacker with modern hardware attacking fast/leaked hashes offline.
const GUESSES_PER_SEC = 100_000_000_000;

export default function PasswordCrackerLab({ activity }: { activity: Activity }) {
  const [pw, setPw] = useState("");

  // ── Work out the character pool the password draws from ──
  const hasLower  = /[a-z]/.test(pw);
  const hasUpper  = /[A-Z]/.test(pw);
  const hasDigit  = /[0-9]/.test(pw);
  const hasSymbol = /[^a-zA-Z0-9]/.test(pw);
  const pool =
    (hasLower ? 26 : 0) +
    (hasUpper ? 26 : 0) +
    (hasDigit ? 10 : 0) +
    (hasSymbol ? 33 : 0);

  const isCommon = TOP_PASSWORDS.has(pw.toLowerCase());

  // Combinations = pool ^ length. We work in "log" space (bits of entropy)
  // to avoid gigantic numbers: entropyBits = length * log2(pool).
  const entropyBits = pw.length > 0 && pool > 0 ? pw.length * Math.log2(pool) : 0;

  // Average guesses to crack = half of all combinations = 2^(bits - 1).
  // Seconds = averageGuesses / guessesPerSec. Kept in log space until format.
  const log2Seconds = entropyBits - 1 - Math.log2(GUESSES_PER_SEC);

  // Turn "2^log2Seconds seconds" into friendly English.
  function humanTime(): string {
    if (pw.length === 0) return "—";
    if (isCommon) return "Instantly (it's on every attacker's list)";
    // seconds = 2 ** log2Seconds
    const seconds = Math.pow(2, log2Seconds);
    if (seconds < 1)            return "Less than a second";
    const units: [number, string][] = [
      [60, "seconds"], [60, "minutes"], [24, "hours"], [365, "days"],
      [100, "years"], [1000, "centuries"],
    ];
    let value = seconds;
    let name = "seconds";
    for (const [factor, label] of units) {
      if (value < factor) { name = label; break; }
      value = value / factor;
      name = label;
    }
    if (value > 1e9) return "Billions of " + name + " — effectively forever";
    if (value > 1000) return Math.round(value).toLocaleString() + " " + name;
    return value < 10 ? value.toFixed(1) + " " + name : Math.round(value) + " " + name;
  }

  // A 0–4 strength score drives the colour bar and label.
  function strength(): { score: number; label: string; color: string } {
    if (pw.length === 0) return { score: 0, label: "Type something", color: "#3d4f6b" };
    if (isCommon)        return { score: 0, label: "Terrible — a known password", color: "#ef4444" };
    if (entropyBits < 40)  return { score: 1, label: "Weak",       color: "#ef4444" };
    if (entropyBits < 60)  return { score: 2, label: "Okay",       color: "#eab308" };
    if (entropyBits < 90)  return { score: 3, label: "Strong",     color: "#22c55e" };
    return { score: 4, label: "Excellent",  color: "#00d4aa" };
  }

  const s = strength();
  const barWidth = pw.length === 0 ? 0 : (s.score / 4) * 100;

  return (
    <div className="flex flex-col gap-5" style={{ fontFamily: "var(--font-body)" }}>
      {/* ── Safety warning ─────────────────────────────────────────────── */}
      <div
        className="rounded-lg px-4 py-2.5 text-sm"
        style={{ background: "rgba(251,191,36,0.08)", border: "1px solid #854d0e", color: "#fcd34d" }}
      >
        ⚠️ Never type a password you actually use. Make one up — this is a demo.
        Nothing you type ever leaves your browser.
      </div>

      {/* ── The input + live meter ─────────────────────────────────────── */}
      <div
        className="rounded-2xl border p-6"
        style={{ background: "#0d1421", borderColor: "#1a2744" }}
      >
        <label style={{ color: "#6b7fa3", fontSize: "0.8rem", fontFamily: "var(--font-mono)" }}>
          Test a made-up password:
        </label>
        <input
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          placeholder="type a pretend password…"
          autoFocus
          spellCheck={false}
          style={{
            width: "100%",
            marginTop: "0.6rem",
            background: "#050810",
            border: "1px solid #1a2744",
            borderRadius: "0.6rem",
            padding: "0.7rem 0.9rem",
            color: "#e2e8f0",
            fontFamily: "var(--font-mono)",
            fontSize: "1rem",
            outline: "none",
          }}
        />

        {/* Strength bar */}
        <div style={{ marginTop: "1rem", height: "8px", background: "#1a2744", borderRadius: "4px", overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${barWidth}%`, background: s.color, transition: "width 0.25s ease, background 0.25s ease" }} />
        </div>
        <div className="flex justify-between" style={{ marginTop: "0.5rem" }}>
          <span style={{ color: s.color, fontSize: "0.85rem", fontWeight: 600 }}>{s.label}</span>
          <span style={{ color: "#6b7fa3", fontSize: "0.8rem", fontFamily: "var(--font-mono)" }}>
            {pw.length} chars · {Math.round(entropyBits)} bits
          </span>
        </div>

        {/* The headline: estimated time to crack */}
        <div
          className="rounded-xl mt-5 p-4 text-center"
          style={{ background: "#111927", border: `1px solid ${s.color}44` }}
        >
          <p style={{ color: "#6b7fa3", fontSize: "0.72rem", letterSpacing: "0.08em", marginBottom: "0.3rem" }}>
            ESTIMATED TIME FOR A FAST ATTACKER TO GUESS IT
          </p>
          <p style={{ color: s.color, fontSize: "1.35rem", fontWeight: 700, fontFamily: "var(--font-mono)" }}>
            {humanTime()}
          </p>
        </div>
      </div>

      {/* ── One-click comparisons ─────────────────────────────────────── */}
      <div>
        <p style={{ color: "#6b7fa3", fontSize: "0.8rem", marginBottom: "0.6rem" }}>
          Tap to compare — watch the time change:
        </p>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.label}
              onClick={() => setPw(p.value)}
              style={{
                background: "#111927",
                border: "1px solid #1a2744",
                borderRadius: "0.5rem",
                padding: "0.4rem 0.75rem",
                color: "#8ab4f8",
                fontFamily: "var(--font-mono)",
                fontSize: "0.78rem",
                cursor: "pointer",
              }}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── The takeaway ──────────────────────────────────────────────── */}
      <div
        className="rounded-xl border p-4 text-sm"
        style={{ background: "rgba(0,212,170,0.05)", borderColor: "rgba(0,212,170,0.25)", color: "#9fe8d6", lineHeight: 1.6 }}
      >
        <strong style={{ color: "#00d4aa" }}>The lesson:</strong> compare{" "}
        <span style={{ fontFamily: "var(--font-mono)" }}>P@ssw0rd!</span> with{" "}
        <span style={{ fontFamily: "var(--font-mono)" }}>correct-horse-battery-staple</span>.
        The second has no symbols at all, yet it's dramatically harder to crack —
        because <strong>length beats complexity</strong>. A long passphrase of
        random words is both stronger <em>and</em> easier to remember. And no
        matter how clever it looks, a password on a known list falls instantly.
      </div>
    </div>
  );
}
