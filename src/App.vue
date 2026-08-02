<script setup lang="ts">
import { computed } from "vue";
import { RouterLink, RouterView, useRoute } from "vue-router";
import { getCurrentWindow } from "@tauri-apps/api/window";

type NavItem = { label: string; icon: string; path: string; badge?: number };

const route = useRoute();
const appWindow = getCurrentWindow();

const primaryNav: NavItem[] = [
  { label: "總覽", icon: "dashboard", path: "/" },
  { label: "專案", icon: "folder", path: "/projects" },
  { label: "Feature", icon: "deployed_code", path: "/features" },
  { label: "製作流程", icon: "account_tree", path: "/workflows" },
  { label: "Asset", icon: "category", path: "/assets" },
  { label: "任務", icon: "task_alt", path: "/tasks", badge: 12 },
  { label: "跨團隊交接", icon: "swap_horiz", path: "/handoffs", badge: 8 },
  { label: "阻塞中心", icon: "warning", path: "/blockers", badge: 5 },
  { label: "團隊", icon: "groups", path: "/team" },
];

const secondaryNav: NavItem[] = [
  { label: "文件", icon: "description", path: "/documents" },
  { label: "通知", icon: "notifications", path: "/notifications", badge: 3 },
  { label: "設定", icon: "settings", path: "/settings" },
];

const quickNav = [
  { label: "總覽", path: "/" },
  { label: "Feature", path: "/features" },
  { label: "製作流程", path: "/workflows" },
  { label: "Asset", path: "/assets" },
  { label: "交接", path: "/handoffs" },
];

const pageTitle = computed(() => String(route.meta.title ?? "專案總覽"));
const pageSection = computed(() => String(route.meta.section ?? "NOVA ODYSSEY"));

const runWindowAction = async (action: () => Promise<void>) => {
  try {
    await action();
  } catch {
    // Window controls are inert when the Vue app is previewed outside Tauri.
  }
};

const minimizeWindow = () => runWindowAction(() => appWindow.minimize());
const toggleMaximizeWindow = () => runWindowAction(() => appWindow.toggleMaximize());
const closeWindow = () => runWindowAction(() => appWindow.close());
</script>

<template>
  <div class="window-stage">
    <div class="app-window">
      <header class="custom-titlebar" data-tauri-drag-region>
        <div class="titlebar-brand" data-tauri-drag-region>
          <span class="brand-mark titlebar-mark" aria-hidden="true"><i></i><i></i><i></i></span>
          <strong data-tauri-drag-region>Pulsar Port</strong>
        </div>
        <div class="titlebar-context" data-tauri-drag-region>
          <span data-tauri-drag-region>Nova Odyssey</span>
          <i data-tauri-drag-region></i>
          <small data-tauri-drag-region>ALPHA</small>
        </div>
        <div class="window-controls">
          <button type="button" aria-label="最小化視窗" @click="minimizeWindow">
            <span class="material-symbols-rounded">minimize</span>
          </button>
          <button type="button" aria-label="最大化或還原視窗" @click="toggleMaximizeWindow">
            <span class="material-symbols-rounded">crop_square</span>
          </button>
          <button class="close-control" type="button" aria-label="關閉視窗" @click="closeWindow">
            <span class="material-symbols-rounded">close</span>
          </button>
        </div>
      </header>

      <div class="app-shell compact-shell window-content-shell">
        <aside class="sidebar tool-rail">
          <RouterLink class="brand rail-brand" to="/" aria-label="Pulsar Port 首頁">
            <span class="brand-mark" aria-hidden="true"><i></i><i></i><i></i></span>
          </RouterLink>

          <RouterLink
            class="project-avatar rail-project"
            to="/projects"
            aria-label="目前專案 Nova Odyssey"
            >NO</RouterLink
          >

          <nav class="rail-nav" aria-label="主要導覽">
            <RouterLink
              v-for="item in primaryNav"
              :key="item.path"
              :to="item.path"
              class="nav-item rail-item"
              :data-label="item.label"
              :aria-label="item.label"
            >
              <span class="nav-icon material-symbols-rounded" aria-hidden="true">{{
                item.icon
              }}</span>
              <span v-if="item.badge" class="rail-badge">{{ item.badge }}</span>
            </RouterLink>
          </nav>

          <nav class="rail-nav rail-nav-secondary" aria-label="系統導覽">
            <RouterLink
              v-for="item in secondaryNav"
              :key="item.path"
              :to="item.path"
              class="nav-item rail-item"
              :data-label="item.label"
              :aria-label="item.label"
            >
              <span class="nav-icon material-symbols-rounded" aria-hidden="true">{{
                item.icon
              }}</span>
              <span v-if="item.badge" class="rail-badge">{{ item.badge }}</span>
            </RouterLink>
          </nav>

          <RouterLink class="avatar rail-avatar" to="/settings" aria-label="Choco Lin 帳號設定"
            >CL</RouterLink
          >
        </aside>

        <main class="workspace control-workspace">
          <header class="topbar control-topbar">
            <div class="topbar-heading">
              <p class="eyebrow">{{ pageSection }}</p>
              <h1>{{ pageTitle }}</h1>
            </div>

            <nav class="quick-nav" aria-label="快速功能導覽">
              <RouterLink v-for="item in quickNav" :key="item.path" :to="item.path">{{
                item.label
              }}</RouterLink>
            </nav>

            <div class="topbar-actions">
              <button class="icon-button" type="button" aria-label="搜尋">
                <span class="material-symbols-rounded">search</span>
              </button>
              <RouterLink
                class="icon-button notification-button"
                to="/notifications"
                aria-label="通知"
              >
                <span class="material-symbols-rounded">notifications</span><i></i>
              </RouterLink>
              <button class="primary-button" type="button">
                <span class="material-symbols-rounded">add</span>新增工作
              </button>
            </div>
          </header>

          <RouterView v-slot="{ Component }">
            <Transition name="page" mode="out-in">
              <component :is="Component" />
            </Transition>
          </RouterView>
        </main>
      </div>
    </div>
  </div>
</template>
