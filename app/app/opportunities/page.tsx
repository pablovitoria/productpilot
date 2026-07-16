"use client";

import { WorkflowHeader } from "@/components/workflow-header";
import { useWorkflow } from "@/lib/workflow/context";
import { MOCK_OPPORTUNITIES } from "@/lib/workflow/opportunities";
import { getNextStepPath, getPreviousStepPath } from "@/lib/workflow/steps";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function OpportunitiesPage() {
  const router = useRouter();
  const {
    feedback,
    selectedOpportunityId,
    selectOpportunity,
    analysisComplete,
    workspace,
  } = useWorkflow();
  const [pendingId, setPendingId] = useState<string | null>(
    selectedOpportunityId,
  );
  const navigateAfterSelectRef = useRef(false);

  useEffect(() => {
    if (!feedback.trim()) {
      router.replace("/");
      return;
    }
    if (!analysisComplete) {
      router.replace("/analysis");
    }
  }, [feedback, analysisComplete, router]);

  useEffect(() => {
    if (!navigateAfterSelectRef.current || !pendingId) return;
    if (selectedOpportunityId !== pendingId || !workspace) return;

    navigateAfterSelectRef.current = false;
    const next = getNextStepPath("/opportunities");
    if (next) router.push(next);
  }, [pendingId, selectedOpportunityId, workspace, router]);

  function handleContinue() {
    if (!pendingId) return;

    const next = getNextStepPath("/opportunities");
    if (!next) return;

    if (pendingId === selectedOpportunityId && workspace) {
      router.push(next);
      return;
    }

    selectOpportunity(pendingId);
    navigateAfterSelectRef.current = true;
  }

  if (!feedback.trim() || !analysisComplete) {
    return null;
  }

  return (
    <div className="flex min-h-full flex-col bg-zinc-50 dark:bg-zinc-950">
      <WorkflowHeader
        step={3}
        backHref={getPreviousStepPath("/opportunities")}
      />

      <main className="flex flex-1 flex-col px-6 py-16 sm:py-20">
        <div className="mx-auto w-full max-w-[720px]">
          <p className="mb-10 text-center text-sm text-zinc-500 dark:text-zinc-400">
            Select one opportunity to evaluate further. These are hypotheses, not
            decisions.
          </p>

          <div className="space-y-3">
            {MOCK_OPPORTUNITIES.map((opportunity) => {
              const selected = pendingId === opportunity.id;

              return (
                <button
                  key={opportunity.id}
                  type="button"
                  onClick={() => setPendingId(opportunity.id)}
                  className={`w-full rounded-xl border p-5 text-left shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                    selected
                      ? "border-zinc-900 bg-white dark:border-zinc-100 dark:bg-zinc-900"
                      : "border-zinc-200 bg-white hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                      {opportunity.title}
                    </h2>
                    <span className="shrink-0 rounded bg-zinc-100 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                      {opportunity.confidence}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                    {opportunity.description}
                  </p>
                  <ul className="mt-3 space-y-1">
                    {opportunity.evidence.map((item) => (
                      <li
                        key={item}
                        className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-500"
                      >
                        · {item}
                      </li>
                    ))}
                  </ul>
                </button>
              );
            })}
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              disabled={!pendingId}
              onClick={handleContinue}
              className="inline-flex h-9 items-center justify-center rounded-lg bg-zinc-900 px-4 text-sm font-medium text-white transition-colors hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 focus:ring-offset-zinc-50 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white dark:focus:ring-zinc-100 dark:focus:ring-offset-zinc-950"
            >
              Select Opportunity
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
