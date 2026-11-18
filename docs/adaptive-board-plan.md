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
| 2026-11-16 | Melee is part of this work, not an afterthought. ~~Our board stays fixed at the bottom, and opponents go in a carousel on the opponent's side, with tabs to jump to any opponent. Joust is the same carousel with one opponent and no tabs.~~ Superseded 2026-11-18 by R149: melee keeps classic's table, scrolling sideways.                                    |
| 2026-11-16 | Melee auto-follow is a HUD setting, `followAction`, **on by default**. It follows the opponent with the active prompt. During our own prompt, it jumps to an opponent whose board has cards we can select.                                                                                                                                                       |
| 2026-11-16 | Swiping or jumping by hand pauses auto-follow. It resumes by itself the next time the action moves to a different player.                                                                                                                                                                                                                                        |
| 2026-11-16 | ~~`wide` melee uses the same carousel, showing as many opponents side by side as fit, and pages for the rest.~~ Superseded by R149.                                                                                                                                                                                                                              |
| 2026-11-16 | The classic board moves to `GameBoard/Classic/`. **Nothing outside `Classic/` imports from it**, so the classic board can be removed later by deleting one folder. Anything the adaptive board needs stays shared at the `GameBoard/` root, and the adaptive `wide` layout is built from shared parts rather than from classic `PlayerRow` and `SideBoardPanel`. |
| 2026-11-17 | Prompt buttons on phones fill up to two rows of chips sized to their text. Whatever doesn't fit goes under a "More" chip that opens the full list. This replaces "3 inline, else 2 + More".                                                                                                                                                                      |
| 2026-11-17 | Prompt buttons keep the server's order on every layout, so the shortcut numbers and desktop match. Cancel-style buttons are styled grey, not moved. This replaces "main action nearest the right edge".                                                                                                                                                          |
| 2026-11-17 | The plot/faction stack does not open a chooser. Each pile in it is tapped on its own.                                                                                                                                                                                                                                                                            |
| 2026-11-17 | The prompt is the **midline divider** on every layout: a slim full-width strip between the two halves, not a box. It's styled the same everywhere (the desktop prompt's look isn't kept on the adaptive board). This replaces the right-hand column in `short` and the side panel in `wide`.                                                                     |
| 2026-11-17 | A **phase track** runs along the divider's top edge: all seven phases, past ones dimmed, the current one lit and named. Short names in `narrow`, full names elsewhere.                                                                                                                                                                                           |
| 2026-11-17 | Cards and interface fill the room available: every mode grows the cards until the height, strip or rows stop it (`wide` up to 2×), and the interface never shrinks below its normal size on the adaptive board. "Small" cards is 0.7× that fit; "Large" can't grow past it.                                                                                      |
| 2026-11-17 | In `short` (phone landscape) the divider is a single row: the phase track and both players' totals sit inline at its start. Location rows stay full size.                                                                                                                                                                                                        |
| 2026-11-17 | The opponent's hand is a single card back with its count, not a two-card fan.                                                                                                                                                                                                                                                                                    |
| 2026-11-17 | R6/R7: every pile sits on the same thin caption plate along its bottom edge, with an icon and its count (the name as a tooltip). This replaces the floating count bubbles.                                                                                                                                                                                       |
| 2026-11-17 | R9: one strip size for every pile, for both players (plots, faction, agenda, deck, discard, dead, the opponent's hand), smaller than cards in play. In portrait the strip wraps onto a second line rather than shrink below legible.                                                                                                                             |
| 2026-11-17 | R11: the divider is the scoreboard. Each player's avatar with large power and gold (with their icons) sit at its ends: the opponent's on the left, ours on the right. Initiative, claim and reserve are small badges on each active plot.                                                                                                                        |
| 2026-11-17 | R5: the prompt title has its own small, dim line above the instruction text.                                                                                                                                                                                                                                                                                     |
| 2026-11-17 | R13: on phone layouts the chat tab is replaced by a chat button on the divider, with the unread count, and the chat still drops down smoothly.                                                                                                                                                                                                                   |

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
- [x] **R5 Prompt title and prompt text on the same line** isn't liked. Rework the divider's text
      layout. **Phase 4** (with the scoreboard).
      Done: the title has its own small, dim line above the instruction text (phase 4).
- [x] **R6 Piles need to be identifiable** without the full text labels that don't fit small screens.
      Consider options. **Phase 4/5.**
      Done: a caption plate along the bottom of every pile with an icon for what it is and its count, the name as a tooltip (phase 4).
      **Superseded (2026-11-17):** see R16.
- [x] **R7 The count bubbles on every pile feel disjointed.** Rethink alongside R6. **Phase 4/5.**
      Done: the plates replace the floating count bubbles (phase 4).
      **Superseded (2026-11-17):** see R16.
- [x] **R8 Tapping a card to select it** should animate smoothly and enlarge the card so it's easier to
      see. **Phase 3** (card preview).
      Done: on the adaptive board a card eases into its selection ring (180ms), and a chosen card grows to 1.12× above its neighbours. Holding a card on touch shows a large readable preview with its live state (phase 3 card preview). **Check with you:** is that enough, or should a tap itself enlarge the card?
- [x] **R9 Card piles in different sizes feel off,** even on mobile. Plots in particular need to be
      clearly visible. Rethink the separate pile scale. **Phase 4/5.**
      Done: one strip size for every pile and both players; in portrait, sized so our strip fits one line, with the opponent's strip wrapping when it must, and the two play areas kept equal (phase 4).
      **Superseded (2026-11-17):** see R16 (pile labels) and R17 (plot values).
- [x] **R10 Nothing may be cut off:** cards (location bottoms in landscape), selection rings, and cards
      flying between zones (hand to board). Review clipping everywhere. **Fix now** for the play areas
      and rings; check flights in phase 5.
      Done: the play areas no longer cut cards off. They scroll instead, with an inner margin so the selection rings show. The height budget now counts each play area's margins and a tenth of a card per row for attachments, which is why landscape location rows were cut off before. Cards flying into an area that cuts off its overflow (marked `data-clips`: play areas and the carousel) fly as a copy above the page (`flyAbove` in `flip.js`), and the real card shows once the copy lands. Classic marks nothing, so it is unchanged. **Still to check in phase 5:** every flight in a real game.
- [x] **R11 Power and gold must be clearer and larger, with their icons.** **Phase 4** (scoreboard).
      Done: the divider is the scoreboard: avatars with large power and gold with their icons at its ends, and initiative, claim and reserve on each active plot (phase 4).
      **Superseded (2026-11-17):** see R17.
- [x] **R12 Manual mode has gone missing** from the adaptive board. **Fix now** (temporary button), then
      into the game menu in phase 4.
      Done: a wrench button on the divider, red while manual mode is on, for players only. It sends the same message as classic, with the same tooltip. It moves into the game menu in phase 4.
- [x] **R13 The chat tab on phones** covers the opponent's board. Consider a chat button on the
      divider, and make sure it opens and closes smoothly. **Phase 4** (game menu).
      Done: on phones a chat button on the divider (with the unread count) replaces the tab; the chat slides down to the divider and no further, so it closes from the same button (phase 4).
- [ ] **R14 (found while building) Phone landscape cards are the smallest of any layout** (about 35–45px
      wide). Four card rows, two strips' worth of side columns and the divider share 390px of height.
      Next options: smaller location rows (declined earlier), or putting each side's locations beside its
      characters instead of above them. Judge on a real phone.
- [ ] **R15 (found while building) The navbar's spectator list and server connection status** aren't on
      the adaptive board's phone layouts, because the navbar is hidden there. They could go in the game
      menu.

From the review on 2026-11-17 (second batch):

- [x] **R16 Caption plates hide too much of the piles.** Larger layouts (`wide`) keep classic's label
      and count. On phone layouts, the first tap on a stacked pile (deck, plots, used plots, discard,
      dead, out of game, an agenda with cards) shows its name and count just above the tap, and it goes
      away on the next tap anywhere or after a short timeout. A pile whose top card can be chosen or
      used skips this. Hands and shadows (cards you can count) get no label or count, and nor does the
      opponent's hand, which goes back to a fan you can count.
      Done: `AreaLabelContext` is `'full'` on `wide` (classic labels) and `'inspect'` on phone layouts. There, piles show no label. A `CardPile` with a title is `inspectable`: the first tap shows a bubble with its icon, name and count above the tap and doesn't open the pile; a second tap opens it; any other tap or 2.5s clears it. Piles whose top card can be used, or whose cards are being chosen, skip it (`inspectSkip`). Hands and shadows get no label. The opponent's hand is a two-card fan you can count. Checked by probe: first tap shows "Discard 5" with no sheet, second tap opens the sheet, and the deck's label times out.
- [x] **R17 Plot values on the plot card don't work.** Power, gold, initiative, claim and reserve go in a
      thin bar per player, where classic has them: the opponent's along the top of the screen and ours
      along the bottom. In phone landscape they're a narrow rail down the left edge (opponent above,
      ours below). Manual mode can change every stat. This replaces the divider scoreboard (R11) and
      the plot badges.
      Done: `PlayerStatsBar`: avatar (first-player ring and token), name, then power, gold, initiative, claim and reserve with their icons. It's a thin bar along the top of the screen for the opponent and the bottom for us on `narrow` and `wide`, and a left rail on `short` (each stat's icon and number side by side, so both players fit in 390px). In manual mode our stats are outlined, and tapping one opens a +/- stepper for that stat (power, gold, initiative, claim and reserve, as classic). The divider scoreboard and the plot badges are removed. **Cost:** on a 390×844 phone the bars and the opponent's always-two-line strip bring play cards to 0.8 (51px wide), from 0.9.
- [x] **R18 Divider buttons get a new style:** dark with a thin gold edge and cream small-caps text.
      Cancel and pass buttons get a grey edge.
      Done: the divider's chips are dark with a thin amber edge, cream small capitals and smaller faction icons; cancel buttons and "More" have a grey edge. A challenge's four buttons fit one row on a 390px phone.
- [x] **R19 Dialogs on phones should feel designed for phones,** not stretched:
    - Settings becomes a phone settings screen: it slides up, has a sticky header with Done, and
      grouped sections.
    - Keyboard shortcuts are hidden on touch-only devices.
    - Pile popups on the desktop adaptive board become docked sheets too, instead of floating windows.
      Done: settings on phone layouts is its own screen: it slides up from the bottom, with a sticky "Settings" header and a Done button (checked by probe: 390×844 with Done). Classic and desktop keep the dialog. Keyboard shortcuts are left out of the game menu when the device has no fine pointer (touch only). Pile popups on the adaptive board are sheets on every layout; on `wide` the sheet is docked in the middle, at most 64rem wide.

From the review on 2026-11-17 (third batch):

- [x] **R20 Plot selection sheet:** it runs off the screen (the title goes off the top), the plots are
      too big (two should fit side by side in portrait), and the selection ring is cut off. The whole
      sheet scrolls vertically, with groups stacked (for Rains of Castamere, the schemes come after the
      plots), not one sideways scroller per group.
      Done: the plot sheet opens at full height on screen. The title was pushed off because the whole sheet was zoomed by the interface scale; now only its header is. Plots are sized to fit whole columns (two side by side on a phone), groups are stacked in one vertical scroll (with the `rains` fixture, the schemes come after the plots), and the list's padding keeps rings in view. The carousel is gone.
- [x] **R21 Cards in sheets should fill the space better.**
      Done: a sheet sizes its cards to fill it: at peek, one row as tall as the sheet; at full, whole columns across it (`fittedScale` in `BoardSheet`).
- [x] **R22 Sheets:**
    - Tapping outside a sheet closes it.
    - The pile chips show every viewable pile, empty ones too, in a fixed order, named without the
      player ("Discard").
    - The chips are grouped per player, each group with the player's avatar and name in the header.
      Done: a tap anywhere off the sheet closes it, unless its cards are being chosen from. Every pile that can be opened registers with `sheetStore` and shows as a chip, grouped per player (avatar and name), in a fixed order (Plots, Used Plots, Agenda, Draw, Discard, Dead, Out of Game), with the open one highlighted. The header shows the open pile's player and name. `PlayerPlots` passes its player to its piles (`owner`, used only for this list).
- [x] **R23 Wide screens:** the prompt is centred in the divider instead of spread across it.
      Done: on `wide` the prompt's row is centred, at most 64rem wide, with the text sized to its content.
- [x] **R24 The player stats bars look like classic's** (classic's stat icons, number and separators),
      with better text shadow if needed.
      Done: `StatContainer` and `StatDisplay` moved from `Classic/` to the shared root, and `PlayerStatsBar` is built from them, so the bar looks like classic's (stat icon with the number on it, separators, inline +/- in manual mode). The number gets an extra text-shadow outline for browsers without `-webkit-text-stroke`, on both boards.
- [x] **R25 Hand row:**
    - In portrait the bottom row is the hand (at most 5 cards wide before squishing) and shadows when
      it has cards.
    - In phone landscape and on tablets and desktops, plots, faction, agenda, deck, discard, dead,
      shadows and out of game sit beside the hand in one row that scrolls sideways when too wide,
      instead of shrinking the play area.
    - Cards in portrait must be bigger.
      Done: portrait: the bottom row is the hand (at most 5 cards wide, then overlapping; `SquishableCardPanel` `fitWidth` is capped by `maxCards`) and shadows when they hold cards. Phone landscape, tablet and desktop: each side's strip (plots, faction, agenda, hand, deck, discard, dead, shadows, out of game) is one row that scrolls sideways when too wide, and never shrinks the play area. In phone landscape each play area is one wrapping line, characters then locations with a thin rule between (`PlayerBoard` `overflow="inline"`), which pays for the two strip rows. Play cards are 48px wide there (0.75), up from the 0.45 the strip rows alone would have given. **Portrait is not bigger:** it stays at 0.75 (48px) on a 390×844 phone, and the open trade-off is below.
- [x] **R26 Pile outlines on phones are too rounded and look smaller than the cards in them.**
      Done: on the adaptive board a pile's outline has the card's own corner radius and a 1px border (`AdaptiveBoardContext`).
- [x] **R27 The tap label can go off the screen.** Use HeroUI so it stays on screen, with animation.
      Done: the tap label is a HeroUI `Tooltip` on the pile, which animates, flips below when there's no room above, and stays on screen.
- [x] **R28 A zone's name shows faintly behind it,** where a card would go. It should be subtle,
      readable, and consistent with the rest.
      Done: on the adaptive board each labelled area shows its name faintly, in small capitals, behind its cards (Discard, Dead, Draw, Hand and so on).
- [x] **R29 Game menu and manual-mode wrench move to our player bar** (the bottom of the left rail in
      phone landscape), on every layout.
      Done: the game menu is at the end of our player bar (the bottom of the rail in phone landscape) on every layout. The manual-mode wrench shows beside it, inside `GameMenu`. The chat button stays on the divider.
- [x] **R30 Tokens are huge on phones:** they become compact pips on the adaptive board (3 power is
      three small blue pips; a big count is an icon and a number), and the held-card preview lists every
      token clearly.
    - Later, as its own piece of work: a distinct free icon for every token type, placed uniquely on
      the card, plus status effects in the preview (blanked, stealthed and so on).
      Done: on the adaptive board counters are drawn at the card's size along its bottom edge (`CompactCounters`). A count of 3 or less is that many pips in its colour, a larger count is one pip with its number, strength keeps its number, and icons stay icons. The held-card preview already lists every token by name and count. **Later:** a distinct icon per token type and status effects.
- [x] **R31 The opponent's hand can take more space on narrow.**
      Done: the opponent's hand fan is three card widths everywhere (it was two).
- [x] **R32 Both players' hands curve slightly**, ours up from the bottom and the opponent's down from
      the top.
      Done: `SquishableCardPanel` `curve`: ours arcs up and the opponent's down, each card turned up to 7° and dropped towards the ends. A raised card straightens.
- [x] **R33 (open) Portrait play cards are still small** (0.75, 48px wide on 390×844). Where the height
      goes: the two stats bars 64px, the divider about 84px, the hand row about 100px, and three strip
      lines (the opponent's wraps to two, since it holds their hand) about 200px. That leaves four play
      rows about 390px. The biggest lever is the opponent's strip on one line. Options: move their hand
      fan into their stats bar, draw the strip piles smaller, or shrink the hand row. Each conflicts with
      an earlier note (R9 consistent pile sizes, R31 more room for the opponent's hand).
      Done: solved by R40/R41: with both portrait strips on one line, play cards on a 390×844 phone go from 0.75 to 0.95 scale (61px wide).

From the review on 2026-11-17 (fourth batch):

- [x] **R34 Bug: portrait cards are tiny with "Large" cards and scale-with-screen on**, and changing a
      setting fixes it, so the size calculation is inconsistent.
      Done: the board was first measured while the navbar was still showing (48px shorter), and the rule that stops cards growing by less than two steps meant it never caught up; changing a setting reset it. `useBoardLayout` now fits a new board size or mode straight away and damps only changes from cards entering and leaving play. Checked by probe: loads at 0.75 where it was stuck at 0.7 (before R40). "Large" cards still can't grow past the fit, by the earlier decision.
- [x] **R35 Don't write "First player" in the bar.** The ring round the avatar and a "1st" badge are
      enough.
      Done: the "First player" entry is gone. The avatar has a ring and a "1st" badge.
- [x] **R36 The player stats bar scrolls sideways when it overflows.**
      Done: the stats bar scrolls sideways when it overflows (scrollbar hidden), and its parts never squash.
- [x] **R37 Pile sheet header:** only the player being looked at, with their piles as chips. To see the
      opponent's piles, open one of them.
      Done: the sheet header shows the player being looked at (avatar and name), the pile's name, and that player's piles as chips. Checked by probe: the opponent's sheet lists Used Plots, Discard and Dead; ours Plots, Used Plots, Draw, Discard and Dead.
- [x] **R38 Bug: tapping anywhere in a pile sheet shows the pile's name and count tooltip** instead of
      using the sheet.
      Done: React passes events up from portals, so taps in a pile's sheet reached the pile's own tap handler. It now ignores taps not physically on the pile. Checked by probe: tapping a card in a sheet shows no tooltip.
- [x] **R39 Empty piles: the zone name must always fit,** scaled or turned sideways ("Discard"
      overflows on small screens).
      Done: a zone's name is sized to the card and kept within the pile: turned sideways in upright piles and across in sideways ones (dead, plots).
- [x] **R40 / R41 Portrait strips stay one row:** the opponent's hand squeezes thinner (more than our
      hand would), and the strip scrolls sideways if it still doesn't fit, instead of the piles moving
      to a second line. (Replaces R33's options.)
      Done: portrait strips are one row, like the other layouts, and scroll sideways only as a last resort. the opponent's hand takes the room left in its strip, squeezing down to about 1.1 cards wide before the strip scrolls. Our hand keeps its 5.
- [x] **R42 Bug: the challenge icons in the prompt buttons aren't centred in their circles.**
      Done: the challenge icon is now a centred flex circle without the 24px line height it inherited, so the glyph sits in the middle.
- [x] **R43 Revert the curved hands** (R32) to a plain squishable row for now.
      Done: the curve is removed from `SquishableCardPanel` and its uses; hands are flat squishable rows again.
- [x] **R44 A cleaner edge between the strip and hand rows and an overflowing play area:** a more
      distinct border, or let the play area go behind those rows, without visual noise.
      Done: each strip is a darker band with a thin border on the side facing its play area, so scrolled cards end on a clean line. The "more" fades still mark the scroll.
- [x] **R45 Sheets come from the player's side:** the opponent's piles drop down from the top, ours rise
      from the bottom, and each covers only its own half, stopping at the divider.
      Done: the layout publishes the divider's edges (`--board-divider-top`/`-bottom`). The opponent's sheets drop from the top of the screen and never pass the divider; ours rise from the bottom, also stopping at it. Swipes are mirrored (up closes an opponent's sheet), and the grabber sits on the sheet's divider edge. Checked by probe: the opponent's sheet ends at y=329, the divider's top.

From the review on 2026-11-17 (fifth batch). All fixed in this pass:

- [x] **R46 Bug: settings showed a different dialog when closing, and Done did nothing.** Changing a setting
      re-ran the board's sizing effect, which took the layout down and put it back for a moment: the navbar
      flashed back, the layout mode flipped and the dialog was swapped for the desktop one. The board now
      re-measures in place when a HUD setting changes, the dialog is a single component whose props change,
      and Done uses the dialog's own close. Checked by probe: changing a setting keeps the phone dialog, and
      Done closes it.
- [x] **R47 The stats bar was too large on phones.** It has a compact size on phone layouts (24px icons, a
      28px bar).
- [x] **R48 Scaling rework (flights at the wrong size).** Cards are drawn at a hand's, pile's or sheet's own
      `--card-scale`, but a card taken off the board to fly lost it and drew at the page's size. One helper,
      `cardScaleOf` (`cardScale.js`), now reads the size an element is drawn at, and every card taken off the
      board takes it along: flip records it when measuring, `detach` applies it, and carrying uses it. This
      replaces the separate `scaleOfCard` measuring in `CarriedCard`. Also: a switch or slider no longer counts
      as typing, which had frozen the board while settings were changed, and new HUD settings fit straight
      away. Checked by probe: each card flies at its own size (deck 0.8, play area 0.95).
- [x] **R49 Tokens: one badge per kind again** ("J5", "P2"), in the classic badge's colours, sized to the card
      and padded so the text stays inside.
- [x] **R50 Bug: kneeling and standing no longer animated.** My transition rule for chosen cards replaced the
      card's own transition (which turns it). Removed; the chosen-card growth uses the card's existing
      transition.
- [x] **R51 Pile sheets are a grid that scrolls vertically, filling the width** (three cards or two plots
      across on a phone). In phone landscape they're one row that scrolls sideways, with the header on a
      single line.
- [x] **R52 Bug: plot piles had no chips.** The plot piles' sheets now carry their player (`owner`).
- [x] **R53 Sheets cover their player's whole half,** up to the divider.
- [x] **R54 The drop targets for empty shadows and out of game** are part of our strip now, after our piles,
      instead of floating where the board covered them.
- [x] **R55 Bug: stat icons didn't scroll with the stats bar.** Each stat is positioned itself now, so its
      icon moves with it.
- [x] **R56 Bug: console warning at LabelledGameArea.jsx:189.** The tap label's state object, which holds a
      React key, was spread into JSX. Its props are passed one by one now.
- [x] **R57 The prompt's buttons sit beside its text** instead of at the far end of the divider.

From the review on 2026-11-17 (sixth batch). All done in this pass:

- [x] **R58 Switching piles by chip doesn't animate.** Only opening and closing a sheet slides it. A chip tap
      marks a switch (`sheetStore.beginSwitch`), and the outgoing sheet unmounts and the incoming one appears in
      place. Checked by probe: 30ms after a switch, the new sheet is already in place.
- [x] **R59 The prompt's buttons are always one line,** growing into the space available. Those that don't fit
      are listed under "+n more", a HeroUI dropdown. Typed and chosen input still opens the bottom panel.
      Checked by probe: 12 choices on a phone show one line and "+10 more" with all 10 listed.
- [x] **R60 Play areas scroll sideways in phone landscape and on wide layouts,** with left and right fades
      (`ScrollArea` `axis='x'`, rows don't wrap: `PlayerBoard` `overflow` is `'wrap'` in portrait, `'inline'`
      in landscape, `'nowrap'` on wide). Portrait still scrolls down.
- [x] **R61 Our stats bar keeps the game menu (hamburger) pinned and always visible.** Only the stats scroll.
      With room to spare, the bar shows the menu's first items as buttons, as classic does (Settings, Manual
      Mode, mute, Report Problem). They fold into the menu one by one as room runs out. The bar measures the room
      its stats leave and hands it to `GameMenu`. The left rail in phone landscape does the same up and down;
      before this, its menu sat 22px below the screen.
- [x] **R62 On phones the chat fills the screen,** or what the keyboard leaves of it (`--visual-height` from
      `visualViewport`), and closes from a button in its own header. Checked by probe.
- [x] **R63 Closing the chat uses a slashed chat icon,** on the chat tab, the divider button and the chat's own
      close button.

From the review on 2026-11-17 (seventh batch):

- [x] **R64 The bars reach the screen's edges.** The board root no longer pads itself for the safe area
      (notch, gesture bar), which left the page background showing past the bars. The top and bottom bars and
      the landscape rail run to the edges, with the safe-area padding inside them so their own background
      fills it. The space between keeps clear at the sides. **Check on the phone:** the probe can't simulate
      a device's insets.
- [x] **R65 Pile sheets reach the bottom of the screen.** They're placed by their edges (from the divider to the
      screen's edge) instead of a height, and the pile's own inner box, which kept its old border and
      translucent background, now fills the sheet without them.
- [x] **R66 Full screen on phones:** the first tap on the board after joining asks for full screen, once per
      game; browsers only allow it in answer to a tap. A full-screen toggle stays beside the game menu on
      phone layouts (`FullscreenToggle`, using `screenfull`). iPhones don't allow full screen for pages, so
      there it's hidden. (Superseded by R146: only the button asks for full screen.)
- [x] **R67 One sheet, not many.** `SheetHost` is the board's single sheet: frame, slide, header, chips, swipe,
      tap-away and card sizing. A pile's `BoardSheet` now only asks to be shown and draws its cards into the
      host's body through a portal. Going between piles just changes what's inside, so there's nothing to
      animate (the earlier switch flag is gone). A closing pile keeps its cards in the sheet while it slides
      away. The current chip is scrolled into view. Checked by probe: one frame throughout, and "Dead" (the
      last chip) is in view.
- [x] **R68 The chat follows the keyboard.** It opened and closed by animating its height over 500ms, so every
      keyboard resize was animated too. On phone layouts it now slides with `translate`, and its height
      (`--visual-height`, from `visualViewport` resize and scroll) applies at once. The viewport also asks for
      `interactive-widget=resizes-content`, so Android shrinks the page with the keyboard (replaced by
      `resizes-visual` in R108, so the board keeps its size). **Check on the phone.**
- [x] **R69 Prompt options:** when no button fits, the one button reads "Show options (n)"; when some fit, "+n
      more". Either way the rest open as a panel of chips dropping down from the divider over our board
      (framer-motion), closing on a choice or a tap elsewhere. It replaces the dropdown.
- [x] **R70 Bug (from a phone screenshot, 2026-11-18): on Android (Firefox) the board stopped about 90px short of
      the bottom of the screen**, with the page background showing below our bar. You found that leaving full
      screen closed the gap and any touch brought it back. So the page itself was scrolling (leaving full screen
      resets the scroll, and a touch-drag on the board scrolled it). Fixes: - The phone board's container is `fixed inset-0` (it was `top-0 h-dvh`). - While it shows, `useAdaptivePage` clips `html` and `body` to the screen (`overflow: hidden`, `height:
100%`) and puts back any scroll that slips through. - The compact stats bar's stats were 32px tall inside a 28px bar, because `h-8` beat the `h-6` override.
      `StatContainer` takes a `height` now. - Checked in emulation: a scroll and a drag leave the page at 0, and nothing extends past the screen. - The gap was still there. The readout showed the phone was running Firefox, not Chrome, and the board did
      reach the bottom of the page (636px). Our bar was 92px tall instead of about 34px because Firefox for
      Android reports the 48px system navigation bar as `safe-area-inset-bottom`, even though the page stops
      above it. Bottom padding now uses `--safe-bottom` (`env(safe-area-inset-bottom)`), which
      `useAdaptivePage` sets to 0 on Firefox for Android. - Confirmed on the phone. The dev-only readout used to find it (`client/dev/BoardDebug.jsx`) is removed.
- [x] **R71 The avatar's first-player ring and "1st" badge were cut off** by the stats' scrolling strip. The
      avatar now sits outside the strip, larger than the bar, reaching out of it towards the board (up from our
      bar, down from the opponent's). The bar lies over the cards (z 245, under the divider) so it stays visible.
- [x] **R72 The avatar was too large, and the reserve was cut off at the bar's right edge.** The avatar is
      smaller and only overlaps the bar a little (32px in the 28px phone bar, 36px in the 32px one). Your phone
      draws the interface at 1.2×, leaving about 300px for the bar, and the bigger avatar had pushed the stats past
      it. Compact stats are 32px wide (were 36px); the whole bar fits at 300px, checked in Firefox.
- [x] **R73 The sheet had no background**, so the board showed through it, and the opponent's bar and strip drew
      over its header. Its `bg-neutral-950/95` was never generated: `neutral` is the neutral faction's single
      colour in `tailwind.config.js`. It is `bg-zinc-950/95` now (avoid `neutral-*` shades everywhere).
- [x] **R74 The question is never repeated outside the divider**, which always shows it. The sheet no longer shows
      it when its cards are being chosen from. The "more" panel no longer shows it and stops below the divider,
      so the question stays visible. Nothing else repeated it (checked the pile popups, sheets and panels).
- [ ] **R75 On Android (Firefox) the open chat's input sat behind the keyboard.** The first fix (letting the
      page move while typing) did not help: in full screen Firefox never reports the keyboard (the visual viewport
      does not shrink; Mozilla bug 1886881), so no sizing can follow it. Decision (you chose): on phone layouts the
      chat's input sits at the top, under its header, with the newest messages directly below it (`ChatArea`
      `newestFirst`), so the keyboard only ever covers the oldest. `--visual-height` still sizes it where the
      browser reports the keyboard. **Waiting on a check on the phone.**
- [x] **R76 The phone chat button stays in one place.** It is in the opponent's bar (top right) in portrait and at
      the top of the stats rail in landscape, no longer in the divider. The chat opens below that bar (beside the
      rail), which stays above it (z 305), so the button does not move and only changes icon. The chat's own
      close button is gone. `--board-chat-top` and `--board-chat-left` say where it opens.
- [ ] **R77 A gap above the opponent's bar in portrait full screen**: the top safe area (the status bar) was kept
      clear. On Android `--safe-top` is 0: a browser tab sits below the status bar and full screen hides it.
      **Waiting on a check on the phone.**
- [x] **R78 Chat or chat and game log**: a toggle in the chat's header ("Chat" / "Chat + game log"), remembered
      in localStorage. A chat message is one the server starts with the sender's avatar (`isChatMessage`).
- [x] **R79 New game log lines show in the divider**, fading the prompt out and the line in (not the phase track).
      Decisions (you chose): each line stays at least 1.5s, gives way to the next as soon as that has passed, or
      stays up to 4s when nothing follows; every line shows (a burst drains at the minimum); a new prompt that
      needs us clears the line and the queue at once, so we never wait on the log to act. Tapping the line brings
      the prompt back (added). Chat messages are not shown. `useLogFeed`, `Messages compact`.
- [x] **R80 The chat button's count is chat messages only**, not game log lines.
- [x] **R81 The phase track rolls**: full names, the current one centred and lit (no diamond), the line fading
      at its edges, never repeating a name (seven at most, setup only before the first round), and rolling on
      continuously from taxation to the next plot. The server does not send the round, so `PhaseRoll` counts rounds
      as the phases wrap; it only renders the names within reach of the current one (and one more each side,
      invisible, to fade in and out).
- [x] **R82 Faction and agenda side by side when the row has room**; squeezed, the faction slides over the agenda
      down to the strip it showed before and no further. A grid column per agenda, `minmax(strip, card + gap)`.
- [x] **R83 The opponent's hand fans out** over their half of the board, which darkens, when tapped (to count it)
      or when its cards are shown to us or are to be chosen from (then it stays until the choosing ends). A tap
      anywhere else puts it back. The cards fly from and back to the strip. `HandFan`.
- [x] **R84 Scrolling in the settings dialog stopped when the swipe started on a switch**: HeroUI sets
      `touch-action: none` on a switch's whole label. Switches and checkboxes now let scrolling through (a scroll
      cancels the press).
- [x] **R85 Cards stuck loading, and rings stuck over the board** (both boards). A card flying into a clipped area
      flies as a copy above the page while the real card is hidden, and the copy waited for every animation in it
      to end, including a loading card's endless pulse and a choosable card's breathing ring, so it never went
      and the real card stayed hidden. The copy now waits only for animations that end. Flight ghosts, exits and a
      turned card's old face are removed when their animation is cancelled as well as when it finishes. Reproduced
      in the dev board (a loading card played into the play area) and fixed.
- [x] **R86 Prompts whose buttons belong together show all or none** (behind "Show options (n)"). The server
      marks them: `showAllButtons` on a prompt (`PlayerPromptState`, passed through by menu prompts). Marked:
      initiate a challenge, select first player, apply claim / continue, claim against more opponents, select an
      icon. Superseded by R117 (every prompt is all or none); the flag and its spec are removed.
- [x] **R87 The log line replaces the phase track, not the prompt** (supersedes part of R79): the prompt and its
      buttons always show. A line too long for the row scrolls along once, after a pause, and is held until it
      has (`useLogFeed` `hold`). The "new prompt clears the log" rule is gone with it, since nothing is hidden.
- [x] **R88 Holding a finger on a card and moving it previews the card under it**; moved off every card the last
      one stays until the finger lifts. Off manual mode no card can be carried, so this always works; in manual
      mode a hold and move on our own card still picks it up (no preview while carrying).
- [x] **R89 Manual mode shows our empty shadows and out of game in place**, drawn as empty piles; shadows always
      sit beside the hand (moved out of the pile cluster), and both slide open and closed (`Reveal`). They also
      show while a card is carried, replacing the old drop tray.
- [x] **R90 The card size setting did nothing above normal**, and auto scaling off was ignored. Auto on: the
      fitted size times the chosen size (larger cards scroll). Auto off: the chosen size as it is. Two of this
      branch's own specs encoded the old cap (`adaptiveScale.spec.js`: "always fits the play areas in the height"
      with size 3, and "no room to grow for a large one"); changed on your request, plus one for auto off.
- [x] **R91 The fan's label** is the pile label a phone shows when tapped (icon, name, count), above the fan.
- [x] **R92 A chosen card pops** (grows and settles back) instead of staying enlarged; its ring shows it is chosen.
- [x] **R93 Shadows are marked off from the hand** by a divider named "Shadows".
- [x] **R94 In portrait the strip's background runs on behind our hand.**
- [x] **R95 Manual mode on phones: a stat's +/- open from tapping it** (a small panel off the bar's inner edge,
      the stat drawn as on the wide bar), instead of crowding the bar.
- [x] **R96 The log line is centred** in the phase row, like the phase track; one too long for the row starts at
      its left edge and scrolls.
- [x] **R97 The prompt is centred**: its text ("Waiting for opponent(s)" included) and its buttons.
- [x] **R98 "Select a plot (2 selected)" counted the opponent's plot.** The server marked a chosen plot on the
      card itself, so every player's view had it selected: the opponent could see which plot was chosen before
      the reveal. Only the plot's owner sees it selected now (`PlayerPromptState.getCardSelectionState`). Spec:
      `test/server/gamesteps/PlotSelectionSecret.spec.js`; documented in `docs/engine.md`.
- [x] **R99 The pile sheet's header is one slim row**: the avatar, the pile chips (the open one lit, so no title)
      and the close button. Below the `lg` breakpoint everything is smaller and the name is hidden.
- [x] **R100 Plots in a sheet are the size of every other pile's cards, turned on their side** (they were sized
      on their own, about 40% larger in phone landscape).
- [x] **R101 A thin line between the phase row and the prompt**, fading out at both ends (upright, between the
      track and the prompt, in phone landscape), and a little more room there.
- [x] **R102 The chat's copy button is on the left**, the Chat / Chat + game log toggle on the right.
- [x] **R103 A row with more past its edge says so clearly**: the edge lit amber, the cards fading under it and a
      chevron that scrolls a page that way when tapped (the strips, which had no marker, and the play areas).
      The "more" label is gone.
- [x] **R104 The play areas always scroll sideways**: characters keep to one row and locations to another. Where
      the area has no room for two rows of cards (phone landscape), both share one line with a rule between them;
      this is measured, not tied to the layout mode. (Superseded by R125: only phone landscape shares one line.)
- [x] **R105 Phone landscape strips have less padding above and below.**
- [x] **R106 The stats rail goes to two columns when one does not fit its height**: the avatar and power, gold and
      initiative, claim and reserve, then full screen and the menu. The opponent's half is mirrored (upside down)
      in both layouts, so each player's avatar is nearest the divider. It goes back to one column once the height
      it needed is there again.
- [x] **R107 "Unexpected Error" on phones, mostly as the opponent acted**: a log line too long for its row asked to
      be held while it scrolled, which gave it a new entry, which started its scroll again and asked again, until
      React gave up ("Maximum update depth exceeded" in `LogText`). Real game lines are long; the fixture's were
      not, so it never showed in the dev board. Reproduced with a long fixture line (added) and fixed: the scroll
      starts once per line, and holding a line for as long as it already is changes nothing. In development the
      error screen now shows the error and where it happened, so one on a phone can be read off the screen.
- [x] **R108 The keyboard no longer squeezes the board** (the stats rail most of all, in phone landscape): the
      page asks for `interactive-widget=resizes-visual`, so the keyboard covers it, and where a browser shrinks the
      page anyway the board keeps the height it had while something is typed into (`--board-height`). Only the
      chat follows the keyboard (`--visual-height`). **Check on the phone (Firefox).**
- [x] **R109 A tapped hand card was cut off in phone landscape**: our strip (which holds the hand there) scrolls
      sideways, so it clips, and R105 had left too little room above the cards for one to rise. Our strip keeps
      room for a raised card above them.
- [x] **R110 The stats rail is split by the divider** (with R113): the opponent's stats anchored to the top, ours
      to the bottom. Each half goes to two columns when its stats do not fit it.
- [x] **R111 The challenge prompt asks "Initiate a challenge?"** (the server sent no title).
- [x] **R112 The card preview no longer lists the card's state** (strength, power, tokens, attachments) under it.
      To come back later, with more thought (open note).
- [x] **R113 Play areas scroll down too** when a card with many attachments stands taller than the area, with the
      same edge markers; the opponent's stays scrolled to the divider's side.
- [x] **R114 In phone landscape the divider runs across the whole screen**, over the stats rail, giving the prompt
      and the phase track the rail's width.
- [x] **R115 A skip button for the game log** beside the line, with how many lines wait (+n): it skips them all and
      brings the phase track back. Tapping the line goes on to the next.
- [x] **R116 A line that scrolls while others wait scrolls faster**, pausing less, to be done close to the least
      time a line shows (1.5s); a line that comes to keep others waiting part way through speeds up for the rest.
- [x] **R117 Options that do not fit the divider all open in a panel below it**, over our board, by themselves
      for each new prompt, and stay until hidden ("Hide options" in the divider; "Show options (n)" brings them
      back) or chosen from. Animated open and closed. Every prompt is all or none now, so "Wait" and "Don't ask"
      are never left hidden behind "+n more". The server's `showAllButtons` (R86) was removed, with its spec.
- [x] **R118 Icons in a log line sit in the middle of the text** (the gold coin sat below it).
- [x] **R119 The options button takes no line of its own**: in portrait it sits beside the prompt's text, and the
      chips' line takes no room while the options are in their panel; wider, it is on the prompt's one line.
- [x] **R120 The options showed twice after turning the phone**: opened in their panel in portrait, they then
      fitted the divider in landscape and showed there too, the panel still open. The panel only shows while the
      options do not fit; turned back, it opens again unless it was hidden. The play areas also stay scrolled to
      the top (the opponent's was kept at the bottom, which hid the top of their cards and could come loose as
      the screen turned); a marker shows when attachments run on below.
- [x] **R121 A subtler marker for more past an edge**: a 1px lit line, a short fade and two small chevrons a third
      and two thirds of the way along the edge (either scrolls that way when tapped), fading in and out.
- [x] **R122 The options toggle stands apart from the options**: a smaller grey pill in sentence case, not an amber
      chip.
- [x] **R123 Larger card sizes scale with the screen**: with "Scale with screen" on, the cards fitted to the board
      are multiplied by the chosen size, so on a phone, where they already fill it, Large spilled well past. What a
      size above normal adds is scaled by the board's shorter side: all of it from 950px (a desktop), a quarter at
      400px or less (a phone), so Large is ×1.1 on a phone. Normal and smaller sizes are unchanged.
- [x] **R124 The divider and its options panel are translucent**: black at 60%, like the rail, the panel blurring
      the cards under it so its options stay readable.
- [x] **R125 Two play rows wherever there is height for them**: characters and locations keep a row each in every
      mode except phone landscape, which shares one line. It no longer follows the area's measured height, which
      changed with the divider's and flipped between one and two rows in portrait.
- [x] **R126 The edge marker is only the lit line and a light fade**: the chevrons were too noisy, so they are gone
      (and tapping to scroll with them).
- [x] **R127 Empty shadows and out-of-game piles show only while a card is dragged**, in manual mode too. Empty,
      the shadows show only their line beside the hand; the vertical "Shadows" label comes with the first card.
- [x] **R128 The opponent's pile sheet mirrors ours**: their avatar, chips and close button run along its bottom,
      above the handle.
- [x] **R129 The pile sheet's chips fade at an edge with more past it** rather than being cut off.
- [x] **R130 Phone landscape draws hands and piles as large as the cards in play**: they were 0.7 of them, and the
      budget reserved 5.5rem for the divider and padding (they take 4rem) and gaps between rows the layout does
      not have, which left about 35px empty in each play area. At 844×390 every card is now 0.75 (hand and piles
      were 0.5), with about 10px spare in each play area.
- [x] **R131 The opponent's piles sit beside their hand**: their hand's place in the strip grew to fill it, pushing
      the piles to the far edge in landscape. It now shrinks to fit but never grows; in portrait the piles are
      still pushed to the right edge.
- [x] **R132 Chat text matches the prompt's**: the chat sits in the interface zoom, which sets 1rem (16px), so its
      messages were a quarter larger than the prompt's 0.8rem. They are 0.8rem now, on both boards. Screen scaling
      zooms the chat and the prompt alike, so it was never the cause.
- [x] **R133 No dividers between the player stats**: only the gaps between them; the classic board keeps its lines.
- [x] **R134 The shadows have no divider or label**: they sit beside the hand like any other pile (supersedes the
      divider in R127).
- [x] **R135 The faction card comes before the agenda, as on classic**: faction, then the agenda, then each further
      agenda tucked half under the one before it.
- [x] **R136 The prompt is a side panel on wider screens**: the middle bar stays in portrait only. Phone landscape and
      desktop keep its look and workings (phase track, newest log line, prompt, chips and the options panel) in a
      panel on one side of the board. Decided 2026-11-18:
    - Desktop: the panel spans both play areas on the chosen side, centred where the bar was (the line between the
      two play areas). Both play areas leave room for it, so cards only go under it once scrolled sideways, as on
      classic. Its width is fixed, like classic's (up to 16rem), and follows the interface size.
    - Phone landscape: a column on the chosen side, about 30% of the screen, full height: the opponent's stats at
      the top and ours at the bottom, each a grid of 2 rows by 4 columns (avatar, power, gold, initiative; claim,
      reserve, then full screen and the menu in ours), the opponent's mirrored. The prompt sits between them. The
      chat button goes in the panel's top outer corner. It replaces the stats rail.
    - Sheets and the options panel stop at the prompt panel's edges as they did at the bar's.
- [x] **R137 A HUD setting puts the prompt on the left or the right** (default left), on both boards: classic's
      sticky prompt moves to the right edge of the board when chosen. Unset means left, so the saved default stays
      as it was. On the right, the desktop panel keeps clear of the chat's tab.
    - Built: in the panel, chips wrap onto up to three lines before giving way to the options panel, which drops
      below the prompt (over our stats in phone landscape, until hidden). Phone landscape's height budget no longer
      counts a divider (1.5rem of chrome), nor does the desktop's (4rem).
- [x] **R138 The interface scales with the screen on the adaptive board**: it compared every screen to a 1600×950
      desktop and never went below normal, so phones and tablets always drew it at normal size and a small desktop
      window never shrank it. Each layout now has a usual screen of its own (390×844 upright, 844×390 on its side,
      1600×950 desktop), and the interface follows the screen against it, from 0.85 to 1.4, before the interface
      size setting. The card fit allows for the larger or smaller prompt and stats.
- [x] **R139 Phone landscape's stat grids are packed together**, not spread across the column.
- [x] **R140 The board runs on under the prompt's column in phone landscape**: the column lies over the board's side
      (30% of the screen, 14 to 24rem), translucent, and each strip and play area starts with room the column's
      width, so cards only go under it once scrolled and show through it. The sideways edge highlights sit at the
      column's edge (--board-cover-left / -right), so more under the column still shows. The desktop panel uses the
      same room for its play areas.
- [x] **R141 Swiping the chat the way it closes closes it**: up on a phone, where it drops from the top; right
      elsewhere, where it slides in from the right. A swipe that scrolled the messages does not close it.
- [x] **R142 The options toggle is a fixed size**: "Show" or "Hide" with a chevron (the count is in its tooltip),
      so changing it moves nothing.
- [x] **R143 In-game settings stay where they are (decided 2026-11-18)**: board changes made in a game are kept by the
      game server for that game only, and the chat's "Chat / Chat + game log" choice stays in the browser.
- [x] **R144 Characters come first in a one-row play area**, on either side of the board, then locations, then
      anything else.
- [x] **R145 Phone landscape's column: one line of stats each, and the tools apart**: each player's avatar and stats
      are one line, drawn smaller as a whole where the column is too narrow for them (`FitRow`). The chat, full screen
      and the menu sit together in a slim bar along the column's bottom edge, towards the screen's side, apart from
      the stats (supersedes the 2 by 4 grids of R136 and R139).
- [x] **R146 Full screen only from its button**: the first tap on the board no longer asks for full screen.
- [x] **R147 Phone landscape's tools sit above our stats**: our stats stay at the column's bottom; the menu, full
      screen and chat sit just above them, against the screen's edge, in that order from the edge in (supersedes
      R145's bar along the bottom edge).
- [x] **R148 The whole board scrolls sideways together; each side scrolls up and down on its own (decided
      2026-11-18)**: both players' strips (plots, faction, agenda, hand, shadows and piles) and play areas scroll
      sideways as one, in every layout, and the prompt keeps still over them. Only portrait's hand tray stays out of
      it. Each side's play area scrolls up and down on its own, so lost height comes out of characters and locations
      first and the strips are always whole. A sideways swipe that starts on a play area moves the board: each scroller stops a swipe at its ends only along the axis it scrolls. A play area starts at, and keeps to, the edge facing the other player:
      the opponent's at its bottom, ours at its top. This reverses the strips scrolling on their own (R9, R125) and
      each play area scrolling sideways on its own (R103, R104).
- [ ] **R149 Melee keeps the table (decided 2026-11-18)**: melee uses classic's arrangement, a two-row grid of
      players in clockwise seat order around us, the whole table scrolling sideways (R148). There is no carousel and
      no opponent tabs. Auto-follow stays (`followAction`, on by default) and scrolls the table to the acting
      player's board, or to the board with cards we can select. See phase 6.

## Architecture

### Switch

- [x] **R150 The whole board scrolls as one, both ways (decided 2026-11-18)**: both players' strips and play areas
      scroll together sideways and up and down, in every layout, starting at our side (the bottom) and the plots
      (the left). Portrait's hand and shadows row scrolls with it too, starting at the left and no wider than the view (R153). Supersedes R148's separate up-and-down scrolling for each side.
- [x] **R151 Portrait's prompt sits below our hand**: it keeps the room of one line of options and reaches up over
      our board, translucent, for the rest (`PromptBar` mode `dock`). A chevron tab on its top edge folds the
      whole prompt to one line, folding and unfolding smoothly; a new prompt to answer unfolds it. Replaces the Hide/Show options toggle in portrait.
- [x] **R152 (superseded by R154) Phone landscape: stats along the wall, the prompt beside them, the tools as tabs (decided 2026-11-18)**:
      each player's stats are a bordered stack down the screen's edge on the prompt's side, stuck to their own board:
      at the wall as it scrolls sideways, the opponent's at the top of theirs and ours at the bottom of ours (as the
      classic melee board keeps each player's stats with their row). The prompt is its own panel beside the stats,
      centred on the screen. The menu, full screen and chat are tabs on the wall between the two stacks, in that
      order from the top. The stacks are drawn smaller when they and the tabs are taller than the view. The desktop
      keeps its bars and floating panel. Supersedes R145 and R147.
- [x] **R153 Our hand scrolls with the table**: in portrait, our hand and shadows row is part of the board's scroll,
      below our strip, rather than fixed along the bottom. The prompt stays below it.
- [x] **R154 Phone landscape: the stats are rows at the top and bottom of the column (decided 2026-11-18)**: the
      prompt's side of the screen is a column, and the board (strips included) starts where it ends. The opponent's
      stats are a bordered row at its top and ours at its bottom, drawn smaller to fit its width; each belongs to its
      own board, staying at the screen's side as the board scrolls sideways and at its board's edge as it scrolls up
      and down. The prompt sits between them, and the menu, full screen and chat are a row against the screen's edge
      just above our stats, scaled with the interface. Supersedes R152's stacks down the wall and tabs.
- [ ] **R155 Melee's table, settled (decided 2026-11-18)**: two rows on every layout; stats on each player's own
      board; joust's card scale; an empty seat for odd counts rather than a span; titles in each player's stack;
      auto-follow scrolls the target's board into view. Melee dev fixtures with 3 to 6 players. Finished steps are
      committed as they go. See Layouts (Melee) and phase 6.

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

| File                          | Role                                                                                              |
| ----------------------------- | ------------------------------------------------------------------------------------------------- |
| `AdaptiveGameBoardLayout.jsx` | Lays out both sides for the current mode                                                          |
| `useBoardLayout.js`           | Watches the board area and returns the mode and scales; sets `data-layout`                        |
| `adaptiveScale.js`            | Pure functions: mode classification (with hysteresis) and per-mode scale fitting                  |
| `PlayerStrip.jsx`             | One player's non-play row: plot/faction/agenda stack, piles cluster, opponent hand                |
| `PileCluster.jsx`             | Deck, discard, dead, shadows and out of game as a compact cluster with counts                     |
| `PlotFactionStack.jsx`        | Active plot with the faction and agenda peeking behind it                                         |
| `OpponentHand.jsx`            | A short fan of card backs and a count                                                             |
| `HandTray.jsx`                | Our hand along the bottom edge (fully shown, or peeking in `short`)                               |
| `Scoreboard.jsx`              | The midline strip: opponent stats, then the prompt, then our stats                                |
| `PromptBar.jsx`               | The phone prompt: phase, text, button chips, "More", and a waiting pill                           |
| `BoardSheet.jsx`              | The edge-anchored sheet that replaces `MovablePanel` on the adaptive board                        |
| `sheetStore.js`               | Allows one sheet at a time, with tabs for recently opened piles                                   |
| `GameMenu.jsx`                | Settings, mute, manual mode, report, shortcuts, concede and leave                                 |
| `DropTray.jsx`                | Drop targets for hidden piles (shadows, out of game) that appear over the board while dragging    |
| `useAutoFollow.js`            | Scrolls the melee table to the board to show, and handles pausing and resuming                    |
| `followTarget.js`             | Pure: the follow target from the players' state (active prompt, our selectable cards, seat order) |
| `adaptive.css`                | Layout CSS keyed off `[data-layout]` (not needed yet: grid areas are inline)                      |
| `useAdaptivePage.js`          | Page-level settings while the board shows: `viewport-fit=cover` and no overscroll                 |
| `LeaveGameButton.jsx`         | Temporary Leave Game while the navbar is hidden; replaced by `GameMenu` in phase 4                |

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
2. Scroll: the whole board scrolls sideways as one, and each play area scrolls up and down on its own, with a
   lit edge wherever there is more (R126, R148). Cards never overlap. Characters keep to one row and locations to
   another, except in phone landscape, where they share one line (R125). The page never scrolls.

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

Decided 2026-11-18 (R149, R155): melee keeps classic's table.

- **Table:** a two-row grid on every layout, portrait included. We are at the bottom left, and everyone else
  goes clockwise around the table: along the bottom row, then back along the top. Classic's seat ordering
  (`MeleeGameBoardLayout`) is shared, not copied. The opponents across the table are upside down, as the top
  player is in joust.
- **Odd counts:** every board is one seat wide; the bottom row has an empty seat at its end (unlike classic,
  where our board spans the two above it).
- **Scrolling:** as in joust (R150). The whole table scrolls as one, both ways, starting at our board.
- **Scale:** the same as joust: one card scale for every player, fitted as joust fits it. A board wider than
  the screen is fine.
- **Stats:** every player's stats bar is on their own board's outer edge (top-row boards at the top,
  bottom-row boards at the bottom), staying in view as their board scrolls, as classic melee keeps them. In
  phone landscape these are the stat rows at the top and bottom of the column, one per board, handing over as
  boards scroll past. Joust keeps its own bars.
- **Tools:** with no bar of our own at the screen's edge, the menu, full screen and chat go with the prompt.
- **Hand:** ours stays with our board (below it in portrait, in our strip elsewhere).
- **Titles:** each player's title card sits in their plot, faction and agenda stack, tapped to view.
- **Auto-follow** (`followAction`, on by default):
    - Target: during our prompt, the first player in seat order with a selectable card on their board.
      Otherwise, the player with the active prompt. If neither applies, stay where we are.
    - It smoothly scrolls the target's whole board into view, both ways, and does nothing if it is already
      in view.
    - Scrolling by hand pauses it. It resumes by itself the next time the active prompt moves to a
      different player.
    - Never scroll during a drag. Wait until that ends.
- **Dev board:** `/dev/board?fixture=melee&players=3..6`, with fixtures for a mid-game table with titles,
  an opponent acting, our prompt choosing cards on two opponents' boards, and title selection.

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
    - **Removed by R148 and R149:** the whole board scrolls sideways as one, and melee keeps the table.
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

- [x] `PopupHostContext` and `PopupContainer` (`GameBoard/PopupContainer.jsx`). `CardPile`'s popup and
      `Card`'s underneath popup render through it. It's `'panel'` by default (`MovablePanel`, which ignores
      the new `onOpen` and `prompting` props), so classic is unchanged. The adaptive board provides
      `'sheet'` on `narrow` and `short`, and on `wide` when the pointer is coarse (a tablet).
- [x] `BoardSheet` (`Adaptive/BoardSheet.jsx`):
    - [x] Heights: **peek** (`min(46dvh, 26rem)`, one row of cards scrolling sideways), **full**
          (`92dvh`, a grid), and **strip** (just the header, while a card is dragged out). Through
          `SheetContext`, `CardTiledList` lays out as a row, a grid or a carousel. Cards are drawn at
          `--hand-scale`.
    - [x] The handle: a tap switches between peek and full, a pull up goes to full, a swipe down drops
          to peek and then closes. There's always an X. Checked by probe.
    - [x] No dimmed backdrop. It slides up from the bottom and away again.
    - [x] The pile's popup menu and drop zones are the same children as before (dropping underneath a
          card included).
- [x] `sheetStore`: one sheet at a time. Opening one closes the last, and the header has tabs for up to
      four recently opened piles. A sheet whose pile leaves the board is forgotten. Checked by probe:
      opening the opponent's discard closes ours, and its tab brings ours back. A peek sheet covers our
      own piles, so the tabs are how to switch between them.
- [x] Dragging a card out of a sheet drops it to a strip, and it comes back at peek once the drag ends
      (checked by probe, after the fixture's 1.5s drop timeout; in a game, when the server replies).
- [x] A pile opened because its cards are to be chosen opens at peek, with the prompt text in the
      header in the warning colour (`prompting`).
- [x] Plot selection: the plot deck's sheet is a carousel of large plots (about 72% of the screen wide),
      each snapping to the middle. It fits its content up to `92dvh`, and stays open until Done, as
      before.
- [x] Settings and keyboard shortcuts are full-screen dialogs on `narrow` and `short` (checked:
      390×844 on a phone). Report problem has no entry on the adaptive board until phase 4's game
      menu.
- [ ] Acceptance: every popup source opens as a sheet. **Checked:** discard, dead, opponent's discard
      and plots. **Not checked by probe:** draw-deck search, out of game, the agenda's cards and cards
      underneath a card. They go through the same `PopupContainer`.

#### Card preview (zoom) on touch

Today `CardHover` (`client/Components/Images/CardHover.jsx`) shows the card at a fixed size
(`3x-large`), placed above the finger and pushed inside the screen edges. It disappears when the finger
lifts. On a phone it covers much of the board and sits under the finger. Phones make the board's cards
small, so the preview is how players read them. The touch model itself stays as decided: hold still to
zoom, hold and move to drag.

- [x] Size: when the adaptive board shows (`boardLayoutStore`) and the hold is a touch, the preview is
      the largest card that fits half the screen: 92% × 46% in portrait, 46% × 90% in landscape, less
      room for the details panel. Plots are sized as horizontal cards.
- [x] Placement: in portrait, the half away from the finger; in landscape, the side away from it. A
      mouse keeps today's preview.
- [x] Live state (`CardDetails`): current strength (and what's printed, when it differs), power, tokens,
      dupes, whether it's knelt, and the names of attachments. It comes from the card's summary only,
      which `Card` now passes to the hover store as `details` (faceup cards only).
- [x] Starting a drag still hides the preview (`cardHoverStore.suppress`, unchanged).
- [x] `CardHover` behaves as before unless the adaptive board is showing and the hold is a touch.
- [x] `board:shots --hold` holds on the first card in play at every touch size and saves
      `*-hold.png`.
- Open question (unchanged): should the preview stay up after the finger lifts, until the next tap?

### Phase 4: player bars and game menu

- [x] Scoreboard: the divider's ends, on every layout (decided with R11). `ScoreBadge` shows the
      avatar (ringed, with a "1st" token, for the first player), and power and gold as large numbers
      with their icons (`Constants.StatIconImagePaths`). The name shows on `wide`. The opponent is on the
      left and we are on the right. In `short`'s single row they bracket the whole row.
- [x] Stats rail (`short`): replaced by the scoreboard on the divider, which `short` shares.
- [x] Initiative, claim and reserve: small badges with icons along the top right of each active plot
      (`PlotStats` in `PlotFactionStack`, a trial).
- [x] Manual mode: our own power and gold are outlined, and tapping one opens a +/- stepper
      (`sendChangeStatMessage`, as classic's bar). Checked by probe.
- [x] `GameMenu` (≡ on the divider): settings, keyboard shortcuts, then, for players, mute spectators,
      manual mode, report a problem, and concede, then leave game (with classic's confirmation when it
      isn't safe to leave). `LeaveGameButton` is removed. Checked by probe: every item listed.
- [x] While manual mode is on, a red wrench beside the menu shows it, and turns it off.
- [x] R13: on `narrow` and `short` the chat tab is hidden and a chat button on the divider opens and
      closes the chat, with the unread count (`GameChat` gained `onUnreadChange`). The chat drops down
      to the divider and no further (`--chat-open-height`), so the button stays in reach and our half
      stays usable, and there's no dimmed backdrop. Checked by probe: the chat's bottom edge meets the
      divider's top.
- [x] R5: the prompt title has its own small line above the instruction text.
- [x] R6/R7: caption plates (an icon and the count along the bottom of each pile) replace the count
      bubbles on `narrow` and `short` (`AreaLabelContext` `'caption'`). `wide` keeps the full labels.
- [x] R9: every pile in the strips is one size for both players. In `narrow` it's as large as lets our
      strip fit one line (0.7–0.8, more on tall screens, never more than the cards in play). The
      opponent's strip, which also holds their hand, wraps onto a second line when it must. The two
      play areas are kept the same height (`useEqualPlayAreas`), however the strips wrap.
- [ ] Acceptance: everything classic `PlayerStats` and the in-game navbar can do is reachable.
      **Checked:** settings, shortcuts, mute, manual mode, report, concede, leave, and the stat
      changes. **Not on the adaptive board yet:** the navbar's spectator list and the game server's
      connection status.
- Trade-off to judge: on a 390×844 phone, larger piles on a wrapped strip cost the play cards some
  size (0.9, down from 1.1).

### Phase 5: polish

- [x] Flights can now be checked without a server. The dev page's fixture store has the real
      `flipMiddleware`, and its panel has steps that change the game as a server would (`fixtureSteps`:
      draw a card, play a character from hand, kill a character). Checked by probe in portrait and
      landscape: drawing, playing (hand to the clipped play area) and killing (play area to the dead
      pile) all fly. Copies fly above the page where an area clips, and none are left behind
      afterwards. Mid-flight shots show nothing cut off (R10).
- [ ] **Not checked:** plot reveal and redeal into the hand tray. They need fixture steps of their own,
      or a real game.
- [x] Text selection, the iOS long-press callout and image dragging are off across the adaptive board
      and its sheets (`index.css`). The hold delay is unchanged (250ms, `holdToDrag`).
      **Judge on a real phone.**
- [ ] **Not done:** performance on a mid-range phone. It needs a real device. Where to look:
      `useBoardLayout`'s and `useEqualPlayAreas`' `ResizeObserver`s during flips, and `ChipRows`'
      one-render-per-hidden-chip measuring.
- [x] Spectators: `isPlaying` (the viewer is the bottom player) decides drops, the hand tray, the
      game menu's player items and the stat stepper. A spectator gets no hand tray, the bottom player's
      hand shows as a counted back in the strip, and the divider reads "Spectating". Checked with the
      dev page's `&spectate=1`.
- [x] Landscape keeps two rows of chips. A single row hid Power and Done in the challenge prompt behind
      "More". `short`'s chrome height is 4.25rem.

### Phase 6: melee

- [x] Settle the open layout questions in the Layouts section (Melee) with the user first (R155).
- [ ] The table: classic's two-row grid in seat order, scrolling sideways as one (R148, R149).
- [ ] Each player's seat number is a badge on their stats-bar avatar, at the top left, so it and the "1st"
      badge (bottom right) can show together (from review, 2026-11-18).
- [x] Seat order matches the classic melee grid's clockwise order (`seatOrder.js`, shared with classic). Share or extract the ordering, and
      don't copy it.
- [ ] `followTarget.js` with a spec covering our prompt with selectable cards on one or several
      boards, another player's active prompt, no target, and selectable cards only on our board.
- [ ] `useAutoFollow`:
    - [ ] Scrolls the table to the target's board.
    - [ ] Pauses when the table is scrolled by hand.
    - [ ] Resumes when the active prompt moves to a different player.
    - [ ] Waits while a drag, a raised card, a zoom or a sheet drag is in progress.
- [ ] Auto-follow control: reads and writes `followAction`, and shows "Paused · tap to resume".
- [ ] Spectator arrangement.
- [ ] Fixtures: melee with 3, 4 and 6 players, with an active prompt on an opponent, and with our
      prompt targeting cards on two opponents' boards.
- [ ] Acceptance: at every reference size, melee with 3 to 6 players never scrolls the page. Every
      player's board can be reached by scrolling, auto-follow behaves as in the Layouts section (Melee), and
      dragging, flights and sheets work wherever the table is scrolled.
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
