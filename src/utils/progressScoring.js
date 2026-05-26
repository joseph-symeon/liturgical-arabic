export const COMPREHENSION_ATTEMPT_TYPES = {
  matchingBlock: 'matching-block',
  multipleChoiceEnglish: 'multiple-choice-english',
  multipleChoiceArabic: 'multiple-choice-arabic',
  writtenEnglish: 'written-english',
  writtenArabic: 'written-arabic',
  arrangeBlock: 'arrange-block'
};

const STORAGE_KEY = 'liturgical-arabic:phrase-progress:v2';
export const PHRASE_PROGRESS_EVENT = 'liturgical-arabic:phrase-progress-updated';
const PROGRESS_VERSION = 2;
const OVERALL_COMPREHENSION_WEIGHT = 0.55;
const OVERALL_RECITATION_WEIGHT = 0.45;
const RECITATION_REPETITION_CURVE = 36;
const RECITATION_TRACE_BONUS = 0.04;
const RECITATION_TRACE_BONUS_CAP = 0.15;
let progressTrackingEnabled = false;

const COMPREHENSION_ATTEMPT_WEIGHTS = {
  [COMPREHENSION_ATTEMPT_TYPES.matchingBlock]: 0.08,
  [COMPREHENSION_ATTEMPT_TYPES.arrangeBlock]: 0.1,
  [COMPREHENSION_ATTEMPT_TYPES.multipleChoiceEnglish]: 0.13,
  [COMPREHENSION_ATTEMPT_TYPES.multipleChoiceArabic]: 0.2,
  [COMPREHENSION_ATTEMPT_TYPES.writtenEnglish]: 0.32,
  [COMPREHENSION_ATTEMPT_TYPES.writtenArabic]: 0.46
};

function clamp01(value) {
  return Math.max(0, Math.min(1, value));
}

function getTodayKey(timestamp = Date.now()) {
  return new Date(timestamp).toISOString().slice(0, 10);
}

function getEmptyProgress() {
  return {
    version: PROGRESS_VERSION,
    phrases: {}
  };
}

export function getBlankPhraseProgress() {
  return getEmptyProgress();
}

export function setProgressTrackingEnabled(enabled) {
  const nextEnabled = Boolean(enabled);
  if (progressTrackingEnabled === nextEnabled) return;
  progressTrackingEnabled = nextEnabled;
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(PHRASE_PROGRESS_EVENT, {
      detail: { trackingEnabled: progressTrackingEnabled }
    }));
  }
}

export function isProgressTrackingEnabled() {
  return progressTrackingEnabled;
}

function getEmptyComprehensionProgress() {
  return {
    confidence: 0,
    attempts: 0,
    correct: 0,
    last_attempt_type: null,
    last_result: null,
    last_practiced_at: null,
    last_practiced_day: null,
    attempts_today: 0
  };
}

function getEmptyRecitationProgress() {
  return {
    confidence: 0,
    meaningful_repetitions: 0,
    correct_traces: 0,
    last_activity_type: null,
    last_result: null,
    last_practiced_at: null,
    last_practiced_day: null,
    repetitions_today: 0,
    traces_today: 0
  };
}

function calculateRecitationConfidence(recitation = {}) {
  const meaningfulRepetitions = Math.max(0, recitation.meaningful_repetitions || 0);
  const correctTraces = Math.max(0, recitation.correct_traces || 0);
  const repetitionConfidence = 1 - Math.exp(-meaningfulRepetitions / RECITATION_REPETITION_CURVE);
  const traceBonus = Math.min(RECITATION_TRACE_BONUS_CAP, correctTraces * RECITATION_TRACE_BONUS);
  return clamp01(repetitionConfidence + traceBonus);
}

function calculateOverallConfidence(phraseProgress = {}) {
  return clamp01(
    ((phraseProgress.comprehension?.confidence || 0) * OVERALL_COMPREHENSION_WEIGHT)
      + ((phraseProgress.recitation?.confidence || 0) * OVERALL_RECITATION_WEIGHT)
  );
}

function migrateComprehensionProgress(phraseProgress = {}) {
  const source = phraseProgress.comprehension && typeof phraseProgress.comprehension === 'object'
    ? phraseProgress.comprehension
    : phraseProgress;

  return {
    ...getEmptyComprehensionProgress(),
    confidence: clamp01(source.confidence ?? source.comprehension_confidence ?? 0),
    attempts: source.attempts ?? source.comprehension_attempts ?? 0,
    correct: source.correct ?? source.comprehension_correct ?? 0,
    last_attempt_type: source.last_attempt_type ?? null,
    last_result: typeof source.last_result === 'boolean' ? source.last_result : null,
    last_practiced_at: source.last_practiced_at ?? null,
    last_practiced_day: source.last_practiced_day ?? null,
    attempts_today: source.attempts_today ?? 0
  };
}

function migrateRecitationProgress(phraseProgress = {}) {
  const source = phraseProgress.recitation && typeof phraseProgress.recitation === 'object'
    ? phraseProgress.recitation
    : {};
  const recitation = {
    ...getEmptyRecitationProgress(),
    meaningful_repetitions: source.meaningful_repetitions ?? 0,
    correct_traces: source.correct_traces ?? 0,
    last_activity_type: source.last_activity_type ?? null,
    last_result: typeof source.last_result === 'boolean' ? source.last_result : null,
    last_practiced_at: source.last_practiced_at ?? null,
    last_practiced_day: source.last_practiced_day ?? null,
    repetitions_today: source.repetitions_today ?? 0,
    traces_today: source.traces_today ?? 0
  };

  return {
    ...recitation,
    confidence: calculateRecitationConfidence(recitation)
  };
}

function migratePhraseProgress(phraseProgress = {}) {
  const comprehension = migrateComprehensionProgress(phraseProgress);
  const recitation = migrateRecitationProgress(phraseProgress);
  const lastPracticedAt = Math.max(
    comprehension.last_practiced_at || 0,
    recitation.last_practiced_at || 0
  ) || null;
  const migrated = {
    comprehension,
    recitation,
    last_practiced_at: phraseProgress.last_practiced_at ?? lastPracticedAt
  };

  return {
    ...migrated,
    overall_confidence: calculateOverallConfidence(migrated)
  };
}

function migrateProgress(progress) {
  if (!progress || typeof progress !== 'object') return getEmptyProgress();
  const phrases = progress.phrases && typeof progress.phrases === 'object'
    ? Object.fromEntries(
      Object.entries(progress.phrases).map(([phraseId, phraseProgress]) => [
        phraseId,
        migratePhraseProgress(phraseProgress)
      ])
    )
    : {};

  return {
    version: PROGRESS_VERSION,
    phrases
  };
}

export function getStoredPhraseProgress() {
  if (typeof window === 'undefined') return getEmptyProgress();
  try {
    const storedProgress = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || 'null');
    return migrateProgress(storedProgress);
  } catch {
    return getEmptyProgress();
  }
}

function storePhraseProgress(progress) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function replaceStoredPhraseProgress(progress) {
  const nextProgress = migrateProgress(progress);
  storePhraseProgress(nextProgress);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(PHRASE_PROGRESS_EVENT, {
      detail: { progress: nextProgress }
    }));
  }
  return nextProgress;
}

export function mergePhraseProgress(firstProgress, secondProgress) {
  const first = migrateProgress(firstProgress);
  const second = migrateProgress(secondProgress);
  const phraseIds = new Set([
    ...Object.keys(first.phrases),
    ...Object.keys(second.phrases)
  ]);
  const phrases = {};

  phraseIds.forEach(phraseId => {
    const firstPhrase = first.phrases[phraseId];
    const secondPhrase = second.phrases[phraseId];
    if (!firstPhrase) {
      phrases[phraseId] = secondPhrase;
      return;
    }
    if (!secondPhrase) {
      phrases[phraseId] = firstPhrase;
      return;
    }

    const comprehension = (secondPhrase.comprehension?.last_practiced_at || 0) > (firstPhrase.comprehension?.last_practiced_at || 0)
      ? secondPhrase.comprehension
      : firstPhrase.comprehension;
    const recitation = (secondPhrase.recitation?.last_practiced_at || 0) > (firstPhrase.recitation?.last_practiced_at || 0)
      ? secondPhrase.recitation
      : firstPhrase.recitation;
    const mergedPhrase = {
      comprehension,
      recitation,
      last_practiced_at: Math.max(firstPhrase.last_practiced_at || 0, secondPhrase.last_practiced_at || 0) || null
    };
    phrases[phraseId] = {
      ...mergedPhrase,
      overall_confidence: calculateOverallConfidence(mergedPhrase)
    };
  });

  return {
    version: PROGRESS_VERSION,
    phrases
  };
}

function getCorrectGainMultiplier(comprehensionProgress, todayKey) {
  const attemptsToday = comprehensionProgress.last_practiced_day === todayKey ? comprehensionProgress.attempts_today || 0 : 0;
  if (comprehensionProgress.last_result === false) return 0.35;
  if (attemptsToday > 0) return 0.45;
  return 1;
}

export function applyComprehensionAttempt(phraseProgress = {}, attempt) {
  const migratedProgress = migratePhraseProgress(phraseProgress);
  const comprehensionProgress = migratedProgress.comprehension;
  const weight = COMPREHENSION_ATTEMPT_WEIGHTS[attempt.type] ?? 0.1;
  const currentConfidence = clamp01(comprehensionProgress.confidence || 0);
  const timestamp = attempt.timestamp || Date.now();
  const todayKey = getTodayKey(timestamp);
  const attemptsToday = comprehensionProgress.last_practiced_day === todayKey ? comprehensionProgress.attempts_today || 0 : 0;
  const isCorrect = Boolean(attempt.correct);
  const correctGainMultiplier = getCorrectGainMultiplier(comprehensionProgress, todayKey);
  const nextConfidence = isCorrect
    ? currentConfidence + ((1 - currentConfidence) * weight * correctGainMultiplier)
    : currentConfidence - ((0.05 + weight * 0.55) * (0.75 + currentConfidence * 0.5));

  const nextProgress = {
    ...migratedProgress,
    comprehension: {
      ...comprehensionProgress,
      confidence: clamp01(nextConfidence),
      attempts: (comprehensionProgress.attempts || 0) + 1,
      correct: (comprehensionProgress.correct || 0) + (isCorrect ? 1 : 0),
      last_attempt_type: attempt.type,
      last_result: isCorrect,
      last_practiced_at: timestamp,
      last_practiced_day: todayKey,
      attempts_today: attemptsToday + 1
    },
    last_practiced_at: Math.max(timestamp, migratedProgress.last_practiced_at || 0)
  };

  return {
    ...nextProgress,
    overall_confidence: calculateOverallConfidence(nextProgress)
  };
}

export function recordComprehensionAttempt({ phraseId, type, correct, timestamp = Date.now() }) {
  if (!isProgressTrackingEnabled()) return null;
  if (!phraseId) return null;
  const progress = getStoredPhraseProgress();
  const previousPhraseProgress = progress.phrases[phraseId] || {};
  const nextPhraseProgress = applyComprehensionAttempt(previousPhraseProgress, {
    type,
    correct,
    timestamp
  });
  const nextProgress = {
    ...progress,
    phrases: {
      ...progress.phrases,
      [phraseId]: nextPhraseProgress
    }
  };
  storePhraseProgress(nextProgress);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(PHRASE_PROGRESS_EVENT, {
      detail: { phraseId, phraseProgress: nextPhraseProgress, progress: nextProgress }
    }));
  }
  return nextPhraseProgress;
}

export function applyRecitationRepetition(phraseProgress = {}, attempt = {}) {
  const migratedProgress = migratePhraseProgress(phraseProgress);
  const recitationProgress = migratedProgress.recitation;
  const timestamp = attempt.timestamp || Date.now();
  const todayKey = getTodayKey(timestamp);
  const repetitionsToday = recitationProgress.last_practiced_day === todayKey ? recitationProgress.repetitions_today || 0 : 0;
  const nextRecitation = {
    ...recitationProgress,
    meaningful_repetitions: (recitationProgress.meaningful_repetitions || 0) + 1,
    last_activity_type: attempt.activityType || recitationProgress.last_activity_type,
    last_result: true,
    last_practiced_at: timestamp,
    last_practiced_day: todayKey,
    repetitions_today: repetitionsToday + 1
  };
  const nextProgress = {
    ...migratedProgress,
    recitation: {
      ...nextRecitation,
      confidence: calculateRecitationConfidence(nextRecitation)
    },
    last_practiced_at: Math.max(timestamp, migratedProgress.last_practiced_at || 0)
  };

  return {
    ...nextProgress,
    overall_confidence: calculateOverallConfidence(nextProgress)
  };
}

export function applyRecitationTrace(phraseProgress = {}, attempt = {}) {
  const migratedProgress = migratePhraseProgress(phraseProgress);
  const recitationProgress = migratedProgress.recitation;
  const timestamp = attempt.timestamp || Date.now();
  const todayKey = getTodayKey(timestamp);
  const tracesToday = recitationProgress.last_practiced_day === todayKey ? recitationProgress.traces_today || 0 : 0;
  const isCorrect = Boolean(attempt.correct);
  const nextRecitation = {
    ...recitationProgress,
    correct_traces: (recitationProgress.correct_traces || 0) + (isCorrect ? 1 : 0),
    last_activity_type: attempt.activityType || recitationProgress.last_activity_type,
    last_result: isCorrect,
    last_practiced_at: timestamp,
    last_practiced_day: todayKey,
    traces_today: tracesToday + 1
  };
  const nextProgress = {
    ...migratedProgress,
    recitation: {
      ...nextRecitation,
      confidence: calculateRecitationConfidence(nextRecitation)
    },
    last_practiced_at: Math.max(timestamp, migratedProgress.last_practiced_at || 0)
  };

  return {
    ...nextProgress,
    overall_confidence: calculateOverallConfidence(nextProgress)
  };
}

function recordPhraseRecitation({ phraseId, timestamp, applyAttempt }) {
  if (!phraseId) return null;
  const progress = getStoredPhraseProgress();
  const previousPhraseProgress = progress.phrases[phraseId] || {};
  const nextPhraseProgress = applyAttempt(previousPhraseProgress);
  const nextProgress = {
    ...progress,
    phrases: {
      ...progress.phrases,
      [phraseId]: nextPhraseProgress
    }
  };
  storePhraseProgress(nextProgress);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(PHRASE_PROGRESS_EVENT, {
      detail: { phraseId, phraseProgress: nextPhraseProgress, progress: nextProgress }
    }));
  }
  return nextPhraseProgress;
}

export function recordRecitationRepetition({ phraseId, activityType, timestamp = Date.now() }) {
  if (!isProgressTrackingEnabled()) return null;
  return recordPhraseRecitation({
    phraseId,
    timestamp,
    applyAttempt: phraseProgress => applyRecitationRepetition(phraseProgress, {
      activityType,
      timestamp
    })
  });
}

export function recordRecitationTrace({ phraseIds, activityType, correct, timestamp = Date.now() }) {
  if (!isProgressTrackingEnabled()) return [];
  const uniquePhraseIds = [...new Set((phraseIds || []).filter(Boolean))];
  if (uniquePhraseIds.length === 0) return [];
  const progress = getStoredPhraseProgress();
  const nextPhrases = { ...progress.phrases };
  const results = uniquePhraseIds.map(phraseId => {
    const nextPhraseProgress = applyRecitationTrace(nextPhrases[phraseId] || {}, {
      activityType,
      correct,
      timestamp
    });
    nextPhrases[phraseId] = nextPhraseProgress;
    return [phraseId, nextPhraseProgress];
  });
  const nextProgress = {
    ...progress,
    phrases: nextPhrases
  };
  storePhraseProgress(nextProgress);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(PHRASE_PROGRESS_EVENT, {
      detail: { phraseIds: uniquePhraseIds, phraseProgressById: Object.fromEntries(results), progress: nextProgress }
    }));
  }
  return results;
}

export function getStoredPhraseConfidenceMap() {
  if (!isProgressTrackingEnabled()) return {};
  const progress = getStoredPhraseProgress();
  return Object.fromEntries(
    Object.entries(progress.phrases).map(([phraseId, phraseProgress]) => [
      phraseId,
      clamp01(phraseProgress.overall_confidence || 0)
    ])
  );
}

export function getStoredPhraseProgressDimensionMaps() {
  if (!isProgressTrackingEnabled()) {
    return {
      overall: {},
      comprehension: {},
      recitation: {}
    };
  }
  const progress = getStoredPhraseProgress();
  return {
    overall: Object.fromEntries(
      Object.entries(progress.phrases).map(([phraseId, phraseProgress]) => [
        phraseId,
        clamp01(phraseProgress.overall_confidence || 0)
      ])
    ),
    comprehension: Object.fromEntries(
      Object.entries(progress.phrases).map(([phraseId, phraseProgress]) => [
        phraseId,
        clamp01(phraseProgress.comprehension?.confidence || 0)
      ])
    ),
    recitation: Object.fromEntries(
      Object.entries(progress.phrases).map(([phraseId, phraseProgress]) => [
        phraseId,
        clamp01(phraseProgress.recitation?.confidence || 0)
      ])
    )
  };
}

export function getComprehensionAttemptType({ questionType, direction, activityType }) {
  if (activityType === 'matching') return COMPREHENSION_ATTEMPT_TYPES.matchingBlock;
  if (activityType === 'arrange') return COMPREHENSION_ATTEMPT_TYPES.arrangeBlock;
  if (questionType === 'multiple-choice') {
    return direction === 'english-to-arabic'
      ? COMPREHENSION_ATTEMPT_TYPES.multipleChoiceArabic
      : COMPREHENSION_ATTEMPT_TYPES.multipleChoiceEnglish;
  }
  if (questionType === 'written') {
    return direction === 'english-to-arabic'
      ? COMPREHENSION_ATTEMPT_TYPES.writtenArabic
      : COMPREHENSION_ATTEMPT_TYPES.writtenEnglish;
  }
  return COMPREHENSION_ATTEMPT_TYPES.matchingBlock;
}
