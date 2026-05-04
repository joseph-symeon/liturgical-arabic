import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { runTests } from "./utils/tests.js";

if (import.meta.env.DEV) {
  runTests();
}

ReactDOM.createRoot(document.getElementById("root")).render(
  React.createElement(React.StrictMode, null,
    React.createElement(App)
  )
);
