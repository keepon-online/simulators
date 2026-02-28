# Home Circuit Simulator

家庭电路仿真系统 - 基于Web的电路教育工具

## 技术栈

- React 18 + TypeScript
- Vite (构建工具)
- Tailwind CSS (样式)
- Vitest (测试框架)

## 功能特性

- 拖拽式电路编辑器 (SVG)
- 实时电路计算 (教育级简化公式)
- 故障检测 (短路、过载)
- 负载分析面板
- LocalStorage 持久化
- 电流流动动画

## 快速开始

```bash
# 安装依赖
bun install

# 启动开发服务器
bun run dev

# 构建生产版本
bun run build

# 运行测试
bun test
```

## 项目结构

```
src/
├── components/     # React 组件
├── engine/        # 电路计算引擎
├── types/         # TypeScript 类型定义
├── utils/         # 工具函数
└── __tests__/    # 测试文件
```
