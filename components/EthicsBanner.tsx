// components/EthicsBanner.tsx
// No "use client" — purely presentational, renders on the server (faster).

export default function EthicsBanner() {
  return (
    // A high-contrast amber strip pinned to the top of every page.
    // text-center keeps it balanced; border-b gives it a clean bottom edge.
    <div
      className="w-full text-sm text-center px-4 py-2.5 border-b"
      style={{
        backgroundColor: "#fffbeb",  /* amber-50 */
        color: "#92400e",            /* amber-800 */
        borderColor: "#fcd34d",      /* amber-300 */
        fontFamily: "var(--font-body)",
      }}
    >
      🛡️{" "}
      <span style={{ fontWeight: 600 }}>Responsible Use:</span> This is a
      sandbox for learning to <span style={{ fontWeight: 600 }}>defend</span>.
      All examples are fictional. Nothing here teaches real attacks.
    </div>
  );
}
