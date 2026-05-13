import alignments from '../data/media/alignments.js';
import recordings from '../data/media/recordings.js';
import segments from '../data/texts/segments.js';
import { getServiceText } from '../data/texts/serviceTexts.js';
import { getRangeBounds } from './alignmentTiming.js';
import { getIndexedServiceRangeKey, resolveServiceRange } from './serviceRanges.js';

function getAlignmentRanges(alignment) {
  return alignment?.ranges || [];
}

function rangesOverlapSection(resolvedRange, sectionIndex) {
  return resolvedRange?.start?.section_index === sectionIndex
    || resolvedRange?.end?.section_index === sectionIndex;
}

function getPhraseIdsForSegment(segmentId, segmentsMap) {
  return (segmentsMap[segmentId]?.phrases || [])
    .filter(part => part.phrase_id)
    .map(part => part.phrase_id);
}

function getSegmentTimingFromPhraseTimings(segmentIds, phraseTimings, segmentsMap) {
  if (!Array.isArray(phraseTimings) || phraseTimings.length === 0 || segmentIds.length === 0) return null;

  const segmentTimings = {};
  let timingCursor = 0;

  segmentIds.forEach((segmentId, index) => {
    const phraseIds = getPhraseIdsForSegment(segmentId, segmentsMap);
    const timings = [];

    phraseIds.forEach(phraseId => {
      const timingIndex = phraseTimings.findIndex((timing, index) => (
        index >= timingCursor && timing.phrase_id === phraseId
      ));
      if (timingIndex < 0) return;
      timings.push(phraseTimings[timingIndex]);
      timingCursor = timingIndex + 1;
    });

    if (timings.length === 0) return;
    segmentTimings[segmentId] = {
      start_seconds: timings[0].start_seconds,
      end_seconds: timings[timings.length - 1].end_seconds,
      phrase_timings: timings.map(timing => ({ ...timing }))
    };
  });
  return Object.keys(segmentTimings).length > 0 ? segmentTimings : null;
}

function getEvenSegmentTimings(range, segmentIds) {
  if (segmentIds.length === 0) return {};

  const bounds = getRangeBounds(range);
  if (!bounds) return {};

  const duration = bounds.end_seconds - bounds.start_seconds;
  const segmentDuration = duration / segmentIds.length;
  return Object.fromEntries(segmentIds.map((segmentId, index) => [
    segmentId,
    {
      start_seconds: Math.round((bounds.start_seconds + segmentDuration * index) * 1000) / 1000,
      end_seconds: Math.round((bounds.start_seconds + segmentDuration * (index + 1)) * 1000) / 1000,
      phrase_timings: []
    }
  ]));
}

function getSegmentTimings(range, segmentIds, segmentsMap) {
  return getSegmentTimingFromPhraseTimings(segmentIds, range.phrase_timings, segmentsMap)
    || getEvenSegmentTimings(range, segmentIds);
}

export function getServiceSectionPlayback({
  service_text_id,
  section_index,
  recording_id = null,
  alignmentsMap = alignments,
  recordingsMap = recordings,
  segmentsMap = segments
}) {
  const serviceText = getServiceText(service_text_id);
  const section = serviceText?.sections?.[section_index];
  if (!serviceText || !section) return null;

  const sectionRange = {
    start: { section_index, segment_index: 0 },
    end: { section_index, segment_index: section.segment_ids.length - 1 }
  };
  const resolvedSectionRange = resolveServiceRange(serviceText, sectionRange);

  const alignedRanges = Object.values(alignmentsMap || {})
    .filter(alignment => (
      alignment.service_text_id === service_text_id
        && (!recording_id || alignment.recording_id === recording_id)
    ))
    .flatMap(alignment => getAlignmentRanges(alignment)
      .map(range => {
        const resolvedRange = resolveServiceRange(serviceText, range.service_range);
        if (!rangesOverlapSection(resolvedRange, section_index)) return null;
        const bounds = getRangeBounds(range);
        if (!bounds) return null;
        const segmentIds = resolvedRange.segment_ids;
        return {
          alignment_id: alignment.id,
          recording_id: alignment.recording_id,
          recording: recordingsMap[alignment.recording_id] || null,
          service_range: range.service_range,
          resolved_service_range: {
            section_id: resolvedRange.section_id,
            start: resolvedRange.start,
            end: resolvedRange.end,
            start_segment_id: resolvedRange.start_segment_id,
            end_segment_id: resolvedRange.end_segment_id,
            key: getIndexedServiceRangeKey(resolvedRange)
          },
          segment_ids: segmentIds,
          start_seconds: bounds.start_seconds,
          end_seconds: bounds.end_seconds,
          phrase_timings: range.phrase_timings?.map(timing => ({ ...timing })) || [],
          segment_timings: getSegmentTimings(range, segmentIds, segmentsMap)
        };
      })
      .filter(Boolean))
    .sort((a, b) => (
      a.resolved_service_range.start.segment_index - b.resolved_service_range.start.segment_index
        || a.start_seconds - b.start_seconds
    ));

  const timedSegments = {};
  alignedRanges.forEach(range => {
    Object.entries(range.segment_timings).forEach(([segmentId, timing]) => {
      timedSegments[`${segmentId}@${range.resolved_service_range.key}`] = {
        ...timing,
        segment_id: segmentId,
        alignment_id: range.alignment_id,
        recording_id: range.recording_id,
        range_key: range.resolved_service_range.key
      };
    });
  });

  return {
    service_text: serviceText,
    section,
    section_index,
    section_range: resolvedSectionRange,
    recording: recording_id ? recordingsMap[recording_id] || null : null,
    aligned_ranges: alignedRanges,
    timed_segments: timedSegments
  };
}
