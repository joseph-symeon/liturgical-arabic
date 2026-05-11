export function safeString(value) {
  if (value === null || typeof value === "undefined") return "";
  return String(value);
}

export function stripArabicDiacritics(text) {
  return safeString(text).replace(/[ً-ٰٟۖ-ۭ]/g, "");
}

function isArabicScriptCharacter(character) {
  return Boolean(character && /\p{Script=Arabic}/u.test(character));
}

export function applyLightDiacritics(text) {
  return safeString(text)
    .replace(/\u064E(?=[اى])/gu, function removeFathaBeforeLongA(mark, index, source) {
      if (source[index + 1] !== "ا") return "";

      const previousCharacter = source[index - 1];
      if (previousCharacter !== "و") return "";

      const characterBeforeWaw = source[index - 2];
      return isArabicScriptCharacter(characterBeforeWaw) ? "" : mark;
    })
    .replace(/\u064F(?=و)/g, "")
    .replace(/\u0650(?=ي)/g, "")
    .replace(/\u0652(?!\p{Script=Arabic})/gu, "");
}

export function getArabicText(phrase, arabicMode) {
  const vocalized = phrase.arabic;
  if (arabicMode === "light") return applyLightDiacritics(vocalized);
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
