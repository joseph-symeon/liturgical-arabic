import React from 'react';
import ArabicPhraseRenderer from './ArabicPhraseRenderer.jsx';
import YouTubeClipPlayer from './YouTubeClipPlayer.jsx';

export default function ExerciseBlock({ exercise, audioClip, arabicMode, readerLayout, speechRate, arabicFontFamily, arabicFontWeight, arabicFontSize }) {
  return (
    <div className="lp-exercise">
      <ArabicPhraseRenderer
        lines={exercise.lines}
        arabicMode={arabicMode}
        readerLayout={readerLayout}
        speechRate={speechRate}
        arabicFontFamily={arabicFontFamily}
        arabicFontWeight={arabicFontWeight}
        arabicFontSize={arabicFontSize}
        showSpeakers={exercise.show_speakers}
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
