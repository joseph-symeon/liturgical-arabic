// Editable course exercise definitions.
// This file is not generated from CSV.

import segments from '../texts/segments.js';
import phrases from '../texts/phrases.js';
import captionTracks from '../media/captionTracks.js';
import alignments from '../media/alignments.js';
import activities from './activities.js';
import { deriveCaptionClip, findAlignmentMatch, getAlignmentPhraseTimings } from '../../utils/captionClips.js';

export const exerciseDefinitions = [
  {
    "id": "antiphon-only-begotten",
    "segment_ids": [
      "antiphon-word-of-god-only-begotten",
      "antiphon-deathless"
    ],
    "audio_clip": {
      "recording_id": "recording--dufaXx7Hm0",
      "start_seconds": 150.77,
      "end_seconds": 162.68,
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
      "recording_id": "recording--dufaXx7Hm0",
      "start_seconds": 80.7,
      "end_seconds": 99.78,
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
      "recording_id": "recording--dufaXx7Hm0",
      "start_seconds": 162.68,
      "end_seconds": 180.3,
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
      "recording_id": "recording--dufaXx7Hm0",
      "start_seconds": 180.3,
      "end_seconds": 193.35,
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
      "recording_id": "recording--dufaXx7Hm0",
      "start_seconds": 193.35,
      "end_seconds": 204.22,
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
      "recording_id": "recording--dufaXx7Hm0",
      "start_seconds": 204.22,
      "end_seconds": 218.22,
      "default_playback_rate": 1
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
      "antiphon-glorified-with-father",
      "antiphon-save-us"
    ],
    "audio_clip": {
      "recording_id": "recording--dufaXx7Hm0",
      "start_seconds": 150.77,
      "end_seconds": 218.22,
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
    "audio_clip": {
      "recording_id": "recording-KJKt0V4zJjY",
      "start_seconds": 399.45,
      "end_seconds": 409.38,
      "default_playback_rate": 1
    }
  },
  {
    "id": "little-litany-again",
    "segment_ids": [
      "little-litany-again"
    ],
    "audio_clip": {
      "recording_id": "recording--dufaXx7Hm0",
      "start_seconds": 0.3,
      "end_seconds": 5.275,
      "default_playback_rate": 1
    }
  },
  {
    "id": "little-litany-help-save",
    "segment_ids": [
      "little-litany-help-save"
    ],
    "audio_clip": {
      "recording_id": "recording--dufaXx7Hm0",
      "start_seconds": 9.9,
      "end_seconds": 17.3,
      "default_playback_rate": 1
    }
  },
  {
    "id": "little-litany-calling-remembrance",
    "segment_ids": [
      "little-litany-calling-remembrance"
    ],
    "audio_clip": {
      "recording_id": "recording--dufaXx7Hm0",
      "start_seconds": 21.925,
      "end_seconds": 49.225,
      "default_playback_rate": 1
    }
  },
  {
    "id": "little-litany-for-thine-might",
    "segment_ids": [
      "little-litany-for-thine-might"
    ],
      "audio_clip": {
        "recording_id": "recording--dufaXx7Hm0",
      "start_seconds": 54.9,
      "end_seconds": 76.75,
      "default_playback_rate": 1
    }
  },
  {
    "id": "little-litany-good-god",
    "segment_ids": [
      "little-litany-good-god-doxology"
    ],
    "audio_clip": {
      "recording_id": "recording-fzQ4dmF-1Bg",
      "start_seconds": 63.415,
      "end_seconds": 85.7,
      "default_playback_rate": 1
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
    "activity_id": "activity-caption-poc-lord-have-mercy"
  },
  {
    "id": "activity-demo-arrange-lord-have-mercy",
    "activity_id": "activity-demo-arrange-lord-have-mercy"
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
    "id": "activity-demo-synced-caption-glory-beginner",
    "activity_id": "activity-demo-synced-caption-glory-beginner"
  },
  {
    "id": "activity-demo-synced-caption-lord-have-mercy",
    "activity_id": "activity-demo-synced-caption-lord-have-mercy"
  },
  {
    "id": "caption-poc-both-now-beginner",
    "activity_id": "activity-caption-poc-both-now-beginner"
  },
  {
    "id": "activity-demo-synced-caption-both-now-beginner",
    "activity_id": "activity-demo-synced-caption-both-now-beginner"
  },
  {
    "id": "caption-poc-glory-both-now-beginner",
    "activity_id": "activity-caption-poc-glory-both-now-beginner"
  },
  {
    "id": "activity-demo-synced-caption-glory-both-now",
    "activity_id": "activity-demo-synced-caption-glory-both-now"
  },
  {
    "id": "activity-demo-listen-repeat-holy-god",
    "activity_id": "activity-demo-listen-repeat-holy-god"
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
    "id": "activity-demo-arrange-all-holy-trinity",
    "activity_id": "activity-demo-arrange-all-holy-trinity"
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
  const alignedPhraseTimings = activity?.media?.alignment_id
    ? getAlignmentPhraseTimings(activity.media.alignment_id, segmentIds, activity.media.recording_id, alignments)
    : [];
  const resolvedActivity = activity
    ? {
        ...activity,
        captions: activity.captions || alignedPhraseTimings
      }
    : null;
  const resolvedDefinition = {
    ...definition,
    activity: resolvedActivity,
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

  const lines = getLinesForSegmentIds(segmentIds);
  const audioClip = definition.audio_clip || deriveCaptionClip(resolvedDefinition, phrases, segmentsMap, captionTracks, alignments);

  return {
    ...resolvedDefinition,
    audio_clip: audioClip,
    lines
  };
}

const exercises = Object.fromEntries(
  exerciseDefinitions.map(definition => [definition.id, resolveExercise(definition)])
);

const STANDARD_ACTIVITY_OPTIONS = [
  {
    label: 'Listen & Repeat',
    activity_type: 'listen-repeat'
  },
  {
    label: 'Phrase Captions',
    activity_type: 'synced-caption'
  }
];

function getPhraseIdsForLines(lines) {
  return (lines || []).flatMap(line => (
    (line.phrases || [])
      .filter(part => part.phrase_id)
      .map(part => part.phrase_id)
  ));
}

function buildEvenCaptions(audioClip, phraseIds) {
  if (!audioClip || phraseIds.length === 0) return [];

  const duration = audioClip.end_seconds - audioClip.start_seconds;
  const phraseDuration = duration / phraseIds.length;
  return phraseIds.map((phraseId, index) => ({
    phrase_id: phraseId,
    start_seconds: Math.round((audioClip.start_seconds + phraseDuration * index) * 1000) / 1000,
    end_seconds: Math.round((audioClip.start_seconds + phraseDuration * (index + 1)) * 1000) / 1000
  }));
}

function getAlignedCaptions(exercise) {
  const match = findAlignmentMatch(exercise.audio_clip?.recording_id, exercise.segment_ids, alignments);
  return match?.match?.phrase_timings?.map(timing => ({ ...timing })) || [];
}

export function getExercisePhraseCount(exerciseId) {
  return getPhraseIdsForLines(exercises[exerciseId]?.lines).length;
}

export function getStandardActivityOptions(exerciseId) {
  const activityOptions = [...STANDARD_ACTIVITY_OPTIONS];
  if (getExercisePhraseCount(exerciseId) <= 12) {
    activityOptions.push({
      label: 'Arrange',
      activity_type: 'arrange-cloze'
    });
  }
  return activityOptions;
}

function getDerivedActivity(exercise, activityType) {
  if (!activityType) return exercise.activity;

  const phraseIds = getPhraseIdsForLines(exercise.lines);
  const alignedCaptions = getAlignedCaptions(exercise);
  const captions = alignedCaptions.length ? alignedCaptions : buildEvenCaptions(exercise.audio_clip, phraseIds);
  const alignmentMatch = findAlignmentMatch(exercise.audio_clip?.recording_id, exercise.segment_ids, alignments);
  const commonActivity = {
    id: `${exercise.id}:${activityType}`,
    target: {
      segment_ids: exercise.segment_ids
    },
    media: exercise.audio_clip?.recording_id
      ? {
          recording_id: exercise.audio_clip.recording_id,
          alignment_id: alignmentMatch?.alignment?.id,
          default_playback_rate: exercise.audio_clip.default_playback_rate
        }
      : null
  };

  if (activityType === 'listen-repeat') {
    return {
      ...commonActivity,
      type: 'listen-repeat',
      title: 'Listen & Repeat',
      captions
    };
  }

  if (activityType === 'synced-caption') {
    return {
      ...commonActivity,
      type: 'synced-caption',
      title: 'Phrase Captions',
      captions
    };
  }

  if (activityType === 'arrange-cloze') {
    return {
      ...commonActivity,
      type: 'arrange-cloze',
      title: 'Arrange',
      cloze: {
        phrase_ids: phraseIds
      }
    };
  }

  return exercise.activity;
}

export function getExerciseWithActivity(exerciseId, activityType = null) {
  const exercise = exercises[exerciseId];
  if (!exercise || !activityType) return exercise;

  return {
    ...exercise,
    id: `${exercise.id}:${activityType}`,
    activity: getDerivedActivity(exercise, activityType)
  };
}

export default exercises;
