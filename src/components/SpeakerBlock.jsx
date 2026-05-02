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
        showSpeaker
      });
    });
  }

  return h(
    "section",
    null,
    section.section
      ? h(
          "h2",
          {
            className:
              "mx-auto mt-10 mb-4 max-w-4xl text-center text-lg font-semibold text-amber-800",
            dir: "ltr"
          },
          section.section
        )
      : null,
    h(
      "div",
      { className: "mx-auto max-w-4xl py-2 text-right", dir: "rtl" },
      isLineByLine ? renderLineByLine() : renderGrouped()
    )
  );
}
