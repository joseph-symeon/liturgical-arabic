import React from 'react';
import './course.css';

export default function ConfidenceGuidePage({ onCourseOverview }) {
  return (
    <main className="lp-page course-view-page lp-confidence-guide-page" dir="ltr">
      <section className="lp-confidence-guide" aria-labelledby="confidence-guide-title">
        <button type="button" className="lp-track-detail-back" onClick={onCourseOverview}>
          Back to course
        </button>

        <div className="lp-view-header">
          <p className="lp-view-kicker">Confidence</p>
          <h2 className="lp-view-title" id="confidence-guide-title">How your score works</h2>
          <p className="lp-confidence-guide-intro">
            Confidence estimates how ready you are to understand and follow a phrase today. It grows through practice and naturally fades when a phrase has not been reviewed.
          </p>
        </div>

        <div className="lp-confidence-guide-grid">
          <article className="lp-confidence-guide-panel primary">
            <h3>One Score, Two Skills</h3>
            <p>
              Each phrase combines Comprehension and Recitation. Comprehension tracks whether you recognize the meaning; Recitation tracks whether you can follow and chant it with the audio.
            </p>
          </article>

          <article className="lp-confidence-guide-panel">
            <h3>Practice Raises It</h3>
            <p>
              Harder comprehension tasks give stronger evidence than easier ones. Repeated practice on the same day still helps, but it counts less than remembering the phrase on a later day.
            </p>
          </article>

          <article className="lp-confidence-guide-panel">
            <h3>Time Lowers It</h3>
            <p>
              The score uses a half-life style memory model. A phrase practiced only once will fade sooner; a phrase remembered across several days will stay strong longer.
            </p>
          </article>

          <article className="lp-confidence-guide-panel">
            <h3>Review Strengthens It</h3>
            <p>
              When confidence drops, the phrase is ready for review. A successful review after time away is stronger evidence than more drilling right after you first learned it.
            </p>
          </article>
        </div>

        <div className="lp-confidence-guide-example" aria-label="Example confidence story">
          <div>
            <span>First strong session</span>
            <strong>High, but fresh</strong>
          </div>
          <div>
            <span>Next-day recall</span>
            <strong>More durable</strong>
          </div>
          <div>
            <span>Several successful days</span>
            <strong>Longer lasting</strong>
          </div>
        </div>
      </section>
    </main>
  );
}
