// eslint-disable
// MAALAL CARS — Process Watchdog for cPanel Shared Hosting
// =========================================================
// Kills orphan/zombie Node.js processes that exceed the expected count.
//
// Setup: Add to cPanel Cron Jobs (every 5 minutes):
//   */5 * * * * /home/maalalca/nodevenv/maalalcars/20/bin/node /home/maalalca/maalalcars/scripts/watchdog.js >> /home/maalalca/maalalcars/watchdog.log 2>&1
//
// How it works:
// 1. Lists all Node.js processes owned by the current user
// 2. If count exceeds MAX_ALLOWED_NODE_PROCESSES, kills the oldest ones
// 3. Logs all actions for debugging
// 4. Touches tmp/restart.txt to trigger Passenger restart if needed

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const MAX_ALLOWED_NODE_PROCESSES = 3; // Passenger spawns 1-2 for the app
const APP_DIR = path.resolve(__dirname, '..');

function log(msg) {
  const line = `[${new Date().toISOString()}] [WATCHDOG] ${msg}`;
  console.log(line);
}


function getNodeProcesses() {
  try {
    const myPid = process.pid;
    const myPpid = process.ppid;
    const output = execSync('ps -u $(whoami) -o pid,ppid,etimes,rss,comm,args --no-headers', {
      encoding: 'utf8',
      timeout: 5000,
    });
    
    return output
      .split('\n')
      .filter((l) => l.trim())
      .map((l) => {
        const parts = l.trim().split(/\s+/);
        return {
          pid: parseInt(parts[0], 10),
          ppid: parseInt(parts[1], 10),
          elapsedSeconds: parseInt(parts[2], 10),
          rssKb: parseInt(parts[3], 10),
          comm: parts[4] || '',
          args: parts.slice(5).join(' '),
        };
      })
      .filter(
        (p) =>
          p.pid &&
          p.pid !== myPid &&
          p.pid !== myPpid &&
          (p.comm === 'node' || p.comm === 'nodejs' || p.args.includes('node')) &&
          !p.args.includes('watchdog.js')
      );
  } catch (e) {
    log('Error listing processes: ' + e.message);
    return [];
  }
}

function run() {
  const processes = getNodeProcesses();
  log(`Found ${processes.length} Node.js process(es) (limit: ${MAX_ALLOWED_NODE_PROCESSES})`);
  
  if (processes.length <= MAX_ALLOWED_NODE_PROCESSES) {
    log('Process count within limits — no action needed.');
    return;
  }

  // Sort by elapsed time descending (oldest first = most likely orphans)
  processes.sort((a, b) => b.elapsedSeconds - a.elapsedSeconds);

  const toKill = processes.slice(0, processes.length - MAX_ALLOWED_NODE_PROCESSES);
  
  for (const p of toKill) {
    const ageMin = Math.round(p.elapsedSeconds / 60);
    log(`Killing orphan PID ${p.pid} (age: ${ageMin}min, RSS: ${p.rssKb}KB, args: ${p.args})`);
    try {
      process.kill(p.pid, 'SIGTERM');
      // Give it 2 seconds, then force kill
      setTimeout(() => {
        try { process.kill(p.pid, 'SIGKILL'); } catch (_) {}
      }, 2000);
    } catch (e) {
      log(`  → Could not kill PID ${p.pid}: ${e.message}`);
    }
  }

  log(`Killed ${toKill.length} orphan process(es). Touching restart.txt...`);
  
  // Touch restart.txt to signal Passenger to restart cleanly
  try {
    const restartFile = path.join(APP_DIR, 'tmp', 'restart.txt');
    fs.mkdirSync(path.dirname(restartFile), { recursive: true });
    fs.writeFileSync(restartFile, Date.now().toString());
    log('Restart signal sent.');
  } catch (e) {
    log('Could not touch restart.txt: ' + e.message);
  }
}

run();
