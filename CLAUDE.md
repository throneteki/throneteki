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

- [Engine roadmap](docs/engine-roadmap.md): the plan for running games with manual mode off. Read
  it before changing anything under `server/game` other than a single card.
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

## Engine direction

We are working towards games that can run with manual mode off. In short:

- Every state change goes through a `GameAction` (`server/game/GameActions`) so it raises events
  that interrupts and reactions can see. Don't change card or player state directly, and don't add
  new uses of the legacy `player.*` / `game.*` helpers.
- Trigger checks (`when`, `condition`, cost `canPay`) must have no side effects, and must not store
  state on the card instance.
- Never decide whether to prompt a player, or how long to wait, based on hidden information such as
  the cards in their hand.

## Tests

- Every card that is added or changed needs a spec. A card only counts as verified when that spec
  uses `setupTest`, has no manual actions or harness shortcuts, and resolves every ability on the
  card, and the implementation has no `handler` and no `card-rules` violations. Old specs are
  rewritten, never carried over. See [docs/engine-roadmap.md](docs/engine-roadmap.md). CI fails a
  pull request that changes a card file without a spec.
- Run a single spec with `npx vitest run test/server/cards/<pack>/<Card>.spec.js`.
- After adding a card spec, run `npm run spec:coverage -- --write-verified` and commit
  `server/game/verifiedCards.json`. Games where every card is verified start with manual mode
  off, and CI checks the list is current.
- Don't change existing tests unless asked. If a test looks wrong against the card text or the
  Rules Reference, explain why and ask first.

## Existing code

When copying patterns from existing cards or specs, prefer the most recently written ones. Older
cards often predate `GameActions` and use patterns the guides now rule out, such as handlers that
change state directly and `addMessage` calls.

## Version control

- Don't commit, push or open pull requests without asking first.
- Branch names follow [conventional branch naming](https://conventional-branch.github.io/), with the
  issue number when there is one: `fix/123-card-name`, `feat/456-new-mechanic`.
- If a change you made is reverted, assume that was deliberate; don't reapply it without asking.

## Code style

- Don't add comments unless they explain something critical to understanding the code, such as a
  non-obvious constraint or a behaviour that would otherwise look like a bug. Don't add comments
  that restate what the code does, describe a change, or document the obvious.
- The server and tests use ES modules (`import` / `export`).
- Game messages use `{0}`-style placeholders, never string concatenation or template literals.
