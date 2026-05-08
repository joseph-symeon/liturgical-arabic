import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const generatedRecordingPath = process.argv[2];
const modelArgIndex = process.argv.indexOf('--model');
const model = modelArgIndex >= 0 ? process.argv[modelArgIndex + 1] : 'small';
const shouldPromote = !process.argv.includes('--skip-promote');

if (!generatedRecordingPath) {
  console.error('Usage: node scripts/transcribe-recording.mjs .recording-cache/imports/<slug>/recording.generated.json [--model small] [--skip-promote]');
  process.exit(1);
}

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

function run(command, args) {
  const result = spawnSync(command, args, {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe']
  });

  if (result.error?.code === 'ENOENT') {
    throw new Error(`Missing required command: ${command}`);
  }
  if (result.status !== 0) {
    throw new Error(result.stderr || `${command} exited with status ${result.status}`);
  }
  return result.stdout;
}

const absoluteGeneratedPath = resolve(generatedRecordingPath);
const generatedDir = dirname(absoluteGeneratedPath);
const recording = readJson(absoluteGeneratedPath);
const audioPath = recording.audio?.local_path;

if (!audioPath) {
  throw new Error('Generated recording must define audio.local_path. Run import:recording with --download-audio first.');
}
if (!existsSync(audioPath)) {
  throw new Error(`Audio file does not exist: ${audioPath}`);
}

const pythonPath = resolve('.recording-cache/asr-venv/bin/python');
if (!existsSync(pythonPath)) {
  throw new Error('Missing ASR virtualenv. Create it with python3.12 -m venv .recording-cache/asr-venv and install faster-whisper.');
}

const outputPath = resolve(generatedDir, `${recording.id}.asr.json`);
const scriptPath = resolve('scripts/transcribe_recording_faster_whisper.py');

const stdout = run(pythonPath, [
  scriptPath,
  '--audio', audioPath,
  '--output', outputPath,
  '--model', model,
  '--language', recording.language || 'ar'
]);

const updatedRecording = {
  ...recording,
  captions: {
    ...(recording.captions || {}),
    language: recording.language || recording.captions?.language || 'ar',
    format: 'json',
    source_file_name: `${recording.id}.asr.json`,
    local_path: outputPath,
    kind: 'asr-word-timestamps',
    engine: 'faster-whisper',
    model
  },
  processing: {
    ...(recording.processing || {}),
    asr: 'faster-whisper'
  }
};

writeFileSync(absoluteGeneratedPath, `${JSON.stringify(updatedRecording, null, 2)}\n`);

console.log(stdout.trim());
console.log(JSON.stringify({
  updated_recording: absoluteGeneratedPath,
  captions: updatedRecording.captions
}, null, 2));

if (shouldPromote) {
  const promoteRoot = dirname(generatedDir);
  const result = spawnSync(process.execPath, ['scripts/promote-recording-imports.mjs', promoteRoot], {
    stdio: 'inherit'
  });
  if (result.error?.code === 'ENOENT') {
    throw new Error(`Missing required command: ${process.execPath}`);
  }
  if (result.status !== 0) {
    throw new Error(`promote-recording-imports exited with status ${result.status}`);
  }
}
