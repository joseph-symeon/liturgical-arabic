import React from "react";
import { defaultServiceText } from "./data/texts/serviceTexts.js";
import phrases from "./data/texts/phrases.js";
import BilingualTitle from "./components/BilingualTitle.jsx";
import PassageRenderer from "./components/passage/PassageRenderer.jsx";
import { getArabicText } from "./utils/arabic.js";
import { createServiceSectionPassage } from "./utils/passages.js";
import { getServiceNavigation } from "./utils/serviceNavigation.js";
import "./components/course/course.css";

const h = React.createElement;

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
  hasPreviousSection = false,
  hasNextSection = false,
  previousSectionTitle,
  nextSectionTitle,
  onPreviousSection,
  onNextSection,
  onSelectSection
}) {
  const readerSections = serviceText.sections || [];
  const isTableOfContents = selectedSectionIndex === null || readerSections.length === 0;
  const readerServiceNavigation = getServiceNavigation(serviceText);
  const displayEnglishTitle = serviceText.display_title?.english || [];
  const readerServiceHomeTitle = displayEnglishTitle[0]?.text || readerServiceNavigation[0]?.title || serviceText.short_title || serviceText.title;
  const readerServiceHomePrimaryTitle = displayEnglishTitle[0]?.text || serviceText.short_title || serviceText.title || readerServiceHomeTitle;
  const readerServiceHomeSubtitle =
    displayEnglishTitle.slice(1).map(line => line.text).filter(Boolean).join(" ")
    || (serviceText.nav_title && serviceText.nav_title !== readerServiceHomePrimaryTitle
      ? serviceText.nav_title
      : null);
  const selectedSection = isTableOfContents ? null : readerSections[selectedSectionIndex] || readerSections[0];
  const selectedSectionEyebrow = readerSections.length === 1
    ? "Reader"
    : selectedSection?.section_group || serviceText.title;
  const passage = isTableOfContents
    ? null
    : createServiceSectionPassage({
        serviceText,
        sectionIndex: selectedSectionIndex,
        showQuietPrayers
      });

  function renderArabicTitle(phrase) {
    if (!phrase) return null;
    return getArabicText(phrase, arabicMode);
  }

  function renderSectionNav() {
    function renderNavLabel(action, destination, direction) {
      const arrow = h(
        "span",
        { className: "page-nav-arrow", "aria-hidden": true },
        direction === "previous" ? "←" : "→"
      );
      return h(
        React.Fragment,
        null,
        h(
          "span",
          { className: "page-nav-label" },
          direction === "previous" ? arrow : null,
          action,
          direction === "next" ? arrow : null
        ),
        destination ? h("span", { className: "page-nav-destination" }, destination) : null
      );
    }

    return h(
      "nav",
      { className: "page-nav", dir: "ltr", "aria-label": "Liturgy section navigation" },
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
          renderNavLabel("Previous", previousSectionTitle, "previous")
        ),
        h(
          "button",
          {
            type: "button",
            onClick: onNextSection,
            disabled: !hasNextSection,
            className: "page-nav-button page-nav-button-end"
          },
          renderNavLabel("Next", nextSectionTitle, "next")
        )
      )
    );
  }

  function renderReaderHeader({ kicker = "Reader", title, meta, titlePhrase, arabicTitle, arabicMeta }) {
    const titleContent = titlePhrase
      ? h(BilingualTitle, {
          as: "h1",
          english: title,
          phraseId: titlePhrase,
          arabicMode,
          speechRate,
          speechEnabled: false,
          arabicFontFamily,
          arabicFontWeight: "500",
          className: "lp-view-title reader-section-title"
        })
      : h("h1", { className: "lp-view-title" }, title);

    return h(
      "header",
      { className: "lp-view-header reader-page-header" },
      kicker ? h("p", { className: "lp-view-kicker" }, kicker) : null,
      arabicTitle
        ? h(
            "div",
            { className: "reader-page-title-row" },
            titleContent,
            h(
              "div",
              {
                className: "reader-service-title-arabic",
                dir: "rtl",
                style: {
                  fontFamily: arabicFontFamily,
                  fontWeight: 500
                }
              },
              arabicTitle
            )
          )
        : titleContent,
      meta || arabicMeta
        ? h(
            "div",
            { className: "reader-service-meta-row" },
            meta ? h("div", { className: "lp-view-meta" }, meta) : h("div", null),
            arabicMeta
              ? h(
                  "div",
                  {
                    className: "reader-service-meta-arabic",
                    dir: "rtl",
                    style: {
                      fontFamily: arabicFontFamily,
                      fontWeight: 500
                    }
                  },
                  arabicMeta
                )
              : null
          )
        : null
    );
  }

  function renderTableOfContents() {
    const serviceHome = readerServiceNavigation[0];
    const serviceArabicTitleParts = (serviceText.display_title?.arabic_phrase_ids || [])
      .map(phraseId => phrases[phraseId])
      .filter(Boolean)
      .map(phrase => getArabicText(phrase, arabicMode));
    const serviceArabicTitle = serviceArabicTitleParts[0] || "";
    const serviceArabicSubtitle = serviceArabicTitleParts.slice(1).join(" ");

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
          className: "reader-service-section-item"
        },
        h(
          "span",
          { className: "reader-service-section-item-inner" },
          h("span", { className: `reader-service-section-title text-left ${isGrouped ? "reader-service-home-section-title" : ""}` }, section.section || `Section ${sectionIndex + 1}`),
          titlePhrase
            ? h(
                "span",
                {
                  className: "reader-service-section-arabic text-right",
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
        "section",
        { className: "reader-service-section-group", key: item.group },
        h(
          "header",
          { className: "reader-service-section-group-header" },
          h("span", { className: "lp-view-kicker reader-service-group-title" }, item.group),
          groupPhrase
            ? h(
                "span",
                {
                  className: "lp-view-kicker reader-service-group-arabic text-right",
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

    return h(
      "div",
      { dir: "ltr" },
      renderReaderHeader({
        title: readerServiceHomePrimaryTitle,
        meta: readerServiceHomeSubtitle,
        arabicTitle: serviceArabicTitle,
        arabicMeta: serviceArabicSubtitle
      }),
      h(
        "div",
        { className: "lp-course-overview reader-service-section-list" },
        serviceHome?.items.map(renderSectionGroup)
      )
    );
  }

  function renderSectionPassage() {
    if (passage.has_hidden_quiet_prayers) {
      return h(
        "div",
        {
          className: "reader-quiet-prayers-notice",
          dir: "ltr",
          role: "note",
          style: { fontSize: arabicFontSize }
        },
        h("p", { className: "reader-quiet-prayers-notice-title" }, "Silent prayers are hidden"),
        h("p", { className: "reader-quiet-prayers-notice-summary" }, "The prayers in this section are said silently by the priest."),
        h(
          "div",
          { className: "reader-quiet-prayers-notice-actions" },
          h(
            "div",
            { className: "reader-quiet-prayers-notice-action" },
            h("span", { className: "reader-quiet-prayers-notice-marker" }, "Aع"),
            h("span", null, "Enable ", h("strong", null, "Silent prayers"), " in the display menu at the upper right.")
          ),
          h(
            "div",
            { className: "reader-quiet-prayers-notice-action" },
            h("span", { className: "reader-quiet-prayers-notice-marker", "aria-hidden": true }, "→"),
            h("span", null, "Select ", h("strong", null, "Next"), " to progress to the next audible section.")
          )
        )
      );
    }

    return h(PassageRenderer, {
      key: passage.segment_ids.join(":") + selectedSectionIndex,
      section: {
        lines: passage.lines,
        section: passage.section.section,
        section_title_phrase: passage.section.section_title_phrase
      },
      arabicMode,
      speechRate,
      speechEnabled: false,
      arabicFontFamily,
      arabicFontWeight,
      arabicFontSize,
      readerLayout,
      showSectionHeading: false
    });
  }

  function renderSectionPage() {
    return h(
      React.Fragment,
      null,
      renderReaderHeader({
        kicker: selectedSectionEyebrow,
        title: selectedSection.section,
        titlePhrase: selectedSection.section_title_phrase
      }),
      h(
        "div",
        { className: "reader-section-content" },
        renderSectionPassage()
      ),
      h(
        "footer",
        { className: "reader-section-footer" },
        renderSectionNav()
      )
    );
  }

  return h(
    "main",
    {
      className: [
        "lp-page",
        "course-view-page",
        "lp-course-map-page",
        "reader-page",
        isTableOfContents ? "reader-service-home-page" : "reader-section-page"
      ].join(" ")
    },
    isTableOfContents
      ? renderTableOfContents()
      : renderSectionPage(),
    isTableOfContents
      ? h(
          "footer",
          { className: "reader-section-footer" },
          renderSectionNav()
        )
      : null
  );
}
