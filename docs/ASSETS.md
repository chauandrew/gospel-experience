# Assets

Borrowed from Course 101 (course101.online) with permission from the owners. Download into `public/`, never hotlink. Record each asset actually used.

Hosts: `https://course101-online.s3.amazonaws.com/assets/` and `https://cdn.prod.website-files.com/5ecd12d9d0406daae74fdc52/`

## Candidates (not yet downloaded)
| Type | Source path | Size | Planned use |
|------|-------------|------|-------------|
| Music | `c101-online-chapter-2a-music/Silent_Place.mp3` | 1.7 MB | ambient |
| Music | `c101-online-chapter-2a-music/Walk_In_The_Moonlight.mp3` | 0.8 MB | ambient alt |
| Music | `c101-online-chapter-2a-music/Forest_Sanctuary.mp3` | 0.8 MB | ambient alt |
| SFX | `c101-online-chapter-2a-music/SFX_Heartbeat_Loop.mp3` | 0.13 MB | tension |
| Music | `c101-online-chapter-4a-music/BGM_Downward_Spiral.mp3` | 1.5 MB | tension |
| Music | `c101-online-chapter-4a-music/BGM_Ending.mp3` | 2.4 MB | pivot/finale swell |
| Music | `c101-online-chapter-4a-music/BGM_Guilt_Shame.mp3` | ? | tension alt |
| Lottie | `5ed6e96a8f46feef5dabc597_ch1-soul.json` (cdn) | ? | TBD |
| Lottie | `5fc2f72d69f4ae57f4006626_clickcircle_v5.json` (cdn) | ? | tap/scroll hint |
| Lottie | `c101-online-chapter-4a-lotties/en/DownwardSpiral.json` | ? | tension |
| SVG | ch2 picture frames: `pictureframe_normal_v3`, `slightlydamaged_v5`, `heavydamaged_v9` (cdn) | small | Slide 2 decay |

## Background-image candidates (found Phase 2 revision; all on the cdn host, view before choosing)
- ch1: `5eceaf863b049e33d3e3e18b_ch1_shooting-star-compressor.png` (Genesis/night sky), `5ed0258aaca3286299a6859d_ch1_sky-img-foreground.png` (+ `-p-1600` resized variants), `5ecefab09d8fbe2bf9dd85ae_ch1_leaves-compressor.png`, `5ed116c4592a1f170cb60c52_ch1_rock-underwater-compressor.png`, `5ed30f684fe81a47e9a1678e_ch1_man_image-of-god-compressor.png`
- ch2 scenes (starfield, Garden of Eden, ruined city) and ch4 painterly backgrounds (lone tree at dusk) are loaded as CSS/Lottie backgrounds, not plain `<img>` tags; Phase 3 agent should inspect network requests in Chrome to find the files.
- Prefer the `-p-1600` resized PNGs (smaller) for iPad; convert to WebP if size matters.

## Chosen for v1 (Phase 2 decision, download in Phase 3)
- Ambient (gate to Slide 2): `Silent_Place.mp3`
- Tension (Slide 2): `BGM_Downward_Spiral.mp3` (optionally layer `SFX_Heartbeat_Loop.mp3`)
- Pivot and finale (Slide 3 on): `BGM_Ending.mp3` (crossfade in at Slide 3)
- SVG: the three ch2 picture frames (normal, slightly damaged, heavy damaged) for the Slide 2 decay
- Lottie: `clickcircle_v5.json` as the scroll/tap hint; `ch1-soul.json` and `DownwardSpiral.json` are previews-to-judge, drop if they clash with dark theme or stutter
- Fonts are not borrowed: `@fontsource/poppins`, `@fontsource/roboto` from npm (OFL)
- Total audio about 6.4 MB precached

## Used (artwork, Course 101 chapters 1, 2; copied into `public/img/`)
- Slide 1 (creation, one image per stage, all alive: the first stage must never look like a dead world): `sea.jpg` (ch1_sea-compressor, bright coast, "In the beginning"), `genesis-garden.svg` (ch_genesis_1-02, green garden, "And it was good"), `creation-people.jpg` (heaven-family.jpg from the ch7 heaven set, people with arms open in a golden field, "Very good")
- Slide 2 (relational brokenness): `genesis-dusk.svg` (1-03, behind the question), `photo-wall.svg` (c02-s04-FamilyPhotos2, a wall of happy photos shown dim and desaturated so it reads as looking at everyone else's life: Comparison; alternatives if it is still too light: ch3 `laptop-phone.svg` desk scene, a night city-lights bokeh jpg from ch2, ch4 `sinroom_door1faded.png` wall of self-justifying words), `alone-room.svg` (2a_Prodigal_Bedroom3, someone alone in a dark room: Isolation), `whisper.svg` (friendship_2, a whispered secret: Betrayal). Removed: `alone.svg` (lone figure on a hill, too dark/tiny), `cracked-photo.svg` (couple-focused).
- `night-sky.jpg` (ch1_night-sky-100vh): slide 3, darkness before the light swell
- `hills.jpg` (ch2_intro_v4): slide 4, hopeful landscape for "rescue"
- `sunrise.svg` (ch5a-sunny-desert_3): finale, warm sunrise for "step inside" (replaced `arch.svg`)
- Other finale/slide-3 candidates found (ch3-7, not downloaded into repo; fetch from the cdn host): `man-kneel-before-god.png` (rays of light on a kneeling figure), `God_appears.png` / `god_appears_w_one_person.png` (sun burst over a dark city: would suit slide 3), `c06-s02-gift_offer.svg` (an offered hand/gift), `king-maiden-intro.svg`, `c05-s05_wreckage_light.svg`, ch7 night-sky van photo. Note several PNGs are small (about 480px).
- Considered and rejected: Bethlehem and cave PNGs (477px, too small for full bleed), hell-door and sin-room art (too dark/heavy), picture-frame SVGs (replaced by the full-bleed set), sky.png (too bright behind white text).
- Perf watch: large SVGs and JPGs are scaled by a slow zoom animation. If the iPad stutters, rasterize to WebP at about 2048px wide. (`broken-world.svg`, 611 KB, and `genesis-fall.svg` were removed from the repo when slide 2 became relational.)

## Used (other)
Downloaded in Phase 3 into `public/` (Course 101, with permission):
- `audio/Silent_Place.mp3`, `audio/BGM_Downward_Spiral.mp3`, `audio/BGM_Ending.mp3` (USED, wired in `src/slides.js` `tracks`)
- `svg/frame-normal.svg`, `svg/frame-damaged.svg`, `svg/frame-broken.svg` (removed from repo; replaced by full-bleed art)
- `lottie/clickcircle.json` (NOT used: full-screen off-center comp)
- `img/sky.png` (used as slide 4 bg, very dim), `img/shooting-star.png`, `img/leaves.png` (unused so far)
