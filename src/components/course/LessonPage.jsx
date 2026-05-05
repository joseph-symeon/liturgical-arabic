import React from 'react';
import './course.css';
import ExerciseBlock from './ExerciseBlock.jsx';
import BilingualTitle from '../BilingualTitle.jsx';
import exercises from '../../data/exercises.js';

export default function LessonPage({
  lesson,
  arabicMode,
  readerLayout,
  speechRate,
  arabicFontFamily,
  arabicFontWeight,
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

  return (
    <div className="lp-page" dir="ltr">
      <header className="mb-8" dir="ltr">
        <BilingualTitle
          as="h1"
          english={lesson.title}
          phraseId={lesson.title_phrase}
          arabicMode={arabicMode}
          speechRate={speechRate}
          arabicFontFamily={arabicFontFamily}
          arabicFontWeight="500"
          className="text-2xl font-medium leading-tight md:text-3xl"
        />
      </header>
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
        />
      )}

      <nav className="lp-course-nav" dir="ltr" aria-label="Course lesson navigation">
        <div className="lp-course-nav-row">
          <button
            type="button"
            onClick={onPreviousExercise}
            disabled={!hasPreviousExercise}
            className="rounded border border-stone-300 px-3 py-1 text-sm disabled:cursor-default disabled:opacity-40 dark:border-stone-600"
          >
            {previousExerciseTitle ? `Previous: ${previousExerciseTitle}` : 'Previous'}
          </button>
          <button
            type="button"
            onClick={onNextExercise}
            disabled={!hasNextExercise}
            className="rounded border border-stone-300 px-3 py-1 text-sm disabled:cursor-default disabled:opacity-40 dark:border-stone-600"
          >
            {nextExerciseTitle ? `Next: ${nextExerciseTitle}` : 'Next'}
          </button>
        </div>
        <div className="lp-course-nav-row">
          <button
            type="button"
            onClick={onCourseOverview}
            className="rounded border border-stone-300 px-3 py-1 text-sm dark:border-stone-600"
          >
            Course Overview
          </button>
        </div>
      </nav>
    </div>
  );
}
