<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { gsap } from "gsap";
import { Code2, Palette } from "@lucide/vue";

import PageScaffold from "../components/PageScaffold.vue";

const resourceGrid = ref<HTMLElement | null>(null);
let media: ReturnType<typeof gsap.matchMedia> | undefined;

const animateCard = (event: MouseEvent | FocusEvent, active: boolean) => {
  const card = event.currentTarget as HTMLElement;

  gsap.to(card, {
    y: active ? -6 : 0,
    scale: active ? 1.012 : 1,
    duration: active ? 0.24 : 0.32,
    ease: active ? "power2.out" : "power3.out",
    overwrite: "auto",
  });
};

onMounted(() => {
  media = gsap.matchMedia();
  media.add("(prefers-reduced-motion: no-preference)", () => {
    if (!resourceGrid.value) return;

    gsap.from(resourceGrid.value.querySelectorAll(".resource-card"), {
      autoAlpha: 0,
      y: 28,
      duration: 0.62,
      stagger: 0.1,
      ease: "power3.out",
      clearProps: "transform,visibility",
    });
  });
});

onBeforeUnmount(() => media?.revert());
</script>

<template>
  <PageScaffold>
    <div class="tutorial-page">
      <header class="tutorial-heading">
        <span class="eyebrow">LEARNING HUB</span>
        <h1>教學資源</h1>
        <p>從你想探索的方向開始，找到適合團隊工作流程的學習內容。</p>
      </header>

      <div ref="resourceGrid" class="resource-grid">
        <article
          class="resource-card art-card"
          tabindex="0"
          @mouseenter="animateCard($event, true)"
          @mouseleave="animateCard($event, false)"
          @focus="animateCard($event, true)"
          @blur="animateCard($event, false)"
        >
          <div class="card-icon" aria-hidden="true">
            <Palette />
          </div>
          <div class="card-copy">
            <span class="card-index">01</span>
            <h2>美術向</h2>
            <p>視覺設計、素材製作與美術工作流程。</p>
          </div>
          <span class="card-decoration" aria-hidden="true"></span>
        </article>

        <article
          class="resource-card code-card"
          tabindex="0"
          @mouseenter="animateCard($event, true)"
          @mouseleave="animateCard($event, false)"
          @focus="animateCard($event, true)"
          @blur="animateCard($event, false)"
        >
          <div class="card-icon" aria-hidden="true">
            <Code2 />
          </div>
          <div class="card-copy">
            <span class="card-index">02</span>
            <h2>編程向</h2>
            <p>程式開發、工具運用與協作實務。</p>
          </div>
          <span class="card-decoration" aria-hidden="true"></span>
        </article>
      </div>
    </div>
  </PageScaffold>
</template>

<style scoped>
.tutorial-page {
  width: min(1120px, 100%);
  min-height: 100%;
  margin: 0 auto;
  padding: clamp(48px, 8vw, 92px) clamp(24px, 6vw, 72px);
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.tutorial-heading {
  max-width: 620px;
  margin-bottom: clamp(34px, 5vw, 56px);
}

.eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #526fa8;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.18em;
}

.eyebrow::before {
  width: 24px;
  height: 2px;
  background: var(--accent);
  content: "";
}

h1 {
  margin: 12px 0 12px;
  color: var(--ink);
  font-size: clamp(34px, 5vw, 56px);
  line-height: 1.05;
  letter-spacing: -0.04em;
}

.tutorial-heading p {
  margin: 0;
  color: var(--muted);
  font-size: 15px;
  line-height: 1.8;
}

.resource-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: clamp(18px, 3vw, 30px);
}

.resource-card {
  position: relative;
  min-height: clamp(260px, 32vw, 350px);
  padding: clamp(26px, 4vw, 42px);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
  border: 1px solid var(--line);
  border-radius: 24px;
  background: var(--surface-muted);
  box-shadow: 0 14px 38px rgba(47, 70, 121, 0.08);
  transform-origin: center bottom;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.resource-card:hover,
.resource-card:focus-visible {
  border-color: #8196d4;
  box-shadow: 0 22px 48px rgba(47, 70, 121, 0.14);
}

.resource-card:focus-visible {
  outline: 2px solid var(--green);
  outline-offset: 3px;
}

.art-card {
  background: linear-gradient(145deg, #f9fdff 0%, #e9f1fa 100%);
}

.code-card {
  background: linear-gradient(145deg, #f5ffff 0%, #dff3f4 100%);
}

.card-icon {
  position: relative;
  z-index: 1;
  width: 54px;
  height: 54px;
  display: grid;
  place-items: center;
  border: 1px solid rgba(56, 34, 230, 0.12);
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.72);
}

.card-icon svg {
  width: 27px;
  height: 27px;
  stroke-width: 1.8;
}

.art-card .card-icon {
  background: var(--accent-soft);
  color: #3822e6;
}

.code-card .card-icon {
  color: #194f67;
  background: #c9faef;
}

.card-copy {
  position: relative;
  z-index: 1;
}

.card-index {
  color: #7d91a9;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.15em;
}

h2 {
  margin: 8px 0 10px;
  color: var(--ink);
  font-size: clamp(30px, 4vw, 44px);
  line-height: 1.1;
  letter-spacing: -0.035em;
}

.card-copy p {
  margin: 0;
  color: var(--muted);
  font-size: 14px;
  line-height: 1.7;
}

.card-decoration {
  position: absolute;
  top: -70px;
  right: -60px;
  width: 190px;
  height: 190px;
  border: 1px solid rgba(56, 34, 230, 0.1);
  border-radius: 50%;
  box-shadow:
    0 0 0 28px rgba(255, 255, 255, 0.3),
    0 0 0 56px rgba(255, 255, 255, 0.16);
}

@media (max-width: 760px) {
  .tutorial-page {
    justify-content: flex-start;
  }

  .resource-grid {
    grid-template-columns: 1fr;
  }

  .resource-card {
    min-height: 240px;
  }
}

@media (max-width: 520px) {
  .tutorial-page {
    padding: 36px 20px 104px;
  }

  .tutorial-heading {
    margin-bottom: 28px;
  }

  .resource-card {
    min-height: 220px;
    border-radius: 20px;
  }
}
</style>
