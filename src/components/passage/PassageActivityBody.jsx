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

const TRANSLATION_CORRECT_FEEDBACK_MS = 700;
const TRANSLATION_FEEDBACK_FADE_MS = 700;
const TRANSLATION_INCORRECT_FEEDBACK_MS = 1100;

function getShuffledPhraseIds(phraseIds, seed = '') {
  return [...phraseIds].sort((first, second) => {
    const firstKey = `${seed}:${first}`.split('').reduce((sum, character) => sum + character.charCodeAt(0), 0) % 97;
    const secondKey = `${seed}:${second}`.split('').reduce((sum, character) => sum + character.charCodeAt(0), 0) % 97;
    return firstKey - secondKey || first.localeCompare(second);
  });
}

function getRandomizedPhraseIds(phraseIds) {
  return [...phraseIds]
    .map(phraseId => ({ phraseId, sortKey: Math.random() }))
    .sort((first, second) => first.sortKey - second.sortKey)
    .map(item => item.phraseId);
}

function getTranslationChoiceIds(correctPhraseId, phraseIds, maxChoices = 4) {
  if (!correctPhraseId) return [];
  const distractorIds = getRandomizedPhraseIds(phraseIds.filter(phraseId => phraseId !== correctPhraseId))
    .slice(0, Math.max(0, maxChoices - 1));
  return getRandomizedPhraseIds([correctPhraseId, ...distractorIds]);
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

function normalizeArabicTypingValue(value) {
  return String(value || '')
    .normalize('NFKD')
    .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, '')
    .replace(/\u0640/g, '')
    .replace(/[إأآٱ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه')
    .replace(/[^\u0621-\u064A\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function getTypingPromptLines(lines, arabicMode) {
  return (lines || []).filter(line => !line.tags?.includes('rubric')).map(line => {
    const parts = (line.phrases || []).flatMap((part, index) => {
      if (isPracticeExemptPart(part)) return [];
      if (part.text) return [{ text: part.text, display_order: index }];
      const phrase = phrases[part.phrase_id];
      if (!phrase) return [];
      const phrasePart = { phrase_id: part.phrase_id, display_order: index };
      return index === 0 ? [phrasePart] : [{ text: ' ', display_order: index - 0.5 }, phrasePart];
    });
    const arabicText = (line.phrases || []).map(part => {
      if (isPracticeExemptPart(part)) return '';
      if (part.text) return part.text;
      const phrase = phrases[part.phrase_id];
      return phrase ? getArabicText(phrase, arabicMode) : '';
    }).join('');
    return { ...line, arabicText, parts };
  }).filter(line => line.arabicText.trim());
}

function getPixelValue(styles, property) {
  return Number.parseFloat(styles.getPropertyValue(property)) || 0;
}

function getTraceBoxHeight(traceElement, minimumRows) {
  const styles = window.getComputedStyle(traceElement);
  const lineHeight = Number.parseFloat(styles.lineHeight) || 32;
  const paddingBlock = getPixelValue(styles, 'padding-top') + getPixelValue(styles, 'padding-bottom');
  const borderBlock = getPixelValue(styles, 'border-top-width') + getPixelValue(styles, 'border-bottom-width');
  const contentHeight = Math.max(0, traceElement.scrollHeight - paddingBlock);
  const traceRows = Math.max(minimumRows, Math.ceil(contentHeight / lineHeight));

  return Math.ceil(paddingBlock + borderBlock + ((traceRows + 1) * lineHeight));
}

function getUniquePhraseIds(phraseIds) {
  return [...new Set(phraseIds || [])];
}

function getPhraseMeaning(phrase) {
  return phrase?.literal || phrase?.translation || '';
}

function getPhraseIdsForLines(lines) {
  return (lines || []).flatMap(line => (
    line.tags?.includes('rubric')
      ? []
      : (line.phrases || [])
        .filter(part => part.phrase_id && !isPracticeExemptPart(part))
        .map(part => part.phrase_id)
  ));
}

function isPracticeExemptPart(part) {
  return part.tags?.includes('rubric') || phrases[part.phrase_id]?.tags?.includes('rubric');
}

export default function PassageActivityBody({ exercise, arabicMode, readerLayout, speechRate, arabicFontFamily, arabicFontWeight, arabicFontSize, karaokeActiveCaption = null }) {
  const isReadListen = isReadListenActivity(exercise.activity?.type);
  const isArrangeActivity = exercise.activity?.type === PASSAGE_ACTIVITY_TYPES.arrange;
  const isTypeArabicActivity = exercise.activity?.type === PASSAGE_ACTIVITY_TYPES.typeArabic;
  const isMatchingActivity = exercise.activity?.type === PASSAGE_ACTIVITY_TYPES.matching;
  const isTranslationDirectionActivity = exercise.activity?.type === PASSAGE_ACTIVITY_TYPES.translationDirection;
  const isClozeActivity = exercise.activity?.type === PASSAGE_ACTIVITY_TYPES.cloze || isArrangeActivity;
  const isPhraseCaptions = isPhraseCaptionsActivity(exercise.activity?.type);
  const [clozeRevealed, setClozeRevealed] = useState(false);
  const [arrangedPhraseIds, setArrangedPhraseIds] = useState([]);
  const [arrangeChecked, setArrangeChecked] = useState(false);
  const [arrangeFeedback, setArrangeFeedback] = useState(null);
  const [typedArabic, setTypedArabic] = useState('');
  const [typingFeedback, setTypingFeedback] = useState(null);
  const [matchingSelection, setMatchingSelection] = useState(null);
  const [matchedPhraseIds, setMatchedPhraseIds] = useState([]);
  const [matchingFeedback, setMatchingFeedback] = useState(null);
  const [matchingCardHeight, setMatchingCardHeight] = useState(null);
  const [translationDirection, setTranslationDirection] = useState('arabic-to-meaning');
  const [translationIndex, setTranslationIndex] = useState(0);
  const [translationFeedback, setTranslationFeedback] = useState(null);
  const [translationCompleted, setTranslationCompleted] = useState(false);
  const [translationDismissedChoiceIds, setTranslationDismissedChoiceIds] = useState([]);
  const [translationAdvancing, setTranslationAdvancing] = useState(false);
  const [translationMutingAllChoices, setTranslationMutingAllChoices] = useState(false);
  const [translationShuffleKey, setTranslationShuffleKey] = useState(0);
  const [typingBoxHeight, setTypingBoxHeight] = useState(null);
  const matchingGridRef = useRef(null);
  const typingBoxRef = useRef(null);
  const typingInputRef = useRef(null);
  const typingTraceRef = useRef(null);
  const arrangeFeedbackTimerRef = useRef(null);
  const typingFeedbackTimerRef = useRef(null);
  const matchingFeedbackTimerRef = useRef(null);
  const translationFeedbackTimerRef = useRef(null);
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
  const randomizedArrangePhraseIds = useMemo(
    () => getRandomizedPhraseIds(clozePhraseIds),
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
  const typingPromptLines = useMemo(
    () => getTypingPromptLines(exercise.lines, arabicMode),
    [exercise.lines, arabicMode]
  );
  const typingTarget = typingPromptLines.map(line => line.arabicText).join(' ');
  const typingTraceText = typingPromptLines
    .map(line => line.arabicText.trim())
    .filter(Boolean)
    .join(readerLayout === 'line' ? '\n' : ' ');
  const typedArabicCorrect = normalizeArabicTypingValue(typedArabic) === normalizeArabicTypingValue(typingTarget);
  const matchingPhraseIds = useMemo(
    () => getUniquePhraseIds(exercise.activity?.matching?.phrase_ids || getPhraseIdsForLines(exercise.lines)),
    [exercise.activity?.matching?.phrase_ids?.join('|'), exercise.lines]
  );
  const shuffledMatchingTranslations = useMemo(
    () => getShuffledPhraseIds(matchingPhraseIds, `${exercise.id}:matching`),
    [matchingPhraseIds.join('|'), exercise.id]
  );
  const translationPhraseIds = useMemo(
    () => getUniquePhraseIds(exercise.activity?.translation?.phrase_ids || getPhraseIdsForLines(exercise.lines))
      .filter(phraseId => phrases[phraseId] && getPhraseMeaning(phrases[phraseId])),
    [exercise.activity?.translation?.phrase_ids?.join('|'), exercise.lines]
  );
  const translationPromptIds = useMemo(
    () => getRandomizedPhraseIds(translationPhraseIds),
    [translationPhraseIds.join('|'), translationDirection, translationShuffleKey]
  );
  const translationChoiceIds = useMemo(
    () => getTranslationChoiceIds(translationPromptIds[translationIndex], translationPhraseIds),
    [translationPromptIds.join('|'), translationPhraseIds.join('|'), translationDirection, translationShuffleKey, translationIndex]
  );
  const matchedPhraseIdSet = new Set(matchedPhraseIds);
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
    setTypedArabic('');
    setTypingFeedback(null);
    setMatchingSelection(null);
    setMatchedPhraseIds([]);
    setMatchingFeedback(null);
    setTranslationIndex(0);
    setTranslationFeedback(null);
    setTranslationCompleted(false);
    setTranslationDismissedChoiceIds([]);
    setTranslationAdvancing(false);
    setTranslationMutingAllChoices(false);
    setTranslationShuffleKey(key => key + 1);
    setTypingBoxHeight(null);
    return () => {
      if (arrangeFeedbackTimerRef.current) {
        clearTimeout(arrangeFeedbackTimerRef.current);
        arrangeFeedbackTimerRef.current = null;
      }
      if (typingFeedbackTimerRef.current) {
        clearTimeout(typingFeedbackTimerRef.current);
        typingFeedbackTimerRef.current = null;
      }
      if (matchingFeedbackTimerRef.current) {
        clearTimeout(matchingFeedbackTimerRef.current);
        matchingFeedbackTimerRef.current = null;
      }
      if (translationFeedbackTimerRef.current) {
        clearTimeout(translationFeedbackTimerRef.current);
        translationFeedbackTimerRef.current = null;
      }
    };
  }, [exercise.id]);

  useEffect(() => {
    setTranslationIndex(0);
    setTranslationFeedback(null);
    setTranslationCompleted(false);
    setTranslationDismissedChoiceIds([]);
    setTranslationAdvancing(false);
    setTranslationMutingAllChoices(false);
    setTranslationShuffleKey(key => key + 1);
  }, [translationDirection, translationPhraseIds.join('|')]);

  useEffect(() => {
    if (!isTypeArabicActivity || !typingTraceRef.current || !typingBoxRef.current) return undefined;
    let frameId = null;
    let secondFrameId = null;
    let lastMeasuredWidth = 0;

    function updateTypingBoxHeight({ force = false } = {}) {
      if (!typingTraceRef.current) return;
      const measuredWidth = Math.round(typingTraceRef.current.getBoundingClientRect().width);
      if (!force && measuredWidth === lastMeasuredWidth) return;

      lastMeasuredWidth = measuredWidth;
      typingTraceRef.current.style.height = 'auto';
      if (typingInputRef.current) {
        typingInputRef.current.style.height = 'auto';
      }
      setTypingBoxHeight(getTraceBoxHeight(typingTraceRef.current, Math.max(1, typingPromptLines.length)));
    }

    function scheduleTypingBoxHeightUpdate(options) {
      if (frameId) cancelAnimationFrame(frameId);
      if (secondFrameId) cancelAnimationFrame(secondFrameId);
      frameId = requestAnimationFrame(() => {
        secondFrameId = requestAnimationFrame(() => updateTypingBoxHeight(options));
      });
    }

    setTypingBoxHeight(null);
    scheduleTypingBoxHeightUpdate({ force: true });

    const resizeObserver = new ResizeObserver(() => {
      scheduleTypingBoxHeightUpdate();
    });
    resizeObserver.observe(typingBoxRef.current);

    return () => {
      if (frameId) cancelAnimationFrame(frameId);
      if (secondFrameId) cancelAnimationFrame(secondFrameId);
      resizeObserver.disconnect();
    };
  }, [isTypeArabicActivity, typingTraceText, readerLayout, typingPromptLines.length]);

  useEffect(() => {
    if (!isMatchingActivity || !matchingGridRef.current) return undefined;

    function updateMatchingCardHeight() {
      const cards = Array.from(matchingGridRef.current?.querySelectorAll('.lp-matching-card') || []);
      if (cards.length === 0) {
        setMatchingCardHeight(null);
        return;
      }
      cards.forEach(card => {
        card.style.removeProperty('height');
      });
      const maxHeight = Math.ceil(Math.max(...cards.map(card => card.getBoundingClientRect().height)));
      setMatchingCardHeight(maxHeight);
    }

    updateMatchingCardHeight();
    window.addEventListener('resize', updateMatchingCardHeight);
    return () => window.removeEventListener('resize', updateMatchingCardHeight);
  }, [isMatchingActivity, matchingPhraseIds.join('|'), shuffledMatchingTranslations.join('|'), arabicFontFamily, arabicFontWeight, arabicMode]);

  function clearArrangeFeedback() {
    if (arrangeFeedbackTimerRef.current) {
      clearTimeout(arrangeFeedbackTimerRef.current);
      arrangeFeedbackTimerRef.current = null;
    }
    setArrangeFeedback(null);
  }

  function clearTypingFeedback() {
    if (typingFeedbackTimerRef.current) {
      clearTimeout(typingFeedbackTimerRef.current);
      typingFeedbackTimerRef.current = null;
    }
    setTypingFeedback(null);
  }

  function clearMatchingFeedback() {
    if (matchingFeedbackTimerRef.current) {
      clearTimeout(matchingFeedbackTimerRef.current);
      matchingFeedbackTimerRef.current = null;
    }
    setMatchingFeedback(null);
  }

  function clearTranslationFeedback() {
    if (translationFeedbackTimerRef.current) {
      clearTimeout(translationFeedbackTimerRef.current);
      translationFeedbackTimerRef.current = null;
    }
    setTranslationFeedback(null);
    setTranslationAdvancing(false);
    setTranslationMutingAllChoices(false);
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
            {randomizedArrangePhraseIds.map(phraseId => (
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
              className="lp-activity-button lp-activity-submit"
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

  function renderTypeArabicActivity() {
    return (
      <div className="lp-type-arabic-activity" dir="ltr">
        <label className="lp-type-arabic-label" htmlFor={`type-arabic-${exercise.id}`}>
          Trace the Arabic
        </label>
        <div
          className={`lp-type-arabic-copybox${typingFeedback ? ` ${typingFeedback}` : ''}`}
          ref={typingBoxRef}
          style={typingBoxHeight ? { height: `${typingBoxHeight}px` } : undefined}
        >
          <textarea
            className="lp-type-arabic-trace"
            value={typingTraceText}
            dir="rtl"
            lang="ar"
            readOnly
            aria-hidden="true"
            tabIndex={-1}
            ref={typingTraceRef}
            rows={Math.max(1, typingPromptLines.length)}
            style={typingBoxHeight ? { height: `${typingBoxHeight}px` } : undefined}
          />
          <textarea
            id={`type-arabic-${exercise.id}`}
            className="lp-type-arabic-input"
            value={typedArabic}
            ref={typingInputRef}
            onChange={event => {
              setTypedArabic(event.target.value);
              clearTypingFeedback();
              requestAnimationFrame(() => {
                if (typingInputRef.current) typingInputRef.current.scrollTop = 0;
                if (typingTraceRef.current) typingTraceRef.current.scrollTop = 0;
              });
            }}
            onScroll={() => {
              if (!typingInputRef.current || !typingTraceRef.current) return;
              typingInputRef.current.scrollTop = 0;
              typingTraceRef.current.scrollTop = 0;
            }}
            dir="rtl"
            lang="ar"
            spellCheck={false}
            autoCapitalize="none"
            autoCorrect="off"
            rows={Math.max(1, typingPromptLines.length)}
            style={typingBoxHeight ? { height: `${typingBoxHeight}px` } : undefined}
          />
        </div>
        <div className="lp-activity-actions lp-type-arabic-actions">
          <button
            type="button"
            className="lp-activity-button lp-activity-submit"
            onClick={() => {
              clearTypingFeedback();
              setTypingFeedback(typedArabicCorrect ? 'correct' : 'incorrect');
              typingFeedbackTimerRef.current = setTimeout(() => {
                setTypingFeedback(null);
                typingFeedbackTimerRef.current = null;
              }, 1400);
            }}
            disabled={!typedArabic.trim()}
          >
            Submit
          </button>
        </div>
      </div>
    );
  }

  function renderTranslationDirectionActivity() {
    const currentPhraseId = translationPromptIds[translationIndex] || translationPromptIds[0];
    const currentPhrase = phrases[currentPhraseId];
    const isArabicPrompt = translationDirection === 'arabic-to-meaning';
    const promptText = isArabicPrompt ? getArabicText(currentPhrase, arabicMode) : getPhraseMeaning(currentPhrase);
    const promptLabel = isArabicPrompt ? 'Choose the meaning' : 'Choose the Arabic';
    const progressText = translationPromptIds.length > 0
      ? `${Math.min(translationIndex + 1, translationPromptIds.length)} / ${translationPromptIds.length}`
      : '0 / 0';

    function getChoiceClass(phraseId) {
      const phrase = phrases[phraseId];
      const isArabicChoice = !isArabicPrompt;
      const classNames = [
        'lp-matching-card',
        isArabicChoice ? 'arabic' : 'translation',
        'lp-translation-choice'
      ];
      if (translationFeedback?.selectedPhraseId === phraseId && !translationFeedback.correct) {
        classNames.push('incorrect');
      }
      if (translationFeedback?.correctPhraseId === phraseId && translationFeedback.correct) {
        classNames.push('correct');
      }
      if (
        translationDismissedChoiceIds.includes(phraseId)
        || (translationFeedback?.correct && translationFeedback.correctPhraseId !== phraseId)
        || translationMutingAllChoices
      ) {
        classNames.push('matched');
      }
      if (!phrase) classNames.push('matched');
      return classNames.join(' ');
    }

    function chooseTranslation(phraseId) {
      if (!currentPhraseId || translationFeedback || translationAdvancing || translationDismissedChoiceIds.includes(phraseId)) return;
      const correct = phraseId === currentPhraseId;
      setTranslationFeedback({
        correct,
        selectedPhraseId: phraseId,
        correctPhraseId: currentPhraseId
      });
      if (correct) setTranslationAdvancing(true);
      translationFeedbackTimerRef.current = setTimeout(() => {
        translationFeedbackTimerRef.current = null;
        setTranslationFeedback(null);
        if (!correct) {
          setTranslationDismissedChoiceIds(ids => ids.includes(phraseId) ? ids : ids.concat(phraseId));
          return;
        }
        setTranslationMutingAllChoices(true);
        translationFeedbackTimerRef.current = setTimeout(() => {
          translationFeedbackTimerRef.current = null;
          setTranslationDismissedChoiceIds([]);
          if (translationIndex >= translationPromptIds.length - 1) {
            setTranslationCompleted(true);
            setTranslationAdvancing(false);
            setTranslationMutingAllChoices(false);
            return;
          }
          setTranslationIndex(index => index + 1);
          setTranslationAdvancing(false);
          setTranslationMutingAllChoices(false);
        }, TRANSLATION_FEEDBACK_FADE_MS);
      }, correct ? TRANSLATION_CORRECT_FEEDBACK_MS : TRANSLATION_INCORRECT_FEEDBACK_MS);
    }

    if (!currentPhrase || translationPromptIds.length < 2) {
      return (
        <div className="lp-translation-activity" dir="ltr">
          <div className="lp-cloze-prompt">This exercise needs at least two translatable phrases.</div>
        </div>
      );
    }

    return (
      <div className="lp-translation-activity" dir="ltr">
        <div className="lp-translation-header">
          <div className="lp-segmented-control lp-translation-direction" role="group" aria-label="Translation direction">
            <button
              type="button"
              className={translationDirection === 'arabic-to-meaning' ? 'active' : ''}
              onClick={() => {
                clearTranslationFeedback();
                setTranslationDirection('arabic-to-meaning');
              }}
            >
              Arabic to meaning
            </button>
            <button
              type="button"
              className={translationDirection === 'meaning-to-arabic' ? 'active' : ''}
              onClick={() => {
                clearTranslationFeedback();
                setTranslationDirection('meaning-to-arabic');
              }}
            >
              Meaning to Arabic
            </button>
          </div>
          <div className="lp-translation-progress">{translationCompleted ? 'Done' : progressText}</div>
        </div>

        {translationCompleted ? (
          <div className="lp-translation-complete">
            <div>Complete</div>
            <button
              type="button"
              className="lp-activity-button lp-activity-submit"
              onClick={() => {
                clearTranslationFeedback();
                setTranslationCompleted(false);
                setTranslationIndex(0);
                setTranslationDismissedChoiceIds([]);
                setTranslationAdvancing(false);
                setTranslationMutingAllChoices(false);
                setTranslationShuffleKey(key => key + 1);
              }}
            >
              Practice again
            </button>
          </div>
        ) : (
          <>
            <div className="lp-translation-prompt">
              <div className="lp-translation-prompt-label">{promptLabel}</div>
              <div
                className={`lp-translation-prompt-text${isArabicPrompt ? ' arabic' : ''}`}
                dir={isArabicPrompt ? 'rtl' : 'ltr'}
                style={isArabicPrompt ? {
                  fontFamily: arabicFontFamily,
                  fontWeight: arabicFontWeight
                } : undefined}
              >
                {promptText}
              </div>
            </div>
            <div className="lp-translation-options">
              {translationChoiceIds.map(phraseId => {
                const phrase = phrases[phraseId];
                if (!phrase) return null;
                const isArabicChoice = !isArabicPrompt;
                return (
                  <button
                    type="button"
                    className={getChoiceClass(phraseId)}
                    key={`translation-${currentPhraseId}-${phraseId}`}
                    onClick={() => chooseTranslation(phraseId)}
                    disabled={Boolean(translationFeedback) || translationAdvancing || translationDismissedChoiceIds.includes(phraseId)}
                    dir={isArabicChoice ? 'rtl' : 'ltr'}
                    style={isArabicChoice ? {
                      fontFamily: arabicFontFamily,
                      fontWeight: arabicFontWeight
                    } : undefined}
                  >
                    {isArabicChoice ? getArabicText(phrase, arabicMode) : getPhraseMeaning(phrase)}
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>
    );
  }

  function renderMatchingActivity() {
    function getCardClass(side, phraseId) {
      const isMatched = matchedPhraseIdSet.has(phraseId);
      const isSelected = matchingSelection?.side === side && matchingSelection?.phraseId === phraseId;
      const isFeedback = matchingFeedback
        && matchingFeedback.cards.some(card => card.side === side && card.phraseId === phraseId)
        && (!isMatched || matchingFeedback.state === 'correct');
      return [
        'lp-matching-card',
        side === 'arabic' ? 'arabic' : 'translation',
        isSelected ? 'selected' : '',
        isMatched ? 'matched' : '',
        isFeedback ? matchingFeedback.state : ''
      ].filter(Boolean).join(' ');
    }

    function chooseMatch(side, phraseId) {
      if (matchedPhraseIdSet.has(phraseId) || matchingFeedback) return;
      if (matchingSelection?.side === side && matchingSelection?.phraseId === phraseId) {
        setMatchingSelection(null);
        return;
      }
      if (!matchingSelection) {
        setMatchingSelection({ side, phraseId });
        return;
      }
      if (matchingSelection.side === side) {
        setMatchingSelection({ side, phraseId });
        return;
      }

      const correct = matchingSelection.phraseId === phraseId;
      setMatchingFeedback({
        state: correct ? 'correct' : 'incorrect',
        cards: [
          matchingSelection,
          { side, phraseId }
        ]
      });
      setMatchingSelection(null);
      matchingFeedbackTimerRef.current = setTimeout(() => {
        if (correct) {
          setMatchedPhraseIds(ids => ids.includes(phraseId) ? ids : ids.concat(phraseId));
        }
        setMatchingFeedback(null);
        matchingFeedbackTimerRef.current = null;
      }, 700);
    }

    return (
      <div
        className="lp-matching-activity"
        dir="ltr"
        onPointerDown={event => {
          if (event.target.closest('.lp-matching-card')) return;
          setMatchingSelection(null);
        }}
      >
        <div
          className="lp-matching-grid"
          ref={matchingGridRef}
          style={{
            '--matching-card-height': matchingCardHeight ? `${matchingCardHeight}px` : undefined
          }}
        >
          <div className="lp-matching-column arabic" dir="rtl">
            {matchingPhraseIds.map(phraseId => {
              const phrase = phrases[phraseId];
              if (!phrase) return null;
              return (
                <button
                  type="button"
                  className={getCardClass('arabic', phraseId)}
                  key={`matching-arabic-${phraseId}`}
                  onClick={() => chooseMatch('arabic', phraseId)}
                  disabled={matchedPhraseIdSet.has(phraseId)}
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
          <div className="lp-matching-column translation">
            {shuffledMatchingTranslations.map(phraseId => {
              const phrase = phrases[phraseId];
              if (!phrase) return null;
              return (
                <button
                  type="button"
                  className={getCardClass('translation', phraseId)}
                  key={`matching-translation-${phraseId}`}
                  onClick={() => chooseMatch('translation', phraseId)}
                  disabled={matchedPhraseIdSet.has(phraseId)}
                >
                  {phrase.literal || phrase.translation || phraseId}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  if (isPhraseCaptions) return null;

  return (
    <div className="lp-exercise">
      {isMatchingActivity ? (
        renderMatchingActivity()
      ) : isTranslationDirectionActivity ? (
        renderTranslationDirectionActivity()
      ) : isTypeArabicActivity ? (
        renderTypeArabicActivity()
      ) : isArrangeActivity ? (
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
              {randomizedArrangePhraseIds.map(phraseId => {
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
                  className="lp-activity-button lp-activity-submit"
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
