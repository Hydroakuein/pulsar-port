# 探波熱 Pulsar-port

Pulsar Port 是遊戲製作團隊使用的桌面工作區。目前專案聚焦四個前端功能入口：

- 美術素材瀏覽
- Git 版控狀態路線圖
- Lore 二進制資產版控管理
- 共享筆記本

<img width="1794" height="1118" alt="image" src="https://github.com/user-attachments/assets/cdf0c9c0-c619-44ba-b9fb-1cf31815257d" />

## 技術基礎

- Vue 3、TypeScript、Vite
- Vue Router
- Tauri 2
- GSAP

本專案目前不包含伺服器、API 或資料庫。

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
.github/workflows/   Pull Request 品質檢查
```

## 安裝與開發

```bash
npm install
npm run dev
```

啟動桌面 App：

```bash
npm run tauri dev
```

## 品質檢查

執行前端 Lint、型別檢查、格式檢查與建置：

```bash
npm run check
```

檢查 Tauri Rust crate：

```bash
npm run check:rust
```

一次執行所有檢查：

```bash
npm run check:all
```

開發規範請參考 [CONTRIBUTING.md](./CONTRIBUTING.md)。
