# Recording Import

The recording importer turns a small YouTube manifest into local processing files for audio alignment, then promotes useful metadata/timings into curated app data.

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

- curated runtime data in `src/data/media/recordings.js` and `src/data/media/alignments.js`

Do not commit:

- temporary import manifests
- downloaded `.m4a`, `.mp4`, or `.webm`
- `.recording-cache/`
- `.asr.json` raw ASR output
- `recording.generated.json`

Raw manifests and ASR JSON are processing artifacts. Promote useful recording metadata into `src/data/media/recordings.js`; promote curated text/audio ranges into `src/data/media/alignments.js`; then leave raw import files ignored/local.

## Local Media Cache

Downloaded media is processing input, not repo data. By default, audio is stored in:

```txt
.recording-cache/
```

That directory is ignored by git. The YouTube video remains the durable hosted media source; the local M4A exists only so the importer can refine timestamps.

You can override the cache location:

```bash
RECORDING_CACHE_DIR=/path/to/local/cache npm run import:recording -- .recording-cache/imports/example/manifest.json --download-audio
```

Generated local processing output, such as import manifests, `recording.generated.json`, and raw `.asr.json`, lives under `.recording-cache/` by default and is ignored by git.

## Current Import Command

For a one-off video, create a temporary manifest under `.recording-cache/imports/<slug>/manifest.json`, then fetch YouTube metadata:

```bash
npm run import:recording -- .recording-cache/imports/example/manifest.json
```

Fetch metadata and download the local M4A:

```bash
npm run import:recording -- .recording-cache/imports/example/manifest.json --download-audio
```

Generate ASR word timestamps from the downloaded M4A and promote the result into first-class runtime data:

```bash
npm run import:recording:transcribe -- .recording-cache/imports/example/recording.generated.json
```

Use a larger model when quality matters more than speed:

```bash
npm run import:recording:transcribe -- .recording-cache/imports/example/recording.generated.json --model medium
```

You can also promote all local import folders manually:

```bash
npm run promote:recordings
```

The transcribe command runs `promote:recordings` after it succeeds. Use `--skip-promote` to leave runtime media data unchanged during experiments. The importer writes generated recording output and raw ASR output next to the temporary manifest. Commit promoted media data; do not commit raw manifests, `.asr.json`, `recording.generated.json`, or downloaded media. Future steps will add fuller segment matching and alignment refinement.

## Playlist Import

Use the playlist importer when every video in a YouTube playlist belongs to the same service text:

```bash
npm run import:playlist -- PLAYLIST_ID --service-text-id divine-liturgy-john-chrysostom
```

That command expands the playlist with `yt-dlp`, creates one `.recording-cache/imports/<video>/manifest.json` per video, and runs the normal single-recording metadata import for each manifest.

Download each video's local M4A as part of the batch:

```bash
npm run import:playlist -- PLAYLIST_ID --service-text-id divine-liturgy-john-chrysostom --download-audio
```

Download, generate ASR word timestamps, and promote runtime media data:

```bash
npm run import:playlist -- PLAYLIST_ID --service-text-id divine-liturgy-john-chrysostom --transcribe --model small
```

Useful range and safety options:

```bash
npm run import:playlist -- PLAYLIST_ID --service-text-id divine-liturgy-john-chrysostom --dry-run
npm run import:playlist -- PLAYLIST_ID --service-text-id divine-liturgy-john-chrysostom --start-index 5 --limit 3
npm run import:playlist -- PLAYLIST_ID --service-text-id divine-liturgy-john-chrysostom --force
```

`--transcribe` implies `--download-audio` and runs `promote:recordings` after the batch succeeds. Use `--skip-promote` to leave runtime media data unchanged during experiments. Existing manifests are preserved unless `--force` is passed. Playlist id, title, and index are copied into each generated recording so later curation can keep the source order.

## Alignment Boundary Rule

Waveform refinement is a standard part of alignment. ASR/CC word timings are rough anchors for finding the text in a recording. They should not be treated as authoritative clip boundaries.

When creating exercise clips or alignments:

- use ASR/CC to locate the matching phrase or segment
- inspect the cached audio waveform around the rough start and end
- choose the final `start_seconds` and `end_seconds` from the musical/textual boundary in the audio
- scan past the last ASR word when the chant continues through a final syllable, melisma, or fade
- when two phrases are connected with no quiet run, use the text/ASR transition boundary instead of forcing a waveform silence boundary
- for ordered contiguous clips, set the previous clip's `end_seconds` equal to the next clip's `start_seconds`
- store one final `end_seconds`; do not store a separate ASR/text end for normal playback

For chant, the phrase is not finished until the melody resolves.

Use the boundary refinement helper to inspect the cached M4A around rough ASR/CC times:

```bash
npm run align:refine-boundaries -- --recording-id recording--dufaXx7Hm0 --start 204.22 --end 211.7
```

The command returns refined `start_seconds` and `end_seconds` candidates plus the quiet runs it found. Use those refined boundaries for exercise clips and alignment matches. If the helper does not find a quiet run because the chant continues into the next phrase, pass a text transition fallback and review by ear:

```bash
npm run align:refine-boundaries -- --recording-id recording--dufaXx7Hm0 --start 192.54 --end 204.22 --text-start 192.66
```
