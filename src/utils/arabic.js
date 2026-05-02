export function safeString(value) {
  if (value === null || typeof value === "undefined") return "";
  return String(value);
}

export function stripArabicDiacritics(text) {
  return safeString(text).replace(/[ً-ٰٟۖ-ۭ]/g, "");
}

export function getArabicText(annotation, arabicMode) {
  const voweled = annotation.arabicVoweled || annotation.arabicPlain;
  if (arabicMode === "plain") return stripArabicDiacritics(voweled);
  return voweled;
}

export function getLineText(phrases, annotations, arabicMode) {
  return phrases
    .map(function mapPart(part) {
      if (part.id && annotations[part.id]) {
        return getArabicText(annotations[part.id], arabicMode);
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
