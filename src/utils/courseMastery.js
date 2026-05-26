import exercises, { getStandardActivityOptions } from '../data/course/exercises.js';
import lessons from '../data/course/lessons.js';
import phrases from '../data/texts/phrases.js';
import segments from '../data/texts/segments.js';
import serviceTexts from '../data/texts/serviceTexts.js';
import { PASSAGE_ACTIVITY_TYPES } from './passageActivities.js';

const DEFAULT_EXCLUDED_GROUPS = ['Prothesis'];

const COMPREHENSION_ACTIVITY_TYPES = new Set([
  PASSAGE_ACTIVITY_TYPES.learn,
  PASSAGE_ACTIVITY_TYPES.matching,
  PASSAGE_ACTIVITY_TYPES.translationDirection,
  PASSAGE_ACTIVITY_TYPES.arrange,
  PASSAGE_ACTIVITY_TYPES.typeEnglish
]);

const RECITATION_ACTIVITY_TYPES = new Set([
  PASSAGE_ACTIVITY_TYPES.readListen,
  PASSAGE_ACTIVITY_TYPES.phraseCaptions,
  PASSAGE_ACTIVITY_TYPES.typeArabic
]);

export const SERVICE_MASTERY_SERVICE_IDS = [
  'divine-liturgy-john-chrysostom',
  'divine-liturgy-basil',
  'great-vespers',
  'thanksgiving-prayers',
  'departed-trisagion-prayers',
  'psalter-psalm-50'
];

function isExcludedSegment(segmentId, segment) {
  const tags = segment?.tags ?? [];
  return (
    tags.includes('quiet') ||
    tags.includes('rubric') ||
    segmentId.includes('quiet') ||
    segmentId.includes('rubric')
  );
}

export function getExercisePhraseIds(exerciseId) {
  return (exercises[exerciseId]?.lines || []).flatMap(line => (
    line.tags?.includes('rubric')
      ? []
      : (line.phrases || [])
        .filter(part => part.phrase_id)
        .map(part => part.phrase_id)
  ));
}

export function getLessonPhraseIds(lesson) {
  return new Set((lesson?.exercises || []).flatMap(item => getExercisePhraseIds(item.exercise_id)));
}

export function getLessonPhraseIdsById(lessonId) {
  return getLessonPhraseIds(lessons.find(lesson => lesson.id === lessonId));
}

export function getCourseItemLessonIds(item) {
  return item.lesson_ids || (item.lesson_id ? [item.lesson_id] : []);
}

export function getCourseItemPhraseIds(item) {
  return new Set(getCourseItemLessonIds(item).flatMap(lessonId => [...getLessonPhraseIdsById(lessonId)]));
}

function getExerciseActivityOptions(item) {
  if (item?.activity_options) return item.activity_options;
  if (item?.activity_policy === 'standard') return getStandardActivityOptions(item.exercise_id);
  return [{
    activity_type: item?.activity_type || PASSAGE_ACTIVITY_TYPES.readListen
  }];
}

function getExerciseMasteryDimensions(item) {
  const activityTypes = getExerciseActivityOptions(item)
    .map(option => option.activity_type)
    .filter(Boolean);

  return {
    comprehension: activityTypes.some(activityType => COMPREHENSION_ACTIVITY_TYPES.has(activityType)),
    recitation: activityTypes.some(activityType => RECITATION_ACTIVITY_TYPES.has(activityType))
  };
}

export function getLessonMasteryPhraseIds(lesson) {
  const mastery = {
    comprehension: new Set(),
    recitation: new Set(),
    all: new Set()
  };

  (lesson?.exercises || []).forEach(item => {
    const phraseIds = getExercisePhraseIds(item.exercise_id);
    const dimensions = getExerciseMasteryDimensions(item);
    phraseIds.forEach(phraseId => {
      mastery.all.add(phraseId);
      if (dimensions.comprehension) mastery.comprehension.add(phraseId);
      if (dimensions.recitation) mastery.recitation.add(phraseId);
    });
  });

  return mastery;
}

export function getLessonMasteryPhraseIdsById(lessonId) {
  return getLessonMasteryPhraseIds(lessons.find(lesson => lesson.id === lessonId));
}

export function mergeMasteryPhraseIds(masteries) {
  const merged = {
    comprehension: new Set(),
    recitation: new Set(),
    all: new Set()
  };

  masteries.forEach(mastery => {
    ['comprehension', 'recitation', 'all'].forEach(key => {
      (mastery?.[key] || []).forEach(phraseId => merged[key].add(phraseId));
    });
  });

  return merged;
}

export function getCourseItemMasteryPhraseIds(item) {
  return mergeMasteryPhraseIds(
    getCourseItemLessonIds(item).map(lessonId => getLessonMasteryPhraseIdsById(lessonId))
  );
}

export function getServicePhraseRows(serviceTextId, { excludedGroups = DEFAULT_EXCLUDED_GROUPS } = {}) {
  const serviceText = serviceTexts[serviceTextId];
  if (!serviceText) return [];

  const phraseRows = new Map();

  serviceText.sections.forEach(section => {
    if (excludedGroups.includes(section.section_group)) return;

    (section.segment_ids ?? []).forEach(segmentId => {
      const segment = segments[segmentId];
      if (!segment || isExcludedSegment(segmentId, segment)) return;

      (segment.phrases ?? []).forEach(part => {
        if (!part.phrase_id) return;
        const phrase = phrases[part.phrase_id];
        if (!phrase) return;
        if ((part.tags ?? []).includes('rubric') || (phrase.tags ?? []).includes('rubric')) return;

        const row = phraseRows.get(part.phrase_id) ?? {
          id: part.phrase_id,
          arabic: phrase.arabic ?? '',
          translation: phrase.translation ?? '',
          phraseOccurrences: 0
        };

        row.phraseOccurrences += 1;
        phraseRows.set(part.phrase_id, row);
      });
    });
  });

  return [...phraseRows.values()];
}

function getKnownPhraseSet(value) {
  return value instanceof Set ? value : new Set(value || []);
}

function getBalancedConfidence(comprehension, recitation) {
  if (comprehension === 0 && recitation === 0) return 0;
  return ((comprehension + recitation) / 2 * 0.8) + (Math.min(comprehension, recitation) * 0.2);
}

export function getServiceMasteryRows(knownPhraseIds, serviceIds = SERVICE_MASTERY_SERVICE_IDS) {
  const known = knownPhraseIds?.all || knownPhraseIds;
  const comprehensionKnown = getKnownPhraseSet(knownPhraseIds?.comprehension || known);
  const recitationKnown = getKnownPhraseSet(knownPhraseIds?.recitation || known);

  return serviceIds
    .map(serviceTextId => {
      const serviceText = serviceTexts[serviceTextId];
      const phraseRows = getServicePhraseRows(serviceTextId);
      const totalWeight = phraseRows.reduce((total, row) => total + row.phraseOccurrences, 0);
      const comprehensionWeight = phraseRows.reduce((total, row) => (
        total + (comprehensionKnown.has(row.id) ? row.phraseOccurrences : 0)
      ), 0);
      const recitationWeight = phraseRows.reduce((total, row) => (
        total + (recitationKnown.has(row.id) ? row.phraseOccurrences : 0)
      ), 0);
      const touchedPhraseIds = new Set([
        ...phraseRows.filter(row => comprehensionKnown.has(row.id)).map(row => row.id),
        ...phraseRows.filter(row => recitationKnown.has(row.id)).map(row => row.id)
      ]);
      const comprehension = totalWeight ? comprehensionWeight / totalWeight : 0;
      const recitation = totalWeight ? recitationWeight / totalWeight : 0;
      const confidence = getBalancedConfidence(comprehension, recitation);

      return {
        id: serviceTextId,
        title: serviceText?.short_title || serviceText?.title || serviceTextId,
        confidence,
        mastery: confidence,
        knownPhraseCount: touchedPhraseIds.size,
        totalPhraseCount: phraseRows.length
      };
    })
    .filter(row => row.totalPhraseCount > 0)
    .sort((a, b) => b.confidence - a.confidence || a.title.localeCompare(b.title));
}

export function getServiceConfidenceRows(phraseConfidenceById = {}, serviceIds = SERVICE_MASTERY_SERVICE_IDS) {
  return serviceIds
    .map(serviceTextId => {
      const serviceText = serviceTexts[serviceTextId];
      const phraseRows = getServicePhraseRows(serviceTextId);
      const totalWeight = phraseRows.reduce((total, row) => total + row.phraseOccurrences, 0);
      const confidenceWeight = phraseRows.reduce((total, row) => (
        total + ((phraseConfidenceById[row.id] || 0) * row.phraseOccurrences)
      ), 0);
      const knownPhraseCount = phraseRows.filter(row => (phraseConfidenceById[row.id] || 0) > 0).length;
      const confidence = totalWeight ? confidenceWeight / totalWeight : 0;

      return {
        id: serviceTextId,
        title: serviceText?.short_title || serviceText?.title || serviceTextId,
        confidence,
        mastery: confidence,
        knownPhraseCount,
        totalPhraseCount: phraseRows.length
      };
    })
    .filter(row => row.totalPhraseCount > 0)
    .sort((a, b) => b.confidence - a.confidence || a.title.localeCompare(b.title));
}

export function getPhraseCountLabel(count) {
  return `${count.toLocaleString()} ${count === 1 ? 'phrase' : 'phrases'}`;
}
