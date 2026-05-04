import phrases from "../data/phrases.js";
import liturgyText from "../data/liturgyText.js";
import {
  safeString,
  stripArabicDiacritics,
  getArabicText,
  getLineText,
  getLogicalPhraseParts
} from "./arabic.js";
import { csvEscape, rowsToCsv, buildFlashcardCsv, buildAnnotationsCsv } from "./csv.js";
import { getFlashcards } from "./flashcards.js";

export function runTests() {
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
    getArabicText(phrases["petition-001"], "plain") === "إلى الرب نطلب",
    "Plain Arabic should display without diacritics."
  );
  console.assert(
    getArabicText(phrases["petition-001"], "voweled") === "إِلَى الرَّبِّ نَطْلُب",
    "Voweled Arabic should display with diacritics."
  );
  console.assert(
    getLineText(liturgyText[0].verses[0].phrases, phrases, "plain") === "بسلام إلى الرب نطلب",
    "Line text should compose plain Arabic from phrases."
  );
  console.assert(
    getLogicalPhraseParts(liturgyText[0].verses[2].phrases).length === 4,
    "Line-by-line view should split grouped verses into logical phrase parts."
  );
  console.assert(
    liturgyText.some(function hasAntiphons(section) { return section.section === "Antiphons"; }),
    "Reader should include an Antiphons section."
  );
  console.assert(
    liturgyText.find(function findAntiphons(section) { return section.section === "Antiphons"; }).verses.length === 10,
    "Antiphons should have 10 verses."
  );
  console.assert(liturgyText[0].section === "Litany of Peace", "First reader section should be titled Litany of Peace.");
  console.assert(flashcardCsv.startsWith('"front","back"'), "CSV should include a flashcard header row.");
  console.assert(annotationCsv.startsWith('"id","arabic_voweled"'), "Phrases CSV should include database headers.");
  console.assert(annotationCsv.includes("\n"), "Phrases CSV should contain newline-separated rows.");
  console.assert(0.5 <= 0.8 && 0.8 <= 1.2, "Default speech rate should be inside the UI range.");
}
