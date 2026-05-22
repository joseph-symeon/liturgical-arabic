import React, { useEffect, useState } from 'react';
import './course.css';
import PageHeader from '../PageHeader.jsx';
import PassageExperience from '../passage/PassageExperience.jsx';
import exercises, { canUseActivityType, getExerciseWithActivity, getStandardActivityOptions } from '../../data/course/exercises.js';
import { getExerciseTitle } from './exerciseTitles.js';
import { getPassageActivityLabel, PASSAGE_ACTIVITY_LABELS, PASSAGE_ACTIVITY_TYPES } from '../../utils/passageActivities.js';
import { createExercisePassage } from '../../utils/passages.js';
import {
  resolveStoredActivitySelection,
  SHARED_ACTIVITY_SELECTION_KEY,
  storeActivitySelection
} from '../../utils/activitySelectionStorage.js';

function getActivityOptions(item) {
  if (item?.activity_options) {
    return getPrimaryActivityOptions(item.exercise_id, item.activity_options)
      .filter(option => canUseActivityType(item.exercise_id, option.activity_type));
  }
  if (item?.activity_policy === 'standard') return getStandardActivityOptions(item.exercise_id);
  return [];
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
      label: PASSAGE_ACTIVITY_LABELS[PASSAGE_ACTIVITY_TYPES.learn],
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
  onCourseOverview,
  onPreviousExercise,
  onNextExercise
}) {
  const exerciseItems = lesson.exercises ?? [];
  const selectedExerciseItem = exerciseItems[selectedExerciseIndex] ?? exerciseItems[0];
  const activityOptions = getActivityOptions(selectedExerciseItem);
  const [selectedActivityOptionId, setSelectedActivityOptionId] = useState(() => (
    getResolvedActivityOptionId(activityOptions)
  ));
  const selectedActivityOption = activityOptions.find(option => (
    getActivityOptionValue(option) === selectedActivityOptionId
  )) || activityOptions[0] || null;

  useEffect(() => {
    setSelectedActivityOptionId(getResolvedActivityOptionId(activityOptions));
  }, [lesson.id, selectedExerciseIndex]);

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
  const selectedActivityLabel = selectedActivityOption?.label || getPassageActivityLabel(selectedExercise?.exercise?.activity);
  const selectedActivityValue = getActivityOptionValue(selectedActivityOption) || selectedExerciseItem.exercise_id;
  const passage = createExercisePassage({ exercise: selectedExercise?.exercise });

  function renderNavLabel(action, destination) {
    return (
      <>
        <span className="page-nav-label">{action}</span>
        {destination && <span className="page-nav-destination">{destination}</span>}
      </>
    );
  }

  return (
    <div className={`lp-page bottom-nav-page${isLearnActivity ? " learn-mode-page" : ""}`} dir="ltr">
      {!isLearnActivity && (
        <PageHeader
          eyebrow={unitTitle}
          title={lesson.title}
          secondaryTitle={exerciseTitle}
        />
      )}
      {!isLearnActivity && lesson.subtitle && <p className="lp-subtitle">{lesson.subtitle}</p>}

      {missingExercises.length > 0 && (
        <p className="lp-config-note">
          Missing exercise: {missingExercises.map(({ exercise_id }) => exercise_id).join(', ')}
        </p>
      )}

      {selectedExercise?.exercise && (
        <PassageExperience
          passage={passage}
          activityLabel={selectedActivityLabel}
          activitySelectId="lp-activity-select"
          activityOptions={activityOptions.map(option => ({
            label: option.label,
            value: getActivityOptionValue(option)
          }))}
          selectedActivityValue={selectedActivityValue}
          onSelectActivity={value => {
            setSelectedActivityOptionId(value);
            storeActivitySelection(SHARED_ACTIVITY_SELECTION_KEY, value);
          }}
          activityType={selectedActivityType}
          resetKey={`${lesson.id}:${selectedExerciseIndex}`}
          arabicMode={arabicMode}
          readerLayout={readerLayout}
          speechRate={speechRate}
          arabicFontFamily={arabicFontFamily}
          arabicFontWeight={arabicFontWeight}
          arabicFontSize={arabicFontSize}
          showPracticeToolbar={showPracticeToolbar}
        />
      )}

      {!isLearnActivity && (
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
