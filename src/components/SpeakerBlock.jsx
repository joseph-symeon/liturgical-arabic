import React from "react";
import SpeakerLine from "./SpeakerLine.jsx";

const h = React.createElement;

export default function SpeakerBlock(props) {
  const section = props.section;
  const isLineByLine = props.readerLayout === "line";
  const lines = section.lines || [];

  function getLineParts(line) {
    function isActivePart(phraseId, phraseIndex) {
      const captionMatchesLine = !props.activeCaption?.segment_id
        || props.activeCaption.segment_id === line.segment_id
        || (
          props.activeCaption.source_segment_id
            && line.source_segment_id
            && props.activeCaption.source_segment_id === line.source_segment_id
        );
      const captionMatchesPhraseIndex = props.activeCaption?.phrase_index == null
        || phraseIndex == null
        || props.activeCaption.phrase_index === phraseIndex;
      return props.activeCaption?.phrase_id === phraseId
        && captionMatchesLine
        && captionMatchesPhraseIndex;
    }

    let phraseIndex = -1;
    return [...line.phrases]
      .sort((a, b) => a.display_order - b.display_order)
      .map(part => {
        if (part.text) return { text: part.text, isRubric: line.tags?.includes("rubric") || part.tags?.includes("rubric") };
        phraseIndex += 1;
        return {
          id: part.phrase_id,
          className: isActivePart(part.phrase_id, phraseIndex) ? "lp-karaoke-active" : undefined
        };
      });
  }

  function renderGrouped() {
    const groups = [];
    lines.forEach(function (line) {
      const last = groups[groups.length - 1];
      if (last && last.speaker === line.speaker) {
        const joinsQuietPrayer =
          line.tags?.includes("quiet")
          && last.lastLineTags?.includes("quiet")
          && !line.tags?.includes("paragraph-break");
        const joinsParagraphOnly = line.tags?.includes("paragraph-join");
        last.phrases = last.phrases.concat(
          [line.break_before && !joinsQuietPrayer && !joinsParagraphOnly ? { break: true } : { text: " " }],
          getLineParts(line)
        );
        last.lastLineTags = line.tags || [];
      } else {
        groups.push({
          speaker: line.speaker,
          key: line.line_order,
          phrases: getLineParts(line),
          lastLineTags: line.tags || []
        });
      }
    });

    return groups.map(function (group) {
      return h(SpeakerLine, {
        key: group.key,
        speaker: group.speaker,
        line: group.phrases,
        arabicMode: props.arabicMode,
        speechRate: props.speechRate,
        arabicFontFamily: props.arabicFontFamily,
        arabicFontWeight: props.arabicFontWeight,
        arabicFontSize: props.arabicFontSize,
        showSpeaker: true
      });
    });
  }

  function renderLineByLine() {
    let lastSpeaker = null;
    return lines.map(function (line) {
      const showSpeaker = Boolean(line.speaker) && line.speaker !== lastSpeaker;
      lastSpeaker = line.speaker;
      return h(SpeakerLine, {
        key: line.line_order,
        speaker: line.speaker,
        line: getLineParts(line),
        arabicMode: props.arabicMode,
        speechRate: props.speechRate,
        arabicFontFamily: props.arabicFontFamily,
        arabicFontWeight: props.arabicFontWeight,
        arabicFontSize: props.arabicFontSize,
        showSpeaker
      });
    });
  }

  return h(
    "section",
    null,
    section.section && props.showSectionHeading !== false
      ? h(
          "h2",
          {
            className:
              "mt-8 mb-4 text-[17px] font-semibold",
            dir: "ltr"
          },
          section.section
        )
      : null,
    h(
      "div",
      {
        className: "py-2 text-right",
        dir: "rtl",
        style: {
          overflowX: "clip"
        }
      },
      isLineByLine ? renderLineByLine() : renderGrouped()
    )
  );
}
