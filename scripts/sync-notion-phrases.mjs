import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const envPath = path.join(rootDir, '.env.local');
const outputPath = path.join(rootDir, 'src', 'data', 'phrases.js');
const syncManifestPath = path.join(rootDir, 'src', 'data', 'source', 'phrases.sync.json');

const NOTION_VERSION = '2022-06-28';
const FORCE = process.argv.includes('--force');
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

const localRows = fs.existsSync(outputPath) ? await readLocalPhraseRows() : [];
const localDrift = findLocalDrift(localRows, rows);
if (CHECK) {
  console.log(formatPullCheckMessage(localDrift, rows.length));
  process.exit(localDrift.hasDrift ? 1 : 0);
}

if (localDrift.hasDrift && !FORCE) {
  console.error(formatLocalDriftMessage(localDrift));
  process.exitCode = 1;
  throw new Error('Refusing to replace local phrases.js with Notion data. Re-run with `npm run phrases:pull` only when Notion should overwrite local phrase edits.');
}

writePhrasesJs(rows);
writeSyncManifest(pages, rows);
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

async function readLocalPhraseRows() {
  const phrasesModule = await import(`${pathToFileURL(outputPath).href}?${Date.now()}`);
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
    tags: JSON.stringify(normalizeTags(readTagsProperty(page, PROPERTY_NAMES.tags)))
  };
}

function findLocalDrift(localRows, notionRows) {
  const localById = new Map(localRows.map(row => [row.id, row]));
  const notionById = new Map(notionRows.map(row => [row.id, normalizeNotionRow(row)]));
  const missingInNotion = localRows.filter(row => !notionById.has(row.id)).map(row => row.id);
  const missingLocally = notionRows.filter(row => !localById.has(row.id)).map(row => row.id);
  const changed = [];

  localRows.forEach(localRow => {
    const notionRow = notionById.get(localRow.id);
    if (!notionRow) return;

    const fields = ['arabic', 'translation', 'literal', 'tags'].filter(field => !valuesEqual(localRow[field], notionRow[field]));
    if (fields.length > 0) changed.push({ id: localRow.id, fields });
  });

  return {
    missingInNotion,
    missingLocally,
    changed,
    hasDrift: missingInNotion.length > 0 || missingLocally.length > 0 || changed.length > 0
  };
}

function normalizeNotionRow(row) {
  return {
    id: row.id,
    arabic: row.arabic ?? '',
    translation: row.translation ?? '',
    literal: row.literal ?? '',
    tags: normalizeTags(JSON.parse(row.tags || '[]'))
  };
}

function normalizeTags(tags) {
  return [...new Set((tags || []).map(tag => String(tag)).filter(Boolean))].sort((a, b) => a.localeCompare(b));
}

function valuesEqual(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
}

function formatLocalDriftMessage(drift) {
  const lines = [
    'Local phrases.js differs from Notion. No local files were changed.',
    `- Local phrase IDs missing in Notion: ${drift.missingInNotion.length}`,
    `- Notion phrase IDs missing locally: ${drift.missingLocally.length}`,
    `- Phrase IDs with changed fields: ${drift.changed.length}`
  ];

  drift.changed.slice(0, 20).forEach(item => {
    lines.push(`  - ${item.id}: ${item.fields.join(', ')}`);
  });

  if (drift.changed.length > 20) {
    lines.push(`  - ...and ${drift.changed.length - 20} more changed phrase(s)`);
  }

  lines.push('Use `npm run phrases:check` for a read-only drift report.');
  lines.push('Use `npm run phrases:pull` only when Notion should overwrite local phrase edits.');

  return lines.join('\n');
}

function formatPullCheckMessage(drift, notionRowCount) {
  if (!drift.hasDrift) {
    return `Pull check: local phrases.js already matches ${notionRowCount} Notion phrase row(s).`;
  }

  const lines = [
    'Pull check: pulling Notion would replace local phrases.js with Notion data.',
    `- Local phrase IDs that would be removed: ${drift.missingInNotion.length}`,
    `- Notion phrase IDs that would be added locally: ${drift.missingLocally.length}`,
    `- Phrase IDs with fields that would change locally: ${drift.changed.length}`
  ];

  if (drift.missingInNotion.length > 0) {
    lines.push('Local-only phrase IDs:');
    drift.missingInNotion.slice(0, 20).forEach(id => lines.push(`  - ${id}`));
    if (drift.missingInNotion.length > 20) {
      lines.push(`  - ...and ${drift.missingInNotion.length - 20} more`);
    }
  }

  if (drift.missingLocally.length > 0) {
    lines.push('Notion-only phrase IDs:');
    drift.missingLocally.slice(0, 20).forEach(id => lines.push(`  - ${id}`));
    if (drift.missingLocally.length > 20) {
      lines.push(`  - ...and ${drift.missingLocally.length - 20} more`);
    }
  }

  if (drift.changed.length > 0) {
    lines.push('Changed phrase IDs:');
    drift.changed.slice(0, 20).forEach(item => lines.push(`  - ${item.id}: ${item.fields.join(', ')}`));
    if (drift.changed.length > 20) {
      lines.push(`  - ...and ${drift.changed.length - 20} more`);
    }
  }

  lines.push('No local files were changed.');
  lines.push('Run `npm run phrases:pull` only when Notion should overwrite local phrase edits.');

  return lines.join('\n');
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

function writePhrasesJs(rows) {
  const phrases = Object.fromEntries(rows.map(row => [
    row.id,
    {
      arabic: row.arabic,
      translation: row.translation,
      literal: row.literal,
      tags: JSON.parse(row.tags)
    }
  ]));

  const header = [
    '// Phrase text can be edited locally in this file for fast development.',
    '// Run `npm run phrases:pull` only when you intentionally want Notion to replace it.',
    '// Run `npm run phrases:check:push` to dry-run pushing local phrase edits back to Notion.'
  ].join('\n');

  fs.writeFileSync(outputPath, `${header}\n\nconst phrases = ${JSON.stringify(phrases, null, 2)};\n\nexport default phrases;\n`);
}

function writeSyncManifest(pages, rows) {
  const syncedIds = new Set(rows.map(row => row.id));
  const phrases = {};

  pages.forEach(page => {
    const id = readPlainProperty(page, PROPERTY_NAMES.id);
    if (!id || !syncedIds.has(id)) return;

    phrases[id] = {
      notion_page_id: page.id,
      last_edited_time: page.last_edited_time
    };
  });

  const manifest = {
    database_id: databaseId,
    synced_at: new Date().toISOString(),
    phrases
  };

  fs.writeFileSync(syncManifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
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
