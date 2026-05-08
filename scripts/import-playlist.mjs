import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const args = process.argv.slice(2);
const flagsWithValues = new Set([
  '--service-text-id',
  '--language',
  '--out-dir',
  '--model',
  '--limit',
  '--start-index'
]);
const booleanFlags = new Set([
  '--download-audio',
  '--transcribe',
  '--force',
  '--skip-promote',
  '--dry-run',
  '--help',
  '-h'
]);
const options = {};
const positionals = [];

for (let index = 0; index < args.length; index += 1) {
  const arg = args[index];
  if (flagsWithValues.has(arg)) {
    const value = args[index + 1];
    if (!value || value.startsWith('--')) {
      throw new Error(`${arg} requires a value.`);
    }
    options[arg] = value;
    index += 1;
  } else if (booleanFlags.has(arg)) {
    options[arg] = true;
  } else if (arg.startsWith('--')) {
    throw new Error(`Unknown option: ${arg}`);
  } else {
    positionals.push(arg);
  }
}

function usage() {
  console.error(`Usage: node scripts/import-playlist.mjs <playlist-id-or-url> --service-text-id <id> [options]

Options:
  --language <code>        Caption/ASR language. Default: ar
  --out-dir <path>         Directory for temporary import folders. Default: .recording-cache/imports
  --download-audio         Download each video's local M4A after writing manifests
  --transcribe             Run faster-whisper after importing. Implies --download-audio
  --model <name>           faster-whisper model for --transcribe. Default: small
  --limit <count>          Process only the first N playlist entries
  --start-index <number>   Start with this 1-based playlist index
  --force                  Overwrite existing manifest.json files
  --skip-promote           Do not update src/data/media after --transcribe
  --dry-run                Print the planned work without writing or running imports`);
}

function getFlag(name) {
  return options[name] ?? null;
}

function hasFlag(name) {
  return options[name] === true;
}

const playlistInput = positionals[0];
const serviceTextId = getFlag('--service-text-id');
const language = getFlag('--language') || 'ar';
const outDir = resolve(getFlag('--out-dir') || '.recording-cache/imports');
const shouldTranscribe = hasFlag('--transcribe');
const shouldDownloadAudio = hasFlag('--download-audio') || shouldTranscribe;
const model = getFlag('--model') || 'small';
const limit = getFlag('--limit') ? Number.parseInt(getFlag('--limit'), 10) : null;
const startIndex = getFlag('--start-index') ? Number.parseInt(getFlag('--start-index'), 10) : 1;
const shouldForce = hasFlag('--force');
const shouldPromote = shouldTranscribe && !hasFlag('--skip-promote');
const isDryRun = hasFlag('--dry-run');

if (hasFlag('--help') || hasFlag('-h')) {
  usage();
  process.exit(0);
}

if (!playlistInput || !serviceTextId) {
  usage();
  process.exit(1);
}
if (positionals.length > 1) {
  throw new Error(`Expected one playlist id or URL, got: ${positionals.join(', ')}`);
}

if (limit !== null && (!Number.isInteger(limit) || limit < 1)) {
  throw new Error('--limit must be a positive integer.');
}
if (!Number.isInteger(startIndex) || startIndex < 1) {
  throw new Error('--start-index must be a positive integer.');
}

function run(command, commandArgs, options = {}) {
  const result = spawnSync(command, commandArgs, {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    ...options
  });

  if (result.error?.code === 'ENOENT') {
    throw new Error(`Missing required command: ${command}`);
  }
  if (result.status !== 0) {
    throw new Error(result.stderr || `${command} exited with status ${result.status}`);
  }
  return result.stdout;
}

function writeJson(path, value) {
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`);
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function normalizePlaylistUrl(input) {
  if (/^https?:\/\//.test(input)) return input;
  return `https://www.youtube.com/playlist?list=${input}`;
}

function playlistIdFrom(input, playlist) {
  if (playlist.id) return playlist.id;
  if (!/^https?:\/\//.test(input)) return input;
  const url = new URL(input);
  return url.searchParams.get('list') || input;
}

function getPlaylistMetadata(input) {
  const output = run('yt-dlp', [
    '--dump-single-json',
    '--flat-playlist',
    normalizePlaylistUrl(input)
  ]);
  return JSON.parse(output);
}

function videoUrlFor(entry, playlistId) {
  const videoId = videoIdFor(entry);
  if (!videoId) {
    throw new Error(`Playlist entry is missing a video id: ${JSON.stringify(entry)}`);
  }
  const url = new URL('https://www.youtube.com/watch');
  url.searchParams.set('v', videoId);
  if (playlistId) url.searchParams.set('list', playlistId);
  return url.toString();
}

function videoIdFor(entry) {
  const candidate = entry.id || entry.url;
  if (!candidate || !/^https?:\/\//.test(candidate)) return candidate;
  const url = new URL(candidate);
  return url.searchParams.get('v') || url.pathname.split('/').filter(Boolean).at(-1);
}

function folderNameFor(entry) {
  const videoId = videoIdFor(entry);
  const titleSlug = entry.title ? slugify(entry.title).slice(0, 48) : '';
  return slugify([titleSlug, videoId].filter(Boolean).join('-')) || `video-${Date.now()}`;
}

function runImport(manifestPath) {
  const importArgs = ['scripts/import-recording.mjs', manifestPath];
  if (shouldDownloadAudio) importArgs.push('--download-audio');
  run(process.execPath, importArgs, { stdio: 'inherit' });
}

function runTranscribe(generatedRecordingPath) {
  run(process.execPath, [
    'scripts/transcribe-recording.mjs',
    generatedRecordingPath,
    '--model',
    model
  ], { stdio: 'inherit' });
}

function runPromote() {
  run(process.execPath, ['scripts/promote-recording-imports.mjs', outDir], { stdio: 'inherit' });
}

const playlist = getPlaylistMetadata(playlistInput);
const playlistId = playlistIdFrom(playlistInput, playlist);
const playlistTitle = playlist.title || null;
const entries = (playlist.entries || [])
  .map((entry, index) => ({
    ...entry,
    playlist_index: entry.playlist_index || index + 1
  }))
  .filter(entry => entry.playlist_index >= startIndex)
  .slice(0, limit ?? undefined);

if (entries.length === 0) {
  throw new Error('No playlist entries matched the requested range.');
}

const planned = entries.map((entry, index) => {
  const playlistIndex = entry.playlist_index || startIndex + index;
  const dir = resolve(outDir, folderNameFor(entry));
  const manifestPath = resolve(dir, 'manifest.json');
  return {
    entry,
    playlistIndex,
    dir,
    manifestPath,
    manifest: {
      youtube_url: videoUrlFor(entry, playlistId),
      service_text_id: serviceTextId,
      language,
      playlist: {
        id: playlistId,
        title: playlistTitle,
        index: playlistIndex
      }
    }
  };
});

console.log(`Playlist: ${playlistTitle || playlistId}`);
console.log(`Videos: ${planned.length}`);
console.log(`Output: ${outDir}`);
console.log(`Actions: write manifests${shouldDownloadAudio ? ', download M4A' : ''}${shouldTranscribe ? ', transcribe ASR' : ''}${shouldPromote ? ', promote runtime data' : ''}`);

for (const item of planned) {
  const relativeManifestPath = item.manifestPath.replace(`${process.cwd()}/`, '');
  console.log(`${item.playlistIndex}. ${item.entry.title || item.entry.id} -> ${relativeManifestPath}`);

  if (isDryRun) continue;
  if (existsSync(item.manifestPath) && !shouldForce) {
    console.log(`  skipping existing manifest; pass --force to overwrite`);
  } else {
    mkdirSync(dirname(item.manifestPath), { recursive: true });
    writeJson(item.manifestPath, item.manifest);
  }

  runImport(item.manifestPath);

  if (shouldTranscribe) {
    const generatedRecordingPath = resolve(item.dir, 'recording.generated.json');
    runTranscribe(generatedRecordingPath);
  }
}

if (!isDryRun && shouldPromote) {
  runPromote();
}
