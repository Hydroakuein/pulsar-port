import { createRouter, createWebHistory } from "vue-router";

import ArtAssetsView from "../views/ArtAssetsView.vue";
import GitRoadmapView from "../views/GitRoadmapView.vue";
import LoreView from "../views/LoreView.vue";
import SharedNotebookView from "../views/SharedNotebookView.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", redirect: "/art-assets" },
    {
      path: "/art-assets",
      name: "art-assets",
      component: ArtAssetsView,
      meta: { title: "美術素材瀏覽" },
    },
    {
      path: "/git-roadmap",
      name: "git-roadmap",
      component: GitRoadmapView,
      meta: { title: "Git 版控狀態路線圖" },
    },
    {
      path: "/lore",
      name: "lore",
      component: LoreView,
      meta: { title: "Lore" },
    },
    {
      path: "/notebook",
      name: "notebook",
      component: SharedNotebookView,
      meta: { title: "共享筆記本" },
    },
    { path: "/:pathMatch(.*)*", redirect: "/art-assets" },
  ],
  scrollBehavior: () => ({ top: 0 }),
});

export default router;
