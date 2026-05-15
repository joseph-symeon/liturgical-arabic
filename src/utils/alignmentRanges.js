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

  return composeSegmentAlignmentRange(alignment, segmentIds)
    || getExactAlignmentRange(alignment, segmentIds);
}

function getExactAlignmentRange(alignment, segmentIds) {
  const segmentKey = getSegmentKey(segmentIds);
  return (alignment.ranges || []).find(item => getSegmentKey(item.segment_ids) === segmentKey) || null;
}

function composeSegmentAlignmentRange(alignment, segmentIds) {
  if (!Array.isArray(segmentIds) || segmentIds.length === 0) return null;

  const ranges = segmentIds.map(segmentId => getExactAlignmentRange(alignment, [segmentId]));
  return composeAlignmentRanges(segmentIds, ranges);
}

function composeAlignmentRanges(segmentIds, ranges, serviceRange = null) {
  const timedRanges = ranges.filter(Boolean);
  if (timedRanges.length === 0) return null;
  const firstBounds = getRangeBounds(timedRanges[0]);
  const lastBounds = getRangeBounds(timedRanges[timedRanges.length - 1]);

  return {
    ...(serviceRange ? { service_range: serviceRange } : {}),
    segment_ids: [...segmentIds],
    start_seconds: firstBounds?.start_seconds,
    end_seconds: lastBounds?.end_seconds,
    phrase_timings: timedRanges.flatMap(range => (
      range.phrase_timings?.map(timing => ({ ...timing })) || []
    )),
    default_playback_rate: timedRanges.find(range => typeof range.default_playback_rate === "number")?.default_playback_rate
  };
}

export function findServiceAlignmentRange(serviceTextId, serviceRange, recordingId, alignments) {
  if (!serviceTextId || !serviceRange) return null;

  const serviceText = serviceTextDefinitions.find(item => item.id === serviceTextId);
  const requestedRange = resolveServiceRange(serviceText, serviceRange);
  const serviceRangeKey = requestedRange ? getServiceRangeKey(serviceText, serviceRange) : '';
  if (!requestedRange || !serviceRangeKey) return null;

  const candidateAlignments = Object.values(alignments || {}).filter(item => (
    item.service_text_id === serviceTextId
      && (!recordingId || item.recording_id === recordingId)
  ));

  const exactAlignment = candidateAlignments.find(alignment => (
    (alignment.ranges || []).some(item => getServiceRangeKey(serviceText, item.service_range) === serviceRangeKey)
  ));
  const exactRange = (exactAlignment?.ranges || []).find(item => getServiceRangeKey(serviceText, item.service_range) === serviceRangeKey);
  if (exactAlignment && exactRange) return { alignment: exactAlignment, range: exactRange };

  const composedAlignment = candidateAlignments.find(alignment => (
    composeServiceAlignmentRange(alignment, requestedRange, serviceRange, serviceText)
  ));
  const composedRange = composedAlignment
    ? composeServiceAlignmentRange(composedAlignment, requestedRange, serviceRange, serviceText)
    : null;
  if (composedAlignment && composedRange) return { alignment: composedAlignment, range: composedRange };

  let containingResolvedRange = null;
  const containingAlignment = candidateAlignments.find(alignment => (
    (alignment.ranges || []).some(item => {
      const rangeServiceRange = resolveServiceRange(serviceText, item.service_range);
      return rangeServiceRange && rangeContains(rangeServiceRange, requestedRange);
    })
  ));
  const containingRange = (containingAlignment?.ranges || []).find(item => {
    const rangeServiceRange = resolveServiceRange(serviceText, item.service_range);
    const contains = rangeServiceRange && rangeContains(rangeServiceRange, requestedRange);
    if (contains) containingResolvedRange = rangeServiceRange;
    return contains;
  });
  const derivedRange = containingRange
    ? deriveContainedRange(containingRange, containingResolvedRange, requestedRange, serviceRange)
    : null;

  return containingAlignment && derivedRange ? { alignment: containingAlignment, range: derivedRange } : null;
}

function composeServiceAlignmentRange(alignment, requestedRange, serviceRange, serviceText) {
  const ranges = requestedRange.segment_ids.map((segmentId, segmentOffset) => {
    const segmentIndex = requestedRange.start.segment_index + segmentOffset;
    return (alignment.ranges || []).find(range => {
      const rangeServiceRange = resolveServiceRange(serviceText, range.service_range);
      return rangeServiceRange
        && rangeServiceRange.start.section_index === requestedRange.start.section_index
        && rangeServiceRange.start.segment_index === segmentIndex
        && rangeServiceRange.end.segment_index === segmentIndex
        && range.segment_ids?.length === 1
        && range.segment_ids[0] === segmentId;
    });
  });
  return composeAlignmentRanges(requestedRange.segment_ids, ranges, serviceRange);
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
