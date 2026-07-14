"use client";

import { WorkflowHeader } from "@/components/workflow-header";
import {
  type AnalysisCardId,
  type AnalysisState,
  type SentimentData,
} from "@/lib/workflow/analysis";
import { useWorkflow } from "@/lib/workflow/context";
import { getNextStepPath, getPreviousStepPath } from "@/lib/workflow/steps";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";

type TransparencyInfo = {
  method: string;
  signals: string[];
  confidence: string;
};

const AI_REMINDER =
  "This synthesis is AI-generated. Review and edit before using it in product decisions.";

const TRANSPARENCY: Record<AnalysisCardId, TransparencyInfo> = {
  themes: {
    method:
      "Clustered recurring topics from customer feedback using keyword frequency and semantic grouping.",
    signals: [
      "Repeated mentions of search, checkout, and discovery",
      "Cross-source theme overlap across reviews and support-style notes",
      "Topic co-occurrence in multi-issue feedback entries",
    ],
    confidence: "Medium-High",
  },
  painPoints: {
    method:
      "Extracted specific friction statements and mapped them to the most frequently cited user problems.",
    signals: [
      "Explicit complaint language and abandonment references",
      "Feature-specific mentions (filters, split payment, flexible dates)",
      "Severity cues such as repeated attempts or workarounds",
    ],
    confidence: "High",
  },
  customerQuotes: {
    method:
      "Selected representative verbatim quotes that best illustrate each major theme and pain point.",
    signals: [
      "Quote clarity and specificity",
      "Coverage across themes (search, checkout, discovery, groups)",
      "Direct customer voice without paraphrasing",
    ],
    confidence: "High",
  },
  sentiment: {
    method:
      "Estimated overall tone from emotional language, satisfaction markers, and negative/positive phrasing.",
    signals: [
      "Frustration and abandonment language",
      "Mixed praise with qualified complaints",
      "Comparative dissatisfaction (e.g. switching to Google Flights)",
    ],
    confidence: "Medium",
  },
  emergingPatterns: {
    method:
      "Identified cross-cutting patterns that appear in multiple feedback items but may not map to a single feature area.",
    signals: [
      "Repeated comparison behavior to external products",
      "Group travel issues spanning multiple workflow stages",
      "Distinction between discovery and search problems",
    ],
    confidence: "Medium",
  },
};

function serializeList(items: string[]) {
  return items.join("\n");
}

function parseList(text: string) {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function serializeQuotes(quotes: { quote: string }[]) {
  return quotes.map((item) => item.quote).join("\n\n");
}

function parseQuotes(text: string) {
  return text
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((quote) => ({ quote }));
}

function serializeSentiment(sentiment: SentimentData) {
  const breakdown = sentiment.breakdown
    .map((item) => `${item.label}: ${item.percentage}%`)
    .join("\n");

  return `Overall: ${sentiment.overall}\n\n${breakdown}\n\nNote: ${sentiment.note}`;
}

function parseSentiment(text: string): SentimentData {
  const sections = text.split(/\n\s*\n/);
  const overallLine = sections[0]?.replace(/^Overall:\s*/i, "").trim() ?? "";
  const noteSection = sections.find((section) =>
    section.trim().toLowerCase().startsWith("note:"),
  );
  const note = noteSection?.replace(/^Note:\s*/i, "").trim() ?? "";

  const breakdownSection =
    sections.find(
      (section) =>
        !section.trim().toLowerCase().startsWith("overall:") &&
        !section.trim().toLowerCase().startsWith("note:"),
    ) ?? "";

  const breakdown = breakdownSection
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const match = line.match(/^(.+?):\s*(\d+)%?$/);
      if (!match) return null;
      return { label: match[1].trim(), percentage: Number(match[2]) };
    })
    .filter((item): item is { label: string; percentage: number } => item !== null);

  return {
    overall: overallLine,
    breakdown,
    note,
  };
}

function serializeCard(cardId: AnalysisCardId, analysis: AnalysisState) {
  switch (cardId) {
    case "themes":
    case "painPoints":
    case "emergingPatterns":
      return serializeList(analysis[cardId]);
    case "customerQuotes":
      return serializeQuotes(analysis.customerQuotes);
    case "sentiment":
      return serializeSentiment(analysis.sentiment);
  }
}

function parseCard(
  cardId: AnalysisCardId,
  text: string,
  analysis: AnalysisState,
): AnalysisState {
  switch (cardId) {
    case "themes":
      return { ...analysis, themes: parseList(text) };
    case "painPoints":
      return { ...analysis, painPoints: parseList(text) };
    case "emergingPatterns":
      return { ...analysis, emergingPatterns: parseList(text) };
    case "customerQuotes":
      return { ...analysis, customerQuotes: parseQuotes(text) };
    case "sentiment":
      return { ...analysis, sentiment: parseSentiment(text) };
  }
}

function InfoIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5" aria-hidden>
      <circle cx="8" cy="8" r="6.25" stroke="currentColor" strokeWidth="1.25" />
      <path
        d="M8 7.25V11"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
      <circle cx="8" cy="5" r="0.75" fill="currentColor" />
    </svg>
  );
}

function EditableAnalysisCard({
  title,
  cardId,
  analysis,
  onSave,
  isEdited,
}: {
  title: string;
  cardId: AnalysisCardId;
  analysis: AnalysisState;
  onSave: (cardId: AnalysisCardId, text: string) => void;
  isEdited: boolean;
}) {
  const panelId = useId();
  const [showTransparency, setShowTransparency] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const cardRef = useRef<HTMLDivElement>(null);

  const transparency = TRANSPARENCY[cardId];

  useEffect(() => {
    if (!showTransparency) return;

    function handleClickOutside(event: MouseEvent) {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        setShowTransparency(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showTransparency]);

  function startEditing() {
    setDraft(serializeCard(cardId, analysis));
    setIsEditing(true);
    setShowTransparency(false);
  }

  function cancelEditing() {
    setIsEditing(false);
    setDraft("");
  }

  function saveEditing() {
    onSave(cardId, draft);
    setIsEditing(false);
    setDraft("");
  }

  return (
    <div
      ref={cardRef}
      className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
            {title}
          </h2>
          {isEdited && (
            <span className="rounded bg-zinc-100 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
              Edited
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {!isEditing && (
            <>
              <button
                type="button"
                aria-expanded={showTransparency}
                aria-controls={panelId}
                aria-label={`How ${title} was generated`}
                onClick={() => setShowTransparency((open) => !open)}
                className="inline-flex h-7 w-7 items-center justify-center rounded-md text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
              >
                <InfoIcon />
              </button>
              <button
                type="button"
                onClick={startEditing}
                className="inline-flex h-7 items-center justify-center rounded-md px-2 text-xs text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-900/5 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
              >
                Edit
              </button>
            </>
          )}
        </div>
      </div>

      {showTransparency && !isEditing && (
        <div
          id={panelId}
          className="mt-4 rounded-lg border border-zinc-100 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950/60"
        >
          <dl className="space-y-3 text-xs">
            <div>
              <dt className="font-medium text-zinc-500 dark:text-zinc-400">
                How this was generated
              </dt>
              <dd className="mt-1 leading-relaxed text-zinc-600 dark:text-zinc-400">
                {transparency.method}
              </dd>
            </div>
            <div>
              <dt className="font-medium text-zinc-500 dark:text-zinc-400">
                Signals used
              </dt>
              <dd className="mt-1">
                <ul className="space-y-1 leading-relaxed text-zinc-600 dark:text-zinc-400">
                  {transparency.signals.map((signal) => (
                    <li key={signal}>· {signal}</li>
                  ))}
                </ul>
              </dd>
            </div>
            <div>
              <dt className="font-medium text-zinc-500 dark:text-zinc-400">
                Confidence
              </dt>
              <dd className="mt-1 text-zinc-600 dark:text-zinc-400">
                {transparency.confidence}
              </dd>
            </div>
          </dl>
          <p className="mt-3 border-t border-zinc-200 pt-3 text-xs leading-relaxed text-zinc-500 dark:border-zinc-800 dark:text-zinc-500">
            {AI_REMINDER}
          </p>
        </div>
      )}

      <div className="mt-3">
        {isEditing ? (
          <div className="space-y-3">
            <textarea
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              rows={cardId === "sentiment" ? 10 : 8}
              className="w-full resize-y rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm leading-relaxed text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={cancelEditing}
                className="inline-flex h-8 items-center justify-center rounded-lg px-3 text-xs text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveEditing}
                className="inline-flex h-8 items-center justify-center rounded-lg bg-zinc-900 px-3 text-xs font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <CardContent cardId={cardId} analysis={analysis} />
        )}
      </div>
    </div>
  );
}

function CardContent({
  cardId,
  analysis,
}: {
  cardId: AnalysisCardId;
  analysis: AnalysisState;
}) {
  switch (cardId) {
    case "themes":
      return (
        <ul className="space-y-2">
          {analysis.themes.map((theme) => (
            <li key={theme} className="text-sm text-zinc-600 dark:text-zinc-400">
              {theme}
            </li>
          ))}
        </ul>
      );
    case "painPoints":
      return (
        <ul className="space-y-2">
          {analysis.painPoints.map((point) => (
            <li
              key={point}
              className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400"
            >
              {point}
            </li>
          ))}
        </ul>
      );
    case "customerQuotes":
      return (
        <ul className="space-y-3">
          {analysis.customerQuotes.map((item) => (
            <li
              key={item.quote.slice(0, 48)}
              className="border-l-2 border-zinc-200 pl-3 text-sm leading-relaxed text-zinc-600 dark:border-zinc-700 dark:text-zinc-400"
            >
              {item.quote}
            </li>
          ))}
        </ul>
      );
    case "sentiment":
      return (
        <>
          <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            {analysis.sentiment.overall}
          </p>
          <ul className="mt-3 space-y-1.5">
            {analysis.sentiment.breakdown.map((item) => (
              <li
                key={item.label}
                className="flex items-center justify-between text-sm text-zinc-600 dark:text-zinc-400"
              >
                <span>{item.label}</span>
                <span className="tabular-nums text-zinc-400 dark:text-zinc-500">
                  {item.percentage}%
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-sm leading-relaxed text-zinc-500 dark:text-zinc-500">
            {analysis.sentiment.note}
          </p>
        </>
      );
    case "emergingPatterns":
      return (
        <ul className="space-y-2">
          {analysis.emergingPatterns.map((pattern) => (
            <li
              key={pattern}
              className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400"
            >
              {pattern}
            </li>
          ))}
        </ul>
      );
  }
}

export default function AnalysisPage() {
  const router = useRouter();
  const {
    analysis,
    setAnalysis,
    editedCards,
    setEditedCards,
    analysisComplete,
    completeAnalysis,
  } = useWorkflow();
  const isLoading = !analysisComplete;

  useEffect(() => {
    if (analysisComplete) return;

    const timer = setTimeout(() => {
      completeAnalysis();
    }, 900);

    return () => clearTimeout(timer);
  }, [analysisComplete, completeAnalysis]);

  function handleSaveCard(cardId: AnalysisCardId, text: string) {
    setAnalysis((current) => parseCard(cardId, text, current));
    setEditedCards((current) => ({ ...current, [cardId]: true }));
  }

  const cards: { id: AnalysisCardId; title: string }[] = [
    { id: "themes", title: "Themes" },
    { id: "painPoints", title: "Pain Points" },
    { id: "customerQuotes", title: "Customer Quotes" },
    { id: "sentiment", title: "Sentiment Overview" },
    { id: "emergingPatterns", title: "Emerging Patterns" },
  ];

  return (
    <div className="flex min-h-full flex-col bg-zinc-50 dark:bg-zinc-950">
      <WorkflowHeader step={2} backHref={getPreviousStepPath("/analysis")} />

      <main className="flex flex-1 flex-col px-6 py-16 sm:py-20">
        <div className="mx-auto w-full max-w-[720px]">
          <p className="mb-10 text-center text-sm text-zinc-500 dark:text-zinc-400">
            Review the synthesized feedback before evaluating opportunities.
          </p>

          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="h-32 animate-pulse rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
                />
              ))}
              <p className="pt-2 text-center text-sm text-zinc-400 dark:text-zinc-500">
                Analyzing feedback…
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {cards.map((card) => (
                  <EditableAnalysisCard
                    key={card.id}
                    cardId={card.id}
                    title={card.title}
                    analysis={analysis}
                    onSave={handleSaveCard}
                    isEdited={Boolean(editedCards[card.id])}
                  />
                ))}
              </div>

              <div className="mt-8 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                <p className="text-xs font-medium uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
                  Summary
                </p>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                  Customer feedback reveals recurring problem areas across search,
                  checkout, discovery, and group travel. The strongest signals point
                  to checkout abandonment and group coordination as high-intent pain
                  points.
                </p>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    const nextStep = getNextStepPath("/analysis");
                    if (nextStep) router.push(nextStep);
                  }}
                  className="inline-flex h-9 items-center justify-center rounded-lg bg-zinc-900 px-4 text-sm font-medium text-white transition-colors hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 focus:ring-offset-zinc-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white dark:focus:ring-zinc-100 dark:focus:ring-offset-zinc-950"
                >
                  Continue
                </button>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
