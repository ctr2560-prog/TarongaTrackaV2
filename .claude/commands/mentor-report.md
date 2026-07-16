# Weekly Mentor Report

Generate a weekly progress report on Taronga Tracka for Cameron's mentor — the Director at Taronga Zoo.

## Steps

1. Determine the reporting window: the last 7 days, or since the date passed as an argument (e.g. `/mentor-report 2026-07-09`).
2. Run `git log --since=<window start> --pretty=format:'%h %ad %s' --date=short --stat` in the repo to collect the week's commits and the files they touched. If commits are sparse, also check `git diff --stat` for uncommitted work in progress.
3. Group the work into these sections (omit any empty section):
   - **New this week** — new features, screens, resources or documents added
   - **Improvements** — refinements to existing features
   - **Fixes** — bugs found and resolved
   - **In progress / coming up** — anything started but not finished
4. Write the report following the style rules below, then show it to Cameron for review before he sends it.

## Style rules

- Dot points only, one line each where possible. Aim for 8–15 dot points total across all sections — merge related commits into one point.
- Write for a non-technical zoo director: describe what changed for teachers, students or Taronga staff, never the code. Say "Fixed student documentary videos not playing after the first clip" not "Rewrote per-clip promise to tear down video elements".
- Lead each point with a verb (Added, Improved, Fixed, Redesigned…).
- Name the product areas the director knows: Taronga Tracka (day program), ZooSnooz (night program), teacher portal, staff portal, assessment resources.
- No jargon: never mention commits, refactors, components, Firestore, or file names.
- End with a one-line "Focus for next week" if there is clear in-progress work.

## Output format

```
Taronga Tracka — Weekly Update
Week ending <date>

New this week
- ...

Improvements
- ...

Fixes
- ...

Focus for next week: ...
```
