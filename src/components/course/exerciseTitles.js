import exercises from '../../data/exercises.js';
import phrases from '../../data/phrases.js';

function getOrderedLines(exercise) {
  return [...(exercise?.lines || [])].sort((a, b) => a.line_order - b.line_order);
}

function getFirstPhraseTranslation(line) {
  const firstPhraseId = [...(line?.phrases || [])]
    .sort((a, b) => a.display_order - b.display_order)
    .find(part => part.phrase_id)?.phrase_id;

  return phrases[firstPhraseId]?.translation;
}

function getGeneratedExerciseTitle(exercise) {
  const lines = getOrderedLines(exercise);
  const firstTitle = getFirstPhraseTranslation(lines[0]);
  if (!firstTitle) return null;

  if (lines.length <= 1) return firstTitle;

  const lastTitle = getFirstPhraseTranslation(lines[lines.length - 1]);
  if (!lastTitle || lastTitle === firstTitle) return `${firstTitle}...`;

  return `${firstTitle}... ${lastTitle}...`;
}

export function getExerciseTitle(lesson, exerciseIndex) {
  const exerciseId = lesson?.exercises?.[exerciseIndex]?.exercise_id;
  const exercise = exerciseId ? exercises[exerciseId] : null;

  return exercise?.title || getGeneratedExerciseTitle(exercise) || `Exercise ${exerciseIndex + 1}`;
}

export function getResolvedExerciseTitle(exercise) {
  return exercise?.title || getGeneratedExerciseTitle(exercise);
}
