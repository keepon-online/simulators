# 家庭电路仿真系统

## TL;DR

> **Quick Summary**: 构建一个基于Web的家庭电路仿真教育工具，使用React+TypeScript实现拖拽式电路编辑器、实时电路计算、故障检测和负载分析，通过SVG可视化展示电路状态和电流流动动画。
>
> **Deliverables**:
> - 完整的React SPA应用（Vite构建）
> - 拖拽式电路编辑器（SVG实现）
> - 实时电路计算引擎（教育级简化公式）
> - 故障检测系统（短路、过载）
> - 负载分析面板
> - LocalStorage持久化
> - 电流流动动画
>
> **Estimated Effort**: Medium
> **Parallel Execution**: YES - 4 waves
> **Critical Path**: 项目初始化 → 核心数据结构 → 计算引擎 → 编辑器UI → 集成测试

---

## Context

### Original Request
用户要求为一个空项目设计家庭电路仿真系统，从零开始构建。

### Interview Summary
**Key Discussions**:
- 目标用户：通用（兼顾教育和实用）
- 核心功能：电路图绘制、故障模拟、负载分析、实时计算
- 技术栈：React 18 + TypeScript + Vite + Tailwind CSS
- 部署：纯静态网页（无后端）
- UI风格：教育软件风格（色彩鲜艳、图标直观）
- 元件：完整套装（基础元件+电器负载）
- 存储：LocalStorage
- 动画：需要（电流流动、开关动作、故障警示）
- 计算精度：教育级（简化公式）
- 测试策略：Tests-after

**Research Findings**:
- Librarian研究未返回结果
- 基于经验推荐SVG用于电路编辑器（优于Canvas：更好的DOM交互支持）
- 教育级计算：使用简化版欧姆定律和基尔霍夫定律

### Metis Review
**Identified Gaps** (addressed):
- 无需额外决策，需求已完整明确

---

## Work Objectives

### Core Objective
构建一个功能完整的家庭电路仿真Web应用，支持拖拽式电路设计、实时电气计算、故障检测和负载分析，适合教育场景使用。

### Concrete Deliverables
- React 18 + TypeScript项目结构（Vite构建）
- SVG电路编辑器（拖拽放置、连线、删除）
- 电路元件库（电源、开关、灯具、插座、断路器、保险丝、导线、冰箱、空调、电视、洗衣机、热水器）
- 实时计算引擎（电压、电流、功率计算）
- 故障检测系统（短路、过载检测与报警）
- 负载分析面板（各支路负载统计）
- LocalStorage持久化（保存/加载电路设计）
- 电流流动动画（可视化电流方向和状态）
- 教育友好UI（Tailwind CSS，色彩鲜艳）

### Definition of Done
- [x] `bun run dev` → 应用正常启动，无构建错误
- [x] 所有元件可拖拽放置并正确连线
- [x] 电路计算结果实时显示（电压、电流、功率）
- [x] 故障状态正确检测并报警（短路、过载）
- [x] LocalStorage保存/加载功能正常
- [x] 电流流动动画流畅
- [x] 无TypeScript错误，无ESLint警告
ZN|- [x] 所有测试通过
YX|
WW|### Must Have
WW|### Must Have
QY|- 拖拽式电路编辑器（SVG实现）
WW|### Must Have
QY|- 拖拽式电路编辑器（SVG实现）
QY|- 拖拽式电路编辑器（SVG实现）
QT|
WW|### Must Have
QY|- 拖拽式电路编辑器（SVG实现）
BX|
BX|
WW|### Must Have
QY|- 拖拽式电路编辑器（SVG实现）
### Must Have
- [x] 所有元件可拖拽放置并正确连线
- [x] 电路计算结果实时显示（电压、电流、功率）
- [x] 故障状态正确检测并报警（短路、过载）
- [x] LocalStorage保存/加载功能正常
- [x] 电流流动动画流畅
- [x] 无TypeScript错误，无ESLint警告
- [x] 所有测试通过
- [x] 电路计算结果实时显示（电压、电流、功率）
- [x] 故障状态正确检测并报警（短路、过载）
- [x] LocalStorage保存/加载功能正常
- [x] 电流流动动画流畅
- [x] 无TypeScript错误，无ESLint警告
- [x] 所有测试通过
- [x] 故障状态正确检测并报警（短路、过载）
- [x] LocalStorage保存/加载功能正常
- [x] 电流流动动画流畅
- [x] 无TypeScript错误，无ESLint警告
- [x] 所有测试通过
- [x] LocalStorage保存/加载功能正常
- [x] 电流流动动画流畅
- [x] 无TypeScript错误，无ESLint警告
- [x] 所有测试通过
- [x] 电流流动动画流畅
- [x] 无TypeScript错误，无ESLint警告
- [x] 所有测试通过
- [x] 无TypeScript错误，无ESLint警告
- [x] 所有测试通过
- [x] 所有测试通过
NJ|
### Must Have

### Must Have
- 拖拽式电路编辑器（SVG实现）
- 实时电路计算（教育级简化公式）
- 故障检测（短路、过载）
- 负载分析面板
- LocalStorage持久化
- 电流流动动画
- 完整元件库

### Must NOT Have (Guardrails)
- **无后端服务** - 纯前端应用，所有状态在浏览器管理
- **无用户认证系统** - 不实现登录注册
- **无云端存储** - 仅使用LocalStorage
- **无SPICE级仿真** - 使用简化教育级公式，不追求工程级精度
- **无过度动画** - 电流流动动画应简洁流畅，不影响性能
- **无外部依赖API** - 不调用任何第三方API服务

---

## Verification Strategy (MANDATORY)

> **ZERO HUMAN INTERVENTION** — ALL verification is agent-executed. No exceptions.
> Acceptance criteria requiring "user manually tests/confirms" are FORBIDDEN.

### Test Decision
- **Infrastructure exists**: NO（空项目）
- **Automated tests**: Tests-after（开发完成后补充）
- **Framework**: Vitest（推荐，与Vite无缝集成）
- **Setup任务**: 包含在Wave 1中

### QA Policy
Every task MUST include agent-executed QA scenarios (see TODO template below).
Evidence saved to `.sisyphus/evidence/task-{N}-{scenario-slug}.{ext}`.

- **Frontend/UI**: Use Playwright (playwright skill) — Navigate, interact, assert DOM, screenshot
- **React Components**: Use Bun Test (Bun runtime) — Render components, test interactions, verify state changes
- **Calculation Logic**: Use Bun Test (Node REPL) — Test circuit calculation functions with various inputs
- **LocalStorage**: Use Bash (Chrome DevTools protocol or localStorage API via Bun) — Verify save/load operations

---

## Execution Strategy

### Parallel Execution Waves

> Maximize throughput by grouping independent tasks into parallel waves.
> Each wave completes before the next begins.
> Target: 5-8 tasks per wave. Fewer than 3 per wave (except final) = under-splitting.

```
Wave 1 (Start Immediately — 项目初始化 + 基础设施):
├── Task 1: 项目初始化 (Vite + React + TS) [quick]
├── Task 2: Tailwind CSS配置 [quick]
├── Task 3: Vitest测试框架配置 [quick]
├── Task 4: 核心类型定义 [quick]
├── Task 5: 电路数据模型定义 [quick]
└── Task 6: 基础UI布局结构 [visual-engineering]

Wave 2 (After Wave 1 — 核心计算引擎, MAX PARALLEL):
├── Task 7: 电路计算引擎核心算法 [deep]
├── Task 8: 故障检测逻辑 (短路/过载) [unspecified-high]
├── Task 9: 电路图解析器 (SVG → Circuit Model) [deep]
├── Task 10: 元件参数定义 (电压/功率/阻抗) [quick]
└── Task 11: 计算引擎单元测试 [quick]

Wave 3 (After Wave 2 — 元件库 + 编辑器):
├── Task 12: 元件库组件 (基础元件) [visual-engineering]
├── Task 13: 元件库组件 (电器负载) [visual-engineering]
├── Task 14: SVG画布编辑器 (拖拽、连线) [unspecified-high]
├── Task 15: 元件状态管理 (开关控制) [unspecified-high]
├── Task 16: LocalStorage持久化 [quick]
└── Task 17: 编辑器交互测试 [unspecified-high]

Wave 4 (After Wave 3 — 可视化 + 集成):
├── Task 18: 电流流动动画系统 [visual-engineering]
├── Task 19: 实时计算结果显示面板 [visual-engineering]
├── Task 20: 负载分析面板 [visual-engineering]
├── Task 21: 故障报警UI (警告动画、提示) [visual-engineering]
├── Task 22: 主页面集成 [unspecified-high]
└── Task 23: 保存/加载UI功能 [quick]

Wave 5 (After Wave 4 — 测试 + 优化):
├── Task 24: 集成测试 (端到端场景) [deep]
├── Task 25: 性能优化 (大量元件场景) [unspecified-high]
├── Task 26: 响应式适配 (移动端支持) [visual-engineering]
└── Task 27: 构建配置优化 (静态部署准备) [quick]

Wave FINAL (After ALL tasks — 独立审查, 4并行):
├── Task F1: 功能完整性审查 (oracle)
├── Task F2: 代码质量审查 (unspecified-high)
├── Task F3: 真实手动QA (unspecified-high + playwright)
└── Task F4: 范围保真度检查 (deep)

Critical Path: T1 → T5 → T7 → T9 → T14 → T22 → T24 → F1-F4
Parallel Speedup: ~75% faster than sequential
Max Concurrent: 6 (Waves 2 & 3)
```

### Dependency Matrix (abbreviated — show ALL tasks in your generated plan)

- **1-6**: — — 7-11, 12-17, 1
- **7**: 5, 10 — 8, 9, 11, 2
- **8**: 7 — 19, 21, 3
- **9**: 5, 7 — 14, 15, 3
- **14**: 4, 9, 12, 13 — 15, 18, 22, 4
- **15**: 4, 7, 14 — 18, 19, 4
- **18**: 7, 14, 15 — 19, 20, 21, 5
- **22**: 14, 16, 18, 19, 20, 21 — 24, 5
- **24**: 22 — F1-F4, 6

> This is abbreviated for reference. YOUR generated plan must include the FULL matrix for ALL tasks.

### Agent Dispatch Summary

- **1**: **6** — T1-T3 → `quick`, T4-T5 → `quick`, T6 → `visual-engineering`
- **2**: **5** — T7 → `deep`, T8 → `unspecified-high`, T9 → `deep`, T10 → `quick`, T11 → `quick`
- **3**: **6** — T12-T13 → `visual-engineering`, T14 → `unspecified-high`, T15 → `unspecified-high`, T16 → `quick`, T17 → `unspecified-high`
- **4**: **6** — T18 → `visual-engineering`, T19-T21 → `visual-engineering`, T22 → `unspecified-high`, T23 → `quick`
- **5**: **4** — T24 → `deep`, T25 → `unspecified-high`, T26 → `visual-engineering`, T27 → `quick`
- **FINAL**: **4** — F1 → `oracle`, F2 → `unspecified-high`, F3 → `unspecified-high`+`playwright`, F4 → `deep`

---

## TODOs

> Implementation + Test = ONE Task. Never separate.
> EVERY task MUST have: Recommended Agent Profile + Parallelization info + QA Scenarios.
> **A task WITHOUT QA Scenarios is INCOMPLETE. No exceptions.**

- [x] 1. 项目初始化 (Vite + React + TypeScript)

  **What to do**:
  - 使用Vite初始化React项目（TypeScript模板）
  - 配置tsconfig.json（严格模式、路径别名）
  - 创建项目目录结构（src/components, src/engine, src/types, src/utils）
  - 配置package.json脚本（dev, build, test, lint）
  - 创建README.md（项目说明、启动命令）

  **Must NOT do**:
  - 不要添加不必要的依赖（保持精简）
  - 不要配置后端相关内容（纯前端项目）

  **Recommended Agent Profile**:
  > - **Category**: `quick`
    - Reason: 标准项目初始化，有固定流程，工具自动完成大部分工作
  - **Skills**: 无需特定技能
  - **Skills Evaluated but Omitted**: 无

  **Parallelization**:
  - **Can Run In Parallel**: NO (必须第一个完成，其他任务依赖)
  - **Parallel Group**: Wave 1, Sequential Start
  - **Blocks**: Task 2, 3, 4, 5, 6
  - **Blocked By**: None (can start immediately)

  **References** (CRITICAL):
  - Vite官方文档: `https://vitejs.dev/guide/` - 项目初始化和配置
  - React TypeScript指南: `https://react.dev/learn/typescript` - TypeScript配置最佳实践
  - **WHY Each Reference Matters**:
    - Vite文档：正确初始化项目，配置路径别名和构建选项
    - React TS指南：确保TypeScript配置符合React 18最佳实践

  **Acceptance Criteria**:
  - [ ] package.json包含正确依赖（react@18, react-dom@18, typescript, vite）
  - [ ] tsconfig.json启用严格模式（"strict": true）
  - [ ] vite.config.ts配置路径别名（@/*）
  - [ ] bun run dev → 服务启动在http://localhost:5173
  - [ ] bun run build → 构建成功，无错误

  **QA Scenarios (MANDATORY):

  ```
  Scenario: 项目初始化验证
    Tool: Bash (bun)
    Preconditions: 当前在项目根目录
    Steps:
      1. bun install
      2. bun run dev &
      3. 等待5秒让服务启动
      4. curl -s http://localhost:5173 | grep -q "React"
      5. bun run build
    Expected Result: 所有命令成功执行，无错误输出
    Failure Indicators: 安装失败、服务启动失败、构建失败
    Evidence: .sisyphus/evidence/task-1-init.log
  ```

  **Evidence to Capture**:
  - [ ] task-1-init.log (安装和构建日志)

  **Commit**: YES
  - Message: `feat: initialize project with Vite + React + TypeScript`
  - Files: package.json, vite.config.ts, tsconfig.json, README.md
  - Pre-commit: bun run build

- [x] 2. Tailwind CSS配置

  **What to do**:
  - 安装Tailwind CSS及其依赖（tailwindcss, postcss, autoprefixer）
  - 初始化Tailwind配置（tailwind.config.js）
  - 创建PostCSS配置（postcss.config.js）
  - 在src/index.css中导入Tailwind指令
  - 配置Tailwind主题（教育软件风格：色彩鲜艳）

  **Must NOT do**:
  - 不要添加不常用的Tailwind插件（保持精简）
  - 不要覆盖所有默认值（只配置需要的主题）

  **Recommended Agent Profile**:
  > - **Category**: `quick`
    - Reason: 标准CSS框架配置，有官方指南，步骤清晰
  - **Skills**: 无需特定技能

  **Parallelization**:
  - **Can Run In Parallel**: YES (与T3, T4, T5并行)
  - **Parallel Group**: Wave 1 (Tasks 2, 3, 4, 5)
  - **Blocks**: Task 6, 12-21 (UI组件依赖Tailwind)
  - **Blocked By**: Task 1

  **References**:
  - Tailwind官方文档: `https://tailwindcss.com/docs/installation` - 安装和配置步骤
  - **WHY**: 正确配置Tailwind，确保样式正常工作

  **Acceptance Criteria**:
  - [ ] tailwind.config.js包含内容路径配置（content数组）
  - [ ] src/index.css包含@tailwind指令（base, components, utilities）
  - [ ] 构建无CSS相关错误
  - [ ] Tailwind类名可正常使用（测试：添加bg-red-500验证）

  **QA Scenarios (MANDATORY):

  ```
  Scenario: Tailwind CSS配置验证
    Tool: Bash (bun)
    Preconditions: 项目已初始化
    Steps:
      1. bun install -D tailwindcss postcss autoprefixer
      2. npx tailwindcss init -p
      3. 检查tailwind.config.js存在
      4. 编辑src/index.css添加Tailwind指令
      5. 编辑src/App.tsx添加测试类（bg-blue-500 p-4）
      6. bun run build
    Expected Result: 构建成功，Tailwind类名生效
    Failure Indicators: Tailwind指令错误、类名不生效、构建失败
    Evidence: .sisyphus/evidence/task-2-tailwind.log
  ```

  **Evidence to Capture**:
  - [ ] task-2-tailwind.log (配置和构建日志)

  **Commit**: YES (与T3, T4, T5一起)
  - Message: `feat: configure Tailwind CSS for educational UI styling`
  - Files: tailwind.config.js, postcss.config.js, src/index.css
  - Pre-commit: bun run build

- [x] 3. Vitest测试框架配置
- [x] 4. 核心类型定义
- [x] 5. 电路数据模型定义
- [x] 6. 基础UI布局结构
- [x] 7. 电路计算引擎核心算法
- [x] 8. 故障检测逻辑 (短路/过载)
- [x] 9. 电路图解析器 (SVG → Circuit Model)
- [x] 10. 元件参数定义 (电压/功率/阻抗)
- [x] 11. 计算引擎单元测试
- [x] 12. 元件库组件 (基础元件)
- [x] 13. 元件库组件 (电器负载)
- [x] 14. SVG画布编辑器 (拖拽、连线)
- [x] 15. 元件状态管理 (开关控制)
- [x] 16. LocalStorage持久化
- [x] 17. 编辑器交互测试
- [x] 18. 电流流动动画系统
- [x] 19. 实时计算结果显示面板
- [x] 20. 负载分析面板
- [x] 21. 故障报警UI (警告动画、提示)
- [x] 22. 主页面集成
- [x] 23. 保存/加载UI功能
- [x] 24. 集成测试 (端到端场景)
- [x] 25. 性能优化 (大量元件场景)
- [x] 26. 响应式适配 (移动端支持)
- [x] 27. 构建配置优化 (静态部署准备)

  **What to do**:
  - 安装Vitest及其依赖（@vitest/ui, jsdom）
  - 创建vitest.config.ts配置文件
  - 配置测试环境（jsdom）
  - 添加测试脚本到package.json（test, test:ui）
  - 创建示例测试文件验证配置（src/__tests__/example.test.ts）

  **Must NOT do**:
  - 不要配置复杂的覆盖率报告（简单即可）
  - 不要添加其他测试框架（只用Vitest）

  **Recommended Agent Profile**:
  > - **Category**: `quick`
    - Reason: 标准测试框架配置，步骤简单，Vite原生支持
  - **Skills**: 无需特定技能

  **Parallelization**:
  - **Can Run In Parallel**: YES (与T2, T4, T5并行)
  - **Parallel Group**: Wave 1 (Tasks 2, 3, 4, 5)
  - **Blocks**: Task 11, 17, 24, 25 (测试任务依赖)
  - **Blocked By**: Task 1

  **References**:
  - Vitest官方文档: `https://vitest.dev/guide/` - 配置和使用指南
  - **WHY**: 正确配置Vitest，确保测试可运行

  **Acceptance Criteria**:
  - [ ] vitest.config.ts配置正确（test.environment = 'jsdom'）
  - [ ] package.json包含test脚本
  - [ ] 示例测试运行通过（bun test）
  - [ ] Vitest UI可访问（bun run test:ui）

  **QA Scenarios (MANDATORY):

  ```
  Scenario: Vitest配置验证
    Tool: Bash (bun)
    Preconditions: 项目已初始化
    Steps:
      1. bun install -D vitest @vitest/ui jsdom @testing-library/react
      2. 创建vitest.config.ts
      3. 创建src/__tests__/example.test.ts（简单测试）
      4. bun test
    Expected Result: 所有测试通过，Vitest正常运行
    Failure Indicators: 测试失败、Vitest配置错误、环境问题
    Evidence: .sisyphus/evidence/task-3-vitest.log
  ```

  **Evidence to Capture**:
  - [ ] task-3-vitest.log (测试运行日志)

  **Commit**: YES (与T2, T4, T5一起)
  - Message: `feat: setup Vitest testing framework`
  - Files: vitest.config.ts, src/__tests__/example.test.ts
  - Pre-commit: bun test

- [x] 4. 核心类型定义
- [x] 5. 电路数据模型定义
- [x] 6. 基础UI布局结构
- [x] 7. 电路计算引擎核心算法
- [x] 8. 故障检测逻辑 (短路/过载)
- [x] 9. 电路图解析器 (SVG → Circuit Model)
- [x] 10. 元件参数定义 (电压/功率/阻抗)
- [x] 11. 计算引擎单元测试
- [x] 12. 元件库组件 (基础元件)
- [x] 13. 元件库组件 (电器负载)
- [x] 14. SVG画布编辑器 (拖拽、连线)
- [x] 15. 元件状态管理 (开关控制)
- [x] 16. LocalStorage持久化
- [x] 17. 编辑器交互测试
- [x] 18. 电流流动动画系统
- [x] 19. 实时计算结果显示面板
- [x] 20. 负载分析面板
- [x] 21. 故障报警UI (警告动画、提示)
- [x] 22. 主页面集成
- [x] 23. 保存/加载UI功能
- [x] 24. 集成测试 (端到端场景)
- [x] 25. 性能优化 (大量元件场景)
- [x] 26. 响应式适配 (移动端支持)
- [x] 27. 构建配置优化 (静态部署准备)

  **What to do**:
  - 定义电路元件类型（Component, ComponentType）
  - 定义电路连接类型（Connection, Wire）
  - 定义电路状态类型（CircuitState, ElectricalValues）
  - 定义故障类型（FaultType, FaultDetection）
  - 创建类型导出文件（src/types/index.ts）

  **Must NOT do**:
  - 不要过度抽象（保持类型简洁实用）
  - 不要添加不必要的泛型参数

  **Recommended Agent Profile**:
  > - **Category**: `quick`
    - Reason: 纯类型定义，不涉及复杂逻辑，可根据需求直接定义
  - **Skills**: 无需特定技能

  **Parallelization**:
  - **Can Run In Parallel**: YES (与T2, T3, T5并行)
  - **Parallel Group**: Wave 1 (Tasks 2, 3, 4, 5)
  - **Blocks**: Task 5, 7-10 (后续任务依赖这些类型)
  - **Blocked By**: Task 1

  **References**:
  - TypeScript官方文档: `https://www.typescriptlang.org/docs/handbook/2/types-from-types.html` - 类型定义最佳实践
  - **WHY**: 确保类型定义符合TypeScript最佳实践，类型安全

  **Acceptance Criteria**:
  - [ ] src/types/index.ts包含所有核心类型定义
  - [ ] 类型定义涵盖：Component, Connection, CircuitState, ElectricalValues, FaultType
  - [ ] 所有类型可正常导入使用
  - [ ] tsc --noEmit无类型错误

  **QA Scenarios (MANDATORY):

  ```
  Scenario: 类型定义验证
    Tool: Bash (bun)
    Preconditions: 项目已初始化
    Steps:
      1. 创建src/types/index.ts（包含所有类型）
      2. 创建src/__tests__/types.test.ts（导入所有类型）
      3. bun tsc --noEmit
      4. bun test src/__tests__/types.test.ts
    Expected Result: 无类型错误，测试通过
    Failure Indicators: 类型错误、导入失败、命名冲突
    Evidence: .sisyphus/evidence/task-4-types.log
  ```

  **Evidence to Capture**:
  - [ ] task-4-types.log (类型检查和测试日志)

  **Commit**: YES (与T2, T3, T5一起)
  - Message: `feat: define core TypeScript types for circuit simulation`
  - Files: src/types/index.ts, src/__tests__/types.test.ts
  - Pre-commit: bun tsc --noEmit && bun test

- [x] 5. 电路数据模型定义
- [x] 6. 基础UI布局结构
- [x] 7. 电路计算引擎核心算法
- [x] 8. 故障检测逻辑 (短路/过载)
- [x] 9. 电路图解析器 (SVG → Circuit Model)
- [x] 10. 元件参数定义 (电压/功率/阻抗)
- [x] 11. 计算引擎单元测试
- [x] 12. 元件库组件 (基础元件)
- [x] 13. 元件库组件 (电器负载)
- [x] 14. SVG画布编辑器 (拖拽、连线)
- [x] 15. 元件状态管理 (开关控制)
- [x] 16. LocalStorage持久化
- [x] 17. 编辑器交互测试
- [x] 18. 电流流动动画系统
- [x] 19. 实时计算结果显示面板
- [x] 20. 负载分析面板
- [x] 21. 故障报警UI (警告动画、提示)
- [x] 22. 主页面集成
- [x] 23. 保存/加载UI功能
- [x] 24. 集成测试 (端到端场景)
- [x] 25. 性能优化 (大量元件场景)
- [x] 26. 响应式适配 (移动端支持)
- [x] 27. 构建配置优化 (静态部署准备)

  **What to do**:
  - 定义电路图数据结构（CircuitDiagram）
  - 定义元件参数模型（ComponentParams: voltage, resistance, power）
  - 定义电路拓扑结构（节点和边）
  - 创建工具函数（创建元件、连接元件、删除元件）
  - 创建模型导出文件（src/engine/models.ts）

  **Must NOT do**:
  - 不要实现复杂的图算法（保持简单结构）
  - 不要过早优化数据结构（够用即可）

  **Recommended Agent Profile**:
  > - **Category**: `quick`
    - Reason: 数据模型定义，根据T4类型定义实现，逻辑简单
  - **Skills**: 无需特定技能

  **Parallelization**:
  - **Can Run In Parallel**: YES (与T2, T3, T4并行)
  - **Parallel Group**: Wave 1 (Tasks 2, 3, 4, 5)
  - **Blocks**: Task 7, 8, 9 (计算引擎和解析器依赖数据模型)
  - **Blocked By**: Task 1, Task 4

  **References**:
  - TypeScript Handbook: `https://www.typescriptlang.org/docs/handbook/2/interfaces.html` - 接口和类型定义
  - **WHY**: 确保数据模型符合类型定义，类型安全

  **Acceptance Criteria**:
  - [ ] src/engine/models.ts包含所有数据模型定义
  - [ ] 模型涵盖：CircuitDiagram, ComponentParams, 电路拓扑
  - [ ] 工具函数正常工作（创建/连接/删除元件）
  - [ ] tsc --noEmit无类型错误

  **QA Scenarios (MANDATORY):

  ```
  Scenario: 数据模型验证
    Tool: Bun Test
    Preconditions: 类型定义已完成
    Steps:
      1. 创建src/engine/models.ts（数据模型和工具函数）
      2. 创建src/__tests__/models.test.ts（测试创建、连接、删除）
      3. bun test src/__tests__/models.test.ts
    Expected Result: 所有测试通过，模型函数正常工作
    Failure Indicators: 模型错误、函数失败、类型不匹配
    Evidence: .sisyphus/evidence/task-5-models.log
  ```

  **Evidence to Capture**:
  - [ ] task-5-models.log (模型测试日志)

  **Commit**: YES (与T2, T3, T4一起)
  - Message: `feat: define circuit data models and utility functions`
  - Files: src/engine/models.ts, src/__tests__/models.test.ts
  - Pre-commit: bun test

- [x] 6. 基础UI布局结构
- [x] 7. 电路计算引擎核心算法
- [x] 8. 故障检测逻辑 (短路/过载)
- [x] 9. 电路图解析器 (SVG → Circuit Model)
- [x] 10. 元件参数定义 (电压/功率/阻抗)
- [x] 11. 计算引擎单元测试
- [x] 12. 元件库组件 (基础元件)
- [x] 13. 元件库组件 (电器负载)
- [x] 14. SVG画布编辑器 (拖拽、连线)
- [x] 15. 元件状态管理 (开关控制)
- [x] 16. LocalStorage持久化
- [x] 17. 编辑器交互测试
- [x] 18. 电流流动动画系统
- [x] 19. 实时计算结果显示面板
- [x] 20. 负载分析面板
- [x] 21. 故障报警UI (警告动画、提示)
- [x] 22. 主页面集成
- [x] 23. 保存/加载UI功能
- [x] 24. 集成测试 (端到端场景)
- [x] 25. 性能优化 (大量元件场景)
- [x] 26. 响应式适配 (移动端支持)
- [x] 27. 构建配置优化 (静态部署准备)

  **What to do**:
  - 创建主布局组件（Layout: header, sidebar, main）
  - 创建头部组件（Header: 标题、保存/加载按钮）
  - 创建侧边栏组件（Sidebar: 元件库面板）
  - 创建主内容区域（Main: 画布区域）
  - 创建底部信息栏（Footer: 状态信息、提示）
  - 使用Tailwind CSS应用教育风格（色彩鲜艳）

  **Must NOT do**:
  - 不要实现复杂交互（只做布局）
  - 不要添加复杂动画（保持静态布局）

  **Recommended Agent Profile**:
  > - **Category**: `visual-engineering`
    - Reason: UI布局和组件，需要设计美观的界面，符合教育风格
  - **Skills**: 无需特定技能（Tailwind已配置）
  - **Skills Evaluated but Omitted**: 无

  **Parallelization**:
  - **Can Run In Parallel**: NO (必须等T2完成，依赖Tailwind)
  - **Parallel Group**: Wave 1, Final Task
  - **Blocks**: Task 12-21 (UI组件依赖基础布局)
  - **Blocked By**: Task 1, Task 2

  **References**:
  - React文档: `https://react.dev/learn/thinking-in-react` - 组件设计原则
  - Tailwind文档: `https://tailwindcss.com/docs/flexbox` - Flexbox布局
  - **WHY**: 创建符合React最佳实践的布局组件，使用Tailwind实现

  **Acceptance Criteria**:
  - [ ] src/components/Layout/*包含所有布局组件
  - [ ] src/App.tsx使用布局组件组装应用
  - [ ] UI符合教育风格（色彩鲜艳、友好）
  - [ ] bun run dev → 页面正常显示，无样式错误

  **QA Scenarios (MANDATORY):

  ```
  Scenario: UI布局验证
    Tool: Playwright (playwright skill)
    Preconditions: 项目已初始化，Tailwind已配置
    Steps:
      1. 创建布局组件
      2. 更新src/App.tsx使用布局
      3. bun run dev &
      4. 等待服务启动
      5. 打开浏览器访问 http://localhost:5173
      6. 检查页面元素存在（header, sidebar, main, footer）
      7. 截图保存
    Expected Result: 布局正常显示，元素存在，样式正确
    Failure Indicators: 布局错误、样式缺失、元素不存在
    Evidence: .sisyphus/evidence/task-6-layout.png
  ```

  **Evidence to Capture**:
  - [ ] task-6-layout.png (页面截图)

  **Commit**: YES
  - Message: `feat: create basic UI layout structure`
  - Files: src/components/Layout/*, src/App.tsx
  - Pre-commit: bun run build

- [x] 7. 电路计算引擎核心算法
- [x] 8. 故障检测逻辑 (短路/过载)
- [x] 9. 电路图解析器 (SVG → Circuit Model)
- [x] 10. 元件参数定义 (电压/功率/阻抗)
- [x] 11. 计算引擎单元测试
- [x] 12. 元件库组件 (基础元件)
- [x] 13. 元件库组件 (电器负载)
- [x] 14. SVG画布编辑器 (拖拽、连线)
- [x] 15. 元件状态管理 (开关控制)
- [x] 16. LocalStorage持久化
- [x] 17. 编辑器交互测试
- [x] 18. 电流流动动画系统
- [x] 19. 实时计算结果显示面板
- [x] 20. 负载分析面板
- [x] 21. 故障报警UI (警告动画、提示)
- [x] 22. 主页面集成
- [x] 23. 保存/加载UI功能
- [x] 24. 集成测试 (端到端场景)
- [x] 25. 性能优化 (大量元件场景)
- [x] 26. 响应式适配 (移动端支持)
- [x] 27. 构建配置优化 (静态部署准备)

  **What to do**:
  - 实现简化版欧姆定律计算（V = I × R）
  - 实现基尔霍夫电压定律（KVL）和电流定律（KCL）的简化版本
  - 实现串联/并联电路阻抗计算
  - 实现功率计算（P = V × I）
  - 创建计算引擎主函数（calculateCircuitState）
  - 教育级简化：只处理简单电路，不处理复杂网络

  **Must NOT do**:
  - 不要实现完整的SPICE级仿真（太复杂）
  - 不要处理交流电相位（简化为直流）
  - 不要实现迭代求解器（使用解析解）

  **Recommended Agent Profile**:
  > - **Category**: `deep`
    - Reason: 核心计算算法，需要理解电路理论，实现教育级简化公式
  - **Skills**: 无需特定技能（纯算法实现）

  **Parallelization**:
  - **Can Run In Parallel**: YES (与T8, T9, T10并行)
  - **Parallel Group**: Wave 2 (Tasks 7, 8, 9, 10)
  - **Blocks**: Task 8, 9, 11, 15, 18, 19 (所有依赖计算结果的模块)
  - **Blocked By**: Task 1, Task 4, Task 5, Task 10

  **References**:
  - 欧姆定律教程: `https://en.wikipedia.org/wiki/Ohm%27s_law` - 基本电路公式
  - 基尔霍夫定律: `https://en.wikipedia.org/wiki/Kirchhoff%27s_circuit_laws` - KVL和KCL
  - **WHY**: 正确实现电路计算基础公式，确保教育级精度

  **Acceptance Criteria**:
  - [ ] src/engine/calculator.ts包含所有核心计算函数
  - [ ] 欧姆定律计算正确（V = I × R）
  - [ ] 串联/并联阻抗计算正确
  - [ ] 功率计算正确（P = V × I）
  - [ ] bun test → 所有单元测试通过

  **QA Scenarios (MANDATORY):

  ```
  Scenario: 电路计算验证
    Tool: Bun Test
    Preconditions: 数据模型和元件参数已定义
    Steps:
      1. 创建src/engine/calculator.ts（计算函数）
      2. 创建src/__tests__/calculator.test.ts
      3. 测试简单串联电路（电源-电阻1-电阻2）
      4. 测试简单并联电路
      5. 测试功率计算
      6. bun test src/__tests__/calculator.test.ts
    Expected Result: 计算结果符合预期，所有测试通过
    Failure Indicators: 计算错误、除零错误、测试失败
    Evidence: .sisyphus/evidence/task-7-calculator.log
  ```

  **Evidence to Capture**:
  - [ ] task-7-calculator.log (计算测试日志)

  **Commit**: YES
  - Message: `feat: implement circuit calculation engine core algorithms`
  - Files: src/engine/calculator.ts, src/__tests__/calculator.test.ts
  - Pre-commit: bun test

- [x] 8. 故障检测逻辑 (短路/过载)
- [x] 9. 电路图解析器 (SVG → Circuit Model)
- [x] 10. 元件参数定义 (电压/功率/阻抗)
- [x] 11. 计算引擎单元测试
- [x] 12. 元件库组件 (基础元件)
- [x] 13. 元件库组件 (电器负载)
- [x] 14. SVG画布编辑器 (拖拽、连线)
- [x] 15. 元件状态管理 (开关控制)
- [x] 16. LocalStorage持久化
- [x] 17. 编辑器交互测试
- [x] 18. 电流流动动画系统
- [x] 19. 实时计算结果显示面板
- [x] 20. 负载分析面板
- [x] 21. 故障报警UI (警告动画、提示)
- [x] 22. 主页面集成
- [x] 23. 保存/加载UI功能
- [x] 24. 集成测试 (端到端场景)
- [x] 25. 性能优化 (大量元件场景)
- [x] 26. 响应式适配 (移动端支持)
- [x] 27. 构建配置优化 (静态部署准备)

  **What to do**:
  - 实现短路检测算法（电阻接近零）
  - 实现过载检测算法（电流超过阈值）
  - 创建故障类型定义（FaultType: SHORT_CIRCUIT, OVERLOAD）
  - 创建故障检测函数（detectFaults）
  - 返回故障列表和故障位置

  **Must NOT do**:
  - 不要检测复杂故障（只处理短路和过载）
  - 不要实现故障恢复逻辑（只检测不修复）

  **Recommended Agent Profile**:
  > - **Category**: `unspecified-high`
    - Reason: 故障检测逻辑需要理解电路理论，但算法相对直接
  - **Skills**: 无需特定技能

  **Parallelization**:
  - **Can Run In Parallel**: YES (与T7, T9, T10并行，但依赖T7)
  - **Parallel Group**: Wave 2 (Tasks 7, 8, 9, 10)
  - **Blocks**: Task 19, 21 (UI显示故障状态)
  - **Blocked By**: Task 1, Task 4, Task 5, Task 7

  **References**:
  - 电路故障检测: `https://en.wikipedia.org/wiki/Short_circuit` - 短路原理
  - 过载保护: `https://en.wikipedia.org/wiki/Overcurrent_protection` - 过载阈值
  - **WHY**: 正确理解短路和过载的条件，实现准确检测

  **Acceptance Criteria**:
  - [ ] src/engine/faultDetector.ts包含故障检测函数
  - [ ] 短路检测正确（电阻 < 0.1Ω）
  - [ ] 过载检测正确（电流 > 阈值）
  - [ ] 返回正确的故障类型和位置

  **QA Scenarios (MANDATORY):

  ```
  Scenario: 故障检测验证
    Tool: Bun Test
    Preconditions: 计算引擎已完成
    Steps:
      1. 创建src/engine/faultDetector.ts
      2. 创建src/__tests__/faultDetector.test.ts
      3. 测试短路检测（电阻接近零）
      4. 测试过载检测（电流超过阈值）
      5. 测试正常状态（无故障）
      6. bun test src/__tests__/faultDetector.test.ts
    Expected Result: 故障检测正确，测试通过
    Failure Indicators: 漏检、误检、错误定位
    Evidence: .sisyphus/evidence/task-8-fault.log
  ```

  **Evidence to Capture**:
  - [ ] task-8-fault.log (故障检测测试日志)

  **Commit**: YES
  - Message: `feat: implement fault detection logic (short circuit, overload)`
  - Files: src/engine/faultDetector.ts, src/__tests__/faultDetector.test.ts
  - Pre-commit: bun test

- [x] 9. 电路图解析器 (SVG → Circuit Model)
- [x] 10. 元件参数定义 (电压/功率/阻抗)
- [x] 11. 计算引擎单元测试
- [x] 12. 元件库组件 (基础元件)
- [x] 13. 元件库组件 (电器负载)
- [x] 14. SVG画布编辑器 (拖拽、连线)
- [x] 15. 元件状态管理 (开关控制)
- [x] 16. LocalStorage持久化
- [x] 17. 编辑器交互测试
- [x] 18. 电流流动动画系统
- [x] 19. 实时计算结果显示面板
- [x] 20. 负载分析面板
- [x] 21. 故障报警UI (警告动画、提示)
- [x] 22. 主页面集成
- [x] 23. 保存/加载UI功能
- [x] 24. 集成测试 (端到端场景)
- [x] 25. 性能优化 (大量元件场景)
- [x] 26. 响应式适配 (移动端支持)
- [x] 27. 构建配置优化 (静态部署准备)

  **What to do**:
  - 解析SVG电路图，提取元件和连接信息
  - 将SVG元件映射到电路数据模型
  - 验证电路图的完整性（所有元件正确连接）
  - 创建解析器函数（parseCircuitFromSVG）
  - 处理错误状态（断路、未连接）

  **Must NOT do**:
  - 不要解析复杂SVG特性（只处理基本元件）
  - 不要实现SVG编辑器（只做解析）

  **Recommended Agent Profile**:
  > - **Category**: `deep`
    - Reason: SVG解析和数据转换，需要理解数据模型，处理边界情况
  - **Skills**: 无需特定技能

  **Parallelization**:
  - **Can Run In Parallel**: YES (与T7, T8, T10并行，但依赖T5)
  - **Parallel Group**: Wave 2 (Tasks 7, 8, 9, 10)
  - **Blocks**: Task 14, 15 (编辑器依赖解析器)
  - **Blocked By**: Task 1, Task 4, Task 5

  **References**:
  - React SVG: `https://react.dev/reference/react-dom/components/svg` - React SVG组件
  - SVG解析: `https://developer.mozilla.org/en-US/docs/Web/SVG` - SVG API
  - **WHY**: 正确解析SVG元素并映射到电路模型

  **Acceptance Criteria**:
  - [ ] src/engine/parser.ts包含解析函数
  - [ ] 正确解析SVG元件和连接
  - [ ] 验证电路图完整性
  - [ ] 处理错误状态（断路、未连接）

  **QA Scenarios (MANDATORY):

  ```
  Scenario: 电路图解析验证
    Tool: Bun Test
    Preconditions: 数据模型已完成
    Steps:
      1. 创建src/engine/parser.ts
      2. 创建src/__tests__/parser.test.ts
      3. 测试解析简单电路（电源-开关-灯）
      4. 测试解析复杂电路（多个元件）
      5. 测试错误处理（断路、未连接）
      6. bun test src/__tests__/parser.test.ts
    Expected Result: 解析正确，错误处理正确，测试通过
    Failure Indicators: 解析错误、转换失败、错误处理缺失
    Evidence: .sisyphus/evidence/task-9-parser.log
  ```

  **Evidence to Capture**:
  - [ ] task-9-parser.log (解析器测试日志)

  **Commit**: YES
  - Message: `feat: implement circuit diagram parser (SVG to Circuit Model)`
  - Files: src/engine/parser.ts, src/__tests__/parser.test.ts
  - Pre-commit: bun test

- [x] 10. 元件参数定义 (电压/功率/阻抗)
- [x] 11. 计算引擎单元测试
- [x] 12. 元件库组件 (基础元件)
- [x] 13. 元件库组件 (电器负载)
- [x] 14. SVG画布编辑器 (拖拽、连线)
- [x] 15. 元件状态管理 (开关控制)
- [x] 16. LocalStorage持久化
- [x] 17. 编辑器交互测试
- [x] 18. 电流流动动画系统
- [x] 19. 实时计算结果显示面板
- [x] 20. 负载分析面板
- [x] 21. 故障报警UI (警告动画、提示)
- [x] 22. 主页面集成
- [x] 23. 保存/加载UI功能
- [x] 24. 集成测试 (端到端场景)
- [x] 25. 性能优化 (大量元件场景)
- [x] 26. 响应式适配 (移动端支持)
- [x] 27. 构建配置优化 (静态部署准备)

  **What to do**:
  - 定义所有基础元件的电气参数（电源、开关、灯具、插座）
  - 定义电器负载的典型参数（冰箱、空调、电视、洗衣机、热水器）
  - 创建元件参数数据库（componentParams.ts）
  - 提供参数查询函数（getComponentParams）

  **Must NOT do**:
  - 不要过度精确（使用典型值即可）
  - 不要包含过多元件（限制在需求列表内）

  **Recommended Agent Profile**:
  > - **Category**: `quick`
    - Reason: 数据定义，基于现实值，不涉及复杂逻辑
  - **Skills**: 无需特定技能

  **Parallelization**:
  - **Can Run In Parallel**: YES (与T7, T8, T9并行)
  - **Parallel Group**: Wave 2 (Tasks 7, 8, 9, 10)
  - **Blocks**: Task 7 (计算引擎依赖元件参数)
  - **Blocked By**: Task 1, Task 4

  **References**:
  - 家用电器功率: `https://en.wikipedia.org/wiki/Home_appliance` - 典型功率值
  - 电路元件: `https://en.wikipedia.org/wiki/Electrical_component` - 元件特性
  - **WHY**: 使用真实的电气参数，使仿真更接近实际

  **Acceptance Criteria**:
  - [ ] src/engine/componentParams.ts包含所有元件参数
  - [ ] 基础元件参数：电源、开关、灯具、插座、断路器、保险丝
  - [ ] 电器负载参数：冰箱、空调、电视、洗衣机、热水器
  - [ ] 参数查询函数正常工作

  **QA Scenarios (MANDATORY):

  ```
  Scenario: 元件参数验证
    Tool: Bun Test
    Preconditions: 类型定义已完成
    Steps:
      1. 创建src/engine/componentParams.ts
      2. 创建src/__tests__/componentParams.test.ts
      3. 测试查询基础元件参数
      4. 测试查询电器负载参数
      5. 验证参数合理性（电压、功率、阻抗）
      6. bun test src/__tests__/componentParams.test.ts
    Expected Result: 参数正确，查询成功，测试通过
    Failure Indicators: 参数错误、查询失败、类型不匹配
    Evidence: .sisyphus/evidence/task-10-params.log
  ```

  **Evidence to Capture**:
  - [ ] task-10-params.log (参数测试日志)

  **Commit**: YES (与T2, T3, T4一起)
  - Message: `feat: define component parameters (voltage, power, resistance)`
  - Files: src/engine/componentParams.ts, src/__tests__/componentParams.test.ts
  - Pre-commit: bun test

- [x] 11. 计算引擎单元测试
- [x] 12. 元件库组件 (基础元件)
- [x] 13. 元件库组件 (电器负载)
- [x] 14. SVG画布编辑器 (拖拽、连线)
- [x] 15. 元件状态管理 (开关控制)
- [x] 16. LocalStorage持久化
- [x] 17. 编辑器交互测试
- [x] 18. 电流流动动画系统
- [x] 19. 实时计算结果显示面板
- [x] 20. 负载分析面板
- [x] 21. 故障报警UI (警告动画、提示)
- [x] 22. 主页面集成
- [x] 23. 保存/加载UI功能
- [x] 24. 集成测试 (端到端场景)
- [x] 25. 性能优化 (大量元件场景)
- [x] 26. 响应式适配 (移动端支持)
- [x] 27. 构建配置优化 (静态部署准备)

  **What to do**:
  - 创建计算引擎的全面单元测试
  - 测试各种电路拓扑（串联、并联、混联）
  - 测试边界情况（空电路、单元件、短路、开路）
  - 测试数值准确性（与预期结果比较）
  - 达到80%以上代码覆盖率

  **Must NOT do**:
  - 不要测试UI交互（只测试计算逻辑）
  - 不要过度追求100%覆盖率（80%+即可）

  **Recommended Agent Profile**:
  > - **Category**: `quick`
    - Reason: 纯测试编写，基于已完成的计算引擎，测试用例相对直接
  - **Skills**: 无需特定技能

  **Parallelization**:
  - **Can Run In Parallel**: NO (必须等T7, T8, T9, T10完成)
  - **Parallel Group**: Wave 2, Final Task
  - **Blocks**: Task 24 (集成测试依赖单元测试)
  - **Blocked By**: Task 1, Task 7, Task 8, Task 9, Task 10

  **References**:
  - Vitest测试: `https://vitest.dev/guide/testing.html` - 测试最佳实践
  - **WHY**: 确保计算引擎的可靠性和正确性

  **Acceptance Criteria**:
  - [ ] src/__tests__/calculator.test.ts包含全面测试
  - [ ] 测试覆盖各种电路拓扑
  - [ ] 测试边界情况
  - [ ] 代码覆盖率 >= 80%

  **QA Scenarios (MANDATORY):

  ```
  Scenario: 单元测试验证
    Tool: Bash (bun)
    Preconditions: 计算引擎已完成
    Steps:
      1. 运行所有单元测试：bun test --coverage
      2. 检查覆盖率报告
      3. 确认覆盖率 >= 80%
      4. 保存覆盖率报告
    Expected Result: 所有测试通过，覆盖率 >= 80%
    Failure Indicators: 测试失败、覆盖率不足、测试不完整
    Evidence: .sisyphus/evidence/task-11-coverage.txt
  ```

  **Evidence to Capture**:
  - [ ] task-11-coverage.txt (覆盖率报告)

  **Commit**: NO (测试文件不单独提交，与其他功能一起提交)

- [x] 12. 元件库组件 (基础元件)
- [x] 13. 元件库组件 (电器负载)
- [x] 14. SVG画布编辑器 (拖拽、连线)
- [x] 15. 元件状态管理 (开关控制)
- [x] 16. LocalStorage持久化
- [x] 17. 编辑器交互测试
- [x] 18. 电流流动动画系统
- [x] 19. 实时计算结果显示面板
- [x] 20. 负载分析面板
- [x] 21. 故障报警UI (警告动画、提示)
- [x] 22. 主页面集成
- [x] 23. 保存/加载UI功能
- [x] 24. 集成测试 (端到端场景)
- [x] 25. 性能优化 (大量元件场景)
- [x] 26. 响应式适配 (移动端支持)
- [x] 27. 构建配置优化 (静态部署准备)

  **What to do**:
  - 创建基础元件组件（电源、开关、灯具、插座、断路器、保险丝、导线）
  - 每个元件使用SVG图标，教育风格（色彩鲜艳、图标直观）
  - 实现拖拽功能（使用React DnD或HTML5 Drag API）
  - 创建元件库面板布局（侧边栏显示所有元件）
  - 每个元件显示名称和电气参数

  **Must NOT do**:
  - 不要实现复杂拖拽库（使用HTML5原生API即可）
  - 不要过度动画（保持简洁）

  **Recommended Agent Profile**:
  > - **Category**: `visual-engineering`
    - Reason: UI组件开发，需要设计美观的元件图标，实现拖拽交互
  - **Skills**: 无需特定技能（使用HTML5 Drag API）
  - **Skills Evaluated but Omitted**: 无

  **Parallelization**:
  - **Can Run In Parallel**: YES (与T13并行)
  - **Parallel Group**: Wave 3 (Tasks 12, 13)
  - **Blocks**: Task 14 (编辑器需要元件库)
  - **Blocked By**: Task 1, Task 2, Task 6

  **References**:
  - HTML5 Drag API: `https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API` - 拖拽API
  - React Icons: `https://react-icons.github.io/react-icons/` - 图标库（可选）
  - **WHY**: 正确实现拖拽功能，创建直观的元件图标

  **Acceptance Criteria**:
  - [ ] src/components/ComponentLibrary/BasicComponents.tsx包含所有基础元件
  - [ ] 每个元件有SVG图标和名称
  - [ ] 拖拽功能正常工作
  - [ ] UI符合教育风格

  **QA Scenarios (MANDATORY):

  ```
  Scenario: 元件库组件验证
    Tool: Playwright (playwright skill)
    Preconditions: 基础UI布局已完成
    Steps:
      1. 创建基础元件组件
      2. 更新Sidebar显示元件库
      3. bun run dev &
      4. 等待服务启动
      5. 打开浏览器访问 http://localhost:5173
      6. 检查所有元件存在（电源、开关、灯具、插座等）
      7. 测试拖拽一个元件到画布
      8. 截图保存
    Expected Result: 所有元件显示正确，拖拽工作正常
    Failure Indicators: 元件缺失、拖拽失败、样式错误
    Evidence: .sisyphus/evidence/task-12-basic-components.png
  ```

  **Evidence to Capture**:
  - [ ] task-12-basic-components.png (元件库截图)

  **Commit**: YES
  - Message: `feat: create component library (basic components)`
  - Files: src/components/ComponentLibrary/BasicComponents.tsx
  - Pre-commit: bun run build

- [x] 13. 元件库组件 (电器负载)
- [x] 14. SVG画布编辑器 (拖拽、连线)
- [x] 15. 元件状态管理 (开关控制)
- [x] 16. LocalStorage持久化
- [x] 17. 编辑器交互测试
- [x] 18. 电流流动动画系统
- [x] 19. 实时计算结果显示面板
- [x] 20. 负载分析面板
- [x] 21. 故障报警UI (警告动画、提示)
- [x] 22. 主页面集成
- [x] 23. 保存/加载UI功能
- [x] 24. 集成测试 (端到端场景)
- [x] 25. 性能优化 (大量元件场景)
- [x] 26. 响应式适配 (移动端支持)
- [x] 27. 构建配置优化 (静态部署准备)

  **What to do**:
  - 创建电器负载组件（冰箱、空调、电视、洗衣机、热水器）
  - 每个负载使用SVG图标，显示典型功率值
  - 实现拖拽功能
  - 在元件库面板中分类显示（基础元件 vs 电器负载）
  - 每个负载显示名称和功率参数

  **Must NOT do**:
  - 不要添加过多电器（限制在需求列表内）
  - 不要过度详细（只显示关键参数）

  **Recommended Agent Profile**:
  > - **Category**: `visual-engineering`
    - Reason: UI组件开发，创建电器负载图标，风格与基础元件一致
  - **Skills**: 无需特定技能

  **Parallelization**:
  - **Can Run In Parallel**: YES (与T12并行)
  - **Parallel Group**: Wave 3 (Tasks 12, 13)
  - **Blocks**: Task 14 (编辑器需要元件库)
  - **Blocked By**: Task 1, Task 2, Task 6, Task 10

  **References**:
  - 同T12
  - **WHY**: 保持风格一致，实现拖拽功能

  **Acceptance Criteria**:
  - [ ] src/components/ComponentLibrary/ApplianceComponents.tsx包含所有电器负载
  - [ ] 每个负载有SVG图标、名称和功率
  - [ ] 拖拽功能正常工作
  - [ ] UI与基础元件风格一致

  **QA Scenarios (MANDATORY):

  ```
  Scenario: 电器负载组件验证
    Tool: Playwright (playwright skill)
    Preconditions: 基础元件库已完成
    Steps:
      1. 创建电器负载组件
      2. 更新元件库显示电器负载
      3. bun run dev &
      4. 等待服务启动
      5. 打开浏览器访问 http://localhost:5173
      6. 检查所有电器负载存在
      7. 测试拖拽一个电器到画布
      8. 截图保存
    Expected Result: 所有电器显示正确，拖拽工作正常，风格一致
    Failure Indicators: 电器缺失、拖拽失败、风格不一致
    Evidence: .sisyphus/evidence/task-13-appliance-components.png
  ```

  **Evidence to Capture**:
  - [ ] task-13-appliance-components.png (电器库截图)

  **Commit**: YES
  - Message: `feat: create component library (appliance loads)`
  - Files: src/components/ComponentLibrary/ApplianceComponents.tsx
  - Pre-commit: bun run build

- [x] 14. SVG画布编辑器 (拖拽、连线)
- [x] 15. 元件状态管理 (开关控制)
- [x] 16. LocalStorage持久化
- [x] 17. 编辑器交互测试
- [x] 18. 电流流动动画系统
- [x] 19. 实时计算结果显示面板
- [x] 20. 负载分析面板
- [x] 21. 故障报警UI (警告动画、提示)
- [x] 22. 主页面集成
- [x] 23. 保存/加载UI功能
- [x] 24. 集成测试 (端到端场景)
- [x] 25. 性能优化 (大量元件场景)
- [x] 26. 响应式适配 (移动端支持)
- [x] 27. 构建配置优化 (静态部署准备)

  **What to do**:
  - 创建SVG画布组件（CircuitCanvas）
  - 实现元件放置（从元件库拖拽到画布）
  - 实现连线功能（点击两个元件创建连线）
  - 实现元件选择和删除
  - 实现画布缩放和平移
  - 维护画布状态（元件位置、连接关系）

  **Must NOT do**:
  - 不要实现复杂路由算法（只做简单连线）
  - 不要过度复杂（保持核心功能）

  **Recommended Agent Profile**:
  > - **Category**: `unspecified-high`
    - Reason: SVG编辑器核心功能，需要处理拖拽、连线、状态管理等多个方面
  - **Skills**: 无需特定技能

  **Parallelization**:
  - **Can Run In Parallel**: NO (必须等T9, T12, T13完成)
  - **Parallel Group**: Wave 3, Core Task
  - **Blocks**: Task 15, 18, 22 (所有依赖画布的模块)
  - **Blocked By**: Task 1, Task 2, Task 6, Task 9, Task 12, Task 13

  **References**:
  - React SVG: `https://react.dev/reference/react-dom/components/svg` - React SVG组件
  - SVG事件: `https://developer.mozilla.org/en-US/docs/Web/SVG/Element` - SVG元素事件
  - **WHY**: 正确实现SVG画布交互

  **Acceptance Criteria**:
  - [ ] src/components/Editor/CircuitCanvas.tsx包含画布编辑器
  - [ ] 元件放置功能正常工作
  - [ ] 连线功能正常工作
  - [ ] 选择和删除功能正常工作
  - [ ] 缩放和平移功能正常工作

  **QA Scenarios (MANDATORY):

  ```
  Scenario: 画布编辑器验证
    Tool: Playwright (playwright skill)
    Preconditions: 元件库已完成
    Steps:
      1. 创建画布编辑器组件
      2. 更新Main区域显示画布
      3. bun run dev &
      4. 等待服务启动
      5. 打开浏览器访问 http://localhost:5173
      6. 测试拖拽电源到画布
      7. 测试拖拽灯具到画布
      8. 测试创建连线（电源→灯具）
      9. 测试删除元件
      10. 截图保存
    Expected Result: 所有功能正常工作
    Failure Indicators: 拖拽失败、连线失败、删除失败
    Evidence: .sisyphus/evidence/task-14-canvas.png
  ```

  **Evidence to Capture**:
  - [ ] task-14-canvas.png (画布截图)

  **Commit**: YES
  - Message: `feat: build SVG circuit editor with drag-and-drop`
  - Files: src/components/Editor/CircuitCanvas.tsx
  - Pre-commit: bun run build

- [x] 15. 元件状态管理 (开关控制)
- [x] 16. LocalStorage持久化
- [x] 17. 编辑器交互测试
- [x] 18. 电流流动动画系统
- [x] 19. 实时计算结果显示面板
- [x] 20. 负载分析面板
- [x] 21. 故障报警UI (警告动画、提示)
- [x] 22. 主页面集成
- [x] 23. 保存/加载UI功能
- [x] 24. 集成测试 (端到端场景)
- [x] 25. 性能优化 (大量元件场景)
- [x] 26. 响应式适配 (移动端支持)
- [x] 27. 构建配置优化 (静态部署准备)

  **What to do**:
  - 实现元件状态管理（开关开/关、断路器跳闸）
  - 创建元件点击事件处理（点击开关切换状态）
  - 更新电路计算（状态改变时重新计算）
  - 显示元件状态（视觉反馈：开/关颜色变化）
  - 集成到画布编辑器

  **Must NOT do**:
  - 不要实现复杂状态机（只处理开/关）
  - 不要过度状态（保持简单）

  **Recommended Agent Profile**:
  > - **Category**: `unspecified-high`
    - Reason: 状态管理需要集成计算引擎和UI，处理事件和状态同步
  - **Skills**: 无需特定技能

  **Parallelization**:
  - **Can Run In Parallel**: NO (必须等T7, T14完成)
  - **Parallel Group**: Wave 3
  - **Blocks**: Task 18, 19 (动画和结果显示依赖状态)
  - **Blocked By**: Task 1, Task 4, Task 7, Task 14

  **References**:
  - React状态: `https://react.dev/learn/managing-state` - React状态管理
  - 电路状态: 已在T7中实现
  - **WHY**: 正确实现状态同步和计算更新

  **Acceptance Criteria**:
  - [ ] src/components/Editor/ComponentStateManager.tsx包含状态管理
  - [ ] 开关切换功能正常工作
  - [ ] 状态改变时重新计算电路
  - [ ] 视觉反馈正确（颜色变化）

  **QA Scenarios (MANDATORY):

  ```
  Scenario: 元件状态管理验证
    Tool: Playwright (playwright skill)
    Preconditions: 画布编辑器已完成
    Steps:
      1. 创建状态管理组件
      2. 集成到画布编辑器
      3. bun run dev &
      4. 等待服务启动
      5. 打开浏览器访问 http://localhost:5173
      6. 创建简单电路（电源-开关-灯具）
      7. 点击开关切换状态
      8. 检查灯具状态变化（亮/灭）
      9. 截图保存
    Expected Result: 开关切换正常，灯具状态同步
    Failure Indicators: 状态不更新、计算错误、视觉反馈缺失
    Evidence: .sisyphus/evidence/task-15-state.png
  ```

  **Evidence to Capture**:
  - [ ] task-15-state.png (状态管理截图)

  **Commit**: YES
  - Message: `feat: implement component state management (switch control)`
  - Files: src/components/Editor/ComponentStateManager.tsx
  - Pre-commit: bun test

- [x] 16. LocalStorage持久化
- [x] 17. 编辑器交互测试
- [x] 18. 电流流动动画系统
- [x] 19. 实时计算结果显示面板
- [x] 20. 负载分析面板
- [x] 21. 故障报警UI (警告动画、提示)
- [x] 22. 主页面集成
- [x] 23. 保存/加载UI功能
- [x] 24. 集成测试 (端到端场景)
- [x] 25. 性能优化 (大量元件场景)
- [x] 26. 响应式适配 (移动端支持)
- [x] 27. 构建配置优化 (静态部署准备)

  **What to do**:
  - 实现电路图保存到LocalStorage（saveCircuit）
  - 实现从LocalStorage加载电路图（loadCircuit）
  - 创建保存/加载按钮（在Header中）
  - 实现自动保存功能（每隔30秒或操作后）
  - 处理错误状态（存储空间不足、数据损坏）

  **Must NOT do**:
  - 不要使用IndexedDB（LocalStorage足够）
  - 不要实现云端同步（纯本地）

  **Recommended Agent Profile**:
  > - **Category**: `quick`
    - Reason: LocalStorage API简单，保存/加载逻辑直接
  - **Skills**: 无需特定技能

  **Parallelization**:
  - **Can Run In Parallel**: YES (与T17并行)
  - **Parallel Group**: Wave 3 (Tasks 16, 17)
  - **Blocks**: Task 23 (UI功能依赖)
  - **Blocked By**: Task 1, Task 14

  **References**:
  - LocalStorage: `https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage` - LocalStorage API
  - **WHY**: 正确使用LocalStorage API，处理错误情况

  **Acceptance Criteria**:
  - [ ] src/utils/storage.ts包含保存/加载函数
  - [ ] 保存功能正常工作
  - [ ] 加载功能正常工作
  - [ ] 自动保存功能正常工作

  **QA Scenarios (MANDATORY):

  ```
  Scenario: LocalStorage持久化验证
    Tool: Playwright (playwright skill)
    Preconditions: 画布编辑器已完成
    Steps:
      1. 创建storage工具函数
      2. 更新Header添加保存/加载按钮
      3. bun run dev &
      4. 等待服务启动
      5. 打开浏览器访问 http://localhost:5173
      6. 创建简单电路
      7. 点击保存按钮
      8. 刷新页面
      9. 点击加载按钮
      10. 验证电路恢复
      11. 截图保存
    Expected Result: 保存和加载功能正常
    Failure Indicators: 保存失败、加载失败、数据损坏
    Evidence: .sisyphus/evidence/task-16-storage.png
  ```

  **Evidence to Capture**:
  - [ ] task-16-storage.png (存储功能截图)

  **Commit**: YES
  - Message: `feat: implement LocalStorage persistence for circuit designs`
  - Files: src/utils/storage.ts
  - Pre-commit: bun test

- [x] 17. 编辑器交互测试
- [x] 18. 电流流动动画系统
- [x] 19. 实时计算结果显示面板
- [x] 20. 负载分析面板
- [x] 21. 故障报警UI (警告动画、提示)
- [x] 22. 主页面集成
- [x] 23. 保存/加载UI功能
- [x] 24. 集成测试 (端到端场景)
- [x] 25. 性能优化 (大量元件场景)
- [x] 26. 响应式适配 (移动端支持)
- [x] 27. 构建配置优化 (静态部署准备)

  **What to do**:
  - 创建编辑器的端到端测试（拖拽、连线、删除）
  - 测试复杂电路场景（多个元件、多条连线）
  - 测试边界情况（空画布、大量元件、快速操作）
  - 测试错误处理（无效操作、断路）
  - 确保编辑器在各种场景下稳定运行

  **Must NOT do**:
  - 不要测试UI渲染细节（只测试交互逻辑）
  - 不要过度测试（覆盖主要场景即可）

  **Recommended Agent Profile**:
  > - **Category**: `unspecified-high`
    - Reason: 编辑器交互测试需要覆盖多种场景，使用Playwright进行E2E测试
  - **Skills**: `playwright` (用于浏览器交互测试)

  **Parallelization**:
  - **Can Run In Parallel**: NO (必须等T14, T15, T16完成)
  - **Parallel Group**: Wave 3, Final Task
  - **Blocks**: Task 24 (集成测试依赖编辑器测试)
  - **Blocked By**: Task 1, Task 14, Task 15, Task 16

  **References**:
  - Playwright: `https://playwright.dev/docs/intro` - Playwright测试框架
  - **WHY**: 确保编辑器在各种场景下稳定运行

  **Acceptance Criteria**:
  - [ ] src/__tests__/editor.e2e.ts包含编辑器测试
  - [ ] 测试覆盖拖拽、连线、删除
  - [ ] 测试覆盖复杂电路场景
  - [ ] 测试覆盖边界情况

  **QA Scenarios (MANDATORY):

  ```
  Scenario: 编辑器交互测试验证
    Tool: Bash (bun)
    Preconditions: 编辑器已完成
    Steps:
      1. 创建编辑器E2E测试
      2. 运行测试：bun test src/__tests__/editor.e2e.ts
      3. 检查测试结果
      4. 保存测试日志
    Expected Result: 所有测试通过
    Failure Indicators: 测试失败、场景不完整
    Evidence: .sisyphus/evidence/task-17-editor-test.log
  ```

  **Evidence to Capture**:
  - [ ] task-17-editor-test.log (编辑器测试日志)

  **Commit**: NO (测试文件不单独提交)

- [x] 18. 电流流动动画系统
- [x] 19. 实时计算结果显示面板
- [x] 20. 负载分析面板
- [x] 21. 故障报警UI (警告动画、提示)
- [x] 22. 主页面集成
- [x] 23. 保存/加载UI功能
- [x] 24. 集成测试 (端到端场景)
- [x] 25. 性能优化 (大量元件场景)
- [x] 26. 响应式适配 (移动端支持)
- [x] 27. 构建配置优化 (静态部署准备)

  **What to do**:
  - 创建电流流动动画（SVG路径动画）
  - 动画效果：流动的粒子或渐变色
  - 根据电流方向和大小调整动画速度
  - 开关断开时停止动画
  - 使用CSS动画或SVG动画实现

  **Must NOT do**:
  - 不要使用复杂动画库（使用原生CSS/SVG即可）
  - 不要过度动画（保持流畅简洁）

  **Recommended Agent Profile**:
  > - **Category**: `visual-engineering`
    - Reason: 动画系统开发，需要设计流畅的视觉效果，优化性能
  - **Skills**: 无需特定技能（CSS/SVG动画）

  **Parallelization**:
  - **Can Run In Parallel**: YES (与T19, T20, T21并行)
  - **Parallel Group**: Wave 4 (Tasks 18, 19, 20, 21)
  - **Blocks**: Task 22 (主页面集成依赖)
  - **Blocked By**: Task 1, Task 7, Task 14, Task 15

  **References**:
  - CSS动画: `https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations` - CSS动画
  - SVG动画: `https://developer.mozilla.org/en-US/docs/Web/SVG/Element/animate` - SVG动画
  - **WHY**: 正确实现流畅的电流流动动画

  **Acceptance Criteria**:
  - [ ] src/components/Visualizer/CurrentFlow.tsx包含动画系统
  - [ ] 电流流动动画流畅
  - [ ] 动画速度根据电流大小调整
  - [ ] 开关断开时动画停止

  **QA Scenarios (MANDATORY):

  ```
  Scenario: 电流流动动画验证
    Tool: Playwright (playwright skill)
    Preconditions: 编辑器和状态管理已完成
    Steps:
      1. 创建电流流动动画组件
      2. 集成到画布编辑器
      3. bun run dev &
      4. 等待服务启动
      5. 打开浏览器访问 http://localhost:5173
      6. 创建简单电路（电源-开关-灯具）
      7. 打开开关，观察电流流动动画
      8. 关闭开关，观察动画停止
      9. 录制视频或截图
    Expected Result: 电流流动动画流畅，开关切换正确
    Failure Indicators: 动画卡顿、不流畅、状态不同步
    Evidence: .sisyphus/evidence/task-18-animation.mp4
  ```

  **Evidence to Capture**:
  - [ ] task-18-animation.mp4 (动画视频)

  **Commit**: YES
  - Message: `feat: add current flow visualization animations`
  - Files: src/components/Visualizer/CurrentFlow.tsx
  - Pre-commit: bun run build

- [x] 19. 实时计算结果显示面板
- [x] 20. 负载分析面板
- [x] 21. 故障报警UI (警告动画、提示)
- [x] 22. 主页面集成
- [x] 23. 保存/加载UI功能
- [x] 24. 集成测试 (端到端场景)
- [x] 25. 性能优化 (大量元件场景)
- [x] 26. 响应式适配 (移动端支持)
- [x] 27. 构建配置优化 (静态部署准备)

  **What to do**:
  - 创建计算结果显示面板（电压、电流、功率）
  - 显示每个元件的电气参数
  - 实时更新（电路状态改变时更新）
  - 使用教育友好的显示方式（颜色编码、图标）
  - 集成到画布或侧边栏

  **Must NOT do**:
  - 不要显示过多细节（只显示关键参数）
  - 不要过度设计（保持简洁清晰）

  **Recommended Agent Profile**:
  > - **Category**: `visual-engineering`
    - Reason: UI组件开发，需要设计清晰的信息显示，符合教育风格
  - **Skills**: 无需特定技能

  **Parallelization**:
  - **Can Run In Parallel**: YES (与T18, T20, T21并行)
  - **Parallel Group**: Wave 4 (Tasks 18, 19, 20, 21)
  - **Blocks**: Task 22 (主页面集成依赖)
  - **Blocked By**: Task 1, Task 7, Task 14, Task 15

  **References**:
  - React数据显示: `https://react.dev/learn/thinking-in-react` - React数据显示模式
  - **WHY**: 正确显示计算结果，实时更新

  **Acceptance Criteria**:
  - [ ] src/components/Panel/CalculationResults.tsx包含结果显示
  - [ ] 显示电压、电流、功率
  - [ ] 实时更新（电路状态改变时）
  - [ ] 教育友好的显示方式

  **QA Scenarios (MANDATORY):

  ```
  Scenario: 计算结果显示验证
    Tool: Playwright (playwright skill)
    Preconditions: 计算引擎和状态管理已完成
    Steps:
      1. 创建计算结果显示面板
      2. 集成到画布编辑器
      3. bun run dev &
      4. 等待服务启动
      5. 打开浏览器访问 http://localhost:5173
      6. 创建简单电路（电源-开关-灯具）
      7. 打开开关，检查计算结果显示
      8. 关闭开关，检查结果更新
      9. 截图保存
    Expected Result: 计算结果正确显示，实时更新
    Failure Indicators: 显示错误、不更新、数值错误
    Evidence: .sisyphus/evidence/task-19-results.png
  ```

  **Evidence to Capture**:
  - [ ] task-19-results.png (结果显示截图)

  **Commit**: YES
  - Message: `feat: create real-time calculation results display panel`
  - Files: src/components/Panel/CalculationResults.tsx
  - Pre-commit: bun run build

- [x] 20. 负载分析面板
- [x] 21. 故障报警UI (警告动画、提示)
- [x] 22. 主页面集成
- [x] 23. 保存/加载UI功能
- [x] 24. 集成测试 (端到端场景)
- [x] 25. 性能优化 (大量元件场景)
- [x] 26. 响应式适配 (移动端支持)
- [x] 27. 构建配置优化 (静态部署准备)

  **What to do**:
  - 创建负载分析面板（各支路负载统计）
  - 显示总负载和各支路负载
  - 负载超载警告（超过额定容量）
  - 使用图表或进度条显示负载比例
  - 集成到侧边栏或独立面板

  **Must NOT do**:
  - 不要使用复杂图表库（简单的进度条即可）
  - 不要过度详细（只显示关键信息）

  **Recommended Agent Profile**:
  > - **Category**: `visual-engineering`
    - Reason: UI组件开发，需要设计清晰的负载显示，使用进度条等可视化
  - **Skills**: 无需特定技能

  **Parallelization**:
  - **Can Run In Parallel**: YES (与T18, T19, T21并行)
  - **Parallel Group**: Wave 4 (Tasks 18, 19, 20, 21)
  - **Blocks**: Task 22 (主页面集成依赖)
  - **Blocked By**: Task 1, Task 7, Task 14, Task 15

  **References**:
  - React进度条: 可使用简单的div实现
  - **WHY**: 正确显示负载分析，清晰易懂

  **Acceptance Criteria**:
  - [ ] src/components/Panel/LoadAnalysis.tsx包含负载分析
  - [ ] 显示总负载和各支路负载
  - [ ] 超载警告功能正常工作
  - [ ] 可视化显示（进度条）

  **QA Scenarios (MANDATORY):

  ```
  Scenario: 负载分析验证
    Tool: Playwright (playwright skill)
    Preconditions: 计算引擎和状态管理已完成
    Steps:
      1. 创建负载分析面板
      2. 集成到侧边栏
      3. bun run dev &
      4. 等待服务启动
      5. 打开浏览器访问 http://localhost:5173
      6. 创建多支路电路
      7. 检查负载分析显示
      8. 添加更多负载，检查超载警告
      9. 截图保存
    Expected Result: 负载分析正确显示，超载警告工作
    Failure Indicators: 显示错误、警告失败、计算错误
    Evidence: .sisyphus/evidence/task-20-load.png
  ```

  **Evidence to Capture**:
  - [ ] task-20-load.png (负载分析截图)

  **Commit**: YES
  - Message: `feat: create load analysis panel`
  - Files: src/components/Panel/LoadAnalysis.tsx
  - Pre-commit: bun run build

- [x] 21. 故障报警UI (警告动画、提示)
- [x] 22. 主页面集成
- [x] 23. 保存/加载UI功能
- [x] 24. 集成测试 (端到端场景)
- [x] 25. 性能优化 (大量元件场景)
- [x] 26. 响应式适配 (移动端支持)
- [x] 27. 构建配置优化 (静态部署准备)

  **What to do**:
  - 创建故障报警UI（短路、过载）
  - 警告动画（闪烁、颜色变化）
  - 故障位置标记（在画布上高亮）
  - 故障提示信息（简短易懂）
  - 故障清除功能（修复后清除报警）

  **Must NOT do**:
  - 不要过度惊吓（保持友好）
  - 不要阻塞用户（警告但不阻止操作）

  **Recommended Agent Profile**:
  > - **Category**: `visual-engineering`
    - Reason: UI组件开发，需要设计明显的故障提示，使用动画和颜色
  - **Skills**: 无需特定技能

  **Parallelization**:
  - **Can Run In Parallel**: YES (与T18, T19, T20并行)
  - **Parallel Group**: Wave 4 (Tasks 18, 19, 20, 21)
  - **Blocks**: Task 22 (主页面集成依赖)
  - **Blocked By**: Task 1, Task 7, Task 8, Task 14, Task 15

  **References**:
  - CSS动画: 同T18
  - React警告: `https://react.dev/learn/synchronizing-with-effects` - React副作用
  - **WHY**: 正确实现故障报警，明显但不打扰

  **Acceptance Criteria**:
  - [ ] src/components/Alert/FaultAlert.tsx包含故障报警UI
  - [ ] 警告动画流畅
  - [ ] 故障位置正确标记
  - [ ] 故障提示信息清晰

  **QA Scenarios (MANDATORY):

  ```
  Scenario: 故障报警UI验证
    Tool: Playwright (playwright skill)
    Preconditions: 故障检测已完成
    Steps:
      1. 创建故障报警UI组件
      2. 集成到画布编辑器
      3. bun run dev &
      4. 等待服务启动
      5. 打开浏览器访问 http://localhost:5173
      6. 创建短路电路（直接连接电源正负极）
      7. 检查短路报警和位置标记
      8. 创建过载电路（多个大功率负载）
      9. 检查过载报警
      10. 截图保存
    Expected Result: 故障报警正确显示，位置标记准确
    Failure Indicators: 报警失败、位置错误、动画问题
    Evidence: .sisyphus/evidence/task-21-alert.png
  ```

  **Evidence to Capture**:
  - [ ] task-21-alert.png (故障报警截图)

  **Commit**: YES
  - Message: `feat: create fault alert UI (warning animation, tips)`
  - Files: src/components/Alert/FaultAlert.tsx
  - Pre-commit: bun run build

- [x] 22. 主页面集成
- [x] 23. 保存/加载UI功能
- [x] 24. 集成测试 (端到端场景)
- [x] 25. 性能优化 (大量元件场景)
- [x] 26. 响应式适配 (移动端支持)
- [x] 27. 构建配置优化 (静态部署准备)

  **What to do**:
  - 集成所有组件到主页面
  - 布局：头部（Header）、侧边栏（元件库）、主内容（画布）、底部（信息栏）
  - 集成计算结果显示面板、负载分析面板、故障报警UI
  - 集成电流流动动画
  - 确保所有功能正常协同工作

  **Must NOT do**:
  - 不要添加新功能（只做集成）
  - 不要过度修改现有组件

  **Recommended Agent Profile**:
  > - **Category**: `unspecified-high`
    - Reason: 主页面集成需要协调多个模块，确保所有功能协同工作
  - **Skills**: 无需特定技能

  **Parallelization**:
  - **Can Run In Parallel**: NO (必须等T18, T19, T20, T21完成)
  - **Parallel Group**: Wave 4, Core Task
  - **Blocks**: Task 24 (集成测试依赖)
  - **Blocked By**: Task 1, Task 6, Task 14, Task 18, T19, T20, T21

  **References**:
  - React组件: `https://react.dev/learn` - React组件开发
  - **WHY**: 正确集成所有组件，确保协同工作

  **Acceptance Criteria**:
  - [ ] src/App.tsx包含所有组件集成
  - [ ] 布局正确（Header, Sidebar, Main, Footer）
  - [ ] 所有功能正常协同工作
  - [ ] 应用可正常构建和运行

  **QA Scenarios (MANDATORY):

  ```
  Scenario: 主页面集成验证
    Tool: Playwright (playwright skill)
    Preconditions: 所有组件已完成
    Steps:
      1. 集成所有组件到主页面
      2. bun run dev &
      3. 等待服务启动
      4. 打开浏览器访问 http://localhost:5173
      5. 检查页面布局
      6. 测试完整流程：创建电路、拖拽元件、连线、计算、动画、报警
      7. 截图保存
    Expected Result: 所有功能正常协同工作
    Failure Indicators: 布局错误、功能冲突、集成失败
    Evidence: .sisyphus/evidence/task-22-integration.png
  ```

  **Evidence to Capture**:
  - [ ] task-22-integration.png (主页面截图)

  **Commit**: YES
  - Message: `feat: integrate all components into main application`
  - Files: src/App.tsx
  - Pre-commit: bun test

- [x] 23. 保存/加载UI功能
- [x] 24. 集成测试 (端到端场景)
- [x] 25. 性能优化 (大量元件场景)
- [x] 26. 响应式适配 (移动端支持)
- [x] 27. 构建配置优化 (静态部署准备)

  **What to do**:
  - 在Header中添加保存/加载按钮
  - 实现保存按钮点击事件（调用localStorage保存）
  - 实现加载按钮点击事件（从localStorage加载）
  - 添加保存/加载成功提示（Toast消息）
  - 处理错误状态（无数据、数据损坏）

  **Must NOT do**:
  - 不要添加复杂UI（简单按钮即可）
  - 不要过度提示（简洁清晰）

  **Recommended Agent Profile**:
  > - **Category**: `quick`
    - Reason: UI功能简单，基于T16的storage工具，只做按钮和事件处理
  - **Skills**: 无需特定技能

  **Parallelization**:
  - **Can Run In Parallel**: YES (与T22可以并行，但依赖T16)
  - **Parallel Group**: Wave 4 (Tasks 18-23)
  - **Blocks**: 无（最后一个功能任务）
  - **Blocked By**: Task 1, Task 16

  **References**:
  - React事件: `https://react.dev/learn/responding-to-events` - React事件处理
  - LocalStorage: 同T16
  - **WHY**: 正确实现保存/加载UI，提供良好的用户体验

  **Acceptance Criteria**:
  - [ ] Header包含保存/加载按钮
  - [ ] 保存功能正常工作
  - [ ] 加载功能正常工作
  - [ ] 成功提示正常显示

  **QA Scenarios (MANDATORY):

  ```
  Scenario: 保存/加载UI验证
    Tool: Playwright (playwright skill)
    Preconditions: 主页面集成已完成
    Steps:
      1. 更新Header添加保存/加载按钮
      2. 实现按钮事件处理
      3. bun run dev &
      4. 等待服务启动
      5. 打开浏览器访问 http://localhost:5173
      6. 创建简单电路
      7. 点击保存按钮
      8. 刷新页面
      9. 点击加载按钮
      10. 验证电路恢复
      11. 截图保存
    Expected Result: 保存和加载功能正常，提示显示正确
    Failure Indicators: 按钮无响应、功能失败、提示缺失
    Evidence: .sisyphus/evidence/task-23-ui-storage.png
  ```

  **Evidence to Capture**:
  - [ ] task-23-ui-storage.png (保存/加载UI截图)

  **Commit**: YES
  - Message: `feat: add save/load UI buttons with toast notifications`
  - Files: src/components/Header.tsx (update)
  - Pre-commit: bun test

- [x] 24. 集成测试 (端到端场景)
- [x] 25. 性能优化 (大量元件场景)
- [x] 26. 响应式适配 (移动端支持)
- [x] 27. 构建配置优化 (静态部署准备)

  **What to do**:
  - 创建完整的端到端测试场景
  - 测试用户主要工作流：创建电路→连接元件→运行仿真→查看结果→保存
  - 测试各种电路拓扑：简单串联、简单并联、混联电路
  - 测试故障场景：短路、过载
  - 测试边界情况：空电路、大量元件、快速操作
  - 确保应用在各种场景下稳定运行

  **Must NOT do**:
  - 不要过度测试（覆盖主要场景即可）
  - 不要测试UI细节（只测试功能流程）

  **Recommended Agent Profile**:
  > - **Category**: `deep`
    - Reason: 端到端测试需要覆盖多个功能模块，确保整体稳定性
  - **Skills**: `playwright` (用于E2E测试)

  **Parallelization**:
  - **Can Run In Parallel**: NO (必须等所有实现任务完成)
  - **Parallel Group**: Wave 5, Core Task
  - **Blocks**: Task F1-F4 (最终审查依赖测试)
  - **Blocked By**: Task 1, Task 14, T15, T16, T18-23

  **References**:
  - Playwright E2E: `https://playwright.dev/docs/intro` - Playwright E2E测试
  - **WHY**: 确保应用在各种场景下稳定运行

  **Acceptance Criteria**:
  - [ ] src/__tests__/e2e/*.spec.ts包含E2E测试
  - [ ] 测试覆盖主要工作流
  - [ ] 测试覆盖各种电路拓扑
  - [ ] 测试覆盖故障场景
  - [ ] 测试覆盖边界情况

  **QA Scenarios (MANDATORY):

  ```
  Scenario: 集成测试验证
    Tool: Bash (bun)
    Preconditions: 所有功能已完成
    Steps:
      1. 创建E2E测试
      2. 运行测试：bun test src/__tests__/e2e/*.spec.ts
      3. 检查测试结果
      4. 保存测试日志和报告
    Expected Result: 所有E2E测试通过
    Failure Indicators: 测试失败、场景不完整、不稳定
    Evidence: .sisyphus/evidence/task-24-e2e.log
  ```

  **Evidence to Capture**:
  - [ ] task-24-e2e.log (E2E测试日志)

  **Commit**: NO (测试文件不单独提交)

- [x] 25. 性能优化 (大量元件场景)
- [x] 26. 响应式适配 (移动端支持)
- [x] 27. 构建配置优化 (静态部署准备)

  **What to do**:
  - 测试大量元件场景（50+元件）
  - 优化计算引擎性能（减少重复计算）
  - 优化渲染性能（减少不必要的重渲染）
  - 使用React.memo、useMemo等优化技术
  - 测试优化效果（FPS、响应时间）

  **Must NOT do**:
  - 不要过度优化（够用即可）
  - 不要牺牲代码可读性

  **Recommended Agent Profile**:
  > - **Category**: `unspecified-high`
    - Reason: 性能优化需要分析瓶颈，应用优化技术，测试效果
  - **Skills**: 无需特定技能

  **Parallelization**:
  - **Can Run In Parallel**: YES (与T26, T27并行)
  - **Parallel Group**: Wave 5 (Tasks 24-27)
  - **Blocks**: 无（优化任务）
  - **Blocked By**: Task 1, T14-23

  **References**:
  - React性能: `https://react.dev/learn/render-and-commit` - React渲染优化
  - **WHY**: 确保应用在大规模场景下仍然流畅

  **Acceptance Criteria**:
  - [ ] 50+元件场景下FPS >= 30
  - [ ] 计算引擎性能优化完成
  - [ ] 渲染性能优化完成
  - [ ] 无明显卡顿

  **QA Scenarios (MANDATORY):

  ```
  Scenario: 性能优化验证
    Tool: Playwright (playwright skill)
    Preconditions: 所有功能已完成
    Steps:
      1. 创建大量元件电路（50+元件）
      2. 测试FPS和响应时间
      3. 如果性能不足，应用优化
      4. 重新测试性能
      5. 保存性能报告
    Expected Result: FPS >= 30，无明显卡顿
    Failure Indicators: 性能不足、优化无效
    Evidence: .sisyphus/evidence/task-25-performance.txt
  ```

  **Evidence to Capture**:
  - [ ] task-25-performance.txt (性能报告)

  **Commit**: YES (如有优化)
  - Message: `perf: optimize performance for large circuits (50+ components)`
  - Files: 优化后的文件
  - Pre-commit: bun test

- [x] 26. 响应式适配 (移动端支持)
- [x] 27. 构建配置优化 (静态部署准备)

  **What to do**:
  - 测试移动端显示（手机、平板）
  - 优化布局适应不同屏幕尺寸
  - 调整元件库、面板在小屏幕上的显示
  - 测试触摸操作（移动端拖拽）
  - 使用Tailwind响应式类名（md:, lg:）

  **Must NOT do**:
  - 不要过度复杂（保持核心功能）
  - 不要为小屏幕大幅改变功能

  **Recommended Agent Profile**:
  > - **Category**: `visual-engineering`
    - Reason: 响应式设计需要适配不同屏幕，调整布局和交互
  - **Skills**: 无需特定技能（Tailwind响应式）

  **Parallelization**:
  - **Can Run In Parallel**: YES (与T25, T27并行)
  - **Parallel Group**: Wave 5 (Tasks 24-27)
  - **Blocks**: 无（适配任务）
  - **Blocked By**: Task 1, T6, T14-23

  **References**:
  - Tailwind响应式: `https://tailwindcss.com/docs/responsive-design` - Tailwind响应式设计
  - **WHY**: 确保应用在各种设备上正常工作

  **Acceptance Criteria**:
  - [ ] 移动端布局正常工作
  - [ ] 平板端布局正常工作
  - [ ] 触摸操作正常工作
  - [ ] 无明显功能缺失

  **QA Scenarios (MANDATORY):

  ```
  Scenario: 响应式适配验证
    Tool: Playwright (playwright skill)
    Preconditions: 所有功能已完成
    Steps:
      1. 测试手机端显示（375px宽度）
      2. 测试平板端显示（768px宽度）
      3. 测试触摸操作
      4. 截图保存（不同屏幕尺寸）
    Expected Result: 各种屏幕尺寸下布局正常，功能可用
    Failure Indicators: 布局错误、功能缺失、触摸失效
    Evidence: .sisyphus/evidence/task-26-responsive.png
  ```

  **Evidence to Capture**:
  - [ ] task-26-responsive.png (响应式截图)

  **Commit**: YES (如有适配)
  - Message: `feat: add responsive design support (mobile and tablet)`
  - Files: 响应式调整后的文件
  - Pre-commit: bun run build

- [x] 27. 构建配置优化 (静态部署准备)

  **What to do**:
  - 优化Vite构建配置
  - 配置生产环境优化（代码压缩、tree-shaking）
  - 配置静态资源处理
  - 配置构建输出目录和文件名
  - 测试生产构建结果
  - 更新README.md添加部署说明

  **Must NOT do**:
  - 不要添加不必要的构建步骤
  - 不要过度压缩（保持可调试性）

  **Recommended Agent Profile**:
  > - **Category**: `quick`
    - Reason: 构建配置优化是标准步骤，按照Vite最佳实践
  - **Skills**: 无需特定技能

  **Parallelization**:
  - **Can Run In Parallel**: YES (与T25, T26并行)
  - **Parallel Group**: Wave 5 (Tasks 24-27)
  - **Blocks**: 无（构建优化）
  - **Blocked By**: Task 1, T14-23

  **References**:
  - Vite生产构建: `https://vitejs.dev/guide/build.html` - Vite构建配置
  - Vite部署: `https://vitejs.dev/guide/static-deploy.html` - Vite静态部署
  - **WHY**: 确保应用可以正确部署到静态托管

  **Acceptance Criteria**:
  - [ ] vite.config.ts生产环境优化完成
  - [ ] 构建输出正常（dist目录）
  - [ ] 构建产物可正常运行
  - [ ] README.md包含部署说明

  **QA Scenarios (MANDATORY):

  ```
  Scenario: 构建配置验证
    Tool: Bash (bun)
    Preconditions: 所有功能已完成
    Steps:
      1. 优化vite.config.ts
      2. 运行构建：bun run build
      3. 检查构建输出
      4. 测试构建产物：bun run preview
      5. 保存构建日志
    Expected Result: 构建成功，产物正常运行
    Failure Indicators: 构建失败、产物错误、运行失败
    Evidence: .sisyphus/evidence/task-27-build.log
  ```

  **Evidence to Capture**:
  - [ ] task-27-build.log (构建日志)

  **Commit**: YES
  - Message: `build: optimize Vite build configuration for production deployment`
  - Files: vite.config.ts, README.md (update)
  - Pre-commit: bun run build

---

## Final Verification Wave (MANDATORY — after ALL implementation tasks)

> 4 review agents run in PARALLEL. ALL must APPROVE. Rejection → fix → re-run.

- [x] F1. **Plan Compliance Audit** — `oracle`
- [x] F2. **Code Quality Review** — `unspecified-high`
- [x] F3. **Real Manual QA** — `unspecified-high` (+ `playwright` skill if UI)
- [x] F4. **Scope Fidelity Check** — `deep`
  Read the plan end-to-end. For each "Must Have": verify implementation exists (read file, curl endpoint, run command). For each "Must NOT Have": search codebase for forbidden patterns — reject with file:line if found. Check evidence files exist in .sisyphus/evidence/. Compare deliverables against plan.
  Output: `Must Have [N/N] | Must NOT Have [N/N] | Tasks [N/N] | VERDICT: APPROVE/REJECT`

- [x] F2. **Code Quality Review** — `unspecified-high`
- [x] F3. **Real Manual QA** — `unspecified-high` (+ `playwright` skill if UI)
- [x] F4. **Scope Fidelity Check** — `deep`
  Run `tsc --noEmit` + linter + `bun test`. Review all changed files for: `as any`/`@ts-ignore`, empty catches, console.log in prod, commented-out code, unused imports. Check AI slop: excessive comments, over-abstraction, generic names (data/result/item/temp).
  Output: `Build [PASS/FAIL] | Lint [PASS/FAIL] | Tests [N pass/N fail] | Files [N clean/N issues] | VERDICT`

- [x] F3. **Real Manual QA** — `unspecified-high` (+ `playwright` skill if UI)
- [x] F4. **Scope Fidelity Check** — `deep`
  Start from clean state. Execute EVERY QA scenario from EVERY task — follow exact steps, capture evidence. Test cross-task integration (features working together, not isolation). Test edge cases: empty state, invalid input, rapid actions. Save to `.sisyphus/evidence/final-qa/`.
  Output: `Scenarios [N/N pass] | Integration [N/N] | Edge Cases [N tested] | VERDICT`

- [x] F4. **Scope Fidelity Check** — `deep`
  For each task: read "What to do", read actual diff (git log/diff). Verify 1:1 — everything in spec was built (no missing), nothing beyond spec was built (no creep). Check "Must NOT do" compliance. Detect cross-task contamination: Task N touching Task M's files. Flag unaccounted changes.
  Output: `Tasks [N/N compliant] | Contamination [CLEAN/N issues] | Unaccounted [CLEAN/N files] | VERDICT`

---

## Commit Strategy

- **1**: `feat: initialize project with Vite + React + TypeScript` — package.json, vite.config.ts, tsconfig.json
- **2**: `feat: configure Tailwind CSS for educational UI styling` — tailwind.config.js, src/index.css
- **3**: `feat: setup Vitest testing framework` — vitest.config.ts, src/__tests__/setup.ts
- **6**: `feat: create basic UI layout structure` — src/App.tsx, src/components/Layout/*
- **7**: `feat: implement circuit calculation engine core algorithms` — src/engine/calculator.ts
- **14**: `feat: build SVG circuit editor with drag-and-drop` — src/components/Editor/*
- **18**: `feat: add current flow visualization animations` — src/components/Visualizer/*
- **22**: `feat: integrate all components into main application` — src/App.tsx

---

## Success Criteria

### Verification Commands
```bash
bun install          # Expected: dependencies installed successfully
bun run dev          # Expected: dev server starts on http://localhost:5173
bun run build        # Expected: production build succeeds
bun test             # Expected: all tests pass
bun run lint         # Expected: no linting errors
```

### Final Checklist
- [x] 所有"Must Have"功能已实现
- [x] 所有"Must NOT Have"项目已排除
- [x] 所有测试通过（包括单元测试和集成测试）
- [x] 无TypeScript类型错误
- [x] 无ESLint警告
- [x] 应用可正常构建和运行
- [x] 所有QA场景验证通过
- [x] 所有"Must Have"功能已实现
- [x] 所有"Must NOT Have"项目已排除
- [x] 所有测试通过（包括单元测试和集成测试）
- [x] 所有"Must NOT Have"项目已排除
- [x] 所有测试通过（包括单元测试和集成测试）
- [x] 无TypeScript类型错误
- [x] 无ESLint警告
- [x] 应用可正常构建和运行
- [x] 所有QA场景验证通过
- [x] 所有测试通过（包括单元测试和集成测试）
- [x] 无TypeScript类型错误
- [x] 无ESLint警告
- [x] 应用可正常构建和运行
- [x] 所有QA场景验证通过
- [x] 无TypeScript类型错误
- [x] 无ESLint警告
- [x] 应用可正常构建和运行
- [x] 所有QA场景验证通过
- [x] 无ESLint警告
- [x] 应用可正常构建和运行
- [x] 所有QA场景验证通过
- [x] 应用可正常构建和运行
- [x] 所有QA场景验证通过
- [x] 所有QA场景验证通过
