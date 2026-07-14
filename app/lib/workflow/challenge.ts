export type ChallengeItem = {
  id: string;
  title: string;
  detail: string;
};

export const MOCK_CHALLENGES: ChallengeItem[] = [
  {
    id: "engaged-users",
    title: "Evidence may over-represent engaged users",
    detail:
      "Most quoted feedback comes from highly engaged travelers. Casual or first-time bookers may experience a different primary friction point.",
  },
  {
    id: "earlier-friction",
    title: "Root cause may occur earlier in the journey",
    detail:
      "If users rarely reach later booking steps, the selected opportunity could be a symptom of an earlier discovery or search issue.",
  },
  {
    id: "objective-alignment",
    title: "Business objective may not match the strongest signal",
    detail:
      "If retention is selected as the objective but evidence concentrates on abandonment, reconsider whether conversion or checkout completion is the better framing.",
  },
  {
    id: "missing-segment",
    title: "Segment coverage looks incomplete",
    detail:
      "Group travelers appear often, but solo and business segments may be underrepresented in the current evidence set.",
  },
  {
    id: "research-gap",
    title: "Additional research could reduce risk",
    detail:
      "A short prototype test or targeted interviews could confirm whether the recommended next step is the highest-leverage move.",
  },
];

export type ChallengeDecision = "accepted" | "ignored" | null;

export type ChallengeFieldBlocker = {
  field: string;
  message: string;
};

export function getChallengeContinueBlockers(
  decisions: Record<string, ChallengeDecision>,
): ChallengeFieldBlocker[] {
  return MOCK_CHALLENGES.filter((challenge) => {
    const decision = decisions[challenge.id];
    return decision !== "accepted" && decision !== "ignored";
  }).map((challenge) => ({
    field: challenge.id,
    message: `Accept or ignore: ${challenge.title}`,
  }));
}

export function getMissingChallengeFields(
  decisions: Record<string, ChallengeDecision>,
) {
  return new Set(
    getChallengeContinueBlockers(decisions).map((blocker) => blocker.field),
  );
}

export function canContinueFromChallenge(
  decisions: Record<string, ChallengeDecision>,
) {
  return getChallengeContinueBlockers(decisions).length === 0;
}
