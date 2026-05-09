export const PASSAGE_ACTIVITY_TYPES = {
  readListen: "read-listen",
  phraseCaptions: "phrase-captions",
  arrange: "arrange",
  cloze: "cloze"
};

export const PASSAGE_ACTIVITY_LABELS = {
  [PASSAGE_ACTIVITY_TYPES.readListen]: "Read & Listen",
  [PASSAGE_ACTIVITY_TYPES.phraseCaptions]: "Phrase Captions",
  [PASSAGE_ACTIVITY_TYPES.arrange]: "Arrange",
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
