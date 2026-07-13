// components/WebVulnLab.tsx
//
// BIG PICTURE
// -----------
// This is a SAFE, pretend login box for a fictional website. It teaches one of
// the most important ideas in security: a website must treat everything a user
// types as *data*, never as *commands*. In "sloppy mode" we show how gluing raw
// input into a database instruction lets someone slip past the login. Then the
// pupil flips on the defence ("safe mode") and watches the exact same input get
// treated as a harmless username. NOTHING real happens — there is no database,
// no server, no network. It's all simulated with plain string checks so pupils
// can SEE the concept and, crucially, the fix.

"use client";

import { useState } from "react";
import { Activity } from "@/lib/activities/types";

export default function WebVulnLab({ activity }: { activity: Activity }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [safeMode, setSafeMode] = useState(false); // false = vulnerable demo
  const [result, setResult] = useState<null | { ok: boolean; asAdmin: boolean; message: string }>(null);

  // The famous teaching example: a bit of text that, if pasted straight into a
  // database instruction, changes its meaning so the password check is skipped.
  const TRICK = "' OR '1'='1";

  // Build the "query" string purely to VISUALISE what the code would do.
  // In real safe code you never build queries like this — that's the point.
  const builtQuery = safeMode
    ? `SELECT * FROM users WHERE name = ?  ← your input goes in a sealed box, not the instruction`
    : `SELECT * FROM users WHERE name = '${username}' AND pass = '${password}'`;

  function attemptLogin() {
    // Did the pupil paste the trick into the username box?
    const usedTrick = username.includes("OR '1'='1") || username.includes('OR "1"="1');

    if (safeMode) {
      // SAFE MODE: input is always treated as a literal username. The trick is
      // just a weird username that doesn't exist, so login simply fails.
      setResult({
        ok: false,
        asAdmin: false,
        message: usedTrick
          ? "Login denied. In safe mode your input is treated as plain text — the trick is just an unknown username, so it does nothing. This is the fix working. 🛡️"
          : "Login denied (this is a demo — no real accounts exist). Notice your input was checked as data, never run as a command.",
      });
      return;
    }

    // VULNERABLE MODE: if the trick was used, the (pretend) database is fooled
    // into logging the attacker in without a valid password.
    if (usedTrick) {
      setResult({
        ok: true,
        asAdmin: true,
        message:
          "⚠️ Bypassed! Because the site glued your text straight into its database instruction, your input CHANGED the instruction's meaning and skipped the password check. In a real, unprotected site this is how data gets stolen.",
      });
    } else {
      setResult({
        ok: false,
        asAdmin: false,
        message: "Login denied (demo — no real accounts). Try turning on the trick with the button below to see the weakness.",
      });
    }
  }

  return (
    <div className="flex flex-col gap-5" style={{ fontFamily: "var(--font-body)" }}>
      {/* ── Mode toggle: this IS the lesson ────────────────────────────── */}
      <div
        className="rounded-xl border p-4 flex flex-col sm:flex-row sm:items-center gap-3 justify-between"
        style={{ background: "#0d1421", borderColor: "#1a2744" }}
      >
        <div>
          <p style={{ color: "#e2e8f0", fontWeight: 600, fontSize: "0.9rem" }}>
            Website mode: {safeMode ? "🛡️ Safe (input validated)" : "⚠️ Sloppy (trusts input)"}
          </p>
          <p style={{ color: "#6b7fa3", fontSize: "0.8rem" }}>
            Flip this to see the weakness, then the fix.
          </p>
        </div>
        <button
          onClick={() => { setSafeMode((v) => !v); setResult(null); }}
          style={{
            background: safeMode ? "rgba(0,212,170,0.12)" : "rgba(239,68,68,0.12)",
            border: `1px solid ${safeMode ? "#00d4aa" : "#ef4444"}`,
            color: safeMode ? "#00d4aa" : "#fca5a5",
            borderRadius: "0.6rem",
            padding: "0.55rem 1rem",
            fontWeight: 700,
            fontSize: "0.85rem",
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}
        >
          {safeMode ? "Switch to sloppy mode" : "Switch to safe mode"}
        </button>
      </div>

      {/* ── The fake login form ────────────────────────────────────────── */}
      <div className="rounded-2xl border p-6" style={{ background: "#111927", borderColor: "#1a2744" }}>
        <p style={{ color: "#e2e8f0", fontFamily: "var(--font-display)", fontSize: "1.1rem", marginBottom: "1rem" }}>
          🔐 NorthTech Portal — Sign in <span style={{ color: "#3d4f6b", fontSize: "0.75rem" }}>(fictional)</span>
        </p>

        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="username"
          spellCheck={false}
          style={inputStyle}
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="password"
          spellCheck={false}
          style={{ ...inputStyle, marginTop: "0.6rem" }}
        />

        <div className="flex flex-wrap gap-2" style={{ marginTop: "0.9rem" }}>
          <button onClick={attemptLogin} style={primaryBtn}>Sign in</button>
          <button
            onClick={() => { setUsername(TRICK); setPassword("anything"); setResult(null); }}
            style={ghostBtn}
          >
            Load the classic trick input
          </button>
        </div>
      </div>

      {/* ── Query visualiser — see what the code does with your input ──── */}
      <div className="rounded-xl border p-4" style={{ background: "#050810", borderColor: "#1a2744" }}>
        <p style={{ color: "#6b7fa3", fontSize: "0.72rem", letterSpacing: "0.08em", marginBottom: "0.5rem" }}>
          WHAT THE (PRETEND) DATABASE RECEIVES:
        </p>
        <code style={{ color: safeMode ? "#86efac" : "#fca5a5", fontSize: "0.8rem", fontFamily: "var(--font-mono)", whiteSpace: "pre-wrap", wordBreak: "break-word", display: "block", lineHeight: 1.6 }}>
          {builtQuery}
        </code>
      </div>

      {/* ── Result banner ─────────────────────────────────────────────── */}
      {result && (
        <div
          className="rounded-xl border p-4 text-sm animate-fade-up"
          style={{
            background: result.ok ? "rgba(239,68,68,0.08)" : "rgba(0,212,170,0.06)",
            borderColor: result.ok ? "#7f1d1d" : "rgba(0,212,170,0.3)",
            color: result.ok ? "#fca5a5" : "#9fe8d6",
            lineHeight: 1.6,
          }}
        >
          {result.asAdmin && (
            <p style={{ fontWeight: 700, marginBottom: "0.3rem" }}>Logged in as ADMIN — with no valid password.</p>
          )}
          {result.message}
        </div>
      )}

      {/* ── The defence, spelled out ──────────────────────────────────── */}
      <div
        className="rounded-xl border p-4 text-sm"
        style={{ background: "rgba(0,212,170,0.05)", borderColor: "rgba(0,212,170,0.25)", color: "#9fe8d6", lineHeight: 1.6 }}
      >
        <strong style={{ color: "#00d4aa" }}>The fix (secure-by-design):</strong> never mix user input into a
        command. Real, safe websites keep the instruction and the input in
        separate sealed boxes (called <em>parameterised queries</em>) and{" "}
        <em>validate</em> input before using it — so typed text can only ever be
        treated as data, never as code. That single habit shuts down a whole
        family of attacks.
      </div>
    </div>
  );
}

// Shared inline styles (kept at the bottom so the component reads top-to-bottom).
const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "#050810",
  border: "1px solid #1a2744",
  borderRadius: "0.6rem",
  padding: "0.65rem 0.85rem",
  color: "#e2e8f0",
  fontFamily: "var(--font-mono)",
  fontSize: "0.9rem",
  outline: "none",
};

const primaryBtn: React.CSSProperties = {
  background: "#00d4aa",
  color: "#050810",
  border: "none",
  borderRadius: "0.6rem",
  padding: "0.55rem 1.2rem",
  fontWeight: 700,
  fontSize: "0.85rem",
  cursor: "pointer",
};

const ghostBtn: React.CSSProperties = {
  background: "transparent",
  color: "#8ab4f8",
  border: "1px solid #1a2744",
  borderRadius: "0.6rem",
  padding: "0.55rem 1rem",
  fontSize: "0.82rem",
  cursor: "pointer",
};
