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
    version: 1,
    phrases: {}
  };
}

export function getStoredPhraseProgress() {
  if (typeof window === 'undefined') return getEmptyProgress();
  try {
    const storedProgress = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || 'null');
    if (!storedProgress || typeof storedProgress !== 'object') return getEmptyProgress();
    return {
      version: 1,
      phrases: storedProgress.phrases && typeof storedProgress.phrases === 'object'
        ? storedProgress.phrases
        : {}
    };
  } catch {
    return getEmptyProgress();
  }
}

function storePhraseProgress(progress) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

function getCorrectGainMultiplier(phraseProgress, todayKey) {
  const attemptsToday = phraseProgress.last_practiced_day === todayKey ? phraseProgress.attempts_today || 0 : 0;
  if (phraseProgress.last_result === false) return 0.35;
  if (attemptsToday > 0) return 0.45;
  return 1;
}

export function applyComprehensionAttempt(phraseProgress = {}, attempt) {
  const weight = COMPREHENSION_ATTEMPT_WEIGHTS[attempt.type] ?? 0.1;
  const currentConfidence = clamp01(phraseProgress.comprehension_confidence || 0);
  const timestamp = attempt.timestamp || Date.now();
  const todayKey = getTodayKey(timestamp);
  const attemptsToday = phraseProgress.last_practiced_day === todayKey ? phraseProgress.attempts_today || 0 : 0;
  const isCorrect = Boolean(attempt.correct);
  const correctGainMultiplier = getCorrectGainMultiplier(phraseProgress, todayKey);
  const nextConfidence = isCorrect
    ? currentConfidence + ((1 - currentConfidence) * weight * correctGainMultiplier)
    : currentConfidence - ((0.05 + weight * 0.55) * (0.75 + currentConfidence * 0.5));

  return {
    ...phraseProgress,
    comprehension_confidence: clamp01(nextConfidence),
    comprehension_attempts: (phraseProgress.comprehension_attempts || 0) + 1,
    comprehension_correct: (phraseProgress.comprehension_correct || 0) + (isCorrect ? 1 : 0),
    last_attempt_type: attempt.type,
    last_result: isCorrect,
    last_practiced_at: timestamp,
    last_practiced_day: todayKey,
    attempts_today: attemptsToday + 1
  };
}

export function recordComprehensionAttempt({ phraseId, type, correct, timestamp = Date.now() }) {
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
      detail: { phraseId, phraseProgress: nextPhraseProgress }
    }));
  }
  return nextPhraseProgress;
}

export function getStoredPhraseConfidenceMap() {
  const progress = getStoredPhraseProgress();
  return Object.fromEntries(
    Object.entries(progress.phrases).map(([phraseId, phraseProgress]) => [
      phraseId,
      clamp01(phraseProgress.comprehension_confidence || 0)
    ])
  );
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
