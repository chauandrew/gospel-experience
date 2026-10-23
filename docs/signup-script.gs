// Google Apps Script behind /signup/. Paste into Extensions > Apps Script of the "GXP Signups" sheet
// (tab "Signups", headers: Timestamp, Slot, Name, Group size), then Deploy > Web app, Execute as Me, access Anyone.
// Admin page (/admin/): set Project Settings > Script properties > ADMIN_PASSCODE to the passcode you want.
// After edits: Deploy > Manage deployments > pencil > New version (the URL stays the same).
const SHEET = 'Signups', CAP = 8, TZ = 'America/Los_Angeles';
// Same windows as src/signup.js. Change both together.
const WINDOWS = [
  ['2026-11-06', '18:00', '19:30'],
  ['2026-11-06', '20:30', '21:30'],
  ['2026-11-07', '09:00', '10:00'],
  ['2026-11-07', '15:00', '17:00'],
  ['2026-11-07', '19:00', '21:00'],
];
const mins = t => +t.slice(0, 2) * 60 + +t.slice(3);
const hhmm = m => ('0' + Math.floor(m / 60)).slice(-2) + ':' + ('0' + (m % 60)).slice(-2);

// slot start key -> slot end key, e.g. '2026-11-06 18:00' -> '2026-11-06 18:10'
const SLOTS = {};
WINDOWS.forEach(([d, s, e]) => {
  for (let m = mins(s); m < mins(e); m += 10) SLOTS[d + ' ' + hhmm(m)] = d + ' ' + hhmm(m + 10);
});

const json_ = o => ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
const sheet_ = () => SpreadsheetApp.getActive().getSheetByName(SHEET);

// Truth: totals straight from the sheet. Used to check capacity when someone signs up.
function sheetTaken_() {
  const sh = sheet_(), t = {};
  if (sh.getLastRow() > 1) {
    sh.getRange(2, 2, sh.getLastRow() - 1, 3).getValues().forEach(r => {
      t[r[0]] = (t[r[0]] || 0) + (Number(r[2]) || 0);
    });
  }
  return t;
}

// Every signup, for the admin page. Needs the ADMIN_PASSCODE script property.
function list_(pass) {
  const want = PropertiesService.getScriptProperties().getProperty('ADMIN_PASSCODE');
  if (!want || pass !== want) return json_({ ok: false, error: 'Wrong passcode' });
  const sh = sheet_();
  const rows = sh.getLastRow() > 1 ? sh.getRange(2, 1, sh.getLastRow() - 1, 4).getValues() : [];
  return json_({ ok: true, rows: rows.map(r => ({ ts: r[0], slot: r[1], name: r[2], size: Number(r[3]) || 0 })) });
}

// Fast path for page loads: totals cached for 60s, refreshed on every signup.
// Manual sheet edits show up within a minute.
function taken_() {
  const cache = CacheService.getScriptCache(), hit = cache.get('taken');
  if (hit) return JSON.parse(hit);
  const lock = LockService.getScriptLock(); // so a stale read cannot overwrite the cache a signup just refreshed
  lock.waitLock(10000);
  try {
    const again = cache.get('taken');
    if (again) return JSON.parse(again);
    const t = sheetTaken_();
    cache.put('taken', JSON.stringify(t), 60);
    return t;
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return json_({ taken: taken_() });
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    const body = JSON.parse(e.postData.contents);
    if (body.action === 'list') return list_(body.pass);
    lock.waitLock(10000);
    const { slot, name, size } = body;
    const n = String(name || '').trim().slice(0, 80), g = Number(size);
    const now = Utilities.formatDate(new Date(), TZ, 'yyyy-MM-dd HH:mm');
    if (!SLOTS[slot]) return json_({ ok: false, error: 'Unknown slot' });
    if (SLOTS[slot] <= now) return json_({ ok: false, error: 'That slot has passed' });
    if (!n) return json_({ ok: false, error: 'Name is required' });
    if (!Number.isInteger(g) || g < 1 || g > CAP) return json_({ ok: false, error: 'Invalid group size' });
    const t = sheetTaken_(), left = CAP - (t[slot] || 0);
    if (g > left) return json_({ ok: false, error: 'Only ' + left + ' spots left', left, taken: t });
    const sh = sheet_(), r = sh.getRange(sh.getLastRow() + 1, 1, 1, 4);
    r.setNumberFormats([['yyyy-mm-dd hh:mm:ss', '@', '@', '0']]); // text format keeps names from becoming formulas
    r.setValues([[new Date(), slot, n, g]]);
    t[slot] = (t[slot] || 0) + g;
    try { CacheService.getScriptCache().put('taken', JSON.stringify(t), 60); } catch (err) {} // best effort, the row is already saved
    return json_({ ok: true, left: left - g, taken: t }); // the page uses this instead of reloading
  } catch (err) {
    return json_({ ok: false, error: 'Request failed, try again' });
  } finally {
    lock.releaseLock();
  }
}
