import React from "react";
import ReactDOM from "react-dom/client";
import ArabicLiturgyReader from "./ArabicLiturgyReader.jsx";
import { runTests } from "./utils/tests.js";

if (import.meta.env.DEV) {
  runTests();
}

ReactDOM.createRoot(document.getElementById("root")).render(
  React.createElement(React.StrictMode, null,
    React.createElement(ArabicLiturgyReader)
  )
);
