# L/N 接线标记 + 五孔插座/双联双控组件

## TL;DR

> **Quick Summary**: 为家庭电路仿真器增加交流电 L（火线）/N（零线）接线标记，新增五孔插座和双联双控开关两种组件类型，并提供对应的接线示例。
> 
> **Deliverables**:
> - ConnectionPoint 增加 `label` 字段，所有元件端口标注 L/N
> - 端口旁显示 L/N 文字标签，导线按 L=红色/N=蓝色着色
> - 新组件：五孔插座（outlet_5hole，3端口 L/N/E）
> - 新组件：双联双控开关（dual_switch，4端口 L1_in/L1_out/L2_in/L2_out）
> - 2 个新示例电路 + 现有 6 个示例补充 L/N 标记
> - Sidebar 元件库更新
> - 新增测试覆盖
> 
> **Estimated Effort**: Medium
> **Parallel Execution**: YES - 4 waves
> **Critical Path**: Task 1 → Task 2 → Task 4 → Task 6 → Task 8

---

## Context

### Original Request
1. 电线交流电：增加 L N 接线标记
2. 增加常见插座/开关接线示例或组件

### Interview Summary
**Key Discussions**:
- 导线颜色：L=红色 #ef4444，N=蓝色 #3b82f6
- 新组件：五孔插座（outlet_5hole）+ 双联双控开关（dual_switch）
- 新示例：五孔插座接线 + 双联双控接线
- 测试策略：Tests-after

**Research Findings**:
- ConnectionPoint 当前为 `{id, x, y}`，无 label 字段
- createDefaultConnections 按 ComponentType 返回连接点数组
- renderWire 用 `<line>` 渲染导线，当前统一灰色
- 端口渲染为 `<circle>` 元素，无文字标签
- calculator.ts 用 switch-case 按 type 计算电阻，需新增 case
- Sidebar 有 basicComponents 和 applianceComponents 两个数组
- 现有 39 测试全部通过

### Metis Review
**Identified Gaps** (addressed):
- dual_switch 需要双状态模型（两组独立开关各自 isOn）→ 扩展 ComponentState 增加 `isOn2?: boolean`
- outlet_5hole 的 E（地线）端口仅视觉展示，不参与电气计算 → 明确标注
- 现有 6 个示例的 ConnectionPoint 需要补充 label → 纳入计划
- 导线颜色判定逻辑：需要查找 from/to 端口的 label 来决定颜色 → renderWire 需要访问 ConnectionPoint.label
- dual_switch 的 toggleSwitch 逻辑需要支持切换两组开关 → 扩展 toggleSwitch 或新增函数
- 拖拽连线时临时虚线不需要颜色（保持灰色虚线）

---

## Work Objectives

### Core Objective
为电路仿真器增加交流电 L/N 标记系统，新增五孔插座和双联双控开关组件，提供对应接线示例。

### Concrete Deliverables
- `src/types/index.ts` — ConnectionPoint.label 字段、新 ComponentType、ComponentState.isOn2
- `src/engine/models.ts` — 所有元件的 createDefaultConnections 含 label、新组件创建、dual_switch toggle
- `src/engine/componentParams.ts` — 新组件参数、显示名称、颜色
- `src/engine/calculator.ts` — 新组件电阻计算 case
- `src/components/Editor/CircuitCanvas.tsx` — 端口标签渲染、导线颜色、新组件 SVG
- `src/components/Layout/Sidebar.tsx` — 新组件拖拽项
- `src/data/examples.ts` — 现有示例补充 label + 2 个新示例
- 测试文件 — 新组件 + L/N 标记验证

### Definition of Done
- [x] `bun test --run` 全部通过（含新增测试）
- [x] `bun run build` 成功
- [x] 所有元件端口显示 L/N 标签
- [x] 导线按端口 label 着色（L=红，N=蓝）
- [x] 五孔插座和双联双控开关可从 Sidebar 拖入画布
- [x] 8 个示例电路全部可加载且 isValid === true

### Must Have
- ConnectionPoint.label 可选字段（向后兼容）
- 所有现有元件的连接点补充 L/N label
- 端口旁 SVG 文字标签（L/N/E）
- 导线颜色由端口 label 决定（L→红，N→蓝，无标记→灰）
- 五孔插座组件（3端口：L、N、E）
- 双联双控开关组件（4端口：L1_in、L1_out、L2_in、L2_out，双独立状态）
- 双联双控 toggleSwitch 支持（点击切换哪组开关需明确）
- 2 个新示例 + 现有 6 个示例补充 label
- Sidebar 新增两个组件拖拽项

### Must NOT Have (Guardrails)
- 不实现接地线（E/PE）的电气计算逻辑（E 端口仅视觉）
- 不添加三相电支持
- 不修改 faultDetector.ts 的检测逻辑（除非新增组件类型的基本 case）
- 不添加导线拐点编辑
- 不添加撤销/重做功能
- 不重构 renderComponent 为独立组件文件
- 不修改现有组件的电气计算公式
- 不添加漏电保护器组件
- 拖拽连线临时虚线保持灰色（不着色）

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
Wave 1 (Start Immediately — type system + data layer):
├── Task 1: 扩展类型系统 — ConnectionPoint.label + 新 ComponentType + ComponentState.isOn2 [quick]
├── Task 2: 更新 models.ts — createDefaultConnections 全部加 label + 新组件 + dual_switch toggle [deep]
└── Task 3: 更新 componentParams.ts — 新组件参数/名称/颜色 [quick]

Wave 2 (After Wave 1 — engine + rendering, PARALLEL):
├── Task 4: 更新 calculator.ts — 新组件电阻计算 case [quick]
├── Task 5: 更新 CircuitCanvas.tsx — 端口标签渲染 + 导线颜色 + 新组件 SVG + dual_switch 点击 [deep]
└── Task 6: 更新 Sidebar.tsx — 新增两个组件拖拽项 [quick]

Wave 3 (After Wave 2 — examples + tests):
├── Task 7: 更新 examples.ts — 现有 6 示例补 label + 2 个新示例 [deep]
└── Task 8: 新增测试 — 新组件 + L/N 标记验证 [quick]

Wave FINAL (After ALL tasks — verification):
├── Task F1: Plan compliance audit [oracle]
├── Task F2: Code quality review [unspecified-high]
├── Task F3: Real manual QA [unspecified-high]
└── Task F4: Scope fidelity check [deep]

Critical Path: Task 1 → Task 2 → Task 5 → Task 7 → F1-F4
Parallel Speedup: Wave 1 (3 parallel) + Wave 2 (3 parallel)
Max Concurrent: 3
```

### Dependency Matrix

| Task | Depends On | Blocks | Wave |
|------|-----------|--------|------|
| 1 | — | 2, 3, 4, 5, 6, 7, 8 | 1 |
| 2 | 1 | 5, 7, 8 | 1 |
| 3 | 1 | 5, 6 | 1 |
| 4 | 1 | 8 | 2 |
| 5 | 2, 3 | 7, 8 | 2 |
| 6 | 3 | — | 2 |
| 7 | 2, 5 | 8 | 3 |
| 8 | 4, 5, 7 | F1-F4 | 3 |
| F1-F4 | 8 | — | FINAL |

### Agent Dispatch Summary

- **Wave 1**: 3 tasks — T1 → `quick`, T2 → `deep`, T3 → `quick`
- **Wave 2**: 3 tasks — T4 → `quick`, T5 → `deep`, T6 → `quick`
- **Wave 3**: 2 tasks — T7 → `deep`, T8 → `quick`
- **FINAL**: 4 tasks — F1 → `oracle`, F2 → `unspecified-high`, F3 → `unspecified-high`, F4 → `deep`

---

## TODOs

- [x] 1. 扩展类型系统：ConnectionPoint.label + 新 ComponentType + ComponentState.isOn2

  **What to do**:
  - 在 `src/types/index.ts` 的 `ConnectionPoint` 接口中添加 `label?: string` 可选字段
  - 在 `ComponentType` 联合类型中添加 `'outlet_5hole'`（五孔插座）和 `'dual_switch'`（双联双控开关）
  - 在 `ComponentState` 接口中添加 `isOn2?: boolean` 字段（双联双控的第二组开关状态）
  - 在 `ApplianceType` 中不添加新类型（五孔插座和双联双控属于基础元件）
  - 在 `BasicComponentType` 联合类型中添加 `'outlet_5hole'` 和 `'dual_switch'`

  **Must NOT do**:
  - 不修改现有类型的必填字段（label 必须是可选的）
  - 不修改 ElectricalValues、Wire、CircuitDiagram 等无关接口

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: 纯类型定义修改，3 个接口各加 1 个字段/值，改动量极小
  - **Skills**: []
  - **Skills Evaluated but Omitted**:
    - `frontend-ui-ux`: 无 UI 工作

  **Parallelization**:
  - **Can Run In Parallel**: YES (Wave 1 首个任务)
  - **Parallel Group**: Wave 1
  - **Blocks**: Tasks 2, 3, 4, 5, 6, 7, 8
  - **Blocked By**: None

  **References**:

  **Pattern References**:
  - `src/types/index.ts:48-52` — ConnectionPoint 接口，当前 `{id, x, y}`，需添加 `label?: string`
  - `src/types/index.ts:2-15` — ComponentType 联合类型，需添加 `'outlet_5hole' | 'dual_switch'`
  - `src/types/index.ts:26-34` — BasicComponentType 联合类型，需同步添加
  - `src/types/index.ts:77-83` — ComponentState 接口，需添加 `isOn2?: boolean`

  **WHY Each Reference Matters**:
  - ConnectionPoint:48-52 — label 字段的添加位置，可选字段确保向后兼容
  - ComponentType:2-15 — 新组件类型必须在此注册才能被整个系统识别
  - ComponentState:77-83 — dual_switch 需要两个独立开关状态

  **Acceptance Criteria**:
  - [x] ConnectionPoint 接口包含 `label?: string`
  - [x] ComponentType 包含 `'outlet_5hole'` 和 `'dual_switch'`
  - [x] BasicComponentType 包含 `'outlet_5hole'` 和 `'dual_switch'`
  - [x] ComponentState 包含 `isOn2?: boolean`
  - [x] `bun test --run` → ALL PASS（现有 39 测试无回归）
  - [x] `npx -p typescript tsc --noEmit` → 无类型错误

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: 类型兼容性验证
    Tool: Bash (tsc + bun test)
    Preconditions: types/index.ts 已修改
    Steps:
      1. 运行 `npx -p typescript tsc --noEmit`
      2. 运行 `bun test --run`
    Expected Result: 零类型错误，39 测试全部通过
    Failure Indicators: 类型错误或测试失败
    Evidence: .sisyphus/evidence/task-1-type-compat.txt
  ```

  **Commit**: YES
  - Message: `feat(types): add ConnectionPoint.label, new ComponentTypes, ComponentState.isOn2`
  - Files: `src/types/index.ts`
  - Pre-commit: `bun test --run`

- [x] 2. 更新 models.ts — 全部连接点加 label + 新组件模型 + dual_switch toggle

  **What to do**:
  - 修改 `createConnectionPoint` 函数签名，增加可选 `label` 参数：`createConnectionPoint(x, y, label?)`
  - 修改 `createDefaultConnections` 中所有现有元件的连接点，添加 L/N label：
    - `power`: 左端口 label='N'，右端口 label='L'（电源输出火线在右侧）
    - `switch`: 左 label='L'，右 label='L'（开关两端都是火线）
    - `light`: 左 label='L'，右 label='N'
    - `outlet`: 左 label='L'，右 label='N'
    - `circuit_breaker`: 左 label='L'，右 label='L'（断路器串在火线上）
    - `fuse`: 左 label='L'，右 label='L'
    - `wire`: 无 label（通用导线）
    - `resistor`: 左 label='L'，右 label='N'
    - 家电（refrigerator/air_conditioner/tv/washer/water_heater）: 左 label='L'，右 label='N'
  - 新增 `outlet_5hole` case：3 个连接点 — (0,20) label='L'，(50,20) label='N'，(25,0) label='E'
  - 新增 `dual_switch` case：4 个连接点 — (0,10) label='L1'，(60,10) label='L1'，(0,30) label='L2'，(60,30) label='L2'
  - 修改 `createDefaultComponentState`：返回值增加 `isOn2: true`
  - 新增或扩展 `toggleSwitch` 函数：支持 dual_switch 类型，接受可选 `groupIndex?: 1 | 2` 参数，默认切换第 1 组。group 1 切换 `isOn`，group 2 切换 `isOn2`
  **Must NOT do**:
  - 不修改 createWire、addComponent、removeComponent 等无关函数
  - 不修改 wire 类型的字段结构
  **Recommended Agent Profile**:
  - **Category**: `deep`
    - Reason: 涉及多个函数修改，需要理解电路拓扑中 L/N 的正确分配，双联双控的状态模型较复杂
  - **Skills**: []
  **Parallelization**:
  - **Can Run In Parallel**: YES (与 Task 3 并行，但依赖 Task 1)
  - **Parallel Group**: Wave 1 (with Task 1, Task 3)
  - **Blocks**: Tasks 5, 7, 8
  - **Blocked By**: Task 1
  **References**:
  **Pattern References**:
  - `src/engine/models.ts:17-23` — `createConnectionPoint` 函数，需添加 label 参数
  - `src/engine/models.ts:57-108` — `createDefaultConnections` 全部 case，每个都需要加 label
  - `src/engine/models.ts:26-32` — `createDefaultComponentState`，需加 isOn2
  - `src/engine/models.ts:226-244` — `toggleSwitch` 函数，需扩展支持 dual_switch
  **API/Type References**:
  - `src/types/index.ts:48-52` — ConnectionPoint 接口（含新的 label 字段）
  - `src/types/index.ts:77-83` — ComponentState 接口（含新的 isOn2 字段）
  **WHY Each Reference Matters**:
  - createConnectionPoint — 所有连接点都通过此函数创建，加 label 参数是最小侵入性修改
  - createDefaultConnections — 每种元件的端口定义源，必须在此统一添加 label
  - toggleSwitch — dual_switch 需要支持两组独立切换
  **Acceptance Criteria**:
  - [x] `createConnectionPoint` 支持可选 label 参数
  - [x] 所有现有元件的 createDefaultConnections 返回的连接点包含 label
  - [x] outlet_5hole 返回 3 个连接点（L, N, E）
  - [x] dual_switch 返回 4 个连接点（L1, L1, L2, L2）
  - [x] createDefaultComponentState 包含 isOn2: true
  - [x] toggleSwitch 支持 dual_switch 类型和 groupIndex 参数
  - [x] `bun test --run` → ALL PASS
  **QA Scenarios (MANDATORY):**
  ```
  Scenario: 新组件连接点验证
    Tool: Bash (bun test)
    Preconditions: models.ts 已修改
    Steps:
      1. 运行 `bun test --run`
      2. 用 grep 确认 createDefaultConnections 中 outlet_5hole 返回 3 个点
      3. 用 grep 确认 createDefaultConnections 中 dual_switch 返回 4 个点
    Expected Result: 测试通过，新组件连接点数量正确
    Failure Indicators: 测试失败或连接点数量不对
    Evidence: .sisyphus/evidence/task-2-connections.txt
  Scenario: dual_switch toggle 验证
    Tool: Bash (grep)
    Preconditions: models.ts 已修改
    Steps:
      1. 搜索 toggleSwitch 函数中是否包含 dual_switch 处理逻辑
      2. 确认存在 isOn2 切换逻辑
    Expected Result: toggleSwitch 支持 dual_switch 类型和 groupIndex 参数
    Failure Indicators: 无 dual_switch 处理或无 isOn2 切换
    Evidence: .sisyphus/evidence/task-2-toggle.txt
  ```
  **Commit**: YES
  - Message: `feat(engine): add L/N labels to all connections, new component models, dual_switch toggle`
  - Files: `src/engine/models.ts`
  - Pre-commit: `bun test --run`

- [x] 3. 更新 componentParams.ts — 新组件参数/名称/颜色

  **What to do**:
  - 在 `BASIC_COMPONENT_PARAMS` 中添加：
    - `outlet_5hole: { voltage: 220 }`（五孔插座，与现有 outlet 参数类似）
    - `dual_switch: { resistance: 0.01 }`（双联双控，与现有 switch 参数类似）
  - 在 `getComponentDisplayName` 中添加：
    - `outlet_5hole: '五孔插座'`
    - `dual_switch: '双联双控开关'`
  - 在 `getComponentColor` 中添加：
    - `outlet_5hole: '#10b981'`（绿色，与现有 outlet 一致）
    - `dual_switch: '#3b82f6'`（蓝色，与现有 switch 一致）
  **Must NOT do**:
  - 不修改现有元件的参数值
  - 不添加新的常量数组（如新的 RATINGS）
  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: 3 个 Record 各加 2 个条目，机械性工作
  - **Skills**: []
  **Parallelization**:
  - **Can Run In Parallel**: YES (与 Task 2 并行)
  - **Parallel Group**: Wave 1 (with Task 1, Task 2)
  - **Blocks**: Tasks 5, 6
  - **Blocked By**: Task 1
  **References**:
  **Pattern References**:
  - `src/engine/componentParams.ts:7-40` — BASIC_COMPONENT_PARAMS，新组件参数添加位置
  - `src/engine/componentParams.ts:83-100` — getComponentDisplayName，新组件名称添加位置
  - `src/engine/componentParams.ts:103-120` — getComponentColor，新组件颜色添加位置
  **WHY Each Reference Matters**:
  - BASIC_COMPONENT_PARAMS — 新组件的电气参数必须在此注册
  - getComponentDisplayName — Sidebar 和 UI 中显示的中文名称
  - getComponentColor — SVG 渲染时的元件颜色
  **Acceptance Criteria**:
  - [x] BASIC_COMPONENT_PARAMS 包含 outlet_5hole 和 dual_switch
  - [x] getComponentDisplayName 返回正确中文名称
  - [x] getComponentColor 返回正确颜色
  - [x] COMPONENT_PARAMS 合并后包含新组件（因为它 spread BASIC_COMPONENT_PARAMS）
  - [x] `bun test --run` → ALL PASS
  **QA Scenarios (MANDATORY):**
  ```
  Scenario: 新组件参数注册验证
    Tool: Bash (grep)
    Preconditions: componentParams.ts 已修改
    Steps:
      1. grep 'outlet_5hole' src/engine/componentParams.ts
      2. grep 'dual_switch' src/engine/componentParams.ts
      3. 运行 `bun test --run`
    Expected Result: 两个新组件在 BASIC_COMPONENT_PARAMS、getComponentDisplayName、getComponentColor 中各出现 1 次
    Failure Indicators: grep 无结果或测试失败
    Evidence: .sisyphus/evidence/task-3-params.txt
  ```
  **Commit**: YES
  - Message: `feat(engine): add outlet_5hole and dual_switch component params`
  - Files: `src/engine/componentParams.ts`
  - Pre-commit: `bun test --run`

- [x] 4. 更新 calculator.ts — 新组件电阻计算 case
  **What to do**:
  - 在 `getComponentResistance` 函数的 switch-case 中添加：
    - `case 'outlet_5hole': return Infinity`（与现有 outlet 一致，插座未接负载时无穷大电阻）
    - `case 'dual_switch': return state.isOn ? 0.01 : Infinity`（与现有 switch 一致）
  - 在 `isComponentConducting` 函数的 switch-case 中添加：
    - `case 'dual_switch': return state.isOn`（双联双控的导通性基于第一组开关状态）
  - 注意：dual_switch 的两组开关在电路计算中简化处理——仅用第一组状态决定导通性（教育简化版）
  **Must NOT do**:
  - 不修改现有元件的电阻计算公式
  - 不修改 calculateCircuitState 的整体逻辑
  - 不为 E（地线）端口添加电气计算
  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: 两个函数各加 1-2 个 case，改动量极小
  - **Skills**: []
  **Parallelization**:
  - **Can Run In Parallel**: YES (与 Task 5, Task 6 并行)
  - **Parallel Group**: Wave 2 (with Task 5, Task 6)
  - **Blocks**: Task 8
  - **Blocked By**: Task 1
  **References**:
  **Pattern References**:
  - `src/engine/calculator.ts:58-99` — `getComponentResistance` switch-case，现有 outlet 在第 82-83 行，switch 在第 72-73 行
  - `src/engine/calculator.ts:102-115` — `isComponentConducting` switch-case，现有 switch 在第 106-107 行
  **WHY Each Reference Matters**:
  - getComponentResistance — 新组件必须有电阻值才能参与电路计算
  - isComponentConducting — dual_switch 需要根据开关状态决定是否导通
  **Acceptance Criteria**:
  - [x] getComponentResistance 包含 outlet_5hole 和 dual_switch case
  - [x] isComponentConducting 包含 dual_switch case
  - [x] `bun test --run` → ALL PASS
  **QA Scenarios (MANDATORY):**
  ```
  Scenario: 新组件电阻计算验证
    Tool: Bash (grep + bun test)
    Preconditions: calculator.ts 已修改
    Steps:
      1. grep 'outlet_5hole' src/engine/calculator.ts
      2. grep 'dual_switch' src/engine/calculator.ts
      3. 运行 `bun test --run`
    Expected Result: 两个新组件在 getComponentResistance 和 isComponentConducting 中各出现 1 次；测试通过
    Failure Indicators: grep 无结果或测试失败
    Evidence: .sisyphus/evidence/task-4-calculator.txt
  ```
  **Commit**: YES
  - Message: `feat(engine): add outlet_5hole and dual_switch resistance calculation`
  - Files: `src/engine/calculator.ts`
  - Pre-commit: `bun test --run`
- [x] 5. 更新 CircuitCanvas.tsx — 端口标签渲染 + 导线颜色 + 新组件 SVG + dual_switch 点击
  **What to do**:
  - **端口标签渲染**：在 `component.connections.map(conn => ...)` 循环中，每个 `<circle>` 旁边添加 `<text>` 元素显示 `conn.label`（如果存在）。文字位置在圆圈上方 `cy - 10`，fontSize=8，fill 根据 label 着色：L/L1/L2 用 #ef4444（红），N 用 #3b82f6（蓝），E 用 #22c55e（绿）
  - **导线颜色**：修改 `renderWire` 函数，根据 from 端口的 label 决定导线颜色：
    - 获取 fromPoint.label（已通过 connections.find 找到）
    - label 以 'L' 开头（L/L1/L2）→ stroke='#ef4444'（红色）
    - label === 'N' → stroke='#3b82f6'（蓝色）
    - label === 'E' → stroke='#22c55e'（绿色）
    - 无 label → stroke='#6b7280'（灰色，保持现有行为）
    - 电流动画线的颜色也相应调整（用更亮的同色系）
  - **新组件 SVG 渲染**：在 `renderComponent` 的 switch-case 中添加：
    - `case 'outlet_5hole'`: 矩形背景 + 三孔插孔（上方 1 个圆形 E）+ 两孔插孔（下方 2 个圆形 L/N），尺寸 50x40
    - `case 'dual_switch'`: 矩形背景 + 两组开关触点线条（上下各一组），尺寸 60x40，根据 state.isOn 和 state.isOn2 分别显示两组开关状态
  - **dual_switch 点击交互**：修改 `handleComponentClick`，当点击 dual_switch 时：
    - 根据点击的 Y 坐标判断点击的是上半部分（第 1 组）还是下半部分（第 2 组）
    - 调用 toggleSwitch(diagram, componentId, groupIndex) 切换对应组
  **Must NOT do**:
  - 不修改拖拽连线的临时虚线颜色（保持灰色）
  - 不重构 renderComponent 为独立组件文件
  - 不修改现有元件的 SVG 尺寸或布局
  **Recommended Agent Profile**:
  - **Category**: `deep`
    - Reason: 涉及 SVG 渲染、颜色逻辑、新组件图形、点击交互，复杂度较高
  - **Skills**: []
  - **Skills Evaluated but Omitted**:
    - `frontend-ui-ux`: SVG 图形是机械性工作，不需要设计技能
  **Parallelization**:
  - **Can Run In Parallel**: YES (与 Task 4, Task 6 并行)
  - **Parallel Group**: Wave 2 (with Task 4, Task 6)
  - **Blocks**: Tasks 7, 8
  - **Blocked By**: Tasks 2, 3
  **References**:
  **Pattern References**:
  - `src/components/Editor/CircuitCanvas.tsx:360-375` — 端口 circle 渲染循环，需在此添加 label text
  - `src/components/Editor/CircuitCanvas.tsx:134-186` — renderWire 函数，需修改导线 stroke 颜色逻辑
  - `src/components/Editor/CircuitCanvas.tsx:42-131` — renderComponent switch-case，需添加 outlet_5hole 和 dual_switch case
  - `src/components/Editor/CircuitCanvas.tsx:248-260` — handleComponentClick，需添加 dual_switch 点击逻辑
  - `src/components/Editor/CircuitCanvas.tsx:51-60` — switch 组件的 SVG 渲染模式，dual_switch 可参考
  **API/Type References**:
  - `src/types/index.ts:48-52` — ConnectionPoint.label 字段
  - `src/engine/models.ts` — toggleSwitch 函数签名（含新的 groupIndex 参数）
  **WHY Each Reference Matters**:
  - 端口渲染循环:360-375 — label text 的添加位置，必须在 circle 旁边
  - renderWire:134-186 — 导线颜色的核心修改位置，需读取 fromPoint.label
  - renderComponent:42-131 — 新组件 SVG 的添加位置
  - handleComponentClick:248-260 — dual_switch 点击交互的添加位置
  **Acceptance Criteria**:
  - [x] 所有元件端口旁显示 L/N/E 文字标签
  - [x] 导线颜色根据端口 label 着色（L=红，N=蓝，E=绿，无=灰）
  - [x] outlet_5hole SVG 渲染正确（三孔+两孔外观）
  - [x] dual_switch SVG 渲染正确（两组开关触点）
  - [x] dual_switch 点击上半部分切换第 1 组，点击下半部分切换第 2 组
  - [x] 拖拽连线临时虚线保持灰色
  - [x] `bun test --run` → ALL PASS
  - [x] `bun run build` → 成功
  **QA Scenarios (MANDATORY):**
  ```
  Scenario: 端口标签和导线颜色验证
    Tool: Bash (grep + build)
    Preconditions: CircuitCanvas.tsx 已修改
    Steps:
      1. grep 'conn.label' src/components/Editor/CircuitCanvas.tsx — 确认标签渲染逻辑存在
      2. grep '#ef4444' src/components/Editor/CircuitCanvas.tsx — 确认红色导线颜色
      3. grep '#3b82f6' src/components/Editor/CircuitCanvas.tsx — 确认蓝色导线颜色
      4. 运行 `bun run build`
    Expected Result: 标签渲染逻辑存在，红蓝颜色存在，build 成功
    Failure Indicators: grep 无结果或 build 失败
    Evidence: .sisyphus/evidence/task-5-labels-colors.txt
  Scenario: 新组件 SVG 渲染验证
    Tool: Bash (grep)
    Preconditions: CircuitCanvas.tsx 已修改
    Steps:
      1. grep 'outlet_5hole' src/components/Editor/CircuitCanvas.tsx
      2. grep 'dual_switch' src/components/Editor/CircuitCanvas.tsx
    Expected Result: 两个新组件在 renderComponent 中有对应 case
    Failure Indicators: grep 无结果
    Evidence: .sisyphus/evidence/task-5-new-svgs.txt
  ```
  **Commit**: YES
  - Message: `feat(editor): render port labels, wire colors, new component SVGs`
  - Files: `src/components/Editor/CircuitCanvas.tsx`
  - Pre-commit: `bun run build`
- [x] 6. 更新 Sidebar.tsx — 新增两个组件拖拽项
  **What to do**:
  - 在 `basicComponents` 数组中添加两个新条目（放在 outlet 和 circuit_breaker 之间）：
    - `{ type: 'outlet_5hole', name: '五孔插座', icon: <svg>...</svg> }`
    - `{ type: 'dual_switch', name: '双联双控', icon: <svg>...</svg> }`
  - SVG 图标可以简化：五孔插座用现有 outlet 图标加一个圆点，双联双控用现有 switch 图标加双线
  **Must NOT do**:
  - 不修改现有组件的图标或顺序
  - 不添加新的分组标题
  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: 数组中添加 2 个对象，机械性工作
  - **Skills**: []
  **Parallelization**:
  - **Can Run In Parallel**: YES (与 Task 4, Task 5 并行)
  - **Parallel Group**: Wave 2 (with Task 4, Task 5)
  - **Blocks**: None
  - **Blocked By**: Task 3
  **References**:
  **Pattern References**:
  - `src/components/Layout/Sidebar.tsx:10-74` — basicComponents 数组，新组件添加位置
  - `src/components/Layout/Sidebar.tsx:38-46` — outlet 条目，五孔插座的参考模板
  - `src/components/Layout/Sidebar.tsx:20-28` — switch 条目，双联双控的参考模板
  **WHY Each Reference Matters**:
  - basicComponents — 新组件必须在此注册才能出现在侧边栏
  - outlet/switch 条目 — 新组件的图标和结构参考
  **Acceptance Criteria**:
  - [x] basicComponents 包含 outlet_5hole 和 dual_switch 条目
  - [x] 两个新组件有正确的 type、name、icon
  - [x] `bun run build` → 成功
  **QA Scenarios (MANDATORY):**
  ```
  Scenario: Sidebar 新组件验证
    Tool: Bash (grep + build)
    Preconditions: Sidebar.tsx 已修改
    Steps:
      1. grep 'outlet_5hole' src/components/Layout/Sidebar.tsx
      2. grep 'dual_switch' src/components/Layout/Sidebar.tsx
      3. 运行 `bun run build`
    Expected Result: 两个新组件在 basicComponents 中各出现 1 次；build 成功
    Failure Indicators: grep 无结果或 build 失败
    Evidence: .sisyphus/evidence/task-6-sidebar.txt
  ```
  **Commit**: YES
  - Message: `feat(ui): add outlet_5hole and dual_switch to sidebar`
  - Files: `src/components/Layout/Sidebar.tsx`
  - Pre-commit: `bun run build`
- [x] 7. 更新 examples.ts — 现有 6 示例补 label + 2 个新示例
  **What to do**:
  - 修改 `cp()` 辅助函数，增加可选 `label` 参数：`cp(id, x, y, label?)`
  - 更新现有 6 个示例中所有 `cp()` 调用，添加正确的 L/N label：
    - 电源：左 N，右 L
    - 断路器：左 L，右 L
    - 开关：左 L，右 L
    - 灯具：左 L，右 N
    - 插座：左 L，右 N
    - 家电：左 L，右 N
  - 新增示例 7：**五孔插座接线**
    - 拓扑：电源 → 断路器 → 五孔插座（L/N/E 三端口）
    - 展示火线、零线、地线的正确接法
    - 组件位置合理分布在 1200×800 画布上
  - 新增示例 8：**双联双控接线**
    - 拓扑：电源 → 断路器 → 双联双控开关 A → 灯 1 + 灯 2（两组开关分别控制一盏灯）
    - 展示双联双控的 L1/L2 两组独立控制
    - 组件位置合理分布
  - 将 2 个新示例添加到 `CIRCUIT_EXAMPLES` 数组末尾
  - 所有新示例使用稳定字符串 ID（ex7-xxx, ex8-xxx），不使用 generateId()
  **Must NOT do**:
  - 不使用 generateId() 或 createComponent()
  - 不修改现有示例的电路拓扑结构（仅添加 label）
  - 不新增元件类型
  **Recommended Agent Profile**:
  - **Category**: `deep`
    - Reason: 需要更新大量现有 cp() 调用 + 设计 2 个新电路拓扑，工作量较大
  - **Skills**: []
  **Parallelization**:
  - **Can Run In Parallel**: YES (与 Task 8 并行)
  - **Parallel Group**: Wave 3 (with Task 8)
  - **Blocks**: Task 8
  - **Blocked By**: Tasks 2, 5
  **References**:
  **Pattern References**:
  - `src/data/examples.ts:8-10` — `cp()` 辅助函数，需添加 label 参数
  - `src/data/examples.ts:54-73` — 示例 1 的组件和导线定义，是更新 label 的参考模板
  - `src/data/examples.ts:255-286` — CIRCUIT_EXAMPLES 数组，新示例添加位置
  - `src/data/examples.ts:163-177` — 示例 5 空调专线，简单拓扑的参考
  **API/Type References**:
  - `src/types/index.ts:48-52` — ConnectionPoint 接口（含 label）
  - `src/types/index.ts:2-15` — ComponentType（含 outlet_5hole, dual_switch）
  **WHY Each Reference Matters**:
  - cp() — 所有示例的连接点都通过此函数创建，加 label 参数是最小侵入性修改
  - 示例 1 — 最简单的示例，更新 label 的参考模板
  - CIRCUIT_EXAMPLES — 新示例必须在此注册才能出现在下拉菜单
  **Acceptance Criteria**:
  - [x] cp() 函数支持可选 label 参数
  - [x] 现有 6 个示例的所有 cp() 调用包含正确的 L/N label
  - [x] 新增示例 7（五孔插座接线）包含 outlet_5hole 组件
  - [x] 新增示例 8（双联双控接线）包含 dual_switch 组件
  - [x] CIRCUIT_EXAMPLES 数组包含 8 个示例
  - [x] 所有 ID 为稳定字符串（无 generateId）
  - [x] `bun test --run` → ALL PASS
  **QA Scenarios (MANDATORY):**
  ```
  Scenario: 示例数量和有效性验证
    Tool: Bash (bun test)
    Preconditions: examples.ts 已修改
    Steps:
      1. 运行 `bun test --run`
      2. grep 'CIRCUIT_EXAMPLES' src/data/examples.ts 确认数组包含 8 个元素
      3. grep 'generateId' src/data/examples.ts 确认无动态 ID
    Expected Result: 测试通过，8 个示例，无 generateId 调用
    Failure Indicators: 测试失败或示例数量不对
    Evidence: .sisyphus/evidence/task-7-examples.txt
  Scenario: 现有示例 label 补充验证
    Tool: Bash (grep)
    Preconditions: examples.ts 已修改
    Steps:
      1. grep -c "label:" src/data/examples.ts — 确认大量 cp() 调用包含 label
      2. grep "cp('ex1" src/data/examples.ts — 确认示例 1 的 cp 调用包含 label 参数
    Expected Result: 大量 label 存在，示例 1 的每个 cp 都有 label
    Failure Indicators: label 数量为 0 或示例 1 无 label
    Evidence: .sisyphus/evidence/task-7-labels.txt
  ```
  **Commit**: YES
  - Message: `feat(data): add L/N labels to all examples, add 2 new examples`
  - Files: `src/data/examples.ts`
  - Pre-commit: `bun test --run`
- [x] 8. 新增测试 — 新组件 + L/N 标记验证
  **What to do**:
  - 新增或扩展测试文件，覆盖以下场景：
  - **新组件连接点测试**（在 models.test.ts 或新文件）：
    - outlet_5hole: createDefaultConnections 返回 3 个点，label 分别为 L/N/E
    - dual_switch: createDefaultConnections 返回 4 个点，label 分别为 L1/L1/L2/L2
  - **现有组件 label 测试**：
    - power: 连接点 label 分别为 N 和 L
    - switch: 连接点 label 分别为 L 和 L
    - light: 连接点 label 分别为 L 和 N
  - **新示例有效性测试**（在 examples.test.ts 中扩展）：
    - 示例 7 和 8: calculateCircuitState(diagram).isValid === true && totalPower > 0
  - **dual_switch toggle 测试**：
    - toggleSwitch(diagram, dualSwitchId, 1) 切换 isOn
    - toggleSwitch(diagram, dualSwitchId, 2) 切换 isOn2
  - 运行 `bun test --run` 确保全部通过
  **Must NOT do**:
  - 不修改现有测试的断言逻辑（只新增）
  - 不测试 E 端口的电气计算（E 仅视觉）
  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: 测试代码编写，模式明确，参考现有测试即可
  - **Skills**: []
  **Parallelization**:
  - **Can Run In Parallel**: NO (依赖前置任务全部完成)
  - **Parallel Group**: Wave 3 (after Task 7)
  - **Blocks**: F1-F4
  - **Blocked By**: Tasks 4, 5, 7
  **References**:
  **Pattern References**:
  - `src/__tests__/models.test.ts` — 现有 models 测试，新组件测试的参考模板
  - `src/__tests__/examples.test.ts` — 现有示例测试，新示例测试的参考模板
  **WHY Each Reference Matters**:
  - models.test.ts — 现有测试模式，新测试应保持一致风格
  - examples.test.ts — 现有示例测试模式，新示例测试应保持一致风格
  **Acceptance Criteria**:
  - [x] outlet_5hole 连接点测试通过（3 点，L/N/E label）
  - [x] dual_switch 连接点测试通过（4 点，L1/L1/L2/L2 label）
  - [x] 现有组件 label 测试通过（power/switch/light）
  - [x] 新示例 7、8 有效性测试通过
  - [x] dual_switch toggle 测试通过（两组独立切换）
  - [x] `bun test --run` → ALL PASS（无回归）
  **QA Scenarios (MANDATORY):**
  ```
  Scenario: 全部测试通过验证
    Tool: Bash (bun test)
    Preconditions: 所有测试文件已创建/更新
    Steps:
      1. 运行 `bun test --run`
      2. 确认新增测试数量 > 0
      3. 确认 0 failures
    Expected Result: 所有测试通过，新增测试覆盖新组件和 label
    Failure Indicators: 任何测试失败
    Evidence: .sisyphus/evidence/task-8-tests.txt
  ```
  **Commit**: YES
  - Message: `test: add tests for new components and L/N labels`
  - Files: `src/__tests__/models.test.ts`, `src/__tests__/examples.test.ts`
  - Pre-commit: `bun test --run`
---

## Final Verification Wave (MANDATORY — after ALL implementation tasks)

> 4 review agents run in PARALLEL. ALL must APPROVE. Rejection → fix → re-run.

- [x] F1. **Plan Compliance Audit** — `oracle`
  Read the plan end-to-end. For each "Must Have": verify implementation exists (read file, run command). For each "Must NOT Have": search codebase for forbidden patterns — reject with file:line if found. Check evidence files exist in .sisyphus/evidence/. Compare deliverables against plan.
  Output: `Must Have [N/N] | Must NOT Have [N/N] | Tasks [N/N] | VERDICT: APPROVE/REJECT`

- [x] F2. **Code Quality Review** — `unspecified-high`
  Run `bun run build` + `bun test --run`. Review all changed files for: `as any`/`@ts-ignore`, empty catches, console.log in prod, commented-out code, unused imports. Check AI slop: excessive comments, over-abstraction, generic names. Verify no regressions in existing 39 tests.
  Output: `Build [PASS/FAIL] | Tests [N pass/N fail] | Files [N clean/N issues] | VERDICT`

- [x] F3. **Real Manual QA** — `unspecified-high` (+ `playwright` skill)
  Start dev server. Load each of 8 examples via Header dropdown — verify circuit renders with L/N labels visible and colored wires. Drag new components (outlet_5hole, dual_switch) from Sidebar — verify they render correctly with labeled ports. Test drag-to-connect wiring — verify wire color matches port label. Test dual_switch toggle — verify both switch groups toggle independently. Save to `.sisyphus/evidence/final-qa/`.
  Output: `Scenarios [N/N pass] | Integration [N/N] | Edge Cases [N tested] | VERDICT`

- [x] F4. **Scope Fidelity Check** — `deep`
  For each task: read "What to do", read actual diff. Verify 1:1 — everything in spec was built, nothing beyond spec was built. Check "Must NOT do" compliance. Detect cross-task contamination. Flag unaccounted changes.
  Output: `Tasks [N/N compliant] | Contamination [CLEAN/N issues] | Unaccounted [CLEAN/N files] | VERDICT`

---

## Commit Strategy

- **Task 1**: `feat(types): add ConnectionPoint.label, new ComponentTypes, ComponentState.isOn2` — types/index.ts
- **Task 2**: `feat(engine): add L/N labels to all connections, new component models, dual_switch toggle` — models.ts
- **Task 3**: `feat(engine): add outlet_5hole and dual_switch component params` — componentParams.ts
- **Task 4**: `feat(engine): add outlet_5hole and dual_switch resistance calculation` — calculator.ts
- **Task 5**: `feat(editor): render port labels, wire colors, new component SVGs` — CircuitCanvas.tsx
- **Task 6**: `feat(ui): add outlet_5hole and dual_switch to sidebar` — Sidebar.tsx
- **Task 7**: `feat(data): add L/N labels to all examples, add 2 new examples` — examples.ts
- **Task 8**: `test: add tests for new components and L/N labels` — test files

---

## Success Criteria

### Verification Commands
```bash
bun test --run  # Expected: ALL PASS, 0 failures
bun run build   # Expected: exit 0
```

### Final Checklist
- [x] All "Must Have" present
- [x] All "Must NOT Have" absent
- [x] All tests pass (existing 39 + new tests)
- [x] 8 examples load correctly with valid circuit state
- [x] L/N labels visible on all ports
- [x] Wire colors match port labels (L=red, N=blue)
- [x] New components draggable from Sidebar
- [x] Dual switch toggles both groups independently
