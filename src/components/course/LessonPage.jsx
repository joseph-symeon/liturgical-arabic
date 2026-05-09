import React, { useEffect, useState } from 'react';
import './course.css';
import PageHeader from '../PageHeader.jsx';
import PassageExperience from '../passage/PassageExperience.jsx';
import exercises, { getExerciseWithActivity, getStandardActivityOptions } from '../../data/course/exercises.js';
import { getExerciseTitle } from './exerciseTitles.js';
import { getPassageActivityLabel, PASSAGE_ACTIVITY_LABELS, PASSAGE_ACTIVITY_TYPES } from '../../utils/passageActivities.js';
import { createExercisePassage } from '../../utils/passages.js';
import {
  getStoredActivitySelection,
  storeActivitySelection
} from '../../utils/activitySelectionStorage.js';

function getActivityOptions(item) {
  if (item?.activity_options) return augmentSmallExerciseActivityOptions(item.exercise_id, item.activity_options);
  if (item?.activity_policy === 'standard') return getStandardActivityOptions(item.exercise_id);
  return [];
}

function augmentSmallExerciseActivityOptions(exerciseId, activityOptions) {
  const options = activityOptions || [];
  if (!exerciseId || !exercises[exerciseId]) return options;
  const standardOptions = getStandardActivityOptions(exerciseId);
  return standardOptions.reduce((augmentedOptions, standardOption) => {
    if (
      ![PASSAGE_ACTIVITY_TYPES.matching, PASSAGE_ACTIVITY_TYPES.typeArabic].includes(standardOption.activity_type)
        || augmentedOptions.some(option => option.activity_type === standardOption.activity_type)
    ) {
      return augmentedOptions;
    }

    return augmentedOptions.concat({
      label: PASSAGE_ACTIVITY_LABELS[standardOption.activity_type],
      activity_type: standardOption.activity_type
    });
  }, options);
}

function getActivityOptionValue(option) {
  return option?.exercise_id || option?.activity_type || null;
}

function getActivitySelectionKey(lessonId, exerciseItem, exerciseIndex) {
  return `${lessonId}:${exerciseItem?.exercise_id || exerciseIndex}`;
}

function getStoredActivityOptionId(lessonId, exerciseItem, exerciseIndex, activityOptions) {
  const selectionKey = getActivitySelectionKey(lessonId, exerciseItem, exerciseIndex);
  return getStoredActivitySelection(selectionKey, activityOptions.map(getActivityOptionValue).filter(Boolean));
}

function storeActivityOptionId(lessonId, exerciseItem, exerciseIndex, activityOptionId) {
  storeActivitySelection(getActivitySelectionKey(lessonId, exerciseItem, exerciseIndex), activityOptionId);
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
    getStoredActivityOptionId(lesson.id, selectedExerciseItem, selectedExerciseIndex, activityOptions)
  ));
  const selectedActivityOption = activityOptions.find(option => (
    getActivityOptionValue(option) === selectedActivityOptionId
  )) || activityOptions[0] || null;

  useEffect(() => {
    setSelectedActivityOptionId(getStoredActivityOptionId(lesson.id, selectedExerciseItem, selectedExerciseIndex, activityOptions));
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
    <div className="lp-page bottom-nav-page" dir="ltr">
      <PageHeader
        eyebrow={unitTitle}
        title={lesson.title}
        secondaryTitle={exerciseTitle}
      />
      {lesson.subtitle && <p className="lp-subtitle">{lesson.subtitle}</p>}

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
            storeActivityOptionId(lesson.id, selectedExerciseItem, selectedExerciseIndex, value);
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
    </div>
  );
}
