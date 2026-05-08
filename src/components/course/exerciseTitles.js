import exercises from '../../data/course/exercises.js';
import phrases from '../../data/texts/phrases.js';

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
  return firstTitle || null;
}

function capitalizeFirstLetter(title) {
  if (!title) return title;
  return title.charAt(0).toUpperCase() + title.slice(1);
}

export function getExerciseTitle(lesson, exerciseIndex) {
  const exerciseItem = lesson?.exercises?.[exerciseIndex];
  const exerciseId = exerciseItem?.exercise_id;
  const exercise = exerciseId ? exercises[exerciseId] : null;
  const isFinalExercise = exerciseIndex === (lesson?.exercises?.length ?? 0) - 1;

  return capitalizeFirstLetter(
    exerciseItem?.title || (isFinalExercise ? lesson?.title : null) || getGeneratedExerciseTitle(exercise) || `Exercise ${exerciseIndex + 1}`
  );
}

export function getResolvedExerciseTitle(exercise) {
  return capitalizeFirstLetter(getGeneratedExerciseTitle(exercise));
}
