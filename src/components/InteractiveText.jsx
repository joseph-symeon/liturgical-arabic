import React, { useEffect, useRef, useState } from "react";
import { speakArabic } from "../utils/arabic.js";

const h = React.createElement;
const TOOLTIP_MAX_WIDTH = 288;
const TOOLTIP_GAP = 8;
const VIEWPORT_PADDING = 8;
let interactiveTextCount = 0;

export default function InteractiveText(props) {
  const idRef = useRef(null);
  if (idRef.current === null) {
    idRef.current = `interactive-text-${++interactiveTextCount}`;
  }
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [usesHover, setUsesHover] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ left: VIEWPORT_PADDING, top: VIEWPORT_PADDING });
  const textRef = useRef(null);
  const showTranslation = usesHover ? isHovered : isOpen;
  const underlineCls = showTranslation
    ? " decoration-current decoration-dotted underline underline-offset-4"
    : "";

  useEffect(() => {
    if (!window.matchMedia) return;
    const media = window.matchMedia("(hover: hover) and (pointer: fine)");
    function updateUsesHover() {
      setUsesHover(media.matches);
    }

    updateUsesHover();
    if (media.addEventListener) {
      media.addEventListener("change", updateUsesHover);
      return () => media.removeEventListener("change", updateUsesHover);
    }
    media.addListener(updateUsesHover);
    return () => media.removeListener(updateUsesHover);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const close = () => setIsOpen(false);
    const closeOther = (event) => {
      if (event.detail !== idRef.current) setIsOpen(false);
    };
    document.addEventListener("click", close);
    document.addEventListener("interactive-text-open", closeOther);
    return () => {
      document.removeEventListener("click", close);
      document.removeEventListener("interactive-text-open", closeOther);
    };
  }, [isOpen]);

  function updateTooltipPosition() {
    if (!textRef.current) return;
    const rect = textRef.current.getBoundingClientRect();
    const maxLeft = window.innerWidth - TOOLTIP_MAX_WIDTH - VIEWPORT_PADDING;
    const left = Math.max(VIEWPORT_PADDING, Math.min(rect.right - TOOLTIP_MAX_WIDTH, maxLeft));
    const top = rect.bottom + TOOLTIP_GAP;
    setTooltipPosition({ left, top });
  }

  useEffect(() => {
    if (!showTranslation) return;
    updateTooltipPosition();
    window.addEventListener("resize", updateTooltipPosition);
    window.addEventListener("scroll", updateTooltipPosition, true);
    return () => {
      window.removeEventListener("resize", updateTooltipPosition);
      window.removeEventListener("scroll", updateTooltipPosition, true);
    };
  }, [showTranslation]);

  function handleClick(e) {
    if (e && e.stopPropagation) e.stopPropagation();
    if (usesHover) {
      speakArabic(props.spokenText, props.speechRate);
      return;
    }
    if (isOpen) {
      speakArabic(props.spokenText, props.speechRate);
    } else {
      document.dispatchEvent(new CustomEvent("interactive-text-open", { detail: idRef.current }));
      setIsOpen(true);
    }
  }

  return h(
    "span",
    { className: "relative inline-block" },
    h(
      "span",
      {
        ref: textRef,
        className: `cursor-default rounded-sm transition${underlineCls}${props.className ? ` ${props.className}` : ""}`,
        onMouseEnter: function () { setIsHovered(true); },
        onMouseLeave: function () { setIsHovered(false); },
        onClick: handleClick
      },
      props.children
    ),
    showTranslation
      ? h(
          "span",
          {
            className:
              "fixed z-20 inline-block max-w-72 rounded-xl border border-stone-200 dark:border-stone-600 bg-white dark:bg-stone-800 p-3 text-left text-sm font-normal leading-normal text-stone-900 dark:text-stone-100 shadow-lg",
            dir: "ltr",
            style: {
              left: tooltipPosition.left,
              top: tooltipPosition.top,
              width: "fit-content",
              maxWidth: `calc(100vw - ${VIEWPORT_PADDING * 2}px)`
            }
          },
          props.tooltip
        )
      : null
  );
}
