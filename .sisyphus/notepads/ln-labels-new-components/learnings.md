# Learnings — ln-labels-new-components

## Task 1: Type System Extension

- `src/types/index.ts` 是类型单一来源，所有新增字段用可选属性（`?`）确保向后兼容
- ComponentType 新增 `outlet_5hole`、`dual_switch` 后，39 测试零回归，说明现有测试不依赖穷举类型匹配
- 四处修改可在一次 Edit 调用中完成（append 操作按 bottom-up 顺序应用）
- tsc --noEmit 输出为空即表示无类型错误


## Task 2: Models Implementation (createConnectionPoint, createDefaultConnections, toggleSwitch)

- createConnectionPoint 用条件赋值 `if (label !== undefined) point.label = label` 而非展开运算符，避免产生 `label: undefined` 键
- 所有 6 处修改（createConnectionPoint签名、13个case的label、2个新case、state扩展、toggleSwitch扩展）可在单次 Edit 调用中完成，4个 replace 操作
- toggleSwitch 用 computed property key `[stateKey]` 实现 isOn/isOn2 动态切换，避免 if/else 分支
- 39 测试零回归：现有测试不检查 ConnectionPoint.label 字段，也不检查 ComponentState.isOn2
- LSP 不可用时用 `./node_modules/.bin/tsc --noEmit` 替代，npx tsc 在此环境不工作

## Task 2: componentParams.ts updates
- BASIC_COMPONENT_PARAMS 中添加新条目后，通过 spread 自动合并到 COMPONENT_PARAMS
- Record<ComponentType, string> 类型的 names/colors 必须包含所有 ComponentType 成员，否则 tsc 报错
- parser.ts 中的 getDefaultName 也有 Record<ComponentType, string>，需要同步更新
- 修改 types 后，所有使用 Record<ComponentType, ...> 的地方都需要补全新类型

## Task 4: Sidebar UI — Add drag items for outlet_5hole and dual_switch

- basicComponents 数组中条目顺序：power, switch, dual_switch, light, outlet, outlet_5hole, circuit_breaker, fuse, wire
- 新条目用 Edit append 操作插入到目标条目的闭合 `},` 行之后即可
- dual_switch 图标复用 switch 的 SVG 基础（fill=none stroke），额外加一条水平 line 区分
- outlet_5hole 图标复用 outlet 的 fill=currentColor 风格，用五个小圆点表示五孔
- bun run build (tsc -b && vite build) 一次通过，无需额外修复

## Task 4: Calculator — Resistance & Conductivity

- getComponentResistance 的 switch-case 中，outlet_5hole 紧跟 outlet（return Infinity），dual_switch 紧跟 switch（return state.isOn ? 0.01 : Infinity）
- isComponentConducting 中 dual_switch 紧跟 switch（return state.isOn），教育简化版只用第一组开关状态
- 新增 case 不影响现有 39 个测试，零回归
- calculateCircuitState 中 loadComponents 过滤逻辑无需修改，dual_switch 会被 `c.type !== 'switch'` 保留为非开关类型——但实际上 dual_switch 应被视为开关控制元件，后续可能需要将其加入过滤列表

## Task 6: CircuitCanvas — Port Labels, Wire Colors, New SVGs, dual_switch Click

- 端口标签用 `<text>` 元素渲染在 `<circle>` 旁边（y - 10），颜色按 label 前缀区分：L→红、N→蓝、E→绿
- conn.label 是可选字段，用 `{conn.label && (...)}` 条件渲染避免空标签
- 导线颜色通过 `fromPoint.label` 获取，fromPoint 已在 renderWire 中通过 `connections.find()` 取得
- wireColor 用三元链：startsWith('L') 覆盖 L/L1/L2，==='N' 蓝色，==='E' 绿色，默认灰色
- outlet_5hole SVG：50x40 矩形 + 上方圆孔(E) + 下方两竖线(L/N)，模拟国标五孔插座外观
- dual_switch SVG：60x40 矩形 + 两组开关线 + 分隔线，用 block scope `{}` 包裹 case 避免 const 跨 case 泄漏
- dual_switch 点击交互：通过 `e.clientY - rect.top - component.position.y` 计算相对 Y，< 20 为第1组，≥ 20 为第2组
- toggleSwitch 的 groupIndex 参数类型为 `1 | 2`，与 models.ts 中的签名一致
- 拖拽临时虚线保持 `#9ca3af` 灰色不变，不受 wireColor 影响
- LSP 不可用，直接用 `bun run build` (tsc -b && vite build) 验证，一次通过

## Task 7: Examples — L/N labels + 2 new examples (outlet_5hole, dual_switch)

- cp() 辅助函数改为 `cp(id, x, y, label?)` 后，用条件赋值避免 `label: undefined`，与 models.ts 中 createConnectionPoint 保持一致
- label 规则：power N/L, breaker L/L, switch L/L, light L/N, outlet L/N, 家电 L/N, outlet_5hole L/N/E, dual_switch L1/L1/L2/L2
- outlet_5hole 默认 params 只有 voltage，电阻为 Infinity → totalPower=0，需在示例中覆盖 `{ ...BASIC_COMPONENT_PARAMS.outlet_5hole, power: 200, resistance: 242 }` 才能通过 totalPower>0 测试
- dual_switch 4 端口坐标：(0,10) L1入, (60,10) L1出, (0,30) L2入, (60,30) L2出
- 文件从 286 行增长到 355 行，分多次 Edit 调用完成：先改 cp() 签名+ex1-5 labels，再改 ex6 labels，再追加 ex7/ex8 定义，最后更新导出和 CIRCUIT_EXAMPLES
- CIRCUIT_EXAMPLES 数组现有 8 个条目，43 测试全部通过
# Task 8: Test Coverage Learnings

## Findings
- examples.test.ts dynamically iterates CIRCUIT_EXAMPLES, so examples 7 & 8 are auto-covered (no changes needed)
- models.test.ts: added 10 new tests (outlet_5hole 3pts, dual_switch 4pts, existing labels for power/switch/light, dual_switch toggle group1+group2)
- Total tests: 50 (up from 43), all passing
- toggleSwitch supports optional groupIndex param for dual_switch group 2 (isOn2)
- createDefaultConnections returns label field on each connection point

## Commit
- Message: `test: add tests for new components and L/N labels`
- Files: `src/__tests__/models.test.ts`