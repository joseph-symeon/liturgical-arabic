import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const envPath = path.join(rootDir, '.env.local');
const inputPath = path.join(rootDir, 'src', 'data', 'source', 'phrases.csv');

const NOTION_VERSION = '2022-06-28';

const PROPERTY_NAMES = {
  id: ['ID', 'Id', 'id'],
  arabic: ['Arabic', 'arabic'],
  translation: ['Translation', 'translation'],
  literal: ['Literal', 'literal'],
  tags: ['Tags', 'tags'],
  status: ['Status', 'status']
};

loadEnvLocal();

const notionToken = process.env.NOTION_TOKEN;
const databaseId = process.env.NOTION_PHRASES_DATABASE_ID;
const requiredStatus = process.env.NOTION_PHRASES_STATUS;

if (!notionToken) {
  throw new Error('Missing NOTION_TOKEN. Add it to .env.local or your shell environment.');
}

if (!databaseId) {
  throw new Error('Missing NOTION_PHRASES_DATABASE_ID. Add it to .env.local or your shell environment.');
}

const localRows = readLocalPhraseRows();
const duplicateLocalIds = findDuplicateIds(localRows.map(row => row.id));
if (duplicateLocalIds.length > 0) {
  throw new Error(`Duplicate local phrase IDs found: ${duplicateLocalIds.join(', ')}`);
}

const pages = await fetchDatabasePages(databaseId);
const notionRows = pages
  .filter(page => shouldSyncPage(page, requiredStatus))
  .map(pageToPhraseRow)
  .filter(row => row.id);
const duplicateNotionIds = findDuplicateIds(notionRows.map(row => row.id));
if (duplicateNotionIds.length > 0) {
  throw new Error(`Duplicate Notion phrase IDs found: ${duplicateNotionIds.join(', ')}`);
}

const localById = new Map(localRows.map(row => [row.id, row]));
const notionById = new Map(notionRows.map(row => [row.id, row]));
const missingInNotion = localRows.filter(row => !notionById.has(row.id)).map(row => row.id);
const missingLocally = notionRows.filter(row => !localById.has(row.id)).map(row => row.id);
const changed = [];

localRows.forEach(localRow => {
  const notionRow = notionById.get(localRow.id);
  if (!notionRow) return;

  const fields = ['arabic', 'translation', 'literal', 'tags'].filter(field => !valuesEqual(localRow[field], notionRow[field]));
  if (fields.length > 0) {
    changed.push({ id: localRow.id, fields });
  }
});

if (missingInNotion.length === 0 && missingLocally.length === 0 && changed.length === 0) {
  console.log(`No phrase drift found. ${localRows.length} local row(s) match Notion.`);
  process.exit(0);
}

console.log('Phrase drift found between local data and Notion.');
printList('Local rows missing in Notion', missingInNotion);
printList('Notion rows missing locally', missingLocally);
printChanged(changed);
process.exitCode = 1;

function loadEnvLocal() {
  if (!fs.existsSync(envPath)) return;

  const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);
  lines.forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const equalsIndex = trimmed.indexOf('=');
    if (equalsIndex === -1) return;

    const key = trimmed.slice(0, equalsIndex).trim();
    const rawValue = trimmed.slice(equalsIndex + 1).trim();
    const value = rawValue.replace(/^['"]|['"]$/g, '');
    if (!process.env[key]) {
      process.env[key] = value;
    }
  });
}

function readLocalPhraseRows() {
  return readCsv(inputPath)
    .filter(row => row.id)
    .map(row => ({
      id: row.id,
      arabic: row.arabic ?? '',
      translation: row.translation ?? '',
      literal: row.literal ?? '',
      tags: parseTags(row.tags, row.id)
    }));
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

function parseTags(value, id) {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) {
      throw new Error('Tags JSON must be an array.');
    }
    return normalizeTags(parsed);
  } catch (error) {
    throw new Error(`Invalid tags JSON for phrase "${id}": ${error.message}`);
  }
}

function normalizeTags(tags) {
  return [...new Set((tags || []).map(tag => String(tag)).filter(Boolean))].sort((a, b) => a.localeCompare(b));
}

function findDuplicateIds(ids) {
  const seen = new Set();
  const duplicates = new Set();
  ids.forEach(id => {
    if (seen.has(id)) duplicates.add(id);
    seen.add(id);
  });
  return [...duplicates];
}

async function fetchDatabasePages(id) {
  const pages = [];
  let startCursor;

  do {
    const data = await notionRequest(`/databases/${id}/query`, {
      method: 'POST',
      body: startCursor ? { start_cursor: startCursor } : {}
    });
    pages.push(...data.results);
    startCursor = data.has_more ? data.next_cursor : undefined;
  } while (startCursor);

  return pages;
}

function shouldSyncPage(page, statusValue) {
  if (!statusValue) return true;
  return readPlainProperty(page, PROPERTY_NAMES.status) === statusValue;
}

function pageToPhraseRow(page) {
  return {
    id: readPlainProperty(page, PROPERTY_NAMES.id),
    arabic: readPlainProperty(page, PROPERTY_NAMES.arabic),
    translation: readPlainProperty(page, PROPERTY_NAMES.translation),
    literal: readPlainProperty(page, PROPERTY_NAMES.literal),
    tags: normalizeTags(readTagsProperty(page, PROPERTY_NAMES.tags))
  };
}

function getProperty(page, names) {
  return names.map(name => page.properties?.[name]).find(Boolean);
}

function readPlainProperty(page, names) {
  const property = getProperty(page, names);
  if (!property) return '';

  if (property.type === 'title') return richTextPlain(property.title);
  if (property.type === 'rich_text') return richTextPlain(property.rich_text);
  if (property.type === 'select') return property.select?.name ?? '';
  if (property.type === 'status') return property.status?.name ?? '';
  if (property.type === 'number') return String(property.number ?? '');
  if (property.type === 'formula') return readFormulaPlain(property.formula);

  return '';
}

function readTagsProperty(page, names) {
  const property = getProperty(page, names);
  if (!property) return [];

  if (property.type === 'multi_select') {
    return property.multi_select.map(option => option.name);
  }

  if (property.type === 'select') {
    return property.select ? [property.select.name] : [];
  }

  const text = readPlainProperty(page, names).trim();
  if (!text) return [];
  if (text.startsWith('[')) return JSON.parse(text);
  return text.split(',').map(tag => tag.trim()).filter(Boolean);
}

function readFormulaPlain(formula) {
  if (formula.type === 'string') return formula.string ?? '';
  if (formula.type === 'number') return String(formula.number ?? '');
  if (formula.type === 'boolean') return formula.boolean ? 'true' : 'false';
  if (formula.type === 'date') return formula.date?.start ?? '';
  return '';
}

function richTextPlain(parts) {
  return (parts || []).map(part => part.plain_text).join('');
}

function valuesEqual(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
}

function printList(label, items) {
  console.log(`${label}: ${items.length}`);
  items.slice(0, 20).forEach(item => console.log(`  - ${item}`));
  if (items.length > 20) console.log(`  ...and ${items.length - 20} more`);
}

function printChanged(items) {
  console.log(`Rows with changed fields: ${items.length}`);
  items.slice(0, 40).forEach(item => console.log(`  - ${item.id}: ${item.fields.join(', ')}`));
  if (items.length > 40) console.log(`  ...and ${items.length - 40} more`);
}

async function notionRequest(endpoint, options = {}) {
  const maxAttempts = 4;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    const response = await fetch(`https://api.notion.com/v1${endpoint}`, {
      method: options.method ?? 'GET',
      headers: {
        Authorization: `Bearer ${notionToken}`,
        'Content-Type': 'application/json',
        'Notion-Version': NOTION_VERSION
      },
      body: options.body ? JSON.stringify(options.body) : undefined
    });

    if (response.ok) {
      return response.json();
    }

    const body = await response.text();
    const shouldRetry = response.status === 429 || response.status >= 500;
    if (shouldRetry && attempt < maxAttempts) {
      const retryAfter = Number(response.headers.get('retry-after'));
      const delayMs = Number.isFinite(retryAfter) ? retryAfter * 1000 : attempt * 1500;
      await delay(delayMs);
      continue;
    }

    throw new Error(`Notion request failed (${response.status}): ${body}`);
  }

  throw new Error('Notion request failed after retry attempts.');
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
