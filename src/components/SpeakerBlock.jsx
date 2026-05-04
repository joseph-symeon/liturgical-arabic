import React from "react";
import SpeakerLine from "./SpeakerLine.jsx";

const h = React.createElement;

export default function SpeakerBlock(props) {
  const section = props.section;
  const isLineByLine = props.readerLayout === "line";

  function renderGrouped() {
    const groups = [];
    section.verses.forEach(function (verse) {
      const last = groups[groups.length - 1];
      if (last && last.speaker === verse.speaker) {
        last.phrases = last.phrases.concat([{ text: " " }], verse.phrases);
      } else {
        groups.push({ speaker: verse.speaker, key: verse.verse, phrases: verse.phrases.slice() });
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
    return section.verses.map(function (verse) {
      const showSpeaker = verse.speaker !== lastSpeaker;
      lastSpeaker = verse.speaker;
      return h(SpeakerLine, {
        key: verse.verse,
        speaker: verse.speaker,
        line: verse.phrases,
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
