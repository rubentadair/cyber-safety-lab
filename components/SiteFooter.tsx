// components/SiteFooter.tsx
// No "use client" — purely presentational, server-rendered.

export default function SiteFooter() {
  return (
    <footer
      className="mt-16 border-t"
      style={{
        backgroundColor: "#0f1923",  /* deep navy */
        borderColor: "#1e2d3d",
        fontFamily: "var(--font-body)",
      }}
    >
      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* Two-column layout on desktop, stacked on mobile */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">

          {/* Left: brand */}
          <div>
            <p
              className="text-base font-semibold mb-1"
              style={{
                fontFamily: "var(--font-display)",
                color: "#e2e8f0",   /* slate-200 */
                fontSize: "1.1rem",
              }}
            >
              🛡️ Cyber Safety Lab
            </p>
            <p className="text-sm" style={{ color: "#64748b" /* slate-500 */ }}>
              Educational sandbox. Defensive only.
            </p>
          </div>

          {/* Right: privacy promise */}
          <div className="max-w-xs text-sm" style={{ color: "#64748b" }}>
            <p
              className="font-semibold mb-1"
              style={{ color: "#94a3b8" /* slate-400 */ }}
            >
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
          style={{
            borderColor: "#1e2d3d",
            color: "#475569", /* slate-600 */
          }}
        >
          All scenarios, names, links, and messages are fictional. This site
          teaches how to recognise and defend against threats — never how to
          carry them out.
        </div>
      </div>
    </footer>
  );
}
