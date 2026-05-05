import React from 'react';
import LiturgyLine from '../LiturgyLine.jsx';

export default function ArabicPhraseRenderer({ lines, arabicMode = 'vocalized', readerLayout = 'paragraph', speechRate = 0.8, arabicFontFamily, arabicFontWeight }) {
  if (!lines || lines.length === 0) return null;

  const sortedLines = [...lines]
    .sort((a, b) => a.line_order - b.line_order);

  function getLineParts(line) {
    const parts = [...line.phrases].sort((a, b) => a.display_order - b.display_order);
    const hasExplicitText = parts.some(part => part.text);

    if (hasExplicitText) {
      return parts.map(part => (part.text ? { text: part.text } : { id: part.phrase_id }));
    }

    return parts.flatMap(({ phrase_id }, index) => (
      index === 0 ? [{ id: phrase_id }] : [{ text: ' ' }, { id: phrase_id }]
    ));
  }

  if (readerLayout === 'paragraph' || readerLayout === 'grouped') {
    const paragraphs = [];
    sortedLines.forEach((line, index) => {
      const last = paragraphs[paragraphs.length - 1];
      const shouldBreak = index === 0 || line.break_before;
      if (!last || shouldBreak) {
        paragraphs.push({ key: line.line_order, parts: getLineParts(line) });
        return;
      }
      last.parts = last.parts.concat([{ text: ' ' }], getLineParts(line));
    });

    return (
      <div className="my-2 text-right" dir="rtl">
        {paragraphs.map(paragraph => (
          <div key={paragraph.key}>
            <LiturgyLine
              line={paragraph.parts}
              arabicMode={arabicMode}
              speechRate={speechRate}
              arabicFontFamily={arabicFontFamily}
              arabicFontWeight={arabicFontWeight}
            />
          </div>
        ))}
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
