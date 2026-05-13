import React, { useEffect, useRef, useState } from "react";
import ArabicLiturgyReader from "./ArabicLiturgyReader.jsx";
import CourseOverview from "./components/course/CourseOverview.jsx";
import LessonPage from "./components/course/LessonPage.jsx";
import InteractiveText from "./components/InteractiveText.jsx";
import PhraseTooltip from "./components/PhraseTooltip.jsx";
import { getServiceSectionAudio } from "./data/media/serviceSectionAudio.js";
import { defaultServiceText, defaultServiceTextId, getServiceText, readerServiceTexts } from "./data/texts/serviceTexts.js";
import phrases from "./data/texts/phrases.js";
import units from "./data/course/units.js";
import lessons from "./data/course/lessons.js";
import { getExerciseTitle } from "./components/course/exerciseTitles.js";
import { getServiceNavigation } from "./utils/serviceNavigation.js";
import { getArabicText } from "./utils/arabic.js";
import appIcons from "./assets/icons/index.js";
import "./App.css";

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
  { label: "Sans", value: SYSTEM_SANS_FONT },
  { label: "Serif", value: "serif" }
];
const ARABIC_MODES = ["vocalized", "light", "unvocalized"];
const ARABIC_MODE_OPTIONS = [
  { label: "Full", value: "vocalized" },
  { label: "Light", value: "light" },
  { label: "None", value: "unvocalized" }
];
const SIDE_PANEL_WIDTH = 320;
const DEFAULT_ARABIC_FONT_SIZE = 22;
const DEFAULT_SPEECH_RATE = 0.8;
const DEFAULT_DISPLAY_SETTINGS = {
  arabicMode: "light",
  readerLayout: "line",
  showQuietPrayers: false,
  arabicFontFamily: SYSTEM_SANS_FONT,
  arabicFontWeight: "300",
  arabicFontSize: DEFAULT_ARABIC_FONT_SIZE,
  showPracticeToolbar: true
};
const NARROW_VIEWPORT_WIDTH = 700;
const COMPACT_CHROME_WIDTH = 900;
const NAV_MENU_STORAGE_KEY = "liturgical-arabic:navigation-menu-open";
const NAV_DETAILS_STORAGE_KEY = "liturgical-arabic:navigation-details-open";
const DISPLAY_SETTINGS_STORAGE_KEY = "liturgical-arabic:display-settings";

const ORDERED_UNITS = [...units].sort((a, b) => a.display_order - b.display_order);
const COURSE_LESSONS = ORDERED_UNITS.flatMap(unit =>
  lessons
    .filter(lesson => lesson.unit_id === unit.id)
    .sort((a, b) => a.display_order - b.display_order)
);
const DEFAULT_LESSON_ID = COURSE_LESSONS[0]?.id ?? lessons[0]?.id ?? null;
const READER_SERVICE_TEXTS = readerServiceTexts.length > 0 ? readerServiceTexts : [defaultServiceText];
const DEFAULT_READER_SERVICE_TEXT_ID = defaultServiceTextId;
const HOME_TITLE_PHRASE_IDS = ["homepage-lisan-001", "homepage-al-quddas-001"];

function hasMultipleExercises(lesson) {
  return (lesson?.exercises?.length ?? 0) > 1;
}

function getReaderServiceText(serviceTextId) {
  return READER_SERVICE_TEXTS.find(serviceText => serviceText.id === serviceTextId)
    || getServiceText(serviceTextId)
    || defaultServiceText;
}

function parseNavigationHash() {
  if (typeof window === "undefined") {
    return {
      view: "home",
      selectedServiceTextId: DEFAULT_READER_SERVICE_TEXT_ID,
      selectedSectionIndex: null,
      selectedLessonId: DEFAULT_LESSON_ID,
      selectedExerciseIndex: 0
    };
  }

  const hash = decodeURIComponent(window.location.hash.replace(/^#/, ""));
  if (hash === "course") {
    return {
      view: "course-overview",
      selectedServiceTextId: DEFAULT_READER_SERVICE_TEXT_ID,
      selectedSectionIndex: null,
      selectedLessonId: DEFAULT_LESSON_ID,
      selectedExerciseIndex: 0
    };
  }
  if (hash === "reader/toc") {
    return {
      view: "reader",
      selectedServiceTextId: DEFAULT_READER_SERVICE_TEXT_ID,
      selectedSectionIndex: null,
      selectedLessonId: DEFAULT_LESSON_ID,
      selectedExerciseIndex: 0
    };
  }
  if (hash.startsWith("reader/section/")) {
    const sectionIndex = Number(hash.replace("reader/section/", ""));
    if (Number.isInteger(sectionIndex) && sectionIndex >= 0 && sectionIndex < defaultServiceText.sections.length) {
      return {
        view: "reader",
        selectedServiceTextId: DEFAULT_READER_SERVICE_TEXT_ID,
        selectedSectionIndex: sectionIndex,
        selectedLessonId: DEFAULT_LESSON_ID,
        selectedExerciseIndex: 0
      };
    }
  }
  if (hash.startsWith("reader/")) {
    const parts = hash.split("/");
    const serviceTextId = parts[1] || DEFAULT_READER_SERVICE_TEXT_ID;
    const serviceText = getReaderServiceText(serviceTextId);
    if (parts[2] === "toc") {
      return {
        view: "reader",
        selectedServiceTextId: serviceText.id,
        selectedSectionIndex: null,
        selectedLessonId: DEFAULT_LESSON_ID,
        selectedExerciseIndex: 0
      };
    }
    if (parts[2] === "section") {
      const sectionIndex = Number(parts[3]);
      if (Number.isInteger(sectionIndex) && sectionIndex >= 0 && sectionIndex < serviceText.sections.length) {
        return {
          view: "reader",
          selectedServiceTextId: serviceText.id,
          selectedSectionIndex: sectionIndex,
          selectedLessonId: DEFAULT_LESSON_ID,
          selectedExerciseIndex: 0
        };
      }
    }
  }
  if (hash.startsWith("course/")) {
    const parts = hash.split("/");
    const lessonId = parts[1] || DEFAULT_LESSON_ID;
    if (parts[2] !== "exercise") {
      return {
        view: "lessons",
        selectedServiceTextId: DEFAULT_READER_SERVICE_TEXT_ID,
        selectedSectionIndex: null,
        selectedLessonId: lessonId,
        selectedExerciseIndex: 0
      };
    }
    const exerciseNumber = parts[2] === "exercise" ? Number(parts[3]) : 1;
    const selectedExerciseIndex = Number.isInteger(exerciseNumber) && exerciseNumber > 0 ? exerciseNumber - 1 : 0;
    return {
      view: "lessons",
      selectedServiceTextId: DEFAULT_READER_SERVICE_TEXT_ID,
      selectedSectionIndex: null,
      selectedLessonId: lessonId,
      selectedExerciseIndex
    };
  }
  return {
    view: "home",
    selectedServiceTextId: DEFAULT_READER_SERVICE_TEXT_ID,
    selectedSectionIndex: null,
    selectedLessonId: DEFAULT_LESSON_ID,
    selectedExerciseIndex: 0
  };
}

function getNavigationHash(view, selectedServiceTextId, selectedSectionIndex, selectedLessonId, selectedExerciseIndex) {
  if (view === "reader") {
    const serviceTextId = selectedServiceTextId || DEFAULT_READER_SERVICE_TEXT_ID;
    if (serviceTextId === DEFAULT_READER_SERVICE_TEXT_ID) {
      return selectedSectionIndex === null ? "#reader/toc" : `#reader/section/${selectedSectionIndex}`;
    }
    const encodedServiceTextId = encodeURIComponent(serviceTextId);
    return selectedSectionIndex === null
      ? `#reader/${encodedServiceTextId}/toc`
      : `#reader/${encodedServiceTextId}/section/${selectedSectionIndex}`;
  }
  if (view === "lessons") {
    return `#course/${encodeURIComponent(selectedLessonId ?? "")}/exercise/${selectedExerciseIndex + 1}`;
  }
  if (view === "course-overview") {
    return "#course";
  }
  return "#home";
}

function getStoredNavDetailsOpen() {
  if (typeof window === "undefined") return {};

  try {
    const stored = window.localStorage.getItem(NAV_DETAILS_STORAGE_KEY);
    const parsed = stored ? JSON.parse(stored) : {};
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

function getStoredDisplaySettings() {
  if (typeof window === "undefined") return DEFAULT_DISPLAY_SETTINGS;

  try {
    const stored = window.localStorage.getItem(DISPLAY_SETTINGS_STORAGE_KEY);
    const parsed = stored ? JSON.parse(stored) : {};
    const settings = parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
    return {
      arabicMode: ARABIC_MODES.includes(settings.arabicMode) ? settings.arabicMode : DEFAULT_DISPLAY_SETTINGS.arabicMode,
      readerLayout: ["line", "paragraph"].includes(settings.readerLayout) ? settings.readerLayout : DEFAULT_DISPLAY_SETTINGS.readerLayout,
      showQuietPrayers: typeof settings.showQuietPrayers === "boolean" ? settings.showQuietPrayers : DEFAULT_DISPLAY_SETTINGS.showQuietPrayers,
      arabicFontFamily: ARABIC_FONTS.some(font => font.value === settings.arabicFontFamily) ? settings.arabicFontFamily : DEFAULT_DISPLAY_SETTINGS.arabicFontFamily,
      arabicFontWeight: DEFAULT_DISPLAY_SETTINGS.arabicFontWeight,
      arabicFontSize: typeof settings.arabicFontSize === "number" ? Math.max(18, Math.min(36, settings.arabicFontSize)) : DEFAULT_DISPLAY_SETTINGS.arabicFontSize,
      showPracticeToolbar: typeof settings.showPracticeToolbar === "boolean" ? settings.showPracticeToolbar : DEFAULT_DISPLAY_SETTINGS.showPracticeToolbar
    };
  } catch {
    return DEFAULT_DISPLAY_SETTINGS;
  }
}

export default function App() {
  const [initialNavigation] = useState(() => parseNavigationHash());
  const [initialDisplaySettings] = useState(() => getStoredDisplaySettings());
  const [view, setView] = useState(initialNavigation.view);
  const [selectedServiceTextId, setSelectedServiceTextId] = useState(initialNavigation.selectedServiceTextId);
  const [selectedSectionIndex, setSelectedSectionIndex] = useState(initialNavigation.selectedSectionIndex);
  const [selectedLessonId, setSelectedLessonId] = useState(initialNavigation.selectedLessonId);
  const [selectedExerciseIndex, setSelectedExerciseIndex] = useState(initialNavigation.selectedExerciseIndex);
  const [menuOpen, setMenuOpen] = useState(() => {
    if (typeof window === "undefined") return false;
    const viewportWidth = window.visualViewport?.width ?? window.innerWidth;
    if (viewportWidth < NARROW_VIEWPORT_WIDTH) return false;
    return window.localStorage.getItem(NAV_MENU_STORAGE_KEY) === "true";
  });
  const [displayMenuOpen, setDisplayMenuOpen] = useState(false);
  const [navDetailsOpen, setNavDetailsOpen] = useState(getStoredNavDetailsOpen);
  const [arabicMode, setArabicMode] = useState(initialDisplaySettings.arabicMode);
  const [readerLayout, setReaderLayout] = useState(initialDisplaySettings.readerLayout);
  const [showQuietPrayers, setShowQuietPrayers] = useState(initialDisplaySettings.showQuietPrayers);
  const [arabicFontFamily, setArabicFontFamily] = useState(initialDisplaySettings.arabicFontFamily);
  const arabicFontWeight = DEFAULT_DISPLAY_SETTINGS.arabicFontWeight;
  const [arabicFontSize, setArabicFontSize] = useState(initialDisplaySettings.arabicFontSize);
  const speechRate = DEFAULT_SPEECH_RATE;
  const [showPracticeToolbar, setShowPracticeToolbar] = useState(initialDisplaySettings.showPracticeToolbar);
  const [isNarrowViewport, setIsNarrowViewport] = useState(false);
  const [isCompactChrome, setIsCompactChrome] = useState(false);
  const [showCompactTitle, setShowCompactTitle] = useState(false);
  const previousNavigationKeyRef = useRef(null);
  const previousIsNarrowViewportRef = useRef(null);

  useEffect(() => {
    function updateViewport() {
      const viewportWidth = window.visualViewport?.width ?? window.innerWidth;
      const nextIsNarrowViewport = viewportWidth < NARROW_VIEWPORT_WIDTH;
      setIsNarrowViewport(nextIsNarrowViewport);
      if (nextIsNarrowViewport && previousIsNarrowViewportRef.current !== true) {
        setMenuOpen(false);
      }
      previousIsNarrowViewportRef.current = nextIsNarrowViewport;
      setIsCompactChrome(viewportWidth < COMPACT_CHROME_WIDTH);
    }
    updateViewport();
    window.addEventListener("resize", updateViewport);
    window.visualViewport?.addEventListener("resize", updateViewport);
    return () => {
      window.removeEventListener("resize", updateViewport);
      window.visualViewport?.removeEventListener("resize", updateViewport);
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || isNarrowViewport) return;
    window.localStorage.setItem(NAV_MENU_STORAGE_KEY, menuOpen ? "true" : "false");
  }, [menuOpen, isNarrowViewport]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(NAV_DETAILS_STORAGE_KEY, JSON.stringify(navDetailsOpen));
  }, [navDetailsOpen]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(DISPLAY_SETTINGS_STORAGE_KEY, JSON.stringify({
      arabicMode,
      readerLayout,
      showQuietPrayers,
      arabicFontFamily,
      arabicFontWeight,
      arabicFontSize,
      showPracticeToolbar
    }));
  }, [arabicMode, readerLayout, showQuietPrayers, arabicFontFamily, arabicFontSize, showPracticeToolbar]);

  useEffect(() => {
    if (!isCompactChrome) {
      setShowCompactTitle(false);
      return undefined;
    }

    function updateCompactTitle() {
      setShowCompactTitle(window.scrollY > 120);
    }

    updateCompactTitle();
    window.addEventListener("scroll", updateCompactTitle, { passive: true });
    return () => window.removeEventListener("scroll", updateCompactTitle);
  }, [isCompactChrome]);

  useEffect(() => {
    function updateNavigationFromHash() {
      const nextNavigation = parseNavigationHash();
      setView(nextNavigation.view);
      setSelectedServiceTextId(nextNavigation.selectedServiceTextId);
      setSelectedSectionIndex(nextNavigation.selectedSectionIndex);
      setSelectedLessonId(nextNavigation.selectedLessonId);
      setSelectedExerciseIndex(nextNavigation.selectedExerciseIndex);
      if (isNarrowViewport) setMenuOpen(false);
      setDisplayMenuOpen(false);
    }

    window.addEventListener("hashchange", updateNavigationFromHash);
    return () => window.removeEventListener("hashchange", updateNavigationFromHash);
  }, [isNarrowViewport]);

  useEffect(() => {
    const nextHash = getNavigationHash(view, selectedServiceTextId, selectedSectionIndex, selectedLessonId, selectedExerciseIndex);
    if (window.location.hash !== nextHash) {
      window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}${nextHash}`);
    }
  }, [view, selectedServiceTextId, selectedSectionIndex, selectedLessonId, selectedExerciseIndex]);

  useEffect(() => {
    const navigationKey = `${view}:${selectedServiceTextId}:${selectedSectionIndex ?? "toc"}:${selectedLessonId ?? ""}:${selectedExerciseIndex}`;
    if (previousNavigationKeyRef.current === null) {
      previousNavigationKeyRef.current = navigationKey;
      return;
    }
    if (previousNavigationKeyRef.current === navigationKey) return;

    previousNavigationKeyRef.current = navigationKey;
    window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    });
  }, [view, selectedServiceTextId, selectedSectionIndex, selectedLessonId, selectedExerciseIndex]);

  function goHome() {
    setView("home");
    if (isNarrowViewport) setMenuOpen(false);
    setDisplayMenuOpen(false);
  }

  function goToLiturgySection(sectionIndex, serviceTextId = selectedServiceTextId) {
    setSelectedServiceTextId(serviceTextId);
    setSelectedSectionIndex(sectionIndex);
    setView("reader");
    if (isNarrowViewport) setMenuOpen(false);
    setDisplayMenuOpen(false);
  }

  function goToTableOfContents(serviceTextId = selectedServiceTextId) {
    setSelectedServiceTextId(serviceTextId);
    setSelectedSectionIndex(null);
    setView("reader");
    if (isNarrowViewport) setMenuOpen(false);
    setDisplayMenuOpen(false);
  }

  function goToCourseOverview() {
    setView("course-overview");
    if (isNarrowViewport) setMenuOpen(false);
    setDisplayMenuOpen(false);
  }

  function goToLesson(lessonId, exerciseIndex = 0) {
    setSelectedLessonId(lessonId);
    setSelectedExerciseIndex(exerciseIndex);
    setView("lessons");
    if (isNarrowViewport) setMenuOpen(false);
    setDisplayMenuOpen(false);
  }

  function goToPreviousSection() {
    setSelectedSectionIndex(index => (index === null ? null : Math.max(0, index - 1)));
    setView("reader");
  }

  function goToNextSection() {
    const sectionCount = getReaderServiceText(selectedServiceTextId).sections.length;
    setSelectedSectionIndex(index => (index === null ? 0 : Math.min(sectionCount - 1, index + 1)));
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

  function adjustArabicFontSize(delta) {
    setArabicFontSize(size => Math.max(18, Math.min(36, size + delta)));
  }

  function resetDisplaySettings() {
    setArabicMode(DEFAULT_DISPLAY_SETTINGS.arabicMode);
    setReaderLayout(DEFAULT_DISPLAY_SETTINGS.readerLayout);
    setShowQuietPrayers(DEFAULT_DISPLAY_SETTINGS.showQuietPrayers);
    setArabicFontFamily(DEFAULT_DISPLAY_SETTINGS.arabicFontFamily);
    setArabicFontSize(DEFAULT_DISPLAY_SETTINGS.arabicFontSize);
  }

  function isNavDetailOpen(id, defaultOpen = false) {
    return Object.hasOwn(navDetailsOpen, id) ? navDetailsOpen[id] : defaultOpen;
  }

  function setNavDetailOpen(id, open) {
    setNavDetailsOpen(detailsOpen => ({
      ...detailsOpen,
      [id]: open
    }));
  }

  const selectedLesson = lessons.find(l => l.id === selectedLessonId);
  const selectedLessonUnit = ORDERED_UNITS.find(unit => unit.id === selectedLesson?.unit_id);
  const selectedLessonWithUnit = selectedLesson
    ? { ...selectedLesson, unitTitle: selectedLessonUnit?.title }
    : null;
  const selectedLessonIndex = COURSE_LESSONS.findIndex(lesson => lesson.id === selectedLessonId);
  const clampedExerciseIndex = Math.max(0, Math.min(selectedExerciseIndex, (selectedLesson?.exercises?.length ?? 1) - 1));
  const hasPreviousExercise = selectedLessonIndex > 0 || clampedExerciseIndex > 0;
  const hasNextExercise =
    selectedLessonIndex >= 0 &&
    (selectedLessonIndex < COURSE_LESSONS.length - 1 || clampedExerciseIndex < (selectedLesson?.exercises?.length ?? 1) - 1);
  const previousLesson = COURSE_LESSONS[selectedLessonIndex - 1];
  const nextLesson = COURSE_LESSONS[selectedLessonIndex + 1];
  const previousExerciseTitle = hasPreviousExercise
    ? clampedExerciseIndex > 0
      ? getExerciseTitle(selectedLesson, clampedExerciseIndex - 1)
      : getExerciseTitle(previousLesson, Math.max(0, (previousLesson?.exercises?.length ?? 1) - 1))
    : null;
  const nextExerciseTitle = hasNextExercise
    ? clampedExerciseIndex < (selectedLesson?.exercises?.length ?? 1) - 1
      ? getExerciseTitle(selectedLesson, clampedExerciseIndex + 1)
      : getExerciseTitle(nextLesson, 0)
    : null;

  useEffect(() => {
    if (view === "lessons" && selectedExerciseIndex !== clampedExerciseIndex) {
      setSelectedExerciseIndex(clampedExerciseIndex);
    }
  }, [view, selectedExerciseIndex, clampedExerciseIndex]);

  const selectedServiceText = getReaderServiceText(selectedServiceTextId);
  const readerSections = selectedServiceText.sections || [];
  const readerServiceNavigation = getServiceNavigation(selectedServiceText);
  const readerServiceHomeTitle = readerServiceNavigation[0]?.title || selectedServiceText.short_title || selectedServiceText.title;
  const readerNavigationGroups = READER_SERVICE_TEXTS.map(serviceText => ({
    serviceText,
    navigation: getServiceNavigation(serviceText)
  }));
  const hasPreviousSection = selectedSectionIndex !== null && selectedSectionIndex > 0;
  const hasNextSection = selectedSectionIndex === null || selectedSectionIndex < readerSections.length - 1;
  const previousSectionTitle = hasPreviousSection ? readerSections[selectedSectionIndex - 1]?.section : null;
  const nextSectionTitle = hasNextSection
    ? readerSections[selectedSectionIndex === null ? 0 : selectedSectionIndex + 1]?.section
    : null;
  const selectedLiturgySection = selectedSectionIndex === null ? null : readerSections[selectedSectionIndex];
  const selectedLiturgySectionHasPracticeToolbar = Boolean(
    selectedLiturgySection && getServiceSectionAudio(selectedServiceText.id, selectedLiturgySection, selectedSectionIndex)
  );
  const compactPageTitle =
    view === "reader"
      ? (selectedLiturgySection?.section ?? readerServiceHomeTitle)
      : view === "course-overview"
        ? "Course Overview"
        : view === "lessons"
          ? selectedLesson?.title
          : view === "home"
            ? "Lisan al-Quddas"
            : "";
  const hideContentForMenu = (menuOpen || displayMenuOpen) && isNarrowViewport;
  const shouldShowCompactTitle =
    isCompactChrome &&
    showCompactTitle &&
    !menuOpen &&
    !displayMenuOpen &&
    Boolean(compactPageTitle);
  const pageHasPracticeToolbar =
    (view === "reader" && selectedLiturgySectionHasPracticeToolbar)
    || (view === "lessons" && Boolean(selectedLessonWithUnit));

  function renderHome() {
    const homeTitlePhrases = HOME_TITLE_PHRASE_IDS.map(phraseId => phrases[phraseId]).filter(Boolean);
    function getServiceHomeTitle(serviceText) {
      if (serviceText.id === DEFAULT_READER_SERVICE_TEXT_ID) return "The Divine Liturgy of St John Chrysostom";
      return serviceText.short_title || serviceText.title;
    }

    return (
      <main className="app-home-page" dir="ltr">
        <section className="app-home-hero" aria-labelledby="home-title">
          <div className="app-home-title-stack app-home-title-stack-arabic" dir="rtl">
            {homeTitlePhrases.map((phrase, phraseIndex) => (
              <InteractiveText
                key={HOME_TITLE_PHRASE_IDS[phraseIndex]}
                spokenText={phrase.arabic}
                speechRate={speechRate}
                tooltip={<PhraseTooltip phrase={phrase} />}
                className={phraseIndex === 0 ? "app-home-arabic-title" : "app-home-arabic-subtitle"}
              >
                {getArabicText(phrase, arabicMode)}
              </InteractiveText>
            ))}
          </div>
          <img
            src={appIcons.homeAltarIcon.src}
            alt={appIcons.homeAltarIcon.title}
            className="app-home-icon"
          />
          <div className="app-home-title-stack">
            <h1 id="home-title" className="app-home-title">Lisan</h1>
            <div className="app-home-subtitle">al-Quddas</div>
          </div>
        </section>

        <nav className="app-home-actions" aria-label="Home">
          <section className="app-home-action-section" aria-labelledby="home-read-title">
            <h2 id="home-read-title" className="app-home-section-title">Read</h2>
            <div className="app-home-action-grid">
              {READER_SERVICE_TEXTS.map(serviceText => (
                <button
                  key={serviceText.id}
                  type="button"
                  onClick={() => goToTableOfContents(serviceText.id)}
                  className="app-home-action"
                >
                  <span className="app-home-action-title">{getServiceHomeTitle(serviceText)}</span>
                </button>
              ))}
            </div>
          </section>
          {COURSE_LESSONS.length > 0 && (
            <section className="app-home-action-section" aria-labelledby="home-learn-title">
              <h2 id="home-learn-title" className="app-home-section-title">Learn</h2>
              <button
                type="button"
                onClick={goToCourseOverview}
                className="app-home-action app-home-action-course"
              >
                <span className="app-home-action-title">Liturgical Arabic</span>
              </button>
            </section>
          )}
        </nav>
      </main>
    );
  }

  function renderDisplayMenu() {
    function renderDisplaySection(title, children) {
      return (
        <section className="border-t border-stone-200 py-4 first:border-t-0 first:pt-0 dark:border-[var(--dark-border)]">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-stone-400 dark:text-[var(--dark-muted)]">
            {title}
          </h2>
          <div className="grid gap-3">
            {children}
          </div>
        </section>
      );
    }

    function renderField(label, children) {
      return (
        <div className="lp-display-field">
          <div className="lp-display-field-label text-xs text-stone-500 dark:text-[var(--dark-muted)]">{label}</div>
          <div className="lp-display-field-control">{children}</div>
        </div>
      );
    }

    function renderButtonRow(children, className = "") {
      return <div className={["flex flex-wrap items-center gap-2", className].filter(Boolean).join(" ")}>{children}</div>;
    }

    function renderToggleField(label, checked, onChange) {
      return (
        <div className="flex items-center justify-between gap-4">
          <div className="text-xs text-stone-500 dark:text-[var(--dark-muted)]">{label}</div>
          <label className="lp-mode-toggle" dir="ltr">
            <span>{checked ? "On" : "Off"}</span>
            <input
              type="checkbox"
              checked={checked}
              onChange={event => onChange(event.target.checked)}
            />
            <span className="lp-mode-switch" aria-hidden="true" />
          </label>
        </div>
      );
    }

    return (
      <div
        role="group"
        aria-label="Display settings"
        className="text-stone-900 dark:text-[var(--dark-text)]"
        dir="ltr"
        onClick={event => event.stopPropagation()}
      >
        <div className="text-stone-400 dark:text-[var(--dark-muted)]" style={{ ...MENU_LABEL_STYLE, padding: "0 0 12px" }}>
          Display
        </div>
        {renderDisplaySection("Reading", (
          <>
            {renderField("Diacritics", (
              renderButtonRow(
                <>
                  {ARABIC_MODE_OPTIONS.map(option => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setArabicMode(option.value)}
                      className={arabicMode === option.value ? "lp-setting-option active font-semibold" : "lp-setting-option"}
                      style={SETTING_BUTTON_STYLE}
                    >
                      {option.label}
                    </button>
                  ))}
                </>
              )
            ))}
            {renderField("Layout", (
              renderButtonRow(
                <>
                  <button
                    type="button"
                    onClick={() => setReaderLayout("line")}
                    className={readerLayout === "line" ? "lp-setting-option active font-semibold" : "lp-setting-option"}
                    style={SETTING_BUTTON_STYLE}
                  >
                    Line
                  </button>
                  <button
                    type="button"
                    onClick={() => setReaderLayout("paragraph")}
                    className={readerLayout === "paragraph" ? "lp-setting-option active font-semibold" : "lp-setting-option"}
                    style={SETTING_BUTTON_STYLE}
                  >
                    Paragraph
                  </button>
                </>
              )
            ))}
          </>
        ))}
        {renderDisplaySection("Arabic Text", (
          <>
            {renderField("Font", (
              renderButtonRow(
                <>
                  {ARABIC_FONTS.map(font => (
                    <button
                      key={font.value}
                      type="button"
                      role="radio"
                      aria-checked={arabicFontFamily === font.value}
                      onClick={() => setArabicFontFamily(font.value)}
                      className={arabicFontFamily === font.value ? "lp-setting-option active font-semibold" : "lp-setting-option"}
                      style={SETTING_BUTTON_STYLE}
                    >
                      {font.label}
                    </button>
                  ))}
                </>
              )
            ))}
            {renderField("Size", (
              renderButtonRow(
                <div className="lp-setting-control-box">
                  <button type="button" className="lp-speed-adjust" onClick={() => adjustArabicFontSize(-1)}>−</button>
                  <div className="lp-speed-value">{arabicFontSize}px</div>
                  <button type="button" className="lp-speed-adjust" onClick={() => adjustArabicFontSize(1)}>+</button>
                </div>
              )
            ))}
          </>
        ))}
        {renderDisplaySection("Content", (
          renderToggleField("Silent prayers", showQuietPrayers, setShowQuietPrayers)
        ))}
        <section className="flex justify-start border-t border-stone-200 py-4 dark:border-[var(--dark-border)]">
          <button
            type="button"
            onClick={resetDisplaySettings}
            className="lp-setting-option lp-reset-display-button"
            style={SETTING_BUTTON_STYLE}
          >
            Reset all
          </button>
        </section>
      </div>
    );
  }

  function renderPanelToggle({ side, isOpen, onClick, label, children }) {
    const isLeft = side === "left";
    return (
      <button
        onClick={onClick}
        aria-label={label}
        aria-expanded={isOpen}
        title={label}
        className="rounded bg-white/85 text-stone-900 hover:bg-stone-100 dark:bg-[var(--dark-bg)] dark:text-[var(--dark-text)] dark:hover:bg-[var(--dark-hover)]"
        style={{
          position: "fixed",
          top: isCompactChrome ? "calc(env(safe-area-inset-top, 0px) + 8px)" : "8px",
          [isLeft ? "left" : "right"]: "12px",
          zIndex: 40,
          border: "none",
          cursor: "pointer",
          padding: "6px",
          color: "inherit"
        }}
      >
        {children}
      </button>
    );
  }

  function renderFocusModeToggle() {
    const focusMode = !showPracticeToolbar;
    return (
      <button
        type="button"
        onClick={event => {
          setShowPracticeToolbar(value => !value);
          event.currentTarget.blur();
        }}
        aria-label={focusMode ? "Exit focus mode" : "Enter focus mode"}
        aria-pressed={focusMode}
        title={focusMode ? "Exit focus mode" : "Focus mode"}
        className="rounded bg-white/85 text-stone-900 hover:bg-stone-100 dark:bg-[var(--dark-bg)] dark:text-[var(--dark-text)] dark:hover:bg-[var(--dark-hover)]"
        style={{
          position: "fixed",
          top: isCompactChrome ? "calc(env(safe-area-inset-top, 0px) + 8px)" : "8px",
          right: "52px",
          zIndex: 40,
          border: "none",
          cursor: "pointer",
          padding: "6px",
          color: "inherit"
        }}
      >
        {focusMode ? (
          <svg aria-hidden="true" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 4v5H4" />
            <path d="M15 4v5h5" />
            <path d="M9 20v-5H4" />
            <path d="M15 20v-5h5" />
          </svg>
        ) : (
          <svg aria-hidden="true" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 9V4h5" />
            <path d="M20 9V4h-5" />
            <path d="M4 15v5h5" />
            <path d="M20 15v5h-5" />
          </svg>
        )}
      </button>
    );
  }

  function renderReaderNavigationItems(serviceText, serviceItem, isCurrentServiceText) {
    return serviceItem.items.map(item => {
      if (item.type === "section") {
        return (
          <button
            key={item.section.section || item.sectionIndex}
            role="menuitem"
            type="button"
            onClick={() => goToLiturgySection(item.sectionIndex, serviceText.id)}
            className={isCurrentServiceText && selectedSectionIndex === item.sectionIndex ? "bg-stone-100 dark:bg-[var(--dark-surface)] font-semibold" : "bg-transparent hover:bg-stone-50 dark:hover:bg-[var(--dark-hover)]"}
            style={SECTION_ITEM_STYLE}
          >
            {item.section.section || `Section ${item.sectionIndex + 1}`}
          </button>
        );
      }

      const isCurrentGroup = isCurrentServiceText && item.sections.some(sectionItem => selectedSectionIndex === sectionItem.sectionIndex);
      const detailId = `liturgy:${serviceText.id}:${serviceItem.title}:${item.group}`;
      return (
        <details
          className="lp-course-lesson"
          key={item.group}
          open={isNavDetailOpen(detailId, isCurrentGroup || isCurrentServiceText)}
          onToggle={event => setNavDetailOpen(detailId, event.currentTarget.open)}
        >
          <summary className="lp-course-lesson-summary">
            {item.group}
          </summary>
          <div className="lp-course-exercise-list">
            {item.sections.map(sectionItem => (
              <button
                key={sectionItem.section.section || sectionItem.sectionIndex}
                role="menuitem"
                type="button"
                onClick={() => goToLiturgySection(sectionItem.sectionIndex, serviceText.id)}
                className={isCurrentServiceText && selectedSectionIndex === sectionItem.sectionIndex ? "bg-stone-100 dark:bg-[var(--dark-surface)] font-semibold" : "bg-transparent hover:bg-stone-50 dark:hover:bg-[var(--dark-hover)]"}
                style={SECTION_ITEM_STYLE}
              >
                {sectionItem.section.section || `Section ${sectionItem.sectionIndex + 1}`}
              </button>
            ))}
          </div>
        </details>
      );
    });
  }

  return (
    <div
      className="min-h-screen bg-white dark:bg-[var(--dark-bg)] font-sans text-stone-900 dark:text-[var(--dark-text)]"
      dir="ltr"
      style={{ display: "flex", flexDirection: "row", alignItems: "stretch" }}
    >
      <div
        aria-hidden="true"
        className="bg-white dark:bg-[var(--dark-bg)]"
        style={{
          display: isCompactChrome ? "block" : "none",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: "calc(env(safe-area-inset-top, 0px) + 52px)",
          zIndex: 39,
          borderBottom: "1px solid transparent"
        }}
      />

      {isCompactChrome && compactPageTitle && (
        <div
          aria-hidden="true"
          className="text-stone-900 dark:text-[var(--dark-text)]"
          style={{
            position: "fixed",
            top: "calc(env(safe-area-inset-top, 0px) + 11px)",
            left: "58px",
            right: "58px",
            zIndex: 40,
            opacity: shouldShowCompactTitle ? 1 : 0,
            pointerEvents: "none",
            overflow: "hidden",
            textAlign: "center",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            fontSize: "14px",
            fontWeight: 600,
            lineHeight: "30px",
            transition: "opacity 120ms ease"
          }}
        >
          {compactPageTitle}
        </div>
      )}

      {!(isNarrowViewport && displayMenuOpen) && renderPanelToggle({
          side: "left",
          isOpen: menuOpen,
          label: "Navigation",
          onClick: () => {
            setMenuOpen(o => !o);
            if (isNarrowViewport) setDisplayMenuOpen(false);
          },
          children: (
            <svg aria-hidden="true" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="4" y1="7" x2="20" y2="7" />
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="17" x2="20" y2="17" />
            </svg>
          )
        })}

      {!(isNarrowViewport && menuOpen) && renderPanelToggle({
          side: "right",
          isOpen: displayMenuOpen,
          label: "Display settings",
          onClick: () => {
            setDisplayMenuOpen(o => !o);
            if (isNarrowViewport) setMenuOpen(false);
          },
          children: (
            <span
              aria-hidden="true"
              dir="rtl"
              style={{
                display: "inline-flex",
                alignItems: "baseline",
                gap: "1px",
                width: "22px",
                height: "22px",
                fontFamily: SYSTEM_SANS_FONT,
                fontSize: "18px",
                fontWeight: 400,
                lineHeight: "22px",
                justifyContent: "center"
              }}
            >
              <span>ع</span><span>A</span>
            </span>
          )
        })}

      {pageHasPracticeToolbar && !(isNarrowViewport && (menuOpen || displayMenuOpen)) && renderFocusModeToggle()}

      {isNarrowViewport && menuOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={() => setMenuOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 34,
            border: 0,
            background: "transparent",
            cursor: "default"
          }}
        />
      )}

      {isNarrowViewport && displayMenuOpen && (
        <button
          type="button"
          aria-label="Close display settings"
          onClick={() => setDisplayMenuOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 34,
            border: 0,
            background: "transparent",
            cursor: "default"
          }}
        />
      )}

      {menuOpen && (
      <aside
        className="lp-navigation-panel bg-white dark:bg-[var(--dark-bg)] border-r border-stone-200 dark:border-[var(--dark-border)]"
        dir="ltr"
        style={{
          position: isNarrowViewport ? "fixed" : "sticky",
          top: 0,
          left: 0,
          zIndex: 35,
          flex: `0 0 ${SIDE_PANEL_WIDTH}px`,
          width: SIDE_PANEL_WIDTH,
          maxWidth: "calc(100vw - 56px)",
          minHeight: "100vh",
          maxHeight: "100vh",
          overflowY: "auto",
          padding: "48px 12px 14px"
        }}
      >
          <div
            role="menu"
            className="text-stone-900 dark:text-[var(--dark-text)]"
            style={{ display: "flex", flexDirection: "column", gap: "14px", alignItems: "stretch", margin: 0, padding: 0, listStyle: "none", fontFamily: "Arial, sans-serif", fontSize: "14px" }}
          >
              <div role="group" aria-label="Liturgical Texts" style={MENU_GROUP_STYLE}>
                <div className="text-stone-400 dark:text-[var(--dark-muted)]" style={{ ...MENU_LABEL_STYLE, padding: "0 2px 12px" }}>
                  Navigation
                </div>
                <button
                  role="menuitem"
                  type="button"
                  onClick={goHome}
                  className={view === "home" ? "bg-stone-100 dark:bg-[var(--dark-surface)] font-semibold" : "bg-transparent hover:bg-stone-50 dark:hover:bg-[var(--dark-hover)]"}
                  style={SECTION_ITEM_STYLE}
                >
                  Home
                </button>
                <div className="mt-3 text-stone-400 dark:text-[var(--dark-muted)]" style={MENU_LABEL_STYLE}>
                  Liturgical Texts
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  {readerNavigationGroups.map(({ serviceText, navigation }) => {
                    const isCurrentServiceText = view === "reader" && selectedServiceText.id === serviceText.id;
                    const serviceTextDetailId = `liturgy-text:${serviceText.id}`;
                    return (
                      <details
                        className="lp-course-lesson"
                        key={serviceText.id}
                        open={isNavDetailOpen(serviceTextDetailId, isCurrentServiceText)}
                        onToggle={event => setNavDetailOpen(serviceTextDetailId, event.currentTarget.open)}
                      >
                        <summary className="lp-course-lesson-summary text-xs font-semibold uppercase tracking-wide text-stone-400 dark:text-[var(--dark-muted)]">
                          {serviceText.nav_landing_at_root ? (
                            <button
                              role="menuitem"
                              type="button"
                              onClick={event => {
                                event.preventDefault();
                                event.stopPropagation();
                                goToTableOfContents(serviceText.id);
                              }}
                              className={isCurrentServiceText && selectedSectionIndex === null ? "bg-stone-100 dark:bg-[var(--dark-surface)]" : "bg-transparent hover:bg-stone-50 dark:hover:bg-[var(--dark-hover)]"}
                              style={{
                                ...SECTION_ITEM_STYLE,
                                padding: "4px 6px",
                                color: "inherit",
                                fontSize: "inherit",
                                fontWeight: "inherit",
                                letterSpacing: "inherit",
                                lineHeight: "inherit",
                                textTransform: "inherit"
                              }}
                            >
                              {serviceText.title}
                            </button>
                          ) : serviceText.title}
                        </summary>
                        <div className="lp-course-exercise-list">
                          {serviceText.nav_landing_at_root
                            ? navigation.flatMap(serviceItem => renderReaderNavigationItems(serviceText, serviceItem, isCurrentServiceText))
                            : navigation.map(serviceItem => {
                            const serviceHasCurrentSection = isCurrentServiceText && serviceItem.items.some(item => (
                              item.type === "section"
                                ? selectedSectionIndex === item.sectionIndex
                                : item.sections.some(sectionItem => selectedSectionIndex === sectionItem.sectionIndex)
                            ));
                            const serviceDetailId = `liturgy-service:${serviceText.id}:${serviceItem.title}`;
                            return (
                              <details
                                className="lp-course-lesson"
                                key={serviceItem.title}
                                open={isNavDetailOpen(serviceDetailId, serviceHasCurrentSection || (isCurrentServiceText && selectedSectionIndex === null))}
                                onToggle={event => setNavDetailOpen(serviceDetailId, event.currentTarget.open)}
                              >
                                <summary className="lp-course-lesson-summary">
                                  <button
                                    role="menuitem"
                                    type="button"
                                    onClick={event => {
                                      event.preventDefault();
                                      event.stopPropagation();
                                      goToTableOfContents(serviceText.id);
                                    }}
                                    className={isCurrentServiceText && selectedSectionIndex === null ? "bg-stone-100 dark:bg-[var(--dark-surface)] font-semibold" : "bg-transparent hover:bg-stone-50 dark:hover:bg-[var(--dark-hover)]"}
                                    style={{ ...SECTION_ITEM_STYLE, padding: "4px 6px" }}
                                  >
                                    {serviceItem.title}
                                  </button>
                                </summary>
                                <div className="lp-course-exercise-list">
                                  {renderReaderNavigationItems(serviceText, serviceItem, isCurrentServiceText)}
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

              <div role="separator" aria-hidden="true" className="border-t border-stone-200 dark:border-[var(--dark-border)]" />

              <div role="group" aria-label="Course" style={MENU_GROUP_STYLE}>
                <div className="text-stone-400 dark:text-[var(--dark-muted)]" style={MENU_LABEL_STYLE}>
                  Course
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <button
                  role="menuitem"
                  type="button"
                  onClick={goToCourseOverview}
                  className={view === "course-overview" ? "bg-stone-100 dark:bg-[var(--dark-surface)] font-semibold" : "bg-transparent hover:bg-stone-50 dark:hover:bg-[var(--dark-hover)]"}
                  style={LESSON_ITEM_STYLE}
                >
                  Course Overview
                </button>
                {ORDERED_UNITS.map(unit => {
                  const unitLessons = COURSE_LESSONS.filter(l => l.unit_id === unit.id);
                  const isCurrentUnit = unitLessons.some(lesson => lesson.id === selectedLessonId);
                  const unitDetailId = `course-unit:${unit.id}`;
                  return (
                    <details
                      className="lp-course-lesson"
                      key={unit.id}
                      open={isNavDetailOpen(unitDetailId, isCurrentUnit || view === "course-overview")}
                      onToggle={event => setNavDetailOpen(unitDetailId, event.currentTarget.open)}
                    >
                      <summary className="lp-course-lesson-summary text-xs font-semibold uppercase tracking-wide text-stone-400 dark:text-[var(--dark-muted)]">
                        {unit.title}
                      </summary>

                      <div className="lp-course-exercise-list">
                        {unitLessons.map(lesson => {
                          const isCurrentLesson = selectedLessonId === lesson.id;
                          if (!hasMultipleExercises(lesson)) {
                            return (
                              <button
                                key={lesson.id}
                                role="menuitem"
                                type="button"
                                onClick={() => goToLesson(lesson.id, 0)}
                                className={view === "lessons" && isCurrentLesson ? "bg-stone-100 dark:bg-[var(--dark-surface)] font-semibold" : "bg-transparent hover:bg-stone-50 dark:hover:bg-[var(--dark-hover)]"}
                                style={LESSON_ITEM_STYLE}
                              >
                                {lesson.title}
                              </button>
                            );
                          }

                          const lessonDetailId = `course-lesson:${lesson.id}`;
                          return (
                            <details
                              className="lp-course-lesson"
                              key={lesson.id}
                              open={isNavDetailOpen(lessonDetailId, isCurrentLesson)}
                              onToggle={event => setNavDetailOpen(lessonDetailId, event.currentTarget.open)}
                            >
                              <summary className={`lp-course-lesson-summary${isCurrentLesson ? " active" : ""}`}>
                                {lesson.title}
                              </summary>

                              <div className="lp-course-exercise-list">
                                {(lesson.exercises || []).map((exercise, exerciseIndex) => (
                                  <button
                                    key={`${lesson.id}-${exercise.exercise_id}`}
                                    role="menuitem"
                                    type="button"
                                    onClick={() => goToLesson(lesson.id, exerciseIndex)}
                                    className={view === "lessons" && isCurrentLesson && clampedExerciseIndex === exerciseIndex ? "bg-stone-100 dark:bg-[var(--dark-surface)] font-semibold" : "bg-transparent hover:bg-stone-50 dark:hover:bg-[var(--dark-hover)]"}
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
        className="app-content"
        onClickCapture={() => {
          if (isNarrowViewport && menuOpen) setMenuOpen(false);
          if (displayMenuOpen) setDisplayMenuOpen(false);
        }}
        style={{
          "--side-panel-offset": menuOpen && !isNarrowViewport ? `${SIDE_PANEL_WIDTH}px` : "0px",
          flex: "1 1 auto",
          minWidth: 0,
          display: hideContentForMenu ? "none" : "block"
        }}
      >
        {view === "home" && renderHome()}
        {view === "reader" && (
          <ArabicLiturgyReader
            serviceText={selectedServiceText}
            arabicMode={arabicMode}
            readerLayout={readerLayout}
            showQuietPrayers={showQuietPrayers}
            selectedSectionIndex={selectedSectionIndex}
            speechRate={speechRate}
            arabicFontFamily={arabicFontFamily}
            arabicFontWeight={arabicFontWeight}
            arabicFontSize={arabicFontSize}
            showPracticeToolbar={showPracticeToolbar}
            hasPreviousSection={hasPreviousSection}
            hasNextSection={hasNextSection}
            previousSectionTitle={previousSectionTitle}
            nextSectionTitle={nextSectionTitle}
            onPreviousSection={goToPreviousSection}
            onNextSection={goToNextSection}
            onTableOfContents={() => goToTableOfContents(selectedServiceText.id)}
            onSelectSection={goToLiturgySection}
          />
        )}
        {view === "course-overview" && (
          <CourseOverview
            units={ORDERED_UNITS}
            lessons={COURSE_LESSONS}
            selectedLessonId={selectedLessonId}
            selectedExerciseIndex={clampedExerciseIndex}
            onSelectExercise={goToLesson}
          />
        )}
        {view === "lessons" && selectedLessonWithUnit && (
          <LessonPage
            lesson={selectedLessonWithUnit}
            arabicMode={arabicMode}
            readerLayout={readerLayout}
            speechRate={speechRate}
            arabicFontFamily={arabicFontFamily}
            arabicFontWeight={arabicFontWeight}
            arabicFontSize={arabicFontSize}
            showPracticeToolbar={showPracticeToolbar}
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
            <p className="text-stone-600 dark:text-[var(--dark-muted)]">
              No lesson is configured for "{selectedLessonId}".
            </p>
          </main>
        )}
      </div>

      {displayMenuOpen && (
        <aside
          className="bg-white dark:bg-[var(--dark-bg)] border-l border-stone-200 dark:border-[var(--dark-border)]"
          dir="ltr"
          style={{
            position: isNarrowViewport ? "fixed" : "sticky",
            top: 0,
            right: 0,
            zIndex: 35,
            flex: `0 0 ${SIDE_PANEL_WIDTH}px`,
            width: SIDE_PANEL_WIDTH,
            maxWidth: "calc(100vw - 56px)",
            minHeight: "100vh",
            maxHeight: "100vh",
            overflowY: "auto",
            padding: "48px 16px 16px"
          }}
        >
          {renderDisplayMenu()}
        </aside>
      )}
    </div>
  );
}
