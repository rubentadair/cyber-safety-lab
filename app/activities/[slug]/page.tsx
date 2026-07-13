// app/activities/[slug]/page.tsx
import type { Metadata }     from "next";
import { notFound }          from "next/navigation";
import Link                  from "next/link";
import { getActivityBySlug, activities } from "@/lib/activities";
import ActivityEngine        from "@/components/ActivityEngine";
import TerminalLab           from "@/components/TerminalLab";
import PasswordCrackerLab    from "@/components/PasswordCrackerLab";
import WebVulnLab            from "@/components/WebVulnLab";
import CipherLab             from "@/components/CipherLab";
import PhishingInspector     from "@/components/PhishingInspector";
import RoomProgress          from "@/components/RoomProgress";

export async function generateStaticParams() {
  return activities.map((a) => ({ slug: a.slug }));
}

// NEW: per-room metadata. Next.js calls this at build time for every room
// (thanks to generateStaticParams above). The title we return here gets
// slotted into the layout's template, so the browser tab and Google show
// e.g. "Spot the Phish — Cyber Safety Lab" instead of the same generic
// title on all 11 pages. Better for bookmarks, sharing, and SEO.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const activity = getActivityBySlug(slug);
  if (!activity) return { title: "Room not found" };

  return {
    title: activity.title,
    description: activity.description,
    openGraph: {
      title: activity.title,
      description: activity.description,
    },
  };
}

const diffColor = { easy: "#22c55e", medium: "#eab308", hard: "#ef4444" } as const;
const kindLabel = { quiz: "QUIZ", terminal: "TERMINAL", "password-lab": "LAB", "web-vuln-lab": "HACK", "cipher-lab": "CIPHER", "phishing-lab": "INSPECT" } as const;
const kindColor = { quiz: "#3b82f6", terminal: "#00d4aa", "password-lab": "#f97316", "web-vuln-lab": "#ef4444", "cipher-lab": "#a78bfa", "phishing-lab": "#fbbf24" } as const;

export default async function ActivityPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const activity = getActivityBySlug(slug);
  if (!activity) notFound();

  const sorted   = [...activities].sort((a, b) => a.roomNumber - b.roomNumber);
  const idx      = sorted.findIndex((a) => a.slug === slug);
  const nextRoom = idx >= 0 && idx < sorted.length - 1 ? sorted[idx + 1] : null;

  const dc = diffColor[activity.difficulty];
  const kc = kindColor[activity.kind];
  const kl = kindLabel[activity.kind];

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)", fontFamily: "var(--font-body)" }}>
      <div className="max-w-3xl mx-auto px-5 py-12">
        <Link href="/" className="inline-flex items-center gap-1.5 mb-8 animate-fade-up"
          style={{ color: "#6b7fa3", fontSize: "0.85rem", textDecoration: "none", fontFamily: "var(--font-mono)" }}>
          ← All rooms
        </Link>
        <div className="mb-8 animate-fade-up delay-1">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span style={{ color: "#3d4f6b", fontFamily: "var(--font-mono)", fontSize: "0.8rem" }}>
              [{String(activity.roomNumber).padStart(2, "0")}]
            </span>
            <span style={{ color: kc, border: `1px solid ${kc}44`, background: `${kc}11`, fontFamily: "var(--font-mono)", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.08em", padding: "2px 8px", borderRadius: "4px" }}>{kl}</span>
            <span style={{ color: dc, border: `1px solid ${dc}44`, background: `${dc}11`, fontFamily: "var(--font-body)", fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.06em", padding: "2px 8px", borderRadius: "4px" }}>{activity.difficulty.toUpperCase()}</span>
          </div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.5rem, 4vw, 2rem)", color: "#e2e8f0", marginBottom: "0.5rem" }}>
            {activity.emoji} {activity.title}
          </h1>
          <p style={{ color: "#6b7fa3", lineHeight: 1.7, maxWidth: "560px" }}>
            {/* Every room now has a written intro (labs included), so we show
                it everywhere — the lab intros carry the "simulated & safe"
                framing pupils should read before they start. */}
            {activity.intro}
          </p>
        </div>
        <div className="mb-8" style={{ height: "1px", background: "#1a2744" }} />
        <div className="animate-fade-up delay-2">
          {activity.kind === "terminal"      ? <TerminalLab        activity={activity} /> :
           activity.kind === "password-lab"  ? <PasswordCrackerLab activity={activity} /> :
           activity.kind === "web-vuln-lab"  ? <WebVulnLab          activity={activity} /> :
           activity.kind === "cipher-lab"    ? <CipherLab           activity={activity} /> :
           activity.kind === "phishing-lab"  ? <PhishingInspector   activity={activity} /> :
                                               <ActivityEngine      activity={activity} />}
        </div>
        <RoomProgress currentSlug={slug} next={nextRoom ? { slug: nextRoom.slug, title: nextRoom.title, emoji: nextRoom.emoji, roomNumber: nextRoom.roomNumber } : null} />
      </div>
    </div>
  );
}
