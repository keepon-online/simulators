2026-03-04 Task1 阻塞记录: `lsp_diagnostics` 无法执行，环境缺少 `typescript-language-server`（命令不存在）。已通过 `bun run --cwd "/home/top/project/web/simulators" build` 完成 TypeScript 间接校验并留存证据。
2026-03-04 Task2 阻塞记录: `lsp_diagnostics` 仍不可用（缺少 `typescript-language-server`），已改用目标测试与负向数据检查作为本任务验证主证据。

2026-03-04 Task3 阻塞记录:  仍不可用（缺少 ）；已用指定命令 bun test v1.3.6 (d530ed99) 通过并产出证据文件替代。
2026-03-04 Task3 阻塞记录: lsp_diagnostics 仍不可用（缺少 typescript-language-server）；已用指定命令 bun test --run src/__tests__/integration.test.ts 通过并产出证据文件替代。
2026-03-04 Task4 阻塞记录: lsp_diagnostics 仍不可用（缺少 typescript-language-server）；本任务改以 sidebar 专项测试 bun test --run src/__tests__/sidebar.test.tsx 与文本 grep 校验作为验证证据。
2026-03-04 Task8 阻塞记录: `lsp_diagnostics` 依旧不可用（缺少 `typescript-language-server`，且 `.md` 无配置 LSP）；本次以 full-check 证据 `task-8-full-check.txt` 与 README 关键词证据 `task-8-readme-check.txt` 替代。备注：本次全量测试中 `src/__tests__/app-storage.test.tsx` 实测通过，未复现别名导入失败。
