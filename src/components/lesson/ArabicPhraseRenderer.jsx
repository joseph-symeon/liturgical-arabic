import React from 'react';
import LiturgyLine from '../LiturgyLine.jsx';

export default function ArabicPhraseRenderer({ lines, arabicMode = 'voweled', readerLayout = 'paragraph', speechRate = 0.8, arabicFontFamily, arabicFontWeight }) {
  const sortedLines = [...lines].sort((a, b) => a.line_order - b.line_order);

  function getLineParts(line) {
    return [...line.phrases]
      .sort((a, b) => a.display_order - b.display_order)
      .flatMap(({ phrase_id }, index) => (
        index === 0 ? [{ id: phrase_id }] : [{ text: ' ' }, { id: phrase_id }]
      ));
  }

  if (readerLayout === 'paragraph' || readerLayout === 'grouped') {
    const paragraph = sortedLines.flatMap((line, index) => (
      index === 0 ? getLineParts(line) : [{ text: ' ' }, ...getLineParts(line)]
    ));
    return (
      <div className="my-2 text-right" dir="rtl">
        <LiturgyLine
          line={paragraph}
          arabicMode={arabicMode}
          speechRate={speechRate}
          arabicFontFamily={arabicFontFamily}
          arabicFontWeight={arabicFontWeight}
        />
      </div>
    );
  }

  return (
    <div className="my-2 text-right" dir="rtl">
      {sortedLines.map(line => {
        return (
          <div key={line.line_order}>
            <LiturgyLine
              line={getLineParts(line)}
              arabicMode={arabicMode}
              speechRate={speechRate}
              arabicFontFamily={arabicFontFamily}
              arabicFontWeight={arabicFontWeight}
            />
          </div>
        );
      })}
    </div>
  );
}
