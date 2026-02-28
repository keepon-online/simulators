# 修复连线系统 + 增加家庭接线示例

## TL;DR

> **Quick Summary**: 修复家庭电路仿真器中连线系统的多个 bug（连接点匹配、家电单端口），将连线交互改为拖拽模式，并增加 6 个家庭常用接线示例通过顶部下拉菜单加载。
> 
> **Deliverables**:
> - 修复 renderWire 的 pointId 匹配逻辑
> - 家电元件从 1 个连接点改为 2 个
> - 拖拽端口连线交互（替代双击模式）
> - 6 个预设家庭接线示例数据
> - Header 下拉菜单加载示例
> 
> **Estimated Effort**: Medium
> **Parallel Execution**: YES - 4 waves
> **Critical Path**: Task 1 → Task 2 → Task 3 → Task 5

---

## Context

### Original Request
1. 连线有问题，需要修复
2. 增加家庭常用接线示例

### Interview Summary
**Key Discussions**:
- 连线交互：用户选择拖拽连线（从端口圆点拖到另一个端口圆点）
- 示例列表：单灯单控、一灯双控、插座回路、厨房回路、空调专线、全屋配电（全部6个）
- 示例加载方式：Header 顶部菜单下拉选择

**Research Findings**:
- `renderWire` (CircuitCanvas.tsx:157-158) 始终取 `connections[0]`，忽略 `wire.from.pointId`
- 家电元件 (models.ts:92-100) 只有 1 个连接点，无法形成回路
- `handleComponentClick` (CircuitCanvas.tsx:270-275) 创建 wire 时也硬编码 `connections[0]`
- `parser.ts:78-102` 有重复的 `createDefaultConnections` 函数，需与 models.ts 统一
- 现有 22 个测试全部通过，修改后需保持通过
- 集成测试中家电 wire 创建使用 `connections[0]`，修改连接点后需更新

### Metis Review
**Identified Gaps** (addressed):
- parser.ts 中重复的 createDefaultConnections 需消除 → 统一使用 models.ts 版本
- 家电 SVG 渲染只有 1 个圆圈，需添加第 2 个 → 在 renderComponent 中添加
- 拖拽连线与元件拖拽移动的事件冲突 → 端口 mousedown stopPropagation
- 一灯双控需要三路开关但当前无此类型 → 简化为两个普通开关并联（教育演示）
- 加载示例会覆盖当前内容 → 添加 window.confirm 确认
- 同一端口重复连线、自连接等边缘情况 → 禁止自连接，允许多连接

---

## Work Objectives

### Core Objective
修复电路仿真器的连线系统 bug，改进连线交互为拖拽模式，并提供 6 个家庭常用接线示例供用户学习参考。

### Concrete Deliverables
- 修复后的 `renderWire` 函数（正确匹配 pointId）
- 修复后的家电元件（2 个连接点 + SVG 双圆圈渲染）
- 消除 parser.ts 中重复的 createDefaultConnections
- 拖拽连线交互（替代双击模式）
- `src/data/examples.ts` — 6 个预设电路数据
- Header 下拉菜单 + App 集成

### Definition of Done
- [ ] `bun test --run` 全部通过（含新增测试）
- [ ] 6 个示例加载后 `calculateCircuitState(diagram).isValid === true && totalPower > 0`
- [ ] 无 `connections[0]` 硬编码残留（renderWire / wire 创建逻辑中）

### Must Have
- renderWire 通过 pointId 匹配连接点
- 5 种家电各有 2 个连接点
- 拖拽端口连线（mousedown 端口 → mousemove 临时线 → mouseup 目标端口）
- 拖拽连线时的视觉反馈（临时虚线）
- 6 个可加载的家庭接线示例
- Header 下拉菜单选择示例

### Must NOT Have (Guardrails)
- 不修改 calculator.ts 的计算逻辑
- 不修改 faultDetector.ts 的检测逻辑
- 不添加导线拐点编辑（贝塞尔曲线/折线路径）
- 不添加撤销/重做功能
- 不添加端口类型验证（如正极只能连负载输入）
- 不添加用户自定义示例保存/编辑功能
- 不重构 renderComponent 为独立组件文件
- 不新增元件类型（如三路开关）
- 不在 Header 添加除示例下拉菜单以外的新 UI 元素
- 示例数据不使用 generateId()，使用稳定字符串 ID

---

## Verification Strategy

> **ZERO HUMAN INTERVENTION** — ALL verification is agent-executed. No exceptions.

### Test Decision
- **Infrastructure exists**: YES
- **Automated tests**: YES (Tests-after)
- **Framework**: vitest (bun test)

### QA Policy
Every task MUST include agent-executed QA scenarios.
Evidence saved to `.sisyphus/evidence/task-{N}-{scenario-slug}.{ext}`.

- **Frontend/UI**: Use Playwright (playwright skill) — Navigate, interact, assert DOM, screenshot
- **Library/Module**: Use Bash (bun test) — Run tests, compare output

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Start Immediately — foundation):
├── Task 1: 修复数据层 — 家电双连接点 + 消除 parser.ts 重复 [quick]

Wave 2 (After Wave 1 — rendering + data, PARALLEL):
├── Task 2: 修复渲染层 — renderWire pointId 匹配 + 家电 SVG 双圆圈 [quick]
└── Task 4: 创建 6 个示例电路数据 [deep]

Wave 3 (After Task 2 — interaction):
└── Task 3: 重写交互层 — 拖拽连线替代双击模式 [deep]

Wave 4 (After Task 3 + Task 4 — integration):
└── Task 5: Header 下拉菜单 + 示例加载集成 [quick]

Wave FINAL (After ALL tasks — verification):
├── Task F1: Plan compliance audit [oracle]
├── Task F2: Code quality review [unspecified-high]
├── Task F3: Real manual QA [unspecified-high]
└── Task F4: Scope fidelity check [deep]

Critical Path: Task 1 → Task 2 → Task 3 → Task 5 → F1-F4
Parallel Speedup: Task 2 ∥ Task 4 in Wave 2
Max Concurrent: 2 (Wave 2)
```

### Dependency Matrix

| Task | Depends On | Blocks | Wave |
|------|-----------|--------|------|
| 1 | — | 2, 3, 4, 5 | 1 |
| 2 | 1 | 3, 5 | 2 |
| 4 | 1 | 5 | 2 |
| 3 | 2 | 5 | 3 |
| 5 | 3, 4 | F1-F4 | 4 |
| F1-F4 | 5 | — | FINAL |

### Agent Dispatch Summary

- **Wave 1**: 1 task — T1 → `quick`
- **Wave 2**: 2 tasks — T2 → `quick`, T4 → `deep`
- **Wave 3**: 1 task — T3 → `deep`
- **Wave 4**: 1 task — T5 → `quick`
- **FINAL**: 4 tasks — F1 → `oracle`, F2 → `unspecified-high`, F3 → `unspecified-high`, F4 → `deep`

---

## TODOs


- [ ] 1. 修复数据层：家电双连接点 + 消除 parser.ts 重复

  **What to do**:
  - 修改 `src/engine/models.ts:createDefaultConnections` 中 5 种家电（refrigerator, air_conditioner, tv, washer, water_heater）从 1 个连接点改为 2 个：输入端 `(0, 25)` + 输出端 `(60, 25)`（基于家电矩形 60×50 尺寸，左右两侧中部）
  - 删除 `src/engine/parser.ts:78-102` 中重复的 `createDefaultConnections` 函数，改为 `import { createDefaultConnections } from './models'`
  - 更新 `src/__tests__/integration.test.ts` 中家电 wire 创建代码，使用正确的 pointId（第二个连接点）
  - 新增测试：验证每种家电 `connections.length === 2` 且两个点坐标不同
  - 运行 `bun test --run` 确保所有现有测试 + 新测试通过

  **Must NOT do**:
  - 不修改 calculator.ts 或 faultDetector.ts
  - 不修改非家电类元件的连接点定义
  - 不改变 ConnectionPoint 的类型定义

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: 定点修改 2 个文件 + 更新测试，逻辑简单明确
  - **Skills**: []
    - 纯 TypeScript 数据层修改，无需特殊技能
  - **Skills Evaluated but Omitted**:
    - `frontend-ui-ux`: 无 UI 工作
    - `playwright`: 无浏览器验证需求

  **Parallelization**:
  - **Can Run In Parallel**: NO (Wave 1 唯一任务)
  - **Parallel Group**: Wave 1
  - **Blocks**: Tasks 2, 3, 4, 5
  - **Blocked By**: None (can start immediately)

  **References**:

  **Pattern References**:
  - `src/engine/models.ts:57-107` — `createDefaultConnections` 函数，当前家电分支在 92-100 行，只返回 1 个连接点。其他元件（power, switch, light 等）返回 2 个连接点的模式是参考模板
  - `src/engine/parser.ts:78-102` — 重复的 `createDefaultConnections`，需删除并改为 import models.ts 版本

  **API/Type References**:
  - `src/types/index.ts:48-52` — `ConnectionPoint` 接口定义 `{id, x, y}`
  - `src/types/index.ts:55-65` — `Component` 接口，`connections: ConnectionPoint[]`

  **Test References**:
  - `src/__tests__/integration.test.ts` — 集成测试中家电 wire 创建使用 `connections[0]`，修改后需更新
  - `src/__tests__/models.test.ts` — models 测试，可参考其测试模式新增家电连接点测试

  **WHY Each Reference Matters**:
  - models.ts:57-107 — 这是唯一需要修改的连接点定义源，其他元件的双连接点模式是家电修改的模板
  - parser.ts:78-102 — 必须删除这个重复函数，否则两处定义不一致会导致 SVG 导入时连接点数量错误
  - integration.test.ts — 家电从 1 个连接点变 2 个后，测试中 `connections[0]` 的 wire 创建可能仍然有效但语义不对，需审查并更新

  **Acceptance Criteria**:
  - [ ] 5 种家电 `createDefaultConnections` 返回 `connections.length === 2`
  - [ ] parser.ts 不再包含本地 `createDefaultConnections` 函数，改为 import
  - [ ] `bun test --run` → ALL PASS (0 failures)
  - [ ] 新增测试文件或测试用例验证家电双连接点

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: 家电元件双连接点验证
    Tool: Bash (bun test)
    Preconditions: Task 1 代码修改完成
    Steps:
      1. 运行 `bun test --run`
      2. 检查输出中无 FAIL
      3. 新增测试应包含：对 refrigerator/air_conditioner/tv/washer/water_heater 各调用 createDefaultConnections，断言返回数组长度为 2，且 [0].x !== [1].x || [0].y !== [1].y
    Expected Result: ALL PASS, 0 failures, 新测试验证 5 种家电各有 2 个不同坐标的连接点
    Failure Indicators: 任何测试 FAIL 或家电 connections.length !== 2
    Evidence: .sisyphus/evidence/task-1-appliance-dual-ports.txt

  Scenario: parser.ts 重复消除验证
    Tool: Bash (grep)
    Preconditions: parser.ts 已修改
    Steps:
      1. 运行 `grep -n 'function createDefaultConnections' src/engine/parser.ts`
      2. 运行 `grep -n 'import.*createDefaultConnections.*from.*models' src/engine/parser.ts`
    Expected Result: 第 1 步无输出（函数已删除），第 2 步有 1 行匹配（import 语句存在）
    Failure Indicators: parser.ts 仍包含本地 createDefaultConnections 函数定义
    Evidence: .sisyphus/evidence/task-1-parser-dedup.txt
  ```

  **Commit**: YES
  - Message: `fix(engine): add second connection point to appliances and deduplicate parser`
  - Files: `src/engine/models.ts`, `src/engine/parser.ts`, `src/__tests__/integration.test.ts`, `src/__tests__/models.test.ts`
  - Pre-commit: `bun test --run`

- [ ] 2. 修复渲染层：renderWire pointId 匹配 + 家电 SVG 双圆圈

  **What to do**:
  - 修改 `src/components/Editor/CircuitCanvas.tsx:renderWire` 函数（约第 147-199 行）：将 `fromComponent.connections[0]` 改为 `fromComponent.connections.find(c => c.id === wire.from.pointId) || fromComponent.connections[0]`（带 fallback 兼容旧数据）。toPoint 同理
  - 修改 `CircuitCanvas.tsx:renderComponent` 中家电渲染分支（约第 115-134 行）：添加第 2 个 `<circle>` 元素，坐标与 models.ts 中定义的第 2 个连接点一致（`cx={x + 60}` `cy={y + 25}`）
  - 审查所有 renderComponent 的 case 分支，确保每个 `<circle>` 的坐标与 `createDefaultConnections` 返回值一致
  - 用 `ast_grep_search` 搜索 `connections[0]` 确认 renderWire 中无硬编码残留

  **Must NOT do**:
  - 不修改 renderWire 以外的导线逻辑
  - 不修改 calculator.ts 或 faultDetector.ts
  - 不重构 renderComponent 为独立组件文件

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: 定点修复 renderWire + 添加 SVG circle，改动量小且明确
  - **Skills**: []
    - SVG 修改是机械性工作，不需要额外技能
  - **Skills Evaluated but Omitted**:
    - `frontend-ui-ux`: SVG circle 添加是机械性工作
    - `playwright`: 可用于验证但此阶段用 vitest 即可

  **Parallelization**:
  - **Can Run In Parallel**: YES (与 Task 4 并行)
  - **Parallel Group**: Wave 2 (with Task 4)
  - **Blocks**: Tasks 3, 5
  - **Blocked By**: Task 1

  **References**:

  **Pattern References**:
  - `src/components/Editor/CircuitCanvas.tsx:147-199` — `renderWire` 函数，第 157-158 行是需要修复的 `connections[0]` 硬编码
  - `src/components/Editor/CircuitCanvas.tsx:115-134` — 家电渲染分支，第 132 行只有 1 个 `<circle>`，需添加第 2 个
  - `src/components/Editor/CircuitCanvas.tsx:48-49` — power 元件的双圆圈渲染模式（`<circle cx={x} .../>` + `<circle cx={x+60} .../>`），是家电双圆圈的参考模板

  **API/Type References**:
  - `src/types/index.ts:86-97` — `Wire` 接口，`from.pointId` 和 `to.pointId` 是匹配连接点的 key
  - `src/types/index.ts:48-52` — `ConnectionPoint` 接口，`id` 字段用于匹配

  **WHY Each Reference Matters**:
  - renderWire:157-158 — 这是核心 bug 位置，必须改为 pointId 匹配
  - 家电渲染:115-134 — 只有 1 个圆圈，用户无法看到/点击第 2 个端口
  - power 双圆圈:48-49 — 已有的双端口渲染模式，家电应遵循相同模式

  **Acceptance Criteria**:
  - [ ] renderWire 使用 `wire.from.pointId` / `wire.to.pointId` 匹配连接点
  - [ ] 5 种家电在 SVG 中渲染 2 个 `<circle>` 连接点
  - [ ] `ast_grep_search` 确认 renderWire 中无 `connections[0]` 硬编码
  - [ ] `bun test --run` → ALL PASS

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: renderWire pointId 匹配验证
    Tool: Bash (ast_grep_search + bun test)
    Preconditions: Task 2 代码修改完成
    Steps:
      1. 使用 ast_grep_search 在 CircuitCanvas.tsx 中搜索 `connections[0]` 模式
      2. 确认 renderWire 函数内无 `connections[0]` 直接使用（应改为 .find() 匹配）
      3. 运行 `bun test --run`
    Expected Result: renderWire 中无 connections[0] 硬编码；所有测试通过
    Failure Indicators: ast_grep 在 renderWire 内找到 connections[0]；测试 FAIL
    Evidence: .sisyphus/evidence/task-2-pointid-match.txt

  Scenario: 家电双圆圈渲染验证
    Tool: Bash (grep)
    Preconditions: CircuitCanvas.tsx 已修改
    Steps:
      1. 在 CircuitCanvas.tsx 的家电渲染分支中搜索 `<circle` 标签
      2. 确认家电 case 分支（refrigerator/air_conditioner/tv/washer/water_heater）包含 2 个 `<circle` 元素
    Expected Result: 家电渲染分支有 2 个 circle 元素，坐标分别对应 models.ts 中的两个连接点
    Failure Indicators: 家电分支仍只有 1 个 circle
    Evidence: .sisyphus/evidence/task-2-dual-circles.txt
  ```

  **Commit**: YES
  - Message: `fix(editor): match wire endpoints by pointId and render dual ports for appliances`
  - Files: `src/components/Editor/CircuitCanvas.tsx`
  - Pre-commit: `bun test --run`

---

- [ ] 3. 重写交互层：拖拽连线替代双击模式
  **What to do**:
  - 在 `CircuitCanvas` 组件中添加新状态：`wiringFrom: {componentId: string, pointId: string, x: number, y: number} | null` 和 `wiringMousePos: {x: number, y: number} | null`
  - 给每个元件渲染的连接点 `<circle>` 添加 `onMouseDown` 事件处理：记录起始端口信息（componentId, pointId, 绝对坐标），设置 `wiringFrom` 状态。必须 `e.stopPropagation()` 防止触发元件拖拽移动
  - 在 SVG `onMouseMove` 中：如果 `wiringFrom` 存在，更新 `wiringMousePos` 并渲染临时 `<line>` 从起始点到鼠标位置（灰色虚线 `stroke="#9ca3af" strokeDasharray="6 3"`）
  - 给目标端口 `<circle>` 添加 `onMouseUp` 事件处理：如果 `wiringFrom` 存在且目标不是同一元件（禁止自连接），创建 Wire 并清除 `wiringFrom`/`wiringMousePos`
  - 在 SVG `onMouseUp`（非端口上）和 `onMouseLeave` 中：取消连线，清除 `wiringFrom`/`wiringMousePos`
  - 移除旧的 `handleDoubleClick` 函数和 `connectingFrom` 状态
  - 移除旧的 `handleComponentClick` 中连线相关逻辑（保留开关切换和选中逻辑）
  - 端口圆圈增大交互区域：将连接点 `<circle>` 的 `r` 从 4 改为 6，并添加 `cursor: crosshair` 样式提示可连线
  - 运行 `bun test --run` 确保无回归
  **Must NOT do**:
  - 不修改 calculator.ts 或 faultDetector.ts
  - 不添加撤销/重做功能
  - 不添加导线拐点编辑（贝塞尔曲线/折线路径）
  - 不添加端口类型验证（任意端口可连）
  - 不重构 renderComponent 为独立组件文件
  **Recommended Agent Profile**:
  - **Category**: `deep`
    - Reason: 涉及复杂的鼠标事件交互、状态管理、事件冒泡处理，需要仔细处理多个交互路径
  - **Skills**: []
    - React 事件处理是标准模式，不需要额外技能注入
  - **Skills Evaluated but Omitted**:
    - `frontend-ui-ux`: 交互逻辑而非视觉设计
    - `playwright`: 可用于验证但此阶段用 vitest 即可
  **Parallelization**:
  - **Can Run In Parallel**: NO (依赖 Task 2)
  - **Parallel Group**: Wave 3 (sequential)
  - **Blocks**: Task 5
  - **Blocked By**: Task 2
  **References**:
  **Pattern References**:
  - `src/components/Editor/CircuitCanvas.tsx:207-252` — 现有的 `handleDragStart`/`handleDragMove`/`handleDragEnd` 元件拖拽模式，拖拽连线应遵循类似的 state + mouse event 模式
  - `src/components/Editor/CircuitCanvas.tsx:254-285` — 现有的 `handleComponentClick` 和 `handleDoubleClick`，其中连线相关逻辑需移除
  - `src/components/Editor/CircuitCanvas.tsx:209` — `connectingFrom` 状态定义，需替换为 `wiringFrom`
  **API/Type References**:
  - `src/types/index.ts:86-97` — `Wire` 接口，`createWire` 需要 `fromComponentId, fromPointId, toComponentId, toPointId`
  - `src/engine/models.ts:110-129` — `createWire` 函数签名
  **External References**:
  - React SVG 事件处理：`onMouseDown`/`onMouseMove`/`onMouseUp` 在 SVG 元素上的标准用法
  **WHY Each Reference Matters**:
  - handleDragStart/Move/End — 拖拽连线的状态管理模式应与元件拖拽保持一致（useState + useCallback + SVG 坐标转换）
  - handleComponentClick — 需要精确识别哪些逻辑是连线相关的（需移除）vs 开关切换/选中（需保留）
  - createWire — 最终创建 wire 时需要的参数格式
  **Acceptance Criteria**:
  - [ ] 拖拽端口连线可创建 Wire（from/to pointId 正确）
  - [ ] 拖拽过程中显示临时虚线
  - [ ] 自连接被禁止（同一元件的两个端口不能连线）
  - [ ] 旧的 `connectingFrom` 状态和 `handleDoubleClick` 已移除
  - [ ] 端口圆圈 `onMouseDown` 不触发元件拖拽移动
  - [ ] `bun test --run` → ALL PASS
  **QA Scenarios (MANDATORY):**
  ```
  Scenario: 拖拽连线创建 Wire 验证
    Tool: Bash (bun test + grep)
    Preconditions: Task 3 代码修改完成
    Steps:
      1. 运行 `bun test --run` 确认无回归
      2. 用 grep 搜索 CircuitCanvas.tsx 确认 `connectingFrom` 状态已移除
      3. 用 grep 搜索 CircuitCanvas.tsx 确认 `handleDoubleClick` 已移除
      4. 用 grep 搜索 CircuitCanvas.tsx 确认 `wiringFrom` 状态存在
    Expected Result: 所有测试通过；connectingFrom 和 handleDoubleClick 不存在；wiringFrom 存在
    Failure Indicators: 测试 FAIL；旧连线逻辑残留
    Evidence: .sisyphus/evidence/task-3-drag-wiring.txt
  Scenario: 自连接禁止验证
    Tool: Bash (grep)
    Preconditions: CircuitCanvas.tsx 已修改
    Steps:
      1. 在 CircuitCanvas.tsx 中搜索自连接检查逻辑（如 `from.componentId === to.componentId` 或 `wiringFrom.componentId === componentId`）
    Expected Result: 存在自连接禁止逻辑
    Failure Indicators: 无自连接检查代码
    Evidence: .sisyphus/evidence/task-3-no-self-connect.txt
  Scenario: 端口交互区域增大验证
    Tool: Bash (grep)
    Preconditions: CircuitCanvas.tsx 已修改
    Steps:
      1. 在 renderComponent 中搜索连接点 circle 的 r 属性值
      2. 确认 r >= 6（从原来的 4 增大）
    Expected Result: 连接点 circle 的 r 值为 6 或更大
    Failure Indicators: r 仍为 4
    Evidence: .sisyphus/evidence/task-3-port-size.txt
  ```
  **Commit**: YES
  - Message: `feat(editor): replace double-click wiring with drag-to-connect interaction`
  - Files: `src/components/Editor/CircuitCanvas.tsx`
  - Pre-commit: `bun test --run`

- [ ] 4. 创建 6 个家庭接线示例电路数据
  **What to do**:
  - 创建 `src/data/examples.ts` 文件，导出 6 个 `CircuitDiagram` 对象和一个示例列表
  - 所有示例使用稳定字符串 ID（如 `"ex1-power"`, `"ex1-breaker"`, `"ex1-switch"`），不使用 `generateId()`
  - 每个示例必须包含 `power` 元件，组件位置合理分布在 1200×800 画布上
  - Wire 的 `from.pointId` / `to.pointId` 必须匹配对应组件的实际 ConnectionPoint ID
  - 注意：由于使用稳定 ID，ConnectionPoint 的 ID 也需要是稳定的。需要直接构造 Component 对象而非使用 `createComponent`（因为它内部调用 `generateId`）
  - 6 个示例具体拓扑：
    1. **单灯单控**：电源 → 断路器 → 开关 → 灯（串联回路）
    2. **一灯双控**：电源 → 断路器 → 两个普通开关并联 → 灯（教育简化版，非真实三路开关）
    3. **插座回路**：电源 → 断路器 → 3 个插座并联
    4. **厨房回路**：电源 → 独立断路器 → 冰箱 + 热水器并联（大功率电器）
    5. **空调专线**：电源 → 独立断路器(25A) → 空调（大功率独立回路）
    6. **全屋配电**：电源 → 总断路器 → 4 个分支回路（照明分支：开关+灯；插座分支：3个插座；空调分支：空调；厨房分支：冰箱+热水器）
  - 导出格式：`export const CIRCUIT_EXAMPLES: Array<{name: string, description: string, diagram: CircuitDiagram}>`
  - 新增测试文件 `src/__tests__/examples.test.ts`：验证每个示例 `calculateCircuitState(diagram).isValid === true && totalPower > 0`
  **Must NOT do**:
  - 不使用 `generateId()` 或 `createComponent()`（ID 必须稳定）
  - 不新增元件类型（如三路开关）
  - 不修改现有引擎代码
  **Recommended Agent Profile**:
  - **Category**: `deep`
    - Reason: 需要理解电路拓扑，设计 6 个合理的电路布局，确保 wire 连接正确，工作量较大
  - **Skills**: []
    - 领域知识（家庭电路）而非工具技能
  - **Skills Evaluated but Omitted**:
    - `frontend-ui-ux`: 纯数据定义，无 UI 工作
    - `playwright`: 无浏览器需求
  **Parallelization**:
  - **Can Run In Parallel**: YES (与 Task 2 并行)
  - **Parallel Group**: Wave 2 (with Task 2)
  - **Blocks**: Task 5
  - **Blocked By**: Task 1
  **References**:
  **Pattern References**:
  - `src/engine/models.ts:132-141` — `createCircuitDiagram` 函数，示例数据应遵循相同的 `CircuitDiagram` 结构但使用稳定 ID
  - `src/engine/models.ts:35-54` — `createComponent` 函数，了解 Component 对象的完整结构以便手动构造
  - `src/engine/models.ts:57-107` — `createDefaultConnections`，了解每种元件的连接点坐标（修复后的版本，家电有 2 个点）
  - `src/engine/models.ts:110-129` — `createWire` 函数，了解 Wire 对象结构
  **API/Type References**:
  - `src/types/index.ts:99-107` — `CircuitDiagram` 接口：`{id, name, components, wires, createdAt, updatedAt}`
  - `src/types/index.ts:55-65` — `Component` 接口完整字段
  - `src/types/index.ts:86-97` — `Wire` 接口完整字段
  - `src/types/index.ts:48-52` — `ConnectionPoint` 接口
  **Test References**:
  - `src/__tests__/integration.test.ts` — 集成测试模式，展示如何创建组件、连线并验证电路状态
  **External References**:
  - `src/engine/componentParams.ts:43-69` — 各电器的额定功率参数，示例中的电器应使用这些默认参数
  **WHY Each Reference Matters**:
  - createCircuitDiagram/createComponent — 了解数据结构以便手动构造稳定 ID 的示例
  - createDefaultConnections — 必须知道每种元件的连接点坐标才能正确设置 wire 的 pointId
  - integration.test.ts — 展示了如何组装电路并验证，示例测试应遵循相同模式
  - componentParams.ts — 示例中电器的 params 应与默认参数一致
  **Acceptance Criteria**:
  - [ ] `src/data/examples.ts` 存在且导出 6 个示例
  - [ ] 每个示例包含 power 元件
  - [ ] 所有 ID 为稳定字符串（不含时间戳或随机数）
  - [ ] 每个示例 `calculateCircuitState(diagram).isValid === true`
  - [ ] 每个示例 `calculateCircuitState(diagram).totalPower > 0`
  - [ ] `bun test --run` → ALL PASS（含新增 examples.test.ts）
  **QA Scenarios (MANDATORY):**
  ```
  Scenario: 6 个示例电路有效性验证
    Tool: Bash (bun test)
    Preconditions: src/data/examples.ts 和 src/__tests__/examples.test.ts 已创建
    Steps:
      1. 运行 `bun test --run`
      2. 检查 examples.test.ts 的测试结果
    Expected Result: 6 个示例各有 1 个 isValid 测试 + 1 个 totalPower > 0 测试，全部 PASS
    Failure Indicators: 任何示例的 isValid 为 false 或 totalPower <= 0
    Evidence: .sisyphus/evidence/task-4-examples-valid.txt
  Scenario: 示例 ID 稳定性验证
    Tool: Bash (grep)
    Preconditions: src/data/examples.ts 已创建
    Steps:
      1. 运行 `grep -c 'generateId' src/data/examples.ts`
      2. 运行 `grep -c 'Date.now' src/data/examples.ts`
    Expected Result: 两个命令输出均为 0（无动态 ID 生成）
    Failure Indicators: 输出大于 0
    Evidence: .sisyphus/evidence/task-4-stable-ids.txt
  ```
  **Commit**: YES
  - Message: `feat(data): add 6 household circuit wiring examples`
  - Files: `src/data/examples.ts`, `src/__tests__/examples.test.ts`
  - Pre-commit: `bun test --run`

---
- [ ] 5. Header 下拉菜单 + 示例加载集成
  **What to do**:
  - 修改 `src/components/Layout/Header.tsx`：添加「示例电路」下拉菜单（`<select>` 或自定义 dropdown），选项为 6 个示例名称，默认显示「选择示例电路...」占位符
  - 添加 `onLoadExample: (diagram: CircuitDiagram) => void` prop 到 HeaderProps
  - 修改 `src/components/Layout/Layout.tsx` 的 `LayoutProps.headerProps` 添加 `onLoadExample`
  - 在 `src/App.tsx` 中：
    - import `CIRCUIT_EXAMPLES` from `src/data/examples.ts`
    - 实现 `handleLoadExample` 回调：如果当前 diagram 有内容（components.length > 0），用 `window.confirm('加载示例将替换当前电路，是否继续？')` 确认；确认后设置 diagram 并重置 `selectedComponentId` 为 null
    - 将 `CIRCUIT_EXAMPLES` 和 `handleLoadExample` 通过 props 传递给 Header
  - 运行 `bun test --run` 确保无回归
  **Must NOT do**:
  - 不添加用户自定义示例保存/编辑功能
  - 不在 Header 添加除示例下拉菜单以外的新 UI 元素
  - 不修改 calculator.ts 或 faultDetector.ts
  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: 添加 dropdown + props 传递，标准 React 模式，改动量小
  - **Skills**: []
    - 简单 UI 组件修改，无需额外技能
  - **Skills Evaluated but Omitted**:
    - `frontend-ui-ux`: 简单 select/dropdown，不需要设计技能
    - `playwright`: 可用于验证但此阶段用 vitest 即可
  **Parallelization**:
  - **Can Run In Parallel**: NO (依赖 Task 3 + Task 4)
  - **Parallel Group**: Wave 4 (sequential)
  - **Blocks**: F1-F4
  - **Blocked By**: Tasks 3, 4
  **References**:
  **Pattern References**:
  - `src/components/Layout/Header.tsx:1-36` — 现有 Header 组件，已有「加载」和「保存」按钮，示例下拉菜单应放在它们旁边，保持相同的样式风格
  - `src/components/Layout/Layout.tsx:1-43` — Layout 组件，需要在 headerProps 中添加 onLoadExample 和 examples 属性
  - `src/App.tsx:1-75` — App 组件，现有的 handleSave/handleLoad 模式是 handleLoadExample 的参考
  **API/Type References**:
  - `src/types/index.ts:99-107` — `CircuitDiagram` 接口，示例加载传递的数据类型
  - `src/data/examples.ts` — Task 4 创建的示例数据，导出 `CIRCUIT_EXAMPLES` 数组
  **WHY Each Reference Matters**:
  - Header.tsx — 下拉菜单的添加位置和样式参考
  - Layout.tsx — props 传递链的中间层，需要扩展 headerProps 类型
  - App.tsx — 示例加载的业务逻辑实现位置，handleSave/handleLoad 是模式参考
  **Acceptance Criteria**:
  - [ ] Header 中显示「示例电路」下拉菜单，包含 6 个选项
  - [ ] 选择示例后 diagram 被替换为对应示例数据
  - [ ] 加载示例时 selectedComponentId 重置为 null
  - [ ] 当前画布有内容时加载示例会弹出确认对话框
  - [ ] `bun test --run` → ALL PASS
  **QA Scenarios (MANDATORY):**
  ```
  Scenario: Header 示例下拉菜单渲染验证
    Tool: Bash (grep)
    Preconditions: Header.tsx 已修改
    Steps:
      1. 在 Header.tsx 中搜索 `示例` 或 `example` 相关关键词
      2. 确认存在 `<select>` 或 dropdown 组件
      3. 确认 `onLoadExample` prop 存在于 HeaderProps 接口中
    Expected Result: Header 包含示例下拉菜单和 onLoadExample 回调
    Failure Indicators: 无下拉菜单或无 onLoadExample prop
    Evidence: .sisyphus/evidence/task-5-header-dropdown.txt
  Scenario: App 示例加载集成验证
    Tool: Bash (grep)
    Preconditions: App.tsx 已修改
    Steps:
      1. 在 App.tsx 中搜索 `CIRCUIT_EXAMPLES` import
      2. 在 App.tsx 中搜索 `handleLoadExample` 函数定义
      3. 在 App.tsx 中搜索 `setSelectedComponentId(null)` 在 handleLoadExample 内
      4. 运行 `bun test --run`
    Expected Result: App 导入示例数据，实现加载回调并重置选中状态；所有测试通过
    Failure Indicators: 缺少 import/回调/重置逻辑；测试 FAIL
    Evidence: .sisyphus/evidence/task-5-app-integration.txt
  ```
  **Commit**: YES
  - Message: `feat(ui): add example circuit dropdown menu in header`
  - Files: `src/components/Layout/Header.tsx`, `src/components/Layout/Layout.tsx`, `src/App.tsx`
  - Pre-commit: `bun test --run`

## Final Verification Wave (MANDATORY — after ALL implementation tasks)

> 4 review agents run in PARALLEL. ALL must APPROVE. Rejection → fix → re-run.

- [ ] F1. **Plan Compliance Audit** — `oracle`
  Read the plan end-to-end. For each "Must Have": verify implementation exists (read file, run command). For each "Must NOT Have": search codebase for forbidden patterns — reject with file:line if found. Check evidence files exist in .sisyphus/evidence/. Compare deliverables against plan.
  Output: `Must Have [N/N] | Must NOT Have [N/N] | Tasks [N/N] | VERDICT: APPROVE/REJECT`

- [ ] F2. **Code Quality Review** — `unspecified-high`
  Run `bun test --run`. Review all changed files for: `as any`/`@ts-ignore`, empty catches, console.log in prod, commented-out code, unused imports. Check AI slop: excessive comments, over-abstraction, generic names. Verify no `connections[0]` hardcoding remains in renderWire or wire creation logic.
  Output: `Build [PASS/FAIL] | Tests [N pass/N fail] | Files [N clean/N issues] | VERDICT`

- [ ] F3. **Real Manual QA** — `unspecified-high` (+ `playwright` skill)
  Start dev server. Load each of 6 examples via Header dropdown — verify circuit renders correctly with visible wires and components. Test drag-to-connect: create new wire by dragging from port to port. Test edge cases: self-connection attempt, delete component during drag. Save to `.sisyphus/evidence/final-qa/`.
  Output: `Scenarios [N/N pass] | Integration [N/N] | Edge Cases [N tested] | VERDICT`

- [ ] F4. **Scope Fidelity Check** — `deep`
  For each task: read "What to do", read actual diff. Verify 1:1 — everything in spec was built, nothing beyond spec was built. Check "Must NOT do" compliance. Detect cross-task contamination. Flag unaccounted changes.
  Output: `Tasks [N/N compliant] | Contamination [CLEAN/N issues] | Unaccounted [CLEAN/N files] | VERDICT`

---

## Commit Strategy

- **Task 1**: `fix(engine): add second connection point to appliances and deduplicate parser` — models.ts, parser.ts, integration.test.ts
- **Task 2**: `fix(editor): match wire endpoints by pointId and render dual ports for appliances` — CircuitCanvas.tsx
- **Task 3**: `feat(editor): replace double-click wiring with drag-to-connect interaction` — CircuitCanvas.tsx
- **Task 4**: `feat(data): add 6 household circuit wiring examples` — src/data/examples.ts, tests
- **Task 5**: `feat(ui): add example circuit dropdown menu in header` — Header.tsx, Layout.tsx, App.tsx

---

## Success Criteria

### Verification Commands
```bash
bun test --run  # Expected: ALL PASS, 0 failures
```

### Final Checklist
- [ ] All "Must Have" present
- [ ] All "Must NOT Have" absent
- [ ] All tests pass (existing 22 + new tests)
- [ ] 6 examples load correctly with valid circuit state
- [ ] Drag-to-connect wiring works
- [ ] No connections[0] hardcoding in renderWire or wire creation
