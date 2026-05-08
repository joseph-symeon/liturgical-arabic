import phrases from '../data/texts/phrases.js';
import segments from '../data/texts/segments.js';
import { exerciseDefinitions } from '../data/course/exercises.js';
import lessons from '../data/course/lessons.js';
import units from '../data/course/units.js';
import { serviceTextDefinitions } from '../data/texts/serviceTexts.js';
import recordings from '../data/media/recordings.js';
import { alignmentDefinitions } from '../data/media/alignments.js';
import { activityDefinitions } from '../data/course/activities.js';

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

function findAlignmentMatch(alignment, segmentIds) {
  const segmentKey = getSegmentKey(segmentIds);
  return alignment?.matches?.find(match => getSegmentKey(match.segment_ids) === segmentKey);
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
  const activityIds = new Set(activityDefinitions.map(activity => activity.id));
  const serviceTextIds = new Set(serviceTextDefinitions.map(serviceText => serviceText.id));

  assertUnique(Object.keys(phrases), 'phrases', errors);
  assertUnique(Object.keys(segments), 'segments', errors);
  assertUnique(exerciseDefinitions.map(exercise => exercise.id), 'exerciseDefinitions', errors);
  assertUnique(lessons.map(lesson => lesson.id), 'lessons', errors);
  assertUnique(units.map(unit => unit.id), 'units', errors);
  assertUnique(alignmentDefinitions.map(alignment => alignment.id), 'alignments', errors);
  assertUnique(serviceTextDefinitions.map(serviceText => serviceText.id), 'serviceTexts', errors);
  assertUnique(activityDefinitions.map(activity => activity.id), 'activities', errors);

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

  activityDefinitions.forEach(activity => {
    if (!activity.type) {
      errors.push(`Activity "${activity.id}" is missing "type".`);
    }
    if (!Array.isArray(activity.target?.segment_ids) || activity.target.segment_ids.length === 0) {
      errors.push(`Activity "${activity.id}" must define target.segment_ids.`);
    } else {
      activity.target.segment_ids.forEach(segmentId => {
        if (!segmentIds.has(segmentId)) {
          errors.push(`Activity "${activity.id}" references missing segment "${segmentId}".`);
        }
      });
    }
    if (activity.media) {
      const alignment = activity.media.alignment_id ? alignmentsById[activity.media.alignment_id] : null;
      if (!activity.media.recording_id) {
        errors.push(`Activity "${activity.id}" media is missing "recording_id".`);
      } else if (!recordingIds.has(activity.media.recording_id)) {
        errors.push(`Activity "${activity.id}" media references missing recording "${activity.media.recording_id}".`);
      }
      if (activity.media.alignment_id && !alignmentIds.has(activity.media.alignment_id)) {
        errors.push(`Activity "${activity.id}" media references missing alignment "${activity.media.alignment_id}".`);
      }
      if (alignment && activity.media.recording_id && alignment.recording_id !== activity.media.recording_id) {
        errors.push(`Activity "${activity.id}" media recording does not match alignment "${activity.media.alignment_id}".`);
      }
      if (alignment && !findAlignmentMatch(alignment, activity.target?.segment_ids)) {
        errors.push(`Activity "${activity.id}" target.segment_ids do not match alignment "${activity.media.alignment_id}".`);
      }
      if (activity.type === 'synced-caption' && alignment) {
        const match = findAlignmentMatch(alignment, activity.target?.segment_ids);
        if (!Array.isArray(match?.phrase_timings) || match.phrase_timings.length === 0) {
          errors.push(`Activity "${activity.id}" requires phrase_timings on alignment "${activity.media.alignment_id}".`);
        }
      }
    }
    if (activity.captions) {
      if (!Array.isArray(activity.captions) || activity.captions.length === 0) {
        errors.push(`Activity "${activity.id}" captions must be a non-empty array when present.`);
      } else {
        activity.captions.forEach((caption, index) => {
          if (!caption.phrase_id || !phraseIds.has(caption.phrase_id)) {
            errors.push(`Activity "${activity.id}" caption ${index + 1} references missing phrase "${caption.phrase_id}".`);
          }
          if (typeof caption.start_seconds !== 'number' || typeof caption.end_seconds !== 'number') {
            errors.push(`Activity "${activity.id}" caption ${index + 1} must define numeric start_seconds and end_seconds.`);
          } else if (caption.end_seconds <= caption.start_seconds) {
            errors.push(`Activity "${activity.id}" caption ${index + 1} must end after it starts.`);
          }
        });
      }
    }
  });

  exerciseDefinitions.forEach(exercise => {
    if (exercise.activity_id && !activityIds.has(exercise.activity_id)) {
      errors.push(`Exercise "${exercise.id}" references missing activity "${exercise.activity_id}".`);
    }
    if (!exercise.activity_id && (!Array.isArray(exercise.segment_ids) || exercise.segment_ids.length === 0)) {
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
  });

  alignmentDefinitions.forEach(alignment => {
    if (alignment.service_text_id && !serviceTextIds.has(alignment.service_text_id)) {
      errors.push(`Alignment "${alignment.id}" references missing service text "${alignment.service_text_id}".`);
    }
    if (!recordingIds.has(alignment.recording_id)) {
      errors.push(`Alignment "${alignment.id}" references missing recording "${alignment.recording_id}".`);
    }
    if (!Array.isArray(alignment.matches) || alignment.matches.length === 0) {
      errors.push(`Alignment "${alignment.id}" must define a non-empty matches array.`);
      return;
    }
    alignment.matches.forEach((match, index) => {
      if (!Array.isArray(match.segment_ids) || match.segment_ids.length === 0) {
        errors.push(`Alignment "${alignment.id}" match ${index + 1} must define segment_ids.`);
      } else {
        match.segment_ids.forEach(segmentId => {
          if (!segmentIds.has(segmentId)) {
            errors.push(`Alignment "${alignment.id}" references missing segment "${segmentId}".`);
          }
        });
      }
      if (typeof match.start_seconds !== 'number' || typeof match.end_seconds !== 'number') {
        errors.push(`Alignment "${alignment.id}" match ${index + 1} must define numeric start_seconds and end_seconds.`);
      } else if (match.end_seconds <= match.start_seconds) {
        errors.push(`Alignment "${alignment.id}" match ${index + 1} must end after it starts.`);
      }
      if (match.phrase_timings) {
        if (!Array.isArray(match.phrase_timings)) {
          errors.push(`Alignment "${alignment.id}" match ${index + 1} phrase_timings must be an array.`);
        } else {
          match.phrase_timings.forEach((timing, timingIndex) => {
            if (!timing.phrase_id || !phraseIds.has(timing.phrase_id)) {
              errors.push(`Alignment "${alignment.id}" match ${index + 1} phrase timing ${timingIndex + 1} references missing phrase "${timing.phrase_id}".`);
            }
            if (typeof timing.start_seconds !== 'number' || typeof timing.end_seconds !== 'number') {
              errors.push(`Alignment "${alignment.id}" match ${index + 1} phrase timing ${timingIndex + 1} must define numeric start_seconds and end_seconds.`);
            } else if (timing.end_seconds <= timing.start_seconds) {
              errors.push(`Alignment "${alignment.id}" match ${index + 1} phrase timing ${timingIndex + 1} must end after it starts.`);
            } else if (typeof match.start_seconds === 'number' && typeof match.end_seconds === 'number' && (timing.start_seconds < match.start_seconds || timing.end_seconds > match.end_seconds)) {
              errors.push(`Alignment "${alignment.id}" match ${index + 1} phrase timing ${timingIndex + 1} must stay inside the match time range.`);
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
    (lesson.exercises || []).forEach(item => {
      if (!exerciseIds.has(item.exercise_id)) {
        errors.push(`Lesson "${lesson.id}" references missing exercise "${item.exercise_id}".`);
      }
      if (item.activity_options) {
        if (!Array.isArray(item.activity_options) || item.activity_options.length === 0) {
          errors.push(`Lesson "${lesson.id}" exercise "${item.exercise_id}" activity_options must be a non-empty array when present.`);
        } else {
          item.activity_options.forEach((option, index) => {
            if (!option.label) {
              errors.push(`Lesson "${lesson.id}" exercise "${item.exercise_id}" activity option ${index + 1} is missing "label".`);
            }
            if (!exerciseIds.has(option.exercise_id)) {
              errors.push(`Lesson "${lesson.id}" exercise "${item.exercise_id}" activity option ${index + 1} references missing exercise "${option.exercise_id}".`);
            }
          });
        }
      }
    });
  });

  if (errors.length > 0) {
    throw new Error(`Data validation failed:\n${errors.join('\n')}`);
  }
}
