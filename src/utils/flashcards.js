import phrases from "../data/texts/phrases.js";

export function getFlashcards() {
  return Object.keys(phrases).map(function mapPhraseId(id) {
    return Object.assign({ id }, phrases[id]);
  });
}

export function getLessonGroups(cards) {
  return [{ cards }];
}
