import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const envPath = path.join(rootDir, '.env.local');
const inputPath = path.join(rootDir, 'src', 'data', 'phrases.js');
const syncManifestPath = path.join(rootDir, 'src', 'data', 'source', 'phrases.sync.json');

const NOTION_VERSION = '2022-06-28';
const APPLY = process.argv.includes('--apply');
const FORCE = process.argv.includes('--force');

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

const rows = await readPhraseRows();
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
const syncManifest = readSyncManifest();
const nextSyncManifest = createNextSyncManifest(syncManifest);
const existingPagesById = new Map();

pages.forEach(page => {
  const id = readPlainProperty(page.properties[schema.id.name]);
  if (id) existingPagesById.set(id, page);
});

const conflicts = findPushConflicts(rows, existingPagesById, schema, syncManifest);
if (conflicts.length > 0 && !FORCE) {
  console.error(formatConflictMessage(conflicts));
  process.exitCode = 1;
  throw new Error('Refusing to push because Notion has newer phrase edits. Run `npm run sync:notion:phrases` first, or use `-- --apply --force` only if local phrases.js should overwrite Notion.');
}

let created = 0;
let updated = 0;
let unchanged = 0;

for (const row of rows) {
  const page = existingPagesById.get(row.id);
  const properties = buildPhraseProperties(row, schema, Boolean(page));

  if (!page) {
    created += 1;
    if (APPLY) {
      const createdPage = await notionRequest('/pages', {
        method: 'POST',
        body: {
          parent: { database_id: databaseId },
          properties
        }
      });
      recordSyncedPage(nextSyncManifest, row.id, createdPage);
    }
    continue;
  }

  if (pageMatchesRow(page, row, schema)) {
    unchanged += 1;
    recordSyncedPage(nextSyncManifest, row.id, page);
    continue;
  }

  updated += 1;
  if (APPLY) {
    const updatedPage = await notionRequest(`/pages/${page.id}`, {
      method: 'PATCH',
      body: { properties }
    });
    recordSyncedPage(nextSyncManifest, row.id, updatedPage);
  }
}

if (APPLY) {
  writeSyncManifest(nextSyncManifest);
}

const mode = APPLY ? 'Pushed' : 'Dry run';
console.log(`${mode}: ${created} to create, ${updated} to update, ${unchanged} unchanged.`);
if (!APPLY) {
  console.log('No Notion changes were made. Run `npm run push:notion:phrases -- --apply` to write these changes.');
  console.log('If Notion has been edited directly, run `npm run sync:notion:phrases` before applying a push.');
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

async function readPhraseRows() {
  const phrasesModule = await import(`${pathToFileURL(inputPath).href}?${Date.now()}`);
  const phrases = phrasesModule.default ?? {};
  return Object.entries(phrases)
    .filter(([id]) => id)
    .map(([id, phrase]) => ({
      id,
      arabic: phrase.arabic ?? '',
      translation: phrase.translation ?? '',
      literal: phrase.literal ?? '',
      tags: normalizeTags(phrase.tags)
    }));
}

function normalizeTags(tags) {
  return [...new Set((tags || []).map(tag => String(tag)).filter(Boolean))].sort((a, b) => a.localeCompare(b));
}

function readSyncManifest() {
  if (!fs.existsSync(syncManifestPath)) return null;

  try {
    const manifest = JSON.parse(fs.readFileSync(syncManifestPath, 'utf8'));
    if (manifest.database_id && manifest.database_id !== databaseId) {
      throw new Error(
        `Sync manifest database_id does not match NOTION_PHRASES_DATABASE_ID.\n` +
        `Manifest: ${manifest.database_id}\n` +
        `Environment: ${databaseId}`
      );
    }
    return manifest;
  } catch (error) {
    throw new Error(`Unable to read ${path.relative(rootDir, syncManifestPath)}: ${error.message}`);
  }
}

function createNextSyncManifest(manifest) {
  return {
    database_id: databaseId,
    synced_at: new Date().toISOString(),
    phrases: { ...(manifest?.phrases ?? {}) }
  };
}

function writeSyncManifest(manifest) {
  fs.writeFileSync(syncManifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
}

function recordSyncedPage(manifest, id, page) {
  if (!page?.id || !page?.last_edited_time) return;
  manifest.phrases[id] = {
    notion_page_id: page.id,
    last_edited_time: page.last_edited_time
  };
}

function getPushConflict(id, page, manifest) {
  const lastSynced = manifest?.phrases?.[id]?.last_edited_time;

  if (!lastSynced) {
    return {
      id,
      notionLastEdited: page.last_edited_time,
      localLastSynced: null,
      reason: 'no local sync timestamp'
    };
  }

  if (page.last_edited_time > lastSynced) {
    return {
      id,
      notionLastEdited: page.last_edited_time,
      localLastSynced: lastSynced,
      reason: 'Notion changed after last sync'
    };
  }

  return null;
}

function findPushConflicts(rows, existingPagesById, schema, manifest) {
  return rows.flatMap(row => {
    const page = existingPagesById.get(row.id);
    if (!page || pageMatchesRow(page, row, schema)) return [];
    const conflict = getPushConflict(row.id, page, manifest);
    return conflict ? [conflict] : [];
  });
}

function formatConflictMessage(conflicts) {
  const shown = conflicts.slice(0, 20);
  const lines = [
    `Refusing to push ${conflicts.length} phrase update(s) because Notion has newer or unsynced data:`,
    ...shown.map(conflict => {
      const synced = conflict.localLastSynced ?? 'never';
      return `- ${conflict.id}: ${conflict.reason}; Notion last edited ${conflict.notionLastEdited}; local last synced ${synced}`;
    })
  ];

  if (conflicts.length > shown.length) {
    lines.push(`- ...and ${conflicts.length - shown.length} more`);
  }

  return lines.join('\n');
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
    arraysEqual(normalizeTags(readTagsProperty(properties[schema.tags.name])), row.tags)
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
