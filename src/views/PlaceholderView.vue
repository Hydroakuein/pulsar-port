<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const title = computed(() => String(route.meta.title ?? "頁面"));
const description = computed(() => String(route.meta.description ?? "此功能正在規劃中。"));
</script>

<template>
  <section class="placeholder-view">
    <div class="placeholder-visual" aria-hidden="true"><span></span><span></span><span></span></div>
    <span class="placeholder-badge">ROADMAP / MVP</span>
    <h2>{{ title }}</h2>
    <p>{{ description }}</p>
    <div class="placeholder-note">
      <span>建置準備中</span>
      <small>頁面路由與產品骨架已完成，下一階段會接上正式資料與操作流程。</small>
    </div>
  </section>
</template>
