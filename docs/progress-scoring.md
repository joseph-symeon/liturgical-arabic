# Progress Scoring

## Comprehension Mastery with Half-Life Decay

Comprehension confidence is a course-mastery score with memory decay. It is inspired by Duolingo's Half-Life Regression model, described in "How we learn how you learn" (https://blog.duolingo.com/how-we-learn-how-you-learn/), but it is intentionally simpler because this app does not yet have a large training dataset.

The model keeps the existing tuned activity weights as the source of earned mastery:

| Activity | Correct gain | Incorrect penalty |
| --- | ---: | ---: |
| matching block | 0.05 | 0.025 |
| multiple choice English | 0.09 | 0.055 |
| multiple choice Arabic | 0.15 | 0.04 |
| written English | 0.20 | 0.035 |
| arrange block | 0.24 | 0.03 |
| written Arabic | 0.34 | 0.02 |

Repeated same-day correct answers use a reduced signal. Correct answers after a miss also use a reduced signal. This keeps one-session gains useful but makes durable confidence depend on correct practice across time.

Each phrase stores both earned and current confidence:

```js
comprehension: {
  confidence: 0.64,          // current displayed confidence after decay
  earned_confidence: 0.72,   // accumulated mastery evidence from tuned activity weights
  half_life_days: 14.3,
  retention: 0.89,
  attempts: 12,
  correct: 10,
  practice_days: {
    "2026-05-30": 6
  },
  successful_practice_days: {
    "2026-05-30": 5
  },
  last_correct_at: 1780189200000
}
```

Current confidence is derived from earned confidence and a half-life style forgetting curve:

```txt
retention = 2 ^ (-days_since_last_correct / half_life_days)
confidence = earned_confidence * retention
```

The phrase's half-life grows when a learner demonstrates stronger evidence:

- higher earned confidence
- more successful practice days
- more successful repetitions

This keeps Comprehension as a course-progress confidence meter, while letting weak or stale phrases naturally surface over time. A phrase practiced successfully on only one day decays sooner than a phrase revisited successfully across several days.

## Recitation Confidence

Recitation confidence uses a separate repetition-and-spacing model. It is intentionally not tied to Comprehension because recitation is audio practice and repeated chanting, while Comprehension is phrase understanding.
