import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const manifestPath = process.argv[2];
const shouldDownloadAudio = process.argv.includes('--download-audio');

if (!manifestPath) {
  console.error('Usage: node scripts/import-recording.mjs recordings/inbox/<slug>/manifest.json [--download-audio]');
  process.exit(1);
}

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    encoding: 'utf8',
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

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function getYoutubeMetadata(youtubeUrl) {
  const output = run('yt-dlp', [
    '--dump-single-json',
    '--no-playlist',
    youtubeUrl
  ]);
  return JSON.parse(output);
}

function downloadAudio(youtubeUrl, outputTemplate) {
  if (existsSync(outputTemplate)) {
    return;
  }
  run('yt-dlp', [
    '--no-playlist',
    '-x',
    '--audio-format',
    'm4a',
    '-o',
    outputTemplate,
    youtubeUrl
  ], { stdio: 'inherit' });
}

const absoluteManifestPath = resolve(manifestPath);
const manifestDir = dirname(absoluteManifestPath);
const manifest = readJson(absoluteManifestPath);

if (!manifest.youtube_url) {
  throw new Error('Manifest must define youtube_url.');
}
if (!manifest.service_text_id) {
  throw new Error('Manifest must define service_text_id.');
}

const metadata = getYoutubeMetadata(manifest.youtube_url);
const videoId = metadata.id;
const title = metadata.title;
const titleSlug = slugify(title);
const recordingId = manifest.id || (titleSlug ? `recording-${titleSlug}-${videoId}` : `recording-${videoId}`);
const audioFileName = `${recordingId}.m4a`;
const cacheRoot = process.env.RECORDING_CACHE_DIR
  ? resolve(process.env.RECORDING_CACHE_DIR)
  : resolve('.recording-cache');
const audioDir = resolve(cacheRoot, recordingId);
const audioPath = resolve(audioDir, audioFileName);
const derivedManifest = {
  id: recordingId,
  title,
  service_text_id: manifest.service_text_id,
  language: manifest.language || 'ar',
  youtube: {
    video_id: videoId,
    url: metadata.webpage_url || manifest.youtube_url,
    playlist_id: metadata.playlist_id || null,
    playlist_title: metadata.playlist_title || null,
    playlist_index: metadata.playlist_index || null,
    channel: metadata.channel || metadata.uploader || null,
    duration_seconds: metadata.duration || null,
    upload_date: metadata.upload_date || null
  },
  audio: {
    format: 'm4a',
    source_file_name: shouldDownloadAudio ? audioFileName : null,
    local_path: shouldDownloadAudio ? audioPath : null
  },
  captions: {
    language: manifest.language || 'ar',
    format: 'json',
    source_file_name: null,
    kind: 'asr-word-timestamps'
  },
  processing: {
    asr: 'pending',
    alignment_method: 'caption-match-audio-rms-refine'
  }
};

if (shouldDownloadAudio) {
  mkdirSync(audioDir, { recursive: true });
  downloadAudio(manifest.youtube_url, audioPath);
}

const outputPath = resolve(manifestDir, 'recording.generated.json');
writeFileSync(outputPath, `${JSON.stringify(derivedManifest, null, 2)}\n`);

console.log(JSON.stringify({
  wrote: outputPath,
  recording: derivedManifest
}, null, 2));
