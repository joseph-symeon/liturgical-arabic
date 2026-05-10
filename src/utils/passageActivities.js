export const PASSAGE_ACTIVITY_TYPES = {
  readListen: "read-listen",
  phraseCaptions: "phrase-captions",
  arrange: "arrange",
  typeArabic: "type-arabic",
  matching: "matching",
  cloze: "cloze"
};

export const PASSAGE_ACTIVITY_LABELS = {
  [PASSAGE_ACTIVITY_TYPES.readListen]: "Read",
  [PASSAGE_ACTIVITY_TYPES.phraseCaptions]: "Captions",
  [PASSAGE_ACTIVITY_TYPES.arrange]: "Arrange",
  [PASSAGE_ACTIVITY_TYPES.typeArabic]: "Trace",
  [PASSAGE_ACTIVITY_TYPES.matching]: "Matching",
  [PASSAGE_ACTIVITY_TYPES.cloze]: "Cloze"
};

export function getPassageActivityLabel(activityOrType) {
  const type = typeof activityOrType === "string" ? activityOrType : activityOrType?.type;
  return PASSAGE_ACTIVITY_LABELS[type] || type || null;
}

export function isReadListenActivity(activityType) {
  return activityType === PASSAGE_ACTIVITY_TYPES.readListen;
}

export function isPhraseCaptionsActivity(activityType) {
  return activityType === PASSAGE_ACTIVITY_TYPES.phraseCaptions;
}
