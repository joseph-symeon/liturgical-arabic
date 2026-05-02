import { safeString, stripArabicDiacritics } from "./arabic.js";

export function csvEscape(value) {
  return '"' + safeString(value).replace(/"/g, '""') + '"';
}

export function rowToCsv(row) {
  return row.map(csvEscape).join(",");
}

export function rowsToCsv(rows) {
  return rows.map(rowToCsv).join("\n");
}

export function buildFlashcardCsv(cards) {
  const header = ["front", "back", "literal", "deck", "section", "unit", "tags"];
  const rows = cards.map(function mapCard(card) {
    return [
      stripArabicDiacritics(card.arabicVoweled || card.arabicPlain),
      card.translation,
      card.literal,
      card.deck,
      card.section,
      card.unit,
      card.tags.join(" ")
    ];
  });
  return rowsToCsv([header].concat(rows));
}

export function buildAnnotationsCsv(cards) {
  const header = [
    "id",
    "section",
    "arabic_voweled",
    "arabic_plain",
    "translation",
    "literal",
    "unit",
    "lesson",
    "step",
    "deck",
    "tags"
  ];
  const rows = cards.map(function mapCard(card) {
    return [
      card.id,
      card.section,
      card.arabicVoweled || card.arabicPlain,
      card.arabicPlain,
      card.translation,
      card.literal,
      card.unit,
      card.lesson,
      card.step,
      card.deck,
      card.tags.join(", ")
    ];
  });
  return rowsToCsv([header].concat(rows));
}

export function downloadCsv(filename, csv) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function downloadAnnotationsDatabase(cards) {
  downloadCsv("annotations-database.csv", buildAnnotationsCsv(cards));
}

export function downloadFlashcards(cards) {
  downloadCsv("litany-of-peace-flashcards.csv", buildFlashcardCsv(cards));
}
