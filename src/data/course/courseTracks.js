// Editable learner path definitions.
// Tracks describe guided paths; bonus items live inside a parent track.

const courseTracks = [
  {
    id: "track-trisagion",
    type: "track",
    title: "The Trisagion Prayers",
    subtitle: "Foundational track",
    description: "Start with Lord, have mercy, then build the opening prayers piece by piece.",
    lesson_ids: [
      "lesson-lord-have-mercy",
      "lesson-glory",
      "lesson-thrice-holy",
      "lesson-all-holy-trinity",
      "lesson-lords-prayer"
    ],
    unlocks: [
      "track-divine-liturgy-part-1",
      "lesson-jesus-prayer",
      "lesson-come-let-us-worship"
    ]
  },
  {
    id: "lesson-jesus-prayer",
    type: "bonus",
    title: "The Jesus Prayer",
    subtitle: "Bonus lesson",
    description: "Expand the most common plea for mercy into a personal prayer.",
    parent_track_id: "track-trisagion",
    lesson_id: "lesson-jesus-prayer",
    sequence_after_lesson_id: "lesson-lord-have-mercy",
  },
  {
    id: "track-divine-liturgy-part-1",
    type: "track",
    title: "The Divine Liturgy – Part 1",
    subtitle: "Opening rites",
    description: "Begin the Divine Liturgy with the opening blessing, hymns, antiphons, entrance, and Liturgy of the Word.",
    prerequisite_track_ids: [
      "track-trisagion"
    ],
    lesson_ids: [
      "lesson-blessed-is-the-kingdom",
      "lesson-hymn-to-the-theotokos",
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
    description: "Complete the Liturgy path with the Lord's Prayer doxologies, elevation, communion prayers, thanksgiving, and dismissal.",
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
  {
    id: "lesson-come-let-us-worship",
    type: "bonus",
    title: "Come, Let Us Worship",
    subtitle: "Bonus lesson",
    description: "A compact prayer that shows up across daily prayer and service beginnings.",
    parent_track_id: "track-trisagion",
    lesson_id: "lesson-come-let-us-worship",
    sequence_after_lesson_id: "lesson-lords-prayer",
  },
];

export default courseTracks;
