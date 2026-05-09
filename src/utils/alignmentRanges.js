import { serviceTextDefinitions } from '../data/texts/serviceTexts.js';
import { getServiceRangeKey } from './serviceRanges.js';

function getSegmentKey(segmentIds) {
  return (segmentIds || []).join('\u001f');
}

export function getAlignmentRange(alignmentId, segmentIds, recordingId, alignments) {
  const alignment = alignments?.[alignmentId];
  if (!alignment || alignment.recording_id !== recordingId) return null;

  const segmentKey = getSegmentKey(segmentIds);
  return (alignment.ranges || []).find(item => getSegmentKey(item.segment_ids) === segmentKey) || null;
}

export function findServiceAlignmentRange(serviceTextId, serviceRange, recordingId, alignments) {
  if (!serviceTextId || !serviceRange) return null;

  const serviceText = serviceTextDefinitions.find(item => item.id === serviceTextId);
  const serviceRangeKey = getServiceRangeKey(serviceText, serviceRange);
  if (!serviceRangeKey) return null;

  const alignment = Object.values(alignments || {}).find(item => (
    item.service_text_id === serviceTextId
      && (!recordingId || item.recording_id === recordingId)
      && (item.ranges || []).some(range => getServiceRangeKey(serviceText, range.service_range) === serviceRangeKey)
  ));
  const range = (alignment?.ranges || []).find(item => getServiceRangeKey(serviceText, item.service_range) === serviceRangeKey);

  return alignment && range ? { alignment, range } : null;
}

export function getAlignmentPhraseTimings(alignmentId, segmentIds, recordingId, alignments) {
  const range = getAlignmentRange(alignmentId, segmentIds, recordingId, alignments);
  return range?.phrase_timings?.map(timing => ({ ...timing })) || [];
}
