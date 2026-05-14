import { serviceTextDefinitions } from '../data/texts/serviceTexts.js';
import segments from '../data/texts/segments.js';
import { getRangeBounds } from './alignmentTiming.js';
import { getServiceRangeKey, resolveServiceRange } from './serviceRanges.js';

function getSegmentKey(segmentIds) {
  return (segmentIds || []).join('\u001f');
}

export function getAlignmentRange(alignmentId, segmentIds, recordingId, alignments) {
  const alignment = alignments?.[alignmentId];
  if (!alignment || alignment.recording_id !== recordingId) return null;

  return getExactAlignmentRange(alignment, segmentIds)
    || composeSegmentAlignmentRange(alignment, segmentIds);
}

function getExactAlignmentRange(alignment, segmentIds) {
  const segmentKey = getSegmentKey(segmentIds);
  return (alignment.ranges || []).find(item => getSegmentKey(item.segment_ids) === segmentKey) || null;
}

function composeSegmentAlignmentRange(alignment, segmentIds) {
  if (!Array.isArray(segmentIds) || segmentIds.length === 0) return null;

  const ranges = segmentIds.map(segmentId => getExactAlignmentRange(alignment, [segmentId]));
  if (ranges.some(range => !range)) return null;
  const firstBounds = getRangeBounds(ranges[0]);
  const lastBounds = getRangeBounds(ranges[ranges.length - 1]);

  return {
    segment_ids: [...segmentIds],
    start_seconds: firstBounds?.start_seconds,
    end_seconds: lastBounds?.end_seconds,
    phrase_timings: ranges.flatMap(range => (
      range.phrase_timings?.map(timing => ({ ...timing })) || []
    )),
    default_playback_rate: ranges.find(range => typeof range.default_playback_rate === "number")?.default_playback_rate
  };
}

export function findServiceAlignmentRange(serviceTextId, serviceRange, recordingId, alignments) {
  if (!serviceTextId || !serviceRange) return null;

  const serviceText = serviceTextDefinitions.find(item => item.id === serviceTextId);
  const requestedRange = resolveServiceRange(serviceText, serviceRange);
  const serviceRangeKey = requestedRange ? getServiceRangeKey(serviceText, serviceRange) : '';
  if (!requestedRange || !serviceRangeKey) return null;

  const alignment = Object.values(alignments || {}).find(item => (
    item.service_text_id === serviceTextId
      && (!recordingId || item.recording_id === recordingId)
      && (item.ranges || []).some(range => {
        const rangeServiceRange = resolveServiceRange(serviceText, range.service_range);
        return rangeServiceRange && rangeContains(rangeServiceRange, requestedRange);
      })
  ));
  const exactRange = (alignment?.ranges || []).find(item => getServiceRangeKey(serviceText, item.service_range) === serviceRangeKey);
  if (alignment && exactRange) return { alignment, range: exactRange };

  let containingResolvedRange = null;
  const containingRange = (alignment?.ranges || []).find(item => {
    const rangeServiceRange = resolveServiceRange(serviceText, item.service_range);
    const contains = rangeServiceRange && rangeContains(rangeServiceRange, requestedRange);
    if (contains) containingResolvedRange = rangeServiceRange;
    return contains;
  });
  const derivedRange = containingRange
    ? deriveContainedRange(containingRange, containingResolvedRange, requestedRange, serviceRange)
    : null;

  return alignment && derivedRange ? { alignment, range: derivedRange } : null;
}

function rangeContains(container, requested) {
  return container.start.section_index === requested.start.section_index
    && container.end.section_index === requested.end.section_index
    && container.start.segment_index <= requested.start.segment_index
    && container.end.segment_index >= requested.end.segment_index;
}

function getPhraseIdsForSegment(segmentId) {
  return (segments[segmentId]?.phrases || [])
    .filter(part => part.phrase_id)
    .map(part => part.phrase_id);
}

function getPhraseTimingsForSegmentIds(segmentIds, phraseTimings) {
  const timings = [];
  let timingCursor = 0;
  segmentIds.forEach(segmentId => {
    getPhraseIdsForSegment(segmentId).forEach(phraseId => {
      const timingIndex = (phraseTimings || []).findIndex((timing, index) => (
        index >= timingCursor && timing.phrase_id === phraseId
      ));
      if (timingIndex < 0) return;
      timings.push({ ...phraseTimings[timingIndex] });
      timingCursor = timingIndex + 1;
    });
  });
  return timings;
}

function deriveContainedRange(range, containerRange, requestedRange, serviceRange) {
  const relativeStart = requestedRange.start.segment_index - containerRange.start.segment_index;
  if (!Number.isInteger(relativeStart) || relativeStart < 0) return null;
  const segmentIds = range.segment_ids.slice(relativeStart, relativeStart + requestedRange.segment_ids.length);
  const phraseTimings = getPhraseTimingsForSegmentIds(segmentIds, range.phrase_timings);
  return {
    ...range,
    service_range: serviceRange,
    segment_ids: segmentIds,
    phrase_timings: phraseTimings
  };
}

export function getAlignmentPhraseTimings(alignmentId, segmentIds, recordingId, alignments) {
  const range = getAlignmentRange(alignmentId, segmentIds, recordingId, alignments);
  return range?.phrase_timings?.map(timing => ({ ...timing })) || [];
}
