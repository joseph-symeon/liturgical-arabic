export function getIndexedServiceRangeKey(range) {
  if (!range?.start || !range?.end) return '';
  return `${range.start.section_index}:${range.start.segment_index}-${range.end.section_index}:${range.end.segment_index}`;
}

export function resolveServiceRange(serviceText, range) {
  if (!serviceText || !range) return null;

  if (range.start && range.end) {
    const { start, end } = range;
    if (
      !Number.isInteger(start.section_index)
      || !Number.isInteger(start.segment_index)
      || !Number.isInteger(end.section_index)
      || !Number.isInteger(end.segment_index)
      || start.section_index !== end.section_index
    ) {
      return null;
    }

    const section = serviceText.sections?.[start.section_index];
    if (
      !section
      || start.segment_index < 0
      || end.segment_index < start.segment_index
      || end.segment_index >= section.segment_ids.length
    ) {
      return null;
    }

    return {
      start: { ...start },
      end: { ...end },
      segment_ids: section.segment_ids.slice(start.segment_index, end.segment_index + 1)
    };
  }

  if (!range.start_segment_id || !range.end_segment_id) return null;

  const occurrenceIndex = range.occurrence_index ?? 0;
  let currentOccurrence = 0;

  for (let sectionIndex = 0; sectionIndex < (serviceText.sections || []).length; sectionIndex += 1) {
    const section = serviceText.sections[sectionIndex];
    const ids = section.segment_ids || [];

    for (let startIndex = 0; startIndex < ids.length; startIndex += 1) {
      if (ids[startIndex] !== range.start_segment_id) continue;

      for (let endIndex = startIndex; endIndex < ids.length; endIndex += 1) {
        if (ids[endIndex] !== range.end_segment_id) continue;
        if (currentOccurrence === occurrenceIndex) {
          return {
            start: { section_index: sectionIndex, segment_index: startIndex },
            end: { section_index: sectionIndex, segment_index: endIndex },
            segment_ids: ids.slice(startIndex, endIndex + 1)
          };
        }
        currentOccurrence += 1;
      }
    }
  }

  return null;
}

export function getServiceRangeKey(serviceText, range) {
  const resolvedRange = resolveServiceRange(serviceText, range);
  return resolvedRange ? getIndexedServiceRangeKey(resolvedRange) : '';
}
