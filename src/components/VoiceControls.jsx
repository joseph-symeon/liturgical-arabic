import React from "react";
import { speakArabic } from "../utils/arabic.js";

const h = React.createElement;

export default function VoiceControls(props) {
  return h(
    "section",
    {
      className:
        "mx-auto mb-8 max-w-4xl rounded-2xl border border-stone-200 bg-white p-4",
      dir: "ltr"
    },
    h(
      "h2",
      { className: "text-sm font-semibold uppercase tracking-[0.18em] text-amber-800" },
      "Reader speed"
    ),
    h(
      "label",
      { className: "mt-3 block text-sm text-stone-700" },
      "Speed: ",
      props.speechRate.toFixed(2),
      h("input", {
        className: "mt-2 w-full",
        type: "range",
        min: "0.5",
        max: "1.2",
        step: "0.05",
        value: props.speechRate,
        onChange: function changeRate(event) {
          props.setSpeechRate(Number(event.target.value));
        }
      }),
      h(
        "button",
        {
          className:
            "mt-3 rounded-xl border border-stone-300 px-3 py-1 text-xs text-stone-700 hover:bg-white",
          type: "button",
          onClick: function previewSpeed() {
            speakArabic("بِسَلامٍ", props.speechRate);
          }
        },
        "Preview speed"
      )
    )
  );
}
