// components/PhishingInspector.tsx
//
// BIG PICTURE
// -----------
// A hands-on twist on "spot the phish": we render a fictional email and the
// pupil CLICKS the parts they think are red flags. Real flags turn green with
// an explanation; clicking a perfectly innocent part gently teaches that good
// security also means NOT panicking at everything. When every flag is found,
// the case is solved.

"use client";

import { useState } from "react";
import { Activity } from "@/lib/activities/types";

// The email is built from "segments". A plain string renders as normal text.
// An object is a clickable chunk: `flag: true` means it's a genuine red flag
// (correct to click); `flag: false` means it's a harmless decoy.
type Segment =
  | string
  | { id: string; text: string; flag: boolean; explanation: string };

// Convenience so the email below reads cleanly.
const RED = (id: string, text: string, explanation: string): Segment => ({ id, text, flag: true, explanation });
const OK  = (id: string, text: string, explanation: string): Segment => ({ id, text, flag: false, explanation });

// The fictional phishing email, as a mix of plain text and clickable chunks.
const EMAIL: { line: Segment[] }[] = [
  { line: ["From: Microsoft Account Team <", RED("f1", "security@microsft-account-verify.ru", "Look closely: 'microsft' is misspelled and the real domain is microsoft.com — not a '.ru' lookalike. The sender address is the single biggest giveaway."), ">"] },
  { line: ["Subject: ", RED("f2", "URGENT: Unusual sign-in — respond within 24 hours or your account will be permanently closed", "Manufactured urgency + a threat. Real providers don't threaten to delete your account by email to rush you into acting without thinking.")] },
  { line: [" "] },
  { line: [RED("f3", "Dear Valued Customer,", "A generic greeting. A company you actually have an account with usually knows and uses your name.")] },
  { line: [" "] },
  { line: ["We detected a sign-in from a new device. ", OK("f4", "If this was you, no action is needed.", "This line is actually normal and reassuring — clicking it is a false alarm. Not everything in a scam email is a red flag; learning what's fine matters too.")] },
  { line: ["To secure your account, please ", RED("f5", "confirm your password and card details", "No legitimate company ever asks you to confirm your password (or card details) by email. This request alone marks it as a scam.")] },
  { line: ["by clicking here: ", RED("f6", "http://microsoft.account-secure-verify.ru/login", "The link's real domain is 'account-secure-verify.ru', not microsoft.com. The brand name is just bolted on the front to fool you. Hover before you click — the true destination is at the end, before the first single slash.")] },
  { line: [" "] },
  { line: ["We've also attached a copy of the security notice: ", RED("f7", "Account_Notice.html", "An unexpected '.html' attachment often opens a fake login page that steals whatever you type. Don't open attachments you didn't expect.")] },
  { line: [" "] },
  { line: [OK("f8", "Thank you for using our service.", "A perfectly ordinary sign-off — harmless. Clicking it is a false positive.")] },
  { line: [RED("f9", "Failure to comply will results in legal action.", "Threats of 'legal action' are pure pressure — and notice the grammar slip ('will results'). Clumsy language is a classic phishing tell.")] },
];

// Count the genuine red flags so we know when the case is solved.
const TOTAL_FLAGS = EMAIL.flatMap((r) => r.line).filter((s) => typeof s !== "string" && s.flag).length;

export default function PhishingInspector({ activity }: { activity: Activity }) {
  // Which chunk ids the pupil has clicked.
  const [clicked, setClicked] = useState<Set<string>>(new Set());
  const [revealAll, setRevealAll] = useState(false);

  function toggle(id: string) {
    setClicked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  // Gather the segments the pupil clicked, split into hits and false alarms.
  const allSegs = EMAIL.flatMap((r) => r.line).filter((s) => typeof s !== "string") as Exclude<Segment, string>[];
  const foundFlags   = allSegs.filter((s) => s.flag && clicked.has(s.id));
  const falseAlarms  = allSegs.filter((s) => !s.flag && clicked.has(s.id));
  const solved = foundFlags.length === TOTAL_FLAGS;

  return (
    <div className="flex flex-col gap-5" style={{ fontFamily: "var(--font-body)" }}>
      {/* ── Scoreboard ────────────────────────────────────────────────── */}
      <div
        className="rounded-xl border p-4 flex items-center justify-between"
        style={{ background: "#0d1421", borderColor: solved ? "#166534" : "#1a2744" }}
      >
        <div>
          <p style={{ color: "#e2e8f0", fontWeight: 600, fontSize: "0.9rem" }}>
            Red flags found: <span style={{ color: "#00d4aa" }}>{foundFlags.length}/{TOTAL_FLAGS}</span>
          </p>
          {falseAlarms.length > 0 && (
            <p style={{ color: "#fcd34d", fontSize: "0.78rem" }}>
              False alarms: {falseAlarms.length} — check the notes below
            </p>
          )}
        </div>
        <button
          onClick={() => setRevealAll((v) => !v)}
          style={{
            background: "transparent", border: "1px solid #1a2744", color: "#8ab4f8",
            borderRadius: "0.5rem", padding: "0.4rem 0.8rem", fontSize: "0.8rem", cursor: "pointer",
          }}
        >
          {revealAll ? "Hide answers" : "Reveal all"}
        </button>
      </div>

      {/* ── The email ─────────────────────────────────────────────────── */}
      <div
        className="rounded-2xl border p-6"
        style={{ background: "#111927", borderColor: "#1a2744", fontFamily: "var(--font-mono)", fontSize: "0.85rem", lineHeight: 1.9 }}
      >
        {EMAIL.map((row, ri) => (
          <div key={ri} style={{ color: "#c9d1d9", wordBreak: "break-word" }}>
            {row.line.map((seg, si) => {
              if (typeof seg === "string") return <span key={si}>{seg}</span>;

              const isClicked = clicked.has(seg.id);
              const show = isClicked || revealAll;

              // Colour logic: correct catch = green, false alarm = amber,
              // unclicked = subtly underlined to hint it's clickable.
              let bg = "transparent";
              let color = "#c9d1d9";
              let border = "1px dashed #2a3a55";
              if (show) {
                if (seg.flag) { bg = "rgba(34,197,94,0.14)"; color = "#86efac"; border = "1px solid #166534"; }
                else          { bg = "rgba(251,191,36,0.14)"; color = "#fcd34d"; border = "1px solid #854d0e"; }
              }

              return (
                <span
                  key={si}
                  onClick={() => toggle(seg.id)}
                  title="Click if you think this is a red flag"
                  style={{
                    background: bg, color, border, borderRadius: "4px",
                    padding: "1px 4px", margin: "0 1px", cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                >
                  {seg.text}
                </span>
              );
            })}
          </div>
        ))}
      </div>

      <p style={{ color: "#3d4f6b", fontSize: "0.72rem" }}>
        Click any part of the email you think is suspicious. Green = a real red flag you caught.
        Amber = actually harmless (a false alarm).
      </p>

      {/* ── Explanations for everything clicked (or revealed) ─────────── */}
      {(clicked.size > 0 || revealAll) && (
        <div className="flex flex-col gap-2 animate-fade-up">
          {allSegs
            .filter((s) => revealAll || clicked.has(s.id))
            .map((s) => (
              <div
                key={s.id}
                className="rounded-lg border p-3 text-sm"
                style={{
                  background: s.flag ? "rgba(34,197,94,0.06)" : "rgba(251,191,36,0.06)",
                  borderColor: s.flag ? "#166534" : "#854d0e",
                  color: s.flag ? "#9fe8d6" : "#fcd34d",
                  lineHeight: 1.6,
                }}
              >
                <span style={{ fontWeight: 700 }}>{s.flag ? "🚩 Red flag: " : "✅ Harmless: "}</span>
                <span style={{ fontFamily: "var(--font-mono)", color: "#e2e8f0" }}>“{s.text.length > 46 ? s.text.slice(0, 46) + "…" : s.text}”</span>
                <div style={{ marginTop: "0.3rem" }}>{s.explanation}</div>
              </div>
            ))}
        </div>
      )}

      {/* ── Solved banner ─────────────────────────────────────────────── */}
      {solved && (
        <div
          className="rounded-xl border p-4 text-center animate-fade-up"
          style={{ background: "rgba(0,212,170,0.08)", borderColor: "#166534", color: "#00d4aa" }}
        >
          <p style={{ fontSize: "1.5rem", marginBottom: "0.25rem" }}>🏆</p>
          <p style={{ fontWeight: 700 }}>Every red flag caught — you'd have stopped this attack cold.</p>
          <p style={{ color: "#9fe8d6", fontSize: "0.85rem", marginTop: "0.3rem" }}>
            The instinct you just used — check the sender, distrust urgency, never
            hand over passwords, hover before clicking — is exactly what keeps real inboxes safe.
          </p>
        </div>
      )}
    </div>
  );
}
