<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
import { useRouter } from "vue-router";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { BookOpen, Box, FileText, GitFork, LogOut, Minus, Shapes, Square, X } from "@lucide/vue";
import type { Component } from "vue";
import appIconUrl from "./assets/27.png";
import { useAuth } from "./composables/useAuth";

type NavItem = {
  label: string;
  icon: Component;
  path: string;
};

const appWindow = getCurrentWindow();
const router = useRouter();
const { state: authState, logout } = useAuth();

const navigation: NavItem[] = [
  { label: "美術素材瀏覽", icon: Shapes, path: "/art-assets" },
  { label: "Git 版控狀態路線圖", icon: GitFork, path: "/git-roadmap" },
  { label: "Lore", icon: Box, path: "/lore" },
  { label: "共享筆記本", icon: FileText, path: "/notebook" },
  { label: "教學資源", icon: BookOpen, path: "/tutorial-resources" },
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

const handleLogout = () => {
  logout();
  void router.replace("/login");
};
</script>

<template>
  <div class="window-stage">
    <div class="app-window">
      <header class="titlebar" data-tauri-drag-region>
        <div class="brand">
          <RouterLink
            v-if="authState.user"
            class="brand-home"
            to="/"
            aria-label="返回 Pulsar Port 首頁"
          >
            <img class="brand-icon" :src="appIconUrl" alt="" />
          </RouterLink>
          <img v-else class="brand-icon" :src="appIconUrl" alt="" />
          <strong>Pulsar Port</strong>
        </div>

        <div class="window-controls">
          <button type="button" aria-label="最小化視窗" @click="minimizeWindow">
            <Minus aria-hidden="true" />
          </button>
          <button type="button" aria-label="最大化或還原視窗" @click="toggleMaximizeWindow">
            <Square aria-hidden="true" />
          </button>
          <button class="close-control" type="button" aria-label="關閉視窗" @click="closeWindow">
            <X aria-hidden="true" />
          </button>
        </div>
      </header>

      <div class="app-shell" :class="{ 'app-shell-auth': !authState.user }">
        <aside v-if="authState.user" class="sidebar">
          <nav aria-label="主要導覽">
            <RouterLink v-for="item in navigation" :key="item.path" :to="item.path">
              <component :is="item.icon" class="nav-icon" aria-hidden="true" />
              <span>{{ item.label }}</span>
            </RouterLink>
          </nav>

          <div class="sidebar-account">
            <div>
              <span>{{ authState.user.role === "admin" ? "管理員" : "成員" }}</span>
              <strong>{{ authState.user.email }}</strong>
            </div>
            <button type="button" aria-label="登出" title="登出" @click="handleLogout">
              <LogOut aria-hidden="true" />
            </button>
          </div>
        </aside>

        <main class="workspace"><RouterView /></main>
      </div>
    </div>
  </div>
</template>
