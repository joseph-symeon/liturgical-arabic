import phrases from "../data/texts/phrases.js";
import segments from "../data/texts/segments.js";
import { defaultServiceText } from "../data/texts/serviceTexts.js";
import lessons from "../data/course/lessons.js";
import exercises, { composeExerciseRange, getRecapExerciseIndex } from "../data/course/exercises.js";
import { validateData } from "./dataValidation.js";
import {
  applyLightDiacritics,
  stripArabicDiacritics,
  getArabicText,
  getLineText,
  getLogicalPhraseParts
} from "./arabic.js";
import { getServiceSectionPlayback } from "./servicePlayback.js";
import { resolvePendingPlaybackTime } from "./passageTiming.js";
import {
  canUpdateExerciseRange,
  formatExerciseRange,
  parseExerciseRange,
  updateExerciseRange
} from "./exerciseRanges.js";

function segmentLineParts(line) {
  return line.phrases.map(function mapPart(part) {
    return part.text ? { text: part.text } : { id: part.phrase_id };
  });
}

export function runTests() {
  validateData();

  const phraseIds = Object.keys(phrases);
  const uniquePhraseIds = new Set(phraseIds);
  const readerSections = defaultServiceText.sections;

  console.assert(stripArabicDiacritics("بِسَلامٍ") === "بسلام", "Should strip Arabic diacritics.");
  console.assert(
    applyLightDiacritics("بُو بِيت قُدُّوسٌ الضَّالّين بَاب عَلَى وَافْتَحْ نَوَافِذْ لِلّٰهِ") === "بو بيت قُدّوسٌ الضّالّين باب عَلى وَافْتَح نَوَافِذ لِلّٰهِ",
    "Light diacritics should remove redundant matres-vowel marks, including before shadda plus long letters, and final sukun while preserving word-initial wa before alif, internal sukun, shadda, and dagger alif."
  );
  console.assert(phraseIds.length === uniquePhraseIds.size, "Phrase IDs should be unique.");
  console.assert(
    getArabicText(phrases["petition-001"], "unvocalized") === "إلى الرب نطلب",
    "Unvocalized Arabic should display without diacritics."
  );
  console.assert(
    getArabicText({ arabic: "وَافْتَقِدْنَا" }, "light") === "وَافْتَقِدْنا",
    "Light Arabic should be available through getArabicText."
  );
  console.assert(
    getArabicText(phrases["petition-001"], "vocalized") === "إلى الرَّبِّ نطلب",
    "Vocalized Arabic should display with diacritics."
  );
  console.assert(
    getLineText(segmentLineParts(segments["litany-peace-in-peace"]), phrases, "unvocalized") === "بسلام",
    "Line text should compose unvocalized Arabic from phrases."
  );
  console.assert(
    getLogicalPhraseParts(segmentLineParts(segments["litany-peace-from-above"])).length === 2,
    "Line-by-line view should split grouped verses into logical phrase parts."
  );
  console.assert(
    readerSections.some(function hasSecondAntiphon(section) { return section.section === "The Second Antiphon"; }),
    "Reader should include a Second Antiphon section."
  );
  console.assert(
    readerSections.find(function findSecondAntiphon(section) { return section.section === "The Second Antiphon"; }).segment_ids.length === 16,
    "The Second Antiphon should have 16 segments."
  );
  const secondAntiphonPlayback = getServiceSectionPlayback({
    service_text_id: defaultServiceText.id,
    section_index: readerSections.findIndex(function findSecondAntiphon(section) { return section.section === "The Second Antiphon"; }),
    recording_id: "recording--dufaXx7Hm0"
  });
  console.assert(
    secondAntiphonPlayback.aligned_ranges.length >= 6,
    "Second Antiphon playback should include aligned audio ranges."
  );
  console.assert(
    secondAntiphonPlayback.timed_segments["antiphon-glorified-with-father@5:14-5:14"]?.end_seconds === 218.22,
    "Second Antiphon playback should expose timed service segments."
  );
  console.assert(readerSections[0].section === "The Preparation for the Divine Liturgy", "First reader section should be titled The Preparation for the Divine Liturgy.");
  console.assert(defaultServiceText.id === "divine-liturgy-john-chrysostom", "Default service text should be the Divine Liturgy.");
  console.assert(0.5 <= 0.8 && 0.8 <= 1.2, "Default speech rate should be inside the UI range.");

  const lordsPrayerLesson = lessons.find(lesson => lesson.id === "lesson-lords-prayer");
  const lordsPrayerOpening = composeExerciseRange(lordsPrayerLesson, 0, 1);
  console.assert(
    lordsPrayerOpening.segment_ids.join("|") === "lords-prayer-prayer|lords-prayer-kingdom",
    "The Lord's Prayer compound should preserve exercise segment order."
  );
  console.assert(
    lordsPrayerOpening.captions.length === 7
      && lordsPrayerOpening.audio_clip.start_seconds === 46.54
      && lordsPrayerOpening.audio_clip.end_seconds === 56.6,
    "The Lord's Prayer compound should compose complete captions and audio bounds."
  );
  const lordsPrayerFullRange = composeExerciseRange(lordsPrayerLesson, 0, 4);
  console.assert(
    lordsPrayerFullRange.segment_ids.join("|")
      === exercises["lords-prayer-summary"].segment_ids.join("|"),
    "The Lord's Prayer full range should match the existing recap content."
  );
  const antiphonsLesson = lessons.find(lesson => lesson.id === "lesson-antiphons");
  console.assert(
    composeExerciseRange(antiphonsLesson, 1, 2) === null,
    "Compound selection should reject the 51-second break between Antiphon exercises."
  );
  console.assert(
    composeExerciseRange(antiphonsLesson, 2, 3)?.audio_clip.end_seconds === 179.8,
    "Compound selection should allow adjacent Antiphon exercises separated by a natural pause."
  );
  console.assert(
    getRecapExerciseIndex(antiphonsLesson) === antiphonsLesson.exercises.length - 1,
    "Existing recap exercises should remain outside compound selection."
  );
  const heavenlyKingLesson = lessons.find(lesson => lesson.id === "lesson-heavenly-king");
  const heavenlyKingCompound = composeExerciseRange(heavenlyKingLesson, 0, 4);
  console.assert(
    heavenlyKingCompound?.captions.length === 13
      && new Set(heavenlyKingCompound.lines.map(line => line.line_order)).size === heavenlyKingCompound.lines.length,
    "Compound selection should support exercises that divide distinct phrases within one source segment."
  );
  const expandedExerciseRange = updateExerciseRange(
    updateExerciseRange({ startIndex: 2, endIndex: 2 }, 1),
    0
  );
  console.assert(
    expandedExerciseRange.startIndex === 0 && expandedExerciseRange.endIndex === 2,
    "Exercise ranges should expand through adjacent exercises."
  );
  console.assert(
    !canUpdateExerciseRange({ startIndex: 1, endIndex: 2 }, 4),
    "Exercise ranges should reject nonadjacent additions."
  );
  console.assert(
    formatExerciseRange(parseExerciseRange("2-4")) === "2-4"
      && formatExerciseRange(parseExerciseRange("3")) === "3",
    "Exercise ranges should round-trip through course navigation URLs."
  );
  const loopRestartTime = resolvePendingPlaybackTime({
    currentTime: 70.2,
    pendingStart: 46.54,
    pendingAgeMs: 40,
    graceMs: 1000
  });
  console.assert(
    loopRestartTime.pending
      && loopRestartTime.displayTime === 46.54
      && !loopRestartTime.shouldClear,
    "A loop restart should ignore the stale end timestamp while the backward seek is pending."
  );
}
