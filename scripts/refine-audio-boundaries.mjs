import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const SAMPLE_RATE = 16000;
const FRAME_SECONDS = 0.05;
const HOP_SECONDS = 0.025;
const FRAME_SAMPLES = Math.round(SAMPLE_RATE * FRAME_SECONDS);
const HOP_SAMPLES = Math.round(SAMPLE_RATE * HOP_SECONDS);

const args = process.argv.slice(2);

function usage() {
  console.log(`Usage:
  node scripts/refine-audio-boundaries.mjs --recording-id <id> --start <seconds> --end <seconds> [options]
  node scripts/refine-audio-boundaries.mjs --audio <path> --start <seconds> --end <seconds> [options]

Options:
  --start-search <seconds>   Seconds to inspect before rough start. Default: 1.5
  --end-search <seconds>     Seconds to inspect after rough end. Default: 8
  --silence-db <db>          Quiet threshold for boundary detection. Default: -30
  --min-silence <seconds>    Minimum quiet run duration. Default: 0.25
  --text-start <seconds>     Text/ASR transition fallback for connected phrase starts
  --text-end <seconds>       Text/ASR transition fallback for connected phrase ends
  --preroll <seconds>        Preroll before text-start fallback. Default: 0
  --json                     Print only JSON output`);
}

function getFlag(name) {
  const index = args.indexOf(name);
  if (index < 0) return null;
  return args[index + 1] || null;
}

function hasFlag(name) {
  return args.includes(name);
}

if (hasFlag('--help') || hasFlag('-h')) {
  usage();
  process.exit(0);
}

const recordingId = getFlag('--recording-id');
const audioPath = resolve(getFlag('--audio') || (recordingId
  ? `.recording-cache/${recordingId}/${recordingId}.m4a`
  : ''));
const roughStart = Number.parseFloat(getFlag('--start'));
const roughEnd = Number.parseFloat(getFlag('--end'));
const startSearchSeconds = Number.parseFloat(getFlag('--start-search') || '1.5');
const endSearchSeconds = Number.parseFloat(getFlag('--end-search') || '8');
const silenceDb = Number.parseFloat(getFlag('--silence-db') || '-30');
const minSilenceSeconds = Number.parseFloat(getFlag('--min-silence') || '0.25');
const textStart = getFlag('--text-start') === null ? null : Number.parseFloat(getFlag('--text-start'));
const textEnd = getFlag('--text-end') === null ? null : Number.parseFloat(getFlag('--text-end'));
const fallbackPreroll = Number.parseFloat(getFlag('--preroll') || '0');
const shouldPrintJsonOnly = hasFlag('--json');

if (!audioPath || !Number.isFinite(roughStart) || !Number.isFinite(roughEnd)) {
  usage();
  process.exit(1);
}
if (!existsSync(audioPath)) {
  throw new Error(`Audio file does not exist: ${audioPath}`);
}
if (roughEnd <= roughStart) {
  throw new Error('--end must be greater than --start.');
}

function roundSeconds(value) {
  return Math.round(value * 1000) / 1000;
}

function decodeAudioWindow(path, startSeconds, endSeconds) {
  const decodeStart = Math.max(0, startSeconds);
  const duration = endSeconds - decodeStart;
  const result = spawnSync('ffmpeg', [
    '-hide_banner',
    '-loglevel', 'error',
    '-ss', String(decodeStart),
    '-t', String(duration),
    '-i', path,
    '-ac', '1',
    '-ar', String(SAMPLE_RATE),
    '-f', 's16le',
    'pipe:1'
  ], { encoding: 'buffer' });

  if (result.status !== 0) {
    throw new Error(result.stderr.toString() || 'ffmpeg failed to decode audio.');
  }

  return {
    baseSeconds: decodeStart,
    buffer: result.stdout
  };
}

function getSample(buffer, sampleIndex) {
  const byteIndex = sampleIndex * 2;
  if (byteIndex + 1 >= buffer.length) return 0;
  return buffer.readInt16LE(byteIndex) / 32768;
}

function getFrames(buffer, baseSeconds) {
  const sampleCount = Math.floor(buffer.length / 2);
  const frames = [];

  for (let startSample = 0; startSample + FRAME_SAMPLES <= sampleCount; startSample += HOP_SAMPLES) {
    let sumSquares = 0;
    let peak = 0;
    for (let offset = 0; offset < FRAME_SAMPLES; offset += 1) {
      const sample = getSample(buffer, startSample + offset);
      sumSquares += sample * sample;
      peak = Math.max(peak, Math.abs(sample));
    }
    const rms = Math.sqrt(sumSquares / FRAME_SAMPLES);
    frames.push({
      time: baseSeconds + startSample / SAMPLE_RATE,
      db: 20 * Math.log10(rms + 1e-8),
      peak
    });
  }

  return smoothFrames(frames);
}

function smoothFrames(frames) {
  const radius = 2;
  return frames.map((frame, index) => {
    const start = Math.max(0, index - radius);
    const end = Math.min(frames.length, index + radius + 1);
    const window = frames.slice(start, end);
    return {
      ...frame,
      smoothedDb: window.reduce((sum, item) => sum + item.db, 0) / window.length
    };
  });
}

function getQuietRuns(frames) {
  const runs = [];
  let runStart = null;
  let runEnd = null;

  for (const frame of frames) {
    if (frame.smoothedDb < silenceDb) {
      if (runStart === null) runStart = frame.time;
      runEnd = frame.time + HOP_SECONDS;
      continue;
    }

    if (runStart !== null && runEnd - runStart >= minSilenceSeconds) {
      runs.push({ start: runStart, end: runEnd });
    }
    runStart = null;
    runEnd = null;
  }

  if (runStart !== null && runEnd - runStart >= minSilenceSeconds) {
    runs.push({ start: runStart, end: runEnd });
  }

  return runs;
}

function getMaxDb(frames, start, end) {
  const window = frames.filter(frame => frame.time >= start && frame.time < end);
  if (window.length === 0) return null;
  return Math.max(...window.map(frame => frame.smoothedDb));
}

function refineBoundaries() {
  const decodeStart = Math.max(0, roughStart - startSearchSeconds);
  const decodeEnd = roughEnd + endSearchSeconds;
  const { baseSeconds, buffer } = decodeAudioWindow(audioPath, decodeStart, decodeEnd);
  const frames = getFrames(buffer, baseSeconds);
  const quietRuns = getQuietRuns(frames);

  const startRun = quietRuns
    .filter(run => run.end <= roughStart + 0.5)
    .sort((first, second) => second.end - first.end)[0];
  const endRun = quietRuns
    .filter(run => run.start >= roughEnd - 0.5)
    .sort((first, second) => first.start - second.start)[0];

  const startFallback = Number.isFinite(textStart)
    ? Math.max(0, textStart - fallbackPreroll)
    : roughStart;
  const endFallback = Number.isFinite(textEnd) ? textEnd : roughEnd;
  const refinedStart = startRun?.end ?? startFallback;
  const refinedEnd = endRun?.start ?? endFallback;

  return {
    audio_path: audioPath,
    recording_id: recordingId || null,
    rough: {
      start_seconds: roughStart,
      end_seconds: roughEnd
    },
    refined: {
      start_seconds: roundSeconds(refinedStart),
      end_seconds: roundSeconds(refinedEnd)
    },
    analysis: {
      method: 'waveform-rms-quiet-run',
      start_boundary_source: startRun ? 'waveform-quiet-run' : Number.isFinite(textStart) ? 'text-transition-fallback' : 'rough-start-fallback',
      end_boundary_source: endRun ? 'waveform-quiet-run' : Number.isFinite(textEnd) ? 'text-transition-fallback' : 'rough-end-fallback',
      sample_rate: SAMPLE_RATE,
      frame_seconds: FRAME_SECONDS,
      hop_seconds: HOP_SECONDS,
      silence_db: silenceDb,
      min_silence_seconds: minSilenceSeconds,
      quiet_runs: quietRuns.map(run => ({
        start_seconds: roundSeconds(run.start),
        end_seconds: roundSeconds(run.end)
      })),
      rough_start_max_db: roundSeconds(getMaxDb(frames, roughStart - 0.5, roughStart + 0.5) ?? 0),
      rough_end_max_db: roundSeconds(getMaxDb(frames, roughEnd - 0.5, roughEnd + 0.5) ?? 0),
      refined_end_following_max_db: roundSeconds(getMaxDb(frames, refinedEnd, refinedEnd + 0.5) ?? 0)
    }
  };
}

const result = refineBoundaries();

if (shouldPrintJsonOnly) {
  console.log(JSON.stringify(result, null, 2));
} else {
  console.log(`Audio: ${result.audio_path}`);
  console.log(`Rough:   ${result.rough.start_seconds} -> ${result.rough.end_seconds}`);
  console.log(`Refined: ${result.refined.start_seconds} -> ${result.refined.end_seconds}`);
  console.log(JSON.stringify(result.analysis, null, 2));
}
