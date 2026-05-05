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
  const header = ["front", "back", "literal", "tags"];
  const rows = cards.map(function mapCard(card) {
    return [
      stripArabicDiacritics(card.arabic),
      card.translation,
      card.literal,
      card.tags.join(" ")
    ];
  });
  return rowsToCsv([header].concat(rows));
}

export function buildAnnotationsCsv(cards) {
  const header = ["id", "arabic", "translation", "literal", "tags"];
  const rows = cards.map(function mapCard(card) {
    return [
      card.id,
      card.arabic,
      card.translation,
      card.literal,
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
  downloadCsv("phrases-database.csv", buildAnnotationsCsv(cards));
}

export function downloadFlashcards(cards) {
  downloadCsv("flashcards.csv", buildFlashcardCsv(cards));
}
