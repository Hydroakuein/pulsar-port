<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref } from "vue";
import {
  CalendarDays,
  Megaphone,
  Pencil,
  Pin,
  Plus,
  RefreshCw,
  Save,
  Sparkles,
  Trash2,
  X,
} from "@lucide/vue";
import { gsap } from "gsap";

import appLogoUrl from "../assets/27.png";
import PageScaffold from "../components/PageScaffold.vue";
import { useAuth } from "../composables/useAuth";
import { announcementApi } from "../services/api";
import type { Announcement, AnnouncementCategory, AnnouncementInput } from "../types/api";

const { isAdmin, getAccessToken } = useAuth();
const pageRoot = ref<HTMLElement | null>(null);
const announcements = ref<Announcement[]>([]);
const activeCategory = ref<AnnouncementCategory>("announcement");
const loading = ref(true);
const saving = ref(false);
const errorMessage = ref("");
const editorOpen = ref(false);
const editingId = ref<string | null>(null);
let media: ReturnType<typeof gsap.matchMedia> | undefined;

const form = reactive<AnnouncementInput>({
  title: "",
  content: "",
  category: "announcement",
  version: null,
  pinned: false,
  published: true,
});

const visibleItems = computed(() =>
  announcements.value.filter((item) => item.category === activeCategory.value),
);

function formatDate(value: string | null): string {
  if (!value) return "尚未發布";
  return new Intl.DateTimeFormat("zh-TW", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(value));
}

async function loadAnnouncements() {
  loading.value = true;
  errorMessage.value = "";
  try {
    const token = await getAccessToken();
    const result = await announcementApi.list(token);
    announcements.value = result.announcements;
    await nextTick();
    animateCards();
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : "無法載入公告";
  } finally {
    loading.value = false;
  }
}

function animateCards() {
  if (!pageRoot.value || !media) return;
  media.add("(prefers-reduced-motion: no-preference)", () => {
    if (!pageRoot.value) return;
    gsap.from(pageRoot.value.querySelectorAll(".feed-card"), {
      autoAlpha: 0,
      y: 18,
      duration: 0.48,
      stagger: 0.07,
      ease: "power3.out",
      clearProps: "transform,visibility",
    });
  });
}

function resetForm(category: AnnouncementCategory = activeCategory.value) {
  editingId.value = null;
  Object.assign(form, {
    title: "",
    content: "",
    category,
    version: null,
    pinned: false,
    published: true,
  });
}

function openCreate() {
  resetForm();
  editorOpen.value = true;
}

function openEdit(item: Announcement) {
  editingId.value = item.id;
  Object.assign(form, {
    title: item.title,
    content: item.content,
    category: item.category,
    version: item.version,
    pinned: item.pinned,
    published: item.published,
  });
  editorOpen.value = true;
}

function closeEditor() {
  if (saving.value) return;
  editorOpen.value = false;
  resetForm();
}

async function submitAnnouncement() {
  saving.value = true;
  errorMessage.value = "";
  try {
    const token = await getAccessToken();
    if (editingId.value) {
      await announcementApi.update(editingId.value, { ...form }, token);
    } else {
      await announcementApi.create({ ...form }, token);
    }
    editorOpen.value = false;
    activeCategory.value = form.category;
    resetForm();
    await loadAnnouncements();
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : "儲存失敗";
  } finally {
    saving.value = false;
  }
}

async function removeAnnouncement(item: Announcement) {
  if (!window.confirm(`確定要刪除「${item.title}」嗎？`)) return;
  try {
    const token = await getAccessToken();
    await announcementApi.remove(item.id, token);
    await loadAnnouncements();
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : "刪除失敗";
  }
}

onMounted(() => {
  media = gsap.matchMedia();
  void loadAnnouncements();
});

onBeforeUnmount(() => media?.revert());
</script>

<template>
  <PageScaffold>
    <section ref="pageRoot" class="home-page">
      <header class="home-hero">
        <div class="home-branding">
          <img class="home-logo" :src="appLogoUrl" alt="" />
          <div>
            <p>PULSAR PORT</p>
            <h1>探波熱 <span>Pulsar-port</span></h1>
            <strong>公告與更新日誌</strong>
          </div>
        </div>

        <button v-if="isAdmin" class="primary-action" type="button" @click="openCreate">
          <Plus aria-hidden="true" />
          新增內容
        </button>
      </header>

      <div class="feed-toolbar">
        <div class="feed-tabs" role="tablist" aria-label="內容分類">
          <button
            type="button"
            role="tab"
            :aria-selected="activeCategory === 'announcement'"
            :class="{ active: activeCategory === 'announcement' }"
            @click="activeCategory = 'announcement'"
          >
            <Megaphone aria-hidden="true" />公告
          </button>
          <button
            type="button"
            role="tab"
            :aria-selected="activeCategory === 'release'"
            :class="{ active: activeCategory === 'release' }"
            @click="activeCategory = 'release'"
          >
            <Sparkles aria-hidden="true" />更新日誌
          </button>
        </div>

        <button class="refresh-action" type="button" :disabled="loading" @click="loadAnnouncements">
          <RefreshCw aria-hidden="true" />重新整理
        </button>
      </div>

      <p v-if="errorMessage" class="feed-message feed-error" role="alert">{{ errorMessage }}</p>
      <p v-else-if="loading" class="feed-message">正在載入內容…</p>

      <div v-else-if="visibleItems.length" class="feed-list">
        <article v-for="item in visibleItems" :key="item.id" class="feed-card">
          <div class="feed-card-head">
            <div class="feed-badges">
              <span v-if="item.pinned" class="badge badge-pinned"
                ><Pin aria-hidden="true" />置頂</span
              >
              <span v-if="!item.published" class="badge badge-draft">草稿</span>
              <span v-if="item.version" class="badge">{{ item.version }}</span>
            </div>

            <div v-if="isAdmin" class="card-actions">
              <button type="button" aria-label="編輯" title="編輯" @click="openEdit(item)">
                <Pencil aria-hidden="true" />
              </button>
              <button
                class="danger-action"
                type="button"
                aria-label="刪除"
                title="刪除"
                @click="removeAnnouncement(item)"
              >
                <Trash2 aria-hidden="true" />
              </button>
            </div>
          </div>

          <h2>{{ item.title }}</h2>
          <p class="feed-content">{{ item.content }}</p>
          <footer>
            <CalendarDays aria-hidden="true" />{{
              formatDate(item.published_at || item.created_at)
            }}
          </footer>
        </article>
      </div>

      <div v-else class="empty-feed">
        <component
          :is="activeCategory === 'announcement' ? Megaphone : Sparkles"
          aria-hidden="true"
        />
        <h2>{{ activeCategory === "announcement" ? "目前沒有公告" : "目前沒有更新日誌" }}</h2>
        <p>{{ isAdmin ? "可以使用右上角按鈕新增第一筆內容。" : "有新內容時會顯示在這裡。" }}</p>
      </div>

      <div v-if="editorOpen" class="editor-backdrop" @mousedown.self="closeEditor">
        <form
          class="editor-panel"
          role="dialog"
          aria-modal="true"
          @submit.prevent="submitAnnouncement"
        >
          <header>
            <div>
              <p>CONTENT EDITOR</p>
              <h2>{{ editingId ? "編輯內容" : "新增內容" }}</h2>
            </div>
            <button type="button" aria-label="關閉" @click="closeEditor">
              <X aria-hidden="true" />
            </button>
          </header>

          <div class="form-grid">
            <label>
              <span>分類</span>
              <select v-model="form.category">
                <option value="announcement">公告</option>
                <option value="release">更新日誌</option>
              </select>
            </label>
            <label>
              <span>版本號（選填）</span>
              <input v-model="form.version" type="text" maxlength="32" placeholder="例如 v0.2.0" />
            </label>
          </div>

          <label
            ><span>標題</span><input v-model="form.title" type="text" maxlength="120" required
          /></label>
          <label>
            <span>內容</span>
            <textarea v-model="form.content" rows="8" maxlength="10000" required></textarea>
          </label>

          <div class="editor-options">
            <label><input v-model="form.pinned" type="checkbox" />置頂</label>
            <label><input v-model="form.published" type="checkbox" />立即發布</label>
          </div>

          <footer>
            <button type="button" @click="closeEditor">取消</button>
            <button class="primary-action" type="submit" :disabled="saving">
              <Save aria-hidden="true" />{{ saving ? "儲存中…" : "儲存" }}
            </button>
          </footer>
        </form>
      </div>
    </section>
  </PageScaffold>
</template>

<style scoped>
.home-page {
  width: min(1120px, 100%);
  min-height: 100%;
  margin: 0 auto;
  padding: clamp(36px, 6vw, 72px);
  background: var(--surface);
}

.home-hero,
.home-branding,
.feed-toolbar,
.feed-tabs,
.feed-card-head,
.feed-badges,
.card-actions,
.editor-options,
.editor-panel > footer {
  display: flex;
  align-items: center;
}

.home-hero {
  justify-content: space-between;
  gap: 28px;
}

.home-branding {
  gap: 22px;
}

.home-logo {
  width: clamp(76px, 9vw, 108px);
  height: clamp(76px, 9vw, 108px);
  display: block;
  object-fit: contain;
}

.home-branding p,
.editor-panel header p {
  margin: 0 0 6px;
  color: var(--accent);
  font-size: 10px;
  font-weight: 850;
  letter-spacing: 0.16em;
}

.home-branding h1 {
  margin: 0;
  color: var(--ink);
  font-size: clamp(27px, 4vw, 44px);
  letter-spacing: -0.04em;
}

.home-branding h1 span {
  color: var(--muted);
  font-weight: 450;
}

.home-branding strong {
  margin-top: 8px;
  display: block;
  color: var(--muted);
  font-size: 13px;
}

.primary-action,
.refresh-action,
.feed-tabs button,
.card-actions button,
.editor-panel button {
  font: inherit;
  cursor: pointer;
}

.primary-action {
  min-height: 42px;
  padding: 0 17px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 0;
  color: #ffffff;
  background: var(--accent);
  font-size: 13px;
  font-weight: 750;
}

.primary-action svg,
.refresh-action svg,
.feed-tabs svg {
  width: 17px;
}

.feed-toolbar {
  margin-top: clamp(34px, 5vw, 54px);
  justify-content: space-between;
  gap: 20px;
  border-bottom: 1px solid var(--line);
}

.feed-tabs {
  gap: 4px;
}

.feed-tabs button,
.refresh-action {
  min-height: 42px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: 0;
  color: var(--muted);
  background: transparent;
  font-size: 13px;
  font-weight: 700;
}

.feed-tabs button {
  padding: 0 16px;
  border-bottom: 3px solid transparent;
}

.feed-tabs button.active {
  color: var(--ink);
  border-bottom-color: var(--accent);
}

.refresh-action:disabled {
  cursor: wait;
  opacity: 0.55;
}

.feed-list {
  padding: 28px 0;
  display: grid;
  gap: 16px;
}

.feed-card {
  padding: 24px 26px;
  border: 1px solid var(--line);
  background: #ffffff;
  box-shadow: 0 10px 28px rgba(47, 70, 121, 0.06);
}

.feed-card-head {
  min-height: 28px;
  justify-content: space-between;
  gap: 12px;
}

.feed-badges,
.card-actions {
  gap: 7px;
}

.badge {
  min-height: 24px;
  padding: 0 8px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: #53667d;
  background: var(--surface-muted);
  font-size: 10px;
  font-weight: 750;
}

.badge svg {
  width: 12px;
}

.badge-pinned {
  color: #3822e6;
  background: var(--accent-soft);
}

.badge-draft {
  color: #815d13;
  background: #fff1bd;
}

.card-actions button,
.editor-panel header button {
  width: 32px;
  height: 32px;
  display: grid;
  place-items: center;
  border: 0;
  color: var(--muted);
  background: transparent;
}

.card-actions button:hover {
  color: var(--ink);
  background: var(--surface-muted);
}

.card-actions .danger-action:hover {
  color: #b63737;
  background: #fff0f0;
}

.card-actions svg,
.editor-panel header button svg {
  width: 16px;
}

.feed-card h2 {
  margin: 16px 0 9px;
  color: var(--ink);
  font-size: 21px;
  letter-spacing: -0.025em;
}

.feed-content {
  margin: 0;
  color: var(--muted);
  font-size: 14px;
  line-height: 1.8;
  white-space: pre-wrap;
}

.feed-card > footer {
  margin-top: 18px;
  display: flex;
  align-items: center;
  gap: 7px;
  color: #8290a1;
  font-size: 11px;
}

.feed-card > footer svg {
  width: 14px;
}

.feed-message,
.empty-feed {
  margin: 28px 0;
  padding: 52px 24px;
  color: var(--muted);
  text-align: center;
}

.feed-error {
  color: #b63737;
  background: #fff4f4;
}

.empty-feed {
  border: 1px dashed var(--line);
}

.empty-feed > svg {
  width: 32px;
  height: 32px;
  color: var(--accent);
}

.empty-feed h2 {
  margin: 14px 0 7px;
  color: var(--ink);
  font-size: 18px;
}

.empty-feed p {
  margin: 0;
  font-size: 13px;
}

.editor-backdrop {
  position: fixed;
  z-index: 20;
  inset: 48px 0 0;
  padding: 30px;
  display: grid;
  place-items: center;
  overflow: auto;
  background: rgba(24, 34, 53, 0.34);
  backdrop-filter: blur(5px);
}

.editor-panel {
  width: min(620px, 100%);
  padding: 30px;
  border: 1px solid var(--line);
  background: #ffffff;
  box-shadow: 0 28px 70px rgba(24, 34, 53, 0.2);
}

.editor-panel > header {
  margin-bottom: 24px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.editor-panel h2 {
  margin: 0;
  color: var(--ink);
  font-size: 24px;
}

.editor-panel > label,
.form-grid label {
  margin-top: 17px;
  display: grid;
  gap: 8px;
  color: var(--ink);
  font-size: 12px;
  font-weight: 700;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.editor-panel input[type="text"],
.editor-panel select,
.editor-panel textarea {
  width: 100%;
  border: 1px solid var(--line);
  outline: 0;
  color: var(--ink);
  background: var(--surface);
  font: inherit;
}

.editor-panel input[type="text"],
.editor-panel select {
  height: 43px;
  padding: 0 12px;
}

.editor-panel textarea {
  padding: 12px;
  resize: vertical;
  line-height: 1.65;
}

.editor-panel input:focus,
.editor-panel select:focus,
.editor-panel textarea:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(56, 34, 230, 0.08);
}

.editor-options {
  margin-top: 18px;
  gap: 24px;
}

.editor-options label {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--ink);
  font-size: 12px;
  font-weight: 650;
}

.editor-panel > footer {
  margin-top: 28px;
  justify-content: flex-end;
  gap: 10px;
}

.editor-panel > footer > button:not(.primary-action) {
  min-height: 42px;
  padding: 0 17px;
  border: 1px solid var(--line);
  color: var(--ink);
  background: #ffffff;
}

@media (max-width: 760px) {
  .home-hero {
    align-items: flex-start;
  }

  .home-branding h1 span {
    display: block;
  }
}

@media (max-width: 520px) {
  .home-page {
    padding: 28px 20px 104px;
  }

  .home-hero {
    display: grid;
  }

  .form-grid {
    grid-template-columns: 1fr;
    gap: 0;
  }

  .editor-backdrop {
    padding: 16px;
  }

  .editor-panel {
    padding: 24px 20px;
  }
}
</style>
