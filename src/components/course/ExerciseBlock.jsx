import React from 'react';
import ArabicPhraseRenderer from './ArabicPhraseRenderer.jsx';
import YouTubeClipPlayer from './YouTubeClipPlayer.jsx';
import { getResolvedExerciseTitle } from './exerciseTitles.js';

export default function ExerciseBlock({ exercise, audioClip, arabicMode, readerLayout, speechRate, arabicFontFamily, arabicFontWeight }) {
  const exerciseTitle = getResolvedExerciseTitle(exercise);

  return (
    <div className="lp-exercise">
      {exerciseTitle && <h2 className="lp-exercise-title">{exerciseTitle}</h2>}
      <ArabicPhraseRenderer
        lines={exercise.lines}
        arabicMode={arabicMode}
        readerLayout={readerLayout}
        speechRate={speechRate}
        arabicFontFamily={arabicFontFamily}
        arabicFontWeight={arabicFontWeight}
      />
      {audioClip && (
        <YouTubeClipPlayer
          videoId={audioClip.video_id}
          startSeconds={audioClip.start_seconds}
          endSeconds={audioClip.end_seconds}
          defaultPlaybackRate={audioClip.default_playback_rate}
        />
      )}
    </div>
  );
}
