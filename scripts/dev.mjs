import { spawn } from 'node:child_process';
import './build.mjs';
const child = spawn(process.execPath, ['--watch', 'backend/server.js'], { stdio: 'inherit', env: process.env });
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => child.kill(signal));
child.on('exit', code => { process.exitCode = code || 0; });
