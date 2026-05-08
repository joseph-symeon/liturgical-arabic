# Recording Import

The recording importer turns a small YouTube manifest into local processing files for audio alignment.

Minimum manifest:

```json
{
  "youtube_url": "https://www.youtube.com/watch?v=KJKt0V4zJjY",
  "service_text_id": "divine-liturgy-john-chrysostom"
}
```

Run a dependency check before importing:

```bash
npm run import:recording:check
```

## Required Local Tools

Install with Homebrew on macOS:

```bash
brew install yt-dlp ffmpeg
```

`yt-dlp` is used to fetch YouTube metadata and download M4A audio for local processing.

`ffmpeg` is used to decode audio windows when refining timestamp boundaries.

## ASR Tooling

The importer uses `faster-whisper` for Arabic ASR word timestamps. Keep it in the ignored local cache virtualenv:

```bash
python3.12 -m venv .recording-cache/asr-venv
.recording-cache/asr-venv/bin/python -m pip install faster-whisper
```

Plain VTT captions can help, but word-level timing data is better for reliable phrase matching.

## What Gets Committed

Commit:

- `manifest.json`
- `.asr.json` word timestamp output
- curated runtime data in `src/data/media/recordings.js`, `src/data/media/captionTracks.js`, and `src/data/media/alignments.js`

Do not commit:

- downloaded `.m4a`, `.mp4`, or `.webm`
- `.recording-cache/`
- `recording.generated.json`

For scale: the Great Compline test ASR JSON is about `164 KB`; its M4A is about `17 MB`. For a library of many recordings, ASR JSON is reasonable repo data, while audio should remain local and reproducible from YouTube.

## Local Media Cache

Downloaded media is processing input, not repo data. By default, audio is stored in:

```txt
.recording-cache/
```

That directory is ignored by git. The YouTube video remains the durable hosted media source; the local M4A exists only so the importer can refine timestamps.

You can override the cache location:

```bash
RECORDING_CACHE_DIR=/path/to/local/cache npm run import:recording -- recordings/inbox/example/manifest.json --download-audio
```

Generated local processing output, such as `recording.generated.json`, is ignored by git because it may contain absolute local paths.

## Current Import Command

Fetch YouTube metadata only:

```bash
npm run import:recording -- recordings/inbox/example/manifest.json
```

Fetch metadata and download the local M4A:

```bash
npm run import:recording -- recordings/inbox/example/manifest.json --download-audio
```

Generate ASR word timestamps from the downloaded M4A:

```bash
npm run import:recording:transcribe -- recordings/inbox/example/recording.generated.json
```

Use a larger model when quality matters more than speed:

```bash
npm run import:recording:transcribe -- recordings/inbox/example/recording.generated.json --model medium
```

The importer writes generated recording output and ASR output next to the manifest. Commit the manifest and `.asr.json`; do not commit `recording.generated.json` or downloaded media. Future steps will add fuller caption track import, segment matching, and alignment refinement.
