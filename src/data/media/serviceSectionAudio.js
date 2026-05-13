// Service-section playback selections for the Reader.
// These choose a default recording for a section; timings still come from alignments.

export const serviceSectionAudioDefinitions = [
  {
    service_text_id: "divine-liturgy-john-chrysostom",
    section_id: "blessed-is-the-kingdom",
    recording_id: "recording-KJKt0V4zJjY"
  },
  {
    service_text_id: "divine-liturgy-john-chrysostom",
    section_id: "litany-of-peace",
    recording_id: "recording-KJKt0V4zJjY"
  },
  {
    service_text_id: "divine-liturgy-john-chrysostom",
    section_id: "first-antiphon",
    recording_id: "recording-KJKt0V4zJjY"
  },
  {
    service_text_id: "divine-liturgy-john-chrysostom",
    section_id: "little-litany-after-first-antiphon",
    recording_id: "recording--dufaXx7Hm0"
  },
  {
    service_text_id: "divine-liturgy-john-chrysostom",
    section_id: "second-antiphon",
    recording_id: "recording--dufaXx7Hm0"
  },
  {
    service_text_id: "divine-liturgy-john-chrysostom",
    section_id: "little-litany-after-second-antiphon",
    recording_id: "recording-fzQ4dmF-1Bg"
  },
  {
    service_text_id: "divine-liturgy-john-chrysostom",
    section_id: "entrance-hymn",
    recording_id: "recording-fzQ4dmF-1Bg"
  },
  {
    service_text_id: "divine-liturgy-john-chrysostom",
    section_id: "trisagion-hymn",
    recording_id: "recording-IFxF-vGExAI"
  },
  {
    service_text_id: "divine-liturgy-john-chrysostom",
    section_id: "reading-epistle",
    recording_id: "recording-JFawm57lics"
  },
  {
    service_text_id: "divine-liturgy-john-chrysostom",
    section_id: "reading-gospel",
    recording_id: "recording-xfUZh8ENiIQ"
  }
];

export function getServiceSectionAudio(serviceTextId, section, sectionIndex = null) {
  if (!serviceTextId || !section) return null;
  return serviceSectionAudioDefinitions.find(item => (
    item.service_text_id === serviceTextId
      && (
        item.section_id
          ? item.section_id === section.section_id
          : item.section === section.section
            && (item.section_index === undefined || item.section_index === sectionIndex)
      )
  )) || null;
}
