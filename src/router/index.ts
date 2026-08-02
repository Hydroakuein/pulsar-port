import { createRouter, createWebHistory } from "vue-router";

import DashboardView from "../views/DashboardView.vue";
import PlaceholderView from "../views/PlaceholderView.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "dashboard",
      component: DashboardView,
      meta: { title: "專案總覽", section: "NOVA ODYSSEY / ALPHA" },
    },
    {
      path: "/projects",
      name: "projects",
      component: PlaceholderView,
      meta: { title: "專案", section: "PROJECTS", description: "管理專案、成員與開發階段。" },
    },
    {
      path: "/features",
      name: "features",
      component: PlaceholderView,
      meta: {
        title: "Feature",
        section: "PRODUCTION",
        description: "追蹤遊戲功能、目標版本與完成條件。",
      },
    },
    {
      path: "/workflows",
      name: "workflows",
      component: PlaceholderView,
      meta: {
        title: "製作流程",
        section: "WORKFLOW",
        description: "建立各種內容適用的製作階段與轉移規則。",
      },
    },
    {
      path: "/assets",
      name: "assets",
      component: PlaceholderView,
      meta: {
        title: "Asset",
        section: "ASSET LIBRARY",
        description: "管理資產、版本、預覽與審核紀錄。",
      },
    },
    {
      path: "/tasks",
      name: "tasks",
      component: PlaceholderView,
      meta: { title: "任務", section: "TASKS", description: "以列表與看板管理所有關聯工作。" },
    },
    {
      path: "/team",
      name: "team",
      component: PlaceholderView,
      meta: {
        title: "團隊",
        section: "TEAM PULSE",
        description: "更新工作狀態、負載、信心與協助需求。",
      },
    },
    {
      path: "/handoffs",
      name: "handoffs",
      component: PlaceholderView,
      meta: {
        title: "跨團隊交接",
        section: "HANDOFF",
        description: "追蹤交付、驗收、等待與退回原因。",
      },
    },
    {
      path: "/blockers",
      name: "blockers",
      component: PlaceholderView,
      meta: {
        title: "阻塞中心",
        section: "BLOCKERS",
        description: "集中處理等待最久與影響最大的阻塞。",
      },
    },
    {
      path: "/documents",
      name: "documents",
      component: PlaceholderView,
      meta: {
        title: "文件",
        section: "KNOWLEDGE",
        description: "集中管理文件、會議紀錄與重要決策。",
      },
    },
    {
      path: "/notifications",
      name: "notifications",
      component: PlaceholderView,
      meta: { title: "通知", section: "INBOX", description: "查看指派、交接、審核與風險通知。" },
    },
    {
      path: "/settings",
      name: "settings",
      component: PlaceholderView,
      meta: { title: "設定", section: "SETTINGS", description: "管理工作區、偏好與權限設定。" },
    },
    { path: "/:pathMatch(.*)*", redirect: "/" },
  ],
  scrollBehavior: () => ({ top: 0 }),
});

export default router;
