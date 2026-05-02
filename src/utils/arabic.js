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

export function getLineText(line, annotations, arabicMode) {
  return line
    .map(function mapPart(part) {
      if (part.annotationId && annotations[part.annotationId]) {
        return getArabicText(annotations[part.annotationId], arabicMode);
      }
      return part.text || "";
    })
    .join("");
}

export function getLogicalPhraseParts(line) {
  return line.filter(function keepAnnotationPart(part) {
    return Boolean(part.annotationId);
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
