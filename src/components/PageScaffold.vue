<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { gsap } from "gsap";

const root = ref<HTMLElement | null>(null);
let media: ReturnType<typeof gsap.matchMedia> | undefined;

onMounted(() => {
  media = gsap.matchMedia();
  media.add("(prefers-reduced-motion: no-preference)", () => {
    if (!root.value) return;

    gsap.from(root.value, {
      autoAlpha: 0,
      y: 12,
      duration: 0.42,
      ease: "power2.out",
      clearProps: "transform,visibility",
    });
  });
});

onBeforeUnmount(() => media?.revert());
</script>

<template>
  <section ref="root" class="page-scaffold"><slot /></section>
</template>
