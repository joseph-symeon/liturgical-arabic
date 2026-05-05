import React, { useEffect, useState } from "react";
import ArabicLiturgyReader from "./ArabicLiturgyReader.jsx";
import CourseOverview from "./components/course/CourseOverview.jsx";
import LessonOverview from "./components/course/LessonOverview.jsx";
import LessonPage from "./components/course/LessonPage.jsx";
import liturgySections from "./data/liturgySections.js";
import units from "./data/units.js";
import lessons from "./data/lessons.js";
import { getExerciseTitle } from "./components/course/exerciseTitles.js";
import { speakArabic } from "./utils/arabic.js";
import chrysostomIcon from "./assets/chrysostom-icon.png";

const NAV_ITEM_STYLE = {
  display: "block",
  width: "100%",
  textAlign: "left",
  padding: "9px 10px",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "14px",
  lineHeight: 1.3,
  fontFamily: "inherit",
  color: "inherit"
};

const LESSON_ITEM_STYLE = { ...NAV_ITEM_STYLE };
const MENU_GROUP_STYLE = {
  minWidth: "160px",
  padding: "10px 8px"
};
const MENU_LABEL_STYLE = {
  padding: "0 2px 8px",
  fontSize: "12px",
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "0.08em"
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

const ORDERED_UNITS = [...units].sort((a, b) => a.display_order - b.display_order);
const COURSE_LESSONS = ORDERED_UNITS.flatMap(unit =>
  lessons
    .filter(lesson => lesson.unit_id === unit.id)
    .sort((a, b) => a.display_order - b.display_order)
);
const DEFAULT_LESSON_ID = COURSE_LESSONS[0]?.id ?? lessons[0]?.id ?? null;

function parseNavigationHash() {
  if (typeof window === "undefined") {
    return { view: "home", selectedSectionIndex: null, selectedLessonId: DEFAULT_LESSON_ID, selectedExerciseIndex: 0 };
  }

  const hash = decodeURIComponent(window.location.hash.replace(/^#/, ""));
  if (hash === "course") {
    return { view: "course-overview", selectedSectionIndex: null, selectedLessonId: DEFAULT_LESSON_ID, selectedExerciseIndex: 0 };
  }
  if (hash === "reader/toc") {
    return { view: "reader", selectedSectionIndex: null, selectedLessonId: DEFAULT_LESSON_ID, selectedExerciseIndex: 0 };
  }
  if (hash.startsWith("reader/section/")) {
    const sectionIndex = Number(hash.replace("reader/section/", ""));
    if (Number.isInteger(sectionIndex) && sectionIndex >= 0 && sectionIndex < liturgySections.length) {
      return { view: "reader", selectedSectionIndex: sectionIndex, selectedLessonId: DEFAULT_LESSON_ID, selectedExerciseIndex: 0 };
    }
  }
  if (hash.startsWith("course/")) {
    const parts = hash.split("/");
    const lessonId = parts[1] || DEFAULT_LESSON_ID;
    if (parts[2] !== "exercise") {
      return { view: "lesson-overview", selectedSectionIndex: null, selectedLessonId: lessonId, selectedExerciseIndex: 0 };
    }
    const exerciseNumber = parts[2] === "exercise" ? Number(parts[3]) : 1;
    const selectedExerciseIndex = Number.isInteger(exerciseNumber) && exerciseNumber > 0 ? exerciseNumber - 1 : 0;
    return { view: "lessons", selectedSectionIndex: null, selectedLessonId: lessonId, selectedExerciseIndex };
  }
  return { view: "home", selectedSectionIndex: null, selectedLessonId: DEFAULT_LESSON_ID, selectedExerciseIndex: 0 };
}

function getNavigationHash(view, selectedSectionIndex, selectedLessonId, selectedExerciseIndex) {
  if (view === "reader") {
    return selectedSectionIndex === null ? "#reader/toc" : `#reader/section/${selectedSectionIndex}`;
  }
  if (view === "lessons") {
    return `#course/${encodeURIComponent(selectedLessonId ?? "")}/exercise/${selectedExerciseIndex + 1}`;
  }
  if (view === "lesson-overview") {
    return `#course/${encodeURIComponent(selectedLessonId ?? "")}`;
  }
  if (view === "course-overview") {
    return "#course";
  }
  return "#home";
}

export default function App() {
  const [initialNavigation] = useState(() => parseNavigationHash());
  const [view, setView] = useState(initialNavigation.view);
  const [selectedSectionIndex, setSelectedSectionIndex] = useState(initialNavigation.selectedSectionIndex);
  const [selectedLessonId, setSelectedLessonId] = useState(initialNavigation.selectedLessonId);
  const [selectedExerciseIndex, setSelectedExerciseIndex] = useState(initialNavigation.selectedExerciseIndex);
  const [menuOpen, setMenuOpen] = useState(false);
  const [displayMenuOpen, setDisplayMenuOpen] = useState(false);
  const [arabicMode, setArabicMode] = useState("vocalized");
  const [readerLayout, setReaderLayout] = useState("line");
  const [showQuietPrayers, setShowQuietPrayers] = useState(true);
  const [arabicFontFamily, setArabicFontFamily] = useState(SYSTEM_SANS_FONT);
  const [arabicFontWeight, setArabicFontWeight] = useState("300");
  const [speechRate, setSpeechRate] = useState(0.8);
  const [isNarrowViewport, setIsNarrowViewport] = useState(false);

  useEffect(() => {
    function updateViewport() {
      setIsNarrowViewport(window.innerWidth < 700);
    }
    updateViewport();
    window.addEventListener("resize", updateViewport);
    return () => window.removeEventListener("resize", updateViewport);
  }, []);

  useEffect(() => {
    function updateNavigationFromHash() {
      const nextNavigation = parseNavigationHash();
      setView(nextNavigation.view);
      setSelectedSectionIndex(nextNavigation.selectedSectionIndex);
      setSelectedLessonId(nextNavigation.selectedLessonId);
      setSelectedExerciseIndex(nextNavigation.selectedExerciseIndex);
      setMenuOpen(false);
      setDisplayMenuOpen(false);
    }

    window.addEventListener("hashchange", updateNavigationFromHash);
    return () => window.removeEventListener("hashchange", updateNavigationFromHash);
  }, []);

  useEffect(() => {
    const nextHash = getNavigationHash(view, selectedSectionIndex, selectedLessonId, selectedExerciseIndex);
    if (window.location.hash !== nextHash) {
      window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}${nextHash}`);
    }
  }, [view, selectedSectionIndex, selectedLessonId, selectedExerciseIndex]);

  function goHome() {
    setView("home");
    setMenuOpen(false);
    setDisplayMenuOpen(false);
  }

  function goToLiturgySection(sectionIndex) {
    setSelectedSectionIndex(sectionIndex);
    setView("reader");
    setMenuOpen(false);
    setDisplayMenuOpen(false);
  }

  function goToTableOfContents() {
    setSelectedSectionIndex(null);
    setView("reader");
    setMenuOpen(false);
    setDisplayMenuOpen(false);
  }

  function goToCourseOverview() {
    setView("course-overview");
    setMenuOpen(false);
    setDisplayMenuOpen(false);
  }

  function goToLessonOverview(lessonId) {
    setSelectedLessonId(lessonId);
    setSelectedExerciseIndex(0);
    setView("lesson-overview");
    setMenuOpen(false);
    setDisplayMenuOpen(false);
  }

  function goToLesson(lessonId, exerciseIndex = 0) {
    setSelectedLessonId(lessonId);
    setSelectedExerciseIndex(exerciseIndex);
    setView("lessons");
    setMenuOpen(false);
    setDisplayMenuOpen(false);
  }

  function goToPreviousSection() {
    setSelectedSectionIndex(index => (index === null ? null : Math.max(0, index - 1)));
    setView("reader");
  }

  function goToNextSection() {
    setSelectedSectionIndex(index => (index === null ? 0 : Math.min(liturgySections.length - 1, index + 1)));
    setView("reader");
  }

  function goToPreviousLesson() {
    const selectedLessonIndex = COURSE_LESSONS.findIndex(lesson => lesson.id === selectedLessonId);
    const previousLesson = COURSE_LESSONS[Math.max(0, selectedLessonIndex - 1)];
    if (previousLesson) {
      goToLesson(previousLesson.id, Math.max(0, (previousLesson.exercises?.length ?? 1) - 1));
    }
  }

  function goToNextLesson() {
    const selectedLessonIndex = COURSE_LESSONS.findIndex(lesson => lesson.id === selectedLessonId);
    const nextLesson = COURSE_LESSONS[Math.min(COURSE_LESSONS.length - 1, selectedLessonIndex + 1)];
    if (nextLesson) {
      goToLesson(nextLesson.id, 0);
    }
  }

  function goToPreviousExercise() {
    if (selectedExerciseIndex > 0) {
      goToLesson(selectedLessonId, selectedExerciseIndex - 1);
      return;
    }
    goToPreviousLesson();
  }

  function goToNextExercise() {
    const exerciseCount = selectedLesson?.exercises?.length ?? 0;
    if (selectedExerciseIndex < exerciseCount - 1) {
      goToLesson(selectedLessonId, selectedExerciseIndex + 1);
      return;
    }
    goToNextLesson();
  }

  function adjustSpeechRate(delta) {
    setSpeechRate(rate => Math.max(0.5, Math.min(1.2, Math.round((rate + delta) * 100) / 100)));
  }

  const selectedLesson = lessons.find(l => l.id === selectedLessonId);
  const selectedLessonIndex = COURSE_LESSONS.findIndex(lesson => lesson.id === selectedLessonId);
  const clampedExerciseIndex = Math.max(0, Math.min(selectedExerciseIndex, (selectedLesson?.exercises?.length ?? 1) - 1));
  const hasPreviousExercise = selectedLessonIndex > 0 || clampedExerciseIndex > 0;
  const hasNextExercise =
    selectedLessonIndex >= 0 &&
    (selectedLessonIndex < COURSE_LESSONS.length - 1 || clampedExerciseIndex < (selectedLesson?.exercises?.length ?? 1) - 1);
  const previousExerciseTitle =
    clampedExerciseIndex > 0
      ? getExerciseTitle(selectedLesson, clampedExerciseIndex - 1)
      : getExerciseTitle(COURSE_LESSONS[selectedLessonIndex - 1], Math.max(0, (COURSE_LESSONS[selectedLessonIndex - 1]?.exercises?.length ?? 1) - 1));
  const nextExerciseTitle =
    clampedExerciseIndex < (selectedLesson?.exercises?.length ?? 1) - 1
      ? getExerciseTitle(selectedLesson, clampedExerciseIndex + 1)
      : getExerciseTitle(COURSE_LESSONS[selectedLessonIndex + 1], 0);

  useEffect(() => {
    if (view === "lessons" && selectedExerciseIndex !== clampedExerciseIndex) {
      setSelectedExerciseIndex(clampedExerciseIndex);
    }
  }, [view, selectedExerciseIndex, clampedExerciseIndex]);

  const hasPreviousSection = selectedSectionIndex !== null && selectedSectionIndex > 0;
  const hasNextSection = selectedSectionIndex === null || selectedSectionIndex < liturgySections.length - 1;
  const previousSectionTitle = hasPreviousSection ? liturgySections[selectedSectionIndex - 1]?.section : null;
  const nextSectionTitle = hasNextSection
    ? liturgySections[selectedSectionIndex === null ? 0 : selectedSectionIndex + 1]?.section
    : null;
  const speechRateDisplay = `${Number(speechRate.toFixed(2))}×`;
  const hideContentForMenu = menuOpen && isNarrowViewport;
  const liturgyMenuItems = liturgySections.reduce((items, section, sectionIndex) => {
    if (!section.section_group) {
      items.push({ type: "section", section, sectionIndex });
      return items;
    }

    const last = items[items.length - 1];
    if (last && last.type === "group" && last.group === section.section_group) {
      last.sections.push({ section, sectionIndex });
    } else {
      items.push({
        type: "group",
        group: section.section_group,
        sections: [{ section, sectionIndex }]
      });
    }
    return items;
  }, []);

  function renderHome() {
    return (
      <main className="mx-auto max-w-[700px] px-4 py-10 leading-8">
        <header className="mb-8 text-center" dir="ltr">
          <img
            src={chrysostomIcon}
            alt="Saint John Chrysostom"
            className="mx-auto mb-6 h-auto max-h-[260px] w-auto max-w-[58vw] opacity-80 dark:invert"
          />
          <h1 className="mb-2 text-2xl font-medium leading-tight md:text-3xl">Liturgical Arabic</h1>
        </header>
        <div className="grid gap-3" dir="ltr">
          <button
            type="button"
            onClick={goToTableOfContents}
            className="rounded border border-stone-300 px-4 py-3 text-left dark:border-stone-600"
          >
            Liturgy Text
          </button>
          {COURSE_LESSONS.length > 0 && (
            <button
              type="button"
              onClick={goToCourseOverview}
              className="rounded border border-stone-300 px-4 py-3 text-left dark:border-stone-600"
            >
              Course
            </button>
          )}
        </div>
      </main>
    );
  }

  function renderDisplayMenu() {
    return (
      <div
        role="menu"
        aria-label="Display settings"
        className="fixed right-3 top-12 z-30 w-[280px] rounded border border-stone-200 bg-white p-3 text-stone-900 shadow-lg dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100"
        dir="ltr"
        onClick={event => event.stopPropagation()}
      >
        <div className="text-stone-400 dark:text-stone-500" style={{ ...MENU_LABEL_STYLE, padding: "0 0 8px" }}>
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
              onClick={() => setArabicMode("vocalized")}
              className={arabicMode === "vocalized" ? "bg-stone-200 dark:bg-stone-600 font-semibold" : "bg-stone-100 dark:bg-stone-700"}
              style={SETTING_BUTTON_STYLE}
            >
              Vocalized
            </button>
            <button
              type="button"
              onClick={() => setArabicMode("unvocalized")}
              className={arabicMode === "unvocalized" ? "bg-stone-200 dark:bg-stone-600 font-semibold" : "bg-stone-100 dark:bg-stone-700"}
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
          <div className="mb-1 text-xs text-stone-500 dark:text-stone-400">Silent prayers</div>
          <div style={{ display: "flex", gap: "6px" }}>
            <button
              type="button"
              onClick={() => setShowQuietPrayers(true)}
              className={showQuietPrayers ? "bg-stone-200 dark:bg-stone-600 font-semibold" : "bg-stone-100 dark:bg-stone-700"}
              style={SETTING_BUTTON_STYLE}
            >
              Show
            </button>
            <button
              type="button"
              onClick={() => setShowQuietPrayers(false)}
              className={!showQuietPrayers ? "bg-stone-200 dark:bg-stone-600 font-semibold" : "bg-stone-100 dark:bg-stone-700"}
              style={SETTING_BUTTON_STYLE}
            >
              Hide
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
    );
  }

  return (
    <div
      className="min-h-screen bg-white dark:bg-stone-900 font-sans text-stone-900 dark:text-stone-100"
      dir="ltr"
      style={{ display: "flex", flexDirection: "row", alignItems: "stretch" }}
    >
      <button
        onClick={() => {
          setMenuOpen(o => !o);
          setDisplayMenuOpen(false);
        }}
        aria-label="Open menu"
        aria-expanded={menuOpen}
        style={{
          position: menuOpen ? "static" : "fixed",
          top: "6px",
          left: "10px",
          zIndex: 30,
          alignSelf: "flex-start",
          fontSize: "20px",
          lineHeight: 1,
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: "4px 8px",
          color: "inherit"
        }}
      >
        ☰
      </button>

      <button
        onClick={() => {
          setDisplayMenuOpen(o => !o);
          setMenuOpen(false);
        }}
        aria-label="Display settings"
        aria-expanded={displayMenuOpen}
        title="Display settings"
        className="rounded bg-white/80 text-stone-900 hover:bg-stone-100 dark:bg-stone-900/80 dark:text-stone-100 dark:hover:bg-stone-800"
        style={{
          position: "fixed",
          top: "8px",
          right: "12px",
          zIndex: 30,
          border: "none",
          cursor: "pointer",
          padding: "6px",
          color: "inherit"
        }}
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <line x1="4" y1="6" x2="20" y2="6" />
          <circle cx="9" cy="6" r="2" fill="currentColor" stroke="none" />
          <line x1="4" y1="12" x2="20" y2="12" />
          <circle cx="15" cy="12" r="2" fill="currentColor" stroke="none" />
          <line x1="4" y1="18" x2="20" y2="18" />
          <circle cx="11" cy="18" r="2" fill="currentColor" stroke="none" />
        </svg>
      </button>

      {displayMenuOpen && renderDisplayMenu()}

      {menuOpen && (
      <aside
        className="bg-white dark:bg-stone-900"
        dir="ltr"
        style={{ display: "flex", alignItems: "flex-start", gap: "10px", minHeight: "100vh", padding: "10px 12px 10px 0" }}
      >
          <div
            role="menu"
            className="bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100"
            style={{ display: "flex", flex: "0 0 300px", flexDirection: "column", gap: "14px", alignItems: "stretch", maxHeight: "calc(100vh - 20px)", overflowY: "auto", margin: 0, padding: "14px", listStyle: "none", borderRadius: "8px", fontFamily: "Arial, sans-serif", fontSize: "14px", boxShadow: "0 8px 24px rgba(0,0,0,0.08)" }}
          >
              <div role="group" aria-label="Liturgy Text" style={MENU_GROUP_STYLE}>
                <button
                  role="menuitem"
                  type="button"
                  onClick={goHome}
                  className={view === "home" ? "bg-stone-100 dark:bg-stone-700 font-semibold" : "bg-transparent hover:bg-stone-50 dark:hover:bg-stone-700"}
                  style={SECTION_ITEM_STYLE}
                >
                  Home
                </button>
                <div className="mt-3 text-stone-400 dark:text-stone-500" style={MENU_LABEL_STYLE}>
                  Liturgy Text
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <button
                  role="menuitem"
                  type="button"
                  onClick={goToTableOfContents}
                  className={view === "reader" && selectedSectionIndex === null ? "bg-stone-100 dark:bg-stone-700 font-semibold" : "bg-transparent hover:bg-stone-50 dark:hover:bg-stone-700"}
                  style={SECTION_ITEM_STYLE}
                >
                  Table of Contents
                </button>
                {liturgyMenuItems.map(item => {
                  if (item.type === "section") {
                    return (
                      <button
                        key={item.section.section || item.sectionIndex}
                        role="menuitem"
                        type="button"
                        onClick={() => goToLiturgySection(item.sectionIndex)}
                        className={view === "reader" && selectedSectionIndex === item.sectionIndex ? "bg-stone-100 dark:bg-stone-700 font-semibold" : "bg-transparent hover:bg-stone-50 dark:hover:bg-stone-700"}
                        style={SECTION_ITEM_STYLE}
                      >
                        {item.section.section || `Section ${item.sectionIndex + 1}`}
                      </button>
                    );
                  }

                  const isCurrentGroup = item.sections.some(sectionItem => selectedSectionIndex === sectionItem.sectionIndex);
                  return (
                    <details className="lp-course-lesson" key={item.group} defaultOpen={isCurrentGroup || selectedSectionIndex === null}>
                      <summary className="lp-course-lesson-summary text-xs font-semibold uppercase tracking-wide text-stone-400 dark:text-stone-500">
                        {item.group}
                      </summary>
                      <div className="lp-course-exercise-list">
                        {item.sections.map(sectionItem => (
                          <button
                            key={sectionItem.section.section || sectionItem.sectionIndex}
                            role="menuitem"
                            type="button"
                            onClick={() => goToLiturgySection(sectionItem.sectionIndex)}
                            className={view === "reader" && selectedSectionIndex === sectionItem.sectionIndex ? "bg-stone-100 dark:bg-stone-700 font-semibold" : "bg-transparent hover:bg-stone-50 dark:hover:bg-stone-700"}
                            style={SECTION_ITEM_STYLE}
                          >
                            {sectionItem.section.section || `Section ${sectionItem.sectionIndex + 1}`}
                          </button>
                        ))}
                      </div>
                    </details>
                  );
                })}
                </div>
              </div>

              <div role="separator" aria-hidden="true" className="border-t border-stone-200 dark:border-stone-600" />

              <div role="group" aria-label="Course" style={MENU_GROUP_STYLE}>
                <div className="text-stone-400 dark:text-stone-500" style={MENU_LABEL_STYLE}>
                  Course
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <button
                  role="menuitem"
                  type="button"
                  onClick={goToCourseOverview}
                  className={view === "course-overview" ? "bg-stone-100 dark:bg-stone-700 font-semibold" : "bg-transparent hover:bg-stone-50 dark:hover:bg-stone-700"}
                  style={LESSON_ITEM_STYLE}
                >
                  Course Overview
                </button>
                {ORDERED_UNITS.map(unit => {
                  const unitLessons = COURSE_LESSONS.filter(l => l.unit_id === unit.id);
                  const isCurrentUnit = unitLessons.some(lesson => lesson.id === selectedLessonId);
                  return (
                    <details className="lp-course-unit" key={unit.id} defaultOpen={isCurrentUnit || view === "course-overview"}>
                      <summary className="lp-course-unit-summary">
                        <span>Unit {unit.display_order}</span>
                        <span>{unit.title}</span>
                      </summary>

                      <div className="lp-course-lesson-list">
                        {unitLessons.map(lesson => {
                          const isCurrentLesson = selectedLessonId === lesson.id;
                          return (
                            <details className="lp-course-lesson" key={lesson.id} defaultOpen={isCurrentLesson}>
                              <summary className={`lp-course-lesson-summary${isCurrentLesson ? " active" : ""}`}>
                                {lesson.title}
                              </summary>

                              <div className="lp-course-exercise-list">
                                <button
                                  role="menuitem"
                                  type="button"
                                  onClick={() => goToLessonOverview(lesson.id)}
                                  className={view === "lesson-overview" && isCurrentLesson ? "bg-stone-100 dark:bg-stone-700 font-semibold" : "bg-transparent hover:bg-stone-50 dark:hover:bg-stone-700"}
                                  style={LESSON_ITEM_STYLE}
                                >
                                  Lesson page
                                </button>
                                {(lesson.exercises || []).map((exercise, exerciseIndex) => (
                                  <button
                                    key={`${lesson.id}-${exercise.exercise_id}`}
                                    role="menuitem"
                                    type="button"
                                    onClick={() => goToLesson(lesson.id, exerciseIndex)}
                                    className={view === "lessons" && isCurrentLesson && clampedExerciseIndex === exerciseIndex ? "bg-stone-100 dark:bg-stone-700 font-semibold" : "bg-transparent hover:bg-stone-50 dark:hover:bg-stone-700"}
                                    style={LESSON_ITEM_STYLE}
                                  >
                                    {getExerciseTitle(lesson, exerciseIndex)}
                                  </button>
                                ))}
                              </div>
                            </details>
                          );
                        })}
                      </div>
                    </details>
                  );
                })}
                </div>
              </div>
          </div>
      </aside>
      )}

      <div
        onClickCapture={() => {
          if (menuOpen) setMenuOpen(false);
          if (displayMenuOpen) setDisplayMenuOpen(false);
        }}
        style={{ flex: "1 1 auto", minWidth: 0, display: hideContentForMenu ? "none" : "block" }}
      >
        {view === "home" && renderHome()}
        {view === "reader" && (
          <ArabicLiturgyReader
            arabicMode={arabicMode}
            readerLayout={readerLayout}
            showQuietPrayers={showQuietPrayers}
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
        {view === "course-overview" && (
          <CourseOverview
            units={ORDERED_UNITS}
            lessons={COURSE_LESSONS}
            selectedLessonId={selectedLessonId}
            selectedExerciseIndex={clampedExerciseIndex}
            onSelectLesson={goToLessonOverview}
            onSelectExercise={goToLesson}
          />
        )}
        {view === "lesson-overview" && selectedLesson && (
          <LessonOverview
            lesson={selectedLesson}
            arabicMode={arabicMode}
            speechRate={speechRate}
            arabicFontFamily={arabicFontFamily}
            onCourseOverview={goToCourseOverview}
            onSelectExercise={goToLesson}
          />
        )}
        {view === "lessons" && selectedLesson && (
          <LessonPage
            lesson={selectedLesson}
            arabicMode={arabicMode}
            readerLayout={readerLayout}
            speechRate={speechRate}
            arabicFontFamily={arabicFontFamily}
            arabicFontWeight={arabicFontWeight}
            selectedExerciseIndex={clampedExerciseIndex}
            hasPreviousExercise={hasPreviousExercise}
            hasNextExercise={hasNextExercise}
            previousExerciseTitle={previousExerciseTitle}
            nextExerciseTitle={nextExerciseTitle}
            onCourseOverview={goToCourseOverview}
            onPreviousExercise={goToPreviousExercise}
            onNextExercise={goToNextExercise}
          />
        )}
        {view === "lessons" && !selectedLesson && (
          <main className="mx-auto max-w-[700px] px-4 py-10 leading-8" dir="ltr">
            <h1 className="mb-2 text-2xl font-medium leading-tight md:text-3xl">Lesson not found</h1>
            <p className="text-stone-600 dark:text-stone-300">
              No lesson is configured for "{selectedLessonId}".
            </p>
          </main>
        )}
        {view === "lesson-overview" && !selectedLesson && (
          <main className="mx-auto max-w-[700px] px-4 py-10 leading-8" dir="ltr">
            <h1 className="mb-2 text-2xl font-medium leading-tight md:text-3xl">Lesson not found</h1>
            <p className="text-stone-600 dark:text-stone-300">
              No lesson is configured for "{selectedLessonId}".
            </p>
          </main>
        )}
      </div>
    </div>
  );
}
