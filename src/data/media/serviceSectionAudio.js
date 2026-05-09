// Service-section playback selections for the Reader.
// These choose a default recording for a section; timings still come from alignments.

export const serviceSectionAudioDefinitions = [
  {
    service_text_id: "divine-liturgy-john-chrysostom",
    section: "Blessed is the Kingdom",
    recording_id: "recording-KJKt0V4zJjY"
  },
  {
    service_text_id: "divine-liturgy-john-chrysostom",
    section: "Litany of Peace",
    recording_id: "recording-KJKt0V4zJjY"
  },
  {
    service_text_id: "divine-liturgy-john-chrysostom",
    section: "The Second Antiphon",
    recording_id: "recording--dufaXx7Hm0"
  }
];

export function getServiceSectionAudio(serviceTextId, section) {
  if (!serviceTextId || !section) return null;
  return serviceSectionAudioDefinitions.find(item => (
    item.service_text_id === serviceTextId
      && item.section === section.section
  )) || null;
}
