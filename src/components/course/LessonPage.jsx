import React, { useEffect, useState } from 'react';
import './course.css';
import ExerciseBlock from './ExerciseBlock.jsx';
import PageHeader from '../PageHeader.jsx';
import YouTubeClipPlayer from './YouTubeClipPlayer.jsx';
import exercises from '../../data/course/exercises.js';
import recordings from '../../data/media/recordings.js';
import { getExerciseTitle } from './exerciseTitles.js';

function getActivityLabel(activity) {
  if (!activity) return null;
  if (activity.type === 'listen-repeat') return 'Listen & Repeat';
  if (activity.type === 'synced-caption') return 'Phrase Captions';
  if (activity.type === 'arrange-cloze') return 'Arrange';
  if (activity.type === 'cloze') return 'Cloze';
  return activity.type;
}

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
  const selectedExerciseItem = exerciseItems[selectedExerciseIndex] ?? exerciseItems[0];
  const activityOptions = selectedExerciseItem?.activity_options || [];
  const [selectedActivityOptionId, setSelectedActivityOptionId] = useState(null);
  const [karaokeMode, setKaraokeMode] = useState(false);
  const [showSyncedCaptionTranslation, setShowSyncedCaptionTranslation] = useState(false);
  const [syncedTime, setSyncedTime] = useState(null);
  const selectedActivityOption = activityOptions.find(option => option.exercise_id === selectedActivityOptionId) || activityOptions[0] || null;

  useEffect(() => {
    setSelectedActivityOptionId(null);
    setSyncedTime(null);
  }, [lesson.id, selectedExerciseIndex]);

  const resolvedExercises = exerciseItems
    .map((item, index) => {
      const option = index === selectedExerciseIndex ? selectedActivityOption : null;
      const exerciseId = option?.exercise_id || item.exercise_id;
      return {
        exercise_id: exerciseId,
        exercise: exercises[exerciseId],
        audio_clip: item.audio_clip || exercises[exerciseId]?.audio_clip
      };
    });
  const selectedExercise = resolvedExercises[selectedExerciseIndex] ?? resolvedExercises[0];
  const missingExercises = selectedExercise && !selectedExercise.exercise ? [selectedExercise] : [];
  const unitTitle = lesson.unitTitle || lesson.unit_title;
  const exerciseTitle = getExerciseTitle(lesson, selectedExerciseIndex);
  const isSyncedCaptionActivity = selectedExercise?.exercise?.activity?.type === 'synced-caption';
  const canUseKaraokeMode = selectedExercise?.exercise?.activity?.type === 'listen-repeat'
    && (selectedExercise.exercise.activity?.captions?.length || 0) > 0;
  const selectedActivityLabel = selectedActivityOption?.label || getActivityLabel(selectedExercise?.exercise?.activity);
  const shouldTrackPlayerTime = isSyncedCaptionActivity || canUseKaraokeMode;

  function renderNavLabel(action, destination) {
    return (
      <>
        <span className="page-nav-label">{action}</span>
        {destination && <span className="page-nav-destination">{destination}</span>}
      </>
    );
  }

  function renderPlayer() {
    const clip = selectedExercise?.audio_clip;
    if (!clip) return null;
    const clipVideoId = clip.video_id || recordings[clip.recording_id]?.youtube?.video_id;
    return (
      <YouTubeClipPlayer
        videoId={clipVideoId}
        recordingId={clip.recording_id}
        startSeconds={clip.start_seconds}
        endSeconds={clip.end_seconds}
        defaultPlaybackRate={clip.default_playback_rate}
        onTimeUpdate={shouldTrackPlayerTime ? setSyncedTime : undefined}
      />
    );
  }

  return (
    <div className="lp-page bottom-nav-page" dir="ltr">
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

      <div className="lp-activity-toolbar">
        <div className="lp-activity-controls">
          {selectedActivityLabel && (
            <>
              <div className="lp-activity-control-label">Activity</div>
              <div className="lp-activity-card">
                <div className="lp-activity-field">
                  {activityOptions.length > 1 ? (
                    <div className="lp-activity-option-list" role="group" aria-label="Activity">
                      {activityOptions.map(option => (
                        <button
                          key={option.exercise_id}
                          type="button"
                          className={`lp-activity-option${option.exercise_id === selectedActivityOption?.exercise_id ? ' active' : ''}`}
                          aria-pressed={option.exercise_id === selectedActivityOption?.exercise_id}
                          onClick={() => {
                            setSelectedActivityOptionId(option.exercise_id);
                            setSyncedTime(null);
                          }}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <span className="lp-activity-static">{selectedActivityLabel}</span>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="lp-toolbar-player">
          {renderPlayer()}
        </div>
      </div>

      {(canUseKaraokeMode || isSyncedCaptionActivity) && (
        <div className="lp-mode-toggle-row lp-activity-mode-row" dir="ltr">
          {canUseKaraokeMode && (
            <label className="lp-mode-toggle">
              <input
                type="checkbox"
                checked={karaokeMode}
                onChange={event => setKaraokeMode(event.target.checked)}
              />
              <span className="lp-mode-switch" aria-hidden="true" />
              <span>Karaoke mode</span>
            </label>
          )}

          {isSyncedCaptionActivity && (
            <label className="lp-mode-toggle">
              <input
                type="checkbox"
                checked={showSyncedCaptionTranslation}
                onChange={event => setShowSyncedCaptionTranslation(event.target.checked)}
              />
              <span className="lp-mode-switch" aria-hidden="true" />
              <span>Show translation</span>
            </label>
          )}
        </div>
      )}

      {selectedExercise?.exercise && (
        <ExerciseBlock
          key={`${lesson.id}-${selectedExerciseIndex}`}
          exercise={selectedExercise.exercise}
          arabicMode={arabicMode}
          readerLayout={readerLayout}
          speechRate={speechRate}
          arabicFontFamily={arabicFontFamily}
          arabicFontWeight={arabicFontWeight}
          arabicFontSize={arabicFontSize}
          karaokeMode={karaokeMode}
          showSyncedCaptionTranslation={showSyncedCaptionTranslation}
          syncedTime={syncedTime}
        />
      )}

      <nav className="lp-course-nav page-nav bottom-page-nav" dir="ltr" aria-label="Course lesson navigation">
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
