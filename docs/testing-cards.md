# Testing cards

How to write specs for cards. The rules every spec must follow are in
[test/CLAUDE.md](../test/CLAUDE.md); this document is the reference for the test harness.

- [Overview](#overview)
- [Spec structure](#spec-structure)
- [setupTest](#setuptest)
- [Card references](#card-references)
- [Player actions](#player-actions)
- [Assertions](#assertions)
- [Coverage checklist](#coverage-checklist)
- [Common patterns](#common-patterns)
- [Running and debugging](#running-and-debugging)
- [Playing a test in the real client](#playing-a-test-in-the-real-client)

## Overview

Specs live in `test/server/cards/<pack>/<CardName>.spec.js`, next to the card implementation path.
They run on [Vitest](https://vitest.dev) with globals enabled, so `describe`, `it`, `expect` and
`vi` need no imports. Hooks and tests are plain `function () {}` callbacks so they can share state
on `this`; each test gets a fresh `this`.

## Spec structure

```javascript
describe('Confiscation', function () {
    describe('when there are attachments in play', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'plot',
                player1: {
                    plot: 'Confiscation',
                    inPlay: [{ card: 'Ser Jaime Lannister (Core)', attachments: ['Little Bird'] }]
                },
                player2: {
                    inPlay: [{ card: 'Eddard Stark (Core)', attachments: ['Bodyguard'] }]
                }
            });

            this.player1.selectPlot('Confiscation');
            this.player2.selectPlot('A Noble Cause');
            this.selectFirstPlayer(this.player1);
        });

        it("discards the chosen opponent's attachment", function () {
            this.player1.clickCard(this.bodyguard);

            expect(this.bodyguard.location).toBe('discard pile');
            expect(this.littleBird.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
```

## setupTest

`this.setupTest(options)` builds a two-player joust game by default. Set `gameFormat: 'melee'`
to build a three-player game, with `player3` accepting the same setup options as the other players.
For melee title specs, start with `phase: 'plot'`, reveal each player's plot, choose the first
player, and select each player's title before asserting draw and income effects.
Cards are placed during the setup phase,
where no abilities can trigger, then the game advances through the real game flow to the requested
phase.

```javascript
this.setupTest({
    phase: 'challenge', // 'setup' | 'plot' | 'marshal' (default) | 'challenge'
    firstPlayer: 'player1', // who the initiative winner picks as first player (default player1)
    player1: {
        faction: 'stark', // default 'stark'
        agenda: 'Fealty', // or an array for Alliance and its banners, or { card, tokens }
        plot: 'Filler Plot', // revealed in round 1 (default 'Filler Plot': income 5, initiative 0, claim 1, reserve 6, no text)
        plotDeck: ['Sneak Attack'], // the rest of the plot deck (default: two more 'Filler Plot')
        usedPlots: ['A Noble Cause'], // already in the used pile when the game starts
        inPlay: [
            'Winterfell Steward',
            {
                card: 'Eddard Stark (Core)',
                kneeling: true,
                power: 2,
                gold: 1, // gold on the card, e.g. bestow
                tokens: { poison: 1 },
                dupes: 1,
                attachments: ['Ice', { card: 'Condemned', owner: 'player2' }]
            }
        ],
        hand: ['Winter Is Coming'], // exactly these cards
        drawDeck: ['Robb Stark (Core)'], // placed on top of the deck in this order
        deck: ['The Crag (TSoW)'], // in the deck but not arranged, for agendas that search it
        discard: [],
        deadPile: [],
        shadows: [],
        gold: 3, // gold pool when setupTest returns
        power: 4, // power on the faction card
        factionKneeling: true
    },
    player2: {
        // same options
    },
    beforeMulligan() {
        // answer prompts from agendas that resolve "after all agendas are announced"
        this.player1.clickCard(this.theCrag);
    }
});
```

Things to know:

- Card names can include the pack to pick a printing: `'Eddard Stark (Core)'`. Without it, the
  earliest printing is used and a warning lists the others.
- The draw deck is padded with 20 copies of **House Maester (WotN)**, a neutral character with no
  text, so drawing never decks a player. Filler that is drawn during setup is taken out of hand again,
  so `hand` is exactly what you list.
- An attachment's `owner` decides which player's deck it comes from and who controls it; by
  default that is the host card's player.
- `gold` is applied when `setupTest` returns. In the marshaling phase the second player still
  collects income when their turn starts, on top of this.
- The plots must not have When Revealed abilities that prompt, unless you use `phase: 'plot'` and
  reveal the plots in the test. `setupTest` throws if the game can't reach the requested phase.
- For the dominance, standing and taxation phases, use `phase: 'challenge'` and call
  `this.completeChallengesPhase()`. Those phases have no prompt to stop at with default settings,
  and what you usually want to test (dominance being determined, cards standing) happens as they
  start.
- `phase: 'setup'` stops at "Select setup cards" with your `hand` arranged; `inPlay` isn't allowed,
  because placing setup cards is what such a test is for.
- An agenda that resolves "after all agendas are announced" (The House With the Red Door) prompts
  before the mulligan. Answer it in `beforeMulligan`, where the agendas and each player's `deck`
  cards are already named; `setupTest` throws if that prompt is left open or there is no
  `beforeMulligan`. The setup then continues as normal, to any phase.
- Only joust is supported. For melee, use the older `integration({ gameFormat: 'melee' }, ...)`
  style for now.

### Recommended filler cards

Use cards with no text so they can't interact with the card under test:

| Faction   | Card                    | Notes                                                 |
| --------- | ----------------------- | ----------------------------------------------------- |
| Neutral   | `House Maester`         | 2 STR, intrigue and power, _Maester_                  |
| Baratheon | `Bastard in Hiding`     | 2 STR, military and power, _Bastard_                  |
| Martell   | `House Dayne Knight`    | 2 STR, military and intrigue, _House Dayne_, _Knight_ |
| Stark     | `Tumblestone Knight`    | 2 STR, military and power, _House Tully_, _Knight_    |
| Tyrell    | `Courtesan of the Rose` | 2 STR, intrigue and power, _Companion_, _Spy_         |

Winterfell Steward and Lannisport Merchant are cheap and simple, but each has a Marshaling Action.
Check the text of anything else you add, and remember traits, icons and printed cost matter to many
conditions.

## Card references

Every card listed in `setupTest` is available on `this` under its camelCased name, without the
pack suffix and without punctuation:

| Card                  | Reference                |
| --------------------- | ------------------------ |
| `Eddard Stark (Core)` | `this.eddardStark`       |
| `The Hand's Judgment` | `this.theHandsJudgment`  |
| `Hear Me Roar!`       | `this.hearMeRoar`        |
| `Ser Jaime Lannister` | `this.serJaimeLannister` |

If the same name appears more than once, the reference points at the first one found, starting
with player 1's cards in play. Look other copies up explicitly:

```javascript
this.stewardInPlay = this.player1.findCardByName('Winterfell Steward', 'play area');
this.stewardInHand = this.player1.findCardByName('Winterfell Steward', 'hand');
```

Other references:

- `this.player1`, `this.player2`: the player interaction wrappers used for actions and assertions.
- `this.player1.player` (or `this.player1Object`): the engine's `Player`, for state such as
  `.gold`, `.hand`, `.faction.power`, `.getTotalPower()`.
- `this.game`: the `Game`.

## Player actions

```javascript
// Prompts
this.player1.clickPrompt('Done');
this.player1.clickCard(this.eddardStark); // select, play, marshal or use, depending on the prompt
this.player1.clickCard('Eddard Stark', 'hand'); // by name and location
this.player1.clickMenu(this.card, 'Menu item text');
this.player1.triggerAbility("The Hand's Judgment"); // in an interrupt or reaction window

// Plots and first player
this.player1.selectPlot('Confiscation');
this.selectFirstPlayer(this.player1);
this.selectPlotOrder(this.player1); // when both plots have When Revealed abilities

// Phases
this.completeMarshalPhase();
this.completeChallengesPhase();
this.completeDominancePhase();
this.completeStandingPhase();
this.completeTaxationPhase();
this.skipActionWindow(); // each player passes the current action window

// Other prompts
this.player1.nameTrait('Knight');
this.player1.nameCard('Tithe');
this.player1.selectValue('3');
this.player1.discardToReserve();
```

### Running a challenge

```javascript
this.player1.clickPrompt('Military');
this.player1.clickCard(this.eddardStark);
this.player1.clickPrompt('Done');
this.skipActionWindow();

this.player2.clickCard(this.robbStark);
this.player2.clickPrompt('Done');
this.skipActionWindow();
// claim and keywords resolve from here
```

`this.unopposedChallenge(this.player1, 'Military', this.eddardStark)` does all of that for an
undefended challenge.

## Assertions

```javascript
// The flow completed and the player can act normally (end every test with this)
expect(this.player1).isReadyToTakeAction();

// Prompts
expect(this.player1).toHavePrompt('Select an attachment');
expect(this.player1).toHavePromptButton('Done');
expect(this.player1).toHaveDisabledPromptButton('Military');

// Selecting and triggering
expect(this.player1).toBeAbleToSelect(this.bodyguard); // exact card
expect(this.player1).not.toBeAbleToSelect(this.eddardStark);
expect(this.player2).toAllowAbilityTrigger("The Hand's Judgment");

// Why an action can't be used: 'phase', 'cost', 'target', 'limit', ... or undefined
// (the reasons are in server/game/Constants/Requirements.js)
expect(this.player1.actionUnavailableReason(this.greyWind)).toBe('cost');

// Card state
expect(this.eddardStark.location).toBe('dead pile');
expect(this.eddardStark.kneeled).toBe(false);
expect(this.eddardStark.power).toBe(1);
expect(this.eddardStark.getStrength()).toBe(5);
expect(this.eddardStark).toBeControlledBy(this.player2);
expect(this.ice.parent).toBe(this.eddardStark);

// Player state
expect(this.player1.player.gold).toBe(4);
expect(this.player1.player.faction.power).toBe(2);
expect(this.player1.player.hand.length).toBe(3);
```

To check what an ability did, rather than how it was worded, use the structured log. Each ability
message adds an entry to `this.game.logEntries`: `{ type, player, source, targets, results }`,
where `type` is `'ability'` for the full message or `'abilityInitiated'` for the plain "uses/plays"
line of an ability that was cancelled or prevented, and `results` lists the events that resolved
(`{ event, card, player, amount }`). Compare cards with `toBe`, not `toEqual`.

```javascript
const entry = this.game.logEntries.findLast((entry) => entry.type === 'ability');
expect(entry.source).toBe(this.bastardInHiding);
expect(entry.results.map((result) => result.card)).toContain(this.houseDayneKnight);
```

`isReadyToTakeAction` checks there is no open ability window and that the player has the normal
prompt for the phase: "Select a plot", "Marshal your cards", the challenge choice (or the action
window while a challenge is under way), or "Initiate an action".

## Coverage checklist

Walk through this for every spec:

1. **Positive case**: the ability does what the card says.
2. **Negative case**: when the condition or trigger isn't met, nothing happens and the ability
   isn't offered.
3. **Boundaries**: for any number in the text, test exactly N and either side of it.
4. **Targets**: for every card in the setup, assert whether it can be chosen. Include cards that
   fail each part of the condition (type, controller, trait, faction, location, standing or
   kneeling, unique) so the negative assertions mean something.
5. **Effects on everything**: assert the state of every card in the setup after the ability, on both
   sides, including cards that must not change.
6. **Side of the board**: persistent effects that affect "your" or "opponent's" cards are checked
   against the other side too.
7. **Bystanders**: reactions and interrupts are tested with a card that doesn't meet the trigger.
8. **"Then"**: the second part doesn't happen if the first doesn't resolve.
9. **Saves, cancels and immunity**: where plausible, check the card against a save (dupes,
   Bodyguard), a cancel (The Hand's Judgment) or immunity.
10. **Limits**: abilities with "Limit X per phase/round" are tested at the limit.
11. **No leftover prompts**: every test ends with `isReadyToTakeAction`.

## Common patterns

### When Revealed

Use `phase: 'plot'`, then select both plots and the first player. The ability resolves as soon as
the first player is chosen (see [Confiscation.spec.js](../test/server/cards/01-Core/Confiscation.spec.js)).

### Actions

```javascript
this.player1.clickMenu(this.card, 'Menu item text'); // menu actions
this.player1.clickCard(this.card); // actions activated by clicking the card
```

When an action shouldn't be available, assert the reason with `actionUnavailableReason` rather
than only checking that nothing happened: it shows the action failed for the right reason, not
because, say, a target was missing. Pass the action's title when the card has more than one.

### Reactions and interrupts

Cause the triggering event, then assert the window:

```javascript
expect(this.player1).toAllowAbilityTrigger(this.card);
this.player1.triggerAbility(this.card);
```

And in the negative test:

```javascript
expect(this.player1).not.toAllowAbilityTrigger(this.card);
```

### Different board states

Use separate `describe` blocks with their own `setupTest` rather than changing state mid-test, and
don't call `setupTest` again in a nested `describe`.

## Running and debugging

```bash
npm test                                                    # everything
npx vitest run test/server/cards/01-Core/Confiscation.spec.js
npx vitest run -t 'Confiscation'                            # by name
DEBUG_TEST=1 npx vitest run test/server/cards/01-Core/Confiscation.spec.js
```

`DEBUG_TEST=1` prints the game log after each test.

Common failures:

- **Couldn't click on "X"**: the button isn't in the current prompt. The error lists the prompt.
  Most often an earlier step left a prompt open.
- **setupTest could not find an unused copy**: the card is listed in more places than the deck
  holds. Every listing adds one copy, so check spelling and pack suffixes.
- **setupTest expected to reach the X phase**: something in the setup is prompting (often a plot's
  When Revealed). Start in an earlier phase and resolve it in the test.

Inspecting state:

```javascript
console.log(this.player1.formatPrompt());
console.log(this.game.getPlainTextLog());
```

## Playing a test in the real client

The scenario runner starts a game node with a game already in the state of one test, so you can
reproduce a bug or try a card in the browser.

1. Start the lobby as usual, and create two accounts if you don't have them.
2. Start a game node with the scenario and the two accounts that will play player 1 and player 2:

    ```bash
    SCENARIO='test/server/cards/01-Core/Confiscation.spec.js#allows any attachment'         SCENARIO_USERS=alice,bob node server/gamenode
    ```

    In PowerShell, set `$env:SCENARIO` and `$env:SCENARIO_USERS` first.

3. Log in as either account; the lobby hands you straight to the game.

The part after `#` picks the test: a case-insensitive part of its name (the describe and it labels
joined with spaces). Without it, the first test in the file is used. The test's hooks and body run
as written, except that `expect` does nothing, so the game is left wherever the test leaves it.

- Put `this.scenarioBreak();` in the test to stop at that point instead. It does nothing under
  vitest, but don't commit it: [scenarioBreaks.spec.js](../test/server/scenarioBreaks.spec.js) fails
  if any spec contains one.
- Saving the spec file rebuilds the game in place; players stay connected.
- If the test fails part way through, the game is kept as it was at the failure, with an alert
  showing the error.
