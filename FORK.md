# Tasks Map All Tasks Fork

This is a personal fork of
[`NicoKNL/tasks-map`](https://github.com/NicoKNL/tasks-map) at version 0.36.1.

## Why This Fork Exists

Upstream hides tasks that have no dependencies and places them in the
Unlinked Tasks panel. That default made standalone Jira-backed tasks appear
missing from the graph.

This fork sets `DEFAULT_EMBED_CONFIG.hideUnlinkedTasks` to `false`, so every
valid task is a graph node by default. The existing "Hide unlinked tasks"
control remains available and can restore the upstream behavior for the
current view.

It also treats a task nested directly below another task as implicitly blocked
by that parent. These inferred dependencies are rendered in the graph without
adding dependency metadata to the Markdown source. Explicit dependencies are
preserved and deduplicated with inferred ones.

Task node summaries use only the task's first line. Indented continuation text
remains available in the Markdown note without appearing in the graph node.

The plugin keeps the upstream `tasks-map` ID because the view resolves its
plugin instance by that ID.

## Build

```sh
npm ci
npm test -- --runInBand
npm run lint
npm run build
```

Install `main.js`, `manifest.json`, and `styles.css` in:

```text
<vault>/.obsidian/plugins/tasks-map/
```
