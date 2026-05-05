import React from 'react';
import './course.css';
import { getExerciseTitle } from './exerciseTitles.js';

function hasMultipleExercises(lesson) {
  return (lesson.exercises || []).length > 1;
}

export default function CourseOverview({ units, lessons, selectedLessonId, selectedExerciseIndex, onSelectLesson, onSelectExercise }) {
  return (
    <main className="lp-page" dir="ltr">
      <header className="mb-8" dir="ltr">
        <h1 className="mb-2 text-2xl font-medium leading-tight md:text-3xl">Course Overview</h1>
      </header>

      <div className="lp-course-overview">
        {units.map(unit => {
          const unitLessons = lessons.filter(lesson => lesson.unit_id === unit.id);
          const isCurrentUnit = unitLessons.some(lesson => lesson.id === selectedLessonId);

          return (
            <details className="lp-course-unit" key={unit.id} defaultOpen={isCurrentUnit}>
              <summary className="lp-course-unit-summary">
                <span>Unit {unit.display_order}</span>
                <span>{unit.title}</span>
              </summary>

              <div className="lp-course-lesson-list">
                {unitLessons.map(lesson => {
                  const isCurrentLesson = lesson.id === selectedLessonId;
                  return (
                    <details className="lp-course-lesson" key={lesson.id} defaultOpen={isCurrentLesson}>
                      <summary className={`lp-course-lesson-summary${isCurrentLesson ? ' active' : ''}`}>
                        {lesson.title}
                      </summary>

                      <div className="lp-course-exercise-list">
                        {hasMultipleExercises(lesson) && (
                          <a
                            href={`#course/${encodeURIComponent(lesson.id)}`}
                            onClick={event => {
                              event.preventDefault();
                              onSelectLesson(lesson.id);
                            }}
                            className={`lp-course-exercise-link${isCurrentLesson ? ' active' : ''}`}
                          >
                            Lesson page
                          </a>
                        )}
                        {(lesson.exercises || []).map((exercise, exerciseIndex) => (
                          <a
                            key={`${lesson.id}-${exercise.exercise_id}`}
                            href={`#course/${encodeURIComponent(lesson.id)}/exercise/${exerciseIndex + 1}`}
                            onClick={event => {
                              event.preventDefault();
                              onSelectExercise(lesson.id, exerciseIndex);
                            }}
                            className={`lp-course-exercise-link${isCurrentLesson && selectedExerciseIndex === exerciseIndex ? ' active' : ''}`}
                          >
                            {getExerciseTitle(lesson, exerciseIndex)}
                          </a>
                        ))}
                      </div>
                    </details>
                  );
                })}
              </div>
            </details>
          );
        })}
      </div>
    </main>
  );
}
