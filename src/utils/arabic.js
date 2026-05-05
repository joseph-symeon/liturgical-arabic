export function safeString(value) {
  if (value === null || typeof value === "undefined") return "";
  return String(value);
}

export function stripArabicDiacritics(text) {
  return safeString(text).replace(/[ً-ٰٟۖ-ۭ]/g, "");
}

export function getArabicText(phrase, arabicMode) {
  const vocalized = phrase.arabic;
  if (arabicMode === "unvocalized") return stripArabicDiacritics(vocalized);
  return vocalized;
}

export function getLineText(phrases, phrasesMap, arabicMode) {
  return phrases
    .map(function mapPart(part) {
      if (part.id && phrasesMap[part.id]) {
        return getArabicText(phrasesMap[part.id], arabicMode);
      }
      return part.text || "";
    })
    .join("");
}

export function getLogicalPhraseParts(phrases) {
  return phrases.filter(function keepAnnotationPart(part) {
    return Boolean(part.id);
  });
}

export function speakArabic(text, rate) {
  if (!window.speechSynthesis || !window.SpeechSynthesisUtterance) return;
  window.speechSynthesis.cancel();
  const utterance = new window.SpeechSynthesisUtterance(text);
  utterance.lang = "ar";
  utterance.rate = rate;
  window.speechSynthesis.speak(utterance);
}
