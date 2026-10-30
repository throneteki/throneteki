# Throneteki

Online implementation of A Game of Thrones: The Card Game (Second Edition).

- `server/game` is the rules engine; `server/game/cards` holds one file per card.
- `test/server` holds the specs; `test/helpers` holds the test harness; `test/tools` holds the card
  and coverage tools.
- `throneteki-json-data` is a submodule with card data and card text (`packs/<pack>.json`).
- `client` is the React front end.

### Key game concepts

- Each round has seven phases: plot, draw, marshaling, challenges, dominance, standing, taxation.
- **Plots** set each player's gold, initiative, claim and reserve for the round. The initiative
  winner chooses the first player, who goes first in each phase and orders simultaneous effects.
- **Gold** pays for marshaling characters, locations and attachments, and for playing events.
- **Challenges** (military, intrigue, power) are won by total STR. The winning attacker applies
  claim: military kills characters, intrigue discards cards at random from hand, power moves power.
- **Power** on the faction card and characters wins the game at 15. A player whose draw deck is
  empty is eliminated.
- **Kneeling** a card is how most costs and attacks are paid; everything stands in the standing
  phase.

## Guides

- [Engine reference](docs/engine.md): how the engine applies the rules, verified cards and manual
  mode, and the decisions and open work. Read it before changing anything under `server/game`
  other than a single card.
- [Engine guide](server/game/CLAUDE.md): architecture and rules for engine changes.
- [Card guide](server/game/cards/CLAUDE.md): rules for implementing cards.
- [Testing guide](test/CLAUDE.md): rules for specs. Reference: [docs/testing-cards.md](docs/testing-cards.md).
- [Docs index](docs/README.md), including the card API in
  [docs/implementing-cards.md](docs/implementing-cards.md).

## Rules

- The rules authority is the [Rules Reference](https://thronesdb.com/rulesreference). Card text
  takes precedence over the Rules Reference where they conflict.
- When engine behaviour and the Rules Reference disagree, the Rules Reference is right. Fix the
  engine, or raise it, rather than writing a card around the bug.
- Look up a card with `npm run card -- <code or name>` rather than relying on its name or memory.
  ThronesDB card pages (`https://thronesdb.com/card/<code>`) have rulings and FAQ entries.

## Engine principles

Games run with manual mode off when every card is verified, so the engine has to enforce the rules:

- Every state change goes through a `GameAction` (`server/game/GameActions`) so it raises events
  that interrupts and reactions can see. Don't change card or player state directly, and don't add
  new uses of the legacy `player.*` / `game.*` helpers.
- Trigger checks (`when`, `condition`, cost `canPay`) must have no side effects, and must not store
  state on the card instance.
- Never decide whether to prompt a player, or how long to wait, based on hidden information such as
  the cards in their hand.

## Tests

- Every implemented card must be verified: its spec uses `setupTest`, has no manual actions or
  harness shortcuts, and resolves every ability on the card, and the implementation has no
  `handler` and no `card-rules` violations. See [docs/engine.md](docs/engine.md). CI fails a pull
  request with a card that isn't (`npm run spec:coverage -- --check-verified`).
- Run a single spec with `npx vitest run test/server/cards/<pack>/<Card>.spec.js`.
- Games where every card is implemented start with manual mode off, so a card is only added once
  its spec meets that bar.
- Don't change existing tests unless asked. If a test looks wrong against the card text or the
  Rules Reference, explain why and ask first. The exception is an assertion that contradicts text
  you can quote from the card, the Rules Reference or a ThronesDB FAQ entry: correct only that assertion, quote the text
  in the commit message, and point the change out to the user.

## Existing code

When copying patterns from existing specs, prefer `setupTest` specs. Some engine specs still use
the older `integration(...)` style, which runs with manual mode on and is not a pattern for new
specs.

## Version control

- Don't commit, push or open pull requests without asking first.
- Branch names follow [conventional branch naming](https://conventional-branch.github.io/), with the
  issue number when there is one: `fix/123-card-name`, `feat/456-new-mechanic`.
- If a change you made is reverted, assume that was deliberate; don't reapply it without asking.

## Code style

- Don't add comments unless they explain something critical to understanding the code, such as a
  non-obvious constraint or a behaviour that would otherwise look like a bug. Don't add comments
  that restate what the code does, describe a change, or document the obvious.
- Card files start their class with the card's text as a generated comment. Don't edit it by hand:
  `npm run card-text -- --write` writes it, and a spec fails when it is out of date.
- The server and tests use ES modules (`import` / `export`).
- Game messages use `{0}`-style placeholders, never string concatenation or template literals.
