import { spawnSync } from 'node:child_process';
import exercises from '../src/data/exercises.js';
import { exerciseDefinitions } from '../src/data/exercises.js';
import phrases from '../src/data/phrases.js';
import segments from '../src/data/segments.js';
import activities from '../src/data/activities.js';
import captionTracks from '../src/data/captionTracks.js';
import { findCaptionClipMatch } from '../src/utils/captionClips.js';

const AUDIO_PATH = process.argv[2];
const SAMPLE_RATE = 8000;
const FRAME_SECONDS = 0.02;
const FRAME_SAMPLES = Math.round(SAMPLE_RATE * FRAME_SECONDS);
const SEARCH_PAD_SECONDS = 0.05;
const START_LOOKBACK_SECONDS = 0.75;
const START_GUARD_SECONDS = 0.06;
const START_ONSET_PREROLL_SECONDS = 0.07;
const MIN_FINAL_WORD_SECONDS = 0.2;
const NEXT_PHRASE_GUARD_SECONDS = 0.35;

const POC_EXERCISE_IDS = [
  'caption-poc-glory-beginner',
  'caption-poc-both-now-beginner',
  'caption-poc-glory-both-now-beginner',
  'caption-poc-trisagion-hymn-core',
  'caption-poc-all-holy-trinity-address',
  'caption-poc-all-holy-trinity-lord',
  'caption-poc-all-holy-trinity-master',
  'caption-poc-all-holy-trinity-holy-one',
  'caption-poc-all-holy-trinity'
];

if (!AUDIO_PATH) {
  console.error('Usage: node scripts/refine-caption-poc-clips.mjs /path/to/audio.m4a');
  process.exit(1);
}

function decodeAudioWindow(audioPath, startSeconds, endSeconds) {
  const duration = endSeconds - startSeconds;
  const result = spawnSync('ffmpeg', [
    '-hide_banner',
    '-loglevel', 'error',
    '-ss', String(startSeconds),
    '-t', String(duration),
    '-i', audioPath,
    '-ac', '1',
    '-ar', String(SAMPLE_RATE),
    '-f', 's16le',
    'pipe:1'
  ], { encoding: 'buffer' });

  if (result.status !== 0) {
    throw new Error(result.stderr.toString() || 'ffmpeg failed to decode audio.');
  }

  return result.stdout;
}

function getFrameRms(buffer, frameStartByte) {
  const sampleCount = Math.min(FRAME_SAMPLES, (buffer.length - frameStartByte) / 2);
  if (sampleCount <= 0) return Infinity;

  let sumSquares = 0;
  for (let index = 0; index < sampleCount; index += 1) {
    const sample = buffer.readInt16LE(frameStartByte + index * 2) / 32768;
    sumSquares += sample * sample;
  }
  return Math.sqrt(sumSquares / sampleCount);
}

function getQuietestBoundary(audioPath, searchStart, searchEnd) {
  if (searchEnd <= searchStart) return searchEnd;

  const decodeStart = Math.max(0, searchStart - SEARCH_PAD_SECONDS);
  const decodeEnd = searchEnd + SEARCH_PAD_SECONDS;
  const pcm = decodeAudioWindow(audioPath, decodeStart, decodeEnd);
  const firstFrame = Math.max(0, Math.floor((searchStart - decodeStart) / FRAME_SECONDS));
  const lastFrame = Math.max(firstFrame, Math.floor((searchEnd - decodeStart) / FRAME_SECONDS));

  let bestFrame = firstFrame;
  let bestRms = Infinity;

  for (let frame = firstFrame; frame <= lastFrame; frame += 1) {
    const frameByte = frame * FRAME_SAMPLES * 2;
    const rms = getFrameRms(pcm, frameByte);
    if (rms < bestRms) {
      bestRms = rms;
      bestFrame = frame;
    }
  }

  return decodeStart + bestFrame * FRAME_SECONDS + FRAME_SECONDS / 2;
}

function getDefinition(id) {
  const definition = exerciseDefinitions.find(item => item.id === id);
  const activity = definition?.activity_id ? activities[definition.activity_id] : null;
  if (!activity) return definition;
  return {
    ...definition,
    segment_ids: activity.target.segment_ids,
    caption_clip: {
      recording_id: activity.media.recording_id,
      alignment_id: activity.media.alignment_id,
      default_playback_rate: activity.media.default_playback_rate
    }
  };
}

function refineExercise(id) {
  const definition = getDefinition(id);
  const match = findCaptionClipMatch(definition, phrases, segments, captionTracks);
  if (!definition || !match) return null;

  const { captionWords, matchStart, matchEnd } = match;
  const finalWord = captionWords[matchEnd];
  const firstWord = captionWords[matchStart];
  const nextWord = captionWords[matchEnd + 1];
  const currentClip = exercises[id].audio_clip;
  const startSearchStart = Math.max(0, firstWord.start - START_LOOKBACK_SECONDS);
  const startSearchEnd = Math.max(startSearchStart, firstWord.start - START_GUARD_SECONDS);
  const quietStartBoundary = getQuietestBoundary(AUDIO_PATH, startSearchStart, startSearchEnd);
  const pinnedStart = Math.max(0, quietStartBoundary - START_ONSET_PREROLL_SECONDS);
  const searchStart = Math.max(finalWord.start + MIN_FINAL_WORD_SECONDS, finalWord.end - 0.6);
  const searchEnd = nextWord ? nextWord.start - NEXT_PHRASE_GUARD_SECONDS : finalWord.end;
  const pinnedEnd = getQuietestBoundary(AUDIO_PATH, searchStart, searchEnd);

  return {
    id,
    start_seconds: currentClip.start_seconds,
    pinned_start_seconds: Math.round(pinnedStart * 1000) / 1000,
    quiet_start_boundary_seconds: Math.round(quietStartBoundary * 1000) / 1000,
    caption_end_seconds: currentClip.end_seconds,
    pinned_end_seconds: Math.round(pinnedEnd * 1000) / 1000,
    start_search_start_seconds: Math.round(startSearchStart * 1000) / 1000,
    start_search_end_seconds: Math.round(startSearchEnd * 1000) / 1000,
    search_start_seconds: Math.round(searchStart * 1000) / 1000,
    search_end_seconds: Math.round(searchEnd * 1000) / 1000,
    first_word: firstWord.text,
    final_word: finalWord.text,
    next_word: nextWord?.text ?? null
  };
}

const refinements = POC_EXERCISE_IDS.map(refineExercise).filter(Boolean);

console.log(JSON.stringify(refinements, null, 2));
