# Data Architecture

The app is built around reusable liturgical text plus recording alignments.

## Core Data Types

```txt
src/data/texts/phrases.js
  Reusable Arabic text units with translation, literal meaning, and tags.

src/data/texts/segments.js
  Contextual arrangements of phrases and punctuation.

src/data/texts/serviceTexts.js
  Ordered service structures made from segment ids.

src/data/media/recordings.js
  Media source metadata, usually YouTube-hosted audio/video.

src/data/media/alignments.js
  Curated mappings from service text segments to seconds in a recording.

src/data/course/exercises.js
  Pedagogical passage selections over segment ids, with optional media.

src/data/course/lessons.js
  Pedagogical ordering and activity-mode choices for the course.
```

## Important Relationships

A phrase does not directly own audio. A phrase appears inside a segment, a segment appears inside a service text, and a recording alignment maps that segment occurrence to a media time range.

```txt
phrase_id
-> segment_id
-> service_text_id
-> recording_id + alignment_id
-> start/end seconds
```

This lets the same phrase appear in many services and many recordings without duplicating phrase data.

## Runtime Audio And Caption Flow

Exercises choose what to practice:

```js
{
  id: "glory-both-now-beginner",
  segment_ids: ["course-glory-beginner", "course-both-now-beginner"],
  media: {
    recording_id: "recording-g_4r4wzt2Vg",
    alignment_id: "alignment-great-compline-g_4r4wzt2Vg-v1"
  }
}
```

Alignments provide the actual timings:

```js
{
  segment_ids: ["course-glory-beginner", "course-both-now-beginner"],
  start_seconds: 15.42,
  end_seconds: 23.095,
  phrase_timings: [
    {
      phrase_id: "glory-001",
      start_seconds: 15.42,
      end_seconds: 16.1
    }
  ]
}
```

The player uses `recording_id` to find the hosted YouTube source, then uses `start_seconds` and `end_seconds` for audio. Read & Listen and Phrase Captions use `phrase_timings` for synchronized text display.

Alignment timings should be refined against the cached audio waveform before they become first-class data. ASR/CC timings locate the text, but the committed `start_seconds` and `end_seconds` represent the musical/textual boundary heard in the recording.

## Generated And Curated Data

Commit:

- service text definitions
- phrase/segment/exercise/lesson data
- recording manifests
- curated alignments

Do not commit:

- downloaded M4A/MP4/WebM media
- local cache directories
- `recording.generated.json` files with absolute local paths

See [Recording Import](recording-import.md) for the importer workflow.
