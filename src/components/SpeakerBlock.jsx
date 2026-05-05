import React from "react";
import SpeakerLine from "./SpeakerLine.jsx";

const h = React.createElement;

export default function SpeakerBlock(props) {
  const section = props.section;
  const isLineByLine = props.readerLayout === "line";
  const lines = section.lines || [];

  function getLineParts(line) {
    return [...line.phrases]
      .sort((a, b) => a.display_order - b.display_order)
      .map(part => (part.text ? { text: part.text } : { id: part.phrase_id }));
  }

  function renderGrouped() {
    const groups = [];
    lines.forEach(function (line) {
      const last = groups[groups.length - 1];
      if (last && last.speaker === line.speaker && !line.break_before) {
        last.phrases = last.phrases.concat([{ text: " " }], getLineParts(line));
      } else {
        groups.push({ speaker: line.speaker, key: line.line_order, phrases: getLineParts(line) });
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
        showSpeaker: true
      });
    });
  }

  function renderLineByLine() {
    let lastSpeaker = null;
    return lines.map(function (line) {
      const showSpeaker = line.speaker !== lastSpeaker;
      lastSpeaker = line.speaker;
      return h(SpeakerLine, {
        key: line.line_order,
        speaker: line.speaker,
        line: getLineParts(line),
        arabicMode: props.arabicMode,
        speechRate: props.speechRate,
        arabicFontFamily: props.arabicFontFamily,
        arabicFontWeight: props.arabicFontWeight,
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
              "liturgical-red mt-8 mb-4 text-[17px] font-semibold",
            dir: "ltr"
          },
          section.section
        )
      : null,
    h(
      "div",
      { className: "py-2 text-right", dir: "rtl" },
      isLineByLine ? renderLineByLine() : renderGrouped()
    )
  );
}
