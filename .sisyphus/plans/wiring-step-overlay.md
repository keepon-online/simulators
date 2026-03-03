# 接线步骤提示 Overlay

## TL;DR

> **Quick Summary**: 在画布右上角添加接线步骤提示 overlay，当用户加载示例时自动显示接线步骤说明，提升接线演示的清晰度。
>
> **Deliverables**:
> - 接线步骤类型定义（types/index.ts）
> - 8 个示例的 steps 数据（examples.ts）
> - Overlay UI 组件（CircuitCanvas.tsx）
>
> **Estimated Effort**: Medium
> **Parallel Execution**: YES - 3 waves
> **Critical Path**: T1 → T2 → T3

---

## Context

### Original Request
用户要求"接线演示不够清晰明了" — 需要改进接线演示的清晰度。

### Interview Summary
**Key Discussions**:
- 改进方向：用户选择了 **Option B** - 添加接线步骤提示 overlay
- 显示位置：画布右上角（固定）
- 显示内容：示例名称 + 接线步骤列表（3-5 步简洁说明）
- 交互方式：自动显示（加载示例时）+ 可手动关闭（点击 × 按钮）

**Technical Decisions**:
- 使用固定位置 overlay（不实现拖拽）
- 使用 Tailwind CSS 样式（跟随现有主题）
- steps 数据作为 CIRCUIT_EXAMPLES 的新字段

### Metis Review

Metis consultation 超时，但根据收集的信息已经足够生成完整计划。

---

## Work Objectives

### Core Objective
在 CircuitCanvas 中添加接线步骤提示 overlay，当用户加载示例时自动显示接线步骤说明，提升接线演示的清晰度。

### Concrete Deliverables
- `src/types/index.ts` - 添加 `WiringStep` 和 `CircuitExampleWithSteps` 类型定义
- `src/data/examples.ts` - 为 8 个示例添加 `steps` 数据
- `src/components/Editor/CircuitCanvas.tsx` - 添加 overlay UI 组件和显示/关闭逻辑

### Definition of Done
- [ ] `bun run build` 成功
- [ ] `bun test` 通过
- [ ] 加载示例时 overlay 自动显示
- [ ] 点击 × 按钮可以关闭 overlay

### Must Have
- 8 个示例都有对应的 steps 数据
- Overlay 显示在画布右上角
- Overlay 可以手动关闭

### Must NOT Have (Guardrails)
- ~~拖拽 overlay 功能~~（超出范围）
- ~~动画效果~~（超出范围）
- ~~国际化支持~~（超出范围）

---

## Verification Strategy

> **ZERO HUMAN INTERVENTION** — ALL verification is agent-executed. No exceptions.
> Acceptance criteria requiring "user manually tests/confirms" are FORBIDDEN.

### Test Decision
- **Infrastructure exists**: YES (Vitest)
- **Automated tests**: Tests after (no TDD for UI components)
- **Framework**: bun test

### QA Policy
Every task MUST include agent-executed QA scenarios (see TODO template below).
Evidence saved to `.sisyphus/evidence/task-{N}-{scenario-slug}.{ext}`.

- **Frontend/UI**: Use Bash (manual verification with screenshots) — 启动开发服务器，加载示例，验证 overlay 显示和交互
- **Data Files**: Use Bash (grep) — 验证 steps 数据已添加

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Start Immediately — types + data):
├── Task 1: 扩展类型定义 [quick]
└── Task 2: 添加 8 个示例的 steps 数据 [quick]

Wave 2 (After Wave 1 — UI component):
├── Task 3: 在 CircuitCanvas 添加 overlay UI 组件 [unspecified-high]

Wave FINAL (After ALL tasks — verification):
├── Task F1: TypeScript 类型检查 [quick]
├── Task F2: 构建验证 [quick]
├── Task F3: 测试验证 [quick]
└── Task F4: 手动 QA [unspecified-high]

Critical Path: Task 1 → Task 2 → Task 3 → F1-F4
Parallel Speedup: ~33% faster than sequential (Wave 1 parallel)
Max Concurrent: 2 (Wave 1)
```

### Dependency Matrix

- **1, 2**: — — 3, F1-F4
- **3**: 1, 2 — F1-F4, 1
- **F1-F4**: 3 — — 2

### Agent Dispatch Summary

- **1**: **2** — T1 → `quick`, T2 → `quick`
- **2**: **1** — T3 → `unspecified-high`
- **3**: **4** — F1 → `quick`, F2 → `quick`, F3 → `quick`, F4 → `unspecified-high`

---

## TODOs

- [ ] 1. 扩展类型定义（添加 WiringStep 和 CircuitExampleWithSteps）

  **What to do**:
  - 在 `src/types/index.ts` 中添加 `WiringStep` 接口定义
  - `WiringStep` 接口包含：`step: number; description: string`
  - 更新 `CIRCUIT_EXAMPLES` 的类型定义，添加 `steps?: WiringStep[]` 可选字段

  **Must NOT do**:
  - ~~修改其他类型定义~~

  **Recommended Agent Profile**:
  > Select category + skills based on task domain. Justify each choice.
  - **Category**: `quick`
    - Reason: 简单的类型定义修改，单个文件，快速完成
  - **Skills**: []
    - 无需特殊技能

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Task 2)
  - **Blocks**: Task 3, F1-F4
  - **Blocked By**: None

  **References** (CRITICAL - Be Exhaustive):

  > The executor has NO context from your interview. References are their ONLY guide.
  > Each reference must answer: "What should I look at and WHY?"

  **Pattern References** (existing code to follow):
  - `src/types/index.ts:52-57` - ConnectionPoint 接口定义模式（label?: string 可选字段模式）
  - `src/types/index.ts:59-70` - Component 接口定义模式

  **API/Type References** (contracts to implement against):
  - `src/data/examples.ts:314` - CIRCUIT_EXAMPLES 的导出格式

  **Why Each Reference Matters**:
  - `src/types/index.ts:52-57`: ConnectionPoint 的 `label?: string` 模式展示了如何定义可选字段，应用到 `steps?: WiringStep[]`
  - `src/types/index.ts:59-70`: Component 接口展示了类型定义的结构模式
  - `src/data/examples.ts:314`: CIRCUIT_EXAMPLES 导出格式需要匹配新的类型定义

  **Acceptance Criteria**:

  > **AGENT-EXECUTABLE VERIFICATION ONLY** — No human action permitted.
  > Every criterion MUST be verifiable by running a command or using a tool.

  - [ ] WiringStep 接口已定义：step: number, description: string
  - [ ] CircuitExampleWithSteps 类型已定义（或 CIRCUIT_EXAMPLES 类型已更新）
  - [ ] `bun run build` → 无 TypeScript 错误

  **QA Scenarios (MANDATORY — task is INCOMPLETE without these):**

  ```
  Scenario: 类型定义验证
    Tool: Bash (grep)
    Preconditions: types/index.ts 已修改
    Steps:
      1. grep -n "interface WiringStep" src/types/index.ts
      2. grep -n "WiringStep\[\]" src/types/index.ts
    Expected Result:
      - 找到 "interface WiringStep" 定义
      - 找到 "WiringStep[]" 引用
    Failure Indicators:
      - grep 返回空结果
    Evidence: .sisyphus/evidence/task-1-type-definition.txt

  Scenario: TypeScript 类型检查
    Tool: Bash
    Preconditions: types/index.ts 已修改
    Steps:
      1. cd C:\\project\\simulators
      2. bun run build
    Expected Result: Build success, no TypeScript errors
    Failure Indicators:
      - Build fails with TypeScript errors
      - Error mentions "WiringStep" or "CircuitExampleWithSteps"
    Evidence: .sisyphus/evidence/task-1-build-check.txt
  ```

  **Evidence to Capture**:
  - [ ] task-1-type-definition.txt
  - [ ] task-1-build-check.txt

  **Commit**: YES
  - Message: `feat(types): add WiringStep and CircuitExampleWithSteps types`
  - Files: `src/types/index.ts`
  - Pre-commit: `bun test`

- [ ] 2. 添加 8 个示例的 steps 数据

  **What to do**:
  - 为每个示例添加 `steps` 数组，包含 3-5 个接线步骤说明
  - Steps 格式：`{ step: number, description: string }[]`
  - 确保步骤清晰、简洁、易于理解

  **Steps 内容示例**:
  ```
  ex1 单灯单控:
    1. 连接火线 L：电源(L) → 断路器(L) → 开关(L)
    2. 连接负载线：开关(L) → 灯(L)
    3. 连接零线 N：灯(N) → 电源(N)

  ex7 五孔插座接线:
    1. 连接火线 L：电源(L) → 断路器(L) → 插座(L)
    2. 连接零线 N：电源(N) → 断路器(N) → 插座(N) （注：示例中 N 直接从电源接）
    3. 连接地线 E：插座(E) 需要连接到地线端子（此示例仅展示 L 连接）
  ```

  **Must NOT do**:
  - ~~修改 components 和 wires 数据~~

  **Recommended Agent Profile**:
  > Select category + skills based on task domain. Justify each choice.
  - **Category**: `quick`
    - Reason: 数据修改，8 个示例，格式一致
  - **Skills**: []
    - 无需特殊技能

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Task 1)
  - **Blocks**: Task 3, F1-F4
  - **Blocked By**: None

  **References** (CRITICAL - Be Exhaustive):

  > The executor has NO context from your interview. References are their ONLY guide.
  > Each reference must answer: "What should I look at and WHY?"

  **Pattern References** (existing code to follow):
  - `src/data/examples.ts:314-354` - CIRCUIT_EXAMPLES 数组结构
  - `src/data/examples.ts:315-319` - ex1 的 name 和 description 字段格式

  **API/Type References** (contracts to implement against):
  - Task 1 新定义的 WiringStep 类型

  **Why Each Reference Matters**:
  - `src/data/examples.ts:314-354`: CIRCUIT_EXAMPLES 数组展示了如何添加新字段到每个示例
  - `src/data/examples.ts:315-319`: ex1 的示例展示了字段格式和结构

  **Acceptance Criteria**:

  > **AGENT-EXECUTABLE VERIFICATION ONLY** — No human action permitted.
  > Every criterion MUST be verifiable by running a command or using a tool.

  - [ ] 8 个示例都添加了 steps 字段
  - [ ] 每个 steps 数组包含 3-5 个步骤
  - [ ] `bun run build` → 无 TypeScript 错误

  **QA Scenarios (MANDATORY — task is INCOMPLETE without these):**

  ```
  Scenario: 验证 8 个示例的 steps 数据
    Tool: Bash (grep)
    Preconditions: examples.ts 已修改
    Steps:
      1. grep -c "steps:" src/data/examples.ts
    Expected Result: count >= 8
    Failure Indicators:
      - count < 8
    Evidence: .sisyphus/evidence/task-2-steps-count.txt

  Scenario: 验证 steps 内容格式
    Tool: Bash (grep)
    Preconditions: examples.ts 已修改
    Steps:
      1. grep -A 5 "steps:" src/data/examples.ts | head -20
    Expected Result:
      - 找到 step: number
      - 找到 description: string
    Failure Indicators:
      - 格式不符合预期
    Evidence: .sisyphus/evidence/task-2-steps-format.txt
  ```

  **Evidence to Capture**:
  - [ ] task-2-steps-count.txt
  - [ ] task-2-steps-format.txt

  **Commit**: YES
  - Message: `feat(data): add wiring steps to all 8 examples`
  - Files: `src/data/examples.ts`
  - Pre-commit: `bun test`

- [ ] 3. 在 CircuitCanvas 添加 overlay UI 组件

  **What to do**:
  - 在 `CircuitCanvas.tsx` 中添加 `showStepsOverlay` state
  - 当 `diagram` props 变化时（示例加载），自动设置 `showStepsOverlay = true`
  - 添加 overlay UI 组件：
    - 位置：画布右上角（absolute positioning, top-4, right-4）
    - 背景：半透明白色卡片（bg-white/90, shadow, rounded）
    - 内容：示例名称 + steps 列表
    - 关闭按钮：右上角 × 按钮
  - 点击 × 按钮时设置 `showStepsOverlay = false`
  - 需要获取当前示例的 steps 数据（通过 diagram.id 匹配 examples）

  **Must NOT do**:
  - ~~实现拖拽功能~~
  - ~~添加动画效果~~
  - ~~实现国际化~~

  **Recommended Agent Profile**:
  > Select category + skills based on task domain. Justify each choice.
  - **Category**: `unspecified-high`
    - Reason: UI 组件开发，需要理解现有代码结构和状态管理
  - **Skills**: []
    - 无需特殊技能

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Sequential
  - **Blocks**: F1-F4
  - **Blocked By**: Task 1, Task 2

  **References** (CRITICAL - Be Exhaustive):

  > The executor has NO context from your interview. References are their ONLY guide.
  > Each reference must answer: "What should I look at and WHY?"

  **Pattern References** (existing code to follow):
  - `src/components/Editor/CircuitCanvas.tsx:221-226` - CircuitCanvasProps 接口定义
  - `src/components/Editor/CircuitCanvas.tsx:227-231` - useState hooks 使用模式
  - `src/components/Editor/CircuitCanvas.tsx:365-468` - JSX 渲染结构

  **API/Type References** (contracts to implement against):
  - Task 1 新定义的 WiringStep 类型
  - `src/data/examples.ts` - CIRCUIT_EXAMPLES 导出（需要导入）

  **Why Each Reference Matters**:
  - `src/components/Editor/CircuitCanvas.tsx:221-226`: CircuitCanvasProps 展示了如何接收 props
  - `src/components/Editor/CircuitCanvas.tsx:227-231`: useState 展示了状态管理模式
  - `src/components/Editor/CircuitCanvas.tsx:365-468`: JSX 展示了如何在 SVG 外添加 UI 元素

  **Acceptance Criteria**:

  > **AGENT-EXECUTABLE VERIFICATION ONLY** — No human action permitted.
  > Every criterion MUST be verifiable by running a command or using a tool.

  - [ ] `showStepsOverlay` state 已添加
  - [ ] Overlay UI 组件已添加到 JSX
  - [ ] Overlay 显示在画布右上角
  - [ ] 点击 × 按钮可以关闭 overlay
  - [ ] `bun run build` → 无 TypeScript 错误

  **QA Scenarios (MANDATORY — task is INCOMPLETE without these):**

  ```
  Scenario: Overlay 组件验证
    Tool: Bash (grep)
    Preconditions: CircuitCanvas.tsx 已修改
    Steps:
      1. grep -n "showStepsOverlay" src/components/Editor/CircuitCanvas.tsx
      2. grep -n "CIRCUIT_EXAMPLES" src/components/Editor/CircuitCanvas.tsx
      3. grep -n "steps" src/components/Editor/CircuitCanvas.tsx
    Expected Result:
      - 找到 showStepsOverlay useState
      - 找到 CIRCUIT_EXAMPLES 导入
      - 找到 steps 相关渲染代码
    Failure Indicators:
      - grep 返回空结果
    Evidence: .sisyphus/evidence/task-3-overlay-component.txt

  Scenario: TypeScript 类型检查
    Tool: Bash
    Preconditions: CircuitCanvas.tsx 已修改
    Steps:
      1. cd C:\\project\\simulators
      2. bun run build
    Expected Result: Build success, no TypeScript errors
    Failure Indicators:
      - Build fails with TypeScript errors
    Evidence: .sisyphus/evidence/task-3-build-check.txt
  ```

  **Evidence to Capture**:
  - [ ] task-3-overlay-component.txt
  - [ ] task-3-build-check.txt

  **Commit**: YES
  - Message: `feat(ui): add wiring steps overlay to CircuitCanvas`
  - Files: `src/components/Editor/CircuitCanvas.tsx`
  - Pre-commit: `bun test`

---

## Final Verification Wave

> 4 review tasks run in PARALLEL. ALL must APPROVE.

- [ ] F1. **TypeScript 类型检查** — `quick`
  Run `bun run build` and check for TypeScript errors.
  Output: Build [PASS/FAIL] | Errors [N]

- [ ] F2. **构建验证** — `quick`
  Run `bun run build` and verify build completes without errors.
  Output: Build [SUCCESS/FAILURE]

- [ ] F3. **测试验证** — `quick`
  Run `bun test` and verify all tests pass.
  Output: Tests [N pass/N fail] | VERDICT

- [ ] F4. **手动 QA** — `unspecified-high`
  Start dev server, load all 8 examples, verify overlay displays correctly and can be closed.
  Save screenshots to `.sisyphus/evidence/final-qa/`.
  Output: Examples [N/N] | Overlay [PASS/FAIL] | VERDICT

---

## Commit Strategy

- **1**: `feat(types): add WiringStep and CircuitExampleWithSteps types` — src/types/index.ts, bun test
- **2**: `feat(data): add wiring steps to all 8 examples` — src/data/examples.ts, bun test
- **3**: `feat(ui): add wiring steps overlay to CircuitCanvas` — src/components/Editor/CircuitCanvas.tsx, bun test

---

## Success Criteria

### Verification Commands
```bash
bun test          # Expected: 50 tests pass
bun run build    # Expected: Build success
```

### Final Checklist
- [ ] 8 个示例都有 steps 数据
- [ ] Overlay 显示在画布右上角
- [ ] Overlay 可以手动关闭
- [ ] 所有测试通过
- [ ] 构建成功
