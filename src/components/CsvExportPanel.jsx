import React, { useRef, useState } from "react";

const h = React.createElement;

export default function CsvExportPanel(props) {
  const textAreaRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const csv = props.csv;

  function showAndSelectCsv() {
    setIsOpen(true);
    setNotice("CSV shown below. Select/copy manually if needed.");
    window.setTimeout(function selectCsvText() {
      if (textAreaRef.current) {
        textAreaRef.current.focus();
        textAreaRef.current.select();
      }
    }, 0);
  }

  return h(
    "div",
    { className: "mt-4" },
    h(
      "div",
      { className: "flex flex-wrap gap-2" },
      h(
        "button",
        {
          className: "rounded-xl bg-stone-950 dark:bg-stone-200 px-4 py-2 text-sm text-white dark:text-stone-900 hover:bg-stone-800 dark:hover:bg-white",
          onClick: props.onDownload,
          type: "button"
        },
        props.downloadLabel
      ),
      h(
        "button",
        {
          className:
            "rounded-xl border border-stone-300 dark:border-stone-600 px-4 py-2 text-sm text-stone-700 dark:text-stone-300 hover:bg-white dark:hover:bg-stone-700",
          onClick: showAndSelectCsv,
          type: "button"
        },
        "Select CSV"
      ),
      h(
        "button",
        {
          className:
            "rounded-xl border border-stone-300 dark:border-stone-600 px-4 py-2 text-sm text-stone-700 dark:text-stone-300 hover:bg-white dark:hover:bg-stone-700",
          onClick: function toggleCsv() {
            setIsOpen(function updateIsOpen(v) { return !v; });
          },
          type: "button"
        },
        isOpen ? "Hide CSV" : "Show CSV"
      )
    ),
    notice ? h("p", { className: "mt-2 text-sm text-stone-500 dark:text-stone-400" }, notice) : null,
    isOpen
      ? h("textarea", {
          ref: textAreaRef,
          className:
            "mt-3 h-64 w-full rounded-xl border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-900 p-3 font-mono text-xs text-stone-800 dark:text-stone-200",
          readOnly: true,
          value: csv
        })
      : null
  );
}
