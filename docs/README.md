# Throneteki documentation

## Working on the engine

- [Engine reference](engine.md): how the engine applies the rules, verified cards and manual mode,
  decisions and open work. Read this before changing the engine.
- [Framework coverage](framework-coverage.md): Rules Reference, Appendix I and FAQ entries, and
  where each one is covered or still open.
- [Implementing cards](implementing-cards.md): the card API, with examples.
- [Testing cards](testing-cards.md): the test harness, `setupTest`, assertions and the coverage
  checklist.

## Other

- [Database](database.md)

## Tools

| Command                          | What it does                                                                                                                                                                     |
| -------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm test`                       | Runs every spec except the database specs.                                                                                                                                       |
| `npm run test:db`                | Runs the database specs. Needs Postgres.                                                                                                                                         |
| `npm run card -- <code or name>` | Prints a card's text and data, its implementation file and its spec.                                                                                                             |
| `npm run spec:new -- <code>`     | Creates a spec skeleton for an implemented card.                                                                                                                                 |
| `npm run card-rules`             | Fails if a card file uses a pattern cards must not use (legacy helpers, direct state writes, `addMessage`, `promptForSelect`, `this` in an ability). `-- --report` gives totals. |
| `npm run spec:coverage`          | Shows how many implemented cards have a spec, per pack. `--missing` lists the cards without one; `--changed <base>` fails if cards changed since `<base>` have no spec.          |
