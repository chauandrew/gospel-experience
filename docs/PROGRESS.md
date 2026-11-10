# Progress

- [x] Signup on Supabase, 15 minute slots, waitlist, any group size (SoCal Ignition 2026, ran Nov 6-7, went well)
- [x] Trailers removed (still in git history before the `multi-event-signups` PR); the site is signup only
- [x] Multiple events: events are rows in `gxp_events` (DECISIONS 2026-11-10)
- [ ] Human: run `docs/signup.sql` in the Supabase SQL editor BEFORE merging/deploying the multi-event PR (it adds `gxp_signups.event`, tags existing signups `socal-ignition-2026`, replaces the `gxp_*` functions). Then check `/` and `/admin/?e=socal-ignition-2026`.

## Next agent start here
To add an event: copy the `insert into gxp_events` block at the end of `docs/signup.sql`, set slug, title, cap, slot_minutes, show_minutes and windows, run the file in Supabase. Share `/signup/?e=<slug>`. Admin is `/admin/?e=<slug>` (unlinked, no passcode).
The old service worker from the trailer days may still be on the booth iPads; the PWA uses `registerType: 'prompt'`, so a new build only takes over after the app is fully closed and reopened.
