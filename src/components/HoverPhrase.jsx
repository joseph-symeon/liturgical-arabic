import React, { useState } from "react";
import annotations from "../data/annotations.js";
import { getArabicText, speakArabic } from "../utils/arabic.js";

const h = React.createElement;

export default function HoverPhrase(props) {
  const [isOpen, setIsOpen] = useState(false);
  const part = props.part;
  const annotation = part.annotationId ? annotations[part.annotationId] : null;

  if (!annotation) return h("span", null, part.text);

  const text = getArabicText(annotation, props.arabicMode);
  const spokenText = annotation.arabicVoweled || annotation.arabicPlain;

  return h(
    "span",
    { className: "relative inline-block" },
    h(
      "span",
      {
        className:
          "cursor-default rounded-sm decoration-stone-300 decoration-dotted underline underline-offset-4 transition hover:bg-amber-50",
        onMouseEnter: function showTooltip() { setIsOpen(true); },
        onMouseLeave: function hideTooltip() { setIsOpen(false); },
        onClick: function handleClick(e) {
          if (e && e.stopPropagation) e.stopPropagation();
          setIsOpen(function updateIsOpen(v) { return !v; });
          speakArabic(spokenText, props.speechRate);
        }
      },
      text
    ),
    isOpen
      ? h(
          "span",
          {
            className:
              "absolute right-0 top-full z-20 mt-2 w-72 rounded-xl border border-stone-200 bg-white p-3 text-left text-sm leading-normal text-stone-900 shadow-lg",
            dir: "ltr"
          },
          h("span", { className: "block font-medium" }, "Translation: ", annotation.translation),
          h("span", { className: "mt-1 block text-stone-500" }, "Literal: ", annotation.literal)
        )
      : null
  );
}
