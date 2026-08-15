<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
import { getCurrentWindow } from "@tauri-apps/api/window";

type NavItem = {
  label: string;
  icon: string;
  path: string;
};

const appWindow = getCurrentWindow();

const navigation: NavItem[] = [
  { label: "美術素材瀏覽", icon: "category", path: "/art-assets" },
  { label: "Git 版控狀態路線圖", icon: "account_tree", path: "/git-roadmap" },
  { label: "Lore", icon: "deployed_code", path: "/lore" },
  { label: "共享筆記本", icon: "description", path: "/notebook" },
];

const runWindowAction = async (action: () => Promise<void>) => {
  try {
    await action();
  } catch {
    // Browser previews do not expose Tauri window controls.
  }
};

const minimizeWindow = () => runWindowAction(() => appWindow.minimize());
const toggleMaximizeWindow = () => runWindowAction(() => appWindow.toggleMaximize());
const closeWindow = () => runWindowAction(() => appWindow.close());
</script>

<template>
  <div class="window-stage">
    <div class="app-window">
      <header class="titlebar" data-tauri-drag-region>
        <RouterLink class="brand" to="/art-assets" aria-label="Pulsar Port 首頁">
          <span class="brand-mark" aria-hidden="true"><i></i><i></i><i></i></span>
          <strong>Pulsar Port</strong>
        </RouterLink>

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

      <div class="app-shell">
        <aside class="sidebar">
          <nav aria-label="主要導覽">
            <RouterLink v-for="item in navigation" :key="item.path" :to="item.path">
              <span class="material-symbols-rounded" aria-hidden="true">{{ item.icon }}</span>
              <span>{{ item.label }}</span>
            </RouterLink>
          </nav>
        </aside>

        <main class="workspace"><RouterView /></main>
      </div>
    </div>
  </div>
</template>
