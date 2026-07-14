import type { Opportunity } from "./opportunities";

export type EvidenceItem = {
  id: string;
  text: string;
};

export type BusinessMetric = {
  id: string;
  label: string;
  value: string;
  selected: boolean;
};

export type BusinessObjective =
  | "Reduce abandonment"
  | "Improve retention"
  | "Increase conversion"
  | "Expand group bookings"
  | "Improve discovery quality";

export type RecommendationOption =
  | "Build MVP"
  | "Create Prototype"
  | "Run Experiment"
  | "Gather More Research"
  | "Park for Later";

export type RatingValue = 1 | 2 | 3 | 4 | 5;

export type WorkspaceState = {
  problemStatement: string;
  opportunityDescription: string;
  initialRationale: string;
  problemValidated: boolean | null;
  additionalContext: string;
  themes: EvidenceItem[];
  painPoints: EvidenceItem[];
  quotes: EvidenceItem[];
  mentionFrequency: string;
  suggestedMetrics: BusinessMetric[];
  customMetricLabel: string;
  customMetricValue: string;
  businessObjective: BusinessObjective | "";
  whyNow: string;
  usersAffected: string[];
  ifNotSolved: string;
  customerImpact: RatingValue | null;
  businessImpact: RatingValue | null;
  strategicAlignment: RatingValue | null;
  confidence: RatingValue | null;
  estimatedEffort: RatingValue | null;
  recommendation: RecommendationOption | "";
  recommendationNote: string;
};

export const BUSINESS_OBJECTIVES: BusinessObjective[] = [
  "Reduce abandonment",
  "Improve retention",
  "Increase conversion",
  "Expand group bookings",
  "Improve discovery quality",
];

export const USER_SEGMENTS = [
  "Solo travelers",
  "Family groups",
  "Business travelers",
  "Price-sensitive bookers",
  "Repeat customers",
];

export const RECOMMENDATION_OPTIONS: RecommendationOption[] = [
  "Build MVP",
  "Create Prototype",
  "Run Experiment",
  "Gather More Research",
  "Park for Later",
];

export const WHY_NOW_OPTIONS = [
  "Rising support volume",
  "Competitive pressure",
  "Seasonal booking spike",
  "Clear evidence concentration",
  "Strategic OKR alignment",
];

function createId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

export function createWorkspaceFromOpportunity(
  opportunity: Opportunity,
): WorkspaceState {
  const metricPresets: Record<string, BusinessMetric[]> = {
    "search-filters": [
      {
        id: "search-exit",
        label: "Search exit rate",
        value: "38% leave after opening filters",
        selected: true,
      },
      {
        id: "filter-usage",
        label: "Filter usage",
        value: "62% of searchers open filters",
        selected: true,
      },
      {
        id: "support-search",
        label: "Support tickets",
        value: "+21% YoY on search usability",
        selected: false,
      },
    ],
    "split-payments": [
      {
        id: "checkout-abandon",
        label: "Checkout abandonment",
        value: "44% on group bookings",
        selected: true,
      },
      {
        id: "group-conversion",
        label: "Group conversion",
        value: "1.8x lower than solo",
        selected: true,
      },
      {
        id: "payment-support",
        label: "Payment support volume",
        value: "Tripled for group trips",
        selected: false,
      },
    ],
    "trip-discovery": [
      {
        id: "click-through",
        label: "Recommendation CTR",
        value: "2.1% on home discovery",
        selected: true,
      },
      {
        id: "save-rate",
        label: "Trip save rate",
        value: "9% of discovery sessions",
        selected: false,
      },
      {
        id: "repeat-visit",
        label: "Return within 7 days",
        value: "27% after weak recommendations",
        selected: true,
      },
    ],
    "group-coordination": [
      {
        id: "post-booking-nps",
        label: "Post-booking NPS",
        value: "-12 for groups of 4+",
        selected: true,
      },
      {
        id: "itinerary-opens",
        label: "Shared itinerary requests",
        value: "18% of group bookings ask support",
        selected: true,
      },
      {
        id: "repeat-group",
        label: "Repeat group bookings",
        value: "Low vs solo retention",
        selected: false,
      },
    ],
    "price-transparency": [
      {
        id: "external-compare",
        label: "External comparison rate",
        value: "31% open competitor tabs",
        selected: true,
      },
      {
        id: "flexible-dates",
        label: "Flexible dates conversion",
        value: "0.7x vs standard search",
        selected: true,
      },
      {
        id: "price-complaints",
        label: "Price-related complaints",
        value: "14% of recent reviews",
        selected: false,
      },
    ],
  };

  return {
    problemStatement: `Customers struggle with ${opportunity.title.toLowerCase()}, which creates friction in the booking journey.`,
    opportunityDescription: opportunity.description,
    initialRationale: `Feedback and supporting signals consistently point to this as a high-intent problem. ${opportunity.evidence[0]}.`,
    problemValidated: null,
    additionalContext: "",
    themes: opportunity.evidence.map((text) => ({
      id: createId("theme"),
      text,
    })),
    painPoints: [
      {
        id: createId("pain"),
        text: opportunity.description,
      },
    ],
    quotes: [
      {
        id: createId("quote"),
        text: `"${opportunity.evidence[0]}"`,
      },
    ],
    mentionFrequency: "Mentioned in roughly 30–45% of recent feedback samples.",
    suggestedMetrics: metricPresets[opportunity.id] ?? [
      {
        id: createId("metric"),
        label: "Relevant product metric",
        value: "Add supporting evidence",
        selected: false,
      },
    ],
    customMetricLabel: "",
    customMetricValue: "",
    businessObjective: "",
    whyNow: "",
    usersAffected: [],
    ifNotSolved: "",
    customerImpact: null,
    businessImpact: null,
    strategicAlignment: null,
    confidence: null,
    estimatedEffort: null,
    recommendation: "",
    recommendationNote: "",
  };
}

export type ReadinessItem = {
  id: string;
  label: string;
  done: boolean;
};

export function getDecisionReadiness(
  workspace: WorkspaceState,
  challengeReviewed: boolean,
): ReadinessItem[] {
  const hasCustomerEvidence =
    workspace.themes.length > 0 ||
    workspace.painPoints.length > 0 ||
    workspace.quotes.length > 0;
  const hasBusinessEvidence =
    workspace.suggestedMetrics.some((metric) => metric.selected) ||
    Boolean(workspace.customMetricLabel.trim());
  const hasBusinessContext =
    Boolean(workspace.businessObjective) &&
    Boolean(workspace.whyNow) &&
    workspace.usersAffected.length > 0 &&
    Boolean(workspace.ifNotSolved.trim());
  const hasAssessment =
    workspace.customerImpact !== null &&
    workspace.businessImpact !== null &&
    workspace.strategicAlignment !== null &&
    workspace.confidence !== null;

  return [
    {
      id: "problem",
      label: "Problem validated",
      done: workspace.problemValidated === true,
    },
    {
      id: "customer-evidence",
      label: "Customer evidence reviewed",
      done: hasCustomerEvidence,
    },
    {
      id: "business-evidence",
      label: "Business evidence added",
      done: hasBusinessEvidence,
    },
    {
      id: "business-context",
      label: "Business context completed",
      done: hasBusinessContext,
    },
    {
      id: "assessment",
      label: "Opportunity assessed",
      done: hasAssessment && Boolean(workspace.recommendation),
    },
    {
      id: "challenge",
      label: challengeReviewed ? "AI Challenge reviewed" : "AI Challenge pending",
      done: challengeReviewed,
    },
  ];
}

export function getEvidenceStrength(workspace: WorkspaceState) {
  const selectedMetrics = workspace.suggestedMetrics.filter((m) => m.selected)
    .length;
  const evidenceCount =
    workspace.themes.length +
    workspace.painPoints.length +
    workspace.quotes.length +
    selectedMetrics;

  if (evidenceCount >= 8) return "Strong";
  if (evidenceCount >= 5) return "Moderate";
  return "Limited";
}

export function getDecisionConfidenceLabel(workspace: WorkspaceState) {
  if (!workspace.confidence) return "Not rated";
  const labels = ["", "Very low", "Low", "Moderate", "High", "Very high"];
  return labels[workspace.confidence];
}

export type WorkspaceFieldId =
  | "problemValidated"
  | "customerEvidence"
  | "businessEvidence"
  | "businessObjective"
  | "whyNow"
  | "usersAffected"
  | "ifNotSolved"
  | "customerImpact"
  | "businessImpact"
  | "strategicAlignment"
  | "confidence"
  | "recommendation";

export type WorkspaceFieldBlocker = {
  field: WorkspaceFieldId;
  message: string;
};

export function getWorkspaceContinueBlockers(
  workspace: WorkspaceState,
): WorkspaceFieldBlocker[] {
  const blockers: WorkspaceFieldBlocker[] = [];

  if (workspace.problemValidated !== true) {
    blockers.push({
      field: "problemValidated",
      message: "Validate the opportunity in Problem Validation",
    });
  }

  const hasCustomerEvidence =
    workspace.themes.length > 0 ||
    workspace.painPoints.length > 0 ||
    workspace.quotes.length > 0;
  if (!hasCustomerEvidence) {
    blockers.push({
      field: "customerEvidence",
      message: "Add at least one customer evidence item",
    });
  }

  const hasBusinessEvidence =
    workspace.suggestedMetrics.some((metric) => metric.selected) ||
    Boolean(workspace.customMetricLabel.trim());
  if (!hasBusinessEvidence) {
    blockers.push({
      field: "businessEvidence",
      message: "Select or add business evidence",
    });
  }

  if (!workspace.businessObjective) {
    blockers.push({
      field: "businessObjective",
      message: "Select a business objective",
    });
  }
  if (!workspace.whyNow) {
    blockers.push({
      field: "whyNow",
      message: "Select why this is important now",
    });
  }
  if (workspace.usersAffected.length === 0) {
    blockers.push({
      field: "usersAffected",
      message: "Select at least one affected user segment",
    });
  }
  if (!workspace.ifNotSolved.trim()) {
    blockers.push({
      field: "ifNotSolved",
      message: "Describe what happens if this is not solved",
    });
  }

  if (workspace.customerImpact === null) {
    blockers.push({
      field: "customerImpact",
      message: "Rate customer impact",
    });
  }
  if (workspace.businessImpact === null) {
    blockers.push({
      field: "businessImpact",
      message: "Rate business impact",
    });
  }
  if (workspace.strategicAlignment === null) {
    blockers.push({
      field: "strategicAlignment",
      message: "Rate strategic alignment",
    });
  }
  if (workspace.confidence === null) {
    blockers.push({
      field: "confidence",
      message: "Rate confidence",
    });
  }

  if (!workspace.recommendation) {
    blockers.push({
      field: "recommendation",
      message: "Select a recommendation",
    });
  }

  return blockers;
}

export function getMissingWorkspaceFields(workspace: WorkspaceState) {
  return new Set(
    getWorkspaceContinueBlockers(workspace).map((blocker) => blocker.field),
  );
}

export function canContinueFromWorkspace(workspace: WorkspaceState) {
  return getWorkspaceContinueBlockers(workspace).length === 0;
}
