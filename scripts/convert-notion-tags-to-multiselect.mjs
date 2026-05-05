import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const envPath = path.join(rootDir, '.env.local');
const phrasesPath = path.join(rootDir, 'src', 'data', 'source', 'phrases.csv');

const NOTION_VERSION = '2022-06-28';
const TAG_PROPERTY_NAMES = ['Tags', 'tags'];

loadEnvLocal();

const notionToken = process.env.NOTION_TOKEN;
const databaseId = process.env.NOTION_PHRASES_DATABASE_ID;

if (!notionToken) {
  throw new Error('Missing NOTION_TOKEN. Add it to .env.local or your shell environment.');
}

if (!databaseId) {
  throw new Error('Missing NOTION_PHRASES_DATABASE_ID. Add it to .env.local or your shell environment.');
}

const database = await notionRequest(`/databases/${databaseId}`);
const tagPropertyName = TAG_PROPERTY_NAMES.find(name => database.properties?.[name]);

if (!tagPropertyName) {
  throw new Error(`Could not find a Tags property. Properties found: ${Object.keys(database.properties ?? {}).join(', ')}`);
}

const tagProperty = database.properties[tagPropertyName];

if (tagProperty.type === 'multi_select') {
  console.log(`"${tagPropertyName}" is already a Notion multi-select property.`);
  process.exit(0);
}

const tagOptions = readLocalTagOptions();

await notionRequest(`/databases/${databaseId}`, {
  method: 'PATCH',
  body: {
    properties: {
      [tagPropertyName]: {
        multi_select: {
          options: tagOptions.map(name => ({ name }))
        }
      }
    }
  }
});

console.log(`Converted "${tagPropertyName}" from ${tagProperty.type} to Notion multi-select with ${tagOptions.length} option(s).`);
console.log('Run `npm run push:notion:phrases -- --apply` to repopulate row tags.');

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

function readLocalTagOptions() {
  const rows = readCsv(phrasesPath);
  const tags = new Set();

  rows.forEach(row => {
    const rowTags = parseTags(row.tags, row.id);
    rowTags.forEach(tag => tags.add(tag));
  });

  return [...tags].sort((a, b) => a.localeCompare(b));
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
    return parsed.map(tag => String(tag)).filter(Boolean);
  } catch (error) {
    throw new Error(`Invalid tags JSON for phrase "${id}": ${error.message}`);
  }
}

async function notionRequest(endpoint, options = {}) {
  const response = await fetch(`https://api.notion.com/v1${endpoint}`, {
    method: options.method ?? 'GET',
    headers: {
      Authorization: `Bearer ${notionToken}`,
      'Content-Type': 'application/json',
      'Notion-Version': NOTION_VERSION
    },
    body: options.body ? JSON.stringify(options.body) : undefined
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Notion request failed (${response.status}): ${body}`);
  }

  return response.json();
}
