import React from 'react';
import './lesson.css';
import LessonSegmentBlock from './LessonSegmentBlock.jsx';

export default function LessonPage({ lesson, segmentsMap, arabicMode, readerLayout, speechRate, arabicFontFamily, arabicFontWeight }) {
  return (
    <div className="lp-page" dir="ltr">
      <h1>{lesson.title}</h1>
      {lesson.subtitle && <p className="lp-subtitle">{lesson.subtitle}</p>}

      {lesson.segments.map(({ segment_id, audio_clip }) => {
        const segment = segmentsMap[segment_id];
        if (!segment) return null;
        return (
          <LessonSegmentBlock
            key={segment_id}
            segment={segment}
            audioClip={audio_clip}
            arabicMode={arabicMode}
            readerLayout={readerLayout}
            speechRate={speechRate}
            arabicFontFamily={arabicFontFamily}
            arabicFontWeight={arabicFontWeight}
          />
        );
      })}
    </div>
  );
}
