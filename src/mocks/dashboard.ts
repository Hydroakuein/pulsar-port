import type { DashboardSnapshot } from "../domain/dashboard";

export const dashboardSnapshot: DashboardSnapshot = {
  milestone: {
    name: "Alpha Content Lock",
    dueLabel: "還有 16 天 · 8 月 18 日",
    progress: 68,
    confidence: "中高信心",
  },
  metrics: [
    {
      label: "整體進度",
      value: "68",
      unit: "%",
      delta: "本週 +4.2%",
      tone: "yellow",
      trend: [42, 52, 47, 58, 61],
    },
    {
      label: "目前阻塞",
      value: "05",
      delta: "影響 3 個 Feature",
      tone: "red",
      trend: [38, 50, 34, 46, 43],
    },
    {
      label: "等待交接",
      value: "08",
      delta: "最久已等待 1 天",
      tone: "green",
      trend: [28, 45, 34, 52, 53],
    },
  ],
  features: [
    { name: "戰鬥系統 2.0", team: "Gameplay", progress: 78, status: "製作中", tone: "yellow" },
    { name: "深海遺跡地圖", team: "World Art", progress: 64, status: "整合中", tone: "green" },
    { name: "角色：艾拉", team: "Character", progress: 47, status: "等待中", tone: "amber" },
    { name: "多人配對系統", team: "Online", progress: 31, status: "有風險", tone: "red" },
  ],
  workflow: [
    { label: "設計", count: 6, tone: "neutral" },
    { label: "製作", count: 14, tone: "yellow" },
    { label: "審核", count: 8, tone: "amber" },
    { label: "整合", count: 5, tone: "green" },
    { label: "測試", count: 3, tone: "neutral" },
  ],
  teamPulse: [
    { label: "有信心", value: 64, tone: "green" },
    { label: "需關注", value: 24, tone: "yellow" },
    { label: "已阻塞", value: 12, tone: "red" },
  ],
};
