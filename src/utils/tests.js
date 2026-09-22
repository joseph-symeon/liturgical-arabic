import phrases from "../data/texts/phrases.js";
import segments from "../data/texts/segments.js";
import { defaultServiceText } from "../data/texts/serviceTexts.js";
import lessons from "../data/course/lessons.js";
import exercises, { composeExerciseRange, getRecapExerciseIndex } from "../data/course/exercises.js";
import { getExerciseTitle } from "../components/course/exerciseTitles.js";
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
import { getReaderBackDestination, opensServiceSectionDirectly } from "./serviceNavigation.js";
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
  console.assert(
    applyLightDiacritics("ٱرْحَمْ") === "ارْحَم",
    "Light diacritics should replace alif wasla with a plain alif."
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
  console.assert(
    opensServiceSectionDirectly({ sections: [{}] })
      && !opensServiceSectionDirectly({ sections: [{}, {}] })
      && !opensServiceSectionDirectly({ sections: [] }),
    "Only one-section services should bypass their table of contents."
  );
  console.assert(
    getReaderBackDestination({ sections: [{}] }, 0) === "reader-index"
      && getReaderBackDestination({ sections: [{}, {}] }, 0) === "table-of-contents"
      && getReaderBackDestination({ sections: [{}, {}] }, null) === "reader-index",
    "Reader back navigation should target the nearest page that actually exists."
  );

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
  const firstAntiphonLesson = lessons.find(lesson => lesson.id === "lesson-antiphons");
  const secondAntiphonLesson = lessons.find(lesson => lesson.id === "lesson-second-antiphon");
  console.assert(
    firstAntiphonLesson.title === "The First Antiphon"
      && firstAntiphonLesson.exercises.length === 1
      && secondAntiphonLesson.title === "The Second Antiphon"
      && secondAntiphonLesson.exercises.length === 6,
    "The Antiphons should be split into separate First and Second Antiphon lessons."
  );
  const fullSecondAntiphon = composeExerciseRange(secondAntiphonLesson, 0, 5);
  console.assert(
    fullSecondAntiphon?.audio_clip.start_seconds === 81
      && fullSecondAntiphon.audio_clip.end_seconds === 218.22
      && fullSecondAntiphon.source_exercise_ids.length === 6,
    "Second Antiphon Select all should span continuously from its earliest to latest phrase."
  );
  const throughThePrayersExercise = exercises["dismissal-through-the-prayers-summary"];
  console.assert(
    throughThePrayersExercise.captions.length === 8
      && throughThePrayersExercise.captions[6]?.phrase_id === "dismissal-and-save-us-001"
      && throughThePrayersExercise.captions[7]?.phrase_id === "amen-001",
    "Through the prayers karaoke should retain the dismissal-specific save-us phrase and final Amen timing."
  );
  console.assert(
    getRecapExerciseIndex(secondAntiphonLesson) === null,
    "The Second Antiphon should expose all six exercises without a synthetic recap."
  );
  console.assert(
    getExerciseTitle(secondAntiphonLesson, 5) === "Glorified together with",
    "A no-recap lesson should derive its final exercise title from its opening phrases."
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
  const rangeWithoutFirstExercise = updateExerciseRange(
    { startIndex: 0, endIndex: 4 },
    0
  );
  console.assert(
    rangeWithoutFirstExercise.startIndex === 1 && rangeWithoutFirstExercise.endIndex === 4,
    "Deselecting the first exercise should preserve the rest of a full selection."
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
