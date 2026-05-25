// Editable learner path definitions.
// Tracks describe guided paths; bonus items live inside a parent track.

const courseTracks = [
  {
    id: "track-lord-have-mercy",
    type: "track",
    title: "Lord, have mercy",
    subtitle: "Foundational track",
    description: "Begin with the core plea for mercy and expand it into the Jesus Prayer.",
    lesson_ids: [
      "lesson-lord-have-mercy",
      "lesson-jesus-prayer"
    ],
    unlocks: [
      "track-trisagion"
    ]
  },
  {
    id: "track-trisagion",
    type: "track",
    title: "The Trisagion Prayers",
    subtitle: "Opening prayers",
    description: "Build the opening Trisagion prayers piece by piece.",
    prerequisite_track_ids: [
      "track-lord-have-mercy"
    ],
    lesson_ids: [
      "lesson-glory",
      "lesson-thrice-holy",
      "lesson-all-holy-trinity",
      "lesson-heavenly-king"
    ],
    unlocks: [
      "track-lords-prayer"
    ]
  },
  {
    id: "track-lords-prayer",
    type: "track",
    title: "The Lord's Prayer",
    subtitle: "Daily prayer",
    description: "Practice the Lord's Prayer and its closing prayer.",
    prerequisite_track_ids: [
      "track-trisagion"
    ],
    lesson_ids: [
      "lesson-lords-prayer",
      "lesson-through-the-prayers",
      "lesson-lords-prayer-thine-kingdom"
    ],
    unlocks: [
      "track-come-let-us-worship"
    ]
  },
  {
    id: "track-come-let-us-worship",
    type: "track",
    title: "Come, let us worship",
    subtitle: "Daily prayer hymns",
    description: "Practice compact hymns and refrains that bridge daily prayer and the Divine Liturgy.",
    prerequisite_track_ids: [
      "track-lords-prayer"
    ],
    lesson_ids: [
      "lesson-come-let-us-worship",
      "lesson-alleluia-glory-our-god-hope",
      "lesson-hymn-to-the-theotokos"
    ],
    unlocks: [
      "track-divine-liturgy-part-1"
    ]
  },
  {
    id: "track-divine-liturgy-part-1",
    type: "track",
    title: "The Divine Liturgy – Part 1",
    subtitle: "Opening rites",
    description: "Begin the Divine Liturgy with the opening blessing, hymns, antiphons, entrance, and Liturgy of the Word.",
    prerequisite_track_ids: [
      "track-come-let-us-worship"
    ],
    lesson_ids: [
      "lesson-blessed-is-the-kingdom",
      "lesson-antiphons",
      "lesson-little-litanies",
      "lesson-entrance",
      "lesson-liturgy-word",
      "lesson-cherubic-hymn"
    ],
    unlocks: [
      "track-divine-liturgy-part-2"
    ]
  },
  {
    id: "track-divine-liturgy-part-2",
    type: "track",
    title: "The Divine Liturgy – Part 2",
    subtitle: "Offering and Anaphora",
    description: "Continue through the Great Entrance, Creed, Holy Anaphora, and the litanies leading toward the Lord's Prayer.",
    prerequisite_track_ids: [
      "track-divine-liturgy-part-1"
    ],
    lesson_ids: [
      "lesson-great-entrance",
      "lesson-litany-of-peace",
      "lesson-litany-of-supplication",
      "lesson-creed",
      "lesson-holy-anaphora",
      "lesson-litany-after-anaphora",
      "lesson-litany-before-lords-prayer"
    ],
    unlocks: [
      "track-divine-liturgy-part-3"
    ]
  },
  {
    id: "track-divine-liturgy-part-3",
    type: "track",
    title: "The Divine Liturgy – Part 3",
    subtitle: "Communion and dismissal",
    description: "Complete the Liturgy path with the Peace, elevation, communion prayers, thanksgiving, and dismissal.",
    prerequisite_track_ids: [
      "track-divine-liturgy-part-2"
    ],
    lesson_ids: [
      "lesson-lords-prayer-doxologies",
      "lesson-elevation",
      "lesson-pre-communion-prayers",
      "lesson-communion-hymns",
      "lesson-litany-of-thanksgiving",
      "lesson-prayer-behind-amvon",
      "lesson-dismissal"
    ]
  },
];

export default courseTracks;
