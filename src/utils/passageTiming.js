export function getActiveCaption(captions, currentTime, {
  leadSeconds = 0,
  clipEndSeconds = null
} = {}) {
  if (typeof currentTime !== "number") return null;

  return (captions || []).find((caption, index) => {
    const nextCaption = captions[index + 1];
    const isFinalCaption = index === captions.length - 1;
    const displayStart = caption.start_seconds - leadSeconds;
    const displayEnd = nextCaption
      ? Math.min(caption.end_seconds, nextCaption.start_seconds - 0.01)
      : Math.max(caption.end_seconds, clipEndSeconds ?? caption.end_seconds);

    return isFinalCaption
      ? currentTime >= displayStart && currentTime <= displayEnd
      : currentTime >= displayStart && currentTime < displayEnd;
  }) || null;
}

export function getDisplayedCaption(captions, currentTime, {
  leadSeconds = 0,
  clipEndSeconds = null,
  primeInitialCaption = false
} = {}) {
  return getActiveCaption(captions, currentTime, {
    leadSeconds,
    clipEndSeconds
  }) || (
    primeInitialCaption && typeof currentTime !== "number"
      ? captions?.[0] || null
      : null
  );
}

export function getPlaybackCaptions(playback) {
  const ranges = playback?.aligned_ranges || [];
  const selectedRanges = [];
  const usedSegmentIndexes = new Set();

  [...ranges]
    .sort((first, second) => (
      (second.resolved_service_range.end.segment_index - second.resolved_service_range.start.segment_index)
        - (first.resolved_service_range.end.segment_index - first.resolved_service_range.start.segment_index)
    ))
    .forEach(range => {
      const indexes = [];
      for (
        let index = range.resolved_service_range.start.segment_index;
        index <= range.resolved_service_range.end.segment_index;
        index += 1
      ) {
        indexes.push(index);
      }
      if (indexes.some(index => usedSegmentIndexes.has(index))) return;
      indexes.forEach(index => usedSegmentIndexes.add(index));
      selectedRanges.push(range);
    });

  return selectedRanges
    .flatMap(range => {
      const captions = [];
      let timingCursor = 0;
      (range.segment_ids || []).forEach((segmentId, segmentOffset) => {
        const phraseIds = (segments[segmentId]?.phrases || [])
          .filter(part => part.phrase_id)
          .map(part => part.phrase_id);
        phraseIds.forEach(phraseId => {
          const timingIndex = (range.phrase_timings || []).findIndex((timing, index) => (
            index >= timingCursor && timing.phrase_id === phraseId
          ));
          if (timingIndex < 0) return;
          const phraseTiming = range.phrase_timings[timingIndex];
          captions.push({
            ...phraseTiming,
            segment_id: `${segmentId}@${range.resolved_service_range.start.segment_index + segmentOffset}`,
            source_segment_id: segmentId,
            range_key: range.resolved_service_range.key
          });
          timingCursor = timingIndex + 1;
        });
      });
      return captions;
    })
    .filter(Boolean)
    .sort((first, second) => first.start_seconds - second.start_seconds);
}

export function getPlaybackClip(playback) {
  const ranges = playback?.aligned_ranges || [];
  if (ranges.length === 0) return null;

  return ranges.reduce((clip, range) => ({
    recording_id: range.recording_id,
    start_seconds: Math.min(clip.start_seconds, range.start_seconds),
    end_seconds: Math.max(clip.end_seconds, range.end_seconds)
  }), {
    recording_id: ranges[0].recording_id,
    start_seconds: ranges[0].start_seconds,
    end_seconds: ranges[0].end_seconds
  });
}
import segments from "../data/texts/segments.js";
