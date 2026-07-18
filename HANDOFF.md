# Arda — project handoff

A living, photoreal **map-as-navigation** Tolkien companion app. The whole app *is*
a map of Middle-earth: you fly into a place, stand inside a photoreal scene, and tap
objects (which are the buttons) to open features. Built with a hobby dev who prizes
UI/immersion above all.

- **Live (installable PWA):** https://ecthelionofthefountain-510.github.io/ainulindale/
- **Repo:** `ecthelionofthefountain-510/ainulindale` (public), branch `master`
- **Local path:** `/Users/user/repos/my-react-projects/tolkien_app`

---

## The core experience

```
Wood-burned Middle-earth map (home)
   │  tap a place → FLY IN (accelerating dive toward the marker, forward
   │               perspective pitch, dark whoosh)
   ▼
Photoreal region scene (a room/place you stand inside; ambient light + motion)
   │  tap an object (bookshelf, gate, …) → push-in as a panel opens
   ▼
Feature panel (reading book / quiz / lore / achievements)
   │  "the map" → FLY OUT (scene zooms away; map pulls back to the chart)
   ▼
back to the map
```

Four places (all in Middle-earth):

| Place | Scene | Object → feature |
|---|---|---|
| **The Shire** — Bag End | cozy hobbit library | bookshelf → **reading log as a flip-through book** |
| **Rivendell** | moonlit elven library | great shelves → **lore / "did you know"** |
| **Mordor** | dark fortress, iron gate | gate → **trial quiz** (working engine) |
| **Minas Tirith** | white city, Court of the Fountain | hall → **achievements** ("Deeds of Renown") |

(Valinor was dropped early so all four sit inside Middle-earth and fit the mobile map.)

---

## Tech stack

- **Expo SDK 57** (bleeding edge — read https://docs.expo.dev/versions/v57.0.0/ before coding),
  expo-router (Stack, no tab bar), React Native 0.86, React 19
- **react-native-reanimated 4.5** — all animations (dive, rush-in, book, beacons)
- **react-native-gesture-handler 2.32** — swipe-to-turn in the book
- **expo-image** (scene/map photos), **expo-linear-gradient**, **AsyncStorage** (reading progress `arda.reading.v1`)
- Fonts: Cormorant Garamond (display) + EB Garamond (body)
- **Runs fully on web** — that's how it's shipped (GitHub Pages PWA). No custom native modules → Expo Go *would* work but the installed Expo Go was too old for SDK 57, so we went web.

---

## File map (all under `src/`)

- `app/_layout.tsx` — root: `GestureHandlerRootView` → `SafeAreaProvider` → `ReadingProvider` → `Stack` (fade)
- `app/+html.tsx` — web root HTML; wires the **PWA** (manifest, theme-color, service-worker registration), relative paths
- `app/index.tsx` — **the map** (home). Wood image + tappable glowing beacons; the "dive" fly-in + focus fly-out
- `app/shire.tsx`, `rivendell.tsx`, `mordor.tsx`, `minas-tirith.tsx` — the four scenes (each: `image`, hotspots, overlays, a panel)
- `components/scene/scene-view.tsx` — **heart of it**: `SceneView` (image + hotspots + chrome + fly-in/fly-out), `SceneOverlay`, `HotspotButton`
- `components/scene/hearth-glow.tsx`, `embers.tsx`, `window-breeze.tsx` — ambient light/motion overlays
- `components/bookshelf-panel.tsx` — **the flip-through book** (leather, ivory pages, spine, ribbon, swipe + chevrons + Contents jumps)
- `components/lore-panel.tsx`, `trial-panel.tsx`, `achievements-panel.tsx` — the other slide-up feature sheets
- `data/works.ts` (29 works), `data/lore.ts`, `data/trials.ts`
- `state/reading.tsx` — reading progress store (AsyncStorage)
- `theme/regions.ts` (region palettes incl. `minas-tirith`), `theme/fonts.ts`
- `assets/scenes/{bag-end,rivendell,mordor,minas-tirith}.jpg`, `assets/middle-earth.jpg` — all 768×1376 (9:16), a touch soft for high-DPI phones
- `public/manifest.json`, `public/sw.js`, `public/icon-{192,512}.png` — PWA (copied to web root on export)

---

## How the signature bits work

- **Fly-in (map → scene):** `index.tsx` `dive` shared value drives translate-toward-marker
  (translation is **scaled by the zoom factor** so the camera reaches the *tapped* place, not
  the map centre) + perspective `rotateX` + scale to `DIVE_SCALE` (4.2) + a dark flash overlay,
  then `runOnJS(router.navigate)`. On focus the map plays the reverse (start zoomed at the last
  place, pull back to the full chart) — also acts as the app-open intro.
- **Rush-in / fly-out (scene):** `scene-view.tsx` `enter` (2.1→WORLD_SCALE scale + 7°→0° pitch,
  decelerating) on mount; `exit` (zoom back + fade) on "the map", then `router.back()`.
- **Object push-in:** each scene passes `zoomed={panelOpen}`; `SceneView` leans the world in ~16%.
- **The book:** two-page spreads (frontispiece + Contents, then one per category), Reanimated
  `translateX` row, **swipe** via `Gesture.Pan()` (activeOffsetX/failOffsetY so vertical scroll +
  taps still work) with spring snap, plus chevrons + Contents jump links.
- **Map markers:** just a breathing glow + a ring pulsing outward (no icon/label), region-coloured,
  big `hitSlop`.

---

## ⚠️ Gotchas (learned the hard way)

1. **Never use the `pointerEvents` PROP** in this SDK — it doesn't update reactively (panels'
   buttons were all dead). Always `style={{ pointerEvents: … }}`.
2. **Headless preview freezes animations:** the preview browser runs `document.hidden`, which
   pauses `requestAnimationFrame`, so Reanimated animations freeze at their start value and
   `expo-image` photos stay at opacity 0 (look black). A pointer event wakes rAF and it settles.
   → When verifying: dispatch a pointerdown/up first, then screenshot; and **never gate a
   view's visibility purely on an on-mount animation** (fly-in is scale-only for this reason).
3. **`StyleSheet.absoluteFillObject`** throws a TS type error repo-wide (valid RN API, harmless) —
   ignore it when typechecking; it's pre-existing noise.
4. **PWA baseUrl:** `app.json` → `experiments.baseUrl` **must match the repo name** (`/ainulindale`).
   Rename the repo ⇒ update this + redeploy. `web.output: "static"` (per-route HTML, deep links work).
5. **Maps + AI image gen:** diffusion models can't spell — generate map art **text-less** and let the
   app's markers supply names. List key places as *visual* landmarks so small ones (Rivendell) aren't dropped.

---

## Build / run / deploy

- **Dev (web preview):** `npx expo start --web` (this is what the preview tooling uses)
- **Typecheck:** `npx tsc --noEmit` (ignore `absoluteFillObject` errors)
- **Deploy:** just **commit + push to `master`** → GitHub Actions (`.github/workflows/deploy.yml`)
  runs `npx expo export --platform web` → `dist/` → GitHub Pages (~4–5 min). `dist/` is gitignored.
- **Install on phone:** open the live URL in Android Chrome → ⋮ → **Install app** (real WebAPK, not a shortcut).

---

## Status: the core vision is fully realised & shipped

Home map + 4 photoreal scenes, fly-in/fly-out transitions, the flip-through book, working
quiz/lore/achievements, persistence, subtle glowing markers, installable PWA. All verified on web.

## Next / open ideas (all optional)

- **Higher-res art** — every image is 768×1376, slightly soft on the user's Oppo Find X9 Ultra.
  Regenerate at ~1080×1920 and drop-replace the files (no code change).
- **Name-on-tap for map markers** — labels are gone; a good compromise is fading the name in when a
  glow is pressed/held (user may miss the names).
- **Book page-curl** — current turn is a swipe-slide; a true 3D leaf-curl would need Skia.
- App **icon/splash** polish; proper **PWA manifest/icon** refinement; a **daily push** (needs a real build, not web).
- Prune the now-unused per-scene placeholder `…Art()` functions (kept as harmless fallbacks).
- Transition tuning knobs (all in `index.tsx` / `scene-view.tsx`): dive 520ms/scale 4.2/pitch 14°,
  scene enter 680ms/scale 2.1/pitch 7°, exit 360ms, map pull-back 560ms.

## User & working style

Hobby dev, React, **UI/immersion is the top priority**, Android (Oppo Find X9 Ultra), big Tolkien fan.
Communicates in Swedish. Likes momentum ("kör på"), honest feasibility answers, and seeing results on
his real phone. Ships other apps as Vite+React web PWAs on GitHub Pages (same hosting pattern, different stack).
