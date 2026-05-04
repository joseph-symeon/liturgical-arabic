import React from "react";
import liturgyText from "./data/liturgyText.js";
import phrases from "./data/phrases.js";
import SpeakerBlock from "./components/SpeakerBlock.jsx";
import { getArabicText } from "./utils/arabic.js";

const h = React.createElement;

export default function ArabicLiturgyReader({
  arabicMode = "voweled",
  readerLayout = "paragraph",
  selectedSectionIndex = 0,
  speechRate = 0.8,
  arabicFontFamily,
  arabicFontWeight,
  hasPreviousSection = false,
  hasNextSection = false,
  previousSectionTitle,
  nextSectionTitle,
  onPreviousSection,
  onNextSection,
  onTableOfContents,
  onSelectSection
}) {
  const isTableOfContents = selectedSectionIndex === null;
  const selectedSection = isTableOfContents ? null : liturgyText[selectedSectionIndex] || liturgyText[0];
  const selectedSectionTitlePhrase = selectedSection?.section_title_phrase
    ? phrases[selectedSection.section_title_phrase]
    : null;

  function renderSectionNav(className) {
    return h(
      "nav",
      { className, dir: "ltr", "aria-label": "Liturgy section navigation" },
      h(
        "button",
        {
          type: "button",
          onClick: onTableOfContents,
          disabled: isTableOfContents,
          className:
            "rounded border border-stone-300 dark:border-stone-600 px-3 py-1 text-sm disabled:cursor-default disabled:opacity-40"
        },
        "Table of Contents"
      ),
      h(
        "button",
        {
          type: "button",
          onClick: onPreviousSection,
          disabled: !hasPreviousSection,
          className:
            "rounded border border-stone-300 dark:border-stone-600 px-3 py-1 text-sm disabled:cursor-default disabled:opacity-40"
        },
        previousSectionTitle ? `Previous: ${previousSectionTitle}` : "Previous"
      ),
      h(
        "button",
        {
          type: "button",
          onClick: onNextSection,
          disabled: !hasNextSection,
          className:
            "rounded border border-stone-300 dark:border-stone-600 px-3 py-1 text-sm disabled:cursor-default disabled:opacity-40"
        },
        nextSectionTitle ? `Next: ${nextSectionTitle}` : "Next"
      )
    );
  }

  function renderTableOfContents() {
    return h(
      "div",
      { dir: "ltr" },
      h(
        "ol",
        { className: "list-decimal space-y-2 pl-6" },
        liturgyText.map(function renderTocItem(section, sectionIndex) {
          const titlePhrase = section.section_title_phrase ? phrases[section.section_title_phrase] : null;
          return h(
            "li",
            { key: section.section || sectionIndex },
            h(
              "button",
              {
                type: "button",
                onClick: function selectSection() {
                  onSelectSection(sectionIndex);
                },
                className:
                  "text-left underline decoration-stone-300 underline-offset-4 hover:decoration-stone-500 dark:decoration-stone-600 dark:hover:decoration-stone-400"
              },
              h(
                "span",
                { className: "grid grid-cols-[1fr_auto] gap-4" },
                h("span", null, section.section || `Section ${sectionIndex + 1}`),
                titlePhrase
                  ? h(
                      "span",
                      {
                        dir: "rtl",
                        style: {
                          fontFamily: arabicFontFamily,
                          fontWeight: arabicFontWeight
                        }
                      },
                      getArabicText(titlePhrase, arabicMode)
                    )
                  : null
              )
            )
          );
        })
      )
    );
  }

  return h(
    "main",
    { className: "mx-auto max-w-[700px] px-4 py-10 leading-8" },
    h(
      "header",
      { className: "mb-8", dir: "ltr" },
      isTableOfContents
        ? h(
            "h1",
            { className: "mb-2 text-center text-2xl font-medium leading-tight md:text-3xl" },
            "Table of Contents"
          )
        : h(
            "h1",
            { className: "liturgical-red grid grid-cols-2 items-baseline gap-4 text-2xl font-medium leading-tight md:text-3xl" },
            h("span", { className: "text-left" }, selectedSection.section),
            h(
              "span",
              {
                className: "text-right",
                dir: "rtl",
                style: {
                  fontFamily: arabicFontFamily,
                  fontWeight: 500
                }
              },
              selectedSectionTitlePhrase
                ? getArabicText(selectedSectionTitlePhrase, arabicMode)
                : null
            )
          )
    ),
    isTableOfContents
      ? renderTableOfContents()
      : h(SpeakerBlock, {
          key: selectedSection.section + selectedSectionIndex,
          section: selectedSection,
          arabicMode,
          speechRate,
          arabicFontFamily,
          arabicFontWeight,
          readerLayout,
          showSectionHeading: false
        }),
    renderSectionNav("mt-8 flex gap-2")
  );
}
