import React from 'react';
import ArabicPhraseRenderer from './ArabicPhraseRenderer.jsx';
import YouTubeClipPlayer from './YouTubeClipPlayer.jsx';

export default function LessonSegmentBlock({ segment, audioClip, arabicMode, readerLayout, speechRate, arabicFontFamily, arabicFontWeight }) {
  return (
    <div className="lp-segment">
      {segment.title && <h2 className="lp-segment-title">{segment.title}</h2>}
      <ArabicPhraseRenderer
        lines={segment.lines}
        arabicMode={arabicMode}
        readerLayout={readerLayout}
        speechRate={speechRate}
        arabicFontFamily={arabicFontFamily}
        arabicFontWeight={arabicFontWeight}
      />
      <YouTubeClipPlayer
        videoId={audioClip.video_id}
        startSeconds={audioClip.start_seconds}
        endSeconds={audioClip.end_seconds}
        defaultPlaybackRate={audioClip.default_playback_rate}
      />
    </div>
  );
}
