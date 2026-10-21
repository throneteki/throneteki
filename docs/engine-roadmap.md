# Engine roadmap: trusting the rules engine

## Goal

Today every game runs with what is effectively manual mode switched on: chat commands, drag and drop,
the stat buttons and click-to-kneel are always available, because the engine is not yet trusted to
follow the rules for every card. The goal is to reach the point where a game can run with manual
mode off, as keyteki does, because the engine can be shown to be correct.

Trust is earned per card, by tests:

- A card is **verified** only when all of these hold. There are no exceptions, and nothing carries
  over from an older spec: a card whose spec does not meet the bar is rewritten, not grandfathered.
    - Its spec uses `setupTest` and runs with manual mode off. A spec that uses any manual action
      (chat commands, dragging cards, click-to-kneel, stat changes) or any harness shortcut once
      the test is under way (`moveCard`, `buildDeck`, `integration(`, mocks, assigning `kneeled`,
      `power` or `gold`) cannot verify a card. `setupTest` games throw on a manual action, and
      `spec:coverage --write-verified` leaves out any card whose spec uses one of those patterns.
    - The spec resolves every ability on the card: every action, triggered ability and persistent
      effect. For a verified card the test run fails when any of its abilities never resolves (or,
      for a persistent effect, never applies) during its spec
      ([abilityCoverage.js](../test/helpers/abilityCoverage.js)). Resolving an ability once is the
      floor; the spec still covers the cases in [test/CLAUDE.md](../test/CLAUDE.md).
    - The implementation has no `handler`, and no legacy helpers, direct state writes, `addMessage`,
      game listeners or `promptForSelect` (the `npm run card-rules` counts for that file are zero).
    - [verifiedCards.json](../server/game/verifiedCards.json) is built from this bar, and CI checks
      it is current.
- A game starts with manual mode **off** when both decks are verified and the phase 6 gate is met.
  Turning it on requires the opponent's consent and is recorded in the game stats.
- Every other game keeps today's behaviour.

As coverage grows, more games switch over automatically. Progress is a number we can watch, not a
judgement call.

Verified cards do not measure the framework. Phase 6 does not switch the default until the framework
rules named in phases 1, 2, 4 and 5 are each covered by an engine spec, and until the wider framework
list in phase 6 is in place. [engine-status.md](engine-status.md) is where the current work and the
remaining gaps are written down.

The rules authority is the [Rules Reference](https://thronesdb.com/rulesreference). Card text takes
precedence over the Rules Reference where they conflict.

## Where the engine stands

What already matches the Rules Reference:

- Event windows resolve in the right order: cancel interrupts, saves, forced interrupts, interrupts,
  the event, when revealed, forced reactions, reactions
  ([InterruptWindow.js](../server/game/gamesteps/InterruptWindow.js),
  [eventwindow.js](../server/game/gamesteps/eventwindow.js)).
- Abilities pay costs before choosing targets, cancels interrupt initiation, and a cancelled ability
  still counts as used ([abilityresolver.js](../server/game/gamesteps/abilityresolver.js)).
- Framework steps: initiative ties, dominance (including gold, ties give no winner), income per
  active player, first player orders forced abilities and challenge keywords, non-Terminal attachments
  return to hand, decking is checked continuously.
- `GameActions` (`allow` / `createEvent` / `.then()`) is the right foundation to build on.

What stops the engine being trusted:

| Problem                                                                                                                                                   | Where                                                                                                                                               |
| --------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| Actions can be used outside action windows; the engine only posts an alert                                                                                | [game.js](../server/game/game.js) `markActionAsTaken`                                                                                               |
| Clicking a card with nothing to do kneels or stands it, bypassing restrictions                                                                            | [game.js](../server/game/game.js) `defaultCardClick`                                                                                                |
| An ability cannot have both a `target` and a `gameAction`, so every targeted card is written as an imperative `handler` (about 1,290 of 1,960 card files) | [baseability.js](../server/game/baseability.js) `buildGameAction`                                                                                   |
| Handler abilities always pass the "could this change the game state" check                                                                                | [HandlerGameActionWrapper.js](../server/game/GameActions/HandlerGameActionWrapper.js)                                                               |
| Cards choose with `promptForSelect` inside handlers, so the choice is not a target and skips target validation                                            | 169 card files                                                                                                                                      |
| Some state changes skip events: `changeStat`, `/power`, the faction card standing, `takeControl`                                                          | [game.js](../server/game/game.js), [chatcommands.js](../server/game/chatcommands.js), [standingphase.js](../server/game/gamesteps/standingphase.js) |
| Two APIs for the same change (legacy `player.*`/`game.*` helpers and `GameActions`)                                                                       | [player.js](../server/game/player.js), [game.js](../server/game/game.js)                                                                            |
| Effects mutate cards on apply and undo it on unapply, which depends on ordering workarounds (`order: 0/1000`, reverse cancel)                             | [effect.js](../server/game/effect.js), [effectengine.js](../server/game/effectengine.js)                                                            |
| Cards keep state on the card instance between a trigger check and resolution                                                                              | e.g. [TheHandsJudgment.js](../server/game/cards/01-Core/TheHandsJudgment.js)                                                                        |
| About 1,200 hand-written `addMessage` calls in cards                                                                                                      | `server/game/cards`                                                                                                                                 |
| Event names are untyped strings with no catalogue                                                                                                         | throughout                                                                                                                                          |
| 198 card spec files for about 1,960 implemented cards                                                                                                     | `test/server/cards`                                                                                                                                 |
| The framework still disagrees with the Rules Reference where [framework-coverage.md](framework-coverage.md) marks a gap                                   | conflicting effects, useless saves, skipped windows while strict windows are off                                                                    |

## Phases

The phases overlap. Phase 0 comes first because everything else relies on it; card migration
(phase 5) runs continuously from phase 1 onwards.

### Phase 0: safety net

- [x] Write this roadmap, the project [CLAUDE.md](../CLAUDE.md), [test/CLAUDE.md](../test/CLAUDE.md),
      [server/game/CLAUDE.md](../server/game/CLAUDE.md), [server/game/cards/CLAUDE.md](../server/game/cards/CLAUDE.md)
      and [docs/testing-cards.md](testing-cards.md).
- [x] Switch from jasmine to vitest. Specs were converted directly to `vi` and vitest's `expect`;
      there is no jasmine compatibility layer.
- [x] Add a declarative `setupTest` that builds the board state and reaches the requested phase through
      the real game flow ([test/helpers/setupTest.js](../test/helpers/setupTest.js)).
- [x] Coverage report: implemented cards against specs, per pack (`npm run spec:coverage`). CI fails a
      pull request that adds or changes a card file without a spec. Per-format coverage is still to do.
- [x] `npm run spec:new -- <code>` scaffolds a spec with the card text from `throneteki-json-data`.
- [x] Telemetry: every manual control records the cards it touched, the ability being resolved and
      the last three card abilities initiated, in the acting player's game stats
      (`stats.manualActions`, see [ManualActions.js](../server/game/ManualActions.js)). Actions used
      outside an action window or out of turn are recorded too.
- [x] A scenario runner that loads a test's state into a real game on a game node, for reproducing
      bug reports (`SCENARIO=<spec>#<test>`, see [testing-cards.md](testing-cards.md#playing-a-test-in-the-real-client)).

Done when: all existing specs pass under vitest, new card changes cannot merge without a spec, and the
coverage number is published.

Baseline on 2026-10-19: 194 of 1,962 implemented cards (9.9%) have a spec at the matching path.

The cards most often involved in manual corrections, counting both the cards a manual action
touched and the abilities that had just been initiated:

```sql
SELECT card->>'code' AS code, card->>'name' AS name, count(*) AS uses
FROM game_players,
    jsonb_array_elements(stats->'manualActions') AS action,
    jsonb_array_elements(action->'cards' || action->'recentAbilities') AS card
GROUP BY 1, 2
ORDER BY uses DESC
LIMIT 50;
```

### Phase 1: engine fundamentals

1. **Targets with game actions.** _Done._ An ability can combine a `target` with a `gameAction`, and
   each of several `targets` can have its own `gameAction` (resolved simultaneously). A card is
   only a legal target if its `cardCondition` passes and its game action could change the game
   state for it ("a card is not an eligible target for an ability if the resolution of that
   ability's effect could not affect the target at all"), so immunity, "cannot" and game state
   checks apply automatically. `chooseOpponent` and `choosePlayer` are filtered the same way when
   there are no card targets. String target actions (`gameAction: 'kill'`) only name the action
   checked for immunity and can't be used to filter, because the rest of the effect may still
   affect the card. Ser Gerris Drinkwater is the first card migrated to per-target actions.
2. **Game state check for triggered abilities.** _Done for abilities that declare a game action:_
   `canResolve` rules them out when the action could not change the game state, and offers only
   targets and players it could affect. Abilities with a `handler` (841 triggered abilities and
   498 actions on 2026-10-19) can't be checked; rather than adding a hint that could drift from the
   handler, they are migrated to game actions in phase 5. Lasting effects have a game action,
   `GameActions.lastingEffect`, and "if X happens later" text has `GameActions.delayedEffect`
   ([DelayedEffect.js](../server/game/DelayedEffect.js),
   [DelayedEffects.spec.js](../test/server/DelayedEffects.spec.js)). 20 cards still listen for
   game events directly; `npm run card-rules` counts them (`game-listener`) and they move to
   delayed effects in phase 5.
3. **One way to change state.** _The ratchet is in place: `npm run card-rules` (run in CI) fails
   if a card file uses more legacy helpers, direct state writes, `addMessage` or `promptForSelect`
   than its baseline (on 2026-10-19: 578, 5, 1,207 and 115 uses in 1,065 files). The faction card
   now stands through an event. Taking control is a real event: `GameActions.takeControl` (and the
   legacy `game.takeControl`, which now resolves it) raises `onCardTakenControl` before control
   changes, with `oldController`, `player` and `source`, so interrupts can see it. Lasting
   "take control" effects change control at once through `game.takeControlByEffect` and raise the
   event afterwards._ Still to do: every state change goes through a `GameAction`. Manual corrections
   (`changeStat`, `/power`, `/token`) stay plain corrections that raise no events, so fixing a
   mistake doesn't trigger reactions; they are recorded as manual actions instead. Terminal
   conditions are part of the same work (Rulings and Clarifications v4.0, 3.1, and the Rules
   Reference under Save). Burn opens a kill that can be saved, then kills again with no save if
   the character is still in play at 0 STR
   ([Burn.spec.js](../test/server/gamesteps/Burn.spec.js)). A duplicate cannot save that kill. A
   save that removes the 0 STR leaves the character in play. Still to do: refusing a save that
   could not remedy the condition, rather than letting it resolve and then applying the second
   kill, and the first player ordering kills that happen together.
4. **Simultaneity.** _Done._ The standing phase stands every player's cards, faction cards
   included, as one event. When a card leaves play, by a game action or the legacy
   `player.moveCard`, its attachments and duplicates are removed in the same event window, and
   can't be saved: the Rules Reference lists them as consequences that happen "simultaneously with
   the card leaving play", not effects
   ([LeavePlayConsequences.spec.js](../test/server/player/LeavePlayConsequences.spec.js)).
5. **Event catalogue.** _Done._ [Constants/Events.js](../server/game/Constants/Events.js) lists
   every event with its parameters and their types. Outside production, `Game.on` and `Game.emit`
   throw on an unknown event or window suffix, and on an event raised with missing or unexpected
   parameters; a spec checks that every card only listens for catalogued events. The catalogue was
   built from the events the suite raises, plus a review of the five events it never raises
   (`onAddedToChallenge`, `onBeforeDeckSearch`, `onDupeEntersPlay`, `onLookAtShadows`,
   `onTokenDiscarded`); those five need engine specs. `onCardsDrawn` from `DrawSpecific` lacks the
   `amount` that `DrawCards` gives it, so listeners can't rely on it.
6. **Requirement reasons.** _Done on the server._ Abilities implement `getUnmetRequirement`, which
   returns one of the [Requirements](../server/game/Constants/Requirements.js) reasons (`'phase'`,
   `'limit'`, `'cost'`, `'target'`, `'noEffect'`, ...) or undefined; `meetsRequirements` and
   `canResolve` wrap it. Specs assert why an action is unavailable with
   `this.player1.actionUnavailableReason(card)`, and card menu items carry a `disabledReason`.
   Still to do: the client showing the reason, and reasons for triggered abilities that are not
   offered.
7. **Ability resolution.** _Done._ From the Rules Reference (Costs, Target, Triggering Condition)
   and Rulings and Clarifications v4.0 (3.3), locked in
   [AbilityResolution.spec.js](../test/server/gamesteps/AbilityResolution.spec.js):
    - Choices made while initiating, including targets, stay limited to the options that were legal
      at step 1 (3.3). The legal cards are snapshotted before costs are paid.
    - When no legal option remains, the ability resolves unsuccessfully: its costs are paid, it has
      no effect, and an event is placed in its owner's discard pile. The limit still increments.
    - An effect that chooses "any number" of targets does not resolve when zero are chosen (Rules
      Reference: Target). Choosing zero is not a cancel.
    - A cost prevented partway through payment ends initiation once every cost that can be paid has
      been paid (Rules Reference: Costs). The card is not played and the limit does not increment.
    - Interrupts to a triggering condition that "would" occur resolve before forced interrupts and
      other interrupts (Rules Reference: Triggering Condition). Saves that say "would" are in that
      window. Duplicate saves stay ahead of them.
8. **Round structure.** Each needs an engine spec.
    - When several cards are discarded or killed at once, their owner chooses the order they enter
      the discard pile or dead pile (Rules Reference: Discard Pile, Dead Pile). _Done._ The owner
      chooses even when another player controls one of the cards
      ([PileOrder.spec.js](../test/server/gamesteps/PileOrder.spec.js)). Putting cards on a deck
      or into shadows is still ordered by the player who places them.
    - Setup determines the first player, then announces factions and agendas, in that order (Rules
      Reference: Setup). _Done._ The announcement uses first-player order
      ([Setup.spec.js](../test/server/gamesteps/Setup.spec.js)).
    - Each player returns unspent gold at the same time (Rules Reference, Appendix I, step 7.2).
      _Done._ Both pools are returned in one event
      ([TaxationPhase.spec.js](../test/server/gamesteps/TaxationPhase.spec.js)). A player who does
      not return unspent gold is left out of that event.
    - In melee, titles are chosen in secret and enter play together (Rules Reference, Appendix I,
      step 1.4). _Done._ Each player is told only that a title was selected, and every selected
      title enters play in one `onTitlesEnteredPlay` event
      ([ChooseTitle.spec.js](../test/server/gamesteps/ChooseTitle.spec.js)).

### Phase 2: prompts without leaking hidden information

`promptedActionWindows` exists so players are not asked to click through dozens of empty windows each
game. The obvious fix, prompting only players who have something they can use, leaks information: if
a player is prompted when the opponent plays an event, the opponent learns they hold a cancel such as
The Hand's Judgment and can bait it out.

The existing cancel timer ([CancelTimer.js](../server/game/gamesteps/CancelTimer.js)) avoids the leak
by prompting regardless of hand, but it costs a click or a timeout every time, and "Don't ask again
until end of round" brings the leak back: once paused, a player is still prompted when they hold a
legal cancel, so any prompt reveals one.

**Rule: whether a player is offered a window, and how long the game waits before continuing, may only
depend on information their opponents can see.**

How that works:

_Steps 1 to 4 and 6 are done for every prompted window: cancel interrupts, interrupts and
reactions. [PossibleResponders.js](../server/game/PossibleResponders.js) answers
"could this player respond from a hidden zone" from public information
([specs](../test/server/PossibleResponders.spec.js) show the answer doesn't depend on the hand,
and that every card in every faction's pool builds and checks without errors).
[TriggeredAbilityWindow.js](../server/game/gamesteps/TriggeredAbilityWindow.js) gives a player
without the cancel timer a fake wait when a card they could hold might respond: the same window,
with nothing to choose and a Pass button, passed for them after a random 1 to 3 seconds
([PossibleResponderWindow.spec.js](../test/server/gamesteps/PossibleResponderWindow.spec.js)
checks their opponent sees the same thing either way). Players with the timer keep the timer
prompt. This is on trial: nearly every event has some possible reaction in a faction's pool, so fake
waits may slow games down noticeably, and the scope may be cut back after feedback. Format
legality isn't applied to the pool, which only makes it larger. Still to do: review the scope after
feedback. On their own screen, the player sees "Keeping your hand hidden" with a draining bar and a
Skip button (`response-delay` prompt control); the opponent gets none of it._

1. **Possible responders.** At game start, build each player's candidate pool: every card their deck
   could legally contain (faction, neutral, agenda-allowed cards, the format's legal pool) that has an
   ability usable from a hidden zone (hand, shadows). Cards in open zones are public and are
   evaluated directly.
2. **Public check.** When a window opens, for each player check whether any candidate could respond to
   this event using only public state: the event itself, the player's gold, their standing cards,
   whether the zone it would come from is non-empty. Candidates are evaluated with phantom card
   instances that are not part of the game.
3. **Outcome.**
    - No candidate could respond: skip the window for that player. Their opponent can compute the
      same thing, so nothing leaks.
    - A candidate could respond and the player really has a legal ability: prompt them as normal.
    - A candidate could respond but the player has nothing: they see the window with nothing to
      choose; the game waits a random delay drawn from the same range as a short decision, then
      passes for them. They can pass sooner. To the opponent this looks identical to a player
      who looked and passed.
4. **Pausing is a real opt-out.** _Done._ "Don't ask again until end of round" means the player is
   not offered the windows the cancel timer covers until the next round, even when they hold a
   legal cancel, so pausing reveals nothing
   ([CancelTimerPause.spec.js](../test/server/gamesteps/CancelTimerPause.spec.js)). A player who
   turns the timer off in their settings still leaks, since they are only prompted when they hold
   a cancel; steps 1 to 3 fix that.
5. **Player stops stay as an override.** A player can still choose to always stop at a window, for
   example to bluff. That choice does not depend on their hand, so it leaks nothing.
6. **Tests control the delay** through the injected `schedule` and `responseDelay` game
   options.

Action windows use the same public check, with one difference. A legal action on a card in an open
zone is something the opponent can already see, so it does not get a blocking prompt. The window
opens, that card stays clickable, and the window passes on its own if the player does not play it,
on the same delay as a hidden action. A blocking prompt is only for a player who is holding an
action they can play. A player who could hold one and does not gets that same delay, and it passes
for them, so the opponent cannot tell the two apart. A window where nothing that player could hold
is playable is skipped.

Most windows in a game are ones where an action is possible and nobody takes it. Skipping those
would take away an action the rules allow. `promptedActionWindows` stays as a bluff stop only: it
can force a pause on a window that would have been skipped, and it does not decide which windows
exist. Auto-pass is what removes the Pass click. Tightening `couldAct` only removes the edges (no
gold, an empty hand, the wrong phase). A normal challenges phase still pauses, because some event
can be played and each window is a fresh chance. That pause is the cost to time in a real game
before this becomes the default.

_Implemented today, behind the "Strict action windows" game option
([actionwindow.js](../server/game/gamesteps/actionwindow.js),
[StrictActionWindows.spec.js](../test/server/gamesteps/StrictActionWindows.spec.js)): a player is
prompted if they have any action they can take, including one on a card in play, or have set the
window as a stop; they get a fake wait if a card they could hold might give them one
(`PossibleResponders.couldAct`); they are skipped otherwise. The next step is the auto-pass above
for visible actions, then feedback on how long the pauses feel. An action is refused with the `window` reason, whether or not strict windows are on, while an
action window is open and it is not that player's turn, and throughout the marshaling phase except
during that player's own turn in the window. When strict windows are off and no window is open,
outside marshaling, actions are still allowed. That is what lets `setupTest` play events during a
challenge. Refusing those as well waits until strict windows are the default._

The marshaling phase uses that window
([MarshalingActionWindow.js](../server/game/gamesteps/marshaling/MarshalingActionWindow.js),
[MarshalingWindow.spec.js](../test/server/gamesteps/MarshalingWindow.spec.js)). The active player
marshals on their turn. With strict windows on, every other player is offered the action window, in
player order, before the next player marshals. With strict windows off, a player who has not set
the marshaling window as a stop is skipped. Each active player has their own window, the first
player always has the first opportunity, and marshaling a card is an action, so the window closes
only after every player has passed in a row (Appendix I, 3.2).

What this needs from card code, required for all new and migrated cards from now on:

- Trigger checks (`when`, `condition`, cost `canPay`) must have no side effects and must work on a
  card that is not in the game.
- No state stored on the card instance between the trigger check and resolution; keep it on the
  ability context.
- The public check is only as good as the "could this change the game state" checks from phase 1.

Remaining tell: a human who holds a cancel and thinks about it takes longer than the random delay. That
is the same tell as at a real table, and is acceptable.

### Phase 3: messages built from results

_Started. Ability messages are logged when their effects resolve rather than as the ability
initiates: a cancelled ability, or a kill whose target is saved, only logs a plain "uses"/"plays"
line ([AbilityMessages.spec.js](../test/server/AbilityMessages.spec.js)). `{gameAction}` is built
from the events that actually resolved (`GameAction.resultMessage`): simultaneous actions list
only the parts that happened, and gold gained reports the amount applied. Messages written out in
the format (`'{player} uses {source} to kill {target}'`) are still intent, but are logged only
when the effect happens; moving them to `{gameAction}` is part of phase 5. Power gained and cards drawn also report what resolved. Abilities add structured entries to
`game.logEntries` (`{ type, player, source, targets, results }`), kept on the server because they
hold card references whatever each player can see; specs can assert on them instead of text.
An ability with a declarative game action and no `message` gets a default one built from what
resolved and the cards paid as costs ("player1 kneels Grey Wind and kills Eddard Stark"), and the
common game actions all describe themselves
([DefaultAbilityMessages.spec.js](../test/server/DefaultAbilityMessages.spec.js)). Migrated cards
drop their `message` where the default says what they do. Still to do: translation, where the
text is still built from English formats._

Keyteki builds an ability's message before it resolves, so the log can claim things that did not
happen: a kill that was cancelled, a card that was saved, an amount that was capped. Instead:

- Each `GameAction` event records what actually happened once its handler has run: the cards affected,
  the amounts applied, and anything cancelled, saved or prevented. `GameAction.message()` and
  `Message.fragment` are the starting point.
- An ability's log entry is the player and source plus the results of its events, composed after
  resolution. Cancels and partial resolution are reported correctly without card code.
- Log entries are structured (`{ type, actor, source, targets, results }`) and turned into text at the
  edge, which allows translation, filtering, and tests that assert on the log rather than on strings.
- Cards may override wording with a template over the context and results. Most `addMessage` calls in
  cards go away.

### Phase 4: effects computed when queried

This change is the most likely to cause regressions, so it waits on effect-engine specs rather than
on every card in the format having one.

- Keep the card-facing `ability.effects.*` API so card code does not change. Internally, applying an
  effect registers a value on the target; getters compute stats from those values.
- After each event window, recalculate effects until nothing changes. If the same targets keep
  switching, stop and report it, and leave the cards in play.
- An infinite loop of optional abilities is a player shortcut, from Rulings and Clarifications v4.0
  (1.1): show one full cycle, name a finite number of repetitions, and resolve that many at once. A
  win on the last repetition ends the game. A player does not have to take the choice that would
  break the loop. Prompting for that count is separate from the effect recalculation, and comes
  when a player is the one repeating an ability. Cards stay in play.
- Migrate one stat at a time: strength (already part way there), icons, traits, keywords, dominance
  strength, blank, control.
- Removes the `order: 0/1000` and reverse-cancel workarounds.
- Conflicting constant abilities and lasting effects are ordered by the first player, once, when
  they would first apply. A new conflict lets the first player choose again (Rulings and
  Clarifications v4.0, 1.6, and the Rules Reference: Priority of Simultaneous Resolution). This is
  not implemented. The TODO on `mustShowPlotSelection` in
  [effects.js](../server/game/effects.js) is the same gap for delayed effects that happen together.
- The cards a lasting effect applies to are the cards eligible when it is created. Cards that
  become eligible later are unaffected, and a card that stops being eligible keeps the effect for
  its duration (Rules Reference: Lasting Effects; the Dragon Sight ruling in the current FAQ).
  _Done_ for an effect with no condition
  ([LastingEffects.spec.js](../test/server/gamesteps/LastingEffects.spec.js)). An effect with a
  condition still drops cards that stop matching and can apply to a card that starts matching
  while the condition holds, which is how a claim reduction follows the attacker's current plot.
  A player target limited to the source's controller is removed when that player stops being the
  controller.
- An "until the end of X" effect created after X has ended expires at once and does not affect the
  game (Rules Reference: Lasting Effects). _Done._ The duration is marked as ending before the
  end event resolves, and the next phase or round clears that mark.
- End of the phase follows the sequence in the current FAQ (End of Phase Timing Sequence), and the
  same sequence ends a challenge or a round: interrupts to the end, then "until the end" and
  "during" abilities expire (that moment is the end), then "at the end" delayed effects resolve,
  then reactions to the end. _Done_ for the expiry order
  ([LastingEffects.spec.js](../test/server/gamesteps/LastingEffects.spec.js)). First-player order
  for effects created together is the open item above.
- A card that loses all of an attribute has none of it while the effect lasts, including attributes
  another effect would give it (Rulings and Clarifications v4.0, 2.9). `losesAllTraits` is a flag
  that makes `hasTrait` and `getTraits` return nothing
  ([basecard.js](../server/game/basecard.js)); a trait added with `addTrait` during that time is
  still stored, and both return when the effect ends
  ([LastingEffects.spec.js](../test/server/gamesteps/LastingEffects.spec.js)).
- Immunity stops a card being targeted or affected by the named set of effects (Rules Reference:
  Immune). A lasting effect already on the card stays when the card gains immunity. An effect that
  names no game action is checked as `genericEffect`, so immunity to an opponent's event stops it
  ([LastingEffects.spec.js](../test/server/gamesteps/LastingEffects.spec.js)).

### Phase 5: card migration

This engine work comes before migrating cards in bulk, so each card is only rewritten once:

- Default `{gameAction}` messages for the common actions (phase 3). _Done._
- Choices made while an effect is resolving are game actions, filtered by whether the following
  action could affect the chosen card. That covers an opponent choosing, each player choosing, and a
  choice that happens after part of the effect. `ChooseGameAction` covers "choose one of these
  effects". `Search` already prompts from inside a game action. `promptForSelect` in a card file does
  not. A card whose text needs a choice the engine cannot express yet stays unverified, and the
  missing game action is added rather than a `handler`. _Done: `GameActions.chooseCards` has one
  or more players choose, each in turn, from cards the following game action could affect, then
  resolves every choice together ([ChooseCards.spec.js](../test/server/GameActions/ChooseCards.spec.js)).
  Woods Witch is the first card to use it._
- `GameActions.switch`. Both sides of a switch have to exist or the ability does not resolve (Rules
  Reference: Switch). _Done ([SwitchCards.spec.js](../test/server/GameActions/SwitchCards.spec.js));
  Ser Gerris Drinkwater uses it. The Reader's Septon, Sorrowful Man, Samwell Tarly and The
  Conclave move to it as they are migrated._

Order comes from published ThronesDB lists that are still legal in Standard v2.1 joust. On
2026-10-20, the lists published from 2025-10-20 to 2026-10-20 were 487, of which 166
were 60-card, 7-plot lists with no Standard v2.1 banned card, and 153 were unique. None is fully
verified. The median list has 31 unverified cards, and those lists between them use 1,168 distinct
unverified cards.

Taking the most common remaining card each time finishes no list in the first 200 cards, and 13 of
153 (8.5%) after 400. The cards shared by the most lists are still first, because every later list
needs them:

| Card                | Code  | Lists |
| ------------------- | ----- | ----: |
| The Kingsroad       | 01039 |   100 |
| The Roseroad        | 01040 |    89 |
| Gates of the Moon   | 08038 |    45 |
| Late Summer Feast   | 06020 |    43 |
| Nightmares          | 02099 |    41 |
| Marched to the Wall | 01015 |    39 |
| You Win Or You Die  | 08120 |    38 |
| Milk of the Poppy   | 01035 |    38 |

_The eight cards above are verified. Marched to the Wall uses a per-target game action on an
each-player target, which now resolves once for every player's selection; 24 cards use
each-player targets, mostly with handlers, and can move to it._

After those, finish one archetype outright. The shortest published list is Stark Fealty,
"Characters" ([decklist 16711](https://thronesdb.com/decklist/view/16711)), at 20 unverified cards.
The three easiest Stark lists together are 39 cards, the smallest such union of any faction (the
others run from 49 to 77). A mirror of a finished list is the first game that starts with manual
mode off, once the phase 6 gate is met. Refresh this order when the restricted list changes.

- A verified card that turns up in manual-mode telemetry is a priority bug.

### Phase 6: switching the default

_Started. [ManualMode.js](../server/game/ManualMode.js) is a game flag. A game starts with it off
when every card in every deck is verified (listed in
[verifiedCards.json](../server/game/verifiedCards.json), generated by
`npm run spec:coverage -- --write-verified` and checked in CI), or has no text. That check is held
until the gate below is met. With it off,
chat commands (except `/cancel-prompt`, `/manual` and the clock and rematch commands), drag and
drop, click-to-kneel, stat changes, shuffling and looking at the deck are refused. `/manual` asks
every opponent; if they all agree, manual mode turns on and the player is asked which card isn't
working, and both are recorded in the game stats
([ManualMode.spec.js](../test/server/ManualMode.spec.js)). `setupTest` games run with manual
mode off and throw on any manual action; older `integration(` specs still run with it on. An
action is refused when a window is open and it is not that player's turn, and during marshaling
except on that player's turn, whether or not strict windows are on (phase 2). Still to do: refuse
actions whenever manual mode is off and no window is open; make strict action windows the default
after the auto-pass trial has had feedback; a client toggle and indicator; and "report a problem"
with a saved game state for the scenario runner._

**Gate.** The verified-deck check already turns manual mode off. Hold that check until all of the
following hold. This is the bar for switching the default, on top of both decks being verified.

- The framework items in phases 1, 2, 4 and 5 are done, and each has an engine spec.
- [x] Claim follows the Rules Reference in that game (Appendix I, step 4.2.4: if the attacker won,
      "the claim result of the challenge is now applied"). While manual mode is on,
      [ClaimPrompt.js](../server/game/gamesteps/challenge/ClaimPrompt.js) still offers "Apply Claim"
      or "Continue", and
      [fulfillmilitaryclaim.js](../server/game/gamesteps/challenge/fulfillmilitaryclaim.js) still
      lets the defender cancel. That prompt exists because a wrongly applied claim is hard to undo,
      and manual mode is how a mistake gets fixed. With manual mode off, claim is applied: the
      winner is not asked, and military claim cannot be cancelled. The defender still chooses which
      characters die, and that kill is `GameActions.kill`
      ([Claim.spec.js](../test/server/gamesteps/Claim.spec.js)).
- [x] A framework coverage list maps every Rules Reference glossary entry, every framework step in
      Appendix I, and every ruling in the current FAQ (Rulings and Clarifications v4.1, January 2024) to an engine spec, or to an accepted row in the decisions table
      ([framework-coverage.md](framework-coverage.md)). The gaps named there are still open.
      Verified cards do not count towards it.

- Manual mode becomes a game flag. Chat commands, `changeStat`, drag and drop and click-to-kneel
  require it. With manual mode off, actions outside action windows are refused.
- Games where both decks are fully verified, and the gate above is met, start with manual mode off.
  Enabling it needs the opponent's consent and is recorded.
- `/cancel-prompt` and a "report a problem" action stay available. Using either records the cards
  involved and the game state, ready to load in the scenario runner.
- When manual mode is turned on, ask which card misbehaved, so manual mode doubles as bug reporting.

## Decisions

| Date       | Decision                                                                                                                                                                                                                                                                                                        |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-10-19 | A card counts as verified when it has a passing spec that follows the test conventions. Superseded 2026-10-20.                                                                                                                                                                                                  |
| 2026-10-19 | Hidden information: the priority is not revealing that a player holds a cancel. Window decisions use public information only (phase 2).                                                                                                                                                                         |
| 2026-10-19 | Tests move from jasmine to vitest, modelled on keyteki's harness. Target: a spec for every implemented card.                                                                                                                                                                                                    |
| 2026-10-19 | Keyteki is a reference, not a template. Messages in particular are built from results, not intent.                                                                                                                                                                                                              |
| 2026-10-20 | Manual corrections (`/power`, `/token`, stat changes) are plain corrections and raise no game events.                                                                                                                                                                                                           |
| 2026-10-20 | Attachments and duplicates removed because their card left play can't be saved (Rules Reference: Leaves Play, Save).                                                                                                                                                                                            |
| 2026-10-20 | Fake waits cover every prompted window for now (cancels, interrupts, reactions), to be reviewed after feedback. They last a random 1 to 3 seconds and show a Pass button. Players using the cancel timer keep it.                                                                                               |
| 2026-10-20 | Action windows use the same offer, fake wait or skip decision, behind the opt-in "Strict action windows" game option until it has had feedback. Superseded 2026-10-20.                                                                                                                                          |
| 2026-10-20 | Action windows auto-pass when the only legal actions are on cards in play. A blocking prompt is only for a player holding an action they can play; a player who could hold one gets the same delay. On trial, then timed in a real game before it is the default. `promptedActionWindows` is a bluff stop only. |
| 2026-10-20 | A card is verified only when its spec passes with manual mode off and exercises every ability, and the implementation has no handler and no card-rules violations. The generator enforces the implementation bar.                                                                                               |
| 2026-10-20 | Phase 5 order is the shared neutrals, then a whole archetype. Across 153 Standard v2.1 joust lists, taking the most common card each time finishes none in the first 200 cards. Stark Fealty is the shortest.                                                                                                   |
| 2026-10-20 | Choices made while an effect resolves are game actions, added before the cards that need them are migrated.                                                                                                                                                                                                     |
| 2026-10-20 | Default `{gameAction}` messages for the common actions are done before cards are migrated in bulk.                                                                                                                                                                                                              |
| 2026-10-20 | An oscillating effect is reported and left in play. An infinite loop of optional abilities follows Rulings and Clarifications v4.0 (1.1): the player names a finite number of repetitions.                                                                                                                      |
| 2026-10-20 | Delayed effects resolve once, right after their event's handler and before When Revealed abilities and reactions (Rules Reference: Delayed Effects). They are not triggered abilities.                                                                                                                          |
| 2026-10-20 | Deepwood Motte: "a Raider character you control or Asha Greyjoy" lets you stand any Asha Greyjoy. "You control" qualifies the Raider character only; there is no ruling saying otherwise.                                                                                                                       |
| 2026-10-20 | While manual mode is on, the winner may skip claim and the defender may cancel military claim, because a wrongly applied claim is hard to undo. With manual mode off, claim is applied and neither prompt is offered.                                                                                           |
| 2026-10-20 | Phase 6 does not switch the default until the framework items in phases 1, 2, 4 and 5 each have an engine spec, and a list maps every Rules Reference entry, framework step and current FAQ ruling to a spec or an accepted decision.                                                                           |
| 2026-10-20 | Verified means a `setupTest` spec with no manual actions or harness shortcuts that resolves every ability on the card, enforced by the generator and the test run. Specs of cards that were verified under the earlier bar are rewritten, not carried over.                                                     |
| 2026-10-20 | Glossary entries that name a card type, a zone, an icon or a printed statistic are ordinary play. They are covered by the card suite, not by a separate framework spec. [framework-coverage.md](framework-coverage.md) lists them.                                                                              |
| 2026-10-20 | A FAQ entry that is about one card is covered by that card's spec once the card is verified. Until then it is a gap, even if the engine already plays the card.                                                                                                                                                 |
| 2026-10-20 | While strict action windows are off and no window is open, outside the marshaling phase, actions stay available. Marshaling, and any window that is actually open, refuse an action that is not that player's turn.                                                                                             |
