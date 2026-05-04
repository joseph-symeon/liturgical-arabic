import React from "react";
import { getLessonGroups } from "../utils/flashcards.js";

const h = React.createElement;

export default function CourseView(props) {
  const lessonGroups = getLessonGroups(props.cards);

  return h(
    "section",
    { className: "mt-10 rounded-2xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 p-5", dir: "ltr" },
    h(
      "div",
      { className: "mb-5" },
      h(
        "p",
        { className: "text-sm font-semibold uppercase tracking-[0.18em] text-amber-800 dark:text-amber-400" },
        "Course View"
      ),
      h(
        "h2",
        { className: "mt-1 text-2xl font-semibold text-stone-950 dark:text-stone-50" },
        "Unit 1: Litany of Peace"
      ),
      h(
        "p",
        { className: "mt-2 text-sm text-stone-600 dark:text-stone-400" },
        "Each card is one phrase. Lesson grouping will be driven by lessons.js."
      )
    ),
    h(
      "div",
      { className: "space-y-5" },
      lessonGroups.map(function renderLessonGroup(group, i) {
        return h(
          "div",
          { key: i, className: "space-y-3" },
          group.cards.map(function renderCard(card) {
            return h(
              "div",
              { key: card.id, className: "rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 p-4" },
              h(
                "p",
                { className: "text-right text-2xl leading-relaxed", dir: "rtl" },
                card.arabic_voweled || card.arabic_unvoweled
              ),
              h("p", { className: "mt-2 font-medium text-stone-950 dark:text-stone-50" }, card.translation),
              h("p", { className: "mt-1 text-sm text-stone-500 dark:text-stone-400" }, "Literal: ", card.literal)
            );
          })
        );
      })
    )
  );
}
