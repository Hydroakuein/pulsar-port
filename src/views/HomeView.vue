<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { gsap } from "gsap";

import PageScaffold from "../components/PageScaffold.vue";
import appLogoUrl from "../assets/27.png";

const homeContent = ref<HTMLElement | null>(null);
let media: ReturnType<typeof gsap.matchMedia> | undefined;

onMounted(() => {
  media = gsap.matchMedia();
  media.add("(prefers-reduced-motion: no-preference)", () => {
    if (!homeContent.value) return;

    gsap.from(homeContent.value.querySelectorAll(".home-enter"), {
      autoAlpha: 0,
      y: 22,
      scale: 0.96,
      duration: 0.7,
      stagger: 0.12,
      ease: "power3.out",
      clearProps: "transform,visibility",
    });
  });
});

onBeforeUnmount(() => media?.revert());
</script>

<template>
  <PageScaffold>
    <section class="home-page">
      <div ref="homeContent" class="home-content">
        <img class="home-logo home-enter" :src="appLogoUrl" alt="" />
        <h1 class="home-title home-enter">探波熱 <span>Pulsar-port</span></h1>
      </div>
    </section>
  </PageScaffold>
</template>

<style scoped>
.home-page {
  position: relative;
  width: 100%;
  min-height: 100%;
  display: grid;
  place-items: center;
  overflow: hidden;
  background: var(--surface);
}

.home-page::before,
.home-page::after {
  position: absolute;
  width: min(24vw, 320px);
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--line));
  content: "";
}

.home-page::before {
  top: 24%;
  left: 0;
}

.home-page::after {
  right: 0;
  bottom: 24%;
  transform: rotate(180deg);
}

.home-content {
  position: relative;
  z-index: 1;
  padding: 48px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.home-logo {
  width: clamp(150px, 20vw, 230px);
  height: clamp(150px, 20vw, 230px);
  display: block;
  object-fit: contain;
}

.home-title {
  margin: 28px 0 0;
  color: var(--ink);
  font-size: clamp(24px, 3vw, 38px);
  font-weight: 750;
  line-height: 1.2;
  letter-spacing: -0.025em;
}

.home-title span {
  color: var(--muted);
  font-weight: 500;
}

@media (max-width: 520px) {
  .home-content {
    padding-bottom: 112px;
  }

  .home-title span {
    display: block;
    margin-top: 8px;
  }
}
</style>
