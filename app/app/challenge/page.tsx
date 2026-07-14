"use client";

import { WorkflowHeader } from "@/components/workflow-header";
import {
  canContinueFromChallenge,
  getChallengeContinueBlockers,
  getMissingChallengeFields,
  MOCK_CHALLENGES,
} from "@/lib/workflow/challenge";
import { useWorkflow } from "@/lib/workflow/context";
import { getNextStepPath, getPreviousStepPath } from "@/lib/workflow/steps";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ChallengePage() {
  const router = useRouter();
  const {
    selectedOpportunity,
    workspace,
    challengeDecisions,
    setChallengeDecision,
    markChallengeReviewed,
  } = useWorkflow();
  const [showValidation, setShowValidation] = useState(false);

  useEffect(() => {
    if (!selectedOpportunity || !workspace) {
      router.replace("/opportunities");
    }
  }, [selectedOpportunity, workspace, router]);

  if (!selectedOpportunity || !workspace) {
    return null;
  }

  const missingItems = getChallengeContinueBlockers(challengeDecisions);
  const missingFields = getMissingChallengeFields(challengeDecisions);
  const canContinue = canContinueFromChallenge(challengeDecisions);
  const isMissing = (challengeId: string) =>
    showValidation && missingFields.has(challengeId);

  function handleContinue() {
    if (canContinue) {
      markChallengeReviewed();
      const next = getNextStepPath("/challenge");
      if (next) router.push(next);
      return;
    }
    setShowValidation(true);
  }

  return (
    <div className="flex min-h-full flex-col bg-zinc-50 dark:bg-zinc-950">
      <WorkflowHeader step={5} backHref={getPreviousStepPath("/challenge")} />

      <main className="flex flex-1 flex-col px-6 py-16 sm:py-20">
        <div className="mx-auto w-full max-w-[720px]">
          <p className="mb-3 text-center text-sm text-zinc-500 dark:text-zinc-400">
            Review potential blind spots before generating the final artifact.
          </p>
          <p className="mb-10 text-center text-xs text-zinc-400 dark:text-zinc-500">
            Evaluating: {selectedOpportunity.title}
          </p>

          <div className="space-y-3">
            {MOCK_CHALLENGES.map((challenge) => {
              const decision = challengeDecisions[challenge.id] ?? null;
              const error = isMissing(challenge.id);

              return (
                <div
                  key={challenge.id}
                  className={`rounded-xl border bg-white p-5 shadow-sm dark:bg-zinc-900 ${
                    error
                      ? "border-red-300 bg-red-50/60 dark:border-red-800 dark:bg-red-950/30"
                      : "border-zinc-200 dark:border-zinc-800"
                  }`}
                >
                  <h2
                    className={`text-sm font-medium ${
                      error
                        ? "text-red-700 dark:text-red-300"
                        : "text-zinc-900 dark:text-zinc-50"
                    }`}
                  >
                    {challenge.title}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                    {challenge.detail}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setChallengeDecision(challenge.id, "accepted")
                      }
                      className={`rounded-lg border px-3 py-1.5 text-xs transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                        decision === "accepted"
                          ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900"
                          : error
                            ? "border-red-300 text-red-600 hover:border-red-400 dark:border-red-800 dark:text-red-400"
                            : "border-zinc-200 text-zinc-600 hover:border-zinc-300 dark:border-zinc-700 dark:text-zinc-300"
                      }`}
                    >
                      Accept feedback
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setChallengeDecision(challenge.id, "ignored")
                      }
                      className={`rounded-lg border px-3 py-1.5 text-xs transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                        decision === "ignored"
                          ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900"
                          : error
                            ? "border-red-300 text-red-600 hover:border-red-400 dark:border-red-800 dark:text-red-400"
                            : "border-zinc-200 text-zinc-600 hover:border-zinc-300 dark:border-zinc-700 dark:text-zinc-300"
                      }`}
                    >
                      Ignore feedback
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 space-y-4">
            {showValidation && !canContinue && (
              <div
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-950/40"
              >
                <p className="text-sm font-medium text-red-700 dark:text-red-300">
                  Complete the following to continue
                </p>
                <ul className="mt-2 space-y-1">
                  {missingItems.map((item) => (
                    <li
                      key={item.field}
                      className="text-sm text-red-600 dark:text-red-400"
                    >
                      · {item.message}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={() => router.push("/workspace")}
                className="inline-flex h-9 items-center justify-center rounded-lg px-3 text-sm text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-900/5 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
              >
                Return to Decision Workspace
              </button>
              <button
                type="button"
                onClick={handleContinue}
                className="inline-flex h-9 items-center justify-center rounded-lg bg-zinc-900 px-4 text-sm font-medium text-white transition-colors hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 focus:ring-offset-zinc-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white dark:focus:ring-zinc-100 dark:focus:ring-offset-zinc-950"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
