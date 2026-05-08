// Editable liturgical segment definitions.
// This file is not generated from CSV; edit phrase composition and line breaks here.

function phraseParts(parts) {
  return parts.map((part, index) => ({
    ...part,
    display_order: index + 1
  }));
}

const sourceSegments = {
  "litany-peace-in-peace": {
    "speaker": "role-deacon",
    "tags": [],
    "phrases": [
      {
        "phrase_id": "peace-001"
      }
    ]
  },
  "litany-peace-let-us-pray": {
    "speaker": "role-deacon",
    "tags": [],
    "phrases": [
      {
        "phrase_id": "petition-001"
      }
    ]
  },
  "litany-peace-lord-have-mercy-choir": {
    "speaker": "role-choir",
    "tags": [],
    "phrases": [
      {
        "phrase_id": "lord-have-mercy-001"
      },
      {
        "text": "."
      }
    ]
  },
  "litany-peace-from-above": {
    "speaker": "role-deacon",
    "break_before": true,
    "tags": [],
    "phrases": [
      {
        "phrase_id": "peace-from-above-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "salvation-001"
      },
      {
        "text": "،"
      }
    ]
  },
  "litany-peace-whole-world": {
    "speaker": "role-deacon",
    "break_before": true,
    "tags": [],
    "phrases": [
      {
        "phrase_id": "whole-world-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "holy-churches-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "union-001"
      },
      {
        "text": "،"
      }
    ]
  },
  "litany-peace-holy-house": {
    "speaker": "role-deacon",
    "break_before": true,
    "tags": [],
    "phrases": [
      {
        "phrase_id": "holy-house-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "those-who-enter-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "with-faith-reverence-fear-001"
      },
      {
        "text": "،"
      }
    ]
  },
  "litany-peace-father-metropolitan": {
    "speaker": "role-deacon",
    "break_before": true,
    "tags": [
      "litany"
    ],
    "phrases": [
      {
        "phrase_id": "father-metropolitan-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "rubric-so-and-so-001"
      },
      {
        "text": "، "
      },
      {
        "text": "("
      },
      {
        "phrase_id": "bishop-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "rubric-so-and-so-001"
      },
      {
        "text": ")"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "honorable-presbytery-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "diaconate-in-christ-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "clergy-people-001"
      },
      {
        "text": "،"
      }
    ]
  },
  "litany-peace-country-authorities": {
    "speaker": "role-deacon",
    "break_before": true,
    "tags": [
      "litany"
    ],
    "phrases": [
      {
        "phrase_id": "country-president-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "support-good-work-001"
      },
      {
        "text": "،"
      }
    ]
  },
  "litany-peace-this-city": {
    "speaker": "role-deacon",
    "break_before": true,
    "tags": [
      "litany"
    ],
    "phrases": [
      {
        "phrase_id": "this-city-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "monasteries-cities-villages-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "faithful-dwell-therein-001"
      },
      {
        "text": "،"
      }
    ]
  },
  "litany-peace-help-save": {
    "speaker": "role-deacon",
    "tags": [],
    "phrases": [
      {
        "phrase_id": "help-save-have-mercy-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "preserve-us-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "o-god-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "by-your-grace-001"
      },
      {
        "text": "."
      }
    ]
  },
  "litany-peace-lord-have-mercy-all": {
    "speaker": "role-all",
    "tags": [],
    "phrases": [
      {
        "phrase_id": "lord-have-mercy-001"
      },
      {
        "text": "."
      }
    ]
  },
  "course-lord-have-mercy-split": {
    "speaker": "role-choir",
    "tags": [],
    "phrases": [
      {
        "phrase_id": "vocative-o-lord-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "have-mercy-001"
      },
      {
        "text": "."
      }
    ]
  },
  "antiphon-word-of-god-only-begotten": {
    "speaker": "role-all",
    "tags": [],
    "phrases": [
      {
        "phrase_id": "word-of-god-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "only-begotten-001"
      },
      {
        "text": "،"
      }
    ]
  },
  "antiphon-deathless": {
    "speaker": "role-all",
    "tags": [],
    "phrases": [
      {
        "phrase_id": "deathless-001"
      },
      {
        "text": "،"
      }
    ]
  },
  "antiphon-accepted-incarnate": {
    "speaker": "role-all",
    "tags": [],
    "phrases": [
      {
        "phrase_id": "accepted-incarnate-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "for-our-salvation-001"
      },
      {
        "text": "،"
      }
    ]
  },
  "antiphon-from-theotokos": {
    "speaker": "role-all",
    "tags": [],
    "phrases": [
      {
        "phrase_id": "from-theotokos-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "ever-virgin-mary-001"
      },
      {
        "text": "،"
      }
    ]
  },
  "antiphon-became-man": {
    "speaker": "role-all",
    "tags": [],
    "phrases": [
      {
        "phrase_id": "became-man-001"
      },
      {
        "text": "."
      }
    ]
  },
  "antiphon-crucified": {
    "speaker": "role-all",
    "tags": [],
    "phrases": [
      {
        "phrase_id": "crucified-001"
      },
      {
        "text": "،"
      }
    ]
  },
  "antiphon-trampled-death": {
    "speaker": "role-all",
    "tags": [],
    "phrases": [
      {
        "phrase_id": "trampled-death-001"
      },
      {
        "text": "،"
      }
    ]
  },
  "antiphon-one-of-trinity": {
    "speaker": "role-all",
    "tags": [],
    "phrases": [
      {
        "phrase_id": "one-of-trinity-001"
      },
      {
        "text": "،"
      }
    ]
  },
  "antiphon-glorified-with-father": {
    "speaker": "role-all",
    "tags": [],
    "phrases": [
      {
        "phrase_id": "glorified-with-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "father-holy-spirit-001"
      },
      {
        "text": "،"
      }
    ]
  },
  "antiphon-save-us": {
    "speaker": "role-all",
    "tags": [],
    "phrases": [
      {
        "phrase_id": "save-us-001"
      },
      {
        "text": "."
      }
    ]
  },
  "second-antiphon-save-us-risen-1": {
    "speaker": "role-choir",
    "tags": [
      "antiphon",
      "hymn",
      "ordinary-sundays"
    ],
    "phrases": [
      {
        "phrase_id": "save-us-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "son-of-god-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "entrance-risen-dead-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "entrance-we-sing-to-you-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "alleluia-001"
      },
      {
        "text": "."
      }
    ]
  },
  "second-antiphon-weekdays-label": {
    "speaker": "role-choir",
    "break_before": true,
    "tags": [
      "antiphon",
      "hymn",
      "weekdays",
      "rubric"
    ],
    "phrases": [
      {
        "text": "("
      },
      {
        "phrase_id": "weekdays-label-001"
      },
      {
        "text": ")"
      }
    ]
  },
  "second-antiphon-save-us-weekdays": {
    "speaker": "role-choir",
    "tags": [
      "antiphon",
      "hymn",
      "weekdays"
    ],
    "phrases": [
      {
        "phrase_id": "save-us-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "son-of-god-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "entrance-wondrous-saints-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "entrance-we-sing-to-you-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "alleluia-001"
      },
      {
        "text": "."
      }
    ]
  },
  "second-antiphon-glory": {
    "speaker": "role-choir",
    "break_before": true,
    "tags": [
      "antiphon",
      "hymn",
      "doxology"
    ],
    "phrases": [
      {
        "phrase_id": "glory-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "to-father-son-holy-spirit-001"
      },
      {
        "text": "."
      }
    ]
  },
  "second-antiphon-save-us-risen-2": {
    "speaker": "role-choir",
    "tags": [
      "antiphon",
      "hymn",
      "ordinary-sundays"
    ],
    "phrases": [
      {
        "phrase_id": "save-us-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "son-of-god-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "entrance-risen-dead-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "entrance-we-sing-to-you-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "alleluia-001"
      },
      {
        "text": "."
      }
    ]
  },
  "second-antiphon-both-now": {
    "speaker": "role-choir",
    "break_before": true,
    "tags": [
      "antiphon",
      "hymn",
      "doxology"
    ],
    "phrases": [
      {
        "phrase_id": "doxology-now-ever-ages-001"
      },
      {
        "text": ". "
      },
      {
        "phrase_id": "amen-001"
      },
      {
        "text": "."
      }
    ]
  },
  "entrance-let-us-pray": {
    "speaker": "role-deacon",
    "tags": [
      "entrance"
    ],
    "phrases": [
      {
        "phrase_id": "petition-001"
      },
      {
        "text": "."
      }
    ]
  },
  "entrance-priest-master-lord-quiet": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": [
      "entrance",
      "quiet",
      "priest-prayer"
    ],
    "phrases": [
      {
        "phrase_id": "entrance-master-lord-god-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "entrance-appointed-angels-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "entrance-service-glory-001"
      },
      {
        "text": ". "
      },
      {
        "phrase_id": "entrance-make-our-entrance-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "entrance-angels-serving-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "entrance-glorifying-goodness-001"
      },
      {
        "text": "."
      }
    ]
  },
  "entrance-priest-doxology": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": [
      "entrance",
      "doxology"
    ],
    "phrases": [
      {
        "phrase_id": "doxology-for-fitting-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "doxology-glory-honor-worship-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "doxology-father-son-spirit-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "doxology-now-ever-ages-001"
      },
      {
        "text": "."
      }
    ]
  },
  "entrance-amen": {
    "speaker": "role-deacon",
    "break_before": true,
    "tags": [
      "entrance"
    ],
    "phrases": [
      {
        "phrase_id": "amen-001"
      },
      {
        "text": "."
      }
    ]
  },
  "entrance-bless-master": {
    "speaker": "role-deacon",
    "tags": [
      "entrance"
    ],
    "phrases": [
      {
        "phrase_id": "entrance-bless-master-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "entrance-holy-entrance-001"
      },
      {
        "text": "."
      }
    ]
  },
  "entrance-blessed-entrance": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": [
      "entrance",
      "blessing"
    ],
    "phrases": [
      {
        "phrase_id": "entrance-blessed-entrance-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "entrance-holy-ones-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "entrance-always-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "doxology-now-ever-ages-001"
      },
      {
        "text": "."
      }
    ]
  },
  "entrance-deacon-amen": {
    "speaker": "role-deacon",
    "break_before": true,
    "tags": [
      "entrance"
    ],
    "phrases": [
      {
        "phrase_id": "amen-001"
      },
      {
        "text": "."
      }
    ]
  },
  "entrance-wisdom-stand-upright": {
    "speaker": "role-deacon",
    "tags": [
      "entrance"
    ],
    "phrases": [
      {
        "phrase_id": "wisdom-001"
      },
      {
        "text": ". "
      },
      {
        "phrase_id": "stand-upright-001"
      },
      {
        "text": "."
      }
    ]
  },
  "entrance-hymn-come-worship": {
    "speaker": "role-choir",
    "tags": [
      "entrance",
      "hymn"
    ],
    "phrases": [
      {
        "phrase_id": "entrance-come-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "entrance-worship-bow-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "entrance-christ-king-god-001"
      },
      {
        "text": "."
      }
    ]
  },
  "entrance-hymn-save-us-son-of-god": {
    "speaker": "role-choir",
    "break_before": true,
    "tags": [
      "entrance",
      "hymn"
    ],
    "phrases": [
      {
        "phrase_id": "save-us-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "son-of-god-001"
      },
      {
        "text": "،"
      }
    ]
  },
  "entrance-hymn-risen-label": {
    "speaker": "role-choir",
    "break_before": true,
    "tags": [
      "entrance",
      "hymn",
      "ordinary-sundays",
      "rubric"
    ],
    "phrases": [
      {
        "text": "("
      },
      {
        "phrase_id": "ordinary-sundays-label-001"
      },
      {
        "text": ")"
      }
    ]
  },
  "entrance-hymn-risen-sundays": {
    "speaker": "role-choir",
    "tags": [
      "entrance",
      "hymn",
      "ordinary-sundays"
    ],
    "phrases": [
      {
        "phrase_id": "entrance-risen-dead-001"
      },
      {
        "text": "،"
      }
    ]
  },
  "course-entrance-hymn-risen-sundays": {
    "speaker": "role-choir",
    "break_before": true,
    "tags": [
      "entrance",
      "hymn",
      "ordinary-sundays"
    ],
    "phrases": [
      {
        "text": "(",
        "tags": [
          "rubric"
        ]
      },
      {
        "phrase_id": "ordinary-sundays-label-001"
      },
      {
        "text": ") ",
        "tags": [
          "rubric"
        ]
      },
      {
        "phrase_id": "entrance-risen-dead-001"
      },
      {
        "text": "،"
      }
    ]
  },
  "entrance-hymn-risen-alleluia": {
    "speaker": "role-choir",
    "tags": [
      "entrance",
      "hymn",
      "ordinary-sundays"
    ],
    "phrases": [
      {
        "phrase_id": "entrance-we-sing-to-you-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "alleluia-001"
      },
      {
        "text": "."
      }
    ]
  },
  "entrance-hymn-weekdays-label": {
    "speaker": "role-choir",
    "break_before": true,
    "tags": [
      "entrance",
      "hymn",
      "weekdays",
      "rubric"
    ],
    "phrases": [
      {
        "text": "("
      },
      {
        "phrase_id": "weekdays-label-001"
      },
      {
        "text": ")"
      }
    ]
  },
  "entrance-hymn-wondrous-weekdays": {
    "speaker": "role-choir",
    "tags": [
      "entrance",
      "hymn",
      "weekdays"
    ],
    "phrases": [
      {
        "phrase_id": "entrance-wondrous-saints-001"
      },
      {
        "text": "،"
      }
    ]
  },
  "course-entrance-hymn-wondrous-weekdays": {
    "speaker": "role-choir",
    "break_before": true,
    "tags": [
      "entrance",
      "hymn",
      "weekdays"
    ],
    "phrases": [
      {
        "text": "(",
        "tags": [
          "rubric"
        ]
      },
      {
        "phrase_id": "weekdays-label-001"
      },
      {
        "text": ") ",
        "tags": [
          "rubric"
        ]
      },
      {
        "phrase_id": "entrance-wondrous-saints-001"
      },
      {
        "text": "،"
      }
    ]
  },
  "entrance-hymn-wondrous-alleluia": {
    "speaker": "role-choir",
    "tags": [
      "entrance",
      "hymn",
      "weekdays"
    ],
    "phrases": [
      {
        "phrase_id": "entrance-we-sing-to-you-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "alleluia-001"
      },
      {
        "text": "."
      }
    ]
  },
  "entrance-hymn-rubric": {
    "speaker": "",
    "break_before": true,
    "tags": [
      "rubric",
      "entrance"
    ],
    "phrases": [
      {
        "phrase_id": "entrance-rubric-chant-hymns-001"
      },
      {
        "text": " ("
      },
      {
        "phrase_id": "entrance-rubric-refer-bulletin-001"
      },
      {
        "text": ") "
      },
      {
        "phrase_id": "entrance-rubric-priest-prayer-001"
      },
      {
        "text": "."
      }
    ]
  },
  "trisagion-holy-god-resting-quiet": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": [
      "quiet",
      "priest-prayer",
      "trisagion"
    ],
    "phrases": [
      {
        "phrase_id": "trisagion-holy-god-resting-001"
      }
    ]
  },
  "trisagion-seraphim-quiet": {
    "speaker": "role-priest",
    "tags": [
      "quiet",
      "priest-prayer",
      "trisagion"
    ],
    "phrases": [
      {
        "phrase_id": "trisagion-seraphim-001"
      }
    ]
  },
  "trisagion-cherubim-quiet": {
    "speaker": "role-priest",
    "tags": [
      "quiet",
      "priest-prayer",
      "trisagion"
    ],
    "phrases": [
      {
        "phrase_id": "trisagion-cherubim-001"
      }
    ]
  },
  "trisagion-heavenly-powers-quiet": {
    "speaker": "role-priest",
    "tags": [
      "quiet",
      "priest-prayer",
      "trisagion"
    ],
    "phrases": [
      {
        "phrase_id": "trisagion-heavenly-powers-001"
      }
    ]
  },
  "trisagion-out-of-nothing-quiet": {
    "speaker": "role-priest",
    "tags": [
      "quiet",
      "priest-prayer",
      "trisagion"
    ],
    "phrases": [
      {
        "phrase_id": "trisagion-out-of-nothing-001"
      }
    ]
  },
  "trisagion-created-humanity-quiet": {
    "speaker": "role-priest",
    "tags": [
      "quiet",
      "priest-prayer",
      "trisagion"
    ],
    "phrases": [
      {
        "phrase_id": "trisagion-created-humanity-001"
      }
    ]
  },
  "trisagion-gives-wisdom-quiet": {
    "speaker": "role-priest",
    "tags": [
      "quiet",
      "priest-prayer",
      "trisagion"
    ],
    "phrases": [
      {
        "phrase_id": "trisagion-gives-wisdom-001"
      }
    ]
  },
  "trisagion-not-neglect-sinners-quiet": {
    "speaker": "role-priest",
    "tags": [
      "quiet",
      "priest-prayer",
      "trisagion"
    ],
    "phrases": [
      {
        "phrase_id": "trisagion-not-neglect-sinners-001"
      }
    ]
  },
  "trisagion-repentance-salvation-quiet": {
    "speaker": "role-priest",
    "tags": [
      "quiet",
      "priest-prayer",
      "trisagion"
    ],
    "phrases": [
      {
        "phrase_id": "trisagion-repentance-salvation-001"
      }
    ]
  },
  "trisagion-made-worthy-servants-quiet": {
    "speaker": "role-priest",
    "tags": [
      "quiet",
      "priest-prayer",
      "trisagion"
    ],
    "phrases": [
      {
        "phrase_id": "trisagion-made-worthy-servants-001"
      }
    ]
  },
  "trisagion-stand-before-altar-quiet": {
    "speaker": "role-priest",
    "tags": [
      "quiet",
      "priest-prayer",
      "trisagion"
    ],
    "phrases": [
      {
        "phrase_id": "trisagion-stand-before-altar-001"
      }
    ]
  },
  "trisagion-offer-worship-quiet": {
    "speaker": "role-priest",
    "tags": [
      "quiet",
      "priest-prayer",
      "trisagion"
    ],
    "phrases": [
      {
        "phrase_id": "trisagion-offer-worship-001"
      }
    ]
  },
  "trisagion-receive-from-mouths-quiet": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": [
      "quiet",
      "priest-prayer",
      "trisagion"
    ],
    "phrases": [
      {
        "phrase_id": "trisagion-receive-from-mouths-001"
      }
    ]
  },
  "trisagion-thrice-holy-hymn-quiet": {
    "speaker": "role-priest",
    "tags": [
      "quiet",
      "priest-prayer",
      "trisagion"
    ],
    "phrases": [
      {
        "phrase_id": "trisagion-thrice-holy-hymn-001"
      }
    ]
  },
  "trisagion-visit-goodness-quiet": {
    "speaker": "role-priest",
    "tags": [
      "quiet",
      "priest-prayer",
      "trisagion"
    ],
    "phrases": [
      {
        "phrase_id": "trisagion-visit-goodness-001"
      }
    ]
  },
  "trisagion-forgive-every-sin-quiet": {
    "speaker": "role-priest",
    "tags": [
      "quiet",
      "priest-prayer",
      "trisagion"
    ],
    "phrases": [
      {
        "phrase_id": "trisagion-forgive-every-sin-001"
      }
    ]
  },
  "trisagion-sanctify-souls-bodies-quiet": {
    "speaker": "role-priest",
    "tags": [
      "quiet",
      "priest-prayer",
      "trisagion"
    ],
    "phrases": [
      {
        "phrase_id": "trisagion-sanctify-souls-bodies-001"
      }
    ]
  },
  "trisagion-grant-worship-quiet": {
    "speaker": "role-priest",
    "tags": [
      "quiet",
      "priest-prayer",
      "trisagion"
    ],
    "phrases": [
      {
        "phrase_id": "trisagion-grant-worship-001"
      }
    ]
  },
  "trisagion-all-days-life-quiet": {
    "speaker": "role-priest",
    "tags": [
      "quiet",
      "priest-prayer",
      "trisagion"
    ],
    "phrases": [
      {
        "phrase_id": "trisagion-all-days-life-001"
      }
    ]
  },
  "trisagion-theotokos-intercessions-quiet": {
    "speaker": "role-priest",
    "tags": [
      "quiet",
      "priest-prayer",
      "trisagion"
    ],
    "phrases": [
      {
        "phrase_id": "trisagion-theotokos-intercessions-001"
      }
    ]
  },
  "trisagion-all-saints-quiet": {
    "speaker": "role-priest",
    "tags": [
      "quiet",
      "priest-prayer",
      "trisagion"
    ],
    "phrases": [
      {
        "phrase_id": "trisagion-all-saints-001"
      }
    ]
  },
  "entrance-hymn-final-let-us-pray": {
    "speaker": "role-deacon",
    "break_before": true,
    "tags": [
      "entrance",
      "trisagion"
    ],
    "phrases": [
      {
        "phrase_id": "petition-001"
      },
      {
        "text": "."
      }
    ]
  },
  "entrance-hymn-final-lord-have-mercy": {
    "speaker": "role-choir",
    "tags": [
      "entrance",
      "trisagion"
    ],
    "phrases": [
      {
        "phrase_id": "lord-have-mercy-001"
      },
      {
        "text": "."
      }
    ]
  },
  "entrance-hymn-holy-art-benediction": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": [
      "entrance",
      "trisagion",
      "doxology"
    ],
    "phrases": [
      {
        "phrase_id": "for-holy-art-thou-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "unto-thee-ascribe-glory-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "doxology-father-son-spirit-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "now-and-ever-001"
      },
      {
        "text": " ..."
      }
    ]
  },
  "entrance-hymn-deacon-ages": {
    "speaker": "role-deacon",
    "tags": [
      "entrance",
      "trisagion",
      "doxology"
    ],
    "phrases": [
      {
        "phrase_id": "unto-ages-of-ages-001"
      },
      {
        "text": "."
      }
    ]
  },
  "entrance-hymn-final-amen": {
    "speaker": "role-choir",
    "tags": [
      "entrance",
      "trisagion"
    ],
    "phrases": [
      {
        "phrase_id": "amen-001"
      },
      {
        "text": "."
      }
    ]
  },
  "preparation-heavenly-king": {
    "speaker": "role-priest",
    "tags": [
      "preparation"
    ],
    "phrases": [
      {
        "phrase_id": "preparation-heavenly-king-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "preparation-everywhere-present-001"
      },
      {
        "text": "،"
      }
    ]
  },
  "preparation-treasury-giver": {
    "speaker": "role-priest",
    "tags": [
      "preparation"
    ],
    "phrases": [
      {
        "phrase_id": "preparation-treasury-giver-001"
      },
      {
        "text": ": "
      },
      {
        "phrase_id": "preparation-come-abide-001"
      },
      {
        "text": "،"
      }
    ]
  },
  "preparation-cleanse-save": {
    "speaker": "role-priest",
    "tags": [
      "preparation"
    ],
    "phrases": [
      {
        "phrase_id": "preparation-cleanse-save-001"
      },
      {
        "text": "."
      }
    ]
  },
  "preparation-rubric-omit-heavenly-king": {
    "speaker": "",
    "break_before": true,
    "tags": [
      "rubric",
      "preparation"
    ],
    "phrases": [
      {
        "phrase_id": "preparation-rubric-omit-heavenly-king-001"
      },
      {
        "text": "."
      }
    ]
  },
  "preparation-glory-highest": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": [
      "preparation"
    ],
    "phrases": [
      {
        "phrase_id": "glory-highest-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "earth-peace-goodwill-001"
      },
      {
        "text": ". ("
      },
      {
        "phrase_id": "thrice-001"
      },
      {
        "text": ")"
      }
    ]
  },
  "preparation-open-my-lips": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": [
      "preparation"
    ],
    "phrases": [
      {
        "phrase_id": "open-my-lips-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "declare-praise-001"
      },
      {
        "text": ". ("
      },
      {
        "phrase_id": "twice-001"
      },
      {
        "text": ")"
      }
    ]
  },
  "preparation-open-door-mercy": {
    "speaker": "role-priest",
    "tags": [
      "preparation"
    ],
    "phrases": [
      {
        "phrase_id": "open-door-mercy-001"
      },
      {
        "text": "."
      }
    ]
  },
  "preparation-time-lord-act": {
    "speaker": "role-deacon",
    "break_before": true,
    "tags": [
      "preparation",
      "clergy-dialogue"
    ],
    "phrases": [
      {
        "phrase_id": "time-lord-act-001"
      },
      {
        "text": ". "
      },
      {
        "phrase_id": "bless-holy-master-001"
      },
      {
        "text": "."
      }
    ]
  },
  "preparation-blessed-is-our-god": {
    "speaker": "role-priest",
    "tags": [
      "preparation",
      "clergy-dialogue"
    ],
    "phrases": [
      {
        "phrase_id": "blessed-is-our-god-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "always-now-ever-ages-001"
      },
      {
        "text": "."
      }
    ]
  },
  "preparation-pray-for-me": {
    "speaker": "role-deacon",
    "tags": [
      "preparation",
      "clergy-dialogue"
    ],
    "phrases": [
      {
        "phrase_id": "amen-001"
      },
      {
        "text": ". "
      },
      {
        "phrase_id": "pray-for-me-holy-master-001"
      },
      {
        "text": "."
      }
    ]
  },
  "preparation-lord-direct-steps": {
    "speaker": "role-priest",
    "tags": [
      "preparation",
      "clergy-dialogue"
    ],
    "phrases": [
      {
        "phrase_id": "lord-direct-steps-001"
      },
      {
        "text": "."
      }
    ]
  },
  "preparation-remember-me": {
    "speaker": "role-deacon",
    "tags": [
      "preparation",
      "clergy-dialogue"
    ],
    "phrases": [
      {
        "phrase_id": "remember-me-holy-master-001"
      },
      {
        "text": "."
      }
    ]
  },
  "preparation-lord-remember-kingdom": {
    "speaker": "role-priest",
    "tags": [
      "preparation",
      "clergy-dialogue"
    ],
    "phrases": [
      {
        "phrase_id": "lord-remember-kingdom-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "always-now-ever-ages-001"
      },
      {
        "text": "."
      }
    ]
  },
  "opening-bless-master": {
    "speaker": "role-deacon",
    "tags": [
      "opening"
    ],
    "phrases": [
      {
        "phrase_id": "opening-bless-master-001"
      },
      {
        "text": "."
      }
    ]
  },
  "opening-blessed-kingdom": {
    "speaker": "role-priest",
    "tags": [
      "opening"
    ],
    "phrases": [
      {
        "phrase_id": "opening-blessed-kingdom-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "father-son-holy-spirit-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "doxology-now-ever-ages-001"
      },
      {
        "text": "."
      }
    ]
  },
  "opening-amen": {
    "speaker": "role-choir",
    "tags": [
      "opening"
    ],
    "phrases": [
      {
        "phrase_id": "amen-001"
      },
      {
        "text": "."
      }
    ]
  },
  "litany-peace-healthful-seasons": {
    "speaker": "role-deacon",
    "break_before": true,
    "tags": [
      "litany"
    ],
    "phrases": [
      {
        "phrase_id": "healthful-seasons-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "abundance-fruits-earth-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "peaceful-times-001"
      },
      {
        "text": "،"
      }
    ]
  },
  "litany-peace-travelers": {
    "speaker": "role-deacon",
    "break_before": true,
    "tags": [
      "litany"
    ],
    "phrases": [
      {
        "phrase_id": "travelers-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "sea-land-air-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "sick-suffering-captive-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "their-salvation-001"
      },
      {
        "text": "،"
      }
    ]
  },
  "litany-peace-deliverance": {
    "speaker": "role-deacon",
    "break_before": true,
    "tags": [
      "litany"
    ],
    "phrases": [
      {
        "phrase_id": "deliverance-tribulation-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "from-all-tribulation-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "wrath-danger-necessity-001"
      },
      {
        "text": "،"
      }
    ]
  },
  "litany-peace-calling-remembrance": {
    "speaker": "role-deacon",
    "break_before": true,
    "tags": [
      "litany"
    ],
    "phrases": [
      {
        "phrase_id": "calling-remembrance-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "all-holy-immaculate-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "most-blessed-glorious-lady-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "theotokos-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "ever-virgin-mary-002"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "with-all-saints-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "commend-ourselves-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "and-each-other-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "and-all-our-life-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "unto-christ-our-god-001"
      },
      {
        "text": "."
      }
    ]
  },
  "litany-peace-to-thee-o-lord": {
    "speaker": "role-choir",
    "tags": [
      "litany"
    ],
    "phrases": [
      {
        "phrase_id": "to-thee-o-lord"
      },
      {
        "text": "."
      }
    ]
  },
  "litany-peace-priest-might-quiet": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": [
      "litany",
      "quiet",
      "priest-prayer"
    ],
    "phrases": [
      {
        "phrase_id": "o-lord-our-god-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "whose-might-beyond-compare-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "whose-glory-incomprehensible-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "whose-mercy-boundless-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "whose-love-ineffable-001"
      },
      {
        "text": ":"
      }
    ]
  },
  "litany-peace-priest-look-quiet": {
    "speaker": "role-priest",
    "tags": [
      "litany",
      "quiet",
      "priest-prayer"
    ],
    "phrases": [
      {
        "phrase_id": "do-thou-o-master-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "in-tender-compassion-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "upon-us-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "upon-this-holy-house-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "grant-rich-mercies-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "upon-us-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "upon-those-pray-with-us-001"
      },
      {
        "text": "."
      }
    ]
  },
  "litany-peace-priest-doxology": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": [
      "litany",
      "doxology"
    ],
    "phrases": [
      {
        "phrase_id": "doxology-for-fitting-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "doxology-glory-honor-worship-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "doxology-father-son-spirit-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "doxology-now-ever-ages-001"
      },
      {
        "text": "."
      }
    ]
  },
  "litany-peace-choir-amen": {
    "speaker": "role-choir",
    "tags": [
      "litany"
    ],
    "phrases": [
      {
        "phrase_id": "amen-001"
      },
      {
        "text": "."
      }
    ]
  },
  "litany-peace-rubric-theotokos-icon": {
    "speaker": "",
    "break_before": true,
    "tags": [
      "rubric"
    ],
    "phrases": [
      {
        "phrase_id": "rubric-deacon-theotokos-icon-001"
      },
      {
        "text": "."
      }
    ]
  },
  "first-antiphon-through-theotokos-1": {
    "speaker": "role-choir",
    "tags": [
      "antiphon"
    ],
    "phrases": [
      {
        "phrase_id": "through-intercessions-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "theotokos-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "o-savior-save-us-001"
      },
      {
        "text": "."
      }
    ]
  },
  "first-antiphon-glory": {
    "speaker": "role-choir",
    "break_before": true,
    "tags": [
      "antiphon"
    ],
    "phrases": [
      {
        "phrase_id": "glory-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "to-father-son-holy-spirit-001"
      },
      {
        "text": "."
      }
    ]
  },
  "first-antiphon-through-theotokos-2": {
    "speaker": "role-choir",
    "tags": [
      "antiphon"
    ],
    "phrases": [
      {
        "phrase_id": "through-intercessions-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "theotokos-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "o-savior-save-us-001"
      },
      {
        "text": "."
      }
    ]
  },
  "first-antiphon-both-now": {
    "speaker": "role-choir",
    "break_before": true,
    "tags": [
      "antiphon"
    ],
    "phrases": [
      {
        "phrase_id": "doxology-now-ever-ages-001"
      },
      {
        "text": ". "
      },
      {
        "phrase_id": "amen-001"
      },
      {
        "text": "."
      }
    ]
  },
  "first-antiphon-through-theotokos-3": {
    "speaker": "role-choir",
    "tags": [
      "antiphon"
    ],
    "phrases": [
      {
        "phrase_id": "through-intercessions-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "theotokos-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "o-savior-save-us-001"
      },
      {
        "text": "."
      }
    ]
  },
  "first-antiphon-rubric-little-litany": {
    "speaker": "",
    "break_before": true,
    "tags": [
      "rubric"
    ],
    "phrases": [
      {
        "phrase_id": "rubric-deacon-holy-doors-little-litany-001"
      },
      {
        "text": "."
      }
    ]
  },
  "little-litany-again": {
    "speaker": "role-deacon",
    "tags": [
      "little-litany"
    ],
    "phrases": [
      {
        "phrase_id": "again-and-again"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "peace-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "petition-001"
      },
      {
        "text": "."
      }
    ]
  },
  "little-litany-lord-have-mercy-1": {
    "speaker": "role-choir",
    "tags": [
      "little-litany"
    ],
    "phrases": [
      {
        "phrase_id": "lord-have-mercy-001"
      },
      {
        "text": "."
      }
    ]
  },
  "little-litany-help-save": {
    "speaker": "role-deacon",
    "tags": [
      "little-litany"
    ],
    "phrases": [
      {
        "phrase_id": "help-save-have-mercy-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "preserve-us-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "o-god-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "by-your-grace-001"
      },
      {
        "text": "."
      }
    ]
  },
  "little-litany-lord-have-mercy-2": {
    "speaker": "role-choir",
    "tags": [
      "little-litany"
    ],
    "phrases": [
      {
        "phrase_id": "lord-have-mercy-001"
      },
      {
        "text": "."
      }
    ]
  },
  "little-litany-calling-remembrance": {
    "speaker": "role-deacon",
    "break_before": true,
    "tags": [
      "little-litany"
    ],
    "phrases": [
      {
        "phrase_id": "calling-remembrance-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "all-holy-immaculate-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "most-blessed-glorious-lady-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "theotokos-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "ever-virgin-mary-002"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "with-all-saints-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "commend-ourselves-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "and-each-other-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "and-all-our-life-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "unto-christ-our-god-001"
      },
      {
        "text": "."
      }
    ]
  },
  "little-litany-to-thee-o-lord": {
    "speaker": "role-choir",
    "tags": [
      "little-litany"
    ],
    "phrases": [
      {
        "phrase_id": "to-thee-o-lord"
      },
      {
        "text": "."
      }
    ]
  },
  "little-litany-save-thy-people-quiet": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": [
      "little-litany",
      "quiet",
      "priest-prayer"
    ],
    "phrases": [
      {
        "phrase_id": "save-thy-people-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "preserve-fullness-church-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "sanctify-love-house-001"
      },
      {
        "text": "،"
      }
    ]
  },
  "little-litany-glorify-forsake-quiet": {
    "speaker": "role-priest",
    "tags": [
      "little-litany",
      "quiet",
      "priest-prayer"
    ],
    "phrases": [
      {
        "phrase_id": "glorify-by-power-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "forsake-us-not-001"
      },
      {
        "text": "."
      }
    ]
  },
  "little-litany-for-thine-might": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": [
      "little-litany",
      "doxology"
    ],
    "phrases": [
      {
        "phrase_id": "for-thine-might-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "for-thine-kingdom-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "power-and-glory-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "doxology-of-father-son-spirit-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "doxology-now-ever-ages-001"
      },
      {
        "text": "."
      }
    ]
  },
  "little-litany-common-supplications-quiet": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": [
      "little-litany",
      "second-antiphon",
      "quiet",
      "priest-prayer"
    ],
    "phrases": [
      {
        "phrase_id": "granted-common-supplications-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "common-supplications-accord-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "promise-two-three-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "gathered-in-thy-name-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "grant-their-requests-001"
      },
      {
        "text": ":"
      }
    ]
  },
  "little-litany-fulfill-quiet": {
    "speaker": "role-priest",
    "tags": [
      "little-litany",
      "second-antiphon",
      "quiet",
      "priest-prayer"
    ],
    "phrases": [
      {
        "phrase_id": "fulfill-desires-petitions-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "as-expedient-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "grant-knowledge-truth-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "age-to-come-life-everlasting-001"
      },
      {
        "text": "."
      }
    ]
  },
  "little-litany-good-god-doxology": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": [
      "little-litany",
      "second-antiphon",
      "doxology"
    ],
    "phrases": [
      {
        "phrase_id": "good-god-lovest-mankind-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "little-litany-ascribe-glory-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "doxology-father-son-spirit-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "doxology-now-ever-ages-001"
      },
      {
        "text": "."
      }
    ]
  },
  "little-litany-amen": {
    "speaker": "role-choir",
    "tags": [
      "little-litany"
    ],
    "phrases": [
      {
        "phrase_id": "amen-001"
      },
      {
        "text": "."
      }
    ]
  },
  "little-litany-rubric-christ-icon": {
    "speaker": "",
    "break_before": true,
    "tags": [
      "rubric"
    ],
    "phrases": [
      {
        "phrase_id": "rubric-deacon-christ-icon-001"
      },
      {
        "text": "."
      }
    ]
  },
  "trisagion-hymn-holy-god-1": {
    "speaker": "role-choir",
    "tags": [
      "trisagion",
      "hymn"
    ],
    "phrases": [
      {
        "phrase_id": "holy-god-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "holy-mighty-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "holy-immortal-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "have-mercy-on-us-001"
      },
      {
        "text": " (",
        "tags": [
          "rubric"
        ]
      },
      {
        "phrase_id": "thrice-001"
      },
      {
        "text": ")",
        "tags": [
          "rubric"
        ]
      }
    ]
  },
  "trisagion-hymn-glory": {
    "speaker": "role-choir",
    "break_before": true,
    "tags": [
      "trisagion",
      "hymn"
    ],
    "phrases": [
      {
        "phrase_id": "glory-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "to-father-son-holy-spirit-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "doxology-now-ever-ages-001"
      },
      {
        "text": ". "
      },
      {
        "phrase_id": "amen-001"
      },
      {
        "text": "."
      }
    ]
  },
  "trisagion-hymn-holy-immortal": {
    "speaker": "role-choir",
    "tags": [
      "trisagion",
      "hymn"
    ],
    "phrases": [
      {
        "phrase_id": "holy-immortal-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "have-mercy-on-us-001"
      },
      {
        "text": "."
      }
    ]
  },
  "trisagion-with-strength": {
    "speaker": "role-deacon",
    "break_before": true,
    "tags": [
      "trisagion"
    ],
    "phrases": [
      {
        "phrase_id": "with-strength-001"
      },
      {
        "text": ". "
      },
      {
        "text": "(",
        "tags": [
          "rubric"
        ]
      },
      {
        "phrase_id": "dynamis-001"
      },
      {
        "text": ")",
        "tags": [
          "rubric"
        ]
      },
      {
        "text": "."
      }
    ]
  },
  "trisagion-hymn-holy-god-2": {
    "speaker": "role-choir",
    "tags": [
      "trisagion",
      "hymn"
    ],
    "phrases": [
      {
        "phrase_id": "holy-god-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "holy-mighty-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "holy-immortal-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "have-mercy-on-us-001"
      },
      {
        "text": "."
      }
    ]
  },
  "trisagion-rubric-baptized": {
    "speaker": "",
    "break_before": true,
    "tags": [
      "trisagion"
    ],
    "phrases": [
      {
        "phrase_id": "rubric-trisagion-baptized-001"
      },
      {
        "text": ": ",
        "tags": [
          "rubric"
        ]
      },
      {
        "phrase_id": "as-many-of-you-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "baptized-into-christ-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "put-on-christ-001"
      },
      {
        "text": ". "
      },
      {
        "phrase_id": "alleluia-001"
      },
      {
        "text": "."
      }
    ]
  },
  "trisagion-rubric-cross": {
    "speaker": "",
    "break_before": true,
    "tags": [
      "trisagion"
    ],
    "phrases": [
      {
        "phrase_id": "rubric-trisagion-cross-001"
      },
      {
        "text": ": ",
        "tags": [
          "rubric"
        ]
      },
      {
        "phrase_id": "venerate-cross-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "glorify-resurrection-001"
      },
      {
        "text": "."
      }
    ]
  },
  "word-command-master": {
    "speaker": "role-deacon",
    "tags": [
      "word"
    ],
    "phrases": [
      {
        "phrase_id": "command-master-001"
      },
      {
        "text": "."
      }
    ]
  },
  "word-blessed-cometh": {
    "speaker": "role-priest",
    "tags": [
      "word"
    ],
    "phrases": [
      {
        "phrase_id": "blessed-cometh-001"
      },
      {
        "text": "."
      }
    ]
  },
  "word-bless-throne": {
    "speaker": "role-deacon",
    "tags": [
      "word"
    ],
    "phrases": [
      {
        "phrase_id": "bless-throne-high-001"
      },
      {
        "text": "."
      }
    ]
  },
  "word-blessed-throne": {
    "speaker": "role-priest",
    "tags": [
      "word"
    ],
    "phrases": [
      {
        "phrase_id": "blessed-throne-glory-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "enthroned-cherubim-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "always-now-ever-ages-001"
      },
      {
        "text": "."
      }
    ]
  },
  "word-amen": {
    "speaker": "role-deacon",
    "tags": [
      "word"
    ],
    "phrases": [
      {
        "phrase_id": "amen-001"
      },
      {
        "text": "."
      }
    ]
  },
  "epistle-let-us-attend-1": {
    "speaker": "role-deacon",
    "tags": [
      "word",
      "epistle"
    ],
    "phrases": [
      {
        "phrase_id": "let-us-attend-001"
      },
      {
        "text": "."
      }
    ]
  },
  "epistle-reader-prokeimenon": {
    "speaker": "role-reader",
    "tags": [
      "rubric",
      "epistle"
    ],
    "phrases": [
      {
        "phrase_id": "reader-announces-prokeimenon-001"
      },
      {
        "text": "."
      }
    ]
  },
  "epistle-wisdom": {
    "speaker": "role-deacon",
    "break_before": true,
    "tags": [
      "word",
      "epistle"
    ],
    "phrases": [
      {
        "phrase_id": "wisdom-001"
      },
      {
        "text": "."
      }
    ]
  },
  "epistle-reader-title": {
    "speaker": "role-reader",
    "tags": [
      "rubric",
      "epistle"
    ],
    "phrases": [
      {
        "phrase_id": "reader-announces-epistle-title-001"
      },
      {
        "text": "."
      }
    ]
  },
  "epistle-let-us-attend-2": {
    "speaker": "role-deacon",
    "tags": [
      "word",
      "epistle"
    ],
    "phrases": [
      {
        "phrase_id": "let-us-attend-001"
      },
      {
        "text": "."
      }
    ]
  },
  "epistle-reader-reads": {
    "speaker": "role-reader",
    "tags": [
      "rubric",
      "epistle"
    ],
    "phrases": [
      {
        "phrase_id": "reader-reads-epistle-001"
      },
      {
        "text": "."
      }
    ]
  },
  "epistle-peace-reader": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": [
      "word",
      "epistle"
    ],
    "phrases": [
      {
        "phrase_id": "peace-reader-001"
      },
      {
        "text": "."
      }
    ]
  },
  "epistle-alleluia": {
    "speaker": "role-choir",
    "tags": [
      "word",
      "epistle"
    ],
    "phrases": [
      {
        "phrase_id": "alleluia-001"
      },
      {
        "text": ". "
      },
      {
        "text": "(",
        "tags": [
          "rubric"
        ]
      },
      {
        "phrase_id": "thrice-001"
      },
      {
        "text": ")",
        "tags": [
          "rubric"
        ]
      }
    ]
  },
  "gospel-prayer-let-us-pray": {
    "speaker": "role-deacon",
    "tags": [
      "gospel"
    ],
    "phrases": [
      {
        "phrase_id": "petition-001"
      },
      {
        "text": ". "
      },
      {
        "phrase_id": "lord-have-mercy-001"
      },
      {
        "text": "."
      }
    ]
  },
  "gospel-prayer-illumine-quiet": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": [
      "gospel",
      "quiet",
      "priest-prayer"
    ],
    "phrases": [
      {
        "phrase_id": "illumine-hearts-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "illumine-hearts-002"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "illumine-hearts-003"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "open-eyes-mind-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "open-eyes-mind-002"
      },
      {
        "text": "."
      }
    ]
  },
  "gospel-prayer-commandments-quiet": {
    "speaker": "role-priest",
    "tags": [
      "gospel",
      "quiet",
      "priest-prayer"
    ],
    "phrases": [
      {
        "phrase_id": "implant-fear-commandments-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "implant-fear-commandments-002"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "spiritual-living-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "spiritual-living-002"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "spiritual-living-003"
      },
      {
        "text": "."
      }
    ]
  },
  "gospel-prayer-doxology-quiet": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": [
      "gospel",
      "quiet",
      "priest-prayer",
      "doxology"
    ],
    "phrases": [
      {
        "phrase_id": "illumination-souls-bodies-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "illumination-souls-bodies-002"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "illumination-souls-bodies-003"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "unoriginate-father-spirit-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "unoriginate-father-spirit-002"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "unoriginate-father-spirit-003"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "doxology-now-ever-ages-001"
      },
      {
        "text": ". "
      },
      {
        "phrase_id": "amen-001"
      },
      {
        "text": "."
      }
    ]
  },
  "gospel-bless-proclaimer": {
    "speaker": "role-deacon",
    "break_before": true,
    "tags": [
      "gospel"
    ],
    "phrases": [
      {
        "phrase_id": "bless-proclaimer-gospel-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "bless-proclaimer-gospel-002"
      },
      {
        "text": "."
      }
    ]
  },
  "gospel-may-god-enable": {
    "speaker": "role-priest",
    "tags": [
      "gospel"
    ],
    "phrases": [
      {
        "phrase_id": "may-god-enable-gospel-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "may-god-enable-gospel-002"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "may-god-enable-gospel-003"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "may-god-enable-gospel-004"
      },
      {
        "text": "."
      }
    ]
  },
  "gospel-reading-amen": {
    "speaker": "role-deacon",
    "tags": [
      "gospel"
    ],
    "phrases": [
      {
        "phrase_id": "amen-001"
      },
      {
        "text": "."
      }
    ]
  },
  "gospel-wisdom-stand": {
    "speaker": "role-deacon",
    "break_before": true,
    "tags": [
      "gospel"
    ],
    "phrases": [
      {
        "phrase_id": "wisdom-001"
      },
      {
        "text": ". "
      },
      {
        "phrase_id": "stand-upright-001"
      },
      {
        "text": ". "
      },
      {
        "phrase_id": "hear-holy-gospel-001"
      },
      {
        "text": "."
      }
    ]
  },
  "gospel-peace-all": {
    "speaker": "role-priest",
    "tags": [
      "gospel"
    ],
    "phrases": [
      {
        "phrase_id": "peace-be-to-all-001"
      },
      {
        "text": "."
      }
    ]
  },
  "gospel-and-spirit": {
    "speaker": "role-choir",
    "tags": [
      "gospel"
    ],
    "phrases": [
      {
        "phrase_id": "and-to-thy-spirit-001"
      },
      {
        "text": "."
      }
    ]
  },
  "gospel-reading-from": {
    "speaker": "role-deacon",
    "tags": [
      "gospel"
    ],
    "phrases": [
      {
        "phrase_id": "reading-holy-gospel-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "reading-holy-gospel-002"
      },
      {
        "text": " (",
        "tags": [
          "rubric"
        ]
      },
      {
        "phrase_id": "placeholder-so-and-so-001"
      },
      {
        "text": ") ",
        "tags": [
          "rubric"
        ]
      },
      {
        "phrase_id": "reading-holy-gospel-003"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "reading-holy-gospel-004"
      },
      {
        "text": "."
      }
    ]
  },
  "gospel-glory-before": {
    "speaker": "role-choir",
    "tags": [
      "gospel"
    ],
    "phrases": [
      {
        "phrase_id": "glory-to-thee-lord-001"
      },
      {
        "text": "."
      }
    ]
  },
  "gospel-let-us-attend": {
    "speaker": "role-deacon",
    "tags": [
      "gospel"
    ],
    "phrases": [
      {
        "phrase_id": "let-us-attend-001"
      },
      {
        "text": "."
      }
    ]
  },
  "gospel-appointed-reading-rubric": {
    "speaker": "",
    "break_before": true,
    "tags": [
      "rubric",
      "gospel"
    ],
    "phrases": [
      {
        "phrase_id": "rubric-appointed-gospel-001"
      },
      {
        "text": "."
      }
    ]
  },
  "gospel-glory-after": {
    "speaker": "role-choir",
    "tags": [
      "gospel"
    ],
    "phrases": [
      {
        "phrase_id": "glory-to-thee-lord-001"
      },
      {
        "text": "."
      }
    ]
  },
  "course-jesus-prayer": {
    "speaker": "",
    "tags": [
      "course",
      "jesus-prayer"
    ],
    "phrases": [
      {
        "phrase_id": "vocative-o-lord-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "jesus-prayer-jesus-christ-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "jesus-prayer-son-of-god-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "jesus-prayer-have-mercy-on-me-001"
      },
      {
        "text": "."
      }
    ]
  },
  "course-glory-beginner": {
    "speaker": "",
    "tags": [
      "course",
      "beginner",
      "doxology"
    ],
    "phrases": [
      {
        "phrase_id": "glory-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "to-father-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "beginner-and-to-son-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "beginner-and-to-holy-spirit-001"
      },
      {
        "text": "."
      }
    ]
  },
  "course-both-now-beginner": {
    "speaker": "",
    "break_before": true,
    "tags": [
      "course",
      "beginner",
      "doxology"
    ],
    "phrases": [
      {
        "phrase_id": "beginner-both-now-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "beginner-and-ever-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "beginner-unto-ages-001"
      },
      {
        "text": ". "
      },
      {
        "phrase_id": "amen-001"
      },
      {
        "text": "."
      }
    ]
  },
  "course-trisagion-holy-god": {
    "speaker": "",
    "tags": [
      "course",
      "beginner",
      "trisagion",
      "hymn"
    ],
    "phrases": [
      {
        "phrase_id": "holy-god-001"
      },
      {
        "text": "،"
      }
    ]
  },
  "course-trisagion-holy-mighty": {
    "speaker": "",
    "break_before": true,
    "tags": [
      "course",
      "beginner",
      "trisagion",
      "hymn"
    ],
    "phrases": [
      {
        "phrase_id": "holy-mighty-001"
      },
      {
        "text": "،"
      }
    ]
  },
  "course-trisagion-holy-immortal": {
    "speaker": "",
    "break_before": true,
    "tags": [
      "course",
      "beginner",
      "trisagion",
      "hymn"
    ],
    "phrases": [
      {
        "phrase_id": "holy-immortal-001"
      },
      {
        "text": "،"
      }
    ]
  },
  "course-trisagion-have-mercy": {
    "speaker": "",
    "break_before": true,
    "tags": [
      "course",
      "beginner",
      "trisagion",
      "hymn"
    ],
    "phrases": [
      {
        "phrase_id": "have-mercy-on-us-001"
      },
      {
        "text": "."
      }
    ]
  },
  "course-all-holy-trinity-address": {
    "speaker": "",
    "tags": [
      "course",
      "beginner",
      "all-holy-trinity"
    ],
    "phrases": [
      {
        "phrase_id": "all-holy-trinity-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "all-holy-trinity-have-mercy-001"
      },
      {
        "text": "."
      }
    ]
  },
  "course-all-holy-trinity-lord": {
    "speaker": "",
    "break_before": true,
    "tags": [
      "course",
      "beginner",
      "all-holy-trinity"
    ],
    "phrases": [
      {
        "phrase_id": "vocative-o-lord-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "all-holy-trinity-cleanse-sins-001"
      },
      {
        "text": "."
      }
    ]
  },
  "course-all-holy-trinity-master": {
    "speaker": "",
    "break_before": true,
    "tags": [
      "course",
      "beginner",
      "all-holy-trinity"
    ],
    "phrases": [
      {
        "phrase_id": "vocative-o-master-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "all-holy-trinity-pardon-iniquities-001"
      },
      {
        "text": "."
      }
    ]
  },
  "course-all-holy-trinity-holy-one": {
    "speaker": "",
    "break_before": true,
    "tags": [
      "course",
      "beginner",
      "all-holy-trinity"
    ],
    "phrases": [
      {
        "phrase_id": "vocative-o-holy-one-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "all-holy-trinity-visit-heal-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "all-holy-trinity-name-sake-001"
      },
      {
        "text": "."
      }
    ]
  },
  "course-come-worship-god-king": {
    "speaker": "",
    "tags": [
      "course",
      "unit-2",
      "come-let-us-worship"
    ],
    "phrases": [
      {
        "phrase_id": "come-worship-fall-down-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "before-god-our-king-001"
      },
      {
        "text": "."
      }
    ]
  },
  "course-come-worship-christ-king": {
    "speaker": "",
    "break_before": true,
    "tags": [
      "course",
      "unit-2",
      "come-let-us-worship"
    ],
    "phrases": [
      {
        "phrase_id": "come-worship-fall-down-001"
      },
      {
        "text": " لِ"
      },
      {
        "phrase_id": "christ-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "our-king-god-001"
      },
      {
        "text": "."
      }
    ]
  },
  "course-come-worship-christ-himself": {
    "speaker": "",
    "break_before": true,
    "tags": [
      "course",
      "unit-2",
      "come-let-us-worship"
    ],
    "phrases": [
      {
        "phrase_id": "come-worship-fall-down-001"
      },
      {
        "text": " لِ"
      },
      {
        "phrase_id": "christ-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "this-is-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "our-king-lord-god-001"
      },
      {
        "text": "."
      }
    ]
  }
};

const segments = Object.fromEntries(
  Object.entries(sourceSegments).map(([id, segment]) => [
    id,
    {
      ...segment,
      phrases: phraseParts(segment.phrases)
    }
  ])
);

export default segments;
