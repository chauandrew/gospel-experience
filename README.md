# The Gospel Experience (signups)

Signup and admin pages for Gospel Experience events. Vanilla JS + Vite, Supabase backend, PWA shell.

```
npm install
npm run dev        # http://localhost:5173
npm run build && npm run preview
```

- Pages: `/` lists upcoming events, `/signup/?e=<slug>` is the signup form, `/admin/?e=<slug>` lists and removes signups (`/admin/` alone lists every event). Add `&kiosk` to `/signup/` on a shared iPad to reset to a blank page after 60s idle.
- Events live in the database, not the code: add an `insert into gxp_events` block at the bottom of `docs/signup.sql` (title, people per slot, minutes between slots, minutes per showing, windows) and run the file in the Supabase SQL editor. The pages pick it up with no deploy.
- Docs for contributors and agents: `docs/` (start with `docs/PROGRESS.md`).
- Deploys: Vercel from GitHub. PR branches get preview URLs; merging to `main` ships.
