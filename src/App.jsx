import React, { useState } from "react";
import ArabicLiturgyReader from "./ArabicLiturgyReader.jsx";
import LessonsView from "./components/lesson/LessonsView.jsx";
import liturgyText from "./data/liturgyText.js";
import units from "./data/units.js";
import lessons from "./data/lessons.js";
import { speakArabic } from "./utils/arabic.js";

const NAV_ITEM_STYLE = {
  display: "block",
  width: "100%",
  textAlign: "left",
  padding: "6px 8px",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  fontSize: "inherit",
  fontFamily: "inherit",
  color: "inherit"
};

const LESSON_ITEM_STYLE = { ...NAV_ITEM_STYLE };
const MENU_GROUP_STYLE = {
  minWidth: "160px",
  padding: "8px"
};
const MENU_LABEL_STYLE = {
  padding: "0 0 6px",
  fontSize: "11px",
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "0.1em"
};
const SECTION_ITEM_STYLE = { ...NAV_ITEM_STYLE };
const SETTING_BUTTON_STYLE = {
  border: "none",
  borderRadius: "999px",
  cursor: "pointer",
  fontFamily: "inherit",
  fontSize: "12px",
  padding: "5px 8px"
};
const SYSTEM_SANS_FONT = 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
const ARABIC_FONTS = [
  { label: "System sans", value: SYSTEM_SANS_FONT },
  { label: "Noto Naskh Arabic", value: '"Noto Naskh Arabic", serif' },
  { label: "Noto Sans Arabic", value: '"Noto Sans Arabic", sans-serif' },
  { label: "Scheherazade New", value: '"Scheherazade New", serif' },
  { label: "Lateef", value: '"Lateef", serif' },
  { label: "Amiri", value: '"Amiri", serif' },
  { label: "System serif", value: "serif" }
];
const ARABIC_WEIGHTS = [
  { label: "Light", value: "300" },
  { label: "Regular", value: "400" },
  { label: "Medium", value: "500" },
  { label: "Semibold", value: "600" }
];

export default function App() {
  const [view, setView] = useState("reader");
  const [selectedSectionIndex, setSelectedSectionIndex] = useState(null);
  const [selectedLessonId, setSelectedLessonId] = useState(lessons[0]?.id ?? null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [arabicMode, setArabicMode] = useState("voweled");
  const [readerLayout, setReaderLayout] = useState("line");
  const [arabicFontFamily, setArabicFontFamily] = useState(SYSTEM_SANS_FONT);
  const [arabicFontWeight, setArabicFontWeight] = useState("300");
  const [speechRate, setSpeechRate] = useState(0.8);

  function goToLiturgySection(sectionIndex) {
    setSelectedSectionIndex(sectionIndex);
    setView("reader");
    setMenuOpen(false);
  }

  function goToTableOfContents() {
    setSelectedSectionIndex(null);
    setView("reader");
    setMenuOpen(false);
  }

  function goToLesson(lessonId) {
    setSelectedLessonId(lessonId);
    setView("lessons");
    setMenuOpen(false);
  }

  function goToPreviousSection() {
    setSelectedSectionIndex(index => (index === null ? null : Math.max(0, index - 1)));
    setView("reader");
  }

  function goToNextSection() {
    setSelectedSectionIndex(index => (index === null ? 0 : Math.min(liturgyText.length - 1, index + 1)));
    setView("reader");
  }

  function adjustSpeechRate(delta) {
    setSpeechRate(rate => Math.max(0.5, Math.min(1.2, Math.round((rate + delta) * 100) / 100)));
  }

  const selectedLesson = lessons.find(l => l.id === selectedLessonId);
  const hasPreviousSection = selectedSectionIndex !== null && selectedSectionIndex > 0;
  const hasNextSection = selectedSectionIndex === null || selectedSectionIndex < liturgyText.length - 1;
  const previousSectionTitle = hasPreviousSection ? liturgyText[selectedSectionIndex - 1]?.section : null;
  const nextSectionTitle = hasNextSection
    ? liturgyText[selectedSectionIndex === null ? 0 : selectedSectionIndex + 1]?.section
    : null;
  const speechRateDisplay = `${Number(speechRate.toFixed(2))}×`;

  return (
    <div
      className="min-h-screen bg-white dark:bg-stone-900 font-sans text-stone-900 dark:text-stone-100"
      dir="ltr"
      style={{ display: "flex", flexDirection: "row", alignItems: "stretch" }}
    >
      <aside
        className="border-r border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900"
        dir="ltr"
        style={{ display: "flex", alignItems: "flex-start", gap: "8px", minHeight: "100vh", padding: "6px 10px" }}
      >
        <button
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Open menu"
          aria-expanded={menuOpen}
          style={{ fontSize: "20px", lineHeight: 1, background: "none", border: "none", cursor: "pointer", padding: "4px 8px", color: "inherit" }}
        >
          ☰
        </button>

        {menuOpen && (
          <div
            role="menu"
            className="bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100"
            style={{ display: "flex", flex: "0 0 280px", flexDirection: "column", gap: "8px", alignItems: "stretch", maxHeight: "calc(100vh - 12px)", overflowY: "auto", margin: 0, padding: "8px", listStyle: "none", borderRadius: "4px", fontFamily: "Arial, sans-serif", fontSize: "14px" }}
          >
              <div role="group" aria-label="Liturgy Text" style={MENU_GROUP_STYLE}>
                <div className="text-stone-400 dark:text-stone-500" style={MENU_LABEL_STYLE}>
                  Liturgy Text
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <button
                  role="menuitem"
                  type="button"
                  onClick={goToTableOfContents}
                  className={view === "reader" && selectedSectionIndex === null ? "bg-stone-100 dark:bg-stone-700 font-semibold" : "bg-transparent hover:bg-stone-50 dark:hover:bg-stone-700"}
                  style={SECTION_ITEM_STYLE}
                >
                  Table of Contents
                </button>
                {liturgyText.map((section, sectionIndex) => (
                  <button
                    key={section.section || sectionIndex}
                    role="menuitem"
                    type="button"
                    onClick={() => goToLiturgySection(sectionIndex)}
                    className={view === "reader" && selectedSectionIndex === sectionIndex ? "bg-stone-100 dark:bg-stone-700 font-semibold" : "bg-transparent hover:bg-stone-50 dark:hover:bg-stone-700"}
                    style={SECTION_ITEM_STYLE}
                  >
                    {section.section || `Section ${sectionIndex + 1}`}
                  </button>
                ))}
                </div>
              </div>

              <div role="separator" aria-hidden="true" className="border-t border-stone-200 dark:border-stone-600" />

              <div role="group" aria-label="Course" style={MENU_GROUP_STYLE}>
                <div className="text-stone-400 dark:text-stone-500" style={MENU_LABEL_STYLE}>
                  Course
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                {units.map(unit => {
                  const unitLessons = lessons.filter(l => l.unit_id === unit.id);
                  return (
                    <div key={unit.id}>
                    <div
                      className="text-stone-400 dark:text-stone-500"
                      style={{ padding: "6px 16px 2px", fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em" }}
                    >
                      Unit {unit.display_order}: {unit.title}
                    </div>
                      {unitLessons.map(lesson => (
                        <button
                          key={lesson.id}
                          role="menuitem"
                          onClick={() => goToLesson(lesson.id)}
                          className={view === "lessons" && selectedLessonId === lesson.id ? "bg-stone-100 dark:bg-stone-700 font-semibold" : "bg-transparent hover:bg-stone-50 dark:hover:bg-stone-700"}
                          style={LESSON_ITEM_STYLE}
                        >
                          {lesson.title}
                        </button>
                      ))}
                    </div>
                  );
                })}
                </div>
              </div>

              <div role="separator" aria-hidden="true" className="border-t border-stone-200 dark:border-stone-600" />

              <div role="group" aria-label="Display" style={{ ...MENU_GROUP_STYLE, minWidth: "260px" }}>
                <div className="text-stone-400 dark:text-stone-500" style={{ ...MENU_LABEL_STYLE, padding: "0 0 6px" }}>
                  Display
                </div>
                <div className="mb-2">
                  <label className="mb-1 block text-xs text-stone-500 dark:text-stone-400" htmlFor="arabic-font-select">
                    Arabic font
                  </label>
                  <select
                    id="arabic-font-select"
                    value={arabicFontFamily}
                    onChange={(event) => setArabicFontFamily(event.target.value)}
                    className="w-full rounded border border-stone-300 bg-white px-2 py-1 text-sm dark:border-stone-600 dark:bg-stone-700"
                  >
                    {ARABIC_FONTS.map(font => (
                      <option key={font.value} value={font.value}>
                        {font.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-2">
                  <label className="mb-1 block text-xs text-stone-500 dark:text-stone-400" htmlFor="arabic-weight-select">
                    Arabic weight
                  </label>
                  <select
                    id="arabic-weight-select"
                    value={arabicFontWeight}
                    onChange={(event) => setArabicFontWeight(event.target.value)}
                    className="w-full rounded border border-stone-300 bg-white px-2 py-1 text-sm dark:border-stone-600 dark:bg-stone-700"
                  >
                    {ARABIC_WEIGHTS.map(weight => (
                      <option key={weight.value} value={weight.value}>
                        {weight.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-2">
                  <div className="mb-1 text-xs text-stone-500 dark:text-stone-400">Vowels</div>
                  <div style={{ display: "flex", gap: "6px" }}>
                    <button
                      type="button"
                      onClick={() => setArabicMode("voweled")}
                      className={arabicMode === "voweled" ? "bg-stone-200 dark:bg-stone-600 font-semibold" : "bg-stone-100 dark:bg-stone-700"}
                      style={SETTING_BUTTON_STYLE}
                    >
                      Vocalized
                    </button>
                    <button
                      type="button"
                      onClick={() => setArabicMode("plain")}
                      className={arabicMode === "plain" ? "bg-stone-200 dark:bg-stone-600 font-semibold" : "bg-stone-100 dark:bg-stone-700"}
                      style={SETTING_BUTTON_STYLE}
                    >
                      Unvocalized
                    </button>
                  </div>
                </div>
                <div>
                  <div className="mb-1 text-xs text-stone-500 dark:text-stone-400">Layout</div>
                  <div style={{ display: "flex", gap: "6px" }}>
                    <button
                      type="button"
                      onClick={() => setReaderLayout("line")}
                      className={readerLayout === "line" ? "bg-stone-200 dark:bg-stone-600 font-semibold" : "bg-stone-100 dark:bg-stone-700"}
                      style={SETTING_BUTTON_STYLE}
                    >
                      Line
                    </button>
                    <button
                      type="button"
                      onClick={() => setReaderLayout("paragraph")}
                      className={readerLayout === "paragraph" ? "bg-stone-200 dark:bg-stone-600 font-semibold" : "bg-stone-100 dark:bg-stone-700"}
                      style={SETTING_BUTTON_STYLE}
                    >
                      Paragraph
                    </button>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="mb-1 text-xs text-stone-500 dark:text-stone-400">Reader speed</div>
                  <div className="lp-speed-row">
                    <button
                      type="button"
                      className="lp-speed-adjust"
                      onClick={() => adjustSpeechRate(-0.05)}
                    >
                      −
                    </button>
                    <div className="lp-speed-value">{speechRateDisplay}</div>
                    <button
                      type="button"
                      className="lp-speed-adjust"
                      onClick={() => adjustSpeechRate(0.05)}
                    >
                      +
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => speakArabic("بِسَلامٍ", speechRate)}
                    className="mt-2 bg-stone-100 dark:bg-stone-700"
                    style={SETTING_BUTTON_STYLE}
                  >
                    Preview
                  </button>
                </div>
              </div>
          </div>
        )}
      </aside>

      <div style={{ flex: "1 1 auto", minWidth: 0 }}>
        {view === "reader" && (
          <ArabicLiturgyReader
            arabicMode={arabicMode}
            readerLayout={readerLayout}
            selectedSectionIndex={selectedSectionIndex}
            speechRate={speechRate}
            arabicFontFamily={arabicFontFamily}
            arabicFontWeight={arabicFontWeight}
            hasPreviousSection={hasPreviousSection}
            hasNextSection={hasNextSection}
            previousSectionTitle={previousSectionTitle}
            nextSectionTitle={nextSectionTitle}
            onPreviousSection={goToPreviousSection}
            onNextSection={goToNextSection}
            onTableOfContents={goToTableOfContents}
            onSelectSection={goToLiturgySection}
          />
        )}
        {view === "lessons" && selectedLesson && (
          <LessonsView
            lesson={selectedLesson}
            arabicMode={arabicMode}
            readerLayout={readerLayout}
            speechRate={speechRate}
            arabicFontFamily={arabicFontFamily}
            arabicFontWeight={arabicFontWeight}
          />
        )}
      </div>
    </div>
  );
}
