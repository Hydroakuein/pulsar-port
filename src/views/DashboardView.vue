<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { gsap } from "gsap";

import { dashboardSnapshot } from "../mocks/dashboard";

const viewRoot = ref<HTMLElement | null>(null);
let media: ReturnType<typeof gsap.matchMedia> | undefined;

const trendPoints = (values: number[]) =>
  values.map((value, index) => `${index * 25},${70 - value}`).join(" ");

onMounted(() => {
  media = gsap.matchMedia();
  media.add(
    { reduceMotion: "(prefers-reduced-motion: reduce)" },
    (context) => {
      if (context.conditions?.reduceMotion || !viewRoot.value) return;

      const cards = viewRoot.value.querySelectorAll<HTMLElement>("[data-enter]");
      const progressBars = viewRoot.value.querySelectorAll<HTMLElement>("[data-progress]");
      const verticalBars = viewRoot.value.querySelectorAll<HTMLElement>("[data-progress-y]");

      gsap.from(cards, {
        autoAlpha: 0,
        y: 14,
        scale: 0.992,
        duration: 0.56,
        stagger: 0.045,
        ease: "power2.out",
        clearProps: "transform,visibility",
      });

      gsap.from(progressBars, {
        scaleX: 0,
        transformOrigin: "left center",
        duration: 0.72,
        stagger: 0.06,
        ease: "power2.out",
        clearProps: "transform",
      });

      gsap.from(verticalBars, {
        scaleY: 0,
        transformOrigin: "center bottom",
        duration: 0.72,
        stagger: 0.07,
        ease: "power2.out",
        clearProps: "transform",
      });
    },
    viewRoot.value ?? undefined,
  );
});

onBeforeUnmount(() => media?.revert());
</script>

<template>
  <div ref="viewRoot" class="dashboard-bento">
    <section class="bento-card project-focus" data-enter>
      <header class="bento-header">
        <div>
          <span class="bento-kicker">PROJECT HEALTH</span>
          <h2>專案健康狀態</h2>
        </div>
        <button class="mini-action" type="button" aria-label="開啟專案詳情">
          <span class="material-symbols-rounded">open_in_new</span>
        </button>
      </header>

      <div class="focus-heading">
        <div>
          <span class="status-lozenge">ALPHA</span>
          <h3>{{ dashboardSnapshot.milestone.name }}</h3>
          <p>{{ dashboardSnapshot.milestone.dueLabel }}</p>
        </div>
        <div class="confidence-chip">
          <span></span>
          {{ dashboardSnapshot.milestone.confidence }}
        </div>
      </div>

      <div class="production-orbit" aria-hidden="true">
        <div class="orbit-ring orbit-one"></div>
        <div class="orbit-ring orbit-two"></div>
        <div class="orbit-core">68<small>%</small></div>
        <span class="orbit-dot dot-a"></span>
        <span class="orbit-dot dot-b"></span>
        <span class="orbit-dot dot-c"></span>
      </div>

      <div class="workflow-strip" aria-label="目前製作流程分布">
        <div v-for="stage in dashboardSnapshot.workflow" :key="stage.label" class="workflow-stage">
          <span :class="`stage-node tone-${stage.tone}`">{{ stage.count }}</span>
          <small>{{ stage.label }}</small>
        </div>
      </div>

      <div class="focus-progress">
        <div>
          <span>里程碑完成度</span>
          <strong>{{ dashboardSnapshot.milestone.progress }}%</strong>
        </div>
        <div class="bento-progress">
          <span data-progress :style="`width: ${dashboardSnapshot.milestone.progress}%`"></span>
        </div>
      </div>

      <footer class="focus-footer">
        <button type="button">查看里程碑</button>
        <button type="button">
          開啟風險清單 <span class="material-symbols-rounded">arrow_forward</span>
        </button>
      </footer>
    </section>

    <article
      v-for="metric in dashboardSnapshot.metrics"
      :key="metric.label"
      :class="`bento-card metric-tile tone-card-${metric.tone}`"
      data-enter
    >
      <header class="bento-header compact-header">
        <h2>{{ metric.label }}</h2>
        <button class="mini-action" type="button" :aria-label="`查看${metric.label}詳情`">
          <span class="material-symbols-rounded">open_in_new</span>
        </button>
      </header>
      <div class="metric-visual">
        <div>
          <p><span :class="`metric-dot tone-${metric.tone}`"></span>{{ metric.delta }}</p>
          <strong
            >{{ metric.value }}<small v-if="metric.unit">{{ metric.unit }}</small></strong
          >
        </div>
        <svg class="sparkline" viewBox="0 0 100 48" aria-hidden="true">
          <polyline :class="`spark-tone-${metric.tone}`" :points="trendPoints(metric.trend)" />
          <circle
            :class="`spark-tone-${metric.tone}`"
            cx="100"
            :cy="70 - metric.trend[metric.trend.length - 1]"
            r="2.8"
          />
        </svg>
      </div>
    </article>

    <section class="bento-card feature-health" data-enter>
      <header class="bento-header">
        <div>
          <span class="bento-kicker">FEATURE HEALTH</span>
          <h2>Feature 健康度</h2>
        </div>
        <button class="mini-action" type="button" aria-label="開啟 Feature">
          <span class="material-symbols-rounded">more_horiz</span>
        </button>
      </header>

      <div class="feature-score">
        <strong>24</strong>
        <span>進行中</span>
        <small>6 個團隊參與</small>
      </div>

      <div class="feature-health-list">
        <article v-for="feature in dashboardSnapshot.features" :key="feature.name">
          <div class="feature-health-meta">
            <div>
              <strong>{{ feature.name }}</strong
              ><span>{{ feature.team }}</span>
            </div>
            <div>
              <b>{{ feature.progress }}%</b
              ><small :class="`text-${feature.tone}`">{{ feature.status }}</small>
            </div>
          </div>
          <div class="bento-progress small-progress">
            <span
              data-progress
              :class="`fill-${feature.tone}`"
              :style="`width: ${feature.progress}%`"
            ></span>
          </div>
        </article>
      </div>
    </section>

    <section class="bento-card handoff-gauge" data-enter>
      <header class="bento-header">
        <div>
          <span class="bento-kicker">HANDOFF</span>
          <h2>交接等待時間</h2>
        </div>
        <button class="mini-action" type="button" aria-label="開啟交接中心">
          <span class="material-symbols-rounded">open_in_new</span>
        </button>
      </header>

      <div class="gauge-wrap">
        <svg viewBox="0 0 220 125" aria-hidden="true">
          <path class="gauge-track" pathLength="100" d="M 20 108 A 90 90 0 0 1 200 108" />
          <path class="gauge-fill" pathLength="100" d="M 20 108 A 90 90 0 0 1 200 108" />
        </svg>
        <div class="gauge-value">
          <span>平均等待</span>
          <strong>13<small>h</small></strong>
        </div>
      </div>
      <div class="gauge-footer">
        <span><i class="tone-green"></i>正常 5</span>
        <span><i class="tone-amber"></i>注意 2</span>
        <span><i class="tone-red"></i>逾時 1</span>
      </div>
    </section>

    <section class="bento-card completed-tasks" data-enter>
      <header class="bento-header compact-header">
        <div>
          <span class="bento-kicker">THIS WEEK</span>
          <h2>完成任務</h2>
        </div>
      </header>
      <div class="completed-body">
        <div>
          <strong>110</strong>
          <p><span></span>比上週多 11%</p>
        </div>
        <div class="mini-bars" aria-label="本週任務完成趨勢">
          <i style="height: 32%"></i><i style="height: 47%"></i><i style="height: 72%"></i>
          <i class="hot" style="height: 92%"></i><i class="hot" style="height: 78%"></i>
          <i style="height: 56%"></i><i style="height: 39%"></i>
        </div>
      </div>
    </section>

    <section class="bento-card team-pulse" data-enter>
      <header class="bento-header">
        <div>
          <span class="bento-kicker">TEAM PULSE</span>
          <h2>團隊信心</h2>
        </div>
        <button class="mini-action" type="button" aria-label="篩選團隊狀態">
          <span class="material-symbols-rounded">filter_list</span>
        </button>
      </header>
      <div class="pulse-chart">
        <div v-for="pulse in dashboardSnapshot.teamPulse" :key="pulse.label" class="pulse-column">
          <div class="pulse-value">
            <strong>{{ pulse.value }}<small>%</small></strong>
            <span :class="`text-${pulse.tone}`">{{ pulse.label }}</span>
          </div>
          <div class="pulse-bar-shell">
            <span
              data-progress-y
              :class="`pulse-${pulse.tone}`"
              :style="`height: ${pulse.value}%`"
            ></span>
          </div>
        </div>
      </div>
      <p class="pulse-note">12 位成員已更新今日狀態 · 3 位需要協助</p>
    </section>
  </div>
</template>
