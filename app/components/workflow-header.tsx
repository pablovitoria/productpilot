"use client";

import { useRouter } from "next/navigation";
import { WORKFLOW_STEP_COUNT } from "@/lib/workflow/steps";

function ProductPilotLogo() {
  return (
    <div className="flex items-center gap-2">
      <div
        aria-hidden
        className="flex h-6 w-6 items-center justify-center rounded bg-zinc-900 dark:bg-zinc-100"
      >
        <svg
          viewBox="0 0 16 16"
          fill="none"
          className="h-3 w-3 text-white dark:text-zinc-900"
        >
          <path
            d="M8 2L12 8L8 14L4 8L8 2Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
        ProductPilot
      </span>
    </div>
  );
}

type WorkflowHeaderProps = {
  step: number;
  backHref?: string | null;
};

export function WorkflowHeader({ step, backHref }: WorkflowHeaderProps) {
  const router = useRouter();

  return (
    <header className="border-b border-zinc-200 bg-white px-6 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto flex h-14 max-w-[960px] items-center justify-between">
        <div className="flex items-center gap-3">
          {backHref ? (
            <button
              type="button"
              onClick={() => router.push(backHref)}
              className="inline-flex h-8 items-center gap-1 rounded-lg px-2 text-sm text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-900/5 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 dark:focus:ring-zinc-50/5"
            >
              <svg
                viewBox="0 0 16 16"
                fill="none"
                className="h-3.5 w-3.5"
                aria-hidden
              >
                <path
                  d="M10 3L5 8L10 13"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Back
            </button>
          ) : null}
          <ProductPilotLogo />
        </div>
        <span className="text-xs text-zinc-400 dark:text-zinc-500">
          Step {step} of {WORKFLOW_STEP_COUNT}
        </span>
      </div>
    </header>
  );
}
