import React from "react";
import InteractiveText from "./InteractiveText.jsx";
import PhraseTooltip from "./PhraseTooltip.jsx";
import phrases from "../data/phrases.js";
import { getArabicText } from "../utils/arabic.js";

const h = React.createElement;

export default function HoverPhrase(props) {
  const part = props.part;
  const phrase = part.id ? phrases[part.id] : null;

  if (!phrase) return h("span", null, part.text);

  const text = getArabicText(phrase, props.arabicMode);
  const spokenText = phrase.arabic;
  const isRubric = phrase.tags?.includes("rubric");

  return h(
    InteractiveText,
    {
      spokenText,
      speechRate: props.speechRate,
      tooltip: h(PhraseTooltip, { phrase }),
      className: isRubric ? "liturgical-red" : undefined
    },
    text
  );
}
