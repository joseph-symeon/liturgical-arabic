import phrases from "../data/phrases.js";
import segments from "../data/segments.js";
import liturgySections from "../data/liturgySections.js";
import { validateData } from "./dataValidation.js";
import {
  safeString,
  stripArabicDiacritics,
  getArabicText,
  getLineText,
  getLogicalPhraseParts
} from "./arabic.js";
import { csvEscape, rowsToCsv, buildFlashcardCsv, buildAnnotationsCsv } from "./csv.js";
import { getFlashcards } from "./flashcards.js";

function segmentLineParts(line) {
  return line.phrases.map(function mapPart(part) {
    return part.text ? { text: part.text } : { id: part.phrase_id };
  });
}

export function runTests() {
  validateData();

  const cards = getFlashcards();
  const phraseIds = Object.keys(phrases);
  const uniquePhraseIds = new Set(phraseIds);
  const flashcardCsv = buildFlashcardCsv(cards);
  const annotationCsv = buildAnnotationsCsv(cards);

  console.assert(stripArabicDiacritics("بِسَلامٍ") === "بسلام", "Should strip Arabic diacritics.");
  console.assert(csvEscape('He said "test"') === '"He said ""test"""', "Should escape CSV quotes.");
  console.assert(rowsToCsv([["a"], ["b"]]) === '"a"\n"b"', "CSV rows should be newline-separated.");
  console.assert(cards.length === phraseIds.length, "Every phrase should become one card.");
  console.assert(phraseIds.length === uniquePhraseIds.size, "Phrase IDs should be unique.");
  console.assert(
    getArabicText(phrases["petition-001"], "unvocalized") === "إلى الرب نطلب",
    "Unvocalized Arabic should display without diacritics."
  );
  console.assert(
    getArabicText(phrases["petition-001"], "vocalized") === "إِلَى الرَّبِّ نَطْلُب",
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
    liturgySections.some(function hasSecondAntiphon(section) { return section.section === "The Second Antiphon"; }),
    "Reader should include a Second Antiphon section."
  );
  console.assert(
    liturgySections.find(function findSecondAntiphon(section) { return section.section === "The Second Antiphon"; }).segment_ids.length === 16,
    "The Second Antiphon should have 16 segments."
  );
  console.assert(liturgySections[0].section === "The Preparation for the Divine Liturgy", "First reader section should be titled The Preparation for the Divine Liturgy.");
  console.assert(flashcardCsv.startsWith('"front","back"'), "CSV should include a flashcard header row.");
  console.assert(annotationCsv.startsWith('"id","arabic"'), "Phrases CSV should include database headers.");
  console.assert(annotationCsv.includes("\n"), "Phrases CSV should contain newline-separated rows.");
  console.assert(0.5 <= 0.8 && 0.8 <= 1.2, "Default speech rate should be inside the UI range.");
}
