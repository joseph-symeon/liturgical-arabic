import React from "react";
import { defaultServiceText } from "./data/texts/serviceTexts.js";
import phrases from "./data/texts/phrases.js";
import BilingualTitle from "./components/BilingualTitle.jsx";
import PassageRenderer from "./components/passage/PassageRenderer.jsx";
import { getArabicText } from "./utils/arabic.js";
import { createServiceSectionPassage } from "./utils/passages.js";
import { getServiceNavigation } from "./utils/serviceNavigation.js";
import "./components/course/course.css";
import "./reader.css";

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
  onTableOfContents,
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
  const selectedSectionEyebrow = selectedSection?.section_group || serviceText.title;
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
          renderNavLabel(readerServiceHomePrimaryTitle, readerServiceHomeSubtitle)
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

  function renderReaderHeader({ kicker = "Reader", title, meta, titlePhrase, arabicTitle, arabicMeta }) {
    const titleContent = titlePhrase
      ? h(BilingualTitle, {
          as: "h1",
          english: title,
          phraseId: titlePhrase,
          arabicMode,
          speechRate,
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
          className: "reader-service-section-card"
        },
        h(
          "span",
          { className: "reader-service-section-card-inner" },
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
        "details",
        { className: "lp-course-unit", key: item.group, open: true },
        h(
          "summary",
          { className: "lp-course-unit-summary" },
          h("span", { className: "reader-service-group-title" }, item.group),
          groupPhrase
            ? h(
                "span",
                {
                  className: "reader-service-group-arabic text-right",
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
        { className: "lp-course-overview" },
        serviceHome?.items.map(renderSectionGroup)
      )
    );
  }

  function renderSectionPassage() {
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
      showSectionHeading: false
    });
  }

  function renderSectionPage() {
    return h(
      "div",
      { className: "reader-section-layout" },
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
        renderSectionNav("bottom-page-nav grid gap-2")
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
      ? renderSectionNav("bottom-page-nav grid gap-2")
      : null
  );
}
