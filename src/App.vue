<script setup lang="ts">
import { computed } from "vue";
import { RouterLink, RouterView, useRoute } from "vue-router";

type NavItem = {
  label: string;
  icon: string;
  path: string;
  badge?: number;
};

const route = useRoute();

const primaryNav: NavItem[] = [
  { label: "總覽", icon: "⌂", path: "/" },
  { label: "專案", icon: "◫", path: "/projects" },
  { label: "Feature", icon: "◇", path: "/features" },
  { label: "製作流程", icon: "⌁", path: "/workflows" },
  { label: "Asset", icon: "▦", path: "/assets" },
  { label: "任務", icon: "✓", path: "/tasks", badge: 12 },
  { label: "團隊", icon: "◎", path: "/team" },
];

const secondaryNav: NavItem[] = [
  { label: "文件", icon: "▤", path: "/documents" },
  { label: "通知", icon: "◉", path: "/notifications", badge: 3 },
  { label: "設定", icon: "⚙", path: "/settings" },
];

const pageTitle = computed(() => String(route.meta.title ?? "專案總覽"));
const pageSection = computed(() => String(route.meta.section ?? "NOVA ODYSSEY"));
</script>

<template>
  <div class="app-shell">
    <aside class="sidebar">
      <RouterLink class="brand" to="/" aria-label="Pulsar Port 首頁">
        <span class="brand-mark" aria-hidden="true"><i></i><i></i><i></i></span>
        <span>Pulsar <b>Port</b></span>
      </RouterLink>

      <div class="project-switcher">
        <span class="project-avatar">NO</span>
        <span class="project-copy">
          <small>目前專案</small>
          <strong>Nova Odyssey</strong>
        </span>
        <button type="button" aria-label="切換專案">⌄</button>
      </div>

      <nav aria-label="主要導覽">
        <p class="nav-label">工作區</p>
        <RouterLink v-for="item in primaryNav" :key="item.path" :to="item.path" class="nav-item">
          <span class="nav-icon" aria-hidden="true">{{ item.icon }}</span>
          <span>{{ item.label }}</span>
          <span v-if="item.badge" class="nav-badge">{{ item.badge }}</span>
        </RouterLink>

        <p class="nav-label nav-label-spaced">系統</p>
        <RouterLink v-for="item in secondaryNav" :key="item.path" :to="item.path" class="nav-item">
          <span class="nav-icon" aria-hidden="true">{{ item.icon }}</span>
          <span>{{ item.label }}</span>
          <span v-if="item.badge" class="nav-badge">{{ item.badge }}</span>
        </RouterLink>
      </nav>

      <div class="sidebar-footer">
        <div class="avatar">CL</div>
        <div>
          <strong>Choco Lin</strong>
          <span>Project Lead</span>
        </div>
        <button type="button" aria-label="帳號選單">•••</button>
      </div>
    </aside>

    <main class="workspace">
      <header class="topbar">
        <div>
          <p class="eyebrow">{{ pageSection }}</p>
          <h1>{{ pageTitle }}</h1>
        </div>
        <div class="topbar-actions">
          <button class="icon-button" type="button" aria-label="搜尋">⌕</button>
          <RouterLink class="icon-button notification-button" to="/notifications" aria-label="通知">
            ◉<span></span>
          </RouterLink>
          <button class="primary-button" type="button"><span>＋</span> 新增工作</button>
        </div>
      </header>

      <RouterView v-slot="{ Component }">
        <Transition name="page" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>
  </div>
</template>
