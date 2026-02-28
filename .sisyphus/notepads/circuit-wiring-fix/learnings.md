## Notepad: Learnings

## Task 1: 数据层修复 - 家电双连接点

### 完成内容
- models.ts: 5种家电(refrigerator, air_conditioner, tv, washer, water_heater)从1个连接点改为2个: 输入端(0,25) + 输出端(60,25)
- parser.ts: 删除第78-102行重复的 createDefaultConnections 函数，改为从 models.ts import
- models.test.ts: 新增5个家电双连接点测试，验证 length===2 且坐标不同
- integration.test.ts: 检查后无需修改，家电都用 connections[0] 作为输入端，语义正确

### 关键发现
- 家电矩形尺寸 60×50，连接点 (0,25) 和 (60,25) 分别在左右中部
- parser.ts 的 createDefaultConnections 与 models.ts 完全重复，消除后只保留单一来源
- integration.test.ts 中家电始终作为 wire 的 to 端用 connections[0]（输入端），改为双连接点后语义不变
- 测试从基线 22 增加到 27（+5 个家电测试），全部通过

### 模式
- 所有非家电元件已有2个连接点的模式：输入端在左，输出端在右
- createConnectionPoint 自动生成唯一 id，无需手动指定

## Task 2: 渲染层修复 - renderWire pointId 匹配 + 家电双圆圈

### 完成内容
- renderWire: `connections[0]` 硬编码改为 `connections.find(c => c.id === wire.from.pointId) || connections[0]`，支持 pointId 精确匹配
- 家电渲染分支(refrigerator/air_conditioner/tv/washer/water_heater): 从1个circle `(30,50)` 改为2个 `(0,25)` + `(60,25)`，与 models.ts 一致
- outlet 分支: circle `cy={y+15}` 修正为 `cy={y+20}`，与 connections `(0,20)` + `(50,20)` 一致
- fuse 分支: circle `cy={y+10}` 修正为 `cy={y+15}`，与 connections `(0,15)` + `(50,15)` 一致

### 关键发现
- handleComponentClick 中仍有 `connections[0]` 硬编码（第271-276行），属于 Task 3 连线交互逻辑范围
- outlet 在 models.ts 中走 light/outlet/resistor 分支，connections 是 `(0,20)+(50,20)` 而非 `(0,15)+(50,15)`
- fuse 在 models.ts 中走 circuit_breaker/fuse 分支，connections 是 `(0,15)+(50,15)` 而非 `(0,10)+(50,10)`
- 测试基线保持 27 pass, 0 fail

## Task 3: 创建 6 个家庭接线示例数据 + 测试

### 完成内容
- src/data/examples.ts: 导出 6 个 CircuitDiagram 示例和 CIRCUIT_EXAMPLES 数组
- src/__tests__/examples.test.ts: 验证每个示例的 isValid===true 和 totalPower>0
- 6 个示例：单灯单控、一灯双控、插座回路、厨房回路、空调专线、全屋配电

### 关键发现
- calculator.ts 的 calculateCircuitState 不真正遍历 wire 拓扑，只要有 power 元件和负载元件就 isValid=true
- outlet 类型默认 resistance=Infinity（getComponentResistance 返回 Infinity），需要手动设置 power+resistance 参数才能产生功率
- 手动构造 Component/Wire 时必须避免 generateId/createComponent/createWire，使用稳定字符串 ID 如 "ex1-power"
- ConnectionPoint ID 也必须是稳定字符串，Wire 的 pointId 必须匹配对应 Component 的 ConnectionPoint ID
- 测试从 27 增加到 39（+12 个示例测试：6 示例 × 2 断言），全部通过

### 模式
- 辅助函数 cp/makeComponent/makeWire 可复用于未来手动构造测试电路
- outlet 作为负载使用时需显式设置 { power, resistance } 参数，否则 resistance=Infinity 导致 current=0

## Task 5: 连线交互重写 - 双击改为拖拽端口连线

### 完成内容
- 移除旧连线逻辑：`connectingFrom` 状态、`handleDoubleClick` 函数、`handleComponentClick` 中的连线分支、JSX 中的 `onDoubleClick` 绑定
- 新增 `wiringFrom` 和 `wiringMousePos` 两个状态，支持从端口拖拽连线
- 新增 `handlePortMouseDown`（开始连线，stopPropagation 防止触发元件拖拽）和 `handlePortMouseUp`（创建 Wire，禁止自连接）
- 合并 `handleDragMove` 为统一的 `handleMouseMove`，同时处理元件拖拽和连线鼠标跟踪
- 合并 `handleDragEnd` 为统一的 `handleMouseUp`，同时清理拖拽和连线状态
- SVG `onMouseLeave` 也调用 `handleMouseUp` 取消连线
- 渲染临时灰色虚线 `<line>` (stroke=#9ca3af, strokeDasharray="6 3", pointerEvents=none)
- 端口圆圈从 renderComponent 内 r=4 改为 r=6
- 端口圆圈在主渲染循环中单独渲染（方案B），带 onMouseDown/onMouseUp 事件和 cursor:crosshair

### 关键发现
- renderComponent 是纯函数无法绑定事件，采用方案B：在 components.map 中 renderComponent 之后额外渲染每个连接点的交互圆圈
- 元件拖拽和连线拖拽通过 stopPropagation 互斥：端口 mousedown 阻止冒泡到元件 `<g>` 的 onMouseDown
- handleMouseUp 统一清理所有状态（isDragging + wiringFrom + wiringMousePos），简化了 SVG 事件绑定
- handleCanvasClick 也需要清理 wiringFrom/wiringMousePos，防止点击空白区域后残留状态
- renderComponent 内的端口圆圈已移除，避免与外部交互圆圈重叠导致事件拦截
- 重叠的 SVG circle 中，内层（无事件）会拦截外层（有事件）的鼠标事件，必须移除或设 pointerEvents="none"
- 测试基线保持 39 pass, 0 fail

### 模式
- SVG 事件分层：外层 `<g>` 处理元件拖拽/点击，内层端口 `<circle>` 处理连线，通过 stopPropagation 隔离
- 临时渲染元素用 pointerEvents="none" 避免干扰鼠标事件

## Task 6: Header 示例电路下拉菜单 + App 加载逻辑

### 完成内容
- Header.tsx: 添加 examples/onLoadExample props，在按钮区域添加 `<select>` 下拉菜单（value 始终为 "" 实现可重复选择）
- Layout.tsx: headerProps 接口扩展 examples/onLoadExample 两个属性
- App.tsx: import CIRCUIT_EXAMPLES，实现 handleLoadExample（confirm 确认 + setDiagram + setSelectedComponentId(null)）

### 关键发现
- select value="" + option disabled 实现占位符模式，每次 onChange 后自动重置，允许重复选择同一示例
- handleLoadExample 用 diagram.components.length > 0 判断画布是否有内容，有则弹 confirm
- Layout 通过 spread {...headerProps} 透传，无需额外处理新增 props
- 测试基线保持 39 pass, 0 fail