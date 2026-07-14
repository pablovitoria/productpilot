export type SentimentData = {
  overall: string;
  breakdown: { label: string; percentage: number }[];
  note: string;
};

export type AnalysisState = {
  themes: string[];
  painPoints: string[];
  customerQuotes: { quote: string }[];
  sentiment: SentimentData;
  emergingPatterns: string[];
};

export type AnalysisCardId = keyof AnalysisState;

export const INITIAL_ANALYSIS: AnalysisState = {
  themes: [
    "Search and filter usability",
    "Checkout and payment friction",
    "Trip discovery and recommendations",
    "Group travel coordination",
    "Price transparency",
  ],
  painPoints: [
    "Flight search filters make it difficult to find departures after specific times",
    "Checkout abandonment driven by limited payment options for groups",
    "Trip recommendations feel random and misaligned with travel preferences",
    "No shared itinerary or group chat after booking",
    "Flexible dates feature fails to surface the cheapest travel windows",
  ],
  customerQuotes: [
    {
      quote:
        "The flight search filters are confusing. I can't find departures after 6pm without scrolling through dozens of results.",
    },
    {
      quote:
        "I abandoned checkout twice because there was no way to split the payment with my travel group.",
    },
    {
      quote:
        "Love the app, but trip discovery feels random. I wish recommendations matched how I actually travel.",
    },
    {
      quote:
        "Booking for our family reunion was a nightmare — no group chat or shared itinerary once the trip was confirmed.",
    },
  ],
  sentiment: {
    overall: "Mixed — leaning negative",
    breakdown: [
      { label: "Frustrated", percentage: 45 },
      { label: "Neutral", percentage: 25 },
      { label: "Positive", percentage: 30 },
    ],
    note: "Frustration concentrates around search, checkout, and group booking. Positive sentiment appears in users who value the core booking experience but want smarter discovery.",
  },
  emergingPatterns: [
    "Users frequently compare pricing and search results against Google Flights",
    "Group travel pain points appear across checkout, coordination, and post-booking",
    "Discovery and search are treated as separate problems by customers",
    "Payment flexibility is a blocker for group bookings, not just a nice-to-have",
  ],
};
