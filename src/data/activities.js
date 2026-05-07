// Learning activity definitions.
// Activities describe how a learner practices reusable text, independent of course ordering.

const POC_MEDIA = {
  recording_id: "recording-more-honorable-cyFH8CZASSk",
  alignment_id: "alignment-more-honorable-course-poc-v1",
  default_playback_rate: 1
};

export const activityDefinitions = [
  {
    "id": "activity-caption-poc-glory-beginner",
    "type": "listen-repeat",
    "target": {
      "segment_ids": [
        "course-glory-beginner"
      ]
    },
    "media": POC_MEDIA
  },
  {
    "id": "activity-caption-poc-both-now-beginner",
    "type": "listen-repeat",
    "target": {
      "segment_ids": [
        "course-both-now-beginner"
      ]
    },
    "media": POC_MEDIA
  },
  {
    "id": "activity-caption-poc-glory-both-now-beginner",
    "type": "listen-repeat",
    "target": {
      "segment_ids": [
        "course-glory-beginner",
        "course-both-now-beginner"
      ]
    },
    "media": POC_MEDIA
  },
  {
    "id": "activity-caption-poc-trisagion-hymn-core",
    "type": "listen-repeat",
    "target": {
      "segment_ids": [
        "course-trisagion-holy-god",
        "course-trisagion-holy-mighty",
        "course-trisagion-holy-immortal",
        "course-trisagion-have-mercy"
      ]
    },
    "media": POC_MEDIA
  },
  {
    "id": "activity-demo-listen-repeat-holy-god",
    "type": "listen-repeat",
    "title": "Listen & Repeat: Holy God",
    "target": {
      "segment_ids": [
        "course-trisagion-holy-god",
        "course-trisagion-holy-mighty",
        "course-trisagion-holy-immortal",
        "course-trisagion-have-mercy"
      ]
    },
    "media": POC_MEDIA
  },
  {
    "id": "activity-demo-listen-recall-holy-god",
    "type": "listen-recall",
    "title": "Recall: Holy God",
    "target": {
      "segment_ids": [
        "course-trisagion-holy-god",
        "course-trisagion-holy-mighty",
        "course-trisagion-holy-immortal",
        "course-trisagion-have-mercy"
      ]
    },
    "media": POC_MEDIA
  },
  {
    "id": "activity-demo-cloze-holy-god",
    "type": "arrange-cloze",
    "title": "Arrange: Holy God",
    "target": {
      "segment_ids": [
        "course-trisagion-holy-god",
        "course-trisagion-holy-mighty",
        "course-trisagion-holy-immortal",
        "course-trisagion-have-mercy"
      ]
    },
    "cloze": {
      "phrase_ids": [
        "holy-god-001",
        "holy-mighty-001",
        "holy-immortal-001",
        "have-mercy-on-us-001"
      ]
    },
    "media": POC_MEDIA
  },
  {
    "id": "activity-demo-synced-caption-holy-god",
    "type": "synced-caption",
    "title": "Synced Caption: Holy God",
    "target": {
      "segment_ids": [
        "course-trisagion-holy-god",
        "course-trisagion-holy-mighty",
        "course-trisagion-holy-immortal",
        "course-trisagion-have-mercy"
      ]
    },
    "captions": [
      {
        "phrase_id": "holy-god-001",
        "start_seconds": 363.24,
        "end_seconds": 365.12
      },
      {
        "phrase_id": "holy-mighty-001",
        "start_seconds": 365.12,
        "end_seconds": 366.36
      },
      {
        "phrase_id": "holy-immortal-001",
        "start_seconds": 366.36,
        "end_seconds": 367.88
      },
      {
        "phrase_id": "have-mercy-on-us-001",
        "start_seconds": 367.88,
        "end_seconds": 368.2
      }
    ],
    "sync_lead_seconds": 0.08,
    "media": POC_MEDIA
  },
  {
    "id": "activity-demo-synced-caption-all-holy-trinity",
    "type": "synced-caption",
    "title": "Synced Caption: All Holy Trinity",
    "target": {
      "segment_ids": [
        "course-all-holy-trinity-address",
        "course-all-holy-trinity-lord",
        "course-all-holy-trinity-master",
        "course-all-holy-trinity-holy-one"
      ]
    },
    "captions": [
      {
        "phrase_id": "all-holy-trinity-001",
        "start_seconds": 387.199,
        "end_seconds": 388.919
      },
      {
        "phrase_id": "all-holy-trinity-have-mercy-001",
        "start_seconds": 388.919,
        "end_seconds": 390.12
      },
      {
        "phrase_id": "vocative-o-lord-001",
        "start_seconds": 390.12,
        "end_seconds": 390.759
      },
      {
        "phrase_id": "all-holy-trinity-cleanse-sins-001",
        "start_seconds": 390.759,
        "end_seconds": 392.56
      },
      {
        "phrase_id": "vocative-o-master-001",
        "start_seconds": 392.56,
        "end_seconds": 393.639
      },
      {
        "phrase_id": "all-holy-trinity-pardon-iniquities-001",
        "start_seconds": 393.639,
        "end_seconds": 396.16
      },
      {
        "phrase_id": "vocative-o-holy-one-001",
        "start_seconds": 396.16,
        "end_seconds": 397.24
      },
      {
        "phrase_id": "all-holy-trinity-visit-heal-001",
        "start_seconds": 397.24,
        "end_seconds": 399.639
      },
      {
        "phrase_id": "all-holy-trinity-name-sake-001",
        "start_seconds": 399.639,
        "end_seconds": 401.09
      }
    ],
    "sync_lead_seconds": 0.08,
    "media": POC_MEDIA
  },
  {
    "id": "activity-caption-poc-all-holy-trinity-address",
    "type": "listen-repeat",
    "target": {
      "segment_ids": [
        "course-all-holy-trinity-address"
      ]
    },
    "media": POC_MEDIA
  },
  {
    "id": "activity-caption-poc-all-holy-trinity-lord",
    "type": "listen-repeat",
    "target": {
      "segment_ids": [
        "course-all-holy-trinity-lord"
      ]
    },
    "media": POC_MEDIA
  },
  {
    "id": "activity-caption-poc-all-holy-trinity-master",
    "type": "listen-repeat",
    "target": {
      "segment_ids": [
        "course-all-holy-trinity-master"
      ]
    },
    "media": POC_MEDIA
  },
  {
    "id": "activity-caption-poc-all-holy-trinity-holy-one",
    "type": "listen-repeat",
    "target": {
      "segment_ids": [
        "course-all-holy-trinity-holy-one"
      ]
    },
    "media": POC_MEDIA
  },
  {
    "id": "activity-caption-poc-all-holy-trinity",
    "type": "listen-repeat",
    "target": {
      "segment_ids": [
        "course-all-holy-trinity-address",
        "course-all-holy-trinity-lord",
        "course-all-holy-trinity-master",
        "course-all-holy-trinity-holy-one"
      ]
    },
    "media": POC_MEDIA
  },
  {
    "id": "activity-demo-all-holy-trinity-sequence",
    "type": "listen-repeat-sequence",
    "title": "Step Practice: All Holy Trinity",
    "steps": [
      {
        "title": "Address",
        "segment_ids": [
          "course-all-holy-trinity-address"
        ]
      },
      {
        "title": "Lord",
        "segment_ids": [
          "course-all-holy-trinity-lord"
        ]
      },
      {
        "title": "Master",
        "segment_ids": [
          "course-all-holy-trinity-master"
        ]
      },
      {
        "title": "Holy One",
        "segment_ids": [
          "course-all-holy-trinity-holy-one"
        ]
      }
    ],
    "target": {
      "segment_ids": [
        "course-all-holy-trinity-address",
        "course-all-holy-trinity-lord",
        "course-all-holy-trinity-master",
        "course-all-holy-trinity-holy-one"
      ]
    },
    "media": POC_MEDIA
  }
];

const activities = Object.fromEntries(
  activityDefinitions.map(activity => [activity.id, activity])
);

export default activities;
