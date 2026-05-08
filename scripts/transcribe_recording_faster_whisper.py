import argparse
import json
from pathlib import Path

from faster_whisper import WhisperModel


def round_seconds(value):
    if value is None:
        return None
    return round(float(value), 3)


def main():
    parser = argparse.ArgumentParser(description="Generate Arabic word timestamps with faster-whisper.")
    parser.add_argument("--audio", required=True, help="Path to the local audio file.")
    parser.add_argument("--output", required=True, help="Path to write ASR JSON.")
    parser.add_argument("--model", default="small", help="faster-whisper model size or path.")
    parser.add_argument("--language", default="ar", help="ASR language code.")
    args = parser.parse_args()

    model = WhisperModel(args.model, device="cpu", compute_type="int8")
    segments, info = model.transcribe(
        args.audio,
        language=args.language,
        beam_size=5,
        vad_filter=False,
        word_timestamps=True,
        condition_on_previous_text=True,
    )

    output_segments = []
    words = []
    for index, segment in enumerate(segments, start=1):
        segment_words = []
        for word in segment.words or []:
            text = word.word.strip()
            if not text:
                continue
            word_record = {
                "text": text,
                "start": round_seconds(word.start),
                "end": round_seconds(word.end),
                "probability": round(float(word.probability), 4) if word.probability is not None else None,
            }
            segment_words.append(word_record)
            words.append(word_record)

        output_segments.append({
            "index": index,
            "start": round_seconds(segment.start),
            "end": round_seconds(segment.end),
            "text": segment.text.strip(),
            "words": segment_words,
        })

    payload = {
        "engine": "faster-whisper",
        "model": args.model,
        "language": info.language,
        "language_probability": round(float(info.language_probability), 4),
        "duration_seconds": round_seconds(info.duration),
        "words": words,
        "segments": output_segments,
    }

    output_path = Path(args.output)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    print(json.dumps({
        "output": str(output_path),
        "word_count": len(words),
        "segment_count": len(output_segments),
        "language": payload["language"],
        "duration_seconds": payload["duration_seconds"],
    }, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
