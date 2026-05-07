import React, { useState } from 'react';
import ArabicPhraseRenderer from './ArabicPhraseRenderer.jsx';
import YouTubeClipPlayer from './YouTubeClipPlayer.jsx';
import phrases from '../../data/phrases.js';
import { getArabicText } from '../../utils/arabic.js';

function getActivityLabel(activity) {
  if (!activity) return null;
  if (activity.type === 'listen-repeat') return 'Listen & Repeat';
  if (activity.type === 'listen-repeat-sequence') return 'Step Practice';
  if (activity.type === 'listen-recall') return 'Listen & Recall';
  if (activity.type === 'cloze') return 'Cloze';
  if (activity.type === 'arrange-cloze') return 'Arrange';
  if (activity.type === 'synced-caption') return 'Synced Caption';
  return activity.type;
}

function getLinePrompt(line) {
  return [...(line?.phrases || [])]
    .sort((a, b) => a.display_order - b.display_order)
    .map(part => {
      if (part.phrase_id && phrases[part.phrase_id]) {
        return phrases[part.phrase_id].translation || phrases[part.phrase_id].literal || '';
      }
      return '';
    })
    .filter(Boolean)
    .join(' ');
}

export default function ExerciseBlock({ exercise, audioClip, arabicMode, readerLayout, speechRate, arabicFontFamily, arabicFontWeight, arabicFontSize }) {
  const activityLabel = getActivityLabel(exercise.activity);
  const isSequenceActivity = exercise.activity?.type === 'listen-repeat-sequence';
  const isRecallActivity = exercise.activity?.type === 'listen-recall';
  const isClozeActivity = exercise.activity?.type === 'cloze' || exercise.activity?.type === 'arrange-cloze';
  const isArrangeClozeActivity = exercise.activity?.type === 'arrange-cloze';
  const isSyncedCaptionActivity = exercise.activity?.type === 'synced-caption';
  const [recallRevealed, setRecallRevealed] = useState(false);
  const [recallPracticed, setRecallPracticed] = useState(false);
  const [clozeRevealed, setClozeRevealed] = useState(false);
  const [arrangedPhraseIds, setArrangedPhraseIds] = useState([]);
  const [arrangeChecked, setArrangeChecked] = useState(false);
  const [syncedTime, setSyncedTime] = useState(null);

  const clozePhraseIds = exercise.activity?.cloze?.phrase_ids || [];
  const arrangedPhraseSet = new Set(arrangedPhraseIds);
  const arrangementComplete = arrangedPhraseIds.length === clozePhraseIds.length;
  const arrangementCorrect = arrangementComplete && arrangedPhraseIds.every((phraseId, index) => phraseId === clozePhraseIds[index]);

  function renderPhraseLines(lines) {
    return (
      <ArabicPhraseRenderer
        lines={lines}
        arabicMode={arabicMode}
        readerLayout={readerLayout}
        speechRate={speechRate}
        arabicFontFamily={arabicFontFamily}
        arabicFontWeight={arabicFontWeight}
        arabicFontSize={arabicFontSize}
        showSpeakers={exercise.show_speakers}
      />
    );
  }

  function renderClip(clip, props = {}) {
    if (!clip) return null;
    return (
      <YouTubeClipPlayer
        videoId={clip.video_id}
        startSeconds={clip.start_seconds}
        endSeconds={clip.end_seconds}
        defaultPlaybackRate={clip.default_playback_rate}
        {...props}
      />
    );
  }

  function renderSyncedCaptionActivity() {
    const captions = exercise.activity?.captions || [];
    const displayTime = typeof syncedTime === 'number' ? syncedTime + (exercise.activity?.sync_lead_seconds || 0) : null;
    const activeCaptionIndex = typeof displayTime === 'number'
      ? captions.findIndex(caption => displayTime >= caption.start_seconds && displayTime < caption.end_seconds)
      : -1;
    const activeCaption = captions[activeCaptionIndex] || null;
    const activePhrase = activeCaption ? phrases[activeCaption.phrase_id] : null;

    return (
      <div className="lp-synced-caption-activity" dir="ltr">
        <div className="lp-synced-stage" dir="rtl">
          {activePhrase && (
            <div
              className="lp-synced-line active"
              key={activeCaption.phrase_id}
              style={{
                fontFamily: arabicFontFamily
              }}
            >
              <div className="lp-synced-arabic">{getArabicText(activePhrase, arabicMode)}</div>
            </div>
          )}
        </div>
        {renderClip(audioClip, { onTimeUpdate: setSyncedTime })}
      </div>
    );
  }

  function renderClozeLine(line, getNextBlankIndex) {
    const clozePhraseIdSet = new Set(clozePhraseIds);
    const parts = [...(line?.phrases || [])].sort((a, b) => a.display_order - b.display_order);
    return (
      <div
        className="lp-cloze-line"
        dir="rtl"
        style={{
          fontFamily: arabicFontFamily,
          fontWeight: arabicFontWeight,
          fontSize: `${arabicFontSize}px`
        }}
      >
        {parts.map((part, index) => {
          if (part.text) {
            return <span key={`${line.line_order}-text-${index}`}>{part.text}</span>;
          }
          const phrase = phrases[part.phrase_id];
          const isBlank = clozePhraseIdSet.has(part.phrase_id);
          if (!phrase) return null;
          const currentBlankIndex = isBlank ? getNextBlankIndex() : -1;
          const arrangedPhraseId = arrangedPhraseIds[currentBlankIndex];
          const arrangedPhrase = arrangedPhraseId ? phrases[arrangedPhraseId] : null;
          const showClozeAnswer = clozeRevealed || (isArrangeClozeActivity && arrangedPhrase);
          if (!isBlank || clozeRevealed) {
            return (
              <span className={isBlank ? 'lp-cloze-answer' : undefined} key={`${line.line_order}-${part.phrase_id}-${index}`}>
                {getArabicText(phrase, arabicMode)}
              </span>
            );
          }
          if (showClozeAnswer) {
            return (
              <button
                type="button"
                className="lp-cloze-filled"
                key={`${line.line_order}-${part.phrase_id}-${index}`}
                onClick={() => {
                  if (!isArrangeClozeActivity) return;
                  setArrangeChecked(false);
                  setArrangedPhraseIds(ids => ids.filter((_, phraseIndex) => phraseIndex !== currentBlankIndex));
                }}
              >
                {getArabicText(arrangedPhrase, arabicMode)}
              </button>
            );
          }
          return (
            <span
              className="lp-cloze-blank"
              key={`${line.line_order}-${part.phrase_id}-${index}`}
              aria-label={`Missing phrase: ${phrase.translation}`}
            />
          );
        })}
      </div>
    );
  }

  return (
    <div className="lp-exercise">
      {exercise.activity && (
        <div className="lp-activity-banner" dir="ltr">
          <span className="lp-activity-kind">{activityLabel}</span>
          {exercise.activity.title && <span className="lp-activity-title">{exercise.activity.title}</span>}
        </div>
      )}
      {isSequenceActivity ? (
        <div className="lp-sequence-activity" dir="ltr">
          {(exercise.activity_steps || []).map(step => (
            <section className="lp-sequence-step" key={`${step.step_order}-${step.segment_ids.join(':')}`}>
              <div className="lp-sequence-step-header">
                <span className="lp-sequence-step-number">{step.step_order}</span>
                {step.title && <span className="lp-sequence-step-title">{step.title}</span>}
              </div>
              {renderPhraseLines(step.lines)}
              {renderClip(step.audio_clip)}
            </section>
          ))}
          <section className="lp-sequence-step lp-sequence-step-review">
            <div className="lp-sequence-step-header">
              <span className="lp-sequence-step-number">All</span>
              <span className="lp-sequence-step-title">Full practice</span>
            </div>
            {renderPhraseLines(exercise.lines)}
            {renderClip(audioClip)}
          </section>
        </div>
      ) : isRecallActivity ? (
        <div className="lp-recall-activity" dir="ltr">
          <div className="lp-recall-prompt">
            {(exercise.lines || []).map(line => (
              <div className="lp-recall-prompt-line" key={line.line_order}>
                {getLinePrompt(line)}
              </div>
            ))}
          </div>
          {renderClip(audioClip)}
          <div className="lp-recall-actions">
            <button
              type="button"
              className="lp-recall-button"
              onClick={() => setRecallRevealed(value => !value)}
            >
              {recallRevealed ? 'Hide Arabic' : 'Reveal Arabic'}
            </button>
            <button
              type="button"
              className={`lp-recall-button${recallPracticed ? ' active' : ''}`}
              onClick={() => setRecallPracticed(value => !value)}
              aria-pressed={recallPracticed}
            >
              {recallPracticed ? 'Practiced' : 'Mark Practiced'}
            </button>
          </div>
          {recallRevealed && (
            <div className="lp-recall-reveal">
              {renderPhraseLines(exercise.lines)}
            </div>
          )}
        </div>
      ) : isClozeActivity ? (
        <div className="lp-cloze-activity" dir="ltr">
          <div className="lp-cloze-prompt">
            {isArrangeClozeActivity ? 'Arrange the missing phrases in the correct order while listening.' : 'Fill in the missing repeated phrases while listening.'}
          </div>
          <div className="lp-cloze-lines">
            {(() => {
              let blankIndex = 0;
              return (exercise.lines || []).map(line => (
                <React.Fragment key={line.line_order}>
                  {renderClozeLine(line, () => blankIndex++)}
                </React.Fragment>
              ));
            })()}
          </div>
          {renderClip(audioClip)}
          {isArrangeClozeActivity && (
            <div className="lp-arrange-bank">
              {clozePhraseIds.map(phraseId => {
                const phrase = phrases[phraseId];
                if (!phrase) return null;
                return (
                  <button
                    type="button"
                    className="lp-arrange-tile"
                    key={phraseId}
                    disabled={arrangedPhraseSet.has(phraseId)}
                    onClick={() => {
                      setArrangeChecked(false);
                      setArrangedPhraseIds(ids => ids.includes(phraseId) || ids.length >= clozePhraseIds.length ? ids : ids.concat(phraseId));
                    }}
                    dir="rtl"
                    style={{
                      fontFamily: arabicFontFamily,
                      fontWeight: arabicFontWeight
                    }}
                  >
                    {getArabicText(phrase, arabicMode)}
                  </button>
                );
              })}
            </div>
          )}
          <div className="lp-recall-actions">
            {isArrangeClozeActivity ? (
              <>
                <button
                  type="button"
                  className="lp-recall-button"
                  onClick={() => setArrangeChecked(true)}
                  disabled={!arrangementComplete}
                >
                  Check Order
                </button>
                <button
                  type="button"
                  className="lp-recall-button"
                  onClick={() => {
                    setArrangeChecked(false);
                    setArrangedPhraseIds([]);
                  }}
                >
                  Reset
                </button>
                <button
                  type="button"
                  className="lp-recall-button"
                  onClick={() => setClozeRevealed(value => !value)}
                >
                  {clozeRevealed ? 'Hide Answers' : 'Reveal Answers'}
                </button>
              </>
            ) : (
              <button
                type="button"
                className="lp-recall-button"
                onClick={() => setClozeRevealed(value => !value)}
              >
                {clozeRevealed ? 'Hide Answers' : 'Reveal Answers'}
              </button>
            )}
          </div>
          {isArrangeClozeActivity && arrangeChecked && (
            <div className={`lp-arrange-result${arrangementCorrect ? ' correct' : ' incorrect'}`}>
              {arrangementCorrect ? 'Correct order' : 'Not quite yet'}
            </div>
          )}
        </div>
      ) : isSyncedCaptionActivity ? (
        renderSyncedCaptionActivity()
      ) : (
        <>
          {renderPhraseLines(exercise.lines)}
          {renderClip(audioClip)}
        </>
      )}
    </div>
  );
}
