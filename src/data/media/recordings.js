// First-class recording source definitions.
// Recordings are reusable media sources that activities and alignments can reference.

export const recordingDefinitions = [
  {
    "id": "recording-oLdHO28NWuM",
    "title": "قدوس الله",
    "service_text_id": "paraklesis-st-marina",
    "youtube": {
      "video_id": "oLdHO28NWuM",
      "url": "https://www.youtube.com/watch?v=oLdHO28NWuM"
    },
    "audio": {
      "format": "m4a",
      "source_file_name": "recording-oLdHO28NWuM.m4a"
    },
    "captions": {
      "language": "ar",
      "format": "json",
      "source_file_name": "recording-oLdHO28NWuM.asr.json",
      "kind": "asr-word-timestamps",
      "engine": "faster-whisper",
      "model": "medium"
    }
  },
  {
    "id": "recording-g_4r4wzt2Vg",
    "title": "قدُّوس الله... أَنِر عَينَيَّ",
    "service_text_id": "great-compline",
    "youtube": {
      "video_id": "g_4r4wzt2Vg",
      "url": "https://www.youtube.com/watch?v=g_4r4wzt2Vg"
    },
    "audio": {
      "format": "m4a",
      "source_file_name": "recording-g_4r4wzt2Vg.m4a"
    },
    "captions": {
      "language": "ar",
      "format": "json",
      "source_file_name": "recording-g_4r4wzt2Vg.asr.json",
      "kind": "asr-word-timestamps",
      "engine": "faster-whisper",
      "model": "medium"
    }
  }
];

const recordings = Object.fromEntries(
  recordingDefinitions.map(recording => [recording.id, recording])
);

export default recordings;
