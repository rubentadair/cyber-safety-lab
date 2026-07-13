// components/ActivityCard.tsx
// A clickable card on the homepage representing one activity.
// Link wraps the whole card so the full area is clickable.

import Link from "next/link";
import { Activity } from "@/lib/activities/types";

export default function ActivityCard({
  activity,
  index,                // used to stagger the fade-in animation
}: {
  activity: Activity;
  index: number;
}) {
  // Maps index → the delay CSS class defined in globals.css
  const delayClass = `delay-${Math.min(index + 1, 6)}`;

  return (
    <Link
      href={`/activities/${activity.slug}`}
      // animate-fade-up + delay class creates a staggered entrance on page load
      className={`group block rounded-2xl border bg-white p-6 shadow-sm animate-fade-up ${delayClass}`}
      style={{
        borderColor: "var(--color-border)",
        fontFamily: "var(--font-body)",
        transition: "box-shadow 0.2s ease, border-color 0.2s ease, transform 0.2s ease",
      }}
      // Inline hover handled via CSS custom properties isn't possible in pure
      // inline styles, so we layer a data attribute for JS-free hover.
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.boxShadow = "0 8px 30px rgba(14,165,233,0.12)";
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
      {/* Emoji badge */}
      <div
        className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 text-2xl"
        style={{ backgroundColor: "#f0f9ff" /* sky-50 */ }}
      >
        {activity.emoji}
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
