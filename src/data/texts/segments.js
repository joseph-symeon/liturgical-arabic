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
      },
      {
        "text": "."
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
  "vespers-litany-country-authorities": {
    "speaker": "role-deacon",
    "break_before": true,
    "tags": [
      "litany",
      "vespers"
    ],
    "phrases": [
      {
        "phrase_id": "vespers-country-authorities-001"
      },
      {
        "text": "، "
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
        "text": " "
      },
      {
        "phrase_id": "preserve-us-001"
      },
      {
        "text": " "
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
        "text": "،"
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
        "text": "، "
      },
      {
        "phrase_id": "save-us-001"
      },
      {
        "text": "."
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
        "text": ". (مرتين)"
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
        "phrase_id": "weekdays-label-001"
      },
      {
        "text": ":"
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
        "phrase_id": "entrance-doxology-fitting-001"
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
        "phrase_id": "entrance-master-vocative-001"
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
        "text": " (صوفيا أورثي)."
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
        "phrase_id": "entrance-ordinary-sundays-label-001"
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
        "text": ": "
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
        "phrase_id": "entrance-weekdays-label-001"
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
        "text": ": "
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
        "text": ". ("
      },
      {
        "phrase_id": "entrance-rubric-refer-bulletin-001"
      },
      {
        "text": ")، "
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
  "trisagion-adorned-gifts-quiet": {
    "speaker": "role-priest",
    "tags": [
      "quiet",
      "priest-prayer",
      "trisagion"
    ],
    "phrases": [
      {
        "phrase_id": "trisagion-adorned-gifts-001"
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
        "phrase_id": "entrance-hymn-father-son-spirit-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "now-and-ever-001"
      },
      {
        "text": "..."
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
  "vespers-opening-blessed-is-our-god": {
    "speaker": "role-priest",
    "tags": [
      "opening",
      "vespers"
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
  "vespers-opening-amen": {
    "speaker": "role-choir",
    "tags": [
      "opening",
      "vespers"
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
  "vespers-come-worship-god-king": {
    "speaker": "role-reader",
    "tags": [
      "come-let-us-worship",
      "opening",
      "vespers"
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
  "vespers-come-worship-christ-king": {
    "speaker": "role-reader",
    "break_before": true,
    "tags": [
      "come-let-us-worship",
      "opening",
      "vespers"
    ],
    "phrases": [
      {
        "phrase_id": "come-worship-fall-down-001"
      },
      {
        "text": " "
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
  "vespers-come-worship-christ-himself": {
    "speaker": "role-reader",
    "break_before": true,
    "tags": [
      "come-let-us-worship",
      "opening",
      "vespers"
    ],
    "phrases": [
      {
        "phrase_id": "come-worship-fall-down-001"
      },
      {
        "text": " "
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
  },
  "vespers-psalm103-glory-both-now": {
    "speaker": "role-reader",
    "break_before": true,
    "tags": [
      "doxology",
      "psalm-103",
      "vespers"
    ],
    "phrases": [
      {
        "phrase_id": "departed-glory-trinity-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "departed-both-now-001"
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
  "vespers-psalm103-alleluia-glory": {
    "speaker": "role-reader",
    "break_before": true,
    "tags": [
      "psalm-103",
      "vespers"
    ],
    "phrases": [
      {
        "phrase_id": "alleluia-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "alleluia-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "alleluia-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "thanksgiving-after-communion-glory-001"
      },
      {
        "text": ". "
      },
      {
        "phrase_id": "thanksgiving-after-communion-thrice-001"
      }
    ]
  },
  "vespers-psalm103-our-god-hope": {
    "speaker": "role-reader",
    "break_before": true,
    "tags": [
      "doxology",
      "psalm-103",
      "vespers"
    ],
    "phrases": [
      {
        "phrase_id": "vespers-our-god-hope-glory-001"
      },
      {
        "text": "."
      }
    ]
  },
  "vespers-lord-cried-refrain": {
    "speaker": "role-choir",
    "break_before": true,
    "tags": ["psalm", "vespers"],
    "phrases": [
      {"phrase_id": "vespers-lord-cried-to-thee-001"},
      {"text": "، "},
      {"phrase_id": "vespers-hear-me-001"},
      {"text": "، "},
      {"phrase_id": "vespers-hear-me-o-lord-001"},
      {"text": ". "},
      {"phrase_id": "vespers-lord-cried-to-thee-001"},
      {"text": " "},
      {"phrase_id": "vespers-hear-me-001"},
      {"text": "، "},
      {"phrase_id": "vespers-give-ear-supplication-001"},
      {"text": " "},
      {"phrase_id": "vespers-when-i-cry-to-thee-001"},
      {"text": "، "},
      {"phrase_id": "vespers-hear-me-o-lord-001"},
      {"text": "."}
    ]
  },
  "vespers-lord-cried-prayer-incense": {
    "speaker": "role-choir",
    "break_before": true,
    "tags": ["psalm", "vespers"],
    "phrases": [
      {"phrase_id": "vespers-prayer-incense-001"},
      {"text": "، "},
      {"phrase_id": "vespers-lifting-hands-sacrifice-001"},
      {"text": "، "},
      {"phrase_id": "vespers-hear-me-o-lord-001"},
      {"text": "."}
    ]
  },
  "vespers-lord-cried-set-watch": {
    "speaker": "role-choir",
    "break_before": true,
    "tags": ["psalm", "vespers"],
    "phrases": [
      {"phrase_id": "vespers-set-watch-mouth-001"},
      {"text": " "},
      {"phrase_id": "vespers-door-lips-001"},
      {"text": "."}
    ]
  },
  "vespers-lord-cried-incline-not": {
    "speaker": "role-choir",
    "break_before": true,
    "tags": ["psalm", "vespers"],
    "phrases": [
      {"phrase_id": "vespers-incline-not-heart-001"},
      {"text": " "},
      {"phrase_id": "vespers-excuses-in-sins-001"},
      {"text": "."}
    ]
  },
  "vespers-lord-cried-men-iniquity": {
    "speaker": "role-choir",
    "break_before": true,
    "tags": ["psalm", "vespers"],
    "phrases": [
      {"phrase_id": "vespers-men-work-iniquity-001"},
      {"text": " "},
      {"phrase_id": "vespers-not-join-chosen-001"},
      {"text": "."}
    ]
  },
  "vespers-lord-cried-just-man": {
    "speaker": "role-choir",
    "break_before": true,
    "tags": ["psalm", "vespers"],
    "phrases": [
      {"phrase_id": "vespers-just-man-correct-001"},
      {"text": " "},
      {"phrase_id": "vespers-oil-sinner-001"},
      {"text": "."}
    ]
  },
  "vespers-lord-cried-prayer-pleasures": {
    "speaker": "role-choir",
    "break_before": true,
    "tags": ["psalm", "vespers"],
    "phrases": [
      {"phrase_id": "vespers-prayer-pleasures-001"},
      {"text": "، "},
      {"phrase_id": "vespers-judges-swallowed-001"},
      {"text": " "},
      {"phrase_id": "vespers-clinging-rock-001"},
      {"text": "."}
    ]
  },
  "vespers-lord-cried-hear-words": {
    "speaker": "role-choir",
    "break_before": true,
    "tags": ["psalm", "vespers"],
    "phrases": [
      {"phrase_id": "vespers-hear-my-words-001"},
      {"text": " "},
      {"phrase_id": "vespers-words-sweet-001"},
      {"text": " "},
      {"phrase_id": "vespers-earth-broken-001"},
      {"text": " "},
      {"phrase_id": "vespers-bones-scattered-hades-001"},
      {"text": "."}
    ]
  },
  "vespers-lord-cried-eyes-to-thee": {
    "speaker": "role-choir",
    "break_before": true,
    "tags": ["psalm", "vespers"],
    "phrases": [
      {"phrase_id": "vespers-eyes-to-thee-001"},
      {"text": " "},
      {"phrase_id": "vespers-trusted-thee-001"},
      {"text": " "},
      {"phrase_id": "vespers-take-not-soul-001"},
      {"text": "."}
    ]
  },
  "vespers-lord-cried-keep-snare": {
    "speaker": "role-choir",
    "break_before": true,
    "tags": ["psalm", "vespers"],
    "phrases": [
      {"phrase_id": "vespers-keep-me-snare-001"},
      {"text": " "},
      {"phrase_id": "vespers-traps-workers-iniquity-001"},
      {"text": "."}
    ]
  },
  "vespers-lord-cried-wicked-fall": {
    "speaker": "role-choir",
    "break_before": true,
    "tags": ["psalm", "vespers"],
    "phrases": [
      {"phrase_id": "vespers-wicked-fall-nets-001"},
      {"text": " "},
      {"phrase_id": "vespers-alone-until-pass-001"},
      {"text": "."}
    ]
  },
  "vespers-lord-cried-voice-cried": {
    "speaker": "role-choir",
    "break_before": true,
    "tags": ["psalm", "vespers"],
    "phrases": [
      {"phrase_id": "vespers-voice-cried-lord-001"},
      {"text": "، "},
      {"phrase_id": "vespers-voice-supplicated-001"},
      {"text": "."}
    ]
  },
  "vespers-lord-cried-poured-supplication": {
    "speaker": "role-choir",
    "break_before": true,
    "tags": ["psalm", "vespers"],
    "phrases": [
      {"phrase_id": "vespers-poured-supplication-001"},
      {"text": " "},
      {"phrase_id": "vespers-tell-sorrows-001"},
      {"text": "."}
    ]
  },
  "vespers-lord-cried-spirit-overwhelmed": {
    "speaker": "role-choir",
    "break_before": true,
    "tags": ["psalm", "vespers"],
    "phrases": [
      {"phrase_id": "vespers-spirit-overwhelmed-001"},
      {"text": " "},
      {"phrase_id": "vespers-thou-knewest-paths-001"},
      {"text": "."}
    ]
  },
  "vespers-lord-cried-secret-snare": {
    "speaker": "role-choir",
    "break_before": true,
    "tags": ["psalm", "vespers"],
    "phrases": [
      {"phrase_id": "vespers-this-way-walked-001"},
      {"text": " "},
      {"phrase_id": "vespers-hid-snare-001"},
      {"text": "."}
    ]
  },
  "vespers-lord-cried-looked-right": {
    "speaker": "role-choir",
    "break_before": true,
    "tags": ["psalm", "vespers"],
    "phrases": [
      {"phrase_id": "vespers-looked-right-hand-001"},
      {"text": " "},
      {"phrase_id": "vespers-no-one-knew-me-001"},
      {"text": "."}
    ]
  },
  "vespers-lord-cried-refuge-failed": {
    "speaker": "role-choir",
    "break_before": true,
    "tags": ["psalm", "vespers"],
    "phrases": [
      {"phrase_id": "vespers-refuge-failed-001"},
      {"text": " "},
      {"phrase_id": "vespers-no-one-cared-soul-001"},
      {"text": "."}
    ]
  },
  "vespers-lord-cried-thou-art-refuge": {
    "speaker": "role-choir",
    "break_before": true,
    "tags": ["psalm", "vespers"],
    "phrases": [
      {"phrase_id": "vespers-cried-to-thee-001"},
      {"text": " "},
      {"phrase_id": "vespers-thou-art-refuge-001"},
      {"text": " "},
      {"phrase_id": "vespers-portion-living-001"},
      {"text": "."}
    ]
  },
  "vespers-lord-cried-attend-cry": {
    "speaker": "role-choir",
    "break_before": true,
    "tags": ["psalm", "vespers"],
    "phrases": [
      {"phrase_id": "vespers-attend-cry-001"},
      {"text": " "},
      {"phrase_id": "vespers-brought-low-001"},
      {"text": "."}
    ]
  },
  "vespers-lord-cried-deliver-persecutors": {
    "speaker": "role-choir",
    "break_before": true,
    "tags": ["psalm", "vespers"],
    "phrases": [
      {"phrase_id": "vespers-deliver-persecutors-001"},
      {"text": " "},
      {"phrase_id": "vespers-stronger-than-i-001"},
      {"text": "."}
    ]
  },
  "vespers-lord-cried-verse-10": {
    "speaker": "role-choir",
    "break_before": true,
    "tags": ["psalm", "vespers"],
    "phrases": [
      {"phrase_id": "vespers-verse-10-rubric"},
      {"text": " "},
      {"phrase_id": "vespers-bring-soul-prison-001"},
      {"text": "، "},
      {"phrase_id": "vespers-praise-thy-name-001"},
      {"text": "."}
    ]
  },
  "vespers-lord-cried-verse-9": {
    "speaker": "role-choir",
    "break_before": true,
    "tags": ["psalm", "vespers"],
    "phrases": [
      {"phrase_id": "vespers-verse-9-rubric"},
      {"text": " "},
      {"phrase_id": "vespers-righteous-wait-001"},
      {"text": " "},
      {"phrase_id": "vespers-until-recompense-001"},
      {"text": "."}
    ]
  },
  "vespers-lord-cried-verse-8": {
    "speaker": "role-choir",
    "break_before": true,
    "tags": ["psalm", "vespers"],
    "phrases": [
      {"phrase_id": "vespers-verse-8-rubric"},
      {"text": " "},
      {"phrase_id": "vespers-depths-cried-001"},
      {"text": "، "},
      {"phrase_id": "vespers-lord-hear-voice-001"},
      {"text": "."}
    ]
  },
  "vespers-lord-cried-verse-7": {
    "speaker": "role-choir",
    "break_before": true,
    "tags": ["psalm", "vespers"],
    "phrases": [
      {"phrase_id": "vespers-verse-7-rubric"},
      {"text": " "},
      {"phrase_id": "vespers-ears-attentive-001"},
      {"text": " "},
      {"phrase_id": "vespers-voice-supplication-001"},
      {"text": "."}
    ]
  },
  "vespers-lord-cried-verse-6": {
    "speaker": "role-choir",
    "break_before": true,
    "tags": ["psalm", "vespers"],
    "phrases": [
      {"phrase_id": "vespers-verse-6-rubric"},
      {"text": " "},
      {"phrase_id": "vespers-mark-iniquities-001"},
      {"text": "، "},
      {"phrase_id": "vespers-who-shall-stand-001"},
      {"text": " "},
      {"phrase_id": "vespers-with-thee-forgiveness-001"},
      {"text": "."}
    ]
  },
  "vespers-lord-cried-verse-5": {
    "speaker": "role-choir",
    "break_before": true,
    "tags": ["psalm", "vespers"],
    "phrases": [
      {"phrase_id": "vespers-verse-5-rubric"},
      {"text": " "},
      {"phrase_id": "vespers-because-name-waited-001"},
      {"text": "، "},
      {"phrase_id": "vespers-soul-waited-words-001"},
      {"text": "، "},
      {"phrase_id": "vespers-soul-hoped-lord-001"},
      {"text": "."}
    ]
  },
  "vespers-lord-cried-verse-4": {
    "speaker": "role-choir",
    "break_before": true,
    "tags": ["psalm", "vespers"],
    "phrases": [
      {"phrase_id": "vespers-verse-4-rubric"},
      {"text": " "},
      {"phrase_id": "vespers-morning-watch-night-001"},
      {"text": "، "},
      {"phrase_id": "vespers-israel-trust-lord-001"},
      {"text": "."}
    ]
  },
  "vespers-lord-cried-verse-3": {
    "speaker": "role-choir",
    "break_before": true,
    "tags": ["psalm", "vespers"],
    "phrases": [
      {"phrase_id": "vespers-verse-3-rubric"},
      {"text": " "},
      {"phrase_id": "vespers-with-lord-mercy-001"},
      {"text": "، "},
      {"phrase_id": "vespers-abundant-redemption-001"},
      {"text": "، "},
      {"phrase_id": "vespers-deliver-israel-iniquities-001"},
      {"text": "."}
    ]
  },
  "vespers-lord-cried-verse-2": {
    "speaker": "role-choir",
    "break_before": true,
    "tags": ["psalm", "vespers"],
    "phrases": [
      {"phrase_id": "vespers-verse-2-rubric"},
      {"text": " "},
      {"phrase_id": "vespers-praise-lord-nations-001"},
      {"text": "، "},
      {"phrase_id": "vespers-praise-him-peoples-001"},
      {"text": "."}
    ]
  },
  "vespers-lord-cried-verse-1": {
    "speaker": "role-choir",
    "break_before": true,
    "tags": ["psalm", "vespers"],
    "phrases": [
      {"phrase_id": "vespers-verse-1-rubric"},
      {"text": " "},
      {"phrase_id": "vespers-mercy-great-toward-us-001"},
      {"text": "، "},
      {"phrase_id": "vespers-truth-endures-forever-001"},
      {"text": "."}
    ]
  },
  "vespers-gladsome-light-wisdom": {
    "speaker": "role-deacon",
    "break_before": true,
    "tags": ["vespers"],
    "phrases": [
      {"phrase_id": "vespers-wisdom-001"},
      {"text": "! "},
      {"phrase_id": "vespers-stand-upright-001"},
      {"text": "!"}
    ]
  },
  "vespers-gladsome-light-hymn": {
    "speaker": "role-choir",
    "break_before": true,
    "tags": ["hymn", "vespers"],
    "phrases": [
      {"phrase_id": "vespers-gladsome-light-001"},
      {"text": " "},
      {"phrase_id": "vespers-holy-glory-father-001"},
      {"text": "، "},
      {"phrase_id": "vespers-heavenly-holy-blessed-001"},
      {"text": "، "},
      {"phrase_id": "vespers-o-jesus-christ-001"},
      {"text": "، "},
      {"phrase_id": "vespers-come-sunset-001"},
      {"text": "، "},
      {"phrase_id": "vespers-beheld-evening-light-001"},
      {"text": "، "},
      {"phrase_id": "vespers-hymn-trinity-god-001"},
      {"text": ". "},
      {"phrase_id": "vespers-son-god-giver-life-001"},
      {"text": "، "},
      {"phrase_id": "vespers-worthy-all-times-001"},
      {"text": "، "},
      {"phrase_id": "vespers-praised-joyous-voices-001"},
      {"text": "، "},
      {"phrase_id": "vespers-world-glorifies-thee-001"},
      {"text": "."}
    ]
  },
  "vespers-prokeimenon-saturday": {
    "speaker": "",
    "break_before": true,
    "tags": ["prokeimenon", "rubric", "vespers"],
    "phrases": [
      {"phrase_id": "vespers-prokeimenon-saturday-rubric"}
    ]
  },
  "vespers-prokeimenon-refrain": {
    "speaker": "role-choir",
    "break_before": true,
    "tags": ["prokeimenon", "vespers"],
    "phrases": [
      {"phrase_id": "vespers-lord-is-king-001"},
      {"text": " "},
      {"phrase_id": "vespers-clothed-majesty-001"},
      {"text": ". "},
      {"phrase_id": "vespers-prokeimenon-once-rubric"}
    ]
  },
  "vespers-prokeimenon-verse-1": {
    "speaker": "",
    "break_before": true,
    "tags": ["prokeimenon", "vespers"],
    "phrases": [
      {"phrase_id": "vespers-prokeimenon-verse-1-rubric"},
      {"text": " "},
      {"phrase_id": "vespers-lord-robed-001"},
      {"text": " "},
      {"phrase_id": "vespers-girded-strength-001"},
      {"text": ". "},
      {"phrase_id": "vespers-prokeimenon-refrain-rubric"}
    ]
  },
  "vespers-prokeimenon-verse-2": {
    "speaker": "",
    "break_before": true,
    "tags": ["prokeimenon", "vespers"],
    "phrases": [
      {"phrase_id": "vespers-prokeimenon-verse-2-rubric"},
      {"text": " "},
      {"phrase_id": "vespers-established-world-001"},
      {"text": " "},
      {"phrase_id": "vespers-world-not-moved-001"},
      {"text": ". "},
      {"phrase_id": "vespers-prokeimenon-refrain-rubric"}
    ]
  },
  "vespers-fervent-let-us-say": {
    "speaker": "role-deacon",
    "break_before": true,
    "tags": ["fervent-supplication", "litany", "vespers"],
    "phrases": [
      {"phrase_id": "vespers-fervent-whole-soul-001"},
      {"text": " "},
      {"phrase_id": "vespers-fervent-whole-mind-001"},
      {"text": "."}
    ]
  },
  "vespers-fervent-lord-have-mercy": {
    "speaker": "role-choir",
    "tags": ["fervent-supplication", "litany", "vespers"],
    "phrases": [
      {"phrase_id": "lord-have-mercy-001"},
      {"text": "."}
    ]
  },
  "vespers-fervent-lord-almighty": {
    "speaker": "role-deacon",
    "break_before": true,
    "tags": ["fervent-supplication", "litany", "vespers"],
    "phrases": [
      {"phrase_id": "vespers-fervent-lord-almighty-001"},
      {"text": " "},
      {"phrase_id": "vespers-fervent-god-fathers-001"},
      {"text": "، "},
      {"phrase_id": "vespers-fervent-hearken-mercy-001"},
      {"text": "."}
    ]
  },
  "vespers-fervent-have-mercy-god": {
    "speaker": "role-deacon",
    "break_before": true,
    "tags": ["fervent-supplication", "litany", "vespers"],
    "phrases": [
      {"phrase_id": "vespers-fervent-have-mercy-god-001"},
      {"text": " "},
      {"phrase_id": "vespers-fervent-great-mercy-001"},
      {"text": "، "},
      {"phrase_id": "vespers-fervent-hearken-mercy-001"},
      {"text": "."}
    ]
  },
  "vespers-fervent-lord-have-mercy-thrice": {
    "speaker": "role-choir",
    "tags": ["fervent-supplication", "litany", "vespers"],
    "phrases": [
      {"phrase_id": "lord-have-mercy-001"},
      {"text": ". "},
      {"phrase_id": "vespers-fervent-thrice-rubric"},
      {"text": " "},
      {"phrase_id": "vespers-fervent-repeat-rubric"}
    ]
  },
  "vespers-fervent-pious-orthodox": {
    "speaker": "role-deacon",
    "break_before": true,
    "tags": ["fervent-supplication", "litany", "vespers"],
    "phrases": [
      {"phrase_id": "vespers-fervent-again-pray-001"},
      {"text": " "},
      {"phrase_id": "vespers-fervent-pious-orthodox-001"},
      {"text": "."}
    ]
  },
  "vespers-fervent-hierarchs": {
    "speaker": "role-deacon",
    "break_before": true,
    "tags": ["fervent-supplication", "litany", "vespers"],
    "phrases": [
      {"phrase_id": "vespers-fervent-again-pray-001"},
      {"text": " "},
      {"phrase_id": "vespers-fervent-father-metropolitan-001"},
      {"text": " "},
      {"phrase_id": "rubric-so-and-so-001"},
      {"text": "، ("},
      {"phrase_id": "vespers-fervent-archpastor-001"},
      {"text": " "},
      {"phrase_id": "rubric-so-and-so-001"},
      {"text": ")."}
    ]
  },
  "vespers-fervent-clergy-monastics": {
    "speaker": "role-deacon",
    "break_before": true,
    "tags": ["fervent-supplication", "litany", "vespers"],
    "phrases": [
      {"phrase_id": "vespers-fervent-again-pray-001"},
      {"text": " "},
      {"phrase_id": "vespers-fervent-brethren-clergy-001"},
      {"text": " "},
      {"phrase_id": "vespers-fervent-monastics-001"},
      {"text": "، "},
      {"phrase_id": "vespers-fervent-brotherhood-christ-001"},
      {"text": "."}
    ]
  },
  "vespers-fervent-mercy-life": {
    "speaker": "role-deacon",
    "break_before": true,
    "tags": ["fervent-supplication", "litany", "vespers"],
    "phrases": [
      {"phrase_id": "vespers-fervent-again-pray-001"},
      {"text": " "},
      {"phrase_id": "vespers-fervent-mercy-life-peace-001"},
      {"text": "، "},
      {"phrase_id": "vespers-fervent-servants-orthodox-001"},
      {"text": "، "},
      {"phrase_id": "vespers-fervent-community-001"},
      {"text": "، "},
      {"phrase_id": "vespers-fervent-gathered-church-001"},
      {"text": "."}
    ]
  },
  "vespers-fervent-departed": {
    "speaker": "role-deacon",
    "break_before": true,
    "tags": ["fervent-supplication", "litany", "vespers"],
    "phrases": [
      {"phrase_id": "vespers-fervent-again-pray-001"},
      {"text": " "},
      {"phrase_id": "vespers-fervent-founders-001"},
      {"text": "، "},
      {"phrase_id": "vespers-fervent-departed-fathers-001"},
      {"text": "، "},
      {"phrase_id": "vespers-fervent-lie-asleep-001"},
      {"text": "."}
    ]
  },
  "vespers-fervent-good-works": {
    "speaker": "role-deacon",
    "break_before": true,
    "tags": ["fervent-supplication", "litany", "vespers"],
    "phrases": [
      {"phrase_id": "vespers-fervent-again-pray-001"},
      {"text": " "},
      {"phrase_id": "vespers-fervent-bear-fruit-001"},
      {"text": " "},
      {"phrase_id": "vespers-fervent-venerable-temple-001"},
      {"text": "، "},
      {"phrase_id": "vespers-fervent-labor-sing-001"},
      {"text": "، "},
      {"phrase_id": "vespers-fervent-people-present-001"},
      {"text": "، "},
      {"phrase_id": "vespers-fervent-await-mercy-001"},
      {"text": "."}
    ]
  },
  "vespers-fervent-priest-doxology": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": ["doxology", "fervent-supplication", "vespers"],
    "phrases": [
      {"phrase_id": "vespers-fervent-merciful-god-001"},
      {"text": " "},
      {"phrase_id": "vespers-fervent-ascribe-glory-001"},
      {"text": " "},
      {"phrase_id": "vespers-fervent-father-son-spirit-001"},
      {"text": "، "},
      {"phrase_id": "vespers-fervent-now-ever-ages-001"},
      {"text": "."}
    ]
  },
  "vespers-fervent-amen": {
    "speaker": "role-choir",
    "tags": ["fervent-supplication", "litany", "vespers"],
    "phrases": [
      {"phrase_id": "amen-001"},
      {"text": "."}
    ]
  },
  "vespers-evening-vouchsafe": {
    "speaker": "role-all",
    "break_before": true,
    "tags": ["evening-prayer", "vespers"],
    "phrases": [
      {"phrase_id": "vespers-evening-vouchsafe-001"},
      {"text": " "},
      {"phrase_id": "vespers-evening-keep-without-sin-001"},
      {"text": "."}
    ]
  },
  "vespers-evening-blessed-fathers": {
    "speaker": "role-all",
    "break_before": true,
    "tags": ["evening-prayer", "vespers"],
    "phrases": [
      {"phrase_id": "vespers-evening-blessed-lord-001"},
      {"text": "، "},
      {"phrase_id": "vespers-evening-god-fathers-001"},
      {"text": "، "},
      {"phrase_id": "vespers-evening-praised-name-001"},
      {"text": "، "},
      {"phrase_id": "amen-001"},
      {"text": "."}
    ]
  },
  "vespers-evening-mercy-hope": {
    "speaker": "role-all",
    "break_before": true,
    "tags": ["evening-prayer", "vespers"],
    "phrases": [
      {"phrase_id": "vespers-evening-mercy-upon-us-001"},
      {"text": "، "},
      {"phrase_id": "vespers-evening-hope-on-thee-001"},
      {"text": "."}
    ]
  },
  "vespers-evening-blessed-statutes": {
    "speaker": "role-all",
    "break_before": true,
    "tags": ["evening-prayer", "vespers"],
    "phrases": [
      {"phrase_id": "vespers-evening-blessed-lord-001"},
      {"text": " "},
      {"phrase_id": "vespers-evening-teach-commandments-001"},
      {"text": ". "},
      {"phrase_id": "vespers-evening-blessed-master-001"},
      {"text": " "},
      {"phrase_id": "vespers-evening-understand-statutes-001"},
      {"text": ". "},
      {"phrase_id": "vespers-evening-blessed-holy-one-001"},
      {"text": " "},
      {"phrase_id": "vespers-evening-enlighten-statutes-001"},
      {"text": "."}
    ]
  },
  "vespers-evening-mercy-works": {
    "speaker": "role-all",
    "break_before": true,
    "tags": ["evening-prayer", "vespers"],
    "phrases": [
      {"phrase_id": "vespers-evening-mercy-forever-001"},
      {"text": "، "},
      {"phrase_id": "vespers-evening-despise-not-works-001"},
      {"text": "."}
    ]
  },
  "vespers-evening-final-doxology": {
    "speaker": "role-all",
    "break_before": true,
    "tags": ["doxology", "evening-prayer", "vespers"],
    "phrases": [
      {"phrase_id": "vespers-evening-belongeth-worship-001"},
      {"text": "، "},
      {"phrase_id": "vespers-evening-belongeth-praise-001"},
      {"text": "، "},
      {"phrase_id": "vespers-evening-belongeth-glory-001"},
      {"text": "، "},
      {"phrase_id": "vespers-evening-father-son-spirit-001"},
      {"text": "، "},
      {"phrase_id": "vespers-evening-now-ever-ages-001"},
      {"text": ". "},
      {"phrase_id": "amen-001"},
      {"text": "."}
    ]
  },
  "vespers-supplication-complete-evening": {
    "speaker": "role-deacon",
    "break_before": true,
    "tags": ["litany-of-supplication", "vespers"],
    "phrases": [
      {"phrase_id": "vespers-supplication-complete-evening-001"},
      {"text": "."}
    ]
  },
  "vespers-supplication-lord-have-mercy": {
    "speaker": "role-choir",
    "tags": ["litany-of-supplication", "response", "vespers"],
    "phrases": [
      {"phrase_id": "lord-have-mercy-001"},
      {"text": "."}
    ]
  },
  "vespers-supplication-whole-evening": {
    "speaker": "role-deacon",
    "break_before": true,
    "tags": ["litany-of-supplication", "vespers"],
    "phrases": [
      {"phrase_id": "vespers-supplication-whole-evening-001"},
      {"text": " "},
      {"phrase_id": "vespers-supplication-perfect-evening-001"},
      {"text": "، "},
      {"phrase_id": "supplication-ask-lord-001"},
      {"text": "."}
    ]
  },
  "vespers-supplication-grant-this-repeat": {
    "speaker": "role-choir",
    "break_before": true,
    "tags": ["litany-of-supplication", "response", "vespers"],
    "phrases": [
      {"phrase_id": "vespers-supplication-grant-this-001"},
      {"text": ". "},
      {"phrase_id": "vespers-supplication-repeat-grant-rubric"}
    ]
  },
  "vespers-supplication-priest-doxology": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": ["doxology", "litany-of-supplication", "vespers"],
    "phrases": [
      {"phrase_id": "vespers-supplication-good-god-001"},
      {"text": "، "},
      {"phrase_id": "vespers-supplication-ascribe-glory-001"},
      {"text": "، "},
      {"phrase_id": "vespers-supplication-father-son-spirit-001"},
      {"text": "، "},
      {"phrase_id": "vespers-supplication-now-ever-ages-001"},
      {"text": "."}
    ]
  },
  "vespers-supplication-amen": {
    "speaker": "role-choir",
    "tags": ["litany-of-supplication", "response", "vespers"],
    "phrases": [
      {"phrase_id": "amen-001"},
      {"text": "."}
    ]
  },
  "vespers-peace-priest-peace": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": ["peace", "vespers"],
    "phrases": [
      {"phrase_id": "peace-be-to-all-001"},
      {"text": "."}
    ]
  },
  "vespers-peace-choir-and-spirit": {
    "speaker": "role-choir",
    "tags": ["peace", "response", "vespers"],
    "phrases": [
      {"phrase_id": "and-to-thy-spirit-001"},
      {"text": "."}
    ]
  },
  "vespers-peace-bow-heads": {
    "speaker": "role-deacon",
    "break_before": true,
    "tags": ["peace", "vespers"],
    "phrases": [
      {"phrase_id": "lords-prayer-bow-heads-001"},
      {"text": "."}
    ]
  },
  "vespers-peace-to-thee": {
    "speaker": "role-choir",
    "tags": ["peace", "response", "vespers"],
    "phrases": [
      {"phrase_id": "to-thee-o-lord"},
      {"text": "."}
    ]
  },
  "vespers-peace-priest-bowing-address": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": ["bowing-prayer", "peace", "vespers"],
    "phrases": [
      {"phrase_id": "vespers-peace-lord-our-god-001"},
      {"text": "، "},
      {"phrase_id": "vespers-peace-bowed-heavens-001"},
      {"text": " "},
      {"phrase_id": "vespers-peace-came-salvation-001"},
      {"text": "، "},
      {"phrase_id": "vespers-peace-look-servants-001"},
      {"text": "."}
    ]
  },
  "vespers-peace-priest-bowing-servants": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": ["bowing-prayer", "peace", "vespers"],
    "phrases": [
      {"phrase_id": "vespers-peace-bowed-heads-001"},
      {"text": " "},
      {"phrase_id": "vespers-peace-inclined-necks-001"},
      {"text": "، "},
      {"phrase_id": "vespers-peace-fearful-judge-001"},
      {"text": "، "},
      {"phrase_id": "vespers-peace-not-help-men-001"},
      {"text": "، "},
      {"phrase_id": "vespers-peace-awaiting-mercy-001"},
      {"text": " "},
      {"phrase_id": "vespers-peace-expecting-salvation-001"},
      {"text": "."}
    ]
  },
  "vespers-peace-priest-bowing-guard": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": ["bowing-prayer", "peace", "vespers"],
    "phrases": [
      {"phrase_id": "vespers-peace-guard-all-times-001"},
      {"text": "، "},
      {"phrase_id": "vespers-peace-present-evening-night-001"},
      {"text": "، "},
      {"phrase_id": "vespers-peace-guarded-adversary-001"},
      {"text": "، "},
      {"phrase_id": "vespers-peace-vain-thoughts-001"},
      {"text": "."}
    ]
  },
  "vespers-peace-priest-doxology": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": ["doxology", "peace", "vespers"],
    "phrases": [
      {"phrase_id": "vespers-peace-might-kingdom-001"},
      {"text": "، "},
      {"phrase_id": "vespers-peace-father-son-spirit-001"},
      {"text": "، "},
      {"phrase_id": "vespers-peace-now-ever-ages-001"},
      {"text": "."}
    ]
  },
  "vespers-peace-amen": {
    "speaker": "role-choir",
    "tags": ["peace", "response", "vespers"],
    "phrases": [
      {"phrase_id": "amen-001"},
      {"text": "."}
    ]
  },
  "vespers-hymn-st-simeon": {
    "speaker": "",
    "break_before": true,
    "tags": ["hymn", "simeon", "vespers"],
    "phrases": [
      {"phrase_id": "vespers-simeon-now-depart-001"},
      {"text": " "},
      {"phrase_id": "vespers-simeon-o-master-001"},
      {"text": " "},
      {"phrase_id": "vespers-simeon-according-word-001"},
      {"text": "، "},
      {"phrase_id": "vespers-simeon-eyes-saw-salvation-001"},
      {"text": " "},
      {"phrase_id": "vespers-simeon-prepared-peoples-001"},
      {"text": "، "},
      {"phrase_id": "vespers-simeon-light-gentiles-001"},
      {"text": "، "},
      {"phrase_id": "vespers-simeon-glory-israel-001"},
      {"text": "."}
    ]
  },
  "vespers-trisagion-holy-god": {
    "speaker": "role-all",
    "break_before": true,
    "tags": ["trisagion", "vespers"],
    "phrases": [
      {"phrase_id": "holy-god-001"},
      {"text": "، "},
      {"phrase_id": "holy-mighty-001"},
      {"text": "، "},
      {"phrase_id": "holy-immortal-001"},
      {"text": "، "},
      {"phrase_id": "have-mercy-on-us-001"},
      {"text": ". "},
      {"phrase_id": "vespers-trisagion-thrice-rubric"}
    ]
  },
  "vespers-trisagion-glory-both-now": {
    "speaker": "role-all",
    "break_before": true,
    "tags": ["doxology", "trisagion", "vespers"],
    "phrases": [
      {"phrase_id": "departed-glory-trinity-001"},
      {"text": "، "},
      {"phrase_id": "departed-both-now-001"},
      {"text": ". "},
      {"phrase_id": "amen-001"},
      {"text": "."}
    ]
  },
  "vespers-trisagion-all-holy-trinity-address": {
    "speaker": "role-all",
    "break_before": true,
    "tags": ["all-holy-trinity", "trisagion", "vespers"],
    "phrases": [
      {"phrase_id": "all-holy-trinity-001"},
      {"text": "، "},
      {"phrase_id": "all-holy-trinity-have-mercy-001"},
      {"text": "."}
    ]
  },
  "vespers-trisagion-all-holy-trinity-lord": {
    "speaker": "role-all",
    "break_before": true,
    "tags": ["all-holy-trinity", "paragraph-join", "trisagion", "vespers"],
    "phrases": [
      {"phrase_id": "vocative-o-lord-001"},
      {"text": " "},
      {"phrase_id": "all-holy-trinity-cleanse-sins-001"},
      {"text": "."}
    ]
  },
  "vespers-trisagion-all-holy-trinity-master": {
    "speaker": "role-all",
    "break_before": true,
    "tags": ["all-holy-trinity", "paragraph-join", "trisagion", "vespers"],
    "phrases": [
      {"phrase_id": "vocative-o-master-001"},
      {"text": " "},
      {"phrase_id": "all-holy-trinity-pardon-iniquities-001"},
      {"text": "."}
    ]
  },
  "vespers-trisagion-all-holy-trinity-holy-one": {
    "speaker": "role-all",
    "break_before": true,
    "tags": ["all-holy-trinity", "paragraph-join", "trisagion", "vespers"],
    "phrases": [
      {"phrase_id": "vocative-o-holy-one-001"},
      {"text": " "},
      {"phrase_id": "all-holy-trinity-visit-heal-001"},
      {"text": "، "},
      {"phrase_id": "all-holy-trinity-name-sake-001"},
      {"text": "."}
    ]
  },
  "vespers-trisagion-lord-have-mercy-thrice": {
    "speaker": "role-all",
    "break_before": true,
    "tags": ["response", "trisagion", "vespers"],
    "phrases": [
      {"phrase_id": "lord-have-mercy-001"},
      {"text": ". "},
      {"phrase_id": "vespers-trisagion-thrice-rubric"}
    ]
  },
  "vespers-dismissal-wisdom": {
    "speaker": "role-deacon",
    "break_before": true,
    "tags": ["dismissal", "vespers"],
    "phrases": [
      {"phrase_id": "wisdom-001"},
      {"text": "."}
    ]
  },
  "vespers-dismissal-father-bless": {
    "speaker": "role-choir",
    "tags": ["dismissal", "response", "vespers"],
    "phrases": [
      {"phrase_id": "amvon-father-bless-001"},
      {"text": "."}
    ]
  },
  "vespers-dismissal-christ-blessed": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": ["dismissal", "vespers"],
    "phrases": [
      {"phrase_id": "vespers-dismissal-christ-existing-blessed-001"},
      {"text": "، "},
      {"phrase_id": "doxology-now-ever-ages-001"},
      {"text": "."}
    ]
  },
  "vespers-dismissal-preserve-faith": {
    "speaker": "role-choir",
    "tags": ["dismissal", "response", "vespers"],
    "phrases": [
      {"phrase_id": "amen-001"},
      {"text": ". "},
      {"phrase_id": "vespers-dismissal-preserve-faith-001"},
      {"text": "، "},
      {"phrase_id": "vespers-dismissal-all-orthodox-001"},
      {"text": "، "},
      {"phrase_id": "amen-001"},
      {"text": "."}
    ]
  },
  "vespers-dismissal-theotokos-save": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": ["dismissal", "theotokos", "vespers"],
    "phrases": [
      {"phrase_id": "vespers-dismissal-most-holy-theotokos-001"},
      {"text": " "},
      {"phrase_id": "vespers-dismissal-save-us-001"},
      {"text": "."}
    ]
  },
  "vespers-dismissal-more-honorable": {
    "speaker": "role-choir",
    "break_before": true,
    "tags": ["dismissal", "hymn", "theotokos", "vespers"],
    "phrases": [
      {"phrase_id": "theotokos-hymn-more-honorable-001"},
      {"text": "، "},
      {"phrase_id": "theotokos-hymn-more-glorious-001"},
      {"text": "، "},
      {"phrase_id": "theotokos-hymn-without-corruption-001"},
      {"text": "، "},
      {"phrase_id": "theotokos-hymn-truly-magnify-001"},
      {"text": " "},
      {"phrase_id": "theotokos-hymn-we-magnify-001"},
      {"text": "."}
    ]
  },
  "vespers-dismissal-glory-christ": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": ["dismissal", "doxology", "vespers"],
    "phrases": [
      {"phrase_id": "vespers-dismissal-glory-christ-001"},
      {"text": "، "},
      {"phrase_id": "vespers-dismissal-our-hope-glory-001"},
      {"text": "."}
    ]
  },
  "vespers-dismissal-glory-lord-mercy": {
    "speaker": "role-choir",
    "break_before": true,
    "tags": ["dismissal", "response", "vespers"],
    "phrases": [
      {"phrase_id": "departed-glory-trinity-001"},
      {"text": "، "},
      {"phrase_id": "departed-both-now-001"},
      {"text": ". "},
      {"phrase_id": "amen-001"},
      {"text": ". "},
      {"phrase_id": "lord-have-mercy-001"},
      {"text": ". "},
      {"phrase_id": "vespers-trisagion-thrice-rubric"},
      {"text": " "},
      {"phrase_id": "amvon-father-bless-001"},
      {"text": "."}
    ]
  },
  "vespers-dismissal-priest-main": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": ["dismissal", "vespers"],
    "phrases": [
      {"phrase_id": "dismissal-christ-true-god-001"},
      {"text": "، "},
      {"phrase_id": "vespers-dismissal-carried-simeon-001"},
      {"text": "، "},
      {"phrase_id": "vespers-dismissal-risen-dead-001"},
      {"text": "، "},
      {"phrase_id": "dismissal-mother-intercessions-001"},
      {"text": " "},
      {"phrase_id": "dismissal-mother-pure-001"},
      {"text": "، "},
      {"phrase_id": "dismissal-cross-001"},
      {"text": "، "},
      {"phrase_id": "dismissal-heavenly-powers-001"},
      {"text": " "},
      {"phrase_id": "dismissal-bodiless-001"},
      {"text": "، "},
      {"phrase_id": "dismissal-forerunner-prophet-001"},
      {"text": " "},
      {"phrase_id": "dismissal-john-baptist-001"},
      {"text": "، "},
      {"phrase_id": "dismissal-apostles-001"},
      {"text": " "},
      {"phrase_id": "dismissal-all-laudable-001"},
      {"text": "، "},
      {"phrase_id": "dismissal-martyrs-001"},
      {"text": " "},
      {"phrase_id": "dismissal-victorious-001"},
      {"text": "، "},
      {"phrase_id": "dismissal-godbearing-fathers-001"},
      {"text": "، "},
      {"phrase_id": "dismissal-rubric-and-saint-001"},
      {"text": " "},
      {"phrase_id": "dismissal-rubric-so-and-so-001"},
      {"text": " "},
      {"phrase_id": "vespers-dismissal-patron-community-001"},
      {"text": "، "},
      {"phrase_id": "dismissal-joachim-anna-001"},
      {"text": " "},
      {"phrase_id": "dismissal-grandparents-001"},
      {"text": "، "},
      {"phrase_id": "dismissal-all-saints-001"},
      {"text": "، "},
      {"phrase_id": "dismissal-have-mercy-save-001"},
      {"text": " "},
      {"phrase_id": "dismissal-good-lover-001"},
      {"text": "."}
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
        "phrase_id": "glorious-lady-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "theotokos-genitive-001"
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
        "phrase_id": "theotokos-genitive-001"
      },
      {
        "text": " "
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
        "phrase_id": "theotokos-genitive-001"
      },
      {
        "text": " "
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
        "phrase_id": "theotokos-genitive-001"
      },
      {
        "text": " "
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
  "little-litany-rubric-holy-doors": {
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
        "text": " "
      },
      {
        "phrase_id": "preserve-us-001"
      },
      {
        "text": " "
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
        "phrase_id": "glorious-lady-001"
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
        "text": "."
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
        "text": "، "
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
        "text": "، "
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
        "phrase_id": "trisagion-thrice-001"
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
        "phrase_id": "trisagion-to-father-son-holy-spirit-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "trisagion-now-ever-ages-001"
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
        "phrase_id": "epistle-wisdom-001"
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
        "phrase_id": "epistle-thrice-001"
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
        "phrase_id": "gospel-petition-001"
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
        "text": " "
      },
      {
        "phrase_id": "gospel-unfading-light-001"
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
        "phrase_id": "gospel-trample-passions-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "spiritual-living-001"
      },
      {
        "text": "، "
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
        "phrase_id": "gospel-unto-thee-glory-raised-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "unoriginate-father-spirit-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "unoriginate-father-spirit-002"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "unoriginate-father-spirit-003"
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
        "text": "، "
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
        "text": "، "
      },
      {
        "phrase_id": "may-god-enable-gospel-004"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "may-god-enable-gospel-003"
      },
      {
        "text": ". "
      },
      {
        "phrase_id": "may-god-enable-gospel-002"
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
        "phrase_id": "gospel-wisdom-001"
      },
      {
        "text": ". "
      },
      {
        "phrase_id": "gospel-stand-upright-001"
      },
      {
        "text": "، "
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
        "text": "، "
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
        "text": " "
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
        "text": " "
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
  },
  "catechumens-prayer": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": [
      "catechumens",
      "faithful",
      "priest-prayer"
    ],
    "phrases": [
      {
        "phrase_id": "catechumens-lord-god-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "catechumens-dwellest-high-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "catechumens-regardest-below-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "catechumens-sent-only-son-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "catechumens-our-lord-god-jesus-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "catechumens-salvation-human-race-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "catechumens-look-servants-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "catechumens-bowed-necks-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "catechumens-make-worthy-season-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "catechumens-laver-regeneration-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "catechumens-remission-sins-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "catechumens-robe-incorruption-001"
      },
      {
        "text": ". "
      },
      {
        "phrase_id": "catechumens-make-united-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "catechumens-holy-catholic-apostolic-church-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "catechumens-number-flock-001"
      },
      {
        "text": ". "
      },
      {
        "phrase_id": "catechumens-glorify-with-us-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "catechumens-honorable-majestic-name-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "catechumens-father-son-spirit-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "catechumens-now-ever-ages-001"
      },
      {
        "text": ". "
      },
      {
        "phrase_id": "catechumens-amen-001"
      },
      {
        "text": "."
      }
    ]
  },
  "basil-catechumens-prayer": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": [
      "basil",
      "catechumens",
      "faithful",
      "priest-prayer"
    ],
    "phrases": [
      {
        "phrase_id": "catechumens-lord-god-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "basil-catechumens-dwellest-heavens-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "basil-catechumens-looking-upon-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "basil-catechumens-all-works-001"
      },
      {
        "text": ": "
      },
      {
        "phrase_id": "basil-catechumens-look-servants-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "basil-catechumens-bowed-before-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "basil-catechumens-necks-001"
      },
      {
        "text": ". "
      },
      {
        "phrase_id": "basil-catechumens-grant-them-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "basil-catechumens-light-yoke-001"
      },
      {
        "text": ". "
      },
      {
        "phrase_id": "basil-catechumens-honorable-members-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "basil-catechumens-holy-church-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "basil-catechumens-make-worthy-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "basil-catechumens-laver-regeneration-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "catechumens-remission-sins-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "catechumens-robe-incorruption-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "basil-catechumens-may-know-thee-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "basil-catechumens-true-god-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "catechumens-glorify-with-us-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "catechumens-honorable-majestic-name-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "catechumens-father-son-spirit-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "catechumens-now-ever-ages-001"
      },
      {
        "text": ". "
      },
      {
        "phrase_id": "catechumens-amen-001"
      },
      {
        "text": "."
      }
    ]
  },
  "first-faithful-prayer": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": [
      "faithful",
      "priest-prayer"
    ],
    "phrases": [
      {
        "phrase_id": "first-faithful-we-thank-you-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "first-faithful-lord-hosts-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "first-faithful-made-worthy-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "first-faithful-stand-now-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "first-faithful-before-altar-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "first-faithful-fall-compassions-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "first-faithful-sins-ignorance-001"
      },
      {
        "text": ". "
      },
      {
        "phrase_id": "first-faithful-receive-supplication-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "first-faithful-make-worthy-offer-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "first-faithful-prayers-supplications-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "first-faithful-bloodless-sacrifices-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "first-faithful-all-people-001"
      },
      {
        "text": ". "
      },
      {
        "phrase_id": "first-faithful-enable-spirit-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "first-faithful-placed-ministry-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "first-faithful-worthy-call-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "first-faithful-all-times-places-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "first-faithful-without-condemnation-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "first-faithful-pure-witness-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "first-faithful-hear-us-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "first-faithful-show-mercy-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "first-faithful-fullness-goodness-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "first-faithful-unto-thee-due-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "first-faithful-glory-honor-worship-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "first-faithful-father-son-spirit-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "first-faithful-now-ever-ages-001"
      },
      {
        "text": ". "
      },
      {
        "phrase_id": "first-faithful-amen-001"
      },
      {
        "text": "."
      }
    ]
  },
  "basil-first-faithful-prayer": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": [
      "basil",
      "faithful",
      "priest-prayer"
    ],
    "phrases": [
      {
        "phrase_id": "basil-first-faithful-o-lord-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "basil-first-faithful-shown-us-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "basil-first-faithful-mystery-salvation-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "basil-first-faithful-made-us-worthy-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "basil-first-faithful-humble-servants-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "basil-first-faithful-unworthy-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "basil-first-faithful-be-ministrants-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "basil-first-faithful-holy-altar-001"
      },
      {
        "text": ". "
      },
      {
        "phrase_id": "basil-first-faithful-enable-us-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "basil-first-faithful-power-spirit-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "basil-first-faithful-stand-service-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "basil-first-faithful-uncondemned-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "basil-first-faithful-before-glory-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "basil-first-faithful-offer-thee-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "basil-first-faithful-sacrifice-praise-001"
      },
      {
        "text": ". "
      },
      {
        "phrase_id": "basil-first-faithful-thou-worketh-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "basil-first-faithful-all-in-all-001"
      },
      {
        "text": ". "
      },
      {
        "phrase_id": "basil-first-faithful-grant-lord-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "basil-first-faithful-sacrifice-this-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "basil-first-faithful-offered-sins-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "basil-first-faithful-ignorance-people-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "basil-first-faithful-acceptable-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "basil-first-faithful-before-thee-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "first-faithful-unto-thee-due-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "first-faithful-glory-honor-worship-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "first-faithful-father-son-spirit-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "first-faithful-now-ever-ages-001"
      },
      {
        "text": ". "
      },
      {
        "phrase_id": "first-faithful-amen-001"
      },
      {
        "text": "."
      }
    ]
  },
  "basil-second-faithful-prayer": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": [
      "basil",
      "faithful",
      "priest-prayer"
    ],
    "phrases": [
      {
        "phrase_id": "basil-second-faithful-o-god-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "basil-second-faithful-visited-lowliness-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "basil-second-faithful-mercy-compassions-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "basil-second-faithful-set-us-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "basil-second-faithful-humble-servants-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "basil-second-faithful-sinful-unworthy-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "basil-second-faithful-before-glory-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "basil-second-faithful-minister-altar-001"
      },
      {
        "text": ". "
      },
      {
        "phrase_id": "basil-second-faithful-strengthen-us-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "basil-second-faithful-power-spirit-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "basil-second-faithful-this-ministry-001"
      },
      {
        "text": ". "
      },
      {
        "phrase_id": "basil-second-faithful-grant-utterance-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "basil-second-faithful-opening-mouth-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "basil-second-faithful-invoke-grace-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "basil-second-faithful-upon-gifts-001"
      },
      {
        "text": "،"
      }
    ]
  },
  "basil-second-faithful-priest-doxology": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": [
      "basil",
      "doxology",
      "faithful",
      "priest-prayer"
    ],
    "phrases": [
      {
        "phrase_id": "basil-second-faithful-guarded-might-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "second-faithful-every-time-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "second-faithful-lift-glory-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "second-faithful-father-son-spirit-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "second-faithful-now-ever-ages-001"
      },
      {
        "text": "."
      }
    ]
  },
  "second-faithful-prayer": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": [
      "faithful",
      "priest-prayer"
    ],
    "phrases": [
      {
        "phrase_id": "second-faithful-bow-again-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "second-faithful-often-beseech-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "second-faithful-good-lover-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "second-faithful-look-petitions-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "second-faithful-cleanse-souls-bodies-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "second-faithful-every-defilement-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "second-faithful-grant-stand-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "second-faithful-before-altar-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "second-faithful-blameless-001"
      },
      {
        "text": ". "
      },
      {
        "phrase_id": "second-faithful-grant-those-praying-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "second-faithful-growth-001"
      },
      {
        "text": ". "
      },
      {
        "phrase_id": "second-faithful-grant-worship-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "second-faithful-fear-love-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "second-faithful-partake-mysteries-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "second-faithful-without-blame-001"
      },
      {
        "text": ". "
      },
      {
        "phrase_id": "second-faithful-make-worthy-kingdom-001"
      },
      {
        "text": "."
      }
    ]
  },
  "second-faithful-deacon-petition": {
    "speaker": "role-deacon",
    "break_before": true,
    "tags": [
      "faithful"
    ],
    "phrases": [
      {
        "phrase_id": "second-faithful-deacon-help-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "second-faithful-by-grace-wisdom-001"
      },
      {
        "text": ". "
      },
      {
        "phrase_id": "second-faithful-wisdom-001"
      },
      {
        "text": "."
      }
    ]
  },
  "second-faithful-priest-doxology": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": [
      "doxology",
      "faithful",
      "priest-prayer"
    ],
    "phrases": [
      {
        "phrase_id": "second-faithful-preserved-might-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "second-faithful-every-time-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "second-faithful-lift-glory-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "second-faithful-father-son-spirit-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "second-faithful-now-ever-ages-001"
      },
      {
        "text": "."
      }
    ]
  },
  "second-faithful-choir-amen": {
    "speaker": "role-choir",
    "tags": [
      "faithful",
      "response"
    ],
    "phrases": [
      {
        "phrase_id": "second-faithful-amen-001"
      },
      {
        "text": "."
      }
    ]
  },
  "cherubic-hymn-choir": {
    "speaker": "role-choir",
    "break_before": true,
    "tags": [
      "cherubic-hymn",
      "faithful",
      "hymn"
    ],
    "phrases": [
      {
        "phrase_id": "cherubic-represent-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "cherubic-sing-thrice-holy-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "cherubic-life-giving-trinity-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "cherubic-lay-aside-now-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "cherubic-earthly-care-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "cherubic-about-to-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "cherubic-receive-king-001"
      },
      {
        "text": "."
      }
    ]
  },
  "cherubic-hymn-priest-prayer": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": [
      "cherubic-hymn",
      "faithful",
      "quiet",
      "priest-prayer"
    ],
    "phrases": [
      {
        "phrase_id": "cherubic-none-bound-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "cherubic-bound-passions-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "cherubic-worthy-approach-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "cherubic-draw-near-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "cherubic-serve-king-001"
      },
      {
        "text": ". "
      },
      {
        "phrase_id": "cherubic-service-fearful-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "cherubic-heavenly-powers-001"
      },
      {
        "text": ". "
      },
      {
        "phrase_id": "cherubic-love-mankind-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "cherubic-love-boundless-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "cherubic-became-man-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "cherubic-without-change-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "cherubic-high-priest-001"
      },
      {
        "text": ". "
      },
      {
        "phrase_id": "cherubic-master-all-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "cherubic-deliver-ministry-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "cherubic-bloodless-sacrifice-001"
      },
      {
        "text": ". "
      },
      {
        "phrase_id": "cherubic-alone-lord-god-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "cherubic-o-lord-god-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "cherubic-rule-heaven-earth-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "cherubic-throne-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "cherubic-seraphim-king-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "cherubic-king-kings-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "cherubic-alone-holy-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "cherubic-resting-saints-001"
      },
      {
        "text": ". "
      },
      {
        "phrase_id": "cherubic-implore-good-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "cherubic-o-good-one-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "cherubic-good-hearer-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "cherubic-look-servant-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "cherubic-sinful-servant-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "cherubic-cleanse-soul-heart-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "cherubic-evil-intention-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "cherubic-make-worthy-spirit-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "cherubic-clothed-priesthood-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "cherubic-stand-table-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "cherubic-this-holy-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "cherubic-serve-body-blood-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "cherubic-precious-blood-001"
      },
      {
        "text": ". "
      },
      {
        "phrase_id": "cherubic-draw-near-bowed-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "cherubic-bowing-neck-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "cherubic-beseech-face-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "cherubic-turn-not-face-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "cherubic-not-cast-out-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "cherubic-vouchsafe-gifts-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "cherubic-these-gifts-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "cherubic-by-me-sinner-001"
      },
      {
        "text": ". "
      },
      {
        "phrase_id": "cherubic-offer-offered-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "cherubic-accept-distributed-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "cherubic-christ-god-001"
      },
      {
        "text": ". "
      },
      {
        "phrase_id": "cherubic-lift-glory-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "cherubic-unoriginate-father-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "cherubic-all-holy-spirit-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "cherubic-good-life-giving-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "cherubic-now-ever-amen-001"
      },
      {
        "text": ". "
      },
      {
        "phrase_id": "cherubic-amen-001"
      },
      {
        "text": "."
      }
    ]
  },
  "cherubic-hymn-priest-repetition": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": [
      "cherubic-hymn",
      "faithful",
      "hymn"
    ],
    "phrases": [
      {
        "phrase_id": "cherubic-represent-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "cherubic-sing-thrice-holy-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "cherubic-life-giving-trinity-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "cherubic-lay-aside-now-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "cherubic-earthly-care-001"
      },
      {
        "text": "."
      }
    ]
  },
  "cherubic-hymn-deacon-completion": {
    "speaker": "role-deacon",
    "break_before": true,
    "tags": [
      "cherubic-hymn",
      "faithful",
      "hymn"
    ],
    "phrases": [
      {
        "phrase_id": "cherubic-about-to-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "cherubic-receive-king-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "cherubic-angelic-hosts-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "cherubic-invisibly-001"
      },
      {
        "text": ". "
      },
      {
        "phrase_id": "alleluia-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "alleluia-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "alleluia-001"
      },
      {
        "text": "."
      }
    ]
  },
  "cherubic-hymn-priest-resurrection": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": [
      "cherubic-hymn",
      "faithful",
      "quiet",
      "priest-prayer"
    ],
    "phrases": [
      {
        "phrase_id": "cherubic-beheld-resurrection-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "cherubic-worship-holy-lord-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "cherubic-jesus-sinless-001"
      },
      {
        "text": ". "
      },
      {
        "phrase_id": "cherubic-adore-cross-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "cherubic-praise-resurrection-001"
      },
      {
        "text": ". "
      },
      {
        "phrase_id": "cherubic-thou-art-god-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "cherubic-know-none-other-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "cherubic-call-name-001"
      },
      {
        "text": ". "
      },
      {
        "phrase_id": "cherubic-come-faithful-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "cherubic-adore-resurrection-001"
      },
      {
        "text": ". "
      },
      {
        "phrase_id": "cherubic-through-cross-joy-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "cherubic-to-all-world-001"
      },
      {
        "text": ". "
      },
      {
        "phrase_id": "cherubic-ever-blessing-lord-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "cherubic-sing-resurrection-001"
      },
      {
        "text": ". "
      },
      {
        "phrase_id": "cherubic-endured-cross-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "cherubic-destroyed-death-001"
      },
      {
        "text": "."
      }
    ]
  },
  "cherubic-hymn-rubric-feast-replacement": {
    "break_before": true,
    "tags": [
      "cherubic-hymn",
      "faithful",
      "quiet",
      "rubric"
    ],
    "phrases": [
      {
        "phrase_id": "cherubic-rubric-feast-replacement-001"
      }
    ]
  },
  "cherubic-hymn-psalm-50-title": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": [
      "cherubic-hymn",
      "faithful",
      "quiet",
      "psalm",
      "rubric"
    ],
    "phrases": [
      { "phrase_id": "cherubic-psalm50-title-001" }
    ]
  },
  "psalm-50-verse-001": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": [
      "cherubic-hymn",
      "faithful",
      "quiet",
      "psalm",
      "psalm-50"
    ],
    "phrases": [
      { "phrase_id": "cherubic-psalm50-have-mercy-001" },
      { "text": " " },
      { "phrase_id": "cherubic-psalm50-blot-out-001" },
      { "text": "." }
    ]
  },
  "psalm-50-verse-002": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": ["cherubic-hymn", "faithful", "quiet", "psalm", "psalm-50"],
    "phrases": [
      { "phrase_id": "cherubic-psalm50-wash-cleanse-001" },
      { "text": " " },
      { "phrase_id": "cherubic-psalm50-cleanse-sin-001" },
      { "text": "." }
    ]
  },
  "psalm-50-verse-003": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": ["cherubic-hymn", "faithful", "quiet", "psalm", "psalm-50"],
    "phrases": [
      { "phrase_id": "cherubic-psalm50-know-iniquity-001" },
      { "text": " " },
      { "phrase_id": "cherubic-psalm50-sin-before-me-001" },
      { "text": "." }
    ]
  },
  "psalm-50-verse-004": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": ["cherubic-hymn", "faithful", "quiet", "psalm", "psalm-50"],
    "phrases": [
      { "phrase_id": "cherubic-psalm50-against-thee-001" },
      { "text": " " },
      { "phrase_id": "cherubic-psalm50-evil-before-001" },
      { "text": " " },
      { "phrase_id": "cherubic-psalm50-justified-words-001" },
      { "text": " " },
      { "phrase_id": "cherubic-psalm50-prevail-judged-001" },
      { "text": "." }
    ]
  },
  "psalm-50-verse-005": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": ["cherubic-hymn", "faithful", "quiet", "psalm", "psalm-50"],
    "phrases": [
      { "phrase_id": "cherubic-psalm50-conceived-001" },
      { "text": "، " },
      { "phrase_id": "cherubic-psalm50-mother-bore-001" },
      { "text": "." }
    ]
  },
  "psalm-50-verse-006": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": ["cherubic-hymn", "faithful", "quiet", "psalm", "psalm-50"],
    "phrases": [
      { "phrase_id": "cherubic-psalm50-loved-truth-001" },
      { "text": " " },
      { "phrase_id": "cherubic-psalm50-wisdom-secrets-001" },
      { "text": "." }
    ]
  },
  "psalm-50-verse-007": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": ["cherubic-hymn", "faithful", "quiet", "psalm", "psalm-50"],
    "phrases": [
      { "phrase_id": "cherubic-psalm50-hyssop-clean-001" },
      { "text": "، " },
      { "phrase_id": "cherubic-psalm50-wash-white-001" },
      { "text": "." }
    ]
  },
  "psalm-50-verse-008": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": ["cherubic-hymn", "faithful", "quiet", "psalm", "psalm-50"],
    "phrases": [
      { "phrase_id": "cherubic-psalm50-hear-joy-001" },
      { "text": " " },
      { "phrase_id": "cherubic-psalm50-bones-rejoice-001" },
      { "text": "." }
    ]
  },
  "psalm-50-verse-009": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": ["cherubic-hymn", "faithful", "quiet", "psalm", "psalm-50"],
    "phrases": [
      { "phrase_id": "cherubic-psalm50-turn-face-001" },
      { "text": "، " },
      { "phrase_id": "cherubic-psalm50-blot-iniquities-001" },
      { "text": "." }
    ]
  },
  "psalm-50-verse-010": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": ["cherubic-hymn", "faithful", "quiet", "psalm", "psalm-50"],
    "phrases": [
      { "phrase_id": "cherubic-psalm50-clean-heart-001" },
      { "text": "، " },
      { "phrase_id": "cherubic-psalm50-renew-spirit-001" },
      { "text": "." }
    ]
  },
  "psalm-50-verse-011": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": ["cherubic-hymn", "faithful", "quiet", "psalm", "psalm-50"],
    "phrases": [
      { "phrase_id": "cherubic-psalm50-cast-not-001" },
      { "text": "، " },
      { "phrase_id": "cherubic-psalm50-take-not-spirit-001" },
      { "text": "." }
    ]
  },
  "psalm-50-verse-012": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": ["cherubic-hymn", "faithful", "quiet", "psalm", "psalm-50"],
    "phrases": [
      { "phrase_id": "cherubic-psalm50-restore-joy-001" },
      { "text": "، " },
      { "phrase_id": "cherubic-psalm50-governing-spirit-001" },
      { "text": "." }
    ]
  },
  "psalm-50-verse-013": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": ["cherubic-hymn", "faithful", "quiet", "psalm", "psalm-50"],
    "phrases": [
      { "phrase_id": "cherubic-psalm50-teach-transgressors-001" },
      { "text": " " },
      { "phrase_id": "cherubic-psalm50-ungodly-return-001" },
      { "text": "." }
    ]
  },
  "psalm-50-verse-014": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": ["cherubic-hymn", "faithful", "quiet", "psalm", "psalm-50"],
    "phrases": [
      { "phrase_id": "cherubic-psalm50-deliver-blood-001" },
      { "text": " " },
      { "phrase_id": "cherubic-psalm50-god-salvation-001" },
      { "text": " " },
      { "phrase_id": "cherubic-psalm50-tongue-rejoice-001" },
      { "text": "." }
    ]
  },
  "psalm-50-verse-015": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": ["cherubic-hymn", "faithful", "quiet", "psalm", "psalm-50"],
    "phrases": [
      { "phrase_id": "cherubic-psalm50-open-lips-001" },
      { "text": " " },
      { "phrase_id": "cherubic-psalm50-mouth-praise-001" },
      { "text": "." }
    ]
  },
  "psalm-50-verse-016": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": ["cherubic-hymn", "faithful", "quiet", "psalm", "psalm-50"],
    "phrases": [
      { "phrase_id": "cherubic-psalm50-sacrifice-not-desired-001" },
      { "text": "، " },
      { "phrase_id": "cherubic-psalm50-i-would-give-001" },
      { "text": "، " },
      { "phrase_id": "cherubic-psalm50-not-pleased-burnt-001" },
      { "text": "." }
    ]
  },
  "psalm-50-verse-017": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": ["cherubic-hymn", "faithful", "quiet", "psalm", "psalm-50"],
    "phrases": [
      { "phrase_id": "cherubic-psalm50-sacrifice-broken-spirit-001" },
      { "text": "، " },
      { "phrase_id": "cherubic-psalm50-heart-not-despise-001" },
      { "text": "." }
    ]
  },
  "psalm-50-verse-018": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": ["psalter", "psalm", "psalm-50"],
    "phrases": [
      { "phrase_id": "psalter-psalm50-zion-good-001" },
      { "text": " " },
      { "phrase_id": "psalter-psalm50-jerusalem-walls-001" },
      { "text": "." }
    ]
  },
  "psalm-50-verse-019": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": ["psalter", "psalm", "psalm-50"],
    "phrases": [
      { "phrase_id": "psalter-psalm50-sacrifice-righteousness-001" },
      { "text": " " },
      { "phrase_id": "psalter-psalm50-oblation-burnt-001" },
      { "text": "." }
    ]
  },
  "psalm-50-verse-020": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": ["psalter", "psalm", "psalm-50"],
    "phrases": [
      { "phrase_id": "psalter-psalm50-offer-bullocks-001" },
      { "text": "." }
    ]
  },
  "psalter-psalm-103": {
    "speaker": "",
    "break_before": true,
    "split_phrases_by_line_breaks": true,
    "tags": [
      "psalter",
      "psalm",
      "psalm-103"
    ],
    "phrases": [
      { "phrase_id": "psalm103-bless-lord-001" },
      { "text": "، " },
      { "phrase_id": "psalm103-magnified-exceedingly-001" },
      { "text": ". ", "line_break_after": true },
      { "phrase_id": "psalm103-confession-majesty-001" },
      { "text": "، " },
      { "phrase_id": "psalm103-cover-light-001" },
      { "text": ". ", "line_break_after": true },
      { "phrase_id": "psalm103-stretch-heaven-001" },
      { "text": "، " },
      { "phrase_id": "psalm103-chambers-waters-001" },
      { "text": ". ", "line_break_after": true },
      { "phrase_id": "psalm103-clouds-ascent-001" },
      { "text": "، " },
      { "phrase_id": "psalm103-wings-winds-001" },
      { "text": ". ", "line_break_after": true },
      { "phrase_id": "psalm103-angels-spirits-001" },
      { "text": "، " },
      { "phrase_id": "psalm103-ministers-fire-001" },
      { "text": ". ", "line_break_after": true },
      { "phrase_id": "psalm103-earth-foundations-001" },
      { "text": "، " },
      { "phrase_id": "psalm103-not-moved-001" },
      { "text": ". ", "line_break_after": true },
      { "phrase_id": "psalm103-abyss-garment-001" },
      { "text": "، " },
      { "phrase_id": "psalm103-waters-mountains-001" },
      { "text": ". ", "line_break_after": true },
      { "phrase_id": "psalm103-rebuke-flee-001" },
      { "text": "، " },
      { "phrase_id": "psalm103-thunder-afraid-001" },
      { "text": ". ", "line_break_after": true },
      { "phrase_id": "psalm103-rise-mountains-001" },
      { "text": "، " },
      { "phrase_id": "psalm103-sink-plains-001" },
      { "text": ". ", "line_break_after": true },
      { "phrase_id": "psalm103-bound-set-001" },
      { "text": "، " },
      { "phrase_id": "psalm103-not-cover-earth-001" },
      { "text": ". ", "line_break_after": true },
      { "phrase_id": "psalm103-springs-valleys-001" },
      { "text": ". " },
      { "phrase_id": "psalm103-waters-pass-001" },
      { "text": ". ", "line_break_after": true },
      { "phrase_id": "psalm103-beasts-drink-001" },
      { "text": "، " },
      { "phrase_id": "psalm103-wild-asses-001" },
      { "text": ". ", "line_break_after": true },
      { "phrase_id": "psalm103-birds-dwell-001" },
      { "text": "، " },
      { "phrase_id": "psalm103-birds-sing-001" },
      { "text": ". ", "line_break_after": true },
      { "phrase_id": "psalm103-water-mountains-001" },
      { "text": "، " },
      { "phrase_id": "psalm103-earth-satisfied-001" },
      { "text": ". ", "line_break_after": true },
      { "phrase_id": "psalm103-grass-cattle-001" },
      { "text": "، " },
      { "phrase_id": "psalm103-green-for-men-001" },
      { "text": ". ", "line_break_after": true },
      { "phrase_id": "psalm103-bread-earth-001" },
      { "text": "، " },
      { "phrase_id": "psalm103-wine-heart-001" },
      { "text": ". ", "line_break_after": true },
      { "phrase_id": "psalm103-oil-face-001" },
      { "text": "، " },
      { "phrase_id": "psalm103-bread-strengthens-001" },
      { "text": ". ", "line_break_after": true },
      { "phrase_id": "psalm103-trees-watered-001" },
      { "text": "، " },
      { "phrase_id": "psalm103-cedars-lebanon-001" },
      { "text": ". ", "line_break_after": true },
      { "phrase_id": "psalm103-sparrows-nest-001" },
      { "text": "، " },
      { "phrase_id": "psalm103-heron-house-001" },
      { "text": ". ", "line_break_after": true },
      { "phrase_id": "psalm103-high-mountains-001" },
      { "text": "، " },
      { "phrase_id": "psalm103-rocks-hares-001" },
      { "text": ". ", "line_break_after": true },
      { "phrase_id": "psalm103-moon-seasons-001" },
      { "text": "، " },
      { "phrase_id": "psalm103-sun-setting-001" },
      { "text": ". ", "line_break_after": true },
      { "phrase_id": "psalm103-darkness-night-001" },
      { "text": "، " },
      { "phrase_id": "psalm103-beasts-go-001" },
      { "text": ". ", "line_break_after": true },
      { "phrase_id": "psalm103-lions-roar-001" },
      { "text": "، " },
      { "phrase_id": "psalm103-seek-food-001" },
      { "text": ". ", "line_break_after": true },
      { "phrase_id": "psalm103-sun-arose-001" },
      { "text": "، " },
      { "phrase_id": "psalm103-dens-lie-001" },
      { "text": ". ", "line_break_after": true },
      { "phrase_id": "psalm103-man-work-001" },
      { "text": " " },
      { "phrase_id": "psalm103-labor-evening-001" },
      { "text": ". ", "line_break_after": true },
      { "phrase_id": "psalm103-how-great-works-001" },
      { "text": "، " },
      { "phrase_id": "psalm103-wisdom-made-001" },
      { "text": "، " },
      { "phrase_id": "psalm103-earth-filled-001" },
      { "text": ". ", "line_break_after": true },
      { "phrase_id": "psalm103-great-sea-001" },
      { "text": "، " },
      { "phrase_id": "psalm103-creeping-innumerable-001" },
      { "text": "، " },
      { "phrase_id": "psalm103-small-great-001" },
      { "text": ". ", "line_break_after": true },
      { "phrase_id": "psalm103-ships-go-001" },
      { "text": "، " },
      { "phrase_id": "psalm103-leviathan-plays-001" },
      { "text": ". ", "line_break_after": true },
      { "phrase_id": "psalm103-all-wait-001" },
      { "text": "، " },
      { "phrase_id": "psalm103-food-season-001" },
      { "text": "، " },
      { "phrase_id": "psalm103-give-gather-001" },
      { "text": ". ", "line_break_after": true },
      { "phrase_id": "psalm103-open-hand-001" },
      { "text": "، " },
      { "phrase_id": "psalm103-turn-face-troubled-001" },
      { "text": ". ", "line_break_after": true },
      { "phrase_id": "psalm103-take-spirit-001" },
      { "text": "، " },
      { "phrase_id": "psalm103-return-dust-001" },
      { "text": ". ", "line_break_after": true },
      { "phrase_id": "psalm103-send-spirit-001" },
      { "text": "، " },
      { "phrase_id": "psalm103-renew-earth-001" },
      { "text": ". ", "line_break_after": true },
      { "phrase_id": "psalm103-glory-ages-001" },
      { "text": "، " },
      { "phrase_id": "psalm103-lord-rejoice-001" },
      { "text": ". ", "line_break_after": true },
      { "phrase_id": "psalm103-earth-trembles-001" },
      { "text": "، " },
      { "phrase_id": "psalm103-mountains-smoke-001" },
      { "text": ". ", "line_break_after": true },
      { "phrase_id": "psalm103-sing-life-001" },
      { "text": "، " },
      { "phrase_id": "psalm103-chant-being-001" },
      { "text": ". ", "line_break_after": true },
      { "phrase_id": "psalm103-meditation-sweet-001" },
      { "text": "، " },
      { "phrase_id": "psalm103-rejoice-lord-001" },
      { "text": ". ", "line_break_after": true },
      { "phrase_id": "psalm103-sinners-cease-001" },
      { "text": "، " },
      { "phrase_id": "psalm103-lawless-no-more-001" },
      { "text": ". " },
      { "phrase_id": "psalm103-bless-lord-end-001" },
      { "text": ". ", "line_break_after": true },
      { "phrase_id": "psalm103-sun-setting-repeat-001" },
      { "text": "، " },
      { "phrase_id": "psalm103-darkness-repeat-001" },
      { "text": ". ", "line_break_after": true },
      { "phrase_id": "psalm103-how-great-repeat-001" },
      { "text": "، " },
      { "phrase_id": "psalm103-wisdom-repeat-001" },
      { "text": ". ", "line_break_after": true }
    ]
  },
  "cherubic-hymn-priest-forgive-sinner": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": [
      "cherubic-hymn",
      "faithful",
      "quiet"
    ],
    "phrases": [
      {
        "phrase_id": "cherubic-god-forgive-me-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "cherubic-i-sinner-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "cherubic-have-mercy-me-001"
      },
      {
        "text": ". "
      },
      {
        "phrase_id": "cherubic-thrice-001"
      }
    ]
  },
  "cherubic-hymn-priest-forgive-brother": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": [
      "cherubic-hymn",
      "faithful",
      "quiet"
    ],
    "phrases": [
      {
        "phrase_id": "cherubic-forgive-brother-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "cherubic-concelebrant-001"
      },
      {
        "text": "."
      }
    ]
  },
  "cherubic-hymn-priest-forgive-all": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": [
      "cherubic-hymn",
      "faithful",
      "quiet"
    ],
    "phrases": [
      {
        "phrase_id": "cherubic-forgive-hate-love-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "cherubic-those-love-us-001"
      },
      {
        "text": "."
      }
    ]
  },
  "cherubic-hymn-deacon-lift": {
    "speaker": "role-deacon",
    "break_before": true,
    "tags": [
      "cherubic-hymn",
      "faithful",
      "quiet"
    ],
    "phrases": [
      {
        "phrase_id": "cherubic-lift-up-master-001"
      },
      {
        "text": "."
      }
    ]
  },
  "cherubic-hymn-priest-lift-hands": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": [
      "cherubic-hymn",
      "faithful",
      "quiet"
    ],
    "phrases": [
      {
        "phrase_id": "cherubic-lift-hands-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "cherubic-bless-lord-001"
      },
      {
        "text": "."
      }
    ]
  },
  "great-entrance-deacon-all": {
    "speaker": "role-deacon",
    "break_before": true,
    "tags": [
      "great-entrance"
    ],
    "phrases": [
      {
        "phrase_id": "great-entrance-all-of-you-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "great-entrance-lord-remember-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "great-entrance-in-kingdom-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "great-entrance-every-time-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "great-entrance-now-ever-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "great-entrance-ages-001"
      },
      {
        "text": "."
      }
    ]
  },
  "great-entrance-choir-amen-1": {
    "speaker": "role-choir",
    "break_before": true,
    "tags": [
      "great-entrance",
      "response"
    ],
    "phrases": [
      {
        "phrase_id": "great-entrance-amen-001"
      },
      {
        "text": "."
      }
    ]
  },
  "great-entrance-priest-hierarch": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": [
      "great-entrance"
    ],
    "phrases": [
      {
        "phrase_id": "great-entrance-father-metropolitan-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "great-entrance-so-and-so-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "great-entrance-let-lord-remember-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "great-entrance-in-kingdom-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "great-entrance-every-time-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "great-entrance-now-ever-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "great-entrance-ages-001"
      },
      {
        "text": "."
      }
    ]
  },
  "great-entrance-choir-amen-2": {
    "speaker": "role-choir",
    "break_before": true,
    "tags": [
      "great-entrance",
      "response"
    ],
    "phrases": [
      {
        "phrase_id": "great-entrance-amen-001"
      },
      {
        "text": "."
      }
    ]
  },
  "great-entrance-priest-rulers": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": [
      "great-entrance"
    ],
    "phrases": [
      {
        "phrase_id": "great-entrance-rulers-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "great-entrance-support-good-work-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "great-entrance-let-lord-remember-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "great-entrance-in-kingdom-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "great-entrance-every-time-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "great-entrance-now-ever-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "great-entrance-ages-001"
      },
      {
        "text": "."
      }
    ]
  },
  "great-entrance-choir-amen-3": {
    "speaker": "role-choir",
    "break_before": true,
    "tags": [
      "great-entrance",
      "response"
    ],
    "phrases": [
      {
        "phrase_id": "great-entrance-amen-001"
      },
      {
        "text": "."
      }
    ]
  },
  "great-entrance-priest-living": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": [
      "great-entrance"
    ],
    "phrases": [
      {
        "phrase_id": "great-entrance-servants-of-god-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "great-entrance-offerings-offered-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "great-entrance-health-welfare-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "great-entrance-welfare-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "great-entrance-remission-sins-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "great-entrance-names-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "great-entrance-let-lord-remember-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "great-entrance-in-kingdom-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "great-entrance-every-time-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "great-entrance-now-ever-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "great-entrance-ages-001"
      },
      {
        "text": "."
      }
    ]
  },
  "great-entrance-choir-amen-4": {
    "speaker": "role-choir",
    "break_before": true,
    "tags": [
      "great-entrance",
      "response"
    ],
    "phrases": [
      {
        "phrase_id": "great-entrance-amen-001"
      },
      {
        "text": "."
      }
    ]
  },
  "great-entrance-priest-departed": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": [
      "great-entrance"
    ],
    "phrases": [
      {
        "phrase_id": "great-entrance-servants-of-god-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "great-entrance-departed-servants-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "great-entrance-hope-resurrection-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "great-entrance-eternal-life-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "great-entrance-names-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "great-entrance-let-lord-remember-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "great-entrance-in-kingdom-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "great-entrance-every-time-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "great-entrance-now-ever-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "great-entrance-ages-001"
      },
      {
        "text": "."
      }
    ]
  },
  "great-entrance-choir-cherubic-completion": {
    "speaker": "role-choir",
    "break_before": true,
    "tags": [
      "great-entrance",
      "hymn"
    ],
    "phrases": [
      {
        "phrase_id": "great-entrance-amen-001"
      },
      {
        "text": ". "
      },
      {
        "phrase_id": "great-entrance-angelic-hosts-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "great-entrance-invisibly-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "alleluia-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "alleluia-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "alleluia-001"
      },
      {
        "text": "."
      }
    ]
  },
  "great-entrance-deacon-priesthood": {
    "speaker": "role-deacon",
    "break_before": true,
    "tags": [
      "clergy-dialogue",
      "great-entrance",
      "quiet"
    ],
    "phrases": [
      {
        "phrase_id": "great-entrance-thy-priesthood-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "great-entrance-lord-remember-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "great-entrance-in-kingdom-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "great-entrance-every-time-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "great-entrance-now-ever-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "great-entrance-ages-001"
      },
      {
        "text": "."
      }
    ]
  },
  "great-entrance-priest-diaconate": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": [
      "clergy-dialogue",
      "great-entrance",
      "quiet"
    ],
    "phrases": [
      {
        "phrase_id": "great-entrance-thy-diaconate-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "great-entrance-lord-remember-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "great-entrance-in-kingdom-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "great-entrance-every-time-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "great-entrance-now-ever-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "great-entrance-ages-001"
      },
      {
        "text": "."
      }
    ]
  },
  "great-entrance-deacon-do-good": {
    "speaker": "role-deacon",
    "break_before": true,
    "tags": [
      "clergy-dialogue",
      "great-entrance",
      "quiet"
    ],
    "phrases": [
      {
        "phrase_id": "great-entrance-do-good-master-001"
      },
      {
        "text": "."
      }
    ]
  },
  "great-entrance-priest-psalm-zion": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": [
      "great-entrance",
      "psalm",
      "quiet"
    ],
    "phrases": [
      {
        "phrase_id": "great-entrance-do-good-lord-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "great-entrance-goodwill-zion-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "great-entrance-build-walls-001"
      },
      {
        "text": ". "
      },
      {
        "phrase_id": "great-entrance-pleased-sacrifice-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "great-entrance-oblations-burnt-001"
      },
      {
        "text": ". "
      },
      {
        "phrase_id": "great-entrance-offer-bullocks-001"
      },
      {
        "text": "."
      }
    ]
  },
  "great-entrance-rubric-censer-east": {
    "break_before": true,
    "tags": [
      "great-entrance",
      "rubric",
      "quiet"
    ],
    "phrases": [
      {
        "phrase_id": "great-entrance-rubric-censer-east-001"
      }
    ]
  },
  "great-entrance-priest-remember-me": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": [
      "clergy-dialogue",
      "great-entrance",
      "quiet"
    ],
    "phrases": [
      {
        "phrase_id": "great-entrance-remember-me-brother-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "great-entrance-partner-service-001"
      },
      {
        "text": "."
      }
    ]
  },
  "great-entrance-deacon-priesthood-again": {
    "speaker": "role-deacon",
    "break_before": true,
    "tags": [
      "clergy-dialogue",
      "great-entrance",
      "quiet"
    ],
    "phrases": [
      {
        "phrase_id": "great-entrance-thy-priesthood-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "great-entrance-lord-remember-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "great-entrance-in-kingdom-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "great-entrance-every-time-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "great-entrance-now-ever-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "great-entrance-ages-001"
      },
      {
        "text": "."
      }
    ]
  },
  "great-entrance-rubric-deacon-bows": {
    "break_before": true,
    "tags": [
      "great-entrance",
      "rubric",
      "quiet"
    ],
    "phrases": [
      {
        "phrase_id": "great-entrance-rubric-deacon-bows-001"
      }
    ]
  },
  "great-entrance-deacon-pray-for-me": {
    "speaker": "role-deacon",
    "break_before": true,
    "tags": [
      "clergy-dialogue",
      "great-entrance",
      "quiet"
    ],
    "phrases": [
      {
        "phrase_id": "great-entrance-pray-for-me-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "great-entrance-holy-master-001"
      },
      {
        "text": "."
      }
    ]
  },
  "great-entrance-priest-spirit": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": [
      "clergy-dialogue",
      "great-entrance",
      "quiet"
    ],
    "phrases": [
      {
        "phrase_id": "great-entrance-holy-spirit-descend-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "great-entrance-most-high-overshadow-001"
      },
      {
        "text": "."
      }
    ]
  },
  "great-entrance-deacon-spirit": {
    "speaker": "role-deacon",
    "break_before": true,
    "tags": [
      "clergy-dialogue",
      "great-entrance",
      "quiet"
    ],
    "phrases": [
      {
        "phrase_id": "great-entrance-same-spirit-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "great-entrance-assist-service-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "great-entrance-all-days-life-001"
      },
      {
        "text": "؛ "
      },
      {
        "phrase_id": "great-entrance-pray-for-me-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "great-entrance-holy-master-001"
      },
      {
        "text": "."
      }
    ]
  },
  "great-entrance-priest-diaconate-final": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": [
      "clergy-dialogue",
      "great-entrance",
      "quiet"
    ],
    "phrases": [
      {
        "phrase_id": "great-entrance-thy-diaconate-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "great-entrance-lord-remember-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "great-entrance-in-kingdom-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "great-entrance-every-time-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "great-entrance-now-ever-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "great-entrance-ages-001"
      },
      {
        "text": "."
      }
    ]
  },
  "great-entrance-deacon-amen-final": {
    "speaker": "role-deacon",
    "break_before": true,
    "tags": [
      "clergy-dialogue",
      "great-entrance",
      "quiet",
      "response"
    ],
    "phrases": [
      {
        "phrase_id": "great-entrance-amen-001"
      },
      {
        "text": "."
      }
    ]
  },
  "supplication-complete-prayer": {
    "speaker": "role-deacon",
    "break_before": true,
    "tags": [
      "litany-of-supplication"
    ],
    "phrases": [
      {
        "phrase_id": "supplication-complete-prayer-001"
      },
      {
        "text": "."
      }
    ]
  },
  "supplication-lord-have-mercy-repeat": {
    "speaker": "role-choir",
    "break_before": true,
    "tags": [
      "litany-of-supplication",
      "response"
    ],
    "phrases": [
      {
        "phrase_id": "lord-have-mercy-001"
      },
      {
        "text": ". "
      },
      {
        "phrase_id": "supplication-rubric-repeat-mercy-001"
      }
    ]
  },
  "supplication-precious-gifts": {
    "speaker": "role-deacon",
    "break_before": true,
    "tags": [
      "litany-of-supplication"
    ],
    "phrases": [
      {
        "phrase_id": "supplication-precious-gifts-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "supplication-precious-gifts-set-forth-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "supplication-let-us-pray-lord-001"
      },
      {
        "text": "."
      }
    ]
  },
  "supplication-holy-house": {
    "speaker": "role-deacon",
    "break_before": true,
    "tags": [
      "litany-of-supplication"
    ],
    "phrases": [
      {
        "phrase_id": "supplication-holy-house-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "supplication-enter-house-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "supplication-faith-reverence-fear-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "supplication-let-us-pray-lord-001"
      },
      {
        "text": "."
      }
    ]
  },
  "supplication-deliverance": {
    "speaker": "role-deacon",
    "break_before": true,
    "tags": [
      "litany-of-supplication"
    ],
    "phrases": [
      {
        "phrase_id": "supplication-deliverance-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "supplication-tribulation-danger-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "supplication-let-us-pray-lord-001"
      },
      {
        "text": "."
      }
    ]
  },
  "supplication-help-save": {
    "speaker": "role-deacon",
    "break_before": true,
    "tags": [
      "litany-of-supplication"
    ],
    "phrases": [
      {
        "phrase_id": "supplication-help-save-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "supplication-preserve-grace-001"
      },
      {
        "text": "."
      }
    ]
  },
  "supplication-whole-day": {
    "speaker": "role-deacon",
    "break_before": true,
    "tags": [
      "litany-of-supplication"
    ],
    "phrases": [
      {
        "phrase_id": "supplication-whole-day-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "supplication-perfect-day-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "supplication-ask-lord-001"
      },
      {
        "text": "."
      }
    ]
  },
  "supplication-grant-this-repeat": {
    "speaker": "role-choir",
    "break_before": true,
    "tags": [
      "litany-of-supplication",
      "response"
    ],
    "phrases": [
      {
        "phrase_id": "supplication-grant-this-001"
      },
      {
        "text": ". "
      },
      {
        "phrase_id": "supplication-rubric-repeat-grant-001"
      }
    ]
  },
  "supplication-angel-peace": {
    "speaker": "role-deacon",
    "break_before": true,
    "tags": [
      "litany-of-supplication"
    ],
    "phrases": [
      {
        "phrase_id": "supplication-angel-peace-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "supplication-faithful-guide-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "supplication-guardian-souls-bodies-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "supplication-ask-lord-001"
      },
      {
        "text": "."
      }
    ]
  },
  "supplication-pardon-remission": {
    "speaker": "role-deacon",
    "break_before": true,
    "tags": [
      "litany-of-supplication"
    ],
    "phrases": [
      {
        "phrase_id": "supplication-pardon-sins-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "supplication-remission-transgressions-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "supplication-ask-lord-001"
      },
      {
        "text": "."
      }
    ]
  },
  "supplication-good-profitable": {
    "speaker": "role-deacon",
    "break_before": true,
    "tags": [
      "litany-of-supplication"
    ],
    "phrases": [
      {
        "phrase_id": "supplication-good-profitable-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "supplication-peace-world-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "supplication-ask-lord-001"
      },
      {
        "text": "."
      }
    ]
  },
  "supplication-remaining-life": {
    "speaker": "role-deacon",
    "break_before": true,
    "tags": [
      "litany-of-supplication"
    ],
    "phrases": [
      {
        "phrase_id": "supplication-remaining-life-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "supplication-peace-repentance-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "supplication-ask-lord-001"
      },
      {
        "text": "."
      }
    ]
  },
  "supplication-christian-ending": {
    "speaker": "role-deacon",
    "break_before": true,
    "tags": [
      "litany-of-supplication"
    ],
    "phrases": [
      {
        "phrase_id": "supplication-christian-ending-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "supplication-christian-peaceful-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "supplication-painless-blameless-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "supplication-good-defense-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "supplication-judgment-seat-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "supplication-ask-lord-001"
      },
      {
        "text": "."
      }
    ]
  },
  "supplication-calling-remembrance": {
    "speaker": "role-deacon",
    "break_before": true,
    "tags": [
      "litany-of-supplication"
    ],
    "phrases": [
      {
        "phrase_id": "supplication-calling-remembrance-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "supplication-theotokos-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "supplication-ever-virgin-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "supplication-with-saints-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "supplication-commend-ourselves-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "supplication-all-life-christ-001"
      },
      {
        "text": "."
      }
    ]
  },
  "supplication-to-thee-o-lord": {
    "speaker": "role-choir",
    "break_before": true,
    "tags": [
      "litany-of-supplication",
      "response"
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
  "supplication-priest-prayer": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": [
      "litany-of-supplication",
      "quiet"
    ],
    "phrases": [
      {
        "phrase_id": "supplication-priest-almighty-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "supplication-priest-sacrifice-praise-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "supplication-priest-call-whole-hearts-001"
      },
      {
        "text": ". "
      },
      {
        "phrase_id": "supplication-priest-receive-sinners-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "supplication-priest-holy-altar-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "supplication-priest-offer-gifts-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "supplication-priest-spiritual-sacrifices-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "supplication-priest-sins-ignorance-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "supplication-priest-find-grace-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "supplication-priest-sacrifice-acceptable-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "supplication-priest-good-spirit-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "supplication-priest-offered-gifts-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "supplication-priest-all-people-001"
      },
      {
        "text": "."
      }
    ]
  },
  "basil-supplication-priest-prayer": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": [
      "basil",
      "litany-of-supplication",
      "quiet"
    ],
    "phrases": [
      {
        "phrase_id": "basil-supplication-created-us-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "basil-supplication-brought-life-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "basil-supplication-brought-this-life-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "basil-supplication-ways-salvation-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "basil-supplication-heavenly-mysteries-001"
      },
      {
        "text": ". "
      },
      {
        "phrase_id": "basil-supplication-appointed-ministry-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "basil-supplication-power-spirit-001"
      },
      {
        "text": ". "
      },
      {
        "phrase_id": "basil-supplication-grant-servitors-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "basil-supplication-servitors-covenant-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "basil-supplication-ministers-mysteries-001"
      },
      {
        "text": ". "
      },
      {
        "phrase_id": "basil-supplication-receive-near-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "basil-supplication-draw-altar-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "basil-supplication-worthy-offer-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "basil-supplication-rational-bloodless-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "basil-supplication-own-sins-001"
      },
      {
        "text": ". "
      },
      {
        "phrase_id": "basil-supplication-receive-altar-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "basil-supplication-heavenly-spiritual-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "basil-supplication-send-grace-001"
      },
      {
        "text": ". "
      },
      {
        "phrase_id": "basil-supplication-look-worship-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "basil-supplication-receive-abel-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "basil-supplication-noah-abraham-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "basil-supplication-moses-aaron-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "basil-supplication-samuel-001"
      },
      {
        "text": ". "
      },
      {
        "phrase_id": "basil-supplication-apostles-worship-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "basil-supplication-true-worship-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "basil-supplication-receive-sinners-gifts-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "basil-supplication-from-sinners-hands-001"
      },
      {
        "text": ": "
      },
      {
        "phrase_id": "basil-supplication-accounted-worthy-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "basil-supplication-recompense-stewards-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "basil-supplication-just-requiting-001"
      },
      {
        "text": "،"
      }
    ]
  },
  "supplication-priest-doxology": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": [
      "doxology",
      "litany-of-supplication"
    ],
    "phrases": [
      {
        "phrase_id": "supplication-compassions-son-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "supplication-blessed-with-him-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "supplication-all-holy-spirit-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "supplication-now-ever-ages-001"
      },
      {
        "text": "."
      }
    ]
  },
  "supplication-choir-amen": {
    "speaker": "role-choir",
    "break_before": true,
    "tags": [
      "litany-of-supplication",
      "response"
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
  "supplication-priest-peace": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": [
      "litany-of-supplication"
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
  "supplication-choir-and-spirit": {
    "speaker": "role-choir",
    "break_before": true,
    "tags": [
      "litany-of-supplication",
      "response"
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
  "supplication-deacon-love": {
    "speaker": "role-deacon",
    "break_before": true,
    "tags": [
      "litany-of-supplication"
    ],
    "phrases": [
      {
        "phrase_id": "supplication-love-one-another-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "supplication-confess-one-accord-001"
      },
      {
        "text": "."
      }
    ]
  },
  "supplication-choir-trinity": {
    "speaker": "role-choir",
    "break_before": true,
    "tags": [
      "litany-of-supplication",
      "hymn",
      "response"
    ],
    "phrases": [
      {
        "phrase_id": "supplication-trinity-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "supplication-one-essence-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "supplication-undivided-001"
      },
      {
        "text": "."
      }
    ]
  },
  "supplication-priest-before-creed": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": [
      "litany-of-supplication",
      "psalm"
    ],
    "phrases": [
      {
        "phrase_id": "supplication-priest-love-lord-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "supplication-priest-strength-001"
      },
      {
        "text": ". "
      },
      {
        "phrase_id": "supplication-priest-foundation-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "supplication-priest-refuge-deliverer-001"
      },
      {
        "text": "."
      }
    ]
  },
  "supplication-deacon-before-creed": {
    "speaker": "role-deacon",
    "break_before": true,
    "tags": [
      "litany-of-supplication"
    ],
    "phrases": [
      {
        "phrase_id": "supplication-deacon-doors-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "supplication-deacon-wisdom-attend-001"
      },
      {
        "text": "."
      }
    ]
  },
  "creed-father-maker": {
    "speaker": "role-all",
    "break_before": true,
    "tags": [
      "creed"
    ],
    "phrases": [
      {
        "phrase_id": "creed-believe-one-god-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "creed-father-almighty-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "creed-maker-heaven-earth-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "creed-visible-invisible-001"
      },
      {
        "text": "."
      }
    ]
  },
  "creed-son-begotten": {
    "speaker": "role-all",
    "break_before": true,
    "tags": [
      "creed"
    ],
    "phrases": [
      {
        "phrase_id": "creed-one-lord-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "creed-son-only-begotten-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "creed-begotten-father-001"
      },
      {
        "text": ": "
      },
      {
        "phrase_id": "creed-light-of-light-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "creed-true-god-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "creed-begotten-not-made-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "creed-one-essence-father-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "creed-all-things-made-001"
      },
      {
        "text": "."
      }
    ]
  },
  "creed-incarnation-passion": {
    "speaker": "role-all",
    "break_before": true,
    "tags": [
      "creed"
    ],
    "phrases": [
      {
        "phrase_id": "creed-for-us-humans-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "creed-for-salvation-came-down-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "creed-incarnate-holy-spirit-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "creed-virgin-mary-became-man-001"
      },
      {
        "text": ". "
      },
      {
        "phrase_id": "creed-crucified-pilate-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "creed-suffered-buried-001"
      },
      {
        "text": "."
      }
    ]
  },
  "creed-resurrection-ascension": {
    "speaker": "role-all",
    "break_before": true,
    "tags": [
      "creed"
    ],
    "phrases": [
      {
        "phrase_id": "creed-rose-third-day-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "creed-according-scriptures-001"
      },
      {
        "text": ". "
      },
      {
        "phrase_id": "creed-ascended-heaven-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "creed-sits-right-hand-001"
      },
      {
        "text": "."
      }
    ]
  },
  "creed-coming-kingdom": {
    "speaker": "role-all",
    "break_before": true,
    "tags": [
      "creed"
    ],
    "phrases": [
      {
        "phrase_id": "creed-coming-glory-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "creed-judge-living-dead-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "creed-kingdom-no-end-001"
      },
      {
        "text": "."
      }
    ]
  },
  "creed-holy-spirit": {
    "speaker": "role-all",
    "break_before": true,
    "tags": [
      "creed"
    ],
    "phrases": [
      {
        "phrase_id": "creed-holy-spirit-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "creed-lord-life-giver-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "creed-proceeds-father-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "creed-worshipped-glorified-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "creed-worshipped-glorified-002"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "creed-spoke-prophets-001"
      },
      {
        "text": "."
      }
    ]
  },
  "creed-church-baptism": {
    "speaker": "role-all",
    "break_before": true,
    "tags": [
      "creed"
    ],
    "phrases": [
      {
        "phrase_id": "creed-one-church-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "creed-catholic-apostolic-church-001"
      },
      {
        "text": "."
      }
    ]
  },
  "creed-baptism": {
    "speaker": "role-all",
    "break_before": true,
    "tags": [
      "creed"
    ],
    "phrases": [
      {
        "phrase_id": "creed-one-baptism-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "creed-remission-sins-001"
      },
      {
        "text": "."
      }
    ]
  },
  "creed-resurrection-life": {
    "speaker": "role-all",
    "break_before": true,
    "tags": [
      "creed"
    ],
    "phrases": [
      {
        "phrase_id": "creed-look-resurrection-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "creed-life-age-amen-001"
      },
      {
        "text": "."
      }
    ]
  },
  "holy-anaphora-offering-subtitle": {
    "break_before": true,
    "tags": [
      "anaphora"
    ],
    "phrases": [
      {
        "phrase_id": "holy-anaphora-offering-subtitle-001"
      }
    ]
  },
  "holy-anaphora-stand-aright": {
    "speaker": "role-deacon",
    "break_before": true,
    "tags": [
      "anaphora"
    ],
    "phrases": [
      {
        "phrase_id": "holy-anaphora-stand-aright-001"
      },
      {
        "text": ". "
      },
      {
        "phrase_id": "holy-anaphora-stand-fear-001"
      },
      {
        "text": ". "
      },
      {
        "phrase_id": "holy-anaphora-attend-001"
      },
      {
        "text": ". "
      },
      {
        "phrase_id": "holy-anaphora-offer-peace-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "holy-anaphora-holy-oblation-001"
      },
      {
        "text": "."
      }
    ]
  },
  "holy-anaphora-mercy-peace": {
    "speaker": "role-choir",
    "break_before": true,
    "tags": [
      "anaphora",
      "response"
    ],
    "phrases": [
      {
        "phrase_id": "holy-anaphora-mercy-peace-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "holy-anaphora-sacrifice-praise-001"
      },
      {
        "text": "."
      }
    ]
  },
  "holy-anaphora-grace": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": [
      "anaphora"
    ],
    "phrases": [
      {
        "phrase_id": "holy-anaphora-grace-christ-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "holy-anaphora-love-father-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "holy-anaphora-communion-spirit-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "holy-anaphora-be-with-all-001"
      },
      {
        "text": "."
      }
    ]
  },
  "holy-anaphora-and-with-spirit": {
    "speaker": "role-choir",
    "break_before": true,
    "tags": [
      "anaphora",
      "response"
    ],
    "phrases": [
      {
        "phrase_id": "holy-anaphora-and-with-spirit-001"
      },
      {
        "text": "."
      }
    ]
  },
  "holy-anaphora-lift-hearts": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": [
      "anaphora"
    ],
    "phrases": [
      {
        "phrase_id": "holy-anaphora-lift-hearts-001"
      },
      {
        "text": "."
      }
    ]
  },
  "holy-anaphora-with-lord": {
    "speaker": "role-choir",
    "break_before": true,
    "tags": [
      "anaphora",
      "response"
    ],
    "phrases": [
      {
        "phrase_id": "holy-anaphora-with-lord-001"
      },
      {
        "text": "."
      }
    ]
  },
  "holy-anaphora-thank-lord": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": [
      "anaphora"
    ],
    "phrases": [
      {
        "phrase_id": "holy-anaphora-thank-lord-001"
      },
      {
        "text": "."
      }
    ]
  },
  "holy-anaphora-meet-right": {
    "speaker": "role-choir",
    "break_before": true,
    "tags": [
      "anaphora",
      "response"
    ],
    "phrases": [
      {
        "phrase_id": "holy-anaphora-meet-right-001"
      },
      {
        "text": "."
      }
    ]
  },
  "holy-anaphora-prayer-thanks": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": [
      "anaphora",
      "quiet"
    ],
    "phrases": [
      {
        "phrase_id": "holy-anaphora-meet-right-praise-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "holy-anaphora-bless-thank-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "holy-anaphora-worship-dominion-001"
      },
      {
        "text": "."
      }
    ]
  },
  "holy-anaphora-prayer-god-beyond": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": [
      "anaphora",
      "quiet"
    ],
    "phrases": [
      {
        "phrase_id": "holy-anaphora-god-ineffable-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "holy-anaphora-inconceivable-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "holy-anaphora-invisible-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "holy-anaphora-incomprehensible-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "holy-anaphora-ever-existing-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "holy-anaphora-same-001"
      },
      {
        "text": "."
      }
    ]
  },
  "holy-anaphora-prayer-creation": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": [
      "anaphora",
      "quiet"
    ],
    "phrases": [
      {
        "phrase_id": "holy-anaphora-thou-son-spirit-001"
      },
      {
        "text": ". "
      },
      {
        "phrase_id": "holy-anaphora-brought-nothingness-001"
      },
      {
        "text": ". "
      },
      {
        "phrase_id": "holy-anaphora-raised-fallen-001"
      },
      {
        "text": "."
      }
    ]
  },
  "holy-anaphora-prayer-kingdom": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": [
      "anaphora",
      "quiet"
    ],
    "phrases": [
      {
        "phrase_id": "holy-anaphora-didst-not-cease-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "holy-anaphora-heaven-kingdom-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "holy-anaphora-bestowed-kingdom-001"
      },
      {
        "text": "."
      }
    ]
  },
  "holy-anaphora-prayer-benefits": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": [
      "anaphora",
      "quiet"
    ],
    "phrases": [
      {
        "phrase_id": "holy-anaphora-thank-for-all-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "holy-anaphora-son-spirit-acc-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "holy-anaphora-benefits-known-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "holy-anaphora-known-unknown-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "holy-anaphora-manifest-unseen-001"
      },
      {
        "text": "."
      }
    ]
  },
  "holy-anaphora-prayer-service": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": [
      "anaphora",
      "quiet"
    ],
    "phrases": [
      {
        "phrase_id": "holy-anaphora-thank-service-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "holy-anaphora-accept-hands-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "holy-anaphora-angels-stand-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "holy-anaphora-myriad-angels-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "holy-anaphora-cherubim-seraphim-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "holy-anaphora-six-winged-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "holy-anaphora-soaring-001"
      },
      {
        "text": "."
      }
    ]
  },
  "holy-anaphora-rubric-star": {
    "break_before": true,
    "tags": [
      "anaphora",
      "rubric",
      "quiet"
    ],
    "phrases": [
      {
        "phrase_id": "holy-anaphora-rubric-star-001"
      },
      {
        "text": "."
      }
    ]
  },
  "holy-anaphora-triumphal-hymn": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": [
      "anaphora"
    ],
    "phrases": [
      {
        "phrase_id": "holy-anaphora-triumphal-hymn-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "holy-anaphora-shouting-crying-001"
      },
      {
        "text": ":"
      }
    ]
  },
  "holy-anaphora-sanctus": {
    "speaker": "role-choir",
    "break_before": true,
    "tags": [
      "anaphora",
      "response"
    ],
    "phrases": [
      {
        "phrase_id": "holy-anaphora-holy-holy-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "holy-anaphora-lord-sabaoth-001"
      },
      {
        "text": ". "
      },
      {
        "phrase_id": "holy-anaphora-heaven-earth-full-001"
      },
      {
        "text": ". "
      },
      {
        "phrase_id": "holy-anaphora-hosanna-001"
      },
      {
        "text": ". "
      },
      {
        "phrase_id": "holy-anaphora-blessed-comes-001"
      },
      {
        "text": ". "
      },
      {
        "phrase_id": "holy-anaphora-hosanna-001"
      },
      {
        "text": "."
      }
    ]
  },
  "holy-anaphora-prayer-holy-god": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": [
      "anaphora",
      "quiet"
    ],
    "phrases": [
      {
        "phrase_id": "holy-anaphora-blessed-powers-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "holy-anaphora-cry-say-001"
      },
      {
        "text": ": "
      },
      {
        "phrase_id": "holy-anaphora-holy-thou-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "holy-anaphora-thou-son-spirit-001"
      },
      {
        "text": "."
      }
    ]
  },
  "holy-anaphora-prayer-loved-world": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": [
      "anaphora",
      "quiet"
    ],
    "phrases": [
      {
        "phrase_id": "holy-anaphora-holy-thou-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "holy-anaphora-great-glory-001"
      },
      {
        "text": ". "
      },
      {
        "phrase_id": "holy-anaphora-loved-world-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "holy-anaphora-gave-son-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "holy-anaphora-not-perish-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "holy-anaphora-eternal-life-001"
      },
      {
        "text": "."
      }
    ]
  },
  "holy-anaphora-prayer-institution-intro": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": [
      "anaphora",
      "quiet"
    ],
    "phrases": [
      {
        "phrase_id": "holy-anaphora-completed-dispensation-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "holy-anaphora-night-betrayed-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "holy-anaphora-gave-self-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "holy-anaphora-took-bread-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "holy-anaphora-pure-hands-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "holy-anaphora-thanked-blessed-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "holy-anaphora-gave-disciples-001"
      },
      {
        "text": ":"
      }
    ]
  },
  "holy-anaphora-take-eat": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": [
      "anaphora"
    ],
    "phrases": [
      {
        "phrase_id": "holy-anaphora-take-eat-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "holy-anaphora-this-body-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "holy-anaphora-broken-for-you-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "holy-anaphora-remission-sins-001"
      },
      {
        "text": "."
      }
    ]
  },
  "holy-anaphora-amen-body": {
    "speaker": "role-choir",
    "break_before": true,
    "tags": [
      "anaphora",
      "response"
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
  "holy-anaphora-cup-after-supper": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": [
      "anaphora"
    ],
    "phrases": [
      {
        "phrase_id": "holy-anaphora-cup-after-supper-001"
      },
      {
        "text": ":"
      }
    ]
  },
  "holy-anaphora-drink-all": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": [
      "anaphora"
    ],
    "phrases": [
      {
        "phrase_id": "holy-anaphora-drink-all-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "holy-anaphora-this-blood-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "holy-anaphora-shed-you-many-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "holy-anaphora-remission-sins-001"
      },
      {
        "text": "."
      }
    ]
  },
  "holy-anaphora-amen-blood": {
    "speaker": "role-choir",
    "break_before": true,
    "tags": [
      "anaphora",
      "response"
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
  "holy-anaphora-remembrance": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": [
      "anaphora",
      "quiet"
    ],
    "phrases": [
      {
        "phrase_id": "holy-anaphora-remember-commandment-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "holy-anaphora-all-for-us-001"
      },
      {
        "text": ": "
      },
      {
        "phrase_id": "holy-anaphora-cross-tomb-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "holy-anaphora-third-day-resurrection-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "holy-anaphora-ascension-heavens-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "holy-anaphora-sitting-right-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "holy-anaphora-second-coming-001"
      },
      {
        "text": "."
      }
    ]
  },
  "holy-anaphora-thine-own": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": [
      "anaphora"
    ],
    "phrases": [
      {
        "phrase_id": "holy-anaphora-thine-own-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "holy-anaphora-offer-all-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "holy-anaphora-on-behalf-all-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "holy-anaphora-for-all-001"
      },
      {
        "text": "."
      }
    ]
  },
  "holy-anaphora-we-praise": {
    "speaker": "role-choir",
    "break_before": true,
    "tags": [
      "anaphora",
      "response"
    ],
    "phrases": [
      {
        "phrase_id": "holy-anaphora-praise-bless-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "holy-anaphora-bless-thee-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "holy-anaphora-thank-ask-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "holy-anaphora-ask-of-thee-001"
      },
      {
        "text": "."
      }
    ]
  },
  "holy-anaphora-epiclesis-offer": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": [
      "anaphora",
      "quiet"
    ],
    "phrases": [
      {
        "phrase_id": "holy-anaphora-rational-worship-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "holy-anaphora-ask-beseech-001"
      },
      {
        "text": ". "
      },
      {
        "phrase_id": "holy-anaphora-send-spirit-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "holy-anaphora-upon-gifts-001"
      },
      {
        "text": ":"
      }
    ]
  },
  "holy-anaphora-bless-bread": {
    "speaker": "role-deacon",
    "break_before": true,
    "tags": [
      "anaphora"
    ],
    "phrases": [
      {
        "phrase_id": "holy-anaphora-bless-master-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "holy-anaphora-holy-bread-001"
      },
      {
        "text": "."
      }
    ]
  },
  "holy-anaphora-make-bread-body": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": [
      "anaphora"
    ],
    "phrases": [
      {
        "phrase_id": "holy-anaphora-make-bread-body-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "holy-anaphora-body-christ-001"
      },
      {
        "text": "."
      }
    ]
  },
  "holy-anaphora-amen-bread": {
    "speaker": "role-all",
    "break_before": true,
    "tags": [
      "anaphora",
      "response"
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
  "holy-anaphora-bless-cup": {
    "speaker": "role-deacon",
    "break_before": true,
    "tags": [
      "anaphora"
    ],
    "phrases": [
      {
        "phrase_id": "holy-anaphora-bless-master-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "holy-anaphora-holy-cup-001"
      },
      {
        "text": "."
      }
    ]
  },
  "holy-anaphora-cup-blood": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": [
      "anaphora"
    ],
    "phrases": [
      {
        "phrase_id": "holy-anaphora-cup-blood-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "holy-anaphora-blood-christ-001"
      },
      {
        "text": "."
      }
    ]
  },
  "holy-anaphora-amen-cup": {
    "speaker": "role-all",
    "break_before": true,
    "tags": [
      "anaphora",
      "response"
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
  "holy-anaphora-bless-both": {
    "speaker": "role-deacon",
    "break_before": true,
    "tags": [
      "anaphora"
    ],
    "phrases": [
      {
        "phrase_id": "holy-anaphora-bless-both-001"
      },
      {
        "text": "."
      }
    ]
  },
  "holy-anaphora-changing-spirit": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": [
      "anaphora"
    ],
    "phrases": [
      {
        "phrase_id": "holy-anaphora-changing-spirit-001"
      },
      {
        "text": "."
      }
    ]
  },
  "holy-anaphora-amen-three": {
    "speaker": "role-all",
    "break_before": true,
    "tags": [
      "anaphora",
      "response"
    ],
    "phrases": [
      {
        "phrase_id": "holy-anaphora-amen-three-001"
      },
      {
        "text": "."
      }
    ]
  },
  "holy-anaphora-fruits-communion": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": [
      "anaphora",
      "quiet"
    ],
    "phrases": [
      {
        "phrase_id": "holy-anaphora-vigilance-soul-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "holy-anaphora-forgiveness-communion-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "holy-anaphora-kingdom-boldness-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "holy-anaphora-not-judgment-001"
      },
      {
        "text": "."
      }
    ]
  },
  "holy-anaphora-departed": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": [
      "anaphora",
      "quiet"
    ],
    "phrases": [
      {
        "phrase_id": "holy-anaphora-offer-departed-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "holy-anaphora-departed-faith-001"
      },
      {
        "text": ": "
      },
      {
        "phrase_id": "holy-anaphora-ancestors-fathers-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "holy-anaphora-prophets-apostles-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "holy-anaphora-martyrs-confessors-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "holy-anaphora-righteous-faith-001"
      },
      {
        "text": "."
      }
    ]
  },
  "holy-anaphora-rubric-censes": {
    "break_before": true,
    "tags": [
      "anaphora",
      "rubric",
      "quiet"
    ],
    "phrases": [
      {
        "phrase_id": "holy-anaphora-rubric-censes-001"
      },
      {
        "text": ":"
      }
    ]
  },
  "holy-anaphora-especially-theotokos": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": [
      "anaphora"
    ],
    "phrases": [
      {
        "phrase_id": "holy-anaphora-especially-theotokos-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "holy-anaphora-pure-blessed-glorious-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "holy-anaphora-lady-theotokos-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "holy-anaphora-ever-virgin-mary-001"
      },
      {
        "text": "؛"
      }
    ]
  },
  "basil-anaphora-prayer-existing-one": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": ["basil", "anaphora", "quiet"],
    "phrases": [
      {"phrase_id": "basil-anaphora-existing-one-001"},
      {"text": "، "},
      {"phrase_id": "basil-anaphora-adorable-father-001"},
      {"text": ". "},
      {"phrase_id": "basil-anaphora-meet-majesty-001"},
      {"text": "، "},
      {"phrase_id": "basil-anaphora-praise-hymn-001"},
      {"text": "، "},
      {"phrase_id": "basil-anaphora-thank-glorify-001"},
      {"text": "، "},
      {"phrase_id": "basil-anaphora-only-existing-god-001"},
      {"text": "، "},
      {"phrase_id": "basil-anaphora-rational-worship-001"},
      {"text": ". "},
      {"phrase_id": "basil-anaphora-knowledge-truth-001"},
      {"text": ". "},
      {"phrase_id": "basil-anaphora-who-sufficient-001"},
      {"text": "، "},
      {"phrase_id": "basil-anaphora-wonders-season-001"},
      {"text": ". "},
      {"phrase_id": "basil-anaphora-master-creation-001"},
      {"text": "، "},
      {"phrase_id": "basil-anaphora-throne-depths-001"},
      {"text": "، "},
      {"phrase_id": "basil-anaphora-unoriginated-001"},
      {"text": ". "},
      {"phrase_id": "basil-anaphora-father-christ-001"},
      {"text": "، "},
      {"phrase_id": "basil-anaphora-image-word-001"},
      {"text": "، "},
      {"phrase_id": "basil-anaphora-wisdom-life-light-001"},
      {"text": "، "},
      {"phrase_id": "basil-anaphora-spirit-manifested-001"},
      {"text": "، "},
      {"phrase_id": "basil-anaphora-spirit-gifts-001"},
      {"text": "، "},
      {"phrase_id": "basil-anaphora-life-fountain-001"},
      {"text": ". "},
      {"phrase_id": "basil-anaphora-rational-creature-001"},
      {"text": "، "},
      {"phrase_id": "basil-anaphora-angelic-orders-001"},
      {"text": "، "},
      {"phrase_id": "basil-anaphora-cherubim-seraphim-001"},
      {"text": "، "},
      {"phrase_id": "basil-anaphora-covering-praises-001"},
      {"text": "."}
    ]
  },
  "basil-anaphora-prayer-with-blessed-powers": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": ["basil", "anaphora", "quiet"],
    "phrases": [
      {"phrase_id": "basil-anaphora-with-blessed-powers-001"},
      {"text": ": "},
      {"phrase_id": "basil-anaphora-righteous-judgment-001"},
      {"text": "، "},
      {"phrase_id": "basil-anaphora-regeneration-001"},
      {"text": ". "},
      {"phrase_id": "basil-anaphora-not-forget-001"},
      {"text": "، "},
      {"phrase_id": "basil-anaphora-prophets-law-angels-001"},
      {"text": ". "},
      {"phrase_id": "basil-anaphora-fullness-son-001"},
      {"text": "، "},
      {"phrase_id": "basil-anaphora-brightness-image-001"},
      {"text": ". "},
      {"phrase_id": "basil-anaphora-incarnate-virgin-001"},
      {"text": "، "},
      {"phrase_id": "basil-anaphora-empty-servant-001"},
      {"text": "، "},
      {"phrase_id": "basil-anaphora-born-law-001"},
      {"text": "، "},
      {"phrase_id": "basil-anaphora-alive-christ-001"},
      {"text": ". "},
      {"phrase_id": "basil-anaphora-commandments-knowledge-001"},
      {"text": "، "},
      {"phrase_id": "basil-anaphora-people-priesthood-001"},
      {"text": "، "},
      {"phrase_id": "basil-anaphora-ransom-death-001"},
      {"text": ". "},
      {"phrase_id": "basil-anaphora-hades-resurrection-001"},
      {"text": "، "},
      {"phrase_id": "basil-anaphora-firstfruits-001"},
      {"text": ". "},
      {"phrase_id": "basil-anaphora-ascended-return-001"},
      {"text": ". "},
      {"phrase_id": "basil-anaphora-saving-memorials-001"},
      {"text": ". "},
      {"phrase_id": "basil-anaphora-voluntary-death-001"},
      {"text": "، "},
      {"phrase_id": "basil-anaphora-shown-father-001"},
      {"text": "، "},
      {"phrase_id": "basil-anaphora-thanked-hallowed-001"},
      {"text": "، "}
    ]
  },
  "basil-anaphora-gave-disciples": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": ["basil", "anaphora"],
    "phrases": [
      {"phrase_id": "basil-anaphora-gave-disciples-001"},
      {"text": ":"}
    ]
  },
  "basil-anaphora-cup-after-supper": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": ["basil", "anaphora"],
    "phrases": [
      {"phrase_id": "basil-anaphora-cup-vine-001"},
      {"text": ". "},
      {"phrase_id": "basil-anaphora-gave-disciples-001"},
      {"text": ":"}
    ]
  },
  "basil-anaphora-drink-all": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": ["basil", "anaphora"],
    "phrases": [
      {"phrase_id": "holy-anaphora-drink-all-001"},
      {"text": ". "},
      {"phrase_id": "basil-anaphora-new-covenant-001"},
      {"text": "، "},
      {"phrase_id": "holy-anaphora-shed-you-many-001"},
      {"text": "، "},
      {"phrase_id": "holy-anaphora-remission-sins-001"},
      {"text": "."}
    ]
  },
  "basil-anaphora-remembrance": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": ["basil", "anaphora", "quiet"],
    "phrases": [
      {"phrase_id": "basil-anaphora-do-remembrance-001"},
      {"text": ". "},
      {"phrase_id": "basil-anaphora-proclaim-death-001"},
      {"text": ". "},
      {"phrase_id": "basil-anaphora-remembering-passion-001"},
      {"text": "، "},
      {"phrase_id": "basil-anaphora-remembering-glory-001"},
      {"text": ":"}
    ]
  },
  "basil-anaphora-epiclesis-offer": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": ["basil", "anaphora", "quiet"],
    "phrases": [
      {"phrase_id": "basil-anaphora-wherefore-master-001"},
      {"text": "، "},
      {"phrase_id": "basil-anaphora-worthy-minister-001"},
      {"text": "، "},
      {"phrase_id": "basil-anaphora-mercies-boldness-001"},
      {"text": ". "},
      {"phrase_id": "basil-anaphora-antitypes-001"},
      {"text": "، "},
      {"phrase_id": "basil-anaphora-spirit-descend-001"},
      {"text": "، "},
      {"phrase_id": "basil-anaphora-bless-hallow-show-001"},
      {"text": ":"}
    ]
  },
  "basil-anaphora-make-bread-body": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": ["basil", "anaphora"],
    "phrases": [
      {"phrase_id": "basil-anaphora-bread-body-001"},
      {"text": "."}
    ]
  },
  "basil-anaphora-cup-blood": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": ["basil", "anaphora"],
    "phrases": [
      {"phrase_id": "basil-anaphora-cup-blood-001"},
      {"text": "."}
    ]
  },
  "basil-anaphora-changing-spirit": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": ["basil", "anaphora"],
    "phrases": [
      {"phrase_id": "basil-anaphora-life-world-001"},
      {"text": "."}
    ]
  },
  "basil-anaphora-partakers": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": ["basil", "anaphora", "quiet"],
    "phrases": [
      {"phrase_id": "basil-anaphora-partakers-001"},
      {"text": "، "},
      {"phrase_id": "basil-anaphora-unite-communion-001"},
      {"text": "، "},
      {"phrase_id": "basil-anaphora-not-judgment-001"},
      {"text": "، "},
      {"phrase_id": "basil-anaphora-mercy-saints-001"},
      {"text": ": "},
      {"phrase_id": "basil-anaphora-righteous-list-001"},
      {"text": "."}
    ]
  },
  "basil-anaphora-rubric-all-creation": {
    "break_before": true,
    "tags": ["basil", "anaphora", "rubric"],
    "phrases": [
      {"phrase_id": "basil-anaphora-rubric-all-creation-001"},
      {"text": "."}
    ]
  },
  "basil-anaphora-theotokos-hymn-rubric": {
    "break_before": true,
    "tags": ["basil", "anaphora", "rubric", "theotokos"],
    "phrases": [
      {"phrase_id": "theotokos-hymn-rubric-001"}
    ]
  },
  "theotokos-hymn-rubric": {
    "break_before": true,
    "tags": ["hymn-to-the-theotokos", "rubric", "theotokos"],
    "phrases": [
      {"phrase_id": "theotokos-hymn-rubric-001"}
    ]
  },
  "basil-anaphora-all-creation-hymn": {
    "speaker": "role-choir",
    "break_before": true,
    "tags": ["basil", "anaphora", "theotokos"],
    "phrases": [
      {"phrase_id": "basil-anaphora-all-creation-rejoices-001"},
      {"text": ": "},
      {"phrase_id": "basil-anaphora-angelic-race-001"},
      {"text": ". "},
      {"phrase_id": "basil-anaphora-hallowed-temple-001"},
      {"text": "، "},
      {"phrase_id": "basil-anaphora-god-incarnate-001"},
      {"text": "، "},
      {"phrase_id": "basil-anaphora-womb-throne-001"},
      {"text": ". "},
      {"phrase_id": "basil-anaphora-all-creation-rejoices-001"},
      {"text": ": "},
      {"phrase_id": "basil-anaphora-glory-to-thee-001"},
      {"text": "."}
    ]
  },
  "basil-anaphora-supplication-saints": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": ["basil", "anaphora"],
    "phrases": [
      {"phrase_id": "basil-anaphora-saints-visit-001"},
      {"text": "."}
    ]
  },
  "basil-anaphora-supplication-departed": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": ["basil", "anaphora"],
    "phrases": [
      {"phrase_id": "basil-anaphora-departed-rest-001"},
      {"text": "."}
    ]
  },
  "basil-anaphora-supplication-church": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": ["basil", "anaphora"],
    "phrases": [
      {"phrase_id": "basil-anaphora-church-peace-001"},
      {"text": "."}
    ]
  },
  "basil-anaphora-supplication-gifts": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": ["basil", "anaphora"],
    "phrases": [
      {"phrase_id": "basil-anaphora-gifts-benefactors-001"},
      {"text": "."}
    ]
  },
  "basil-anaphora-supplication-good-works": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": ["basil", "anaphora"],
    "phrases": [
      {"phrase_id": "basil-anaphora-good-works-poor-001"},
      {"text": "."}
    ]
  },
  "basil-anaphora-supplication-heavenly-gifts": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": ["basil", "anaphora"],
    "phrases": [
      {"phrase_id": "basil-anaphora-heavenly-gifts-001"},
      {"text": "."}
    ]
  },
  "basil-anaphora-supplication-ascetics-authorities": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": ["basil", "anaphora"],
    "phrases": [
      {"phrase_id": "basil-anaphora-ascetics-authorities-001"},
      {"text": "."}
    ]
  },
  "basil-anaphora-supplication-present-households": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": ["basil", "anaphora"],
    "phrases": [
      {"phrase_id": "basil-anaphora-present-absent-001"},
      {"text": ". "},
      {"phrase_id": "basil-anaphora-households-001"},
      {"text": "."}
    ]
  },
  "basil-anaphora-supplication-needs-helper": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": ["basil", "anaphora"],
    "phrases": [
      {"phrase_id": "basil-anaphora-ages-conditions-001"},
      {"text": ". "},
      {"phrase_id": "basil-anaphora-scattered-afflicted-001"},
      {"text": ". "},
      {"phrase_id": "basil-anaphora-tribulation-001"},
      {"text": ". "},
      {"phrase_id": "basil-anaphora-loved-hated-001"},
      {"text": ". "},
      {"phrase_id": "basil-anaphora-unknown-names-001"},
      {"text": ". "},
      {"phrase_id": "basil-anaphora-helper-all-001"},
      {"text": "."}
    ]
  },
  "basil-anaphora-supplication-deliver-city": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": ["basil", "anaphora"],
    "phrases": [
      {"phrase_id": "basil-anaphora-deliver-city-001"},
      {"text": "."}
    ]
  },
  "basil-anaphora-bishop-petition-orthodox": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": ["basil", "anaphora"],
    "phrases": [
      {"phrase_id": "basil-anaphora-every-bishop-001"},
      {"text": "."}
    ]
  },
  "basil-anaphora-bishop-petition-unworthiness": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": ["basil", "anaphora"],
    "phrases": [
      {"phrase_id": "basil-anaphora-my-unworthiness-001"},
      {"text": "، "},
      {"phrase_id": "basil-anaphora-withhold-not-spirit-001"},
      {"text": "."}
    ]
  },
  "basil-anaphora-bishop-petition-presbytery": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": ["basil", "anaphora"],
    "phrases": [
      {"phrase_id": "basil-anaphora-presbytery-001"},
      {"text": ". "},
      {"phrase_id": "basil-anaphora-visit-seasons-001"},
      {"text": ". "},
      {"phrase_id": "basil-anaphora-rains-year-001"},
      {"text": ". "},
      {"phrase_id": "basil-anaphora-schisms-heresies-001"},
      {"text": ". "},
      {"phrase_id": "basil-anaphora-sons-light-001"},
      {"text": "، "},
      {"phrase_id": "basil-anaphora-peace-love-001"},
      {"text": "."}
    ]
  },
  "theotokos-hymn-choir": {
    "speaker": "role-choir",
    "break_before": true,
    "tags": [
      "hymn-to-the-theotokos"
    ],
    "phrases": [
      {
        "phrase_id": "theotokos-hymn-meet-bless-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "theotokos-hymn-bless-theotokos-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "theotokos-hymn-ever-blessed-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "theotokos-hymn-blameless-mother-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "theotokos-hymn-mother-our-god-001"
      },
      {
        "text": ". "
      },
      {
        "phrase_id": "theotokos-hymn-more-honorable-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "theotokos-hymn-more-glorious-001"
      },
      {
        "text": ". "
      },
      {
        "phrase_id": "theotokos-hymn-without-corruption-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "theotokos-hymn-truly-magnify-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "theotokos-hymn-we-magnify-001"
      },
      {
        "text": "."
      }
    ]
  },
  "theotokos-priest-saints": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": [
      "hymn-to-the-theotokos",
      "quiet"
    ],
    "phrases": [
      {
        "phrase_id": "theotokos-prophet-forerunner-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "theotokos-apostles-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "theotokos-saint-of-day-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "theotokos-so-and-so-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "theotokos-memory-today-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "theotokos-all-saints-supplications-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "theotokos-supplications-look-down-001"
      },
      {
        "text": "."
      }
    ]
  },
  "theotokos-priest-departed": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": [
      "hymn-to-the-theotokos",
      "quiet"
    ],
    "phrases": [
      {
        "phrase_id": "theotokos-remember-departed-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "theotokos-hope-resurrection-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "theotokos-names-departed-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "theotokos-grant-rest-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "theotokos-light-countenance-001"
      },
      {
        "text": "."
      }
    ]
  },
  "theotokos-priest-bishops": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": [
      "hymn-to-the-theotokos",
      "quiet"
    ],
    "phrases": [
      {
        "phrase_id": "theotokos-remember-bishops-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "theotokos-remember-all-bishops-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "theotokos-rightly-dividing-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "theotokos-dividing-word-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "theotokos-clergy-orders-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "theotokos-priestly-monastic-001"
      },
      {
        "text": "."
      }
    ]
  },
  "theotokos-priest-world": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": [
      "hymn-to-the-theotokos",
      "quiet"
    ],
    "phrases": [
      {
        "phrase_id": "theotokos-rational-service-world-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "theotokos-for-whole-world-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "theotokos-church-offering-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "theotokos-chaste-life-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "theotokos-civil-authorities-001"
      },
      {
        "text": ". "
      },
      {
        "phrase_id": "theotokos-peaceful-times-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "theotokos-quiet-life-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "theotokos-calm-peaceful-life-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "theotokos-reverence-godliness-001"
      },
      {
        "text": "."
      }
    ]
  },
  "theotokos-clergy-hierarch": {
    "speaker": "role-clergy",
    "break_before": true,
    "tags": [
      "hymn-to-the-theotokos"
    ],
    "phrases": [
      {
        "phrase_id": "theotokos-among-first-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "theotokos-father-metropolitan-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "theotokos-so-and-so-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "theotokos-grant-churches-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "theotokos-health-honor-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "theotokos-length-days-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "theotokos-rightly-word-truth-001"
      },
      {
        "text": "."
      }
    ]
  },
  "theotokos-deacon-present": {
    "speaker": "role-deacon",
    "break_before": true,
    "tags": [
      "hymn-to-the-theotokos"
    ],
    "phrases": [
      {
        "phrase_id": "theotokos-present-remembered-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "theotokos-of-present-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "theotokos-all-men-women-001"
      },
      {
        "text": "."
      }
    ]
  },
  "theotokos-choir-all": {
    "speaker": "role-choir",
    "break_before": true,
    "tags": [
      "hymn-to-the-theotokos",
      "response"
    ],
    "phrases": [
      {
        "phrase_id": "theotokos-all-men-women-001"
      },
      {
        "text": "."
      }
    ]
  },
  "theotokos-priest-city": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": [
      "hymn-to-the-theotokos",
      "quiet"
    ],
    "phrases": [
      {
        "phrase_id": "theotokos-remember-city-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "theotokos-every-city-countryside-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "theotokos-faithful-dwelling-001"
      },
      {
        "text": ". "
      },
      {
        "phrase_id": "theotokos-travelers-sick-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "theotokos-land-sea-air-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "theotokos-sick-captive-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "theotokos-grant-salvation-001"
      },
      {
        "text": "."
      }
    ]
  },
  "theotokos-priest-benefactors": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": [
      "hymn-to-the-theotokos",
      "quiet"
    ],
    "phrases": [
      {
        "phrase_id": "theotokos-bear-fruit-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "theotokos-good-works-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "theotokos-remember-poor-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "theotokos-send-mercies-001"
      },
      {
        "text": "."
      }
    ]
  },
  "theotokos-priest-doxology": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": [
      "hymn-to-the-theotokos"
    ],
    "phrases": [
      {
        "phrase_id": "theotokos-one-mouth-heart-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "theotokos-one-mouth-one-heart-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "theotokos-all-honorable-name-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "theotokos-majestic-name-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "theotokos-father-son-spirit-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "theotokos-now-ever-ages-001"
      },
      {
        "text": "."
      }
    ]
  },
  "theotokos-choir-amen": {
    "speaker": "role-choir",
    "break_before": true,
    "tags": [
      "hymn-to-the-theotokos",
      "response"
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
  "theotokos-priest-mercies": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": [
      "hymn-to-the-theotokos"
    ],
    "phrases": [
      {
        "phrase_id": "theotokos-mercies-god-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "theotokos-savior-christ-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "theotokos-be-with-all-001"
      },
      {
        "text": "."
      }
    ]
  },
  "theotokos-choir-and-spirit": {
    "speaker": "role-choir",
    "break_before": true,
    "tags": [
      "hymn-to-the-theotokos",
      "response"
    ],
    "phrases": [
      {
        "phrase_id": "holy-anaphora-and-with-spirit-001"
      },
      {
        "text": "."
      }
    ]
  },
  "before-lords-prayer-remember-saints": {
    "speaker": "role-deacon",
    "break_before": true,
    "tags": [
      "litany-before-lords-prayer"
    ],
    "phrases": [
      {
        "phrase_id": "before-lords-prayer-remember-saints-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "before-lords-prayer-again-peace-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "supplication-let-us-pray-lord-001"
      },
      {
        "text": "."
      }
    ]
  },
  "before-lords-prayer-lord-have-mercy-1": {
    "speaker": "role-choir",
    "break_before": true,
    "tags": [
      "litany-before-lords-prayer",
      "response"
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
  "before-lords-prayer-precious-gifts": {
    "speaker": "role-deacon",
    "break_before": true,
    "tags": [
      "litany-before-lords-prayer"
    ],
    "phrases": [
      {
        "phrase_id": "before-lords-prayer-gifts-precious-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "before-lords-prayer-gifts-sanctified-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "supplication-let-us-pray-lord-001"
      },
      {
        "text": "."
      }
    ]
  },
  "before-lords-prayer-lord-have-mercy-2": {
    "speaker": "role-choir",
    "break_before": true,
    "tags": [
      "litany-before-lords-prayer",
      "response"
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
  "before-lords-prayer-receive-gifts": {
    "speaker": "role-deacon",
    "break_before": true,
    "tags": [
      "litany-before-lords-prayer"
    ],
    "phrases": [
      {
        "phrase_id": "before-lords-prayer-god-loves-mankind-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "before-lords-prayer-received-gifts-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "before-lords-prayer-holy-altar-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "before-lords-prayer-aroma-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "before-lords-prayer-send-grace-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "before-lords-prayer-divine-grace-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "before-lords-prayer-gift-spirit-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "before-lords-prayer-let-us-pray-001"
      },
      {
        "text": "."
      }
    ]
  },
  "before-lords-prayer-lord-have-mercy-3": {
    "speaker": "role-choir",
    "break_before": true,
    "tags": [
      "litany-before-lords-prayer",
      "response"
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
  "before-lords-prayer-unity": {
    "speaker": "role-deacon",
    "break_before": true,
    "tags": [
      "litany-before-lords-prayer"
    ],
    "phrases": [
      {
        "phrase_id": "before-lords-prayer-unity-faith-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "before-lords-prayer-communion-spirit-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "before-lords-prayer-commend-ourselves-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "before-lords-prayer-all-life-001"
      },
      {
        "text": ":"
      }
    ]
  },
  "before-lords-prayer-to-thee": {
    "speaker": "role-choir",
    "break_before": true,
    "tags": [
      "litany-before-lords-prayer",
      "response"
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
  "before-lords-prayer-priest-commend": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": [
      "litany-before-lords-prayer",
      "quiet"
    ],
    "phrases": [
      {
        "phrase_id": "before-lords-prayer-unto-thee-life-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "before-lords-prayer-hopes-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "before-lords-prayer-beseech-pray-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "before-lords-prayer-vouchsafe-partake-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "before-lords-prayer-heavenly-mysteries-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "before-lords-prayer-sacred-table-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "before-lords-prayer-remission-sins-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "before-lords-prayer-pardon-transgressions-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "before-lords-prayer-communion-holy-spirit-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "before-lords-prayer-inheritance-kingdom-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "before-lords-prayer-boldness-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "before-lords-prayer-not-judgment-001"
      },
      {
        "text": "."
      }
    ]
  },
  "basil-before-lords-prayer-priest-prayer": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": ["basil", "litany-before-lords-prayer", "quiet"],
    "phrases": [
      {"phrase_id": "basil-before-lords-prayer-god-salvation-001"},
      {"text": "، "},
      {"phrase_id": "basil-before-lords-prayer-teach-thanks-001"},
      {"text": "، "},
      {"phrase_id": "basil-before-lords-prayer-benefits-001"},
      {"text": ". "},
      {"phrase_id": "basil-before-lords-prayer-receiver-gifts-001"},
      {"text": "، "},
      {"phrase_id": "basil-before-lords-prayer-purify-us-001"},
      {"text": ". "},
      {"phrase_id": "basil-before-lords-prayer-perfect-holiness-001"},
      {"text": ". "},
      {"phrase_id": "basil-before-lords-prayer-portion-holy-001"},
      {"text": "، "},
      {"phrase_id": "basil-before-lords-prayer-good-conscience-001"},
      {"text": "، "},
      {"phrase_id": "basil-before-lords-prayer-united-body-blood-001"},
      {"text": ". "},
      {"phrase_id": "basil-before-lords-prayer-received-worthily-001"},
      {"text": "، "},
      {"phrase_id": "basil-before-lords-prayer-christ-hearts-001"},
      {"text": "، "},
      {"phrase_id": "basil-before-lords-prayer-temple-spirit-001"},
      {"text": ". "},
      {"phrase_id": "basil-before-lords-prayer-yea-god-001"},
      {"text": ". "},
      {"phrase_id": "basil-before-lords-prayer-not-stranger-001"},
      {"text": "، "},
      {"phrase_id": "basil-before-lords-prayer-not-infirm-001"},
      {"text": "، "},
      {"phrase_id": "basil-before-lords-prayer-unworthy-partaking-001"},
      {"text": ". "},
      {"phrase_id": "basil-before-lords-prayer-receive-worthily-001"},
      {"text": "، "},
      {"phrase_id": "basil-before-lords-prayer-last-breath-001"},
      {"text": "، "},
      {"phrase_id": "basil-before-lords-prayer-portion-again-001"},
      {"text": "، "},
      {"phrase_id": "basil-before-lords-prayer-provision-life-001"},
      {"text": "، "},
      {"phrase_id": "basil-before-lords-prayer-defense-001"},
      {"text": ". "},
      {"phrase_id": "basil-before-lords-prayer-also-saints-001"},
      {"text": "، "},
      {"phrase_id": "basil-before-lords-prayer-pleasing-saints-001"},
      {"text": "، "},
      {"phrase_id": "basil-before-lords-prayer-partakers-good-001"},
      {"text": "، "},
      {"phrase_id": "basil-before-lords-prayer-prepared-love-001"},
      {"text": "."}
    ]
  },
  "before-lords-prayer-priest-vouchsafe": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": [
      "litany-before-lords-prayer"
    ],
    "phrases": [
      {
        "phrase_id": "before-lords-prayer-vouchsafe-master-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "before-lords-prayer-dare-call-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "before-lords-prayer-call-father-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "before-lords-prayer-heavenly-god-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "before-lords-prayer-and-say-001"
      },
      {
        "text": ":"
      }
    ]
  },
  "lords-prayer-prayer": {
    "speaker": "role-all",
    "break_before": true,
    "tags": [
      "lord's-prayer"
    ],
    "phrases": [
      {
        "phrase_id": "lords-prayer-our-father-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "lords-prayer-in-heavens-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "lords-prayer-hallowed-name-001"
      },
      {
        "text": "،"
      }
    ]
  },
  "lords-prayer-kingdom": {
    "speaker": "role-all",
    "break_before": true,
    "tags": [
      "lord's-prayer",
      "paragraph-join"
    ],
    "phrases": [
      {
        "phrase_id": "lords-prayer-kingdom-come-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "lords-prayer-will-done-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "lords-prayer-heaven-earth-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "lords-prayer-on-earth-001"
      },
      {
        "text": "."
      }
    ]
  },
  "lords-prayer-daily-bread": {
    "speaker": "role-all",
    "break_before": true,
    "tags": [
      "lord's-prayer",
      "paragraph-join"
    ],
    "phrases": [
      {
        "phrase_id": "lords-prayer-daily-bread-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "lords-prayer-give-today-001"
      },
      {
        "text": "،"
      }
    ]
  },
  "lords-prayer-forgive": {
    "speaker": "role-all",
    "break_before": true,
    "tags": [
      "lord's-prayer",
      "paragraph-join"
    ],
    "phrases": [
      {
        "phrase_id": "lords-prayer-forgive-debts-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "lords-prayer-forgive-debtors-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "lords-prayer-who-owes-us-001"
      },
      {
        "text": "،"
      }
    ]
  },
  "lords-prayer-temptation": {
    "speaker": "role-all",
    "break_before": true,
    "tags": [
      "lord's-prayer",
      "paragraph-join"
    ],
    "phrases": [
      {
        "phrase_id": "lords-prayer-not-temptation-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "lords-prayer-deliver-evil-001"
      },
      {
        "text": "."
      }
    ]
  },
  "lords-prayer-priest-doxology": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": [
      "lord's-prayer"
    ],
    "phrases": [
      {
        "phrase_id": "lords-prayer-thine-kingdom-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "lords-prayer-father-son-spirit-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "lords-prayer-now-ever-ages-001"
      },
      {
        "text": "."
      }
    ]
  },
  "lords-prayer-choir-amen": {
    "speaker": "role-choir",
    "break_before": true,
    "tags": [
      "lord's-prayer",
      "response"
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
  "lords-prayer-priest-peace": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": [
      "lord's-prayer"
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
  "lords-prayer-choir-spirit": {
    "speaker": "role-choir",
    "break_before": true,
    "tags": [
      "lord's-prayer",
      "response"
    ],
    "phrases": [
      {
        "phrase_id": "lords-prayer-and-to-spirit-001"
      },
      {
        "text": "."
      }
    ]
  },
  "lords-prayer-deacon-bow-heads": {
    "speaker": "role-deacon",
    "break_before": true,
    "tags": [
      "lord's-prayer"
    ],
    "phrases": [
      {
        "phrase_id": "lords-prayer-bow-heads-001"
      },
      {
        "text": "."
      }
    ]
  },
  "lords-prayer-choir-to-thee": {
    "speaker": "role-choir",
    "break_before": true,
    "tags": [
      "lord's-prayer",
      "response"
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
  "lords-prayer-priest-bowing-prayer": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": [
      "lord's-prayer",
      "quiet"
    ],
    "phrases": [
      {
        "phrase_id": "lords-prayer-thank-king-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "lords-prayer-boundless-power-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "lords-prayer-made-all-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "lords-prayer-mercy-brought-001"
      },
      {
        "text": ". "
      },
      {
        "phrase_id": "lords-prayer-look-down-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "lords-prayer-bowed-heads-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "lords-prayer-not-flesh-blood-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "lords-prayer-to-fearful-god-001"
      },
      {
        "text": ". "
      },
      {
        "phrase_id": "lords-prayer-distribute-gifts-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "lords-prayer-according-need-001"
      },
      {
        "text": ". "
      },
      {
        "phrase_id": "lords-prayer-travelers-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "lords-prayer-heal-sick-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "lords-prayer-physician-001"
      },
      {
        "text": "."
      }
    ]
  },
  "lords-prayer-priest-bowing-doxology": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": [
      "lord's-prayer"
    ],
    "phrases": [
      {
        "phrase_id": "lords-prayer-grace-compassions-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "lords-prayer-love-mankind-son-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "lords-prayer-blessed-with-him-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "lords-prayer-all-holy-spirit-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "lords-prayer-now-ever-ages-001"
      },
      {
        "text": "."
      }
    ]
  },
  "lords-prayer-choir-bowing-amen": {
    "speaker": "role-choir",
    "break_before": true,
    "tags": [
      "lord's-prayer",
      "response"
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
  "elevation-priest-prayer": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": [
      "elevation",
      "quiet"
    ],
    "phrases": [
      {
        "phrase_id": "elevation-hear-us-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "elevation-holy-dwelling-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "elevation-throne-glory-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "elevation-sanctify-us-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "elevation-seated-high-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "elevation-present-invisibly-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "elevation-vouchsafe-hand-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "elevation-body-blood-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "elevation-through-us-people-001"
      },
      {
        "text": "."
      }
    ]
  },
  "elevation-priest-private": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": [
      "elevation",
      "quiet",
      "paragraph-break"
    ],
    "phrases": [
      {
        "phrase_id": "elevation-god-forgive-me-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "elevation-have-mercy-001"
      },
      {
        "text": ". "
      },
      {
        "phrase_id": "elevation-rubric-twice-001"
      }
    ]
  },
  "elevation-priest-private-exalt": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": [
      "elevation",
      "quiet",
      "paragraph-break"
    ],
    "phrases": [
      {
        "phrase_id": "elevation-exalt-thee-001"
      },
      {
        "text": ". "
      },
      {
        "phrase_id": "elevation-rubric-once-001"
      }
    ]
  },
  "elevation-deacon-attend": {
    "speaker": "role-deacon",
    "break_before": true,
    "tags": [
      "elevation"
    ],
    "phrases": [
      {
        "phrase_id": "elevation-let-us-attend-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "elevation-rubric-proschoomen-001"
      },
      {
        "text": "."
      }
    ]
  },
  "elevation-priest-holy-things": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": [
      "elevation"
    ],
    "phrases": [
      {
        "phrase_id": "elevation-holy-things-001"
      },
      {
        "text": "."
      }
    ]
  },
  "elevation-choir-one-holy": {
    "speaker": "role-choir",
    "break_before": true,
    "tags": [
      "elevation",
      "response"
    ],
    "phrases": [
      {
        "phrase_id": "elevation-one-holy-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "elevation-one-lord-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "elevation-jesus-christ-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "elevation-glory-father-001"
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
  "communion-deacon-divide-bread": {
    "speaker": "role-deacon",
    "break_before": true,
    "tags": [
      "communion",
      "quiet"
    ],
    "phrases": [
      {
        "phrase_id": "communion-divide-master-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "holy-anaphora-holy-bread-001"
      },
      {
        "text": "."
      }
    ]
  },
  "communion-priest-lamb": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": [
      "communion",
      "quiet"
    ],
    "phrases": [
      {
        "phrase_id": "communion-lamb-divided-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "communion-divided-not-disunited-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "communion-ever-eaten-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "communion-never-consumed-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "communion-sanctifies-partakers-001"
      },
      {
        "text": "."
      }
    ]
  },
  "communion-deacon-fill-cup": {
    "speaker": "role-deacon",
    "break_before": true,
    "tags": [
      "communion",
      "quiet"
    ],
    "phrases": [
      {
        "phrase_id": "communion-fill-master-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "holy-anaphora-holy-cup-001"
      },
      {
        "text": "."
      }
    ]
  },
  "communion-priest-fullness-spirit": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": [
      "communion",
      "quiet"
    ],
    "phrases": [
      {
        "phrase_id": "communion-fullness-spirit-001"
      },
      {
        "text": "."
      }
    ]
  },
  "communion-deacon-amen-1": {
    "speaker": "role-deacon",
    "break_before": true,
    "tags": [
      "communion",
      "quiet"
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
  "communion-deacon-bless-water": {
    "speaker": "role-deacon",
    "break_before": true,
    "tags": [
      "communion",
      "quiet"
    ],
    "phrases": [
      {
        "phrase_id": "communion-bless-master-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "communion-warm-water-001"
      },
      {
        "text": "."
      }
    ]
  },
  "communion-priest-warmth-blessing": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": [
      "communion",
      "quiet"
    ],
    "phrases": [
      {
        "phrase_id": "communion-blessed-warmth-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "communion-every-time-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "lords-prayer-now-ever-ages-001"
      },
      {
        "text": "."
      }
    ]
  },
  "communion-deacon-amen-2": {
    "speaker": "role-deacon",
    "break_before": true,
    "tags": [
      "communion",
      "quiet"
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
  "communion-deacon-warmth-spirit": {
    "speaker": "role-deacon",
    "break_before": true,
    "tags": [
      "communion",
      "quiet"
    ],
    "phrases": [
      {
        "phrase_id": "communion-warmth-spirit-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "amen-001"
      },
      {
        "text": "."
      }
    ]
  },
  "pre-communion-publican-prayer": {
    "speaker": "role-all",
    "break_before": true,
    "tags": [
      "pre-communion-prayers"
    ],
    "phrases": [
      {
        "phrase_id": "pre-communion-stand-before-doors-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "pre-communion-terrible-thoughts-001"
      },
      {
        "text": ". "
      },
      {
        "phrase_id": "pre-communion-christ-god-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "pre-communion-justified-publican-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "pre-communion-mercy-canaanite-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "pre-communion-open-paradise-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "pre-communion-open-compassion-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "pre-communion-receive-approach-touch-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "pre-communion-like-harlot-issue-001"
      },
      {
        "text": ". "
      },
      {
        "phrase_id": "pre-communion-one-healing-001"
      },
      {
        "text": ". "
      },
      {
        "phrase_id": "pre-communion-other-feet-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "pre-communion-forgiveness-sins-001"
      },
      {
        "text": ". "
      },
      {
        "phrase_id": "pre-communion-pitiful-dare-body-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "pre-communion-dare-receive-body-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "pre-communion-let-not-burn-001"
      },
      {
        "text": ". "
      },
      {
        "phrase_id": "pre-communion-receive-like-them-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "pre-communion-enlighten-senses-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "pre-communion-burning-accusations-001"
      },
      {
        "text": ". "
      },
      {
        "phrase_id": "pre-communion-intercessions-seedless-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "pre-communion-heavenly-powers-001"
      },
      {
        "text": ". "
      },
      {
        "phrase_id": "pre-communion-blessed-ages-001"
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
  "pre-communion-confession-prayer": {
    "speaker": "role-all",
    "break_before": true,
    "tags": [
      "pre-communion-prayers"
    ],
    "phrases": [
      {
        "phrase_id": "pre-communion-believe-confess-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "pre-communion-truly-christ-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "pre-communion-came-save-sinners-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "pre-communion-first-sinners-001"
      },
      {
        "text": ". "
      },
      {
        "phrase_id": "pre-communion-own-body-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "pre-communion-own-blood-001"
      },
      {
        "text": ". "
      },
      {
        "phrase_id": "pre-communion-pray-mercy-forgive-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "pre-communion-transgressions-voluntary-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "pre-communion-word-deed-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "pre-communion-knowledge-ignorance-001"
      },
      {
        "text": ". "
      },
      {
        "phrase_id": "pre-communion-worthy-without-condemnation-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "pre-communion-partake-mysteries-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "pre-communion-remission-life-001"
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
  "pre-communion-behold-prayer": {
    "speaker": "role-all",
    "break_before": true,
    "tags": [
      "pre-communion-prayers"
    ],
    "phrases": [
      {
        "phrase_id": "pre-communion-behold-approach-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "pre-communion-maker-burn-not-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "pre-communion-fire-unworthy-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "pre-communion-purify-stain-001"
      },
      {
        "text": "."
      }
    ]
  },
  "pre-communion-mystic-supper-prayer": {
    "speaker": "role-all",
    "break_before": true,
    "tags": [
      "pre-communion-prayers"
    ],
    "phrases": [
      {
        "phrase_id": "pre-communion-mystic-supper-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "pre-communion-o-son-god-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "pre-communion-not-speak-enemies-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "pre-communion-not-kiss-judas-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "pre-communion-like-thief-confess-001"
      },
      {
        "text": ": "
      },
      {
        "phrase_id": "pre-communion-remember-kingdom-001"
      },
      {
        "text": "."
      }
    ]
  },
  "pre-communion-tremble-prayer": {
    "speaker": "role-all",
    "break_before": true,
    "tags": [
      "pre-communion-prayers"
    ],
    "phrases": [
      {
        "phrase_id": "pre-communion-tremble-man-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "pre-communion-deifying-blood-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "pre-communion-burning-coal-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "pre-communion-body-deifies-nourishes-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "pre-communion-deifies-spirit-001"
      },
      {
        "text": "."
      }
    ]
  },
  "pre-communion-yearning-prayer": {
    "speaker": "role-all",
    "break_before": true,
    "tags": [
      "pre-communion-prayers"
    ],
    "phrases": [
      {
        "phrase_id": "pre-communion-smitten-yearning-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "pre-communion-divine-love-changed-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "pre-communion-longing-transform-001"
      },
      {
        "text": ". "
      },
      {
        "phrase_id": "pre-communion-burn-sins-001"
      },
      {
        "text": ". "
      },
      {
        "phrase_id": "pre-communion-filled-delight-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "pre-communion-magnify-comings-001"
      },
      {
        "text": "."
      }
    ]
  },
  "pre-communion-splendour-prayer": {
    "speaker": "role-all",
    "break_before": true,
    "tags": [
      "pre-communion-prayers"
    ],
    "phrases": [
      {
        "phrase_id": "pre-communion-splendour-saints-001"
      },
      {
        "text": ". "
      },
      {
        "phrase_id": "pre-communion-bridal-chamber-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "pre-communion-vesture-betrays-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "pre-communion-not-wedding-garment-001"
      },
      {
        "text": ". "
      },
      {
        "phrase_id": "pre-communion-cast-out-angels-001"
      },
      {
        "text": ". "
      },
      {
        "phrase_id": "pre-communion-cleanse-defilement-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "pre-communion-save-friend-man-001"
      },
      {
        "text": "."
      }
    ]
  },
  "pre-communion-master-prayer": {
    "speaker": "role-all",
    "break_before": true,
    "tags": [
      "pre-communion-prayers"
    ],
    "phrases": [
      {
        "phrase_id": "pre-communion-manbefriending-master-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "pre-communion-lord-jesus-god-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "pre-communion-not-judgment-gifts-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "pre-communion-unworthiness-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "pre-communion-purification-soul-body-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "pre-communion-earnest-life-kingdom-001"
      },
      {
        "text": ". "
      },
      {
        "phrase_id": "pre-communion-cleave-god-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "pre-communion-hope-salvation-001"
      },
      {
        "text": "."
      }
    ]
  },
  "pre-communion-mystic-supper-repeat": {
    "speaker": "role-all",
    "break_before": true,
    "tags": [
      "pre-communion-prayers"
    ],
    "phrases": [
      {
        "phrase_id": "pre-communion-mystic-supper-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "pre-communion-o-son-god-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "pre-communion-not-speak-enemies-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "pre-communion-not-kiss-judas-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "pre-communion-like-thief-confess-001"
      },
      {
        "text": ": "
      },
      {
        "phrase_id": "pre-communion-remember-kingdom-001"
      },
      {
        "text": "."
      }
    ]
  },
  "pre-communion-not-judgment-prayer": {
    "speaker": "role-all",
    "break_before": true,
    "tags": [
      "pre-communion-prayers"
    ],
    "phrases": [
      {
        "phrase_id": "pre-communion-not-judgment-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "pre-communion-judgment-condemnation-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "pre-communion-healing-soul-body-001"
      },
      {
        "text": "."
      }
    ]
  },
  "pre-communion-rubric-koinonikon": {
    "speaker": "",
    "break_before": true,
    "tags": [
      "pre-communion-prayers",
      "rubric"
    ],
    "phrases": [
      {
        "phrase_id": "pre-communion-rubric-koinonikon-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "pre-communion-rubric-choir-begins-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "pre-communion-rubric-ordinary-sunday-001"
      },
      {
        "text": ":"
      }
    ]
  },
  "pre-communion-choir-koinonikon": {
    "speaker": "role-choir",
    "break_before": true,
    "tags": [
      "pre-communion-prayers",
      "hymn"
    ],
    "phrases": [
      {
        "phrase_id": "pre-communion-praise-lord-heavens-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "pre-communion-praise-highest-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "alleluia-001"
      },
      {
        "text": "."
      }
    ]
  },
  "pre-communion-deacon-draw-near": {
    "speaker": "role-deacon",
    "break_before": true,
    "tags": [
      "pre-communion-prayers"
    ],
    "phrases": [
      {
        "phrase_id": "pre-communion-fear-faith-love-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "pre-communion-draw-near-001"
      },
      {
        "text": "."
      }
    ]
  },
  "pre-communion-choir-blessed-coming": {
    "speaker": "role-choir",
    "break_before": true,
    "tags": [
      "pre-communion-prayers",
      "hymn"
    ],
    "phrases": [
      {
        "phrase_id": "holy-anaphora-blessed-comes-001"
      },
      {
        "text": ". "
      },
      {
        "phrase_id": "pre-communion-lord-appeared-001"
      },
      {
        "text": "."
      }
    ]
  },
  "pre-communion-rubric-people-communion": {
    "speaker": "",
    "break_before": true,
    "tags": [
      "pre-communion-prayers",
      "rubric"
    ],
    "phrases": [
      {
        "phrase_id": "pre-communion-rubric-people-communion-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "pre-communion-rubric-priest-communes-001"
      },
      {
        "text": "."
      }
    ]
  },
  "pre-communion-rubric-following-hymn": {
    "speaker": "",
    "break_before": true,
    "tags": [
      "pre-communion-prayers",
      "rubric"
    ],
    "phrases": [
      {
        "phrase_id": "pre-communion-rubric-following-hymn-001"
      },
      {
        "text": ":"
      }
    ]
  },
  "pre-communion-choir-mystic-supper": {
    "speaker": "role-choir",
    "break_before": true,
    "tags": [
      "pre-communion-prayers",
      "hymn"
    ],
    "phrases": [
      {
        "phrase_id": "pre-communion-mystic-supper-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "pre-communion-o-son-god-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "pre-communion-choir-not-speak-enemies-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "pre-communion-choir-not-kiss-judas-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "pre-communion-like-thief-confess-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "pre-communion-remember-kingdom-001"
      },
      {
        "text": "."
      }
    ]
  },
  "pre-communion-rubric-hymn-changes": {
    "speaker": "",
    "break_before": true,
    "tags": [
      "pre-communion-prayers",
      "rubric"
    ],
    "phrases": [
      {
        "phrase_id": "pre-communion-rubric-hymn-changes-001"
      },
      {
        "text": "."
      }
    ]
  },
  "pre-communion-rubric-thanksgiving-page": {
    "speaker": "",
    "break_before": true,
    "tags": [
      "pre-communion-prayers",
      "rubric"
    ],
    "phrases": [
      {
        "phrase_id": "pre-communion-rubric-thanksgiving-page-001"
      },
      {
        "text": "."
      }
    ]
  },
  "pre-communion-priest-save-people": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": [
      "pre-communion-prayers"
    ],
    "phrases": [
      {
        "phrase_id": "pre-communion-save-people-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "pre-communion-bless-inheritance-001"
      },
      {
        "text": "."
      }
    ]
  },
  "pre-communion-choir-seen-light": {
    "speaker": "role-choir",
    "break_before": true,
    "tags": [
      "pre-communion-prayers",
      "hymn"
    ],
    "phrases": [
      {
        "phrase_id": "pre-communion-seen-light-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "pre-communion-received-spirit-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "pre-communion-found-faith-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "pre-communion-worship-trinity-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "pre-communion-he-saved-us-001"
      },
      {
        "text": "."
      }
    ]
  },
  "pre-communion-rubric-enter-sanctuary": {
    "speaker": "",
    "break_before": true,
    "tags": [
      "pre-communion-prayers",
      "rubric"
    ],
    "phrases": [
      {
        "phrase_id": "pre-communion-rubric-enter-sanctuary-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "pre-communion-rubric-place-chalice-001"
      },
      {
        "text": ". "
      },
      {
        "phrase_id": "pre-communion-rubric-wipe-particles-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "pre-communion-rubric-sponge-001"
      },
      {
        "text": ":"
      }
    ]
  },
  "pre-communion-deacon-wash-blood": {
    "speaker": "role-deacon",
    "break_before": true,
    "tags": [
      "pre-communion-prayers"
    ],
    "phrases": [
      {
        "phrase_id": "pre-communion-wash-blood-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "pre-communion-sins-servants-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "pre-communion-intercessions-theotokos-saints-001"
      },
      {
        "text": "."
      }
    ]
  },
  "pre-communion-rubric-cover-holies": {
    "speaker": "",
    "break_before": true,
    "tags": [
      "pre-communion-prayers",
      "rubric"
    ],
    "phrases": [
      {
        "phrase_id": "pre-communion-rubric-cover-chalice-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "pre-communion-rubric-covers-star-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "pre-communion-rubric-censes-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "pre-communion-rubric-deacon-says-001"
      },
      {
        "text": ":"
      }
    ]
  },
  "pre-communion-deacon-exalt-master": {
    "speaker": "role-deacon",
    "break_before": true,
    "tags": [
      "pre-communion-prayers"
    ],
    "phrases": [
      {
        "phrase_id": "pre-communion-exalt-master-001"
      },
      {
        "text": "."
      }
    ]
  },
  "pre-communion-priest-be-exalted": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": [
      "pre-communion-prayers"
    ],
    "phrases": [
      {
        "phrase_id": "pre-communion-be-exalted-god-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "pre-communion-glory-earth-001"
      },
      {
        "text": "."
      }
    ]
  },
  "pre-communion-rubric-diskos-prothesis": {
    "speaker": "",
    "break_before": true,
    "tags": [
      "pre-communion-prayers",
      "rubric"
    ],
    "phrases": [
      {
        "phrase_id": "pre-communion-rubric-diskos-deacon-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "pre-communion-rubric-prothesis-001"
      },
      {
        "text": ". "
      },
      {
        "phrase_id": "pre-communion-rubric-priest-lifts-chalice-001"
      },
      {
        "text": ":"
      }
    ]
  },
  "pre-communion-priest-always": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": [
      "pre-communion-prayers"
    ],
    "phrases": [
      {
        "phrase_id": "pre-communion-every-time-now-ever-001"
      },
      {
        "text": "."
      }
    ]
  },
  "pre-communion-choir-mouths-filled": {
    "speaker": "role-choir",
    "break_before": true,
    "tags": [
      "pre-communion-prayers",
      "hymn"
    ],
    "phrases": [
      {
        "phrase_id": "amen-001"
      },
      {
        "text": ". "
      },
      {
        "phrase_id": "pre-communion-mouths-filled-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "pre-communion-sing-glory-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "pre-communion-made-worthy-mysteries-001"
      },
      {
        "text": ". "
      },
      {
        "phrase_id": "pre-communion-keep-sanctification-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "pre-communion-meditate-righteousness-001"
      },
      {
        "text": ". "
      },
      {
        "phrase_id": "alleluia-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "alleluia-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "alleluia-001"
      },
      {
        "text": "."
      }
    ]
  },
  "thanksgiving-deacon-partaken": {
    "speaker": "role-deacon",
    "break_before": true,
    "tags": [
      "litany-of-thanksgiving"
    ],
    "phrases": [
      {
        "phrase_id": "thanksgiving-stand-upright-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "thanksgiving-mysteries-divine-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "thanksgiving-mysteries-holy-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "thanksgiving-mysteries-life-giving-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "thanksgiving-give-thanks-worthily-001"
      },
      {
        "text": "."
      }
    ]
  },
  "thanksgiving-choir-lord-have-mercy-1": {
    "speaker": "role-choir",
    "break_before": true,
    "tags": [
      "litany-of-thanksgiving",
      "response"
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
  "thanksgiving-deacon-help-save": {
    "speaker": "role-deacon",
    "break_before": true,
    "tags": [
      "litany-of-thanksgiving"
    ],
    "phrases": [
      {
        "phrase_id": "thanksgiving-help-save-have-mercy-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "thanksgiving-keep-us-grace-001"
      },
      {
        "text": "."
      }
    ]
  },
  "thanksgiving-choir-lord-have-mercy-2": {
    "speaker": "role-choir",
    "break_before": true,
    "tags": [
      "litany-of-thanksgiving",
      "response"
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
  "thanksgiving-deacon-commend": {
    "speaker": "role-deacon",
    "break_before": true,
    "tags": [
      "litany-of-thanksgiving"
    ],
    "phrases": [
      {
        "phrase_id": "thanksgiving-whole-day-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "thanksgiving-peaceful-sinless-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "thanksgiving-commend-ourselves-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "thanksgiving-all-life-christ-001"
      },
      {
        "text": "."
      }
    ]
  },
  "thanksgiving-choir-to-thee": {
    "speaker": "role-choir",
    "break_before": true,
    "tags": [
      "litany-of-thanksgiving",
      "response"
    ],
    "phrases": [
      {
        "phrase_id": "thanksgiving-to-thee-lord-001"
      },
      {
        "text": "."
      }
    ]
  },
  "thanksgiving-priest-prayer-quiet": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": [
      "litany-of-thanksgiving",
      "quiet"
    ],
    "phrases": [
      {
        "phrase_id": "thanksgiving-priest-we-thank-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "thanksgiving-benefactor-souls-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "thanksgiving-vouchsafed-feed-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "thanksgiving-heavenly-immortal-001"
      },
      {
        "text": ". "
      },
      {
        "phrase_id": "thanksgiving-make-path-straight-001"
      },
      {
        "text": ". "
      },
      {
        "phrase_id": "thanksgiving-establish-fear-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "thanksgiving-guard-life-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "thanksgiving-make-steps-firm-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "thanksgiving-prayers-theotokos-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "thanksgiving-ever-virgin-saints-001"
      },
      {
        "text": "."
      }
    ]
  },
  "thanksgiving-priest-doxology": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": [
      "litany-of-thanksgiving"
    ],
    "phrases": [
      {
        "phrase_id": "thanksgiving-sanctification-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "thanksgiving-ascribe-glory-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "thanksgiving-father-son-spirit-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "thanksgiving-now-ever-ages-001"
      },
      {
        "text": "."
      }
    ]
  },
  "thanksgiving-choir-amen": {
    "speaker": "role-choir",
    "break_before": true,
    "tags": [
      "litany-of-thanksgiving",
      "response"
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
  "thanksgiving-priest-go-forth": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": [
      "litany-of-thanksgiving"
    ],
    "phrases": [
      {
        "phrase_id": "thanksgiving-go-forth-peace-001"
      },
      {
        "text": "."
      }
    ]
  },
  "thanksgiving-choir-in-name": {
    "speaker": "role-choir",
    "break_before": true,
    "tags": [
      "litany-of-thanksgiving",
      "response"
    ],
    "phrases": [
      {
        "phrase_id": "thanksgiving-in-name-lord-001"
      },
      {
        "text": "."
      }
    ]
  },
  "thanksgiving-deacon-pray": {
    "speaker": "role-deacon",
    "break_before": true,
    "tags": [
      "litany-of-thanksgiving"
    ],
    "phrases": [
      {
        "phrase_id": "thanksgiving-to-lord-pray-001"
      },
      {
        "text": "."
      }
    ]
  },
  "thanksgiving-choir-lord-have-mercy-3": {
    "speaker": "role-choir",
    "break_before": true,
    "tags": [
      "litany-of-thanksgiving",
      "response"
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
  "amvon-priest-prayer": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": [
      "prayer-behind-amvon"
    ],
    "phrases": [
      {
        "phrase_id": "amvon-lord-blesses-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "amvon-sanctifies-trust-001"
      },
      {
        "text": ". "
      },
      {
        "phrase_id": "amvon-save-people-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "amvon-bless-inheritance-001"
      },
      {
        "text": ". "
      },
      {
        "phrase_id": "amvon-preserve-fullness-001"
      },
      {
        "text": ". "
      },
      {
        "phrase_id": "amvon-sanctify-love-beauty-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "amvon-glorify-recompense-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "amvon-forsake-us-not-001"
      },
      {
        "text": ". "
      },
      {
        "phrase_id": "amvon-give-peace-world-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "amvon-peace-churches-priests-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "amvon-peace-authorities-001"
      },
      {
        "text": ". "
      },
      {
        "phrase_id": "amvon-good-giving-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "amvon-perfect-gift-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "amvon-from-above-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "amvon-father-lights-001"
      },
      {
        "text": ". "
      },
      {
        "phrase_id": "amvon-ascribe-glory-thanks-worship-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "amvon-father-son-spirit-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "amvon-now-ever-ages-001"
      },
      {
        "text": "."
      }
    ]
  },
  "amvon-choir-blessed-name": {
    "speaker": "role-choir",
    "break_before": true,
    "tags": [
      "prayer-behind-amvon",
      "response"
    ],
    "phrases": [
      {
        "phrase_id": "amen-001"
      },
      {
        "text": ". "
      },
      {
        "phrase_id": "amvon-blessed-name-lord-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "amvon-henceforth-forever-001"
      },
      {
        "text": ". "
      },
      {
        "phrase_id": "amvon-rubric-thrice-001"
      }
    ]
  },
  "amvon-priest-fulfillment-quiet": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": [
      "prayer-behind-amvon",
      "quiet"
    ],
    "phrases": [
      {
        "phrase_id": "amvon-christ-our-god-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "amvon-fulfillment-law-prophets-001"
      },
      {
        "text": "،"
      }
    ]
  },
  "amvon-priest-fulfillment-aloud": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": [
      "prayer-behind-amvon"
    ],
    "phrases": [
      {
        "phrase_id": "amvon-dispensation-father-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "amvon-fill-hearts-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "amvon-every-time-now-ever-001"
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
  "amvon-deacon-pray": {
    "speaker": "role-deacon",
    "break_before": true,
    "tags": [
      "prayer-behind-amvon"
    ],
    "phrases": [
      {
        "phrase_id": "amvon-to-lord-pray-001"
      },
      {
        "text": "."
      }
    ]
  },
  "amvon-choir-lord-have-mercy": {
    "speaker": "role-choir",
    "break_before": true,
    "tags": [
      "prayer-behind-amvon",
      "response"
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
  "amvon-priest-blessing": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": [
      "prayer-behind-amvon"
    ],
    "phrases": [
      {
        "phrase_id": "amvon-blessing-lord-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "amvon-by-grace-love-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "amvon-every-time-now-ever-001"
      },
      {
        "text": "."
      }
    ]
  },
  "amvon-choir-amen": {
    "speaker": "role-choir",
    "break_before": true,
    "tags": [
      "prayer-behind-amvon",
      "response"
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
  "amvon-priest-glory": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": [
      "prayer-behind-amvon"
    ],
    "phrases": [
      {
        "phrase_id": "amvon-glory-christ-hope-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "amvon-our-hope-glory-001"
      },
      {
        "text": "."
      }
    ]
  },
  "amvon-choir-glory-father": {
    "speaker": "role-choir",
    "break_before": true,
    "tags": [
      "prayer-behind-amvon",
      "response"
    ],
    "phrases": [
      {
        "phrase_id": "amvon-glory-father-son-spirit-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "amvon-now-ever-amen-001"
      },
      {
        "text": ". "
      },
      {
        "phrase_id": "lord-have-mercy-001"
      },
      {
        "text": ". "
      },
      {
        "phrase_id": "amvon-rubric-thrice-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "amvon-father-bless-001"
      },
      {
        "text": "."
      }
    ]
  },
  "dismissal-priest-main": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": [
      "dismissal"
    ],
    "phrases": [
      {
        "phrase_id": "dismissal-christ-true-god-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "dismissal-rubric-appointed-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "dismissal-mother-intercessions-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "dismissal-mother-pure-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "dismissal-cross-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "dismissal-heavenly-powers-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "dismissal-bodiless-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "dismissal-forerunner-prophet-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "dismissal-john-baptist-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "dismissal-apostles-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "dismissal-all-laudable-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "dismissal-martyrs-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "dismissal-victorious-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "dismissal-godbearing-fathers-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "dismissal-john-chrysostom-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "dismissal-constantinople-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "dismissal-author-service-001"
      },
      {
        "text": "، ("
      },
      {
        "phrase_id": "dismissal-rubric-and-saint-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "dismissal-rubric-so-and-so-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "dismissal-rubric-patron-001"
      },
      {
        "text": ") "
      },
      {
        "phrase_id": "dismissal-joachim-anna-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "dismissal-grandparents-001"
      },
      {
        "text": "، ("
      },
      {
        "phrase_id": "dismissal-rubric-and-day-saint-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "dismissal-rubric-so-and-so-001"
      },
      {
        "text": ") "
      },
      {
        "phrase_id": "dismissal-day-memory-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "dismissal-all-saints-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "dismissal-have-mercy-save-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "dismissal-good-lover-001"
      },
      {
        "text": "."
      }
    ]
  },
  "dismissal-priest-fathers": {
    "speaker": "role-priest",
    "break_before": true,
    "tags": [
      "dismissal"
    ],
    "phrases": [
      {
        "phrase_id": "dismissal-prayers-fathers-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "dismissal-lord-jesus-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "dismissal-have-mercy-save-001"
      },
      {
        "text": "."
      }
    ]
  },
  "dismissal-choir-amen": {
    "speaker": "role-choir",
    "break_before": true,
    "tags": [
      "dismissal",
      "response"
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
  "thanksgiving-first-prayer-glory": {
    "break_before": true,
    "tags": [
      "thanksgiving-prayers",
      "first-prayer"
    ],
    "phrases": [
      {
        "phrase_id": "thanksgiving-after-communion-glory-001"
      },
      {
        "text": ". "
      },
      {
        "phrase_id": "thanksgiving-after-communion-thrice-001"
      }
    ]
  },
  "thanksgiving-first-prayer-author": {
    "break_before": true,
    "tags": [
      "thanksgiving-prayers",
      "first-prayer",
      "rubric"
    ],
    "phrases": [
      {
        "phrase_id": "thanksgiving-first-prayer-author-001"
      }
    ]
  },
  "thanksgiving-first-prayer": {
    "break_before": true,
    "tags": [
      "thanksgiving-prayers",
      "first-prayer"
    ],
    "phrases": [
      {"phrase_id": "thanksgiving-first-thank-lord-001"},
      {"text": "، "},
      {"phrase_id": "thanksgiving-first-not-rejected-001"},
      {"text": "، "},
      {"phrase_id": "thanksgiving-first-made-communicant-001"},
      {"text": ". "},
      {"phrase_id": "thanksgiving-first-thank-worthy-001"},
      {"text": "، "},
      {"phrase_id": "thanksgiving-first-unworthy-001"},
      {"text": "، "},
      {"phrase_id": "thanksgiving-first-partake-gifts-001"},
      {"text": ". "},
      {"phrase_id": "thanksgiving-first-master-lover-001"},
      {"text": "، "},
      {"phrase_id": "thanksgiving-first-died-risen-001"},
      {"text": "، "},
      {"phrase_id": "thanksgiving-first-gave-mysteries-001"},
      {"text": "، "},
      {"phrase_id": "thanksgiving-first-benefit-sanctification-001"},
      {"text": ". "},
      {"phrase_id": "thanksgiving-first-grant-healing-001"},
      {"text": "، "},
      {"phrase_id": "thanksgiving-first-avert-adverse-001"},
      {"text": "، "},
      {"phrase_id": "thanksgiving-first-enlighten-heart-001"},
      {"text": "، "},
      {"phrase_id": "thanksgiving-first-peace-powers-001"},
      {"text": "، "},
      {"phrase_id": "thanksgiving-first-faith-unashamed-001"},
      {"text": "، "},
      {"phrase_id": "thanksgiving-first-love-unfeigned-001"},
      {"text": "، "},
      {"phrase_id": "thanksgiving-first-wisdom-001"},
      {"text": "، "},
      {"phrase_id": "thanksgiving-first-commandments-001"},
      {"text": "، "},
      {"phrase_id": "thanksgiving-first-increase-grace-001"},
      {"text": "، "},
      {"phrase_id": "thanksgiving-first-kingdom-001"},
      {"text": ". "},
      {"phrase_id": "thanksgiving-first-preserved-holiness-001"},
      {"text": "، "},
      {"phrase_id": "thanksgiving-first-remember-grace-001"},
      {"text": "، "},
      {"phrase_id": "thanksgiving-first-not-self-001"},
      {"text": "، "},
      {"phrase_id": "thanksgiving-first-for-thee-001"},
      {"text": ". "},
      {"phrase_id": "thanksgiving-first-depart-world-001"},
      {"text": "، "},
      {"phrase_id": "thanksgiving-first-hope-life-001"},
      {"text": "، "},
      {"phrase_id": "thanksgiving-first-attain-rest-001"},
      {"text": "، "},
      {"phrase_id": "thanksgiving-first-festal-sound-001"},
      {"text": "، "},
      {"phrase_id": "thanksgiving-first-delight-beholding-001"},
      {"text": ". "},
      {"phrase_id": "thanksgiving-first-true-desire-001"},
      {"text": " "},
      {"phrase_id": "thanksgiving-first-joy-lovers-001"},
      {"text": "، "},
      {"phrase_id": "thanksgiving-first-christ-god-001"},
      {"text": "، "},
      {"phrase_id": "thanksgiving-first-creation-hymns-001"},
      {"text": ". "},
      {"phrase_id": "amen-001"},
      {"text": "."}
    ]
  },
  "thanksgiving-second-prayer-author": {
    "break_before": true,
    "tags": [
      "thanksgiving-prayers",
      "second-prayer",
      "rubric"
    ],
    "phrases": [
      {
        "phrase_id": "thanksgiving-second-prayer-author-001"
      }
    ]
  },
  "thanksgiving-second-prayer": {
    "break_before": true,
    "tags": [
      "thanksgiving-prayers",
      "second-prayer"
    ],
    "phrases": [
      {"phrase_id": "thanksgiving-second-master-christ-001"},
      {"text": "، "},
      {"phrase_id": "thanksgiving-second-king-creator-001"},
      {"text": ". "},
      {"phrase_id": "thanksgiving-second-thank-good-things-001"},
      {"text": " "},
      {"phrase_id": "thanksgiving-second-bestowed-partaking-001"},
      {"text": " "},
      {"phrase_id": "thanksgiving-second-mysteries-001"},
      {"text": ". "},
      {"phrase_id": "thanksgiving-second-pray-good-lover-001"},
      {"text": "، "},
      {"phrase_id": "thanksgiving-second-keep-protection-001"},
      {"text": " "},
      {"phrase_id": "thanksgiving-second-shadow-wings-001"},
      {"text": ". "},
      {"phrase_id": "thanksgiving-second-pure-conscience-001"},
      {"text": " "},
      {"phrase_id": "thanksgiving-second-last-breath-001"},
      {"text": " "},
      {"phrase_id": "thanksgiving-second-worthily-remission-001"},
      {"text": " "},
      {"phrase_id": "thanksgiving-second-life-everlasting-001"},
      {"text": ". "},
      {"phrase_id": "thanksgiving-second-bread-life-001"},
      {"text": " "},
      {"phrase_id": "thanksgiving-second-fount-holiness-001"},
      {"text": " "},
      {"phrase_id": "thanksgiving-second-giver-good-things-001"},
      {"text": ". "},
      {"phrase_id": "thanksgiving-second-ascribe-glory-001"},
      {"text": " "},
      {"phrase_id": "thanksgiving-second-with-father-spirit-001"},
      {"text": "، "},
      {"phrase_id": "thanksgiving-second-now-ever-001"},
      {"text": ". "},
      {"phrase_id": "amen-001"},
      {"text": "."}
    ]
  },
  "thanksgiving-third-prayer-author": {
    "break_before": true,
    "tags": [
      "thanksgiving-prayers",
      "third-prayer",
      "rubric"
    ],
    "phrases": [
      {
        "phrase_id": "thanksgiving-third-prayer-author-001"
      }
    ]
  },
  "thanksgiving-third-prayer": {
    "break_before": true,
    "tags": [
      "thanksgiving-prayers",
      "third-prayer"
    ],
    "phrases": [
      {"phrase_id": "thanksgiving-third-gives-flesh-001"},
      {"text": ". "},
      {"phrase_id": "thanksgiving-third-fire-unworthy-001"},
      {"text": "، "},
      {"phrase_id": "thanksgiving-third-do-not-burn-001"},
      {"text": "، "},
      {"phrase_id": "thanksgiving-third-pass-through-001"},
      {"text": " "},
      {"phrase_id": "thanksgiving-third-members-heart-001"},
      {"text": ". "},
      {"phrase_id": "thanksgiving-third-burn-thorns-001"},
      {"text": ". "},
      {"phrase_id": "thanksgiving-third-cleanse-soul-001"},
      {"text": "، "},
      {"phrase_id": "thanksgiving-third-sanctify-mind-001"},
      {"text": "، "},
      {"phrase_id": "thanksgiving-third-strengthen-bones-001"},
      {"text": ". "},
      {"phrase_id": "thanksgiving-third-enlighten-senses-001"},
      {"text": "، "},
      {"phrase_id": "thanksgiving-third-nail-fear-001"},
      {"text": ". "},
      {"phrase_id": "thanksgiving-third-shelter-always-001"},
      {"text": "، "},
      {"phrase_id": "thanksgiving-third-guard-keep-001"},
      {"text": " "},
      {"phrase_id": "thanksgiving-third-soul-corrupting-001"},
      {"text": ". "},
      {"phrase_id": "thanksgiving-third-cleanse-purify-001"},
      {"text": " "},
      {"phrase_id": "thanksgiving-third-correct-walk-001"},
      {"text": ". "},
      {"phrase_id": "thanksgiving-third-adorn-teach-enlighten-001"},
      {"text": "، "},
      {"phrase_id": "thanksgiving-third-dwelling-spirit-001"},
      {"text": "، "},
      {"phrase_id": "thanksgiving-third-not-dwelling-sin-001"},
      {"text": ". "},
      {"phrase_id": "thanksgiving-third-house-for-thee-001"},
      {"text": "، "},
      {"phrase_id": "thanksgiving-third-entry-communion-001"},
      {"text": "، "},
      {"phrase_id": "thanksgiving-third-evil-flee-001"},
      {"text": " "},
      {"phrase_id": "thanksgiving-third-as-from-fire-001"},
      {"text": ". "},
      {"phrase_id": "thanksgiving-third-present-intercessors-001"},
      {"text": "، "},
      {"phrase_id": "thanksgiving-third-bodiless-leaders-001"},
      {"text": "، "},
      {"phrase_id": "thanksgiving-third-forerunner-apostles-001"},
      {"text": " "},
      {"phrase_id": "thanksgiving-third-pure-mother-001"},
      {"text": ". "},
      {"phrase_id": "thanksgiving-third-receive-prayers-001"},
      {"text": "، "},
      {"phrase_id": "thanksgiving-third-compassionate-001"},
      {"text": ". "},
      {"phrase_id": "thanksgiving-third-child-light-001"},
      {"text": ". "},
      {"phrase_id": "thanksgiving-third-sanctification-001"},
      {"text": " "},
      {"phrase_id": "thanksgiving-third-radiance-001"},
      {"text": ". "},
      {"phrase_id": "thanksgiving-third-ascribe-glory-001"},
      {"text": "، "},
      {"phrase_id": "thanksgiving-third-fitting-master-god-001"},
      {"text": "."}
    ]
  },
  "thanksgiving-fourth-prayer-author": {
    "break_before": true,
    "tags": [
      "thanksgiving-prayers",
      "fourth-prayer",
      "rubric"
    ],
    "phrases": [
      {
        "phrase_id": "thanksgiving-fourth-prayer-author-001"
      }
    ]
  },
  "thanksgiving-fourth-prayer": {
    "break_before": true,
    "tags": [
      "thanksgiving-prayers",
      "fourth-prayer"
    ],
    "phrases": [
      {"phrase_id": "thanksgiving-fourth-body-life-001"},
      {"text": "، "},
      {"phrase_id": "thanksgiving-fourth-body-life-002"},
      {"text": " "},
      {"phrase_id": "thanksgiving-fourth-blood-remission-001"},
      {"text": "، "},
      {"phrase_id": "thanksgiving-fourth-eucharist-joy-001"},
      {"text": ". "},
      {"phrase_id": "thanksgiving-fourth-second-coming-001"},
      {"text": "، "},
      {"phrase_id": "thanksgiving-fourth-right-hand-001"},
      {"text": " "},
      {"phrase_id": "thanksgiving-fourth-fearful-coming-001"},
      {"text": "، "},
      {"phrase_id": "thanksgiving-fourth-mother-saints-001"},
      {"text": ". "},
      {"phrase_id": "amen-001"},
      {"text": "."}
    ]
  },
  "thanksgiving-fifth-prayer-author": {
    "break_before": true,
    "tags": [
      "thanksgiving-prayers",
      "fifth-prayer",
      "rubric"
    ],
    "phrases": [
      {
        "phrase_id": "thanksgiving-fifth-prayer-author-001"
      }
    ]
  },
  "thanksgiving-fifth-prayer": {
    "break_before": true,
    "tags": [
      "thanksgiving-prayers",
      "fifth-prayer"
    ],
    "phrases": [
      {"phrase_id": "thanksgiving-fifth-all-holy-lady-001"},
      {"text": "، "},
      {"phrase_id": "thanksgiving-fifth-light-soul-001"},
      {"text": "، "},
      {"phrase_id": "thanksgiving-fifth-hope-shelter-001"},
      {"text": "، "},
      {"phrase_id": "thanksgiving-fifth-consolation-joy-001"},
      {"text": ". "},
      {"phrase_id": "thanksgiving-fifth-thank-worthy-001"},
      {"text": "، "},
      {"phrase_id": "thanksgiving-fifth-unworthy-partaker-001"},
      {"text": "، "},
      {"phrase_id": "thanksgiving-fifth-partaker-body-blood-001"},
      {"text": ". "},
      {"phrase_id": "thanksgiving-fifth-bore-light-001"},
      {"text": "، "},
      {"phrase_id": "thanksgiving-fifth-enlighten-eyes-heart-001"},
      {"text": ". "},
      {"phrase_id": "thanksgiving-fifth-bore-fountain-001"},
      {"text": "، "},
      {"phrase_id": "thanksgiving-fifth-enliven-dead-001"},
      {"text": ". "},
      {"phrase_id": "thanksgiving-fifth-mother-merciful-god-001"},
      {"text": "، "},
      {"phrase_id": "thanksgiving-fifth-have-mercy-001"},
      {"text": "، "},
      {"phrase_id": "thanksgiving-fifth-humble-mind-001"},
      {"text": "، "},
      {"phrase_id": "thanksgiving-fifth-recall-thoughts-001"},
      {"text": ". "},
      {"phrase_id": "thanksgiving-fifth-worthy-without-condemnation-001"},
      {"text": "، "},
      {"phrase_id": "thanksgiving-fifth-last-breath-001"},
      {"text": "، "},
      {"phrase_id": "thanksgiving-fifth-sanctification-mysteries-001"},
      {"text": "، "},
      {"phrase_id": "thanksgiving-fifth-healing-soul-body-001"},
      {"text": ". "},
      {"phrase_id": "thanksgiving-fifth-tears-repentance-001"},
      {"text": "، "},
      {"phrase_id": "thanksgiving-fifth-hymn-glorify-001"},
      {"text": ". "},
      {"phrase_id": "thanksgiving-fifth-blessed-glorified-001"},
      {"text": ". "},
      {"phrase_id": "amen-001"},
      {"text": ". "},
      {"phrase_id": "thanksgiving-after-communion-thrice-001"}
    ]
  },
  "departed-trisagion-troparia-rubric": {
    "break_before": true,
    "tags": [
      "departed",
      "rubric"
    ],
    "phrases": [
      {"phrase_id": "departed-troparia-rubric-001"},
      {"text": "."}
    ]
  },
  "departed-trisagion-troparion-savior": {
    "break_before": true,
    "speaker": "role-choir",
    "tags": [
      "departed"
    ],
    "phrases": [
      {"phrase_id": "departed-savior-rest-001"},
      {"text": "، "},
      {"phrase_id": "departed-savior-rest-002"},
      {"text": " "},
      {"phrase_id": "departed-righteous-spirits-001"},
      {"text": ". "},
      {"phrase_id": "departed-preserve-blessed-life-001"},
      {"text": "، "},
      {"phrase_id": "departed-with-thee-001"},
      {"text": " "},
      {"phrase_id": "departed-lover-mankind-001"},
      {"text": "."}
    ]
  },
  "departed-trisagion-troparion-rest": {
    "break_before": true,
    "speaker": "role-choir",
    "tags": [
      "departed"
    ],
    "phrases": [
      {"phrase_id": "departed-place-rest-001"},
      {"text": "، "},
      {"phrase_id": "departed-saints-repose-001"},
      {"text": "، "},
      {"phrase_id": "departed-only-immortal-001"},
      {"text": "."}
    ]
  },
  "departed-trisagion-glory": {
    "break_before": true,
    "speaker": "role-choir",
    "tags": [
      "departed",
      "doxology"
    ],
    "phrases": [
      {"phrase_id": "departed-glory-trinity-001"},
      {"text": "."}
    ]
  },
  "departed-trisagion-troparion-hades": {
    "break_before": true,
    "speaker": "role-choir",
    "tags": [
      "departed"
    ],
    "phrases": [
      {"phrase_id": "departed-god-descended-hades-001"},
      {"text": "، "},
      {"phrase_id": "departed-loosed-bonds-001"},
      {"text": ". "},
      {"phrase_id": "departed-thyself-rest-001"},
      {"text": "، "},
      {"phrase_id": "departed-rest-servant-reposed-001"},
      {"text": "."}
    ]
  },
  "departed-trisagion-both-now": {
    "break_before": true,
    "speaker": "role-choir",
    "tags": [
      "departed",
      "doxology"
    ],
    "phrases": [
      {"phrase_id": "departed-both-now-001"},
      {"text": ". "},
      {"phrase_id": "amen-001"},
      {"text": "."}
    ]
  },
  "departed-trisagion-theotokos": {
    "break_before": true,
    "speaker": "role-choir",
    "tags": [
      "departed",
      "theotokos"
    ],
    "phrases": [
      {"phrase_id": "departed-virgin-pure-001"},
      {"text": "، "},
      {"phrase_id": "departed-birth-without-seed-001"},
      {"text": "، "},
      {"phrase_id": "departed-intercede-souls-001"},
      {"text": " "},
      {"phrase_id": "departed-theotokos-servant-001"},
      {"text": "."}
    ]
  },
  "departed-trisagion-censer-rubric": {
    "break_before": true,
    "tags": [
      "departed",
      "rubric"
    ],
    "phrases": [
      {"phrase_id": "departed-censer-rubric-001"},
      {"text": ":"}
    ]
  },
  "departed-trisagion-deacon-mercy": {
    "break_before": true,
    "speaker": "role-deacon",
    "tags": [
      "departed",
      "litany"
    ],
    "phrases": [
      {"phrase_id": "departed-have-mercy-god-001"},
      {"text": "، "},
      {"phrase_id": "departed-great-mercy-001"},
      {"text": "، "},
      {"phrase_id": "departed-hearken-mercy-001"},
      {"text": "."}
    ]
  },
  "departed-trisagion-choir-lord-have-mercy-thrice": {
    "speaker": "role-choir",
    "tags": [
      "departed",
      "response"
    ],
    "phrases": [
      {"phrase_id": "lord-have-mercy-001"},
      {"text": ". "},
      {"phrase_id": "thanksgiving-after-communion-thrice-001"}
    ]
  },
  "departed-trisagion-deacon-again": {
    "break_before": true,
    "speaker": "role-deacon",
    "tags": [
      "departed",
      "litany"
    ],
    "phrases": [
      {"phrase_id": "departed-again-repose-001"},
      {"text": " "},
      {"phrase_id": "departed-servants-names-001"},
      {"text": "، "},
      {"phrase_id": "departed-pardon-sins-001"},
      {"text": " "},
      {"phrase_id": "departed-voluntary-involuntary-001"},
      {"text": "."}
    ]
  },
  "departed-trisagion-deacon-establish": {
    "break_before": true,
    "speaker": "role-deacon",
    "tags": [
      "departed",
      "litany"
    ],
    "phrases": [
      {"phrase_id": "departed-establish-soul-001"},
      {"text": " "},
      {"phrase_id": "departed-where-just-repose-001"},
      {"text": "."}
    ]
  },
  "departed-trisagion-deacon-mercies": {
    "break_before": true,
    "speaker": "role-deacon",
    "tags": [
      "departed",
      "litany"
    ],
    "phrases": [
      {"phrase_id": "departed-mercies-kingdom-001"},
      {"text": "، "},
      {"phrase_id": "departed-remission-christ-001"},
      {"text": "، "},
      {"phrase_id": "departed-king-god-001"},
      {"text": "."}
    ]
  },
  "departed-trisagion-choir-grant-this": {
    "speaker": "role-choir",
    "tags": [
      "departed",
      "response"
    ],
    "phrases": [
      {"phrase_id": "departed-grant-this-001"},
      {"text": "."}
    ]
  },
  "departed-trisagion-deacon-let-us-pray": {
    "speaker": "role-deacon",
    "tags": [
      "departed",
      "litany"
    ],
    "phrases": [
      {"phrase_id": "petition-001"},
      {"text": "."}
    ]
  },
  "departed-trisagion-choir-lord-have-mercy": {
    "speaker": "role-choir",
    "tags": [
      "departed",
      "response"
    ],
    "phrases": [
      {"phrase_id": "lord-have-mercy-001"},
      {"text": "."}
    ]
  },
  "departed-trisagion-priest-prayer": {
    "break_before": true,
    "speaker": "role-priest",
    "tags": [
      "departed",
      "priest-prayer"
    ],
    "phrases": [
      {"phrase_id": "departed-priest-god-spirits-001"},
      {"text": "، "},
      {"phrase_id": "departed-trampled-death-001"},
      {"text": "، "},
      {"phrase_id": "departed-destroyed-devil-001"},
      {"text": "، "},
      {"phrase_id": "departed-given-life-world-001"},
      {"text": ". "},
      {"phrase_id": "departed-priest-rest-servants-001"},
      {"text": " "},
      {"phrase_id": "departed-formerly-reposed-001"},
      {"text": "، "},
      {"phrase_id": "departed-place-bright-001"},
      {"text": "، "},
      {"phrase_id": "departed-place-green-001"},
      {"text": "، "},
      {"phrase_id": "departed-place-repose-001"},
      {"text": "، "},
      {"phrase_id": "departed-no-sickness-001"},
      {"text": ". "},
      {"phrase_id": "departed-good-lover-001"},
      {"text": "، "},
      {"phrase_id": "departed-pardon-every-sin-001"},
      {"text": " "},
      {"phrase_id": "departed-committed-001"},
      {"text": " "},
      {"phrase_id": "departed-word-deed-thought-001"},
      {"text": "، "},
      {"phrase_id": "departed-no-man-without-sin-001"},
      {"text": "، "},
      {"phrase_id": "departed-only-without-sin-001"},
      {"text": "، "},
      {"phrase_id": "departed-righteousness-truth-001"},
      {"text": ". "},
      {"phrase_id": "departed-resurrection-life-repose-001"},
      {"text": " "},
      {"phrase_id": "departed-servant-repose-doxology-001"},
      {"text": "، "},
      {"phrase_id": "departed-christ-doxology-001"},
      {"text": "، "},
      {"phrase_id": "departed-raise-glory-father-001"},
      {"text": " "},
      {"phrase_id": "departed-spirit-doxology-001"},
      {"text": "، "},
      {"phrase_id": "departed-both-now-001"},
      {"text": "."}
    ]
  },
  "departed-trisagion-choir-amen": {
    "speaker": "role-choir",
    "tags": [
      "departed",
      "response"
    ],
    "phrases": [
      {"phrase_id": "amen-001"},
      {"text": "."}
    ]
  },
  "departed-trisagion-memory-eternal": {
    "break_before": true,
    "speaker": "role-choir",
    "tags": [
      "departed",
      "response"
    ],
    "phrases": [
      {"phrase_id": "departed-memory-eternal-001"},
      {"text": ". "},
      {"phrase_id": "thanksgiving-after-communion-thrice-001"}
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
