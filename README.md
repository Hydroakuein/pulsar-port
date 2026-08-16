# 探波熱 Pulsar-port

Pulsar Port 是遊戲製作團隊使用的桌面工作區。目前專案聚焦四個前端功能入口：

- 美術素材瀏覽
- Git 版控狀態路線圖
- Lore 二進制資產版控管理
- 共享筆記本
- 教學資源

<img width="1794" height="1118" alt="image" src="https://github.com/user-attachments/assets/cdf0c9c0-c619-44ba-b9fb-1cf31815257d" />

## 技術基礎

- Vue 3、TypeScript、Vite
- Vue Router
- Tauri 2
- Cloudflare Workers
- Supabase Auth 與 PostgreSQL
- GSAP

## 環境需求

- Node.js 22 LTS
- npm 10 或更新版本
- Rust stable 與 Tauri 2 的平台相依套件（桌面開發需要）

## 專案結構

```text
src/                 Vue 前端
src/assets           ignoredone製作的vol.4圖標
src/components/      共用畫面元件
src/views/           四個功能頁面
src/router/          前端路由
src-tauri/           Tauri 桌面應用
worker/              Cloudflare Worker API 與 Supabase migration
.github/workflows/   Pull Request 品質檢查
```

## 安裝與開發

```bash
npm install
npm --prefix worker install
npm run dev
```

啟動桌面 App：

```bash
npm run tauri dev
```

## Supabase 設定

1. 在 Supabase 建立專案。
2. 到 SQL Editor 執行 [`worker/migrations/0001_auth_and_announcements.sql`](./worker/migrations/0001_auth_and_announcements.sql)。
3. 在 Authentication > Users 建立團隊帳號。
4. 修改並執行 [`worker/seed.example.sql`](./worker/seed.example.sql)，將第一位使用者設為 `admin`。
5. 從 Project Settings > API Keys 取得 Project URL 與 publishable key。

本機 Worker 設定：

```powershell
Copy-Item worker/.dev.vars.example worker/.dev.vars
```

將 `worker/.dev.vars` 中的 placeholder 換成 Supabase Project URL 與 publishable key。不要把 `.dev.vars`、refresh token 或 secret key 提交到 Git。

## 本機完整開發

先啟動 Worker：

```powershell
npm run worker:dev
```

根目錄建立 `.env`：

```env
VITE_API_BASE_URL=http://localhost:8787
```

另一個終端啟動桌面 App：

```powershell
npm run tauri dev
```

## 部署 Worker

把正式 Supabase URL 與 publishable key 填入 `worker/wrangler.jsonc`，然後執行：

```powershell
cd worker
npx wrangler login
npx wrangler deploy
```

將部署後的 Worker URL 寫入根目錄 `.env.production`：

```env
VITE_API_BASE_URL=https://pulsar-port-api.<subdomain>.workers.dev
```

App 不會直接連線 Supabase。登入、JWT 驗證與公告存取一律經過 Worker；資料表 RLS 會再次檢查使用者角色。

## 品質檢查

執行前端 Lint、型別檢查、格式檢查與建置：

```bash
npm run check
```

檢查 Tauri Rust crate：

```bash
npm run check:rust
```

檢查 Cloudflare Worker：

```bash
npm run check:worker
```

一次執行所有檢查：

```bash
npm run check:all
```

開發規範請參考 [CONTRIBUTING.md](./CONTRIBUTING.md)。
