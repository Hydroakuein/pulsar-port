<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { gsap } from "gsap";

type NavItem = {
  label: string;
  icon: string;
  badge?: number;
};

const appRoot = ref<HTMLElement | null>(null);
const activeNav = ref("總覽");
let media: ReturnType<typeof gsap.matchMedia> | undefined;

const primaryNav: NavItem[] = [
  { label: "總覽", icon: "⌂" },
  { label: "Feature", icon: "◇" },
  { label: "製作流程", icon: "⌁" },
  { label: "Asset", icon: "▦" },
  { label: "任務", icon: "✓", badge: 12 },
  { label: "團隊", icon: "◎" },
];

const secondaryNav: NavItem[] = [
  { label: "文件", icon: "▤" },
  { label: "通知", icon: "◉", badge: 3 },
  { label: "設定", icon: "⚙" },
];

const metrics = [
  { label: "整體進度", value: "68%", detail: "本週 +4.2%", tone: "violet" },
  { label: "進行中", value: "24", detail: "跨 6 個團隊", tone: "blue" },
  { label: "等待審核", value: "08", detail: "2 項已逾期", tone: "amber" },
  { label: "目前阻塞", value: "05", detail: "影響 3 個 Feature", tone: "red" },
];

const features = [
  { name: "戰鬥系統 2.0", owner: "Gameplay", progress: 78, status: "製作中", tone: "violet", due: "8 月 18 日" },
  { name: "深海遺跡地圖", owner: "World Art", progress: 64, status: "整合中", tone: "blue", due: "8 月 22 日" },
  { name: "角色：艾拉", owner: "Character", progress: 47, status: "等待中", tone: "amber", due: "8 月 29 日" },
  { name: "多人配對系統", owner: "Online", progress: 31, status: "有風險", tone: "red", due: "9 月 05 日" },
];

const handoffs = [
  { item: "艾拉・戰鬥動畫", from: "Animation", to: "Engine", wait: "等待 3 小時", tone: "blue" },
  { item: "遺跡環境材質", from: "Environment", to: "Lighting", wait: "等待 1 天", tone: "amber" },
  { item: "配對流程 UI", from: "UI/UX", to: "Frontend", wait: "等待驗收", tone: "violet" },
];

const activities = [
  { initials: "YL", name: "Yu-Lin", action: "完成了", target: "重擊動畫 V3", time: "12 分鐘前", color: "#8b7cf6" },
  { initials: "CH", name: "Chia-Hao", action: "提交審核", target: "遺跡入口光照", time: "28 分鐘前", color: "#3da9fc" },
  { initials: "MX", name: "Mia Xu", action: "更新阻塞", target: "多人連線測試", time: "1 小時前", color: "#f3a95b" },
];

onMounted(() => {
  media = gsap.matchMedia();
  media.add(
    { reduceMotion: "(prefers-reduced-motion: reduce)" },
    (context) => {
      if (context.conditions?.reduceMotion) return;

      const scope = appRoot.value;
      if (!scope) return;

      gsap.from(scope.querySelectorAll("[data-enter]"), {
        autoAlpha: 0,
        y: 16,
        duration: 0.65,
        stagger: 0.055,
        ease: "power2.out",
      });
    },
    appRoot.value ?? undefined,
  );
});

onBeforeUnmount(() => media?.revert());
</script>

<template>
  <div ref="appRoot" class="app-shell">
    <aside class="sidebar">
      <a class="brand" href="#" aria-label="Pulsar Port 首頁">
        <span class="brand-mark" aria-hidden="true"><i></i><i></i><i></i></span>
        <span>Pulsar <b>Port</b></span>
      </a>

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
        <button
          v-for="item in primaryNav"
          :key="item.label"
          type="button"
          class="nav-item"
          :class="{ active: activeNav === item.label }"
          @click="activeNav = item.label"
        >
          <span class="nav-icon" aria-hidden="true">{{ item.icon }}</span>
          <span>{{ item.label }}</span>
          <span v-if="item.badge" class="nav-badge">{{ item.badge }}</span>
        </button>

        <p class="nav-label nav-label-spaced">系統</p>
        <button
          v-for="item in secondaryNav"
          :key="item.label"
          type="button"
          class="nav-item"
          :class="{ active: activeNav === item.label }"
          @click="activeNav = item.label"
        >
          <span class="nav-icon" aria-hidden="true">{{ item.icon }}</span>
          <span>{{ item.label }}</span>
          <span v-if="item.badge" class="nav-badge">{{ item.badge }}</span>
        </button>
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
          <p class="eyebrow">NOVA ODYSSEY / ALPHA</p>
          <h1>專案總覽</h1>
        </div>
        <div class="topbar-actions">
          <button class="icon-button" type="button" aria-label="搜尋">⌕</button>
          <button class="icon-button notification-button" type="button" aria-label="通知">
            ◉<span></span>
          </button>
          <button class="primary-button" type="button"><span>＋</span> 新增工作</button>
        </div>
      </header>

      <section class="milestone-banner" data-enter>
        <div class="milestone-orbit" aria-hidden="true"><span></span></div>
        <div class="milestone-copy">
          <span class="section-kicker">下一個里程碑</span>
          <h2>Alpha Content Lock</h2>
          <p>還有 16 天 · 8 月 18 日</p>
        </div>
        <div class="milestone-progress">
          <div class="progress-meta"><span>完成進度</span><strong>68%</strong></div>
          <div class="progress-track"><span style="width: 68%"></span></div>
        </div>
        <button class="ghost-button" type="button">查看里程碑 <span>→</span></button>
      </section>

      <section class="metrics-grid" aria-label="專案指標">
        <article v-for="metric in metrics" :key="metric.label" class="metric-card" data-enter>
          <div class="metric-top">
            <span>{{ metric.label }}</span>
            <i :class="`dot dot-${metric.tone}`"></i>
          </div>
          <strong>{{ metric.value }}</strong>
          <p>{{ metric.detail }}</p>
        </article>
      </section>

      <div class="content-grid">
        <section class="panel feature-panel" data-enter>
          <div class="panel-header">
            <div><span class="section-kicker">PRODUCTION</span><h2>Feature 進度</h2></div>
            <button type="button">查看全部 →</button>
          </div>
          <div class="feature-list">
            <article v-for="feature in features" :key="feature.name" class="feature-row">
              <div class="feature-main">
                <span :class="`feature-icon feature-icon-${feature.tone}`">◇</span>
                <div><strong>{{ feature.name }}</strong><span>{{ feature.owner }}</span></div>
              </div>
              <div class="feature-progress">
                <div><span>{{ feature.progress }}%</span><i>{{ feature.due }}</i></div>
                <div class="progress-track compact"><span :class="`bar-${feature.tone}`" :style="`width: ${feature.progress}%`"></span></div>
              </div>
              <span :class="`status status-${feature.tone}`">{{ feature.status }}</span>
            </article>
          </div>
        </section>

        <section class="panel handoff-panel" data-enter>
          <div class="panel-header">
            <div><span class="section-kicker">HANDOFF</span><h2>等待交接</h2></div>
            <span class="count-pill">3</span>
          </div>
          <div class="handoff-list">
            <article v-for="handoff in handoffs" :key="handoff.item" class="handoff-row">
              <div class="handoff-head"><strong>{{ handoff.item }}</strong><span :class="`status status-${handoff.tone}`">{{ handoff.wait }}</span></div>
              <div class="handoff-route">
                <span>{{ handoff.from }}</span><i>→</i><span>{{ handoff.to }}</span>
              </div>
            </article>
          </div>
          <button class="panel-action" type="button">開啟交接中心 <span>→</span></button>
        </section>

        <section class="panel activity-panel" data-enter>
          <div class="panel-header">
            <div><span class="section-kicker">TEAM PULSE</span><h2>最新動態</h2></div>
            <button type="button">全部動態 →</button>
          </div>
          <div class="activity-list">
            <article v-for="activity in activities" :key="activity.target" class="activity-row">
              <span class="activity-avatar" :style="`--avatar-color: ${activity.color}`">{{ activity.initials }}</span>
              <p><strong>{{ activity.name }}</strong> {{ activity.action }} <b>{{ activity.target }}</b><small>{{ activity.time }}</small></p>
            </article>
          </div>
        </section>

        <section class="panel risk-panel" data-enter>
          <div class="risk-icon">!</div>
          <div><span class="section-kicker">RISK ALERT</span><h2>多人配對系統可能延誤</h2><p>後端壓力測試阻塞 2 天，預計影響 Alpha Content Lock。</p></div>
          <button type="button">查看阻塞</button>
        </section>
      </div>
    </main>
  </div>
</template>
