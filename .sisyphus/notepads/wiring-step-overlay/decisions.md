2026-03-04 Task1 决策: 在 `src/types/index.ts` 新增 `WiringStep` 与 `CircuitExampleWithSteps`，并在示例契约中增加 `steps?: WiringStep[]` 与轻量教学标签字段 `teachingLabel?`、`teachingTag?`，不改动运行时代码。
2026-03-04 Task2 决策: 教学规格采用轻量可读元数据字段（`teachingLabel` + `teachingTag`），每个示例 `steps` 控制在 3-5 条并使用连续编号，避免引入复杂 schema。

2026-03-04 Task3 决策: 四个核心场景统一为“单灯单控 / 双控照明 / 插座回路含保护 / 专线回路”，并在说明中强调课堂语义（控制点、保护、独立回路），其余逻辑保持不变。
2026-03-04 Task3 决策: 四个核心场景统一为“单灯单控 / 双控照明 / 插座回路含保护 / 专线回路”，并在说明中强调课堂语义（控制点、保护、独立回路），其余逻辑保持不变。
2026-03-04 Task4 决策: 采用四分组 sections（配电保护/开关照明/插座回路/常见家电）驱动 Sidebar 渲染，并仅为 circuit_breaker 与 outlet_5hole 增加可见教学标签 C16、30mA；组件类型与拖拽 API 保持不变。
2026-03-04 Task8 决策: 仅做闭环验收最小改动——在 `src/__tests__/examples.test.ts` 增加“标准教学包完整性”断言，并在 `README.md` 明确写入“标准教学包”“接线步骤 Overlay”现状描述，不扩展功能范围。
