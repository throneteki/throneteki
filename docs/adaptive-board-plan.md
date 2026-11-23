# Adaptive game board: plan

A game board built desktop first, with phones as a strong consideration: about 98% of players are on desktop,
so the board is designed for desktop and built with phones in mind, rather than fitted to phones and scaled up.
It sits beside the current ("classic") board, and a player chooses between them in their profile. Classic is not
going away; whether the adaptive board becomes the default later is undecided.

**Desktop keeps classic's mechanics** unless there is an extremely good, stated reason a change is better (decided
2026-11-22). Ideas that suit phones (combined pile sheets, the docked prompt, extra controls) stay on phone
layouts and must not leak into desktop. Pick a sensible default over adding an option.

- Branch: `feat/adaptive-board`, branched from `feat/gameboard-overhaul`.
- Status: phases 0–6 built; the open items need a real phone or a real game (see "Review (2026-11-20)").
  Tick items off as they land. **After each phase, re-read this file and check every
  item in that phase against the code before calling the phase done.**

## Goals

1. On desktop the board plays as classic does: the same prompt, piles, chat and controls, in the same places.
2. On phones the page never scrolls. Only a crowded play-area row may scroll, sideways and on its own, as a last
   resort.
3. On phones, popups and modals suit the screen: sheets anchored to its edge, not floating windows.
4. The board layout adapts to the screen's size and orientation, and every area stays where players
   expect to find it.
5. The player bars suit each size and orientation.

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
| 2026-11-22 | Desktop first, built with phones in mind. Desktop keeps classic mechanics unless there is an extremely good reason (see the top of this file and R256–R269). Classic stays; adaptive as the default is undecided.                                                                                                                                                |

## Rules that hold in every layout

These keep the board recognisable when it changes shape:

- Ours at the bottom, the opponent's at the top. Characters sit nearest the middle and locations
  outside them.
- Plots, faction and agenda on the **left**. Draw deck, discard, dead, shadows and out of game on the
  **right**.
- The prompt is docked along the bottom (narrow), in a column down one side (short), or a panel beside the
  play areas (wide). It never changes the board's size.
- Each player's stats stay with their own board.
- Our hand is below our board (narrow), or in our strip elsewhere.
- Our tools (view mode, chat, full screen, menu) sit beside our own stats on every layout (R171).

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
- [x] **R14 (found while building) Phone landscape cards are the smallest of any layout** (about 35–45px
      wide). Four card rows, two strips' worth of side columns and the divider share 390px of height.
      Next options: smaller location rows (declined earlier), or putting each side's locations beside its
      characters instead of above them. Judge on a real phone. **Resolved 2026-11-20 (checked on the phone):** fine as
      it is; the board scrolls where it overflows, and the edge highlight shows there is more.
- [x] **R15 (found while building) The navbar's spectator list and server connection status** aren't on
      the adaptive board's phone layouts, because the navbar is hidden there. Done (2026-11-19): the game menu
      opens with them, in every layout: the game server's ping (coloured as the navbar does), and the number of
      spectators with their names. As the navbar warns a player when the number watching changes, a dot on the
      menu button shows until the menu is opened.

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
- [x] **R67 One sheet, not many.** (Superseded by R175: one sheet for each player.) `SheetHost` is the board's single sheet: frame, slide, header, chips, swipe,
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
- [x] **R75 On Android (Firefox) the open chat's input sat behind the keyboard.** The first fix (letting the
      page move while typing) did not help: in full screen Firefox never reports the keyboard (the visual viewport
      does not shrink; Mozilla bug 1886881), so no sizing can follow it. Decision (you chose): on phone layouts the
      chat's input sits at the top, under its header, with the newest messages directly below it (`ChatArea`
      `newestFirst`), so the keyboard only ever covers the oldest. `--visual-height` still sizes it where the
      browser reports the keyboard. **Checked on the phone 2026-11-20: fixed.**
- [x] **R76 The phone chat button stays in one place.** It is in the opponent's bar (top right) in portrait and at
      the top of the stats rail in landscape, no longer in the divider. The chat opens below that bar (beside the
      rail), which stays above it (z 305), so the button does not move and only changes icon. The chat's own
      close button is gone. `--board-chat-top` and `--board-chat-left` say where it opens.
- [x] **R77 A gap above the opponent's bar in portrait full screen**: the top safe area (the status bar) was kept
      clear. On Android `--safe-top` is 0: a browser tab sits below the status bar and full screen hides it.
      **Checked on the phone 2026-11-20: fixed.** The bar running under the camera cut-out is wanted, rather than
      leaving that space empty.
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
- [x] **R149 Melee keeps the table (decided 2026-11-18)**: melee uses classic's arrangement, a two-row grid of
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
      whole prompt to one line, folding and unfolding smoothly; a new prompt to answer unfolds it. Replaces the Hide/Show options toggle in portrait. (The fold tab is replaced by R178.)
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
- [x] **R155 Melee's table, settled (decided 2026-11-18)**: two rows on every layout; stats on each player's own
      board; joust's card scale; an empty seat for odd counts rather than a span; titles in each player's stack;
      auto-follow scrolls the target's board into view. Melee dev fixtures with 3 to 6 players. Finished steps are
      committed as they go. See Layouts (Melee) and phase 6.
- [x] **R156 The board's edge hints sit at the screen's edge (decided 2026-11-19)**: in phone landscape and on a
      desktop the sideways hints are on the board's own edges, not moved in beside the prompt.
- [x] **R157 An edge with a choice past it lights as the choice does**: when more than half of a card that can be
      chosen lies past an edge, that edge's hint is drawn with the select ring (`ring-selectable`, its colour shared
      as `--select-ring`), fading to and from the usual hint.
- [x] **R158 No warning border on the prompt**: the prompt no longer lights its border while choosing, which looked
      like an edge hint.
- [x] **R159 Melee rows keep to their own boards**: the table's rows are sized to their content (`auto`), sharing
      only spare room. Equal (`fr`) rows stretched the top row to ours, hand included, opening a gap in each
      opponent's play area between its locations and characters.
- [x] **R160 Phone landscape's prompt grows with its options (decided 2026-11-19)**: every option shows as a chip
      in the prompt (no options panel), which stays centred between the stats rows and scrolls once it is taller
      than the room between them.
- [x] **R161 A view-mode button replaces the paused pill (decided 2026-11-19)**: the pill covered cards and was
      hard to read. At a melee table our tools (beside our stats since R171; the column's tools in
      phone landscape) hold a button showing the view's mode: directed (a camera, blue), following the action, or
      manual (move arrows, amber). Scrolling by hand makes it manual until the action moves to someone else;
      tapping it to manual keeps it there until tapped back.
- [x] **R162 Portrait's prompt is at the very bottom (decided 2026-11-19)**: below our stats bar, filling the
      gesture area. The hints of more above and below keep inside the stats bars: the screen's bars sit outside the
      board's scroll, and at a melee table the sticky seat bars move the hints in past them (`--board-hint-top` and
      `-bottom`).
- [x] **R163 Bottom-row opponents' hands fan, mirrored (decided 2026-11-19)**: at a melee table an opponent seated
      along the bottom row has the same board as one along the top, flipped (play area, strip, stats), and their
      hand fans out over the bottom half: from the divider to the board's bottom (`--board-view-bottom`), bending
      as the top half's fan does, with the label below the fan.
- [x] **R164 Portrait's stats are cards, as phone landscape's are (decided 2026-11-19)**: one component
      (`StatsCard`) for both: the avatar and stats in a row in a bordered card standing off the screen's edge, the
      tools in a box of their own beside it (chat beside the opponent's, full screen and the menu beside ours). At
      a melee table each board's sticky stats are the same card, tinted while that player is being waited on.
- [x] **R165 The edge hints frame the play area**: the sideways hints stop where the top and bottom hints are moved
      in (`--board-hint-top` and `-bottom`), so the four meet at the corners rather than running on behind the
      stats.
- [x] **R166 Phone landscape: the column pushes each board's cards (decided 2026-11-19; now sticky, R184)**: a board's cards start at
      its edge while the prompt's column is clear of it, so a melee table has no column-wide gap before each board.
      Each board keeps the column's width spare on the side away from the prompt; as the column comes over the
      board its cards are pushed into that room (`--push`, set as the table scrolls), staying beside the column
      until it is wholly over the board, then scrolling under it. The board's stats card lies in a layer over the
      board, at its outer corner until the board reaches the column, then at the column's top or bottom until the
      board's end hands it over to the next board's. Joust looks as before, its board always starting under the
      column.
- [x] **R167 Phone landscape: the stats card has room in its strip (decided 2026-11-19)**: the stats card no
      longer covers the plots and agenda. The strip (plots, agenda, hand, piles) keeps the column's width at its
      start for the card, as before R166, so the card sits beside those cards while the board is clear of the
      column. Only the play area is pushed as in R166, so its cards still start at the board's edge.
- [x] **R168 The title sits beside the agenda (decided 2026-11-19)**: a title no longer covers the agenda. With a
      title the agenda keeps its whole width and the row grows to make room for it (the board widening); without
      one the agenda still narrows under the faction card when the strip squeezes, keeping to the right of its
      column so the faction card slides over it.
- [x] **R169 Desktop melee: the seat bars have room for the avatar (decided 2026-11-19)**: the bars are taller, so
      the avatar's ring and seat badge are no longer cut off at the top of the view.
- [x] **R170 Desktop melee: the end boards reach the screen's edge (decided 2026-11-19)**: the room kept for the
      prompt at the table's sides is now covered by the boards at the ends of the rows. Their stats bars and strips
      run to the screen's edge; only their play areas keep clear of the prompt. Following reads that room from the
      columns kept for it (`data-table-cover`), not from where the first board starts.
- [x] **R171 Our tools are off the prompt, beside our stats (decided 2026-11-19)**: the view mode, chat, full screen
      and the menu (outermost) are one tool box beside our own stats in every layout, never in the prompt: - Desktop joust: the end of our stats bar, as before. - Desktop and portrait melee: pinned in the view's bottom corner, beside where our stats sit on our board, so
      they stay when our board scrolls away. The bottom-row stats leave room for them (`--board-tools-width`). - Portrait joust: beside our stats card. The chat button moves there from the opponent's row. - Phone landscape: the box in the column above our stats, as before.
      In portrait the chat stops just above the tool box (`--board-chat-bottom`), so the button to close it stays
      in reach.
- [x] **R172 The strips mirror each other (decided 2026-11-19)**: the top and bottom halves' strips have the same
      room above and below their cards, mirrored. A title's inline box no longer adds room under the strip, and in
      phone landscape every strip keeps the room for a raised card on its play area's side (top strips below,
      bottom strips above), not only ours.
- [x] **R173 A line between the halves (decided 2026-11-19)**: in melee each top-row board has the same light line
      along its bottom as between boards side by side, and in joust the same line runs between the halves.
- [x] **R174 Desktop: the prompt's options span its width (decided 2026-11-19)**: in the desktop's panel each
      option is on a line of its own, the panel's full width, as on the classic board (`stackOptions`), scrolling
      past 60% of the screen's height. With a pointer over an option it lights up: amber with a glow, or white on
      grey for a way out.
- [x] **R175 One sheet for each player, over their board (decided 2026-11-19)**: a pile's sheet still slides out
      from an edge, but from its own player's board's outer edge in view (the top row's from the top, the bottom
      row's from the bottom), never over the site's bar above the board. It is as big as its cards need (as many
      to a row as there are, up to what fits), up to the room the board has in view, and sits across the middle of
      what of the board is in view, clear of the prompt's column in phone landscape. It keeps to its board as the
      table scrolls, leaving the screen with it. Each player has their own sheet, so several players' piles can be
      open at once; opening another of the same player's piles takes their sheet over. A sheet closes with its
      button, by tapping its pile again, or (on a phone) by swiping its handle towards its edge; tapping elsewhere
      no longer closes it. Piles with cards to choose still open themselves, and a pile's chip pulses with the
      select ring while it has cards to choose and is not the one shown. A closing sheet stays drawn until it has
      slid away (it was dropped for a moment and drawn afresh, already gone, so it vanished).
- [x] **R176 Desktop melee: the rows meet at their line (decided 2026-11-19)**: the prompt's row between the table's
      rows takes no height, so when the table is shorter than the screen the spare room goes to the boards, not
      to a gap between the rows. The active player's tint now reaches the line.
- [x] **R178 Portrait's prompt draws back only when it spills over (decided 2026-11-19)**: the fold tab (R151),
      which overlapped our stats card, is gone, and so is folding the whole prompt to one line. The docked prompt
      keeps the room of one line of options; only when its options take more lines, spilling up over the board
      (never pushing or squeezing it), do chevrons show on each side of the phase track. A tap anywhere on the
      prompt but a button draws the extra lines back to that one line, or out again, the lines sliding and the
      chevrons turning (up drawn back, down spilled out). Each new prompt shows every option. Spilling over, the
      prompt is near opaque, so the board under it does not show through. Drawn back, the options fade out and a
      line asking to see them ("Tap to see the 13 options", a pulsing hand) fades in, the height sliding between
      theirs. The room it keeps is the same whether drawn back or out, so the board above never moves while it
      slides. Its height never changes, so it never changes the board's size: whatever the prompt, even waiting
      on someone else, it keeps a title, one line of text and one line of options (empty when there are none).
      Longer text scrolls up through the rest of it and back by itself, resting at each end (the dev fixture
      `longPrompt`); only more options than fit spill over, drawn back and out as above.
- [x] **R177 A way out is grey, as on the classic board (decided 2026-11-19)**: an option the server marks as
      backing out (`cancel`, which only Cancel buttons carry) is a filled grey button rather than only a grey
      outline, so it stands apart from the amber options as classic's grey Cancel does.
- [x] **R179 Flights keep to the board as it scrolls (decided 2026-11-19)**: a card flying into the board flew as a
      copy pinned to the screen, so scrolling during its flight left it behind. Copies now fly in a layer inside the
      board's scrolling content (`data-flight-layer`), and the lower layer under the plots is positioned in its area
      rather than on the screen, so both scroll with the board. Every card is measured from the board's content,
      not the screen, so a scroll between two states (by hand, or the board keeping to its end as it grows) moves no
      card. The classic board, with no such layer, is measured and flies as before.
- [x] **R180 Drawing moves the hand smoothly (decided 2026-11-19)**: on a phone, the draw that started the hand
      overlapping made it 2px shorter, and the board, keeping to its end, scrolled by as much. Measured from the
      screen, every card on the board seemed to move, more than are ever animated at once, so none were and the
      hand jumped. Measured from the board (R179), only the hand moves, and it animates.
- [x] **R181 Portrait stats keep to the left (decided 2026-11-19)**: the stats in portrait's stats cards start at
      the card's left rather than its middle, and the top card is closer to the top of the screen. Phone
      landscape's column keeps its stats centred.
- [x] **R182 A strip's cards keep together (decided 2026-11-19)**: portrait pushed the piles to the end of the
      strip, leaving a gap after the hand on a wide board. They now follow the hand, the room left at the end.
- [x] **R183 A first tap on a pile says a second opens it (decided 2026-11-19)**: on a phone, the name and count a
      first tap shows have "Tap again to open" beneath them, for piles that open. The icons beside the name are
      gone, as nothing else uses them.
- [x] **Fixed (2026-11-19)**: the portrait prompt measured itself after every render and asked to be drawn again
      even when nothing had changed, which could loop until React stopped it (the board vanished after a prompt
      passed to another player in manual view). It now updates only on a real change.
- [x] **R184 Phone landscape: the column's push no longer jitters (decided 2026-11-20)**: R166's push was set from
      a scroll listener, so on a phone the cards were laid out a frame behind the (compositor-driven) scroll. The
      play area's cards are now `position: sticky` against the column's edge, inside a box with the column's width
      spare, which gives the same positions (checked at every scroll offset, joust and melee, prompt either side)
      without any script while scrolling. `--push` is gone.
- [x] **R185 Going between piles in a sheet eases (decided 2026-11-20)**: tapping another pile's chip fades the new
      pile's cards in, and the sheet's height eases to theirs (200ms) rather than jumping. The body only scrolls once
      settled, so no scroll bar flashes while it eases. Its width still changes at once (see the review below).
- [x] **R186 Board settings in master's new profile (decided 2026-11-20)**: merging master's profile redesign (#3834).
      The HUD settings live in the profile's Appearance section, above the background, in place of master's card
      size (`settings.cardSize` stays read only through `normalizeHud`, for old accounts). `HudSettings` uses
      master's `SettingsGroup` and `SettingSwitch`, and so does the in-game settings dialog (`GameConfiguration`),
      sharing `ActionWindowSettings` with the profile's Gameplay section, so both read the same. Both show a card
      preview and an interface preview (a stand-in player bar and prompt): in a game they inherit the board's live
      scales; in the profile they are worked out for this screen and the chosen layout (the adaptive board's own
      interface scale, and its reduced growth of large cards on phones), since nothing applies until saved. The
      desktop dialog is a size wider (`2xl`) to fit the previews. On a phone the adaptive board's cards are fitted
      to the room it has, so Large can show little or no change there, in the preview and on the board alike.
- [x] **R187 Appearance no longer scrolls sideways on a phone (decided 2026-11-20)**: the previews' content set the
      width of their grid column. Each size's column now has `min-w-0`, and a preview wider than its box is clipped
      from its start (`safe center`).
- [x] **R188 Each layout describes itself (decided 2026-11-20)**: the Layout choice has no description of its own.
      Each tile has one instead: Classic for a desktop or laptop; Adaptive for any screen, a phone or tablet in
      portrait or landscape, or a desktop. Adaptive carries an Experimental chip in place of "(experimental)".
- [x] **R189 Sizes are a slider each, under one Auto switch (decided 2026-11-20)**: Small/Normal/Large/Custom beside
      "Scale with screen" confused. Now one "Fit to my screen" choice (`hud.auto`, see R193) covers both sizes, and
      Cards and Interface each have a percentage slider (cards 50–300%, interface 60–200%, with Reset).
      Fitted, the slider makes the board's chosen size larger or smaller; not fitted, it is the size. Chosen over an
      Auto switch per size, and over Fit/Fixed tiles per size. The stored values are unchanged in shape: a preset
      name saved before still reads as its scale, and moving a slider saves a number. A slider changes the size
      when it is let go, so a game is not refitted (and sent to the server) at each step of a drag.
- [x] **R190 The previews ease between sizes (decided 2026-11-20)**: registered copies of the scales
      (`--preview-card-scale`, `--preview-ui-scale`, in `index.css`) transition on the previews only, so the board
      itself still never animates a rescale. Off under reduced motion.
- [x] **R191 The interface preview is the real bar and prompt (decided 2026-11-20)**: our avatar and name, the
      board's stat icons (power, gold, initiative, claim, reserve) through `StatDisplay`, and a phase-headed prompt
      with Done, in place of the made-up "5 gold / 3 power" bar.
- [x] **R192 Fixed sizes step between named sizes (decided 2026-11-20)**: HeroUI's Slider has no notches at chosen
      points (only `showSteps`, a dot at every step), so with Fixed size the slider steps between evenly spaced
      named sizes with those dots: cards X-Small 50%, Small 70%, Medium 100%, Large 140%, X-Large 200%, XX-Large
      300%; interface X-Small 70%, Small 85%, Medium 100%, Large 120%, X-Large 150%. The chosen name shows under its
      step; the percentage shows once, at the top beside Reset. A size saved off the steps sits at the nearest one,
      unnamed, until moved. Fit to screen keeps the smooth slider, without steps; the slider fades in as it changes.
- [x] **R193 Fixed size or Fit to screen is a choice of two (decided 2026-11-20)**: the "Fit to my screen" switch
      (R189) is now two described tiles, Fixed size and Fit to screen (marked Experimental), still saved as
      `hud.auto`.
- [x] **R194 The interface preview follows the chosen board (decided 2026-11-20)**: Classic shows the classic
      `PlayerStats` and prompt; Adaptive shows `PlayerStatsBar` and the prompt bar (phase roll, title and an
      amber chip, `chipClass` shared from `PromptBar`).
- [x] **R195 Settings wording (decided 2026-11-20)**: Classic is "designed for desktop and laptop screens", usable
      on a phone but not laid out for one. Prompt position is "in a landscape view". Fit to screen: "the sliders
      scale the fit".
- [x] **R196 Settings that come and go ease in and out (decided 2026-11-20)**: `SettingReveal` opens, fades and
      slides a setting shown only for some choices, and closes it as it goes (none under reduced motion): the
      Current password group (Account) and the custom background's Replace/Remove buttons.
- [x] **R197 Follow the action is no longer a setting (decided 2026-11-20)**: it is gameplay rather than a board
      preference, so a melee table always starts following, and the view-mode button among our tools (R161) is the
      way to stop and resume it. `followAction` is gone from `defaultHud`, `normalizeHud`, `sanitizeHud`, the
      settings and their specs; a saved value is dropped.
- [x] **R198 The interface preview stays under the profile's footer (decided 2026-11-20)**: the adaptive player
      bar's own `z-[245]` (to lie over the board's cards) put it over Discard and Save; in the preview it is `z-0`.
- [x] **R199 The previews size exactly as the board does (decided 2026-11-20)**: the profile's previews had used
      only part of the board's sizing (no fit to the board's room), so the adaptive board's cards came out larger
      than shown (1.25 against 1.00 at 1400×900). Both boards now size through `GameBoard/boardScales.js`
      (`classicScales`, `adaptiveScales`), and record what they were measured at (`boardMeasure`). In a game the
      previews are sized against that; in the profile against the room a board would have in this window (the
      whole window where the adaptive board hides the navbar, below the navbar elsewhere), with nothing in play.
      Checked at 1400×900, 1920×1080, 390×844 and 844×390 on both boards, empty and mid-game: profile preview,
      in-game preview and board all equal. A row of cards too wide for the board can still make the board's cards
      smaller than the profile shows, since the profile cannot know what will be in play.
- [x] **R200 Game settings save as the profile's do (decided 2026-11-20)**: changes in the game's settings are
      kept aside and applied together with Save changes (which closes the dialog), or dropped with Discard or by
      closing, so the board does not move under the dialog. The footer (status, Discard, Save changes) and its
      wording match the profile's. Titled "Game Settings", with "For this game only. To change them for every game,
      use your profile." The previews still ease between sizes; the board itself changes size at once on Save, as
      it never animates a rescale.
- [x] **R201 Game settings have Gameplay and Appearance tabs (decided 2026-11-20)**: drawn as the profile's
      section links (the active one filled, a dot on one with unsaved changes).
- [x] **R202 Step names stay on one line (decided 2026-11-20)**: "XX-Large" wrapped under the slider on a phone.
- [x] **R203 Our sheet covers our hand in portrait (decided 2026-11-20)**: it slid out from our board's bottom
      edge, which in portrait is above the hand's row, so it opened above the hand. Our sheet now reaches down over
      the hand's row (`handTrayBelow`).
- [x] **R204 A sheet's cards keep their size as the board moves (decided 2026-11-20)**: they were refitted to the
      visible part of the board on every scroll. They are now sized when the sheet opens and when the board or the
      window changes size; moved, they go past the view's edge instead.
- [x] **R205 Swiping a sheet closed (decided 2026-11-20)**: on a phone, a swipe towards the sheet's edge (down for
      ours, up for the top ones) closes it from anywhere on it, not only the handle. On its cards the cards scroll
      first: the swipe only closes the sheet when it starts with them scrolled as far as they go that way, and
      stops being one if they scroll, go sideways or a card is picked up.
- [x] **R209 A sheet's swipe holds the cards still, and goes the way it was last moving (decided 2026-11-20)**:
      R205's swipe let the cards scroll in the same gesture once the finger turned back. A swipe is now the sheet's
      from its first move towards the sheet's edge until the finger lifts, and the cards do not scroll in it (the
      touches are listened to directly, so their scrolling can be held). Let go, the sheet closes if the finger was
      last moving towards the edge (and it is pulled at least 24px), and springs back if it was last moving away,
      however far it was pulled.
- [x] **R210 Faction, agenda and plots have slot names (decided 2026-11-20)**: as an empty pile's slot shows its
      name faintly (DISCARD, DEAD), the faction's and agenda's slots show FACTION and AGENDA (`slotLabel`, with no
      label or inspect of their own), and the plots' shared zone shows one PLOTS in its centre.
- [x] **R211 Card previews lie over sheets (decided 2026-11-20)**: the hover preview was at `z-10`, under the
      sheets; it is now at `z-[450]`, as the fitted preview was.
- [x] **R212 The stats bars lie over the sheets, which reach under them on a phone (decided 2026-11-20)**: sheets
      are drawn in the board's own layers (no longer portalled over the page), at `z-[300]`, under the stats bars
      (`z-[305]`/`z-[306]`). On a phone a sheet that runs to the edge of the view carries on under the stats bar at
      that edge (`data-sheet-edge`), padded by as much, so it seems to come out from behind the bar while none of
      its cards or scrolling is under it.
- [x] **R213 Sheets keep clear of the prompt (decided 2026-11-20)**: the desktop's floating prompt
      (`data-region="prompt-float"`) is taken out of a sheet's room as phone landscape's column already was, so a
      sheet is never wider than the board beside the prompt.
- [x] **R214 A card that can be clicked shows the pointer (decided 2026-11-20)**: a card with something to do
      (selectable, selected or playable, such as hand cards in setup) shows the pointer even where it can also be
      dragged; grab is for cards that can only be dragged. A placed setup card that a click would return to hand
      is not flagged by the server, so it shows no pointer.
- [x] **R215 Desktop's chat is a button in our bar (decided 2026-11-20)**: on the adaptive board's desktop layout
      the chat's tab at the screen's edge is gone; the chat button (with its unread badge) is at the end of our stats
      bar, after the game menu. The floating prompt no longer keeps clear of the tab.
- [x] **R216 The game's menu fits in our bar (decided 2026-11-20)**: on the adaptive board the navbar no longer
      offers Spectators, Concede and Leave Game. On the desktop's bar every item is a named button, in the bar's
      order (spectators and mute, settings, shortcuts, manual mode, report, then concede and leave game); what does
      not fit goes into the menu (kept by priority: settings, leave, manual, concede, report, spectators, mute,
      shortcuts), and with everything in the bar the menu button is not shown. Phones keep everything in the menu.
- [x] **R217 The stats stand a little proud of an edge bar (decided 2026-11-20)**: in a stats bar at the screen's
      top or bottom the stat icons are drawn 15% larger, growing towards the board, so they reach a few pixels out
      of the bar as the avatar does (about half as far), their edge at the screen's side unchanged.
- [x] **R218 Phone stats cards are a slim band capped by the avatar (decided 2026-11-20)**: as on the desktop's
      bars, a phone's stats stand a little proud of their background, but by the background getting slimmer, not
      the icons larger: the card's box and border are gone, and a band 3px shorter than the icons at each edge
      (`backdrop`) runs behind them from the avatar's centre, so the avatar caps its end.
- [x] **R219 Board overlays, first version (decided 2026-11-20)**: overlays for the game's key events on the adaptive
      board (`BoardOverlays`), over the board's area only: the chat is never covered (the phone chat now sits above
      them, `z-index: 360`). Major overlays, game start (each player's faction card, every agenda, avatar and name,
      with VS in a joust) and game over (the winner, or a melee's standings with reasons for those eliminated, and
      Rematch, Continue playing and View board, which hides it behind a chip that brings it back), dim the board
      and wait for a button. Minor overlays, plots revealed, titles chosen (melee) and a player eliminated (melee,
      game going on), animate over a lighter dim without blocking play, and have a Continue button whose fill shows
      it being pressed for you after the timer; revealed plots and titles fly back to their places on the board.
      Each overlay shows once a game (session storage), so a refresh does not repeat it. Settings: "Show board
      overlays" (`hud.overlays`, on unless turned off) and "Close overlays after" (`hud.overlayTimer`, whole
      seconds 1–10, 3 unless changed), shown for the adaptive board. Engine: the state now sends `winners`,
      `winReason`, and each player's `standing` and `eliminatedReason` (the old `winner` field was always empty).
      Dev fixtures: Game starting, Game won, Melee: game won; steps: Reveal new plots, Melee: choose new titles,
      Melee: eliminate a player. Not yet: dominance, the time limit's tiebreak ladder (the engine keeps no record
      of it), focus prompts.
- [x] **R220 End of round overlay (decided 2026-11-20)**: a minor overlay when the log announces the end of a round
      ("End of round N", the `endofround` alert): the players still in, most power first as the log lists them,
      level players sharing a place, each with their faction card and agendas, name, total power and a bar towards 15. A list in portrait, a row elsewhere. Dev step: End the round.
- [x] **R221 Overlays: the plot phase's reveal only, one copy of each card, fading (decided 2026-11-20)**: plots
      revealed only shows in the plot phase when every player still in reveals a new plot at once, not for a plot
      revealed on its own (a scheme, Rains of Castamere, a card revealing a plot). A card an overlay shows from the
      board (a plot, a title) is hidden on the board while the overlay shows it, comes out of and lands back exactly
      on it (measured: no offset), and the board's own shows again as the copy lands, so a card is never in two
      places. Titles on the adaptive board are flip cards now, so they can be found, and move as other cards do.
      Every overlay, dim included, fades in and out. Overlays compare against the game once its players have arrived,
      so loading a game does not show one. Dev board: "Show an overlay…" plays each overlay from a fresh board (with
      its fixture and steps), including a plot revealed alone, which shows none.
- [x] **R222 Overlays: seating, long names, titles' relations, the elimination seal, choices (decided 2026-11-20)**:
      players in an overlay sit as the melee board seats them, us at the bottom left and the rest round the table
      (two rows: 2+2 for four, 3 on top and 2 below for five; a joust side by side; on a phone two to a row, five or
      six going round three rows). Lists in an order (game over by place, end of round by power) fill the top row
      first. The end of round has no place numbers, just the order. Names are sized for the longest username (15
      characters) and shorten to fit their place rather than push the rows apart. Titles chosen shows under each
      title whom it rivals (red) and supports (green) among the players still in, "You" for us; the server now
      sends each title's `rivals` and `supports` (`TitleCard.getSummary`, spec `TitleRelationsState.spec.js`).
      A player eliminated is stamped ELIMINATED: a seal that comes down hard, the cards jolting under it and going
      grey. Each faction card, agenda, plot and title has a slight tilt of its own, the same each time it is
      drawn, and the cards straighten as they fly back to the board. Choices: a prompt that only asks us to choose
      a title, or a player (first player, initiative and other `ChoosePlayerPrompt`s), is shown over the board while
      it waits, the titles as cards and the players seated as above with their power; it can be put aside behind a
      chip to look at the board, has the prompt's Cancel when it has one, and fades as a choice is pressed. Dev
      board: "Long names" renames everyone but us to 15-character names; "Show an overlay…" adds the title choice and
      the first player's choice (joust and melee).
- [x] **R223 Overlays play out on a table (decided 2026-11-21)**: every overlay is cards landing on a pretend table.
      Cards are tossed onto it from off its edge on their player's side, turning as they come, high above it (a
      wide soft shadow) until they land with a little give; a faction card first, its agendas just after. What is
      written about them (names, power, places, buttons) fades in once they land. Game start: everyone's cards
      tossed down, then their names, and in a joust VS slammed down between them; only Begin (View board did the
      same). Plots revealed: the plots come off the board face down and are turned face up one by one. Titles
      chosen: the rival and support lines pop in after each title lands. End of round: cards tossed down in power
      order, then the power counts up and its bar fills. Eliminated: the cards are tossed down, the seal slams onto
      them, the table jolts and flashes red, and the cards go grey. Game over: the cards are tossed down (in a melee
      from last place to first, the winner's last), light turns slowly behind the winner, and the result is stamped
      once they are down; Rematch and Continue playing when the game offers them, and View board, which closes it
      (Close and the "Show the result" chip did the same). Choices: titles are dealt from the bottom of the table,
      players' cards tossed from their seats. A minor overlay's Continue timer starts once it has played out. A
      board rescale no longer stills an overlay playing over it (`[data-rescaling]` skips `.overlay-root`), which had
      made a choice opened as the board settled appear without its animation.
- [x] **R224 The plot reveal is the overlay's (decided 2026-11-21)**: with overlays on, the board no longer turns the
      new plots over in their piles before the overlay: the overlay sees the reveal as the board draws it and claims
      the plots (`claimFlights` in `flip.js`), so the board leaves their move to it and they are hidden on the board
      from the first frame. Each comes out of its player's plot deck face down, is turned over on the table, and
      lands on the board. Plots waiting behind another overlay stay hidden until theirs plays. The card back lies on
      its side as a plot does (it had been an upright back stretched sideways). With overlays off, or a reveal already
      seen, the board turns them over as before.
- [x] **R225 Eliminated reads clearly, and a cleaner dev board (decided 2026-11-21)**: the eliminated overlay's line
      (how they went out, how many remain) sits on a dark pill, in white and red, rather than grey on the board. The
      dev board's panel picks Joust or Melee (and 3 to 6 players), and offers only that kind's scenarios, overlays and
      steps (titles and eliminating are melee's). Scenario, overlay (with play again), steps in a grid, then the view
      (board, long names, manual, spectate); it can move to either side, and remembers where and whether it is open.
      An overlay is played once its scenario has loaded: the board opens afresh on the scenario (for an overlay the
      scenario shows itself, without its start, end or question), waits until its images are in and its cards have
      stopped moving, then the overlay is brought about. Changing scenario opens the board afresh too, so a switch is
      not taken for a change in the game (joust to melee had played "Titles chosen"). A card that fades into an area
      while others travel had no position for the shift check (`flip.js`), which crashed the board on such a switch.
- [x] **R226 A choice put aside stays where it is (decided 2026-11-21)**: View board fades the choice away (its dim,
      heading, cards and Cancel) and takes it from the pointer, leaving its button where it was, now saying what is
      asked (the prompt's title, as "Select first player") to bring it back. It stays open while aside, so coming
      back fades it in without playing it again (it was taken down and a chip put at the top). Answered, from the
      choice or from the prompt, aside or not, it fades away rather than vanishing (`useShownChoice` keeps it for the
      fade). The dev board has an "Answer the prompt" step, clearing our prompt as the server would.
- [x] **R227 Cards are tossed in from the sides, evenly (decided 2026-11-21)**: every card an overlay tosses onto its
      table comes from off its left or right edge, a player's cards all from one side. Taken across the table (down
      it where they share a column), the first half come from the left and the rest from the right; one in the
      middle of an odd count comes from the left if it is in the upper half. So a 2×2 melee's left column comes from
      the left, a joust stacked on a phone has the top player from the left and the bottom from the right, and the
      title choice follows the same rule (it was dealt from the bottom). They had often all risen from below:
      overlays used `motionOff()`, which is also true while the board settles or rescales, so an overlay opening then
      lost its tosses (and its flights, and started its timers early). Overlays now follow only the motion setting.
- [x] **R228 "Board overlays", and experimental (decided 2026-11-21)**: what were "moments" are board overlays
      everywhere: the settings ("Show board overlays", "Close overlays after"), the code (`BoardOverlays.jsx`,
      `useOverlays`, `OverlayView`, `overlay-*` classes and keyframes, `data-board-overlay`, the `board-overlays:`
      session key) and the dev board ("Show an overlay…", `overlayExamples`). "Moments" read like replay
      highlights. "Animate the game board", "Show board overlays" and "Close overlays after" have a section of their
      own, "Board effects", tagged Experimental as a whole (they were in Game board). Experimental tags sit at the
      right end of their title's line (a tile's top right corner, a section's heading), so they never squeeze the
      title, which on a phone they had.
- [x] **R229 Cards and interface size apart (decided 2026-11-21)**: fitted, the adaptive board sized its cards to
      the room the prompt and stats left at the interface's size, so a larger interface drew smaller cards. The
      cards are now fitted as though the interface were normal (`adaptiveScales`), and the board scrolls for what a
      larger interface takes. `adaptiveScales` also says whether the cards' rows fit the board's height as drawn
      (`fits`, from `cardRoom`), and which size is to blame (`overflow`): the cards when they would not fit even beside
      a normal interface, otherwise the interface. Only the slider to blame shows its notice at its top (R246), for the size being tried. On a phone held upright the fit fills the height, so any interface
      above normal says so; on a desktop the cards stop at their cap with room to spare.
- [x] **R206 A chip's glow is not cut off (decided 2026-11-20)**: the chips' row is padded (and pulled back by as
      much) so a breathing chip at either end, or along its top and bottom, has room for its glow.
- [x] **R207 A pile with cards to choose breathes (decided 2026-11-20)**: on the board a pile whose cards can be
      chosen, while they are not on show, breathes with `ring-selectable` as a card to choose does (its top card
      does already when that is one of them). It counts for the edge hints (R156) like a card. A "Search the deck"
      fixture shows it.
- [x] **R208 Highlights scale with the cards (decided 2026-11-20)**: every `ring-*` (and the reveal's white flash)
      is drawn in units of `--card-scale`, so it keeps its weight on large cards and small piles alike, never under
      0.75px a unit. Rings around interface things (a sheet's chips, the edge hints' lines) use `--ring-scale: 1`.

From the review on 2026-11-20 (second batch):

- [x] **R219 The stats bar's buttons fill its height**: the game menu's buttons and the chat button are as tall as the
      desktop's bar (they were `h-7` in an `h-8` bar).
- [x] **R220 Spectators shows who is watching**: its button in the bar opens a list of the spectators (it only
      cleared the "changed" dot, the names being in its tooltip). The phone menu already lists them.
- [x] **R221 The desktop's prompt is a size up**: the floating prompt is drawn at 1.15 of the interface's size, and
      is as much wider, as it read smaller than the bars.
- [x] **R222 Smaller sizes by default, capped on a desktop (decided 2026-11-20: both boards)**: fitted cards fill 90%
      of the room they could and stop at 1.5 (they went to 2): the classic board's fit (`cardScale.js`) and the
      adaptive desktop's (`wide.fill`, `max`). The desktop interface starts a step down (0.9 on a 1600×950 screen),
      grows half as fast as the screen and stops at 1.15 (was 1.4), on both boards (`desktopInterfaceFit`). Phone
      layouts are unchanged. 1600×950 is now cards 1.2 / interface 0.9; 2560×1440 cards 1.5 / interface 1.1.
- [x] **R223 A card's order number pops with it**: the number on a card being ordered is on the card's surface, so it
      moves with the card when chosen rather than staying where the card was.
- [x] **R224 Naming a card works again**: beside the board (desktop, phone landscape) the lookup is drawn in the
      prompt itself; its panel was `position: fixed` inside the desktop prompt's transform, so it was a clipped
      sliver. In portrait the panel lies over our stats while open (it was under them, which took its taps), and is
      no longer zoomed twice.
- [ ] **R225 An empty bar at the bottom of the board**: a blank strip between the hand row and our stats bar.
      Not reproduced in the fixtures; on hold until it is narrowed down.
- [x] **R226 Manual mode's +/-**: on the adaptive board each stat has a small round − and + either side of it, the
      stats spaced apart (classic keeps its own).
- [x] **R227 Pillage flies the top card into the discard**: a card new to a discard pile flies from its owner's deck,
      turning over (both boards). A card uncovered under a pile's top only flies with it when the top card came too.
      A "Pillage" fixture step shows it.
- [x] **R228 Cards load behind a skeleton**: an opaque card-shaped placeholder (frame, art and text box, pulsing)
      until the image has loaded, rather than a see-through tint.
- [x] **R229 The desktop's bar is slimmer**: spectators (with their count), mute, settings, shortcuts, manual mode and
      report are icons; concede and leave keep their names. They are grouped (watching, tools, ways out) with a thin
      line between groups.
- [x] **R230 A desktop sheet can float (decided 2026-11-20)**: it has the phone's handle. Pulled off its edge it
      holds, giving a little, then comes away at 64px into a panel over the board, with a border and rounded corners
      all round. Dragged by its handle or header it moves; held within 72px of its edge, the edge lights up with
      "Release to dock", and let go it docks again. It glides between the two. Where a player's floating sheet was
      left is kept for when it next opens. Its cards take no hover while it is dragged.
- [x] **R231 Rows in a sheet hold at most 5 sideways cards (plots) or 10 upright ones**, however wide the screen.
- [x] **R232 The draw deck's View Hidden and Close and Shuffle** are amber pills in the sheet, as its chips are.
- [x] **R233 A pile's label fades in once a card has settled on it**: hidden while cards fly in (it was covered by
      the flying card, then appeared at once), then fading in over 450ms (desktop, where piles are labelled).
- [x] **R235 A floating sheet docks by touching its edge**: not when the pointer is near it. Once the sheet's own edge
      meets the board's edge it came from, where it would dock is outlined in amber (no text); let go there, it docks
      (supersedes R230's 72px zone and "Release to dock").
- [x] **R236 The desktop sheet's handle is taller and wider**, to take hold of with a mouse.
- [x] **R237 Card and Interface sizes always stack** in the profile and game settings, each with the full width.
- [x] **R238 An opponent's hand is as wide as ours on a desktop**: it is only squeezed to fit on phone layouts.
- [x] **R239 An opponent's hand fans as they would hold it**: across the table the fan is turned to face them (outer
      cards higher, leaning the other way; the overlap stays as the hand's, R242), centred on their hand as far as it fits, and the
      dimming covers their board only (strips and play area, as far as can be seen).
- [x] **R240 Interface sizes in a narrow range**: the desktop bar's actions were 12px text and icons beside a 16px
      name. Now icons in the bars, tools and sheet headers are 16px, the bar's named buttons 14px, chips and pills
      12px (11px on phones' sheet chips), small uppercase labels (phase roll, prompt title, options toggle, log skip)
      at least 11px, and badges 10px.
- [x] **R241 A sheet's width eases too**: going from pile to pile it grows or shrinks to the new width over 200ms, as
      its height does (not in phone landscape's single row). Supersedes the review's note that only the height eases.
- [x] **R242 The fan overlaps as the hand does**: each card over the one before it, as in the strip (R239 had
      reversed it).
- [x] **R243 A floating sheet is no taller than its player's board** (as far as it can be seen), its cards sized to
      that.
- [x] **R244 A desktop sheet keeps its place, by seat**: docked, it slides along its edge when its handle or header is
      dragged sideways; floating, it stays where it was left. Both are kept in the browser (`sheet-place-<seat>`,
      the seat being the pile's popup id, as the classic board keeps its panels), docked as where its middle lies across the board so
      it holds as the screen changes. A floating sheet docks below or above where it floats, the outline showing
      where, and keeps that place docked.
- [x] **R245 Drawing several cards no longer jerks the hand (both boards)**: a card still in the air when the next
      arrived was left out of that update, so when the hand closed up (from the sixth card) its flying copy carried on
      to its old place and the card jumped there on landing (about 60px). A card's copy also stayed for its landing
      glow after the flight was counted as over, so the hidden card moved in the next update while the copy stood
      still, and jumped when the copy went. Now a card counts as in the air until its copy is gone, and a card whose
      place moves while in the air is steered to the new place for the rest of its flight (or over 200ms once landed).
      Sampled each frame while drawing 7 (desktop and portrait, the "Draw 7" fixture step): no card jumps after it
      lands.
- [x] **R246 The size notice says it is the height**: the board can always scroll sideways for a long row, so the
      notice is about the rows: "Card rows may not fit the height of the screen, so the board would scroll up
      and down. Lower this size to avoid it."
- [x] **R247 The melee view toggle says its mode**: the four-way arrows (manual) did not say what they did. The
      toggle is now a small pill with the camera and a word: "Auto" (sky) while it follows the action, "Free"
      (amber) while you move the view yourself.
- [x] **R248 (superseded by R251) The melee tools no longer cover the stats in the bottom-right corner (2026-11-21)**: a bottom board's
      stats bar left room for our tools at its end, but a board running on past the view had that end off-screen, so
      the tools pinned to the view's corner covered its name, power and gold. Each seat bar (not in portrait, R250) now keeps to the part of
      its board in view (--seat-view-width, set as the board scrolls or resizes), and the room for the tools no longer
      shrinks (its stats scroll inside the bar instead). Lengths on the bar are divided by --ui-scale, as it is zoomed.
      Only with a sliver of a board in view (under ~120px) does its avatar still sit under the tools.
- [x] **R249 A melee table's stats bars are the joust's (2026-11-21)**: one EdgeStatsBar draws the stats along the top
      or bottom of the board at either table (not on phones). Melee's were padded taller with the avatar centred; now
      they are the joust's slim band, the avatar standing proud of it towards the board, and still stick to their
      board's edge and are tinted while waited on. Our tools at a melee table (not portrait) lie on the band in the
      view's corner as the joust bar's do (Auto / Free, the menu, the chat outermost) rather than in a box.
- [x] **R250 Portrait melee stats slide off the screen, under fading tools (2026-11-21)**: R248 made each seat's
      stats keep to the part of its board in view, but in portrait they are a card fitted to its width, so it shrank as
      its board scrolled away. Portrait keeps the full width again, so the card slides off whole. The tools pinned to the
      corner lie over a card passing under them on a near-black box whose left side fades out (no border), so a stat
      half under it fades rather than being cut.
- [x] **R251 One stats bar for every layout but the sideways phone, sticking by CSS alone (2026-11-21)**: phones
      held upright now have the desktop's bars (EdgeStatsBar) at both tables, running to the screen's edges; the
      sideways phone keeps its stats cards over the cards. At a melee table the band runs its board's width and the stats
      in it are only as wide as they are, sticking to the view's left (position: sticky) until their board's end takes
      them off, as the sideways phone's cards do. This replaces R248's widths set on every scroll, which lagged behind
      the scrolling and left the bar a little off screen. Our tools lie on the band in the corner in every melee layout
      (but sideways), on a black box whose left side fades out hard over 20px (R250's softer, see-through fade is gone),
      so stats passing under it fade into it; along the bottom the stats keep clear of the tools (max width).
- [x] **R252 Many spectators, on any screen (2026-11-21)**: the game menu's "Spectators: N" row (phones, and desktop
      melee, where the bar has no spectators button) named everyone on one truncated line, with no way to see the rest.
      It now says "Ann, Bob and 38 more" with a chevron, and opens a sheet (rising from the bottom on a phone, centred on
      a larger screen) listing everyone, scrolling inside it, with a search from 10 spectators and a Mute / Un-mute for
      players. The desktop bar's popover uses the same list (and search). Its names had been squashed to nothing once
      the list was long enough to scroll (truncate let them shrink). The dev board's Crowd toggle (&crowd=1) adds 60.
- [x] **R253 The waited-on tint reaches the strip and our hand (2026-11-21)**: a melee board is tinted sky while its
      player is waited on, but the strip (plots, agenda, hand, piles) and our hand tray lay 40% black over it, which all
      but hid it there. They now lay the same tint again over their darkness (a background image above their colour),
      so they stay as much darker than the play area as when the board is not tinted.
- [x] **R254 No blue buttons on the adaptive board (2026-11-21)**: the card, trait and value lookups (shared with the
      classic board) had a blue Done; on the adaptive board it is now the prompt's amber option (chipClass, moved to its
      own module so the shared lookups can use it without importing the prompt bar). Every other button on the board was
      already amber, grey or neutral; CardPile's blue actions are only for the classic board's popups. The dev board
      seeds the card list from its scenario, so "Name a card" shows its lookup rather than "Loading cards…".
- [x] **R255 The phone chat stops above the joust bar again (2026-11-22)**: since R251 put our tools in the portrait joust
      bar, nothing was marked as our tools, so the open chat ran to the bottom of the screen over the bar and its Hide
      chat button. The bar is marked as the tools (data-region), so the chat stops above it.
- [ ] **R256 Review (2026-11-22): desktop keeps classic mechanics.** A review of the overhaul found desktop had drifted
      from classic. R257–R270 are the decisions from it; each applies the rule at the top of this file.
- [ ] **R257 One chat order everywhere**: drop the phone's newest-first order (`newestFirst`). Fix the keyboard
      covering the newest messages instead: normal order, input at the bottom, the chat shrinking above the keyboard
      (`--visual-height`).
- [ ] **R258 Keep the phase wheel**: it replaces the phase label (adding, not taking away) and shows the phase order
      to newer players. Names cut off at its edges are intended: it is a wheel that turns through the phases.
- [x] **R259 The game log on the phase wheel shows while the chat is closed**, in any layout, and hides while it is
      open. Its pace stays as it is, but its timings are gathered as named constants in one place, easy to tune: how
      long a line shows on its own and with others queued behind it, the longest a line stays, how fast a long line
      scrolls with and without a queue, the pauses at its ends, and the fade. Done: logTiming in useLogFeed.js;
      the prompt bar turns the feed off (showLog) while the chat is open, so lines from then are not shown later.
- [ ] **R260 Fewer options**: the prompt side (classic's side), the overlay timer and the fixed-size mode go. Cards
      always fit the screen and the sliders scale the fit; card and interface sizes and animations stay. A fixed
      size (the legacy `cardSize`, or `auto: false`) is converted when settings are next saved: the slider becomes
      the old size divided by the fit for the screen and board saved from, so the cards look the same. Until then the
      board still draws the fixed size, hidden from the settings.
- [ ] **R261 Appearance lives in the profile only**: the in-game settings keep gameplay options (prompting, keywords
      and the like) and drop the appearance ones, on both boards (decided 2026-11-23).
- [ ] **R262 Overlays name players by name and avatar**, as the rest of the site does, not by deck. The start and the
      end of the game keep their cards.
- [x] **R263 Phone prompt buttons are never covered**: with many choices the stats bar covered the top row, and a tap
      there opened the game menu. Done: our tools row sits at z-306, above the docked prompt (z-260); while its options
      are spilled out the dock rises to z-320, as it does with the more panel open, so every option is on top.
- [ ] **R264 No choice overlays, for now**: they duplicate the prompt. They came from melee title selection on phones,
      where the card art matters and buttons hide it; a better phone solution is for later.
- [ ] **R265 The desktop prompt is classic's**: back in classic's position, with its shortcut numbers.
- [ ] **R266 Desktop piles are separate**: each opens on its own, several at once, as on classic, in the new visual
      style. Phones keep their current drawers (sheets). Part of this batch (decided 2026-11-23).
- [ ] **R267 Avatars match the site's**.
- [x] **R268 Performance belongs elsewhere**: master's state diffs (#3838, applied inside immer) keep unchanged state's
      identity, so `reuseUnchanged` goes. The image cache (`imageCache.js`, `useImagePreload`) goes too: images are
      served by the infrastructure, not this code. Done: reuseUnchanged went with master's diffs; imageCache.js, useImagePreload and
      their spec are removed. cardImageSrc has its own module (cardImageSrc.js), and CardFace keeps its image's state
      itself, showing an image the browser already has at once.
- [ ] **R269 PlaceCardUnderneath (paused)**: the direct `removeCardFromPile`/`addChildCard` calls in its handler, and
      in the drop command's agenda drop, are master's code. This branch only added two checks and the `LeavePlay`
      wrapping for a card from play, used by manual drag and drop alone. Revisit once the reviewer says which rule.
- [x] **R270 Every action shows it is being processed (adaptive board, 2026-11-23)**: an action the board sends is
      marked pending (pendingActions.js) until the game server answers a ping sent right after it: the server handles a
      socket's messages in order, sending any new state first, so the answer means the action is done even when it
      changed nothing (no server change). What it acted on pulses darker from 150ms, so a quick answer shows
      nothing: the card, the prompt's button (or its lookup), a pile's action, a stat's +/-, the bar's menu buttons.
      A card only pulses when the server says a click does something (it can be chosen, or it is the player's and
      can be used or played; any card in manual mode), and a click that does nothing is sent quietly, not waited on
      at all. A repeat of a pending action is not sent. A hand card used on a phone stays raised until answered. No
      popup: steady lag shows only the pulse. After 8s "Waiting for server…" with a spinner shows in the prompt bar:
      beside the board its own row grows in above the prompt; in the phone's docked bar it cross-fades with the
      title line so the bar keeps its height. At 15s a Reload button widens in beside it. The timings are in pendingTiming. The dev
      board's Lag (&lag=, up to 20s) pretends the server takes that long.
- [ ] **R271 A skeleton for each card type**: while a card's image loads, its placeholder follows that type's
      template (character, location, attachment, event, plot, agenda, faction, title), drawn from the real card
      layouts. The board's cards carry their type; elsewhere it comes from the card list, and the plain skeleton
      stays when the type is not known.
- [x] **R234 Tokens are in the middle of the card again, and their changes stand out**: the +x / −x that floats off a
      counter is a larger bold pill, green or red, and stays a little longer (both boards).

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

| File                          | Role                                                                                         |
| ----------------------------- | -------------------------------------------------------------------------------------------- |
| `AdaptiveGameBoardLayout.jsx` | Lays out joust and melee for the current mode; `StatsCard`, `FitRow` and the tool box        |
| `useBoardLayout.js`           | Watches the board area and returns the mode and scales; sets `data-layout`                   |
| `adaptiveScale.js`            | Pure functions: mode classification (with hysteresis) and per-mode scale fitting             |
| `PileCluster.jsx`             | Deck, discard, dead, shadows and out of game as a compact cluster                            |
| `PlotFactionStack.jsx`        | Plots, faction, agenda and title as a stack                                                  |
| `HandTray.jsx`, `HandFan.jsx` | Our hand (portrait's row below our board), and a hand of backs fanned over a board           |
| `ShadowsZone.jsx`             | Our shadows beside the hand                                                                  |
| `Reveal.jsx`                  | Fades a part in and out                                                                      |
| `PlayerStatsBar.jsx`          | A player's avatar and stats, as a bar or a stack                                             |
| `PromptBar.jsx`               | The prompt: phase track, text, option chips; modes `panel` and `dock` (R178)                 |
| `PhaseRoll.jsx`, `useLogFeed` | The phase track and the latest game-log lines shown in it                                    |
| `ScrollArea.jsx`              | The board's scroll view, with its edge hints (R157, R165)                                    |
| `BoardSheet.jsx`              | A pile's part in its player's sheet: portals its cards into it                               |
| `SheetHost.jsx`               | Draws each player's sheet over their board (R175)                                            |
| `sheetStore.js`               | One sheet per player, their open pile, and the piles offered as chips                        |
| `GameMenu.jsx`                | Status, settings, spectators, manual mode, report, shortcuts, concede and leave              |
| `FullscreenToggle.jsx`        | Full screen on and off                                                                       |
| `useAutoFollow.js`            | Scrolls the melee table to the board to show, and handles pausing and resuming               |
| `followTarget.js`             | Pure: the follow target from the players' state (active prompt, our selectable cards)        |
| `useAdaptivePage.js`          | Page-level settings while the board shows: `viewport-fit=cover`, no overscroll, the keyboard |

Outside `Adaptive/`: `client/boardLayoutStore.js` (the current mode, for the navbar) and `client/dev/`
(the fixture page, development only).

Changes to shared components follow one rule: **add an optional prop or context whose default is the
classic behaviour.** That leaves the classic board unchanged. The planned shared changes are:

- [x] Extract a `usePromptActions` hook from `ActivePlayerPrompt`, covering the fresh-press guard, the
      Google form link, `pausesTimer`, keyboard shortcuts, lookups and the response-delay text.
      `ActivePlayerPrompt` must behave exactly as before.
- [x] Add a `PopupHostContext` (`'panel'` by default, `'sheet'` on the adaptive board). `CardPile`'s
      popup and `Card`'s underneath popup render through a `PopupContainer` that picks
      `MovablePanel` or `BoardSheet`.
- [x] `PlayerBoard`: add an optional `overflow` prop (`'grow'` by default, as today, or
      `'squish-then-scroll'`).
- [x] `SquishableCardPanel`: add an optional `fitWidth` that squishes to the width available instead
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
2. Scroll: the whole board scrolls as one, both ways, with a lit edge wherever there is more (R150, R157).
   Cards never overlap. Characters keep to one row and locations to
   another, except in phone landscape, where they share one line (R125). The page never scrolls.

## Layouts

### `narrow` (portrait)

```
┌───────────────────────────┐
│ [opponent stats card]     │  screen bar (outside the scroll)
│ opponent strip            │ ┐
│ opponent locations        │ │
│ opponent characters       │ │ the board, scrolling as one, both ways (R150)
│ ───────────────────────── │ │
│ our characters            │ │
│ our locations             │ │
│ our strip                 │ │
│ hand · shadows            │ ┘ (R153)
│ [our stats card] [tools]  │  screen bar
│ phase track · prompt      │  docked prompt, fixed height (R162, R178)
└───────────────────────────┘
```

- The prompt's options spill up over the board when they need more than one line, and draw back with a tap.
- Piles open in their player's sheet, sliding from the board's outer edge (R175).

### `short` (phone landscape)

```
┌────────┬──────────────────────────────────┐
│ [their │ opponent strip                   │
│ stats] │ opponent locations · characters  │  the board scrolls under the column;
│ PROMPT │ ──────────────────────────────── │  its cards stick beside it (R166, R184)
│ [tools]│ our characters · locations       │
│ [our   │ our strip (hand included)        │
│ stats] │                                  │
└────────┴──────────────────────────────────┘
```

- The column is on the left or right (the HUD's prompt side). Characters and locations share one row (R125).
- The site navbar is hidden during a game.

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
- **Tools:** pinned in the view's bottom corner beside our stats (R171); in the column in phone landscape.
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
  Piles open in sheets, as on phones (R175).

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
- [x] `sheetStore`: one sheet at a time (superseded by R175). Opening one closes the last, and the header has tabs for up to
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
- [x] Acceptance: everything classic `PlayerStats` and the in-game navbar can do is reachable.
      **Checked:** settings, shortcuts, mute, manual mode, report, concede, leave, and the stat
      changes. The navbar's spectator list and the game server's connection status are in the game menu
      (R15).
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
- [x] The table: classic's two-row grid in seat order, scrolling as one (R150, R155), on every layout. Each player's stats bar is on their own board; our tools are pinned in the view's bottom corner (R171); the room for the desktop's prompt is a column at the table's sides, which the end boards reach into (R170).
- [x] Each player's seat number is a badge on their stats-bar avatar, at the top left, so it and the "1st"
      badge (bottom right) can show together (from review, 2026-11-18).
- [x] Seat order matches the classic melee grid's clockwise order (`seatOrder.js`, shared with classic). Share or extract the ordering, and
      don't copy it.
- [x] `followTarget.js` with a spec covering our prompt with selectable cards on one or several
      boards, another player's active prompt, no target, and selectable cards only on our board.
- [x] `useAutoFollow`:
    - [x] Scrolls the table to the target's board, and again as that board changes size.
    - [x] Pauses when the table is scrolled by hand (a wheel, a swipe or the keys).
    - [x] Resumes when the active prompt moves to a different player.
    - [x] Waits while a card is carried or zoomed. A sheet lies over the table, so scrolling behind it does no harm.
- [x] Auto-follow control: a view-mode button among our tools shows "directed" (following) or "manual" and switches between them (R161). It was also a HUD setting, `followAction`, until R197.
- [x] Spectator arrangement: the watched player sits at the bottom left, as we do, and the table follows the action.
- [x] Fixtures: melee with 3, 4 and 6 players, with an active prompt on an opponent, and with our
      prompt targeting cards on two opponents' boards.
- [x] Acceptance (checked on the dev board, 2026-11-18: every melee fixture, 3 to 6 players, each layout, the prompt on either side; sheets on every board): at every reference size, melee with 3 to 6 players never scrolls the page. Every
      player's board can be reached by scrolling, auto-follow behaves as in the Layouts section (Melee), and
      dragging, flights and sheets work wherever the table is scrolled.
- [x] Remove the fallback to the classic board for melee.

## Checks each phase

- `npm test` for the client specs we touched (run vitest from `C:\`, not `c:\`).
- `npm run board:shots` with the dev server running. Read the report: for the adaptive board, "no
  scrolling" and no CLIPPED regions except where a phase still has open items. Look at the images for
  every size.
- A manual check at every reference size and orientation, by switching between classic and adaptive
  mid-game.
- Re-read this file and tick off or flag every item in the phase.

## Review (2026-11-20)

A review of the whole branch against `master`, and of this plan. Done without the user, so the assumptions are
listed for them to check.

**Changed in the review**

- `FitRow` (stats cards) made a new `ResizeObserver` and read the layout on every render, i.e. every game update for
  every stats card. It now observes once and re-measures on resize or the board's rescale event.
- `GameMenu` drew its hidden row of buttons to measure even where it has no room for any (every layout but
  desktop joust). It now only does so when given room.
- Removed an unused export (`layoutModes`) and `export` from 16 names only used in their own files; the sheet's
  slide time is defined once (`sheetStore.slideTime`); a duplicated `place()` effect in `SheetHost` removed.
- Slimmed the long comments (the 4+ line blocks, and the verbose ones in `PromptBar` and
  `AdaptiveGameBoardLayout`), and fixed comments left stale by R171 (where the chat button and tools are).
- Phone landscape's column uses `tools()` (mirrored so the menu is against the screen's edge) rather than its own
  copy of the tool box.
- `ScrollArea`'s `useChoicesPast` re-checks only when a card gains or loses `ring-selectable` (or cards are added
  or removed), not on every class change on the board.
- This plan: the status line, "Rules that hold", the Files table (it listed files never made, such as
  `Scoreboard.jsx` and `DropTray.jsx`, and missed `SheetHost`, `ScrollArea` and others), the overflow order, the
  portrait and phone landscape sketches, and the melee and desktop notes now match the board as built.

**Assumptions to check**

- Sheet width is not animated when switching piles: only the height eases. Easing the width too would mean
  measuring the cards' natural width, which fights phone landscape's single scrolling row. Say if you want it.
- The height also eases when the open pile's own cards change (a card added or taken), not only on a switch.
- Comments were slimmed to what is not obvious from the code. Ones I judged still useful at 1–2 lines were kept.
- The R-items (R1–R185) are kept as the record. Most are ticked; they could move to an archive file to shorten
  this plan, which I didn't do without asking.

**Noticed, not changed**

- Server: `DropCommand.promptPlotPlacement` moves the plot with `player.moveCard`, a legacy helper the engine
  guide asks not to add uses of (manual-mode drops already use it). `pendingAttachments` is cleared each round
  as a backstop for a prompt that ends without select or cancel.
- R14, R75 and R77 were checked on the phone and resolved (2026-11-20); every R-item is now closed. Still open:
  the checks that need a real phone or game (performance, plot reveal
  and redeal flights, first-player selection).

## Open questions

- None yet. Add questions here as they come up, and move them to Decisions once answered.
