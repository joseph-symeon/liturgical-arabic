import React, { useEffect, useMemo, useRef, useState } from "react";
import recordings from "../../data/media/recordings.js";
import phrases from "../../data/texts/phrases.js";
import segments from "../../data/texts/segments.js";
import { isPhraseCaptionsActivity, isReadListenActivity, PASSAGE_ACTIVITY_TYPES } from "../../utils/passageActivities.js";
import { getDisplayedCaption } from "../../utils/passageTiming.js";
import { recordRecitationRepetition } from "../../utils/progressScoring.js";
import YouTubeClipPlayer from "./YouTubeClipPlayer.jsx";
import PassageActivityBody from "./PassageActivityBody.jsx";
import PassageActivityToolbar from "./PassageActivityToolbar.jsx";
import PassageSyncedCaption from "./PassageSyncedCaption.jsx";

const CAPTION_TEXT_MODE_STORAGE_KEY = "liturgical-arabic:phrase-captions-text-mode";
const PRACTICE_TEXT_MODE_STORAGE_KEY = "liturgical-arabic:practice-text-mode";
const KARAOKE_MODE_STORAGE_KEY = "liturgical-arabic:karaoke-mode";
const REQUIRED_TEXT_MODES = ["translation", "literal"];
const RECITATION_REPETITION_THRESHOLD = 0.8;
const GROUPED_CAPTION_MIN_WORDS = 2;
const GROUPED_CAPTION_MAX_GAP_SECONDS = 0.55;

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

function getCaptionBoundaryKey(caption) {
  return [
    caption?.range_key,
    caption?.segment_id,
    caption?.source_segment_id
  ].filter(Boolean).join(":");
}

function getArabicWordCountForCaption(caption) {
  const arabic = phrases[caption?.phrase_id]?.arabic || "";
  return arabic.trim().split(/\s+/).filter(Boolean).length;
}

function startsWithAttachedWaw(caption) {
  const arabic = phrases[caption?.phrase_id]?.arabic || "";
  return /^و[^\s]/u.test(arabic.trim());
}

function hasStrongTextBoundaryBetween(first, second) {
  if (!first?.source_segment_id || first.source_segment_id !== second?.source_segment_id) return false;
  if (!Number.isInteger(first.phrase_index) || !Number.isInteger(second.phrase_index)) return false;
  if (second.phrase_index !== first.phrase_index + 1) return false;

  const parts = segments[first.source_segment_id]?.phrases || [];
  const phrasePartIndexes = parts
    .map((part, index) => part.phrase_id ? index : null)
    .filter(index => index !== null);
  const firstPartIndex = phrasePartIndexes[first.phrase_index];
  const secondPartIndex = phrasePartIndexes[second.phrase_index];
  if (!Number.isInteger(firstPartIndex) || !Number.isInteger(secondPartIndex)) return false;

  const textBetween = parts
    .slice(firstPartIndex + 1, secondPartIndex)
    .map(part => part.text || "")
    .join("");
  return /[،؛.!؟]/u.test(textBetween);
}

function canGroupCaptions(first, second) {
  if (!first || !second) return false;
  if (getCaptionBoundaryKey(first) !== getCaptionBoundaryKey(second)) return false;
  if (hasStrongTextBoundaryBetween(first, second)) return false;
  if (
    Number.isInteger(first.phrase_index)
      && Number.isInteger(second.phrase_index)
      && second.phrase_index <= first.phrase_index
  ) {
    return false;
  }
  return second.start_seconds - first.end_seconds <= GROUPED_CAPTION_MAX_GAP_SECONDS;
}

function isCompleteTwoPhraseSegmentGroup(groupCaptions, nextCaption, afterNextCaption) {
  const currentCaption = groupCaptions[groupCaptions.length - 1];
  if (groupCaptions.length !== 1) return false;
  if (currentCaption.phrase_index !== 0 || nextCaption?.phrase_index !== 1) return false;
  return !afterNextCaption
    || getCaptionBoundaryKey(nextCaption) !== getCaptionBoundaryKey(afterNextCaption)
    || (
      Number.isInteger(afterNextCaption.phrase_index)
        && afterNextCaption.phrase_index <= nextCaption.phrase_index
    );
}

function shouldGroupCaptionForward(groupCaptions, nextCaption, wordCount, afterNextCaption) {
  if (!canGroupCaptions(groupCaptions[groupCaptions.length - 1], nextCaption)) return false;

  if (isCompleteTwoPhraseSegmentGroup(groupCaptions, nextCaption, afterNextCaption)) return true;

  const nextWordCount = getArabicWordCountForCaption(nextCaption);
  if (startsWithAttachedWaw(nextCaption) && nextWordCount === 1) return true;

  const currentCaption = groupCaptions[groupCaptions.length - 1];
  if (wordCount < GROUPED_CAPTION_MIN_WORDS && startsWithAttachedWaw(currentCaption) && nextWordCount > 1) {
    return false;
  }

  return wordCount < GROUPED_CAPTION_MIN_WORDS;
}

function buildCaptionDisplayGroups(captions) {
  const groups = [];
  let index = 0;

  while (index < captions.length) {
    const groupCaptions = [captions[index]];
    let wordCount = getArabicWordCountForCaption(captions[index]);

    while (index + groupCaptions.length < captions.length) {
      const nextCaption = captions[index + groupCaptions.length];
      const afterNextCaption = captions[index + groupCaptions.length + 1];
      if (!shouldGroupCaptionForward(groupCaptions, nextCaption, wordCount, afterNextCaption)) break;
      groupCaptions.push(nextCaption);
      wordCount += getArabicWordCountForCaption(nextCaption);
    }

    groups.push({
      ...groupCaptions[0],
      display_key: groupCaptions
        .map(caption => `${caption.phrase_id}:${caption.start_seconds}:${caption.end_seconds}`)
        .join("|"),
      phrase_ids: groupCaptions.map(caption => caption.phrase_id),
      start_seconds: groupCaptions[0].start_seconds,
      end_seconds: groupCaptions[groupCaptions.length - 1].end_seconds
    });
    index += groupCaptions.length;
  }

  return groups;
}

function findDisplayCaptionForActiveCaption(displayCaptions, activeCaption) {
  if (!activeCaption) return null;
  return displayCaptions.find(displayCaption => (
    displayCaption.start_seconds <= activeCaption.start_seconds
      && displayCaption.end_seconds >= activeCaption.end_seconds
      && displayCaption.phrase_ids?.includes(activeCaption.phrase_id)
      && getCaptionBoundaryKey(displayCaption) === getCaptionBoundaryKey(activeCaption)
  )) || activeCaption;
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
  toolbarMiddle = null,
  learnSetupToolbarTop = null,
  dockLearnSetupControls = false,
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
  const [playbackControlsMode, setPlaybackControlsMode] = useState('main');
  const playerRef = useRef(null);
  const recitationCaptionKeysRef = useRef(new Set());
  const previousPlaybackTimeRef = useRef(null);
  const listenActivity = isReadListenActivity(resolvedActivityType);
  const captionActivity = isPhraseCaptionsActivity(resolvedActivityType);
  const translateActivity = resolvedActivityType === PASSAGE_ACTIVITY_TYPES.translationDirection;
  const matchingActivity = resolvedActivityType === PASSAGE_ACTIVITY_TYPES.matching;
  const hasPracticeTextMode = translateActivity || matchingActivity;
  const canUseKaraoke = listenActivity && resolvedCaptions.length > 0;
  const shouldTrackPlayerTime = (listenActivity || captionActivity) && resolvedCaptions.length > 0;
  const activeCaption = getDisplayedCaption(resolvedCaptions, currentTime, {
    leadSeconds: resolvedLeadSeconds,
    clipEndSeconds: resolvedClip?.end_seconds,
    primeInitialCaption: captionActivity || (canUseKaraoke && karaokeMode)
  });
  const activePhrase = activeCaption ? phrases[activeCaption.phrase_id] : null;
  const groupedDisplayCaptions = useMemo(
    () => buildCaptionDisplayGroups(resolvedCaptions),
    [resolvedCaptions]
  );
  const displayCaption = captionActivity
    ? findDisplayCaptionForActiveCaption(groupedDisplayCaptions, activeCaption)
    : activeCaption;
  const displayPhrases = displayCaption?.phrase_ids?.length
    ? displayCaption.phrase_ids.map(phraseId => phrases[phraseId]).filter(Boolean)
    : activePhrase
      ? [activePhrase]
      : [];
  const karaokeActiveCaption = canUseKaraoke
    && karaokeMode
    && (playbackActive || typeof currentTime === "number")
    ? activeCaption
    : null;

  useEffect(() => {
    setCurrentTime(null);
    setPlaybackActive(false);
    recitationCaptionKeysRef.current = new Set();
    previousPlaybackTimeRef.current = null;
  }, [resetKey, passage?.id, resolvedClip?.recording_id, resolvedClip?.video_id, resolvedClip?.start_seconds, resolvedClip?.end_seconds]);

  useEffect(() => {
    setPlaybackControlsMode('main');
  }, [resetKey, resolvedClip?.recording_id, resolvedClip?.video_id, resolvedClip?.start_seconds, resolvedClip?.end_seconds]);

  useEffect(() => {
    if (listenActivity || captionActivity) return;
    playerRef.current?.pause?.();
  }, [listenActivity, captionActivity, resolvedActivityType]);

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

  useEffect(() => {
    if (!shouldTrackPlayerTime || !playbackActive || !activeCaption?.phrase_id || typeof currentTime !== "number") return;

    if (previousPlaybackTimeRef.current !== null && currentTime < previousPlaybackTimeRef.current - 1) {
      recitationCaptionKeysRef.current = new Set();
    }
    previousPlaybackTimeRef.current = currentTime;

    const captionStart = activeCaption.start_seconds;
    const captionEnd = activeCaption.end_seconds;
    const captionDuration = Math.max(0.25, captionEnd - captionStart);
    const meaningfulTime = captionStart + (captionDuration * RECITATION_REPETITION_THRESHOLD);
    if (currentTime < meaningfulTime) return;

    const captionKey = [
      activeCaption.phrase_id,
      activeCaption.segment_id,
      activeCaption.range_key,
      activeCaption.start_seconds,
      activeCaption.end_seconds
    ].filter(value => value !== undefined && value !== null).join(":");
    if (recitationCaptionKeysRef.current.has(captionKey)) return;

    recitationCaptionKeysRef.current.add(captionKey);
    recordRecitationRepetition({
      phraseId: activeCaption.phrase_id,
      activityType: resolvedActivityType
    });
  }, [activeCaption, currentTime, playbackActive, resolvedActivityType, shouldTrackPlayerTime]);

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
        controlsMode={playbackControlsMode}
        onControlsModeChange={setPlaybackControlsMode}
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
      toolbarMiddle={toolbarMiddle}
      suppressModeControls={playbackControlsMode === 'details'}
      hidden={!showPracticeToolbar && !preserveToolbarInFocus}
    />
  );

  return (
    <div className={`lp-passage-experience${!showPracticeToolbar ? " focus-mode" : ""}`}>
      {captionActivity && (
        <PassageSyncedCaption
          activeCaption={displayCaption}
          activePhrase={activePhrase}
          activePhrases={displayPhrases}
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
                learnSetupToolbarTop={learnSetupToolbarTop}
                dockLearnSetupControls={dockLearnSetupControls}
                onCourseTrack={onCourseTrack}
                onCourseLesson={onCourseLesson}
              />
            )
          : null}

      {toolbar}
    </div>
  );
}
