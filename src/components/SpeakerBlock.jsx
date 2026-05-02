import React from "react";
import SpeakerLine from "./SpeakerLine.jsx";
import { getLogicalPhraseParts } from "../utils/arabic.js";

const h = React.createElement;

export default function SpeakerBlock(props) {
  const block = props.block;
  const isLineByLine = props.readerLayout === "line";

  function renderGroupedLine(line, lineIndex) {
    return h(SpeakerLine, {
      key: block.speaker + "-grouped-" + lineIndex,
      speaker: block.speaker,
      line: line,
      arabicMode: props.arabicMode,
      speechRate: props.speechRate,
      showSpeaker: true
    });
  }

  function renderLogicalPhraseLines() {
    let phraseIndex = 0;
    return block.lines.flatMap(function eachLine(line, lineIndex) {
      return getLogicalPhraseParts(line).map(function renderPhrase(part, partIndex) {
        const showSpeaker = phraseIndex === 0;
        phraseIndex += 1;
        return h(SpeakerLine, {
          key: block.speaker + "-line-" + lineIndex + "-" + partIndex,
          speaker: block.speaker,
          line: [part],
          arabicMode: props.arabicMode,
          speechRate: props.speechRate,
          showSpeaker: showSpeaker
        });
      });
    });
  }

  return h(
    "section",
    null,
    block.title
      ? h(
          "h2",
          {
            className:
              "mx-auto mt-10 mb-4 max-w-4xl text-center text-lg font-semibold text-amber-800",
            dir: "ltr"
          },
          block.title
        )
      : null,
    h(
      "div",
      { className: "mx-auto max-w-4xl py-2 text-right", dir: "rtl" },
      isLineByLine ? renderLogicalPhraseLines() : block.lines.map(renderGroupedLine)
    )
  );
}
