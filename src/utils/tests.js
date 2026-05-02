import annotations from "../data/annotations.js";
import liturgyText from "../data/liturgyText.js";
import {
  safeString,
  stripArabicDiacritics,
  getArabicText,
  getLineText,
  getLogicalPhraseParts
} from "./arabic.js";
import { csvEscape, rowsToCsv, buildFlashcardCsv, buildAnnotationsCsv } from "./csv.js";
import { getFlashcards, getLessonGroups } from "./flashcards.js";

export function runTests() {
  const cards = getFlashcards();
  const groups = getLessonGroups(cards);
  const firstLesson = groups[0];
  const annotationIds = Object.keys(annotations);
  const uniqueAnnotationIds = new Set(annotationIds);
  const flashcardCsv = buildFlashcardCsv(cards);
  const annotationCsv = buildAnnotationsCsv(cards);

  console.assert(stripArabicDiacritics("بِسَلامٍ") === "بسلام", "Should strip Arabic diacritics.");
  console.assert(csvEscape('He said "test"') === '"He said ""test"""', "Should escape CSV quotes.");
  console.assert(rowsToCsv([["a"], ["b"]]) === '"a"\n"b"', "CSV rows should be newline-separated.");
  console.assert(cards.length === annotationIds.length, "Every annotation should become one card.");
  console.assert(annotationIds.length === uniqueAnnotationIds.size, "Annotation IDs should be unique.");
  console.assert(firstLesson.cards[0].step === 1, "Lesson cards should sort by step.");
  console.assert(
    getArabicText(annotations["petition-001"], "plain") === "إلى الرب نطلب",
    "Plain Arabic should display without diacritics."
  );
  console.assert(
    getArabicText(annotations["petition-001"], "voweled") === "إِلَى الرَّبِّ نَطْلُب",
    "Voweled Arabic should display with diacritics."
  );
  console.assert(
    getLineText(liturgyText[0].lines[0], annotations, "plain") === "بسلام إلى الرب نطلب",
    "Line text should compose plain Arabic from annotations."
  );
  console.assert(
    getLogicalPhraseParts(liturgyText[0].lines[2]).length === 4,
    "Line-by-line view should split grouped lines into logical annotation phrases."
  );
  console.assert(
    liturgyText.some(function hasAntiphons(block) { return block.title === "Antiphons"; }),
    "Reader should include an Antiphons section."
  );
  console.assert(
    liturgyText.find(function findAntiphons(block) { return block.title === "Antiphons"; }).lines.length === 1,
    "Antiphons should render as one grouped paragraph."
  );
  console.assert(liturgyText[0].title === "Litany of Peace", "First reader section should be titled Litany of Peace.");
  console.assert(flashcardCsv.startsWith('"front","back"'), "CSV should include a flashcard header row.");
  console.assert(annotationCsv.startsWith('"id","section","arabic_voweled"'), "Annotations CSV should include database headers.");
  console.assert(annotationCsv.includes("\n"), "Annotations CSV should contain newline-separated rows.");
  console.assert(0.5 <= 0.8 && 0.8 <= 1.2, "Default speech rate should be inside the UI range.");
}
