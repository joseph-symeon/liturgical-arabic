import segments from "../data/texts/segments.js";
import { getServiceSectionAudio } from "../data/media/serviceSectionAudio.js";
import { getServiceSectionPlayback } from "./servicePlayback.js";
import { getPlaybackCaptions, getPlaybackClip } from "./passageTiming.js";

function getLinesForSegmentIds(segmentIds, {
  segmentsMap = segments,
  showQuietPrayers = true,
  splitSegmentPhrases = false,
  omittedPhraseIds = [],
  speakerOverride
} = {}) {
  const omittedPhraseIdSet = new Set(omittedPhraseIds);
  return (segmentIds || [])
    .map((segmentId, index) => ({ segment_id: segmentId, segment_index: index, segment: segmentsMap[segmentId] }))
    .filter(({ segment }) => segment && (showQuietPrayers || !segment.tags?.includes("quiet")))
    .flatMap(({ segment_id, segment_index, segment }) => {
      const shouldSplitSegment = splitSegmentPhrases || segment.split_phrases_by_line_breaks;
      if (!shouldSplitSegment) {
        return [{
          ...segment,
          speaker: speakerOverride ?? segment.speaker,
          source_segment_id: segment_id,
          segment_id: `${segment_id}@${segment_index}`,
          phrases: segment.phrases
            .filter(part => !part.phrase_id || !omittedPhraseIdSet.has(part.phrase_id))
            .map(part => ({ ...part }))
        }];
      }

      const lines = [];
      let currentParts = [];
      const hasLineBreakMarkers = segment.phrases.some(part => part.line_break_after);
      segment.phrases
        .filter(part => !part.phrase_id || !omittedPhraseIdSet.has(part.phrase_id))
        .forEach(part => {
        if (!hasLineBreakMarkers && part.phrase_id && currentParts.some(currentPart => currentPart.phrase_id)) {
          lines.push(currentParts);
          currentParts = [];
        }
        currentParts.push({ ...part });
        if (hasLineBreakMarkers && part.line_break_after) {
          lines.push(currentParts);
          currentParts = [];
        }
      });
      if (currentParts.length > 0) lines.push(currentParts);

      return lines
        .filter(lineParts => lineParts.some(part => part.phrase_id || part.text?.trim()))
        .map((lineParts, lineIndex) => ({
          ...segment,
          speaker: speakerOverride ?? segment.speaker,
          source_segment_id: segment_id,
          segment_id: `${segment_id}@${segment_index}:${lineIndex}`,
          break_before: lineIndex === 0 ? segment.break_before : false,
          phrases: lineParts
        }));
    })
    .map((line, index) => ({
      ...line,
      line_order: index + 1
    }));
}

export function createServiceSectionPassage({
  serviceText,
  sectionIndex,
  showQuietPrayers = true
}) {
  const section = serviceText?.sections?.[sectionIndex] || null;
  if (!serviceText || !section) return null;

  const sectionAudio = getServiceSectionAudio(serviceText.id, section, sectionIndex);
  const shouldShowQuietPrayers = section.include_quiet_segments || showQuietPrayers;
  const playback = sectionAudio
    ? getServiceSectionPlayback({
        service_text_id: serviceText.id,
        section_index: sectionIndex,
        recording_id: sectionAudio.recording_id
      })
    : null;

  return {
    id: `${serviceText.id}:section:${sectionIndex}`,
    source: "reader",
    title: section.section,
    service_text_id: serviceText.id,
    section,
    section_index: sectionIndex,
    segment_ids: section.segment_ids,
    lines: getLinesForSegmentIds(section.segment_ids, {
      showQuietPrayers: shouldShowQuietPrayers,
      splitSegmentPhrases: section.split_segment_phrases,
      omittedPhraseIds: section.omit_phrase_ids,
      speakerOverride: Object.hasOwn(section, "speaker_override") ? section.speaker_override : undefined
    }),
    playback,
    clip: getPlaybackClip(playback),
    captions: getPlaybackCaptions(playback),
    lead_seconds: 0
  };
}

export function createExercisePassage({ exercise }) {
  if (!exercise) return null;

  return {
    id: exercise.id,
    source: "course",
    title: exercise.title,
    service_text_id: exercise.service_text_id,
    service_range: exercise.service_range,
    segment_ids: exercise.segment_ids,
    lines: exercise.lines || [],
    clip: exercise.audio_clip || null,
    captions: exercise.activity?.captions || [],
    lead_seconds: exercise.activity?.sync_lead_seconds ?? 0,
    activity: exercise.activity || null,
    activity_type: exercise.activity?.type || null,
    exercise
  };
}
