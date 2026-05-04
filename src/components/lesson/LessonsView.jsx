import React from 'react';
import LessonPage from './LessonPage.jsx';
import segments from '../../data/segments.js';

export default function LessonsView({ lesson, arabicMode, readerLayout, speechRate, arabicFontFamily, arabicFontWeight }) {
  return (
    <LessonPage
      lesson={lesson}
      segmentsMap={segments}
      arabicMode={arabicMode}
      readerLayout={readerLayout}
      speechRate={speechRate}
      arabicFontFamily={arabicFontFamily}
      arabicFontWeight={arabicFontWeight}
    />
  );
}
