export const WORKFLOW_STEP_COUNT = 6;

export const WORKFLOW_STEPS = [
  { step: 1, path: "/" },
  { step: 2, path: "/analysis" },
  { step: 3, path: "/opportunities" },
  { step: 4, path: "/workspace" },
  { step: 5, path: "/challenge" },
  { step: 6, path: "/output" },
] as const;

export type WorkflowPath = (typeof WORKFLOW_STEPS)[number]["path"];

export function getStepForPath(path: string) {
  return WORKFLOW_STEPS.find((entry) => entry.path === path)?.step ?? 1;
}

export function getPreviousStepPath(path: string): string | null {
  const index = WORKFLOW_STEPS.findIndex((entry) => entry.path === path);
  if (index <= 0) return null;
  return WORKFLOW_STEPS[index - 1].path;
}
