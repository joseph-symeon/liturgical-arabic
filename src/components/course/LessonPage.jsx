import React, { useEffect, useState } from 'react';
import './course.css';
import ExerciseBlock from './ExerciseBlock.jsx';
import PageHeader from '../PageHeader.jsx';
import YouTubeClipPlayer from './YouTubeClipPlayer.jsx';
import exercises, { getExerciseWithActivity, getStandardActivityOptions } from '../../data/course/exercises.js';
import recordings from '../../data/media/recordings.js';
import { getExerciseTitle } from './exerciseTitles.js';

const SYNCED_CAPTION_TEXT_MODE_STORAGE_KEY = 'liturgical-arabic:synced-caption-text-mode';
const SYNCED_CAPTION_TEXT_MODES = ['none', 'translation', 'literal'];
const ACTIVITY_SELECTION_STORAGE_KEY = 'liturgical-arabic:activity-selection';

function getActivityLabel(activity) {
  if (!activity) return null;
  if (activity.type === 'listen-repeat') return 'Listen & Repeat';
  if (activity.type === 'synced-caption') return 'Phrase Captions';
  if (activity.type === 'arrange-cloze') return 'Arrange';
  if (activity.type === 'cloze') return 'Cloze';
  return activity.type;
}

function getActivityOptions(item) {
  if (item?.activity_options) return item.activity_options;
  if (item?.activity_policy === 'standard') return getStandardActivityOptions(item.exercise_id);
  return [];
}

function getActivityOptionValue(option) {
  return option?.exercise_id || option?.activity_type || null;
}

function getStoredSyncedCaptionTextMode() {
  if (typeof window === 'undefined') return 'none';
  const stored = window.localStorage.getItem(SYNCED_CAPTION_TEXT_MODE_STORAGE_KEY);
  return SYNCED_CAPTION_TEXT_MODES.includes(stored) ? stored : 'none';
}

function getStoredActivitySelections() {
  if (typeof window === 'undefined') return {};

  try {
    const stored = window.localStorage.getItem(ACTIVITY_SELECTION_STORAGE_KEY);
    const parsed = stored ? JSON.parse(stored) : {};
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

function getActivitySelectionKey(lessonId, exerciseItem, exerciseIndex) {
  return `${lessonId}:${exerciseItem?.exercise_id || exerciseIndex}`;
}

function getStoredActivityOptionId(lessonId, exerciseItem, exerciseIndex, activityOptions) {
  const selectionKey = getActivitySelectionKey(lessonId, exerciseItem, exerciseIndex);
  const storedValue = getStoredActivitySelections()[selectionKey];
  return activityOptions.some(option => getActivityOptionValue(option) === storedValue) ? storedValue : null;
}

function storeActivityOptionId(lessonId, exerciseItem, exerciseIndex, activityOptionId) {
  if (typeof window === 'undefined' || !activityOptionId) return;

  const selectionKey = getActivitySelectionKey(lessonId, exerciseItem, exerciseIndex);
  window.localStorage.setItem(ACTIVITY_SELECTION_STORAGE_KEY, JSON.stringify({
    ...getStoredActivitySelections(),
    [selectionKey]: activityOptionId
  }));
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
  const activityOptions = getActivityOptions(selectedExerciseItem);
  const [selectedActivityOptionId, setSelectedActivityOptionId] = useState(() => (
    getStoredActivityOptionId(lesson.id, selectedExerciseItem, selectedExerciseIndex, activityOptions)
  ));
  const [karaokeMode, setKaraokeMode] = useState(false);
  const [syncedCaptionTextMode, setSyncedCaptionTextMode] = useState(getStoredSyncedCaptionTextMode);
  const [syncedTime, setSyncedTime] = useState(null);
  const selectedActivityOption = activityOptions.find(option => (
    getActivityOptionValue(option) === selectedActivityOptionId
  )) || activityOptions[0] || null;

  useEffect(() => {
    setSelectedActivityOptionId(getStoredActivityOptionId(lesson.id, selectedExerciseItem, selectedExerciseIndex, activityOptions));
    setSyncedTime(null);
  }, [lesson.id, selectedExerciseIndex]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(SYNCED_CAPTION_TEXT_MODE_STORAGE_KEY, syncedCaptionTextMode);
  }, [syncedCaptionTextMode]);

  const resolvedExercises = exerciseItems
    .map((item, index) => {
      const option = index === selectedExerciseIndex ? selectedActivityOption : null;
      const exerciseId = option?.exercise_id || item.exercise_id;
      const activityType = option?.activity_type || item.activity_type || null;
      return {
        exercise_id: exerciseId,
        exercise: activityType ? getExerciseWithActivity(exerciseId, activityType) : exercises[exerciseId],
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
    const clipKey = [
      clip.recording_id || clipVideoId,
      clip.start_seconds,
      clip.end_seconds
    ].join(':');
    return (
      <YouTubeClipPlayer
        key={clipKey}
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
              <label className="lp-activity-control-label" htmlFor="lp-activity-select">Activity</label>
              <div className="lp-activity-card">
                <div className="lp-activity-field">
                  {activityOptions.length > 1 ? (
                    <select
                      id="lp-activity-select"
                      className="lp-activity-select"
                      value={getActivityOptionValue(selectedActivityOption) || selectedExerciseItem.exercise_id}
                      onChange={event => {
                        setSelectedActivityOptionId(event.target.value);
                        storeActivityOptionId(lesson.id, selectedExerciseItem, selectedExerciseIndex, event.target.value);
                        setSyncedTime(null);
                      }}
                    >
                      {activityOptions.map(option => (
                        <option key={getActivityOptionValue(option)} value={getActivityOptionValue(option)}>
                          {option.label}
                        </option>
                      ))}
                    </select>
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
            <div className="lp-segmented-control" role="group" aria-label="Phrase caption text">
              {[
                ['none', 'Arabic'],
                ['translation', 'Translation'],
                ['literal', 'Literal']
              ].map(([mode, label]) => (
                <button
                  key={mode}
                  type="button"
                  className={syncedCaptionTextMode === mode ? 'active' : ''}
                  onClick={() => setSyncedCaptionTextMode(mode)}
                >
                  {label}
                </button>
              ))}
            </div>
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
          syncedCaptionTextMode={syncedCaptionTextMode}
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
