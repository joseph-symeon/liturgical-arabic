import annotations from "../data/annotations.js";

export function getFlashcards() {
  return Object.keys(annotations).map(function mapAnnotationId(id) {
    return Object.assign({ id }, annotations[id]);
  });
}

export function getLessonGroups(cards) {
  const grouped = cards.reduce(function reduceCards(groups, card) {
    if (!groups[card.lesson]) groups[card.lesson] = [];
    groups[card.lesson].push(card);
    return groups;
  }, {});

  return Object.keys(grouped)
    .sort()
    .map(function mapLesson(lesson) {
      return {
        lesson,
        cards: grouped[lesson].slice().sort(function sortSteps(a, b) {
          return a.step - b.step;
        })
      };
    });
}
