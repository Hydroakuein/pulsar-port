# 探波熱 Pulsar-port

Pulsar Port 是為遊戲開發團隊設計的製作管理工作區，聚焦 Feature、Asset、跨團隊交接、阻塞與里程碑風險。
<img width="1812" height="1140" alt="polsar-port-concept" src="https://github.com/user-attachments/assets/2b15e0b9-ffe5-4edc-b17d-024bcfab2896" />

## 技術基礎

- Vue 3、TypeScript、Vite
- Tauri 2
- GSAP
- Cloudflare Workers、Hono、Zod
- Vitest

## 環境需求

- Node.js 22 LTS
- npm 10 或更新版本
- Rust stable 與 Tauri 2 的平台相依套件（只有桌面開發需要）
- Cloudflare 帳號（只有 Preview 或 Production 部署需要）

## 專案結構

```text
src/                 Vue 前端
src/lib/             前端服務與型別安全 API Client
src-tauri/           Tauri 桌面程式
shared/              前後端共用 Zod Schema 與 API 型別
worker/              Cloudflare Worker + Hono API
.github/workflows/   Pull Request 品質檢查
```

## 安裝

```bash
npm install
```

複製公開的前端環境範本：

```powershell
Copy-Item .env.example .env.local
```

macOS 或 Linux：

```bash
cp .env.example .env.local
```

`.env.local` 的 `VITE_API_BASE_URL` 預設指向本機 Worker。所有 `VITE_` 變數都會進入前端 Bundle，不可放置密碼或 Token。

## 本機開發

分別開啟兩個終端機。

啟動 API：

```bash
npm run dev:api
```

API 預設位於 `http://127.0.0.1:8787`，可檢查：

```text
GET http://127.0.0.1:8787/health
GET http://127.0.0.1:8787/api/v1/health
```

啟動網頁前端：

```bash
npm run dev:web
```

啟動桌面 App：

```bash
npm run tauri dev
```

若後續加入資料庫密碼等本機 Worker Secret，將 `worker/.dev.vars.example` 複製為 `worker/.dev.vars`。範本檔不可填入真實憑證。

## 品質檢查

單一指令會依序執行 ESLint、前後端 TypeScript、Vitest、Prettier 檢查與前端建置：

```bash
npm run check
```

Tauri Rust 檢查：

```bash
npm run check:rust
```

一次執行前端、API 與 Rust 的完整檢查：

```bash
npm run check:all
```

安裝 Repository 的 pre-commit hook：

```bash
npm run hooks:install
```

GitHub Pull Request 會自動執行前述 JavaScript/TypeScript 品質閘門與 `cargo check`。

## API 約定

成功回應：

```json
{
  "success": true,
  "data": {}
}
```

列表回應會額外提供 `pagination`，包含 `page`、`pageSize`、`totalItems` 與 `totalPages`。

錯誤回應：

```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "The requested resource was not found.",
    "requestId": "00000000-0000-4000-8000-000000000000"
  }
}
```

每個 API 回應都包含 `X-Request-Id`，Worker 以 JSON 記錄 method、path、status 與 duration。日誌不可包含 Token、密碼或完整個人資料。

## 環境與部署

`worker/wrangler.jsonc` 定義三個環境：

- 預設設定：本機開發
- `preview`：測試環境
- `production`：正式環境

部署前必須把 Wrangler 內的範例 CORS 網域換成實際網域，並設定 `CLOUDFLARE_ACCOUNT_ID` 與 `CLOUDFLARE_API_TOKEN`。

```bash
npm run deploy:api:preview
npm run deploy:api:production
```

正式憑證應透過 Cloudflare Secrets 或 CI Secret 管理，不可寫入 Git。

## 常見問題

- 前端顯示 API 連線失敗：確認 `npm run dev:api` 正在執行，並核對 `.env.local` 的 `VITE_API_BASE_URL`。
- 瀏覽器回報 CORS：本機前端應使用 `http://localhost:1420`；其他來源需同步調整 Wrangler 的 `CORS_ORIGIN`。
- Tauri 無法編譯：依照 Tauri 2 官方文件安裝 Windows WebView2、C++ Build Tools 或目標平台套件。
- Wrangler 無法部署：先確認 Cloudflare Account ID、API Token 權限與目標環境名稱。

開發規範、分支與 Commit 命名請參考 [CONTRIBUTING.md](./CONTRIBUTING.md)。
