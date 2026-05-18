import exercises from '../../data/course/exercises.js';
import phrases from '../../data/texts/phrases.js';

function getOrderedLines(exercise) {
  return [...(exercise?.lines || [])].sort((a, b) => a.line_order - b.line_order);
}

function getPhraseTranslations(line) {
  return [...(line?.phrases || [])]
    .sort((a, b) => a.display_order - b.display_order)
    .map(part => phrases[part.phrase_id]?.translation)
    .filter(Boolean);
}

function isOneWord(title) {
  return title.trim().split(/\s+/).length === 1;
}

function getGeneratedExerciseTitle(exercise) {
  const lines = getOrderedLines(exercise);
  const [firstTitle, secondTitle] = getPhraseTranslations(lines[0]);

  if (firstTitle && secondTitle && isOneWord(firstTitle)) {
    return `${firstTitle} ${secondTitle}`;
  }

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
