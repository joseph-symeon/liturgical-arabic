import React, { useEffect, useRef, useState } from "react";
import ArabicLiturgyReader from "./ArabicLiturgyReader.jsx";
import CourseOverview from "./components/course/CourseOverview.jsx";
import LessonPage from "./components/course/LessonPage.jsx";
import InteractiveText from "./components/InteractiveText.jsx";
import PhraseTooltip from "./components/PhraseTooltip.jsx";
import SyncAccountPanel from "./components/SyncAccountPanel.jsx";
import { defaultServiceText, defaultServiceTextId, getServiceText, readerServiceTexts } from "./data/texts/serviceTexts.js";
import phrases from "./data/texts/phrases.js";
import courseTracks from "./data/course/courseTracks.js";
import lessons from "./data/course/lessons.js";
import { getExerciseTitle } from "./components/course/exerciseTitles.js";
import { getServiceNavigation } from "./utils/serviceNavigation.js";
import { getArabicText } from "./utils/arabic.js";
import {
  getResetPhraseProgress,
  getStoredPhraseProgress,
  PHRASE_PROGRESS_EVENT,
  PROGRESS_TRACKING_MODES,
  replaceStoredPhraseProgress,
  setProgressTrackingEnabled,
  setProgressTrackingMode
} from "./utils/progressScoring.js";
import {
  canSyncUserState,
  clearPreviewProgress,
  clearPendingProgressSync,
  fetchRemoteUserState,
  getCurrentSession,
  hasPendingProgressSync,
  markPendingProgressSync,
  mergePendingLocalProgressIntoRemote,
  mergePreviewProgressIntoRemote,
  sendPasswordReset,
  saveRemoteUserState,
  signInWithEmail,
  signInWithPassword,
  signUpWithPassword,
  signOut,
  subscribeToAuthChanges,
  updatePassword
} from "./utils/userStateSync.js";
import appIcons from "./assets/icons/index.js";
import "./App.css";

const NAV_ITEM_STYLE = {
  display: "block",
  width: "100%",
  textAlign: "left",
  padding: "9px 11px",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontSize: "14px",
  lineHeight: 1.3,
  fontFamily: "inherit"
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
  borderRadius: "999px",
  cursor: "pointer",
  fontFamily: "inherit",
  fontSize: "12px",
  padding: "6px 10px"
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
const COURSE_STUDY_WORKSPACE_STORAGE_KEY = "liturgical-arabic:study-workspace";
const SYNC_SAVE_DEBOUNCE_MS = 900;
const SIGNED_OUT_COURSE_LESSON_IDS = new Set([
  "lesson-lord-have-mercy",
  "lesson-jesus-prayer"
]);

function hasSupabaseAuthCallbackParams() {
  if (typeof window === "undefined") return false;
  const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  const searchParams = new URLSearchParams(window.location.search);
  return (
    hashParams.has("access_token") ||
    hashParams.has("refresh_token") ||
    hashParams.has("error") ||
    searchParams.has("code") ||
    searchParams.has("error")
  );
}

function clearSupabaseAuthCallbackParams() {
  if (typeof window === "undefined" || !hasSupabaseAuthCallbackParams()) return;
  window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}#home`);
}

function getCourseItemLessonIds(item) {
  const lessonIds = item.lesson_ids || (item.lesson_id ? [item.lesson_id] : []);
  if (item.type !== "track") return lessonIds;
  const bonusLessonIds = courseTracks
    .filter(candidate => candidate.parent_track_id === item.id)
    .flatMap(candidate => candidate.lesson_ids || (candidate.lesson_id ? [candidate.lesson_id] : []));
  return lessonIds.concat(bonusLessonIds);
}

const COURSE_NAV_ITEMS = courseTracks.filter(item => !item.parent_track_id);
const COURSE_LESSONS = COURSE_NAV_ITEMS
  .flatMap(getCourseItemLessonIds)
  .filter((lessonId, index, ids) => ids.indexOf(lessonId) === index)
  .map(lessonId => lessons.find(lesson => lesson.id === lessonId))
  .filter(Boolean);
const DEFAULT_LESSON_ID = COURSE_LESSONS[0]?.id ?? lessons[0]?.id ?? null;
const READER_SERVICE_TEXTS = readerServiceTexts.length > 0 ? readerServiceTexts : [defaultServiceText];
const DEFAULT_READER_SERVICE_TEXT_ID = defaultServiceTextId;
const HOME_TITLE_PHRASE_IDS = ["homepage-lisan-001", "homepage-al-quddas-001"];

function hasMultipleExercises(lesson) {
  return (lesson?.exercises?.length ?? 0) > 1;
}

function getNavItemClass(isCurrent, extraClassName = "") {
  return [
    "lp-nav-item",
    isCurrent ? "is-current" : null,
    extraClassName
  ].filter(Boolean).join(" ");
}

function getNavSummaryClass(isCurrent, extraClassName = "") {
  return [
    "lp-course-lesson-summary",
    isCurrent ? "active" : null,
    extraClassName
  ].filter(Boolean).join(" ");
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
      selectedCourseTrackId: null,
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
      selectedCourseTrackId: null,
      selectedLessonId: DEFAULT_LESSON_ID,
      selectedExerciseIndex: 0
    };
  }
  if (hash === "reader/toc") {
    return {
      view: "reader",
      selectedServiceTextId: DEFAULT_READER_SERVICE_TEXT_ID,
      selectedSectionIndex: null,
      selectedCourseTrackId: null,
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
        selectedCourseTrackId: null,
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
        selectedCourseTrackId: null,
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
          selectedCourseTrackId: null,
          selectedLessonId: DEFAULT_LESSON_ID,
          selectedExerciseIndex: 0
        };
      }
    }
  }
  if (hash.startsWith("course/")) {
    const parts = hash.split("/");
    if (parts[1] === "track") {
      return {
        view: "course-overview",
        selectedServiceTextId: DEFAULT_READER_SERVICE_TEXT_ID,
        selectedSectionIndex: null,
        selectedCourseTrackId: parts[2] || null,
        selectedLessonId: DEFAULT_LESSON_ID,
        selectedExerciseIndex: 0
      };
    }
    const lessonId = parts[1] || DEFAULT_LESSON_ID;
    if (parts[2] !== "exercise") {
      return {
        view: "lessons",
        selectedServiceTextId: DEFAULT_READER_SERVICE_TEXT_ID,
        selectedSectionIndex: null,
        selectedCourseTrackId: null,
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
      selectedCourseTrackId: null,
      selectedLessonId: lessonId,
      selectedExerciseIndex
    };
  }
  return {
    view: "home",
    selectedServiceTextId: DEFAULT_READER_SERVICE_TEXT_ID,
    selectedSectionIndex: null,
    selectedCourseTrackId: null,
    selectedLessonId: DEFAULT_LESSON_ID,
    selectedExerciseIndex: 0
  };
}

function getNavigationHash(view, selectedServiceTextId, selectedSectionIndex, selectedCourseTrackId, selectedLessonId, selectedExerciseIndex) {
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
    if (selectedCourseTrackId) {
      return `#course/track/${encodeURIComponent(selectedCourseTrackId)}`;
    }
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

function getStoredCourseStudyWorkspace() {
  if (typeof window === "undefined") return "recitation";
  const stored = window.localStorage.getItem(COURSE_STUDY_WORKSPACE_STORAGE_KEY);
  return ["home", "recitation", "comprehension"].includes(stored) ? stored : "recitation";
}

export default function App() {
  const [initialNavigation] = useState(() => parseNavigationHash());
  const [initialDisplaySettings] = useState(() => getStoredDisplaySettings());
  const [view, setView] = useState(initialNavigation.view);
  const [selectedServiceTextId, setSelectedServiceTextId] = useState(initialNavigation.selectedServiceTextId);
  const [selectedSectionIndex, setSelectedSectionIndex] = useState(initialNavigation.selectedSectionIndex);
  const [selectedCourseTrackId, setSelectedCourseTrackId] = useState(initialNavigation.selectedCourseTrackId);
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
  const [courseStudyWorkspace, setCourseStudyWorkspace] = useState(getStoredCourseStudyWorkspace);
  const [syncSession, setSyncSession] = useState(null);
  const [syncStatus, setSyncStatus] = useState(() => canSyncUserState() ? "loading" : "disabled");
  const [syncMessage, setSyncMessage] = useState("");
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [isNarrowViewport, setIsNarrowViewport] = useState(false);
  const [isCompactChrome, setIsCompactChrome] = useState(false);
  const previousNavigationKeyRef = useRef(null);
  const previousIsNarrowViewportRef = useRef(null);
  const syncReadyRef = useRef(false);
  const syncSaveTimerRef = useRef(null);
  const preferencesRef = useRef({
    displaySettings: initialDisplaySettings
  });

  function getDisplaySettings() {
    return {
      arabicMode,
      readerLayout,
      showQuietPrayers,
      arabicFontFamily,
      arabicFontWeight,
      arabicFontSize,
      showPracticeToolbar
    };
  }

  function applyDisplaySettings(settings) {
    if (!settings || typeof settings !== "object") return;
    if (ARABIC_MODES.includes(settings.arabicMode)) setArabicMode(settings.arabicMode);
    if (["line", "paragraph"].includes(settings.readerLayout)) setReaderLayout(settings.readerLayout);
    if (typeof settings.showQuietPrayers === "boolean") setShowQuietPrayers(settings.showQuietPrayers);
    if (ARABIC_FONTS.some(font => font.value === settings.arabicFontFamily)) setArabicFontFamily(settings.arabicFontFamily);
    if (typeof settings.arabicFontSize === "number") {
      setArabicFontSize(Math.max(18, Math.min(36, settings.arabicFontSize)));
    }
    if (typeof settings.showPracticeToolbar === "boolean") setShowPracticeToolbar(settings.showPracticeToolbar);
  }

  function resetViewportAfterAuth() {
    if (typeof window === "undefined") return;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.activeElement?.blur?.();
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      });
    });
  }

  function scheduleCloudSave() {
    if (!syncReadyRef.current || !syncSession?.user?.id) return;
    if (syncSaveTimerRef.current) clearTimeout(syncSaveTimerRef.current);
    setSyncStatus("syncing");
    syncSaveTimerRef.current = window.setTimeout(async () => {
      syncSaveTimerRef.current = null;
      try {
        await saveRemoteUserState({
          userId: syncSession.user.id,
          progress: getStoredPhraseProgress(),
          preferences: preferencesRef.current
        });
        clearPendingProgressSync(syncSession.user.id);
        setSyncStatus("synced");
        setSyncMessage("");
      } catch (error) {
        setSyncStatus("error");
        setSyncMessage(
          typeof navigator !== "undefined" && navigator.onLine === false
            ? "Progress saved on this device. It will sync when you're back online."
            : error.message || "Sync failed."
        );
      }
    }, SYNC_SAVE_DEBOUNCE_MS);
  }

  async function handlePasswordSignIn({ email, password }) {
    if (!canSyncUserState()) {
      setSyncStatus("disabled");
      setSyncMessage("Missing Supabase environment values.");
      return;
    }
    setSyncStatus("loading");
    await signInWithPassword({ email: email.trim(), password });
    setAccountMenuOpen(false);
    setDisplayMenuOpen(false);
    resetViewportAfterAuth();
    setSyncMessage("");
  }

  async function handleCreateAccount({ email, password }) {
    if (!canSyncUserState()) {
      setSyncStatus("disabled");
      setSyncMessage("Missing Supabase environment values.");
      return;
    }
    setSyncStatus("loading");
    await signUpWithPassword({ email: email.trim(), password });
    setSyncMessage("");
  }

  async function handleMagicLinkSignIn(email) {
    if (!canSyncUserState()) {
      setSyncStatus("disabled");
      setSyncMessage("Missing Supabase environment values.");
      return;
    }
    setSyncStatus("loading");
    await signInWithEmail(email.trim());
    setSyncStatus("signed-out");
    setSyncMessage("Check your email for the sign-in link.");
  }

  async function handlePasswordReset(email) {
    if (!canSyncUserState()) {
      setSyncStatus("disabled");
      setSyncMessage("Missing Supabase environment values.");
      return;
    }
    await sendPasswordReset(email.trim());
    setSyncMessage("Check your email for the password reset link.");
  }

  async function handlePasswordUpdate(password) {
    await updatePassword(password);
    setSyncMessage("Password updated.");
  }

  async function handleResetProgress() {
    if (!syncSession?.user?.id) return;
    const confirmed = window.confirm("Reset all progress for this account? This cannot be undone.");
    if (!confirmed) return;
    if (syncSaveTimerRef.current) {
      clearTimeout(syncSaveTimerRef.current);
      syncSaveTimerRef.current = null;
    }
    const blankProgress = replaceStoredPhraseProgress(getResetPhraseProgress());
    clearPendingProgressSync(syncSession.user.id);
    clearPreviewProgress();
    setSyncStatus("syncing");
    await saveRemoteUserState({
      userId: syncSession.user.id,
      progress: blankProgress,
      preferences: preferencesRef.current
    });
    clearPendingProgressSync(syncSession.user.id);
    setSyncStatus("synced");
    setSyncMessage("Progress reset.");
  }

  async function handleSyncSignOut() {
    try {
      await signOut();
      syncReadyRef.current = false;
      setSyncSession(null);
      setSyncStatus("signed-out");
      setSyncMessage("");
    } catch (error) {
      setSyncStatus("error");
      setSyncMessage(error.message || "Could not sign out.");
    }
  }

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
    if (!canSyncUserState()) {
      setProgressTrackingMode(PROGRESS_TRACKING_MODES.preview);
      setSyncStatus("disabled");
      return undefined;
    }

    let cancelled = false;
    getCurrentSession()
      .then(session => {
        if (!cancelled) {
          if (session) clearSupabaseAuthCallbackParams();
          setSyncSession(session);
        }
      })
      .catch(error => {
        if (!cancelled) {
          setSyncStatus("error");
          setSyncMessage(error.message || "Could not load sync session.");
        }
      });

    const unsubscribe = subscribeToAuthChanges(session => {
      if (session) clearSupabaseAuthCallbackParams();
      setSyncSession(session);
    });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!canSyncUserState()) return;

    if (!syncSession?.user?.id) {
      syncReadyRef.current = false;
      setProgressTrackingMode(PROGRESS_TRACKING_MODES.preview);
      setSyncStatus("signed-out");
      return;
    }

    let cancelled = false;
    syncReadyRef.current = false;
    setProgressTrackingEnabled(false);
    setSyncStatus("loading");

    async function syncInitialUserState() {
      try {
        const remoteState = await fetchRemoteUserState(syncSession.user.id);
        if (cancelled) return;

        const nextProgress = hasPendingProgressSync(syncSession.user.id)
          ? mergePendingLocalProgressIntoRemote(remoteState?.progress)
          : mergePreviewProgressIntoRemote(remoteState?.progress);
        if (cancelled) return;

        const remotePreferences = remoteState?.preferences && typeof remoteState.preferences === "object"
          ? remoteState.preferences
          : {};
        const nextPreferences = {
          ...preferencesRef.current,
          ...remotePreferences
        };
        if (remotePreferences.displaySettings) {
          preferencesRef.current = nextPreferences;
          applyDisplaySettings(remotePreferences.displaySettings);
        } else {
          nextPreferences.displaySettings = getDisplaySettings();
          preferencesRef.current = nextPreferences;
        }

        await saveRemoteUserState({
          userId: syncSession.user.id,
          progress: nextProgress,
          preferences: preferencesRef.current
        });
        if (cancelled) return;
        clearPendingProgressSync(syncSession.user.id);
        clearPreviewProgress();
        syncReadyRef.current = true;
        setProgressTrackingEnabled(true);
        setSyncStatus("synced");
        setSyncMessage("");
      } catch (error) {
        if (!cancelled) {
          setSyncStatus("error");
          setSyncMessage(error.message || "Could not sync progress.");
        }
      }
    }

    syncInitialUserState();

    return () => {
      cancelled = true;
      syncReadyRef.current = false;
      setProgressTrackingMode(PROGRESS_TRACKING_MODES.preview);
    };
  }, [syncSession?.user?.id]);

  useEffect(() => {
    function handleProgressUpdated(event) {
      if (event?.detail && Object.prototype.hasOwnProperty.call(event.detail, "trackingEnabled")) return;
      if (syncReadyRef.current && syncSession?.user?.id) {
        markPendingProgressSync(syncSession.user.id);
      }
      scheduleCloudSave();
    }

    window.addEventListener(PHRASE_PROGRESS_EVENT, handleProgressUpdated);
    return () => window.removeEventListener(PHRASE_PROGRESS_EVENT, handleProgressUpdated);
  }, [syncSession?.user?.id]);

  useEffect(() => {
    function handleOnline() {
      if (hasPendingProgressSync(syncSession?.user?.id)) {
        scheduleCloudSave();
      }
    }

    window.addEventListener("online", handleOnline);
    return () => window.removeEventListener("online", handleOnline);
  }, [syncSession?.user?.id]);

  useEffect(() => () => {
    if (syncSaveTimerRef.current) clearTimeout(syncSaveTimerRef.current);
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
    const displaySettings = getDisplaySettings();
    preferencesRef.current = {
      ...preferencesRef.current,
      displaySettings
    };
    window.localStorage.setItem(DISPLAY_SETTINGS_STORAGE_KEY, JSON.stringify(displaySettings));
    scheduleCloudSave();
  }, [arabicMode, readerLayout, showQuietPrayers, arabicFontFamily, arabicFontSize, showPracticeToolbar]);

  useEffect(() => {
    function updateNavigationFromHash() {
      const nextNavigation = parseNavigationHash();
      setView(nextNavigation.view);
      setSelectedServiceTextId(nextNavigation.selectedServiceTextId);
      setSelectedSectionIndex(nextNavigation.selectedSectionIndex);
      setSelectedCourseTrackId(nextNavigation.selectedCourseTrackId);
      setSelectedLessonId(nextNavigation.selectedLessonId);
      setSelectedExerciseIndex(nextNavigation.selectedExerciseIndex);
      if (isNarrowViewport) setMenuOpen(false);
      setDisplayMenuOpen(false);
      setAccountMenuOpen(false);
    }

    window.addEventListener("hashchange", updateNavigationFromHash);
    return () => window.removeEventListener("hashchange", updateNavigationFromHash);
  }, [isNarrowViewport]);

  useEffect(() => {
    if (hasSupabaseAuthCallbackParams()) return;
    const nextHash = getNavigationHash(view, selectedServiceTextId, selectedSectionIndex, selectedCourseTrackId, selectedLessonId, selectedExerciseIndex);
    if (window.location.hash !== nextHash) {
      window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}${nextHash}`);
    }
  }, [view, selectedServiceTextId, selectedSectionIndex, selectedCourseTrackId, selectedLessonId, selectedExerciseIndex]);

  useEffect(() => {
    const navigationKey = `${view}:${selectedServiceTextId}:${selectedSectionIndex ?? "toc"}:${selectedCourseTrackId ?? ""}:${selectedLessonId ?? ""}:${selectedExerciseIndex}`;
    if (previousNavigationKeyRef.current === null) {
      previousNavigationKeyRef.current = navigationKey;
      return;
    }
    if (previousNavigationKeyRef.current === navigationKey) return;

    previousNavigationKeyRef.current = navigationKey;
    window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    });
  }, [view, selectedServiceTextId, selectedSectionIndex, selectedCourseTrackId, selectedLessonId, selectedExerciseIndex]);

  useEffect(() => {
    if (syncStatus === "loading") return;
    if (view !== "lessons" || !selectedLessonId || canAccessCourseLesson(selectedLessonId)) return;
    setView("course-overview");
    setSelectedCourseTrackId(null);
    setSelectedExerciseIndex(0);
  }, [syncStatus, syncSession?.user?.id, view, selectedLessonId]);

  function goHome() {
    setView("home");
    setSelectedCourseTrackId(null);
    if (isNarrowViewport) setMenuOpen(false);
    setDisplayMenuOpen(false);
  }

  function goToLiturgySection(sectionIndex, serviceTextId = selectedServiceTextId) {
    setSelectedServiceTextId(serviceTextId);
    setSelectedSectionIndex(sectionIndex);
    setSelectedCourseTrackId(null);
    setView("reader");
    if (isNarrowViewport) setMenuOpen(false);
    setDisplayMenuOpen(false);
  }

  function goToTableOfContents(serviceTextId = selectedServiceTextId) {
    setSelectedServiceTextId(serviceTextId);
    setSelectedSectionIndex(null);
    setSelectedCourseTrackId(null);
    setView("reader");
    if (isNarrowViewport) setMenuOpen(false);
    setDisplayMenuOpen(false);
  }

  function goToCourseOverview() {
    setSelectedCourseTrackId(null);
    setView("course-overview");
    if (isNarrowViewport) setMenuOpen(false);
    setDisplayMenuOpen(false);
  }

  function openProgressSignIn() {
    setDisplayMenuOpen(true);
    setAccountMenuOpen(true);
    if (isNarrowViewport) setMenuOpen(false);
  }

  function canAccessCourseLesson(lessonId) {
    return Boolean(syncSession?.user) || SIGNED_OUT_COURSE_LESSON_IDS.has(lessonId);
  }

  function handleBlockedCourseLesson() {
    openProgressSignIn();
  }

  function goToCourseTrack(trackId) {
    setSelectedCourseTrackId(trackId);
    setView("course-overview");
    if (isNarrowViewport) setMenuOpen(false);
    setDisplayMenuOpen(false);
  }

  function goToSelectedLessonTrack() {
    if (selectedLessonCourseItem?.id) {
      goToCourseTrack(selectedLessonCourseItem.id);
      return;
    }
    goToCourseOverview();
  }

  function goToLesson(lessonId, exerciseIndex = 0) {
    if (!canAccessCourseLesson(lessonId)) {
      handleBlockedCourseLesson();
      return;
    }
    setSelectedLessonId(lessonId);
    setSelectedExerciseIndex(exerciseIndex);
    setSelectedCourseTrackId(null);
    setView("lessons");
    if (isNarrowViewport) setMenuOpen(false);
    setDisplayMenuOpen(false);
  }

  function goToLessonStudyHome(lessonId, exerciseIndex = 0, studyWorkspace = "recitation") {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(COURSE_STUDY_WORKSPACE_STORAGE_KEY, studyWorkspace);
    }
    setCourseStudyWorkspace(studyWorkspace);
    goToLesson(lessonId, exerciseIndex);
  }

  function goToPreviousSection() {
    setSelectedSectionIndex(index => (index === null ? null : Math.max(0, index - 1)));
    setView("reader");
  }

  function goToNextSection() {
    const sectionCount = getReaderServiceText(selectedServiceTextId).sections.length;
    setSelectedSectionIndex(index => {
      if (sectionCount === 0) return null;
      return index === null ? 0 : Math.min(sectionCount - 1, index + 1);
    });
    setView("reader");
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
  const selectedLessonCourseItem = COURSE_NAV_ITEMS.find(item => getCourseItemLessonIds(item).includes(selectedLesson?.id));
  const selectedCourseTrack = courseTracks.find(item => item.id === selectedCourseTrackId);
  const selectedLessonWithUnit = selectedLesson
    ? { ...selectedLesson, unitTitle: selectedLessonCourseItem?.title }
    : null;
  const clampedExerciseIndex = Math.max(0, Math.min(selectedExerciseIndex, (selectedLesson?.exercises?.length ?? 1) - 1));
  const canUseAppBack = view !== "home" || Boolean(selectedCourseTrack);
  const isLessonActivityView = view === "lessons" && courseStudyWorkspace !== "home";
  const appBackLabel =
    view === "course-overview" && selectedCourseTrack
      ? "Back to Course Overview"
      : view === "lessons"
        ? (isLessonActivityView ? "Back to Lesson" : "Back to Track")
        : view === "reader" && selectedSectionIndex !== null
          ? "Back to Table of Contents"
          : "Back to Home";

  useEffect(() => {
    if (view === "lessons" && selectedExerciseIndex !== clampedExerciseIndex) {
      setSelectedExerciseIndex(clampedExerciseIndex);
    }
  }, [view, selectedExerciseIndex, clampedExerciseIndex]);

  const selectedServiceText = getReaderServiceText(selectedServiceTextId);
  const readerSections = selectedServiceText.sections || [];
  useEffect(() => {
    if (
      view === "reader" &&
      selectedSectionIndex !== null &&
      (selectedSectionIndex < 0 || selectedSectionIndex >= readerSections.length)
    ) {
      setSelectedSectionIndex(null);
    }
  }, [view, selectedSectionIndex, readerSections.length]);

  const readerServiceNavigation = getServiceNavigation(selectedServiceText);
  const readerServiceHomeTitle = readerServiceNavigation[0]?.title || selectedServiceText.short_title || selectedServiceText.title;
  const readerNavigationGroups = READER_SERVICE_TEXTS.reduce((groups, serviceText) => {
    const groupTitle = serviceText.title || serviceText.short_title || serviceText.id;
    let group = groups.find(item => item.title === groupTitle);
    if (!group) {
      group = { title: groupTitle, services: [] };
      groups.push(group);
    }
    group.services.push({
      serviceText,
      navigation: getServiceNavigation(serviceText)
    });
    return groups;
  }, []);
  const hasPreviousSection = selectedSectionIndex !== null && selectedSectionIndex > 0;
  const hasNextSection = selectedSectionIndex === null
    ? readerSections.length > 0
    : selectedSectionIndex < readerSections.length - 1;
  const previousSectionTitle = hasPreviousSection ? readerSections[selectedSectionIndex - 1]?.section : null;
  const nextSectionTitle = hasNextSection
    ? readerSections[selectedSectionIndex === null ? 0 : selectedSectionIndex + 1]?.section
    : null;
  const hideContentForMenu = (menuOpen || displayMenuOpen) && isNarrowViewport;
  const pageCanUseFocusMode =
    view === "lessons"
    && Boolean(selectedLessonWithUnit)
    && courseStudyWorkspace === "recitation";

  function goBackInApp() {
    if (view === "lessons" && document.documentElement.classList.contains("lp-learn-session-active")) {
      window.dispatchEvent(new CustomEvent("liturgical-arabic:learn-back"));
      return;
    }

    if (view === "course-overview" && selectedCourseTrack) {
      setSelectedCourseTrackId(null);
      return;
    }

    if (view === "lessons") {
      if (courseStudyWorkspace !== "home") {
        if ((selectedLesson?.exercises?.length || 0) === 1) {
          setSelectedCourseTrackId(selectedLessonCourseItem?.id ?? null);
          setView("course-overview");
          if (isNarrowViewport) setMenuOpen(false);
          setDisplayMenuOpen(false);
          return;
        }
        if (typeof window !== "undefined") {
          window.localStorage.setItem(COURSE_STUDY_WORKSPACE_STORAGE_KEY, "home");
        }
        setCourseStudyWorkspace("home");
        return;
      }
      setSelectedCourseTrackId(selectedLessonCourseItem?.id ?? null);
      setView("course-overview");
      if (isNarrowViewport) setMenuOpen(false);
      setDisplayMenuOpen(false);
      return;
    }

    if (view === "reader") {
      if (selectedSectionIndex !== null) {
        goToTableOfContents(selectedServiceTextId);
        return;
      }
      goHome();
      return;
    }

    if (view === "course-overview") {
      goHome();
    }
  }

  useEffect(() => {
    if (!pageCanUseFocusMode && !showPracticeToolbar) {
      setShowPracticeToolbar(true);
    }
  }, [pageCanUseFocusMode, showPracticeToolbar]);

  function renderHome() {
    const homeTitlePhrases = HOME_TITLE_PHRASE_IDS.map(phraseId => phrases[phraseId]).filter(Boolean);
    function getServiceHomeTitle(serviceText) {
      if (serviceText.short_title && serviceText.nav_title) {
        return `${serviceText.short_title} ${serviceText.nav_title}`;
      }
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
    const signedIn = Boolean(syncSession?.user);
    const needsAttention = syncStatus === "error" || syncStatus === "disabled";
    const profileSubtitle = syncStatus === "error"
        ? "Needs attention"
        : syncStatus === "disabled"
          ? "Sync unavailable"
          : "Account";

    function renderDisplaySection(title, children) {
      return (
        <section className="app-display-section border-t border-stone-200 first:border-t-0 dark:border-[var(--dark-border)]">
          <h2 className="app-display-section-title text-xs font-semibold uppercase tracking-wide text-stone-400 dark:text-[var(--dark-muted)]">
            {title}
          </h2>
          <div className="app-display-section-body grid">
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
      return <div className={["app-display-button-row flex flex-wrap items-center", className].filter(Boolean).join(" ")}>{children}</div>;
    }

    function getDisplayOptionClass(isActive) {
      return `app-control-option${isActive ? " active" : ""}`;
    }

    function renderToggleField(label, checked, onChange) {
      return (
        <div className="app-display-toggle-field flex items-center justify-between gap-4">
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

    if (accountMenuOpen) {
      return (
        <div
          role="group"
          aria-label="Profile"
          className="app-display-panel-scroll text-stone-900 dark:text-[var(--dark-text)]"
          dir="ltr"
          onClick={event => event.stopPropagation()}
        >
          <section className="app-display-profile-section">
            <div className="app-panel-section-heading">Profile</div>
            <SyncAccountPanel
              session={syncSession}
              syncStatus={syncStatus}
              syncMessage={syncMessage}
              onSignIn={handlePasswordSignIn}
              onCreateAccount={handleCreateAccount}
              onMagicLink={handleMagicLinkSignIn}
              onResetPassword={handlePasswordReset}
              onUpdatePassword={handlePasswordUpdate}
              onSignOut={handleSyncSignOut}
              onResetProgress={handleResetProgress}
              onClose={() => setAccountMenuOpen(false)}
            />
          </section>
        </div>
      );
    }

    return (
      <div
        role="group"
        aria-label="Display settings"
        className="app-display-panel-scroll text-stone-900 dark:text-[var(--dark-text)]"
        dir="ltr"
        onClick={event => event.stopPropagation()}
      >
        <section className="app-display-profile-section">
          <h2 className="app-panel-section-heading">
            Profile
          </h2>
          <button
            type="button"
            className={`app-profile-row${signedIn ? " signed-in" : ""}${needsAttention ? " needs-attention" : ""}`}
            onClick={() => setAccountMenuOpen(true)}
            aria-label={signedIn ? "Open account settings" : "Sign in to sync progress"}
          >
            <span className="app-profile-row-avatar" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21a8 8 0 0 0-16 0" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </span>
            <span className="app-profile-row-main">
              <span className="app-profile-row-title">{signedIn ? syncSession.user.email : "Sign in"}</span>
              {signedIn && <span className="app-profile-row-subtitle">{profileSubtitle}</span>}
            </span>
            <span className="app-profile-row-status" aria-hidden="true" />
            <svg className="app-profile-row-chevron" aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </section>
        <div className="app-panel-section-heading app-display-settings-heading">
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
                      className={getDisplayOptionClass(arabicMode === option.value)}
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
                    className={getDisplayOptionClass(readerLayout === "line")}
                    style={SETTING_BUTTON_STYLE}
                  >
                    Line
                  </button>
                  <button
                    type="button"
                    onClick={() => setReaderLayout("paragraph")}
                    className={getDisplayOptionClass(readerLayout === "paragraph")}
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
                      className={getDisplayOptionClass(arabicFontFamily === font.value)}
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
                <div className="lp-setting-control-box app-font-size-stepper">
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
        <section className="app-display-reset-section flex justify-start border-t border-stone-200 dark:border-[var(--dark-border)]">
          <button
            type="button"
            onClick={resetDisplaySettings}
            className="app-reset-control"
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
        className="app-chrome-button rounded bg-white/85 text-stone-900 hover:bg-stone-100 dark:bg-[var(--dark-bg)] dark:text-[var(--dark-text)] dark:hover:bg-[var(--dark-hover)]"
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

  function renderAppBackButton() {
    const leftOffset = menuOpen && !isNarrowViewport ? SIDE_PANEL_WIDTH + 12 : 52;
    return (
      <button
        type="button"
        onClick={event => {
          goBackInApp();
          event.currentTarget.blur();
        }}
        aria-label={appBackLabel}
        title={appBackLabel}
        className="app-chrome-button rounded bg-white/85 text-stone-900 hover:bg-stone-100 dark:bg-[var(--dark-bg)] dark:text-[var(--dark-text)] dark:hover:bg-[var(--dark-hover)]"
        style={{
          position: "fixed",
          top: isCompactChrome ? "calc(env(safe-area-inset-top, 0px) + 8px)" : "8px",
          left: `${leftOffset}px`,
          zIndex: 40,
          border: "none",
          cursor: "pointer",
          padding: "6px",
          color: "inherit"
        }}
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 18l-6-6 6-6" />
        </svg>
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
        className="app-chrome-button rounded bg-white/85 text-stone-900 hover:bg-stone-100 dark:bg-[var(--dark-bg)] dark:text-[var(--dark-text)] dark:hover:bg-[var(--dark-hover)]"
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
            className={getNavItemClass(isCurrentServiceText && selectedSectionIndex === item.sectionIndex)}
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
          <summary className={getNavSummaryClass(isCurrentGroup)}>
            {item.group}
          </summary>
          <div className="lp-course-exercise-list">
            {item.sections.map(sectionItem => (
              <button
                key={sectionItem.section.section || sectionItem.sectionIndex}
                role="menuitem"
                type="button"
                onClick={() => goToLiturgySection(sectionItem.sectionIndex, serviceText.id)}
                className={getNavItemClass(isCurrentServiceText && selectedSectionIndex === sectionItem.sectionIndex)}
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

  function renderReaderServiceNavigation(serviceText, navigation, isCurrentServiceText) {
    return navigation.map(serviceItem => {
      const serviceHasCurrentSection = isCurrentServiceText && serviceItem.items.some(item => (
        item.type === "section"
          ? selectedSectionIndex === item.sectionIndex
          : item.sections.some(sectionItem => selectedSectionIndex === sectionItem.sectionIndex)
      ));
      const serviceDetailId = `liturgy-service:${serviceText.id}:${serviceItem.title}`;
      if (serviceText.nav_single_section_direct && serviceText.sections.length === 1) {
        return (
          <button
            key={serviceItem.title}
            role="menuitem"
            type="button"
            onClick={() => goToLiturgySection(0, serviceText.id)}
            className={getNavItemClass(isCurrentServiceText)}
            style={SECTION_ITEM_STYLE}
          >
            {serviceItem.title}
          </button>
        );
      }
      const serviceButton = (
        <button
          role="menuitem"
          type="button"
          onClick={event => {
            event.preventDefault();
            event.stopPropagation();
            goToTableOfContents(serviceText.id);
          }}
          className={getNavItemClass(isCurrentServiceText && selectedSectionIndex === null)}
          style={{ ...SECTION_ITEM_STYLE, padding: "4px 6px" }}
        >
          {serviceItem.title}
        </button>
      );

      if (serviceItem.items.length === 0) {
        return (
          <div key={serviceItem.title}>
            {serviceButton}
          </div>
        );
      }

      return (
        <details
          className="lp-course-lesson"
          key={serviceItem.title}
          open={isNavDetailOpen(serviceDetailId, serviceHasCurrentSection || (isCurrentServiceText && selectedSectionIndex === null))}
          onToggle={event => setNavDetailOpen(serviceDetailId, event.currentTarget.open)}
        >
          <summary className={getNavSummaryClass(serviceHasCurrentSection || (isCurrentServiceText && selectedSectionIndex === null))}>
            {serviceButton}
          </summary>
          <div className="lp-course-exercise-list">
            {renderReaderNavigationItems(serviceText, serviceItem, isCurrentServiceText)}
          </div>
        </details>
      );
    });
  }

  function renderReaderNavigationGroup(group) {
    const isCurrentGroup = view === "reader" && group.services.some(({ serviceText }) => selectedServiceText.id === serviceText.id);
    const groupDetailId = `liturgy-text:${group.title}`;

    if (group.services.length === 1) {
      const { serviceText, navigation } = group.services[0];
      const isCurrentServiceText = view === "reader" && selectedServiceText.id === serviceText.id;
      if (serviceText.nav_single_section_direct && serviceText.sections.length === 1) {
        return (
          <button
            key={serviceText.id}
            role="menuitem"
            type="button"
            onClick={() => goToLiturgySection(0, serviceText.id)}
            className={getNavItemClass(isCurrentServiceText)}
            style={{
              ...SECTION_ITEM_STYLE,
              color: "inherit",
              fontSize: "12px",
              fontWeight: 600,
              letterSpacing: "0.08em",
              lineHeight: 1.3,
              textTransform: "uppercase"
            }}
          >
            {serviceText.title}
          </button>
        );
      }
      return (
        <details
          className="lp-course-lesson"
          key={serviceText.id}
          open={isNavDetailOpen(groupDetailId, isCurrentServiceText)}
          onToggle={event => setNavDetailOpen(groupDetailId, event.currentTarget.open)}
        >
          <summary className={getNavSummaryClass(isCurrentServiceText, "text-xs font-semibold uppercase tracking-wide text-stone-400 dark:text-[var(--dark-muted)]")}>
            {serviceText.nav_landing_at_root ? (
              <button
                role="menuitem"
                type="button"
                onClick={event => {
                  event.preventDefault();
                  event.stopPropagation();
                  goToTableOfContents(serviceText.id);
                }}
                className={getNavItemClass(isCurrentServiceText && selectedSectionIndex === null)}
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
              : renderReaderServiceNavigation(serviceText, navigation, isCurrentServiceText)}
          </div>
        </details>
      );
    }

    return (
      <details
        className="lp-course-lesson"
        key={group.title}
        open={isNavDetailOpen(groupDetailId, isCurrentGroup)}
        onToggle={event => setNavDetailOpen(groupDetailId, event.currentTarget.open)}
      >
        <summary className={getNavSummaryClass(isCurrentGroup, "text-xs font-semibold uppercase tracking-wide text-stone-400 dark:text-[var(--dark-muted)]")}>
          {group.title}
        </summary>
        <div className="lp-course-exercise-list">
          {group.services.flatMap(({ serviceText, navigation }) => {
            const isCurrentServiceText = view === "reader" && selectedServiceText.id === serviceText.id;
            return renderReaderServiceNavigation(serviceText, navigation, isCurrentServiceText);
          })}
        </div>
      </details>
    );
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

      {!(isNarrowViewport && displayMenuOpen) && renderPanelToggle({
          side: "left",
          isOpen: menuOpen,
          label: "Navigation",
          onClick: () => {
            setMenuOpen(o => !o);
            setAccountMenuOpen(false);
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

      {canUseAppBack && !(isNarrowViewport && (menuOpen || displayMenuOpen)) && renderAppBackButton()}

      {!(isNarrowViewport && menuOpen) && renderPanelToggle({
          side: "right",
          isOpen: displayMenuOpen,
          label: "Display settings",
          onClick: () => {
            setDisplayMenuOpen(o => {
              const nextOpen = !o;
              if (!nextOpen) setAccountMenuOpen(false);
              return nextOpen;
            });
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

      {pageCanUseFocusMode && !(isNarrowViewport && (menuOpen || displayMenuOpen)) && renderFocusModeToggle()}

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
          onClick={() => {
            setDisplayMenuOpen(false);
            setAccountMenuOpen(false);
          }}
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
        className="lp-navigation-panel app-side-panel bg-white dark:bg-[var(--dark-bg)] border-r border-stone-200 dark:border-[var(--dark-border)]"
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
          padding: "54px 12px 16px"
        }}
      >
          <div
            role="menu"
            className="text-stone-900 dark:text-[var(--dark-text)]"
            style={{ display: "flex", flexDirection: "column", gap: "16px", alignItems: "stretch", margin: 0, padding: 0, listStyle: "none", fontFamily: SYSTEM_SANS_FONT, fontSize: "14px" }}
          >
              <div role="group" aria-label="Liturgical Texts" style={MENU_GROUP_STYLE}>
                <div className="text-stone-400 dark:text-[var(--dark-muted)]" style={{ ...MENU_LABEL_STYLE, padding: "0 2px 12px" }}>
                  Navigation
                </div>
                <button
                  role="menuitem"
                  type="button"
                  onClick={goHome}
                  className={getNavItemClass(view === "home")}
                  style={SECTION_ITEM_STYLE}
                >
                  Home
                </button>
                <div className="mt-3 text-stone-400 dark:text-[var(--dark-muted)]" style={MENU_LABEL_STYLE}>
                  Liturgical Texts
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  {readerNavigationGroups.map(renderReaderNavigationGroup)}
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
                  className={getNavItemClass(view === "course-overview")}
                  style={LESSON_ITEM_STYLE}
                >
                  Course Overview
                </button>
                {COURSE_NAV_ITEMS.map(item => {
                  const itemLessons = getCourseItemLessonIds(item)
                    .map(lessonId => lessons.find(lesson => lesson.id === lessonId))
                    .filter(Boolean);
                  const isCurrentItem = itemLessons.some(lesson => lesson.id === selectedLessonId);
                  const isActiveCourseItem = view === "lessons" && isCurrentItem;
                  if (item.type === "standalone" || item.type === "bonus") {
                    const lesson = itemLessons[0];
                    if (!lesson) return null;
                    return (
                      <button
                        key={item.id}
                        role="menuitem"
                        type="button"
                        onClick={() => goToLesson(lesson.id, 0)}
                        className={getNavItemClass(view === "lessons" && selectedLessonId === lesson.id)}
                        style={LESSON_ITEM_STYLE}
                      >
                        {item.title}
                      </button>
                    );
                  }

                  const itemDetailId = `course-item:${item.id}`;
                  return (
                    <details
                      className="lp-course-lesson"
                      key={item.id}
                      open={isNavDetailOpen(itemDetailId, isCurrentItem || view === "course-overview")}
                      onToggle={event => setNavDetailOpen(itemDetailId, event.currentTarget.open)}
                    >
                      <summary className={getNavSummaryClass(isActiveCourseItem, "text-xs font-semibold uppercase tracking-wide text-stone-400 dark:text-[var(--dark-muted)]")}>
                        {item.title}
                      </summary>

                      <div className="lp-course-exercise-list">
                        {itemLessons.map(lesson => {
                          const isCurrentLesson = selectedLessonId === lesson.id;
                          if (!hasMultipleExercises(lesson)) {
                            return (
                              <button
                                key={lesson.id}
                                role="menuitem"
                                type="button"
                                onClick={() => goToLesson(lesson.id, 0)}
                                className={getNavItemClass(view === "lessons" && isCurrentLesson)}
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
                              <summary className={getNavSummaryClass(view === "lessons" && isCurrentLesson)}>
                                {lesson.title}
                              </summary>

                              <div className="lp-course-exercise-list">
                                {(lesson.exercises || []).map((exercise, exerciseIndex) => (
                                  <button
                                    key={`${lesson.id}-${exercise.exercise_id}`}
                                    role="menuitem"
                                    type="button"
                                    onClick={() => goToLesson(lesson.id, exerciseIndex)}
                                    className={getNavItemClass(view === "lessons" && isCurrentLesson && clampedExerciseIndex === exerciseIndex)}
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
          if (!isNarrowViewport) return;
          if (menuOpen) setMenuOpen(false);
          if (displayMenuOpen) {
            setDisplayMenuOpen(false);
            setAccountMenuOpen(false);
          }
        }}
        style={{
          "--side-panel-offset": menuOpen && !isNarrowViewport ? `${SIDE_PANEL_WIDTH}px` : "0px",
          "--workspace-left-offset": menuOpen && !isNarrowViewport ? `${SIDE_PANEL_WIDTH}px` : "0px",
          "--workspace-right-offset": displayMenuOpen && !isNarrowViewport ? `${SIDE_PANEL_WIDTH}px` : "0px",
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
            lessons={COURSE_LESSONS}
            selectedLessonId={selectedLessonId}
            selectedExerciseIndex={clampedExerciseIndex}
            selectedTrackId={selectedCourseTrack?.id ?? null}
            showProgressPrompt={!syncSession?.user}
            onProgressPrompt={openProgressSignIn}
            canAccessLesson={canAccessCourseLesson}
            onBlockedLesson={handleBlockedCourseLesson}
            onSelectTrack={goToCourseTrack}
            onSelectExercise={goToLessonStudyHome}
            onSelectService={goToTableOfContents}
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
            studyWorkspace={courseStudyWorkspace}
            selectedExerciseIndex={clampedExerciseIndex}
            showProgressPrompt={!syncSession?.user}
            onProgressPrompt={openProgressSignIn}
            onStudySkillChange={setCourseStudyWorkspace}
            onCourseTrack={goToSelectedLessonTrack}
            onCourseLesson={() => goToLessonStudyHome(selectedLessonId, clampedExerciseIndex)}
            onSelectExercise={(exerciseIndex, studyWorkspace) => goToLessonStudyHome(selectedLessonId, exerciseIndex, studyWorkspace)}
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
          key={accountMenuOpen ? "profile-panel" : "display-panel"}
          className="app-side-panel app-display-panel bg-white dark:bg-[var(--dark-bg)] border-l border-stone-200 dark:border-[var(--dark-border)]"
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
            overflow: "hidden",
            padding: 0
          }}
        >
          {renderDisplayMenu()}
        </aside>
      )}

    </div>
  );
}
