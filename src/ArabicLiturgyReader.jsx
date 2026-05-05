import React from "react";
import liturgySections from "./data/liturgySections.js";
import phrases from "./data/phrases.js";
import segments from "./data/segments.js";
import SpeakerBlock from "./components/SpeakerBlock.jsx";
import InteractiveText from "./components/InteractiveText.jsx";
import PhraseTooltip from "./components/PhraseTooltip.jsx";
import BilingualTitle from "./components/BilingualTitle.jsx";
import { getArabicText } from "./utils/arabic.js";

const h = React.createElement;

export default function ArabicLiturgyReader({
  arabicMode = "vocalized",
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
  const selectedSection = isTableOfContents ? null : liturgySections[selectedSectionIndex] || liturgySections[0];
  const selectedSectionSegments = selectedSection
    ? selectedSection.segment_ids.map(segmentId => segments[segmentId]).filter(Boolean)
    : [];
  const selectedSectionLines = selectedSectionSegments
    .map((segment, index) => ({
      ...segment,
      segment_id: selectedSection.segment_ids[index],
      line_order: index + 1,
      phrases: segment.phrases.map(part => ({ ...part }))
    }));
  function renderArabicTitle(phrase) {
    if (!phrase) return null;
    const text = getArabicText(phrase, arabicMode);
    return h(
      InteractiveText,
      {
        spokenText: phrase.arabic,
        speechRate,
        tooltip: h(PhraseTooltip, { phrase })
      },
      text
    );
  }

  function renderSectionNav(className) {
    return h(
      "nav",
      { className, dir: "ltr", "aria-label": "Liturgy section navigation" },
      h(
        "div",
        { className: "flex flex-wrap gap-2" },
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
      ),
      h(
        "div",
        { className: "flex flex-wrap gap-2" },
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
        )
      )
    );
  }

  function renderTableOfContents() {
    return h(
      "div",
      { dir: "ltr" },
      h(
        "div",
        { className: "space-y-2" },
        liturgySections.map(function renderTocItem(section, sectionIndex) {
          const titlePhrase = section.section_title_phrase ? phrases[section.section_title_phrase] : null;
          return h(
            "button",
            {
              key: section.section || sectionIndex,
              type: "button",
              onClick: function selectSection() {
                onSelectSection(sectionIndex);
              },
              className:
                "block w-full rounded px-2 py-1 hover:bg-stone-100 dark:hover:bg-stone-800"
            },
            h(
              "span",
              { className: "grid grid-cols-[1fr_auto] items-baseline gap-4" },
              h("span", { className: "text-left" }, section.section || `Section ${sectionIndex + 1}`),
              titlePhrase
                ? h(
                    "span",
                    {
                      className: "liturgical-red text-right",
                      dir: "rtl",
                      style: {
                        fontFamily: arabicFontFamily,
                        fontWeight: 500
                      }
                    },
                    renderArabicTitle(titlePhrase)
                  )
                : null
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
            BilingualTitle,
            {
              as: "h1",
              english: selectedSection.section,
              phraseId: selectedSection.section_title_phrase,
              arabicMode,
              speechRate,
              arabicFontFamily,
              arabicFontWeight: "500",
              className: "text-2xl font-medium leading-tight md:text-3xl"
            }
          )
    ),
    isTableOfContents
      ? renderTableOfContents()
      : h(SpeakerBlock, {
          key: selectedSection.segment_ids.join(":") + selectedSectionIndex,
          section: {
            lines: selectedSectionLines,
            section: selectedSection.section,
            section_title_phrase: selectedSection.section_title_phrase
          },
          arabicMode,
          speechRate,
          arabicFontFamily,
          arabicFontWeight,
          readerLayout,
          showSectionHeading: false
        }),
    renderSectionNav("mt-8 grid gap-2")
  );
}
