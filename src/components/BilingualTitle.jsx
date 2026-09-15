import React from "react";
import phrases from "../data/texts/phrases.js";
import InteractiveText from "./InteractiveText.jsx";
import PhraseTooltip from "./PhraseTooltip.jsx";
import { getArabicText } from "../utils/arabic.js";

const h = React.createElement;

export default function BilingualTitle({
  as = "h1",
  english,
  phraseId,
  arabicMode,
  speechRate,
  speechEnabled,
  arabicFontFamily,
  arabicFontWeight = "500",
  className = ""
}) {
  const phrase = phraseId ? phrases[phraseId] : null;
  const arabicText = phrase ? getArabicText(phrase, arabicMode) : null;

  if (!phrase) {
    return h(
      as,
      {
        className: className.trim()
      },
      english
    );
  }

  return h(
    as,
    {
      className:
        `bilingual-title ${className}`.trim()
    },
    h("span", { className: "bilingual-title-english text-left" }, english),
    h(
      "span",
      {
        className: "bilingual-title-arabic text-right",
        dir: "rtl",
        style: {
          fontFamily: arabicFontFamily,
          fontWeight: arabicFontWeight
        }
      },
      h(
        InteractiveText,
        {
          spokenText: phrase.arabic,
          speechRate,
          speechEnabled,
          tooltip: h(PhraseTooltip, { phrase })
        },
        arabicText
      )
    )
  );
}
