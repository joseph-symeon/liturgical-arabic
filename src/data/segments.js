function phraseParts(parts) {
  return parts.map((part, index) => ({
    ...part,
    display_order: index + 1
  }));
}

const sourceSegments = {
  "litany-peace-in-peace": {
    "speaker": "role-deacon",
    "phrases": [
      {
        "phrase_id": "peace-001"
      }
    ]
  },
  "litany-peace-let-us-pray": {
    "speaker": "role-deacon",
    "phrases": [
      {
        "phrase_id": "petition-001"
      }
    ]
  },
  "litany-peace-lord-have-mercy-choir": {
    "speaker": "role-choir",
    "phrases": [
      {
        "phrase_id": "lord-have-mercy-001"
      }
    ]
  },
  "litany-peace-from-above": {
    "speaker": "role-deacon",
    "break_before": true,
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
    "phrases": [
      {
        "phrase_id": "holy-house-001"
      },
      {
        "text": "، "
      },
      {
        "phrase_id": "enter-with-faith-001"
      },
      {
        "text": "،"
      }
    ]
  },
  "litany-peace-help-save": {
    "speaker": "role-deacon",
    "phrases": [
      {
        "phrase_id": "help-save-001"
      }
    ]
  },
  "litany-peace-lord-have-mercy-all": {
    "speaker": "role-all",
    "phrases": [
      {
        "phrase_id": "lord-have-mercy-001"
      }
    ]
  },
  "antiphon-word-of-god-only-begotten": {
    "speaker": "role-all",
    "phrases": [
      {
        "phrase_id": "word-of-god-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "only-begotten-001"
      }
    ]
  },
  "antiphon-deathless": {
    "speaker": "role-all",
    "phrases": [
      {
        "phrase_id": "deathless-001"
      }
    ]
  },
  "antiphon-accepted-incarnate": {
    "speaker": "role-all",
    "phrases": [
      {
        "phrase_id": "accepted-incarnate-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "for-our-salvation-001"
      }
    ]
  },
  "antiphon-from-theotokos": {
    "speaker": "role-all",
    "phrases": [
      {
        "phrase_id": "from-theotokos-001"
      },
      {
        "text": " "
      },
      {
        "phrase_id": "ever-virgin-mary-001"
      }
    ]
  },
  "antiphon-became-man": {
    "speaker": "role-all",
    "phrases": [
      {
        "phrase_id": "became-man-001"
      }
    ]
  },
  "antiphon-crucified": {
    "speaker": "role-all",
    "phrases": [
      {
        "phrase_id": "crucified-001"
      }
    ]
  },
  "antiphon-trampled-death": {
    "speaker": "role-all",
    "phrases": [
      {
        "phrase_id": "trampled-death-001"
      }
    ]
  },
  "antiphon-one-of-trinity": {
    "speaker": "role-all",
    "phrases": [
      {
        "phrase_id": "one-of-trinity-001"
      }
    ]
  },
  "antiphon-glorified-with-father": {
    "speaker": "role-all",
    "phrases": [
      {
        "phrase_id": "glorified-with-father-001"
      }
    ]
  },
  "antiphon-save-us": {
    "speaker": "role-all",
    "phrases": [
      {
        "phrase_id": "save-us-001"
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
