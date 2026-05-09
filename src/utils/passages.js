import segments from "../data/texts/segments.js";
import { getServiceSectionAudio } from "../data/media/serviceSectionAudio.js";
import { getServiceSectionPlayback } from "./servicePlayback.js";
import { getPlaybackCaptions, getPlaybackClip } from "./passageTiming.js";

function getLinesForSegmentIds(segmentIds, {
  segmentsMap = segments,
  showQuietPrayers = true
} = {}) {
  return (segmentIds || [])
    .map((segmentId, index) => ({ segment_id: segmentId, segment_index: index, segment: segmentsMap[segmentId] }))
    .filter(({ segment }) => segment && (showQuietPrayers || !segment.tags?.includes("quiet")))
    .map(({ segment_id, segment_index, segment }, index) => ({
      ...segment,
      source_segment_id: segment_id,
      segment_id: `${segment_id}@${segment_index}`,
      line_order: index + 1,
      phrases: segment.phrases.map(part => ({ ...part }))
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
    lines: getLinesForSegmentIds(section.segment_ids, { showQuietPrayers }),
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
