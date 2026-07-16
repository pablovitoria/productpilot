"use client";

import { WorkflowHeader } from "@/components/workflow-header";
import { useWorkflow } from "@/lib/workflow/context";
import { getNextStepPath, getPreviousStepPath } from "@/lib/workflow/steps";
import {
  BUSINESS_OBJECTIVES,
  canContinueFromWorkspace,
  createWorkspaceFromOpportunity,
  getDecisionConfidenceLabel,
  getDecisionReadiness,
  getEvidenceStrength,
  getMissingWorkspaceFields,
  getWorkspaceContinueBlockers,
  RECOMMENDATION_OPTIONS,
  USER_SEGMENTS,
  WHY_NOW_OPTIONS,
  type RatingValue,
  type WorkspaceFieldId,
  type WorkspaceState,
} from "@/lib/workflow/workspace";
import { useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

function SectionCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <h2 className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
        {title}
      </h2>
      <p className="mt-1 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
        {description}
      </p>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function FieldLabel({
  children,
  error = false,
}: {
  children: ReactNode;
  error?: boolean;
}) {
  return (
    <label
      className={`mb-1.5 block text-xs font-medium ${
        error
          ? "text-red-600 dark:text-red-400"
          : "text-zinc-500 dark:text-zinc-400"
      }`}
    >
      {children}
    </label>
  );
}

function FieldGroup({
  error = false,
  children,
}: {
  error?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={
        error
          ? "rounded-lg border border-red-300 bg-red-50/60 p-3 dark:border-red-800 dark:bg-red-950/30"
          : undefined
      }
    >
      {children}
    </div>
  );
}

const inputErrorClass =
  "border-red-300 focus:border-red-500 focus:ring-red-500/20 dark:border-red-800";

function TextArea({
  value,
  onChange,
  rows = 3,
  error = false,
}: {
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  error?: boolean;
}) {
  return (
    <textarea
      value={value}
      onChange={(event) => onChange(event.target.value)}
      rows={rows}
      aria-invalid={error || undefined}
      className={`w-full resize-y rounded-lg border bg-white px-3 py-2.5 text-sm leading-relaxed text-zinc-900 focus:outline-none focus:ring-2 dark:bg-zinc-950 dark:text-zinc-50 ${
        error
          ? inputErrorClass
          : "border-zinc-200 focus:border-blue-500 focus:ring-blue-500/20 dark:border-zinc-700"
      }`}
    />
  );
}

function ChipButton({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg border px-3 py-1.5 text-xs transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
        selected
          ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900"
          : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:border-zinc-600"
      }`}
    >
      {children}
    </button>
  );
}

function RatingRow({
  label,
  value,
  onChange,
  error = false,
}: {
  label: string;
  value: RatingValue | null;
  onChange: (value: RatingValue) => void;
  error?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between gap-3 rounded-lg px-2 py-1.5 ${
        error ? "border border-red-300 bg-red-50/60 dark:border-red-800 dark:bg-red-950/30" : ""
      }`}
    >
      <span
        className={`text-sm ${
          error
            ? "font-medium text-red-600 dark:text-red-400"
            : "text-zinc-600 dark:text-zinc-400"
        }`}
      >
        {label}
      </span>
      <div className="flex gap-1">
        {([1, 2, 3, 4, 5] as RatingValue[]).map((rating) => (
          <button
            key={rating}
            type="button"
            onClick={() => onChange(rating)}
            className={`inline-flex h-8 w-8 items-center justify-center rounded-md text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
              value === rating
                ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                : error
                  ? "bg-red-100 text-red-500 hover:bg-red-200 dark:bg-red-950 dark:text-red-400 dark:hover:bg-red-900"
                  : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
            }`}
          >
            {rating}
          </button>
        ))}
      </div>
    </div>
  );
}

function EvidenceList({
  items,
  onChange,
  onRemove,
  onAdd,
  addLabel,
  error = false,
}: {
  items: { id: string; text: string }[];
  onChange: (id: string, text: string) => void;
  onRemove: (id: string) => void;
  onAdd: () => void;
  addLabel: string;
  error?: boolean;
}) {
  return (
    <div className="space-y-2">
      {items.map((item) => (
        <div key={item.id} className="flex gap-2">
          <input
            value={item.text}
            onChange={(event) => onChange(item.id, event.target.value)}
            aria-invalid={error || undefined}
            className={`min-w-0 flex-1 rounded-lg border bg-white px-3 py-2 text-sm text-zinc-900 focus:outline-none focus:ring-2 dark:bg-zinc-950 dark:text-zinc-50 ${
              error
                ? inputErrorClass
                : "border-zinc-200 focus:border-blue-500 focus:ring-blue-500/20 dark:border-zinc-700"
            }`}
          />
          <button
            type="button"
            onClick={() => onRemove(item.id)}
            className="inline-flex h-9 items-center rounded-lg px-2 text-xs text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
          >
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={onAdd}
        className="text-xs text-zinc-500 transition-colors hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
      >
        + {addLabel}
      </button>
    </div>
  );
}

export default function WorkspacePage() {
  const router = useRouter();
  const {
    selectedOpportunity,
    workspace,
    setWorkspace,
    challengeReviewed,
  } = useWorkflow();
  const [showValidation, setShowValidation] = useState(false);

  useEffect(() => {
    if (!selectedOpportunity) {
      router.replace("/opportunities");
      return;
    }
    if (!workspace) {
      setWorkspace(createWorkspaceFromOpportunity(selectedOpportunity));
    }
  }, [selectedOpportunity, workspace, setWorkspace, router]);

  if (!selectedOpportunity || !workspace) {
    return null;
  }

  function updateWorkspace(patch: Partial<WorkspaceState>) {
    setWorkspace((current) => (current ? { ...current, ...patch } : current));
  }

  function updateEvidence(
    key: "themes" | "painPoints" | "quotes",
    id: string,
    text: string,
  ) {
    setWorkspace((current) => {
      if (!current) return current;
      return {
        ...current,
        [key]: current[key].map((item) =>
          item.id === id ? { ...item, text } : item,
        ),
      };
    });
  }

  function removeEvidence(
    key: "themes" | "painPoints" | "quotes",
    id: string,
  ) {
    setWorkspace((current) => {
      if (!current) return current;
      return {
        ...current,
        [key]: current[key].filter((item) => item.id !== id),
      };
    });
  }

  function addEvidence(key: "themes" | "painPoints" | "quotes") {
    setWorkspace((current) => {
      if (!current) return current;
      return {
        ...current,
        [key]: [
          ...current[key],
          { id: `${key}-${Date.now()}`, text: "" },
        ],
      };
    });
  }

  const readiness = getDecisionReadiness(workspace, challengeReviewed);
  const missingItems = getWorkspaceContinueBlockers(workspace);
  const missingFields = getMissingWorkspaceFields(workspace);
  const canContinue = canContinueFromWorkspace(workspace);
  const isMissing = (field: WorkspaceFieldId) =>
    showValidation && missingFields.has(field);

  function handleContinue() {
    if (canContinue) {
      const next = getNextStepPath("/workspace");
      if (next) router.push(next);
      return;
    }
    setShowValidation(true);
  }

  return (
    <div className="flex min-h-full flex-col bg-zinc-50 dark:bg-zinc-950">
      <WorkflowHeader step={4} backHref={getPreviousStepPath("/workspace")} />

      <main className="flex flex-1 flex-col px-6 py-10 sm:py-14">
        <div className="mx-auto w-full max-w-[720px]">
          <p className="mb-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
            Evaluate the opportunity with evidence, business context, and your
            judgment before generating an output.
          </p>

          <div className="-mx-1 mb-6 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <p className="text-[10px] font-medium uppercase tracking-wide text-zinc-400">
                  Selected Opportunity
                </p>
                <p className="mt-1 text-sm font-medium text-zinc-900 dark:text-zinc-50">
                  {selectedOpportunity.title}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-medium uppercase tracking-wide text-zinc-400">
                  Evidence Strength
                </p>
                <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">
                  {getEvidenceStrength(workspace)}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-medium uppercase tracking-wide text-zinc-400">
                  Business Objective
                </p>
                <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">
                  {workspace.businessObjective || "Not set"}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-medium uppercase tracking-wide text-zinc-400">
                  Decision Confidence
                </p>
                <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">
                  {getDecisionConfidenceLabel(workspace)}
                </p>
              </div>
            </div>
            <div className="mt-4 border-t border-zinc-100 pt-3 dark:border-zinc-800">
              <p className="mb-2 text-[10px] font-medium uppercase tracking-wide text-zinc-400">
                Decision Readiness
              </p>
              <ul className="grid gap-1 sm:grid-cols-2">
                {readiness.map((item) => (
                  <li
                    key={item.id}
                    className="text-xs text-zinc-600 dark:text-zinc-400"
                  >
                    {item.done ? "✓" : "○"} {item.label}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-4">
            <SectionCard
              title="1. Problem Validation"
              description="Confirm this is a real customer problem worth solving."
            >
              <div className="space-y-4">
                <div>
                  <FieldLabel>Problem Statement</FieldLabel>
                  <TextArea
                    value={workspace.problemStatement}
                    onChange={(value) =>
                      updateWorkspace({ problemStatement: value })
                    }
                  />
                </div>
                <div>
                  <FieldLabel>Opportunity Description</FieldLabel>
                  <TextArea
                    value={workspace.opportunityDescription}
                    onChange={(value) =>
                      updateWorkspace({ opportunityDescription: value })
                    }
                  />
                </div>
                <div>
                  <FieldLabel>Initial Rationale</FieldLabel>
                  <TextArea
                    value={workspace.initialRationale}
                    onChange={(value) =>
                      updateWorkspace({ initialRationale: value })
                    }
                  />
                </div>
                <FieldGroup error={isMissing("problemValidated")}>
                  <FieldLabel error={isMissing("problemValidated")}>
                    Validate Opportunity
                  </FieldLabel>
                  <div className="flex flex-wrap gap-2">
                    <ChipButton
                      selected={workspace.problemValidated === true}
                      onClick={() => updateWorkspace({ problemValidated: true })}
                    >
                      Validate
                    </ChipButton>
                    <ChipButton
                      selected={workspace.problemValidated === false}
                      onClick={() =>
                        updateWorkspace({ problemValidated: false })
                      }
                    >
                      Reject
                    </ChipButton>
                  </div>
                </FieldGroup>
                <div>
                  <FieldLabel>Additional Context</FieldLabel>
                  <TextArea
                    value={workspace.additionalContext}
                    onChange={(value) =>
                      updateWorkspace({ additionalContext: value })
                    }
                    rows={2}
                  />
                </div>
              </div>
            </SectionCard>

            <SectionCard
              title="2. Supporting Evidence"
              description="Combine customer insights with business evidence."
            >
              <div className="space-y-5">
                <FieldGroup error={isMissing("customerEvidence")}>
                  <div className="space-y-5">
                    <div>
                      <FieldLabel error={isMissing("customerEvidence")}>
                        Themes
                      </FieldLabel>
                      <EvidenceList
                        items={workspace.themes}
                        onChange={(id, text) =>
                          updateEvidence("themes", id, text)
                        }
                        onRemove={(id) => removeEvidence("themes", id)}
                        onAdd={() => addEvidence("themes")}
                        addLabel="Add theme"
                        error={isMissing("customerEvidence")}
                      />
                    </div>
                    <div>
                      <FieldLabel error={isMissing("customerEvidence")}>
                        Pain Points
                      </FieldLabel>
                      <EvidenceList
                        items={workspace.painPoints}
                        onChange={(id, text) =>
                          updateEvidence("painPoints", id, text)
                        }
                        onRemove={(id) => removeEvidence("painPoints", id)}
                        onAdd={() => addEvidence("painPoints")}
                        addLabel="Add pain point"
                        error={isMissing("customerEvidence")}
                      />
                    </div>
                    <div>
                      <FieldLabel error={isMissing("customerEvidence")}>
                        Customer Quotes
                      </FieldLabel>
                      <EvidenceList
                        items={workspace.quotes}
                        onChange={(id, text) => updateEvidence("quotes", id, text)}
                        onRemove={(id) => removeEvidence("quotes", id)}
                        onAdd={() => addEvidence("quotes")}
                        addLabel="Add quote"
                        error={isMissing("customerEvidence")}
                      />
                    </div>
                  </div>
                </FieldGroup>
                <div>
                  <FieldLabel>Mention Frequency</FieldLabel>
                  <TextArea
                    value={workspace.mentionFrequency}
                    onChange={(value) =>
                      updateWorkspace({ mentionFrequency: value })
                    }
                    rows={2}
                  />
                </div>
                <FieldGroup error={isMissing("businessEvidence")}>
                  <FieldLabel error={isMissing("businessEvidence")}>
                    Business Evidence
                  </FieldLabel>
                  <div className="space-y-2">
                    {workspace.suggestedMetrics.map((metric) => (
                      <label
                        key={metric.id}
                        className={`flex cursor-pointer items-start gap-3 rounded-lg border px-3 py-2.5 ${
                          isMissing("businessEvidence")
                            ? "border-red-300 dark:border-red-800"
                            : "border-zinc-200 dark:border-zinc-700"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={metric.selected}
                          onChange={() =>
                            setWorkspace((current) => {
                              if (!current) return current;
                              return {
                                ...current,
                                suggestedMetrics: current.suggestedMetrics.map(
                                  (item) =>
                                    item.id === metric.id
                                      ? { ...item, selected: !item.selected }
                                      : item,
                                ),
                              };
                            })
                          }
                          className="mt-0.5"
                        />
                        <span>
                          <span className="block text-sm text-zinc-800 dark:text-zinc-200">
                            {metric.label}
                          </span>
                          <span className="block text-xs text-zinc-500">
                            {metric.value}
                          </span>
                        </span>
                      </label>
                    ))}
                  </div>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    <input
                      value={workspace.customMetricLabel}
                      onChange={(event) =>
                        updateWorkspace({
                          customMetricLabel: event.target.value,
                        })
                      }
                      placeholder="Custom metric"
                      aria-invalid={isMissing("businessEvidence") || undefined}
                      className={`rounded-lg border bg-white px-3 py-2 text-sm text-zinc-900 focus:outline-none focus:ring-2 dark:bg-zinc-950 dark:text-zinc-50 ${
                        isMissing("businessEvidence")
                          ? inputErrorClass
                          : "border-zinc-200 focus:border-blue-500 focus:ring-blue-500/20 dark:border-zinc-700"
                      }`}
                    />
                    <input
                      value={workspace.customMetricValue}
                      onChange={(event) =>
                        updateWorkspace({
                          customMetricValue: event.target.value,
                        })
                      }
                      placeholder="Value"
                      aria-invalid={isMissing("businessEvidence") || undefined}
                      className={`rounded-lg border bg-white px-3 py-2 text-sm text-zinc-900 focus:outline-none focus:ring-2 dark:bg-zinc-950 dark:text-zinc-50 ${
                        isMissing("businessEvidence")
                          ? inputErrorClass
                          : "border-zinc-200 focus:border-blue-500 focus:ring-blue-500/20 dark:border-zinc-700"
                      }`}
                    />
                  </div>
                </FieldGroup>
              </div>
            </SectionCard>

            <SectionCard
              title="3. Business Context"
              description="Capture the strategic reasoning behind the opportunity."
            >
              <div className="space-y-4">
                <FieldGroup error={isMissing("businessObjective")}>
                  <FieldLabel error={isMissing("businessObjective")}>
                    Business Objective
                  </FieldLabel>
                  <div className="flex flex-wrap gap-2">
                    {BUSINESS_OBJECTIVES.map((objective) => (
                      <ChipButton
                        key={objective}
                        selected={workspace.businessObjective === objective}
                        onClick={() =>
                          updateWorkspace({ businessObjective: objective })
                        }
                      >
                        {objective}
                      </ChipButton>
                    ))}
                  </div>
                </FieldGroup>
                <FieldGroup error={isMissing("whyNow")}>
                  <FieldLabel error={isMissing("whyNow")}>
                    Why is this important now?
                  </FieldLabel>
                  <div className="flex flex-wrap gap-2">
                    {WHY_NOW_OPTIONS.map((option) => (
                      <ChipButton
                        key={option}
                        selected={workspace.whyNow === option}
                        onClick={() => updateWorkspace({ whyNow: option })}
                      >
                        {option}
                      </ChipButton>
                    ))}
                  </div>
                </FieldGroup>
                <FieldGroup error={isMissing("usersAffected")}>
                  <FieldLabel error={isMissing("usersAffected")}>
                    Users Affected
                  </FieldLabel>
                  <div className="flex flex-wrap gap-2">
                    {USER_SEGMENTS.map((segment) => {
                      const selected =
                        workspace.usersAffected.includes(segment);
                      return (
                        <ChipButton
                          key={segment}
                          selected={selected}
                          onClick={() =>
                            updateWorkspace({
                              usersAffected: selected
                                ? workspace.usersAffected.filter(
                                    (item) => item !== segment,
                                  )
                                : [...workspace.usersAffected, segment],
                            })
                          }
                        >
                          {segment}
                        </ChipButton>
                      );
                    })}
                  </div>
                </FieldGroup>
                <FieldGroup error={isMissing("ifNotSolved")}>
                  <FieldLabel error={isMissing("ifNotSolved")}>
                    What happens if this is not solved?
                  </FieldLabel>
                  <TextArea
                    value={workspace.ifNotSolved}
                    onChange={(value) => updateWorkspace({ ifNotSolved: value })}
                    rows={2}
                    error={isMissing("ifNotSolved")}
                  />
                </FieldGroup>
              </div>
            </SectionCard>

            <SectionCard
              title="4. Opportunity Assessment"
              description="Rate the opportunity to support structured thinking."
            >
              <div className="space-y-3">
                <RatingRow
                  label="Customer Impact"
                  value={workspace.customerImpact}
                  onChange={(value) =>
                    updateWorkspace({ customerImpact: value })
                  }
                  error={isMissing("customerImpact")}
                />
                <RatingRow
                  label="Business Impact"
                  value={workspace.businessImpact}
                  onChange={(value) =>
                    updateWorkspace({ businessImpact: value })
                  }
                  error={isMissing("businessImpact")}
                />
                <RatingRow
                  label="Strategic Alignment"
                  value={workspace.strategicAlignment}
                  onChange={(value) =>
                    updateWorkspace({ strategicAlignment: value })
                  }
                  error={isMissing("strategicAlignment")}
                />
                <RatingRow
                  label="Confidence"
                  value={workspace.confidence}
                  onChange={(value) => updateWorkspace({ confidence: value })}
                  error={isMissing("confidence")}
                />
                <RatingRow
                  label="Estimated Effort (optional)"
                  value={workspace.estimatedEffort}
                  onChange={(value) =>
                    updateWorkspace({ estimatedEffort: value })
                  }
                />
              </div>
            </SectionCard>

            <SectionCard
              title="5. Recommendation"
              description="Choose the recommended next step. You make the final call."
            >
              <div className="space-y-4">
                <FieldGroup error={isMissing("recommendation")}>
                  <FieldLabel error={isMissing("recommendation")}>
                    Recommendation
                  </FieldLabel>
                  <div className="flex flex-wrap gap-2">
                    {RECOMMENDATION_OPTIONS.map((option) => (
                      <ChipButton
                        key={option}
                        selected={workspace.recommendation === option}
                        onClick={() =>
                          updateWorkspace({ recommendation: option })
                        }
                      >
                        {option}
                      </ChipButton>
                    ))}
                  </div>
                </FieldGroup>
                <div>
                  <FieldLabel>Decision Note</FieldLabel>
                  <TextArea
                    value={workspace.recommendationNote}
                    onChange={(value) =>
                      updateWorkspace({ recommendationNote: value })
                    }
                    rows={2}
                  />
                </div>
              </div>
            </SectionCard>
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

            <div className="flex justify-end">
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
