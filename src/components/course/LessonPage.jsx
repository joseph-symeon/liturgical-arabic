import React, { useEffect, useMemo, useState } from 'react';
import './course.css';
import PassageExperience from '../passage/PassageExperience.jsx';
import SelectionTable from '../SelectionTable.jsx';
import exercises, {
  canUseActivityType,
  composeExerciseRange,
  getRecapExerciseIndex,
  getExerciseWithActivity,
  getStandardActivityOptions
} from '../../data/course/exercises.js';
import { getExerciseTitle } from './exerciseTitles.js';
import { PASSAGE_ACTIVITY_LABELS, PASSAGE_ACTIVITY_TYPES } from '../../utils/passageActivities.js';
import { getExercisePhraseIds, getLessonPhraseIds, getPhraseCountLabel } from '../../utils/courseMastery.js';
import { createExercisePassage } from '../../utils/passages.js';
import {
  canUpdateExerciseRange,
  normalizeExerciseRange,
  updateExerciseRange
} from '../../utils/exerciseRanges.js';
import { getStoredPhraseProgressDimensionMaps, PHRASE_PROGRESS_EVENT } from '../../utils/progressScoring.js';
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
const CONFIDENCE_PULSE_MS = 520;
const COMPREHENSION_SESSION_COMPLETE_EVENT = 'liturgical-arabic:comprehension-session-complete';

const RECITATION_ACTIVITY_TYPES = [
  PASSAGE_ACTIVITY_TYPES.readListen,
  PASSAGE_ACTIVITY_TYPES.phraseCaptions,
  PASSAGE_ACTIVITY_TYPES.typeArabic
];

const COMPREHENSION_ACTIVITY_TYPES = [
  PASSAGE_ACTIVITY_TYPES.learn
];

function getActivityOptions(item, resolvedExercise = null) {
  const exerciseTarget = resolvedExercise || item?.exercise_id;
  if (item?.activity_options) {
    return getPrimaryActivityOptions(item.exercise_id, item.activity_options)
      .filter(option => canUseActivityType(exerciseTarget, option.activity_type));
  }
  if (item?.activity_policy === 'standard') return getStandardActivityOptions(exerciseTarget);
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

function formatDrawerConfidence(confidence) {
  const percentage = confidence * 100;
  if (percentage < 10) return `${percentage.toFixed(1)}%`;
  return `${Math.round(percentage)}%`;
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
  selectedExerciseEndIndex = selectedExerciseIndex,
  showProgressPrompt = false,
  onProgressPrompt,
  onStudySkillChange,
  onCourseTrack,
  onSelectExercise,
  onSelectExerciseRange
}) {
  const exerciseItems = lesson.exercises ?? [];
  const recapExerciseIndex = getRecapExerciseIndex(lesson);
  const selectableExerciseCount = recapExerciseIndex ?? exerciseItems.length;
  const selectableExerciseItems = exerciseItems.slice(0, selectableExerciseCount);
  const supportsCompoundSelection = selectableExerciseCount > 1
    && Array.from({ length: selectableExerciseCount - 1 }, (_, index) => (
      composeExerciseRange(lesson, index, index + 1)
    )).some(Boolean);
  const selectedExerciseRange = normalizeExerciseRange(
    selectedExerciseIndex,
    selectedExerciseEndIndex,
    selectableExerciseCount
  );
  const isRecapSelected = recapExerciseIndex !== null && selectedExerciseIndex === recapExerciseIndex;
  const selectedExerciseItem = exerciseItems[selectedExerciseIndex] ?? exerciseItems[0];
  const selectedRangeExercise = useMemo(() => {
    if (!supportsCompoundSelection || isRecapSelected) {
      return exercises[selectedExerciseItem?.exercise_id] || null;
    }
    return composeExerciseRange(
      lesson,
      selectedExerciseRange.startIndex,
      selectedExerciseRange.endIndex
    );
  }, [isRecapSelected, lesson, selectedExerciseItem?.exercise_id, selectedExerciseRange.endIndex, selectedExerciseRange.startIndex, supportsCompoundSelection]);
  const activityOptions = useMemo(
    () => getActivityOptions(selectedExerciseItem, selectedRangeExercise),
    [selectedExerciseItem, selectedRangeExercise]
  );
  const initialStudySkill = studyWorkspace === STUDY_SKILLS.home
    ? STUDY_SKILLS.home
    : getStoredStudySkill(activityOptions);
  const [selectedStudySkill, setSelectedStudySkill] = useState(initialStudySkill);
  const [selectedActivityOptionId, setSelectedActivityOptionId] = useState(() => (
    getResolvedActivityValueForStudySkill(activityOptions, initialStudySkill)
  ));
  const [phraseProgressDimensions, setPhraseProgressDimensions] = useState(getStoredPhraseProgressDimensionMaps);
  const [confidencePulseActive, setConfidencePulseActive] = useState(false);
  const [selectionCleared, setSelectionCleared] = useState(false);
  const recitationOptions = getSkillActivityOptions(activityOptions, STUDY_SKILLS.recitation);
  const comprehensionOptions = getSkillActivityOptions(activityOptions, STUDY_SKILLS.comprehension);
  const availableStudySkills = useMemo(
    () => getAvailableStudySkills(activityOptions),
    [activityOptions]
  );
  const effectiveStudySkill = studyWorkspace && availableStudySkills.includes(studyWorkspace)
    ? studyWorkspace
    : selectedStudySkill;
  const activeSkillOptions = getSkillActivityOptions(activityOptions, effectiveStudySkill);
  const canUseRecitation = recitationOptions.length > 0;
  const canUseComprehension = comprehensionOptions.length > 0;
  const selectedSkillActivityValue = effectiveStudySkill === STUDY_SKILLS.home
    ? selectedActivityOptionId
    : resolveActivityValueForSkill(activityOptions, selectedActivityOptionId, effectiveStudySkill);
  const selectedActivityOption = activityOptions.find(option => (
    getActivityOptionValue(option) === selectedSkillActivityValue
  )) || activeSkillOptions[0] || activityOptions[0] || null;

  useEffect(() => {
    setSelectionCleared(false);
  }, [lesson.id, selectedExerciseEndIndex, selectedExerciseIndex]);

  useEffect(() => {
    const nextStudySkill = studyWorkspace && availableStudySkills.includes(studyWorkspace)
      ? studyWorkspace
      : getStoredStudySkill(activityOptions);
    const resolvedActivityValue = getResolvedActivityValueForStudySkill(activityOptions, nextStudySkill);
    setSelectedStudySkill(nextStudySkill);
    setSelectedActivityOptionId(resolvedActivityValue);
    if (nextStudySkill !== STUDY_SKILLS.home) storeStudySkill(nextStudySkill);
  }, [activityOptions, availableStudySkills, lesson.id, selectedExerciseEndIndex, selectedExerciseIndex, studyWorkspace]);

  useEffect(() => {
    if (effectiveStudySkill === STUDY_SKILLS.home) return;
    if (!selectedSkillActivityValue || selectedSkillActivityValue === selectedActivityOptionId) return;
    setSelectedActivityOptionId(selectedSkillActivityValue);
    storeActivitySelection(SHARED_ACTIVITY_SELECTION_KEY, selectedSkillActivityValue);
  }, [effectiveStudySkill, selectedActivityOptionId, selectedSkillActivityValue]);

  useEffect(() => {
    let pulseFrameId = null;
    let pulseTimeoutId = null;
    const exercisePhraseIds = new Set(getExercisePhraseIds(selectedRangeExercise));

    function cancelConfidencePulseTimers() {
      if (pulseFrameId) cancelAnimationFrame(pulseFrameId);
      if (pulseTimeoutId) clearTimeout(pulseTimeoutId);
      pulseFrameId = null;
      pulseTimeoutId = null;
    }

    function triggerPulseForExercise(event) {
      const detail = event.detail || {};
      const updatedPhraseIds = detail.phraseIds || (detail.phraseId ? [detail.phraseId] : []);
      if (updatedPhraseIds.length > 0 && !updatedPhraseIds.some(phraseId => exercisePhraseIds.has(phraseId))) return;

      cancelConfidencePulseTimers();
      setConfidencePulseActive(false);
      pulseFrameId = requestAnimationFrame(() => {
        setConfidencePulseActive(true);
        pulseTimeoutId = window.setTimeout(() => setConfidencePulseActive(false), CONFIDENCE_PULSE_MS);
      });
    }

    function refreshProgress(event) {
      setPhraseProgressDimensions(getStoredPhraseProgressDimensionMaps());
      if (event.type === PHRASE_PROGRESS_EVENT) triggerPulseForExercise(event);
    }

    function pulseCompletedComprehensionSession(event) {
      triggerPulseForExercise(event);
    }

    window.addEventListener(PHRASE_PROGRESS_EVENT, refreshProgress);
    window.addEventListener(COMPREHENSION_SESSION_COMPLETE_EVENT, pulseCompletedComprehensionSession);
    window.addEventListener('storage', refreshProgress);
    return () => {
      cancelConfidencePulseTimers();
      window.removeEventListener(PHRASE_PROGRESS_EVENT, refreshProgress);
      window.removeEventListener(COMPREHENSION_SESSION_COMPLETE_EVENT, pulseCompletedComprehensionSession);
      window.removeEventListener('storage', refreshProgress);
    };
  }, [selectedRangeExercise]);

  const selectedSourceExercise = selectedActivityOption?.exercise_id
    ? exercises[selectedActivityOption.exercise_id]
    : selectedRangeExercise;
  const selectedActivityTypeOverride = selectedActivityOption?.activity_type || selectedExerciseItem?.activity_type || null;
  const selectedExercise = {
    exercise_id: selectedSourceExercise?.id || selectedExerciseItem?.exercise_id,
    exercise: selectedActivityTypeOverride
      ? getExerciseWithActivity(selectedSourceExercise, selectedActivityTypeOverride)
      : selectedSourceExercise,
    audio_clip: selectedSourceExercise?.audio_clip
  };
  const missingExercises = selectedExercise && !selectedExercise.exercise ? [selectedExercise] : [];
  const unitTitle = lesson.unitTitle || lesson.unit_title;
  const rangeExerciseItems = exerciseItems.slice(
    selectedExerciseRange.startIndex,
    selectedExerciseRange.endIndex + 1
  );
  const rangeExerciseTitles = rangeExerciseItems.map((item, rangeIndex) => (
    item.title || getExerciseTitle(lesson, selectedExerciseRange.startIndex + rangeIndex)
  ));
  const exerciseTitle = supportsCompoundSelection && !isRecapSelected && rangeExerciseItems.length > 1
    ? `${rangeExerciseTitles[0]} ... ${rangeExerciseTitles[rangeExerciseTitles.length - 1]}`
    : getExerciseTitle(lesson, selectedExerciseIndex);
  const hasMultipleExercises = exerciseItems.length > 1;
  const lessonPhraseCount = getLessonPhraseIds(lesson).size;
  const selectedExercisePhraseCount = new Set(getExercisePhraseIds(selectedRangeExercise)).size;
  const studyHomeContext = hasMultipleExercises
    ? 'Select one or more exercises to practice.'
    : exerciseTitle;
  const selectedActivityType = selectedExercise?.exercise?.activity?.type || null;
  const isLearnActivity = selectedActivityType === PASSAGE_ACTIVITY_TYPES.learn;
  const isStudyHome = effectiveStudySkill === STUDY_SKILLS.home;
  const isRecitationMode = effectiveStudySkill === STUDY_SKILLS.recitation;
  const selectedActivityValue = getActivityOptionValue(selectedActivityOption) || selectedExerciseItem.exercise_id;
  const passage = createExercisePassage({ exercise: selectedExercise?.exercise });
  const activityContextHeader = {
    kicker: unitTitle,
    title: lesson.title,
    context: exerciseTitle
  };

  function getExerciseConfidence(item) {
    return getExerciseDimensionConfidence(item, 'overall');
  }

  function getExerciseDimensionConfidence(item, dimension) {
    const exerciseTarget = item?.exercise_id || item;
    const phraseIds = [...new Set(getExercisePhraseIds(exerciseTarget))];
    if (phraseIds.length === 0) return 0;
    const confidenceById = phraseProgressDimensions[dimension] || {};
    const totalConfidence = phraseIds.reduce((total, phraseId) => total + (confidenceById[phraseId] || 0), 0);
    return totalConfidence / phraseIds.length;
  }

  function renderConfidenceBars() {
    const recitationConfidence = getExerciseDimensionConfidence(selectedRangeExercise, 'recitation');
    const comprehensionConfidence = getExerciseDimensionConfidence(selectedRangeExercise, 'comprehension');
    const activeSkill = effectiveStudySkill;
    const activeConfidence = activeSkill === STUDY_SKILLS.comprehension
      ? comprehensionConfidence
      : recitationConfidence;
    const rows = [
      ['recitation', 'Recitation', recitationConfidence],
      ['comprehension', 'Comprehension', comprehensionConfidence]
    ];

    return (
      <div
        className={[
          'lp-drawer-confidence-stack',
          confidencePulseActive ? 'is-pulsing' : ''
        ].filter(Boolean).join(' ')}
        style={{
          '--active-confidence': `${activeConfidence * 100}%`,
          '--active-confidence-offset': activeSkill === STUDY_SKILLS.comprehension ? 'calc(100% + var(--confidence-row-gap))' : '0px'
        }}
        aria-label="Exercise confidence"
      >
        {rows.map(([skill, label, confidence]) => {
          const active = activeSkill === STUDY_SKILLS[skill];
          return (
            <div
              key={skill}
              className={`lp-drawer-confidence-row${active ? ' active' : ' muted'}`}
              style={{ '--confidence': `${confidence * 100}%` }}
            >
              <div className="lp-drawer-confidence-label">
                {label}
              </div>
              <div className="lp-drawer-confidence-track" aria-hidden="true">
                <span />
              </div>
              <strong className="lp-drawer-confidence-percent">{formatDrawerConfidence(confidence)}</strong>
            </div>
          );
        })}
        <div className="lp-drawer-confidence-active-fill" aria-hidden="true">
          <span />
        </div>
      </div>
    );
  }

  function selectActivityValue(value) {
    setSelectedActivityOptionId(value);
    storeActivitySelection(SHARED_ACTIVITY_SELECTION_KEY, value);
  }

  function selectStudySkill(skill) {
    if (skill === effectiveStudySkill) return;
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
    const options = activeSkillOptions;
    if (options.length <= 1) return null;
    return (
      <div className="lp-study-mode-tabs" role="group" aria-label={`${getStudySkillLabel(effectiveStudySkill)} mode`}>
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
        resetKey={`${lesson.id}:${selectedExerciseRange.startIndex}-${selectedExerciseRange.endIndex}`}
        arabicMode={arabicMode}
        readerLayout={readerLayout}
        speechRate={speechRate}
        arabicFontFamily={arabicFontFamily}
        arabicFontWeight={arabicFontWeight}
        arabicFontSize={arabicFontSize}
        showPracticeToolbar={isRecitationMode && showPracticeToolbar}
        preserveToolbarInFocus={isRecitationMode}
        activityContextHeader={activityContextHeader}
        toolbarTop={renderExerciseSkillTabs()}
        toolbarMiddle={renderActivityModeTabs()}
        toolbarBottom={renderConfidenceBars()}
        learnSetupToolbarTop={renderExerciseSkillTabs()}
        learnSetupToolbarBottom={renderConfidenceBars()}
        learnCompleteToolbarBottom={renderConfidenceBars()}
        dockLearnSetupControls={!isRecitationMode}
        onCourseTrack={onCourseTrack}
        recitationUnitPhraseCount={selectedExercisePhraseCount || lessonPhraseCount}
      />
    );
  }

  function renderProgressPrompt() {
    if (!showProgressPrompt) return null;
    return (
      <aside className="lp-course-progress-prompt" aria-label="Preview mode">
        <div>
          <strong>Preview mode</strong>
          <span>Sign in to access the full course and save progress across devices.</span>
        </div>
        <button type="button" onClick={onProgressPrompt}>
          Sign in
        </button>
      </aside>
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
              className={effectiveStudySkill === skill ? 'active' : ''}
              aria-selected={effectiveStudySkill === skill}
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

  function selectCompoundExercise(exerciseIndex) {
    setSelectionCleared(false);
    const nextRange = updateExerciseRange(selectedExerciseRange, exerciseIndex);
    const nextExercise = composeExerciseRange(lesson, nextRange.startIndex, nextRange.endIndex);
    const resolvedRange = nextExercise
      ? nextRange
      : { startIndex: exerciseIndex, endIndex: exerciseIndex };
    onSelectExerciseRange?.(resolvedRange.startIndex, resolvedRange.endIndex, STUDY_SKILLS.home);
  }

  function practiceCompoundSelection() {
    if (selectionCleared) return;
    if (isRecapSelected && recapExerciseIndex !== null) {
      onSelectExercise?.(recapExerciseIndex, STUDY_SKILLS.recitation);
      return;
    }
    onSelectExerciseRange?.(
      selectedExerciseRange.startIndex,
      selectedExerciseRange.endIndex,
      STUDY_SKILLS.recitation
    );
  }

  function selectExerciseRow(exerciseIndex) {
    const selectionCount = isRecapSelected
      ? selectableExerciseCount
      : selectedExerciseRange.endIndex - selectedExerciseRange.startIndex + 1;
    const isExerciseSelected = !selectionCleared && (
      isRecapSelected
        || (exerciseIndex >= selectedExerciseRange.startIndex && exerciseIndex <= selectedExerciseRange.endIndex)
    );
    if (isExerciseSelected && selectionCount === 1) {
      setSelectionCleared(true);
      return;
    }
    if (supportsCompoundSelection && (selectionCleared || isRecapSelected)) {
      setSelectionCleared(false);
      onSelectExerciseRange?.(exerciseIndex, exerciseIndex, STUDY_SKILLS.home);
      return;
    }
    setSelectionCleared(false);
    if (supportsCompoundSelection) {
      selectCompoundExercise(exerciseIndex);
      return;
    }
    onSelectExercise?.(exerciseIndex, STUDY_SKILLS.home);
  }

  function toggleAllExercises() {
    const selectionCount = selectionCleared
      ? 0
      : isRecapSelected
        ? selectableExerciseCount
        : selectedExerciseRange.endIndex - selectedExerciseRange.startIndex + 1;
    if (selectionCount === selectableExerciseCount) {
      setSelectionCleared(true);
      return;
    }
    setSelectionCleared(false);
    if (recapExerciseIndex !== null) {
      onSelectExercise?.(recapExerciseIndex, STUDY_SKILLS.home);
      return;
    }
    onSelectExerciseRange?.(0, Math.max(0, selectableExerciseCount - 1), STUDY_SKILLS.home);
  }

  function renderStudyHome() {
    return (
      <section className="lp-study-home" aria-labelledby="study-home-title">
        <div className="lp-view-header">
          <div className="lp-view-kicker">{unitTitle}</div>
          <h1 className="lp-view-title" id="study-home-title">{lesson.title}</h1>
          <div className="lp-view-meta">{studyHomeContext}</div>
        </div>
        {renderProgressPrompt()}

        <section className="lp-study-home-exercise-summary" aria-label="Exercises">
          <SelectionTable
            ariaLabel={`${lesson.title} exercises`}
            className="lp-exercise-selection-table"
            mobileLayout="stacked"
            mobileSelectAllLabel={`Select all (${selectableExerciseCount} ${selectableExerciseCount === 1 ? 'exercise' : 'exercises'})`}
            rows={selectableExerciseItems.map((item, exerciseIndex) => ({
              ...item,
              exerciseIndex,
              selectionLabel: getExerciseTitle(lesson, exerciseIndex)
            }))}
            columns={[
              {
                key: 'exercise',
                label: 'Exercise',
                width: '34%',
                className: 'lp-exercise-table-exercise',
                render: row => <strong className="lp-exercise-table-title">{getExerciseTitle(lesson, row.exerciseIndex)}</strong>
              },
              {
                key: 'phrases',
                label: 'Phrases',
                width: '20%',
                className: 'lp-exercise-table-phrases',
                render: row => {
                  const phraseCount = new Set(getExercisePhraseIds(row.exercise_id)).size;
                  return (
                    <>
                      <span className="lp-exercise-table-phrase-count-desktop">{phraseCount}</span>
                      <span className="lp-exercise-table-phrase-count-mobile">{getPhraseCountLabel(phraseCount)}</span>
                    </>
                  );
                }
              },
              {
                key: 'confidence',
                label: 'Confidence',
                width: '46%',
                className: 'lp-exercise-table-confidence-cell',
                render: row => {
                  const confidence = getExerciseConfidence(row);
                  const percentage = Math.round(confidence * 100);
                  return (
                    <span className="lp-exercise-table-confidence" aria-label={`${percentage}% confidence`}>
                      <span aria-hidden="true"><span style={{ width: `${percentage}%` }} /></span>
                      <strong>{percentage}%</strong>
                    </span>
                  );
                }
              }
            ]}
            getRowId={row => row.exercise_id}
            selectedRowIds={new Set(selectionCleared
              ? []
              : selectableExerciseItems
                .filter((item, exerciseIndex) => (
                  isRecapSelected
                    || (exerciseIndex >= selectedExerciseRange.startIndex && exerciseIndex <= selectedExerciseRange.endIndex)
                ))
                .map(item => item.exercise_id))}
            allSelected={!selectionCleared && (
              isRecapSelected
                || (selectedExerciseRange.startIndex === 0
                  && selectedExerciseRange.endIndex === selectableExerciseCount - 1)
            )}
            someSelected={!selectionCleared && !isRecapSelected && !(
              selectedExerciseRange.startIndex === 0
                && selectedExerciseRange.endIndex === selectableExerciseCount - 1
            )}
            isRowDisabled={(item, exerciseIndex) => {
              if (!supportsCompoundSelection || selectionCleared || isRecapSelected) return false;
              const candidateRange = updateExerciseRange(selectedExerciseRange, exerciseIndex);
              const candidateExercise = composeExerciseRange(lesson, candidateRange.startIndex, candidateRange.endIndex);
              return !(
                canUpdateExerciseRange(selectedExerciseRange, exerciseIndex)
                  && Boolean(candidateExercise || selectedExerciseRange.startIndex === selectedExerciseRange.endIndex)
              );
            }}
            onToggleRow={(item, exerciseIndex) => selectExerciseRow(exerciseIndex)}
            onToggleAll={toggleAllExercises}
            selectAllLabel={`Select all ${selectableExerciseCount} exercises`}
          />
          {selectableExerciseCount > 0 && (
            <div className="lp-compound-selection-actions">
              <div className="lp-compound-selection-summary">
                <strong>
                  {selectionCleared
                    ? 'No exercises selected'
                    : `${isRecapSelected
                      ? selectableExerciseCount
                      : selectedExerciseRange.endIndex - selectedExerciseRange.startIndex + 1} ${isRecapSelected || selectedExerciseRange.endIndex > selectedExerciseRange.startIndex ? 'exercises' : 'exercise'} selected`}
                </strong>
                <button type="button" className="lp-compound-selection-clear" onClick={() => setSelectionCleared(true)} disabled={selectionCleared}>
                  Clear selection
                </button>
              </div>
              <div className="lp-compound-selection-action lp-activity-toolbar-action">
                <button
                  type="button"
                  className="lp-activity-button lp-activity-submit"
                  onClick={practiceCompoundSelection}
                  disabled={!selectedRangeExercise || selectionCleared}
                >
                  Study Selected ({selectionCleared ? 0 : isRecapSelected
                    ? selectableExerciseCount
                    : selectedExerciseRange.endIndex - selectedExerciseRange.startIndex + 1})
                </button>
              </div>
            </div>
          )}
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
        isStudyHome && selectableExerciseCount > 0 ? 'compound-selection-active' : '',
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
