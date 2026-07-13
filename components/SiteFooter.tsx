// components/SiteFooter.tsx
// Server-rendered footer. Colours aligned to the site's dark palette so the
// footer blends into the page instead of being a different shade of navy.

export default function SiteFooter() {
  return (
    <footer
      className="mt-16 border-t"
      style={{
        backgroundColor: "#0a1120",   /* matches the banner */
        borderColor: "#1a2744",
        fontFamily: "var(--font-body)",
        position: "relative",
        zIndex: 1,
      }}
    >
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">

          {/* Left: brand */}
          <div>
            <p
              className="text-base font-semibold mb-1"
              style={{ fontFamily: "var(--font-display)", color: "#e2e8f0", fontSize: "1.1rem" }}
            >
              🛡️ Cyber Safety Lab
            </p>
            <p className="text-sm" style={{ color: "#6b7fa3" }}>
              Educational sandbox. Defensive only.
            </p>
          </div>

          {/* Right: privacy promise */}
          <div className="max-w-xs text-sm" style={{ color: "#6b7fa3" }}>
            <p className="font-semibold mb-1" style={{ color: "#8aa0bf" }}>
              Your privacy
            </p>
            <p>
              We collect nothing — no accounts, no logins, no tracking. Your
              answers stay in your browser and are never sent anywhere.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="mt-8 pt-6 border-t text-xs"
          style={{ borderColor: "#1a2744", color: "#475569" }}
        >
          All scenarios, names, links, and messages are fictional. This site
          teaches how to recognise and defend against threats — never how to
          carry them out.
        </div>
      </div>
    </footer>
  );
}
