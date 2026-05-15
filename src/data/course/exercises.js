// Editable course exercise definitions.
// This file is not generated from CSV.

import segments from '../texts/segments.js';
import phrases from '../texts/phrases.js';
import alignments from '../media/alignments.js';
import {
  getAlignmentRange,
  findServiceAlignmentRange,
  getPhraseTimingsForSegmentIds
} from '../../utils/alignmentRanges.js';
import { getRangeBounds } from '../../utils/alignmentTiming.js';
import { PASSAGE_ACTIVITY_LABELS, PASSAGE_ACTIVITY_TYPES } from '../../utils/passageActivities.js';

const GREAT_COMPLINE_MEDIA = {
  recording_id: "recording-g_4r4wzt2Vg",
  alignment_id: "alignment-great-compline-g_4r4wzt2Vg-v1",
  default_playback_rate: 1
};

const GREAT_COMPLINE_PSALMS_MEDIA = {
  recording_id: "recording-4-6-12-2_xJIjyydso",
  alignment_id: "alignment-great-compline-4-6-12-2_xJIjyydso-come-worship-v1",
  default_playback_rate: 1
};

const GREAT_COMPLINE_DISMISSAL_MEDIA = {
  recording_id: "recording-PpavnXyf8fY",
  alignment_id: "alignment-great-compline-PpavnXyf8fY-dismissal-v1",
  default_playback_rate: 1
};

const PARAKLESIS_ST_MARINA_MEDIA = {
  recording_id: "recording-oLdHO28NWuM",
  alignment_id: "alignment-paraklesis-st-marina-oLdHO28NWuM-v1",
  default_playback_rate: 1
};

const SECOND_ANTIPHON_MEDIA = {
  recording_id: "recording--dufaXx7Hm0",
  alignment_id: "alignment-divine-liturgy--dufaXx7Hm0-antiphons-v1",
  default_playback_rate: 1
};

export const exerciseDefinitions = [
  {
    "id": "antiphon-only-begotten",
    "segment_ids": [
      "antiphon-word-of-god-only-begotten",
      "antiphon-deathless"
    ],
    "service_text_id": "divine-liturgy-john-chrysostom",
    "service_range": {
      "section_id": "second-antiphon",
      "start_segment_id": "antiphon-word-of-god-only-begotten",
      "end_segment_id": "antiphon-deathless"
    }
  },
  {
    "id": "antiphon-save-us-son-of-god",
    "segment_ids": [
      "entrance-hymn-save-us-son-of-god",
      "course-entrance-hymn-risen-sundays",
      "course-entrance-hymn-wondrous-weekdays",
      "entrance-hymn-risen-alleluia"
    ],
    "media": SECOND_ANTIPHON_MEDIA
  },
  {
    "id": "antiphon-accepted-incarnate",
    "segment_ids": [
      "antiphon-accepted-incarnate",
      "antiphon-from-theotokos"
    ],
    "service_text_id": "divine-liturgy-john-chrysostom",
    "service_range": {
      "section_id": "second-antiphon",
      "start_segment_id": "antiphon-accepted-incarnate",
      "end_segment_id": "antiphon-from-theotokos"
    }
  },
  {
    "id": "antiphon-became-man",
    "segment_ids": [
      "antiphon-became-man",
      "antiphon-crucified"
    ],
    "service_text_id": "divine-liturgy-john-chrysostom",
    "service_range": {
      "section_id": "second-antiphon",
      "start_segment_id": "antiphon-became-man",
      "end_segment_id": "antiphon-crucified"
    }
  },
  {
    "id": "antiphon-trampled-death",
    "segment_ids": [
      "antiphon-trampled-death",
      "antiphon-one-of-trinity"
    ],
    "service_text_id": "divine-liturgy-john-chrysostom",
    "service_range": {
      "section_id": "second-antiphon",
      "start_segment_id": "antiphon-trampled-death",
      "end_segment_id": "antiphon-one-of-trinity"
    }
  },
  {
    "id": "antiphon-glorified-with-father",
    "segment_ids": [
      "antiphon-glorified-with-father"
    ],
    "service_text_id": "divine-liturgy-john-chrysostom",
    "service_range": {
      "section_id": "second-antiphon",
      "start_segment_id": "antiphon-glorified-with-father",
      "end_segment_id": "antiphon-glorified-with-father"
    }
  },
  {
    "id": "antiphons-summary",
    "segment_ids": [
      "antiphon-word-of-god-only-begotten",
      "antiphon-deathless",
      "antiphon-accepted-incarnate",
      "antiphon-from-theotokos",
      "antiphon-became-man",
      "antiphon-crucified",
      "antiphon-trampled-death",
      "antiphon-one-of-trinity",
      "antiphon-glorified-with-father"
    ],
    "service_text_id": "divine-liturgy-john-chrysostom",
    "service_range": {
      "section_id": "second-antiphon",
      "start_segment_id": "antiphon-word-of-god-only-begotten",
      "end_segment_id": "antiphon-glorified-with-father"
    }
  },
  {
    "id": "litany-peace-peace-from-above",
    "segment_ids": [
      "litany-peace-from-above"
    ]
  },
  {
    "id": "litany-peace-whole-world",
    "segment_ids": [
      "litany-peace-whole-world"
    ]
  },
  {
    "id": "litany-peace-holy-house",
    "segment_ids": [
      "litany-peace-holy-house"
    ]
  },
  {
    "id": "litany-peace-father-metropolitan",
    "segment_ids": [
      "litany-peace-father-metropolitan"
    ]
  },
  {
    "id": "litany-peace-country-authorities",
    "segment_ids": [
      "litany-peace-country-authorities"
    ]
  },
  {
    "id": "litany-peace-this-city",
    "segment_ids": [
      "litany-peace-this-city"
    ]
  },
  {
    "id": "litany-peace-healthful-seasons",
    "segment_ids": [
      "litany-peace-healthful-seasons"
    ]
  },
  {
    "id": "litany-peace-travelers",
    "segment_ids": [
      "litany-peace-travelers"
    ]
  },
  {
    "id": "litany-peace-deliverance",
    "segment_ids": [
      "litany-peace-deliverance"
    ]
  },
  {
    "id": "litany-peace-help-save",
    "segment_ids": [
      "litany-peace-help-save"
    ]
  },
  {
    "id": "litany-peace-priest-doxology",
    "segment_ids": [
      "litany-peace-priest-doxology"
    ]
  },
  {
    "id": "litany-of-peace",
    "segment_ids": [
      "litany-peace-in-peace",
      "litany-peace-from-above",
      "litany-peace-whole-world",
      "litany-peace-holy-house",
      "litany-peace-father-metropolitan",
      "litany-peace-country-authorities",
      "litany-peace-this-city",
      "litany-peace-healthful-seasons",
      "litany-peace-travelers",
      "litany-peace-deliverance",
      "litany-peace-help-save",
      "litany-peace-calling-remembrance",
      "litany-peace-priest-doxology",
      "litany-peace-choir-amen"
    ],
    "show_speakers": true
  },
  {
    "id": "entrance-bless-master",
    "segment_ids": [
      "entrance-bless-master"
    ]
  },
  {
    "id": "entrance-blessed-entrance",
    "segment_ids": [
      "entrance-blessed-entrance"
    ]
  },
  {
    "id": "entrance-wisdom-stand-upright",
    "segment_ids": [
      "entrance-wisdom-stand-upright",
      "entrance-hymn-come-worship"
    ]
  },
  {
    "id": "entrance-save-us-son-of-god",
    "segment_ids": [
      "entrance-hymn-save-us-son-of-god",
      "course-entrance-hymn-risen-sundays",
      "course-entrance-hymn-wondrous-weekdays",
      "entrance-hymn-risen-alleluia"
    ]
  },
  {
    "id": "entrance-holy-art-benediction",
    "segment_ids": [
      "entrance-hymn-holy-art-benediction",
      "entrance-hymn-deacon-ages",
      "entrance-hymn-final-amen"
    ]
  },
  {
    "id": "entrance-summary",
    "segment_ids": [
      "entrance-amen",
      "entrance-bless-master",
      "entrance-blessed-entrance",
      "entrance-wisdom-stand-upright",
      "entrance-hymn-come-worship",
      "entrance-hymn-save-us-son-of-god",
      "course-entrance-hymn-risen-sundays",
      "course-entrance-hymn-wondrous-weekdays",
      "entrance-hymn-risen-alleluia",
      "entrance-hymn-holy-art-benediction",
      "entrance-hymn-deacon-ages",
      "entrance-hymn-final-amen"
    ],
    "show_speakers": true
  },
  {
    "id": "preparation-glory",
    "segment_ids": [
      "preparation-glory-highest"
    ]
  },
  {
    "id": "preparation-open-my-lips",
    "segment_ids": [
      "preparation-open-my-lips"
    ]
  },
  {
    "id": "come-let-us-worship",
    "segment_ids": [
      "course-come-worship-god-king",
      "course-come-worship-christ-king",
      "course-come-worship-christ-himself"
    ],
    "media": GREAT_COMPLINE_PSALMS_MEDIA
  },
  {
    "id": "first-antiphon-through-theotokos",
    "segment_ids": [
      "first-antiphon-through-theotokos-1"
    ],
    "service_text_id": "divine-liturgy-john-chrysostom",
    "service_range": {
      "section_id": "first-antiphon",
      "start_segment_id": "first-antiphon-through-theotokos-1",
      "end_segment_id": "first-antiphon-through-theotokos-1"
    }
  },
  {
    "id": "dismissal-through-the-prayers-summary",
    "segment_ids": [
      "dismissal-priest-fathers",
      "dismissal-choir-amen"
    ],
    "service_text_id": "divine-liturgy-john-chrysostom",
    "service_range": {
      "section_id": "dismissal",
      "start_segment_id": "dismissal-priest-fathers",
      "end_segment_id": "dismissal-choir-amen"
    },
    "media": GREAT_COMPLINE_DISMISSAL_MEDIA
  },
  {
    "id": "little-litany-again",
    "segment_ids": [
      "little-litany-again"
    ],
    "service_text_id": "divine-liturgy-john-chrysostom",
    "service_range": {
      "section_id": "little-litany-after-first-antiphon",
      "start_segment_id": "little-litany-again",
      "end_segment_id": "little-litany-again"
    }
  },
  {
    "id": "little-litany-help-save",
    "segment_ids": [
      "little-litany-help-save"
    ],
    "service_text_id": "divine-liturgy-john-chrysostom",
    "service_range": {
      "section_id": "little-litany-after-first-antiphon",
      "start_segment_id": "little-litany-help-save",
      "end_segment_id": "little-litany-help-save"
    }
  },
  {
    "id": "little-litany-calling-remembrance",
    "segment_ids": [
      "little-litany-calling-remembrance"
    ],
    "service_text_id": "divine-liturgy-john-chrysostom",
    "service_range": {
      "section_id": "little-litany-after-first-antiphon",
      "start_segment_id": "little-litany-calling-remembrance",
      "end_segment_id": "little-litany-calling-remembrance"
    }
  },
  {
    "id": "little-litany-for-thine-might",
    "segment_ids": [
      "little-litany-for-thine-might"
    ],
    "service_text_id": "divine-liturgy-john-chrysostom",
    "service_range": {
      "section_id": "little-litany-after-first-antiphon",
      "start_segment_id": "little-litany-for-thine-might",
      "end_segment_id": "little-litany-for-thine-might"
    }
  },
  {
    "id": "little-litany-good-god",
    "segment_ids": [
      "little-litany-good-god-doxology"
    ],
    "service_text_id": "divine-liturgy-john-chrysostom",
    "service_range": {
      "section_id": "little-litany-after-second-antiphon",
      "start_segment_id": "little-litany-good-god-doxology",
      "end_segment_id": "little-litany-good-god-doxology"
    }
  },
  {
    "id": "little-litanies-summary",
    "segment_ids": [
      "little-litany-again",
      "little-litany-help-save",
      "little-litany-calling-remembrance",
      "little-litany-for-thine-might",
      "little-litany-good-god-doxology"
    ],
    "show_speakers": true
  },
  {
    "id": "trisagion-hymn-main",
    "segment_ids": [
      "trisagion-hymn-holy-god-1",
      "trisagion-hymn-glory",
      "trisagion-hymn-holy-immortal",
      "trisagion-with-strength",
      "trisagion-hymn-holy-god-2"
    ]
  },
  {
    "id": "word-epistle-reading",
    "segment_ids": [
      "epistle-let-us-attend-1",
      "epistle-reader-prokeimenon",
      "epistle-wisdom",
      "epistle-reader-title",
      "epistle-let-us-attend-2",
      "epistle-reader-reads",
      "epistle-peace-reader",
      "epistle-alleluia"
    ]
  },
  {
    "id": "word-gospel-reading",
    "segment_ids": [
      "gospel-wisdom-stand",
      "gospel-peace-all",
      "gospel-and-spirit",
      "gospel-reading-from",
      "gospel-glory-before",
      "gospel-let-us-attend",
      "gospel-appointed-reading-rubric",
      "gospel-glory-after"
    ]
  },
  {
    "id": "liturgy-word-summary",
    "segment_ids": [
      "epistle-let-us-attend-1",
      "epistle-reader-prokeimenon",
      "epistle-wisdom",
      "epistle-reader-title",
      "epistle-let-us-attend-2",
      "epistle-reader-reads",
      "epistle-peace-reader",
      "epistle-alleluia",
      "gospel-wisdom-stand",
      "gospel-peace-all",
      "gospel-and-spirit",
      "gospel-reading-from",
      "gospel-glory-before",
      "gospel-let-us-attend",
      "gospel-appointed-reading-rubric",
      "gospel-glory-after"
    ],
    "show_speakers": true
  },
  {
    "id": "lord-have-mercy",
    "segment_ids": [
      "course-lord-have-mercy-split"
    ],
    "media": PARAKLESIS_ST_MARINA_MEDIA
  },
  {
    "id": "jesus-prayer",
    "segment_ids": [
      "course-jesus-prayer"
    ]
  },
  {
    "id": "glory-both-now",
    "segment_ids": [
      "first-antiphon-glory",
      "first-antiphon-both-now"
    ]
  },
  {
    "id": "glory-beginner",
    "segment_ids": [
      "course-glory-beginner"
    ],
    "media": GREAT_COMPLINE_MEDIA
  },
  {
    "id": "both-now-beginner",
    "segment_ids": [
      "course-both-now-beginner"
    ],
    "media": GREAT_COMPLINE_MEDIA
  },
  {
    "id": "glory-both-now-beginner",
    "segment_ids": [
      "course-glory-beginner",
      "course-both-now-beginner"
    ],
    "media": GREAT_COMPLINE_MEDIA
  },
  {
    "id": "trisagion-hymn-core",
    "segment_ids": [
      "course-trisagion-holy-god",
      "course-trisagion-holy-mighty",
      "course-trisagion-holy-immortal",
      "course-trisagion-have-mercy"
    ],
    "media": GREAT_COMPLINE_MEDIA
  },
  {
    "id": "all-holy-trinity-address",
    "segment_ids": [
      "course-all-holy-trinity-address"
    ],
    "media": GREAT_COMPLINE_MEDIA
  },
  {
    "id": "all-holy-trinity-lord",
    "segment_ids": [
      "course-all-holy-trinity-lord"
    ],
    "media": GREAT_COMPLINE_MEDIA
  },
  {
    "id": "all-holy-trinity-master",
    "segment_ids": [
      "course-all-holy-trinity-master"
    ],
    "media": GREAT_COMPLINE_MEDIA
  },
  {
    "id": "all-holy-trinity-holy-one",
    "segment_ids": [
      "course-all-holy-trinity-holy-one"
    ],
    "media": GREAT_COMPLINE_MEDIA
  },
  {
    "id": "all-holy-trinity",
    "segment_ids": [
      "course-all-holy-trinity-address",
      "course-all-holy-trinity-lord",
      "course-all-holy-trinity-master",
      "course-all-holy-trinity-holy-one"
    ],
    "media": GREAT_COMPLINE_MEDIA
  },
  {
    "id": "lords-prayer-address",
    "segment_ids": [
      "lords-prayer-prayer"
    ],
    "media": GREAT_COMPLINE_MEDIA
  },
  {
    "id": "lords-prayer-kingdom",
    "segment_ids": [
      "lords-prayer-kingdom"
    ],
    "media": GREAT_COMPLINE_MEDIA
  },
  {
    "id": "lords-prayer-daily-bread",
    "segment_ids": [
      "lords-prayer-daily-bread"
    ],
    "media": GREAT_COMPLINE_MEDIA
  },
  {
    "id": "lords-prayer-forgive",
    "segment_ids": [
      "lords-prayer-forgive"
    ],
    "media": GREAT_COMPLINE_MEDIA
  },
  {
    "id": "lords-prayer-temptation",
    "segment_ids": [
      "lords-prayer-temptation"
    ],
    "media": GREAT_COMPLINE_MEDIA
  },
  {
    "id": "lords-prayer-summary",
    "segment_ids": [
      "lords-prayer-prayer",
      "lords-prayer-kingdom",
      "lords-prayer-daily-bread",
      "lords-prayer-forgive",
      "lords-prayer-temptation"
    ],
    "media": GREAT_COMPLINE_MEDIA
  }
];
export function resolveExercise(definition, segmentsMap = segments) {
  const segmentIds = definition.segment_ids || [];
  const captionClip = definition.caption_clip || (
    definition.media
      ? {
          recording_id: definition.media.recording_id,
          alignment_id: definition.media.alignment_id,
          default_playback_rate: definition.media.default_playback_rate
        }
      : null
  );
  const alignedPhraseTimings = definition.media?.alignment_id
    ? getFilteredPhraseTimings(
        getPhraseTimingsForSegmentIds(
          segmentIds,
          getDefinitionAlignmentRange(definition, segmentIds)?.phrase_timings,
          segmentsMap
        ),
        definition.phrase_ids
      )
    : [];
  const resolvedDefinition = {
    ...definition,
    activity: null,
    captions: alignedPhraseTimings,
    segment_ids: segmentIds,
    caption_clip: captionClip
  };

  function getLinesForSegmentIds(ids) {
    const phraseIdSet = definition.phrase_ids ? new Set(definition.phrase_ids) : null;
    function isIncludedPhrase(part) {
      return Boolean(part?.phrase_id && phraseIdSet?.has(part.phrase_id));
    }
    function hasLaterPhrase(parts, startIndex) {
      return parts.slice(startIndex + 1).some(part => part.phrase_id);
    }
    function filterPhraseParts(parts) {
      if (!phraseIdSet) return parts.map(part => ({ ...part }));
      return parts.filter((part, index) => {
        if (part.phrase_id) return phraseIdSet.has(part.phrase_id);
        const previousPart = parts[index - 1];
        const nextPart = parts[index + 1];
        const previousIncluded = isIncludedPhrase(previousPart);
        const nextIncluded = isIncludedPhrase(nextPart);
        return previousIncluded && (nextIncluded || !hasLaterPhrase(parts, index));
      }).map(part => ({ ...part }));
    }

    return ids
      .map(segmentId => segmentsMap[segmentId])
      .filter(Boolean)
      .map((segment, index) => ({
        ...segment,
        segment_id: ids[index],
        line_order: index + 1,
        phrases: filterPhraseParts(segment.phrases)
      }))
      .filter(line => !phraseIdSet || line.phrases.some(part => part.phrase_id));
  }

  const lines = getLinesForSegmentIds(segmentIds);

  return {
    ...resolvedDefinition,
    audio_clip: getServiceAudioClip(definition) || getMediaAudioClip(definition),
    lines
  };
}

const exercises = Object.fromEntries(
  exerciseDefinitions.map(definition => [definition.id, resolveExercise(definition)])
);

const STANDARD_ACTIVITY_OPTIONS = [
  {
    label: PASSAGE_ACTIVITY_LABELS[PASSAGE_ACTIVITY_TYPES.readListen],
    activity_type: PASSAGE_ACTIVITY_TYPES.readListen
  }
];

function isPracticeExemptPart(part) {
  return part.tags?.includes('rubric') || phrases[part.phrase_id]?.tags?.includes('rubric');
}

function getPhraseIdsForLines(lines) {
  return (lines || []).flatMap(line => (
    line.tags?.includes('rubric')
      ? []
      : (line.phrases || [])
        .filter(part => part.phrase_id && !isPracticeExemptPart(part))
        .map(part => part.phrase_id)
  ));
}

function getPracticeLines(lines) {
  return (lines || []).flatMap(line => {
    if (line.tags?.includes('rubric')) return [];
    const phrasesForPractice = (line.phrases || []).filter(part => !isPracticeExemptPart(part));
    return phrasesForPractice.some(part => part.phrase_id)
      ? [{ ...line, phrases: phrasesForPractice }]
      : [];
  });
}

function getPracticeExercise(exercise) {
  return {
    ...exercise,
    lines: getPracticeLines(exercise.lines)
  };
}

function getServiceAudioClip(definition) {
  const serviceRange = findServiceAlignmentRange(
    definition.service_text_id,
    definition.service_range,
    null,
    alignments
  );
  if (!serviceRange) return null;
  const bounds = getRangeBounds(serviceRange.range);
  if (!bounds) return null;

  return {
    recording_id: serviceRange.alignment.recording_id,
    start_seconds: bounds.start_seconds,
    end_seconds: bounds.end_seconds,
    default_playback_rate: serviceRange.range.default_playback_rate ?? 1
  };
}

function getDefinitionAlignmentRange(definition, segmentIds = definition.segment_ids || []) {
  if (!definition.media?.alignment_id) return null;
  const alignment = alignments[definition.media.alignment_id];
  if (!alignment || alignment.recording_id !== definition.media.recording_id) return null;
  if (definition.media.range_id) {
    return (alignment.ranges || []).find(range => range.id === definition.media.range_id) || null;
  }
  const segmentKey = (segmentIds || []).join('\u001f');
  const unnamedExactRange = (alignment.ranges || []).find(range => (
    !range.id && (range.segment_ids || []).join('\u001f') === segmentKey
  ));
  if (unnamedExactRange) return unnamedExactRange;
  return getAlignmentRange(
    definition.media.alignment_id,
    segmentIds,
    definition.media.recording_id,
    alignments
  );
}

function getFilteredPhraseTimings(phraseTimings = [], phraseIds = null) {
  if (!phraseIds) return phraseTimings.map(timing => ({ ...timing }));
  const phraseIdSet = new Set(phraseIds);
  return phraseTimings
    .filter(timing => phraseIdSet.has(timing.phrase_id))
    .map(timing => ({ ...timing }));
}

function getMediaAudioClip(definition) {
  if (!definition.media?.alignment_id) return null;
  const range = getDefinitionAlignmentRange(definition);
  if (!range) return null;
  const phraseBounds = getRangeBounds({
    phrase_timings: getFilteredPhraseTimings(range.phrase_timings, definition.phrase_ids)
  });
  const bounds = definition.phrase_ids ? phraseBounds : getRangeBounds(range);
  if (!bounds) return null;

  return {
    recording_id: definition.media.recording_id,
    start_seconds: bounds.start_seconds,
    end_seconds: bounds.end_seconds,
    default_playback_rate: definition.media.default_playback_rate ?? range.default_playback_rate ?? 1
  };
}

function getAlignedCaptions(exercise) {
  const serviceRange = findServiceAlignmentRange(
    exercise.service_text_id,
    exercise.service_range,
    exercise.audio_clip?.recording_id,
    alignments
  );
  if (serviceRange?.range?.phrase_timings) {
    return serviceRange.range.phrase_timings.map(timing => ({ ...timing }));
  }

  return exercise.captions?.map(timing => ({ ...timing })) || [];
}

export function getExercisePhraseCount(exerciseId) {
  return getPhraseIdsForLines(exercises[exerciseId]?.lines).length;
}

export function hasLinkedRecording(exerciseId) {
  const exercise = exercises[exerciseId];
  return Boolean(exercise?.audio_clip?.recording_id || exercise?.caption_clip?.recording_id);
}

export function getStandardActivityOptions(exerciseId) {
  const activityOptions = [...STANDARD_ACTIVITY_OPTIONS];
  const phraseCount = getExercisePhraseCount(exerciseId);
  if (hasLinkedRecording(exerciseId)) {
    activityOptions.push({
      label: PASSAGE_ACTIVITY_LABELS[PASSAGE_ACTIVITY_TYPES.phraseCaptions],
      activity_type: PASSAGE_ACTIVITY_TYPES.phraseCaptions
    });
  }
  if (phraseCount >= 2 && phraseCount <= 14) {
    activityOptions.push({
      label: PASSAGE_ACTIVITY_LABELS[PASSAGE_ACTIVITY_TYPES.translationDirection],
      activity_type: PASSAGE_ACTIVITY_TYPES.translationDirection
    });
  }
  if (phraseCount <= 6) {
    activityOptions.push({
      label: PASSAGE_ACTIVITY_LABELS[PASSAGE_ACTIVITY_TYPES.matching],
      activity_type: PASSAGE_ACTIVITY_TYPES.matching
    });
  }
  if (phraseCount <= 12) {
    activityOptions.push({
      label: PASSAGE_ACTIVITY_LABELS[PASSAGE_ACTIVITY_TYPES.arrange],
      activity_type: PASSAGE_ACTIVITY_TYPES.arrange
    });
  }
  if (phraseCount <= 14) {
    activityOptions.push({
      label: PASSAGE_ACTIVITY_LABELS[PASSAGE_ACTIVITY_TYPES.typeArabic],
      activity_type: PASSAGE_ACTIVITY_TYPES.typeArabic
    });
  }
  return activityOptions;
}

function getDerivedActivity(exercise, activityType) {
  if (!activityType) return exercise.activity;

  const phraseIds = getPhraseIdsForLines(exercise.lines);
  const alignedCaptions = getAlignedCaptions(exercise);
  const captions = alignedCaptions;
  const serviceAlignmentRange = findServiceAlignmentRange(
    exercise.service_text_id,
    exercise.service_range,
    exercise.audio_clip?.recording_id,
    alignments
  );
  const mediaRange = getDefinitionAlignmentRange(exercise);
  const mediaAlignmentRange = mediaRange
    ? { alignment: alignments[exercise.media.alignment_id], range: mediaRange }
    : null;
  const alignmentRange = serviceAlignmentRange || mediaAlignmentRange;
  const commonActivity = {
    id: `${exercise.id}:${activityType}`,
    target: {
      segment_ids: exercise.segment_ids
    },
    media: exercise.audio_clip?.recording_id
      ? {
          recording_id: exercise.audio_clip.recording_id,
          alignment_id: alignmentRange?.alignment?.id,
          default_playback_rate: exercise.audio_clip.default_playback_rate
        }
      : null
  };

  if (activityType === PASSAGE_ACTIVITY_TYPES.readListen) {
    return {
      ...commonActivity,
      type: PASSAGE_ACTIVITY_TYPES.readListen,
      title: PASSAGE_ACTIVITY_LABELS[PASSAGE_ACTIVITY_TYPES.readListen],
      captions
    };
  }

  if (activityType === PASSAGE_ACTIVITY_TYPES.phraseCaptions) {
    return {
      ...commonActivity,
      type: PASSAGE_ACTIVITY_TYPES.phraseCaptions,
      title: PASSAGE_ACTIVITY_LABELS[PASSAGE_ACTIVITY_TYPES.phraseCaptions],
      captions
    };
  }

  if (activityType === PASSAGE_ACTIVITY_TYPES.arrange) {
    return {
      ...commonActivity,
      type: PASSAGE_ACTIVITY_TYPES.arrange,
      title: PASSAGE_ACTIVITY_LABELS[PASSAGE_ACTIVITY_TYPES.arrange],
      cloze: {
        phrase_ids: phraseIds
      }
    };
  }

  if (activityType === PASSAGE_ACTIVITY_TYPES.typeArabic) {
    return {
      ...commonActivity,
      type: PASSAGE_ACTIVITY_TYPES.typeArabic,
      title: PASSAGE_ACTIVITY_LABELS[PASSAGE_ACTIVITY_TYPES.typeArabic],
      practice: {
        phrase_ids: phraseIds
      }
    };
  }

  if (activityType === PASSAGE_ACTIVITY_TYPES.matching) {
    return {
      ...commonActivity,
      type: PASSAGE_ACTIVITY_TYPES.matching,
      title: PASSAGE_ACTIVITY_LABELS[PASSAGE_ACTIVITY_TYPES.matching],
      matching: {
        phrase_ids: phraseIds
      }
    };
  }

  if (activityType === PASSAGE_ACTIVITY_TYPES.translationDirection) {
    return {
      ...commonActivity,
      type: PASSAGE_ACTIVITY_TYPES.translationDirection,
      title: PASSAGE_ACTIVITY_LABELS[PASSAGE_ACTIVITY_TYPES.translationDirection],
      translation: {
        phrase_ids: phraseIds
      }
    };
  }

  return exercise.activity;
}

export function getExerciseWithActivity(exerciseId, activityType = null) {
  const exercise = exercises[exerciseId];
  if (!exercise || !activityType) return exercise;
  const practiceActivityTypes = new Set([
    PASSAGE_ACTIVITY_TYPES.arrange,
    PASSAGE_ACTIVITY_TYPES.typeArabic,
    PASSAGE_ACTIVITY_TYPES.matching,
    PASSAGE_ACTIVITY_TYPES.translationDirection
  ]);
  const resolvedExercise = practiceActivityTypes.has(activityType)
    ? getPracticeExercise(exercise)
    : exercise;

  return {
    ...resolvedExercise,
    id: `${exercise.id}:${activityType}`,
    activity: getDerivedActivity(exercise, activityType)
  };
}

export default exercises;
