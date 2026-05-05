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
  const [tooltipPosition, setTooltipPosition] = useState(null);
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
    const containerRect = textRef.current.closest(".app-content")?.getBoundingClientRect();
    const bounds = containerRect ?? { left: 0, right: window.innerWidth };
    const minLeft = Math.max(VIEWPORT_PADDING, bounds.left + VIEWPORT_PADDING);
    const maxRight = Math.min(window.innerWidth - VIEWPORT_PADDING, bounds.right - VIEWPORT_PADDING);
    const maxWidth = Math.max(160, Math.min(TOOLTIP_MAX_WIDTH, maxRight - minLeft));
    const maxLeft = Math.max(minLeft, maxRight - maxWidth);
    const left = Math.max(minLeft, Math.min(rect.right - maxWidth, maxLeft));
    const top = rect.bottom + TOOLTIP_GAP;
    setTooltipPosition({ left, top, maxWidth });
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
      setTooltipPosition(null);
      setIsOpen(true);
    }
  }

  return h(
    "span",
    { className: "relative inline" },
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
              "fixed z-20 inline-block max-w-72 rounded-xl border border-stone-200 dark:border-[var(--dark-border)] bg-white dark:bg-[var(--dark-surface)] p-3 text-left text-sm font-normal leading-normal text-stone-900 dark:text-[var(--dark-text)] shadow-lg",
            dir: "ltr",
            style: {
              left: tooltipPosition?.left ?? VIEWPORT_PADDING,
              top: tooltipPosition?.top ?? VIEWPORT_PADDING,
              visibility: tooltipPosition ? "visible" : "hidden",
              textTransform: "none",
              letterSpacing: 0,
              width: "fit-content",
              maxWidth: tooltipPosition?.maxWidth ? `${tooltipPosition.maxWidth}px` : `calc(100vw - ${VIEWPORT_PADDING * 2}px)`
            }
          },
          props.tooltip
        )
      : null
  );
}
