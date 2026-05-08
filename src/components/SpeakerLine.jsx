import React, { useEffect, useRef, useState } from "react";
import InteractiveText from "./InteractiveText.jsx";
import LiturgyLine from "./LiturgyLine.jsx";
import PhraseTooltip from "./PhraseTooltip.jsx";
import phrases from "../data/texts/phrases.js";
import { getArabicText } from "../utils/arabic.js";

const h = React.createElement;
const STACKED_SPEAKER_WIDTH = 520;

export default function SpeakerLine(props) {
  const [isStacked, setIsStacked] = useState(false);
  const containerRef = useRef(null);
  const hasSpeaker = Boolean(props.speaker);
  const showSpeaker = hasSpeaker && props.showSpeaker !== false;
  const phrase = phrases[props.speaker];
  const speakerLabel = phrase
    ? getArabicText(phrase, props.arabicMode)
    : props.speaker;
  const arabicFontFamily = props.arabicFontFamily || '"Noto Naskh Arabic", serif';
  const arabicFontSize = props.arabicFontSize || 24;

  useEffect(() => {
    if (!containerRef.current || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(function handleResize(entries) {
      const width = entries[0]?.contentRect?.width || 0;
      setIsStacked(width > 0 && width < STACKED_SPEAKER_WIDTH);
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  function renderSpeaker() {
    return h(
      "span",
      {
	        className: "liturgical-red relative leading-loose",
        style: {
          flex: isStacked ? "0 0 auto" : "0 0 90px",
          display: !hasSpeaker || (isStacked && !showSpeaker) ? "none" : "block",
          marginBottom: isStacked ? "2px" : 0,
          textAlign: "right",
          whiteSpace: "nowrap",
          visibility: showSpeaker ? "visible" : "hidden",
          fontFamily: arabicFontFamily,
          fontSize: arabicFontSize,
          fontWeight: 500
        }
      },
      showSpeaker && phrase
        ? h(
            InteractiveText,
            {
              spokenText: phrase.arabic,
              speechRate: props.speechRate,
              tooltip: h(PhraseTooltip, { phrase })
            },
            speakerLabel,
            ":"
          )
        : showSpeaker ? speakerLabel + ":" : ""
    );
  }

  return h(
    "div",
    {
      ref: containerRef,
      className: "text-right",
      dir: "rtl",
      style: {
        display: "flex",
        flexDirection: isStacked ? "column" : "row",
        alignItems: "flex-start"
      }
    },
    renderSpeaker(),
    h(
      "div",
      {
        className: "text-right",
        style: {
          flex: 1,
          paddingRight: isStacked ? "18px" : "8px",
          minWidth: 0,
          width: isStacked ? "100%" : "auto",
          marginRight: !hasSpeaker && !isStacked ? "90px" : 0
        }
      },
      h(LiturgyLine, {
        line: props.line,
        arabicMode: props.arabicMode,
        speechRate: props.speechRate,
        arabicFontFamily: props.arabicFontFamily,
        arabicFontWeight: props.arabicFontWeight,
        arabicFontSize: props.arabicFontSize,
        activePhraseId: props.activePhraseId
      })
    )
  );
}
