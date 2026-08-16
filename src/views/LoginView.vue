<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { LockKeyhole, LogIn, Mail } from "@lucide/vue";
import { gsap } from "gsap";

import appLogoUrl from "../assets/27.png";
import { useAuth } from "../composables/useAuth";

const email = ref("");
const password = ref("");
const errorMessage = ref("");
const formRoot = ref<HTMLElement | null>(null);
const router = useRouter();
const { state, login } = useAuth();
let media: ReturnType<typeof gsap.matchMedia> | undefined;

async function submit() {
  errorMessage.value = "";
  try {
    await login(email.value.trim(), password.value);
    await router.replace("/");
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : "登入失敗";
  }
}

onMounted(() => {
  media = gsap.matchMedia();
  media.add("(prefers-reduced-motion: no-preference)", () => {
    if (!formRoot.value) return;
    gsap.from(formRoot.value, {
      autoAlpha: 0,
      y: 18,
      duration: 0.55,
      ease: "power3.out",
      clearProps: "transform,visibility",
    });
  });
});

onBeforeUnmount(() => media?.revert());
</script>

<template>
  <section class="login-page">
    <form ref="formRoot" class="login-panel" @submit.prevent="submit">
      <img class="login-logo" :src="appLogoUrl" alt="" />
      <div class="login-heading">
        <p>PULSAR PORT</p>
        <h1>登入工作區</h1>
        <span>使用團隊帳號繼續</span>
      </div>

      <label>
        <span>Email</span>
        <span class="field-control">
          <Mail aria-hidden="true" />
          <input v-model="email" type="email" autocomplete="username" required />
        </span>
      </label>

      <label>
        <span>密碼</span>
        <span class="field-control">
          <LockKeyhole aria-hidden="true" />
          <input v-model="password" type="password" autocomplete="current-password" required />
        </span>
      </label>

      <p v-if="errorMessage" class="login-error" role="alert">{{ errorMessage }}</p>

      <button class="login-submit" type="submit" :disabled="state.loading">
        <LogIn aria-hidden="true" />
        {{ state.loading ? "登入中…" : "登入" }}
      </button>
    </form>
  </section>
</template>

<style scoped>
.login-page {
  width: 100%;
  height: 100%;
  min-height: 0;
  display: grid;
  place-items: center;
  overflow: auto;
  padding: 32px;
  background: var(--surface);
}

.login-panel {
  width: min(410px, 100%);
  padding: 42px;
  border: 1px solid var(--line);
  background: #ffffff;
  box-shadow: var(--shadow);
}

.login-logo {
  width: 78px;
  height: 78px;
  display: block;
  object-fit: contain;
}

.login-heading {
  margin: 24px 0 30px;
}

.login-heading p {
  margin: 0 0 8px;
  color: var(--accent);
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.16em;
}

.login-heading h1 {
  margin: 0 0 8px;
  color: var(--ink);
  font-size: 30px;
  letter-spacing: -0.035em;
}

.login-heading span {
  color: var(--muted);
  font-size: 14px;
}

label {
  margin-top: 18px;
  display: grid;
  gap: 8px;
  color: var(--ink);
  font-size: 13px;
  font-weight: 650;
}

.field-control {
  height: 48px;
  padding: 0 14px;
  display: flex;
  align-items: center;
  gap: 10px;
  border: 1px solid var(--line);
  background: var(--surface);
}

.field-control:focus-within {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(56, 34, 230, 0.09);
}

.field-control svg {
  width: 18px;
  color: var(--muted);
}

input {
  width: 100%;
  border: 0;
  outline: 0;
  color: var(--ink);
  background: transparent;
  font: inherit;
}

.login-error {
  margin: 16px 0 0;
  color: #b63737;
  font-size: 13px;
  line-height: 1.5;
}

.login-submit {
  width: 100%;
  height: 48px;
  margin-top: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  border: 0;
  color: #ffffff;
  background: var(--accent);
  font-weight: 700;
  cursor: pointer;
}

.login-submit:disabled {
  cursor: wait;
  opacity: 0.65;
}

.login-submit svg {
  width: 18px;
}

@media (max-width: 520px) {
  .login-page {
    padding: 20px;
  }

  .login-panel {
    padding: 30px 24px;
  }
}
</style>
