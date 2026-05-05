import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import segments from '../src/data/segments.js';
import liturgySections from '../src/data/liturgySections.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const sourceDir = path.join(rootDir, 'src', 'data', 'source');
const phrasesPath = path.join(sourceDir, 'phrases.csv');

const SECTION_TAG_PREFIX = 'section: ';

const phrases = readCsv(phrasesPath);
const sectionTagsByPhraseId = new Map();

liturgySections.forEach(section => {
  const sectionTag = `${SECTION_TAG_PREFIX}${section.section}`;
  addSectionTag(section.section_title_phrase, sectionTag);

  section.segment_ids.forEach(segmentId => {
    const segment = segments[segmentId];
    if (!segment) {
      console.warn(`Skipping missing segment "${segmentId}" referenced by section "${section.section}".`);
      return;
    }

    segment.phrases.forEach(part => addSectionTag(part.phrase_id, sectionTag));
  });
});

const updatedPhrases = phrases.map(row => {
  const existingTags = parseJsonCell(row.tags, [], `tags for phrase "${row.id}"`);
  const nonSectionTags = existingTags.filter(tag => !String(tag).startsWith(SECTION_TAG_PREFIX));
  const sectionTags = sectionTagsByPhraseId.get(row.id) ?? [];
  return {
    ...row,
    tags: JSON.stringify([...nonSectionTags, ...sectionTags])
  };
});

writeCsv(phrasesPath, updatedPhrases, ['id', 'arabic', 'translation', 'literal', 'tags']);
console.log(`Tagged ${sectionTagsByPhraseId.size} phrase row(s) with liturgy section tags.`);

function addSectionTag(phraseId, sectionTag) {
  if (!phraseId) return;
  const tags = sectionTagsByPhraseId.get(phraseId) ?? [];
  if (!tags.includes(sectionTag)) tags.push(sectionTag);
  sectionTagsByPhraseId.set(phraseId, tags);
}

function readCsv(filePath) {
  const text = fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, '').trim();
  const rows = parseCsv(text);
  if (rows.length === 0) return [];
  const headers = rows[0];
  return rows.slice(1).filter(row => row.some(cell => cell !== '')).map(row => {
    const record = {};
    headers.forEach((header, index) => {
      record[header] = row[index] ?? '';
    });
    return record;
  });
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = '';
  let inQuotes = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        cell += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === ',' && !inQuotes) {
      row.push(cell);
      cell = '';
      continue;
    }

    if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && next === '\n') index += 1;
      row.push(cell);
      rows.push(row);
      row = [];
      cell = '';
      continue;
    }

    cell += char;
  }

  row.push(cell);
  rows.push(row);
  return rows;
}

function parseJsonCell(value, fallback, label) {
  if (!value) return fallback;
  try {
    return JSON.parse(value);
  } catch (error) {
    throw new Error(`Invalid JSON in ${label}: ${error.message}`);
  }
}

function writeCsv(filePath, rows, header) {
  const lines = [
    header.map(csvEscape).join(','),
    ...rows.map(row => header.map(column => csvEscape(row[column] ?? '')).join(','))
  ];
  fs.writeFileSync(filePath, `${lines.join('\n')}\n`);
}

function csvEscape(value) {
  const text = String(value);
  return `"${text.replace(/"/g, '""')}"`;
}
