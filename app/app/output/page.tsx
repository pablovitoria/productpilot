"use client";

import { WorkflowHeader } from "@/components/workflow-header";
import { useWorkflow } from "@/lib/workflow/context";
import {
  generateOutputPreview,
  OUTPUT_OPTIONS,
  type OutputType,
} from "@/lib/workflow/output";
import { getPreviousStepPath } from "@/lib/workflow/steps";
import { canContinueFromChallenge } from "@/lib/workflow/challenge";
import { canContinueFromWorkspace } from "@/lib/workflow/workspace";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export default function OutputPage() {
  const router = useRouter();
  const {
    selectedOpportunity,
    workspace,
    challengeDecisions,
    challengeReviewed,
    selectedOutputType,
    setSelectedOutputType,
    resetWorkflow,
  } = useWorkflow();
  const [copied, setCopied] = useState(false);
  const [exportMessage, setExportMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedOpportunity || !workspace) {
      router.replace("/opportunities");
      return;
    }
    if (!canContinueFromWorkspace(workspace)) {
      router.replace("/workspace");
      return;
    }
    if (!challengeReviewed || !canContinueFromChallenge(challengeDecisions)) {
      router.replace("/challenge");
    }
  }, [
    selectedOpportunity,
    workspace,
    challengeReviewed,
    challengeDecisions,
    router,
  ]);

  const preview = useMemo(() => {
    if (!selectedOpportunity || !workspace || !selectedOutputType) return "";
    return generateOutputPreview({
      outputType: selectedOutputType,
      opportunity: selectedOpportunity,
      workspace,
      challengeDecisions,
    });
  }, [
    selectedOpportunity,
    workspace,
    selectedOutputType,
    challengeDecisions,
  ]);

  if (
    !selectedOpportunity ||
    !workspace ||
    !challengeReviewed ||
    !canContinueFromChallenge(challengeDecisions)
  ) {
    return null;
  }

  async function handleCopy() {
    if (!preview) return;
    try {
      await navigator.clipboard.writeText(preview);
      setCopied(true);
      setExportMessage(null);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setExportMessage("Copy failed. Select the preview text manually.");
    }
  }

  function handleExport(format: "Markdown" | "PDF" | "Notion") {
    setCopied(false);
    setExportMessage(
      `${format} export is mocked in this MVP. Use Copy to take the artifact with you.`,
    );
  }

  function handleStartNew() {
    resetWorkflow();
    router.replace("/");
  }

  function handleSelect(outputType: OutputType) {
    setSelectedOutputType(outputType);
    setCopied(false);
    setExportMessage(null);
  }

  return (
    <div className="flex min-h-full flex-col bg-zinc-50 dark:bg-zinc-950">
      <WorkflowHeader step={6} backHref={getPreviousStepPath("/output")} />

      <main className="flex flex-1 flex-col px-6 py-16 sm:py-20">
        <div className="mx-auto w-full max-w-[720px]">
          <p className="mb-10 text-center text-sm text-zinc-500 dark:text-zinc-400">
            Choose the artifact that best supports the next stage of the product
            lifecycle.
          </p>

          <div className="space-y-3">
            {OUTPUT_OPTIONS.map((option) => {
              const selected = selectedOutputType === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => handleSelect(option.id)}
                  className={`w-full rounded-xl border p-5 text-left shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                    selected
                      ? "border-zinc-900 bg-white dark:border-zinc-100 dark:bg-zinc-900"
                      : "border-zinc-200 bg-white hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
                  }`}
                >
                  <h2 className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                    {option.title}
                  </h2>
                  <p className="mt-1 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                    {option.description}
                  </p>
                </button>
              );
            })}
          </div>

          {selectedOutputType && (
            <div className="mt-6 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-medium uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
                  Preview
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="inline-flex h-8 items-center justify-center rounded-lg border border-zinc-200 px-3 text-xs text-zinc-600 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                  >
                    {copied ? "Copied" : "Copy"}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleExport("Markdown")}
                    className="inline-flex h-8 items-center justify-center rounded-lg border border-zinc-200 px-3 text-xs text-zinc-600 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                  >
                    Export Markdown
                  </button>
                  <button
                    type="button"
                    onClick={() => handleExport("PDF")}
                    className="inline-flex h-8 items-center justify-center rounded-lg border border-zinc-200 px-3 text-xs text-zinc-600 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                  >
                    Export PDF
                  </button>
                  <button
                    type="button"
                    onClick={() => handleExport("Notion")}
                    className="inline-flex h-8 items-center justify-center rounded-lg border border-zinc-200 px-3 text-xs text-zinc-600 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                  >
                    Export Notion
                  </button>
                </div>
              </div>
              {exportMessage && (
                <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-400">
                  {exportMessage}
                </p>
              )}
              <pre className="mt-4 max-h-[480px] overflow-auto whitespace-pre-wrap rounded-lg border border-zinc-100 bg-zinc-50 p-4 text-xs leading-relaxed text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300">
                {preview}
              </pre>
            </div>
          )}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={handleStartNew}
              className="inline-flex h-9 items-center justify-center rounded-lg px-3 text-sm text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-900/5 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
            >
              Start New Workflow
            </button>
            <button
              type="button"
              disabled={!selectedOutputType}
              onClick={handleStartNew}
              className="inline-flex h-9 items-center justify-center rounded-lg bg-zinc-900 px-4 text-sm font-medium text-white transition-colors hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 focus:ring-offset-zinc-50 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white dark:focus:ring-zinc-100 dark:focus:ring-offset-zinc-950"
            >
              Finish
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
