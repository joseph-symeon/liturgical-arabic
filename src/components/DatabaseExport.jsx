import React from "react";
import CsvExportPanel from "./CsvExportPanel.jsx";
import { buildAnnotationsCsv, downloadAnnotationsDatabase } from "../utils/csv.js";

const h = React.createElement;

export default function DatabaseExport(props) {
  const cards = props.cards;
  const csv = buildAnnotationsCsv(cards);

  return h(
    "section",
    { className: "mt-10 rounded-2xl border border-stone-200 bg-white p-5", dir: "ltr" },
    h(
      "div",
      null,
      h("h2", { className: "text-lg font-semibold text-stone-950" }, "Annotation database"),
      h(
        "p",
        { className: "mt-1 text-sm text-stone-600" },
        "Export the full annotation table for Notion. One row equals one curriculum step."
      ),
      h(CsvExportPanel, {
        csv,
        downloadLabel: "Download annotation database CSV",
        onDownload: function exportDatabase() {
          downloadAnnotationsDatabase(cards);
        }
      })
    )
  );
}
