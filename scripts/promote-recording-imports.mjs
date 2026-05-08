import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, dirname, join, relative, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const inboxRoot = resolve(process.argv[2] || '.recording-cache/imports');
const recordingsOutputPath = resolve('src/data/media/recordings.js');
const captionTracksOutputPath = resolve('src/data/media/captionTracks.js');
const existingRecordingDefinitions = await loadExistingRecordingDefinitions();
const existingCaptionTracks = await loadExistingCaptionTracks();

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

function writeJsModule(path, header, constName, value, exportStatement) {
  const body = JSON.stringify(value, null, 2);
  writeFileSync(path, `${header}\n\nconst ${constName} = ${body};\n\n${exportStatement}\n`);
}

function getInboxDirs(root) {
  if (!existsSync(root)) return [];
  return readdirSync(root, { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .map(entry => join(root, entry.name))
    .sort((first, second) => first.localeCompare(second));
}

async function loadExistingRecordingDefinitions() {
  try {
    const module = await import(`${pathToFileURL(recordingsOutputPath).href}?t=${Date.now()}`);
    return module.recordingDefinitions || [];
  } catch {
    return [];
  }
}

async function loadExistingCaptionTracks() {
  try {
    const module = await import(`${pathToFileURL(captionTracksOutputPath).href}?t=${Date.now()}`);
    return module.default || {};
  } catch {
    return {};
  }
}

function getRecordingSortKey(recording, dir = '') {
  const service = recording.service_text_id || '';
  const playlist = recording.youtube?.playlist_id || '';
  const playlistIndex = recording.youtube?.playlist_index ?? 9999;
  return [
    service,
    playlist,
    String(playlistIndex).padStart(5, '0'),
    basename(dir),
    recording.id
  ].join('\u001f');
}

const promoted = [];

for (const dir of getInboxDirs(inboxRoot)) {
  const generatedPath = join(dir, 'recording.generated.json');
  let recording;
  try {
    recording = readJson(generatedPath);
  } catch {
    continue;
  }

  const asrPath = recording.captions?.local_path
    ? resolve(recording.captions.local_path)
    : join(dir, recording.captions?.source_file_name || `${recording.id}.asr.json`);

  let asr = null;
  try {
    asr = readJson(asrPath);
  } catch {
    // Recordings can still be promoted without caption tracks.
  }

  promoted.push({ dir, recording, asr });
}

promoted.sort((first, second) => (
  getRecordingSortKey(first.recording, first.dir).localeCompare(getRecordingSortKey(second.recording, second.dir))
));

const promotedRecordingDefinitions = promoted.map(({ recording }) => {
  const definition = {
    id: recording.id,
    title: recording.title,
    service_text_id: recording.service_text_id,
    language: recording.language || 'ar',
    youtube: {
      video_id: recording.youtube?.video_id,
      url: recording.youtube?.url
    },
    audio: {
      format: recording.audio?.format || 'm4a',
      source_file_name: recording.audio?.source_file_name
    }
  };

  if (recording.youtube?.playlist_id) {
    definition.youtube.playlist_id = recording.youtube.playlist_id;
    definition.youtube.playlist_title = recording.youtube.playlist_title;
    definition.youtube.playlist_index = recording.youtube.playlist_index;
  }
  if (recording.youtube?.channel) {
    definition.youtube.channel = recording.youtube.channel;
  }
  if (recording.youtube?.duration_seconds) {
    definition.youtube.duration_seconds = recording.youtube.duration_seconds;
  }
  if (recording.youtube?.upload_date) {
    definition.youtube.upload_date = recording.youtube.upload_date;
  }
  if (recording.captions?.source_file_name) {
    definition.captions = {
      language: recording.captions.language || recording.language || 'ar',
      format: recording.captions.format || 'json',
      source_file_name: recording.captions.source_file_name,
      kind: recording.captions.kind || 'asr-word-timestamps',
      engine: recording.captions.engine || 'faster-whisper',
      model: recording.captions.model
    };
  }

  return definition;
});

const recordingDefinitionsById = new Map(
  existingRecordingDefinitions.map(recording => [recording.id, recording])
);
promotedRecordingDefinitions.forEach(recording => {
  recordingDefinitionsById.set(recording.id, recording);
});
const recordingDefinitions = [...recordingDefinitionsById.values()]
  .sort((first, second) => getRecordingSortKey(first).localeCompare(getRecordingSortKey(second)));

const captionTracks = { ...existingCaptionTracks };

for (const { recording, asr } of promoted) {
  if (Array.isArray(asr?.words)) {
    captionTracks[recording.id] = {
      recording_id: recording.id,
      video_id: recording.youtube?.video_id,
      source: [asr.engine || 'faster-whisper', asr.model].filter(Boolean).join('-'),
      language: asr.language || recording.language || 'ar',
      duration_seconds: asr.duration_seconds || recording.youtube?.duration_seconds || null,
      words: asr.words.map(word => ({
        text: word.text,
        start: word.start,
        end: word.end
      }))
    };
    continue;
  }

  if (existingCaptionTracks[recording.id]) {
    captionTracks[recording.id] = existingCaptionTracks[recording.id];
  }
}

writeJsModule(
  recordingsOutputPath,
  '// First-class recording source definitions.\n// Recordings are reusable media sources that activities and alignments can reference.',
  'recordingDefinitions',
  recordingDefinitions,
  'const recordings = Object.fromEntries(\n  recordingDefinitions.map(recording => [recording.id, recording])\n);\n\nexport { recordingDefinitions };\nexport default recordings;'
);

writeJsModule(
  captionTracksOutputPath,
  '// Curated caption timing data promoted from local recording imports.\n// Raw ASR segment/probability data stays in the local recording cache, not in runtime data.',
  'captionTracks',
  captionTracks,
  'export default captionTracks;'
);

console.log(JSON.stringify({
  inbox_root: relative(process.cwd(), inboxRoot),
  promoted_recordings: promotedRecordingDefinitions.length,
  recordings: recordingDefinitions.length,
  caption_tracks: Object.keys(captionTracks).length,
  wrote: [
    relative(process.cwd(), recordingsOutputPath),
    relative(process.cwd(), captionTracksOutputPath)
  ]
}, null, 2));
