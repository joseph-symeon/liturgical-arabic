# Data Source CSVs

These CSV files are the editable source of truth for `src/data/*.js`.

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

You can sync `phrases.csv` from a Notion database.

Create a local `.env.local` file:

```sh
NOTION_TOKEN=secret_your_notion_integration_token
NOTION_PHRASES_DATABASE_ID=your_notion_phrases_database_id
```

Then run:

```sh
npm run sync:notion:phrases
```

The Notion database should have these properties:

- `ID`
- `Arabic`
- `Translation`
- `Literal`
- `Tags`

`Tags` can be a Notion multi-select, a comma-separated text field, or a JSON array string.

## GitHub Action

The `Sync Notion Phrases` workflow can run the same phrase sync from GitHub.

Add these repository secrets in GitHub under **Settings > Secrets and variables > Actions**:

- `NOTION_TOKEN`
- `NOTION_PHRASES_DATABASE_ID`
- Optional: `NOTION_PHRASES_STATUS`

Then run **Actions > Sync Notion Phrases > Run workflow**. If Notion changes phrase data, the workflow commits the updated `phrases.csv` and generated `phrases.js` back to the branch.
