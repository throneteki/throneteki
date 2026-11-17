# Adaptive game board: plan

An experimental game board that works without scrolling on phones in portrait and landscape and scales
up to desktop. It sits beside the current ("classic") board, and a player chooses between them in the
HUD settings.

- Branch: `feat/adaptive-board`, branched from `feat/gameboard-overhaul`.
- Status: planning. Tick items off as they land. **After each phase, re-read this file and check every
  item in that phase against the code before calling the phase done.**

## Goals

1. The page never scrolls. Only a crowded play-area row may scroll, sideways and on its own, as a last
   resort.
2. Popups and modals suit a phone: sheets anchored to the screen edge, not floating windows.
3. The player prompt is designed for a phone first and scales up to desktop.
4. The board layout adapts to the screen's size and orientation, and every area stays where players
   expect to find it.
5. The player bars are reworked for each size and orientation.

Out of scope for now: changing how taps work on touch screens (decided 2026-11-16: keep "tap clicks,
hold still to zoom, hold and move to drag").

## Decisions

| Date       | Decision                                                                                                                                                                                                                                                                                                                                                         |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-11-16 | Support both portrait and landscape as real layouts.                                                                                                                                                                                                                                                                                                             |
| 2026-11-16 | The opponent's hand, deck, piles and plots may be drawn smaller than ours. **Both play areas always use the same scale.**                                                                                                                                                                                                                                        |
| 2026-11-16 | Show initiative, claim and reserve on the active plot rather than in the bar. This is a trial, and we may revert it.                                                                                                                                                                                                                                             |
| 2026-11-16 | Keep the current touch model. Tap-to-preview is deferred.                                                                                                                                                                                                                                                                                                        |
| 2026-11-16 | Trial the midline scoreboard (opponent stats, then the prompt, then our stats).                                                                                                                                                                                                                                                                                  |
| 2026-11-16 | A new layout built from shared parts. The classic layout files stay almost untouched.                                                                                                                                                                                                                                                                            |
| 2026-11-16 | The switch is a HUD setting, `board: 'classic' \| 'adaptive'`, defaulting to classic.                                                                                                                                                                                                                                                                            |
| 2026-11-16 | This plan lives in `docs/` on the experimental branch.                                                                                                                                                                                                                                                                                                           |
| 2026-11-16 | Hide the site navbar on `narrow` and `short`. The game menu takes over Leave and Concede. `wide` keeps the navbar.                                                                                                                                                                                                                                               |
| 2026-11-16 | After a successful drop out of a sheet, the sheet comes back at peek.                                                                                                                                                                                                                                                                                            |
| 2026-11-16 | Check layouts with a dev-only fixture route that renders the board from canned game states.                                                                                                                                                                                                                                                                      |
| 2026-11-16 | `wide` keeps the classic full-size piles. The compact piles cluster is only for `narrow` and `short`.                                                                                                                                                                                                                                                            |
| 2026-11-16 | Melee is part of this work, not an afterthought. Our board stays fixed at the bottom, and opponents go in a carousel on the opponent's side, with tabs to jump to any opponent. Joust is the same carousel with one opponent and no tabs.                                                                                                                        |
| 2026-11-16 | Melee auto-follow is a HUD setting, `followAction`, **on by default**. It follows the opponent with the active prompt. During our own prompt, it jumps to an opponent whose board has cards we can select.                                                                                                                                                       |
| 2026-11-16 | Swiping or jumping by hand pauses auto-follow. It resumes by itself the next time the action moves to a different player.                                                                                                                                                                                                                                        |
| 2026-11-16 | `wide` melee uses the same carousel, showing as many opponents side by side as fit, and pages for the rest.                                                                                                                                                                                                                                                      |
| 2026-11-16 | The classic board moves to `GameBoard/Classic/`. **Nothing outside `Classic/` imports from it**, so the classic board can be removed later by deleting one folder. Anything the adaptive board needs stays shared at the `GameBoard/` root, and the adaptive `wide` layout is built from shared parts rather than from classic `PlayerRow` and `SideBoardPanel`. |
| 2026-11-17 | Prompt buttons on phones fill up to two rows of chips sized to their text. Whatever doesn't fit goes under a "More" chip that opens the full list. This replaces "3 inline, else 2 + More".                                                                                                                                                                      |
| 2026-11-17 | Prompt buttons keep the server's order on every layout, so the shortcut numbers and desktop match. Cancel-style buttons are styled grey, not moved. This replaces "main action nearest the right edge".                                                                                                                                                          |
| 2026-11-17 | The plot/faction stack does not open a chooser. Each pile in it is tapped on its own.                                                                                                                                                                                                                                                                            |
| 2026-11-17 | The prompt is the **midline divider** on every layout: a slim full-width strip between the two halves, not a box. It's styled the same everywhere (the desktop prompt's look isn't kept on the adaptive board). This replaces the right-hand column in `short` and the side panel in `wide`.                                                                     |
| 2026-11-17 | A **phase track** runs along the divider's top edge: all seven phases, past ones dimmed, the current one lit and named. Short names in `narrow`, full names elsewhere.                                                                                                                                                                                           |
| 2026-11-17 | Cards and interface fill the room available: every mode grows the cards until the height, strip or rows stop it (`wide` up to 2×), and the interface never shrinks below its normal size on the adaptive board. "Small" cards is 0.7× that fit; "Large" can't grow past it.                                                                                      |
| 2026-11-17 | In `short` (phone landscape) the divider is a single row: the phase track and both players' totals sit inline at its start. Location rows stay full size.                                                                                                                                                                                                        |
| 2026-11-17 | The opponent's hand is a single card back with its count, not a two-card fan.                                                                                                                                                                                                                                                                                    |

## Rules that hold in every layout

These keep the board recognisable when it changes shape:

- Ours at the bottom, the opponent's at the top. Characters sit nearest the middle and locations
  outside them.
- Plots, faction and agenda on the **left**. Draw deck, discard, dead, shadows and out of game on the
  **right**.
- The prompt and player stats sit at the midline (narrow) or on the right-hand rail (short and wide).
- Our hand is along the bottom edge, or in our row on the wide layout.
- The game menu and the chat tab are in the same corner on every layout.

## Review notes (open concerns)

Your notes from reviewing the board. Each one is fixed now, assigned to a phase, or open. Tick them off
as they are resolved, and add new notes here.

From the review on 2026-11-17:

- [x] **R1 Play rows wrap, never overlap.** When a row overflows and there's vertical room (portrait),
      it wraps onto more rows. With no room, the play area scrolls, with a clear hint that there are
      more cards. Cards in play never overlap. **Fix now** (replaces phase 1's overlap).
      Done: rows wrap (`PlayerBoard` `overflow="wrap"`). Each play area is a `ScrollArea` that scrolls up and down with a fade and a "more" marker at any edge with cards past it. The opponent's area stays scrolled to the end nearest the divider. `FittedRow` and its overlap are removed.
- [x] **R2 Faction card shows behind the agenda.** A bug. **Fix now.**
      Done: each wrapper in the stack gets its own stacking context (agenda `z-0`, faction `z-10`), so the agenda card's own z-index no longer rises above the faction.
- [x] **R3 Crowded fixture with an alliance agenda** (three agenda cards) on one side. **Fix now.**
      Done: the crowded fixture's opponent has Alliance with Banner of the Stag and Banner of the Kraken.
- [x] **R4 Reaction windows: choices should highlight the cards, not be buttons, with a Pass button.**
      The server already does this: it lists as buttons only cards that can't be shown on the board.
      My fixture invented buttons. **Fix the fixture now**, and check against the server.
      Done: checked against `TriggeredAbilityWindow`. The cards that can react are made selectable, and only cards in a draw deck, discard or dead pile become buttons ("Name (location)"), alongside "Don't ask again this phase" and Pass. The `reaction` fixture now matches that. The new `responder` fixture is what every possible responder sees (Pass, Wait, "Don't ask again", with the countdown). The `crowded` fixture's prompt is now an ordinary "Initiate a challenge".
- [ ] **R5 Prompt title and prompt text on the same line** isn't liked. Rework the divider's text
      layout. **Phase 4** (with the scoreboard).
- [ ] **R6 Piles need to be identifiable** without the full text labels that don't fit small screens.
      Consider options. **Phase 4/5.**
- [ ] **R7 The count bubbles on every pile feel disjointed.** Rethink alongside R6. **Phase 4/5.**
- [ ] **R8 Tapping a card to select it** should animate smoothly and enlarge the card so it's easier to
      see. **Phase 3** (card preview).
- [ ] **R9 Card piles in different sizes feel off,** even on mobile. Plots in particular need to be
      clearly visible. Rethink the separate pile scale. **Phase 4/5.**
- [x] **R10 Nothing may be cut off:** cards (location bottoms in landscape), selection rings, and cards
      flying between zones (hand to board). Review clipping everywhere. **Fix now** for the play areas
      and rings; check flights in phase 5.
      Done: the play areas no longer cut cards off. They scroll instead, with an inner margin so the selection rings show. The height budget now counts each play area's margins and a tenth of a card per row for attachments, which is why landscape location rows were cut off before. Cards flying into an area that cuts off its overflow (marked `data-clips`: play areas and the carousel) fly as a copy above the page (`flyAbove` in `flip.js`), and the real card shows once the copy lands. Classic marks nothing, so it is unchanged. **Still to check in phase 5:** every flight in a real game.
- [ ] **R11 Power and gold must be clearer and larger, with their icons.** **Phase 4** (scoreboard).
- [x] **R12 Manual mode has gone missing** from the adaptive board. **Fix now** (temporary button), then
      into the game menu in phase 4.
      Done: a wrench button on the divider, red while manual mode is on, for players only. It sends the same message as classic, with the same tooltip. It moves into the game menu in phase 4.
- [ ] **R13 The chat tab on phones** covers the opponent's board. Consider a chat button on the
      divider, and make sure it opens and closes smoothly. **Phase 4** (game menu).

## Architecture

### Switch

- [x] `client/hud.js`: add `board: 'classic'` to `defaultHud`, and accept `'classic' | 'adaptive'` in
      `normalizeHud`.
- [x] `server/hudSettings.js`: allow `board` through `sanitizeHud`, as one of those two values only.
- [x] `client/Components/Profile/HudSettings.jsx`: add a "Board layout" radio with the options
      Classic and Adaptive (experimental). The profile and in-game settings both show it, as card size
      does.
- [x] `GameBoard.jsx`: render `AdaptiveGameBoardLayout` when `hud.board === 'adaptive'`, and the
      classic layouts otherwise. The same layout handles joust and melee. Until phase 6's acceptance
      passes, melee falls back to the classic board.
- [x] Add `followAction: true` to `defaultHud`, and accept it as a boolean in `normalizeHud` and
      `sanitizeHud`. The HUD settings get a "Follow the action in melee" switch.
- [x] Tests: add the `board` and `followAction` keys to `test/client/hud.spec.js`, and add a server
      spec for `sanitizeHud`.

### Folders

```
client/Components/GameBoard/
├── GameBoard.jsx        picks Classic or Adaptive from hud.board
├── Classic/             the classic board only; nothing else imports from here
├── Adaptive/            the adaptive board
└── (shared)             Card, CardPile, Droppable, PlayerBoard, ActivePlayerPrompt, drag/flip, …
```

Move into `Classic/` (only the classic layouts use these):

- [x] `GameBoardLayouts/JoustGameBoardLayout.jsx` and `GameBoardLayouts/MeleeGameBoardLayout.jsx`
      move to `Classic/`, and the `GameBoardLayouts/` folder is removed.
- [x] `PlayerRow.jsx`, `PlayerStats.jsx`, `StatContainer.jsx`, `StatDisplay.jsx`, `StatButton.jsx`
      (imported nowhere, but moved rather than deleted, as decided) and `SideBoardPanel.jsx`.
- [x] `ReportProblemModal.jsx` stays shared, because the game menu needs it.

These stay shared because the adaptive board needs them: `ActivePlayerPrompt`, `GameTimer`
(`ChessClock`, `TimeLimitClock`), `DrawDeck`, `PlayerPlots`, `AnimatedSlot`, `SquishableCardPanel`,
`PlayerBoard`, `CardPile`, `Card`, `MovablePanel` and `Droppable`.

- [x] Do the move as its own commit with no other changes: `git mv` and import paths only. The
      classic board's behaviour doesn't change.
- [x] Check: a search finds no imports of `Classic/` from outside it (`grep -rn "/Classic/"
client --include=*.js*` lists only `GameBoard.jsx`). The client builds, and the client specs
      pass.

### Files

New code goes under `client/Components/GameBoard/Adaptive/`:

| File                          | Role                                                                                                                          |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `AdaptiveGameBoardLayout.jsx` | Lays out both sides for the current mode                                                                                      |
| `useBoardLayout.js`           | Watches the board area and returns the mode and scales; sets `data-layout`                                                    |
| `adaptiveScale.js`            | Pure functions: mode classification (with hysteresis) and per-mode scale fitting                                              |
| `PlayerStrip.jsx`             | One player's non-play row: plot/faction/agenda stack, piles cluster, opponent hand                                            |
| `PileCluster.jsx`             | Deck, discard, dead, shadows and out of game as a compact cluster with counts                                                 |
| `PlotFactionStack.jsx`        | Active plot with the faction and agenda peeking behind it                                                                     |
| `OpponentHand.jsx`            | A short fan of card backs and a count                                                                                         |
| `HandTray.jsx`                | Our hand along the bottom edge (fully shown, or peeking in `short`)                                                           |
| `Scoreboard.jsx`              | The midline strip: opponent stats, then the prompt, then our stats                                                            |
| `PromptBar.jsx`               | The phone prompt: phase, text, button chips, "More", and a waiting pill                                                       |
| `BoardSheet.jsx`              | The edge-anchored sheet that replaces `MovablePanel` on the adaptive board                                                    |
| `sheetStore.js`               | Allows one sheet at a time, with tabs for recently opened piles                                                               |
| `GameMenu.jsx`                | Settings, mute, manual mode, report, shortcuts, concede and leave                                                             |
| `DropTray.jsx`                | Drop targets for hidden piles (shadows, out of game) that appear over the board while dragging                                |
| `OpponentCarousel.jsx`        | The opponent's side: one slide per opponent (strip and play area), scroll-snapped, showing as many at once as the mode allows |
| `OpponentTabs.jsx`            | Melee only: a mini scoreboard per opponent in seat order, used to jump; shows active, follow and selectable markers           |
| `useAutoFollow.js`            | Picks the opponent to show and handles pausing and resuming                                                                   |
| `followTarget.js`             | Pure: the follow target from the players' state (active prompt, our selectable cards, seat order)                             |
| `adaptive.css`                | Layout CSS keyed off `[data-layout]` (not needed yet: grid areas are inline)                                                  |
| `useAdaptivePage.js`          | Page-level settings while the board shows: `viewport-fit=cover` and no overscroll                                             |
| `LeaveGameButton.jsx`         | Temporary Leave Game while the navbar is hidden; replaced by `GameMenu` in phase 4                                            |

Outside `Adaptive/`: `client/boardLayoutStore.js` (the current mode, for the navbar) and `client/dev/`
(the fixture page, development only).

Changes to shared components follow one rule: **add an optional prop or context whose default is the
classic behaviour.** That leaves the classic board unchanged. The planned shared changes are:

- [ ] Extract a `usePromptActions` hook from `ActivePlayerPrompt`, covering the fresh-press guard, the
      Google form link, `pausesTimer`, keyboard shortcuts, lookups and the response-delay text.
      `ActivePlayerPrompt` must behave exactly as before.
- [ ] Add a `PopupHostContext` (`'panel'` by default, `'sheet'` on the adaptive board). `CardPile`'s
      popup and `Card`'s underneath popup render through a `PopupContainer` that picks
      `MovablePanel` or `BoardSheet`.
- [ ] `PlayerBoard`: add an optional `overflow` prop (`'grow'` by default, as today, or
      `'squish-then-scroll'`).
- [ ] `SquishableCardPanel`: add an optional `fitWidth` that squishes to the width available instead
      of to `maxCards`.

### Layout modes

`useBoardLayout` measures the board area (not `window`), classifies it, and publishes the mode through
context and `data-layout` on the board root.

| Mode     | Rough rule (to be tuned)                   | Typical device                        |
| -------- | ------------------------------------------ | ------------------------------------- |
| `narrow` | aspect ratio (w/h) < 0.9 and width < 900px | Phone portrait, small tablet portrait |
| `short`  | height < 560px and landscape               | Phone landscape                       |
| `wide`   | everything else                            | Tablet landscape, desktop             |

- [x] Hysteresis: only change mode after crossing a threshold by a margin, so resizing near a
      boundary doesn't make it flap.
- [x] Freeze the mode and scales while a text input has focus. The phone's on-screen keyboard
      shrinks the viewport, and the board must not reshuffle under the chat input.

### Scales

There are three CSS variables. Every card size already comes from `var(--card-scale)`, so a region
gets a different scale by overriding the variable locally with
`style={{ '--card-scale': 'var(--pile-scale)' }}`. Card components, flips and `registerPile` don't
change, because they measure the real elements.

| Variable       | Used by                                                                          |
| -------------- | -------------------------------------------------------------------------------- |
| `--card-scale` | Both play areas, at the same value                                               |
| `--hand-scale` | Our hand tray                                                                    |
| `--pile-scale` | Plots, faction, agenda, the piles cluster and the opponent's hand, on both sides |

- [x] `adaptiveScale.js`: a pure function that fits the three scales to the board area for a given
      mode and the row counts (the widest character row and widest location row on either side,
      counting kneeling as wider). The HUD's card and interface sizes still multiply in. Unit tested
      in `test/client/adaptiveScale.spec.js`.
- [x] `useHudScale` keeps the classic calculation when `board` is classic. On the adaptive board,
      `useBoardLayout` sets the three variables, and `--ui-scale` and `--text-scale` work as today.

### Play-area overflow, in order

1. Fit: shrink `--card-scale` until the widest row fits, down to the readable minimum for the mode.
2. Squish: overlap that row's cards, as in the hand. The left strip of each card stays visible, which
   holds the cost, strength and challenge icons. On touch, tapping a card raises it, as the hand does
   now.
3. Scroll: only that row scrolls sideways, with scroll snapping and an edge fade. The page never
   scrolls.

## Layouts

### `narrow` (portrait)

```
┌───────────────────────────┐
│ [plot▸fac▸ag]  ▭▭▭ 7  [piles]│  opponent strip (pile scale)
│ opponent locations        │
│ opponent characters       │  play areas (same card scale)
│ ⚔9 ⛁3 │ CHALLENGES · Pass? │ ⛁5 ⚔7 │  scoreboard
│ [   Pass   ] [ Military ▸ ]│  prompt buttons (chips)
│ our characters            │
│ our locations             │
│ [plot▸fac▸ag]     [piles] │  our strip (pile scale)
│ ▕hand  hand  hand  hand ▏ │  hand tray (hand scale, fully shown)
└───────────────────────────┘
```

- The hand is fully shown, because portrait has height to spare. Tapping still raises a card first,
  as today.
- The chat tab hangs from the top right, as now. The game menu sits beside it.

### `short` (landscape)

```
┌──┬─────────┬──────────────────────────┬────────┐
│op│plot▸fac │ opponent locations       │ piles  │
│⚔⛁│         │ opponent characters      │ hand 7 │
│──│─────────┼──────────────────────────┤ PROMPT │
│me│         │ our characters           │ [btn]  │
│⚔⛁│plot▸fac │ our locations            │ piles  │
└──┴─────────┴──────────▁▁▁hand peek▁▁▁──┴────────┘
```

- Height is scarce, so the stats go in a thin rail on the left (not the scoreboard). The prompt goes
  in the right-hand column between the two pile clusters.
- The hand tray peeks about 40% of a card's height. Tapping it raises the whole hand over the bottom
  of the board, and tapping elsewhere lowers it. Dragging works from the peek.
- The site navbar is hidden during a game. See the open questions.

### Melee, on every layout

Our side is fixed at the bottom, exactly as in joust. The opponent's side is an `OpponentCarousel`.

```
narrow melee                         short melee
┌───────────────────────────┐        ┌──┬──────────────────────────────┬──────┐
│ (●Ann 6⚔)(Bob 4⚔)(Cy 9⚔•)│ tabs    │An│ ◀  Bob: strip + play area  ▶ │piles │
│ ◀ Bob: strip              ▶│        │Bo│                              │      │
│   Bob locations           │        │Cy│──────────────────────────────│PROMPT│
│   Bob characters          │        │──│ our characters               │      │
│ Bob 4⚔ │ prompt │ me 7⚔   │ score   │me│ our locations                │piles │
│ our characters …          │        └──┴──────────────▁▁hand peek▁▁───┴──────┘
```

- **Slides:** one per opponent, in clockwise seat order from us, the same order as the classic melee
  grid. `narrow` and `short` show one slide at a time. `wide` shows as many as fit at the shared play
  scale, usually two or three, and pages for the rest. Swipe on the opponent's area, or use ◀ ▶.
- **Tabs (jumping):** `narrow` has a strip of mini scoreboards along the top (avatar, power, gold,
  title icon, first-player token). `short` puts them in the left stats rail, one per opponent above
  ours. Tapping a tab jumps to that opponent.
    - Markers: **active** (their prompt; pulses), **selectable** (a dot when our current prompt can
      select cards on their board), **shown** (the slide in view).
- **Midline scoreboard:** shows the opponent in view, then the prompt, then us. Every opponent's stats
  are always visible in the tabs.
- **Auto-follow** (`followAction`, on by default):
    - Target: during our prompt, the first opponent in seat order with a selectable card on their
      board. Otherwise, the opponent with the active prompt. If neither applies, stay where we are.
    - Swiping or jumping by hand pauses it. The control changes to "Paused · tap to resume", and it
      resumes by itself the next time the active prompt moves to a different player.
    - Never move the carousel during a drag, while a card is raised or zoomed, or while a sheet is
      being dragged. Wait until that ends.
    - The control sits at the end of the tab strip (`narrow`) or the bottom of the opponents' rail
      (`short` and `wide`) and switches the setting.
- **Scale:** the decision that both play areas use the same scale covers every opponent. Fit
  `--card-scale` to the widest row across all players, so swiping never changes card sizes.
- **Opponent rows never scroll** in a carousel. They only shrink and overlap, so a sideways swipe
  always moves the carousel and never a row inside it. Our own rows can still scroll as the last
  step in the overflow order.
- **Flights to an opponent off screen:** every slide stays mounted, so `registerPile` and flips keep
  working. A card flying to or from a slide that isn't shown flies to or from that opponent's tab
  instead.
- **Spectators:** the bottom side shows the first player in seat order, and everyone else goes in the
  carousel.

### `wide` (desktop or tablet landscape)

- The same arrangement as the classic board: a strip for each player, with the play areas between them
  and the prompt in a side panel. It is built in `Adaptive/` from shared parts (`PlayerPlots`,
  `CardPile`, `DrawDeck`, `ActivePlayerPrompt` and `GameTimer`), never by importing classic
  `PlayerRow` or `SideBoardPanel`.
- From this plan it gains the game menu. It keeps the classic full-size piles, and the navbar stays.
  Popups use `MovablePanel` with a mouse, and sheets on a touch screen (tablet).

## Phases

### Phase 0: groundwork

- [x] Create branch `feat/adaptive-board` from `feat/gameboard-overhaul`, and commit this plan.
- [x] Move the classic board into `Classic/` as its own commit (see Architecture, Folders).
- [x] Add the switch (see Architecture, Switch).
- [x] Add `useBoardLayout` and `adaptiveScale.js` with their specs. `adaptiveScale.js` (pure) has
      `test/client/adaptiveScale.spec.js`. `useBoardLayout` is DOM glue (`ResizeObserver`, focus
      tracking) with no spec of its own, and is checked in the fixtures. It shares
      `applyScaleProperties` with `useHudScale`, which pauses animations while scales change.
- [x] Viewport: `useAdaptivePage` adds `viewport-fit=cover` to the viewport meta and sets
      `overscroll-behavior: none` only while the adaptive board shows. Every other page keeps the
      browser default, so content there never goes under a notch. **This changes the plan, which put
      it in `index.html`.** The board root pads itself with `env(safe-area-inset-*)`, and the
      full-screen board uses `h-dvh`.
- [x] `AdaptiveGameBoardLayout` shell: built only from shared parts (never from `Classic/`), with grid
      areas for each mode. The opponent's hand and piles use `--pile-scale`, our hand uses
      `--hand-scale`, and `wide` keeps full-size piles. It has a basic stats line, the prompt, the
      timer, a settings button and the temporary Leave button. The grid areas are inline styles for
      now, so `adaptive.css` isn't needed yet.
- [x] Dev-only fixture route at `/dev/board?fixture=<key>&board=<adaptive|classic>`
      (`client/dev/DevBoard.jsx` and `client/dev/boardFixtures.js`, lazy-loaded behind
      `import.meta.env.DEV` and confirmed absent from `vite build` output). It renders the real
      `GameBoard` against a store of its own with no socket. Fixtures: `empty`, `mid`, `crowded`,
      `plots` and `discard`. A floating panel switches the fixture and the board and resets the state.
      Melee fixtures come in phase 6.
- [x] Baseline screenshots of the classic board from the fixtures at 390×844, 844×390, 820×1180,
      1180×820 and 1600×950. `npm run board:shots` (`test/tools/board-shots.js`, using the
      `playwright` dev dependency with Chromium) shoots every fixture, board and size against the
      running dev server, saving to `testoutput/board-shots/` (gitignored). For each shot it reports
      the layout mode, anything that scrolls, regions of the adaptive board that clip their content,
      and page errors. Classic baseline: it scrolls sideways at both portrait sizes (all fixtures) and
      in 7 of the 10 landscape shots across phone and tablet.
- [x] Hide the navbar on `narrow` and `short` when the adaptive board is on. `Application.jsx` reads
      `boardLayoutStore`, which only `useBoardLayout` sets. The shell's temporary `LeaveGameButton`
      stands in until phase 4's game menu.
- [x] Look at the shell in every mode with `board:shots`. It loads in every mode and nothing
      scrolls. What's broken is layout work that phases 1 and 2 already cover (clipping is listed
      under phase 1), plus the chat in landscape, which is now a phase 1 item.

Notes for later phases, found during phase 0:

- `CarriedCard.jsx` reads `--card-scale` from the page root, so a card dragged out of the hand or a
  pile (drawn at `--hand-scale` or `--pile-scale`) would be carried at the play-area size. Fix in
  phase 1.
- On phones the chat drawer is absolutely positioned inside the board root, so it ignores the
  safe-area padding. Check in phase 5.
- A drop in the fixture page leaves the drop ghost waiting, because no server sends back a new state.
  Use Reset.
- The full test suite fails in `test/server/cards/25.6-WK/AThousandEyesAndOne.spec.js` (ability
  coverage). This happens on the base branch too and the spec passes on its own, so it's unrelated
  to this work.

### Phase 1: no page scrolling (joust)

- [x] `PlotFactionStack`: the active plot in front (`PlayerPlots` as before), with the faction card
      over the agenda, which shows a strip down its left. Additional agendas peek the same way, and the
      title sits beside them. Plot deck and used plots still open their popups.
    - Dropped (decided 2026-11-17): the "tapping the stack opens a chooser" idea. Each pile in the
      stack can still be tapped on its own. Revisit only if that proves fiddly in real games.
- [x] `PileCluster`: deck, discard and dead at pile scale, with shadows and out of game only when they
      hold cards. Each is still a `CardPile` or `DrawDeck` (so `registerPile` and the drop zones are
      unchanged) and a `Droppable` for our side. On `narrow` and `short`, `AreaLabelContext` shows each
      pile's label as a count badge, with the name as its tooltip. `wide` keeps the full labels.
- [x] Opponent's hand: a `SquishableCardPanel` of backs, squeezed into two card widths, at pile scale
      with a count badge. It's inline in the layout, not a separate `OpponentHand.jsx`.
- [x] `HandTray`: full width (`SquishableCardPanel` gained `fitWidth`, which re-measures on the
      `boardrescale` event), and keeps staged arrivals and redealing. It's fully shown in `narrow` and
      peeks (40%) in `short`. Checked by probe: a tap raises the whole hand, a tap elsewhere lowers it,
      and a hold still picks a card up. Its drop target is `hand`.
- [x] `DropTray` (in `PileCluster.jsx`): while dragging, empty shadows and out of game appear as
      dashed targets laid over the board beside our piles, so nothing moves. Checked by a drag probe.
- [x] Play-area overflow: `PlayerBoard` `overflow` is `'grow'` (classic), `'squish'` (opponents: overlap,
      never scroll) or `'squish-then-scroll'` (ours). `FittedRow` overlaps cards down to 40% showing,
      then scrolls. On touch, while a row overlaps, a first tap brings a card to the front and a second
      tap uses it (checked by probe).
    - **Replaced by R1:** cards in play never overlap. Rows wrap, and the play area scrolls with a
      hint. `FittedRow` is removed, and `overflow` is now `'grow'` (classic) or `'wrap'`.
- [x] `OpponentCarousel`: the opponent's side is built as a carousel. Joust is one slide with no
      swiping.
    - [ ] **Moved to phase 6:** melee swiping and ◀ ▶. The carousel already scroll-snaps when it has
          more than one slide, but melee still falls back to the classic board and there are no melee
          fixtures to check it against until phase 6.
- [x] Scale fitting uses the widest row across all players (`widestRowUnits`).
- [x] Scale fitting for all three variables in every mode, checked at every reference size:
    - The pile scale is fitted on its own to its strip on `narrow` and `short`, so a wide strip no
      longer shrinks the play areas. On `wide` the piles are drawn at card size (`pilesAtCardSize`), so
      the strip still limits every card.
    - `stripUnits` for `wide` is 13, and `short`'s chrome width is 26rem.
    - `narrow`'s baseline is 1.6, so cards grow until the height stops them (about 1.15 on a 390×844
      phone).
    - Minimum scales before rows overlap: narrow 0.85, short 0.7, wide 0.8. They were 0.55, 0.45 and
      0.5, which made crowded landscape cards unreadable.
- [x] Chat in `short` and `narrow`: the phone chat rules are a `chat-phone` mixin in `index.css`, used
      by the small-screen media query and by `html[data-board-layout='narrow'|'short']`. `GameBoard`
      closes the chat whenever the layout becomes a phone layout.
- [x] Clips from the phase 0 shots are cleared. What's left: the peeking hand in `short`, which hangs
      below the screen on purpose; plot selection's popup, which scrolls inside itself until phase 3;
      and a 2px layout artifact on desktop, which the clip report now ignores along with any overflow
      of 2px or less.
- [x] `CarriedCard` scale: on the adaptive board `GameBoard` measures the picked-up card's untransformed
      size (`scaleOfCard`), and the carried card and drop ghost are drawn at it. A drop that tucks a card
      underneath keeps the page scale, because it lands at play size. Classic passes no scale and is
      unchanged. Checked by probe: a hand card of 76.8×107.5 is carried at ×1.1.
- [ ] Acceptance:
    - [x] At every reference size the page never scrolls, for every fixture. On the adaptive board the
          only scrolling is our crowded play row. Classic's report is identical to the phase 0
          baseline.
    - [x] Dragging works (probe: hand to play area, with the drop tray showing).
    - [ ] **Not checked:** flight animations to and from every pile. They need the server's next state,
          which the dev page doesn't send. Check in a real game.

### Phase 2: prompt

- [x] Extract `usePromptActions` (`client/Components/GameBoard/usePromptActions.jsx`, with
      `PromptControls`) from `ActivePlayerPrompt`. The classic prompt's markup is unchanged, and its
      screenshots match. Keyboard shortcuts checked by probe on both boards: `W` presses Wait and the
      countdown shows "Paused".
- [x] Card-name and trait-name lookups wait for the card list ("Loading cards…") instead of crashing.
      The classic prompt already showed a spinner while loading.
- [x] `PromptBar` (`Adaptive/PromptBar.jsx`):
    - [x] Header line: the phase, the prompt title, the timer, and the settings and leave buttons.
          The prompt text goes underneath.
    - [x] **Waiting**: no buttons or controls, so the bar shrinks to the phase and the text, in grey
          italic.
    - [x] **Buttons**: chips sized to their text, in the server's order, filling up to two rows (four in
          `short`'s column). Rows are measured by position on screen, because cards' chips are wrapped
          in a span. Checked with the `choices` fixture: 12 choices show "More (4)", which opens every
          button full width.
    - [x] **Controls**: shown in a bottom panel (the "More" panel). It opens on its own for input
          controls (card name, trait name, values). Other controls get a "Details" chip. Checked with
          the `lookup` fixture.
    - [x] **Selection prompts**: while any card can be or is chosen, the bar gets a warning-coloured
          border and an "n selected" count. Done is a chip. The bar is the banner: in `narrow` it
          already sits across the board's midline.
    - [x] Response delay: the countdown is a bar under the prompt text, not on a chip.
- [x] Buttons with a card keep the hold-to-zoom preview (`CardHoverable` around the chip).
- [x] `narrow` puts the bar across the midline, `short` puts it in a 13rem right-hand column, and `wide`
      keeps the desktop prompt (`ActivePlayerPrompt`) in its own side panel, without classic
      `SideBoardPanel`. Until phase 4, a two-line stats summary sits above the bar.
- [x] Fixtures added: `waiting`, `select` (choosing on the board), `lookup` (name a card), `reaction`
      (reaction window with countdown) and `choices` (12 buttons).
- [ ] Acceptance:
    - [x] Every prompt type we have a fixture for works on a phone: marshaling, challenge
          declaration, claim (choosing on the board), card-name lookup, response windows, waiting,
          and many choices. Plot selection works, but through the popup until phase 3.
    - [ ] **Not checked:** first player selection, and real-game sequences (pressing a button and the
          next prompt arriving). The dev page has no server to answer.

#### Phase 2 rework (after review, 2026-11-17)

Your feedback on the first pass: the portrait bar is too tall and looks like a card, short and wide
put the prompt top right where nobody looks for it, the styles differ between layouts, and cards and
interface are far too small everywhere.

Measured before the rework (play-area card width, classic vs adaptive):

| Size                      | Classic | Adaptive | Interface |
| ------------------------- | ------- | -------- | --------- |
| Phone portrait 390×844    | 32px    | 70px     | 0.8       |
| Phone landscape 844×390   | 32px    | 51px     | 0.8       |
| Tablet portrait 820×1180  | 32px    | 102px    | 0.8       |
| Tablet landscape 1180×820 | 54px    | 38px     | 0.8       |
| Desktop 1600×950          | 64px    | 64px     | 1.0       |
| Desktop 2560×1440         | 99px    | 64px     | 1.4       |

Causes:

- `wide` was capped at scale 1 (its baseline), so it never grew on big screens.
- On `wide`, the prompt's side column and the chat squeezed the pile strip, which limits every card.
- The interface scale follows screen size from 0.8 to 1.4, so phones and tablets got smaller text
  and buttons.

- [x] Prompt as the midline divider on every layout. `AdaptiveGameBoardLayout` is one column in every
      mode: opponents, divider, ours, then the hand tray on `narrow` and `short`. The side column is
      gone, and so is `ActivePlayerPrompt` from the adaptive board.
- [x] Phase track along the divider's top edge (`PhaseTrack` in `PromptBar.jsx`): initials in `narrow`,
      full names elsewhere, the current phase lit as "◆ NAME", earlier phases dimmed, and "Setup"
      during setup. Until the phase 4 scoreboard, each player's power (♛) and gold (●) sit at their end
      of the track.
- [x] Divider content:
    - `narrow`: the text line (with timer, settings and leave), then chips (28px tall) up to two rows.
    - `short` and `wide`: one row (text, then chips up to two rows aligned right, then timer and
      actions). On `wide` it leaves room on the right for the chat tab.
- [x] While choosing cards the divider's edges turn the warning colour and glow. The response-delay
      countdown is a thin line along its bottom edge (`ResponseDelay` gained `slim`; classic still
      draws the labelled bar).
- [x] Scales: every mode fills the room available. There's no baseline cap any more. Maximums are
      narrow 1.8, short 1.6 and wide 2. The card size setting only shrinks ("Small" is 0.7× the fit).
      Budgets for the divider: narrow chrome height 5.5rem, short 14rem wide and 4rem high, wide 2rem
      wide and 4rem high. `wide`'s `stripUnits` is 15, which allows for shadows and out of game.
- [x] The interface scale on the adaptive board is at least 1 (the screen factor is floored at 1 in
      `useBoardLayout`).
- [x] Strip budgets count what's actually shown: each mode has a base (`narrow` 7.5 card widths, `wide`
      11.5), plus `stripExtraUnits` for shadows, out of game, a title and extra agendas when they hold
      cards. A flat budget either shrank every card on `wide` for piles that were empty or let a busy
      strip run off the edge.
- [x] `short`: a one-line divider (decided above), chrome height 3rem.
- [x] The opponent's hand is a single back with a count (decided above). `narrow`'s strip is a card
      width narrower, so the pile scale goes from 0.55 to 0.65.
- [x] Wider layouts: the prompt text keeps at least 11rem and the chips shrink and wrap into "More".
      Before this, the chips refused to shrink and squeezed the text to a word per line.
- [x] Re-measured (play-area card width; classic in brackets):

| Size                      | Before | After                                  |
| ------------------------- | ------ | -------------------------------------- |
| Phone portrait 390×844    | 70px   | 70px (32px)                            |
| Phone landscape 844×390   | 51px   | 48px (32px)                            |
| Tablet portrait 820×1180  | 102px  | 115px (32px)                           |
| Tablet landscape 1180×820 | 38px   | 58px (54px); the open chat takes 384px |
| Desktop 1600×950          | 64px   | 93px (64px)                            |
| Desktop 2560×1440         | 64px   | 128px (99px)                           |

- [x] Checks: lint and Prettier are clean, the 211 client and settings specs pass, and the client
      builds. The adaptive shots have no page errors and no clipping except the intended landscape hand
      peek. Scrolling is limited to our crowded row (allowed) and the plot popup (until phase 3).
- Phone landscape stays the tightest layout. Judge it on a real phone; smaller location rows there
  are the next lever if needed.

### Phase 3: sheets

- [ ] Add `PopupHostContext` and `PopupContainer`. Nothing changes on the classic board.
- [ ] `BoardSheet`:
    - [ ] Two heights: **peek**, one row of cards that scrolls sideways (about 40% of the board in
          `narrow`, and one card row in `short`), and **full**, a grid.
    - [ ] A drag handle on the header switches between the heights, swiping down closes it, and there
          is always an X button.
    - [ ] There's no dimmed backdrop, so the board stays usable during prompts.
    - [ ] It keeps the pile's popup menu (shuffle, reveal and so on) and the card list's drop zones,
          including dropping underneath a card.
- [ ] `sheetStore`: one sheet at a time. Opening another replaces it, and the sheet header has tabs
      for recently opened piles.
- [ ] Dragging a card out of a sheet collapses the sheet to a strip. After the drop, whether it lands
      or is cancelled, the sheet comes back at peek.
- [ ] When a prompt opens a pile because it has selectable cards, the sheet opens at peek with the
      prompt text in its header.
- [ ] Plot selection opens a full-height carousel of large plot cards, and stays open until Done.
- [ ] Settings, keyboard shortcuts and report problem become full-screen modals on `narrow` and
      `short`.
- [ ] Acceptance: every popup source opens as a sheet on the adaptive board: draw deck (search),
      discard, dead, out of game, plots, the agenda's cards, and cards underneath a card. Classic
      popups are unchanged.

#### Card preview (zoom) on touch

Today `CardHover` (`client/Components/Images/CardHover.jsx`) shows the card at a fixed size
(`3x-large`), placed above the finger and pushed inside the screen edges. It disappears when the finger
lifts. On a phone it covers much of the board and sits under the finger. Phones make the board's cards
small, so the preview is how players read them. The touch model itself stays as decided: hold still to
zoom, hold and move to drag.

- [ ] Size: on the adaptive board's touch layouts, the preview is the largest card that fits in about
      85% of the screen's shorter side (allowing for any availability notes), not a fixed size. Plots
      are sized as horizontal cards.
- [ ] Placement: never under the finger. In `narrow`, it goes in the half of the screen away from the
      finger (top if the finger is in the bottom half, bottom otherwise). In `short`, it goes on the
      side away from the finger. In `wide` with a mouse, it stays as today.
- [ ] Live state the small card can't show legibly: current strength against printed strength,
      power, tokens and their counts, and the names of attachments and dupes. These go in a compact
      panel beside or under the image, built from the card's summary only (no hidden information).
- [ ] Starting a drag (moving after the hold) hides the preview straight away, as now.
- [ ] `CardHover` keeps its current behaviour on the classic board. The adaptive behaviour comes
      through a prop or context whose default is the classic one.
- [ ] Check in `board:shots`: add a mode that holds on a card in each fixture and screenshots the
      preview at every touch size.
- Open question, for when we get here: should the preview stay up after the finger lifts, until the
  next tap (a "pin")? That is not the deferred tap-to-preview idea, because a tap would still click,
  but it does change what lifting the finger does.

### Phase 4: player bars and game menu

- [ ] `Scoreboard` (`narrow`): opponent stats, then the prompt, then our stats. Power and gold large,
      the avatar with a first-player token. The name shows when there's room.
- [ ] Stats rail (`short`): the same stats stacked vertically in the left rail.
- [ ] Initiative, claim and reserve shown as badges on the active plot (trial).
- [ ] Manual mode: tapping a stat opens a small +/- stepper, which replaces the bar's +/- buttons.
- [ ] `GameMenu`: settings, mute spectators, manual mode, report problem, keyboard shortcuts, concede
      and leave game. Concede and leave come from the navbar's `ContextMenu`.
- [ ] While manual mode is on, a badge on the board shows it outside the menu.
- [ ] Acceptance: everything the classic `PlayerStats` and the in-game navbar menu can do is
      reachable on the adaptive board in every mode.

### Phase 5: polish

- [ ] Animations: plot reveal, draw and redeal into the hand tray, and flights to and from collapsed
      piles.
- [ ] Turn off text selection and the iOS callout across the board. Check the hold delay feels right
      at the new sizes.
- [ ] Check performance on a mid-range phone with `useRenderCount`, especially the `ResizeObserver`
      and scale changes during flips.
- [ ] Spectators: no hand tray. Show both strips at pile scale, and hide the prompt or show it as
      waiting.

### Phase 6: melee

- [ ] Carousel swiping and ◀ ▶ for several opponents (moved from phase 1).
- [ ] `OpponentTabs`: mini scoreboards in seat order, as the top strip in `narrow` and in the left
      rail in `short` and `wide`, with the active, selectable and shown markers. Tapping a tab jumps
      to that opponent.
- [ ] Seat order matches the classic melee grid's clockwise order. Share or extract the ordering, and
      don't copy it.
- [ ] `wide`: show as many opponents side by side as fit, and page for the rest.
- [ ] `followTarget.js` with a spec covering our prompt with selectable cards on one or several
      boards, another player's active prompt, no target, and selectable cards only on our board.
- [ ] `useAutoFollow`:
    - [ ] Follows the target.
    - [ ] Pauses on a manual swipe or jump.
    - [ ] Resumes when the active prompt moves to a different player.
    - [ ] Waits while a drag, a raised card, a zoom or a sheet drag is in progress.
- [ ] Auto-follow control: reads and writes `followAction`, and shows "Paused · tap to resume".
- [ ] Flights to and from an opponent who isn't shown go to their tab.
- [ ] Spectator arrangement.
- [ ] Fixtures: melee with 3, 4 and 6 players, with an active prompt on an opponent, and with our
      prompt targeting cards on two opponents' boards.
- [ ] Acceptance: at every reference size, melee with 3 to 6 players never scrolls the page. Every
      opponent can be reached in one tap. Auto-follow behaves as in the Layouts section (Melee), and
      dragging, flights and sheets work while the carousel is on any slide.
- [ ] Remove the fallback to the classic board for melee.

## Checks each phase

- `npm test` for the client specs we touched (run vitest from `C:\`, not `c:\`).
- `npm run board:shots` with the dev server running. Read the report: for the adaptive board, "no
  scrolling" and no CLIPPED regions except where a phase still has open items. Look at the images for
  every size.
- A manual check at every reference size and orientation, by switching between classic and adaptive
  mid-game.
- Re-read this file and tick off or flag every item in the phase.

## Open questions

- None yet. Add questions here as they come up, and move them to Decisions once answered.
