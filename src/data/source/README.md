# Data Source CSVs

These CSV files generate `src/data/*.js`.

For phrase text, **Notion is the canonical editorial source**. Treat `phrases.csv` as a local snapshot/staging file:

- Make ordinary phrase edits in Notion.
- Run the GitHub Pages deploy workflow to build the live app from Notion.
- Run `npm run sync:notion:phrases` when you want to refresh the committed local snapshot.
- Use local `phrases.csv` edits only for intentional batch/scripted cleanup.
- Before pushing local phrase changes back to Notion, run `npm run push:notion:phrases` as a dry run first.

The other CSV files remain the local source of truth for app structure:

- `segments.csv`
- `liturgySections.csv`
- `exercises.csv`
- `lessons.csv`
- `units.csv`

After editing them, regenerate the app data modules with:

```sh
npm run generate:data
```

`npm run dev` and `npm run build` also regenerate data first.

Columns that contain arrays or objects should be valid JSON:

- `phrases.csv`: `tags`
- `segments.csv`: `tags`, `phrases`
- `liturgySections.csv`: `segment_ids`
- `exercises.csv`: `segment_ids`, `audio_clip`
- `lessons.csv`: `exercises`

`liturgySections.csv` can also use `section_group` and `section_group_title_phrase` to organize related reader sections under a larger liturgical heading.

For example, a `segments.csv` `phrases` cell can contain:

```json
[{"phrase_id":"peace-from-above-001"},{"text":"، "},{"phrase_id":"salvation-001"}]
```

## Notion Sync For Phrases

You can sync `phrases.csv` from the Notion phrases database.

Create a local `.env.local` file:

```sh
NOTION_TOKEN=secret_your_notion_integration_token
NOTION_PHRASES_DATABASE_ID=your_notion_phrases_database_id
```

To check whether Notion and local phrase data differ without writing anything:

```sh
npm run check:notion:phrases
```

To pull Notion into local files:

```sh
npm run sync:notion:phrases
```

To push intentional local batch changes back to Notion, dry-run first:

```sh
npm run push:notion:phrases
```

Then apply:

```sh
npm run push:notion:phrases -- --apply
```

The Notion database should have these properties:

- `ID`
- `Arabic`
- `Translation`
- `Literal`
- `Tags`

`Tags` should be a Notion multi-select. The scripts can still read older comma-separated text or JSON array strings if needed.

## GitHub Actions

The `Deploy to GitHub Pages` workflow syncs phrases from Notion at build time when Notion secrets are configured, then deploys the app. This is the classroom-friendly workflow:

```text
Edit Notion -> Run Deploy to GitHub Pages -> Live app updates
```

The deploy workflow does not commit generated phrase data. It builds the live app from Notion and leaves Git as the code plus fallback-snapshot repository.

The `Check Notion Phrase Drift` workflow can compare the committed local phrase snapshot with Notion without writing anything.

Add these repository secrets in GitHub under **Settings > Secrets and variables > Actions**:

- `NOTION_TOKEN`
- `NOTION_PHRASES_DATABASE_ID`
- Optional: `NOTION_PHRASES_STATUS`

For live classroom corrections, run **Actions > Deploy to GitHub Pages > Run workflow**.

Use local `npm run sync:notion:phrases` occasionally when you want the committed fallback snapshot to catch up with Notion.
