import React from 'react';
import './course.css';
import { getExerciseTitle } from './exerciseTitles.js';

function hasMultipleExercises(lesson) {
  return (lesson.exercises || []).length > 1;
}

const CURRICULUM_OUTLINE_NOTES = `
Unit 1: Foundations for Participation
1. Lord, have mercy
2. The Jesus Prayer
3. Glory. Both now.
4. Thrice Holy Hymn
5. All Holy Trinity

Unit 2: Entering the Liturgy
1. Come, let us worship
2. The Antiphons
3. Little Litanies
4. The Entrance
5. Liturgy of the Word

Unit 3: Petitions and Responses
1. Litany of Peace
2. Future: Litany of Supplication
3. Future: The Creed
4. Future: The Holy Anaphora

Unit 4: Receiving and Dismissal
1. Future: The Elevation
2. Future: Pre-Communion Prayers
3. Future: Communion Hymns
4. Future: Thanksgiving and Dismissal
`;

export default function CourseOverview({ units, lessons, selectedLessonId, selectedExerciseIndex, onSelectExercise }) {
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
                  if (!hasMultipleExercises(lesson)) {
                    return (
                      <a
                        key={lesson.id}
                        href={`#course/${encodeURIComponent(lesson.id)}/exercise/1`}
                        onClick={event => {
                          event.preventDefault();
                          onSelectExercise(lesson.id, 0);
                        }}
                        className={`lp-course-exercise-link${isCurrentLesson ? ' active' : ''}`}
                      >
                        {lesson.title}
                      </a>
                    );
                  }

                  return (
                    <details className="lp-course-lesson" key={lesson.id} defaultOpen={isCurrentLesson}>
                      <summary className={`lp-course-lesson-summary${isCurrentLesson ? ' active' : ''}`}>
                        {lesson.title}
                      </summary>

                      <div className="lp-course-exercise-list">
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

      <section className="mt-10 border-t border-stone-200 pt-8 dark:border-[var(--dark-border)]">
        <h2 className="mb-4 text-xl font-medium leading-tight">Curriculum Outline</h2>
        <pre className="whitespace-pre-wrap font-sans text-sm leading-7 text-stone-700 dark:text-[var(--dark-muted)]">
          {CURRICULUM_OUTLINE_NOTES.trim()}
        </pre>
      </section>
    </main>
  );
}
