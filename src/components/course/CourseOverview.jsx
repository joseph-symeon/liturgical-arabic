import React, { useEffect, useState } from 'react';
import './course.css';
import courseTracks from '../../data/course/courseTracks.js';
import {
  getCourseItemLessonIds,
  getCourseItemPhraseIds,
  getLessonPhraseIds,
  getPhraseCountLabel,
  getServiceConfidenceRows
} from '../../utils/courseMastery.js';
import { getStoredPhraseConfidenceMap, PHRASE_PROGRESS_EVENT } from '../../utils/progressScoring.js';

const MARKER_FILL_CONFIDENCE = 0.8;

function formatPercent(value) {
  return `${Math.round(value * 100)}%`;
}

function getLessonById(lessons, lessonId) {
  return lessons.find(lesson => lesson.id === lessonId);
}

function getPrerequisiteLabel(item) {
  if (item.parent_track_id) return null;
  const prerequisiteTrackIds = item.prerequisite_track_ids || [];
  const prerequisiteLessonIds = item.prerequisite_lesson_ids || [];
  if (prerequisiteTrackIds.length === 0 && prerequisiteLessonIds.length === 0) return null;
  const prerequisiteTrackTitles = prerequisiteTrackIds
    .map(trackId => courseTracks.find(track => track.id === trackId)?.title)
    .filter(Boolean);
  const prerequisiteLessonTitles = prerequisiteLessonIds
    .map(lessonId => courseTracks.find(track => getCourseItemLessonIds(track).includes(lessonId))?.title)
    .filter(Boolean);
  return `Prerequisite: ${[...prerequisiteLessonTitles, ...prerequisiteTrackTitles].join(', ')}`;
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
  onSelectTrack,
  onSelectExercise
}) {
  const primaryPathItems = courseTracks.filter(item => item.type === 'track' && !item.parent_track_id);
  const [phraseConfidenceById, setPhraseConfidenceById] = useState(getStoredPhraseConfidenceMap);
  const masteryRows = getServiceConfidenceRows(phraseConfidenceById);
  const topMasteryRows = masteryRows.slice(0, 8);
  const selectedTrack = courseTracks.find(item => item.id === selectedTrackId);

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
    onSelectExercise(lesson.id, 0, 'home');
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
      .map((row, index) => ({ ...row, label: index + 1 }));
  }

  function openTrack(item) {
    onSelectTrack(item.parent_track_id || item.id);
  }

  function renderPathItem(item, index) {
    const phraseIds = getCourseItemPhraseIds(item);
    const lessonCount = getCourseItemLessonIds(item).length;
    const itemConfidence = getRequiredTrackConfidence(item, phraseConfidenceById);
    const isBonus = item.type === 'bonus';
    const prerequisiteLabel = getPrerequisiteLabel(item);
    const isConfident = itemConfidence >= MARKER_FILL_CONFIDENCE;

    return (
      <button
        type="button"
        className={[
          'lp-course-path-card',
          isBonus ? 'bonus' : '',
          isConfident ? 'confident' : ''
        ].filter(Boolean).join(' ')}
        key={item.id}
        onClick={() => openTrack(item)}
        style={{ '--track-progress': itemConfidence }}
      >
        <div className="lp-course-path-card-top">
          {isBonus
            ? <span className="lp-course-path-bonus">Bonus</span>
            : <span className="lp-course-path-number">{index + 1}</span>}
          {prerequisiteLabel && <span className="lp-course-path-state">{prerequisiteLabel}</span>}
        </div>
        <div className="lp-course-path-main">
          <h3>{item.title}</h3>
          <div className="lp-course-path-meta">
            <span>{lessonCount} {lessonCount === 1 ? 'lesson' : 'lessons'}</span>
            <span>{getPhraseCountLabel(phraseIds.size)}</span>
          </div>
        </div>
        <div className="lp-course-path-confidence" aria-label={`${formatPercent(itemConfidence)} required track confidence`}>
          <span>
            <span style={{ width: `${Math.round(itemConfidence * 100)}%` }} />
          </span>
          <strong>{formatPercent(itemConfidence)}</strong>
        </div>
        <span className="lp-course-path-action">Practice</span>
      </button>
    );
  }

  function renderTrackDetail(track) {
    const lessonRows = getTrackLessonRows(track);
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
        <div className="lp-track-detail-list">
          {lessonRows.map(row => {
            const exerciseCount = row.lesson.exercises?.length ?? 0;
            const rowPhraseCount = getLessonPhraseIds(row.lesson).size;
            const lessonConfidence = getLessonConfidence(row.lesson, phraseConfidenceById);
            const progressState = lessonConfidence >= 0.72
              ? 'mastered'
              : lessonConfidence > 0
                ? 'started'
                : 'upcoming';
            const isConfident = lessonConfidence >= MARKER_FILL_CONFIDENCE;
            return (
              <article
                className={[
                  'lp-track-lesson-row',
                  progressState,
                  isConfident ? 'confident' : ''
                ].filter(Boolean).join(' ')}
                key={`${row.type}:${row.id}`}
                role="button"
                tabIndex={0}
                onClick={() => openLesson(row.lesson.id)}
                onKeyDown={event => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    openLesson(row.lesson.id);
                  }
                }}
                style={{ '--lesson-progress': lessonConfidence }}
              >
                <span className="lp-track-lesson-marker">{row.label}</span>
                {row.type === 'bonus' && <span className="lp-track-lesson-badge">Bonus</span>}
                <div className="lp-track-lesson-main">
                  <h3>{row.lesson.title}</h3>
                  <div className="lp-track-lesson-meta">
                    <span>{exerciseCount} {exerciseCount === 1 ? 'exercise' : 'exercises'}</span>
                    <span>{getPhraseCountLabel(rowPhraseCount)}</span>
                  </div>
                  <div className="lp-track-lesson-confidence" aria-label={`${formatPercent(lessonConfidence)} confidence`}>
                    <span>
                      <span style={{ width: `${Math.round(lessonConfidence * 100)}%` }} />
                    </span>
                    <strong>{formatPercent(lessonConfidence)}</strong>
                  </div>
                </div>
                <span className="lp-track-lesson-action">Practice</span>
              </article>
            );
          })}
        </div>
      </section>
    );
  }

  return (
    <main className={`lp-page course-view-page lp-course-map-page${selectedTrack ? ' track-detail-page' : ''}`} dir="ltr">
      <section className="lp-course-flow-section" aria-label="Course path">
        {selectedTrack
          ? renderTrackDetail(selectedTrack)
          : (
            <>
              <div className="lp-view-header">
                <p className="lp-view-kicker">Course Path</p>
                <h2 className="lp-view-title" id="course-path-title">Tracks</h2>
              </div>
              <div className="lp-course-flow">
                <div className="lp-course-flow-track">
                  {primaryPathItems.map((item, index) => renderPathItem(item, index))}
                </div>
              </div>
            </>
          )}
      </section>

      {!selectedTrack && (
        <section className="lp-service-mastery" aria-labelledby="service-mastery-title">
          <div className="lp-view-header">
            <p className="lp-view-kicker">Mastery Map</p>
            <h2 className="lp-view-title" id="service-mastery-title">Services confidence</h2>
          </div>
          <div className="lp-service-mastery-map">
            <div className="lp-service-mastery-core">
              <span>{formatPercent(topMasteryRows.reduce((total, row) => total + row.confidence, 0) / Math.max(1, topMasteryRows.length))}</span>
              <span>Liturgical Arabic</span>
            </div>
            <div className="lp-service-mastery-nodes">
              {topMasteryRows.map(row => (
                <article className="lp-service-mastery-node" key={row.id} style={{ '--mastery': row.confidence }}>
                  <div className="lp-service-mastery-ring" aria-hidden="true">
                    <span>{formatPercent(row.confidence)}</span>
                  </div>
                  <div>
                    <h3>{row.title}</h3>
                    <p>{row.knownPhraseCount.toLocaleString()} of {row.totalPhraseCount.toLocaleString()} phrases touched</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
