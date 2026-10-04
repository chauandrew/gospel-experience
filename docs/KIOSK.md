# Kiosk runbook (Phase 9, human steps)

## Before the event (at home, on Wi-Fi)
1. Make sure the latest `main` is deployed (Vercel URL, HTTPS). Open it in Safari on the iPad.
2. Share > Add to Home Screen. Launch from the new icon (opens full screen, no Safari bar).
3. Tap Begin once with headphones on. Let the run play by itself (about 25s, nothing to scroll) and confirm music plays and changes mood at "Then something happened".
4. Close the app fully (swipe up, swipe the app away). Turn on Airplane Mode. Reopen from the icon and run through again. If it loads and plays offline, the cache is good.
5. Repeat on the second iPad.
6. Do step 4 again the morning of the event. iOS can evict cached data on a device that is low on storage.

## iPad settings
- Settings > Display & Brightness > Auto-Lock: Never.
- Settings > Accessibility > Guided Access: On. Set a passcode. Enable Accessibility Shortcut (triple-click the side or home button).
- Optionally turn on Do Not Disturb so notifications never cover the screen.
- Set volume once, then use Guided Access to lock hardware buttons if you want students unable to change it (the Options menu in Guided Access can disable the volume buttons). Volume is the only loudness control; the app has no slider.
- Keep the iPad plugged in. Turn off Wi-Fi and Bluetooth if you do not need them (headphones that are wired are simplest).

## Starting Guided Access
1. Open the app from the Home Screen.
2. Triple-click the side or home button, tap Guided Access, then Start.
3. Tap Options. Keep Touch on (students tap Begin, the mute button and Reset; the run itself needs no touch). Optionally turn off Motion, and turn off the volume buttons if you want volume locked. Leave Keyboards on only if you use a keyboard (Space works as Begin on the first screen and Reset on the last).
4. To exit: triple-click again and enter the passcode.

## Updating the app
New versions download in the background but only take effect after the app is fully closed and reopened (by design, so nothing reloads mid-event). To update an iPad: exit Guided Access, swipe the app away, reopen while online, wait a few seconds, swipe away again, reopen. Then re-run the offline check.

## Analytics
Vercel Web Analytics counts page views, but only while the iPad is online (it cannot report from airplane mode). For how many people finished the run, use the local count below.

## Reading the completion count
Count of people who reached the final screen, stored on the iPad only. Connect the iPad to a Mac, enable Settings > Safari > Advanced > Web Inspector (iPad) and Safari > Settings > Advanced > Show features for web developers (Mac). In Safari's Develop menu pick the iPad, then the app, and run `localStorage.getItem('gx-completions')`.

## If something goes wrong
- Silent: check the iPad is not muted (ring/silent switch does not affect Web Audio, but volume does) and headphones are connected. Tap anywhere; the app resumes audio on touch.
- Stuck on the last screen: tap Reset (or wait 15s for the idle reset). The run itself ends by itself in about 25s, so it should never be stuck mid-way; if it is, exit Guided Access and reopen the app.
- Someone muted the sound: the mute button (top right) clears itself on Reset and on every Begin.
- Blank or error offline: the cache was evicted. Connect to Wi-Fi, reopen the app once, then it is cached again.
