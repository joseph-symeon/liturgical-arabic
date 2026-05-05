import React from 'react';
import './course.css';
import BilingualTitle from '../BilingualTitle.jsx';
import { getExerciseTitle } from './exerciseTitles.js';

export default function LessonOverview({
  lesson,
  arabicMode,
  speechRate,
  arabicFontFamily,
  onCourseOverview,
  onSelectExercise
}) {
  return (
    <main className="lp-page" dir="ltr">
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

      <div className="lp-activity-list">
        {(lesson.exercises || []).map((exercise, exerciseIndex) => (
          <a
            key={`${lesson.id}-${exercise.exercise_id}`}
            href={`#course/${encodeURIComponent(lesson.id)}/exercise/${exerciseIndex + 1}`}
            onClick={event => {
              event.preventDefault();
              onSelectExercise(lesson.id, exerciseIndex);
            }}
            className="lp-activity-link"
          >
            {getExerciseTitle(lesson, exerciseIndex)}
          </a>
        ))}
      </div>

      <nav className="lp-course-nav" dir="ltr" aria-label="Lesson navigation">
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
    </main>
  );
}
