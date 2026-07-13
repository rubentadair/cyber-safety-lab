// app/page.tsx
// The homepage. It reads the activities registry and generates cards
// automatically — add a new activity to the registry and it appears here
// with zero extra work.
//
// DARK THEME: this landing page now matches the dark "cyber terminal" look of
// the rooms, so the whole site is one cohesive dark experience.

import { activities } from "@/lib/activities";
import ActivityCard from "@/components/ActivityCard";

export default function HomePage() {
  return (
    // Outer wrapper: centred, padded, max-width for readability
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16" style={{ position: "relative", zIndex: 1 }}>

      {/* ── Hero section ────────────────────────────────────────────── */}
      <section className="text-center mb-16 animate-fade-up">

        {/* Shield badge above the headline */}
        <div
          className="inline-flex items-center justify-center w-16 h-16 rounded-2xl text-3xl mb-6"
          style={{
            backgroundColor: "#0d1421",  /* dark panel */
            boxShadow: "0 0 0 1px rgba(0,212,170,0.35), 0 8px 32px rgba(0,212,170,0.18)",
          }}
        >
          🛡️
        </div>

        {/* Main headline — uses the display font */}
        <h1
          className="text-4xl sm:text-5xl font-bold tracking-tight mb-4"
          style={{
            fontFamily: "var(--font-display)",
            color: "var(--color-text)",
            lineHeight: "1.15",
          }}
        >
          Cyber Safety Lab
        </h1>

        {/* Subtitle */}
        <p
          className="text-lg max-w-xl mx-auto"
          style={{ color: "var(--color-muted)", fontFamily: "var(--font-body)" }}
        >
          A hands-on sandbox where you learn to spot scams, build good habits,
          and think like a defender — all with safe, made-up examples.
        </p>

        {/* Pill badges — quick value props (dark, teal-tinted) */}
        <div className="mt-6 flex flex-wrap gap-2 justify-center">
          {["No login", "No tracking", "100% fictional", "Defensive only"].map((tag) => (
            <span
              key={tag}
              className="inline-block rounded-full px-3 py-1 text-xs font-medium border"
              style={{
                backgroundColor: "rgba(0,212,170,0.08)",
                borderColor: "rgba(0,212,170,0.30)",
                color: "#00d4aa",
                fontFamily: "var(--font-body)",
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </section>

      {/* ── Activities grid ──────────────────────────────────────────── */}
      <section>
        <h2
          className="text-sm font-semibold uppercase tracking-widest mb-6"
          style={{ color: "var(--color-muted)", fontFamily: "var(--font-body)" }}
        >
          Choose an activity
        </h2>

        {/*
          2-column grid on screens wider than 640 px (sm:).
          Each ActivityCard takes an index so it can stagger its fade-in.
        */}
        <div className="grid gap-4 sm:grid-cols-2">
          {activities.map((activity, i) => (
            <ActivityCard key={activity.slug} activity={activity} index={i} />
          ))}
        </div>
      </section>
    </div>
  );
}
