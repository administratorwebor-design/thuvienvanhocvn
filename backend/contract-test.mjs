// Legacy entry point now runs the isolated contract/security suite.
import { spawnSync } from 'node:child_process';
const result = spawnSync(process.execPath, ['--test', 'tests/library.test.mjs'], {cwd:new URL('..',import.meta.url),stdio:'inherit'});
process.exitCode = result.status ?? 1;
