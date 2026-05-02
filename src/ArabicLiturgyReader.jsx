import React, { useMemo, useState } from "react";
import liturgyText from "./data/liturgyText.js";
import { getFlashcards } from "./utils/flashcards.js";
import SpeakerBlock from "./components/SpeakerBlock.jsx";
import ReaderLayoutControls from "./components/ReaderLayoutControls.jsx";
import VoiceControls from "./components/VoiceControls.jsx";
import CourseView from "./components/CourseView.jsx";
import DatabaseExport from "./components/DatabaseExport.jsx";
import FlashcardPreview from "./components/FlashcardPreview.jsx";

const h = React.createElement;

export default function ArabicLiturgyReader() {
  const [arabicMode, setArabicMode] = useState("voweled");
  const [readerLayout, setReaderLayout] = useState("grouped");
  const [speechRate, setSpeechRate] = useState(0.8);
  const flashcards = useMemo(getFlashcards, []);

  return h(
    "main",
    { className: "min-h-screen bg-[#f8f3ea] px-5 py-10 text-stone-950" },
    h(
      "article",
      {
        className:
          "mx-auto max-w-5xl rounded-[2rem] border border-stone-200 bg-[#fffdf8] px-6 py-10 shadow-sm md:px-14 md:py-14"
      },
      h(
        "header",
        { className: "mx-auto mb-10 max-w-3xl text-center" },
        h(
          "p",
          { className: "mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-amber-800" },
          "Divine Liturgy of St. John Chrysostom"
        ),
        h(
          "h1",
          { className: "text-4xl font-semibold tracking-tight text-stone-950 md:text-5xl" },
          "The Litany of Peace & Antiphons"
        ),
        h(
          "p",
          { className: "mt-4 text-base leading-7 text-stone-600" },
          "Hover or tap the Arabic text to reveal a translation. The Litany of Peace is followed by the Antiphons below. The same annotations can also become flashcards."
        )
      ),
      h(
        "div",
        { className: "mb-8 flex justify-center", dir: "ltr" },
        h(
          "div",
          { className: "inline-flex rounded-full border border-stone-300 bg-stone-100 p-1 text-sm" },
          h(
            "button",
            {
              className:
                arabicMode === "voweled"
                  ? "rounded-full bg-white px-4 py-2 font-medium shadow-sm"
                  : "rounded-full px-4 py-2 text-stone-600",
              onClick: function showVoweledArabic() { setArabicMode("voweled"); },
              type: "button"
            },
            "With diacritics"
          ),
          h(
            "button",
            {
              className:
                arabicMode === "plain"
                  ? "rounded-full bg-white px-4 py-2 font-medium shadow-sm"
                  : "rounded-full px-4 py-2 text-stone-600",
              onClick: function showPlainArabic() { setArabicMode("plain"); },
              type: "button"
            },
            "Without diacritics"
          )
        )
      ),
      h(ReaderLayoutControls, { readerLayout, setReaderLayout }),
      h(VoiceControls, { speechRate, setSpeechRate }),
      liturgyText.map(function renderSection(section, sectionIndex) {
        return h(SpeakerBlock, {
          key: section.section + sectionIndex,
          section,
          arabicMode,
          speechRate,
          readerLayout
        });
      }),
      h(CourseView, { cards: flashcards }),
      h(DatabaseExport, { cards: flashcards }),
      h(FlashcardPreview, { cards: flashcards })
    )
  );
}
