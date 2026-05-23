import React, { useEffect, useRef, useState } from "react";
import recordings from "../../data/media/recordings.js";
import phrases from "../../data/texts/phrases.js";
import { isPhraseCaptionsActivity, isReadListenActivity, PASSAGE_ACTIVITY_TYPES } from "../../utils/passageActivities.js";
import { getDisplayedCaption } from "../../utils/passageTiming.js";
import YouTubeClipPlayer from "./YouTubeClipPlayer.jsx";
import PassageActivityBody from "./PassageActivityBody.jsx";
import PassageActivityToolbar from "./PassageActivityToolbar.jsx";
import PassageSyncedCaption from "./PassageSyncedCaption.jsx";

const CAPTION_TEXT_MODE_STORAGE_KEY = "liturgical-arabic:phrase-captions-text-mode";
const PRACTICE_TEXT_MODE_STORAGE_KEY = "liturgical-arabic:practice-text-mode";
const KARAOKE_MODE_STORAGE_KEY = "liturgical-arabic:karaoke-mode";
const REQUIRED_TEXT_MODES = ["translation", "literal"];

function getStoredKaraokeMode() {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(KARAOKE_MODE_STORAGE_KEY) === "true";
}

function getStoredCaptionTextMode() {
  if (typeof window === "undefined") return "literal";
  const stored = window.localStorage.getItem(CAPTION_TEXT_MODE_STORAGE_KEY);
  return REQUIRED_TEXT_MODES.includes(stored) ? stored : "literal";
}

function getStoredPracticeTextMode() {
  if (typeof window === "undefined") return "literal";
  const stored = window.localStorage.getItem(PRACTICE_TEXT_MODE_STORAGE_KEY);
  return REQUIRED_TEXT_MODES.includes(stored) ? stored : "literal";
}

export default function PassageExperience({
  passage = null,
  activityLabel,
  activitySelectId,
  activityOptions,
  selectedActivityValue,
  onSelectActivity,
  activityType,
  resetKey,
  arabicMode,
  readerLayout,
  speechRate,
  arabicFontFamily,
  arabicFontWeight,
  arabicFontSize,
  showPracticeToolbar = true,
  preserveToolbarInFocus = false,
  activityContextHeader = null,
  toolbarTop = null,
  onCourseTrack,
  onCourseLesson,
  renderPassage
}) {
  const resolvedActivityType = activityType || passage?.activity_type || null;
  const resolvedClip = passage?.clip || null;
  const resolvedCaptions = passage?.captions || [];
  const resolvedLeadSeconds = passage?.lead_seconds ?? 0;
  const resolvedExercise = passage?.exercise || null;
  const [karaokeMode, setKaraokeMode] = useState(getStoredKaraokeMode);
  const [captionTextMode, setCaptionTextMode] = useState(getStoredCaptionTextMode);
  const [practiceTextMode, setPracticeTextMode] = useState(getStoredPracticeTextMode);
  const [currentTime, setCurrentTime] = useState(null);
  const [playbackActive, setPlaybackActive] = useState(false);
  const playerRef = useRef(null);
  const listenActivity = isReadListenActivity(resolvedActivityType);
  const captionActivity = isPhraseCaptionsActivity(resolvedActivityType);
  const translateActivity = resolvedActivityType === PASSAGE_ACTIVITY_TYPES.translationDirection;
  const matchingActivity = resolvedActivityType === PASSAGE_ACTIVITY_TYPES.matching;
  const hasPracticeTextMode = translateActivity || matchingActivity;
  const canUseKaraoke = listenActivity && resolvedCaptions.length > 0;
  const shouldTrackPlayerTime = canUseKaraoke || captionActivity;
  const activeCaption = getDisplayedCaption(resolvedCaptions, currentTime, {
    leadSeconds: resolvedLeadSeconds,
    clipEndSeconds: resolvedClip?.end_seconds,
    primeInitialCaption: captionActivity || (canUseKaraoke && karaokeMode)
  });
  const activePhrase = activeCaption ? phrases[activeCaption.phrase_id] : null;
  const karaokeActiveCaption = canUseKaraoke
    && karaokeMode
    && (playbackActive || typeof currentTime === "number")
    ? activeCaption
    : null;

  useEffect(() => {
    setCurrentTime(null);
    setPlaybackActive(false);
  }, [resetKey, passage?.id, resolvedClip?.recording_id, resolvedClip?.video_id, resolvedClip?.start_seconds, resolvedClip?.end_seconds]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(CAPTION_TEXT_MODE_STORAGE_KEY, captionTextMode);
  }, [captionTextMode]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(PRACTICE_TEXT_MODE_STORAGE_KEY, practiceTextMode);
  }, [practiceTextMode]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(KARAOKE_MODE_STORAGE_KEY, String(karaokeMode));
  }, [karaokeMode]);

  function renderPlayer() {
    if (!resolvedClip) return null;
    const videoId = resolvedClip.video_id || recordings[resolvedClip.recording_id]?.youtube?.video_id;
    const clipKey = [
      resolvedClip.recording_id || videoId,
      resolvedClip.start_seconds,
      resolvedClip.end_seconds
    ].join(":");

    return (
      <YouTubeClipPlayer
        ref={playerRef}
        key={clipKey}
        videoId={videoId}
        recordingId={resolvedClip.recording_id}
        startSeconds={resolvedClip.start_seconds}
        endSeconds={resolvedClip.end_seconds}
        defaultPlaybackRate={resolvedClip.default_playback_rate}
        onTimeUpdate={shouldTrackPlayerTime ? setCurrentTime : undefined}
        onPlaybackActiveChange={shouldTrackPlayerTime ? setPlaybackActive : undefined}
      />
    );
  }

  const toolbar = (
    <PassageActivityToolbar
      activityLabel={activityLabel}
      activitySelectId={activitySelectId}
      activityOptions={activityOptions}
      selectedActivityValue={selectedActivityValue}
      onSelectActivity={onSelectActivity}
      player={renderPlayer()}
      showKaraokeToggle={canUseKaraoke}
      karaokeMode={karaokeMode}
      onKaraokeModeChange={setKaraokeMode}
      showTextModeControls={captionActivity || hasPracticeTextMode}
      textMode={hasPracticeTextMode ? practiceTextMode : captionTextMode}
      onTextModeChange={hasPracticeTextMode ? setPracticeTextMode : setCaptionTextMode}
      textModeRequired={hasPracticeTextMode}
      textModeLabel={hasPracticeTextMode ? "English text mode" : "Phrase caption text"}
      textModeOptions={hasPracticeTextMode
        ? [
            ["translation", "Translation"],
            ["literal", "Literal"]
          ]
        : [
            ["translation", "Translation"],
            ["literal", "Literal"]
          ]}
      toolbarTop={toolbarTop}
      hidden={!showPracticeToolbar && !preserveToolbarInFocus}
    />
  );

  return (
    <div className={`lp-passage-experience${!showPracticeToolbar ? " focus-mode" : ""}`}>
      {captionActivity && (
        <PassageSyncedCaption
          activeCaption={activeCaption}
          activePhrase={activePhrase}
          textMode={captionTextMode}
          arabicMode={arabicMode}
          arabicFontFamily={arabicFontFamily}
          arabicFontWeight={arabicFontWeight}
          onTogglePlayback={resolvedClip ? () => playerRef.current?.togglePlayPause() : undefined}
        />
      )}

      {!captionActivity && renderPassage
        ? renderPassage({
            activeCaption,
            activePhrase,
            karaokeActiveCaption,
            karaokeMode,
            captionTextMode,
            currentTime
          })
        : resolvedExercise
          ? (
              <PassageActivityBody
                key={`${resolvedExercise.id}:${resolvedActivityType || "activity"}`}
                exercise={resolvedExercise}
                arabicMode={arabicMode}
                readerLayout={readerLayout}
                speechRate={speechRate}
                arabicFontFamily={arabicFontFamily}
                arabicFontWeight={arabicFontWeight}
                arabicFontSize={arabicFontSize}
                karaokeActiveCaption={karaokeActiveCaption}
                practiceTextMode={practiceTextMode}
                activityContextHeader={activityContextHeader}
                onCourseTrack={onCourseTrack}
                onCourseLesson={onCourseLesson}
              />
            )
          : null}

      {toolbar}
    </div>
  );
}
