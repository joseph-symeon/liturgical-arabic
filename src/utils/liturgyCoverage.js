import phrases from '../data/texts/phrases.js';
import segments from '../data/texts/segments.js';
import serviceTexts from '../data/texts/serviceTexts.js';
import { stripArabicDiacritics } from './arabic.js';

const DEFAULT_THRESHOLDS = [0.5, 0.6, 0.7, 0.8, 0.9, 0.95];
const DEFAULT_EXCLUDED_GROUPS = ['Prothesis'];

function tokenizeArabic(text) {
  return stripArabicDiacritics(text)
    .replace(/[،؛؟.()[\]{}:!"'«»]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

function isExcludedSegment(segmentId, segment) {
  const tags = segment?.tags ?? [];
  return (
    tags.includes('quiet') ||
    tags.includes('rubric') ||
    segmentId.includes('quiet') ||
    segmentId.includes('rubric')
  );
}

function getThresholds(rows, total, metric, thresholds = DEFAULT_THRESHOLDS) {
  const milestones = [];
  let cumulative = 0;
  let thresholdIndex = 0;

  rows.forEach((row, index) => {
    cumulative += row[metric];
    while (thresholdIndex < thresholds.length && cumulative / total >= thresholds[thresholdIndex]) {
      milestones.push({
        coverage: thresholds[thresholdIndex],
        phraseCount: index + 1,
        cumulative
      });
      thresholdIndex += 1;
    }
  });

  return milestones;
}

export function getLiturgyCoverageAnalysis({
  serviceTextId = 'divine-liturgy-john-chrysostom',
  excludedGroups = DEFAULT_EXCLUDED_GROUPS
} = {}) {
  const serviceText = serviceTexts[serviceTextId];
  const phraseRows = new Map();
  let totalPhraseOccurrences = 0;
  let totalTokenOccurrences = 0;
  let countedSegmentRefs = 0;
  let excludedSegmentRefs = 0;

  serviceText.sections.forEach(section => {
    if (excludedGroups.includes(section.section_group)) return;

    (section.segment_ids ?? []).forEach(segmentId => {
      const segment = segments[segmentId];
      if (!segment || isExcludedSegment(segmentId, segment)) {
        excludedSegmentRefs += 1;
        return;
      }

      countedSegmentRefs += 1;

      (segment.phrases ?? []).forEach(part => {
        if (!part.phrase_id) return;
        const phrase = phrases[part.phrase_id];
        if (!phrase) return;
        if ((part.tags ?? []).includes('rubric') || (phrase.tags ?? []).includes('rubric')) return;

        const tokenCount = tokenizeArabic(phrase.arabic ?? '').length;
        totalPhraseOccurrences += 1;
        totalTokenOccurrences += tokenCount;

        const row = phraseRows.get(part.phrase_id) ?? {
          id: part.phrase_id,
          arabic: phrase.arabic ?? '',
          translation: phrase.translation ?? '',
          phraseOccurrences: 0,
          tokenOccurrences: 0,
          tokensPerOccurrence: tokenCount
        };

        row.phraseOccurrences += 1;
        row.tokenOccurrences += tokenCount;
        phraseRows.set(part.phrase_id, row);
      });
    });
  });

  const rows = [...phraseRows.values()];
  const byTokens = [...rows].sort((a, b) =>
    b.tokenOccurrences - a.tokenOccurrences ||
    b.phraseOccurrences - a.phraseOccurrences ||
    a.id.localeCompare(b.id)
  );
  const byPhraseOccurrences = [...rows].sort((a, b) =>
    b.phraseOccurrences - a.phraseOccurrences ||
    b.tokenOccurrences - a.tokenOccurrences ||
    a.id.localeCompare(b.id)
  );

  return {
    serviceTitle: serviceText.title,
    serviceShortTitle: serviceText.short_title,
    totalPhraseOccurrences,
    totalTokenOccurrences,
    uniquePhraseCount: rows.length,
    countedSegmentRefs,
    excludedSegmentRefs,
    tokenMilestones: getThresholds(byTokens, totalTokenOccurrences, 'tokenOccurrences'),
    phraseOccurrenceMilestones: getThresholds(byPhraseOccurrences, totalPhraseOccurrences, 'phraseOccurrences'),
    topByPhraseOccurrences: byPhraseOccurrences.slice(0, 50).map((row, index) => ({
      ...row,
      rank: index + 1,
      tokenCoverage: row.tokenOccurrences / totalTokenOccurrences,
      phraseOccurrenceCoverage: row.phraseOccurrences / totalPhraseOccurrences
    })),
    topByTokenCoverage: byTokens.slice(0, 50).map((row, index) => ({
      ...row,
      rank: index + 1,
      tokenCoverage: row.tokenOccurrences / totalTokenOccurrences,
      phraseOccurrenceCoverage: row.phraseOccurrences / totalPhraseOccurrences
    }))
  };
}
