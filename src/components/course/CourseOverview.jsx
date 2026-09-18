import React, { useEffect, useState } from 'react';
import './course.css';
import CourseAccountPrompt from './CourseAccountPrompt.jsx';
import courseTracks from '../../data/course/courseTracks.js';
import { getRecapExerciseIndex } from '../../data/course/exercises.js';
import {
  getCourseItemLessonIds,
  getCourseItemPhraseIds,
  getLessonPhraseIds,
  getPhraseCountLabel,
  getServiceConfidenceRows
} from '../../utils/courseMastery.js';
import { getStoredPhraseConfidenceMap, PHRASE_PROGRESS_EVENT } from '../../utils/progressScoring.js';

function formatPercent(value) {
  return `${Math.round(value * 100)}%`;
}

function getLessonById(lessons, lessonId) {
  return lessons.find(lesson => lesson.id === lessonId);
}

function getBonusItems(trackId) {
  return courseTracks.filter(item => item.parent_track_id === trackId);
}

function getLessonConfidence(lesson, phraseConfidenceById) {
  const phraseIds = [...getLessonPhraseIds(lesson)];
  if (phraseIds.length === 0) return 0;
  const totalConfidence = phraseIds.reduce((total, phraseId) => total + (phraseConfidenceById[phraseId] || 0), 0);
  return totalConfidence / phraseIds.length;
}

function getRequiredTrackConfidence(track, phraseConfidenceById) {
  const phraseIds = [...getCourseItemPhraseIds(track)];
  if (phraseIds.length === 0) return 0;
  const totalConfidence = phraseIds.reduce((total, phraseId) => total + (phraseConfidenceById[phraseId] || 0), 0);
  return totalConfidence / phraseIds.length;
}

export default function CourseOverview({
  lessons,
  selectedLessonId,
  selectedTrackId,
  showProgressPrompt = false,
  onCreateAccount,
  onSignIn,
  canAccessLesson = () => true,
  onBlockedLesson,
  onSelectTrack,
  onSelectExercise,
  onSelectService,
  onConfidenceGuide
}) {
  const primaryPathItems = courseTracks.filter(item => item.type === 'track' && !item.parent_track_id);
  const [phraseConfidenceById, setPhraseConfidenceById] = useState(getStoredPhraseConfidenceMap);
  const masteryRows = getServiceConfidenceRows(phraseConfidenceById);
  const topMasteryRows = masteryRows.slice(0, 6);
  const selectedTrack = courseTracks.find(item => item.id === selectedTrackId);
  const coursePhraseCount = new Set(primaryPathItems.flatMap(item => (
    [...getCourseItemPhraseIds(item)]
  ))).size;

  useEffect(() => {
    function refreshProgress() {
      setPhraseConfidenceById(getStoredPhraseConfidenceMap());
    }
    window.addEventListener(PHRASE_PROGRESS_EVENT, refreshProgress);
    window.addEventListener('storage', refreshProgress);
    return () => {
      window.removeEventListener(PHRASE_PROGRESS_EVENT, refreshProgress);
      window.removeEventListener('storage', refreshProgress);
    };
  }, []);

  function openLesson(lessonId) {
    const lesson = getLessonById(lessons, lessonId);
    if (!lesson) return;
    if (!canAccessLesson(lesson.id)) {
      onBlockedLesson?.(lesson.id);
      return;
    }
    onSelectExercise(lesson.id, 0, (lesson.exercises?.length || 0) === 1 ? 'recitation' : 'home');
  }

  function getTrackLessonRows(track) {
    const coreLessonIds = getCourseItemLessonIds(track);
    const coreRows = coreLessonIds
      .map((lessonId, index) => ({
        id: lessonId,
        lesson: getLessonById(lessons, lessonId),
        type: 'core',
        sequenceIndex: index * 10
      }))
      .filter(row => row.lesson);

    const bonusRows = getBonusItems(track.id)
      .map(item => ({
        id: item.lesson_id || item.id,
        lesson: getLessonById(lessons, item.lesson_id),
        type: 'bonus',
        sequenceIndex: item.sequence_after_lesson_id
          ? ((coreLessonIds.indexOf(item.sequence_after_lesson_id) + 1) * 10) - 5
          : Number.isFinite(item.sequence_index)
            ? item.sequence_index
            : coreLessonIds.length * 10 + 5
      }))
      .filter(row => row.lesson);

    return coreRows
      .concat(bonusRows)
      .sort((a, b) => a.sequenceIndex - b.sequenceIndex)
      .map((row, index, rows) => ({
        ...row,
        label: row.type === 'bonus'
          ? 'Bonus'
          : rows.slice(0, index + 1).filter(item => item.type !== 'bonus').length
      }));
  }

  function openTrack(item) {
    onSelectTrack(item.parent_track_id || item.id);
  }

  function renderProgressPrompt() {
    if (!showProgressPrompt) return null;
    return <CourseAccountPrompt onCreateAccount={onCreateAccount} onSignIn={onSignIn} />;
  }

  function renderLockStatus() {
    return (
      <span className="lp-lesson-lock-status">
        <svg aria-hidden="true" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="5" y="10" width="14" height="10" rx="2" />
          <path d="M8 10V7a4 4 0 0 1 8 0v3" />
        </svg>
        Account required
      </span>
    );
  }

  function renderPathItem(item) {
    const phraseIds = getCourseItemPhraseIds(item);
    const lessonCount = getCourseItemLessonIds(item).length;
    const itemConfidence = getRequiredTrackConfidence(item, phraseConfidenceById);
    const isMuted = [...phraseIds].length > 0 && getCourseItemLessonIds(item).every(lessonId => !canAccessLesson(lessonId));

    return (
      <li key={item.id}>
        <button
          type="button"
          className={`lp-lesson-selection-item lp-track-selection-item${isMuted ? ' locked' : ''}`}
          onClick={() => openTrack(item)}
          aria-label={`${item.title}. ${lessonCount} lessons, ${phraseIds.size} phrases, ${formatPercent(itemConfidence)} confidence${isMuted ? '. Account required' : ''}.`}
        >
          <span className="lp-lesson-selection-copy">
            <strong>{item.title}</strong>
            <span>
              {lessonCount} {lessonCount === 1 ? 'lesson' : 'lessons'} · {getPhraseCountLabel(phraseIds.size)}
            </span>
          </span>
          {isMuted
            ? renderLockStatus()
            : (
              <span className="lp-lesson-selection-progress" aria-label={`${formatPercent(itemConfidence)} track confidence`}>
                <span aria-hidden="true"><span style={{ width: `${Math.round(itemConfidence * 100)}%` }} /></span>
                <strong>{formatPercent(itemConfidence)}</strong>
              </span>
            )}
        </button>
      </li>
    );
  }

  function renderTrackDetail(track) {
    const lessonRows = getTrackLessonRows(track).map(row => {
      const phraseCount = getLessonPhraseIds(row.lesson).size;
      const confidence = getLessonConfidence(row.lesson, phraseConfidenceById);
      const recapIndex = getRecapExerciseIndex(row.lesson);
      return {
        ...row,
        selectionLabel: row.lesson.title,
        exerciseCount: recapIndex ?? (row.lesson.exercises?.length ?? 0),
        phraseCount,
        confidence,
        isLocked: !canAccessLesson(row.lesson.id)
      };
    });
    const phraseIds = getCourseItemPhraseIds(track);

    return (
      <section className="lp-track-detail" aria-labelledby="track-detail-title">
        <div className="lp-view-header">
          <div className="lp-view-kicker">Track</div>
          <h2 className="lp-view-title" id="track-detail-title">{track.title}</h2>
          <div className="lp-view-meta">
            {lessonRows.length} {lessonRows.length === 1 ? 'lesson' : 'lessons'} · {getPhraseCountLabel(phraseIds.size)}
          </div>
        </div>
        <ul className="lp-lesson-selection-list" aria-label={`${track.title} lessons`}>
          {lessonRows.map(row => (
            <li key={`${row.type}:${row.id}`}>
              <button
                type="button"
                className={[
                  'lp-lesson-selection-item',
                  selectedLessonId === row.lesson.id ? 'active' : '',
                  row.isLocked ? 'locked' : ''
                ].filter(Boolean).join(' ')}
                onClick={() => openLesson(row.lesson.id)}
                aria-label={`${row.lesson.title}. ${row.exerciseCount} exercises, ${row.phraseCount} phrases, ${formatPercent(row.confidence)} confidence${row.isLocked ? '. Account required' : ''}.`}
              >
                <span className="lp-lesson-selection-copy">
                  <strong>{row.lesson.title}</strong>
                  <span>
                    {row.exerciseCount} {row.exerciseCount === 1 ? 'exercise' : 'exercises'} · {getPhraseCountLabel(row.phraseCount)}
                  </span>
                </span>
                {row.isLocked
                  ? renderLockStatus()
                  : (
                    <span className="lp-lesson-selection-progress" aria-label={`${formatPercent(row.confidence)} confidence`}>
                      <span aria-hidden="true"><span style={{ width: `${Math.round(row.confidence * 100)}%` }} /></span>
                      <strong>{formatPercent(row.confidence)}</strong>
                    </span>
                  )}
              </button>
            </li>
          ))}
        </ul>
      </section>
    );
  }

  return (
    <main className={`lp-page course-view-page lp-course-map-page${selectedTrack ? ' track-detail-page' : ''}`} dir="ltr">
      {renderProgressPrompt()}

      <section className="lp-course-flow-section" aria-label="Course path">
        {selectedTrack
          ? renderTrackDetail(selectedTrack)
          : (
            <>
              <div className="lp-view-header">
                <p className="lp-view-kicker">Course Path</p>
                <h2 className="lp-view-title" id="course-path-title">Tracks</h2>
                <div className="lp-view-meta">
                  {primaryPathItems.length} tracks · {getPhraseCountLabel(coursePhraseCount)}
                </div>
              </div>
              <ul className="lp-lesson-selection-list lp-track-selection-list" aria-label="Course tracks">
                {primaryPathItems.map(item => renderPathItem(item))}
              </ul>
            </>
          )}
	      </section>

      {!selectedTrack && (
        <section className="lp-service-mastery" aria-labelledby="service-mastery-title">
          <div className="lp-view-header">
            <p className="lp-view-kicker">Mastery Map</p>
            <h2 className="lp-view-title" id="service-mastery-title">Services confidence</h2>
            <p className="lp-service-mastery-intro">
              Confidence estimates how ready you are to comprehend and follow along with each service.
            </p>
          </div>
          <ul className="lp-lesson-selection-list lp-service-confidence-list" aria-label="Services confidence">
            {topMasteryRows.map(row => (
              <li key={row.id}>
                <button
                  type="button"
                  className="lp-lesson-selection-item lp-service-confidence-item"
                  onClick={() => onSelectService?.(row.id)}
                  aria-label={`Open ${row.title} in Reader. ${formatPercent(row.confidence)} service confidence. ${getPhraseCountLabel(row.totalPhraseCount)}.`}
                >
                  <span className="lp-lesson-selection-copy">
                    <strong>{row.title}</strong>
                    <span>{getPhraseCountLabel(row.totalPhraseCount)}</span>
                  </span>
                  <span className="lp-lesson-selection-progress" aria-label={`${formatPercent(row.confidence)} service confidence`}>
                    <span aria-hidden="true"><span style={{ width: `${Math.round(row.confidence * 100)}%` }} /></span>
                    <strong>{formatPercent(row.confidence)}</strong>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {!selectedTrack && (
        <section className="lp-confidence-guide-section" aria-labelledby="confidence-guide-section-title">
          <div className="lp-view-header">
            <p className="lp-view-kicker">Progress Model</p>
            <h2 className="lp-view-title" id="confidence-guide-section-title">Confidence score</h2>
          </div>
          <ul className="lp-lesson-selection-list lp-confidence-guide-entry-list">
            <li>
              <button
                type="button"
                className="lp-lesson-selection-item lp-confidence-guide-entry"
                onClick={onConfidenceGuide}
              >
                <span className="lp-lesson-selection-copy">
                  <strong>How confidence works</strong>
                  <span>Comprehension, recitation, and memory over time</span>
                </span>
                <span className="lp-confidence-guide-entry-action" aria-hidden="true">›</span>
              </button>
            </li>
          </ul>
        </section>
      )}
    </main>
  );
}
