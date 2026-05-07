// Reusable text-to-recording alignment data.
// Alignments are generated/pinned timings that connect segment sequences to recordings.

export const alignmentDefinitions = [
  {
    "id": "alignment-more-honorable-course-poc-v1",
    "recording_id": "recording-more-honorable-cyFH8CZASSk",
    "method": "caption-match-audio-rms-refine",
    "matches": [
      {
        "segment_ids": [
          "course-glory-beginner"
        ],
        "start_seconds": 379.219,
        "end_seconds": 382.289
      },
      {
        "segment_ids": [
          "course-both-now-beginner"
        ],
        "start_seconds": 382.359,
        "end_seconds": 386.939
      },
      {
        "segment_ids": [
          "course-glory-beginner",
          "course-both-now-beginner"
        ],
        "start_seconds": 379.219,
        "end_seconds": 386.939
      },
      {
        "segment_ids": [
          "course-trisagion-holy-god",
          "course-trisagion-holy-mighty",
          "course-trisagion-holy-immortal",
          "course-trisagion-have-mercy"
        ],
        "start_seconds": 363.24,
        "end_seconds": 368.2
      },
      {
        "segment_ids": [
          "course-all-holy-trinity-address"
        ],
        "start_seconds": 387.199,
        "end_seconds": 389.72
      },
      {
        "segment_ids": [
          "course-all-holy-trinity-lord"
        ],
        "start_seconds": 389.96,
        "end_seconds": 392.2
      },
      {
        "segment_ids": [
          "course-all-holy-trinity-master"
        ],
        "start_seconds": 392.36,
        "end_seconds": 395.8
      },
      {
        "segment_ids": [
          "course-all-holy-trinity-holy-one"
        ],
        "start_seconds": 396,
        "end_seconds": 401.09
      },
      {
        "segment_ids": [
          "course-all-holy-trinity-address",
          "course-all-holy-trinity-lord",
          "course-all-holy-trinity-master",
          "course-all-holy-trinity-holy-one"
        ],
        "start_seconds": 387.199,
        "end_seconds": 401.09
      }
    ]
  }
];

const alignments = Object.fromEntries(
  alignmentDefinitions.map(alignment => [alignment.id, alignment])
);

export default alignments;
