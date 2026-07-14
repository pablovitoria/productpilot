"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import {
  INITIAL_ANALYSIS,
  type AnalysisCardId,
  type AnalysisState,
} from "./analysis";
import type { ChallengeDecision } from "./challenge";
import {
  getOpportunityById,
  type Opportunity,
} from "./opportunities";
import type { OutputType } from "./output";
import {
  createWorkspaceFromOpportunity,
  type WorkspaceState,
} from "./workspace";

type WorkflowContextValue = {
  feedback: string;
  setFeedback: (feedback: string) => void;
  analysis: AnalysisState;
  setAnalysis: Dispatch<SetStateAction<AnalysisState>>;
  editedCards: Partial<Record<AnalysisCardId, boolean>>;
  setEditedCards: Dispatch<
    SetStateAction<Partial<Record<AnalysisCardId, boolean>>>
  >;
  analysisComplete: boolean;
  completeAnalysis: () => void;
  selectedOpportunityId: string | null;
  selectedOpportunity: Opportunity | null;
  selectOpportunity: (opportunityId: string) => void;
  workspace: WorkspaceState | null;
  setWorkspace: Dispatch<SetStateAction<WorkspaceState | null>>;
  challengeDecisions: Record<string, ChallengeDecision>;
  setChallengeDecision: (
    challengeId: string,
    decision: ChallengeDecision,
  ) => void;
  challengeReviewed: boolean;
  markChallengeReviewed: () => void;
  selectedOutputType: OutputType | null;
  setSelectedOutputType: (outputType: OutputType) => void;
  resetWorkflow: () => void;
};

const WorkflowContext = createContext<WorkflowContextValue | null>(null);

export function WorkflowProvider({ children }: { children: ReactNode }) {
  const [feedback, setFeedback] = useState("");
  const [analysis, setAnalysis] = useState<AnalysisState>(INITIAL_ANALYSIS);
  const [editedCards, setEditedCards] = useState<
    Partial<Record<AnalysisCardId, boolean>>
  >({});
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [selectedOpportunityId, setSelectedOpportunityId] = useState<
    string | null
  >(null);
  const [workspace, setWorkspace] = useState<WorkspaceState | null>(null);
  const [challengeDecisions, setChallengeDecisions] = useState<
    Record<string, ChallengeDecision>
  >({});
  const [challengeReviewed, setChallengeReviewed] = useState(false);
  const [selectedOutputType, setSelectedOutputType] =
    useState<OutputType | null>(null);

  const completeAnalysis = useCallback(() => {
    setAnalysisComplete(true);
  }, []);

  const selectOpportunity = useCallback((opportunityId: string) => {
    const opportunity = getOpportunityById(opportunityId);
    if (!opportunity) return;

    setSelectedOpportunityId(opportunityId);
    setWorkspace(createWorkspaceFromOpportunity(opportunity));
    setChallengeDecisions({});
    setChallengeReviewed(false);
    setSelectedOutputType(null);
  }, []);

  const setChallengeDecision = useCallback(
    (challengeId: string, decision: ChallengeDecision) => {
      setChallengeDecisions((current) => ({
        ...current,
        [challengeId]: decision,
      }));
    },
    [],
  );

  const markChallengeReviewed = useCallback(() => {
    setChallengeReviewed(true);
  }, []);

  const resetWorkflow = useCallback(() => {
    setFeedback("");
    setAnalysis(INITIAL_ANALYSIS);
    setEditedCards({});
    setAnalysisComplete(false);
    setSelectedOpportunityId(null);
    setWorkspace(null);
    setChallengeDecisions({});
    setChallengeReviewed(false);
    setSelectedOutputType(null);
  }, []);

  const selectedOpportunity = useMemo(
    () => getOpportunityById(selectedOpportunityId),
    [selectedOpportunityId],
  );

  const value = useMemo(
    () => ({
      feedback,
      setFeedback,
      analysis,
      setAnalysis,
      editedCards,
      setEditedCards,
      analysisComplete,
      completeAnalysis,
      selectedOpportunityId,
      selectedOpportunity,
      selectOpportunity,
      workspace,
      setWorkspace,
      challengeDecisions,
      setChallengeDecision,
      challengeReviewed,
      markChallengeReviewed,
      selectedOutputType,
      setSelectedOutputType,
      resetWorkflow,
    }),
    [
      feedback,
      analysis,
      editedCards,
      analysisComplete,
      completeAnalysis,
      selectedOpportunityId,
      selectedOpportunity,
      selectOpportunity,
      workspace,
      challengeDecisions,
      setChallengeDecision,
      challengeReviewed,
      markChallengeReviewed,
      selectedOutputType,
      resetWorkflow,
    ],
  );

  return (
    <WorkflowContext.Provider value={value}>{children}</WorkflowContext.Provider>
  );
}

export function useWorkflow() {
  const context = useContext(WorkflowContext);
  if (!context) {
    throw new Error("useWorkflow must be used within a WorkflowProvider");
  }
  return context;
}
