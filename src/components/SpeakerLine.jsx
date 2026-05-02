import React from "react";
import LiturgyLine from "./LiturgyLine.jsx";

const h = React.createElement;

export default function SpeakerLine(props) {
  const showSpeaker = props.showSpeaker !== false;

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
        className: "text-2xl leading-loose font-semibold text-red-700 md:text-3xl",
        style: {
          flex: "0 0 90px",
          textAlign: "right",
          whiteSpace: "nowrap",
          visibility: showSpeaker ? "visible" : "hidden"
        }
      },
      showSpeaker ? props.speaker : "",
      showSpeaker ? ":" : ""
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
