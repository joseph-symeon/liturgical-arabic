import React, { useEffect, useMemo, useState } from 'react';
import './course.css';
import PassageExperience from '../passage/PassageExperience.jsx';
import exercises, { canUseActivityType, getExerciseWithActivity, getStandardActivityOptions } from '../../data/course/exercises.js';
import { getExerciseTitle } from './exerciseTitles.js';
import { PASSAGE_ACTIVITY_LABELS, PASSAGE_ACTIVITY_TYPES } from '../../utils/passageActivities.js';
import { getExercisePhraseIds, getLessonPhraseIds, getPhraseCountLabel } from '../../utils/courseMastery.js';
import { createExercisePassage } from '../../utils/passages.js';
import { getStoredPhraseConfidenceMap, PHRASE_PROGRESS_EVENT } from '../../utils/progressScoring.js';
import {
  resolveStoredActivitySelection,
  SHARED_ACTIVITY_SELECTION_KEY,
  storeActivitySelection
} from '../../utils/activitySelectionStorage.js';

const STUDY_SKILLS = {
  home: 'home',
  comprehension: 'comprehension',
  recitation: 'recitation'
};

const STUDY_SKILL_STORAGE_KEY = 'liturgical-arabic:study-workspace';
const MARKER_FILL_CONFIDENCE = 0.8;

const RECITATION_ACTIVITY_TYPES = [
  PASSAGE_ACTIVITY_TYPES.readListen,
  PASSAGE_ACTIVITY_TYPES.phraseCaptions,
  PASSAGE_ACTIVITY_TYPES.typeArabic
];

const COMPREHENSION_ACTIVITY_TYPES = [
  PASSAGE_ACTIVITY_TYPES.learn
];

function getActivityOptions(item) {
  if (item?.activity_options) {
    return getPrimaryActivityOptions(item.exercise_id, item.activity_options)
      .filter(option => canUseActivityType(item.exercise_id, option.activity_type));
  }
  if (item?.activity_policy === 'standard') return getStandardActivityOptions(item.exercise_id);
  return [];
}

function scrollToExerciseTop() {
  if (typeof window === 'undefined') return;
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    });
  });
}

function getStudySkillForActivityType(activityType) {
  return COMPREHENSION_ACTIVITY_TYPES.includes(activityType)
    ? STUDY_SKILLS.comprehension
    : STUDY_SKILLS.recitation;
}

function getStudySkillLabel(skill) {
  if (skill === STUDY_SKILLS.home) return 'Study Home';
  return skill === STUDY_SKILLS.comprehension ? 'Comprehension' : 'Recitation';
}

function getActivityOptionSkill(option) {
  return getStudySkillForActivityType(option?.activity_type);
}

function getSkillActivityOptions(activityOptions, skill) {
  return activityOptions.filter(option => getActivityOptionSkill(option) === skill);
}

function getDefaultActivityValueForSkill(activityOptions, skill) {
  const skillOptions = getSkillActivityOptions(activityOptions, skill);
  return getActivityOptionValue(skillOptions[0]) || null;
}

function resolveActivityValueForSkill(activityOptions, value, skill) {
  const option = activityOptions.find(candidate => getActivityOptionValue(candidate) === value);
  if (option && getActivityOptionSkill(option) === skill) return value;
  return getDefaultActivityValueForSkill(activityOptions, skill);
}

function getAvailableStudySkills(activityOptions) {
  return [
    STUDY_SKILLS.home,
    ...(getSkillActivityOptions(activityOptions, STUDY_SKILLS.recitation).length > 0 ? [STUDY_SKILLS.recitation] : []),
    ...(getSkillActivityOptions(activityOptions, STUDY_SKILLS.comprehension).length > 0 ? [STUDY_SKILLS.comprehension] : [])
  ];
}

function getStoredStudySkill(activityOptions) {
  const fallbackSkill = getSkillActivityOptions(activityOptions, STUDY_SKILLS.recitation).length > 0
    ? STUDY_SKILLS.recitation
    : STUDY_SKILLS.home;
  if (typeof window === 'undefined') return fallbackSkill;
  const storedSkill = window.localStorage.getItem(STUDY_SKILL_STORAGE_KEY);
  return getAvailableStudySkills(activityOptions).includes(storedSkill) && storedSkill !== STUDY_SKILLS.home
    ? storedSkill
    : fallbackSkill;
}

function storeStudySkill(skill) {
  if (typeof window === 'undefined' || !skill) return;
  window.localStorage.setItem(STUDY_SKILL_STORAGE_KEY, skill);
}

function getResolvedActivityValueForStudySkill(activityOptions, skill) {
  const resolvedActivityValue = getResolvedActivityOptionId(activityOptions);
  if (skill === STUDY_SKILLS.home) return resolvedActivityValue;
  return resolveActivityValueForSkill(activityOptions, resolvedActivityValue, skill) || resolvedActivityValue;
}

function getPrimaryActivityOptions(exerciseId, activityOptions) {
  const sourceOptions = activityOptions || [];
  const options = [{
    label: PASSAGE_ACTIVITY_LABELS[PASSAGE_ACTIVITY_TYPES.readListen],
    activity_type: PASSAGE_ACTIVITY_TYPES.readListen
  }];
  if (!exerciseId || !exercises[exerciseId]) return options;
  const standardOptions = getStandardActivityOptions(exerciseId);
  const canUseCaptions = sourceOptions.some(option => option.activity_type === PASSAGE_ACTIVITY_TYPES.phraseCaptions)
    || standardOptions.some(option => option.activity_type === PASSAGE_ACTIVITY_TYPES.phraseCaptions);
  const canLearn = sourceOptions.some(option => [
    PASSAGE_ACTIVITY_TYPES.learn,
    PASSAGE_ACTIVITY_TYPES.matching,
    PASSAGE_ACTIVITY_TYPES.translationDirection,
    PASSAGE_ACTIVITY_TYPES.arrange,
    PASSAGE_ACTIVITY_TYPES.typeArabic,
    PASSAGE_ACTIVITY_TYPES.typeEnglish
  ].includes(option.activity_type)) || standardOptions.some(option => option.activity_type === PASSAGE_ACTIVITY_TYPES.learn);
  const canTrace = sourceOptions.some(option => option.activity_type === PASSAGE_ACTIVITY_TYPES.typeArabic)
    || standardOptions.some(option => option.activity_type === PASSAGE_ACTIVITY_TYPES.typeArabic);

  if (canUseCaptions) {
    options.push({
      label: PASSAGE_ACTIVITY_LABELS[PASSAGE_ACTIVITY_TYPES.phraseCaptions],
      activity_type: PASSAGE_ACTIVITY_TYPES.phraseCaptions
    });
  }

  if (canLearn && !options.some(option => option.activity_type === PASSAGE_ACTIVITY_TYPES.learn)) {
    options.push({
      label: 'Practice',
      activity_type: PASSAGE_ACTIVITY_TYPES.learn
    });
  }

  if (canTrace && !options.some(option => option.activity_type === PASSAGE_ACTIVITY_TYPES.typeArabic)) {
    options.push({
      label: PASSAGE_ACTIVITY_LABELS[PASSAGE_ACTIVITY_TYPES.typeArabic],
      activity_type: PASSAGE_ACTIVITY_TYPES.typeArabic
    });
  }

  return options;
}

function getActivityOptionValue(option) {
  return option?.exercise_id || option?.activity_type || null;
}

function getResolvedActivityOptionId(activityOptions) {
  return resolveStoredActivitySelection(
    SHARED_ACTIVITY_SELECTION_KEY,
    activityOptions.map(getActivityOptionValue).filter(Boolean),
    PASSAGE_ACTIVITY_TYPES.readListen
  );
}

export default function LessonPage({
  lesson,
  arabicMode,
  readerLayout,
  speechRate,
  arabicFontFamily,
  arabicFontWeight,
  arabicFontSize,
  showPracticeToolbar = true,
  studyWorkspace,
  selectedExerciseIndex,
  onStudySkillChange,
  onCourseTrack,
  onCourseLesson,
  onSelectExercise
}) {
  const exerciseItems = lesson.exercises ?? [];
  const selectedExerciseItem = exerciseItems[selectedExerciseIndex] ?? exerciseItems[0];
  const activityOptions = useMemo(() => getActivityOptions(selectedExerciseItem), [selectedExerciseItem]);
  const initialStudySkill = getStoredStudySkill(activityOptions);
  const [selectedStudySkill, setSelectedStudySkill] = useState(initialStudySkill);
  const [selectedActivityOptionId, setSelectedActivityOptionId] = useState(() => (
    getResolvedActivityValueForStudySkill(activityOptions, initialStudySkill)
  ));
  const [phraseConfidenceById, setPhraseConfidenceById] = useState(getStoredPhraseConfidenceMap);
  const recitationOptions = getSkillActivityOptions(activityOptions, STUDY_SKILLS.recitation);
  const comprehensionOptions = getSkillActivityOptions(activityOptions, STUDY_SKILLS.comprehension);
  const activeSkillOptions = getSkillActivityOptions(activityOptions, selectedStudySkill);
  const canUseRecitation = recitationOptions.length > 0;
  const canUseComprehension = comprehensionOptions.length > 0;
  const selectedActivityOption = activityOptions.find(option => (
    getActivityOptionValue(option) === selectedActivityOptionId
  )) || activityOptions[0] || null;

  useEffect(() => {
    const nextStudySkill = getStoredStudySkill(activityOptions);
    const resolvedActivityValue = getResolvedActivityValueForStudySkill(activityOptions, nextStudySkill);
    setSelectedStudySkill(nextStudySkill);
    setSelectedActivityOptionId(resolvedActivityValue);
  }, [lesson.id, selectedExerciseIndex]);

  useEffect(() => {
    if (!studyWorkspace || studyWorkspace === selectedStudySkill) return;
    if (!getAvailableStudySkills(activityOptions).includes(studyWorkspace)) return;
    const nextActivityValue = getResolvedActivityValueForStudySkill(activityOptions, studyWorkspace);
    setSelectedStudySkill(studyWorkspace);
    storeStudySkill(studyWorkspace);
    setSelectedActivityOptionId(nextActivityValue);
  }, [activityOptions, selectedStudySkill, studyWorkspace]);

  useEffect(() => {
    function refreshProgress() {
      setPhraseConfidenceById(getStoredPhraseConfidenceMap());
    }
    window.addEventListener(PHRASE_PROGRESS_EVENT, refreshProgress);
    window.addEventListener('storage', refreshProgress);
    return () => {
      window.removeEventListener(PHRASE_PROGRESS_EVENT, refreshProgress);
      window.removeEventListener('storage', refreshProgress);
    };
  }, []);

  const resolvedExercises = exerciseItems
    .map((item, index) => {
      const option = index === selectedExerciseIndex ? selectedActivityOption : null;
      const exerciseId = option?.exercise_id || item.exercise_id;
      const activityType = option?.activity_type || item.activity_type || null;
      return {
        exercise_id: exerciseId,
        exercise: activityType ? getExerciseWithActivity(exerciseId, activityType) : exercises[exerciseId],
        audio_clip: exercises[exerciseId]?.audio_clip
      };
    });
  const selectedExercise = resolvedExercises[selectedExerciseIndex] ?? resolvedExercises[0];
  const missingExercises = selectedExercise && !selectedExercise.exercise ? [selectedExercise] : [];
  const unitTitle = lesson.unitTitle || lesson.unit_title;
  const exerciseTitle = getExerciseTitle(lesson, selectedExerciseIndex);
  const hasMultipleExercises = exerciseItems.length > 1;
  const lessonPhraseCount = getLessonPhraseIds(lesson).size;
  const studyHomeContext = hasMultipleExercises
    ? `${exerciseItems.length} exercises · ${lessonPhraseCount} ${lessonPhraseCount === 1 ? 'phrase' : 'phrases'}`
    : exerciseTitle;
  const selectedActivityType = selectedExercise?.exercise?.activity?.type || null;
  const isLearnActivity = selectedActivityType === PASSAGE_ACTIVITY_TYPES.learn;
  const isStudyHome = selectedStudySkill === STUDY_SKILLS.home;
  const isRecitationMode = selectedStudySkill === STUDY_SKILLS.recitation;
  const selectedActivityValue = getActivityOptionValue(selectedActivityOption) || selectedExerciseItem.exercise_id;
  const passage = createExercisePassage({ exercise: selectedExercise?.exercise });
  const activityContextHeader = {
    kicker: unitTitle,
    title: lesson.title,
    context: exerciseTitle
  };

  function getExerciseConfidence(item) {
    const phraseIds = [...new Set(getExercisePhraseIds(item.exercise_id))];
    if (phraseIds.length === 0) return 0;
    const totalConfidence = phraseIds.reduce((total, phraseId) => total + (phraseConfidenceById[phraseId] || 0), 0);
    return totalConfidence / phraseIds.length;
  }

  function selectActivityValue(value) {
    setSelectedActivityOptionId(value);
    storeActivitySelection(SHARED_ACTIVITY_SELECTION_KEY, value);
  }

  function selectStudySkill(skill) {
    if (skill === selectedStudySkill) return;
    if (skill === STUDY_SKILLS.home) {
      setSelectedStudySkill(skill);
      storeStudySkill(skill);
      onStudySkillChange?.(skill);
      return;
    }
    const nextActivityValue = resolveActivityValueForSkill(activityOptions, selectedActivityOptionId, skill);
    if (!nextActivityValue) return;
    setSelectedStudySkill(skill);
    storeStudySkill(skill);
    onStudySkillChange?.(skill);
    selectActivityValue(nextActivityValue);
    scrollToExerciseTop();
  }

  function renderActivityModeTabs() {
    const options = isRecitationMode ? activeSkillOptions : recitationOptions;
    if (options.length <= 1) return null;
    return (
      <div className="lp-study-mode-tabs" role="group" aria-label={`${getStudySkillLabel(selectedStudySkill)} mode`}>
        {options.map(option => {
          const value = getActivityOptionValue(option);
          return (
            <button
              key={value}
              type="button"
              className={selectedActivityValue === value ? 'active' : ''}
              aria-pressed={selectedActivityValue === value}
              onClick={() => selectActivityValue(value)}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    );
  }

  function renderExerciseSkillTabs() {
    return renderSkillTabs();
  }

  function renderPassageExperience() {
    return (
      <PassageExperience
        passage={passage}
        activityLabel={null}
        activitySelectId="lp-activity-select"
        activityOptions={[]}
        selectedActivityValue={selectedActivityValue}
        onSelectActivity={selectActivityValue}
        activityType={selectedActivityType}
        resetKey={`${lesson.id}:${selectedExerciseIndex}`}
        arabicMode={arabicMode}
        readerLayout={readerLayout}
        speechRate={speechRate}
        arabicFontFamily={arabicFontFamily}
        arabicFontWeight={arabicFontWeight}
        arabicFontSize={arabicFontSize}
        showPracticeToolbar={isRecitationMode && showPracticeToolbar}
        preserveToolbarInFocus={isRecitationMode}
        activityContextHeader={activityContextHeader}
        toolbarTop={(
          <>
            {renderExerciseSkillTabs()}
            {renderActivityModeTabs()}
          </>
        )}
        learnSetupToolbarTop={renderExerciseSkillTabs()}
        dockLearnSetupControls={!isRecitationMode}
        onCourseTrack={onCourseTrack}
        onCourseLesson={onCourseLesson}
      />
    );
  }

  function renderRecitationWorkspace() {
    return (
      <section className="lp-recitation-workspace" aria-label="Recitation practice">
        <div className="lp-view-header">
          <div className="lp-view-kicker">{unitTitle}</div>
          <h1 className="lp-view-title">{lesson.title}</h1>
          <div className="lp-view-meta">{exerciseTitle}</div>
        </div>
        {renderPassageExperience()}
      </section>
    );
  }

  function renderSkillTabs() {
    return (
      <div className="lp-study-skill-tabs" role="tablist" aria-label="Study skill">
        {[STUDY_SKILLS.recitation, STUDY_SKILLS.comprehension].map(skill => {
          const disabled = skill === STUDY_SKILLS.recitation ? !canUseRecitation : !canUseComprehension;
          return (
            <button
              key={skill}
              type="button"
              role="tab"
              className={selectedStudySkill === skill ? 'active' : ''}
              aria-selected={selectedStudySkill === skill}
              disabled={disabled}
              onClick={() => selectStudySkill(skill)}
            >
              {getStudySkillLabel(skill)}
            </button>
          );
        })}
      </div>
    );
  }

  function renderStudyHome() {
    return (
      <section className="lp-study-home-card" aria-labelledby="study-home-title">
        <div className="lp-view-header">
          <div className="lp-view-kicker">{unitTitle}</div>
          <h1 className="lp-view-title" id="study-home-title">{lesson.title}</h1>
          <div className="lp-view-meta">{studyHomeContext}</div>
        </div>

        <section className="lp-study-home-exercise-summary" aria-label="Exercises">
          <div className="lp-study-home-exercise-list">
            {exerciseItems.map((item, exerciseIndex) => {
              const exerciseConfidence = getExerciseConfidence(item);
              const exercisePhraseCount = new Set(getExercisePhraseIds(item.exercise_id)).size;
              const isSelectedExercise = exerciseIndex === selectedExerciseIndex;
              const isRecapExercise = exerciseItems.length > 1 && exerciseIndex === exerciseItems.length - 1;

              return (
                <article
                  key={`${lesson.id}:${item.exercise_id}:${exerciseIndex}`}
                  className={[
                    'lp-study-home-exercise-row',
                    isSelectedExercise ? 'active' : '',
                    isRecapExercise ? 'recap' : '',
                    exerciseConfidence >= MARKER_FILL_CONFIDENCE ? 'confident' : ''
                  ].filter(Boolean).join(' ')}
                >
                  <button
                    type="button"
                    className="lp-study-home-exercise-select"
                    onClick={() => onSelectExercise?.(exerciseIndex)}
                    aria-pressed={isSelectedExercise}
                  >
                    <span className="lp-study-home-exercise-number">{isRecapExercise ? 'Recap' : exerciseIndex + 1}</span>
                    <span className="lp-study-home-exercise-main">
                      <strong>{getExerciseTitle(lesson, exerciseIndex)}</strong>
                      <span className="lp-study-home-exercise-meta">{getPhraseCountLabel(exercisePhraseCount)}</span>
                      <span className="lp-study-home-exercise-confidence" aria-label={`${Math.round(exerciseConfidence * 100)}% confidence`}>
                        <span>
                          <span style={{ width: `${Math.round(exerciseConfidence * 100)}%` }} />
                        </span>
                        <strong>{Math.round(exerciseConfidence * 100)}%</strong>
                      </span>
                    </span>
                  </button>
                  <span className="lp-study-home-exercise-actions">
                    <span
                      className="lp-study-home-exercise-action"
                      aria-hidden="true"
                    >
                      <span aria-hidden="true">›</span>
                    </span>
                  </span>
                </article>
              );
            })}
          </div>
        </section>
      </section>
    );
  }

  return (
    <div
      className={[
        'lp-page',
        'course-view-page',
        'bottom-nav-page',
        isStudyHome ? 'study-home-page' : '',
        isLearnActivity && !isStudyHome ? 'learn-mode-page' : '',
        'recitation-mode-page',
        isRecitationMode ? '' : 'comprehension-mode-page',
        isRecitationMode && !showPracticeToolbar ? 'focus-mode-page' : '',
        selectedActivityType && !isStudyHome ? `study-activity-${selectedActivityType}` : ''
      ].filter(Boolean).join(' ')}
      dir="ltr"
    >
      {isStudyHome && renderStudyHome()}

      {missingExercises.length > 0 && (
        <p className="lp-config-note">
          Missing exercise: {missingExercises.map(({ exercise_id }) => exercise_id).join(', ')}
        </p>
      )}

      {selectedExercise?.exercise && !isStudyHome && (
        renderRecitationWorkspace()
      )}
    </div>
  );
}
