// Learning activity definitions.
// Activities describe how a learner practices reusable text, independent of course ordering.

const POC_MEDIA = {
  recording_id: "recording-g_4r4wzt2Vg",
  alignment_id: "alignment-great-compline-g_4r4wzt2Vg-poc-v1",
  default_playback_rate: 1
};

const PARAKLESIS_ST_MARINA_MEDIA = {
  recording_id: "recording-oLdHO28NWuM",
  alignment_id: "alignment-paraklesis-st-marina-oLdHO28NWuM-poc-v1",
  default_playback_rate: 1
};

export const activityDefinitions = [
  {
    "id": "activity-caption-poc-lord-have-mercy",
    "type": "listen-repeat",
    "title": "Listen & Repeat: Lord, have mercy",
    "target": {
      "segment_ids": [
        "course-lord-have-mercy-split"
      ]
    },
    "media": PARAKLESIS_ST_MARINA_MEDIA
  },
  {
    "id": "activity-demo-synced-caption-lord-have-mercy",
    "type": "synced-caption",
    "title": "Phrase Captions: Lord, have mercy",
    "target": {
      "segment_ids": [
        "course-lord-have-mercy-split"
      ]
    },
    "media": PARAKLESIS_ST_MARINA_MEDIA
  },
  {
    "id": "activity-demo-arrange-lord-have-mercy",
    "type": "arrange-cloze",
    "title": "Arrange: Lord, have mercy",
    "target": {
      "segment_ids": [
        "course-lord-have-mercy-split"
      ]
    },
    "cloze": {
      "phrase_ids": [
        "vocative-o-lord-001",
        "have-mercy-001"
      ]
    },
    "media": PARAKLESIS_ST_MARINA_MEDIA
  },
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
    "id": "activity-demo-synced-caption-glory-beginner",
    "type": "synced-caption",
    "title": "Phrase Captions: Glory",
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
    "id": "activity-demo-synced-caption-both-now-beginner",
    "type": "synced-caption",
    "title": "Phrase Captions: Both now",
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
    "id": "activity-demo-synced-caption-glory-both-now",
    "type": "synced-caption",
    "title": "Phrase Captions: Glory. Both now.",
    "target": {
      "segment_ids": [
        "course-glory-beginner",
        "course-both-now-beginner"
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
    "title": "Phrase Captions: Holy God",
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
    "id": "activity-demo-synced-caption-all-holy-trinity",
    "type": "synced-caption",
    "title": "Phrase Captions: All Holy Trinity",
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
    "id": "activity-demo-arrange-all-holy-trinity",
    "type": "arrange-cloze",
    "title": "Arrange: All Holy Trinity",
    "target": {
      "segment_ids": [
        "course-all-holy-trinity-address",
        "course-all-holy-trinity-lord",
        "course-all-holy-trinity-master",
        "course-all-holy-trinity-holy-one"
      ]
    },
    "cloze": {
      "phrase_ids": [
        "all-holy-trinity-001",
        "all-holy-trinity-have-mercy-001",
        "vocative-o-lord-001",
        "all-holy-trinity-cleanse-sins-001",
        "vocative-o-master-001",
        "all-holy-trinity-pardon-iniquities-001",
        "vocative-o-holy-one-001",
        "all-holy-trinity-visit-heal-001",
        "all-holy-trinity-name-sake-001"
      ]
    },
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
  }
];

const activities = Object.fromEntries(
  activityDefinitions.map(activity => [activity.id, activity])
);

export default activities;
