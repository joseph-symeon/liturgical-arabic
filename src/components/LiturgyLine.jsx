import React from "react";
import HoverPhrase from "./HoverPhrase.jsx";

const h = React.createElement;
const ARABIC_LEADING_PUNCTUATION = /^[،؛؟,.!:;]/;

export default function LiturgyLine(props) {
  const arabicFontFamily = props.arabicFontFamily || '"Noto Naskh Arabic", serif';
  const arabicFontWeight = props.arabicFontWeight || "400";

  return h(
    "span",
    {
	      className: "text-2xl leading-loose text-stone-950 dark:text-stone-50",
      style: { fontFamily: arabicFontFamily, fontWeight: arabicFontWeight }
    },
    props.line.map(function renderPart(part, partIndex) {
      if (part.text && ARABIC_LEADING_PUNCTUATION.test(part.text)) {
        return h("span", { key: (part.text || "part") + partIndex }, "\u2060", part.text);
      }
      return h(HoverPhrase, {
        key: (part.id || part.text || "part") + partIndex,
        part: part,
        arabicMode: props.arabicMode,
        speechRate: props.speechRate
      });
    })
  );
}
