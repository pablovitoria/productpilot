export type Opportunity = {
  id: string;
  title: string;
  description: string;
  evidence: string[];
  confidence: "Low" | "Medium" | "High";
};

export const MOCK_OPPORTUNITIES: Opportunity[] = [
  {
    id: "search-filters",
    title: "Improve Booking Search Filters",
    description:
      "Make flight search filters clearer so travelers can find departures after specific times without scrolling through irrelevant results.",
    evidence: [
      "Repeated complaints about confusing filter UX",
      "Users compare results against Google Flights",
      "Flexible dates fails to surface cheapest windows",
    ],
    confidence: "High",
  },
  {
    id: "split-payments",
    title: "Introduce Split Payments at Checkout",
    description:
      "Allow group travelers to split payment during checkout to reduce abandonment on multi-person bookings.",
    evidence: [
      "Checkout abandonment tied to missing split payment",
      "Group booking mentioned across multiple feedback items",
      "Payment flexibility framed as a blocker, not a nice-to-have",
    ],
    confidence: "High",
  },
  {
    id: "trip-discovery",
    title: "Enhance Personalized Trip Discovery",
    description:
      "Improve recommendations so trip discovery matches how customers actually travel instead of feeling random.",
    evidence: [
      "Discovery described as random or misaligned",
      "Positive users still ask for smarter recommendations",
      "Discovery and search treated as separate problems",
    ],
    confidence: "Medium",
  },
  {
    id: "group-coordination",
    title: "Add Post-Booking Group Coordination",
    description:
      "Provide shared itinerary and lightweight group chat after booking to support family and group travel.",
    evidence: [
      "Family reunion booking called out as painful",
      "No shared itinerary after confirmation",
      "Group travel pain spans checkout and post-booking",
    ],
    confidence: "Medium",
  },
  {
    id: "price-transparency",
    title: "Improve Price Transparency",
    description:
      "Surface clearer pricing signals and cheapest travel windows so customers stop leaving to compare elsewhere.",
    evidence: [
      "Users leave to check Google Flights for cheaper dates",
      "Flexible dates feature underperforms expectations",
      "Price transparency appears as a recurring theme",
    ],
    confidence: "Medium",
  },
];

export function getOpportunityById(id: string | null) {
  if (!id) return null;
  return MOCK_OPPORTUNITIES.find((opportunity) => opportunity.id === id) ?? null;
}
