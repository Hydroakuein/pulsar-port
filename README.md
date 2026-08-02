# 探波熱 Polsar port

專為遊戲開發團隊打造的製作管理工作區，聚焦 Feature、Asset、跨團隊交接、阻塞與里程碑風險。

## 技術基礎

- Vue 3 + TypeScript + Vite
- Tauri 2
- GSAP

## 開發

```bash
npm install
npm run dev
```

啟動桌面 App：

```bash
npm run tauri dev
```

## 驗證

```bash
npm run build
npm run tauri build
```

後續雲端服務預計採用 Cloudflare Workers + Hono、PostgreSQL + Hyperdrive、Drizzle ORM、Zod、R2 與 Queues。
