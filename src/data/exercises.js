import segments from './segments.js';

export const exerciseDefinitions = [
  {
    "id": "antiphon-only-begotten",
    "segment_ids": [
      "antiphon-word-of-god-only-begotten",
      "antiphon-deathless"
    ],
    "title": "Only-begotten Son and Word of God",
    "title_phrase": "title-only-begotten-son-word-of-god",
    "audio_clip": {
      "video_id": "-dufaXx7Hm0",
      "start_seconds": 150.75,
      "end_seconds": 162,
      "default_playback_rate": 1
    }
  },
  {
    "id": "antiphon-accepted-incarnate",
    "segment_ids": [
      "antiphon-accepted-incarnate",
      "antiphon-from-theotokos"
    ],
    "title": "You accepted to become incarnate",
    "audio_clip": {
      "video_id": "-dufaXx7Hm0",
      "start_seconds": 151,
      "end_seconds": 180.5,
      "default_playback_rate": 1
    }
  },
  {
    "id": "antiphon-became-man",
    "segment_ids": [
      "antiphon-became-man",
      "antiphon-crucified"
    ],
    "audio_clip": {
      "video_id": "-dufaXx7Hm0",
      "start_seconds": 151,
      "end_seconds": 180.5,
      "default_playback_rate": 1
    }
  },
  {
    "id": "antiphon-trampled-death",
    "segment_ids": [
      "antiphon-trampled-death",
      "antiphon-one-of-trinity"
    ],
    "audio_clip": {
      "video_id": "-dufaXx7Hm0",
      "start_seconds": 151,
      "end_seconds": 180.5,
      "default_playback_rate": 1
    }
  },
  {
    "id": "antiphon-glorified-with-father",
    "segment_ids": [
      "antiphon-glorified-with-father",
      "antiphon-save-us"
    ],
    "audio_clip": {
      "video_id": "-dufaXx7Hm0",
      "start_seconds": 151,
      "end_seconds": 180.5,
      "default_playback_rate": 1
    }
  },
  {
    "id": "litany-of-peace",
    "segment_ids": [
      "litany-peace-in-peace",
      "litany-peace-let-us-pray",
      "litany-peace-from-above",
      "litany-peace-whole-world",
      "litany-peace-holy-house",
      "litany-peace-help-save",
      "litany-peace-lord-have-mercy-all"
    ],
    "audio_clip": {
      "video_id": "KJKt0V4zJjY",
      "start_seconds": 92.75,
      "end_seconds": 160,
      "default_playback_rate": 1
    }
  }
];

export function resolveExercise(definition, segmentsMap = segments) {
  const selectedSegments = definition.segment_ids
    .map(segmentId => segmentsMap[segmentId])
    .filter(Boolean);

  const lines = selectedSegments
    .map((segment, index) => ({
      ...segment,
      segment_id: definition.segment_ids[index],
      line_order: index + 1,
      phrases: segment.phrases.map(part => ({ ...part }))
    }));

  return {
    ...definition,
    lines
  };
}

const exercises = Object.fromEntries(
  exerciseDefinitions.map(definition => [definition.id, resolveExercise(definition)])
);

export default exercises;
