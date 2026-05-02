import React from "react";
import { getLessonGroups } from "../utils/flashcards.js";

const h = React.createElement;

export default function CourseView(props) {
  const lessonGroups = getLessonGroups(props.cards);

  return h(
    "section",
    { className: "mt-10 rounded-2xl border border-stone-200 bg-white p-5", dir: "ltr" },
    h(
      "div",
      { className: "mb-5" },
      h(
        "p",
        { className: "text-sm font-semibold uppercase tracking-[0.18em] text-amber-800" },
        "Course View"
      ),
      h(
        "h2",
        { className: "mt-1 text-2xl font-semibold text-stone-950" },
        "Unit 1: Litany of Peace"
      ),
      h(
        "p",
        { className: "mt-2 text-sm text-stone-600" },
        "Each step is one annotation row. Lessons are just ordered groups of those steps."
      )
    ),
    h(
      "div",
      { className: "space-y-5" },
      lessonGroups.map(function renderLessonGroup(group) {
        return h(
          "section",
          { key: group.lesson, className: "rounded-2xl border border-stone-200 bg-stone-50 p-4" },
          h("h3", { className: "font-semibold text-stone-950" }, group.lesson),
          h(
            "div",
            { className: "mt-3 space-y-3" },
            group.cards.map(function renderStep(card) {
              return h(
                "div",
                { key: card.id, className: "rounded-xl border border-stone-200 bg-white p-4" },
                h(
                  "div",
                  { className: "mb-2 text-xs font-semibold uppercase tracking-wide text-stone-400" },
                  "Step ",
                  card.step
                ),
                h(
                  "p",
                  { className: "text-right text-2xl leading-relaxed", dir: "rtl" },
                  card.arabicVoweled || card.arabicPlain
                ),
                h("p", { className: "mt-2 font-medium text-stone-950" }, card.translation),
                h("p", { className: "mt-1 text-sm text-stone-500" }, "Literal: ", card.literal)
              );
            })
          )
        );
      })
    )
  );
}
