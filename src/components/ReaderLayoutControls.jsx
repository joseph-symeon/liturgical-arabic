import React from "react";

const h = React.createElement;

export default function ReaderLayoutControls(props) {
  return h(
    "div",
    { className: "mb-8 flex justify-center", dir: "ltr" },
    h(
      "div",
      { className: "inline-flex rounded-full border border-stone-300 bg-stone-100 p-1 text-sm" },
      h(
        "button",
        {
          className:
            props.readerLayout === "grouped"
              ? "rounded-full bg-white px-4 py-2 font-medium shadow-sm"
              : "rounded-full px-4 py-2 text-stone-600",
          onClick: function showGrouped() { props.setReaderLayout("grouped"); },
          type: "button"
        },
        "Grouped"
      ),
      h(
        "button",
        {
          className:
            props.readerLayout === "line"
              ? "rounded-full bg-white px-4 py-2 font-medium shadow-sm"
              : "rounded-full px-4 py-2 text-stone-600",
          onClick: function showLineByLine() { props.setReaderLayout("line"); },
          type: "button"
        },
        "Line by line"
      )
    )
  );
}
