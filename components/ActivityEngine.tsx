// components/ActivityEngine.tsx
"use client";

import { useState } from "react";
import { Activity } from "@/lib/activities/types";

/*
 * NEW IN THIS VERSION — automatic progress + personal bests:
 *
 * 1. When a quiz is finished, the room is AUTOMATICALLY added to the
 *    same "csl_progress" localStorage list that RoomsGrid (homepage)
 *    and RoomProgress (page footer) already read. No more needing to
 *    click "Mark room as complete" after a quiz.
 *
 * 2. Best scores are stored in a second key, "csl_scores", shaped like:
 *      { "spot-the-phish": { score: 7, total: 8 }, ... }
 *    We only overwrite when the new score is HIGHER — so replaying can
 *    never lose a personal best.
 *
 * 3. localStorage writes don't notify other components on the SAME page
 *    (the browser's "storage" event only fires in OTHER tabs). So after
 *    saving we broadcast a custom window event, "csl-progress-updated",
 *    which RoomProgress listens for — its footer flips to "Room completed"
 *    the instant you finish, with no page refresh.
 */

// Shape of one entry in the csl_scores map
interface BestScore {
  score: number;
  total: number;
}

export default function ActivityEngine({ activity }: { activity: Activity }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedId, setSelectedId]     = useState<string | null>(null);
  const [revealed, setRevealed]         = useState(false);
  const [score, setScore]               = useState(0);
  const [finished, setFinished]         = useState(false);

  // Personal-best state, filled in when the quiz finishes
  const [best, setBest]           = useState<BestScore | null>(null);
  const [newRecord, setNewRecord] = useState(false);

  const questions      = activity.questions ?? [];
  const totalQuestions = questions.length;
  const question       = questions[currentIndex];

  /**
   * Persist results when the quiz ends:
   *  - add this room's slug to csl_progress (if not already there)
   *  - update csl_scores if this run beats the stored best
   *  - broadcast the change so RoomProgress updates immediately
   * Everything is wrapped in try/catch because localStorage can be
   * unavailable (private browsing, strict settings) — the quiz should
   * still work perfectly, it just won't remember.
   */
  function saveResult(finalScore: number) {
    try {
      // 1) Mark the room complete (same key RoomsGrid/RoomProgress use)
      const stored = localStorage.getItem("csl_progress");
      const slugs: string[] = stored ? JSON.parse(stored) : [];
      if (!slugs.includes(activity.slug)) {
        slugs.push(activity.slug);
        localStorage.setItem("csl_progress", JSON.stringify(slugs));
      }

      // 2) Update the best-score map if this run is a new record
      const scoresRaw = localStorage.getItem("csl_scores");
      const scores: Record<string, BestScore> = scoresRaw ? JSON.parse(scoresRaw) : {};
      const previous = scores[activity.slug];
      const isRecord = !previous || finalScore > previous.score;

      if (isRecord) {
        scores[activity.slug] = { score: finalScore, total: totalQuestions };
        localStorage.setItem("csl_scores", JSON.stringify(scores));
      }

      // 3) Remember what to show on the summary screen
      setBest(isRecord ? { score: finalScore, total: totalQuestions } : previous);
      setNewRecord(isRecord);

      // 4) Tell same-page listeners (RoomProgress) that progress changed
      window.dispatchEvent(new Event("csl-progress-updated"));
    } catch {
      // localStorage unavailable — fail silently, quiz still works
    }
  }

  function handleSelect(optionId: string) {
    if (revealed) return;
    setSelectedId(optionId);
    setRevealed(true);
    if (optionId === question.correctOptionId) setScore((p) => p + 1);
  }

  function handleNext() {
    if (currentIndex + 1 < totalQuestions) {
      setCurrentIndex((p) => p + 1);
      setSelectedId(null);
      setRevealed(false);
    } else {
      // Quiz over — `score` already includes the final answer because
      // handleSelect incremented it before this button could be clicked.
      saveResult(score);
      setFinished(true);
    }
  }

  function handleRestart() {
    setCurrentIndex(0);
    setSelectedId(null);
    setRevealed(false);
    setScore(0);
    setFinished(false);
    setNewRecord(false);
    // Note: we deliberately do NOT clear saved progress or bests here —
    // replaying is review mode, records stay safe.
  }

  // ── Summary screen ────────────────────────────────────────────────────
  if (finished) {
    const perfect = score === totalQuestions;
    return (
      <div
        className="rounded-2xl border p-8 text-center animate-fade-up"
        style={{
          background: "#0d1421",
          borderColor: "#1a2744",
          fontFamily: "var(--font-body)",
        }}
      >
        <div className="text-5xl mb-4">{perfect ? "🏆" : "🎯"}</div>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            color: "#e2e8f0",
            fontSize: "1.5rem",
            marginBottom: "0.5rem",
          }}
        >
          Quiz complete!
        </h2>
        <p style={{ color: "#6b7fa3" }}>
          You scored{" "}
          <span style={{ color: "#00d4aa", fontWeight: 700 }}>
            {score}&thinsp;/&thinsp;{totalQuestions}
          </span>
        </p>

        {/* Personal best line — shows the record, and celebrates a new one */}
        {best && (
          <p
            style={{
              color: newRecord ? "#fbbf24" : "#6b7fa3",
              fontSize: "0.85rem",
              marginTop: "0.5rem",
              fontFamily: "var(--font-mono)",
            }}
          >
            {newRecord
              ? `🎉 New personal best: ${best.score}/${best.total}`
              : `Personal best: ${best.score}/${best.total}`}
          </p>
        )}

        <p
          style={{
            color: "#6b7fa3",
            fontSize: "0.9rem",
            marginTop: "0.75rem",
            maxWidth: "280px",
            margin: "0.75rem auto 0",
          }}
        >
          {perfect
            ? "Perfect — sharp eyes! 👏"
            : "Nice work. Re-read the explanations on any you missed, then try again."}
        </p>
        <button
          onClick={handleRestart}
          style={{
            marginTop: "2rem",
            background: "#00d4aa",
            color: "#050810",
            fontFamily: "var(--font-body)",
            fontWeight: 700,
            padding: "0.6rem 1.5rem",
            borderRadius: "0.6rem",
            border: "none",
            cursor: "pointer",
            fontSize: "0.9rem",
          }}
        >
          Play again
        </button>
      </div>
    );
  }

  const isCorrect = selectedId === question.correctOptionId;

  // ── Active question ───────────────────────────────────────────────────
  return (
    <div
      className="rounded-2xl border overflow-hidden animate-fade-up"
      style={{
        background: "#0d1421",
        borderColor: "#1a2744",
        fontFamily: "var(--font-body)",
      }}
    >
      {/* Progress bar */}
      <div style={{ height: "3px", background: "#1a2744" }}>
        <div
          style={{
            height: "3px",
            width: `${(currentIndex / totalQuestions) * 100}%`,
            background: "#00d4aa",
            transition: "width 0.4s ease",
          }}
        />
      </div>

      <div className="p-6 sm:p-8">
        {/* Counter */}
        <p
          style={{
            color: "#3d4f6b",
            fontSize: "0.75rem",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            marginBottom: "1rem",
          }}
        >
          Question {currentIndex + 1} / {totalQuestions}
        </p>

        {/* Scenario box */}
        {question.scenario && (
          <div
            className="rounded-xl p-4 mb-5 text-sm border"
            style={{
              background: "#111927",
              borderColor: "#1a2744",
              borderLeft: "3px solid #00d4aa",
              fontFamily: "var(--font-mono)",
            }}
          >
            {question.scenario.from && (
              <p style={{ color: "#6b7fa3", marginBottom: "2px" }}>
                <span style={{ color: "#e2e8f0", fontWeight: 600 }}>From: </span>
                {question.scenario.from}
              </p>
            )}
            {question.scenario.subject && (
              <p style={{ color: "#6b7fa3", marginBottom: "2px" }}>
                <span style={{ color: "#e2e8f0", fontWeight: 600 }}>Subject: </span>
                {question.scenario.subject}
              </p>
            )}
            <p
              style={{
                color: "#c9d1d9",
                marginTop: question.scenario.from || question.scenario.subject ? "0.5rem" : 0,
                whiteSpace: "pre-line",
              }}
            >
              {question.scenario.body}
            </p>
          </div>
        )}

        {/* Prompt */}
        <h2
          style={{
            color: "#e2e8f0",
            fontFamily: "var(--font-display)",
            fontSize: "1.15rem",
            marginBottom: "1.25rem",
          }}
        >
          {question.prompt}
        </h2>

        {/* Options */}
        <div className="space-y-3">
          {question.options.map((option) => {
            let bg      = "#111927";
            let border  = "#1a2744";
            let color   = "#c9d1d9";
            let opacity = "1";

            if (revealed) {
              if (option.id === question.correctOptionId) {
                bg = "rgba(34,197,94,0.1)"; border = "#166534"; color = "#86efac";
              } else if (option.id === selectedId) {
                bg = "rgba(239,68,68,0.1)";  border = "#7f1d1d"; color = "#fca5a5";
              } else {
                opacity = "0.4";
              }
            }

            return (
              <button
                key={option.id}
                onClick={() => handleSelect(option.id)}
                disabled={revealed}
                style={{
                  width: "100%",
                  textAlign: "left",
                  background: bg,
                  border: `1px solid ${border}`,
                  borderRadius: "0.75rem",
                  padding: "0.85rem 1rem",
                  color,
                  opacity,
                  cursor: revealed ? "default" : "pointer",
                  fontFamily: "var(--font-body)",
                  fontSize: "0.9rem",
                  transition: "all 0.15s ease",
                }}
              >
                {option.label}
              </button>
            );
          })}
        </div>

        {/* Feedback */}
        {revealed && (
          <div
            className="mt-5 rounded-xl border p-4 text-sm animate-fade-up"
            style={{
              background: isCorrect ? "rgba(34,197,94,0.07)" : "rgba(251,191,36,0.07)",
              borderColor: isCorrect ? "#166534" : "#854d0e",
              color: isCorrect ? "#86efac" : "#fcd34d",
              fontFamily: "var(--font-body)",
            }}
          >
            <p style={{ fontWeight: 700, marginBottom: "0.4rem" }}>
              {isCorrect ? "✅ Correct!" : "🤔 Not quite — here's why:"}
            </p>
            <p style={{ lineHeight: 1.6, opacity: 0.9 }}>{question.explanation}</p>
          </div>
        )}

        {/* Next button */}
        {revealed && (
          <button
            onClick={handleNext}
            className="animate-fade-up"
            style={{
              marginTop: "1.5rem",
              background: "#00d4aa",
              color: "#050810",
              fontFamily: "var(--font-body)",
              fontWeight: 700,
              padding: "0.65rem 1.5rem",
              borderRadius: "0.75rem",
              border: "none",
              cursor: "pointer",
              fontSize: "0.9rem",
            }}
          >
            {currentIndex + 1 < totalQuestions ? "Next question →" : "See results"}
          </button>
        )}
      </div>
    </div>
  );
}
