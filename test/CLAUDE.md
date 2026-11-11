# Testing guide

Every implemented card must be verified (see [docs/engine.md](../docs/engine.md)), which means
all of these hold:

- The spec uses `setupTest`, passes, and follows this guide. `setupTest` games run with manual mode
  off and throw if the test uses a manual action (a chat command, dragging a card, clicking a card
  that has nothing to use, changing a stat). A spec that uses `integration(`, `buildDeck`,
  `moveCard`, `dragCard`, mocks, or assigns `kneeled`, `power` or `gold` can never verify a card.
- The spec resolves every ability on the card: every action, triggered ability and persistent
  effect. The run fails if any of them never resolves (or never applies) during its spec.
- The card file has no `handler` and no `card-rules` violations.

`npm run spec:coverage -- --check-verified` checks the spec's style and the implementation for
every card, and CI runs it.

The full reference, with examples, is [docs/testing-cards.md](../docs/testing-cards.md).

## Commands

- All specs: `npm test`
- One file: `npx vitest run test/server/cards/<pack>/<CardName>.spec.js`
- By name: `npx vitest run -t '<pattern>'`
- Print the game log after each test: set `DEBUG_TEST=1`. Only use it when you need to trace game
  state, not to check pass or fail.
- Database specs (`test/server/db-integration`) need Postgres and run separately with
  `npm run test:db`. Nothing else may need a database.

When a run fails, read the full output rather than piping it through `grep` or `tail`.

## Writing card specs

- One file per card: `test/server/cards/<pack>/<CardName>.spec.js`, matching the card's
  implementation path. Example: [Confiscation.spec.js](server/cards/01-Core/Confiscation.spec.js).
- Only create spec files under `test/`. Follow the existing patterns: no imports, `function ()`
  callbacks (not arrow functions) so `this` works.
- Read the card text in `throneteki-json-data/packs/<pack>.json` first. Also check the text of every
  other card you put in the setup, so their abilities don't interfere.
- New specs use `this.setupTest(...)`. The older `integration(...)` + `buildDeck` style still works
  for existing specs; don't add new ones in that style.

## Setup

- Keep the setup minimal: only the cards, gold and power the test needs.
- When a card has more than one printing, name it with its pack code (`'Grey Wind (Core)'`).
  `setupTest` throws on a name that matches more than one card.
- `setupTest` places cards during the setup phase, where nothing can trigger, then reaches the
  requested phase through the real game flow. Pick the phase where the card's ability is used
  (`phase: 'plot'` for plots, `'challenge'` for challenge abilities, and so on).
- Don't use harness shortcuts (`moveCard`, `dragCard`, assigning `kneeled`, `power` or `gold`)
  once the test is under way. They bypass events and can hide bugs. Drive changes with real cards
  and prompts. Shortcuts are only for setup, before the first action.
- Never give two cards with the same name to different players or zones unless the test needs it.
  The automatic `this.<cardName>` reference only points to one of them. When you need both, look
  them up explicitly with `this.player1.findCardByName(name, location)`.
- Avoid cards with keywords or abilities that could interfere (stealth, renown, reactions to
  common events) unless that interaction is what you are testing.

## Assertions

- **Every test must end with `expect(this.<player>).isReadyToTakeAction();`** for the player who
  should act next. It is the only assertion that proves the ability finished and left no prompt
  open. Leftover prompts are the most common cause of tests that pass for the wrong reason.
- Each `it(...)` describes the specific scenario it checks. Not "works" or "ability".
- Cover the positive case, the negative case (the condition isn't met, so nothing happens), and
  boundaries for any number in the text (exactly N, N - 1, N + 1).
- **Unavailable actions:** when an action can't be used, assert why with
  `this.player1.actionUnavailableReason(card)` (`'phase'`, `'cost'`, `'target'`, `'limit'`, ...), so
  the test fails if it becomes unavailable for some other reason.
- **Targets:** when an ability chooses a card, assert `toBeAbleToSelect` /
  `not.toBeAbleToSelect` for every card in the setup before clicking. The setup must include
  cards that fail each part of the target condition (wrong type, wrong controller, wrong trait,
  wrong location, kneeling when it must be standing, and so on), otherwise the negative assertions
  prove nothing.
- **Effects:** assert the result on every card in the setup, including the ones that shouldn't
  change, on both sides of the board. For persistent effects, check the effect doesn't apply to the
  wrong side (a card that affects opponents must leave its controller's cards alone).
- **Reactions and interrupts:** include a bystander that does not meet the trigger and assert it
  is unaffected. Check the ability is offered (`toAllowAbilityTrigger`) when it should be and not
  when it shouldn't.
- **"Then":** test that the second part doesn't happen when the first part fails to resolve.
- **Saves, cancels and immunity:** when the card kills, discards or targets, include at least one
  test against a card that can be saved, cancelled or is immune, when such interactions are
  plausible.
- **Hidden information:** when the test involves cards in hand or shadows, assert what the opponent
  is and isn't prompted for.
- Use `toBeAbleToSelect` (matches the exact card) in new specs. The older `toAllowSelect` matches
  by name and exists for older specs.

## Modifying existing specs

Never change an existing spec unless asked. Specs describe the expected behaviour, and changing
them can hide bugs. If a spec looks wrong against the card text or the Rules Reference, explain why
and ask before changing it.

The exception is an assertion that contradicts text you can quote from the card, the Rules
Reference or a ThronesDB FAQ entry. Correct only that assertion, quote the text in the commit message, and point the change
out to the user. A reading of the rules, a ruling you can't cite, or engine behaviour that would be
easier to test is not enough.

## Engine changes

When you change the engine (anything in `server/game` outside `cards/`), add or update specs for
the engine behaviour in `test/server` outside `test/server/cards`, then run the whole suite.
