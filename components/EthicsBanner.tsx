// components/EthicsBanner.tsx
// A thin responsible-use notice pinned to the top of every page.
// Re-themed to DARK so it sits seamlessly on the navy site instead of
// flashing a bright strip across the top.

export default function EthicsBanner() {
  return (
    <div
      className="w-full text-sm text-center px-4 py-2.5 border-b"
      style={{
        backgroundColor: "#0a1120",      /* deep navy, a touch lighter than the page */
        color: "#8aa0bf",                /* muted slate for the body text */
        borderColor: "#1a2744",          /* same hairline border used across the site */
        fontFamily: "var(--font-body)",
      }}
    >
      <span aria-hidden style={{ marginRight: 4 }}>🛡️</span>
      <span style={{ fontWeight: 600, color: "#fbbf24" }}>Responsible Use:</span>{" "}
      This is a sandbox for learning to{" "}
      <span style={{ fontWeight: 600, color: "#00d4aa" }}>defend</span>. All
      examples are fictional. Nothing here teaches real attacks.
    </div>
  );
}
