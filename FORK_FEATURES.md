# Fork Features

Additions to [usememos/memos](https://github.com/usememos/memos). All changes are frontend-only (except tag aliases which add one proto field) and designed for minimal upstream rebase conflict.

## Tag Aliases

Assign display aliases to tags (e.g. `person/mj` → `Michael Jordan`). Toggle alias mode on/off from the sidebar Tags section dropdown menu. When active, tags in memo content and the sidebar show aliases instead of raw tag names.

**Configure:** Settings → Tags → enter alias per tag rule.

## Year Navigation

Sidebar shows a "Years" section listing all years with memos and their counts. Click a year to filter the current view to that year. Click again to remove the filter. Works on Home, Explore, and other collection pages.

Also extends the `displayTime` filter to accept `YYYY` and `YYYY-MM` formats (previously only `YYYY-MM-DD`).

## Date-Time Picker for New Memos

When creating a new memo, the date-time selector is always visible in the toolbar (previously only shown when navigating from a specific calendar date). Defaults to the current date-time. Uses the browser's native date-time picker widget.

Click the date in the toolbar to open the picker and adjust created/updated timestamps before saving.

## Local Build

```bash
# Full build (frontend + backend)
podman build -t memos -f Dockerfile.full .

# Run
podman run --rm -p 5230:5230 -v memos-data:/var/opt/memos localhost/memos
```
