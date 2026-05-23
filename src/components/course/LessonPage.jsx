import React, { useEffect, useState } from 'react';
import './course.css';
import PassageExperience from '../passage/PassageExperience.jsx';
import StudyWorkspaceHeader from '../StudyWorkspaceHeader.jsx';
import exercises, { canUseActivityType, getExerciseWithActivity, getStandardActivityOptions } from '../../data/course/exercises.js';
import { getExerciseTitle } from './exerciseTitles.js';
import { PASSAGE_ACTIVITY_LABELS, PASSAGE_ACTIVITY_TYPES } from '../../utils/passageActivities.js';
import { createExercisePassage } from '../../utils/passages.js';
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
  if (typeof window === 'undefined') return STUDY_SKILLS.home;
  const storedSkill = window.localStorage.getItem(STUDY_SKILL_STORAGE_KEY);
  return getAvailableStudySkills(activityOptions).includes(storedSkill) ? storedSkill : STUDY_SKILLS.home;
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
  selectedExerciseIndex,
  hasPreviousExercise,
  hasNextExercise,
  previousExerciseTitle,
  nextExerciseTitle,
  onStudySkillChange,
  onCourseOverview,
  onPreviousExercise,
  onNextExercise
}) {
  const exerciseItems = lesson.exercises ?? [];
  const selectedExerciseItem = exerciseItems[selectedExerciseIndex] ?? exerciseItems[0];
  const activityOptions = getActivityOptions(selectedExerciseItem);
  const initialStudySkill = getStoredStudySkill(activityOptions);
  const [selectedStudySkill, setSelectedStudySkill] = useState(initialStudySkill);
  const [selectedActivityOptionId, setSelectedActivityOptionId] = useState(() => (
    getResolvedActivityValueForStudySkill(activityOptions, initialStudySkill)
  ));
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
    onStudySkillChange?.(selectedStudySkill);
  }, [onStudySkillChange, selectedStudySkill]);

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
  const selectedActivityType = selectedExercise?.exercise?.activity?.type || null;
  const isLearnActivity = selectedActivityType === PASSAGE_ACTIVITY_TYPES.learn;
  const isStudyHome = selectedStudySkill === STUDY_SKILLS.home;
  const isRecitationMode = selectedStudySkill === STUDY_SKILLS.recitation;
  const selectedActivityValue = getActivityOptionValue(selectedActivityOption) || selectedExerciseItem.exercise_id;
  const passage = createExercisePassage({ exercise: selectedExercise?.exercise });
  const studyHomeReadExercise = selectedExerciseItem?.exercise_id
    ? getExerciseWithActivity(selectedExerciseItem.exercise_id, PASSAGE_ACTIVITY_TYPES.readListen)
    : null;
  const studyHomePassage = createExercisePassage({ exercise: studyHomeReadExercise || selectedExercise?.exercise });

  function renderNavLabel(action, destination) {
    return (
      <>
        <span className="page-nav-label">{action}</span>
        {destination && <span className="page-nav-destination">{destination}</span>}
      </>
    );
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
      return;
    }
    const nextActivityValue = resolveActivityValueForSkill(activityOptions, selectedActivityOptionId, skill);
    if (!nextActivityValue) return;
    setSelectedStudySkill(skill);
    storeStudySkill(skill);
    selectActivityValue(nextActivityValue);
  }

  function renderRecitationModeTabs() {
    if (activeSkillOptions.length <= 1) return null;
    return (
      <div className="lp-study-mode-tabs" role="group" aria-label={`${getStudySkillLabel(selectedStudySkill)} mode`}>
        {activeSkillOptions.map(option => {
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
      />
    );
  }

  function renderRecitationWorkspace() {
    return (
      <section className="lp-recitation-workspace" aria-label="Recitation practice">
        <StudyWorkspaceHeader
          title="Recitation"
          actions={renderRecitationModeTabs()}
          className="lp-recitation-topbar"
        />
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
        <div className="lp-study-home-topbar">
          <div>
            <div className="lp-study-home-kicker">{unitTitle}</div>
            <h1 id="study-home-title">{lesson.title}</h1>
            <div className="lp-study-home-context">{exerciseTitle}</div>
          </div>
        </div>

        <div className="lp-study-home-grid">
          <section className="lp-study-home-section lp-study-home-text" aria-labelledby="study-home-text-title">
            <div className="lp-study-home-read-preview">
              <PassageExperience
                passage={studyHomePassage}
                activityLabel={null}
                activitySelectId="lp-study-home-read-activity"
                activityOptions={[]}
                selectedActivityValue={PASSAGE_ACTIVITY_TYPES.readListen}
                onSelectActivity={() => {}}
                activityType={PASSAGE_ACTIVITY_TYPES.readListen}
                resetKey={`study-home:${lesson.id}:${selectedExerciseIndex}`}
                arabicMode={arabicMode}
                readerLayout={readerLayout}
                speechRate={speechRate}
                arabicFontFamily={arabicFontFamily}
                arabicFontWeight={arabicFontWeight}
                arabicFontSize={arabicFontSize}
                showPracticeToolbar={false}
              />
            </div>
          </section>
        </div>
        <div className="lp-study-home-practice-actions" aria-label="Study modes">
          <button
            type="button"
            className="lp-study-home-primary-action"
            onClick={() => selectStudySkill(STUDY_SKILLS.comprehension)}
            disabled={!canUseComprehension}
          >
            Comprehension
          </button>
          <button
            type="button"
            className="lp-study-home-primary-action"
            onClick={() => selectStudySkill(STUDY_SKILLS.recitation)}
            disabled={!canUseRecitation}
          >
            Recitation
          </button>
        </div>
      </section>
    );
  }

  return (
    <div
      className={[
        'lp-page',
        'bottom-nav-page',
        isStudyHome ? 'study-home-page' : '',
        isLearnActivity && !isStudyHome ? 'learn-mode-page' : '',
        isRecitationMode ? 'recitation-mode-page' : 'comprehension-mode-page',
        isRecitationMode && !showPracticeToolbar ? 'focus-mode-page' : '',
        selectedActivityType && !isStudyHome ? `study-activity-${selectedActivityType}` : ''
      ].filter(Boolean).join(' ')}
      dir="ltr"
    >
      {isStudyHome && renderStudyHome()}

      {!isStudyHome && (
        <header className="lp-course-study-header">
          <button
            type="button"
            className="lp-study-home-link"
            onClick={() => selectStudySkill(STUDY_SKILLS.home)}
          >
            <span aria-hidden="true">←</span>
            Study Home
          </button>
          {!isLearnActivity && (
            <>
            </>
          )}
        </header>
      )}

      {missingExercises.length > 0 && (
        <p className="lp-config-note">
          Missing exercise: {missingExercises.map(({ exercise_id }) => exercise_id).join(', ')}
        </p>
      )}

      {selectedExercise?.exercise && !isStudyHome && (
        isRecitationMode ? renderRecitationWorkspace() : renderPassageExperience()
      )}

      {(isStudyHome || (!isLearnActivity && !isRecitationMode)) && (
        <nav className="lp-course-nav page-nav bottom-page-nav" dir="ltr" aria-label="Course lesson navigation">
          <div className="page-nav-grid">
            <button
              type="button"
              onClick={onPreviousExercise}
              disabled={!hasPreviousExercise}
              className="page-nav-button page-nav-button-start"
            >
              {renderNavLabel('Previous', previousExerciseTitle)}
            </button>
            <button
              type="button"
              onClick={onCourseOverview}
              className="page-nav-button page-nav-button-center"
            >
              <span className="page-nav-label">Course Overview</span>
            </button>
            <button
              type="button"
              onClick={onNextExercise}
              disabled={!hasNextExercise}
              className="page-nav-button page-nav-button-end"
            >
              {renderNavLabel('Next', nextExerciseTitle)}
            </button>
          </div>
        </nav>
      )}
    </div>
  );
}
