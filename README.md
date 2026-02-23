# MetroTab

基于 `Vue 3 + TypeScript + Vite + Pinia + TailwindCSS` 的磁贴式浏览器主页（Metro 风格）。

## 技术栈

- Vue 3
- TypeScript
- Vite
- Pinia
- Vue Router
- @vueuse/core
- TailwindCSS
- gridstack（已安装，当前版本先使用自研网格渲染，后续可切拖拽引擎）

## 当前功能

- 磁贴布局引擎（`1x1 / 2x2 / 4x2 / 4x4`）
- 快捷方式磁贴、时钟磁贴、Todo 磁贴
- 编辑模式（移动、缩放、删除）
- 搜索中心（Bing/Google/Baidu/DuckDuckGo/GitHub）
- 主题切换（亮/暗）
- 背景模式（渐变 / 图片 URL / 纯色）
- 本地数据持久化（Pinia + VueUse LocalStorage）
- JSON 导入/导出（磁贴与配置备份）

## 目录结构

```text
src/
├── assets/
│   └── style.css
├── components/
│   ├── common/
│   │   └── BaseButton.vue
│   ├── tiles/
│   │   ├── BaseTile.vue
│   │   ├── ShortcutTile.vue
│   │   ├── ClockTile.vue
│   │   └── TodoTile.vue
│   └── widgets/
│       ├── SearchHub.vue
│       └── BackgroundLayer.vue
├── composables/
│   └── useEditMode.ts
├── layout/
│   ├── AppHeader.vue
│   ├── MainGrid.vue
│   └── SettingsDrawer.vue
├── router/
│   └── index.ts
├── stores/
│   ├── board.ts
│   └── config.ts
├── types/
│   ├── config.ts
│   └── tile.ts
├── utils/
│   ├── search.ts
│   └── tiles.ts
├── views/
│   ├── HomeView.vue
│   └── SettingsView.vue
├── App.vue
└── main.ts
```

## 快速开始

```bash
npm install
npm run dev
```

## 构建

```bash
npm run build
npm run preview
```

## 下一步建议

1. 用 `gridstack` 接管 `MainGrid` 的拖拽/碰撞布局。
2. 增加 Weather 磁贴（接 OpenWeather API）。
3. 增加“模板布局”与“多工作区”能力。
