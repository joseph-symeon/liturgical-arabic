import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
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
import StudyWorkspaceHeader from '../StudyWorkspaceHeader.jsx';
import LiturgyLine from '../LiturgyLine.jsx';
import phrases from '../../data/texts/phrases.js';
import { getArabicText } from '../../utils/arabic.js';
import { isPhraseCaptionsActivity, isReadListenActivity, PASSAGE_ACTIVITY_TYPES } from '../../utils/passageActivities.js';

const TRANSLATION_CORRECT_FEEDBACK_MS = 700;
const TRANSLATION_FEEDBACK_FADE_MS = 700;
const TRANSLATION_INCORRECT_FEEDBACK_MS = 1100;
const ARRANGE_CORRECT_FEEDBACK_MS = 1900;
const ARRANGE_INCORRECT_FEEDBACK_MS = 1400;
const MATCHING_COMPLETE_FEEDBACK_MS = 900;
const LEARN_SETTINGS_STORAGE_KEY = 'liturgical-arabic:learn-settings';
const LEARN_SETTINGS_OPEN_STORAGE_KEY = 'liturgical-arabic:learn-settings-open';
const LEARN_MATCHING_MIN_PHRASES = 2;
const LEARN_MATCHING_MAX_PHRASES = 6;
const LEARN_ARRANGE_MIN_PHRASES = 2;
const LEARN_ARRANGE_MAX_PHRASES = 12;
const DEFAULT_LEARN_SETTINGS = {
  shuffleTerms: true,
  multipleChoiceAnswerWith: 'both',
  writtenAnswerWith: 'english',
  englishDisplayMode: 'literal',
  questionTypes: {
    multipleChoice: true,
    written: true,
    matching: true,
    arrange: true
  }
};

function getStoredLearnSettings() {
  if (typeof window === 'undefined') return DEFAULT_LEARN_SETTINGS;
  try {
    const storedSettings = JSON.parse(window.localStorage.getItem(LEARN_SETTINGS_STORAGE_KEY) || 'null');
    if (!storedSettings || typeof storedSettings !== 'object') return DEFAULT_LEARN_SETTINGS;
    const answerModes = ['english', 'arabic', 'both'];
    const englishDisplayModes = ['literal', 'translation'];
    return {
      shuffleTerms: typeof storedSettings.shuffleTerms === 'boolean'
        ? storedSettings.shuffleTerms
        : DEFAULT_LEARN_SETTINGS.shuffleTerms,
      multipleChoiceAnswerWith: answerModes.includes(storedSettings.multipleChoiceAnswerWith)
        ? storedSettings.multipleChoiceAnswerWith
        : DEFAULT_LEARN_SETTINGS.multipleChoiceAnswerWith,
      writtenAnswerWith: answerModes.includes(storedSettings.writtenAnswerWith)
        ? storedSettings.writtenAnswerWith
        : DEFAULT_LEARN_SETTINGS.writtenAnswerWith,
      englishDisplayMode: englishDisplayModes.includes(storedSettings.englishDisplayMode)
        ? storedSettings.englishDisplayMode
        : DEFAULT_LEARN_SETTINGS.englishDisplayMode,
      questionTypes: {
        ...DEFAULT_LEARN_SETTINGS.questionTypes,
        ...(storedSettings.questionTypes && typeof storedSettings.questionTypes === 'object'
          ? Object.fromEntries(Object.entries(storedSettings.questionTypes).filter(([, value]) => typeof value === 'boolean'))
          : {})
      }
    };
  } catch {
    return DEFAULT_LEARN_SETTINGS;
  }
}

function getStoredLearnSettingsOpen() {
  if (typeof window === 'undefined') return false;
  return window.localStorage.getItem(LEARN_SETTINGS_OPEN_STORAGE_KEY) === 'true';
}

function getShuffledPhraseIds(phraseIds, seed = '') {
  let hash = 2166136261;
  const seedText = `${seed}:${phraseIds.join('|')}`;
  for (let index = 0; index < seedText.length; index += 1) {
    hash ^= seedText.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  function nextRandom() {
    hash += 0x6D2B79F5;
    let value = hash;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  }

  const shuffledIds = [...phraseIds];
  for (let index = shuffledIds.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(nextRandom() * (index + 1));
    [shuffledIds[index], shuffledIds[swapIndex]] = [shuffledIds[swapIndex], shuffledIds[index]];
  }
  return shuffledIds;
}

function hasSameOrder(firstIds, secondIds) {
  return firstIds.length === secondIds.length && firstIds.every((phraseId, index) => phraseId === secondIds[index]);
}

function hasConstantOffsetOrder(firstIds, secondIds) {
  if (firstIds.length !== secondIds.length || firstIds.length < 3) return false;
  const secondIndexes = new Map(secondIds.map((phraseId, index) => [phraseId, index]));
  const firstOffset = (secondIndexes.get(firstIds[0]) - 0 + firstIds.length) % firstIds.length;
  return firstIds.every((phraseId, index) => {
    const secondIndex = secondIndexes.get(phraseId);
    if (secondIndex === undefined) return false;
    return (secondIndex - index + firstIds.length) % firstIds.length === firstOffset;
  });
}

function getMatchingPhraseOrder(phraseIds, seed = '', avoidOrders = []) {
  if (phraseIds.length < 2) return [...phraseIds];
  let bestOrder = getShuffledPhraseIds(phraseIds, seed);
  for (let attempt = 0; attempt < 16; attempt += 1) {
    const orderedIds = getShuffledPhraseIds(phraseIds, `${seed}:${attempt}`);
    const hasBadRelationship = avoidOrders.some(avoidOrder => (
      hasSameOrder(orderedIds, avoidOrder) || hasConstantOffsetOrder(avoidOrder, orderedIds)
    ));
    if (!hasBadRelationship) return orderedIds;
    bestOrder = orderedIds;
  }
  return bestOrder;
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

function getLearnChoiceIds(correctPhraseId, phraseIds, seed = '') {
  if (!correctPhraseId) return [];
  const distractorIds = getShuffledPhraseIds(
    phraseIds.filter(phraseId => phraseId !== correctPhraseId),
    seed
  ).slice(0, 3);
  return getShuffledPhraseIds([correctPhraseId, ...distractorIds], `${seed}:choices`);
}

function getLearnTextAnswer(phrase, textMode = 'literal') {
  return getPhraseTextForMode(phrase, textMode);
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
      data-phrase-id={phraseId}
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

function ArrangeAnswerDropzone({ children, arabicFontFamily, arabicFontWeight, containerRef }) {
  const { setNodeRef, isOver } = useDroppable({ id: 'answer-dropzone' });

  function setRefs(node) {
    setNodeRef(node);
    if (containerRef) {
      containerRef.current = node;
    }
  }

  return (
    <div
      className={`lp-arrange-answer${isOver ? ' over' : ''}`}
      ref={setRefs}
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

function getArrangeRows(arrangedPhraseIds, phraseWidths = {}, availableWidth = 0, gap = 8) {
  const rows = [];

  let currentRow = [];
  let currentStartIndex = 0;
  let currentWidth = 0;

  arrangedPhraseIds.forEach((phraseId, index) => {
    const phraseWidth = Math.ceil(phraseWidths[phraseId] || 0);
    const nextWidth = currentRow.length > 0
      ? currentWidth + gap + phraseWidth
      : phraseWidth;
    const shouldStartNewRow = availableWidth > 0
      && currentRow.length > 0
      && phraseWidth > 0
      && nextWidth > availableWidth;

    if (shouldStartNewRow) {
      rows.push({
        phrases: currentRow,
        startIndex: currentStartIndex
      });
      currentRow = [phraseId];
      currentStartIndex = index;
      currentWidth = phraseWidth;
      return;
    }

    currentRow.push(phraseId);
    currentWidth = nextWidth;
  });

  if (currentRow.length > 0) {
    rows.push({
      phrases: currentRow,
      startIndex: currentStartIndex
    });
  }

  return rows;
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

function normalizeEnglishTypingValue(value) {
  return String(value || '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/['’]/g, '')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9\s]/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

function normalizeEnglishAnswerForComparison(value) {
  return normalizeEnglishTypingValue(value).replace(/^the\s+/, '');
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

  return Math.ceil(paddingBlock + borderBlock + (traceRows * lineHeight));
}

function getUniquePhraseIds(phraseIds) {
  return [...new Set(phraseIds || [])];
}

function getPhraseMeaning(phrase) {
  return phrase?.literal || phrase?.translation || '';
}

function getPhraseTextForMode(phrase, textMode) {
  return textMode === 'translation'
    ? phrase?.translation || phrase?.literal || ''
    : phrase?.literal || phrase?.translation || '';
}

function getPhraseEnglishAnswers(phrase) {
  return [phrase?.translation, phrase?.literal]
    .filter(Boolean)
    .filter((value, index, values) => values.indexOf(value) === index);
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

export default function PassageActivityBody({ exercise, arabicMode, readerLayout, speechRate, arabicFontFamily, arabicFontWeight, arabicFontSize, karaokeActiveCaption = null, practiceTextMode = 'literal' }) {
  const storedLearnSettings = useMemo(() => getStoredLearnSettings(), []);
  const isReadListen = isReadListenActivity(exercise.activity?.type);
  const isArrangeActivity = exercise.activity?.type === PASSAGE_ACTIVITY_TYPES.arrange;
  const isTypeArabicActivity = exercise.activity?.type === PASSAGE_ACTIVITY_TYPES.typeArabic;
  const isTypeEnglishActivity = exercise.activity?.type === PASSAGE_ACTIVITY_TYPES.typeEnglish;
  const isMatchingActivity = exercise.activity?.type === PASSAGE_ACTIVITY_TYPES.matching;
  const isTranslationDirectionActivity = exercise.activity?.type === PASSAGE_ACTIVITY_TYPES.translationDirection;
  const isLearnActivity = exercise.activity?.type === PASSAGE_ACTIVITY_TYPES.learn;
  const isClozeActivity = exercise.activity?.type === PASSAGE_ACTIVITY_TYPES.cloze || isArrangeActivity;
  const isPhraseCaptions = isPhraseCaptionsActivity(exercise.activity?.type);
  const [clozeRevealed, setClozeRevealed] = useState(false);
  const [arrangedPhraseIds, setArrangedPhraseIds] = useState([]);
  const [arrangeChecked, setArrangeChecked] = useState(false);
  const [arrangeFeedback, setArrangeFeedback] = useState(null);
  const [typedArabic, setTypedArabic] = useState('');
  const [typedEnglish, setTypedEnglish] = useState('');
  const [typedRecallArabic, setTypedRecallArabic] = useState('');
  const [typingFeedback, setTypingFeedback] = useState(null);
  const [englishTypingFeedback, setEnglishTypingFeedback] = useState(null);
  const [matchingSelection, setMatchingSelection] = useState(null);
  const [matchedPhraseIds, setMatchedPhraseIds] = useState([]);
  const [matchingCorrectFeedbackIds, setMatchingCorrectFeedbackIds] = useState([]);
  const [matchingFeedback, setMatchingFeedback] = useState(null);
  const [matchingCardHeight, setMatchingCardHeight] = useState(null);
  const [recallDirection, setRecallDirection] = useState('arabic-to-english');
  const [recallIndex, setRecallIndex] = useState(0);
  const [recallCompleted, setRecallCompleted] = useState(false);
  const [recallShuffleKey, setRecallShuffleKey] = useState(0);
  const [translationDirection, setTranslationDirection] = useState('arabic-to-meaning');
  const [translationIndex, setTranslationIndex] = useState(0);
  const [translationFeedback, setTranslationFeedback] = useState(null);
  const [translationCompleted, setTranslationCompleted] = useState(false);
  const [translationDismissedChoiceIds, setTranslationDismissedChoiceIds] = useState([]);
  const [translationAdvancing, setTranslationAdvancing] = useState(false);
  const [translationMutingAllChoices, setTranslationMutingAllChoices] = useState(false);
  const [translationShuffleKey, setTranslationShuffleKey] = useState(0);
  const [learnShuffleTerms, setLearnShuffleTerms] = useState(storedLearnSettings.shuffleTerms);
  const [learnMultipleChoiceAnswerWith, setLearnMultipleChoiceAnswerWith] = useState(storedLearnSettings.multipleChoiceAnswerWith);
  const [learnWrittenAnswerWith, setLearnWrittenAnswerWith] = useState(storedLearnSettings.writtenAnswerWith);
  const [learnEnglishDisplayMode, setLearnEnglishDisplayMode] = useState(storedLearnSettings.englishDisplayMode);
  const [learnQuestionTypes, setLearnQuestionTypes] = useState(storedLearnSettings.questionTypes);
  const [learnQueue, setLearnQueue] = useState([]);
  const [learnCompletedIds, setLearnCompletedIds] = useState([]);
  const [learnMissedIds, setLearnMissedIds] = useState([]);
  const [learnPromptCount, setLearnPromptCount] = useState(0);
  const [learnTotalPromptCount, setLearnTotalPromptCount] = useState(0);
  const [learnWrittenAnswer, setLearnWrittenAnswer] = useState('');
  const [learnTraceAnswer, setLearnTraceAnswer] = useState('');
  const [learnFeedback, setLearnFeedback] = useState(null);
  const [learnSelectedChoiceId, setLearnSelectedChoiceId] = useState(null);
  const [learnCorrectionPrompt, setLearnCorrectionPrompt] = useState(null);
  const [learnStarted, setLearnStarted] = useState(false);
  const [learnReviewMode, setLearnReviewMode] = useState(null);
  const [learnSettingsOpen, setLearnSettingsOpen] = useState(getStoredLearnSettingsOpen);
  const [learnResetKey, setLearnResetKey] = useState(0);
  const [matchingShuffleKey, setMatchingShuffleKey] = useState(0);
  const [arrangeAnswerWidth, setArrangeAnswerWidth] = useState(0);
  const [arrangePhraseWidths, setArrangePhraseWidths] = useState({});
  const [arrangePlannedLineCount, setArrangePlannedLineCount] = useState(1);
  const [typingBoxHeight, setTypingBoxHeight] = useState(null);
  const matchingGridRef = useRef(null);
  const arrangeAnswerRef = useRef(null);
  const arrangeBankRef = useRef(null);
  const arrangeMeasureRef = useRef(null);
  const typingBoxRef = useRef(null);
  const typingInputRef = useRef(null);
  const typingTraceRef = useRef(null);
  const learnWrittenInputRef = useRef(null);
  const learnTraceInputRef = useRef(null);
  const learnTraceGhostRef = useRef(null);
  const arrangeFeedbackTimerRef = useRef(null);
  const typingFeedbackTimerRef = useRef(null);
  const englishTypingFeedbackTimerRef = useRef(null);
  const matchingFeedbackTimerRef = useRef(null);
  const matchingCorrectFeedbackTimerRefs = useRef([]);
  const matchingCompleteTimerRef = useRef(null);
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

  const clozePhraseIds = exercise.activity?.cloze?.phrase_ids || exercise.activity?.learn?.phrase_ids || [];
  const randomizedArrangePhraseIds = useMemo(
    () => getRandomizedPhraseIds(clozePhraseIds),
    [clozePhraseIds.join('|'), exercise.id]
  );
  const arrangedPhraseSet = new Set(arrangedPhraseIds);
  const arrangementComplete = arrangedPhraseIds.length === clozePhraseIds.length;
  const arrangementCorrect = arrangementComplete && arrangedPhraseIds.every((phraseId, index) => phraseId === clozePhraseIds[index]);
  const arrangeRows = getArrangeRows(arrangedPhraseIds, arrangePhraseWidths, arrangeAnswerWidth);
  const arrangeAnswerLineCount = Math.max(1, arrangePlannedLineCount, arrangeRows.length);
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
  const recallPhraseIds = useMemo(
    () => getUniquePhraseIds(exercise.activity?.practice?.phrase_ids || getPhraseIdsForLines(exercise.lines))
      .filter(phraseId => {
        const phrase = phrases[phraseId];
        return phrase && getArabicText(phrase, arabicMode) && (phrase.translation || phrase.literal);
      }),
    [exercise.activity?.practice?.phrase_ids?.join('|'), exercise.lines, arabicMode]
  );
  const recallPromptIds = useMemo(
    () => getRandomizedPhraseIds(recallPhraseIds),
    [recallPhraseIds.join('|'), recallDirection, recallShuffleKey]
  );
  const currentRecallPhraseId = recallPromptIds[recallIndex] || recallPromptIds[0];
  const currentRecallPhrase = phrases[currentRecallPhraseId];
  const typedEnglishNormalized = normalizeEnglishTypingValue(typedEnglish);
  const typedEnglishComparable = normalizeEnglishAnswerForComparison(typedEnglish);
  const typedEnglishCorrect = Boolean(typedEnglishNormalized) && Boolean(currentRecallPhrase) && getPhraseEnglishAnswers(currentRecallPhrase).some(option => (
    typedEnglishComparable === normalizeEnglishAnswerForComparison(option)
  ));
  const typedRecallArabicCorrect = Boolean(currentRecallPhrase)
    && normalizeArabicTypingValue(typedRecallArabic) === normalizeArabicTypingValue(getArabicText(currentRecallPhrase, arabicMode));
  const matchingPhraseIds = useMemo(
    () => getUniquePhraseIds(exercise.activity?.matching?.phrase_ids || exercise.activity?.learn?.phrase_ids || getPhraseIdsForLines(exercise.lines)),
    [exercise.activity?.matching?.phrase_ids?.join('|'), exercise.activity?.learn?.phrase_ids?.join('|'), exercise.lines]
  );
  const learnCanUseMatching = matchingPhraseIds.length >= LEARN_MATCHING_MIN_PHRASES
    && matchingPhraseIds.length <= LEARN_MATCHING_MAX_PHRASES;
  const learnCanUseArrange = clozePhraseIds.length >= LEARN_ARRANGE_MIN_PHRASES
    && clozePhraseIds.length <= LEARN_ARRANGE_MAX_PHRASES;
  const shuffledMatchingArabic = useMemo(
    () => getMatchingPhraseOrder(matchingPhraseIds, `${exercise.id}:matching:${matchingShuffleKey}:arabic`, [matchingPhraseIds]),
    [matchingPhraseIds.join('|'), exercise.id, matchingShuffleKey]
  );
  const shuffledMatchingTranslations = useMemo(
    () => getMatchingPhraseOrder(matchingPhraseIds, `${exercise.id}:matching:${matchingShuffleKey}:translation`, [matchingPhraseIds, shuffledMatchingArabic]),
    [matchingPhraseIds.join('|'), shuffledMatchingArabic.join('|'), exercise.id, matchingShuffleKey]
  );
  const translationPhraseIds = useMemo(
    () => getUniquePhraseIds(exercise.activity?.translation?.phrase_ids || getPhraseIdsForLines(exercise.lines))
      .filter(phraseId => phrases[phraseId] && getPhraseTextForMode(phrases[phraseId], practiceTextMode)),
    [exercise.activity?.translation?.phrase_ids?.join('|'), exercise.lines, practiceTextMode]
  );
  const translationPromptIds = useMemo(
    () => getRandomizedPhraseIds(translationPhraseIds),
    [translationPhraseIds.join('|'), translationDirection, translationShuffleKey]
  );
  const translationChoiceIds = useMemo(
    () => getTranslationChoiceIds(translationPromptIds[translationIndex], translationPhraseIds),
    [translationPromptIds.join('|'), translationPhraseIds.join('|'), translationDirection, translationShuffleKey, translationIndex]
  );
  const learnPhraseIds = useMemo(
    () => getUniquePhraseIds(exercise.activity?.learn?.phrase_ids || getPhraseIdsForLines(exercise.lines))
      .filter(phraseId => {
        const phrase = phrases[phraseId];
        return phrase && getArabicText(phrase, arabicMode) && getPhraseEnglishAnswers(phrase).length > 0;
      }),
    [exercise.activity?.learn?.phrase_ids?.join('|'), exercise.lines, arabicMode]
  );
  const currentLearnItem = learnQueue[0] || null;
  const currentLearnItemType = typeof currentLearnItem === 'string'
    ? 'term'
    : currentLearnItem?.type || null;
  const currentLearnPhraseId = typeof currentLearnItem === 'string'
    ? currentLearnItem
    : currentLearnItem?.phraseId || null;
  const currentLearnPhrase = phrases[currentLearnPhraseId];
  const learnQuestionType = currentLearnItemType === 'term'
    ? currentLearnItem?.questionType || (learnQuestionTypes.written ? 'written' : 'multiple-choice')
    : currentLearnItemType;
  const learnMultipleChoiceDirection = learnMultipleChoiceAnswerWith === 'english'
    ? 'arabic-to-english'
    : learnMultipleChoiceAnswerWith === 'arabic'
      ? 'english-to-arabic'
      : learnPromptCount % 2 === 0
        ? 'arabic-to-english'
        : 'english-to-arabic';
  const learnWrittenDirection = learnWrittenAnswerWith === 'english'
    ? 'arabic-to-english'
    : learnWrittenAnswerWith === 'arabic'
      ? 'english-to-arabic'
      : learnPromptCount % 2 === 0
        ? 'arabic-to-english'
        : 'english-to-arabic';
  const learnDirection = learnQuestionType === 'written'
    ? learnWrittenDirection
    : learnMultipleChoiceDirection;
  const learnAnswerValue = learnDirection === 'english-to-arabic'
    ? currentLearnPhrase ? getArabicText(currentLearnPhrase, arabicMode) : ''
    : getLearnTextAnswer(currentLearnPhrase, learnEnglishDisplayMode);
  const learnPromptValue = learnDirection === 'english-to-arabic'
    ? getLearnTextAnswer(currentLearnPhrase, learnEnglishDisplayMode)
    : currentLearnPhrase ? getArabicText(currentLearnPhrase, arabicMode) : '';
  const learnChoiceIds = useMemo(
    () => getLearnChoiceIds(currentLearnPhraseId, learnPhraseIds, `${exercise.id}:${learnPromptCount}:${learnDirection}`),
    [currentLearnPhraseId, learnPhraseIds.join('|'), exercise.id, learnPromptCount, learnDirection]
  );
  const matchedPhraseIdSet = new Set(matchedPhraseIds);
  const activeCaption = isReadListen ? karaokeActiveCaption : null;

  function moveCurrentLearnTerm(wasCorrect) {
    if (!currentLearnPhraseId) return;
    setLearnQueue(queue => {
      const remaining = queue.slice(1);
      if (wasCorrect) return remaining;
      const retryIndex = Math.min(2, remaining.length);
      const retryItem = typeof currentLearnItem === 'string'
        ? { type: 'term', phraseId: currentLearnPhraseId, questionType: learnQuestionType, review: true }
        : { ...currentLearnItem, questionType: learnQuestionType, review: true };
      return remaining.slice(0, retryIndex).concat(retryItem, remaining.slice(retryIndex));
    });
    setLearnPromptCount(count => count + 1);
    if (!wasCorrect) setLearnTotalPromptCount(count => count + 1);
    setLearnWrittenAnswer('');
    setLearnTraceAnswer('');
    setLearnFeedback(null);
    setLearnSelectedChoiceId(null);
    if (wasCorrect) {
      setLearnCompletedIds(ids => ids.includes(currentLearnPhraseId) ? ids : ids.concat(currentLearnPhraseId));
    } else {
      setLearnMissedIds(ids => ids.includes(currentLearnPhraseId) ? ids : ids.concat(currentLearnPhraseId));
    }
  }

  function chooseLearnChoice(phraseId) {
    if (!phraseId || learnFeedback) return;
    const isCorrect = phraseId === currentLearnPhraseId;
    setLearnSelectedChoiceId(phraseId);
    setLearnFeedback(isCorrect ? 'correct' : 'incorrect');
    window.setTimeout(
      () => moveCurrentLearnTerm(isCorrect),
      isCorrect ? TRANSLATION_CORRECT_FEEDBACK_MS : TRANSLATION_INCORRECT_FEEDBACK_MS
    );
  }

  function completeCurrentLearnReview() {
    setLearnQueue(queue => queue.slice(1));
    setLearnPromptCount(count => count + 1);
    setMatchingSelection(null);
    setMatchedPhraseIds([]);
    setMatchingCorrectFeedbackIds([]);
    setMatchingFeedback(null);
    if (matchingCompleteTimerRef.current) {
      clearTimeout(matchingCompleteTimerRef.current);
      matchingCompleteTimerRef.current = null;
    }
    setArrangedPhraseIds([]);
    setArrangeChecked(false);
    setArrangeFeedback(null);
    setClozeRevealed(false);
  }

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
    setTypedEnglish('');
    setTypedRecallArabic('');
    setTypingFeedback(null);
    setEnglishTypingFeedback(null);
    setMatchingSelection(null);
    setMatchedPhraseIds([]);
    setMatchingCorrectFeedbackIds([]);
    setMatchingFeedback(null);
    setRecallIndex(0);
    setRecallCompleted(false);
    setRecallShuffleKey(key => key + 1);
    setTranslationIndex(0);
    setTranslationFeedback(null);
    setTranslationCompleted(false);
    setTranslationDismissedChoiceIds([]);
    setTranslationAdvancing(false);
    setTranslationMutingAllChoices(false);
    setTranslationShuffleKey(key => key + 1);
    setLearnCompletedIds([]);
    setLearnMissedIds([]);
    setLearnPromptCount(0);
    setLearnWrittenAnswer('');
    setLearnTraceAnswer('');
    setLearnFeedback(null);
    setLearnSelectedChoiceId(null);
    setLearnCorrectionPrompt(null);
    setLearnStarted(false);
    setLearnReviewMode(null);
    setLearnResetKey(key => key + 1);
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
      if (englishTypingFeedbackTimerRef.current) {
        clearTimeout(englishTypingFeedbackTimerRef.current);
        englishTypingFeedbackTimerRef.current = null;
      }
      if (matchingFeedbackTimerRef.current) {
        clearTimeout(matchingFeedbackTimerRef.current);
        matchingFeedbackTimerRef.current = null;
      }
      if (matchingCompleteTimerRef.current) {
        clearTimeout(matchingCompleteTimerRef.current);
        matchingCompleteTimerRef.current = null;
      }
      matchingCorrectFeedbackTimerRefs.current.forEach(clearTimeout);
      matchingCorrectFeedbackTimerRefs.current = [];
      if (translationFeedbackTimerRef.current) {
        clearTimeout(translationFeedbackTimerRef.current);
        translationFeedbackTimerRef.current = null;
      }
    };
  }, [exercise.id]);

  useEffect(() => {
    clearEnglishTypingFeedback();
    setTypedEnglish('');
    setTypedRecallArabic('');
    setRecallIndex(0);
    setRecallCompleted(false);
    setRecallShuffleKey(key => key + 1);
  }, [recallDirection, recallPhraseIds.join('|')]);

  useEffect(() => {
    setTranslationIndex(0);
    setTranslationFeedback(null);
    setTranslationCompleted(false);
    setTranslationDismissedChoiceIds([]);
    setTranslationAdvancing(false);
    setTranslationMutingAllChoices(false);
    setTranslationShuffleKey(key => key + 1);
  }, [translationDirection, translationPhraseIds.join('|'), practiceTextMode]);

  useEffect(() => {
    const termPhraseIds = learnShuffleTerms
      ? getRandomizedPhraseIds(learnPhraseIds)
      : [...learnPhraseIds];
    const nextQueue = [];

    if (learnQuestionTypes.matching && learnCanUseMatching) {
      nextQueue.push({ type: 'matching' });
    }

    if (learnQuestionTypes.multipleChoice) {
      termPhraseIds.forEach(phraseId => {
        nextQueue.push({ type: 'term', phraseId, questionType: 'multiple-choice' });
      });
    }

    if (learnQuestionTypes.written) {
      termPhraseIds.forEach(phraseId => {
        nextQueue.push({ type: 'term', phraseId, questionType: 'written' });
      });
    }

    if (learnQuestionTypes.arrange && learnCanUseArrange) {
      nextQueue.push({ type: 'arrange' });
    }

    setLearnQueue(nextQueue);
    setLearnCompletedIds([]);
    setLearnMissedIds([]);
    setLearnPromptCount(0);
    setLearnTotalPromptCount(nextQueue.length);
    setLearnWrittenAnswer('');
    setLearnTraceAnswer('');
    setLearnFeedback(null);
    setLearnSelectedChoiceId(null);
    setLearnCorrectionPrompt(null);
    setLearnReviewMode(null);
    setMatchingSelection(null);
    setMatchedPhraseIds([]);
    setMatchingFeedback(null);
    setArrangedPhraseIds([]);
    setArrangeChecked(false);
    setArrangeFeedback(null);
    setClozeRevealed(false);
    setMatchingShuffleKey(key => key + 1);
  }, [
    learnPhraseIds.join('|'),
    matchingPhraseIds.join('|'),
    clozePhraseIds.join('|'),
    learnCanUseMatching,
    learnCanUseArrange,
    learnShuffleTerms,
    learnQuestionTypes.multipleChoice,
    learnQuestionTypes.written,
    learnQuestionTypes.matching,
    learnQuestionTypes.arrange,
    learnResetKey
  ]);

  useLayoutEffect(() => {
    if (!isClozeActivity && !(isLearnActivity && currentLearnItemType === 'arrange')) return undefined;

    let frameId = null;
    let secondFrameId = null;
    let resizeObserver = null;
    let cancelled = false;

    function measureArrangeLayout(retries = 8) {
      if (cancelled) return;

      const answerElement = arrangeAnswerRef.current;
      const measureElement = arrangeMeasureRef.current;
      const answerWidth = Math.floor(answerElement?.getBoundingClientRect().width || 0);
      const tileWidths = {};
      const tiles = Array.from(measureElement?.querySelectorAll('.lp-arrange-measure-tile[data-phrase-id]') || []);

      if ((!answerElement || !measureElement || answerWidth <= 0 || tiles.length === 0) && retries > 0) {
        frameId = requestAnimationFrame(() => measureArrangeLayout(retries - 1));
        return;
      }

      const tileRowTops = [];
      tiles.forEach(tile => {
        const phraseId = tile.dataset.phraseId;
        if (!phraseId) return;
        const tileRect = tile.getBoundingClientRect();
        tileWidths[phraseId] = Math.ceil(tileRect.width);
        tileRowTops.push(Math.round(tileRect.top));
      });

      setArrangeAnswerWidth(width => (width === answerWidth ? width : answerWidth));
      setArrangePlannedLineCount(rowCount => {
        const nextRowCount = Math.max(1, new Set(tileRowTops).size);
        return rowCount === nextRowCount ? rowCount : nextRowCount;
      });
      setArrangePhraseWidths(widths => {
        const currentEntries = Object.entries(widths);
        const nextEntries = Object.entries(tileWidths);
        if (
          currentEntries.length === nextEntries.length
            && nextEntries.every(([phraseId, width]) => widths[phraseId] === width)
        ) {
          return widths;
        }
        return tileWidths;
      });
    }

    function scheduleArrangeLayoutMeasure() {
      if (frameId) cancelAnimationFrame(frameId);
      if (secondFrameId) cancelAnimationFrame(secondFrameId);
      frameId = requestAnimationFrame(() => {
        secondFrameId = requestAnimationFrame(measureArrangeLayout);
      });
    }

    measureArrangeLayout();
    scheduleArrangeLayoutMeasure();

    if (arrangeAnswerRef.current && arrangeMeasureRef.current) {
      resizeObserver = new ResizeObserver(scheduleArrangeLayoutMeasure);
      resizeObserver.observe(arrangeAnswerRef.current);
      resizeObserver.observe(arrangeMeasureRef.current);
    }

    document.fonts?.ready?.then(() => {
      if (!cancelled) scheduleArrangeLayoutMeasure();
    });

    window.addEventListener('resize', scheduleArrangeLayoutMeasure);
    window.visualViewport?.addEventListener('resize', scheduleArrangeLayoutMeasure);

    return () => {
      cancelled = true;
      if (frameId) cancelAnimationFrame(frameId);
      if (secondFrameId) cancelAnimationFrame(secondFrameId);
      resizeObserver?.disconnect();
      window.removeEventListener('resize', scheduleArrangeLayoutMeasure);
      window.visualViewport?.removeEventListener('resize', scheduleArrangeLayoutMeasure);
    };
  }, [
    isClozeActivity,
    isLearnActivity,
    currentLearnItemType,
    clozePhraseIds.join('|'),
    randomizedArrangePhraseIds.join('|'),
    arrangedPhraseIds.join('|'),
    arabicMode,
    arabicFontFamily,
    arabicFontWeight
  ]);

  useEffect(() => {
    if (
      !isLearnActivity
        || !learnStarted
        || learnCorrectionPrompt
        || currentLearnItemType !== 'term'
        || learnQuestionType !== 'multiple-choice'
        || learnFeedback
    ) {
      return undefined;
    }

    function handleLearnChoiceShortcut(event) {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target;
      if (
        target?.closest?.('input, textarea, select, [contenteditable="true"]')
      ) {
        return;
      }

      const choiceIndex = ['1', '2', '3', '4'].indexOf(event.key);
      if (choiceIndex === -1) return;
      const phraseId = learnChoiceIds[choiceIndex];
      if (!phraseId) return;

      event.preventDefault();
      chooseLearnChoice(phraseId);
    }

    window.addEventListener('keydown', handleLearnChoiceShortcut);
    return () => window.removeEventListener('keydown', handleLearnChoiceShortcut);
  }, [
    isLearnActivity,
    learnStarted,
    learnCorrectionPrompt,
    currentLearnItemType,
    learnQuestionType,
    learnFeedback,
    learnChoiceIds.join('|'),
    currentLearnPhraseId
  ]);

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
    if ((!isMatchingActivity && !(isLearnActivity && currentLearnItemType === 'matching')) || !matchingGridRef.current) return undefined;

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
  }, [isMatchingActivity, isLearnActivity, currentLearnItemType, matchingPhraseIds.join('|'), shuffledMatchingTranslations.join('|'), shuffledMatchingArabic.join('|'), arabicFontFamily, arabicFontWeight, arabicMode]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(LEARN_SETTINGS_STORAGE_KEY, JSON.stringify({
      shuffleTerms: learnShuffleTerms,
      multipleChoiceAnswerWith: learnMultipleChoiceAnswerWith,
      writtenAnswerWith: learnWrittenAnswerWith,
      englishDisplayMode: learnEnglishDisplayMode,
      questionTypes: learnQuestionTypes
    }));
  }, [
    learnShuffleTerms,
    learnMultipleChoiceAnswerWith,
    learnWrittenAnswerWith,
    learnEnglishDisplayMode,
    learnQuestionTypes
  ]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(LEARN_SETTINGS_OPEN_STORAGE_KEY, String(learnSettingsOpen));
  }, [learnSettingsOpen]);

  useEffect(() => {
    if (!isLearnActivity) return;
    const nextQuestionTypes = {
      ...learnQuestionTypes,
      matching: learnQuestionTypes.matching && learnCanUseMatching,
      arrange: learnQuestionTypes.arrange && learnCanUseArrange
    };
    if (!nextQuestionTypes.multipleChoice && !nextQuestionTypes.written && !nextQuestionTypes.matching && !nextQuestionTypes.arrange) {
      nextQuestionTypes.multipleChoice = learnPhraseIds.length > 0;
      nextQuestionTypes.written = learnPhraseIds.length > 0;
    }
    if (
      nextQuestionTypes.multipleChoice !== learnQuestionTypes.multipleChoice
      || nextQuestionTypes.written !== learnQuestionTypes.written
      || nextQuestionTypes.matching !== learnQuestionTypes.matching
      || nextQuestionTypes.arrange !== learnQuestionTypes.arrange
    ) {
      setLearnQuestionTypes(nextQuestionTypes);
    }
  }, [isLearnActivity, learnPhraseIds.length, learnCanUseMatching, learnCanUseArrange]);

  useEffect(() => {
    if (!isLearnActivity || !learnStarted) return undefined;
    document.documentElement.classList.add('lp-learn-session-active');
    window.scrollTo({ top: 0, left: 0 });
    return () => {
      document.documentElement.classList.remove('lp-learn-session-active');
    };
  }, [isLearnActivity, learnStarted]);

  useEffect(() => {
    if (!isLearnActivity || !learnStarted) return;
    window.scrollTo({ top: 0, left: 0 });
  }, [isLearnActivity, learnStarted, learnPromptCount, currentLearnItemType, Boolean(learnCorrectionPrompt)]);

  useEffect(() => {
    if (!isLearnActivity || !learnStarted) return undefined;
    if (typeof window === 'undefined' || !window.matchMedia('(min-width: 681px)').matches) return undefined;
    const input = learnCorrectionPrompt
      ? learnTraceInputRef.current
      : currentLearnItemType === 'term' && learnQuestionType === 'written' && !learnFeedback
        ? learnWrittenInputRef.current
        : null;
    if (!input) return undefined;
    const frameId = window.requestAnimationFrame(() => {
      input.focus({ preventScroll: true });
    });
    return () => window.cancelAnimationFrame(frameId);
  }, [
    isLearnActivity,
    learnStarted,
    learnCorrectionPrompt,
    currentLearnItemType,
    learnQuestionType,
    learnFeedback,
    learnPromptCount
  ]);

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

  function clearEnglishTypingFeedback() {
    if (englishTypingFeedbackTimerRef.current) {
      clearTimeout(englishTypingFeedbackTimerRef.current);
      englishTypingFeedbackTimerRef.current = null;
    }
    setEnglishTypingFeedback(null);
  }

  function clearMatchingFeedback() {
    if (matchingFeedbackTimerRef.current) {
      clearTimeout(matchingFeedbackTimerRef.current);
      matchingFeedbackTimerRef.current = null;
    }
    if (matchingCompleteTimerRef.current) {
      clearTimeout(matchingCompleteTimerRef.current);
      matchingCompleteTimerRef.current = null;
    }
    matchingCorrectFeedbackTimerRefs.current.forEach(clearTimeout);
    matchingCorrectFeedbackTimerRefs.current = [];
    setMatchingCorrectFeedbackIds([]);
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
          className={`lp-arrange-activity${arrangeFeedback ? ` ${arrangeFeedback}` : ''}`}
          dir="ltr"
          style={{
            '--arrange-answer-lines': arrangeAnswerLineCount
          }}
        >
          <div
            className="lp-arrange-measure"
            ref={arrangeMeasureRef}
            aria-hidden="true"
            dir="rtl"
            style={{
              fontFamily: arabicFontFamily,
              fontWeight: arabicFontWeight
            }}
          >
            {clozePhraseIds.map(phraseId => {
              const phrase = phrases[phraseId];
              if (!phrase) return null;
              return (
                <span className="lp-arrange-measure-tile" data-phrase-id={phraseId} key={`measure-${phraseId}`}>
                  {getArabicText(phrase, arabicMode)}
                </span>
              );
            })}
          </div>
          <SortableContext items={arrangedPhraseIds} strategy={rectSortingStrategy}>
            <ArrangeAnswerDropzone
              arabicFontFamily={arabicFontFamily}
              arabicFontWeight={arabicFontWeight}
              containerRef={arrangeAnswerRef}
            >
              {Array.from({ length: arrangeAnswerLineCount }, (_, rowIndex) => {
                const row = arrangeRows[rowIndex] || { phrases: [], startIndex: 0 };
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
          <div className="lp-arrange-bank" ref={arrangeBankRef}>
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
            {arrangeChecked && !arrangementCorrect && (
              <div className="lp-arrange-result incorrect" aria-live="polite">
                Not quite yet
              </div>
            )}
            <button
              type="button"
              className="lp-activity-button lp-activity-submit"
              onClick={() => {
                setArrangeChecked(true);
                const nextFeedback = arrangementCorrect ? 'correct' : 'incorrect';
                setArrangeFeedback(nextFeedback);
                if (arrangeFeedbackTimerRef.current) clearTimeout(arrangeFeedbackTimerRef.current);
                arrangeFeedbackTimerRef.current = setTimeout(() => {
                  arrangeFeedbackTimerRef.current = null;
                  if (currentLearnItemType === 'arrange' && nextFeedback === 'correct') {
                    completeCurrentLearnReview();
                    return;
                  }
                  setArrangeFeedback(null);
                  setArrangeChecked(false);
                }, nextFeedback === 'correct' ? ARRANGE_CORRECT_FEEDBACK_MS : ARRANGE_INCORRECT_FEEDBACK_MS);
              }}
              disabled={arrangedPhraseIds.length === 0 || Boolean(arrangeFeedback)}
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
            aria-label="Trace the Arabic"
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

  function renderTypeEnglishActivity() {
    const isArabicToEnglish = recallDirection === 'arabic-to-english';
    const recallInputId = `type-english-${exercise.id}`;
    const recallAnswerValue = isArabicToEnglish ? typedEnglish : typedRecallArabic;
    const recallAnswerCorrect = isArabicToEnglish ? typedEnglishCorrect : typedRecallArabicCorrect;
    const recallProgressText = recallPromptIds.length > 0
      ? `${Math.min(recallIndex + 1, recallPromptIds.length)} / ${recallPromptIds.length}`
      : '0 / 0';
    const recallPromptText = isArabicToEnglish
      ? getArabicText(currentRecallPhrase, arabicMode)
      : currentRecallPhrase?.translation || currentRecallPhrase?.literal || '';

    function updateRecallDirection(direction) {
      clearEnglishTypingFeedback();
      setRecallDirection(direction);
    }

    function resetRecallPractice() {
      clearEnglishTypingFeedback();
      setTypedEnglish('');
      setTypedRecallArabic('');
      setRecallCompleted(false);
      setRecallIndex(0);
      setRecallShuffleKey(key => key + 1);
    }

    function submitRecallAnswer() {
      clearEnglishTypingFeedback();
      setEnglishTypingFeedback(recallAnswerCorrect ? 'correct' : 'incorrect');
      englishTypingFeedbackTimerRef.current = setTimeout(() => {
        setEnglishTypingFeedback(null);
        englishTypingFeedbackTimerRef.current = null;
        if (!recallAnswerCorrect) return;
        setTypedEnglish('');
        setTypedRecallArabic('');
        if (recallIndex >= recallPromptIds.length - 1) {
          setRecallCompleted(true);
          return;
        }
        setRecallIndex(index => index + 1);
      }, recallAnswerCorrect ? TRANSLATION_CORRECT_FEEDBACK_MS : TRANSLATION_INCORRECT_FEEDBACK_MS);
    }

    if (!currentRecallPhrase || recallPromptIds.length === 0) {
      return (
        <div className="lp-type-english-activity" dir="ltr">
          <div className="lp-cloze-prompt">This exercise needs at least one phrase with Arabic and English text.</div>
        </div>
      );
    }

    return (
      <div className="lp-type-english-activity" dir="ltr">
        <div className="lp-translation-header">
          <div className="lp-segmented-control lp-translation-direction" role="group" aria-label="Recall direction">
            <button
              type="button"
              className={isArabicToEnglish ? 'active' : ''}
              aria-pressed={isArabicToEnglish}
              onClick={() => updateRecallDirection('arabic-to-english')}
            >
              Arabic to English
            </button>
            <button
              type="button"
              className={!isArabicToEnglish ? 'active' : ''}
              aria-pressed={!isArabicToEnglish}
              onClick={() => updateRecallDirection('english-to-arabic')}
            >
              English to Arabic
            </button>
          </div>
          <div className="lp-translation-progress">{recallCompleted ? 'Done' : recallProgressText}</div>
        </div>

        {recallCompleted ? (
          <div className="lp-translation-complete">
            <div>Complete</div>
            <button
              type="button"
              className="lp-activity-button lp-activity-submit"
              onClick={resetRecallPractice}
            >
              Practice again
            </button>
          </div>
        ) : (
          <>
            <label className="lp-type-arabic-label" htmlFor={recallInputId}>
              {isArabicToEnglish ? 'Type the English' : 'Type the Arabic'}
            </label>
            <div
              className={`lp-type-english-prompt${isArabicToEnglish ? '' : ' lp-type-english-prompt-ltr'}`}
              dir={isArabicToEnglish ? 'rtl' : 'ltr'}
              lang={isArabicToEnglish ? 'ar' : 'en'}
              style={isArabicToEnglish ? {
                fontFamily: arabicFontFamily,
                fontWeight: arabicFontWeight
              } : undefined}
            >
              {recallPromptText}
            </div>
            <textarea
              id={recallInputId}
              className={`lp-type-english-input${englishTypingFeedback ? ` ${englishTypingFeedback}` : ''}`}
              value={recallAnswerValue}
              onChange={event => {
                if (isArabicToEnglish) {
                  setTypedEnglish(event.target.value);
                } else {
                  setTypedRecallArabic(event.target.value);
                }
                clearEnglishTypingFeedback();
              }}
              dir={isArabicToEnglish ? 'ltr' : 'rtl'}
              lang={isArabicToEnglish ? 'en' : 'ar'}
              spellCheck={isArabicToEnglish}
              autoCapitalize={isArabicToEnglish ? 'sentences' : 'none'}
              autoCorrect={isArabicToEnglish ? undefined : 'off'}
              rows={2}
              style={!isArabicToEnglish ? {
                fontFamily: arabicFontFamily,
                fontWeight: arabicFontWeight
              } : undefined}
            />
            <div className="lp-activity-actions lp-type-arabic-actions">
              <button
                type="button"
                className="lp-activity-button lp-activity-submit"
                onClick={submitRecallAnswer}
                disabled={!recallAnswerValue.trim() || Boolean(englishTypingFeedback)}
              >
                Submit
              </button>
            </div>
          </>
        )}
      </div>
    );
  }

  function renderTranslationDirectionActivity() {
    const currentPhraseId = translationPromptIds[translationIndex] || translationPromptIds[0];
    const currentPhrase = phrases[currentPhraseId];
    const isArabicPrompt = translationDirection === 'arabic-to-meaning';
    const textModeLabel = practiceTextMode === 'translation' ? 'translation' : 'literal';
    const promptText = isArabicPrompt ? getArabicText(currentPhrase, arabicMode) : getPhraseTextForMode(currentPhrase, practiceTextMode);
    const promptLabel = isArabicPrompt ? `Choose the ${textModeLabel}` : 'Choose the Arabic';
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
              Arabic to English
            </button>
            <button
              type="button"
              className={translationDirection === 'meaning-to-arabic' ? 'active' : ''}
              onClick={() => {
                clearTranslationFeedback();
                setTranslationDirection('meaning-to-arabic');
              }}
            >
              English to Arabic
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
                    {isArabicChoice ? getArabicText(phrase, arabicMode) : getPhraseTextForMode(phrase, practiceTextMode)}
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>
    );
  }

  function renderLearnActivity() {
    const totalTerms = learnPhraseIds.length;
    const totalPrompts = Math.max(learnTotalPromptCount, learnPromptCount + learnQueue.length, 1);
    const completedCount = Math.min(learnPromptCount, totalPrompts);
    const progressText = `${completedCount} / ${totalPrompts}`;
    const correctionDirection = learnCorrectionPrompt?.direction || learnDirection;
    const correctionAnswer = learnCorrectionPrompt?.answer || '';
    const correctionPhrase = phrases[learnCorrectionPrompt?.phraseId];
    const correctionArabic = correctionDirection === 'english-to-arabic';
    const correctionTranslation = correctionPhrase?.translation?.trim() || '';
    const correctionLiteral = correctionPhrase?.literal?.trim() || '';
    const showEnglishCorrectionAnswers = !correctionArabic
      && correctionTranslation
      && correctionLiteral
      && normalizeEnglishTypingValue(correctionTranslation) !== normalizeEnglishTypingValue(correctionLiteral);
    const isArabicPrompt = learnDirection === 'arabic-to-english';
    const isArabicAnswer = learnDirection === 'english-to-arabic';
    const isLearnRetryPrompt = Boolean(currentLearnItem?.review)
      || (Boolean(currentLearnPhraseId)
      && learnMissedIds.includes(currentLearnPhraseId)
      && !learnCompletedIds.includes(currentLearnPhraseId));
    const traceComplete = Boolean(correctionAnswer)
      && isLearnAnswerCorrect(learnTraceAnswer, correctionPhrase, correctionDirection);

    function resetLearnSession() {
      setLearnReviewMode(null);
      setLearnResetKey(key => key + 1);
    }

    function startLearnSession() {
      setLearnReviewMode(null);
      resetLearnSession();
      setLearnStarted(true);
    }

    function returnToLearnSetup() {
      setLearnStarted(false);
      setLearnReviewMode(null);
      resetLearnSession();
    }

    function startLearnReview(mode) {
      setLearnStarted(true);
      setLearnReviewMode(mode);
      setMatchingSelection(null);
      setMatchedPhraseIds([]);
      setMatchingCorrectFeedbackIds([]);
      setMatchingFeedback(null);
      setArrangedPhraseIds([]);
      setArrangeChecked(false);
      setArrangeFeedback(null);
      setClozeRevealed(false);
    }

    function renderLearnReview() {
      if (learnReviewMode === 'matching') {
        return (
          <div className="lp-learn-activity lp-learn-session" dir="ltr">
            {renderLearnSessionHeader()}
            <div className="lp-learn-review">
              <div className="lp-learn-review-heading">Matching review</div>
              {renderMatchingActivity()}
              <div className="lp-learn-review-actions">
                <button type="button" className="lp-activity-button" onClick={() => setLearnReviewMode(null)}>
                  Back to Comprehension
                </button>
              </div>
            </div>
          </div>
        );
      }

      if (learnReviewMode === 'arrange') {
        return (
          <div className="lp-learn-activity lp-learn-session" dir="ltr">
            {renderLearnSessionHeader()}
            <div className="lp-learn-review">
              <div className="lp-learn-review-heading">Arrange review</div>
              {renderArrangeActivity()}
              <div className="lp-learn-review-actions">
                <button type="button" className="lp-activity-button" onClick={() => setLearnReviewMode(null)}>
                  Back to Comprehension
                </button>
              </div>
            </div>
          </div>
        );
      }

      return null;
    }

    function isLearnAnswerCorrect(answer, phrase, direction) {
      if (!phrase) return false;
      if (direction === 'english-to-arabic') {
        return normalizeArabicTypingValue(answer) === normalizeArabicTypingValue(getArabicText(phrase, arabicMode));
      }
      const normalizedAnswer = normalizeEnglishTypingValue(answer);
      const comparableAnswer = normalizeEnglishAnswerForComparison(answer);
      return Boolean(normalizedAnswer) && getPhraseEnglishAnswers(phrase).some(option => (
        comparableAnswer === normalizeEnglishAnswerForComparison(option)
      ));
    }

    function submitLearnWritten() {
      const isCorrect = isLearnAnswerCorrect(learnWrittenAnswer, currentLearnPhrase, learnDirection);
      if (isCorrect) {
        setLearnFeedback('correct');
        window.setTimeout(() => moveCurrentLearnTerm(true), TRANSLATION_CORRECT_FEEDBACK_MS);
        return;
      }
      setLearnFeedback('incorrect');
      setLearnCorrectionPrompt({
        phraseId: currentLearnPhraseId,
        prompt: learnPromptValue,
        answer: learnAnswerValue,
        direction: learnDirection
      });
    }

    function revealLearnWrittenAnswer() {
      if (learnFeedback) return;
      setLearnFeedback('incorrect');
      setLearnCorrectionPrompt({
        phraseId: currentLearnPhraseId,
        prompt: learnPromptValue,
        answer: learnAnswerValue,
        direction: learnDirection
      });
    }

    function finishCorrection() {
      setLearnCorrectionPrompt(null);
      moveCurrentLearnTerm(false);
    }

    function setOnlyAvailableQuestionTypes(nextTypes) {
      if (!nextTypes.multipleChoice && !nextTypes.written && !nextTypes.matching && !nextTypes.arrange) return;
      setLearnQuestionTypes(nextTypes);
      resetLearnSession();
    }

    function toggleLearnAnswerMode(currentMode, value) {
      if (currentMode === 'both') return value === 'english' ? 'arabic' : 'english';
      if (currentMode === value) return null;
      return currentMode && currentMode !== value ? 'both' : value;
    }

    function chooseLearnMultipleChoiceAnswerMode(value) {
      const nextMode = toggleLearnAnswerMode(
        learnQuestionTypes.multipleChoice ? learnMultipleChoiceAnswerWith : null,
        value
      );
      if (!nextMode) {
        setOnlyAvailableQuestionTypes({
          ...learnQuestionTypes,
          multipleChoice: false
        });
        return;
      }

      setLearnMultipleChoiceAnswerWith(nextMode);
      setOnlyAvailableQuestionTypes({
        ...learnQuestionTypes,
        multipleChoice: true
      });
    }

    function chooseLearnWrittenAnswerMode(value) {
      const nextMode = toggleLearnAnswerMode(
        learnQuestionTypes.written ? learnWrittenAnswerWith : null,
        value
      );
      if (!nextMode) {
        setOnlyAvailableQuestionTypes({
          ...learnQuestionTypes,
          written: false
        });
        return;
      }

      setLearnWrittenAnswerWith(nextMode);
      setOnlyAvailableQuestionTypes({
        ...learnQuestionTypes,
        written: true
      });
    }

    function toggleLearnReviewType(type) {
      if (!['matching', 'arrange'].includes(type)) return;
      if (type === 'matching' && !learnCanUseMatching) return;
      if (type === 'arrange' && !learnCanUseArrange) return;
      setOnlyAvailableQuestionTypes({
        ...learnQuestionTypes,
        [type]: !learnQuestionTypes[type]
      });
    }

    function renderLearnSessionHeader() {
      const progressPercent = totalPrompts > 0 ? Math.round((completedCount / totalPrompts) * 100) : 0;
      return (
        <div className="lp-learn-session-header">
          <StudyWorkspaceHeader
            title="Comprehension"
            subtitle={progressText}
            className="lp-learn-topbar"
            actions={(
              <button type="button" className="lp-learn-ghost-button" onClick={returnToLearnSetup}>
                Settings
              </button>
            )}
          />
          <div
            className={`lp-learn-progress-rail${completedCount === totalPrompts ? ' complete' : ''}`}
            aria-label={`Comprehension progress ${progressText}`}
            style={{ '--learn-progress-position': `${progressPercent}%` }}
          >
            <div className="lp-learn-progress-fill" style={{ width: `${progressPercent}%` }} />
            <div className="lp-learn-progress-count">{completedCount}</div>
            <div className="lp-learn-progress-total">{totalPrompts}</div>
          </div>
        </div>
      );
    }

    if (totalTerms === 0) {
      return (
        <div className="lp-learn-activity" dir="ltr">
          <div className="lp-cloze-prompt">This exercise needs at least one phrase with Arabic and English text.</div>
        </div>
      );
    }

    if (learnReviewMode) {
      return renderLearnReview();
    }

    function renderLearnPhrases() {
      return (
        <section className="lp-learn-phrases" aria-labelledby="lp-learn-phrases-title">
          <div className="lp-learn-settings-section-title" id="lp-learn-phrases-title">Phrases</div>
          <div className="lp-study-home-phrase-list">
            {learnPhraseIds.map(phraseId => {
              const phrase = phrases[phraseId];
              return (
                <div className="lp-study-home-phrase" key={phraseId}>
                  <span className="lp-study-home-phrase-arabic" dir="rtl">
                    <LiturgyLine
                      line={[{ id: phraseId }]}
                      arabicMode={arabicMode}
                      speechRate={speechRate}
                      arabicFontFamily={arabicFontFamily}
                      arabicFontWeight={arabicFontWeight}
                      arabicFontSize={arabicFontSize}
                    />
                  </span>
                  <span className="lp-study-home-phrase-meaning">
                    {getLearnTextAnswer(phrase, learnEnglishDisplayMode)}
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      );
    }

    if (!learnStarted) {
      return (
        <div className="lp-learn-activity lp-learn-setup" dir="ltr">
          <StudyWorkspaceHeader
            title="Comprehension"
            className="lp-learn-topbar"
            actions={(
              <div className="lp-learn-start-actions">
                <button type="button" className="lp-activity-button lp-activity-submit" onClick={startLearnSession}>
                  Start
                </button>
              </div>
            )}
          />
          <details
            className="lp-learn-settings"
            open={learnSettingsOpen}
            onToggle={event => setLearnSettingsOpen(event.currentTarget.open)}
          >
            <summary className="lp-learn-settings-summary">
              <span>Activity mix</span>
              <span>{learnSettingsOpen ? 'Hide' : 'Edit'}</span>
            </summary>
            <div className="lp-learn-answer-settings">
              <div className="lp-learn-settings-section">
                <div className="lp-learn-activity-mix">
                  <div className="lp-learn-setting-group lp-learn-settings-panel">
                    <span className="lp-learn-setting-label">Shuffle phrases</span>
                    <label className="lp-mode-toggle lp-learn-setting-toggle" aria-label="Shuffle phrases">
                      <input
                        type="checkbox"
                        checked={learnShuffleTerms}
                        onChange={event => {
                          setLearnShuffleTerms(event.target.checked);
                          resetLearnSession();
                        }}
                      />
                      <span className="lp-mode-switch" aria-hidden="true" />
                    </label>
                  </div>
                  <div className="lp-learn-settings-panel-grid">
                    <div className={learnQuestionTypes.multipleChoice ? "lp-learn-setting-group lp-learn-settings-panel" : "lp-learn-setting-group lp-learn-settings-panel disabled"}>
                      <span className="lp-learn-setting-label">Multiple choice</span>
                      <div className="lp-segmented-control" role="group" aria-label="Multiple choice answers">
                        {[
                          ['english', 'English'],
                          ['arabic', 'Arabic']
                        ].map(([value, label]) => (
                          <button
                            key={value}
                            type="button"
                            className={learnQuestionTypes.multipleChoice && (learnMultipleChoiceAnswerWith === value || learnMultipleChoiceAnswerWith === 'both') ? 'active' : ''}
                            aria-pressed={learnQuestionTypes.multipleChoice && (learnMultipleChoiceAnswerWith === value || learnMultipleChoiceAnswerWith === 'both')}
                            onClick={() => chooseLearnMultipleChoiceAnswerMode(value)}
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className={learnQuestionTypes.written ? "lp-learn-setting-group lp-learn-settings-panel" : "lp-learn-setting-group lp-learn-settings-panel disabled"}>
                      <span className="lp-learn-setting-label">Written</span>
                      <div className="lp-segmented-control" role="group" aria-label="Written answers">
                        {[
                          ['english', 'English'],
                          ['arabic', 'Arabic']
                        ].map(([value, label]) => (
                          <button
                            key={value}
                            type="button"
                            className={learnQuestionTypes.written && (learnWrittenAnswerWith === value || learnWrittenAnswerWith === 'both') ? 'active' : ''}
                            aria-pressed={learnQuestionTypes.written && (learnWrittenAnswerWith === value || learnWrittenAnswerWith === 'both')}
                            onClick={() => chooseLearnWrittenAnswerMode(value)}
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  {(learnCanUseMatching || learnCanUseArrange) && (
                    <div
                      className={
                        (learnQuestionTypes.matching && learnCanUseMatching)
                          || (learnQuestionTypes.arrange && learnCanUseArrange)
                          ? "lp-learn-setting-group lp-learn-settings-panel"
                          : "lp-learn-setting-group lp-learn-settings-panel disabled"
                      }
                    >
                      <span className="lp-learn-setting-label">Blocks</span>
                      <div className="lp-learn-review-buttons">
                        {learnCanUseMatching && (
                          <button
                            type="button"
                            className={`lp-activity-button${learnQuestionTypes.matching ? ' active' : ''}`}
                            aria-pressed={learnQuestionTypes.matching}
                            onClick={() => toggleLearnReviewType('matching')}
                          >
                            <span>Matching</span>
                          </button>
                        )}
                        {learnCanUseArrange && (
                          <button
                            type="button"
                            className={`lp-activity-button${learnQuestionTypes.arrange ? ' active' : ''}`}
                            aria-pressed={learnQuestionTypes.arrange}
                            onClick={() => toggleLearnReviewType('arrange')}
                          >
                            <span>Arrange</span>
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="lp-learn-settings-section">
                <div className="lp-learn-settings-section-title">Display</div>
                <div className="lp-learn-setting-group lp-learn-settings-panel">
                  <span className="lp-learn-setting-label">English captions</span>
                  <div className="lp-segmented-control" role="group" aria-label="English display">
                    {[
                      ['translation', 'Translation'],
                      ['literal', 'Literal']
                    ].map(([value, label]) => (
                      <button
                        key={value}
                        type="button"
                        className={learnEnglishDisplayMode === value ? 'active' : ''}
                        onClick={() => {
                          setLearnEnglishDisplayMode(value);
                          resetLearnSession();
                        }}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </details>
          {renderLearnPhrases()}
        </div>
      );
    }

    if (currentLearnItemType === 'matching') {
      return (
        <div className="lp-learn-activity lp-learn-session" dir="ltr">
          {renderLearnSessionHeader()}
          <div
            className="lp-learn-question-frame"
            key={`learn-matching:${learnPromptCount}`}
          >
            <div className="lp-learn-review">
              <div>
                <div className="lp-learn-card-label">Match the pairs</div>
                <div className="lp-learn-review-subtitle">Connect each Arabic phrase with its English meaning.</div>
              </div>
              {renderMatchingActivity()}
            </div>
          </div>
        </div>
      );
    }

    if (currentLearnItemType === 'arrange') {
      return (
        <div className="lp-learn-activity lp-learn-session" dir="ltr">
          {renderLearnSessionHeader()}
          <div
            className="lp-learn-question-frame"
            key={`learn-arrange:${learnPromptCount}`}
          >
            <div className="lp-learn-review">
              <div>
                <div className="lp-learn-card-label">Arrange the phrase</div>
                <div className="lp-learn-review-subtitle">Build the Arabic line in order.</div>
              </div>
              {renderArrangeActivity()}
            </div>
          </div>
        </div>
      );
    }

    if (!currentLearnItem) {
      const repeatedTermCount = learnMissedIds.length;
      const completionSummary = repeatedTermCount === 0
        ? 'Clean run. No phrases needed a repeat.'
        : `${repeatedTermCount} phrase${repeatedTermCount === 1 ? '' : 's'} repeated and reinforced.`;

      return (
        <div className="lp-learn-activity lp-learn-session" dir="ltr">
          {renderLearnSessionHeader()}
          <div className="lp-learn-complete">
            <div className="lp-learn-complete-mark" aria-hidden="true">✓</div>
            <div className="lp-learn-complete-copy">
              <div className="lp-learn-complete-kicker">Comprehension session</div>
              <div className="lp-learn-complete-title">Complete</div>
              <div className="lp-learn-complete-stats">{completionSummary}</div>
            </div>
            <div className="lp-learn-complete-metrics" aria-label="Session results">
              <div className="lp-learn-complete-metric">
                <strong>{totalTerms}</strong>
                <span>phrases</span>
              </div>
              <div className="lp-learn-complete-metric">
                <strong>{repeatedTermCount}</strong>
                <span>repeated</span>
              </div>
            </div>
            <div className="lp-learn-complete-actions">
              <button type="button" className="lp-activity-button lp-activity-submit" onClick={resetLearnSession}>
                Practice again
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (learnCorrectionPrompt) {
      return (
        <div className="lp-learn-activity lp-learn-session lp-learn-correction" dir="ltr">
          {renderLearnSessionHeader()}
          <div className="lp-learn-correction-stage">
            <div
              className={`lp-learn-prompt-text${correctionDirection === 'arabic-to-english' ? ' arabic' : ''}`}
              dir={correctionDirection === 'arabic-to-english' ? 'rtl' : 'ltr'}
              style={correctionDirection === 'arabic-to-english' ? {
                fontFamily: arabicFontFamily,
                fontWeight: arabicFontWeight
              } : undefined}
            >
              {learnCorrectionPrompt.prompt}
            </div>
          </div>
          <label className="lp-learn-trace-label" htmlFor={`learn-trace-${exercise.id}`}>Retype correct answer</label>
          {showEnglishCorrectionAnswers && (
            <div className="lp-learn-correction-answers" aria-label="Accepted English answers">
              <div>
                <span>Translation</span>
                <strong>{correctionTranslation}</strong>
              </div>
              <div>
                <span>Literal</span>
                <strong>{correctionLiteral}</strong>
              </div>
            </div>
          )}
          <div className="lp-learn-trace-row">
            <div className="lp-learn-trace-copybox">
              <textarea
                className="lp-learn-trace-ghost"
                value={correctionAnswer}
                readOnly
                aria-hidden="true"
                tabIndex={-1}
                rows={1}
                ref={learnTraceGhostRef}
                dir={correctionArabic ? 'rtl' : 'ltr'}
                lang={correctionArabic ? 'ar' : 'en'}
                style={correctionArabic ? {
                  fontFamily: arabicFontFamily,
                  fontWeight: arabicFontWeight
                } : undefined}
              />
              <textarea
                id={`learn-trace-${exercise.id}`}
                className="lp-learn-written-input lp-learn-trace-input"
                value={learnTraceAnswer}
                ref={learnTraceInputRef}
                onChange={event => {
                  setLearnTraceAnswer(event.target.value);
                  requestAnimationFrame(() => {
                    if (learnTraceInputRef.current) learnTraceInputRef.current.scrollTop = 0;
                    if (learnTraceGhostRef.current) learnTraceGhostRef.current.scrollTop = 0;
                  });
                }}
                onScroll={() => {
                  if (!learnTraceInputRef.current || !learnTraceGhostRef.current) return;
                  learnTraceInputRef.current.scrollTop = 0;
                  learnTraceGhostRef.current.scrollTop = 0;
                }}
                onKeyDown={event => {
                  if (event.key !== 'Enter' || event.shiftKey || !traceComplete) return;
                  event.preventDefault();
                  finishCorrection();
                }}
                enterKeyHint="done"
                rows={1}
                dir={correctionArabic ? 'rtl' : 'ltr'}
                lang={correctionArabic ? 'ar' : 'en'}
                spellCheck={!correctionArabic}
                autoCapitalize="none"
                autoCorrect="off"
                style={correctionArabic ? {
                  fontFamily: arabicFontFamily,
                  fontWeight: arabicFontWeight
                } : undefined}
              />
            </div>
            <button type="button" className="lp-learn-skip" onClick={finishCorrection}>Skip</button>
            <button
              type="button"
              className="lp-activity-button lp-activity-submit"
              onClick={finishCorrection}
              disabled={!traceComplete}
            >
              Continue
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="lp-learn-activity lp-learn-session" dir="ltr">
        {renderLearnSessionHeader()}
        <div
          className={[
            'lp-learn-question-frame',
            learnFeedback ? `answered ${learnFeedback}` : ''
          ].filter(Boolean).join(' ')}
          key={`${currentLearnPhraseId}:${learnPromptCount}:${learnQuestionType}:${learnDirection}`}
        >
          <div className="lp-learn-card">
            <div className="lp-learn-card-meta">
              {isLearnRetryPrompt && <div className="lp-learn-retry-tag">Let's try again</div>}
            </div>
            <div
              className={`lp-learn-prompt-text${isArabicPrompt ? ' arabic' : ''}`}
              dir={isArabicPrompt ? 'rtl' : 'ltr'}
              style={isArabicPrompt ? {
                fontFamily: arabicFontFamily,
                fontWeight: arabicFontWeight
              } : undefined}
            >
              {learnPromptValue}
            </div>
          </div>
          {learnQuestionType === 'written' ? (
            <div className="lp-learn-written">
              <div className="lp-learn-card-label">Type the answer</div>
              <textarea
                className={`lp-learn-written-input${learnFeedback ? ` ${learnFeedback}` : ''}`}
                value={learnWrittenAnswer}
                ref={learnWrittenInputRef}
                onChange={event => {
                  setLearnWrittenAnswer(event.target.value);
                  setLearnFeedback(null);
                }}
                onKeyDown={event => {
                  if (event.key !== 'Enter' || event.shiftKey || !learnWrittenAnswer.trim() || learnFeedback) return;
                  event.preventDefault();
                  submitLearnWritten();
                }}
                enterKeyHint="done"
                rows={2}
                dir={isArabicAnswer ? 'rtl' : 'ltr'}
                lang={isArabicAnswer ? 'ar' : 'en'}
                spellCheck={!isArabicAnswer}
                style={isArabicAnswer ? {
                  fontFamily: arabicFontFamily,
                  fontWeight: arabicFontWeight
                } : undefined}
              />
              <div className="lp-activity-actions lp-type-arabic-actions">
                <button
                  type="button"
                  className="lp-activity-button lp-learn-dont-know"
                  onClick={revealLearnWrittenAnswer}
                  disabled={Boolean(learnFeedback)}
                >
                  Don&apos;t know
                </button>
                <button
                  type="button"
                  className="lp-activity-button lp-activity-submit"
                  onClick={submitLearnWritten}
                  disabled={!learnWrittenAnswer.trim() || Boolean(learnFeedback)}
                >
                  Submit
                </button>
              </div>
            </div>
          ) : (
            <div className="lp-learn-options">
              <div className="lp-learn-card-label">Choose the answer</div>
              {learnChoiceIds.map((phraseId, choiceIndex) => {
                const phrase = phrases[phraseId];
                const choiceText = isArabicAnswer
                  ? getArabicText(phrase, arabicMode)
                  : getLearnTextAnswer(phrase, learnEnglishDisplayMode);
                return (
                  <button
                    type="button"
                    key={`learn-${currentLearnPhraseId}-${phraseId}`}
                    className={[
                      'lp-learn-choice',
                      isArabicAnswer ? 'arabic' : 'translation',
                      learnFeedback && phraseId === currentLearnPhraseId ? 'correct' : '',
                      learnFeedback === 'incorrect' && phraseId === currentLearnPhraseId ? 'demonstrated' : '',
                      learnFeedback === 'incorrect' && phraseId === learnSelectedChoiceId && phraseId !== currentLearnPhraseId ? 'incorrect' : '',
                      learnFeedback === 'incorrect' && phraseId !== currentLearnPhraseId && phraseId !== learnSelectedChoiceId ? 'muted' : ''
                    ].filter(Boolean).join(' ')}
                    onClick={() => chooseLearnChoice(phraseId)}
                    disabled={Boolean(learnFeedback)}
                    dir={isArabicAnswer ? 'rtl' : 'ltr'}
                    style={{
                      '--learn-choice-index': choiceIndex,
                      ...(isArabicAnswer ? {
                        fontFamily: arabicFontFamily,
                        fontWeight: arabicFontWeight
                      } : {})
                    }}
                  >
                    {choiceText}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  function renderMatchingActivity() {
    function getCardClass(side, phraseId) {
      const isMatched = matchedPhraseIdSet.has(phraseId);
      const isSelected = matchingSelection?.side === side && matchingSelection?.phraseId === phraseId;
      const isIncorrectFeedback = matchingFeedback?.state === 'incorrect'
        && matchingFeedback.cards.some(card => card.side === side && card.phraseId === phraseId)
      const isCorrectFeedback = matchingCorrectFeedbackIds.includes(phraseId);
      return [
        'lp-matching-card',
        side === 'arabic' ? 'arabic' : 'translation',
        isSelected ? 'selected' : '',
        isMatched ? 'matched' : '',
        isCorrectFeedback ? 'correct' : '',
        isIncorrectFeedback ? 'incorrect' : ''
      ].filter(Boolean).join(' ');
    }

    function chooseMatch(side, phraseId) {
      if (matchedPhraseIdSet.has(phraseId) || matchingFeedback?.state === 'incorrect') return;
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
      setMatchingSelection(null);
      if (correct) {
        setMatchedPhraseIds(ids => {
          const nextIds = ids.includes(phraseId) ? ids : ids.concat(phraseId);
          if (
            currentLearnItemType === 'matching'
            && nextIds.length === matchingPhraseIds.length
            && matchingPhraseIds.length > 0
            && !matchingCompleteTimerRef.current
          ) {
            matchingCompleteTimerRef.current = window.setTimeout(() => {
              matchingCompleteTimerRef.current = null;
              completeCurrentLearnReview();
            }, MATCHING_COMPLETE_FEEDBACK_MS);
          }
          return nextIds;
        });
        setMatchingCorrectFeedbackIds(ids => ids.includes(phraseId) ? ids : ids.concat(phraseId));
        const timerId = window.setTimeout(() => {
          setMatchingCorrectFeedbackIds(ids => ids.filter(id => id !== phraseId));
          matchingCorrectFeedbackTimerRefs.current = matchingCorrectFeedbackTimerRefs.current.filter(id => id !== timerId);
        }, 700);
        matchingCorrectFeedbackTimerRefs.current.push(timerId);
        return;
      }

      setMatchingFeedback({
        state: 'incorrect',
        cards: [
          matchingSelection,
          { side, phraseId }
        ]
      });
      if (matchingFeedbackTimerRef.current) clearTimeout(matchingFeedbackTimerRef.current);
      matchingFeedbackTimerRef.current = setTimeout(() => {
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
            {shuffledMatchingArabic.map(phraseId => {
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
                  {getPhraseTextForMode(phrase, isLearnActivity ? learnEnglishDisplayMode : practiceTextMode) || phraseId}
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
      ) : isLearnActivity ? (
        renderLearnActivity()
      ) : isTranslationDirectionActivity ? (
        renderTranslationDirectionActivity()
      ) : isTypeArabicActivity ? (
        renderTypeArabicActivity()
      ) : isTypeEnglishActivity ? (
        renderTypeEnglishActivity()
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
        </div>
      ) : isPhraseCaptions ? (
        null
      ) : (
        renderPhraseLines(exercise.lines)
      )}
    </div>
  );
}
