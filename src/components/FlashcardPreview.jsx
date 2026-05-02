import React, { useState } from "react";
import CsvExportPanel from "./CsvExportPanel.jsx";
import { buildFlashcardCsv, downloadFlashcards } from "../utils/csv.js";

const h = React.createElement;

export default function FlashcardPreview(props) {
  const [isOpen, setIsOpen] = useState(false);
  const cards = props.cards;
  const csv = buildFlashcardCsv(cards);

  return h(
    "section",
    { className: "mt-10 rounded-2xl border border-stone-200 bg-stone-50 p-5", dir: "ltr" },
    h(
      "div",
      null,
      h("h2", { className: "text-lg font-semibold text-stone-950" }, "Flashcards from this text"),
      h(
        "p",
        { className: "mt-1 text-sm text-stone-600" },
        "These cards are generated from the same annotation data used by the hover translations."
      ),
      h(
        "div",
        { className: "mt-4" },
        h(
          "button",
          {
            className:
              "rounded-xl border border-stone-300 px-4 py-2 text-sm text-stone-700 hover:bg-white",
            onClick: function togglePreview() {
              setIsOpen(function updateIsOpen(v) { return !v; });
            },
            type: "button"
          },
          isOpen ? "Hide card preview" : "Preview cards"
        )
      ),
      isOpen
        ? h(
            "div",
            { className: "mt-5 grid gap-3 md:grid-cols-2" },
            cards.map(function renderCard(card) {
              return h(
                "div",
                { key: card.id, className: "rounded-xl border border-stone-200 bg-white p-4" },
                h(
                  "p",
                  { className: "text-right text-2xl leading-relaxed", dir: "rtl" },
                  card.arabicVoweled || card.arabicPlain
                ),
                h("p", { className: "mt-3 font-medium text-stone-950" }, card.translation),
                h("p", { className: "mt-1 text-sm text-stone-500" }, "Literal: ", card.literal),
                h(
                  "p",
                  { className: "mt-3 text-xs uppercase tracking-wide text-stone-400" },
                  card.deck,
                  " · ",
                  card.unit
                )
              );
            })
          )
        : null,
      h(CsvExportPanel, {
        csv,
        downloadLabel: "Download flashcard CSV",
        onDownload: function exportCards() {
          downloadFlashcards(cards);
        }
      })
    )
  );
}
