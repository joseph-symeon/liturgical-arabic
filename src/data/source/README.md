# Data Sources

Phrase text now uses a two-source workflow:

- `src/data/texts/phrases.js` is the local app data file and can be edited directly for fast development.
- Notion is the shared editorial database for classroom and reviewer corrections.

There is no phrase CSV in the active workflow. `npm run dev` and `npm run build` do not regenerate phrase data, so local edits in `src/data/texts/phrases.js` are not overwritten by normal development or deploy builds.

These files are hand-edited directly so course structure, phrase composition, section order, and audio timings can be adjusted and previewed immediately during development:

- `src/data/course/units.js`
- `src/data/course/lessons.js`
- `src/data/course/exercises.js`
- `src/data/texts/phrases.js`
- `src/data/texts/segments.js`
- `src/data/texts/serviceTexts.js`
- `src/data/media/recordings.js`
- `src/data/media/alignments.js`

## Service Text Sources

Raw, unprocessed service books belong in `src/data/source/service-texts-raw/`.
This is the home for source PDFs, RTFs, and similar files that should remain
available as the textual authority.

PDF processing manifests belong in `src/data/source/service-text-manifests/`.
These JSON manifests can be committed because they record page, column, heading,
and section metadata without storing the generated review images. The generated
page renders, column crops, contact sheets, and section packet images remain
temporary workspace files under `/private/tmp/liturgy-pdf-workspaces/` and should
not be committed.

## Notion Sync For Phrases

Create a local `.env.local` file:

```sh
NOTION_TOKEN=secret_your_notion_integration_token
NOTION_PHRASES_DATABASE_ID=your_notion_phrases_database_id
```

### Command Reference

Use these commands to keep local `src/data/texts/phrases.js` and Notion in sync.

```sh
npm run phrases:check
```

Read-only drift report. Shows phrase IDs that are missing or changed between local and Notion. It does not describe which direction would win.

```sh
npm run phrases:sync:check
```

Read-only bidirectional sync preview. Shows safe per-phrase changes in both directions and reports conflicts when local and Notion both changed differently since the last sync.

```sh
npm run phrases:sync
```

Bidirectional sync. Applies safe per-phrase changes both ways: local-only changes are pushed to Notion, Notion-only changes are pulled locally, and conflicting phrase IDs are left untouched.

```sh
npm run phrases:check:pull
```

Read-only pull preview. Shows what would change locally if Notion replaced `src/data/texts/phrases.js`.

```sh
npm run phrases:pull
```

Pull from Notion. Notion wins and replaces local `src/data/texts/phrases.js`.

```sh
npm run phrases:check:push
```

Read-only push preview. Shows what would be created, updated, or archived in Notion if local `src/data/texts/phrases.js` won. If Notion has newer edits, this prints a warning but still writes nothing.

```sh
npm run phrases:push
```

Push to Notion. Local `src/data/texts/phrases.js` wins. Notion rows that do not exist locally are archived, not permanently deleted. If Notion has newer edits, the command prints a warning and then overwrites them with local phrase data.

### Typical Rhythms

At the start of a coding session:

```sh
git pull
npm run phrases:sync
```

Before applying mixed local and Notion phrase edits:

```sh
npm run phrases:sync:check
npm run phrases:sync
```

If you are unsure which side has changes:

```sh
npm run phrases:check
npm run phrases:check:pull
npm run phrases:check:push
```

A successful sync writes a local, git-ignored sync manifest at `src/data/source/phrases.sync.json`. The manifest records each Notion phrase page ID, `last_edited_time`, and the last-synced phrase fields so bidirectional sync can safely detect which side changed after your last sync.

The Notion database should have these properties:

- `ID`
- `Arabic`
- `Translation`
- `Literal`
- `Tags`

`Tags` should be a Notion multi-select. The scripts can still read older comma-separated text or JSON array strings if needed.

## GitHub Actions

The `Deploy to GitHub Pages` workflow intentionally force-syncs phrases from Notion at build time when Notion secrets are configured, then deploys the app. This is the classroom-friendly workflow:

```text
Edit Notion -> Run Deploy to GitHub Pages -> Live app updates
```

The deploy workflow does not commit generated phrase data. It builds the live app from Notion and leaves Git as the code plus local phrase snapshot repository.

The `Check Notion Phrase Drift` workflow can compare the committed local phrase snapshot with Notion without writing anything.

Add these repository secrets in GitHub under **Settings > Secrets and variables > Actions**:

- `NOTION_TOKEN`
- `NOTION_PHRASES_DATABASE_ID`
- Optional: `NOTION_PHRASES_STATUS`

For live classroom corrections, run **Actions > Deploy to GitHub Pages > Run workflow**.
