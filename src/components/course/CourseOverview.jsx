import React, { useMemo, useState } from 'react';
import './course.css';
import { getExerciseTitle } from './exerciseTitles.js';
import { getLiturgyCoverageAnalysis } from '../../utils/liturgyCoverage.js';

function hasMultipleExercises(lesson) {
  return (lesson.exercises || []).length > 1;
}

function formatPercent(value) {
  return `${Math.round(value * 100)}%`;
}

const liturgyCoverage = getLiturgyCoverageAnalysis();
const eightyPercentPhraseMilestone = liturgyCoverage.phraseOccurrenceMilestones.find(milestone => milestone.coverage === 0.8);
const COVERAGE_PHRASES_PER_PAGE = 10;
const COVERAGE_PAGE_COUNT = 5;

export default function CourseOverview({ units, lessons, selectedLessonId, selectedExerciseIndex, onSelectExercise }) {
  const [coveragePage, setCoveragePage] = useState(0);
  const coverageRows = useMemo(
    () => liturgyCoverage.topByPhraseOccurrences.slice(
      coveragePage * COVERAGE_PHRASES_PER_PAGE,
      (coveragePage + 1) * COVERAGE_PHRASES_PER_PAGE
    ),
    [coveragePage]
  );
  const firstCoverageRank = coveragePage * COVERAGE_PHRASES_PER_PAGE + 1;
  const lastCoverageRank = firstCoverageRank + coverageRows.length - 1;

  return (
    <main className="lp-page" dir="ltr">
      <header className="mb-8" dir="ltr">
        <h1 className="mb-2 text-2xl font-medium leading-tight md:text-3xl">Course Overview</h1>
      </header>

      <section className="lp-course-coverage" aria-labelledby="course-coverage-title">
        <div className="lp-course-coverage-header">
          <div>
            <p className="lp-course-coverage-kicker">Liturgy Coverage</p>
            <h2 id="course-coverage-title">High-frequency phrase analysis</h2>
          </div>
          {eightyPercentPhraseMilestone && (
            <div className="lp-course-coverage-callout">
              <span>{eightyPercentPhraseMilestone.phraseCount}</span>
              <span>phrases for {formatPercent(eightyPercentPhraseMilestone.coverage)} of phrase appearances</span>
            </div>
          )}
        </div>

        <div className="lp-course-coverage-explainer">
          <p>
            This analysis counts <strong>{liturgyCoverage.uniquePhraseCount.toLocaleString()} unique aloud phrases</strong> across{' '}
            <strong>{liturgyCoverage.totalPhraseOccurrences.toLocaleString()} phrase appearances</strong> in the public Divine
            Liturgy.
          </p>
          <p>
            A phrase appearance is one spoken slot in the service. For example, <span dir="rtl">آمِين</span> may be a short phrase,
            but every time it appears, it counts as another appearance learners can recognize.
          </p>
          {eightyPercentPhraseMilestone && (
            <p>
              <strong>
                {eightyPercentPhraseMilestone.phraseCount.toLocaleString()} phrases for{' '}
                {formatPercent(eightyPercentPhraseMilestone.coverage)} phrase coverage
              </strong>{' '}
              means those phrases account for about four out of every five spoken phrase appearances in this Liturgy.
            </p>
          )}
        </div>

        <div className="lp-course-coverage-stats" aria-label="Coverage corpus summary">
          <div>
            <span>{liturgyCoverage.uniquePhraseCount.toLocaleString()}</span>
            <span>unique aloud phrases</span>
          </div>
          <div>
            <span>{liturgyCoverage.totalPhraseOccurrences.toLocaleString()}</span>
            <span>phrase occurrences</span>
          </div>
          <div>
            <span>{liturgyCoverage.totalTokenOccurrences.toLocaleString()}</span>
            <span>Arabic words</span>
          </div>
        </div>

        <div className="lp-course-coverage-grid">
          <div className="lp-course-coverage-panel">
            <h3>Coverage Milestones</h3>
            <table className="lp-course-coverage-table">
              <thead>
                <tr>
                  <th>Phrase occurrence coverage</th>
                  <th>Phrases</th>
                </tr>
              </thead>
              <tbody>
                {liturgyCoverage.phraseOccurrenceMilestones.map(milestone => (
                  <tr key={milestone.coverage}>
                    <td>{formatPercent(milestone.coverage)}</td>
                    <td>{milestone.phraseCount.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="lp-course-coverage-panel">
            <div className="lp-course-coverage-table-header">
              <h3>Highest-Coverage Phrases</h3>
              <span>
                {firstCoverageRank}-{lastCoverageRank} of {liturgyCoverage.topByPhraseOccurrences.length}
              </span>
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
              <button
                type="button"
                onClick={() => setCoveragePage(page => Math.max(0, page - 1))}
                disabled={coveragePage === 0}
              >
                Previous
              </button>
              {Array.from({ length: COVERAGE_PAGE_COUNT }, (_, pageIndex) => (
                <button
                  key={pageIndex}
                  type="button"
                  onClick={() => setCoveragePage(pageIndex)}
                  className={coveragePage === pageIndex ? 'active' : ''}
                  aria-current={coveragePage === pageIndex ? 'page' : undefined}
                >
                  {pageIndex + 1}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setCoveragePage(page => Math.min(COVERAGE_PAGE_COUNT - 1, page + 1))}
                disabled={coveragePage === COVERAGE_PAGE_COUNT - 1}
              >
                Next
              </button>
            </nav>
          </div>
        </div>

        <p className="lp-course-coverage-note">
          Based on the public Divine Liturgy of St John Chrysostom, excluding Prothesis, rubrics, and quiet priest prayers.
          Coverage is ranked by how often each aloud phrase appears.
        </p>
      </section>

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

    </main>
  );
}
