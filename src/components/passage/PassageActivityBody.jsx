import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import PassageTextRenderer from './PassageTextRenderer.jsx';
import phrases from '../../data/texts/phrases.js';
import { getArabicText } from '../../utils/arabic.js';
import { isPhraseCaptionsActivity, isReadListenActivity, PASSAGE_ACTIVITY_TYPES } from '../../utils/passageActivities.js';

function getShuffledPhraseIds(phraseIds, seed = '') {
  return [...phraseIds].sort((first, second) => {
    const firstKey = `${seed}:${first}`.split('').reduce((sum, character) => sum + character.charCodeAt(0), 0) % 97;
    const secondKey = `${seed}:${second}`.split('').reduce((sum, character) => sum + character.charCodeAt(0), 0) % 97;
    return firstKey - secondKey || first.localeCompare(second);
  });
}

function ArrangeAnswerTile({ phraseId, index, arabicMode, arabicFontFamily, arabicFontWeight, onRemove, feedbackState = null }) {
  const phrase = phrases[phraseId];
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: phraseId });

  if (!phrase) return null;

  return (
    <button
      type="button"
      className={`lp-arrange-answer-tile${isDragging ? ' dragging' : ''}${feedbackState ? ` ${feedbackState}` : ''}`}
      ref={setNodeRef}
      style={{
        fontFamily: arabicFontFamily,
        fontWeight: arabicFontWeight,
        transform: CSS.Translate.toString(transform),
        transition: `${transition ? `${transition}, ` : ''}background-color 700ms ease, border-color 700ms ease, color 700ms ease`
      }}
      onClick={() => onRemove(index)}
      onContextMenu={event => event.preventDefault()}
      {...attributes}
      {...listeners}
    >
      {getArabicText(phrase, arabicMode)}
    </button>
  );
}

function ArrangeBankTile({ phraseId, arabicMode, arabicFontFamily, arabicFontWeight, disabled, onClick, feedbackState = null }) {
  const phrase = phrases[phraseId];
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging
  } = useDraggable({
    id: `bank:${phraseId}`,
    disabled
  });

  if (!phrase) return null;

  return (
    <button
      type="button"
      className={`lp-arrange-tile${disabled ? ' used' : ''}${isDragging ? ' dragging' : ''}${feedbackState ? ` ${feedbackState}` : ''}`}
      ref={setNodeRef}
      disabled={disabled}
      onClick={onClick}
      dir="rtl"
      style={{
        fontFamily: arabicFontFamily,
        fontWeight: arabicFontWeight,
        transform: CSS.Translate.toString(transform),
        transition: 'background-color 700ms ease, border-color 700ms ease, color 700ms ease'
      }}
      onContextMenu={event => event.preventDefault()}
      {...attributes}
      {...listeners}
    >
      <span className={disabled ? 'lp-arrange-tile-hidden-text' : undefined}>
        {getArabicText(phrase, arabicMode)}
      </span>
    </button>
  );
}

function ArrangeAnswerDropzone({ children, arabicFontFamily, arabicFontWeight }) {
  const { setNodeRef, isOver } = useDroppable({ id: 'answer-dropzone' });

  return (
    <div
      className={`lp-arrange-answer${isOver ? ' over' : ''}`}
      ref={setNodeRef}
      dir="rtl"
      aria-label="Arranged Arabic phrase answer"
      style={{
        fontFamily: arabicFontFamily,
        fontWeight: arabicFontWeight
      }}
    >
      {children}
    </div>
  );
}

function getArrangeLineCounts(lines, phraseIds) {
  const phraseIdSet = new Set(phraseIds);
  const counts = (lines || [])
    .map(line => (line.phrases || []).filter(part => part.phrase_id && phraseIdSet.has(part.phrase_id)).length)
    .filter(Boolean);
  return counts.length ? counts : [phraseIds.length];
}

function getArrangeRows(arrangedPhraseIds, lineCounts) {
  let start = 0;
  return lineCounts.flatMap(count => {
    const segmentRow = arrangedPhraseIds.slice(start, start + count);
    start += count;
    const visualRows = [];
    for (let index = 0; index < count; index += 2) {
      visualRows.push({
        phrases: segmentRow.slice(index, index + 2),
        startIndex: start - count + index
      });
    }
    return visualRows;
  });
}

export default function PassageActivityBody({ exercise, arabicMode, readerLayout, speechRate, arabicFontFamily, arabicFontWeight, arabicFontSize, karaokeActiveCaption = null }) {
  const isReadListen = isReadListenActivity(exercise.activity?.type);
  const isArrangeActivity = exercise.activity?.type === PASSAGE_ACTIVITY_TYPES.arrange;
  const isClozeActivity = exercise.activity?.type === PASSAGE_ACTIVITY_TYPES.cloze || isArrangeActivity;
  const isPhraseCaptions = isPhraseCaptionsActivity(exercise.activity?.type);
  const [clozeRevealed, setClozeRevealed] = useState(false);
  const [arrangedPhraseIds, setArrangedPhraseIds] = useState([]);
  const [arrangeChecked, setArrangeChecked] = useState(false);
  const [arrangeFeedback, setArrangeFeedback] = useState(null);
  const arrangeFeedbackTimerRef = useRef(null);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6
      }
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  const clozePhraseIds = exercise.activity?.cloze?.phrase_ids || [];
  const shuffledClozePhraseIds = useMemo(
    () => getShuffledPhraseIds(clozePhraseIds, exercise.id),
    [clozePhraseIds.join('|'), exercise.id]
  );
  const arrangedPhraseSet = new Set(arrangedPhraseIds);
  const arrangementComplete = arrangedPhraseIds.length === clozePhraseIds.length;
  const arrangementCorrect = arrangementComplete && arrangedPhraseIds.every((phraseId, index) => phraseId === clozePhraseIds[index]);
  const arrangeLineCounts = useMemo(
    () => getArrangeLineCounts(exercise.lines, clozePhraseIds),
    [exercise.lines, clozePhraseIds.join('|')]
  );
  const arrangeAnswerLineCount = arrangeLineCounts.reduce((sum, count) => sum + Math.max(1, Math.ceil(count / 2)), 0);
  const arrangeRows = getArrangeRows(arrangedPhraseIds, arrangeLineCounts);
  const activeCaption = isReadListen ? karaokeActiveCaption : null;

  useEffect(() => {
    if (arrangeFeedbackTimerRef.current) {
      clearTimeout(arrangeFeedbackTimerRef.current);
      arrangeFeedbackTimerRef.current = null;
    }
    setClozeRevealed(false);
    setArrangedPhraseIds([]);
    setArrangeChecked(false);
    setArrangeFeedback(null);
    return () => {
      if (arrangeFeedbackTimerRef.current) {
        clearTimeout(arrangeFeedbackTimerRef.current);
        arrangeFeedbackTimerRef.current = null;
      }
    };
  }, [exercise.id]);

  function clearArrangeFeedback() {
    if (arrangeFeedbackTimerRef.current) {
      clearTimeout(arrangeFeedbackTimerRef.current);
      arrangeFeedbackTimerRef.current = null;
    }
    setArrangeFeedback(null);
  }

  function renderPhraseLines(lines) {
    return (
      <PassageTextRenderer
        lines={lines}
        arabicMode={arabicMode}
        readerLayout={readerLayout}
        speechRate={speechRate}
        arabicFontFamily={arabicFontFamily}
        arabicFontWeight={arabicFontWeight}
        arabicFontSize={arabicFontSize}
        showSpeakers={exercise.show_speakers}
        activeCaption={activeCaption}
      />
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
          const showClozeAnswer = clozeRevealed || (isArrangeActivity && arrangedPhrase);
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
                  if (!isArrangeActivity) return;
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

  function renderArrangeActivity() {
    function removeArrangedPhrase(index) {
      setArrangeChecked(false);
      clearArrangeFeedback();
      setArrangedPhraseIds(ids => ids.filter((_, phraseIndex) => phraseIndex !== index));
    }

    function addArrangedPhrase(phraseId, overId = null) {
      clearArrangeFeedback();
      setArrangedPhraseIds(ids => {
        if (ids.includes(phraseId) || ids.length >= clozePhraseIds.length) return ids;
        if (!overId || overId === 'answer-dropzone') return ids.concat(phraseId);
        const overIndex = ids.indexOf(overId);
        if (overIndex === -1) return ids.concat(phraseId);
        return ids.slice(0, overIndex).concat(phraseId, ids.slice(overIndex));
      });
    }

    function handleDragEnd(event) {
      const activeId = String(event.active?.id || '');
      const overId = event.over?.id ? String(event.over.id) : null;
      if (!overId) return;

      setArrangeChecked(false);
      clearArrangeFeedback();

      if (activeId.startsWith('bank:')) {
        addArrangedPhrase(activeId.replace('bank:', ''), overId);
        return;
      }

      if (activeId !== overId && arrangedPhraseIds.includes(activeId) && arrangedPhraseIds.includes(overId)) {
        setArrangedPhraseIds(ids => arrayMove(ids, ids.indexOf(activeId), ids.indexOf(overId)));
      }
    }

    return (
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div
          className="lp-arrange-activity"
          dir="ltr"
          style={{
            '--arrange-answer-lines': Math.max(3, arrangeAnswerLineCount)
          }}
        >
          <SortableContext items={arrangedPhraseIds} strategy={rectSortingStrategy}>
            <ArrangeAnswerDropzone arabicFontFamily={arabicFontFamily} arabicFontWeight={arabicFontWeight}>
              {arrangeRows.map((row, rowIndex) => {
                return (
                  <div
                    className="lp-arrange-answer-row"
                    key={`arrange-row-${rowIndex}`}
                  >
                    {row.phrases.map((phraseId, index) => (
                      <ArrangeAnswerTile
                        key={phraseId}
                        phraseId={phraseId}
                        index={row.startIndex + index}
                        arabicMode={arabicMode}
                        arabicFontFamily={arabicFontFamily}
                        arabicFontWeight={arabicFontWeight}
                        onRemove={removeArrangedPhrase}
                        feedbackState={arrangeFeedback === 'correct'
                          ? 'correct'
                          : arrangeFeedback === 'incorrect' && clozePhraseIds[row.startIndex + index] !== phraseId
                            ? 'incorrect'
                            : null}
                      />
                    ))}
                  </div>
                );
              })}
            </ArrangeAnswerDropzone>
          </SortableContext>
          <div className="lp-arrange-bank">
            {shuffledClozePhraseIds.map(phraseId => (
              <ArrangeBankTile
                key={phraseId}
                phraseId={phraseId}
                arabicMode={arabicMode}
                arabicFontFamily={arabicFontFamily}
                arabicFontWeight={arabicFontWeight}
                disabled={arrangedPhraseSet.has(phraseId)}
                feedbackState={arrangeFeedback === 'incorrect' && !arrangedPhraseSet.has(phraseId) ? 'incorrect' : null}
                onClick={() => {
                  setArrangeChecked(false);
                  clearArrangeFeedback();
                  addArrangedPhrase(phraseId);
                }}
              />
            ))}
          </div>
          <div className="lp-activity-actions lp-arrange-actions">
            <button
              type="button"
              className="lp-activity-button"
              onClick={() => {
                setArrangeChecked(true);
                setArrangeFeedback(arrangementCorrect ? 'correct' : 'incorrect');
                if (arrangeFeedbackTimerRef.current) clearTimeout(arrangeFeedbackTimerRef.current);
                arrangeFeedbackTimerRef.current = setTimeout(() => {
                  setArrangeFeedback(null);
                  setArrangeChecked(false);
                  arrangeFeedbackTimerRef.current = null;
                }, 1400);
              }}
              disabled={arrangedPhraseIds.length === 0}
            >
              Submit
            </button>
          </div>
        </div>
      </DndContext>
    );
  }

  if (isPhraseCaptions) return null;

  return (
    <div className="lp-exercise">
      {isArrangeActivity ? (
        renderArrangeActivity()
      ) : isClozeActivity ? (
        <div className="lp-cloze-activity" dir="ltr">
          <div className="lp-cloze-prompt">
            {isArrangeActivity ? 'Arrange the missing phrases in the correct order while listening.' : 'Fill in the missing repeated phrases while listening.'}
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
          {isArrangeActivity && (
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
          <div className="lp-activity-actions">
            {isArrangeActivity ? (
              <>
                <button
                  type="button"
                  className="lp-activity-button"
                  onClick={() => setArrangeChecked(true)}
                  disabled={!arrangementComplete}
                >
                  Submit
                </button>
                <button
                  type="button"
                  className="lp-activity-button"
                  onClick={() => setClozeRevealed(value => !value)}
                >
                  {clozeRevealed ? 'Hide Answers' : 'Reveal Answers'}
                </button>
              </>
            ) : (
              <button
                type="button"
                className="lp-activity-button"
                onClick={() => setClozeRevealed(value => !value)}
              >
                {clozeRevealed ? 'Hide Answers' : 'Reveal Answers'}
              </button>
            )}
          </div>
          {isArrangeActivity && arrangeChecked && (
            <div className={`lp-arrange-result${arrangementCorrect ? ' correct' : ' incorrect'}`}>
              {arrangementCorrect ? 'Correct order' : 'Not quite yet'}
            </div>
          )}
        </div>
      ) : isPhraseCaptions ? (
        null
      ) : (
        renderPhraseLines(exercise.lines)
      )}
    </div>
  );
}
