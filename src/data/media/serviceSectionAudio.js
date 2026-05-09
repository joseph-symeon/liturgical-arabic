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
    section: "The First Antiphon",
    recording_id: "recording-KJKt0V4zJjY"
  },
  {
    service_text_id: "divine-liturgy-john-chrysostom",
    section: "The Little Litany",
    section_index: 4,
    recording_id: "recording--dufaXx7Hm0"
  },
  {
    service_text_id: "divine-liturgy-john-chrysostom",
    section: "The Second Antiphon",
    recording_id: "recording--dufaXx7Hm0"
  },
  {
    service_text_id: "divine-liturgy-john-chrysostom",
    section: "The Little Litany",
    section_index: 6,
    recording_id: "recording-fzQ4dmF-1Bg"
  },
  {
    service_text_id: "divine-liturgy-john-chrysostom",
    section: "The Entrance Hymn",
    recording_id: "recording-fzQ4dmF-1Bg"
  },
  {
    service_text_id: "divine-liturgy-john-chrysostom",
    section: "Thrice-Holy Hymn",
    recording_id: "recording-IFxF-vGExAI"
  },
  {
    service_text_id: "divine-liturgy-john-chrysostom",
    section: "The Reading of the Epistle",
    recording_id: "recording-JFawm57lics"
  },
  {
    service_text_id: "divine-liturgy-john-chrysostom",
    section: "The Reading of the Gospel",
    recording_id: "recording-xfUZh8ENiIQ"
  }
];

export function getServiceSectionAudio(serviceTextId, section, sectionIndex = null) {
  if (!serviceTextId || !section) return null;
  return serviceSectionAudioDefinitions.find(item => (
    item.service_text_id === serviceTextId
      && item.section === section.section
      && (item.section_index === undefined || item.section_index === sectionIndex)
  )) || null;
}
