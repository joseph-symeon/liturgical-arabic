import phrases from '../data/phrases.js';
import segments from '../data/segments.js';
import { exerciseDefinitions } from '../data/exercises.js';
import lessons from '../data/lessons.js';
import units from '../data/units.js';
import liturgySections from '../data/liturgySections.js';

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

export function validateData() {
  const errors = [];
  const phraseIds = new Set(Object.keys(phrases));
  const segmentIds = new Set(Object.keys(segments));
  const exerciseIds = new Set(exerciseDefinitions.map(exercise => exercise.id));
  const unitIds = new Set(units.map(unit => unit.id));

  assertUnique(Object.keys(phrases), 'phrases', errors);
  assertUnique(Object.keys(segments), 'segments', errors);
  assertUnique(exerciseDefinitions.map(exercise => exercise.id), 'exerciseDefinitions', errors);
  assertUnique(lessons.map(lesson => lesson.id), 'lessons', errors);
  assertUnique(units.map(unit => unit.id), 'units', errors);

  Object.entries(segments).forEach(([segmentId, segment]) => {
    if (!segment.speaker || !phraseIds.has(segment.speaker)) {
      errors.push(`Segment "${segmentId}" references missing speaker "${segment.speaker}".`);
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

  liturgySections.forEach(section => {
    if (!Array.isArray(section.segment_ids) || section.segment_ids.length === 0) {
      errors.push(`Liturgy section "${section.section}" must define a non-empty segment_ids array.`);
    } else {
      section.segment_ids.forEach(segmentId => {
        if (!segmentIds.has(segmentId)) {
          errors.push(`Liturgy section "${section.section}" references missing segment "${segmentId}".`);
        }
      });
    }
    if (section.section_title_phrase && !phraseIds.has(section.section_title_phrase)) {
      errors.push(`Liturgy section "${section.section}" references missing title phrase "${section.section_title_phrase}".`);
    }
  });

  exerciseDefinitions.forEach(exercise => {
    if (!Array.isArray(exercise.segment_ids) || exercise.segment_ids.length === 0) {
      errors.push(`Exercise "${exercise.id}" must define a non-empty segment_ids array.`);
    } else {
      exercise.segment_ids.forEach(segmentId => {
        if (!segmentIds.has(segmentId)) {
          errors.push(`Exercise "${exercise.id}" references missing segment "${segmentId}".`);
        }
      });
    }
    if (exercise.title_phrase && !phraseIds.has(exercise.title_phrase)) {
      errors.push(`Exercise "${exercise.id}" references missing title phrase "${exercise.title_phrase}".`);
    }
    if (exercise.audio_clip) {
      ['video_id', 'start_seconds', 'end_seconds', 'default_playback_rate'].forEach(field => {
        if (typeof exercise.audio_clip[field] === 'undefined') {
          errors.push(`Exercise "${exercise.id}" audio_clip is missing "${field}".`);
        }
      });
    }
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
    });
  });

  if (errors.length > 0) {
    throw new Error(`Data validation failed:\n${errors.join('\n')}`);
  }
}
