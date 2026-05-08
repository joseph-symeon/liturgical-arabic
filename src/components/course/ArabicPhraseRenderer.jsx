import React from 'react';
import LiturgyLine from '../LiturgyLine.jsx';
import SpeakerLine from '../SpeakerLine.jsx';

export default function ArabicPhraseRenderer({ lines, arabicMode = 'vocalized', readerLayout = 'paragraph', speechRate = 0.8, arabicFontFamily, arabicFontWeight, arabicFontSize, showSpeakers = false, activePhraseId = null }) {
  if (!lines || lines.length === 0) return null;

  const sortedLines = [...lines]
    .sort((a, b) => a.line_order - b.line_order);

  function getLineParts(line) {
    const parts = [...line.phrases].sort((a, b) => a.display_order - b.display_order);
    const hasExplicitText = parts.some(part => part.text);

    if (hasExplicitText) {
      return parts.map(part => (part.text
        ? { text: part.text, isRubric: line.tags?.includes('rubric') || part.tags?.includes('rubric') }
        : { id: part.phrase_id, className: part.phrase_id === activePhraseId ? 'lp-karaoke-active' : undefined }));
    }

    return parts.flatMap(({ phrase_id }, index) => (
      index === 0
        ? [{ id: phrase_id, className: phrase_id === activePhraseId ? 'lp-karaoke-active' : undefined }]
        : [{ text: ' ' }, { id: phrase_id, className: phrase_id === activePhraseId ? 'lp-karaoke-active' : undefined }]
    ));
  }

  if (showSpeakers) {
    let lastSpeaker = null;
    return (
      <div className="my-2 text-right" dir="rtl">
        {sortedLines.map(line => {
          const showSpeaker = Boolean(line.speaker) && line.speaker !== lastSpeaker;
          lastSpeaker = line.speaker;
          return (
            <SpeakerLine
              key={line.line_order}
              speaker={line.speaker}
              line={getLineParts(line)}
              arabicMode={arabicMode}
              speechRate={speechRate}
              arabicFontFamily={arabicFontFamily}
              arabicFontWeight={arabicFontWeight}
              arabicFontSize={arabicFontSize}
              activePhraseId={activePhraseId}
              showSpeaker={showSpeaker}
            />
          );
        })}
      </div>
    );
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
              arabicFontSize={arabicFontSize}
              activePhraseId={activePhraseId}
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
              arabicFontSize={arabicFontSize}
              activePhraseId={activePhraseId}
            />
          </div>
        );
      })}
    </div>
  );
}
