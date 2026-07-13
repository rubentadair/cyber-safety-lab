// components/RoomProgress.tsx
// Rendered at the bottom of every activity page.
// Handles "mark as complete" (stored in localStorage) and
// "next room" navigation.
//
// NEW: also listens for the "csl-progress-updated" event that
// ActivityEngine broadcasts when a quiz finishes. That means the
// moment you complete a quiz, this footer flips to "Room completed"
// automatically — no refresh, no manual click needed. The manual
// button still exists for the lab/terminal rooms, which don't have
// a natural "finished" moment.
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface NextRoom {
  slug: string;
  title: string;
  emoji: string;
  roomNumber: number;
}

export default function RoomProgress({
  currentSlug,
  next,
}: {
  currentSlug: string;
  next: NextRoom | null;
}) {
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    // Reads localStorage and updates state. Defined inside the effect so
    // it always sees the current `currentSlug`.
    function refresh() {
      try {
        const stored = localStorage.getItem("csl_progress");
        if (stored) {
          const slugs: string[] = JSON.parse(stored);
          setCompleted(slugs.includes(currentSlug));
        }
      } catch {}
    }

    // 1) Check once on mount (covers page loads and navigation)
    refresh();

    // 2) Re-check whenever ActivityEngine announces new progress.
    //    (The browser's built-in "storage" event only fires in OTHER
    //    tabs, so a custom event is needed for same-page updates.)
    window.addEventListener("csl-progress-updated", refresh);

    // 3) Clean up the listener when leaving the page — prevents leaks
    return () => window.removeEventListener("csl-progress-updated", refresh);
  }, [currentSlug]);

  function markComplete() {
    try {
      const stored = localStorage.getItem("csl_progress");
      const slugs: string[] = stored ? JSON.parse(stored) : [];
      if (!slugs.includes(currentSlug)) {
        slugs.push(currentSlug);
        localStorage.setItem("csl_progress", JSON.stringify(slugs));
      }
      setCompleted(true);
    } catch {}
  }

  return (
    <div
      className="mt-8 rounded-2xl border p-4"
      style={{ borderColor: "#1a2744", background: "#0d1421", fontFamily: "var(--font-body)" }}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        {/* Mark complete */}
        {completed ? (
          <div className="flex items-center gap-2">
            <span
              style={{
                width: "22px", height: "22px", borderRadius: "50%",
                background: "rgba(34,197,94,0.15)", border: "1px solid #22c55e",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#22c55e", fontSize: "12px", fontWeight: 700, flexShrink: 0,
              }}
            >
              ✓
            </span>
            <span style={{ color: "#22c55e", fontSize: "0.85rem", fontWeight: 600 }}>
              Room completed
            </span>
          </div>
        ) : (
          <button
            onClick={markComplete}
            style={{
              display: "flex", alignItems: "center", gap: "0.5rem",
              background: "transparent",
              border: "1px solid #1a2744",
              borderRadius: "0.5rem",
              padding: "0.45rem 0.9rem",
              color: "#6b7fa3",
              fontSize: "0.82rem",
              cursor: "pointer",
              fontFamily: "var(--font-body)",
              transition: "border-color 0.2s, color 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "#22c55e";
              (e.currentTarget as HTMLElement).style.color = "#22c55e";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "#1a2744";
              (e.currentTarget as HTMLElement).style.color = "#6b7fa3";
            }}
          >
            ○ Mark room as complete
          </button>
        )}

        {/* Next room link */}
        {next && (
          <Link
            href={`/activities/${next.slug}`}
            style={{
              display: "flex", alignItems: "center", gap: "0.5rem",
              background: "rgba(0,212,170,0.08)",
              border: "1px solid rgba(0,212,170,0.3)",
              borderRadius: "0.5rem",
              padding: "0.45rem 0.9rem",
              color: "#00d4aa",
              fontSize: "0.82rem",
              fontWeight: 600,
              textDecoration: "none",
              fontFamily: "var(--font-body)",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "rgba(0,212,170,0.15)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "rgba(0,212,170,0.08)";
            }}
          >
            <span>
              {next.emoji} Room {String(next.roomNumber).padStart(2, "0")}: {next.title}
            </span>
            <span aria-hidden>→</span>
          </Link>
        )}
      </div>
    </div>
  );
}
