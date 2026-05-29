import React from 'react';
import LiturgyLine from '../LiturgyLine.jsx';
import SpeakerLine from '../SpeakerLine.jsx';

export default function PassageTextRenderer({ lines, arabicMode = 'vocalized', readerLayout = 'paragraph', speechRate = 0.8, arabicFontFamily, arabicFontWeight, arabicFontSize, showSpeakers = false, activeCaption = null }) {
  if (!lines || lines.length === 0) return null;

  const sortedLines = [...lines]
    .sort((a, b) => a.line_order - b.line_order);
  const visibleSpeakers = new Set(sortedLines.map(line => line.speaker).filter(Boolean));

  function isActivePart(line, phraseId, phraseIndex) {
    const captionMatchesLine = !activeCaption?.segment_id
      || activeCaption.segment_id === line.segment_id
      || (
        activeCaption.source_segment_id
          && line.source_segment_id
          && activeCaption.source_segment_id === line.source_segment_id
      );
    const captionMatchesPhraseIndex = activeCaption?.phrase_index == null
      || phraseIndex == null
      || activeCaption.phrase_index === phraseIndex;
    return activeCaption?.phrase_id === phraseId
      && captionMatchesLine
      && captionMatchesPhraseIndex;
  }

  function getPhraseClassName(line, phraseId, phraseIndex) {
    return isActivePart(line, phraseId, phraseIndex) ? 'lp-karaoke-active' : undefined;
  }

  function getLineParts(line) {
    const parts = [...line.phrases].sort((a, b) => a.display_order - b.display_order);
    const hasExplicitText = parts.some(part => part.text);
    let phraseIndex = -1;

    if (hasExplicitText) {
      return parts.map(part => {
        if (part.text) {
          return { text: part.text, isRubric: line.tags?.includes('rubric') || part.tags?.includes('rubric') || part.tags?.includes('display-rubric') };
        }
        phraseIndex += 1;
        return { id: part.phrase_id, className: getPhraseClassName(line, part.phrase_id, part.phrase_index ?? phraseIndex) };
      });
    }

    return parts.flatMap(({ phrase_id }, index) => (
      index === 0
        ? [{ id: phrase_id, className: getPhraseClassName(line, phrase_id, parts[index].phrase_index ?? index) }]
        : [{ text: ' ' }, { id: phrase_id, className: getPhraseClassName(line, phrase_id, parts[index].phrase_index ?? index) }]
    ));
  }

  if (showSpeakers && visibleSpeakers.size > 1) {
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
            />
          </div>
        );
      })}
    </div>
  );
}
