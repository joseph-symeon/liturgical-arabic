export const COMPREHENSION_ATTEMPT_TYPES = {
  matchingBlock: 'matching-block',
  multipleChoiceEnglish: 'multiple-choice-english',
  multipleChoiceArabic: 'multiple-choice-arabic',
  writtenEnglish: 'written-english',
  writtenArabic: 'written-arabic',
  arrangeBlock: 'arrange-block'
};

const STORAGE_KEY = 'liturgical-arabic:phrase-progress:v2';
const PREVIEW_STORAGE_KEY = 'liturgical-arabic:preview-phrase-progress:v1';
export const PHRASE_PROGRESS_EVENT = 'liturgical-arabic:phrase-progress-updated';
export const PROGRESS_TRACKING_MODES = {
  account: 'account',
  preview: 'preview',
  disabled: 'disabled'
};
const PROGRESS_VERSION = 2;
const OVERALL_COMPREHENSION_WEIGHT = 0.55;
const OVERALL_RECITATION_WEIGHT = 0.45;
const DAY_MS = 24 * 60 * 60 * 1000;
const RECITATION_REPETITION_TARGET = 240;
const RECITATION_REPETITION_WARMUP_MIDPOINT = 80;
const RECITATION_REPETITION_WARMUP_STEEPNESS = 0.055;
const RECITATION_REPETITION_WARMUP_FLOOR = 0.8;
const RECITATION_DEFAULT_SPACING_HORIZON_DAYS = 30;
const RECITATION_MIN_SPACING_HORIZON_DAYS = 2;
const RECITATION_SHORT_UNIT_PHRASE_COUNT = 3;
const RECITATION_MAX_SPACING_HORIZON_DAYS = 30;
const RECITATION_SPACING_CAP_POINTS = [
  [0, 0.4],
  [1 / 30, 0.55],
  [2 / 30, 0.65],
  [4 / 30, 0.75],
  [7 / 30, 0.85],
  [14 / 30, 0.92],
  [21 / 30, 0.96],
  [1, 1]
];
const COMPREHENSION_MIN_HALF_LIFE_DAYS = 2;
const COMPREHENSION_MAX_HALF_LIFE_DAYS = 60;
const COMPREHENSION_SUCCESSFUL_DAY_BONUS_DAYS = 2.5;
const COMPREHENSION_CONFIDENCE_BONUS_DAYS = 8;
const COMPREHENSION_CONFIDENCE_DURABILITY_DAYS = 3;
const COMPREHENSION_SINGLE_DAY_EARNED_CONFIDENCE_CEILING = 0.9;
const COMPREHENSION_SINGLE_DAY_DURABLE_REPETITION_CAP = 1;
const COMPREHENSION_CORRECT_REPETITION_BONUS_DAYS = 2;
const COMPREHENSION_CORRECT_REPETITION_BONUS_CAP_DAYS = 8;
let progressTrackingMode = PROGRESS_TRACKING_MODES.disabled;

const DEFAULT_COMPREHENSION_ATTEMPT_SIGNAL = {
  correctWeight: 0.09,
  incorrectWeight: 0.04
};

const COMPREHENSION_ATTEMPT_SIGNALS = {
  [COMPREHENSION_ATTEMPT_TYPES.matchingBlock]: {
    correctWeight: 0.05,
    incorrectWeight: 0.025
  },
  [COMPREHENSION_ATTEMPT_TYPES.arrangeBlock]: {
    correctWeight: 0.24,
    incorrectWeight: 0.03
  },
  [COMPREHENSION_ATTEMPT_TYPES.multipleChoiceEnglish]: {
    correctWeight: 0.09,
    incorrectWeight: 0.055
  },
  [COMPREHENSION_ATTEMPT_TYPES.multipleChoiceArabic]: {
    correctWeight: 0.15,
    incorrectWeight: 0.04
  },
  [COMPREHENSION_ATTEMPT_TYPES.writtenEnglish]: {
    correctWeight: 0.2,
    incorrectWeight: 0.035
  },
  [COMPREHENSION_ATTEMPT_TYPES.writtenArabic]: {
    correctWeight: 0.34,
    incorrectWeight: 0.02
  }
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
    reset_at: null,
    phrases: {}
  };
}

export function getBlankPhraseProgress() {
  return getEmptyProgress();
}

export function getResetPhraseProgress(timestamp = Date.now()) {
  return {
    ...getEmptyProgress(),
    reset_at: timestamp
  };
}

export function setProgressTrackingEnabled(enabled) {
  setProgressTrackingMode(enabled ? PROGRESS_TRACKING_MODES.account : PROGRESS_TRACKING_MODES.disabled);
}

export function setProgressTrackingMode(mode) {
  const nextMode = Object.values(PROGRESS_TRACKING_MODES).includes(mode)
    ? mode
    : PROGRESS_TRACKING_MODES.disabled;
  if (progressTrackingMode === nextMode) return;
  progressTrackingMode = nextMode;
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(PHRASE_PROGRESS_EVENT, {
      detail: {
        trackingEnabled: isProgressTrackingEnabled(),
        trackingMode: progressTrackingMode
      }
    }));
  }
}

export function isProgressTrackingEnabled() {
  return progressTrackingMode !== PROGRESS_TRACKING_MODES.disabled;
}

function getStorageKey(storageMode = progressTrackingMode) {
  return storageMode === PROGRESS_TRACKING_MODES.preview ? PREVIEW_STORAGE_KEY : STORAGE_KEY;
}

function getStoredPhraseProgressForDisplay() {
  if (isProgressTrackingEnabled()) return getStoredPhraseProgress(progressTrackingMode);

  const accountProgress = getStoredPhraseProgress(PROGRESS_TRACKING_MODES.account);
  if (Object.keys(accountProgress.phrases).length > 0) return accountProgress;

  return getStoredPhraseProgress(PROGRESS_TRACKING_MODES.preview);
}

function getEmptyComprehensionProgress() {
  return {
    confidence: 0,
    earned_confidence: 0,
    half_life_days: COMPREHENSION_MIN_HALF_LIFE_DAYS,
    retention: 1,
    attempts: 0,
    correct: 0,
    practice_days: {},
    successful_practice_days: {},
    last_correct_at: null,
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
    repetition_confidence: 0,
    repetition_step: 0,
    correct_traces: 0,
    practice_days: {},
    spacing_step: 0,
    spacing_horizon_days: RECITATION_DEFAULT_SPACING_HORIZON_DAYS,
    first_practiced_at: null,
    last_activity_type: null,
    last_result: null,
    last_practiced_at: null,
    last_practiced_day: null,
    repetitions_today: 0,
    traces_today: 0
  };
}

function getDayTimestamp(dayKey) {
  const timestamp = Date.parse(`${dayKey}T00:00:00.000Z`);
  return Number.isFinite(timestamp) ? timestamp : null;
}

function normalizePracticeDays(sourcePracticeDays) {
  if (!sourcePracticeDays || typeof sourcePracticeDays !== 'object') return {};
  return Object.fromEntries(
    Object.entries(sourcePracticeDays)
      .map(([dayKey, count]) => [
        dayKey,
        Math.max(0, Math.floor(Number(count) || 0))
      ])
      .filter(([dayKey, count]) => getDayTimestamp(dayKey) !== null && count > 0)
      .sort(([firstDay], [secondDay]) => firstDay.localeCompare(secondDay))
  );
}

function getPracticeDayKeys(practiceDays = {}) {
  return Object.keys(practiceDays)
    .filter(dayKey => getDayTimestamp(dayKey) !== null && (practiceDays[dayKey] || 0) > 0)
    .sort();
}

function getFirstPracticeTimestamp(practiceDays = {}, fallback = null) {
  const firstDayKey = getPracticeDayKeys(practiceDays)[0];
  return firstDayKey ? getDayTimestamp(firstDayKey) : fallback;
}

function clampNumber(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

export function getRecitationSpacingHorizonDays(phraseCount) {
  const numericPhraseCount = Math.ceil(Number(phraseCount) || RECITATION_DEFAULT_SPACING_HORIZON_DAYS);
  if (numericPhraseCount <= RECITATION_SHORT_UNIT_PHRASE_COUNT) return RECITATION_MIN_SPACING_HORIZON_DAYS;
  const scaledPhraseCount = Math.ceil((numericPhraseCount * numericPhraseCount) / 14);
  return clampNumber(
    scaledPhraseCount,
    3,
    RECITATION_MAX_SPACING_HORIZON_DAYS
  );
}

function getSpacingThresholds(spacingHorizonDays = RECITATION_DEFAULT_SPACING_HORIZON_DAYS) {
  const horizonDays = getRecitationSpacingHorizonDays(spacingHorizonDays);
  const horizonSpanDays = Math.max(1, horizonDays - 1);
  return RECITATION_SPACING_CAP_POINTS.map(([horizonRatio, cap]) => [
    Math.min(horizonSpanDays, Math.ceil(horizonSpanDays * horizonRatio)),
    cap
  ]);
}

function getSpacingState(practiceDays = {}, spacingHorizonDays = RECITATION_DEFAULT_SPACING_HORIZON_DAYS) {
  const dayKeys = getPracticeDayKeys(practiceDays);
  if (dayKeys.length === 0) return { spacingStep: 0, spacingCap: 0 };

  const firstTimestamp = getDayTimestamp(dayKeys[0]);
  const maxElapsedDays = dayKeys.reduce((maxDays, dayKey) => {
    const timestamp = getDayTimestamp(dayKey);
    if (timestamp === null || firstTimestamp === null) return maxDays;
    return Math.max(maxDays, Math.floor((timestamp - firstTimestamp) / DAY_MS));
  }, 0);
  const completedThresholds = getSpacingThresholds(spacingHorizonDays)
    .filter(([dayThreshold]) => maxElapsedDays >= dayThreshold);
  const lastCompleted = completedThresholds[completedThresholds.length - 1];

  return {
    spacingStep: completedThresholds.length,
    spacingCap: lastCompleted ? lastCompleted[1] : 0
  };
}

function calculateRecitationConfidence(recitation = {}) {
  const repetitionConfidence = calculateRecitationRepetitionConfidence(
    recitation.meaningful_repetitions || 0
  );
  const { spacingCap } = getSpacingState(recitation.practice_days, recitation.spacing_horizon_days);
  if (repetitionConfidence <= spacingCap) return clamp01(repetitionConfidence);
  return clamp01(spacingCap + ((repetitionConfidence - spacingCap) * 0.25));
}

function calculateRecitationRepetitionConfidence(repetitions = 0) {
  const meaningfulRepetitions = Math.max(0, repetitions || 0);
  const linearProgress = Math.min(1, meaningfulRepetitions / RECITATION_REPETITION_TARGET);
  const baseline = 1 / (1 + Math.exp(
    RECITATION_REPETITION_WARMUP_STEEPNESS * RECITATION_REPETITION_WARMUP_MIDPOINT
  ));
  const repetitionSignal = 1 / (
    1 + Math.exp(
      -RECITATION_REPETITION_WARMUP_STEEPNESS
        * (meaningfulRepetitions - RECITATION_REPETITION_WARMUP_MIDPOINT)
    )
  );
  const readiness = (repetitionSignal - baseline) / (1 - baseline);
  const warmupMultiplier = RECITATION_REPETITION_WARMUP_FLOOR
    + ((1 - RECITATION_REPETITION_WARMUP_FLOOR) * readiness);

  return clamp01(linearProgress * warmupMultiplier);
}

function getRecitationRepetitionStep(recitation = {}) {
  return Math.max(0, Math.min(
    10,
    Math.floor(calculateRecitationRepetitionConfidence(recitation.meaningful_repetitions || 0) * 10)
  ));
}

function getLegacyPracticeDays(source = {}) {
  const normalizedPracticeDays = normalizePracticeDays(source.practice_days);
  if (Object.keys(normalizedPracticeDays).length > 0) return normalizedPracticeDays;
  if (!source.last_practiced_day) return {};

  return {
    [source.last_practiced_day]: Math.max(
      source.repetitions_today || 0,
      source.meaningful_repetitions || 0,
      source.correct_traces || 0,
      1
    )
  };
}

function getLegacyComprehensionPracticeDays(source = {}) {
  const normalizedPracticeDays = normalizePracticeDays(source.practice_days);
  if (Object.keys(normalizedPracticeDays).length > 0) return normalizedPracticeDays;
  if (!source.last_practiced_day) return {};

  return {
    [source.last_practiced_day]: Math.max(source.attempts_today || 0, 1)
  };
}

function getLegacyComprehensionSuccessfulPracticeDays(source = {}) {
  const normalizedPracticeDays = normalizePracticeDays(source.successful_practice_days);
  if (Object.keys(normalizedPracticeDays).length > 0) return normalizedPracticeDays;
  const hasLegacyConfidence = (source.earned_confidence ?? source.confidence ?? source.comprehension_confidence ?? 0) > 0;
  if (!source.last_practiced_day || (source.last_result !== true && !hasLegacyConfidence)) return {};

  return {
    [source.last_practiced_day]: source.last_result === true
      ? Math.max(
        Math.min(source.attempts_today || 0, source.correct || 0),
        1
      )
      : 1
  };
}

function getPracticeDayCount(practiceDays = {}) {
  return getPracticeDayKeys(practiceDays).length;
}

function getPracticeCount(practiceDays = {}) {
  return Object.values(practiceDays || {}).reduce((total, count) => total + (Number(count) || 0), 0);
}

function getComprehensionConfidenceDurabilityFactor(successfulDayCount) {
  if (successfulDayCount <= 1) return 0;
  return clamp01((successfulDayCount - 1) / (COMPREHENSION_CONFIDENCE_DURABILITY_DAYS - 1));
}

function getComprehensionDurableCorrectPracticeCount(correctPracticeCount, successfulDayCount) {
  if (successfulDayCount <= 1) {
    return Math.min(correctPracticeCount, COMPREHENSION_SINGLE_DAY_DURABLE_REPETITION_CAP);
  }
  return correctPracticeCount;
}

function calculateComprehensionHalfLifeDays(comprehension = {}) {
  const earnedConfidence = clamp01(comprehension.earned_confidence ?? comprehension.confidence ?? 0);
  const successfulDayCount = getPracticeDayCount(comprehension.successful_practice_days);
  const correctPracticeCount = getPracticeCount(comprehension.successful_practice_days);
  const durableCorrectPracticeCount = getComprehensionDurableCorrectPracticeCount(
    correctPracticeCount,
    successfulDayCount
  );
  const earnedConfidenceDurabilityFactor = getComprehensionConfidenceDurabilityFactor(successfulDayCount);
  const halfLifeDays = COMPREHENSION_MIN_HALF_LIFE_DAYS
    + (successfulDayCount * COMPREHENSION_SUCCESSFUL_DAY_BONUS_DAYS)
    + (earnedConfidence * COMPREHENSION_CONFIDENCE_BONUS_DAYS * earnedConfidenceDurabilityFactor)
    + Math.min(
      COMPREHENSION_CORRECT_REPETITION_BONUS_CAP_DAYS,
      Math.log1p(durableCorrectPracticeCount) * COMPREHENSION_CORRECT_REPETITION_BONUS_DAYS
    );

  return clampNumber(
    halfLifeDays,
    COMPREHENSION_MIN_HALF_LIFE_DAYS,
    COMPREHENSION_MAX_HALF_LIFE_DAYS
  );
}

function calculateComprehensionRetention(comprehension = {}, timestamp = Date.now()) {
  const earnedConfidence = clamp01(comprehension.earned_confidence ?? comprehension.confidence ?? 0);
  if (earnedConfidence <= 0) return 1;
  if (!comprehension.last_correct_at) return 0;

  const elapsedDays = Math.max(0, (timestamp - comprehension.last_correct_at) / DAY_MS);
  const halfLifeDays = Math.max(
    COMPREHENSION_MIN_HALF_LIFE_DAYS,
    comprehension.half_life_days || calculateComprehensionHalfLifeDays(comprehension)
  );
  return clamp01(2 ** (-elapsedDays / halfLifeDays));
}

function calculateComprehensionConfidence(comprehension = {}, timestamp = Date.now()) {
  const earnedConfidence = clamp01(comprehension.earned_confidence ?? comprehension.confidence ?? 0);
  return clamp01(earnedConfidence * calculateComprehensionRetention(comprehension, timestamp));
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
  const practiceDays = getLegacyComprehensionPracticeDays(source);
  const successfulPracticeDays = getLegacyComprehensionSuccessfulPracticeDays(source);
  const earnedConfidence = clamp01(
    source.earned_confidence
      ?? source.confidence
      ?? source.comprehension_confidence
      ?? 0
  );
  const lastCorrectAt = source.last_correct_at
    ?? (earnedConfidence > 0 ? source.last_practiced_at ?? null : null);
  const comprehension = {
    ...getEmptyComprehensionProgress(),
    earned_confidence: earnedConfidence,
    attempts: source.attempts ?? source.comprehension_attempts ?? 0,
    correct: source.correct ?? source.comprehension_correct ?? 0,
    practice_days: practiceDays,
    successful_practice_days: successfulPracticeDays,
    last_correct_at: lastCorrectAt,
    last_attempt_type: source.last_attempt_type ?? null,
    last_result: typeof source.last_result === 'boolean' ? source.last_result : null,
    last_practiced_at: source.last_practiced_at ?? null,
    last_practiced_day: source.last_practiced_day ?? null,
    attempts_today: source.attempts_today ?? 0
  };
  const halfLifeDays = calculateComprehensionHalfLifeDays(comprehension);
  const retention = calculateComprehensionRetention({
    ...comprehension,
    half_life_days: halfLifeDays
  });

  return {
    ...comprehension,
    confidence: calculateComprehensionConfidence({
      ...comprehension,
      half_life_days: halfLifeDays
    }),
    half_life_days: halfLifeDays,
    retention
  };
}

function migrateRecitationProgress(phraseProgress = {}) {
  const source = phraseProgress.recitation && typeof phraseProgress.recitation === 'object'
    ? phraseProgress.recitation
    : {};
  const practiceDays = getLegacyPracticeDays(source);
  const recitation = {
    ...getEmptyRecitationProgress(),
    meaningful_repetitions: source.meaningful_repetitions ?? 0,
    repetition_confidence: calculateRecitationRepetitionConfidence(source.meaningful_repetitions ?? 0),
    repetition_step: getRecitationRepetitionStep(source),
    correct_traces: source.correct_traces ?? 0,
    practice_days: practiceDays,
    spacing_horizon_days: getRecitationSpacingHorizonDays(source.spacing_horizon_days),
    spacing_step: getSpacingState(
      practiceDays,
      getRecitationSpacingHorizonDays(source.spacing_horizon_days)
    ).spacingStep,
    first_practiced_at: source.first_practiced_at ?? getFirstPracticeTimestamp(practiceDays),
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
    reset_at: typeof progress.reset_at === 'number' ? progress.reset_at : null,
    phrases
  };
}

export function getStoredPhraseProgress(storageMode = PROGRESS_TRACKING_MODES.account) {
  if (typeof window === 'undefined') return getEmptyProgress();
  try {
    const storedProgress = JSON.parse(window.localStorage.getItem(getStorageKey(storageMode)) || 'null');
    return migrateProgress(storedProgress);
  } catch {
    return getEmptyProgress();
  }
}

function storePhraseProgress(progress, storageMode = progressTrackingMode) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(getStorageKey(storageMode), JSON.stringify(progress));
}

export function replaceStoredPhraseProgress(progress) {
  const nextProgress = migrateProgress(progress);
  storePhraseProgress(nextProgress, PROGRESS_TRACKING_MODES.account);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(PHRASE_PROGRESS_EVENT, {
      detail: { progress: nextProgress }
    }));
  }
  return nextProgress;
}

export function getStoredPreviewPhraseProgress() {
  return getStoredPhraseProgress(PROGRESS_TRACKING_MODES.preview);
}

export function clearStoredPreviewPhraseProgress() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(PREVIEW_STORAGE_KEY);
  window.dispatchEvent(new CustomEvent(PHRASE_PROGRESS_EVENT, {
    detail: { previewCleared: true }
  }));
}

function hasProgressAfterReset(phraseProgress, resetAt) {
  if (!resetAt) return true;
  return (phraseProgress.comprehension?.last_practiced_at || 0) > resetAt
    || (phraseProgress.recitation?.last_practiced_at || 0) > resetAt;
}

function filterProgressBeforeReset(progress, resetAt) {
  if (!resetAt) return progress;
  const phrases = Object.fromEntries(
    Object.entries(progress.phrases)
      .filter(([, phraseProgress]) => hasProgressAfterReset(phraseProgress, resetAt))
  );
  return {
    ...progress,
    phrases
  };
}

function mergePracticeDays(firstPracticeDays = {}, secondPracticeDays = {}) {
  const dayKeys = new Set([
    ...Object.keys(firstPracticeDays || {}),
    ...Object.keys(secondPracticeDays || {})
  ]);
  return Object.fromEntries(
    [...dayKeys]
      .sort()
      .map(dayKey => [
        dayKey,
        Math.max(firstPracticeDays?.[dayKey] || 0, secondPracticeDays?.[dayKey] || 0)
      ])
      .filter(([dayKey, count]) => getDayTimestamp(dayKey) !== null && count > 0)
  );
}

function mergeRecitationProgress(firstRecitation = {}, secondRecitation = {}) {
  const first = migrateRecitationProgress({ recitation: firstRecitation });
  const second = migrateRecitationProgress({ recitation: secondRecitation });
  const newer = (second.last_practiced_at || 0) > (first.last_practiced_at || 0) ? second : first;
  const practiceDays = mergePracticeDays(first.practice_days, second.practice_days);
  const firstPracticedAt = Math.min(
    ...[
      first.first_practiced_at,
      second.first_practiced_at,
      getFirstPracticeTimestamp(practiceDays)
    ].filter(timestamp => Number.isFinite(timestamp))
  );
  const meaningfulRepetitions = Math.max(
    first.meaningful_repetitions || 0,
    second.meaningful_repetitions || 0,
    Object.values(practiceDays).reduce((total, count) => total + count, 0)
  );
  const spacingHorizonDays = Math.min(
    first.spacing_horizon_days || RECITATION_DEFAULT_SPACING_HORIZON_DAYS,
    second.spacing_horizon_days || RECITATION_DEFAULT_SPACING_HORIZON_DAYS
  );
  const spacingState = getSpacingState(practiceDays, spacingHorizonDays);
  const recitation = {
    ...newer,
    meaningful_repetitions: meaningfulRepetitions,
    repetition_confidence: calculateRecitationRepetitionConfidence(meaningfulRepetitions),
    repetition_step: getRecitationRepetitionStep({ meaningful_repetitions: meaningfulRepetitions }),
    correct_traces: Math.max(first.correct_traces || 0, second.correct_traces || 0),
    practice_days: practiceDays,
    spacing_step: spacingState.spacingStep,
    spacing_horizon_days: spacingHorizonDays,
    first_practiced_at: Number.isFinite(firstPracticedAt) ? firstPracticedAt : null
  };

  return {
    ...recitation,
    confidence: calculateRecitationConfidence(recitation)
  };
}

function mergeComprehensionProgress(firstComprehension = {}, secondComprehension = {}) {
  const first = migrateComprehensionProgress({ comprehension: firstComprehension });
  const second = migrateComprehensionProgress({ comprehension: secondComprehension });
  const newer = (second.last_practiced_at || 0) > (first.last_practiced_at || 0) ? second : first;
  const practiceDays = mergePracticeDays(first.practice_days, second.practice_days);
  const successfulPracticeDays = mergePracticeDays(
    first.successful_practice_days,
    second.successful_practice_days
  );
  const earnedConfidence = Math.max(first.earned_confidence || 0, second.earned_confidence || 0);
  const lastCorrectAt = Math.max(first.last_correct_at || 0, second.last_correct_at || 0) || null;
  const comprehension = {
    ...newer,
    earned_confidence: earnedConfidence,
    attempts: Math.max(first.attempts || 0, second.attempts || 0, getPracticeCount(practiceDays)),
    correct: Math.max(first.correct || 0, second.correct || 0, getPracticeCount(successfulPracticeDays)),
    practice_days: practiceDays,
    successful_practice_days: successfulPracticeDays,
    last_correct_at: lastCorrectAt
  };
  const halfLifeDays = calculateComprehensionHalfLifeDays(comprehension);

  return {
    ...comprehension,
    confidence: calculateComprehensionConfidence({
      ...comprehension,
      half_life_days: halfLifeDays
    }),
    half_life_days: halfLifeDays,
    retention: calculateComprehensionRetention({
      ...comprehension,
      half_life_days: halfLifeDays
    })
  };
}

function getCorrectGainMultiplier(comprehensionProgress, todayKey) {
  const attemptsToday = comprehensionProgress.last_practiced_day === todayKey ? comprehensionProgress.attempts_today || 0 : 0;
  if (comprehensionProgress.last_result === false) return 0.35;
  if (attemptsToday > 0) return 0.45;
  return 1;
}

function getCorrectEarnedConfidenceTarget(comprehensionProgress, todayKey) {
  const attemptsToday = comprehensionProgress.last_practiced_day === todayKey ? comprehensionProgress.attempts_today || 0 : 0;
  const successfulDayCount = getPracticeDayCount(comprehensionProgress.successful_practice_days);
  if (attemptsToday > 0 && successfulDayCount <= 1) {
    return COMPREHENSION_SINGLE_DAY_EARNED_CONFIDENCE_CEILING;
  }
  return 1;
}

export function mergePhraseProgress(firstProgress, secondProgress) {
  const firstMigrated = migrateProgress(firstProgress);
  const secondMigrated = migrateProgress(secondProgress);
  const resetAt = Math.max(firstMigrated.reset_at || 0, secondMigrated.reset_at || 0) || null;
  const first = filterProgressBeforeReset(firstMigrated, resetAt);
  const second = filterProgressBeforeReset(secondMigrated, resetAt);
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

    const comprehension = mergeComprehensionProgress(firstPhrase.comprehension, secondPhrase.comprehension);
    const recitation = mergeRecitationProgress(firstPhrase.recitation, secondPhrase.recitation);
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
    reset_at: resetAt,
    phrases
  };
}

export function applyComprehensionAttempt(phraseProgress = {}, attempt) {
  const migratedProgress = migratePhraseProgress(phraseProgress);
  const comprehensionProgress = migratedProgress.comprehension;
  const signal = COMPREHENSION_ATTEMPT_SIGNALS[attempt.type] ?? DEFAULT_COMPREHENSION_ATTEMPT_SIGNAL;
  const currentEarnedConfidence = clamp01(
    comprehensionProgress.earned_confidence ?? comprehensionProgress.confidence ?? 0
  );
  const timestamp = attempt.timestamp ?? Date.now();
  const todayKey = getTodayKey(timestamp);
  const attemptsToday = comprehensionProgress.last_practiced_day === todayKey ? comprehensionProgress.attempts_today || 0 : 0;
  const isCorrect = Boolean(attempt.correct);
  const correctGainMultiplier = getCorrectGainMultiplier(comprehensionProgress, todayKey);
  const correctEarnedConfidenceTarget = getCorrectEarnedConfidenceTarget(comprehensionProgress, todayKey);
  const nextEarnedConfidence = isCorrect
    ? currentEarnedConfidence + (
        Math.max(0, correctEarnedConfidenceTarget - currentEarnedConfidence)
          * signal.correctWeight
          * correctGainMultiplier
      )
    : currentEarnedConfidence - (signal.incorrectWeight * (0.75 + currentEarnedConfidence * 0.5));
  const practiceDays = {
    ...comprehensionProgress.practice_days,
    [todayKey]: (comprehensionProgress.practice_days?.[todayKey] || 0) + 1
  };
  const successfulPracticeDays = isCorrect
    ? {
        ...comprehensionProgress.successful_practice_days,
        [todayKey]: (comprehensionProgress.successful_practice_days?.[todayKey] || 0) + 1
      }
    : comprehensionProgress.successful_practice_days;
  const nextComprehension = {
    ...comprehensionProgress,
    earned_confidence: clamp01(nextEarnedConfidence),
    attempts: (comprehensionProgress.attempts || 0) + 1,
    correct: (comprehensionProgress.correct || 0) + (isCorrect ? 1 : 0),
    practice_days: practiceDays,
    successful_practice_days: successfulPracticeDays,
    last_correct_at: isCorrect ? timestamp : comprehensionProgress.last_correct_at,
    last_attempt_type: attempt.type,
    last_result: isCorrect,
    last_practiced_at: timestamp,
    last_practiced_day: todayKey,
    attempts_today: attemptsToday + 1
  };
  const halfLifeDays = calculateComprehensionHalfLifeDays(nextComprehension);
  const nextComprehensionWithDecay = {
    ...nextComprehension,
    half_life_days: halfLifeDays,
    retention: calculateComprehensionRetention({
      ...nextComprehension,
      half_life_days: halfLifeDays
    }, timestamp)
  };

  const nextProgress = {
    ...migratedProgress,
    comprehension: {
      ...nextComprehensionWithDecay,
      confidence: calculateComprehensionConfidence(nextComprehensionWithDecay, timestamp)
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
  const progress = getStoredPhraseProgress(progressTrackingMode);
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
  const timestamp = attempt.timestamp ?? Date.now();
  const todayKey = getTodayKey(timestamp);
  const repetitionsToday = recitationProgress.last_practiced_day === todayKey ? recitationProgress.repetitions_today || 0 : 0;
  const nextMeaningfulRepetitions = (recitationProgress.meaningful_repetitions || 0) + 1;
  const spacingHorizonDays = attempt.unitPhraseCount
    ? getRecitationSpacingHorizonDays(attempt.unitPhraseCount)
    : recitationProgress.spacing_horizon_days;
  const practiceDays = {
    ...recitationProgress.practice_days,
    [todayKey]: (recitationProgress.practice_days?.[todayKey] || 0) + 1
  };
  const spacingState = getSpacingState(practiceDays, spacingHorizonDays);
  const nextRecitation = {
    ...recitationProgress,
    meaningful_repetitions: nextMeaningfulRepetitions,
    repetition_confidence: calculateRecitationRepetitionConfidence(nextMeaningfulRepetitions),
    repetition_step: getRecitationRepetitionStep({ meaningful_repetitions: nextMeaningfulRepetitions }),
    practice_days: practiceDays,
    spacing_step: spacingState.spacingStep,
    spacing_horizon_days: spacingHorizonDays,
    first_practiced_at: recitationProgress.first_practiced_at ?? timestamp,
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
  const timestamp = attempt.timestamp ?? Date.now();
  const todayKey = getTodayKey(timestamp);
  const tracesToday = recitationProgress.last_practiced_day === todayKey ? recitationProgress.traces_today || 0 : 0;
  const isCorrect = Boolean(attempt.correct);
  const spacingHorizonDays = attempt.unitPhraseCount
    ? getRecitationSpacingHorizonDays(attempt.unitPhraseCount)
    : recitationProgress.spacing_horizon_days;
  const practiceDays = isCorrect
    ? {
        ...recitationProgress.practice_days,
        [todayKey]: (recitationProgress.practice_days?.[todayKey] || 0) + 1
      }
    : recitationProgress.practice_days;
  const spacingState = getSpacingState(practiceDays, spacingHorizonDays);
  const nextRecitation = {
    ...recitationProgress,
    correct_traces: (recitationProgress.correct_traces || 0) + (isCorrect ? 1 : 0),
    practice_days: practiceDays,
    spacing_step: spacingState.spacingStep,
    spacing_horizon_days: spacingHorizonDays,
    first_practiced_at: isCorrect ? recitationProgress.first_practiced_at ?? timestamp : recitationProgress.first_practiced_at,
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
  const progress = getStoredPhraseProgress(progressTrackingMode);
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

export function recordRecitationRepetition({ phraseId, activityType, unitPhraseCount, timestamp = Date.now() }) {
  if (!isProgressTrackingEnabled()) return null;
  return recordPhraseRecitation({
    phraseId,
    timestamp,
    applyAttempt: phraseProgress => applyRecitationRepetition(phraseProgress, {
      activityType,
      unitPhraseCount,
      timestamp
    })
  });
}

export function recordRecitationTrace({ phraseIds, activityType, correct, unitPhraseCount, timestamp = Date.now() }) {
  if (!isProgressTrackingEnabled()) return [];
  const uniquePhraseIds = [...new Set((phraseIds || []).filter(Boolean))];
  if (uniquePhraseIds.length === 0) return [];
  const progress = getStoredPhraseProgress(progressTrackingMode);
  const nextPhrases = { ...progress.phrases };
  const results = uniquePhraseIds.map(phraseId => {
    const nextPhraseProgress = applyRecitationTrace(nextPhrases[phraseId] || {}, {
      activityType,
      correct,
      unitPhraseCount: unitPhraseCount || uniquePhraseIds.length,
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
  const progress = getStoredPhraseProgressForDisplay();
  return Object.fromEntries(
    Object.entries(progress.phrases).map(([phraseId, phraseProgress]) => [
      phraseId,
      clamp01(phraseProgress.overall_confidence || 0)
    ])
  );
}

export function getStoredPhraseProgressDimensionMaps() {
  const progress = getStoredPhraseProgressForDisplay();
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
