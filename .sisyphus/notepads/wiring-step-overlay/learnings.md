2026-03-04 Task1: `src/types/index.ts` 采用现有 `export interface` 风格新增类型最稳妥；为保持向后兼容，示例扩展字段均应使用可选属性（`?`）。
2026-03-04 Task2: `CIRCUIT_EXAMPLES` 已切换为 `CircuitExampleWithSteps` 类型后再补充 `steps`/`teachingLabel`/`teachingTag`，可在不改运行时逻辑的前提下完成数据扩展并通过类型校验。

2026-03-04 Task3: 教学四场景语义对齐采用最小文本变更，仅调整  的示例命名与说明，不改 components/wires，保证教学可识别性与现有计算行为稳定。
2026-03-04 Task3: 教学四场景语义对齐采用最小文本变更，仅调整 src/data/examples.ts 的示例命名与说明，不改 components/wires，保证教学可识别性与现有计算行为稳定。
2026-03-04 Task4: Sidebar 分组改造可通过 section 配置数组最小化重构渲染结构，保留 onDragStart 与 draggable 逻辑可避免交互回归；关键教学标签建议以小字号 tag 直出（如 C16/30mA）。
2026-03-04 Task8: README 关键词验收在本环境 `rg` 不可用，改用 `grep -n` 同样可生成可追溯证据；同时全量验收命令 `bun run test --run && bun run build` 可直接重定向到 evidence 文件形成闭环。
