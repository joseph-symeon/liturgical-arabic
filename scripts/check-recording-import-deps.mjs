import { spawnSync } from 'node:child_process';

const REQUIREMENTS = [
  {
    command: 'yt-dlp',
    purpose: 'Fetch YouTube metadata and download M4A audio for local processing.',
    macInstall: 'brew install yt-dlp',
    required: true
  },
  {
    command: 'ffmpeg',
    purpose: 'Decode audio windows for timing refinement.',
    macInstall: 'brew install ffmpeg',
    required: true
  },
  {
    command: '.recording-cache/asr-venv/bin/python',
    purpose: 'Run faster-whisper locally to generate Arabic ASR word timings.',
    macInstall: 'python3.12 -m venv .recording-cache/asr-venv && .recording-cache/asr-venv/bin/python -m pip install faster-whisper',
    required: false
  }
];

function commandExists(command) {
  if (command.includes('/')) {
    const result = spawnSync(command, ['-c', 'import faster_whisper; print("faster-whisper")'], { encoding: 'utf8' });
    return result.status === 0 ? command : null;
  }
  const result = spawnSync('which', [command], { encoding: 'utf8' });
  return result.status === 0 ? result.stdout.trim() : null;
}

const rows = REQUIREMENTS.map(requirement => ({
  ...requirement,
  path: commandExists(requirement.command)
}));

rows.forEach(row => {
  const status = row.path ? 'ok' : row.required ? 'missing' : 'optional missing';
  console.log(`${status}: ${row.command}${row.path ? ` (${row.path})` : ''}`);
  console.log(`  ${row.purpose}`);
  if (!row.path) {
    console.log(`  macOS install: ${row.macInstall}`);
  }
});

const missingRequired = rows.filter(row => row.required && !row.path);
if (missingRequired.length > 0) {
  console.error(`\nMissing required recording import dependencies: ${missingRequired.map(row => row.command).join(', ')}`);
  process.exit(1);
}

console.log('\nRecording import dependencies are ready.');
