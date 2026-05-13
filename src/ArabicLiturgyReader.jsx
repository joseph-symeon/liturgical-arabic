import React, { useEffect, useState } from "react";
import { defaultServiceText } from "./data/texts/serviceTexts.js";
import phrases from "./data/texts/phrases.js";
import PageHeader from "./components/PageHeader.jsx";
import InteractiveText from "./components/InteractiveText.jsx";
import PhraseTooltip from "./components/PhraseTooltip.jsx";
import PassageExperience from "./components/passage/PassageExperience.jsx";
import PassageRenderer from "./components/passage/PassageRenderer.jsx";
import { getArabicText } from "./utils/arabic.js";
import { PASSAGE_ACTIVITY_LABELS, PASSAGE_ACTIVITY_TYPES } from "./utils/passageActivities.js";
import { createServiceSectionPassage } from "./utils/passages.js";
import {
  resolveStoredActivitySelection,
  SHARED_ACTIVITY_SELECTION_KEY,
  storeActivitySelection
} from "./utils/activitySelectionStorage.js";
import { getServiceNavigation } from "./utils/serviceNavigation.js";
import appIcons from "./assets/icons/index.js";
import "./components/course/course.css";

const h = React.createElement;
const READER_ACTIVITY_OPTIONS = [
  { label: PASSAGE_ACTIVITY_LABELS[PASSAGE_ACTIVITY_TYPES.readListen], value: PASSAGE_ACTIVITY_TYPES.readListen },
  { label: PASSAGE_ACTIVITY_LABELS[PASSAGE_ACTIVITY_TYPES.phraseCaptions], value: PASSAGE_ACTIVITY_TYPES.phraseCaptions }
];

function getReaderActivity() {
  return resolveStoredActivitySelection(
    SHARED_ACTIVITY_SELECTION_KEY,
    READER_ACTIVITY_OPTIONS.map(option => option.value),
    PASSAGE_ACTIVITY_TYPES.readListen
  ) || PASSAGE_ACTIVITY_TYPES.readListen;
}

export default function ArabicLiturgyReader({
  serviceText = defaultServiceText,
  arabicMode = "vocalized",
  readerLayout = "paragraph",
  showQuietPrayers = true,
  selectedSectionIndex = 0,
  speechRate = 0.8,
  arabicFontFamily,
  arabicFontWeight,
  arabicFontSize,
  showPracticeToolbar = true,
  hasPreviousSection = false,
  hasNextSection = false,
  previousSectionTitle,
  nextSectionTitle,
  onPreviousSection,
  onNextSection,
  onTableOfContents,
  onSelectSection
}) {
  const readerSections = serviceText.sections || [];
  const isTableOfContents = selectedSectionIndex === null || readerSections.length === 0;
  const readerServiceNavigation = getServiceNavigation(serviceText);
  const readerServiceHomeTitle = readerServiceNavigation[0]?.title || serviceText.short_title || serviceText.title;
  const [readerActivity, setReaderActivity] = useState(() => (
    isTableOfContents ? PASSAGE_ACTIVITY_TYPES.readListen : getReaderActivity()
  ));
  const selectedSection = isTableOfContents ? null : readerSections[selectedSectionIndex] || readerSections[0];
  const selectedSectionEyebrow = selectedSection?.section_group || serviceText.title;
  const passage = isTableOfContents
    ? null
    : createServiceSectionPassage({
        serviceText,
        sectionIndex: selectedSectionIndex,
        showQuietPrayers
      });

  useEffect(() => {
    if (isTableOfContents) return;
    setReaderActivity(getReaderActivity());
  }, [isTableOfContents]);

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
          h("span", { className: "page-nav-label" }, readerServiceHomeTitle)
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
    const serviceHome = readerServiceNavigation[0];
    function renderTitleArabicPhrase(phraseId, className = "") {
      const phrase = phrases[phraseId];
      if (!phrase) return null;

      return h(
        InteractiveText,
        {
          spokenText: phrase.arabic,
          speechRate,
          tooltip: h(PhraseTooltip, { phrase }),
          className
        },
        getArabicText(phrase, arabicMode)
      );
    }

    const titleLines = serviceText.display_title || {};
    const titleArabicBaseStyle = {
      fontFamily: arabicFontFamily
    };
    const titleArabicEyebrowStyle = {
      ...titleArabicBaseStyle,
      fontWeight: 600,
      fontSize: `${Math.max(arabicFontSize - 2, 18)}px`
    };
    const titleArabicMainStyle = {
      ...titleArabicBaseStyle,
      fontWeight: 500,
      fontSize: `${Math.max(arabicFontSize + 3, 24)}px`
    };
    const englishTitleLines = titleLines.english || [];

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
          h("span", { className: `text-left ${isGrouped ? "reader-service-home-section-title" : ""}` }, section.section || `Section ${sectionIndex + 1}`),
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

    function renderSectionGroup(item) {
      if (item.type === "section") {
        return renderSectionButton(item.section, item.sectionIndex, false);
      }

      const groupPhrase = item.groupTitlePhrase ? phrases[item.groupTitlePhrase] : null;
      return h(
        "details",
        { className: "lp-course-unit", key: item.group, open: true },
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
          { className: "lp-course-lesson-list reader-service-home-section-list" },
          item.sections.map(function renderGroupedSection(sectionItem) {
            return renderSectionButton(sectionItem.section, sectionItem.sectionIndex, true);
          })
        )
      );
    }

    const titleIcon = appIcons[titleLines.icon] || (
      titleLines.arabic_phrase_ids?.length || englishTitleLines.length
        ? appIcons.chrysostomLandingIcon
        : null
    );
    const iconMaxHeight = titleLines.icon_max_height || 300;

    return h(
      "div",
      { dir: "ltr" },
      titleIcon || titleLines.arabic_phrase_ids?.length || englishTitleLines.length
        ? h(
            "header",
            { className: "mb-10 text-center" },
            h(
              "div",
              {
                className: "mx-auto mb-4 grid max-w-[560px] gap-2",
                dir: "rtl"
              },
              (titleLines.arabic_phrase_ids || []).map(function renderArabicTitleLine(phraseId, lineIndex) {
                const isEyebrow =
                  titleLines.arabic_title_tone === "eyebrow"
                  || (lineIndex === 0 && titleLines.arabic_phrase_ids.length > 1);
                return h(
                  "div",
                  {
                    key: phraseId,
                    className: isEyebrow
                      ? "text-stone-500 dark:text-[var(--dark-muted)]"
                      : "liturgical-red leading-tight",
                    style: isEyebrow ? titleArabicEyebrowStyle : titleArabicMainStyle
                  },
                  renderTitleArabicPhrase(phraseId)
                );
              })
            ),
            titleIcon
              ? h("img", {
                  src: titleIcon.src,
                  alt: titleIcon.title,
                  className: "mx-auto mb-6 h-auto w-auto max-w-[78vw] opacity-90 dark:opacity-95",
                  style: {
                    maxHeight: `${iconMaxHeight}px`
                  }
                })
              : null,
            h(
              "div",
              { className: "mx-auto max-w-[560px]" },
              englishTitleLines.map(function renderEnglishTitleLine(line, lineIndex) {
                const isEyebrow = line.tone === "eyebrow" || (lineIndex === 0 && englishTitleLines.length > 1);
                const isPrimary = line.tone === "red" || (!isEyebrow && englishTitleLines.length > 1);
                return h(
                  isEyebrow ? "div" : "h1",
                  {
                    key: `${line.text}-${lineIndex}`,
                    className: isEyebrow
                      ? "mb-2 text-lg font-semibold uppercase tracking-wide text-stone-500 dark:text-[var(--dark-muted)]"
                      : isPrimary
                        ? `${line.tone === "red" ? "liturgical-red" : "text-stone-900 dark:text-[var(--dark-text)]"} text-2xl font-medium leading-tight md:text-3xl`
                        : "text-lg font-semibold uppercase tracking-wide text-stone-500 dark:text-[var(--dark-muted)]"
                  },
                  line.text
                );
              })
            )
          )
        : h(
            "header",
            { className: "mb-10 text-center" },
            h(
              "div",
              { className: "mb-2 text-sm font-semibold uppercase tracking-wide text-stone-500 dark:text-[var(--dark-muted)]" },
              serviceText.title
            ),
            h(
              "h1",
              { className: "liturgical-red text-3xl font-medium leading-tight" },
              readerServiceHomeTitle
            )
          ),
      h(
        "div",
        { className: "lp-course-overview" },
        serviceHome?.items.map(renderSectionGroup)
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
        storeActivitySelection(SHARED_ACTIVITY_SELECTION_KEY, value);
      },
      activityType: readerActivity,
      resetKey: selectedSectionIndex,
      arabicMode,
      arabicFontFamily,
      arabicFontWeight,
      showPracticeToolbar,
      renderPassage: ({ karaokeActiveCaption }) => renderPassage(karaokeActiveCaption)
    });
  }

  return h(
    "main",
    {
      className: `bottom-nav-page mx-auto max-w-[700px] px-4 py-10 leading-8${isTableOfContents ? " reader-service-home-page" : ""}`
    },
    isTableOfContents
      ? null
      : h(
          PageHeader,
          {
            eyebrow: selectedSectionEyebrow,
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
