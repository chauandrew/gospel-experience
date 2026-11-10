# Gospel Experience Teaser

Multi-event signup site (vanilla JS + Vite, Supabase backend, vite-plugin-pwa). Pages: `index.html` (upcoming events), `signup/`, `admin/`. Used at retreat booths on iPads and on phones.

## Start here
1. Read `docs/PROGRESS.md` (current phase and "next agent start here" notes).
2. Read `docs/DECISIONS.md` as needed. Backend and event definitions: `docs/signup.sql`.

## Rules
- Branch + PR for every phase. Never commit or push to main. Human merges.
- At the end of a phase: update `docs/PROGRESS.md`, append any new decision to `docs/DECISIONS.md` (never rewrite history).
- Events are rows in `gxp_events` (end of `docs/signup.sql`). Never hardcode slots or event details in `src/`.
- Needs Wi-Fi: signups go to Supabase.
- Keep it simple: no frameworks beyond the listed stack, no unrequested features.
- Never use em-dashes. Be terse.
