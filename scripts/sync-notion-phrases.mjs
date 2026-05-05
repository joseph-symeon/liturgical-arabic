import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const envPath = path.join(rootDir, '.env.local');
const outputPath = path.join(rootDir, 'src', 'data', 'source', 'phrases.csv');

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

const pages = await fetchDatabasePages(databaseId);
const rows = pages
  .filter(page => shouldSyncPage(page, requiredStatus))
  .map(pageToPhraseRow)
  .filter(row => row.id);

if (rows.length === 0) {
  const propertyNames = pages[0] ? Object.keys(pages[0].properties).join(', ') : 'none';
  throw new Error(
    `Notion returned ${pages.length} page(s), but none produced a phrase row with a non-empty ID.\n` +
    `No local files were changed.\n` +
    `Properties found on the first page: ${propertyNames}\n` +
    `Expected a property named one of: ${PROPERTY_NAMES.id.join(', ')}`
  );
}

writePhrasesCsv(rows);
console.log(`Synced ${rows.length} Notion phrase rows to ${path.relative(rootDir, outputPath)}.`);

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

async function fetchDatabasePages(id) {
  const pages = [];
  let startCursor;

  do {
    const response = await fetch(`https://api.notion.com/v1/databases/${id}/query`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${notionToken}`,
        'Content-Type': 'application/json',
        'Notion-Version': NOTION_VERSION
      },
      body: JSON.stringify(startCursor ? { start_cursor: startCursor } : {})
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Notion database query failed (${response.status}): ${body}`);
    }

    const data = await response.json();
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
    tags: JSON.stringify(readTagsProperty(page, PROPERTY_NAMES.tags))
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

  if (text.startsWith('[')) {
    const parsed = JSON.parse(text);
    if (!Array.isArray(parsed)) {
      throw new Error(`Tags JSON must be an array for phrase "${readPlainProperty(page, PROPERTY_NAMES.id)}".`);
    }
    return parsed;
  }

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

function writePhrasesCsv(rows) {
  const header = ['id', 'arabic', 'translation', 'literal', 'tags'];
  const lines = [
    header.map(csvEscape).join(','),
    ...rows.map(row => header.map(column => csvEscape(row[column] ?? '')).join(','))
  ];

  fs.writeFileSync(outputPath, `${lines.join('\n')}\n`);
}

function csvEscape(value) {
  const text = String(value);
  return `"${text.replace(/"/g, '""')}"`;
}
