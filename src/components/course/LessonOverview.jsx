import React from 'react';
import './course.css';
import PageHeader from '../PageHeader.jsx';
import { getExerciseTitle } from './exerciseTitles.js';

export default function LessonOverview({
  lesson,
  onCourseOverview,
  onSelectExercise
}) {
  return (
    <main className="lp-page" dir="ltr">
      <PageHeader
        eyebrow={lesson.unitTitle || lesson.unit_title}
        title={lesson.title}
      />

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

      <nav className="lp-course-nav page-nav" dir="ltr" aria-label="Lesson navigation">
        <div className="page-nav-grid">
          <button
            type="button"
            onClick={onCourseOverview}
            className="page-nav-button page-nav-button-center"
          >
            <span className="page-nav-label">Course Overview</span>
          </button>
        </div>
      </nav>
    </main>
  );
}
