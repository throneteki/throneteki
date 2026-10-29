# Engine reference

How the rules engine in `server/game` works and the rules it follows. The architecture overview
is in [server/game/CLAUDE.md](../server/game/CLAUDE.md), the card API is in
[implementing-cards.md](implementing-cards.md), and the map from each Rules Reference entry and
FAQ ruling to the spec that covers it is [framework-coverage.md](framework-coverage.md).

The rules authority is the [Rules Reference](https://thronesdb.com/rulesreference). Card text
takes precedence over the Rules Reference where they conflict. When the engine and the Rules
Reference disagree, the engine is wrong.

## Manual mode and verified cards

Every implemented card is **verified**, which means all of these hold:

- Its spec uses `setupTest` and runs with manual mode off, with no manual action (chat commands,
  dragging cards, click-to-kneel, stat changes) and no harness shortcut once the test is under way
  (`moveCard`, `buildDeck`, `integration(`, mocks, assigning `kneeled`, `power` or `gold`).
- The spec resolves every ability on the card: every action, triggered ability and persistent
  effect. The run fails if one never resolves, or a persistent effect never applies, during the
  card's spec ([abilityCoverage.js](../test/helpers/abilityCoverage.js)).
- The implementation has no `handler` and passes `npm run card-rules`.

CI fails a pull request that adds or changes a card that is not verified
(`npm run spec:coverage -- --check-verified`), so a card can only be implemented once it is.

[ManualMode.js](../server/game/ManualMode.js) is a game flag. A game starts with manual mode off
when every card in every deck is implemented or needs no card file
([needsImplementation.js](../server/game/needsImplementation.js)): it has no text, its text is
only keywords, or it is an agenda whose text is only deckbuilding rules that
[AgendaRules.js](../deck-helper/AgendaRules.js) enforces. With it off:

- chat commands (except `/cancel-prompt`, `/manual`, the clock and rematch commands), drag and
  drop, click-to-kneel, stat changes, shuffling and looking at the deck are refused without a
  message, and the client hides those controls;
- claim is applied without asking the winner, and military claim cannot be cancelled;
- mandatory prompts (the reserve discard, standing restrictions, military claim,
  `GameActions.chooseCards`) cannot be skipped.

`/manual` or the Manual Mode button asks every opponent. If they all agree, manual mode turns on,
and that is recorded in the game stats. While a request is waiting for an answer, asking again
does nothing. Turning manual mode off needs no agreement. Every manual control records the cards
it touched, the ability being resolved and the last three abilities initiated
(`stats.manualActions`, see [ManualActions.js](../server/game/ManualActions.js)). Manual
corrections (`changeStat`, `/power`, `/token`) are plain corrections and raise no game events, so
fixing a mistake doesn't trigger reactions.

## Events

Every state change is a `GameAction` ([GameActions](../server/game/GameActions)) that raises an
event. Each action has `allow` (could this change the game state), `createEvent` and `message`.

An event window ([eventwindow.js](../server/game/gamesteps/eventwindow.js),
[InterruptWindow.js](../server/game/gamesteps/InterruptWindow.js)) resolves in this order:

1. cancel interrupts, then saves with a duplicate, then "would" interrupts (saves included), then
   forced interrupts, then other interrupts;
2. the event's handler, then any events attached to it with `thenAttachEvent`, which resolve in an
   interrupt window of their own but share the outer event's reactions;
3. delayed effects and event checks for the event;
4. When Revealed abilities;
5. forced reactions, then reactions.

An interrupt that says "would" declares `would: true`; the engine does not read card text for it.
[wouldInterrupts.spec.js](../test/server/tools/wouldInterrupts.spec.js) checks each declaration
against the card text.

Simultaneous changes are one event (`SimultaneousEvents`, `AtomicEvent`), so their interrupts and
reactions share windows:

- When a card leaves play, its attachments and duplicates are removed in the same event and can't
  be saved (Rules Reference: Leaves Play).
- When several cards are discarded or killed together, their owner chooses the order they enter
  the discard pile or dead pile, even when another player controls one of them. Cards placed on a
  deck or into shadows are ordered by the player who places them.
- Claim's kills, discards and power moves are attached to the `onClaimApplied` event, so
  reactions to them share a window with reactions to claim being applied. That window is titled
  after the claim's effects.
- An attachment put into play by `putIntoPlay` attaches inside the event that put it into play, so
  a search shuffles before reactions to the attachment.
- STR changes from one batch of effects are raised as one simultaneous event; a single change uses
  `raiseEvent`.
- The standing phase stands every card, faction cards included, in one event. Unspent gold is
  returned in one event. Melee titles enter play together in `onTitlesEnteredPlay`.

Every event and its parameters are listed in
[Constants/Events.js](../server/game/Constants/Events.js). Outside production, the game throws on
an event or window suffix that isn't listed, and on an event raised with missing or unexpected
parameters. Add an entry when you add or change an event.

Some low-level operations stay below the action boundary: `placeCardInPile`, `moveTo`, property
setters, setup consolidation and title-pool helpers are used inside action handlers and must not
queue actions of their own. Deck construction, snapshots, ability counters and prompt selections
are bookkeeping. `Player.moveCard` is only used by manual commands and drag and drop.

## Abilities

Resolution ([abilityresolver.js](../server/game/gamesteps/abilityresolver.js)) pays costs, then
chooses targets, then raises `onCardAbilityInitiated`, which is where cancels interrupt.

- **Requirements.** An ability can be used when `getUnmetRequirement` returns nothing. Otherwise it
  returns a reason from [Constants/Requirements.js](../server/game/Constants/Requirements.js)
  (`'phase'`, `'limit'`, `'cost'`, `'target'`, `'noEffect'`, `'window'`, ...). Card menus carry the
  reason, and the client shows a readable version. Override `getUnmetRequirement`, not
  `meetsRequirements`.
- **Targets.** A card is a legal target only if its `cardCondition` passes and the target's game
  action could change it, so immunity, "cannot" and state checks apply without repeating them.
  The legal cards are snapshotted before costs are paid, and choices stay limited to them (FAQ 3.3).
- **Unsuccessful resolution.** When no legal option remains, costs stay paid, the limit
  increments, an event goes to its owner's discard pile, and nothing else happens. Choosing zero of
  "any number" is this path, not a cancel.
- **Prevented costs.** A cost prevented partway through ends initiation once every payable cost
  is paid. The card is not played and the limit does not increment (Rules Reference: Costs).
- **Game state check.** An ability whose effect could not change the game state is not offered.
- **Limits** are counted per player (Rules Reference: Limits and Maxima). A use recorded without a
  player counts for everyone.
- **"You" and "an opponent"** mean the player who initiated the ability, not the controller of
  its card (FAQ 2.7). Cancels of "an opponent's" ability compare the initiating player.
- **Claim events.** A kill or discard made to satisfy claim has `isClaim` and `claimWinner`. Claim
  can be satisfied outside a challenge (Maester Aemon (WotW)), so use `claimWinner` for "the
  winning opponent".

Choices made while an effect resolves are game actions: `GameActions.chooseCards` (one or more
players choose in turn, then every choice resolves together), `GameActions.choose` (choose one of
several effects) and `GameActions.search`. A card whose text needs a choice the engine cannot
express gets a new game action, not a handler.

## Effects

Persistent and lasting effects live in [effectengine.js](../server/game/effectengine.js). After
each event window `EffectEngine.settle` recalculates until nothing changes. It stops after 10
passes and reports the effects that keep switching, leaving the cards in play.

- **Stats** are registrations computed when queried ([cardStat.js](../server/game/cardStat.js)).
  A set value overrides every non-set modifier, and the most recent set value wins (Rules
  Reference: Modifiers). Strength, icon and control changes are batched while effects apply and
  expire, and their events report the net change once the effects settle.
- **Eligibility.** A lasting effect with no condition affects the cards that were eligible when it
  was created: cards that become eligible later are unaffected, and a card that stops being
  eligible keeps it (Rules Reference: Lasting Effects; the Dragon Sight ruling). An effect with a
  condition can gain cards that start matching while the condition holds. A lasting effect on a
  player stays with that player when its source changes control.
- **Durations.** An "until the end of X" effect created after X has ended does nothing. The end of
  a phase, challenge or round follows the End of Phase Timing Sequence: interrupts to the end,
  then "until the end" and "during" effects expire, then "at the end" delayed effects resolve,
  then reactions.
- **Immunity** stops a card being targeted or affected by the named set of effects. A lasting
  effect already on the card stays when it gains immunity. An effect that names no game action is
  checked as `genericEffect`.
- **Losing all of an attribute** removes it for the duration, including ones another effect would
  add (FAQ 2.9).
- **Take control** follows the most recent effect and reverts to the next most recent when it
  ends (FAQ: Multiple "Take Control" Effects).
- **Conflicts.** Delayed effects and state checks that would resolve at the same time are ordered
  by the first player through `ChooseResolutionOrder`, whoever controls them (FAQ 1.6). One that
  can no longer do anything is dropped.

Text without a trigger has its own constructs:

- **Delayed effects** ("if X happens later", "at the end of the phase") are
  `GameActions.delayedEffect` ([DelayedEffect.js](../server/game/DelayedEffect.js)). They resolve
  once, after their event's handler and before When Revealed and reactions. They are not triggered
  abilities, so blanking the source does not stop them, and they expire when the affected card
  leaves play.
- **Event checks** ("If you win this challenge, gain 1 power") are `this.eventCheck`. They resolve
  with delayed effects while their card is active, faceup and not blank.
- **State checks** ("If X, Y") are `this.stateCheck` ([StateChecks.js](../server/game/StateChecks.js)).
  `refreshGameState` checks them after every event. They are off while the card is blank or
  facedown and during setup, and cannot be cancelled.
- **Terminal conditions** are burn and state checks. A save that could not remedy the condition
  is refused up front (FAQ 3.1): a burn kill can't be saved by a duplicate or Bodyguard. Risen from
  the Sea is offered when its +1 STR would take the character above 0.

## Challenges

[challengeflow.js](../server/game/gamesteps/challenge/challengeflow.js) runs each challenge.

- **Initiation is atomic** (Rules Reference: Initiating Challenges). Effects that depend on the
  challenge apply while attackers are chosen, so declaration restrictions (Honor-Bound,
  `doesNotKneelAsAttacker`) work. The STR changes they cause are held from before attackers are
  chosen until attackers are declared and knelt, then raised once (`beginInitiation` /
  `endInitiation`). A reaction such as Highgarden Courtier therefore sees the character kneeling.
- **Claim** is applied without asking the winner when manual mode is off. Military claim only
  prompts for characters that can be killed, and characters that must be chosen for claim
  (Joffrey's Crossbow) are chosen automatically when nothing else is left.
- **Redirect.** A redirected challenge is still considered initiated against the original
  opponent (`initiatedAgainstPlayer`).
- **Cancelling.** A cancelled challenge drops its remaining steps, but the event that cancelled it
  and the reactions to that event still resolve. A challenge abandoned before it is initiated (no
  attackers, or no opponent chosen) returns to choosing a challenge without another action window.
  A challenge cancelled with `/cancel-challenge` is not counted by challenge trackers.
- **Participation.** A challenge records every character that took part, however it joined.

## Setup and plots

- Setup chooses the first player, then announces factions and agendas in first-player order.
  Agenda abilities "after all agendas are announced" (`this.afterAgendasAnnounced`) resolve before
  setup hands are drawn. A mulligan only shuffles the hand back, so cards those abilities put into
  play stay.
- Setup cards aren't paid for until the player clicks Done. Until then, clicking a setup card
  returns it to hand, and placing a card only checks it fits the setup gold and the Limited count
  of what is already placed. Done is refused while the cards cost more than the setup gold or an
  attachment has no eligible card of that player's to attach to (Rules Reference: Setup), unless
  manual mode is on.
- Only setup placements enter play facedown. Outside setup, a facedown card in play has no title,
  traits or faction of its own, only what the effect that placed it grants (Rules Reference:
  Facedown Cards); uniqueness checks for the card being played use its printed title. A facedown
  card ignores its printed attachment restrictions only while it is facedown in play.
- Round 1 still chooses a first player: the plot phase clears the setup choice.
- Plot selection follows advance-information dependencies (the Bloodraven FAQ). Independent players
  choose together, a player who can see another's plot waits for it, the first player breaks
  cycles, and confirmed choices can't change.
- A forced plot (The Crow is a Tricksy Bird) is forced only while it is still in the plot deck
  (`player.getForcedPlot()`).
- The Rains of Castamere's Schemes are left out of the recycle check, so used plots return as soon
  as the last non-Scheme plot is revealed.
- Duplicates are in play. A card placed as a duplicate from play (Alayne Stone) does not leave
  play and keeps its power and tokens.

## Windows and hidden information

**Whether a player is offered a window, and how long the game waits before continuing, may only
depend on information their opponents can see.** Otherwise a prompt reveals that a player holds a
cancel such as The Hand's Judgment.

- [PossibleResponders.js](../server/game/PossibleResponders.js) answers "could this player respond
  from a hidden zone" from public information: every card their deck could legally contain, checked
  with phantom card instances against the player's gold and visible board.
- In a triggered window, a player who could respond from a hidden zone but has nothing is shown the
  same window with nothing to choose, and it passes for them after a random 1 to 3 seconds
  ([TriggeredAbilityWindow.js](../server/game/gamesteps/TriggeredAbilityWindow.js)). They see
  window's question with a progress bar and Wait and Skip buttons; their opponent sees an ordinary
  wait. Wait pauses the bar and leaves the window open until they pass. Players using the cancel
  timer keep the timer prompt.
- The cancel timer runs on the server: it passes for the player after their profile's window timer
  unless they choose "I need more time", and shows the same progress bar as the wait above. "I need
  more time" pauses the bar.
- A choice made before anything is initiated (confirming a card action, choosing how to play a
  card, choosing attackers) leaves the opponent's prompt as it was, so it doesn't reveal which card
  or challenge is being considered
  ([menuprompt.js](../server/game/gamesteps/menuprompt.js) `beforeInitiation`, and the attacker
  prompt in [challengeflow.js](../server/game/gamesteps/challenge/challengeflow.js)).
- "Don't ask again until end of round" means the player is not offered the windows the cancel
  timer covers until the next round, even when they hold a legal cancel.
- A player can always set a window as a stop. That doesn't depend on their hand, so it leaks
  nothing.
- **Strict action windows** (a game option, off by default,
  [actionwindow.js](../server/game/gamesteps/actionwindow.js)) prompt a player who holds an action
  they can take, give a timed wait to a player who has a playable action on a public card or could
  hold one, and skip everyone else. Public card actions stay clickable during the wait.
- **Marshaling** is an action window
  ([MarshalingActionWindow.js](../server/game/gamesteps/marshaling/MarshalingActionWindow.js)). The
  active player marshals on their turn; with strict windows on, every other player is offered an
  action in player order, and the window closes only after every player passes in a row (Appendix
  I, 3.2).
- An action is refused with the `window` reason, whether or not strict windows are on, while a
  window is open and it is not that player's turn, and during marshaling except on that player's
  turn, and always while an interrupt or reaction window is open. With strict windows off, outside
  marshaling and with no window open, actions are allowed.

Trigger checks (`when`, `condition`, cost `canPay`) therefore have no side effects, work on a card
that is not in the game, and keep nothing on the card instance between the check and resolution.

## Messages and logs

Ability messages are logged when their effects resolve, not when the ability initiates, so a
cancelled ability or a saved kill only logs a plain "uses" or "plays" line. `{gameAction}` is built
from the events that resolved (`GameAction.resultMessage`): simultaneous actions list only the
parts that happened, and amounts are the ones applied. Action messages are third person ("kills
{target}"), so a format reads "{player} uses {source} and {gameAction}", not "to {gameAction}".

An ability with a declarative game action and no `message` gets a default one built from what
resolved and the costs paid. Abilities add structured entries to `game.logEntries`
(`{ type, player, source, targets, results }`), and messages and alerts keep a structured template
and argument snapshot beside the rendered text.

## Problem reports and scenarios

`/cancel-prompt` and "report a problem" save a JSON snapshot (cards, zones, phase, log, challenge,
pipeline) in PostgreSQL for 30 days. The scenario runner rebuilds the board, the phase, the
challenges already made that phase, and a challenge in progress from the action window after
attackers or defenders were declared, from a report ID or a spec
(`SCENARIO=<spec>#<test>`, see [testing-cards.md](testing-cards.md#playing-a-test-in-the-real-client)).

## Decisions

Rules readings and design choices that stand until changed:

- Outside manual mode an ability can't be cancelled once it is resolving (Rules Reference:
  Initiating Abilities). Prompts before that point (confirming a card action or an event played
  from hand, choosing how to play a card, choosing cost cards) keep Cancel; target, player and choice prompts during resolution
  don't. A choice is still declinable when the text says "may": keyword targets (stealth,
  intimidate, assault) are `declinable`, and a `GameActions.choose` with a `cancelMessage` keeps its
  skip button.
- Fake waits cover every prompted window (cancels, interrupts, reactions) and last a random 1 to 3
  seconds.
- Strict action windows stay opt-in until the auto-pass behaviour has had feedback from real games.
  Refusing actions when no window is open waits until they are the default.
- Do not add a hold that stops verified decks starting with manual mode off.
- While manual mode is on, the winner may skip claim and the defender may cancel military claim,
  because a wrongly applied claim is hard to undo.
- An oscillating effect is reported and left in play. An infinite loop of optional abilities
  follows FAQ 1.1: the player names a finite number of repetitions.
- Deepwood Motte's "a Raider character you control or Asha Greyjoy" lets you stand any Asha
  Greyjoy; "you control" qualifies the Raider character only.
- Meereen names the player who used it and returns only cards that player owns.
- A FAQ entry about one card is covered by that card's spec. Glossary entries that name a card
  type, zone, icon or printed statistic are covered by ordinary play.
- A card that is already leaving play or being discarded can be chosen again to leave play or to
  pay a cost, and that new move triggers interrupts again (rules team ruling): Maester Kerwin can
  kill himself to save another character while Valar Morghulis is killing him.
- Marriage Pact can sacrifice the character it is attached to while that character is already
  leaving play only while the loop still changes something: after that character's own
  leave-play forced interrupts have resolved, and while one of them would still have an effect.
  On your own Umber Loyalist this discards your whole hand before the Loyalist leaves play
  (suggested by the rules team; there is no FAQ entry).
- The same card can't pay the same costs again in a sequence nested inside paying them, so Drowned
  God Fanatic can't be discarded again to cancel Ser Meryn Trant while it is already being
  discarded to pay that cost (`BaseAbility.isPayingCostsAlready`; proposed by the rules team as a
  FAQ entry).
- Marshaling a duplicate uses up a reducer for the next card you marshal (Hizdahr zo Loraq, Queen
  of Meereen), but not one for the next character or other restricted card (rules team ruling).
- Ask before implementing a rules reading that is not already decided.

## Open work

- Strict action windows are not the default, and actions are still allowed when no window is open
  outside marshaling.
- There is no prompt for the infinite-loop shortcut (naming a number of repetitions).
- Logs are translation-ready but there are no locale catalogs or translating renderer.
- A problem report cannot restore an arbitrary open prompt.
- Open ruling: whether The White Shadows' effects apply to Craster.

## Pitfalls

- A faction card is not in the play area. `addEffect` on a faction card with the default location
  does nothing; use an in-play card or `location: 'any'`.
- `clearInvalidTargets` removes a target of a lasting effect only when it left `targetLocation`.
- `context.opponent` is not a getter. A target snapshot is skipped when any choosing player is
  missing.
- `ActionWindow.skipCondition` skips everyone when strict windows are off and nobody opted in;
  `MarshalingActionWindow` overrides it per player.
- Timing is checked before `cannotTrigger`, `cost` and `noEffect`, so a spec asserting one of those
  reasons must wait until it is that player's turn.
- Pile-order prompts keep `canCancel`: Done with nothing selected uses the default order.
