# Engine status

Updated 2026-10-24 so the next session can continue without the previous conversation. The plan is
[engine-roadmap.md](engine-roadmap.md). The rules map is
[framework-coverage.md](framework-coverage.md). Read both before changing `server/game`.

The card conversions are committed on `feature/engine-test-framework` through `ab6d2a14d`.
Engine follow-ups are committed through `b774443b3` (`f3131201e` and
`b774443b3`). Do not push or open a pull request unless asked.

Last full run, 2026-10-24: `npm test` from the repo root. 2,201 files passed,
7,107 tests passed, 13 skipped. That run covers `f3131201e`; the later follow-up in `b774443b3`
has passed ESLint and `git diff --check` but has not had a test run.
Do not pipe vitest through `grep` or `tail`. On PowerShell, chain with `; if ($LASTEXITCODE -eq 0)`.

## Where the work is

The goal is a game that can start with manual mode off. A game already does that when every card in
both decks is verified. The phase 6 gate is not met, so that is not yet the default we trust. The
roadmap now records that existing behaviour separately from the framework readiness gate.
Do not add a hold. `ManualMode.decideAtStart` already turns manual mode off for a verified deck.

All 1,962 implemented card codes are verified. The 24 October engine follow-up migrates the
remaining generic card callbacks and end-timing effects, removes the permissive ability-handler
fallback, enforces plot-choice dependencies, and batches strength changes. The wider framework
gaps below remain separate from per-card verification.

## Done, with specs

- Setup chooses the first player, then announces factions and agendas in first-player order.
  [Setup.spec.js](../test/server/gamesteps/Setup.spec.js). Round 1 still chooses a first player:
  the plot phase clears the setup choice before plots are revealed.
- Melee titles stay out of play until every player has chosen, then enter together in one
  `onTitlesEnteredPlay`. [ChooseTitle.spec.js](../test/server/gamesteps/ChooseTitle.spec.js).
  `player.title` is `undefined` until that event. A three-player test needs `noTitleSetAside`.
- Targets are snapshotted before costs. An ability with a snapshot and no remaining legal target
  resolves unsuccessfully: costs stay paid, the limit increments, the event is discarded, the
  handler does not run. Choosing zero of "any number" is that unsuccessful path, not a cancel.
  A prevented cost ends initiation: the card is not played and the limit does not increment.
  [AbilityResolution.spec.js](../test/server/gamesteps/AbilityResolution.spec.js).
- Interrupt order is cancel, duplicate saves, "would", forced, then other interrupts
  [InterruptOrder.spec.js](../test/server/gamesteps/InterruptOrder.spec.js). Saves and cancels
  use `canCancel: true`. Any other interrupt whose trigger says "would" declares `would: true`;
  the engine does not read card text for this.
  [wouldInterrupts.spec.js](../test/server/tools/wouldInterrupts.spec.js) checks each
  declaration against the card text.
- Marshaling is an action window. The active player marshals on their turn. With strict windows
  on, every other player is offered an action in player order. With strict windows off, a player
  who has not set the marshaling window as a stop is skipped.
  [MarshalingWindow.spec.js](../test/server/gamesteps/MarshalingWindow.spec.js). Each active
  player has their own window, the first player acts first in it, and it closes only after every
  player has passed in a row (Appendix I, 3.2): marshaling a card is an action, so it rotates
  the order like any other.
- An action is refused with reason `window`, whether or not strict windows are on, while a window
  is open and it is not that player's turn, and during marshaling except on that player's turn.
  When strict windows are off, no window is open, and the phase is not marshaling, actions are
  still allowed. That is what lets `setupTest` play events while a challenge is being declared.
- A lasting effect with no condition keeps the cards eligible when it was created. A card that
  stops matching keeps the effect. An effect with a condition can gain a card that starts matching
  (Calm Over Westeros follows the attacker's current plot; Winter Is Coming does not). An "until
  the end of X" effect created after X has ended does nothing. End-of-phase expiry happens before
  reactions. Losing all traits removes traits for the duration, including ones added during it,
  and they return when the effect ends. Immunity to an opponent's event stops an effect that names
  no game action. [LastingEffects.spec.js](../test/server/gamesteps/LastingEffects.spec.js).
- Simultaneous resolution (FAQ 1.6). Delayed effects or state checks that would resolve at the
  same time go through `ChooseResolutionOrder`: the first player picks which resolves next,
  whoever controls them, and an effect that can no longer do anything is dropped.
  [SimultaneousResolution.spec.js](../test/server/gamesteps/SimultaneousResolution.spec.js). Set
  values are not a conflict: the most recent set modifier wins (Rules Reference: Modifiers), which
  `CardStat` already does. Take-control effects are not a conflict either: the FAQ entry Multiple
  "Take Control" Effects says control follows the most recent one and reverts to the next most
  recent when it ends, which is what `controllerStack` does.
  [MultipleTakeControl.spec.js](../test/server/gamesteps/MultipleTakeControl.spec.js).
  All end-timing card callbacks now use `GameActions.delayedEffect`, including both Meereen
  printings. Titles identify pending instructions, and grouped card actions from one delayed
  instruction resolve simultaneously.
- "If X leaves play" clauses after an ability (Jaqen H'ghar, Arya Stark (LMHR), Hornvale, The
  Great Pyramid) are delayed effects with `duration: 'untilTriggered'`, created by each resolution
  and acting only on what it placed (Rules Reference: Delayed Effects). They are not triggered
  abilities, so blanking the card does not stop them. Two pending from the same card resolve in
  the order the first player chooses.
  [DelayedEffects.spec.js](../test/server/DelayedEffects.spec.js).
- Constant text that applies an effect when an event occurs ("If you win this challenge, gain 1
  power") is an event check (`this.eventCheck`). It resolves with delayed effects, after the event
  and before reactions, while its card is active, faceup and not blank.
  [EventChecks.spec.js](../test/server/EventChecks.spec.js).
- The Rains of Castamere's Schemes are left out of the recycle check in every phase, so used plots
  return as soon as the last non-Scheme plot is revealed (FAQ). Before, a Rains player who revealed
  their last non-Scheme plot outside the plot phase had no plot to choose at the next plot phase.
- Every catalogued event is raised and specced:
  [CataloguedEvents.spec.js](../test/server/gamesteps/CataloguedEvents.spec.js),
  [Duplicates.spec.js](../test/server/gamesteps/Duplicates.spec.js). A duplicate marshaled or
  ambushed goes through the `PutIntoPlay` event, token costs go through `GameActions.discardToken`,
  and `DrawSpecific` draws only what the draw limit allows and reports `amount`.
- Mandatory prompts cannot be skipped with manual mode off: the reserve discard, standing
  restrictions (Stannis Baratheon), military claim, and `GameActions.chooseCards`, which also asks
  players in first-player order. With manual mode on, Done with nothing selected still skips them.
  [ReserveCheck.spec.js](../test/server/gamesteps/ReserveCheck.spec.js),
  [StandingRestrictions.spec.js](../test/server/gamesteps/StandingRestrictions.spec.js).
- Terminal conditions (FAQ 3.1). The card pool has two: burn and state checks. Both refuse saves
  up front. The "if still in play" effects are one-off delayed effects, not terminal conditions,
  so they can be saved from. A new terminal condition whose save could remedy it would need its
  own check, as Risen from the Sea has for burn.
- A burn kill cannot be saved (FAQ 3.1: a save that would not remedy the 0 STR cannot be
  initiated), so Bodyguard and duplicates are not offered.
  [Burn.spec.js](../test/server/gamesteps/Burn.spec.js). Risen from the Sea is the exception: it
  is offered when its +1 STR would take the character above 0: it saves with
  `GameActions.saveCard({ event, remediesBurn: true })` and attaches in the same window, so the
  burn isn't checked again before its +1 STR applies.
  A two-kill version (saveable kill, then an unsaveable one) was tried and removed: it offered
  saves that cost the player a card and then killed the character anyway.
- "If X, Y" text with no trigger is a state check (`this.stateCheck`, `server/game/StateChecks.js`).
  `refreshGameState` checks it after every event and resolves its game action while the
  condition holds. It is off while the card is blank or facedown and during setup, and it is not a
  triggered ability, so it cannot be cancelled. A kill no save could remedy passes
  `allowSave: false` (Gyles Rosby, FAQ 3.1).
  [StateChecks.spec.js](../test/server/gamesteps/StateChecks.spec.js). Esgred, Reek, Arry, Arstan
  Whitebeard, Oathsworn Wildling, Gyles Rosby, Ser Jorah Mormont (Core) and Harrenhal (TTWDFL) use
  it.
- "After all agendas are announced" is `this.afterAgendasAnnounced`
  (`server/game/AgendaSetupAbility.js`), resolved by the setup phase before setup hands are drawn,
  through the simultaneous-resolution order prompt. The House With the Red Door, The Prince
  that was Promised, and Armed to the Teeth use it. Only setup placements
  (`playingType: 'setup'`, including dragging a card into play during setup) enter play facedown,
  and a mulligan only shuffles the hand back, so cards put into play before it stay.
  [Setup.spec.js](../test/server/gamesteps/Setup.spec.js).
- Military claim only prompts for characters that can be killed. A loser with none is not
  prompted, and characters that must be chosen for claim (Joffrey's Crossbow) are chosen
  automatically when there are no other characters left to choose.
  [Claim.spec.js](../test/server/gamesteps/Claim.spec.js).
- The `this-in-ability` card-rules check (`test/tools/card-rules.js`) flags `this` inside an arrow
  function in a card. Abilities use `context.source`, `context.player` and `context.game`.
  Persistent effects that build matchers (`canPlay`, `canMarshal`, `canMarshalIntoShadows`,
  `canAmbush`, `dynamicKeywordSources`, `immuneTo`, `canSelectAsFirstPlayer`) pass the effect
  context to the card predicate. [EffectContext.spec.js](../test/server/effects/EffectContext.spec.js).
- `toBeReadyToTakeAction` passes in the challenges phase when the player has the
  "Initiate an action" window open during a challenge, as well as the phase's idle prompt.
  [matchers.spec.js](../test/server/helpers/matchers.spec.js).
- Scenario games (`SCENARIO` and `SCENARIO_USERS` on the game node) send `scenario: true` in the
  game state and summary, and the client navigates the players to `/play` for them.
  [scenarioRunner.spec.js](../test/server/devtools/scenarioRunner.spec.js).
- Alayne Stone is a state check. Ruling (2026-10-21): duplicates are in play and can have tokens,
  so becoming Sansa's duplicate does not leave play. `PlaceAsDuplicate` moves a card that is in
  play without leave-play events (`onCardPlacedAsDuplicate`), keeping its power and tokens, and
  the attachment validity check discards its attachments.
  [AlayneStone.spec.js](../test/server/cards/23-AHaH/AlayneStone.spec.js).
- Claim, taxation, and pile order were already done:
  [Claim.spec.js](../test/server/gamesteps/Claim.spec.js),
  [TaxationPhase.spec.js](../test/server/gamesteps/TaxationPhase.spec.js),
  [PileOrder.spec.js](../test/server/gamesteps/PileOrder.spec.js).

The coverage list exists and is the phase 6 checkbox for that item. Its open rows are the
remaining framework gaps.

## Engine follow-up, 24 October 2026

- Removal, dead-pile placement, and variable gold-token costs use game actions.
- Stealth, assault, intimidate, and duplicate saves no longer use ability handlers. Deferred
  initiation actions preserve challenge-redirection timing.
- Ability handlers and function choices are rejected. Explicit test callback actions require a
  predicate. The card checker rejects `genericHandler`, closing a gap in the earlier check.
- All old end-timing card effects and expiry helpers are removed. Delayed effects resolve in
  first-player order and expire when the affected card leaves play.
- Bloodraven enforces opponent-first plot selection and immutable choices. Independent choices,
  dependency chains, and cycles are covered by `PlotSelectionOrder.spec.js` and
  `PlotSelectionDependencies.spec.js`.
- Strength notifications are batched across simultaneous effect changes and plot replacement.
  Set-strength expiry checks burn, overlapping burn sources remain independent, and strength
  sorting/reverse cancellation are removed. See `SimultaneousStrength.spec.js`.

## What is left

The phase 6 framework gate remains open. Card verification is complete; the remaining work is:

1. Validate the client explanations now added for card actions, standard plays, and matching
   responses that could not resolve. Readable reasons appear in menus and under the card's hover
   preview, including with manual mode off. Self-evident reasons (window, phase, location,
   player, trigger, blank, facedown) are not shown, and failed responses are shown only during
   the phase they happened in. This UI follow-up has not had a new test run.
2. Add the optional-loop shortcut from phase 4: when a player repeats an optional ability in a
   loop, let them name a number of repetitions and resolve them at once. State-change
   conversions, icon and control registrations, and settling effects until nothing changes are
   done.
3. Finish translation-ready logs (phase 3) and exact problem-report restoration (phase 6). Problem
   reports now persist in PostgreSQL and the scenario runner rebuilds the board, the phase and
   a challenge in progress ([ChallengeRestore.spec.js](../test/server/devtools/ChallengeRestore.spec.js));
   restoring an arbitrary open prompt remains open.
   Per-format coverage reporting is implemented in this follow-up, pending validation.
4. Complete the strict-window trial and gather feedback before changing the default.

These decisions remain in force:

- Strict action windows stay behind the game option. Do not flip the default before the
  auto-pass trial has had feedback.
- Full refusal of actions when no window is open, outside marshaling, waits until strict windows
  are the default.
- Do not add a hold that stops verified decks starting with manual mode off.
- Manual corrections (`changeStat`, `/power`, `/token`) stay plain corrections and raise no events.
- Ask before implementing a rules reading that is not already decided.

## Follow-up after the engine commit

- Gold payment, transfer, and treasury-return compatibility helpers now delegate to actions.
  Payment retains its playing type and active player when selecting gold sources.
- Power gains now name the action explicitly; the previous helper already delegated indirectly.
- Visible card actions expose unmet requirements only to players allowed to use those actions.
  Hidden-card summaries and spectator summaries do not include this information.
- The client translates the reason codes into readable text and exposes it in manual mode off
  through a separate information tooltip, without restoring manual controls.
- Card entry, attachments, saves, setup completion, round resets, plot recycling, first-player
  selection, and melee title transitions now use action handlers. See the state-change inventory.
- Keyword values are computed on query; dominance modifiers are registered by effect. Snapshots
  copy dominance registrations and keyword trigger modifiers.
- Standard plays expose relevant failure reasons. Matching triggered responses that cannot
  resolve record private diagnostics, labeled with their original round and phase.
- `npm run spec:coverage -- --formats` reports active format/variant pools; `--formats --json`
  includes missing card codes. Legality compilation is shared with `CardService`.
- Game messages, alerts, and lobby chat now retain safe structured templates and display argument
  snapshots beside the legacy rendered fragments. This prepares the log boundary for localization;
  locale catalogs and a translating renderer remain outstanding. This follow-up has not been tested.
- Strict action windows now auto-advance after the response delay when a player has an unused action
  on a public card. The card remains clickable during the wait. This is still opt-in and needs real
  game feedback before any default change; this follow-up has not been tested.

## Do not reapply

These were tried and reverted, or left alone on purpose.

- `canCancel: false` on pile-order prompts. Done with nothing selected still cancels, and the
  cards use the default order. Setting it false broke about 24 tests.
- Deleting `server/game/gamesteps/marshaling/MarshalCardsPrompt.js`. The window is a separate step.
- A lasting effect on a player stays with that player when its source changes control (Rules
  Reference: Lasting Effects).
  [LastingEffectPlayerTarget.spec.js](../test/server/gamesteps/LastingEffectPlayerTarget.spec.js).
  Meereen names the player who used it and returns only cards that player owns, which is the
  ruling its spec cites.
- Replacing Filler Plot with A Noble Cause as the default plot. House Maester filler stays 20
  copies of `03041`. At the Gates draw-deck assertions use `.not.toBe('play area')`.
- `GameActions.switch` already exists. Do not add it again.

## Traps in the code that just landed

- An ability's target builds a fresh selector each time it is chosen, limited to the cards that
  were legal when the ability initiated. Unit tests have no snapshot and still prompt.
- `context.opponent` is not a getter. A snapshot is skipped when any choosing player is missing.
- A faction card is not in the play area. `addEffect` on a faction card with the default location
  does nothing. Use an in-play card, or `location: 'any'`.
- `clearInvalidTargets` removes a target of a lasting effect only when it left `targetLocation`.
- Burn specs use a real burn (Dracarys! on a defender), not a hand-set STR modifier.
- `setupTest` refreshes the game state after placing cards, so state checks resolve before the
  test starts: Esgred and Asha both `inPlay` leaves Esgred in the discard pile.
- Calling `setupTest` twice in one test does not replace a card name already on the harness. The
  property still points at the first game's card.
- Setting `strictActionWindows` after a window has opened does not put skipped players back. Pass
  the option in `gameOptions` before `setupTest` advances. A character must be in play for
  Nightmares to be an available action; otherwise that player is skipped.
- `ActionWindow.skipCondition` ignores its player and skips everyone when strict windows are off
  and nobody opted in. `MarshalingActionWindow` overrides it per player.
- Timing is checked before `cannotTrigger`, `cost`, and `noEffect`. A spec that asserts one of
  those reasons has to pass until it is that player's turn.
- `integration(` keeps manual mode on. Those specs still click Apply Claim. `setupTest` specs must
  not.
- `DeckBuilder.buildDeck` throws when a deck has several agendas and none is Alliance. Before, such
  a deck silently had no agenda: the Red Door list in `PlayableDecks.spec.js` had Fealty copied in,
  so its mirror failed whenever The Crag was drawn into a starting hand.
- `setupTest` at phase `marshal` has collected income for the first player only. The second
  player's gold is 0 until their marshaling turn, unless the spec sets `gold`.
