import React, { useState } from "react";
import LiturgyLine from "./LiturgyLine.jsx";
import annotations from "../data/annotations.js";
import { getArabicText, speakArabic } from "../utils/arabic.js";

const h = React.createElement;

export default function SpeakerLine(props) {
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const showSpeaker = props.showSpeaker !== false;
  const annotation = annotations[props.speaker];
  const speakerLabel = annotation
    ? getArabicText(annotation, props.arabicMode)
    : props.speaker;

  return h(
    "div",
    {
      className: "my-2 text-right",
      dir: "rtl",
      style: { display: "flex", flexDirection: "row", alignItems: "flex-start" }
    },
    h(
      "span",
      {
        className: "relative text-2xl leading-loose font-semibold text-red-700 md:text-3xl",
        style: {
          flex: "0 0 90px",
          textAlign: "right",
          whiteSpace: "nowrap",
          visibility: showSpeaker ? "visible" : "hidden"
        }
      },
      showSpeaker && annotation
        ? h(
            "span",
            {
              className:
                "cursor-default underline decoration-dotted decoration-red-300 underline-offset-4",
              onMouseEnter: function () { setTooltipOpen(true); },
              onMouseLeave: function () { setTooltipOpen(false); },
              onClick: function () { speakArabic(annotation.arabicVoweled, props.speechRate); }
            },
            speakerLabel,
            ":",
            tooltipOpen
              ? h(
                  "span",
                  {
                    className:
                      "absolute right-0 top-full z-20 mt-2 w-36 rounded-xl border border-stone-200 bg-white p-3 text-left text-sm font-normal leading-normal text-stone-900 shadow-lg",
                    dir: "ltr"
                  },
                  h("span", { className: "block font-medium" }, "Translation: ", annotation.translation),
                  h("span", { className: "mt-1 block text-stone-500" }, "Literal: ", annotation.literal)
                )
              : null
          )
        : showSpeaker ? speakerLabel + ":" : ""
    ),
    h(
      "div",
      {
        className: "text-right",
        style: { flex: 1, paddingRight: "8px", minWidth: 0 }
      },
      h(LiturgyLine, {
        line: props.line,
        arabicMode: props.arabicMode,
        speechRate: props.speechRate
      })
    )
  );
}
