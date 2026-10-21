# Engine status

Written 2026-10-20 so the next session can continue without the previous conversation. The plan is
[engine-roadmap.md](engine-roadmap.md). The rules map is
[framework-coverage.md](framework-coverage.md). Read both before changing `server/game`.

The work is committed on `feature/engine-test-framework`. Do not push or open a pull request unless asked.

Last full server run, after the engine changes and before the doc edits: `npx vitest run test/server`
from the repo root. 419 files, 4628 passed, 13 skipped. Re-run it after any further engine change.
Do not pipe vitest through `grep` or `tail`. On PowerShell, chain with `; if ($LASTEXITCODE -eq 0)`.

## Where the work is

The goal is a game that can start with manual mode off. A game already does that when every card in
both decks is verified. The phase 6 gate is not met, so that is not yet the default we trust. The
roadmap says to hold the verified-deck check until the gate is met. That hold is not in the code,
and it should not be added. `ManualMode.decideAtStart` already turns manual mode off for a verified
deck.

The framework batch that was in progress is implemented. Card migration of the remaining cards is
the ongoing work, and it was not part of this batch.

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
  `CardStat` already does. Legacy `atEndOfPhase` effects still resolve in a fixed order; they get
  the prompt when they move to `GameActions.delayedEffect`.
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
  is offered when its +1 STR would take the character above 0.
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
  in first-player order. The House With the Red Door uses it; The Prince that was Promised and
  Armed to the Teeth still use `registerEvents('onDecksPrepared')`. Only setup placements
  (`playingType: 'setup'`, including dragging a card into play during setup) enter play facedown,
  and a mulligan only shuffles the hand back, so cards put into play before it stay.
  [Setup.spec.js](../test/server/gamesteps/Setup.spec.js).
- Military claim only prompts for characters that can be killed. A loser with none is not
  prompted, and characters that must be chosen for claim (Joffrey's Crossbow) are chosen
  automatically when there are no other characters left to choose.
  [Claim.spec.js](../test/server/gamesteps/Claim.spec.js).
- Claim, taxation, and pile order were already done:
  [Claim.spec.js](../test/server/gamesteps/Claim.spec.js),
  [TaxationPhase.spec.js](../test/server/gamesteps/TaxationPhase.spec.js),
  [PileOrder.spec.js](../test/server/gamesteps/PileOrder.spec.js).

The coverage list exists and is the phase 6 checkbox for that item. Its open rows are the
remaining framework gaps.

## What is left

The phase 6 checkbox "framework items in phases 1, 2, 4 and 5 are done" is still open. These are
the gaps, in the order they block that checkbox. Ask before implementing a rules reading that is
not already decided.

1. FAQ 1.6, control. Two take-control effects on the same card (both players' Ward, say) cannot
   both apply, so the first player should choose which does. Today the newest wins. No spec covers
   it yet.
2. Every state change goes through a `GameAction`. Manual corrections (`changeStat`, `/power`,
   `/token`) stay plain corrections and raise no events.
3. The client showing why an action is unavailable. Server reasons already exist.
4. Alayne Stone needs a ruling before it moves to a state check: when she becomes Sansa's
   duplicate, does she leave play (losing power, tokens and attachments, and raising leave-play
   events)? The FAQ only says the placement is automatic and cannot be saved from.
   `PlaceAsDuplicate` refuses a card that is already in play.

These are decided and should stay as they are until someone asks:

- Strict action windows stay behind the game option. Auto-pass for visible actions is the next
  trial, then feedback, then making the option the default. Do not flip the default.
- Full refusal of actions when no window is open, outside marshaling, waits until strict windows
  are the default.
- Do not add a hold that stops verified decks starting with manual mode off.

After the framework gaps, or alongside them when a gap is blocked on a ruling, continue phase 5.
The eight shared neutrals in the roadmap table are verified, and so is Stark Fealty,
[decklist 16711](https://thronesdb.com/decklist/view/16711): a mirror starts with manual mode off
([PlayableDecks.spec.js](../test/server/decks/PlayableDecks.spec.js)), as are Stark Fealty
[decklist 16272](https://thronesdb.com/decklist/view/16272) and Stark The House With the Red Door
[decklist 16273](https://thronesdb.com/decklist/view/16273). On 2026-10-21, of 233 legal unique
Standard v2.1 joust lists published in the last year, the next closest is
[16651](https://thronesdb.com/decklist/view/16651) (Stark Fealty), at 12 unverified cards: Bolton
Flayer, No Surprises, The Iron Throne, Ward, The Father, The Mad King's Command, House Umber
Berserkers, Strained Reserves, Northern Patriarch, Winterfell, Frozen Solid and Arya Stark. Four
Lord of the Crossing lists are at 15, blocked on the agenda (see above). Add each finished list
to `PlayableDecks.spec.js`.

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
- `setupTest` at phase `marshal` has collected income for the first player only. The second
  player's gold is 0 until their marshaling turn, unless the spec sets `gold`.
