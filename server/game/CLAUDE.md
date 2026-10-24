# Game engine

Read [docs/engine-roadmap.md](../../docs/engine-roadmap.md) before changing anything here. Card
rules are in [cards/CLAUDE.md](cards/CLAUDE.md).

## Architecture

- **Game** ([game.js](game.js)): players, the game pipeline, events, ability windows and the
  effect engine.
- **GamePipeline** ([gamepipeline.js](gamepipeline.js)): a queue of steps. Steps queued while
  another step runs are added to that step's own pipeline, so they resolve before anything after it.
- **Phases** ([gamesteps](gamesteps)): one step per phase, built from the framework steps in the
  Rules Reference. Challenges run through [challengeflow.js](gamesteps/challenge/challengeflow.js).
- **Events** ([event.js](event.js), [gamesteps/eventwindow.js](gamesteps/eventwindow.js),
  [gamesteps/InterruptWindow.js](gamesteps/InterruptWindow.js)): every state change is an event.
  The window opens cancel interrupts, saves, forced interrupts and interrupts, runs the handler,
  then opens When Revealed, forced reactions and reactions. Every event and its parameters are
  listed in [Constants/Events.js](Constants/Events.js); outside production the game throws on
  events that aren't listed or don't match, so add an entry when you add or change an event.
- **Abilities** ([baseability.js](baseability.js), [cardaction.js](cardaction.js),
  [triggeredability.js](triggeredability.js),
  [gamesteps/abilityresolver.js](gamesteps/abilityresolver.js)): costs are paid, then targets are
  chosen, then `onCardAbilityInitiated` opens the window for cancels before the effect resolves.
  Whether an ability can be used comes from `getUnmetRequirement`, which returns a reason from
  [Constants/Requirements.js](Constants/Requirements.js); override it rather than
  `meetsRequirements`, which only wraps it.
- **GameActions** ([GameActions](GameActions)): the only supported way to change game state. Each
  action has `allow` (could this change the game state), `createEvent` and `message`.
- **Effects** ([effect.js](effect.js), [effectengine.js](effectengine.js), [effects.js](effects.js)):
  persistent and lasting effects, applied to targets and recalculated as the game state changes.
- **Player** ([player.js](player.js)) and **cards** ([basecard.js](basecard.js),
  [drawcard.js](drawcard.js), [plotcard.js](plotcard.js), [agendacard.js](agendacard.js)).

## Rules for engine changes

- Follow the Rules Reference. If a change makes the engine match the rules but breaks a card, fix
  the card.
- New state changes are `GameAction`s with an event, so interrupts, reactions, saves and cancels
  can see them. Don't add new legacy helpers on `Player` or `Game`.
- Don't add manual-mode style escape hatches (`force: true`, chat commands, direct state writes)
  to make something work.
- Decisions about prompting players must only use information visible to their opponents (phase 2
  of the roadmap).
- Prefer putting a guard or rule in the engine once over repeating it in every card.
- Add or update specs in `test/server` (outside `test/server/cards`) for every engine change, and
  run the whole suite afterwards, not just the affected specs.
- Update the docs in `docs/` when you change engine behaviour or the card API. Fix any outdated or
  wrong documentation you notice while you are there.

## When to ask

Ask before going ahead when:

- the card text or the Rules Reference allows more than one reading;
- the behaviour you need conflicts with how similar cards work;
- a fix could go in either the card or the engine;
- several unrelated tests fail, which suggests a wider problem;
- the card needs a mechanic or keyword the engine doesn't support yet.
