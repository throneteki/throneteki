# Engine roadmap: trusting the rules engine

## Goal

Today every game runs with what is effectively manual mode switched on: chat commands, drag and drop,
the stat buttons and click-to-kneel are always available, because the engine is not yet trusted to
follow the rules for every card. The goal is to reach the point where a game can run with manual
mode off, as keyteki does, because the engine can be shown to be correct.

Trust is earned per card, by tests:

- A card is **verified** when it has a passing spec that follows the conventions in
  [test/CLAUDE.md](../test/CLAUDE.md).
- A game in which every card in both decks is verified starts with manual mode **off**. Turning it on
  requires the opponent's consent and is recorded in the game stats.
- Every other game keeps today's behaviour.

As coverage grows, more games switch over automatically. Progress is a number we can watch, not a
judgement call.

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
   handler, they are migrated to game actions in phase 5. Lasting effects (`untilEndOfPhase` and
   so on) have no game action yet, which blocks migrating cards like Renly's Pavilion; that needs
   one.
3. **One way to change state.** _The ratchet is in place: `npm run card-rules` (run in CI) fails
   if a card file uses more legacy helpers, direct state writes, `addMessage` or `promptForSelect`
   than its baseline (on 2026-10-19: 578, 5, 1,207 and 115 uses in 1,065 files). The faction card
   now stands through an event. Taking control is a real event: `GameActions.takeControl` (and the
   legacy `game.takeControl`, which now resolves it) raises `onCardTakenControl` before control
   changes, with `oldController`, `player` and `source`, so interrupts can see it. Lasting
   "take control" effects change control at once through `game.takeControlByEffect` and raise the
   event afterwards._ Still to do: every state change goes through a `GameAction`. Whether manual
   corrections (`changeStat`, `/power`, `/token`) should raise events is an open question: they
   are corrections, and raising events would trigger reactions to them.
4. **Simultaneity.** _The standing phase is done: every player's cards, faction cards included, stand
   as one event._ The standing phase stands every player's cards in one batch. Attachments and
   duplicates leaving play become child events of the card leaving play.
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
    - A candidate could respond but the player has nothing: they see no prompt; the game waits a
      random delay drawn from the same range as a short decision, then passes for them. To the
      opponent this looks identical to a player who looked and passed.
4. **Pausing is a real opt-out.** _Done._ "Don't ask again until end of round" means the player is
   not offered the windows the cancel timer covers until the next round, even when they hold a
   legal cancel, so pausing reveals nothing
   ([CancelTimerPause.spec.js](../test/server/gamesteps/CancelTimerPause.spec.js)). A player who
   turns the timer off in their settings still leaks, since they are only prompted when they hold
   a cancel; steps 1 to 3 fix that.
5. **Player stops stay as an override.** A player can still choose to always stop at a window, for
   example to bluff. That choice does not depend on their hand, so it leaks nothing.
6. **Tests run with zero delay** through an injected delay function.

The same mechanism can replace `promptedActionWindows` for action windows: a player who could not
possibly act is skipped, a player who has nothing waits a short delay, and only a player with a legal
action is asked to click. Once every player with a legal action is guaranteed a window, actions
outside windows can be blocked.

What this needs from card code, required for all new and migrated cards from now on:

- Trigger checks (`when`, `condition`, cost `canPay`) must have no side effects and must work on a
  card that is not in the game.
- No state stored on the card instance between the trigger check and resolution; keep it on the
  ability context.
- The public check is only as good as the "could this change the game state" checks from phase 1.

Remaining tell: a human who holds a cancel and thinks about it takes longer than the random delay. That
is the same tell as at a real table, and is acceptable.

### Phase 3: messages built from results

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

Start once the card pool in the current format is covered by specs, because this change is the most
likely to cause regressions.

- Keep the card-facing `ability.effects.*` API so card code does not change. Internally, applying an
  effect registers a value on the target; getters compute stats from those values.
- After each event window, recalculate effects until nothing changes, and detect effects that keep
  switching back and forth.
- Migrate one stat at a time: strength (already part way there), icons, traits, keywords, dominance
  strength, blank, control.
- Removes the `order: 0/1000` and reverse-cancel workarounds.

### Phase 5: card migration

- Most-played cards first, using game stats. Each card gets a spec first, then moves from handlers,
  `promptForSelect` and `addMessage` to declarative `target` + `gameAction` + `then`.
- A verified card that turns up in manual-mode telemetry is a priority bug.

### Phase 6: switching the default

- Manual mode becomes a game flag. Chat commands, `changeStat`, drag and drop and click-to-kneel
  require it. With manual mode off, actions outside action windows are refused.
- Games where both decks are fully verified start with manual mode off; enabling it needs the
  opponent's consent and is recorded.
- `/cancel-prompt` and a "report a problem" action stay available. Using either records the cards
  involved and the game state, ready to load in the scenario runner.
- When manual mode is turned on, ask which card misbehaved, so manual mode doubles as bug reporting.

## Decisions

| Date       | Decision                                                                                                                                |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-10-19 | A card counts as verified when it has a passing spec that follows the test conventions.                                                 |
| 2026-10-19 | Hidden information: the priority is not revealing that a player holds a cancel. Window decisions use public information only (phase 2). |
| 2026-10-19 | Tests move from jasmine to vitest, modelled on keyteki's harness. Target: a spec for every implemented card.                            |
| 2026-10-19 | Keyteki is a reference, not a template. Messages in particular are built from results, not intent.                                      |
