import React from "react";

const h = React.createElement;

export default function ReaderLayoutControls(props) {
  return h(
    "div",
    { className: "mb-8 flex justify-center", dir: "ltr" },
    h(
      "div",
      { className: "inline-flex rounded-full border border-stone-300 dark:border-stone-600 bg-stone-100 dark:bg-stone-700 p-1 text-sm" },
      h(
        "button",
        {
          className:
            props.readerLayout === "paragraph"
              ? "rounded-full bg-white dark:bg-stone-600 dark:text-stone-50 px-4 py-2 font-medium shadow-sm"
              : "rounded-full px-4 py-2 text-stone-600 dark:text-stone-400",
          onClick: function showParagraphs() { props.setReaderLayout("paragraph"); },
          type: "button"
        },
        "By paragraph"
      ),
      h(
        "button",
        {
          className:
            props.readerLayout === "line"
              ? "rounded-full bg-white dark:bg-stone-600 dark:text-stone-50 px-4 py-2 font-medium shadow-sm"
              : "rounded-full px-4 py-2 text-stone-600 dark:text-stone-400",
          onClick: function showLineByLine() { props.setReaderLayout("line"); },
          type: "button"
        },
        "By line"
      )
    )
  );
}
