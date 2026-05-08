# Documentation

Start here when working on the project.

## App And Course Data

- [Data Architecture](data-architecture.md): how phrases, segments, service texts, recordings, alignments, activities, and lessons relate.
- [Phrase Source Workflow](../src/data/source/README.md): how phrase data syncs with Notion.

## Recording Pipeline

- [Recording Import](recording-import.md): local tools, manifests, ASR transcripts, audio cache policy, and import commands.

## Quick Setup

Install Node dependencies:

```bash
npm install
```

Run the app:

```bash
npm run dev
```

Check recording import tooling:

```bash
npm run import:recording:check
```
