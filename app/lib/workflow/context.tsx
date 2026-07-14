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
};

const WorkflowContext = createContext<WorkflowContextValue | null>(null);

export function WorkflowProvider({ children }: { children: ReactNode }) {
  const [feedback, setFeedback] = useState("");
  const [analysis, setAnalysis] = useState<AnalysisState>(INITIAL_ANALYSIS);
  const [editedCards, setEditedCards] = useState<
    Partial<Record<AnalysisCardId, boolean>>
  >({});
  const [analysisComplete, setAnalysisComplete] = useState(false);

  const completeAnalysis = useCallback(() => {
    setAnalysisComplete(true);
  }, []);

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
    }),
    [feedback, analysis, editedCards, analysisComplete, completeAnalysis],
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
