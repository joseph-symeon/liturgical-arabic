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

const CHERUBIC_HYMN_MEDIA = {
  recording_id: "recording-ymBUtFJeJls",
  alignment_id: "alignment-divine-liturgy-ymBUtFJeJls-cherubic-hymn-v1",
  default_playback_rate: 1
};

const GREAT_ENTRANCE_MEDIA = CHERUBIC_HYMN_MEDIA;

export const exerciseDefinitions = [
  {
    "id": "blessed-is-the-kingdom",
    "segment_ids": [
      "opening-bless-master",
      "opening-blessed-kingdom",
      "opening-amen"
    ],
    "show_speakers": true,
    "service_text_id": "divine-liturgy-john-chrysostom",
    "service_range": {
      "section_id": "blessed-is-the-kingdom",
      "start_segment_id": "opening-bless-master",
      "end_segment_id": "opening-amen"
    }
  },
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
    "include_rubric_phrase_ids": [
      "entrance-ordinary-sundays-label-001",
      "entrance-weekdays-label-001"
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
    "id": "supplication-complete-prayer",
    "segment_ids": [
      "supplication-complete-prayer"
    ]
  },
  {
    "id": "supplication-precious-gifts",
    "segment_ids": [
      "supplication-precious-gifts"
    ]
  },
  {
    "id": "supplication-holy-house",
    "segment_ids": [
      "supplication-holy-house"
    ]
  },
  {
    "id": "supplication-deliverance",
    "segment_ids": [
      "supplication-deliverance"
    ]
  },
  {
    "id": "supplication-whole-day",
    "segment_ids": [
      "supplication-whole-day"
    ]
  },
  {
    "id": "supplication-angel-peace",
    "segment_ids": [
      "supplication-angel-peace"
    ]
  },
  {
    "id": "supplication-pardon-remission",
    "segment_ids": [
      "supplication-pardon-remission"
    ]
  },
  {
    "id": "supplication-good-profitable",
    "segment_ids": [
      "supplication-good-profitable"
    ]
  },
  {
    "id": "supplication-remaining-life",
    "segment_ids": [
      "supplication-remaining-life"
    ]
  },
  {
    "id": "supplication-christian-ending",
    "segment_ids": [
      "supplication-christian-ending"
    ]
  },
  {
    "id": "supplication-priest-doxology",
    "segment_ids": [
      "supplication-priest-doxology"
    ]
  },
  {
    "id": "supplication-love-trinity",
    "segment_ids": [
      "supplication-deacon-love",
      "supplication-choir-trinity"
    ],
    "show_speakers": true
  },
  {
    "id": "supplication-before-creed",
    "segment_ids": [
      "supplication-priest-before-creed",
      "supplication-deacon-before-creed"
    ],
    "show_speakers": true
  },
  {
    "id": "litany-of-supplication",
    "segment_ids": [
      "supplication-complete-prayer",
      "supplication-lord-have-mercy-repeat",
      "supplication-precious-gifts",
      "supplication-holy-house",
      "supplication-deliverance",
      "supplication-help-save",
      "supplication-whole-day",
      "supplication-grant-this-repeat",
      "supplication-angel-peace",
      "supplication-pardon-remission",
      "supplication-good-profitable",
      "supplication-remaining-life",
      "supplication-christian-ending",
      "supplication-calling-remembrance",
      "supplication-to-thee-o-lord",
      "supplication-priest-doxology",
      "supplication-choir-amen",
      "supplication-deacon-love",
      "supplication-choir-trinity",
      "supplication-priest-before-creed",
      "supplication-deacon-before-creed"
    ],
    "show_speakers": true
  },
  {
    "id": "creed-father-maker",
    "segment_ids": [
      "creed-father-maker"
    ]
  },
  {
    "id": "creed-son-begotten",
    "segment_ids": [
      "creed-son-begotten"
    ]
  },
  {
    "id": "creed-incarnation-passion",
    "segment_ids": [
      "creed-incarnation-passion"
    ]
  },
  {
    "id": "creed-resurrection-ascension",
    "segment_ids": [
      "creed-resurrection-ascension"
    ]
  },
  {
    "id": "creed-coming-kingdom",
    "segment_ids": [
      "creed-coming-kingdom"
    ]
  },
  {
    "id": "creed-holy-spirit",
    "segment_ids": [
      "creed-holy-spirit"
    ]
  },
  {
    "id": "creed-church-baptism",
    "segment_ids": [
      "creed-church-baptism"
    ]
  },
  {
    "id": "creed-baptism",
    "segment_ids": [
      "creed-baptism"
    ]
  },
  {
    "id": "creed-resurrection-life",
    "segment_ids": [
      "creed-resurrection-life"
    ]
  },
  {
    "id": "creed-summary",
    "segment_ids": [
      "creed-father-maker",
      "creed-son-begotten",
      "creed-incarnation-passion",
      "creed-resurrection-ascension",
      "creed-coming-kingdom",
      "creed-holy-spirit",
      "creed-church-baptism",
      "creed-baptism",
      "creed-resurrection-life"
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
    "id": "entrance-priest-doxology",
    "segment_ids": [
      "entrance-priest-doxology"
    ],
    "show_speakers": true
  },
  {
    "id": "entrance-save-us-son-of-god",
    "segment_ids": [
      "entrance-hymn-save-us-son-of-god",
      "course-entrance-hymn-risen-sundays",
      "course-entrance-hymn-wondrous-weekdays",
      "entrance-hymn-risen-alleluia"
    ],
    "include_rubric_phrase_ids": [
      "entrance-ordinary-sundays-label-001",
      "entrance-weekdays-label-001"
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
      "entrance-priest-doxology",
      "entrance-hymn-come-worship",
      "entrance-hymn-save-us-son-of-god",
      "course-entrance-hymn-risen-sundays",
      "course-entrance-hymn-wondrous-weekdays",
      "entrance-hymn-risen-alleluia",
      "entrance-hymn-holy-art-benediction",
      "entrance-hymn-deacon-ages",
      "entrance-hymn-final-amen"
    ],
    "include_rubric_phrase_ids": [
      "entrance-ordinary-sundays-label-001",
      "entrance-weekdays-label-001"
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
    "id": "holy-anaphora-opening-dialogue",
    "segment_ids": [
      "holy-anaphora-stand-aright",
      "holy-anaphora-mercy-peace",
      "holy-anaphora-grace",
      "holy-anaphora-and-with-spirit",
      "holy-anaphora-lift-hearts",
      "holy-anaphora-with-lord",
      "holy-anaphora-thank-lord",
      "holy-anaphora-meet-right"
    ],
    "show_speakers": true,
    "service_text_id": "divine-liturgy-john-chrysostom",
    "service_range": {
      "section_id": "anaphora",
      "start_segment_id": "holy-anaphora-stand-aright",
      "end_segment_id": "holy-anaphora-meet-right"
    }
  },
  {
    "id": "holy-anaphora-hymn-and-institution",
    "segment_ids": [
      "holy-anaphora-triumphal-hymn",
      "holy-anaphora-sanctus",
      "holy-anaphora-take-eat",
      "holy-anaphora-amen-body",
      "holy-anaphora-cup-after-supper",
      "holy-anaphora-drink-all",
      "holy-anaphora-amen-blood"
    ],
    "show_speakers": true
  },
  {
    "id": "holy-anaphora-remembrance-offering",
    "segment_ids": [
      "holy-anaphora-thine-own",
      "holy-anaphora-we-praise"
    ],
    "show_speakers": true,
    "service_text_id": "divine-liturgy-john-chrysostom",
    "service_range": {
      "section_id": "anaphora",
      "start_segment_id": "holy-anaphora-thine-own",
      "end_segment_id": "holy-anaphora-we-praise"
    }
  },
  {
    "id": "holy-anaphora-epiclesis",
    "segment_ids": [
      "holy-anaphora-bless-bread",
      "holy-anaphora-make-bread-body",
      "holy-anaphora-amen-bread",
      "holy-anaphora-bless-cup",
      "holy-anaphora-cup-blood",
      "holy-anaphora-amen-cup",
      "holy-anaphora-bless-both",
      "holy-anaphora-changing-spirit",
      "holy-anaphora-amen-three"
    ],
    "show_speakers": true,
    "service_text_id": "divine-liturgy-john-chrysostom",
    "service_range": {
      "section_id": "anaphora",
      "start_segment_id": "holy-anaphora-bless-bread",
      "end_segment_id": "holy-anaphora-amen-three"
    }
  },
  {
    "id": "holy-anaphora-commemorations",
    "segment_ids": [
      "holy-anaphora-especially-theotokos"
    ],
    "show_speakers": true,
    "service_text_id": "divine-liturgy-john-chrysostom",
    "service_range": {
      "section_id": "anaphora",
      "start_segment_id": "holy-anaphora-especially-theotokos",
      "end_segment_id": "holy-anaphora-especially-theotokos"
    }
  },
  {
    "id": "holy-anaphora-through-theotokos",
    "segment_ids": [
      "holy-anaphora-offering-subtitle",
      "holy-anaphora-stand-aright",
      "holy-anaphora-mercy-peace",
      "holy-anaphora-grace",
      "holy-anaphora-and-with-spirit",
      "holy-anaphora-lift-hearts",
      "holy-anaphora-with-lord",
      "holy-anaphora-thank-lord",
      "holy-anaphora-meet-right",
      "holy-anaphora-triumphal-hymn",
      "holy-anaphora-sanctus",
      "holy-anaphora-take-eat",
      "holy-anaphora-amen-body",
      "holy-anaphora-cup-after-supper",
      "holy-anaphora-drink-all",
      "holy-anaphora-amen-blood",
      "holy-anaphora-thine-own",
      "holy-anaphora-we-praise",
      "holy-anaphora-bless-bread",
      "holy-anaphora-make-bread-body",
      "holy-anaphora-amen-bread",
      "holy-anaphora-bless-cup",
      "holy-anaphora-cup-blood",
      "holy-anaphora-amen-cup",
      "holy-anaphora-bless-both",
      "holy-anaphora-changing-spirit",
      "holy-anaphora-amen-three",
      "holy-anaphora-especially-theotokos"
    ],
    "show_speakers": true
  },
  {
    "id": "hymn-to-the-theotokos-meet-bless",
    "segment_ids": [
      "theotokos-hymn-rubric",
      "theotokos-hymn-choir"
    ],
    "phrase_ids": [
      "theotokos-hymn-meet-bless-001",
      "theotokos-hymn-we-bless-001",
      "theotokos-001"
    ],
    "service_text_id": "divine-liturgy-john-chrysostom",
    "service_range": {
      "section_id": "anaphora",
      "start_segment_id": "theotokos-hymn-rubric",
      "end_segment_id": "theotokos-hymn-choir"
    }
  },
  {
    "id": "hymn-to-the-theotokos-ever-blessed",
    "segment_ids": [
      "theotokos-hymn-choir"
    ],
    "phrase_ids": [
      "theotokos-hymn-ever-blessed-001",
      "theotokos-hymn-blameless-mother-001",
      "theotokos-hymn-mother-our-god-001"
    ],
    "service_text_id": "divine-liturgy-john-chrysostom",
    "service_range": {
      "section_id": "anaphora",
      "start_segment_id": "theotokos-hymn-choir",
      "end_segment_id": "theotokos-hymn-choir"
    }
  },
  {
    "id": "hymn-to-the-theotokos-more-honorable",
    "segment_ids": [
      "theotokos-hymn-choir"
    ],
    "phrase_ids": [
      "theotokos-hymn-more-honorable-001",
      "theotokos-hymn-more-glorious-001"
    ],
    "service_text_id": "divine-liturgy-john-chrysostom",
    "service_range": {
      "section_id": "anaphora",
      "start_segment_id": "theotokos-hymn-choir",
      "end_segment_id": "theotokos-hymn-choir"
    }
  },
  {
    "id": "hymn-to-the-theotokos-without-corruption",
    "segment_ids": [
      "theotokos-hymn-choir"
    ],
    "phrase_ids": [
      "theotokos-hymn-without-corruption-001",
      "theotokos-hymn-bear-word-001",
      "theotokos-hymn-truly-you-are-001",
      "theotokos-nominative-001",
      "theotokos-hymn-we-magnify-001"
    ],
    "service_text_id": "divine-liturgy-john-chrysostom",
    "service_range": {
      "section_id": "anaphora",
      "start_segment_id": "theotokos-hymn-choir",
      "end_segment_id": "theotokos-hymn-choir"
    }
  },
  {
    "id": "hymn-to-the-theotokos-summary",
    "segment_ids": [
      "theotokos-hymn-choir"
    ],
    "service_text_id": "divine-liturgy-john-chrysostom",
    "service_range": {
      "section_id": "anaphora",
      "start_segment_id": "theotokos-hymn-choir",
      "end_segment_id": "theotokos-hymn-choir"
    }
  },
  {
    "id": "litany-after-anaphora-saints-departed",
    "segment_ids": [
      "theotokos-priest-saints",
      "theotokos-priest-departed"
    ],
    "show_speakers": true,
    "service_text_id": "divine-liturgy-john-chrysostom",
    "service_range": {
      "section_id": "anaphora",
      "start_segment_id": "theotokos-priest-saints",
      "end_segment_id": "theotokos-priest-departed"
    }
  },
  {
    "id": "litany-after-anaphora-hierarchy-world",
    "segment_ids": [
      "theotokos-clergy-hierarch"
    ],
    "show_speakers": true,
    "service_text_id": "divine-liturgy-john-chrysostom",
    "service_range": {
      "section_id": "anaphora",
      "start_segment_id": "theotokos-clergy-hierarch",
      "end_segment_id": "theotokos-clergy-hierarch"
    }
  },
  {
    "id": "litany-after-anaphora-present-city-benefactors",
    "segment_ids": [
      "theotokos-deacon-present",
      "theotokos-choir-all",
      "theotokos-priest-city",
      "theotokos-priest-benefactors"
    ],
    "show_speakers": true,
    "service_text_id": "divine-liturgy-john-chrysostom",
    "service_range": {
      "section_id": "anaphora",
      "start_segment_id": "theotokos-deacon-present",
      "end_segment_id": "theotokos-priest-benefactors"
    }
  },
  {
    "id": "litany-after-anaphora-doxology-peace",
    "segment_ids": [
      "theotokos-priest-doxology",
      "theotokos-choir-amen",
      "theotokos-priest-mercies",
      "theotokos-choir-and-spirit"
    ],
    "show_speakers": true,
    "service_text_id": "divine-liturgy-john-chrysostom",
    "service_range": {
      "section_id": "anaphora",
      "start_segment_id": "theotokos-priest-doxology",
      "end_segment_id": "theotokos-choir-and-spirit"
    }
  },
  {
    "id": "litany-after-anaphora-summary",
    "segment_ids": [
      "theotokos-priest-saints",
      "theotokos-priest-departed",
      "theotokos-clergy-hierarch",
      "theotokos-deacon-present",
      "theotokos-choir-all",
      "theotokos-priest-city",
      "theotokos-priest-benefactors",
      "theotokos-priest-doxology",
      "theotokos-choir-amen",
      "theotokos-priest-mercies",
      "theotokos-choir-and-spirit"
    ],
    "show_speakers": true
  },
  {
    "id": "before-lords-prayer-remember-saints",
    "segment_ids": [
      "before-lords-prayer-remember-saints",
      "before-lords-prayer-lord-have-mercy-1"
    ],
    "show_speakers": true,
    "service_text_id": "divine-liturgy-john-chrysostom",
    "service_range": {
      "section_id": "litany-before-lords-prayer",
      "start_segment_id": "before-lords-prayer-remember-saints",
      "end_segment_id": "before-lords-prayer-lord-have-mercy-1"
    }
  },
  {
    "id": "before-lords-prayer-precious-gifts",
    "segment_ids": [
      "before-lords-prayer-precious-gifts",
      "before-lords-prayer-lord-have-mercy-2"
    ],
    "show_speakers": true,
    "service_text_id": "divine-liturgy-john-chrysostom",
    "service_range": {
      "section_id": "litany-before-lords-prayer",
      "start_segment_id": "before-lords-prayer-precious-gifts",
      "end_segment_id": "before-lords-prayer-lord-have-mercy-2"
    }
  },
  {
    "id": "before-lords-prayer-receive-gifts",
    "segment_ids": [
      "before-lords-prayer-receive-gifts",
      "before-lords-prayer-lord-have-mercy-3"
    ],
    "show_speakers": true,
    "service_text_id": "divine-liturgy-john-chrysostom",
    "service_range": {
      "section_id": "litany-before-lords-prayer",
      "start_segment_id": "before-lords-prayer-receive-gifts",
      "end_segment_id": "before-lords-prayer-lord-have-mercy-3"
    }
  },
  {
    "id": "before-lords-prayer-unity",
    "segment_ids": [
      "before-lords-prayer-unity",
      "before-lords-prayer-to-thee"
    ],
    "show_speakers": true,
    "service_text_id": "divine-liturgy-john-chrysostom",
    "service_range": {
      "section_id": "litany-before-lords-prayer",
      "start_segment_id": "before-lords-prayer-unity",
      "end_segment_id": "before-lords-prayer-to-thee"
    }
  },
  {
    "id": "before-lords-prayer-vouchsafe",
    "segment_ids": [
      "before-lords-prayer-priest-vouchsafe"
    ],
    "show_speakers": true,
    "service_text_id": "divine-liturgy-john-chrysostom",
    "service_range": {
      "section_id": "litany-before-lords-prayer",
      "start_segment_id": "before-lords-prayer-priest-vouchsafe",
      "end_segment_id": "before-lords-prayer-priest-vouchsafe"
    }
  },
  {
    "id": "litany-before-lords-prayer-summary",
    "segment_ids": [
      "before-lords-prayer-remember-saints",
      "before-lords-prayer-lord-have-mercy-1",
      "before-lords-prayer-precious-gifts",
      "before-lords-prayer-lord-have-mercy-2",
      "before-lords-prayer-receive-gifts",
      "before-lords-prayer-lord-have-mercy-3",
      "before-lords-prayer-unity",
      "before-lords-prayer-to-thee",
      "before-lords-prayer-priest-vouchsafe"
    ],
    "show_speakers": true
  },
  {
    "id": "lords-prayer-first-doxology",
    "segment_ids": [
      "lords-prayer-priest-doxology",
      "lords-prayer-choir-amen",
      "lords-prayer-priest-peace",
      "lords-prayer-choir-spirit"
    ],
    "show_speakers": true,
    "service_text_id": "divine-liturgy-john-chrysostom",
    "service_range": {
      "section_id": "lords-prayer",
      "start_segment_id": "lords-prayer-priest-doxology",
      "end_segment_id": "lords-prayer-choir-spirit"
    }
  },
  {
    "id": "lords-prayer-bowing-doxology",
    "segment_ids": [
      "lords-prayer-deacon-bow-heads",
      "lords-prayer-choir-to-thee",
      "lords-prayer-priest-bowing-prayer",
      "lords-prayer-priest-bowing-doxology",
      "lords-prayer-choir-bowing-amen"
    ],
    "show_speakers": true,
    "service_text_id": "divine-liturgy-john-chrysostom",
    "service_range": {
      "section_id": "lords-prayer",
      "start_segment_id": "lords-prayer-deacon-bow-heads",
      "end_segment_id": "lords-prayer-choir-bowing-amen"
    }
  },
  {
    "id": "lords-prayer-doxologies-summary",
    "segment_ids": [
      "lords-prayer-priest-doxology",
      "lords-prayer-choir-amen",
      "lords-prayer-priest-peace",
      "lords-prayer-choir-spirit",
      "lords-prayer-deacon-bow-heads",
      "lords-prayer-choir-to-thee",
      "lords-prayer-priest-bowing-prayer",
      "lords-prayer-priest-bowing-doxology",
      "lords-prayer-choir-bowing-amen"
    ],
    "show_speakers": true,
    "service_text_id": "divine-liturgy-john-chrysostom",
    "service_range": {
      "section_id": "lords-prayer",
      "start_segment_id": "lords-prayer-priest-doxology",
      "end_segment_id": "lords-prayer-choir-bowing-amen"
    }
  },
  {
    "id": "elevation-attend",
    "segment_ids": [
      "elevation-deacon-attend",
      "elevation-priest-holy-things"
    ],
    "show_speakers": true,
    "service_text_id": "divine-liturgy-john-chrysostom",
    "service_range": {
      "section_id": "elevation",
      "start_segment_id": "elevation-deacon-attend",
      "end_segment_id": "elevation-priest-holy-things"
    }
  },
  {
    "id": "elevation-one-holy",
    "segment_ids": [
      "elevation-choir-one-holy"
    ],
    "show_speakers": true,
    "service_text_id": "divine-liturgy-john-chrysostom",
    "service_range": {
      "section_id": "elevation",
      "start_segment_id": "elevation-choir-one-holy",
      "end_segment_id": "elevation-choir-one-holy"
    }
  },
  {
    "id": "elevation-summary",
    "segment_ids": [
      "elevation-deacon-attend",
      "elevation-priest-holy-things",
      "elevation-choir-one-holy"
    ],
    "show_speakers": true,
    "service_text_id": "divine-liturgy-john-chrysostom",
    "service_range": {
      "section_id": "elevation",
      "start_segment_id": "elevation-deacon-attend",
      "end_segment_id": "elevation-choir-one-holy"
    }
  },
  {
    "id": "pre-communion-confession-belief",
    "segment_ids": [
      "pre-communion-confession-prayer"
    ],
    "phrase_ids": [
      "pre-communion-believe-001",
      "vocative-o-lord-001",
      "pre-communion-confess-001",
      "pre-communion-truly-christ-001",
      "pre-communion-son-living-god-001",
      "pre-communion-came-save-sinners-001",
      "pre-communion-save-sinners-001",
      "pre-communion-first-sinners-001"
    ],
    "show_speakers": true,
    "service_text_id": "divine-liturgy-john-chrysostom",
    "service_range": {
      "section_id": "pre-communion-prayers",
      "start_segment_id": "pre-communion-confession-prayer",
      "end_segment_id": "pre-communion-confession-prayer"
    }
  },
  {
    "id": "pre-communion-confession-body-blood",
    "segment_ids": [
      "pre-communion-confession-prayer"
    ],
    "phrase_ids": [
      "pre-communion-own-body-001",
      "pre-communion-that-this-is-001",
      "pre-communion-thy-immaculate-body-001",
      "pre-communion-itself-001",
      "pre-communion-own-blood-001",
      "pre-communion-pray-mercy-forgive-001",
      "pre-communion-forgive-me-001",
      "pre-communion-transgressions-voluntary-001",
      "pre-communion-transgressions-involuntary-001",
      "pre-communion-word-deed-001",
      "pre-communion-knowledge-ignorance-001",
      "pre-communion-ignorance-001"
    ],
    "show_speakers": true,
    "service_text_id": "divine-liturgy-john-chrysostom",
    "service_range": {
      "section_id": "pre-communion-prayers",
      "start_segment_id": "pre-communion-confession-prayer",
      "end_segment_id": "pre-communion-confession-prayer"
    }
  },
  {
    "id": "pre-communion-confession-communion",
    "segment_ids": [
      "pre-communion-confession-prayer"
    ],
    "phrase_ids": [
      "pre-communion-worthy-without-condemnation-001",
      "pre-communion-partake-mysteries-001",
      "pre-communion-remission-life-001",
      "pre-communion-life-everlasting-001",
      "amen-001"
    ],
    "show_speakers": true,
    "service_text_id": "divine-liturgy-john-chrysostom",
    "service_range": {
      "section_id": "pre-communion-prayers",
      "start_segment_id": "pre-communion-confession-prayer",
      "end_segment_id": "pre-communion-confession-prayer"
    }
  },
  {
    "id": "pre-communion-mystic-supper",
    "segment_ids": [
      "pre-communion-mystic-supper-repeat"
    ],
    "show_speakers": true,
    "service_text_id": "divine-liturgy-john-chrysostom",
    "service_range": {
      "section_id": "pre-communion-prayers",
      "start_segment_id": "pre-communion-mystic-supper-repeat",
      "end_segment_id": "pre-communion-mystic-supper-repeat"
    }
  },
  {
    "id": "pre-communion-not-judgment",
    "segment_ids": [
      "pre-communion-not-judgment-prayer"
    ],
    "show_speakers": true,
    "service_text_id": "divine-liturgy-john-chrysostom",
    "service_range": {
      "section_id": "pre-communion-prayers",
      "start_segment_id": "pre-communion-not-judgment-prayer",
      "end_segment_id": "pre-communion-not-judgment-prayer"
    }
  },
  {
    "id": "pre-communion-prayers-summary",
    "segment_ids": [
      "pre-communion-confession-prayer",
      "pre-communion-mystic-supper-repeat",
      "pre-communion-not-judgment-prayer"
    ],
    "show_speakers": true
  },
  {
    "id": "communion-hymns-praise-lord",
    "segment_ids": [
      "pre-communion-choir-koinonikon"
    ],
    "show_speakers": true,
    "service_text_id": "divine-liturgy-john-chrysostom",
    "service_range": {
      "section_id": "pre-communion-prayers",
      "start_segment_id": "pre-communion-choir-koinonikon",
      "end_segment_id": "pre-communion-choir-koinonikon"
    }
  },
  {
    "id": "communion-hymns-with-fear",
    "segment_ids": [
      "pre-communion-deacon-draw-near"
    ],
    "show_speakers": true,
    "service_text_id": "divine-liturgy-john-chrysostom",
    "service_range": {
      "section_id": "pre-communion-prayers",
      "start_segment_id": "pre-communion-deacon-draw-near",
      "end_segment_id": "pre-communion-deacon-draw-near"
    }
  },
  {
    "id": "communion-hymns-blessed-coming",
    "segment_ids": [
      "pre-communion-choir-blessed-coming"
    ],
    "show_speakers": true,
    "service_text_id": "divine-liturgy-john-chrysostom",
    "service_range": {
      "section_id": "pre-communion-prayers",
      "start_segment_id": "pre-communion-choir-blessed-coming",
      "end_segment_id": "pre-communion-choir-blessed-coming"
    }
  },
  {
    "id": "communion-hymns-summary",
    "segment_ids": [
      "pre-communion-choir-koinonikon",
      "pre-communion-deacon-draw-near",
      "pre-communion-choir-blessed-coming"
    ],
    "show_speakers": true,
    "service_text_id": "divine-liturgy-john-chrysostom",
    "service_range": {
      "section_id": "pre-communion-prayers",
      "start_segment_id": "pre-communion-choir-koinonikon",
      "end_segment_id": "pre-communion-choir-blessed-coming"
    }
  },
  {
    "id": "post-communion-hymns-save-people",
    "segment_ids": [
      "pre-communion-priest-save-people"
    ],
    "show_speakers": true,
    "service_text_id": "divine-liturgy-john-chrysostom",
    "service_range": {
      "section_id": "pre-communion-prayers",
      "start_segment_id": "pre-communion-priest-save-people",
      "end_segment_id": "pre-communion-priest-save-people"
    }
  },
  {
    "id": "post-communion-hymns-seen-light",
    "segment_ids": [
      "pre-communion-choir-seen-light"
    ],
    "show_speakers": true,
    "service_text_id": "divine-liturgy-john-chrysostom",
    "service_range": {
      "section_id": "pre-communion-prayers",
      "start_segment_id": "pre-communion-choir-seen-light",
      "end_segment_id": "pre-communion-choir-seen-light"
    }
  },
  {
    "id": "post-communion-hymns-be-exalted",
    "segment_ids": [
      "pre-communion-deacon-exalt-master",
      "pre-communion-priest-be-exalted"
    ],
    "show_speakers": true,
    "service_text_id": "divine-liturgy-john-chrysostom",
    "service_range": {
      "section_id": "pre-communion-prayers",
      "start_segment_id": "pre-communion-deacon-exalt-master",
      "end_segment_id": "pre-communion-priest-be-exalted"
    }
  },
  {
    "id": "post-communion-hymns-mouths-filled",
    "segment_ids": [
      "pre-communion-choir-mouths-filled"
    ],
    "show_speakers": true,
    "service_text_id": "divine-liturgy-john-chrysostom",
    "service_range": {
      "section_id": "pre-communion-prayers",
      "start_segment_id": "pre-communion-choir-mouths-filled",
      "end_segment_id": "pre-communion-choir-mouths-filled"
    }
  },
  {
    "id": "post-communion-hymns-summary",
    "segment_ids": [
      "pre-communion-priest-save-people",
      "pre-communion-choir-seen-light",
      "pre-communion-deacon-exalt-master",
      "pre-communion-priest-be-exalted",
      "pre-communion-choir-mouths-filled"
    ],
    "show_speakers": true
  },
  {
    "id": "thanksgiving-partaken",
    "segment_ids": [
      "thanksgiving-deacon-partaken",
      "thanksgiving-choir-lord-have-mercy-1"
    ],
    "show_speakers": true,
    "service_text_id": "divine-liturgy-john-chrysostom",
    "service_range": {
      "section_id": "litany-of-thanksgiving",
      "start_segment_id": "thanksgiving-deacon-partaken",
      "end_segment_id": "thanksgiving-choir-lord-have-mercy-1"
    }
  },
  {
    "id": "thanksgiving-help-save",
    "segment_ids": [
      "thanksgiving-deacon-help-save",
      "thanksgiving-choir-lord-have-mercy-2"
    ],
    "show_speakers": true,
    "service_text_id": "divine-liturgy-john-chrysostom",
    "service_range": {
      "section_id": "litany-of-thanksgiving",
      "start_segment_id": "thanksgiving-deacon-help-save",
      "end_segment_id": "thanksgiving-choir-lord-have-mercy-2"
    }
  },
  {
    "id": "thanksgiving-commend",
    "segment_ids": [
      "thanksgiving-deacon-commend",
      "thanksgiving-choir-to-thee"
    ],
    "show_speakers": true,
    "service_text_id": "divine-liturgy-john-chrysostom",
    "service_range": {
      "section_id": "litany-of-thanksgiving",
      "start_segment_id": "thanksgiving-deacon-commend",
      "end_segment_id": "thanksgiving-choir-to-thee"
    }
  },
  {
    "id": "thanksgiving-doxology",
    "segment_ids": [
      "thanksgiving-priest-doxology",
      "thanksgiving-choir-amen"
    ],
    "show_speakers": true,
    "service_text_id": "divine-liturgy-john-chrysostom",
    "service_range": {
      "section_id": "litany-of-thanksgiving",
      "start_segment_id": "thanksgiving-priest-doxology",
      "end_segment_id": "thanksgiving-choir-amen"
    }
  },
  {
    "id": "thanksgiving-go-forth",
    "segment_ids": [
      "thanksgiving-priest-go-forth",
      "thanksgiving-choir-in-name",
      "thanksgiving-deacon-pray",
      "thanksgiving-choir-lord-have-mercy-3"
    ],
    "show_speakers": true,
    "service_text_id": "divine-liturgy-john-chrysostom",
    "service_range": {
      "section_id": "litany-of-thanksgiving",
      "start_segment_id": "thanksgiving-priest-go-forth",
      "end_segment_id": "thanksgiving-choir-lord-have-mercy-3"
    }
  },
  {
    "id": "litany-of-thanksgiving-summary",
    "segment_ids": [
      "thanksgiving-deacon-partaken",
      "thanksgiving-choir-lord-have-mercy-1",
      "thanksgiving-deacon-help-save",
      "thanksgiving-choir-lord-have-mercy-2",
      "thanksgiving-deacon-commend",
      "thanksgiving-choir-to-thee",
      "thanksgiving-priest-doxology",
      "thanksgiving-choir-amen",
      "thanksgiving-priest-go-forth",
      "thanksgiving-choir-in-name",
      "thanksgiving-deacon-pray",
      "thanksgiving-choir-lord-have-mercy-3"
    ],
    "show_speakers": true
  },
  {
    "id": "amvon-prayer-main",
    "segment_ids": [
      "amvon-priest-prayer"
    ],
    "show_speakers": true,
    "service_text_id": "divine-liturgy-john-chrysostom",
    "service_range": {
      "section_id": "prayer-behind-amvon",
      "start_segment_id": "amvon-priest-prayer",
      "end_segment_id": "amvon-priest-prayer"
    }
  },
  {
    "id": "amvon-blessed-name",
    "segment_ids": [
      "amvon-choir-blessed-name"
    ],
    "show_speakers": true,
    "service_text_id": "divine-liturgy-john-chrysostom",
    "service_range": {
      "section_id": "prayer-behind-amvon",
      "start_segment_id": "amvon-choir-blessed-name",
      "end_segment_id": "amvon-choir-blessed-name"
    }
  },
  {
    "id": "amvon-fulfillment-blessing",
    "segment_ids": [
      "amvon-priest-fulfillment-aloud",
      "amvon-deacon-pray",
      "amvon-choir-lord-have-mercy",
      "amvon-priest-blessing",
      "amvon-choir-amen"
    ],
    "show_speakers": true,
    "service_text_id": "divine-liturgy-john-chrysostom",
    "service_range": {
      "section_id": "prayer-behind-amvon",
      "start_segment_id": "amvon-priest-fulfillment-aloud",
      "end_segment_id": "amvon-choir-amen"
    }
  },
  {
    "id": "amvon-closing-glory",
    "segment_ids": [
      "amvon-priest-glory",
      "amvon-choir-glory-father"
    ],
    "show_speakers": true,
    "service_text_id": "divine-liturgy-john-chrysostom",
    "service_range": {
      "section_id": "prayer-behind-amvon",
      "start_segment_id": "amvon-priest-glory",
      "end_segment_id": "amvon-choir-glory-father"
    }
  },
  {
    "id": "prayer-behind-amvon-summary",
    "segment_ids": [
      "amvon-priest-prayer",
      "amvon-choir-blessed-name",
      "amvon-priest-fulfillment-aloud",
      "amvon-deacon-pray",
      "amvon-choir-lord-have-mercy",
      "amvon-priest-blessing",
      "amvon-choir-amen",
      "amvon-priest-glory",
      "amvon-choir-glory-father"
    ],
    "show_speakers": true
  },
  {
    "id": "dismissal-main",
    "segment_ids": [
      "dismissal-priest-main"
    ],
    "show_speakers": true,
    "service_text_id": "divine-liturgy-john-chrysostom",
    "service_range": {
      "section_id": "dismissal",
      "start_segment_id": "dismissal-priest-main",
      "end_segment_id": "dismissal-priest-main"
    }
  },
  {
    "id": "dismissal-summary",
    "segment_ids": [
      "dismissal-priest-main",
      "dismissal-priest-fathers",
      "dismissal-choir-amen"
    ],
    "show_speakers": true,
    "service_text_id": "divine-liturgy-john-chrysostom",
    "service_range": {
      "section_id": "dismissal",
      "start_segment_id": "dismissal-priest-main",
      "end_segment_id": "dismissal-choir-amen"
    }
  },
  {
    "id": "cherubic-hymn-represent-trinity",
    "segment_ids": [
      "cherubic-hymn-choir"
    ],
    "phrase_ids": [
      "cherubic-represent-001",
      "cherubic-sing-thrice-holy-001",
      "cherubic-life-giving-trinity-001"
    ],
    "media": CHERUBIC_HYMN_MEDIA
  },
  {
    "id": "cherubic-hymn-lay-aside-king",
    "segment_ids": [
      "cherubic-hymn-choir"
    ],
    "phrase_ids": [
      "cherubic-lay-aside-now-001",
      "cherubic-earthly-care-001",
      "cherubic-about-to-001",
      "cherubic-receive-king-001"
    ],
    "media": CHERUBIC_HYMN_MEDIA
  },
  {
    "id": "cherubic-hymn-angelic-hosts",
    "segment_ids": [
      "great-entrance-choir-cherubic-completion"
    ],
    "phrase_ids": [
      "amen-001",
      "great-entrance-angelic-hosts-001",
      "cherubic-invisibly-001"
    ],
    "media": CHERUBIC_HYMN_MEDIA
  },
  {
    "id": "cherubic-hymn-summary",
    "segment_ids": [
      "cherubic-hymn-choir"
    ],
    "show_speakers": true,
    "media": CHERUBIC_HYMN_MEDIA
  },
  {
    "id": "great-entrance-all",
    "segment_ids": [
      "great-entrance-deacon-all"
    ],
    "phrase_ids": [
      "great-entrance-all-of-you-001"
    ],
    "media": GREAT_ENTRANCE_MEDIA
  },
  {
    "id": "great-entrance-lord-remember-kingdom",
    "segment_ids": [
      "great-entrance-deacon-all"
    ],
    "phrase_ids": [
      "great-entrance-lord-remember-001",
      "great-entrance-in-kingdom-001"
    ],
    "media": GREAT_ENTRANCE_MEDIA
  },
  {
    "id": "great-entrance-hierarch",
    "segment_ids": [
      "great-entrance-priest-hierarch"
    ],
    "phrase_ids": [
      "great-entrance-father-metropolitan-001",
      "great-entrance-so-and-so-001"
    ],
    "media": GREAT_ENTRANCE_MEDIA
  },
  {
    "id": "great-entrance-rulers",
    "segment_ids": [
      "great-entrance-priest-rulers"
    ],
    "phrase_ids": [
      "great-entrance-rulers-001",
      "great-entrance-support-good-work-001"
    ]
  },
  {
    "id": "great-entrance-living",
    "segment_ids": [
      "great-entrance-priest-living"
    ],
    "phrase_ids": [
      "great-entrance-servants-of-god-001",
      "great-entrance-offerings-offered-001",
      "great-entrance-health-welfare-001",
      "great-entrance-welfare-001",
      "great-entrance-remission-sins-001",
      "great-entrance-names-001"
    ]
  },
  {
    "id": "great-entrance-departed",
    "segment_ids": [
      "great-entrance-priest-departed"
    ],
    "phrase_ids": [
      "great-entrance-servants-of-god-001",
      "great-entrance-departed-servants-001",
      "great-entrance-hope-resurrection-001",
      "great-entrance-eternal-life-001",
      "great-entrance-names-001"
    ]
  },
  {
    "id": "great-entrance-angelic-hosts",
    "segment_ids": [
      "great-entrance-choir-cherubic-completion"
    ],
    "phrase_ids": [
      "amen-001",
      "great-entrance-angelic-hosts-001",
      "cherubic-invisibly-001"
    ],
    "media": CHERUBIC_HYMN_MEDIA
  },
  {
    "id": "great-entrance-summary",
    "segment_ids": [
      "great-entrance-deacon-all",
      "great-entrance-choir-amen-1",
      "great-entrance-priest-hierarch",
      "great-entrance-choir-amen-2",
      "great-entrance-priest-rulers",
      "great-entrance-choir-amen-3",
      "great-entrance-priest-living",
      "great-entrance-choir-amen-4",
      "great-entrance-priest-departed",
      "great-entrance-choir-cherubic-completion"
    ],
    "show_speakers": true,
    "media": GREAT_ENTRANCE_MEDIA
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
      "course-trisagion-have-mercy",
      "course-trisagion-with-strength"
    ],
    "include_rubric_phrase_ids": [
      "dynamis-001"
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
  const displayRubricPhraseIds = new Set(definition.include_rubric_phrase_ids || []);
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
    function isDisplayExemptPart(part) {
      if (part?.tags?.includes('display-rubric') && displayRubricPhraseIds.size > 0) return false;
      return isPracticeExemptPart(part) && !displayRubricPhraseIds.has(part?.phrase_id);
    }
    function isIncludedPhrase(part) {
      return Boolean(
        part?.phrase_id
          && !isDisplayExemptPart(part)
          && (!phraseIdSet || phraseIdSet.has(part.phrase_id))
      );
    }
    function hasLaterPhrase(parts, startIndex) {
      return parts.slice(startIndex + 1).some(part => part.phrase_id && !isDisplayExemptPart(part));
    }
    function filterPhraseParts(parts) {
      if (!phraseIdSet) return parts.filter(part => !isDisplayExemptPart(part)).map(part => ({ ...part }));
      return parts.filter((part, index) => {
        if (part.phrase_id) return isIncludedPhrase(part);
        const previousPart = parts[index - 1];
        const nextPart = parts[index + 1];
        const previousIncluded = isIncludedPhrase(previousPart);
        const nextIncluded = isIncludedPhrase(nextPart);
        return previousIncluded && (nextIncluded || !hasLaterPhrase(parts, index));
      }).map(part => ({ ...part }));
    }
    function splitLineParts(segment, parts) {
      if (!segment.split_phrases_by_line_breaks) return [parts];
      const hasLineBreakMarkers = parts.some(part => part.line_break_after);
      if (!hasLineBreakMarkers) return [parts];

      const lines = [];
      let currentParts = [];
      parts.forEach(part => {
        currentParts.push(part);
        if (part.line_break_after) {
          lines.push(currentParts);
          currentParts = [];
        }
      });
      if (currentParts.length > 0) lines.push(currentParts);
      return lines.filter(lineParts => lineParts.some(part => part.phrase_id || part.text?.trim()));
    }

    return ids
      .map((segmentId, segmentIndex) => ({ segmentId, segmentIndex, segment: segmentsMap[segmentId] }))
      .filter(({ segment }) => Boolean(segment) && !segment.tags?.includes('rubric') && !segment.tags?.includes('quiet'))
      .flatMap(({ segmentId, segmentIndex, segment }) => (
        splitLineParts(segment, filterPhraseParts(segment.phrases))
          .map((lineParts, lineIndex) => ({
            ...segment,
            segment_id: lineIndex === 0 ? segmentId : `${segmentId}@${segmentIndex}:${lineIndex}`,
            source_segment_id: segmentId,
            line_order: null,
            break_before: lineIndex === 0 ? segment.break_before : false,
            phrases: lineParts
          }))
      ))
      .map((line, index) => ({
        ...line,
        line_order: index + 1
      }))
      .filter(Boolean)
      .filter(line => line.phrases.some(part => part.phrase_id));
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
  return part.tags?.includes('rubric') || part.tags?.includes('display-rubric') || phrases[part.phrase_id]?.tags?.includes('rubric');
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
  const filteredPhraseTimings = getFilteredPhraseTimings(serviceRange.range.phrase_timings, definition.phrase_ids);
  const bounds = definition.phrase_ids
    ? getRangeBounds({ phrase_timings: filteredPhraseTimings })
    : getRangeBounds(serviceRange.range);
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
    .map(timing => ({ ...timing }))
    .sort((first, second) => first.start_seconds - second.start_seconds);
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
    return getFilteredPhraseTimings(serviceRange.range.phrase_timings, exercise.phrase_ids);
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

export function canUseActivityType(exerciseId, activityType) {
  const phraseCount = getExercisePhraseCount(exerciseId);
  if ([
    PASSAGE_ACTIVITY_TYPES.arrange,
    PASSAGE_ACTIVITY_TYPES.matching
  ].includes(activityType)) {
    return phraseCount > 1;
  }
  return true;
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
  if (phraseCount > 1 && phraseCount <= 6) {
    activityOptions.push({
      label: PASSAGE_ACTIVITY_LABELS[PASSAGE_ACTIVITY_TYPES.matching],
      activity_type: PASSAGE_ACTIVITY_TYPES.matching
    });
  }
  if (phraseCount > 1 && phraseCount <= 12) {
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
  const phraseIdSet = new Set(phraseIds);
  const captions = alignedCaptions.filter(timing => phraseIdSet.has(timing.phrase_id));
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
