# Data Sources

Phrase text now uses a two-source workflow:

- `src/data/phrases.js` is the local app data file and can be edited directly for fast development.
- Notion is the shared editorial database for classroom and reviewer corrections.

There is no phrase CSV in the active workflow. `npm run dev` and `npm run build` do not regenerate phrase data, so local edits in `src/data/phrases.js` are not overwritten by normal development or deploy builds.

These files are hand-edited directly so course structure, phrase composition, section order, and audio timings can be adjusted and previewed immediately during development:

- `src/data/units.js`
- `src/data/lessons.js`
- `src/data/segments.js`
- `src/data/liturgySections.js`
- `src/data/exercises.js`
- `src/data/phrases.js`

## Notion Sync For Phrases

Create a local `.env.local` file:

```sh
NOTION_TOKEN=secret_your_notion_integration_token
NOTION_PHRASES_DATABASE_ID=your_notion_phrases_database_id
```

To check whether Notion and local phrase data differ without writing anything:

```sh
npm run check:notion:phrases
```

To pull Notion into `src/data/phrases.js`:

```sh
npm run sync:notion:phrases
```

If local `src/data/phrases.js` differs from Notion, this command refuses to overwrite it. To intentionally replace local phrase text with Notion data:

```sh
npm run sync:notion:phrases -- --force
```

A successful sync writes a local, git-ignored sync manifest at `src/data/source/phrases.sync.json`. The manifest records each Notion phrase page ID and `last_edited_time` so later pushes can detect Notion edits made after your last sync.

To push intentional local phrase edits from `src/data/phrases.js` back to Notion, dry-run first:

```sh
npm run push:notion:phrases
```

Then apply:

```sh
npm run push:notion:phrases -- --apply
```

Pushes are conflict-aware. If a Notion phrase changed after your last local sync, the push refuses to overwrite it and tells you which phrase IDs are unsafe. In normal use, resolve this by reviewing the local and Notion versions before choosing which one should win.

Only use the force flag when local `src/data/phrases.js` is intentionally authoritative and should overwrite newer Notion edits:

```sh
npm run push:notion:phrases -- --apply --force
```

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
