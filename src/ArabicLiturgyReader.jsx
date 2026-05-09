import React, { useEffect, useState } from "react";
import { defaultServiceText } from "./data/texts/serviceTexts.js";
import phrases from "./data/texts/phrases.js";
import PageHeader from "./components/PageHeader.jsx";
import PassageExperience from "./components/passage/PassageExperience.jsx";
import PassageRenderer from "./components/passage/PassageRenderer.jsx";
import { getArabicText } from "./utils/arabic.js";
import { PASSAGE_ACTIVITY_LABELS, PASSAGE_ACTIVITY_TYPES } from "./utils/passageActivities.js";
import { createServiceSectionPassage } from "./utils/passages.js";
import {
  getStoredActivitySelection,
  storeActivitySelection
} from "./utils/activitySelectionStorage.js";
import "./components/course/course.css";

const h = React.createElement;
const readerSections = defaultServiceText.sections;
const READER_ACTIVITY_OPTIONS = [
  { label: PASSAGE_ACTIVITY_LABELS[PASSAGE_ACTIVITY_TYPES.readListen], value: PASSAGE_ACTIVITY_TYPES.readListen },
  { label: PASSAGE_ACTIVITY_LABELS[PASSAGE_ACTIVITY_TYPES.phraseCaptions], value: PASSAGE_ACTIVITY_TYPES.phraseCaptions }
];

function getReaderActivitySelectionKey(sectionIndex) {
  return `${defaultServiceText.id}:section:${sectionIndex}`;
}

function getReaderActivity(sectionIndex) {
  return getStoredActivitySelection(
    getReaderActivitySelectionKey(sectionIndex),
    READER_ACTIVITY_OPTIONS.map(option => option.value)
  ) || PASSAGE_ACTIVITY_TYPES.readListen;
}

export default function ArabicLiturgyReader({
  arabicMode = "vocalized",
  readerLayout = "paragraph",
  showQuietPrayers = true,
  selectedSectionIndex = 0,
  speechRate = 0.8,
  arabicFontFamily,
  arabicFontWeight,
  arabicFontSize,
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
  const [readerActivity, setReaderActivity] = useState(() => (
    isTableOfContents ? PASSAGE_ACTIVITY_TYPES.readListen : getReaderActivity(selectedSectionIndex)
  ));
  const selectedSection = isTableOfContents ? null : readerSections[selectedSectionIndex] || readerSections[0];
  const passage = isTableOfContents
    ? null
    : createServiceSectionPassage({
        serviceText: defaultServiceText,
        sectionIndex: selectedSectionIndex,
        showQuietPrayers
      });

  useEffect(() => {
    if (isTableOfContents) return;
    setReaderActivity(getReaderActivity(selectedSectionIndex));
  }, [isTableOfContents, selectedSectionIndex]);

  function renderArabicTitle(phrase) {
    if (!phrase) return null;
    return getArabicText(phrase, arabicMode);
  }

  function renderSectionNav(className) {
    function renderNavLabel(action, destination) {
      return h(
        React.Fragment,
        null,
        h("span", { className: "page-nav-label" }, action),
        destination ? h("span", { className: "page-nav-destination" }, destination) : null
      );
    }

    return h(
      "nav",
      { className: `${className} page-nav`, dir: "ltr", "aria-label": "Liturgy section navigation" },
      h(
        "div",
        { className: "page-nav-grid" },
        h(
          "button",
          {
            type: "button",
            onClick: onPreviousSection,
            disabled: !hasPreviousSection,
            className: "page-nav-button page-nav-button-start"
          },
          renderNavLabel("Previous", previousSectionTitle)
        ),
        h(
          "button",
          {
            type: "button",
            onClick: onTableOfContents,
            disabled: isTableOfContents,
            className: "page-nav-button page-nav-button-center"
          },
          h("span", { className: "page-nav-label" }, "Table of Contents")
        ),
        h(
          "button",
          {
            type: "button",
            onClick: onNextSection,
            disabled: !hasNextSection,
            className: "page-nav-button page-nav-button-end"
          },
          renderNavLabel("Next", nextSectionTitle)
        )
      )
    );
  }

  function renderTableOfContents() {
    const items = [];
    readerSections.forEach(function collectSection(section, sectionIndex) {
      if (!section.section_group) {
        items.push({ type: "section", section, sectionIndex });
        return;
      }

      const last = items[items.length - 1];
      if (last && last.type === "group" && last.group === section.section_group) {
        last.sections.push({ section, sectionIndex });
      } else {
        items.push({
          type: "group",
          group: section.section_group,
          groupTitlePhrase: section.section_group_title_phrase,
          sections: [{ section, sectionIndex }]
        });
      }
    });

    function renderSectionButton(section, sectionIndex, isGrouped) {
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
            "block w-full rounded px-2 py-1 hover:bg-stone-100 dark:hover:bg-[var(--dark-hover)]"
        },
        h(
          "span",
          { className: "grid grid-cols-[minmax(0,1.35fr)_minmax(0,0.85fr)] items-baseline gap-4" },
          h("span", { className: `text-left ${isGrouped ? "pl-2" : ""}` }, section.section || `Section ${sectionIndex + 1}`),
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
    }

    return h(
      "div",
      { dir: "ltr" },
      h(
        "div",
        { className: "lp-course-overview" },
        items.map(function renderTocItem(item) {
          if (item.type === "section") {
            return renderSectionButton(item.section, item.sectionIndex, false);
          }

          const groupPhrase = item.groupTitlePhrase ? phrases[item.groupTitlePhrase] : null;
          return h(
            "details",
            { className: "lp-course-unit", key: item.group, defaultOpen: true },
            h(
              "summary",
              { className: "lp-course-unit-summary" },
              h("span", null, item.group),
              groupPhrase
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
                    renderArabicTitle(groupPhrase)
                  )
                : null
            ),
            h(
              "div",
              { className: "lp-course-lesson-list" },
              item.sections.map(function renderGroupedSection(sectionItem) {
                return renderSectionButton(sectionItem.section, sectionItem.sectionIndex, true);
              })
            )
          );
        })
      )
    );
  }

  function renderSectionPassageExperience() {
    function renderPassage(karaokeActiveCaption = null) {
      return h(PassageRenderer, {
        key: passage.segment_ids.join(":") + selectedSectionIndex,
        section: {
          lines: passage.lines,
          section: passage.section.section,
          section_title_phrase: passage.section.section_title_phrase
        },
        arabicMode,
        speechRate,
        arabicFontFamily,
        arabicFontWeight,
        arabicFontSize,
        readerLayout,
        activeCaption: karaokeActiveCaption,
        showSectionHeading: false
      });
    }

    if (!passage?.playback) return renderPassage();
    return h(PassageExperience, {
      passage,
      activityLabel: PASSAGE_ACTIVITY_LABELS[readerActivity],
      activitySelectId: "reader-activity-select",
      activityOptions: READER_ACTIVITY_OPTIONS,
      selectedActivityValue: readerActivity,
      onSelectActivity: value => {
        setReaderActivity(value);
        storeActivitySelection(getReaderActivitySelectionKey(selectedSectionIndex), value);
      },
      activityType: readerActivity,
      resetKey: selectedSectionIndex,
      arabicMode,
      arabicFontFamily,
      arabicFontWeight,
      renderPassage: ({ karaokeActiveCaption }) => renderPassage(karaokeActiveCaption)
    });
  }

  return h(
    "main",
    { className: "bottom-nav-page mx-auto max-w-[700px] px-4 py-10 leading-8" },
    h(
      PageHeader,
      isTableOfContents
        ? {
            title: "Table of Contents",
            align: "center"
          }
        : {
            eyebrow: selectedSection.section_group,
            title: selectedSection.section,
            titlePhrase: selectedSection.section_title_phrase,
            arabicMode,
            speechRate,
            arabicFontFamily,
            arabicFontWeight: "500"
          }
    ),
    isTableOfContents
      ? renderTableOfContents()
      : h(
          React.Fragment,
          null,
          renderSectionPassageExperience()
        ),
    renderSectionNav("bottom-page-nav grid gap-2")
  );
}
