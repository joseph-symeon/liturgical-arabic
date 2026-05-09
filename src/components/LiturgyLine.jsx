import React from "react";
import HoverPhrase from "./HoverPhrase.jsx";

const h = React.createElement;
const ARABIC_LEADING_PUNCTUATION = /^[،؛؟,.!:;]/;

export default function LiturgyLine(props) {
  const arabicFontFamily = props.arabicFontFamily || '"Noto Naskh Arabic", serif';
  const arabicFontWeight = props.arabicFontWeight || "400";
  const arabicFontSize = props.arabicFontSize || 24;

  return h(
    "span",
    {
	      className: "leading-loose text-stone-950 dark:text-[var(--dark-text)]",
      style: {
        fontFamily: arabicFontFamily,
        fontWeight: arabicFontWeight,
        fontSize: arabicFontSize,
        overflowWrap: "normal",
        whiteSpace: "normal"
      }
    },
    props.line.map(function renderPart(part, partIndex) {
      if (part.text) {
        const className = part.isRubric ? "liturgical-red" : undefined;
        const text = ARABIC_LEADING_PUNCTUATION.test(part.text) ? `\u2060${part.text}` : part.text;
        return h("span", { key: (part.text || "part") + partIndex, className }, text);
      }
      return h(HoverPhrase, {
        key: (part.id || part.text || "part") + partIndex,
        part: part,
        arabicMode: props.arabicMode,
        speechRate: props.speechRate,
        className: part.className
      });
    })
  );
}
