import React, { useEffect, useState } from "react";
import { defaultServiceText } from "./data/texts/serviceTexts.js";
import phrases from "./data/texts/phrases.js";
import segments from "./data/texts/segments.js";
import recordings from "./data/media/recordings.js";
import SpeakerBlock from "./components/SpeakerBlock.jsx";
import PageHeader from "./components/PageHeader.jsx";
import { getArabicText } from "./utils/arabic.js";
import { getServiceSectionPlayback } from "./utils/servicePlayback.js";
import YouTubeClipPlayer from "./components/course/YouTubeClipPlayer.jsx";
import "./components/course/course.css";

const h = React.createElement;
const readerSections = defaultServiceText.sections;
const READER_SECTION_AUDIO = {
  [readerSections.findIndex(section => section.section === "Blessed is the Kingdom")]: {
    recording_id: "recording-KJKt0V4zJjY"
  },
  [readerSections.findIndex(section => section.section === "The Second Antiphon")]: {
    recording_id: "recording--dufaXx7Hm0"
  }
};

function getActiveCaption(captions, currentTime, clipEndSeconds = null) {
  if (typeof currentTime !== "number") return null;
  return captions.find((caption, index) => {
    const nextCaption = captions[index + 1];
    const isFinalCaption = index === captions.length - 1;
    const displayEnd = caption.display_end_seconds ?? (nextCaption
      ? Math.min(caption.end_seconds, nextCaption.start_seconds - 0.01)
      : Math.max(caption.end_seconds, clipEndSeconds ?? caption.end_seconds));
    return isFinalCaption
      ? currentTime >= caption.start_seconds && currentTime <= displayEnd
      : currentTime >= caption.start_seconds && currentTime < displayEnd;
  }) || null;
}

function getCaptionsForPlayback(playback) {
  const ranges = playback?.aligned_ranges || [];
  const selectedRanges = [];
  const usedSegmentIndexes = new Set();

  [...ranges]
    .sort((first, second) => (
      (second.resolved_service_range.end.segment_index - second.resolved_service_range.start.segment_index)
        - (first.resolved_service_range.end.segment_index - first.resolved_service_range.start.segment_index)
    ))
    .forEach(range => {
      const indexes = [];
      for (
        let index = range.resolved_service_range.start.segment_index;
        index <= range.resolved_service_range.end.segment_index;
        index += 1
      ) {
        indexes.push(index);
      }
      if (indexes.some(index => usedSegmentIndexes.has(index))) return;
      indexes.forEach(index => usedSegmentIndexes.add(index));
      selectedRanges.push(range);
    });

  return selectedRanges
    .flatMap(range => Object.entries(range.segment_timings || {}).flatMap(([segmentId, timing]) => (
      (timing.phrase_timings || []).map(phraseTiming => ({
        ...phraseTiming,
        segment_id: segmentId,
        range_key: range.resolved_service_range.key
      }))
    )))
    .filter(Boolean)
    .sort((first, second) => first.start_seconds - second.start_seconds);
}

function getPlaybackClip(playback) {
  const ranges = playback?.aligned_ranges || [];
  if (ranges.length === 0) return null;

  return ranges.reduce((clip, range) => ({
    recording_id: range.recording_id,
    start_seconds: Math.min(clip.start_seconds, range.start_seconds),
    end_seconds: Math.max(clip.end_seconds, range.end_seconds)
  }), {
    recording_id: ranges[0].recording_id,
    start_seconds: ranges[0].start_seconds,
    end_seconds: ranges[0].end_seconds
  });
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
  const [readerActivity, setReaderActivity] = useState("read-listen");
  const [syncedTime, setSyncedTime] = useState(null);
  const isTableOfContents = selectedSectionIndex === null;
  const selectedSection = isTableOfContents ? null : readerSections[selectedSectionIndex] || readerSections[0];
  const selectedSectionSegments = selectedSection
    ? selectedSection.segment_ids.map(segmentId => segments[segmentId]).filter(Boolean)
      .filter(segment => showQuietPrayers || !segment.tags?.includes("quiet"))
    : [];
  const selectedSectionLines = selectedSectionSegments
    .map((segment, index) => ({
      ...segment,
      segment_id: selectedSection.segment_ids[index],
      line_order: index + 1,
      phrases: segment.phrases.map(part => ({ ...part }))
    }));
  const sectionAudio = isTableOfContents ? null : READER_SECTION_AUDIO[selectedSectionIndex] || null;
  const sectionPlayback = sectionAudio
    ? getServiceSectionPlayback({
        service_text_id: defaultServiceText.id,
        section_index: selectedSectionIndex,
        recording_id: sectionAudio.recording_id
      })
    : null;
  const playbackClip = getPlaybackClip(sectionPlayback);
  const captions = getCaptionsForPlayback(sectionPlayback);
  const activeCaption = getActiveCaption(captions, syncedTime, playbackClip?.end_seconds) || (
    readerActivity === "phrase-captions" ? captions[0] : null
  );
  const activePhrase = activeCaption ? phrases[activeCaption.phrase_id] : null;
  const activePhraseId = activeCaption?.phrase_id || null;

  useEffect(() => {
    setSyncedTime(null);
  }, [selectedSectionIndex, readerActivity]);

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

  function renderSectionPlayer() {
    if (!playbackClip) return null;
    const recording = recordings[playbackClip.recording_id];
    const videoId = recording?.youtube?.video_id;
    const clipKey = [
      playbackClip.recording_id,
      playbackClip.start_seconds,
      playbackClip.end_seconds,
      readerActivity
    ].join(":");

    return h(YouTubeClipPlayer, {
      key: clipKey,
      videoId,
      recordingId: playbackClip.recording_id,
      startSeconds: playbackClip.start_seconds,
      endSeconds: playbackClip.end_seconds,
      defaultPlaybackRate: 1,
      onTimeUpdate: setSyncedTime
    });
  }

  function renderSectionActivityToolbar() {
    if (!sectionPlayback) return null;
    return h(
      React.Fragment,
      null,
      h(
        "div",
        { className: "lp-activity-toolbar" },
        h(
          "div",
          { className: "lp-activity-controls" },
          h("label", { className: "lp-activity-control-label", htmlFor: "reader-activity-select" }, "Activity"),
          h(
            "div",
            { className: "lp-activity-card" },
            h(
              "div",
              { className: "lp-activity-field" },
              h(
                "select",
                {
                  id: "reader-activity-select",
                  className: "lp-activity-select",
                  value: readerActivity,
                  onChange: event => setReaderActivity(event.target.value)
                },
                h("option", { value: "read-listen" }, "Read & Listen"),
                h("option", { value: "phrase-captions" }, "Phrase Captions")
              )
            )
          )
        ),
        h("div", { className: "lp-toolbar-player" }, renderSectionPlayer())
      )
    );
  }

  function renderPhraseCaptionStage() {
    if (!sectionPlayback || readerActivity !== "phrase-captions") return null;
    return h(
      "div",
      { className: "lp-synced-stage", dir: "rtl" },
      activePhrase
        ? h(
            "div",
            {
              className: "lp-synced-line active",
              key: activeCaption.phrase_id,
              style: {
                fontFamily: arabicFontFamily,
                fontWeight: arabicFontWeight
              }
            },
            h("div", { className: "lp-synced-arabic" }, getArabicText(activePhrase, arabicMode))
          )
        : null
    );
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
          renderSectionActivityToolbar(),
          renderPhraseCaptionStage(),
          h(SpeakerBlock, {
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
            arabicFontSize,
            readerLayout,
            activeCaption: readerActivity === "read-listen" ? activeCaption : null,
            showSectionHeading: false
          })
        ),
    renderSectionNav("bottom-page-nav grid gap-2")
  );
}
