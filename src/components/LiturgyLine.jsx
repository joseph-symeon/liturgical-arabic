import React from "react";
import HoverPhrase from "./HoverPhrase.jsx";

const h = React.createElement;

export default function LiturgyLine(props) {
  return h(
    "span",
    { className: "text-2xl leading-loose text-stone-950 md:text-3xl" },
    props.line.map(function renderPart(part, partIndex) {
      return h(HoverPhrase, {
        key: (part.id || part.text || "part") + partIndex,
        part: part,
        arabicMode: props.arabicMode,
        speechRate: props.speechRate
      });
    })
  );
}
