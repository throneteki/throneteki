# Implementing cards

The full API guide is [docs/implementing-cards.md](../../../docs/implementing-cards.md). These are
the rules every new or changed card must follow. They exist so the engine can check the card
against the rules, which is what lets a game run with manual mode off
(see [docs/engine-roadmap.md](../../../docs/engine-roadmap.md)).

## Before writing code

- Read the card text in `throneteki-json-data/packs/<pack>.json`. Don't work from the card name or
  from memory.
- Check the [Rules Reference](https://thronesdb.com/rulesreference) for every keyword and timing
  word in the text ("choose", "then", "cancel", "if able", "up to", "instead", "each").
- Write or update the spec first (see [test/CLAUDE.md](../../../test/CLAUDE.md)). A card is not
  verified until that spec passes under the rules in the engine roadmap, and the implementation has
  no `handler` and no `card-rules` violations.

## Rules

1. **Change state only through `GameActions`.** Use `gameAction: GameActions.x(...)` on the
   ability, or `this.game.resolveGameAction(GameActions.x(...), context)` inside a handler.
    - Don't assign to card, player or game state (`card.power = `, `card.kneeled = `, `player.gold += `).
    - Don't add new calls to the legacy helpers: `player.kneelCard`, `player.standCard`,
      `player.moveCard`, `game.addPower`, `game.addGold`, `game.transferGold`, `game.takeControl`,
      `game.killCharacter`, `player.discardCard(s)`, `player.drawCardsToHand`. If no `GameAction`
      exists for what the card needs, add one under `server/game/GameActions` rather than working
      around it.
2. **Prefer declarative abilities.** Use `gameAction`, `choices`, `.then(...)` and `message` instead of
   a `handler` wherever the API allows it. A `target` can be combined with a `gameAction` that acts
   on `context.target`: cards the game action couldn't change are then not valid targets, so the
   `cardCondition` shouldn't repeat checks the action already makes (standing, immunity, location).
   See [Confiscation.js](01-Core/Confiscation.js). An ability with more than one target, or that
   chooses a card while the effect is resolving, uses a game action for that choice. A `handler`
   leaves the card unverified.
3. **"Choose" means target.** Use the `target` / `targets` property, not `promptForSelect` inside a
   handler, so immunity and target validation apply. Use `type: 'select'` for selections that the card
   text doesn't phrase as "choose". A choice made while the effect is resolving (an opponent
   chooses, each player chooses, a choice after part of the effect) is a game action too. If the
   action does not exist yet, add it under `server/game/GameActions` rather than writing a `handler`.
4. **Trigger checks have no side effects.** `when` handlers, `condition`, `cardCondition` and cost
   checks may be called many times, for hypothetical cards, or not at all. They must not change state,
   send messages, or store anything on the card instance. Keep per-resolution data on the ability
   context instead.
5. **Respect "could this change the game state".** If an ability's effect could do nothing in the
   current state, give it a `condition` so it isn't offered. Abilities that do nothing must not be
   triggerable.
6. **"Then".** Use `.then(...)` on the `GameAction` so the second part only resolves if the first
   resolved in full.
7. **Messages.** Use the ability's `message` property, not `this.game.addMessage`. Follow the language
   rules at the end of the implementing-cards guide: start with the player, present tense, no final
   punctuation.
8. **Delayed effects.** For "if X happens later" text, use `GameActions.delayedEffect`; don't
   listen for game events with `this.game.on` or `this.game.once`. Apply lasting effects inside a
   `gameAction` with `GameActions.lastingEffect`.
9. **No manual workarounds.** Don't leave parts of a card for players to handle with chat commands. If
   something can't be implemented properly, stop and say what engine support is missing.

## Checks

`npm run card-rules` counts the patterns above that are being phased out, per card file, and CI
fails if any file uses more of them than it did before. When a change removes some, run
`npm run card-rules -- --update` to lock the lower count in.

## File layout

- One file per card in `server/game/cards/<cycle>-<pack>/<CardName>.js`, exporting a default class
  with a static `code` that matches the card's code in the JSON data.
- Characters, locations, attachments and events extend `DrawCard`; plots extend `PlotCard`; agendas
  extend `AgendaCard`.
