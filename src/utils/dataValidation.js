import phrases from '../data/texts/phrases.js';
import segments from '../data/texts/segments.js';
import exercises, { exerciseDefinitions } from '../data/course/exercises.js';
import lessons from '../data/course/lessons.js';
import units from '../data/course/units.js';
import { serviceTextDefinitions } from '../data/texts/serviceTexts.js';
import recordings from '../data/media/recordings.js';
import { alignmentDefinitions } from '../data/media/alignments.js';
import { resolveServiceRange } from './serviceRanges.js';

function assertUnique(ids, label, errors) {
  const seen = new Set();
  ids.forEach(id => {
    if (!id) {
      errors.push(`${label} contains a missing id.`);
      return;
    }
    if (seen.has(id)) {
      errors.push(`${label} contains duplicate id "${id}".`);
    }
    seen.add(id);
  });
}

function getSegmentKey(segmentIds) {
  return (segmentIds || []).join('\u001f');
}

function getAlignmentRanges(alignment) {
  return alignment?.ranges || [];
}

function findAlignmentRange(alignment, segmentIds) {
  const segmentKey = getSegmentKey(segmentIds);
  return getAlignmentRanges(alignment).find(range => getSegmentKey(range.segment_ids) === segmentKey);
}

function validateServiceRange(serviceText, range, label, errors) {
  const resolvedRange = resolveServiceRange(serviceText, range);
  if (!resolvedRange) {
    errors.push(`${label} does not match a valid service text range.`);
  }

  return resolvedRange?.segment_ids || null;
}

export function validateData() {
  const errors = [];
  const phraseIds = new Set(Object.keys(phrases));
  const segmentIds = new Set(Object.keys(segments));
  const exerciseIds = new Set(exerciseDefinitions.map(exercise => exercise.id));
  const unitIds = new Set(units.map(unit => unit.id));
  const recordingIds = new Set(Object.keys(recordings));
  const alignmentIds = new Set(alignmentDefinitions.map(alignment => alignment.id));
  const alignmentsById = Object.fromEntries(alignmentDefinitions.map(alignment => [alignment.id, alignment]));
  const serviceTextIds = new Set(serviceTextDefinitions.map(serviceText => serviceText.id));
  const serviceTextsById = Object.fromEntries(serviceTextDefinitions.map(serviceText => [serviceText.id, serviceText]));
  const activityPolicies = new Set(['standard']);

  assertUnique(Object.keys(phrases), 'phrases', errors);
  assertUnique(Object.keys(segments), 'segments', errors);
  assertUnique(exerciseDefinitions.map(exercise => exercise.id), 'exerciseDefinitions', errors);
  assertUnique(lessons.map(lesson => lesson.id), 'lessons', errors);
  assertUnique(units.map(unit => unit.id), 'units', errors);
  assertUnique(alignmentDefinitions.map(alignment => alignment.id), 'alignments', errors);
  assertUnique(serviceTextDefinitions.map(serviceText => serviceText.id), 'serviceTexts', errors);

  Object.entries(segments).forEach(([segmentId, segment]) => {
    if (segment.speaker && !phraseIds.has(segment.speaker)) {
      errors.push(`Segment "${segmentId}" references missing speaker "${segment.speaker}".`);
    }
    if (segment.tags && !Array.isArray(segment.tags)) {
      errors.push(`Segment "${segmentId}" tags must be an array.`);
    }
    if (!Array.isArray(segment.phrases) || segment.phrases.length === 0) {
      errors.push(`Segment "${segmentId}" must define a non-empty phrases array.`);
    } else {
      segment.phrases.forEach(part => {
        if (part.phrase_id && !phraseIds.has(part.phrase_id)) {
          errors.push(`Segment "${segmentId}" references missing phrase "${part.phrase_id}".`);
        }
        if (!part.phrase_id && typeof part.text !== 'string') {
          errors.push(`Segment "${segmentId}" has a phrase part without phrase_id or text.`);
        }
      });
      const phrasePartOrders = segment.phrases.map(part => `${segmentId}:${part.display_order}`);
      assertUnique(phrasePartOrders, `segment ${segmentId} phrase display orders`, errors);
      segment.phrases.forEach(part => {
        if (!Number.isInteger(part.display_order)) {
          errors.push(`Segment "${segmentId}" has a phrase part with invalid display_order "${part.display_order}".`);
        }
      });
    }
  });

  serviceTextDefinitions.forEach(serviceText => {
    if (!Array.isArray(serviceText.sections) || serviceText.sections.length === 0) {
      errors.push(`Service text "${serviceText.id}" must define a non-empty sections array.`);
      return;
    }
    serviceText.sections.forEach(section => {
      const sectionLabel = `${serviceText.id}:${section.section}`;
      if (!Array.isArray(section.segment_ids) || section.segment_ids.length === 0) {
        errors.push(`Service text section "${sectionLabel}" must define a non-empty segment_ids array.`);
      } else {
        section.segment_ids.forEach(segmentId => {
          if (!segmentIds.has(segmentId)) {
            errors.push(`Service text section "${sectionLabel}" references missing segment "${segmentId}".`);
          }
        });
      }
      if (section.section_title_phrase && !phraseIds.has(section.section_title_phrase)) {
        errors.push(`Service text section "${sectionLabel}" references missing title phrase "${section.section_title_phrase}".`);
      }
      if (section.section_group_title_phrase && !phraseIds.has(section.section_group_title_phrase)) {
        errors.push(`Service text section "${sectionLabel}" references missing group title phrase "${section.section_group_title_phrase}".`);
      }
    });
  });

  exerciseDefinitions.forEach(exercise => {
    if (!Array.isArray(exercise.segment_ids) || exercise.segment_ids.length === 0) {
      errors.push(`Exercise "${exercise.id}" must define a non-empty segment_ids array.`);
    } else if (exercise.segment_ids) {
      exercise.segment_ids.forEach(segmentId => {
        if (!segmentIds.has(segmentId)) {
          errors.push(`Exercise "${exercise.id}" references missing segment "${segmentId}".`);
        }
      });
    }
    if (exercise.audio_clip) {
      ['start_seconds', 'end_seconds', 'default_playback_rate'].forEach(field => {
        if (typeof exercise.audio_clip[field] === 'undefined') {
          errors.push(`Exercise "${exercise.id}" audio_clip is missing "${field}".`);
        }
      });
      if (!exercise.audio_clip.video_id && !exercise.audio_clip.recording_id) {
        errors.push(`Exercise "${exercise.id}" audio_clip must define either "video_id" or "recording_id".`);
      }
      if (exercise.audio_clip.recording_id && !recordingIds.has(exercise.audio_clip.recording_id)) {
        errors.push(`Exercise "${exercise.id}" audio_clip references missing recording "${exercise.audio_clip.recording_id}".`);
      }
    }
    if (exercise.caption_clip) {
      if (!exercise.caption_clip.recording_id) {
        errors.push(`Exercise "${exercise.id}" caption_clip is missing "recording_id".`);
      } else if (!recordingIds.has(exercise.caption_clip.recording_id)) {
        errors.push(`Exercise "${exercise.id}" caption_clip references missing recording "${exercise.caption_clip.recording_id}".`);
      }
      if (exercise.caption_clip.alignment_id && !alignmentIds.has(exercise.caption_clip.alignment_id)) {
        errors.push(`Exercise "${exercise.id}" caption_clip references missing alignment "${exercise.caption_clip.alignment_id}".`);
      }
    }
    if (exercise.media) {
      const alignment = exercise.media.alignment_id ? alignmentsById[exercise.media.alignment_id] : null;
      if (!exercise.media.recording_id) {
        errors.push(`Exercise "${exercise.id}" media is missing "recording_id".`);
      } else if (!recordingIds.has(exercise.media.recording_id)) {
        errors.push(`Exercise "${exercise.id}" media references missing recording "${exercise.media.recording_id}".`);
      }
      if (exercise.media.alignment_id && !alignmentIds.has(exercise.media.alignment_id)) {
        errors.push(`Exercise "${exercise.id}" media references missing alignment "${exercise.media.alignment_id}".`);
      }
      if (alignment && exercise.media.recording_id && alignment.recording_id !== exercise.media.recording_id) {
        errors.push(`Exercise "${exercise.id}" media recording does not match alignment "${exercise.media.alignment_id}".`);
      }
      if (alignment && !findAlignmentRange(alignment, exercise.segment_ids)) {
        errors.push(`Exercise "${exercise.id}" segment_ids do not match alignment "${exercise.media.alignment_id}".`);
      }
    }
    if (exercise.service_range && !exercise.service_text_id) {
      errors.push(`Exercise "${exercise.id}" service_range requires service_text_id.`);
    }
    if (exercise.service_text_id) {
      const serviceText = serviceTextsById[exercise.service_text_id];
      if (!serviceText) {
        errors.push(`Exercise "${exercise.id}" references missing service text "${exercise.service_text_id}".`);
      } else if (exercise.service_range) {
        const rangeSegmentIds = validateServiceRange(serviceText, exercise.service_range, `Exercise "${exercise.id}" service_range`, errors);
        if (rangeSegmentIds && exercise.segment_ids && getSegmentKey(rangeSegmentIds) !== getSegmentKey(exercise.segment_ids)) {
          errors.push(`Exercise "${exercise.id}" service_range does not match segment_ids.`);
        }
      }
    }
  });

  alignmentDefinitions.forEach(alignment => {
    if (alignment.service_text_id && !serviceTextIds.has(alignment.service_text_id)) {
      errors.push(`Alignment "${alignment.id}" references missing service text "${alignment.service_text_id}".`);
    }
    if (!recordingIds.has(alignment.recording_id)) {
      errors.push(`Alignment "${alignment.id}" references missing recording "${alignment.recording_id}".`);
    }
    const ranges = getAlignmentRanges(alignment);
    if (!Array.isArray(alignment.ranges) || alignment.ranges.length === 0) {
      errors.push(`Alignment "${alignment.id}" must define a non-empty ranges array.`);
      return;
    }
    ranges.forEach((range, index) => {
      if (!Array.isArray(range.segment_ids) || range.segment_ids.length === 0) {
        errors.push(`Alignment "${alignment.id}" range ${index + 1} must define segment_ids.`);
      } else {
        range.segment_ids.forEach(segmentId => {
          if (!segmentIds.has(segmentId)) {
            errors.push(`Alignment "${alignment.id}" references missing segment "${segmentId}".`);
          }
        });
      }
      if (typeof range.start_seconds !== 'number' || typeof range.end_seconds !== 'number') {
        errors.push(`Alignment "${alignment.id}" range ${index + 1} must define numeric start_seconds and end_seconds.`);
      } else if (range.end_seconds <= range.start_seconds) {
        errors.push(`Alignment "${alignment.id}" range ${index + 1} must end after it starts.`);
      }
      if (range.service_range) {
        const serviceText = serviceTextsById[alignment.service_text_id];
        if (!serviceText) {
          errors.push(`Alignment "${alignment.id}" range ${index + 1} service_range requires a valid service_text_id.`);
        } else {
          const rangeSegmentIds = validateServiceRange(serviceText, range.service_range, `Alignment "${alignment.id}" range ${index + 1} service_range`, errors);
          if (rangeSegmentIds && range.segment_ids && getSegmentKey(rangeSegmentIds) !== getSegmentKey(range.segment_ids)) {
            errors.push(`Alignment "${alignment.id}" range ${index + 1} service_range does not match segment_ids.`);
          }
        }
      }
      if (range.phrase_timings) {
        if (!Array.isArray(range.phrase_timings)) {
          errors.push(`Alignment "${alignment.id}" range ${index + 1} phrase_timings must be an array.`);
        } else {
          range.phrase_timings.forEach((timing, timingIndex) => {
            if (!timing.phrase_id || !phraseIds.has(timing.phrase_id)) {
              errors.push(`Alignment "${alignment.id}" range ${index + 1} phrase timing ${timingIndex + 1} references missing phrase "${timing.phrase_id}".`);
            }
            if (typeof timing.start_seconds !== 'number' || typeof timing.end_seconds !== 'number') {
              errors.push(`Alignment "${alignment.id}" range ${index + 1} phrase timing ${timingIndex + 1} must define numeric start_seconds and end_seconds.`);
            } else if (timing.end_seconds <= timing.start_seconds) {
              errors.push(`Alignment "${alignment.id}" range ${index + 1} phrase timing ${timingIndex + 1} must end after it starts.`);
            } else if (typeof range.start_seconds === 'number' && typeof range.end_seconds === 'number' && (timing.start_seconds < range.start_seconds || timing.end_seconds > range.end_seconds)) {
              errors.push(`Alignment "${alignment.id}" range ${index + 1} phrase timing ${timingIndex + 1} must stay inside the range time range.`);
            }
          });
        }
      }
    });
  });

  lessons.forEach(lesson => {
    if (!unitIds.has(lesson.unit_id)) {
      errors.push(`Lesson "${lesson.id}" references missing unit "${lesson.unit_id}".`);
    }
    if (lesson.title_phrase && !phraseIds.has(lesson.title_phrase)) {
      errors.push(`Lesson "${lesson.id}" references missing title phrase "${lesson.title_phrase}".`);
    }
    let previousAudioSequenceItem = null;
    (lesson.exercises || []).forEach(item => {
      if (!exerciseIds.has(item.exercise_id)) {
        errors.push(`Lesson "${lesson.id}" references missing exercise "${item.exercise_id}".`);
      }
      if (item.activity_policy && !activityPolicies.has(item.activity_policy)) {
        errors.push(`Lesson "${lesson.id}" exercise "${item.exercise_id}" uses unknown activity_policy "${item.activity_policy}".`);
      }
      if (item.activity_options) {
        if (!Array.isArray(item.activity_options) || item.activity_options.length === 0) {
          errors.push(`Lesson "${lesson.id}" exercise "${item.exercise_id}" activity_options must be a non-empty array when present.`);
        } else {
          item.activity_options.forEach((option, index) => {
            if (!option.label) {
              errors.push(`Lesson "${lesson.id}" exercise "${item.exercise_id}" activity option ${index + 1} is missing "label".`);
            }
            if (option.exercise_id && !exerciseIds.has(option.exercise_id)) {
              errors.push(`Lesson "${lesson.id}" exercise "${item.exercise_id}" activity option ${index + 1} references missing exercise "${option.exercise_id}".`);
            }
            if (!option.exercise_id && !option.activity_type) {
              errors.push(`Lesson "${lesson.id}" exercise "${item.exercise_id}" activity option ${index + 1} must define exercise_id or activity_type.`);
            }
          });
        }
      }

      if (item.audio_sequence && previousAudioSequenceItem?.audio_sequence === item.audio_sequence) {
        const previousExercise = exercises[previousAudioSequenceItem.exercise_id];
        const currentExercise = exercises[item.exercise_id];
        const previousClip = previousExercise?.audio_clip;
        const currentClip = currentExercise?.audio_clip;
        const previousRecording = previousClip?.recording_id || previousClip?.video_id;
        const currentRecording = currentClip?.recording_id || currentClip?.video_id;
        if (!previousClip || !currentClip) {
          errors.push(`Lesson "${lesson.id}" audio sequence "${item.audio_sequence}" requires clips on "${previousAudioSequenceItem.exercise_id}" and "${item.exercise_id}".`);
        } else if (previousRecording !== currentRecording) {
          errors.push(`Lesson "${lesson.id}" audio sequence "${item.audio_sequence}" changes recording between "${previousAudioSequenceItem.exercise_id}" and "${item.exercise_id}".`);
        } else if (Math.abs(previousClip.end_seconds - currentClip.start_seconds) > 0.01) {
          errors.push(`Lesson "${lesson.id}" audio sequence "${item.audio_sequence}" must join "${previousAudioSequenceItem.exercise_id}" end_seconds (${previousClip.end_seconds}) to "${item.exercise_id}" start_seconds (${currentClip.start_seconds}).`);
        }
      }
      previousAudioSequenceItem = item.audio_sequence ? item : null;
    });
  });

  if (errors.length > 0) {
    throw new Error(`Data validation failed:\n${errors.join('\n')}`);
  }
}
