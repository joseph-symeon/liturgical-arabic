import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const envPath = path.join(rootDir, '.env.local');
const phrasesPath = path.join(rootDir, 'src', 'data', 'texts', 'phrases.js');
const syncManifestPath = path.join(rootDir, 'src', 'data', 'source', 'phrases.sync.json');

const NOTION_VERSION = '2022-06-28';
const CHECK = process.argv.includes('--check');

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

const localRows = await readPhraseRows();
const duplicateLocalIds = findDuplicateIds(localRows.map(row => row.id));
if (duplicateLocalIds.length > 0) {
  throw new Error(`Duplicate local phrase IDs found: ${duplicateLocalIds.join(', ')}`);
}

const database = await notionRequest(`/databases/${databaseId}`);
const schema = resolveSchema(database.properties);
const pages = await fetchDatabasePages(databaseId);
const notionPages = pages.filter(page => shouldSyncPage(page, defaultStatus));
const notionRows = notionPages.map(pageToPhraseRow).filter(row => row.id);
const duplicateNotionIds = findDuplicateIds(notionRows.map(row => row.id));
if (duplicateNotionIds.length > 0) {
  throw new Error(`Duplicate Notion phrase IDs found: ${duplicateNotionIds.join(', ')}`);
}

const manifest = readSyncManifest();
const plan = createSyncPlan(localRows, notionRows, notionPages, manifest);

if (CHECK) {
  console.log(formatSyncPlan(plan, 'check'));
  if (plan.conflicts.length > 0) {
    console.log(formatConflictSummary(plan.conflicts));
  }
  process.exit(plan.hasChanges || plan.conflicts.length > 0 ? 1 : 0);
}

if (plan.conflicts.length > 0) {
  console.log(formatSyncPlan(plan, 'blocked'));
  console.log(formatConflictSummary(plan.conflicts));
  process.exitCode = 1;
  throw new Error('Refusing bidirectional phrase sync because some phrase IDs changed differently in both places.');
}

const applied = await applySyncPlan(plan, schema);
writePhrasesJs(applied.localRows);
writeSyncManifest(applied.manifest);
console.log(formatSyncPlan(plan, 'complete'));

async function applySyncPlan(plan, schema) {
  const pagesById = new Map(plan.notionPages.map(page => [readPlainProperty(page.properties[schema.id.name]), page]));
  const finalRowsById = new Map(plan.localRows.map(row => [row.id, row]));
  const finalPagesById = new Map();

  for (const row of plan.pushCreate) {
    const createdPage = await notionRequest('/pages', {
      method: 'POST',
      body: {
        parent: { database_id: databaseId },
        properties: buildPhraseProperties(row, schema, false)
      }
    });
    finalPagesById.set(row.id, createdPage);
  }

  for (const row of plan.pushUpdate) {
    const page = pagesById.get(row.id);
    const updatedPage = await notionRequest(`/pages/${page.id}`, {
      method: 'PATCH',
      body: { properties: buildPhraseProperties(row, schema, true) }
    });
    finalPagesById.set(row.id, updatedPage);
  }

  for (const row of plan.pushArchive) {
    const page = pagesById.get(row.id);
    await notionRequest(`/pages/${page.id}`, {
      method: 'PATCH',
      body: { archived: true }
    });
    finalRowsById.delete(row.id);
  }

  for (const row of plan.pullAdd) {
    finalRowsById.set(row.id, row);
  }

  for (const row of plan.pullUpdate) {
    finalRowsById.set(row.id, row);
  }

  for (const row of plan.pullRemove) {
    finalRowsById.delete(row.id);
  }

  for (const page of plan.notionPages) {
    const id = readPlainProperty(page.properties[schema.id.name]);
    if (id && !finalPagesById.has(id)) {
      finalPagesById.set(id, page);
    }
  }

  const orderedIds = [
    ...plan.localRows.map(row => row.id),
    ...plan.notionRows.map(row => row.id)
  ].filter((id, index, ids) => ids.indexOf(id) === index && finalRowsById.has(id));
  const localRows = orderedIds.map(id => finalRowsById.get(id));
  const manifest = createSyncManifest(localRows, finalPagesById);

  return { localRows, manifest };
}

function createSyncPlan(localRows, notionRows, notionPages, manifest) {
  const localById = new Map(localRows.map(row => [row.id, row]));
  const notionById = new Map(notionRows.map(row => [row.id, row]));
  const snapshotById = new Map(Object.entries(manifest?.phrases ?? {}).map(([id, entry]) => [
    id,
    entry.row ? normalizeRow({ id, ...entry.row }) : null
  ]));
  const ids = [...new Set([
    ...localRows.map(row => row.id),
    ...notionRows.map(row => row.id),
    ...snapshotById.keys()
  ])];

  const plan = {
    localRows,
    notionRows,
    notionPages,
    pushCreate: [],
    pushUpdate: [],
    pushArchive: [],
    pullAdd: [],
    pullUpdate: [],
    pullRemove: [],
    unchanged: [],
    conflicts: []
  };

  ids.forEach(id => {
    const localRow = localById.get(id);
    const notionRow = notionById.get(id);
    const hasSnapshotEntry = snapshotById.has(id);
    const snapshot = snapshotById.get(id);

    if (!snapshot) {
      if (hasSnapshotEntry && localRow && notionRow && rowsEqual(localRow, notionRow)) {
        plan.unchanged.push(id);
        return;
      }

      if (hasSnapshotEntry) {
        plan.conflicts.push({ id, reason: 'missing last-synced snapshot' });
        return;
      }

      if (localRow && notionRow) {
        if (rowsEqual(localRow, notionRow)) {
          plan.unchanged.push(id);
        } else {
          plan.conflicts.push({ id, reason: 'missing last-synced snapshot' });
        }
        return;
      }

      if (localRow && !notionRow) {
        plan.pushCreate.push(localRow);
        return;
      }

      if (!localRow && notionRow) {
        plan.pullAdd.push(notionRow);
        return;
      }

      return;
    }

    if (!localRow && !notionRow) {
      return;
    }

    if (localRow && notionRow) {
      const localChanged = !rowsEqual(localRow, snapshot);
      const notionChanged = !rowsEqual(notionRow, snapshot);

      if (!localChanged && !notionChanged) {
        plan.unchanged.push(id);
      } else if (localChanged && !notionChanged) {
        plan.pushUpdate.push(localRow);
      } else if (!localChanged && notionChanged) {
        plan.pullUpdate.push(notionRow);
      } else if (rowsEqual(localRow, notionRow)) {
        plan.unchanged.push(id);
      } else {
        plan.conflicts.push({ id, reason: 'local and Notion both changed' });
      }
      return;
    }

    if (localRow && !notionRow) {
      if (rowsEqual(localRow, snapshot)) {
        plan.pullRemove.push(localRow);
      } else {
        plan.conflicts.push({ id, reason: 'local changed and Notion is missing' });
      }
      return;
    }

    if (!localRow && notionRow) {
      if (rowsEqual(notionRow, snapshot)) {
        plan.pushArchive.push(notionRow);
      } else {
        plan.conflicts.push({ id, reason: 'local is missing and Notion changed' });
      }
    }
  });

  plan.hasChanges = [
    plan.pushCreate,
    plan.pushUpdate,
    plan.pushArchive,
    plan.pullAdd,
    plan.pullUpdate,
    plan.pullRemove
  ].some(items => items.length > 0);

  return plan;
}

function formatSyncPlan(plan, status) {
  const lines = [
    status === 'complete'
      ? 'Sync complete: local phrases.js <-> Notion.'
      : status === 'blocked'
        ? 'Sync blocked: local phrases.js <-> Notion.'
        : 'Sync check: local phrases.js <-> Notion.',
    `- Create in Notion: ${plan.pushCreate.length}`,
    `- Update in Notion: ${plan.pushUpdate.length}`,
    `- Archive in Notion: ${plan.pushArchive.length}`,
    `- Add locally: ${plan.pullAdd.length}`,
    `- Update locally: ${plan.pullUpdate.length}`,
    `- Remove locally: ${plan.pullRemove.length}`,
    `- Already matching: ${plan.unchanged.length}`,
    `- Conflicts: ${plan.conflicts.length}`,
    status === 'complete'
      ? 'Safe changes were written both ways.'
      : 'No local files or Notion rows were changed.'
  ];

  return lines.join('\n');
}

function formatConflictSummary(conflicts) {
  const shown = conflicts.slice(0, 20);
  const lines = [
    'Conflicted phrase IDs:',
    ...shown.map(conflict => `- ${conflict.id}: ${conflict.reason}`)
  ];

  if (conflicts.length > shown.length) {
    lines.push(`- ...and ${conflicts.length - shown.length} more`);
  }

  return lines.join('\n');
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
  const phrasesModule = await import(`${pathToFileURL(phrasesPath).href}?${Date.now()}`);
  const phrases = phrasesModule.default ?? {};
  return Object.entries(phrases)
    .filter(([id]) => id)
    .map(([id, phrase]) => normalizeRow({
      id,
      arabic: phrase.arabic,
      translation: phrase.translation,
      literal: phrase.literal,
      tags: phrase.tags
    }));
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

function writePhrasesJs(rows) {
  const phrases = Object.fromEntries(rows.map(row => [
    row.id,
    {
      arabic: row.arabic,
      translation: row.translation,
      literal: row.literal,
      tags: row.tags
    }
  ]));

  const header = [
    '// Phrase text can be edited locally in this file for fast development.',
    '// Run `npm run phrases:sync:check` to preview a safe bidirectional sync with Notion.',
    '// Run `npm run phrases:sync` to apply safe phrase changes both ways.'
  ].join('\n');

  fs.writeFileSync(phrasesPath, `${header}\n\nconst phrases = ${JSON.stringify(phrases, null, 2)};\n\nexport default phrases;\n`);
}

function createSyncManifest(rows, pagesById) {
  const phrases = {};

  rows.forEach(row => {
    const page = pagesById.get(row.id);
    if (!page?.id || !page?.last_edited_time) return;
    phrases[row.id] = {
      notion_page_id: page.id,
      last_edited_time: page.last_edited_time,
      row: rowSnapshot(row)
    };
  });

  return {
    database_id: databaseId,
    synced_at: new Date().toISOString(),
    phrases
  };
}

function writeSyncManifest(manifest) {
  fs.writeFileSync(syncManifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
}

function rowSnapshot(row) {
  return {
    arabic: row.arabic,
    translation: row.translation,
    literal: row.literal,
    tags: row.tags
  };
}

function normalizeRow(row) {
  return {
    id: row.id,
    arabic: row.arabic ?? '',
    translation: row.translation ?? '',
    literal: row.literal ?? '',
    tags: normalizeTags(row.tags)
  };
}

function normalizeTags(tags) {
  if (typeof tags === 'string') {
    const trimmed = tags.trim();
    if (!trimmed) return [];
    if (trimmed.startsWith('[')) return normalizeTags(JSON.parse(trimmed));
    return normalizeTags(trimmed.split(','));
  }

  return [...new Set((tags || []).map(tag => String(tag)).filter(Boolean))].sort((a, b) => a.localeCompare(b));
}

function rowsEqual(left, right) {
  if (!left || !right) return false;
  return (
    left.id === right.id &&
    left.arabic === right.arabic &&
    left.translation === right.translation &&
    left.literal === right.literal &&
    arraysEqual(left.tags, right.tags)
  );
}

function arraysEqual(left, right) {
  if (left.length !== right.length) return false;
  return left.every((value, index) => value === right[index]);
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

function shouldSyncPage(page, statusValue) {
  if (!statusValue) return true;
  return readPlainProperty(getProperty(page, PROPERTY_NAMES.status)) === statusValue;
}

function pageToPhraseRow(page) {
  return normalizeRow({
    id: readPlainProperty(getProperty(page, PROPERTY_NAMES.id)),
    arabic: readPlainProperty(getProperty(page, PROPERTY_NAMES.arabic)),
    translation: readPlainProperty(getProperty(page, PROPERTY_NAMES.translation)),
    literal: readPlainProperty(getProperty(page, PROPERTY_NAMES.literal)),
    tags: readTagsProperty(getProperty(page, PROPERTY_NAMES.tags))
  });
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

function getProperty(page, names) {
  return names.map(name => page.properties?.[name]).find(Boolean);
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
