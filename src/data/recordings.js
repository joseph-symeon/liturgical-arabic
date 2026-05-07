// First-class recording source definitions.
// Recordings are reusable media sources that activities and alignments can reference.

export const recordingDefinitions = [
  {
    "id": "recording-more-honorable-cyFH8CZASSk",
    "title": "More Honorable Recording",
    "youtube": {
      "video_id": "cyFH8CZASSk",
      "url": "https://www.youtube.com/watch?v=cyFH8CZASSk"
    },
    "audio": {
      "format": "m4a",
      "source_file_name": "YTDown_YouTube_More-honorable_Media_cyFH8CZASSk_005_48k.m4a"
    },
    "captions": {
      "language": "ar",
      "format": "vtt",
      "source_file_name": "captions.vtt",
      "kind": "youtube-captions"
    }
  }
];

const recordings = Object.fromEntries(
  recordingDefinitions.map(recording => [recording.id, recording])
);

export default recordings;
