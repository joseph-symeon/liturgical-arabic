import exercises from '../../data/exercises.js';
import phrases from '../../data/phrases.js';

export function getExerciseTitle(lesson, exerciseIndex) {
  const exerciseId = lesson?.exercises?.[exerciseIndex]?.exercise_id;
  const exercise = exerciseId ? exercises[exerciseId] : null;
  const firstLine = [...(exercise?.lines || [])]
    .sort((a, b) => a.line_order - b.line_order)[0];
  const firstPhraseId = [...(firstLine?.phrases || [])]
    .sort((a, b) => a.display_order - b.display_order)
    .find(part => part.phrase_id)?.phrase_id;

  return phrases[firstPhraseId]?.translation || exercise?.title || `Exercise ${exerciseIndex + 1}`;
}

export function getResolvedExerciseTitle(exercise) {
  const firstLine = [...(exercise?.lines || [])]
    .sort((a, b) => a.line_order - b.line_order)[0];
  const firstPhraseId = [...(firstLine?.phrases || [])]
    .sort((a, b) => a.display_order - b.display_order)
    .find(part => part.phrase_id)?.phrase_id;

  return phrases[firstPhraseId]?.translation || exercise?.title;
}
