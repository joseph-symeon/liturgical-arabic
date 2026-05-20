import React, { useState } from 'react';
import './course.css';
import exercises from '../../data/course/exercises.js';
import { getLiturgyCoverageAnalysis } from '../../utils/liturgyCoverage.js';

function formatCoveragePercent(value) {
  return `${Math.round(value * 100)}%`;
}

const COVERAGE_PHRASES_PER_PAGE = 10;
const COURSE_OVERVIEW_OMITTED_UNIT_IDS = new Set(['daily-seasonal-prayers']);

function getExercisePhraseIds(exerciseId) {
  return (exercises[exerciseId]?.lines || []).flatMap(line => (
    line.tags?.includes('rubric')
      ? []
      : (line.phrases || [])
        .filter(part => part.phrase_id)
        .map(part => part.phrase_id)
  ));
}

function getCoursePhraseProgress(units, lessons, liturgyPhraseIds = new Set()) {
  const seenPhraseIds = new Set();
  const sortedUnits = [...units]
    .filter(unit => !COURSE_OVERVIEW_OMITTED_UNIT_IDS.has(unit.id))
    .sort((a, b) => a.display_order - b.display_order);

  const unitRows = sortedUnits.map(unit => {
    const unitNewPhraseIds = new Set();
    const unitPhraseIds = new Set();
    const lessonRows = lessons
      .filter(lesson => lesson.unit_id === unit.id)
      .sort((a, b) => a.display_order - b.display_order)
      .map(lesson => {
        const lessonNewPhraseIds = new Set();
        const lessonPhraseIds = new Set();

        (lesson.exercises || []).forEach(item => {
          getExercisePhraseIds(item.exercise_id).forEach(phraseId => {
            if (!liturgyPhraseIds.has(phraseId)) return;
            lessonPhraseIds.add(phraseId);
            unitPhraseIds.add(phraseId);
            if (!seenPhraseIds.has(phraseId)) {
              seenPhraseIds.add(phraseId);
              lessonNewPhraseIds.add(phraseId);
              unitNewPhraseIds.add(phraseId);
            }
          });
        });

        return {
          id: lesson.id,
          title: lesson.title,
          exerciseCount: lesson.exercises?.length ?? 0,
          newPhraseCount: lessonNewPhraseIds.size,
          uniquePhraseCount: lessonPhraseIds.size
        };
      });
    const unitExerciseCount = lessonRows.reduce((total, lesson) => total + lesson.exerciseCount, 0);

    return {
      id: unit.id,
      title: unit.title,
      displayOrder: unit.display_order,
      exerciseCount: unitExerciseCount,
      newPhraseCount: unitNewPhraseIds.size,
      uniquePhraseCount: unitPhraseIds.size,
      cumulativePhraseCount: seenPhraseIds.size,
      lessons: lessonRows
    };
  });

  return {
    totalNewPhraseCount: seenPhraseIds.size,
    units: unitRows
  };
}

export default function CourseOverview({ units, lessons, selectedLessonId, onSelectExercise }) {
  const [coveragePage, setCoveragePage] = useState(0);
  const liturgyCoverage = getLiturgyCoverageAnalysis();
  const coursePhraseProgress = getCoursePhraseProgress(units, lessons, liturgyCoverage.uniquePhraseIds);
  const coveragePageCount = Math.max(1, Math.ceil(liturgyCoverage.topByPhraseOccurrences.length / COVERAGE_PHRASES_PER_PAGE));
  const clampedCoveragePage = Math.min(coveragePage, coveragePageCount - 1);
  const coverageRows = liturgyCoverage.topByPhraseOccurrences.slice(
    clampedCoveragePage * COVERAGE_PHRASES_PER_PAGE,
    (clampedCoveragePage + 1) * COVERAGE_PHRASES_PER_PAGE
  );
  const firstCoverageRank = clampedCoveragePage * COVERAGE_PHRASES_PER_PAGE + 1;
  const lastCoverageRank = firstCoverageRank + coverageRows.length - 1;
  return (
    <main className="lp-page" dir="ltr">
      <header className="lp-course-landing-header" dir="ltr">
        <p className="lp-course-coverage-kicker">Liturgical Arabic</p>
        <h1>Learn the Divine Liturgy in Arabic.</h1>
        <div className="lp-course-landing-kpi">
          <span>{liturgyCoverage.uniquePhraseCount.toLocaleString()}</span>
          <span>unique phrases</span>
        </div>
        <p>
          This course guides you through the Arabic of the Divine Liturgy. The prayers and petitions of the choir and the
          prayers said aloud by the clergy contain {liturgyCoverage.uniquePhraseCount.toLocaleString()} unique phrases.
        </p>
        <p>
          Begin with the phrases you will hear again and again. Each unit combines reading, listening, translation, and guided
          practice, ordered by frequency and shaped around prayers that also belong to daily prayer.
        </p>
      </header>

      <section className="lp-course-phrase-progress" aria-labelledby="course-phrase-progress-title">
        <div className="lp-course-phrase-progress-header">
          <div>
            <p className="lp-course-coverage-kicker">Course Vocabulary</p>
            <h2 id="course-phrase-progress-title">New phrases introduced</h2>
          </div>
        </div>

        <div className="lp-course-phrase-progress-grid">
          {coursePhraseProgress.units.map(unit => (
            <div className="lp-course-phrase-progress-unit" key={unit.id}>
              <div className="lp-course-phrase-progress-unit-header">
                <h3>Unit {unit.displayOrder}</h3>
                <span>{formatCoveragePercent(liturgyCoverage.uniquePhraseCount ? unit.cumulativePhraseCount / liturgyCoverage.uniquePhraseCount : 0)} of Liturgy</span>
              </div>
              <div className="lp-course-phrase-progress-meter" aria-hidden="true">
                <span style={{ width: `${liturgyCoverage.uniquePhraseCount ? Math.min(100, (unit.cumulativePhraseCount / liturgyCoverage.uniquePhraseCount) * 100) : 0}%` }} />
              </div>
              <table className="lp-course-coverage-table lp-course-phrase-progress-table">
                <thead>
                  <tr>
                    <th>Lesson</th>
                    <th>{unit.exerciseCount.toLocaleString()} {unit.exerciseCount === 1 ? 'exercise' : 'exercises'}</th>
                    <th>{unit.newPhraseCount.toLocaleString()} new phrases</th>
                  </tr>
                </thead>
                <tbody>
                  {unit.lessons.map(lesson => {
                    const isCurrentLesson = lesson.id === selectedLessonId;
                    return (
                      <tr key={lesson.id}>
                        <td>
                          <a
                            href={`#course/${encodeURIComponent(lesson.id)}/exercise/1`}
                            onClick={event => {
                              event.preventDefault();
                              onSelectExercise(lesson.id, 0);
                            }}
                            className={`lp-course-phrase-progress-lesson-link${isCurrentLesson ? ' active' : ''}`}
                          >
                            {lesson.title}
                          </a>
                        </td>
                        <td>{lesson.exerciseCount.toLocaleString()}</td>
                        <td>{lesson.newPhraseCount.toLocaleString()}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </section>

      <section className="lp-course-coverage" aria-labelledby="course-coverage-title">
        <div className="lp-course-coverage-table-header">
          <div>
            <p className="lp-course-coverage-kicker">Phrase Frequency</p>
            <h2 id="course-coverage-title">Highest-Coverage Phrases</h2>
          </div>
        </div>
        <table className="lp-course-coverage-table lp-course-coverage-phrases">
          <thead>
            <tr>
              <th>Phrase</th>
              <th>Occurrences</th>
            </tr>
          </thead>
          <tbody>
            {coverageRows.map(row => (
              <tr key={row.id}>
                <td>
                  <span className="lp-course-coverage-arabic" dir="rtl">{row.arabic}</span>
                  <span className="lp-course-coverage-translation">{row.translation}</span>
                </td>
                <td>{row.phraseOccurrences}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <nav className="lp-course-coverage-pagination" aria-label="Highest-coverage phrases pages">
          <div className="lp-course-coverage-pagination-controls">
            <button
              type="button"
              onClick={() => setCoveragePage(page => Math.max(0, page - 1))}
              disabled={clampedCoveragePage === 0}
            >
              Previous
            </button>
            {Array.from({ length: coveragePageCount }, (_, pageIndex) => (
              <button
                key={pageIndex}
                type="button"
                onClick={() => setCoveragePage(pageIndex)}
                className={clampedCoveragePage === pageIndex ? 'active' : ''}
                aria-current={clampedCoveragePage === pageIndex ? 'page' : undefined}
              >
                {pageIndex + 1}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setCoveragePage(page => Math.min(coveragePageCount - 1, page + 1))}
              disabled={clampedCoveragePage === coveragePageCount - 1}
            >
              Next
            </button>
          </div>
          <span>
            {firstCoverageRank}-{lastCoverageRank} of {liturgyCoverage.topByPhraseOccurrences.length}
          </span>
        </nav>
      </section>

    </main>
  );
}
