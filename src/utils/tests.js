import phrases from "../data/texts/phrases.js";
import segments from "../data/texts/segments.js";
import { defaultServiceText } from "../data/texts/serviceTexts.js";
import { validateData } from "./dataValidation.js";
import {
  applyLightDiacritics,
  stripArabicDiacritics,
  getArabicText,
  getLineText,
  getLogicalPhraseParts
} from "./arabic.js";
import { getServiceSectionPlayback } from "./servicePlayback.js";

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
    applyLightDiacritics("بُو بِيت بَاب عَلَى وَافْتَحْ نَوَافِذْ لِلّٰهِ") === "بو بيت باب عَلى وَافْتَح نَوَافِذ لِلّٰهِ",
    "Light diacritics should remove redundant matres-vowel marks and final sukun while preserving word-initial wa before alif, internal sukun, shadda, and dagger alif."
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
    readerSections.some(function hasSecondAntiphon(section) { return section.section === "The Second Antiphon"; }),
    "Reader should include a Second Antiphon section."
  );
  console.assert(
    readerSections.find(function findSecondAntiphon(section) { return section.section === "The Second Antiphon"; }).segment_ids.length === 15,
    "The Second Antiphon should have 15 segments."
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
}
