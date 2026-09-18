import React from 'react';

export default function CourseAccountPrompt({ onCreateAccount, onSignIn }) {
  return (
    <aside className="lp-course-progress-prompt" aria-label="Unlock the full course">
      <div className="lp-course-progress-copy">
        <strong>Unlock the full course</strong>
        <span>Create a free account to access every lesson and keep your progress synced across devices.</span>
      </div>
      <div className="lp-course-progress-actions">
        <button type="button" className="primary" onClick={onCreateAccount}>
          Create free account
        </button>
        <button type="button" className="secondary" onClick={onSignIn}>
          Sign in
        </button>
      </div>
    </aside>
  );
}
