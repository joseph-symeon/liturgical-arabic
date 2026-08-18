export function parseExerciseRange(value) {
  const [startValue, endValue = startValue] = String(value || '1').split('-');
  const startNumber = Number(startValue);
  const endNumber = Number(endValue);
  const startIndex = Number.isInteger(startNumber) && startNumber > 0 ? startNumber - 1 : 0;
  const endIndex = Number.isInteger(endNumber) && endNumber > 0
    ? Math.max(startIndex, endNumber - 1)
    : startIndex;
  return { startIndex, endIndex };
}

export function formatExerciseRange(range) {
  return range.endIndex > range.startIndex
    ? `${range.startIndex + 1}-${range.endIndex + 1}`
    : `${range.startIndex + 1}`;
}

export function normalizeExerciseRange(startIndex, endIndex, itemCount) {
  const lastIndex = Math.max(0, itemCount - 1);
  const normalizedStart = Number.isInteger(startIndex)
    ? Math.max(0, Math.min(startIndex, lastIndex))
    : 0;
  const normalizedEnd = Number.isInteger(endIndex)
    ? Math.max(normalizedStart, Math.min(endIndex, lastIndex))
    : normalizedStart;

  return { startIndex: normalizedStart, endIndex: normalizedEnd };
}

export function canUpdateExerciseRange(range, exerciseIndex) {
  const { startIndex, endIndex } = range;
  if (startIndex === endIndex) return true;
  return exerciseIndex === startIndex - 1
    || exerciseIndex === startIndex
    || exerciseIndex === endIndex
    || exerciseIndex === endIndex + 1;
}

export function updateExerciseRange(range, exerciseIndex) {
  const { startIndex, endIndex } = range;

  if (startIndex === endIndex) {
    if (exerciseIndex === startIndex) return range;
    if (exerciseIndex === startIndex - 1) return { startIndex: exerciseIndex, endIndex };
    if (exerciseIndex === endIndex + 1) return { startIndex, endIndex: exerciseIndex };
    return { startIndex: exerciseIndex, endIndex: exerciseIndex };
  }

  if (exerciseIndex === startIndex - 1) return { startIndex: exerciseIndex, endIndex };
  if (exerciseIndex === endIndex + 1) return { startIndex, endIndex: exerciseIndex };
  if (exerciseIndex === startIndex) return { startIndex: startIndex + 1, endIndex };
  if (exerciseIndex === endIndex) return { startIndex, endIndex: endIndex - 1 };
  return range;
}
