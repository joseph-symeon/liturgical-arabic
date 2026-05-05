import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const envPath = path.join(rootDir, '.env.local');
const inputPath = path.join(rootDir, 'src', 'data', 'source', 'phrases.csv');

const NOTION_VERSION = '2022-06-28';
const APPLY = process.argv.includes('--apply');

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
const defaultStatus = process.env.NOTION_PHRASES_STATUS;

if (!notionToken) {
  throw new Error('Missing NOTION_TOKEN. Add it to .env.local or your shell environment.');
}

if (!databaseId) {
  throw new Error('Missing NOTION_PHRASES_DATABASE_ID. Add it to .env.local or your shell environment.');
}

const rows = readPhraseRows();
if (rows.length === 0) {
  throw new Error(`No phrase rows found in ${path.relative(rootDir, inputPath)}.`);
}

const duplicateIds = findDuplicateIds(rows.map(row => row.id));
if (duplicateIds.length > 0) {
  throw new Error(`Duplicate phrase IDs found locally: ${duplicateIds.join(', ')}`);
}

const database = await notionRequest(`/databases/${databaseId}`);
const schema = resolveSchema(database.properties);
const pages = await fetchDatabasePages(databaseId);
const existingPagesById = new Map();

pages.forEach(page => {
  const id = readPlainProperty(page.properties[schema.id.name]);
  if (id) existingPagesById.set(id, page);
});

let created = 0;
let updated = 0;
let unchanged = 0;

for (const row of rows) {
  const page = existingPagesById.get(row.id);
  const properties = buildPhraseProperties(row, schema, Boolean(page));

  if (!page) {
    created += 1;
    if (APPLY) {
      await notionRequest('/pages', {
        method: 'POST',
        body: {
          parent: { database_id: databaseId },
          properties
        }
      });
    }
    continue;
  }

  if (pageMatchesRow(page, row, schema)) {
    unchanged += 1;
    continue;
  }

  updated += 1;
  if (APPLY) {
    await notionRequest(`/pages/${page.id}`, {
      method: 'PATCH',
      body: { properties }
    });
  }
}

const mode = APPLY ? 'Pushed' : 'Dry run';
console.log(`${mode}: ${created} to create, ${updated} to update, ${unchanged} unchanged.`);
if (!APPLY) {
  console.log('No Notion changes were made. Run `npm run push:notion:phrases -- --apply` to write these changes.');
}

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

function readPhraseRows() {
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
    return parsed.map(tag => String(tag));
  } catch (error) {
    throw new Error(`Invalid tags JSON for phrase "${id}": ${error.message}`);
  }
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

function resolveSchema(properties) {
  const schema = Object.fromEntries(
    Object.entries(PROPERTY_NAMES).map(([key, names]) => [key, findProperty(properties, names)])
  );

  const missing = ['id', 'arabic', 'translation', 'literal', 'tags'].filter(key => !schema[key]);
  if (missing.length > 0) {
    throw new Error(
      `Missing Notion database properties: ${missing.join(', ')}.\n` +
      `Properties found: ${Object.keys(properties).join(', ')}`
    );
  }

  if (!['title', 'rich_text'].includes(schema.id.type)) {
    throw new Error(`The phrase ID property must be title or rich_text, but "${schema.id.name}" is ${schema.id.type}.`);
  }

  ['arabic', 'translation', 'literal'].forEach(key => {
    if (!['title', 'rich_text'].includes(schema[key].type)) {
      throw new Error(`The ${key} property must be title or rich_text, but "${schema[key].name}" is ${schema[key].type}.`);
    }
  });

  if (!['multi_select', 'rich_text'].includes(schema.tags.type)) {
    throw new Error(`The tags property must be multi_select or rich_text, but "${schema.tags.name}" is ${schema.tags.type}.`);
  }

  return schema;
}

function findProperty(properties, names) {
  const name = names.find(candidate => properties[candidate]);
  return name ? { name, type: properties[name].type } : null;
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

function buildPhraseProperties(row, schema, isExistingPage) {
  const properties = {
    [schema.id.name]: writeTextProperty(schema.id.type, row.id),
    [schema.arabic.name]: writeTextProperty(schema.arabic.type, row.arabic),
    [schema.translation.name]: writeTextProperty(schema.translation.type, row.translation),
    [schema.literal.name]: writeTextProperty(schema.literal.type, row.literal),
    [schema.tags.name]: writeTagsProperty(schema.tags.type, row.tags)
  };

  if (!isExistingPage && defaultStatus && schema.status && ['select', 'status'].includes(schema.status.type)) {
    properties[schema.status.name] = { [schema.status.type]: { name: defaultStatus } };
  }

  return properties;
}

function writeTextProperty(type, value) {
  if (type === 'title') {
    return { title: [{ text: { content: value } }] };
  }
  return { rich_text: [{ text: { content: value } }] };
}

function writeTagsProperty(type, tags) {
  if (type === 'multi_select') {
    return { multi_select: tags.map(name => ({ name })) };
  }
  return writeTextProperty('rich_text', JSON.stringify(tags));
}

function pageMatchesRow(page, row, schema) {
  const properties = page.properties;
  return (
    readPlainProperty(properties[schema.id.name]) === row.id &&
    readPlainProperty(properties[schema.arabic.name]) === row.arabic &&
    readPlainProperty(properties[schema.translation.name]) === row.translation &&
    readPlainProperty(properties[schema.literal.name]) === row.literal &&
    arraysEqual(readTagsProperty(properties[schema.tags.name]), row.tags)
  );
}

function readPlainProperty(property) {
  if (!property) return '';
  if (property.type === 'title') return richTextPlain(property.title);
  if (property.type === 'rich_text') return richTextPlain(property.rich_text);
  if (property.type === 'select') return property.select?.name ?? '';
  if (property.type === 'status') return property.status?.name ?? '';
  if (property.type === 'number') return String(property.number ?? '');
  if (property.type === 'formula') return readFormulaPlain(property.formula);
  return '';
}

function readTagsProperty(property) {
  if (!property) return [];
  if (property.type === 'multi_select') {
    return property.multi_select.map(option => option.name);
  }

  const text = readPlainProperty(property).trim();
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

function arraysEqual(left, right) {
  if (left.length !== right.length) return false;
  return left.every((value, index) => value === right[index]);
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
