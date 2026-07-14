"use client";

import { WorkflowHeader } from "@/components/workflow-header";
import { useWorkflow } from "@/lib/workflow/context";
import { useRouter } from "next/navigation";
import { useState } from "react";

const PLACEHOLDER =
  "Paste customer interviews, reviews, support tickets, or survey responses...";

const DEMO_FEEDBACK = `"The flight search filters are confusing. I can't find departures after 6pm without scrolling through dozens of results."

"I abandoned checkout twice because there was no way to split the payment with my travel group."

"Love the app, but trip discovery feels random. I wish recommendations matched how I actually travel."

"Booking for our family reunion was a nightmare — no group chat or shared itinerary once the trip was confirmed."

"The flexible dates feature never shows the cheapest weekends. I end up checking Google Flights anyway."`;

export default function Home() {
  const router = useRouter();
  const { feedback, setFeedback } = useWorkflow();
  const [error, setError] = useState<string | null>(null);

  function handleAnalyze() {
    if (!feedback.trim()) {
      setError("Please paste customer feedback before continuing.");
      return;
    }

    setError(null);
    router.push("/analysis");
  }

  function handleLoadDemoDataset() {
    setFeedback(DEMO_FEEDBACK);
    setError(null);
  }

  function handleFeedbackChange(value: string) {
    setFeedback(value);
    if (error && value.trim()) {
      setError(null);
    }
  }

  return (
    <div className="flex min-h-full flex-col bg-zinc-50 dark:bg-zinc-950">
      <WorkflowHeader step={1} />

      <main className="flex flex-1 flex-col px-6 py-20 sm:py-28">
        <div className="mx-auto flex w-full max-w-[720px] flex-col">
          <p className="mb-12 text-center text-sm text-zinc-500 dark:text-zinc-400">
            Paste customer feedback to identify themes, pain points, and product
            opportunities.
          </p>

          <div className="flex flex-1 flex-col">
            <textarea
              id="customer-feedback"
              value={feedback}
              onChange={(e) => handleFeedbackChange(e.target.value)}
              placeholder={PLACEHOLDER}
              aria-label="Customer feedback"
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? "feedback-error" : undefined}
              className="min-h-[420px] w-full flex-1 resize-y rounded-xl border border-zinc-200 bg-white px-5 py-4 text-sm leading-relaxed text-zinc-900 shadow-sm placeholder:text-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder:text-zinc-600 dark:focus:border-blue-500 dark:focus:ring-blue-500/20"
            />

            {error && (
              <p
                id="feedback-error"
                role="alert"
                className="mt-3 text-sm text-red-600 dark:text-red-400"
              >
                {error}
              </p>
            )}

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={handleLoadDemoDataset}
                className="inline-flex h-9 items-center justify-center rounded-lg px-3 text-sm text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-900/5 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 dark:focus:ring-zinc-50/5"
              >
                Load Demo Dataset
              </button>
              <button
                type="button"
                onClick={handleAnalyze}
                className="inline-flex h-9 items-center justify-center rounded-lg bg-zinc-900 px-4 text-sm font-medium text-white transition-colors hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 focus:ring-offset-zinc-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white dark:focus:ring-zinc-100 dark:focus:ring-offset-zinc-950"
              >
                Analyze Feedback
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
