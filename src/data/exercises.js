// Editable course exercise definitions.
// This file is not generated from CSV.

import segments from './segments.js';
import phrases from './phrases.js';
import captionTracks from './captionTracks.js';
import alignments from './alignments.js';
import activities from './activities.js';
import { deriveCaptionClip } from '../utils/captionClips.js';

export const exerciseDefinitions = [
  {
    "id": "antiphon-only-begotten",
    "segment_ids": [
      "antiphon-word-of-god-only-begotten",
      "antiphon-deathless"
    ],
    "audio_clip": {
      "video_id": "-dufaXx7Hm0",
      "start_seconds": 150.75,
      "end_seconds": 162.05,
      "default_playback_rate": 1
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
    "audio_clip": {
      "video_id": "-dufaXx7Hm0",
      "start_seconds": 151,
      "end_seconds": 180.5,
      "default_playback_rate": 1
    }
  },
  {
    "id": "antiphon-accepted-incarnate",
    "segment_ids": [
      "antiphon-accepted-incarnate",
      "antiphon-from-theotokos"
    ],
    "audio_clip": {
      "video_id": "-dufaXx7Hm0",
      "start_seconds": 151,
      "end_seconds": 180.5,
      "default_playback_rate": 1
    }
  },
  {
    "id": "antiphon-became-man",
    "segment_ids": [
      "antiphon-became-man",
      "antiphon-crucified"
    ],
    "audio_clip": {
      "video_id": "-dufaXx7Hm0",
      "start_seconds": 151,
      "end_seconds": 180.5,
      "default_playback_rate": 1
    }
  },
  {
    "id": "antiphon-trampled-death",
    "segment_ids": [
      "antiphon-trampled-death",
      "antiphon-one-of-trinity"
    ],
    "audio_clip": {
      "video_id": "-dufaXx7Hm0",
      "start_seconds": 151,
      "end_seconds": 180.5,
      "default_playback_rate": 1
    }
  },
  {
    "id": "antiphon-glorified-with-father",
    "segment_ids": [
      "antiphon-glorified-with-father",
      "antiphon-save-us"
    ],
    "audio_clip": {
      "video_id": "-dufaXx7Hm0",
      "start_seconds": 151,
      "end_seconds": 180.5,
      "default_playback_rate": 1
    }
  },
  {
    "id": "antiphons-summary",
    "segment_ids": [
      "first-antiphon-through-theotokos-1",
      "entrance-hymn-save-us-son-of-god",
      "course-entrance-hymn-risen-sundays",
      "course-entrance-hymn-wondrous-weekdays",
      "entrance-hymn-risen-alleluia",
      "antiphon-word-of-god-only-begotten",
      "antiphon-deathless",
      "antiphon-accepted-incarnate",
      "antiphon-from-theotokos",
      "antiphon-became-man",
      "antiphon-crucified",
      "antiphon-trampled-death",
      "antiphon-one-of-trinity",
      "antiphon-glorified-with-father",
      "antiphon-save-us"
    ],
    "audio_clip": {
      "video_id": "-dufaXx7Hm0",
      "start_seconds": 150.75,
      "end_seconds": 180.5,
      "default_playback_rate": 1
    }
  },
  {
    "id": "litany-peace-peace-from-above",
    "segment_ids": [
      "litany-peace-from-above"
    ],
    "audio_clip": {
      "video_id": "KJKt0V4zJjY",
      "start_seconds": 92.75,
      "end_seconds": 160,
      "default_playback_rate": 1
    }
  },
  {
    "id": "litany-peace-whole-world",
    "segment_ids": [
      "litany-peace-whole-world"
    ],
    "audio_clip": {
      "video_id": "KJKt0V4zJjY",
      "start_seconds": 92.75,
      "end_seconds": 160,
      "default_playback_rate": 1
    }
  },
  {
    "id": "litany-peace-holy-house",
    "segment_ids": [
      "litany-peace-holy-house"
    ],
    "audio_clip": {
      "video_id": "KJKt0V4zJjY",
      "start_seconds": 92.75,
      "end_seconds": 160,
      "default_playback_rate": 1
    }
  },
  {
    "id": "litany-peace-father-metropolitan",
    "segment_ids": [
      "litany-peace-father-metropolitan"
    ],
    "audio_clip": {
      "video_id": "KJKt0V4zJjY",
      "start_seconds": 92.75,
      "end_seconds": 160,
      "default_playback_rate": 1
    }
  },
  {
    "id": "litany-peace-country-authorities",
    "segment_ids": [
      "litany-peace-country-authorities"
    ],
    "audio_clip": {
      "video_id": "KJKt0V4zJjY",
      "start_seconds": 92.75,
      "end_seconds": 160,
      "default_playback_rate": 1
    }
  },
  {
    "id": "litany-peace-this-city",
    "segment_ids": [
      "litany-peace-this-city"
    ],
    "audio_clip": {
      "video_id": "KJKt0V4zJjY",
      "start_seconds": 92.75,
      "end_seconds": 160,
      "default_playback_rate": 1
    }
  },
  {
    "id": "litany-peace-healthful-seasons",
    "segment_ids": [
      "litany-peace-healthful-seasons"
    ],
    "audio_clip": {
      "video_id": "KJKt0V4zJjY",
      "start_seconds": 92.75,
      "end_seconds": 160,
      "default_playback_rate": 1
    }
  },
  {
    "id": "litany-peace-travelers",
    "segment_ids": [
      "litany-peace-travelers"
    ],
    "audio_clip": {
      "video_id": "KJKt0V4zJjY",
      "start_seconds": 92.75,
      "end_seconds": 160,
      "default_playback_rate": 1
    }
  },
  {
    "id": "litany-peace-deliverance",
    "segment_ids": [
      "litany-peace-deliverance"
    ],
    "audio_clip": {
      "video_id": "KJKt0V4zJjY",
      "start_seconds": 92.75,
      "end_seconds": 160,
      "default_playback_rate": 1
    }
  },
  {
    "id": "litany-peace-help-save",
    "segment_ids": [
      "litany-peace-help-save"
    ],
    "audio_clip": {
      "video_id": "KJKt0V4zJjY",
      "start_seconds": 92.75,
      "end_seconds": 160,
      "default_playback_rate": 1
    }
  },
  {
    "id": "litany-peace-priest-doxology",
    "segment_ids": [
      "litany-peace-priest-doxology"
    ],
    "audio_clip": {
      "video_id": "KJKt0V4zJjY",
      "start_seconds": 92.75,
      "end_seconds": 160,
      "default_playback_rate": 1
    }
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
    "show_speakers": true,
    "audio_clip": {
      "video_id": "KJKt0V4zJjY",
      "start_seconds": 92.75,
      "end_seconds": 160,
      "default_playback_rate": 1
    }
  },
  {
    "id": "entrance-bless-master",
    "segment_ids": [
      "entrance-bless-master"
    ],
    "audio_clip": null
  },
  {
    "id": "entrance-blessed-entrance",
    "segment_ids": [
      "entrance-blessed-entrance"
    ],
    "audio_clip": null
  },
  {
    "id": "entrance-wisdom-stand-upright",
    "segment_ids": [
      "entrance-wisdom-stand-upright",
      "entrance-hymn-come-worship"
    ],
    "audio_clip": null
  },
  {
    "id": "entrance-save-us-son-of-god",
    "segment_ids": [
      "entrance-hymn-save-us-son-of-god",
      "course-entrance-hymn-risen-sundays",
      "course-entrance-hymn-wondrous-weekdays",
      "entrance-hymn-risen-alleluia"
    ],
    "audio_clip": null
  },
  {
    "id": "entrance-holy-art-benediction",
    "segment_ids": [
      "entrance-hymn-holy-art-benediction",
      "entrance-hymn-deacon-ages",
      "entrance-hymn-final-amen"
    ],
    "audio_clip": null
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
    "show_speakers": true,
    "audio_clip": null
  },
  {
    "id": "preparation-glory",
    "segment_ids": [
      "preparation-glory-highest"
    ],
    "audio_clip": null
  },
  {
    "id": "preparation-open-my-lips",
    "segment_ids": [
      "preparation-open-my-lips"
    ],
    "audio_clip": null
  },
  {
    "id": "come-let-us-worship",
    "segment_ids": [
      "course-come-worship-god-king",
      "course-come-worship-christ-king",
      "course-come-worship-christ-himself"
    ],
    "audio_clip": null
  },
  {
    "id": "first-antiphon-through-theotokos",
    "segment_ids": [
      "first-antiphon-through-theotokos-1"
    ],
    "audio_clip": null
  },
  {
    "id": "little-litany-again",
    "segment_ids": [
      "little-litany-again"
    ],
    "audio_clip": null
  },
  {
    "id": "little-litany-help-save",
    "segment_ids": [
      "little-litany-help-save"
    ],
    "audio_clip": null
  },
  {
    "id": "little-litany-calling-remembrance",
    "segment_ids": [
      "little-litany-calling-remembrance"
    ],
    "audio_clip": null
  },
  {
    "id": "little-litany-for-thine-might",
    "segment_ids": [
      "little-litany-for-thine-might"
    ],
    "audio_clip": null
  },
  {
    "id": "little-litany-good-god",
    "segment_ids": [
      "little-litany-good-god-doxology"
    ],
    "audio_clip": null
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
    "show_speakers": true,
    "audio_clip": null
  },
  {
    "id": "trisagion-hymn-main",
    "segment_ids": [
      "trisagion-hymn-holy-god-1",
      "trisagion-hymn-glory",
      "trisagion-hymn-holy-immortal",
      "trisagion-with-strength",
      "trisagion-hymn-holy-god-2"
    ],
    "audio_clip": null
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
    ],
    "audio_clip": null
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
    ],
    "audio_clip": null
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
    "show_speakers": true,
    "audio_clip": null
  },
  {
    "id": "lord-have-mercy",
    "segment_ids": [
      "course-lord-have-mercy-split"
    ],
    "audio_clip": {
      "video_id": "oLdHO28NWuM",
      "start_seconds": 34,
      "end_seconds": 36.5,
      "default_playback_rate": 1
    }
  },
  {
    "id": "jesus-prayer",
    "segment_ids": [
      "course-jesus-prayer"
    ],
    "audio_clip": {
      "video_id": "f-DJruJ0HRs",
      "start_seconds": 0,
      "end_seconds": 3.3,
      "default_playback_rate": 1
    }
  },
  {
    "id": "glory-both-now",
    "segment_ids": [
      "first-antiphon-glory",
      "first-antiphon-both-now"
    ],
    "audio_clip": null
  },
  {
    "id": "glory-beginner",
    "segment_ids": [
      "course-glory-beginner"
    ],
    "audio_clip": {
      "video_id": "oLdHO28NWuM",
      "start_seconds": 15.45,
      "end_seconds": 18.4,
      "default_playback_rate": 1
    }
  },
  {
    "id": "both-now-beginner",
    "segment_ids": [
      "course-both-now-beginner"
    ],
    "audio_clip": {
      "video_id": "oLdHO28NWuM",
      "start_seconds": 18.75,
      "end_seconds": 22.25,
      "default_playback_rate": 1
    }
  },
  {
    "id": "glory-both-now-beginner",
    "segment_ids": [
      "course-glory-beginner",
      "course-both-now-beginner"
    ],
    "audio_clip": {
      "video_id": "oLdHO28NWuM",
      "start_seconds": 15.5,
      "end_seconds": 22.25,
      "default_playback_rate": 1
    }
  },
  {
    "id": "trisagion-hymn-core",
    "segment_ids": [
      "course-trisagion-holy-god",
      "course-trisagion-holy-mighty",
      "course-trisagion-holy-immortal",
      "course-trisagion-have-mercy"
    ],
    "audio_clip": {
      "video_id": "oLdHO28NWuM",
      "start_seconds": 0,
      "end_seconds": 15.25,
      "default_playback_rate": 1
    }
  },
  {
    "id": "caption-poc-glory-beginner",
    "activity_id": "activity-caption-poc-glory-beginner"
  },
  {
    "id": "caption-poc-both-now-beginner",
    "activity_id": "activity-caption-poc-both-now-beginner"
  },
  {
    "id": "caption-poc-glory-both-now-beginner",
    "activity_id": "activity-caption-poc-glory-both-now-beginner"
  },
  {
    "id": "caption-poc-trisagion-hymn-core",
    "activity_id": "activity-caption-poc-trisagion-hymn-core"
  },
  {
    "id": "activity-demo-listen-repeat-holy-god",
    "activity_id": "activity-demo-listen-repeat-holy-god"
  },
  {
    "id": "activity-demo-listen-recall-holy-god",
    "activity_id": "activity-demo-listen-recall-holy-god"
  },
  {
    "id": "activity-demo-cloze-holy-god",
    "activity_id": "activity-demo-cloze-holy-god"
  },
  {
    "id": "activity-demo-synced-caption-holy-god",
    "activity_id": "activity-demo-synced-caption-holy-god"
  },
  {
    "id": "activity-demo-synced-caption-all-holy-trinity",
    "activity_id": "activity-demo-synced-caption-all-holy-trinity"
  },
  {
    "id": "all-holy-trinity-address",
    "segment_ids": [
      "course-all-holy-trinity-address"
    ],
    "audio_clip": {
      "video_id": "oLdHO28NWuM",
      "start_seconds": 22.65,
      "end_seconds": 24.75,
      "default_playback_rate": 1
    }
  },
  {
    "id": "all-holy-trinity-lord",
    "segment_ids": [
      "course-all-holy-trinity-lord"
    ],
    "audio_clip": {
      "video_id": "oLdHO28NWuM",
      "start_seconds": 25.25,
      "end_seconds": 27,
      "default_playback_rate": 1
    }
  },
  {
    "id": "all-holy-trinity-master",
    "segment_ids": [
      "course-all-holy-trinity-master"
    ],
    "audio_clip": {
      "video_id": "oLdHO28NWuM",
      "start_seconds": 27.5,
      "end_seconds": 30,
      "default_playback_rate": 1
    }
  },
  {
    "id": "all-holy-trinity-holy-one",
    "segment_ids": [
      "course-all-holy-trinity-holy-one"
    ],
    "audio_clip": {
      "video_id": "oLdHO28NWuM",
      "start_seconds": 30.25,
      "end_seconds": 33.5,
      "default_playback_rate": 1
    }
  },
  {
    "id": "all-holy-trinity",
    "segment_ids": [
      "course-all-holy-trinity-address",
      "course-all-holy-trinity-lord",
      "course-all-holy-trinity-master",
      "course-all-holy-trinity-holy-one"
    ],
    "audio_clip": {
      "video_id": "oLdHO28NWuM",
      "start_seconds": 22.65,
      "end_seconds": 33.5,
      "default_playback_rate": 1
    }
  },
  {
    "id": "caption-poc-all-holy-trinity-address",
    "activity_id": "activity-caption-poc-all-holy-trinity-address"
  },
  {
    "id": "caption-poc-all-holy-trinity-lord",
    "activity_id": "activity-caption-poc-all-holy-trinity-lord"
  },
  {
    "id": "caption-poc-all-holy-trinity-master",
    "activity_id": "activity-caption-poc-all-holy-trinity-master"
  },
  {
    "id": "caption-poc-all-holy-trinity-holy-one",
    "activity_id": "activity-caption-poc-all-holy-trinity-holy-one"
  },
  {
    "id": "caption-poc-all-holy-trinity",
    "activity_id": "activity-caption-poc-all-holy-trinity"
  },
  {
    "id": "activity-demo-all-holy-trinity-sequence",
    "activity_id": "activity-demo-all-holy-trinity-sequence"
  }
];

export function resolveExercise(definition, segmentsMap = segments) {
  const activity = definition.activity_id ? activities[definition.activity_id] : null;
  const segmentIds = definition.segment_ids || activity?.target?.segment_ids || [];
  const captionClip = definition.caption_clip || (
    activity?.media
      ? {
          recording_id: activity.media.recording_id,
          alignment_id: activity.media.alignment_id,
          default_playback_rate: activity.media.default_playback_rate
        }
      : null
  );
  const resolvedDefinition = {
    ...definition,
    activity,
    segment_ids: segmentIds,
    caption_clip: captionClip
  };

  function getLinesForSegmentIds(ids) {
    return ids
      .map(segmentId => segmentsMap[segmentId])
      .filter(Boolean)
      .map((segment, index) => ({
        ...segment,
        segment_id: ids[index],
        line_order: index + 1,
        phrases: segment.phrases.map(part => ({ ...part }))
      }));
  }

  function getAudioClipForSegmentIds(ids) {
    return deriveCaptionClip(
      { ...resolvedDefinition, segment_ids: ids },
      phrases,
      segmentsMap,
      captionTracks,
      alignments
    );
  }

  const lines = getLinesForSegmentIds(segmentIds);
  const activitySteps = activity?.steps?.map((step, index) => ({
    ...step,
    step_order: index + 1,
    lines: getLinesForSegmentIds(step.segment_ids),
    audio_clip: getAudioClipForSegmentIds(step.segment_ids)
  })) || [];

  const audioClip = definition.audio_clip || deriveCaptionClip(resolvedDefinition, phrases, segmentsMap, captionTracks, alignments);

  return {
    ...resolvedDefinition,
    audio_clip: audioClip,
    activity_steps: activitySteps,
    lines
  };
}

const exercises = Object.fromEntries(
  exerciseDefinitions.map(definition => [definition.id, resolveExercise(definition)])
);

export default exercises;
