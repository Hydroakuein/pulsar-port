import { createRouter, createWebHistory } from "vue-router";

import { initializeAuth, useAuth } from "../composables/useAuth";
import ArtAssetsView from "../views/ArtAssetsView.vue";
import GitRoadmapView from "../views/GitRoadmapView.vue";
import HomeView from "../views/HomeView.vue";
import LoginView from "../views/LoginView.vue";
import LoreView from "../views/LoreView.vue";
import SharedNotebookView from "../views/SharedNotebookView.vue";
import TutorialResourcesView from "../views/TutorialResourcesView.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
      meta: { title: "首頁" },
    },
    {
      path: "/login",
      name: "login",
      component: LoginView,
      meta: { title: "登入", public: true },
    },
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
    {
      path: "/tutorial-resources",
      name: "tutorial-resources",
      component: TutorialResourcesView,
      meta: { title: "教學資源" },
    },
    { path: "/:pathMatch(.*)*", redirect: "/" },
  ],
  scrollBehavior: () => ({ top: 0 }),
});

router.beforeEach(async (to) => {
  await initializeAuth();
  const { isAuthenticated } = useAuth();

  if (to.meta.public) return isAuthenticated.value ? { path: "/" } : true;
  if (!isAuthenticated.value) return { path: "/login", query: { redirect: to.fullPath } };
  return true;
});

export default router;
