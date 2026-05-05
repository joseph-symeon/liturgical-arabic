import React from 'react';
import './course.css';
import ExerciseBlock from './ExerciseBlock.jsx';
import PageHeader from '../PageHeader.jsx';
import exercises from '../../data/exercises.js';
import { getExerciseTitle } from './exerciseTitles.js';

export default function LessonPage({
  lesson,
  arabicMode,
  readerLayout,
  speechRate,
  arabicFontFamily,
  arabicFontWeight,
  arabicFontSize,
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
  const resolvedExercises = exerciseItems
    .map(({ exercise_id, audio_clip }) => ({
      exercise_id,
      exercise: exercises[exercise_id],
      audio_clip: audio_clip || exercises[exercise_id]?.audio_clip
    }));
  const selectedExercise = resolvedExercises[selectedExerciseIndex] ?? resolvedExercises[0];
  const missingExercises = selectedExercise && !selectedExercise.exercise ? [selectedExercise] : [];
  const unitTitle = lesson.unitTitle || lesson.unit_title;
  const exerciseTitle = getExerciseTitle(lesson, selectedExerciseIndex);

  function renderNavLabel(action, destination) {
    return (
      <>
        <span className="page-nav-label">{action}</span>
        {destination && <span className="page-nav-destination">{destination}</span>}
      </>
    );
  }

  return (
    <div className="lp-page" dir="ltr">
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
        <ExerciseBlock
          key={selectedExercise.exercise_id}
          exercise={selectedExercise.exercise}
          audioClip={selectedExercise.audio_clip}
          arabicMode={arabicMode}
          readerLayout={readerLayout}
          speechRate={speechRate}
          arabicFontFamily={arabicFontFamily}
          arabicFontWeight={arabicFontWeight}
          arabicFontSize={arabicFontSize}
        />
      )}

      <nav className="lp-course-nav page-nav" dir="ltr" aria-label="Course lesson navigation">
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
