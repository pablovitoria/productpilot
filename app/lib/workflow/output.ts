import type { Opportunity } from "./opportunities";
import type { ChallengeDecision } from "./challenge";
import { MOCK_CHALLENGES } from "./challenge";
import type { WorkspaceState } from "./workspace";

export type OutputType = "decision-canvas" | "epic" | "prd";

export const OUTPUT_OPTIONS: {
  id: OutputType;
  title: string;
  description: string;
}[] = [
  {
    id: "decision-canvas",
    title: "Product Decision Canvas",
    description:
      "A concise decision summary with evidence, context, and recommendation.",
  },
  {
    id: "epic",
    title: "Epic Draft",
    description:
      "A lightweight epic outline ready to share with engineering partners.",
  },
  {
    id: "prd",
    title: "PRD Draft",
    description:
      "A structured product requirements draft grounded in the validated opportunity.",
  },
];

function selectedMetrics(workspace: WorkspaceState) {
  const metrics = workspace.suggestedMetrics
    .filter((metric) => metric.selected)
    .map((metric) => `- ${metric.label}: ${metric.value}`);

  if (workspace.customMetricLabel.trim()) {
    metrics.push(
      `- ${workspace.customMetricLabel}: ${workspace.customMetricValue || "n/a"}`,
    );
  }

  return metrics.length > 0 ? metrics.join("\n") : "- None selected";
}

function challengeSummary(
  decisions: Record<string, ChallengeDecision>,
) {
  const lines = MOCK_CHALLENGES.map((challenge) => {
    const decision = decisions[challenge.id];
    const status =
      decision === "accepted"
        ? "Accepted"
        : decision === "ignored"
          ? "Ignored"
          : "Pending";
    return `- [${status}] ${challenge.title}`;
  });

  return lines.join("\n");
}

export function generateOutputPreview({
  outputType,
  opportunity,
  workspace,
  challengeDecisions,
}: {
  outputType: OutputType;
  opportunity: Opportunity;
  workspace: WorkspaceState;
  challengeDecisions: Record<string, ChallengeDecision>;
}) {
  const baseContext = `Opportunity: ${opportunity.title}
Problem: ${workspace.problemStatement}
Business objective: ${workspace.businessObjective || "Not set"}
Recommendation: ${workspace.recommendation || "Not set"}
Why now: ${workspace.whyNow || "Not set"}
Users affected: ${workspace.usersAffected.join(", ") || "Not set"}`;

  if (outputType === "decision-canvas") {
    return `# Product Decision Canvas

${baseContext}

## Customer Evidence
${workspace.themes.map((item) => `- ${item.text}`).join("\n") || "- None"}

## Business Evidence
${selectedMetrics(workspace)}

## Assessment
- Customer impact: ${workspace.customerImpact ?? "n/a"}/5
- Business impact: ${workspace.businessImpact ?? "n/a"}/5
- Strategic alignment: ${workspace.strategicAlignment ?? "n/a"}/5
- Confidence: ${workspace.confidence ?? "n/a"}/5
- Estimated effort: ${workspace.estimatedEffort ?? "n/a"}/5

## AI Challenge Review
${challengeSummary(challengeDecisions)}

## Decision Note
${workspace.recommendationNote || "No additional note provided."}
`;
  }

  if (outputType === "epic") {
    return `# Epic Draft: ${opportunity.title}

## Summary
${workspace.opportunityDescription}

## Problem
${workspace.problemStatement}

## Goals
- Support business objective: ${workspace.businessObjective || "TBD"}
- Address users: ${workspace.usersAffected.join(", ") || "TBD"}
- Recommended next step: ${workspace.recommendation || "TBD"}

## Evidence
### Customer
${workspace.painPoints.map((item) => `- ${item.text}`).join("\n") || "- None"}

### Business
${selectedMetrics(workspace)}

## Scope (Draft)
- Deliver a focused MVP that validates the selected opportunity
- Instrument key metrics before and after release
- Revisit open AI challenge items during planning

## Out of Scope
- Full platform redesign
- Unrelated discovery or payment initiatives

## Open Questions
${challengeSummary(challengeDecisions)}
`;
  }

  return `# PRD Draft: ${opportunity.title}

## Background
${workspace.initialRationale}

## Problem Statement
${workspace.problemStatement}

## Opportunity
${workspace.opportunityDescription}

## Goals & Non-Goals
### Goals
- Improve outcomes for: ${workspace.usersAffected.join(", ") || "target users"}
- Advance objective: ${workspace.businessObjective || "TBD"}
- Execute recommendation: ${workspace.recommendation || "TBD"}

### Non-Goals
- Solve every adjacent booking friction in this release

## Users
${workspace.usersAffected.map((user) => `- ${user}`).join("\n") || "- Not specified"}

## Evidence
### Customer Quotes
${workspace.quotes.map((item) => `- ${item.text}`).join("\n") || "- None"}

### Product Metrics
${selectedMetrics(workspace)}

## Success Metrics
- Track movement in selected business metrics
- Confirm reduced friction for the target segment
- Validate that confidence remains supported after challenge review

## Risks & Assumptions
- If unsolved: ${workspace.ifNotSolved || "Impact not specified"}
- Why now: ${workspace.whyNow || "Timing not specified"}

## AI Challenge Responses
${challengeSummary(challengeDecisions)}

## Recommendation
${workspace.recommendation || "Not set"}
${workspace.recommendationNote ? `\nNote: ${workspace.recommendationNote}` : ""}
`;
}
