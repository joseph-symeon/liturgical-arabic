import React, { useEffect, useState } from "react";
import recordings from "../../data/media/recordings.js";
import phrases from "../../data/texts/phrases.js";
import { isPhraseCaptionsActivity, isReadListenActivity } from "../../utils/passageActivities.js";
import { getDisplayedCaption } from "../../utils/passageTiming.js";
import YouTubeClipPlayer from "./YouTubeClipPlayer.jsx";
import PassageActivityBody from "./PassageActivityBody.jsx";
import PassageActivityToolbar from "./PassageActivityToolbar.jsx";
import PassageSyncedCaption from "./PassageSyncedCaption.jsx";

const CAPTION_TEXT_MODE_STORAGE_KEY = "liturgical-arabic:phrase-captions-text-mode";
const KARAOKE_MODE_STORAGE_KEY = "liturgical-arabic:karaoke-mode";
const CAPTION_TEXT_MODES = ["none", "translation", "literal"];

function getStoredKaraokeMode() {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(KARAOKE_MODE_STORAGE_KEY) === "true";
}

function getStoredCaptionTextMode() {
  if (typeof window === "undefined") return "none";
  const stored = window.localStorage.getItem(CAPTION_TEXT_MODE_STORAGE_KEY);
  return CAPTION_TEXT_MODES.includes(stored) ? stored : "none";
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
  renderPassage
}) {
  const resolvedActivityType = activityType || passage?.activity_type || null;
  const resolvedClip = passage?.clip || null;
  const resolvedCaptions = passage?.captions || [];
  const resolvedLeadSeconds = passage?.lead_seconds ?? 0;
  const resolvedExercise = passage?.exercise || null;
  const [karaokeMode, setKaraokeMode] = useState(getStoredKaraokeMode);
  const [captionTextMode, setCaptionTextMode] = useState(getStoredCaptionTextMode);
  const [currentTime, setCurrentTime] = useState(null);
  const listenActivity = isReadListenActivity(resolvedActivityType);
  const captionActivity = isPhraseCaptionsActivity(resolvedActivityType);
  const canUseKaraoke = listenActivity && resolvedCaptions.length > 0;
  const shouldTrackPlayerTime = canUseKaraoke || captionActivity;
  const activeCaption = getDisplayedCaption(resolvedCaptions, currentTime, {
    leadSeconds: resolvedLeadSeconds,
    clipEndSeconds: resolvedClip?.end_seconds,
    primeInitialCaption: captionActivity
  });
  const activePhrase = activeCaption ? phrases[activeCaption.phrase_id] : null;
  const karaokeActiveCaption = canUseKaraoke && karaokeMode ? activeCaption : null;

  useEffect(() => {
    setCurrentTime(null);
  }, [resetKey, passage?.id, resolvedClip?.recording_id, resolvedClip?.video_id, resolvedClip?.start_seconds, resolvedClip?.end_seconds]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(CAPTION_TEXT_MODE_STORAGE_KEY, captionTextMode);
  }, [captionTextMode]);

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
        key={clipKey}
        videoId={videoId}
        recordingId={resolvedClip.recording_id}
        startSeconds={resolvedClip.start_seconds}
        endSeconds={resolvedClip.end_seconds}
        defaultPlaybackRate={resolvedClip.default_playback_rate}
        onTimeUpdate={shouldTrackPlayerTime ? setCurrentTime : undefined}
      />
    );
  }

  return (
    <>
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
        showTextModeControls={captionActivity}
        textMode={captionTextMode}
        onTextModeChange={setCaptionTextMode}
      />

      {captionActivity && (
        <PassageSyncedCaption
          activeCaption={activeCaption}
          activePhrase={activePhrase}
          textMode={captionTextMode}
          arabicMode={arabicMode}
          arabicFontFamily={arabicFontFamily}
          arabicFontWeight={arabicFontWeight}
        />
      )}

      {renderPassage
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
                exercise={resolvedExercise}
                arabicMode={arabicMode}
                readerLayout={readerLayout}
                speechRate={speechRate}
                arabicFontFamily={arabicFontFamily}
                arabicFontWeight={arabicFontWeight}
                arabicFontSize={arabicFontSize}
                karaokeActiveCaption={karaokeActiveCaption}
              />
            )
          : null}
    </>
  );
}
