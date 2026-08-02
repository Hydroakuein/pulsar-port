export type DashboardTone = "yellow" | "green" | "amber" | "red" | "neutral";

export type DashboardMetric = {
  label: string;
  value: string;
  unit?: string;
  delta: string;
  tone: DashboardTone;
  trend: number[];
};

export type FeatureHealth = {
  name: string;
  team: string;
  progress: number;
  status: string;
  tone: DashboardTone;
};

export type WorkflowStage = {
  label: string;
  count: number;
  tone: DashboardTone;
};

export type TeamPulse = {
  label: string;
  value: number;
  tone: DashboardTone;
};

export type DashboardSnapshot = {
  milestone: {
    name: string;
    dueLabel: string;
    progress: number;
    confidence: string;
  };
  metrics: DashboardMetric[];
  features: FeatureHealth[];
  workflow: WorkflowStage[];
  teamPulse: TeamPulse[];
};
