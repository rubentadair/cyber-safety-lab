// components/ActivityCard.tsx
// A clickable card on the homepage representing one activity.
// Link wraps the whole card so the full area is clickable.
//
// This must be a Client Component: it uses onMouseEnter/onMouseLeave for the
// hover lift effect, and in React 19 / Next 16 any component that passes event
// handlers has to run on the client. Without "use client" the homepage fails
// to build ("Event handlers cannot be passed to Client Component props").
//
// DARK THEME: the card now matches the dark room UI, and shows the room number,
// type and difficulty badges so the homepage feels connected to the rooms.
"use client";

import Link from "next/link";
import { Activity } from "@/lib/activities/types";

// Colour maps for the little badges (same palette the room pages use).
const diffColor: Record<string, string> = { easy: "#22c55e", medium: "#eab308", hard: "#ef4444" };
const kindColor: Record<string, string> = {
  quiz: "#3b82f6", terminal: "#00d4aa", "password-lab": "#f97316",
  "web-vuln-lab": "#ef4444", "cipher-lab": "#a78bfa", "phishing-lab": "#fbbf24",
};
const kindLabel: Record<string, string> = {
  quiz: "QUIZ", terminal: "TERMINAL", "password-lab": "LAB",
  "web-vuln-lab": "HACK", "cipher-lab": "CIPHER", "phishing-lab": "INSPECT",
};

export default function ActivityCard({
  activity,
  index,                // used to stagger the fade-in animation
}: {
  activity: Activity;
  index: number;
}) {
  // Maps index → the delay CSS class defined in globals.css
  const delayClass = `delay-${Math.min(index + 1, 6)}`;

  const kc = kindColor[activity.kind] ?? "#3b82f6";
  const dc = diffColor[activity.difficulty] ?? "#22c55e";
  const kl = kindLabel[activity.kind] ?? "ROOM";

  return (
    <Link
      href={`/activities/${activity.slug}`}
      // animate-fade-up + delay class creates a staggered entrance on page load
      className={`group block rounded-2xl border p-6 animate-fade-up ${delayClass}`}
      style={{
        backgroundColor: "#0d1421",           /* dark panel */
        borderColor: "var(--color-border)",
        fontFamily: "var(--font-body)",
        transition: "box-shadow 0.2s ease, border-color 0.2s ease, transform 0.2s ease",
      }}
      // Inline hover: teal glow + subtle lift
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.boxShadow = "0 8px 30px rgba(0,212,170,0.15)";
        el.style.borderColor = "var(--color-accent)";
        el.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.boxShadow = "";
        el.style.borderColor = "var(--color-border)";
        el.style.transform = "";
      }}
    >
      {/* Top row: emoji badge on the left, room number on the right */}
      <div className="flex items-start justify-between mb-4">
        <div
          className="inline-flex items-center justify-center w-12 h-12 rounded-xl text-2xl"
          style={{ backgroundColor: "#111927" }}
        >
          {activity.emoji}
        </div>
        <span
          style={{
            color: "var(--color-dim)",
            fontFamily: "var(--font-mono)",
            fontSize: "0.8rem",
            marginTop: "0.25rem",
          }}
        >
          [{String(activity.roomNumber).padStart(2, "0")}]
        </span>
      </div>

      {/* Type + difficulty badges */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span
          style={{
            color: kc, border: `1px solid ${kc}44`, background: `${kc}11`,
            fontFamily: "var(--font-mono)", fontSize: "0.6rem", fontWeight: 700,
            letterSpacing: "0.08em", padding: "2px 7px", borderRadius: "4px",
          }}
        >
          {kl}
        </span>
        <span
          style={{
            color: dc, border: `1px solid ${dc}44`, background: `${dc}11`,
            fontFamily: "var(--font-body)", fontSize: "0.6rem", fontWeight: 600,
            letterSpacing: "0.06em", padding: "2px 7px", borderRadius: "4px",
          }}
        >
          {activity.difficulty.toUpperCase()}
        </span>
      </div>

      {/* Title */}
      <h3
        className="text-lg font-semibold mb-1"
        style={{
          fontFamily: "var(--font-display)",
          color: "var(--color-text)",
          fontSize: "1.15rem",
        }}
      >
        {activity.title}
      </h3>

      {/* Description */}
      <p className="text-sm" style={{ color: "var(--color-muted)" }}>
        {activity.description}
      </p>

      {/* CTA row */}
      <div
        className="mt-5 flex items-center gap-1 text-sm font-medium"
        style={{ color: "var(--color-accent)" }}
      >
        Start
        {/* Arrow shifts right slightly on hover via the group class */}
        <span
          className="transition-transform"
          style={{ display: "inline-block" }}
          aria-hidden
        >
          →
        </span>
      </div>
    </Link>
  );
}
