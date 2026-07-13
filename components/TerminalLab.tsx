// components/TerminalLab.tsx
//
// BIG PICTURE
// -----------
// This is a *fake* command-line terminal. The pupil types simple commands
// (help, ls, cat …) to read fictional log files and emails, and by following
// the clues they work out how a made-up company got hacked. Nothing here runs
// real commands or touches a real computer — every "file" is just text stored
// in the CONTENT object below. As they uncover each clue, an objectives
// checklist ticks off, giving the room a satisfying "case solved" ending.

"use client";

import { useState, useRef, useEffect } from "react";
import { Activity } from "@/lib/activities/types";

// ─── The fictional evidence ────────────────────────────────────────────────
// Each key is a "file" the pupil can `cat`. The story: an employee at the
// fictional "NorthTech" reused a password, fell for a phishing email, and the
// attacker logged in from abroad in the middle of the night.
const FILES: Record<string, string> = {
  "readme.txt":
    "NORTHTECH INCIDENT #4471 — INVESTIGATION NOTES\n" +
    "Something is wrong with the account 'j.rivera'. Your job: find out\n" +
    "how an attacker got in, and how to stop it happening again.\n\n" +
    "Useful commands: ls, cat <file>, whoami, hint, clear, help",
  "auth.log":
    "=== authentication log (most recent last) ===\n" +
    "02:14  j.rivera  LOGIN FAILED  (wrong password)  ip 51.140.x.x  [office]\n" +
    "02:14  j.rivera  LOGIN OK                          ip 51.140.x.x  [office]\n" +
    "09:31  j.rivera  LOGIN OK                          ip 51.140.x.x  [office]\n" +
    "17:02  j.rivera  LOGIN OK                          ip 51.140.x.x  [office]\n" +
    "--------------------------------------------------------------\n" +
    "03:47  j.rivera  LOGIN OK      ip 203.0.113.66  [Country: Elsewheria]  <-- ??\n" +
    "03:48  j.rivera  DOWNLOAD 'customer_list.csv'  ip 203.0.113.66\n" +
    "03:51  j.rivera  CHANGED account recovery email  ip 203.0.113.66\n" +
    "\nTIP: compare where the 03:47 login came from with all the others.",
  "inbox.txt":
    "=== j.rivera's inbox (yesterday) ===\n" +
    "1) From: IT-Helpdesk <it-support@northtech-verify.co>\n" +
    "   Subject: [ACTION] Re-verify your mailbox in 24h or lose access\n" +
    "   Body: Click https://northtech-verify.co/login to confirm your\n" +
    "         password now, or your account will be suspended.\n" +
    "   -> Note in file: j.rivera replied 'done!' at 21:30. Uh oh.\n\n" +
    "2) From: Canteen <canteen@northtech.com>\n" +
    "   Subject: Friday menu\n" +
    "   Body: Pizza day! No action needed.",
  "notes.txt":
    "=== j.rivera's sticky note (found on desk) ===\n" +
    "\"I use the same password for everything so I don't forget it:\n" +
    " Summer2024!  — works for email, banking, games, all of it.\"\n" +
    "\n(Investigator: this is a huge problem. Why?)",
  "fix.txt":
    "=== recommended fixes (fill these in with the 'report' command) ===\n" +
    "Once you know HOW they got in, run:  report\n" +
    "and pick the three defences that would have stopped this attack.",
};

// The three clues the pupil needs to uncover, and which command reveals each.
interface Objective { id: string; label: string; revealedBy: string; }
const OBJECTIVES: Objective[] = [
  { id: "login",  label: "Spot the suspicious login",            revealedBy: "auth.log" },
  { id: "phish",  label: "Find how the attacker got the password", revealedBy: "inbox.txt" },
  { id: "reuse",  label: "Discover why one leak unlocked everything", revealedBy: "notes.txt" },
];

// One line of terminal output. `tone` just controls the colour.
interface Line { text: string; tone?: "normal" | "system" | "success" | "error" | "input"; }

export default function TerminalLab({ activity }: { activity: Activity }) {
  // The scrollback: everything printed so far.
  const [lines, setLines] = useState<Line[]>([
    { text: "NorthTech Incident Response Terminal v2.1", tone: "system" },
    { text: "Fictional training environment — nothing here is real.", tone: "system" },
    { text: "Type 'help' and press Enter to begin.", tone: "system" },
    { text: "" },
  ]);
  const [input, setInput] = useState("");
  // Which objectives have been revealed (a Set of objective ids).
  const [found, setFound] = useState<Set<string>>(new Set());
  const [solved, setSolved] = useState(false);

  // Refs let us auto-scroll to the newest line and keep the caret focused.
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Every time new lines are added, scroll to the bottom.
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [lines]);

  // Helper to append one or more lines to the scrollback.
  function print(newLines: Line[]) {
    setLines((prev) => [...prev, ...newLines]);
  }

  // Mark an objective found (if a file reveals one) and celebrate a full clear.
  function maybeReveal(fileName: string) {
    const obj = OBJECTIVES.find((o) => o.revealedBy === fileName);
    if (obj && !found.has(obj.id)) {
      const next = new Set(found);
      next.add(obj.id);
      setFound(next);
      print([{ text: `✔ Clue logged: ${obj.label}`, tone: "success" }]);
      if (next.size === OBJECTIVES.length) {
        print([
          { text: "" },
          { text: "All three clues found! Type 'report' to close the case.", tone: "success" },
        ]);
      }
    }
  }

  // The command interpreter. Reads one typed line and prints a response.
  function runCommand(raw: string) {
    const cmd = raw.trim();
    // Always echo what the user typed, like a real terminal.
    print([{ text: `analyst@northtech:~$ ${cmd}`, tone: "input" }]);
    if (cmd === "") return;

    const [name, ...rest] = cmd.split(/\s+/);
    const arg = rest.join(" ").toLowerCase();

    switch (name.toLowerCase()) {
      case "help":
        print([
          { text: "Available commands:", tone: "system" },
          { text: "  ls              list the evidence files" },
          { text: "  cat <file>      read a file (e.g. cat auth.log)" },
          { text: "  whoami          who you're logged in as" },
          { text: "  hint            get a nudge on what to look at next" },
          { text: "  report          submit your conclusion (once clues are found)" },
          { text: "  clear           clear the screen" },
          { text: "" },
        ]);
        break;

      case "ls":
        print([
          { text: Object.keys(FILES).join("   ") },
          { text: "" },
        ]);
        break;

      case "cat": {
        const file = arg;
        if (!file) { print([{ text: "Usage: cat <file>", tone: "error" }]); break; }
        if (FILES[file]) {
          print([{ text: FILES[file] }, { text: "" }]);
          maybeReveal(file);
        } else {
          print([{ text: `cat: ${file}: no such file. Try 'ls'.`, tone: "error" }]);
        }
        break;
      }

      case "whoami":
        print([{ text: "analyst  (read-only access to incident #4471)" }, { text: "" }]);
        break;

      case "hint": {
        // Give the next unfound objective's nudge.
        const nextObj = OBJECTIVES.find((o) => !found.has(o.id));
        if (!nextObj) { print([{ text: "You've found every clue — run 'report'.", tone: "success" }]); break; }
        const nudges: Record<string, string> = {
          login: "Attackers leave footprints. Read the login records: cat auth.log",
          phish: "How did they learn the password? Check the mailbox: cat inbox.txt",
          reuse: "One leaked password shouldn't unlock everything. Read: cat notes.txt",
        };
        print([{ text: "💡 " + nudges[nextObj.id], tone: "system" }, { text: "" }]);
        break;
      }

      case "report":
        if (found.size < OBJECTIVES.length) {
          print([
            { text: `You're not ready to report yet (${found.size}/${OBJECTIVES.length} clues found).`, tone: "error" },
            { text: "Keep investigating. Type 'hint' if you're stuck.", tone: "system" },
            { text: "" },
          ]);
        } else {
          setSolved(true);
          print([
            { text: "" },
            { text: "══════════ CASE CLOSED ══════════", tone: "success" },
            { text: "How the attacker got in:", tone: "system" },
            { text: "  1. j.rivera fell for a phishing email and typed their password" },
            { text: "     into a fake 'northtech-verify.co' login page." },
            { text: "  2. That same password was reused everywhere (Summer2024!)," },
            { text: "     so one leak unlocked the real account too." },
            { text: "  3. The attacker logged in at 03:47 from another country and" },
            { text: "     stole customer data before anyone noticed." },
            { text: "" },
            { text: "Defences that would have stopped it:", tone: "system" },
            { text: "  • Multi-factor authentication (the stolen password alone" },
            { text: "    wouldn't have been enough)." },
            { text: "  • A unique password per account (a leak stays contained)." },
            { text: "  • Spotting the phishing email before clicking." },
            { text: "" },
            { text: "Great work, analyst. 🛡️", tone: "success" },
          ]);
        }
        break;

      case "clear":
        setLines([]);
        break;

      default:
        print([
          { text: `Command not found: ${name}. Type 'help' for the list.`, tone: "error" },
          { text: "" },
        ]);
    }
  }

  // Enter key submits the current input line.
  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      runCommand(input);
      setInput("");
    }
  }

  // Colour lookup for each line tone.
  const toneColor: Record<string, string> = {
    normal: "#c9d1d9",
    system: "#6b7fa3",
    success: "#00d4aa",
    error: "#fca5a5",
    input: "#8ab4f8",
  };

  return (
    <div className="grid gap-4" style={{ gridTemplateColumns: "1fr", fontFamily: "var(--font-mono)" }}>
      {/* ── Objectives checklist ─────────────────────────────────────── */}
      <div
        className="rounded-xl border p-4"
        style={{ background: "#0d1421", borderColor: "#1a2744" }}
      >
        <p style={{ color: "#6b7fa3", fontSize: "0.7rem", letterSpacing: "0.1em", marginBottom: "0.6rem" }}>
          OBJECTIVES — {found.size}/{OBJECTIVES.length} CLUES
        </p>
        <div className="flex flex-col gap-1.5">
          {OBJECTIVES.map((o) => {
            const done = found.has(o.id);
            return (
              <div key={o.id} className="flex items-center gap-2" style={{ fontSize: "0.82rem" }}>
                <span style={{ color: done ? "#00d4aa" : "#3d4f6b" }}>{done ? "✔" : "○"}</span>
                <span style={{ color: done ? "#86efac" : "#6b7fa3", textDecoration: done ? "none" : "none" }}>
                  {o.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── The terminal window ──────────────────────────────────────── */}
      <div
        className="rounded-xl border overflow-hidden"
        style={{ background: "#050810", borderColor: solved ? "#166534" : "#1a2744" }}
        onClick={() => inputRef.current?.focus()}
      >
        {/* Fake window title bar with the classic three dots */}
        <div
          className="flex items-center gap-2 px-4 py-2 border-b"
          style={{ background: "#0d1421", borderColor: "#1a2744" }}
        >
          <span style={{ width: 11, height: 11, borderRadius: "50%", background: "#ff5f56" }} />
          <span style={{ width: 11, height: 11, borderRadius: "50%", background: "#ffbd2e" }} />
          <span style={{ width: 11, height: 11, borderRadius: "50%", background: "#27c93f" }} />
          <span style={{ color: "#3d4f6b", fontSize: "0.72rem", marginLeft: "0.5rem" }}>
            incident-4471 — investigation shell
          </span>
        </div>

        {/* Scrollback area */}
        <div
          ref={scrollRef}
          style={{ height: "340px", overflowY: "auto", padding: "1rem", fontSize: "0.82rem", lineHeight: 1.5 }}
        >
          {lines.map((l, i) => (
            <div
              key={i}
              style={{ color: toneColor[l.tone ?? "normal"], whiteSpace: "pre-wrap", wordBreak: "break-word" }}
            >
              {l.text}
            </div>
          ))}

          {/* Live input line (hidden once solved to signal completion) */}
          {!solved && (
            <div className="flex items-center" style={{ marginTop: "0.25rem" }}>
              <span style={{ color: "#00d4aa", flexShrink: 0 }}>analyst@northtech:~$&nbsp;</span>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                autoFocus
                spellCheck={false}
                aria-label="terminal command input"
                style={{
                  flex: 1,
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  color: "#c9d1d9",
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.82rem",
                }}
              />
            </div>
          )}
        </div>
      </div>

      <p style={{ color: "#3d4f6b", fontSize: "0.72rem" }}>
        Stuck? Type <span style={{ color: "#6b7fa3" }}>hint</span>. Everything above is fictional training data.
      </p>
    </div>
  );
}
