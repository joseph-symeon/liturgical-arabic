import { getRangeBounds } from "./alignmentTiming.js";
import segments from "../data/texts/segments.js";

const CONTINUOUS_CAPTION_GAP_TOLERANCE_SECONDS = 0.12;

export function resolvePendingPlaybackTime({
  currentTime,
  pendingStart,
  pendingAgeMs,
  graceMs,
  seekSettled = false
}) {
  if (pendingStart === null) {
    return {
      displayTime: currentTime,
      pending: false,
      shouldClear: false
    };
  }

  const pendingIsFresh = pendingAgeMs <= graceMs;
  const pending = pendingIsFresh && !seekSettled;
  return {
    displayTime: pending
      ? pendingStart
      : currentTime,
    pending,
    shouldClear: !pendingIsFresh || seekSettled
  };
}

export function advancePendingSeekSettlement(state, currentTime, pendingStart, {
  nearStartSeconds = 0.5,
  backwardToleranceSeconds = 0.05,
  maximumForwardStepSeconds = 0.3
} = {}) {
  const previousState = state || { observedNearStart: false, lastTime: null };
  const nearStart = Math.abs(currentTime - pendingStart) <= nearStartSeconds;
  const stableForwardSample = previousState.observedNearStart
    && typeof previousState.lastTime === "number"
    && currentTime >= previousState.lastTime - backwardToleranceSeconds
    && currentTime - previousState.lastTime <= maximumForwardStepSeconds;

  return {
    state: {
      observedNearStart: nearStart,
      lastTime: currentTime
    },
    settled: nearStart && stableForwardSample
  };
}

export function getActiveCaption(captions, currentTime, {
  leadSeconds = 0,
  clipEndSeconds = null
} = {}) {
  if (typeof currentTime !== "number") return null;

  return (captions || []).find((caption, index) => {
    const nextCaption = captions[index + 1];
    const isFinalCaption = index === captions.length - 1;
    const displayStart = caption.start_seconds - leadSeconds;
    const captionEnd = nextCaption
      && nextCaption.start_seconds > caption.end_seconds
      && nextCaption.start_seconds - caption.end_seconds <= CONTINUOUS_CAPTION_GAP_TOLERANCE_SECONDS
        ? nextCaption.start_seconds
        : caption.end_seconds;
    const displayEnd = nextCaption
      ? Math.min(captionEnd, nextCaption.start_seconds)
      : Math.max(captionEnd, clipEndSeconds ?? captionEnd);

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

  function getSegmentPhraseIds(segmentId) {
    return (segments[segmentId]?.phrases || [])
      .filter(part => part.phrase_id)
      .map(part => part.phrase_id);
  }

  function getCaptionPhraseIndex(phraseIds, phraseId, cursor) {
    const phraseIndex = phraseIds.findIndex((candidatePhraseId, index) => (
      index >= cursor && candidatePhraseId === phraseId
    ));
    return phraseIndex >= 0 ? phraseIndex : phraseIds.indexOf(phraseId);
  }

  [...ranges]
    .sort((first, second) => (
      (first.resolved_service_range.end.segment_index - first.resolved_service_range.start.segment_index)
        - (second.resolved_service_range.end.segment_index - second.resolved_service_range.start.segment_index)
        || first.resolved_service_range.start.segment_index - second.resolved_service_range.start.segment_index
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
      if ((range.segment_ids || []).length === 1) {
        const segmentId = range.segment_ids[0];
        const phraseIds = getSegmentPhraseIds(segmentId);
        const phraseIdSet = new Set(phraseIds);
        let phraseCursor = 0;
        return (range.phrase_timings || [])
          .filter(timing => phraseIdSet.has(timing.phrase_id))
          .map(timing => {
            const phraseIndex = getCaptionPhraseIndex(phraseIds, timing.phrase_id, phraseCursor);
            phraseCursor = phraseIndex >= 0 ? phraseIndex + 1 : phraseCursor;
            return {
              ...timing,
              segment_id: `${segmentId}@${range.resolved_service_range.start.segment_index}`,
              source_segment_id: segmentId,
              phrase_index: phraseIndex,
              range_key: range.resolved_service_range.key
            };
          });
      }

      const captions = [];
      let timingCursor = 0;
      (range.segment_ids || []).forEach((segmentId, segmentOffset) => {
        const phraseIds = getSegmentPhraseIds(segmentId);
        let phraseCursor = 0;
        phraseIds.forEach(phraseId => {
          const timingIndex = (range.phrase_timings || []).findIndex((timing, index) => (
            index >= timingCursor && timing.phrase_id === phraseId
          ));
          if (timingIndex < 0) return;
          const phraseTiming = range.phrase_timings[timingIndex];
          const phraseIndex = getCaptionPhraseIndex(phraseIds, phraseTiming.phrase_id, phraseCursor);
          captions.push({
            ...phraseTiming,
            segment_id: `${segmentId}@${range.resolved_service_range.start.segment_index + segmentOffset}`,
            source_segment_id: segmentId,
            phrase_index: phraseIndex,
            range_key: range.resolved_service_range.key
          });
          phraseCursor = phraseIndex >= 0 ? phraseIndex + 1 : phraseCursor;
          timingCursor = timingIndex + 1;
        });
      });
      return captions;
    })
    .filter(Boolean)
    .sort((first, second) => first.start_seconds - second.start_seconds);
}

export function getPlaybackClip(playback) {
  const ranges = (playback?.aligned_ranges || [])
    .map(range => ({ ...range, bounds: getRangeBounds(range) }))
    .filter(range => range.bounds);
  if (ranges.length === 0) return null;

  return ranges.reduce((clip, range) => ({
    recording_id: range.recording_id,
    start_seconds: Math.min(clip.start_seconds, range.bounds.start_seconds),
    end_seconds: Math.max(clip.end_seconds, range.bounds.end_seconds)
  }), {
    recording_id: ranges[0].recording_id,
    start_seconds: ranges[0].bounds.start_seconds,
    end_seconds: ranges[0].bounds.end_seconds
  });
}
