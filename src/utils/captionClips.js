import { stripArabicDiacritics } from './arabic.js';

const ARABIC_PUNCTUATION = /[،؛؟.,!:"'()[\]{}ـ]/g;

export function normalizeArabic(text) {
  return stripArabicDiacritics(text)
    .replace(/[إأآٱ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه')
    .replace(ARABIC_PUNCTUATION, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function tokenizeArabic(text) {
  return normalizeArabic(text).split(' ').filter(Boolean);
}

function tokensMatch(expectedToken, captionToken) {
  if (expectedToken === captionToken) return true;
  if (expectedToken.length > 2 && captionToken === `${expectedToken}ي`) return true;
  if (captionToken.length > 2 && expectedToken === `${captionToken}ي`) return true;
  return false;
}

export function getExerciseArabicTokens(definition, phrasesMap, segmentsMap) {
  return definition.segment_ids.flatMap(segmentId => {
    const segment = segmentsMap[segmentId];
    if (!segment) return [];

    return segment.phrases.flatMap(part => {
      if (part.phrase_id && phrasesMap[part.phrase_id]) {
        return tokenizeArabic(phrasesMap[part.phrase_id].arabic);
      }
      return tokenizeArabic(part.text || '');
    });
  });
}

export function findCaptionClipMatch(definition, phrasesMap, segmentsMap, captionTracks) {
  const config = definition.caption_clip;
  if (!config) return null;

  const track = captionTracks[config.recording_id] || captionTracks[config.video_id];
  if (!track) return null;

  const expectedTokens = getExerciseArabicTokens(definition, phrasesMap, segmentsMap);
  const captionWords = track.words.map(word => ({
    ...word,
    token: normalizeArabic(word.text)
  }));
  const maxCaptionTokenSkips = config.max_caption_token_skips ?? 2;

  function matchFrom(startIndex) {
    if (!tokensMatch(expectedTokens[0], captionWords[startIndex]?.token)) return null;

    let expectedIndex = 0;
    let captionIndex = startIndex;
    let skips = 0;

    while (expectedIndex < expectedTokens.length && captionIndex < captionWords.length) {
      if (tokensMatch(expectedTokens[expectedIndex], captionWords[captionIndex].token)) {
        expectedIndex += 1;
        captionIndex += 1;
        continue;
      }
      skips += 1;
      if (skips > maxCaptionTokenSkips) return null;
      captionIndex += 1;
    }

    if (expectedIndex < expectedTokens.length) return null;
    return captionIndex - 1;
  }

  let matchStart = -1;
  let matchEnd = -1;
  for (let startIndex = 0; startIndex < captionWords.length; startIndex += 1) {
    const endIndex = matchFrom(startIndex);
    if (endIndex !== null) {
      matchStart = startIndex;
      matchEnd = endIndex;
      break;
    }
  }

  if (matchStart < 0) return null;

  return {
    track,
    captionWords,
    expectedTokens,
    matchStart,
    matchEnd
  };
}

export function deriveCaptionClip(definition, phrasesMap, segmentsMap, captionTracks, alignments) {
  const config = definition.caption_clip;
  const match = findCaptionClipMatch(definition, phrasesMap, segmentsMap, captionTracks);
  if (!config || !match) return null;

  const { track, captionWords, matchStart, matchEnd } = match;
  const startPadding = config.start_padding_seconds ?? 0.15;
  const endPadding = config.end_padding_seconds ?? 0;
  const boundaryGuard = config.boundary_guard_seconds ?? 0.65;
  const paddedEnd = captionWords[matchEnd].end + endPadding;
  const nextWordStart = captionWords[matchEnd + 1]?.start;
  const derivedEndSeconds = typeof nextWordStart === 'number'
    ? Math.min(paddedEnd, Math.max(captionWords[matchEnd].start, nextWordStart - boundaryGuard))
    : paddedEnd;
  const alignedClip = config.alignment_id
    ? getAlignmentClip(config.alignment_id, definition.segment_ids, config.recording_id, alignments)
    : null;
  const startSeconds = alignedClip?.start_seconds
    ?? config.pinned_start_seconds
    ?? Math.max(0, captionWords[matchStart].start - startPadding);
  const endSeconds = alignedClip?.end_seconds ?? config.pinned_end_seconds ?? derivedEndSeconds;

  return {
    video_id: track.video_id,
    start_seconds: startSeconds,
    end_seconds: endSeconds,
    default_playback_rate: config.default_playback_rate ?? 1
  };
}

function getSegmentKey(segmentIds) {
  return (segmentIds || []).join('\u001f');
}

export function getAlignmentClip(alignmentId, segmentIds, recordingId, alignments) {
  const alignment = alignments?.[alignmentId];
  if (!alignment || alignment.recording_id !== recordingId) return null;

  const segmentKey = getSegmentKey(segmentIds);
  const match = alignment.matches.find(item => getSegmentKey(item.segment_ids) === segmentKey);
  if (!match) return null;

  return {
    start_seconds: match.start_seconds,
    end_seconds: match.end_seconds
  };
}
