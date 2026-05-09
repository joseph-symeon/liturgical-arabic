export function getInferredRangeStartSeconds(range) {
  return range?.phrase_timings?.[0]?.start_seconds ?? null;
}

export function getInferredRangeEndSeconds(range) {
  const timings = range?.phrase_timings || [];
  return timings[timings.length - 1]?.end_seconds ?? null;
}

export function getRangeStartSeconds(range) {
  return range?.start_seconds ?? getInferredRangeStartSeconds(range);
}

export function getRangeEndSeconds(range) {
  return range?.end_seconds ?? getInferredRangeEndSeconds(range);
}

export function getRangeBounds(range) {
  const startSeconds = getRangeStartSeconds(range);
  const endSeconds = getRangeEndSeconds(range);
  return typeof startSeconds === "number" && typeof endSeconds === "number"
    ? { start_seconds: startSeconds, end_seconds: endSeconds }
    : null;
}
