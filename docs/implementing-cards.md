## Implementing Cards

### Getting started

To implement a card, follow these steps:

##### 1. Create a file named after the card.

Cards are organized under the `/server/game/cards` directory by grouping them by "\<cycle number>-\<pack code>". Each word in the file name should be capitalized.

```
/server/game/cards/01-Core/NobleLineage.js
/server/game/cards/02.2-TRtW/UnswornApprentice.js
```

#### 2. Create a class for the card and export it.

Character, location, event and attachment cards should be derived from the `DrawCard` class.

Plot cards should be derived from the `PlotCard` class.

Agenda cards should be derived from the `AgendaCard` class.

The card class should have its `code` property set to the unique card identifier for that card. You can find these combining the 2-digit pack number (01) and 3-digit card number (036), or on [thronesdb.com](https://thronesdb.com/) by looking at the URL for the specific card.

```javascript
import DrawCard from '../../drawcard.js';

class NobleLineage extends DrawCard {
    // Card definition
}

NobleLineage.code = '01036';

export default NobleLineage;
```

#### 3. Override the `setupCardAbilities` method.

Persistent effects, actions, and triggered abilities should be defined in the `setupCardAbilities` method. This method passes in an `ability` parameter that gives you access to effect implementations and ability limits. See below for more documentation.

```javascript
class NobleLineage extends DrawCard {
    setupCardAbilities(ability) {
        // Declare persistent effects, reactions and interrupts here.
    }
}
```

Then run `npm run card-text -- --write`, which adds the card's text as a comment at the top of the
class.

### Keywords

Keywords are automatically parsed from the card text. It isn't necessary to explicitly implement them unless they are provided by a conditional persistent effect (e.g. Ser Jaime Lannister's military-only renown).

### Plot modifiers

Cards with plot modifier icons need to be declared when setting up the card using the `plotModifiers` method. The method takes an object that can have three properties: `gold` to modify the plot's gold value, `initiative` to modify the plot's initiative value, and `reserve` to modify the plot's reserve value. While most cards only provide a single modifier, it's possible to declare multiple values when appropriate.

```javascript
// The Arbor provides +3 gold.
this.plotModifiers({
    gold: 3
});

// The God's Eye provides both +1 gold and +1 reserve
this.plotModifiers({
    reserve: 1,
    gold: 1
});
```

### Attachment restrictions

Attachments often have restrictions on what cards they can be used on. For example, Bodyguard can only be attached to a character with a **Lord** or **Lady** trait. These restrictions can be defined using the `attachmentRestriction` method and passing the appropriate target specification object. By default, it's assumed that the attachment target is a character. Some examples:

```javascript
// Bodyguard - has either a 'Lord' or 'Lady' trait.
this.attachmentRestriction({ trait: ['Lord', 'Lady'] });
// Attainted - opponent character only
this.attachmentRestriction({ controller: 'opponent' });
// Breaker of Chains - unique Targaryen characters
this.attachmentRestriction({ faction: 'targaryen', unique: true });
// Improved Foritifications - locations instead of characters
this.attachmentRestriction({ type: 'location' });
```

If an attachment has two mutually exclusive restrictions, you can pass multiple objects into the method.

```javascript
// The Silver Steed
this.attachmentRestriction(
    // Has trait 'Dothraki'
    { trait: 'Dothraki' },
    // OR is named Daenerys Targaryen
    { name: 'Daenerys Targaryen' }
);
```

For more complicated restrictions or restrictions that can't be checked with the target specification object, you can pass a function into `attachmentRestriction` instead. **Note** - if you do this, you need to explicitly check card type:

```javascript
// Ward - character with cost 4 or less
this.attachmentRestriction((card) => card.getType() === 'character' && card.getPrintedCost() <= 4);
```

### Persistent effects

Many cards provide continuous bonuses to other cards you control or detrimental effects to opponents cards in certain situations. These can be defined using the `persistentEffect` method. Cards that enter play while the persistent effect is in play will automatically have the effect applied, and cards that leave play will have the effect removed. If the card providing the effect becomes blank, the effect is automatically removed from all previously applied cards.

For a full list of properties that can be set when declaring an effect, look at `/server/game/effect.js`. Here are some common scenarios:

#### Matching conditions vs matching specific cards

The effect declaration takes a `match` property. In most cases this will be a function that takes a `Card` object and should return `true` if the effect should be applied to that card.

```javascript
// Each Drowned God character you control gets +1 STR.
this.persistentEffect({
    match: (card) => card.getType() === 'character' && card.hasTrait('Drowned God'),
    effect: ability.effects.modifyStrength(1)
});
```

In some cases, an effect should be applied to a specific card. While you could write a `match` function to match only that card, you can provide the `Card` object as a shorthand.

```javascript
// While you control another Bloodrider character, Jhogo gains stealth.
this.persistentEffect({
    condition: (context) =>
        context.source.controller.anyCardsInPlay(
            (card) => card !== context.source && card.hasTrait('Bloodrider')
        ),
    match: this,
    effect: ability.effects.addKeyword('stealth')
});
```

#### Conditional effects

Some effects have a 'when', 'while' or 'if' clause within their text. These cards can be implemented by passing a `condition` function into the persistent effect declaration. The effect will only be applied when the function returns `true`. If the function returns `false` later on, the effect will be automatically unapplied from the cards it matched.

The condition gets a context with `game` and `source`, so it can use the card without `this`.

```javascript
// While Arya Stark has a duplicate, she gains a military icon.
this.persistentEffect({
    condition: (context) => context.source.dupes.length >= 1,
    match: (card, context) => card === context.source,
    effect: ability.effects.addIcon('military')
});
```

#### Targeting opponent or all matching cards

By default, an effect will only be applied to cards controlled by the current player. The `targetController` property can be modified to specify which players' cards should be targeted.

To target only opponent cards, set `targetController` to `'opponent'`:

```javascript
// While Unsullied is attacking, each defending character gets -1 STR.
this.persistentEffect({
    condition: (context) =>
        context.game.isDuringChallenge({
            match: (challenge) => challenge.isAttacking(context.source)
        }),
    match: (card, context) =>
        context.game.isDuringChallenge({ match: (challenge) => challenge.isDefending(card) }),
    targetController: 'opponent',
    effect: ability.effects.modifyStrength(-1)
});
```

To target all cards regardless of who controls them, set `targetController` to `'any'`:

```javascript
// Treat each character as if its printed text box were blank (except for Traits).
this.persistentEffect({
    match: (card) => card.getType() === 'character',
    targetController: 'any',
    effect: ability.effects.blankExcludingTraits
});
```

#### Dynamic strengths

A few cards provide strength bonuses based on game state. For example, Core Tywin's strength is based on the amount of gold the player currently has. A `dynamicStrength` effect exists that takes a function to determine what the strength bonus is currently.

```javascript
// Tywin Lannister gets +1 STR for each gold in your gold pool.
this.persistentEffect({
    match: this,
    effect: ability.effects.dynamicStrength((card) => card.controller.gold)
});
```

#### Attachment-based effects

A `whileAttached` method is provided to define persistent effects that are applied to the card an attachment is attached. These effects remain as long as the card is attached to its parent and the attachment has not been blanked.

```javascript
// Attached character gains a power icon.
this.whileAttached({
    effect: ability.effects.addIcon('power')
});
```

If the effect has an additional requirement, an optional `match` function can be passed in.

```javascript
// If attached character is Joffrey Baratheon, he gains a military icon.
this.whileAttached({
    match: (card) => card.name === 'Joffrey Baratheon',
    effect: ability.effects.addIcon('military')
});
```

#### Applying multiple effects at once

As a shorthand, it is possible to pass an array into the `effect` property to apply multiple effects that have the same conditions / matching functions.

```javascript
// During a challenge in which you are the defending player, Bronn gains a military, an intrigue, and a power icon.
this.persistentEffect({
    condition: (context) =>
        context.game.isDuringChallenge({ defendingPlayer: context.source.controller }),
    match: this,
    effect: [
        ability.effects.addIcon('military'),
        ability.effects.addIcon('intrigue'),
        ability.effects.addIcon('power')
    ]
});
```

#### Applying effects to cards in hand

By default, effects will only be applied to cards in the play area. Certain cards effects refer to cards in your hand, such as reducing their cost or providing ambush to matching cards. In these cases, set the `targetLocation` property to `'hand'`.

```javascript
// Each Direwolf card in your hand gains ambush (X). X is that card's printed cost.
this.persistentEffect({
    // Explicitly target the effect to cards in hand.
    targetLocation: 'hand',
    match: (card) => card.hasTrait('Direwolf'),
    effect: ability.effects.gainAmbush()
});
```

#### Player modifying effects

Certain cards provide bonuses or restrictions on the player itself instead of on any specific cards. Such effects can be implemented setting the `targetType` to `'player'`.

```javascript
mayInitiateAdditionalChallenge: function(challengeType) {
    targetType: 'player',
    // ...
}
```

```javascript
// You may initiate an additional  challenge during the challenges phase.
this.persistentEffect({
    targetController: 'current',
    effect: ability.effects.mayInitiateAdditionalChallenge('military')
});
```

`mayInitiateAdditionalChallenge(type, opponentPredicate)` optionally restricts the opponent.
The predicate receives `(opponent, context)`, where `context.source` is the card providing the
effect. Each affected player has an independent allowance, and removing and reapplying the same
effect preserves whether that allowance has been used.

### Lasting effects

Unlike persistent effects, lasting effects are typically applied during an action, reaction or interrupt and expire after a specified period of time. Because lasting effects can be applied almost anywhere, each method takes a factory function that provides the `ability` object and should return the effect properties. The properties returned when applying these effects are identical to those of persistent effects, but additional methods are provided to apply them immediately with the correct duration.

**Important: These should not be used within setupCardAbilities, only within handler code for actions and triggered abilities.**

To apply an effect to last until the end of the current challenge, use `untilEndOfChallenge`:

```javascript
// Until the end of the challenge, the character this is attached to gains +3 STR
this.untilEndOfChallenge((ability) => ({
    match: (card) => card === this.parent,
    effect: ability.effects.modifyStrength(3)
}));
```

To apply an effect to last until the end of the current phase, use `untilEndOfPhase`:

```javascript
// Until the end of the phase, the current player can initiate an additional power challenge.
this.untilEndOfPhase((ability) => ({
    targetController: 'current',
    effect: ability.effects.mayInitiateAdditionalChallenge('power')
}));
```

To apply an effect that will expire 'at the end of the phase', use `atEndOfPhase`:

```javascript
// At the end of the phase, if card is still in play discard it from play (cannot be saved)
this.atEndOfPhase((ability) => ({
    match: card,
    effect: ability.effects.discardIfStillInPlay(false)
}));
```

To apply an effect to last until the end of the round, use `untilEndOfRound`:

```javascript
/// Until the end of the round, add the 'Winter' trait to the specified plot card.
this.untilEndOfRound((ability) => ({
    match: plotCard,
    effect: ability.effects.addTrait('Winter')
}));
```

#### Lasting effects as game actions

`GameActions.lastingEffect` applies a lasting effect as part of an ability's `gameAction`, so it
can be combined with other game actions and used inside delayed effects. Its factory takes the
ability context and returns the effect properties, including the `duration`:

```javascript
gameAction: GameActions.lastingEffect((context) => ({
    duration: 'untilEndOfPhase',
    match: context.target,
    effect: ability.effects.modifyStrength(-2)
}));
```

#### Choosing an icon

For text that has a player choose a challenge icon ("gains an icon of your choice", "loses a
[military], an [intrigue] or a [power] icon"), use `GameActions.chooseIcon`. It prompts with one
button per icon and resolves the game action that `gameAction` returns for the chosen icon. In the
`message`, `{icon}` becomes the icon with its article ("a military", "an intrigue"). For a choice
between some of the icons ("an [intrigue] or [power] icon"), list them in `icons`:

```javascript
gameAction: GameActions.chooseIcon({
    message: '{player} uses {source} to give {target} {icon} icon until the end of the phase',
    gameAction: (icon) =>
        GameActions.lastingEffect((context) => ({
            duration: 'untilEndOfPhase',
            match: context.target,
            effect: ability.effects.addIcon(icon)
        }))
});
```

#### Moving gold

To move gold between gold pools and cards ("move 1 gold from an opponent's gold pool to your
own", "move 1 gold from X to a character"), use `GameActions.transferGold({ from, to, amount })`.
`from` and `to` are each a player or a card. It moves as much gold as `from` has, up to `amount`,
and can't change the game state when `from` has none. When gold comes from a gold pool, the player
chooses which gold sources to spend it from, as when paying a cost.

To pay gold as part of an effect rather than as a cost ("sacrifice it unless you pay X gold", The
Gold Price), use `GameActions.payGold({ player, amount })`. It can't change the game state unless
the player can pay all of it, and the player chooses which gold sources to spend it from.

#### Naming a challenge type

For "name a challenge type" or "choose a challenge type", use `GameActions.chooseChallengeType`.
It works like `chooseIcon`, with `{challengeType}` in the `message` becoming the chosen type
("military"). `exclude` returns a challenge type, or a list of them, to leave out, for "a different
challenge type" (or "a challenge type that has not been initiated against you", Maester Aemon):

```javascript
// Coordinated Attack: choose a different challenge type. You may initiate an additional
// challenge of the chosen type this phase.
gameAction: GameActions.chooseChallengeType({
    exclude: (context) => context.event.challenge.challengeType,
    message:
        '{player} uses {source} to be able to initiate an additional {challengeType} challenge this phase',
    gameAction: (challengeType) =>
        GameActions.lastingEffect(() => ({
            duration: 'untilEndOfPhase',
            targetController: 'current',
            effect: ability.effects.mayInitiateAdditionalChallenge(challengeType)
        }))
});
```

### Delayed effects

Text that sets up an effect for a later condition ("if you win that challenge", "if an opponent
reveals a plot with that trait this phase") is a delayed effect. Use `GameActions.delayedEffect`
rather than listening for game events with `this.game.on`. A delayed effect resolves once,
automatically, right after the event in its `when` occurs and before reactions to it (Rules
Reference: Delayed Effects). It resolves whether or not its source is still in play, isn't a
triggered ability (so it can't be cancelled as one and doesn't count towards limits), and expires
at the end of its `duration` (`untilEndOfChallenge`, `untilEndOfPhase` or `untilEndOfRound`).
`when` conditions get the event and the context of the ability that created the effect, and must
have no side effects. The triggering event is `context.event` when it resolves.
An `untilEndOfPhase` effect has expired by the time `onAtEndOfPhase` is raised, so for "at the end
of the phase" use `untilEndOfRound` with `when: { onAtEndOfPhase: () => true }`: the first end of
phase after the effect is created is the end of the current phase.

```javascript
gameAction: GameActions.delayedEffect({
    duration: 'untilEndOfPhase',
    when: {
        afterChallenge: (event, context) => event.challenge.winner === context.player
    },
    message: '{player} draws 1 card for {source}',
    gameAction: GameActions.drawCards((context) => ({ player: context.player, amount: 1 }))
});
```

### State checks

Text of the form "If <condition>, <effect>." with no bold trigger (Esgred, Oathsworn Wildling,
Ser Jorah Mormont) is a state check. Use `this.stateCheck` rather than listening for game events
with `registerEvents`. The game checks the `condition` whenever the game state is refreshed (after
each event resolves) and applies the `gameAction` as soon as it holds, while the card is in play,
faceup and not blank, and outside setup. It isn't a triggered ability, so it can't be cancelled
or declined as one. The context's `player` is the card's controller and `source` is the card. The
`condition` must have no side effects, like any other trigger check. If the effect is a kill or a
discard that no save could remedy (Gyles Rosby), pass `allowSave: false` (FAQ 3.1).

```javascript
this.stateCheck({
    condition: (context) =>
        context.player.anyCardsInPlay({ type: 'character', name: 'Arya Stark' }),
    message: '{player} sacrifices {source} as they control Arya Stark',
    gameAction: GameActions.sacrificeCard((context) => ({ card: context.source }))
});
```

### After all agendas are announced

Agenda text that starts "After all agendas are announced" (The House With the Red Door) uses
`this.afterAgendasAnnounced`. The setup phase resolves it once the decks are prepared, before
setup hands are drawn; when several are pending, the first player chooses the order. It isn't a
triggered ability, so it can't be cancelled. A card put into play by it, or by any effect during
setup, enters faceup and is not a setup card.

```javascript
this.afterAgendasAnnounced({
    message: '{player} uses {source} to search their deck for a location',
    gameAction: GameActions.search({
        title: 'Select a location',
        match: { type: 'location', printedCostOrLower: 3 },
        message: '{player} {gameAction}',
        gameAction: GameActions.putIntoPlay((context) => ({ card: context.searchTarget }))
    })
});
```

### Discarding a character to the dead pile

For text that discards a card and places it in its owner's dead pile if it is a character, use
`GameActions.discardCard({ card, destination: 'dead pile' })` for the character branch. The default
destination remains the discard pile. This still raises `onCardDiscarded`, so discard interrupts
such as Missandei's replacement work normally; it does not kill the character. The dead-pile
destination is only allowed for characters. For random discards, pass this action's event through
`discardAtRandom`'s `discardEvent` callback.

### Choices made while the effect resolves

When the card text has a player choose cards as part of the effect (an opponent chooses, each
player chooses, or a choice after part of the effect), use `GameActions.chooseCards` instead of
`promptForSelect` in a handler. Each player in `player` or `players` chooses in turn from the cards
matching `cardCondition` that the game action could affect; `context.choosingPlayer` is the player
choosing. Once everyone has chosen, every chosen card's game action resolves together, and each
player's result is logged. `numCards` and `title` can be functions of the context, for a number
that comes from an earlier part of the effect (Forced March). With `mode: 'exactly'`, a player
who can't choose that many chooses as many as they can, and a number of 0 skips the choice.
For "choose up to" text, `optional: true` lets the player choose no cards (Queenscrown).
An optional choice also works with the default single-card mode: Done selects no cards and
resolves no card actions, then the next choosing player continues if there is one.
With `revealTargets: true`, the choosing player sees the cards they can choose while choosing, for
"look at an opponent's hand, then choose a card in it" (Seen In Flames).

```javascript
// "Each player chooses a character they control and kills it."
gameAction: GameActions.chooseCards({
    players: (context) => context.game.getPlayersInFirstPlayerOrder(),
    title: 'Select a character to kill',
    cardCondition: (card, context) =>
        card.location === 'play area' &&
        card.getType() === 'character' &&
        card.controller === context.choosingPlayer,
    gameAction: (card) => GameActions.kill({ card })
});
```

`GameActions.choose({ choices })` offers a choice between game actions, with a Done button that
cancels the rest of the effect. When the text leaves no way out ("sacrifice it unless you pay X
gold", The Gold Price), pass `cancelable: false` so there is no Done button.

### Attaching cards

For "attach X to Y" or "move X to another character", use
`GameActions.attach({ player, attachment, target })`. `player` controls the attachment afterwards
(default: its current controller). A card from outside play enters play (`onCardEntersPlay`) as
well as being attached (`onCardAttached`); an attachment already in play only moves. The
attachment is attached by the time interrupts are over, so reactions see it on its new parent. It
can't change the game state unless the attachment is allowed on the target, or when it is already
attached to it. Pass `facedown: true` for a facedown attachment, which doesn't enter play.

For a card that attaches "as an attachment with the text: ..." (Risen from the Sea, "Florian and
Jonquil", Living Shadow, Valyrian's Crew), pass `asAttachment: { keywords, traits, effect }`.
While attached, the card is an attachment with those keywords and traits, and `effect` applies to
its parent while the card is in play. They come from the effect that attached it, not from its
printed text, so blanking the attachment doesn't remove them. Whether it can be attached is
checked against what it will be once attached, so a printed event or character doesn't need to
override `canAttach`.
`attachmentEffect` adds effects to the attachment itself, such as an attachment restriction
(Lady Marya's "Location only"). For a facedown attachment (`facedown: true`), the text lasts only
while it stays facedown, and only the target's restrictions ("No attachments except Weapon")
apply, since a facedown card has none of its own.

```javascript
gameAction: GameActions.saveCard((context) => ({ event: context.event })).then({
    gameAction: GameActions.attach((context) => ({
        player: context.player,
        attachment: context.source,
        target: context.parentContext.event.card,
        playingType: 'play',
        asAttachment: {
            keywords: ['Terminal'],
            traits: ['Condition'],
            effect: ability.effects.blankExcludingTraits
        }
    }))
})
```

### Redirecting challenges

`GameActions.redirectChallenge({ challenge, player })` redirects the current challenge to another
opponent and raises `onChallengeRedirected` with `challenge`, `player`, and `previousDefender`.
It preserves `challenge.initiatedAgainstPlayer`, changes the resolving defender, and reopens
initiation keywords for the new defender. Initiation restrictions, including support, do not
prevent redirection. The original opponent cannot be selected.

Crown Regent uses a non-cancelable `GameActions.choose` for the initiating player to select the
new opponent after the interrupt resolves.

### Switching cards

`GameActions.switch({ cards: [first, second] })` switches the positions of two cards. It only
resolves when there is a card on each side (Rules Reference: Switch).

### Naming a trait or card

`GameActions.nameTrait` prompts the player to name a trait, stores it as `context.namedTrait`,
logs its `message` (`{trait}` is the named trait) and then resolves its `gameAction`. See
[SuperstitiousSteward.js](../server/game/cards/27.2-WGYK/SuperstitiousSteward.js).

`GameActions.nameCard` works the same way for a card name. It only accepts the name of a real
  card, stores it as `context.namedCard`, and its `message` uses `{cardName}`. Use
  `match: (cardData, context) => ...` to restrict which cards can be named, for example
  `match: (cardData) => cardData.type === 'event'` for "name an event". See
[TheIronThrone.js](../server/game/cards/13.6-LMHR/TheIronThrone.js).

### Initiating another plot's When Revealed ability

For "initiate the when revealed ability on that card as if you had just revealed it", use
`GameActions.initiateWhenRevealed({ plot })`. It resolves the plot's When Revealed ability for
`context.player` (or `player`, if given). The ability's source is still the copied plot, so a When
Revealed ability must use `context.player` rather than its own controller. See
[PullingTheStrings.js](../server/game/cards/02.5-COW/PullingTheStrings.js).

### Actions

Actions are abilities provided by the card text that players may trigger during action windows. They are declared using the `action` method. See `/server/game/cardaction.js` for full documentation. Here are some common scenarios:

#### Declaring an action

When declaring an action, use the `action` method and provide it with a `title` and a `handler` property. The title is what will be displayed in the menu players see when clicking on the card. The handler is a function to be called when the player chooses to trigger the action. The handler receives a context object as its only parameter which contains the `player` executing the action, and the `source` card that triggered the ability.

```javascript
class SealOfTheHand extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Stand attached character',
            handler: (context) => {
                // Code to stand the parent card
            }
        });
    }
}
```

#### Ability messages

The `message` property adds the ability's message to the game log outside of the `handler` function. The engine logs it when the ability's effects resolve, after any cancels (Treachery, The Hand's Judgment, etc.), so the log doesn't claim effects that never happened:

- For an ability with a declarative `gameAction`, the message is logged after the game action's handler runs. `{gameAction}` in the message describes what actually happened: parts that were cancelled, saved or prevented are left out, and amounts are the amounts applied (e.g. gold actually gained).
- For an ability with a `handler` or `choices`, the message is logged as its effects begin.
- If something else is logged first, the log shows a plain "{player} uses/plays {source}" line while the ability can still be cancelled or its effect prevented, and the full message once its effects have begun. A cancelled ability, or one whose only target was saved, only gets the plain line.

Prefer `{gameAction}` over spelling the effect out in the format, so the message stays accurate.

An ability with a declarative `gameAction` and no `message` gets a default one, built from what resolved and the cards paid as costs:

- `player1 uses Littlefinger and draws 2 cards`
- `player1 kneels Grey Wind and kills Eddard Stark`, when the source paid a cost
- `player1 plays Nightmares, kneels their faction card, and blanks Robb Stark`

Leave `message` out when the default says what the card does. Game actions that prompt and log their own lines (`search`, `choose`, `ifCondition`, `may`, `nameTrait`, `nameCard`, `discardAtRandom`) don't get a default, and neither do abilities with a `handler`. If nothing resolved, only the plain "{player} uses/plays {source}" line is logged.

The `message` property can be just a string if there are no additional arguments. `{player}` will be replaced with the player initiating the ability, `{source}` will be replaced with the card associated with the ability, and `{target}` will be replaced with the target for the ability (if any):

```javascript
this.action({
    // ...
    message: '{player} kneels {source} to stand {target}',
    handler: () => {
        // ...
    }
});
```

When you have additional parameters needed for the message, the `message` property can be an object with a `format` sub-property for the message format, and an `args` sub-property for the additional arguments. The keys of the `args` sub-property correspond to the replacement name, and the values correspond to a function that takes the `context` object and returns the appropriate argument value:

```javascript
this.action({
    // ...
    message: {
        format: "{player} uses {source} to put {target} into play from {targetOwner}'s discard pile.",
        args: {
            targetOwner: (context) => context.target.owner
        }
    },
    handler: () => {
        // ...
    }
});
```

Finally, you can pass a function to the `message` property that will be executed:

```javascript
this.action({
    // ...
    message: (context) =>
        this.game.addMessage('{0} uses {1} to kill {2}', context.player, this, context.target),
    handler: () => {
        // ...
    }
});
```

#### Checking ability restrictions

Card abilities can only be triggered if they have the potential to modify game state (outside of paying costs). To ensure that the action's play restrictions are met, pass a `condition` function that returns `true` when the restrictions are met, and `false` otherwise. If the condition returns `false`, the action will not be executed and costs will not be paid.

```javascript
this.action({
    title: 'Stand attached character',
    // Ensure that the parent card is knelt
    condition: (context) => context.source.parent.kneeled
    // ...
});
```

#### Paying additional costs for action

Some actions have an additional cost, such as kneeling the card. In these cases, specify the `cost` parameter. The action will check if the cost can be paid. If it can't, the action will not execute. If it can, costs will be paid automatically and then the action will execute.

For a full list of costs, look at `/server/game/costs.js`.

```javascript
this.action({
    title: 'Stand attached character',
    // This card must be knelt as a cost for the action.
    cost: ability.costs.kneelSelf()
    // ...
});
```

If a card has multiple costs, an array of cost objects may be sent using the `cost` property.

```javascript
this.action({
    title: 'Reduce the next character marshalled by 3',
    // This card must be knelt AND sacrificed as a cost for the action.
    cost: [ability.costs.kneelSelf(), ability.costs.sacrificeSelf()]
    // ...
});
```

A cost that selects a card (`ability.costs.kneel(condition)`, `discardPower(amount, condition)`
and so on) puts the chosen card on `context.costs`, and the `gameAction` can act on it. Like a
target, the card isn't chosen until the cost is paid, so the game action isn't checked before then.
See [Statue of Baelor](../server/game/cards/13.3-PoS/StatueOfBaelor.js).

```javascript
this.action({
    title: 'Stand card',
    cost: [ability.costs.kneelSelf(), ability.costs.discardPower(1, (card) => card.kneeled)],
    gameAction: GameActions.standCard((context) => ({ card: context.costs.discardPower }))
});
```

#### Choosing / targeting cards

Cards that specify to 'choose' or otherwise target a specific card can be implemented by passing a `target` property, At minimum, the target property must have an `activePromptTitle` to be used as the prompt text, and a `cardCondition` function that returns `true` for valid targets. Any other properties that apply to `Game.promptForSelect` are valid.

```javascript
this.action({
    title: 'Stand a Bloodrider (if a Summer plot is revealed)',
    target: {
        // activePromptTitle: 'Select a character',  // <- default prompt message, overridable
        cardCondition: (card) =>
            card.location === 'play area' &&
            card.getType() === 'character' &&
            card.hasTrait('Bloodrider')
    }
    // ...
});
```

The card that was chosen will be set on the `target` property of the context object passed to the handler.

```javascript
this.action({
    // ...
    handler: (context) => {
        this.game.addMessage('{0} uses {1} to stand {2}', context.player, this, context.target);
        this.controller.standCard(context.target);
    }
});
```

Some card abilities require multiple targets. These may be specified using the `targets` property. Each sub key under `targets` is the name that will be given to the chosen card, and the value is the prompt properties.

```javascript
this.action({
    title: 'Kneel this card to modify the strength of two characters',
    targets: {
        toLower: {
            activePromptTitle: 'Select a character to get -1 STR',
            cardCondition: (card) => isCharacterInPlay(card)
        },
        toRaise: {
            activePromptTitle: 'Select a character to get +1 STR',
            cardCondition: (card) => isCharacterInPlay(card)
        }
    }
    // ...
});
```

Once all targets are chosen, they will be set using their specified name under the `targets` property on the handler context object.

```javascript
this.action({
    // ...
    handler: (context) => {
        this.untilEndOfPhase((ability) => ({
            match: context.targets.toLower,
            effect: ability.effects.modifyStrength(-1)
        }));
        this.untilEndOfPhase((ability) => ({
            match: context.targets.toRaise,
            effect: ability.effects.modifyStrength(1)
        }));
    }
});
```

#### Targets with a game action

Most targeted abilities do one thing to the chosen card. Combine the `target` with a `gameAction`
that acts on `context.target` instead of writing a handler:

```javascript
// Filthy Accusations: When Revealed: Choose and kneel a character.
this.whenRevealed({
    target: {
        cardCondition: (card) => card.location === 'play area' && card.getType() === 'character'
    },
    message: '{player} uses {source} to kneel {target}',
    gameAction: GameActions.kneelCard((context) => ({ card: context.target }))
});
```

A card is only a valid target if the game action could change the game state for it, so the
`cardCondition` doesn't need to repeat what the action already checks: here, kneeling characters
and characters that can't be knelt are excluded automatically. With a multi-card target
(`mode`, `numCards`), each card is checked on its own, as a one-card array.

When an ability chooses several cards, give each target its own `gameAction` acting on
`context.targets.<name>`. Each target's candidates are filtered by its own action, and the actions
resolve simultaneously; the ability can't also have a `gameAction`, `handler` or `choices`:

```javascript
// Ser Gerris Drinkwater: choose a card in your plot deck and switch it with a card in your used pile.
targets: {
    plotCard: {
        cardType: 'plot',
        cardCondition: (card, context) =>
            card.controller === context.player && card.location === 'plot deck',
        gameAction: GameActions.placeCard((context) => ({
            card: context.targets.plotCard,
            location: 'revealed plots'
        }))
    },
    usedPlotCard: {
        type: 'select',
        cardType: 'plot',
        cardCondition: (card, context) =>
            card.controller === context.player && card.location === 'revealed plots',
        gameAction: GameActions.placeCard((context) => ({
            card: context.targets.usedPlotCard,
            location: 'plot deck'
        }))
    }
},
message: {
    format: '{player} uses {source} to switch {plotCard} from their plot deck with {usedPlotCard} in their used pile',
    args: {
        plotCard: (context) => context.targets.plotCard,
        usedPlotCard: (context) => context.targets.usedPlotCard
    }
}
```

A string `gameAction` on a target (`gameAction: 'kill'`) is different: it only names the action
checked for immunity, and doesn't filter or resolve anything.

When more than one player chooses (`choosingPlayer: 'each'`, `'eachOpponent'` or a function), put
the `gameAction` on the target. It resolves once for each player's selection, with
`context.target` set to that player's cards and `context.choosingPlayer` to that player. See
[KarstarkLancer.js](../server/game/cards/25.1-ATT/KarstarkLancer.js) and
[RuleByDecree.js](../server/game/cards/16-TTWDFL/RuleByDecree.js).

When the effect depends on every player's choice together ("kill each character not chosen"), use
a top-level `gameAction` that reads `context.targets.selections` or `context.targets.getTargets()`.
It resolves once after everyone has chosen, and it doesn't filter the candidates, since no single
choice decides what it does. See [TheStranger.js](../server/game/cards/20-HMW/TheStranger.js).

With `chooseOpponent` or `choosePlayer` and no card targets, only players the `gameAction` could
affect can be chosen. An ability with several targets and a single top-level `gameAction` still
resolves it, but doesn't filter the targets by it. With a player to choose and a single target,
the player is chosen first, so the target is filtered by the `gameAction` with `context.opponent`
already set ([MathisRowan.js](../server/game/cards/15-DotE/MathisRowan.js)).

A `type: 'select'` target is not counted by `context.targets.getTargets()`, which only returns
targets that were chosen; read `context.targets.selections` instead.

#### Non-targeting card choices

Some abilities such as Tears of Lys require selecting a target but do not count as targeting because the ability does not use the word 'choose'. These abilities can be implemented using the target API but should specify the `type` property as `'select'`. This will prevent immunity from being checked as well as properly interact with cards that modify targeting.

```javascript
this.action({
    // ...
    target: {
        type: 'select'
        // ...
    }
    // ...
});
```

#### Cancelling an action

If after checking play requirements and paying costs an action needs to be cancelled for some reason, simply return `false` from the handler. **Note**: This should be very rare.

```javascript
this.action({
    title: 'Do something',
    handler: () => {
        if (!this.canDoIt()) {
            return false;
        }

        // normal handler code
    }
});
```

If an action is cancelled in this manner, it is not counted towards any 'limit X per challenge/phase/round' requirements.

#### Limiting an action to a specific phase

Some actions are limited to a specific phase by their card text (e.g. 'Challenges Action:'). You can pass an optional `phase` property to the action to limit it to just that phase. Valid phases include `'plot'`, `'draw'`, `'marshal'`, `'challenge'`, `'dominance'`, `'standing'` `'taxation'`. The default is `'any'` which allows the action to be triggered in any phase.

```javascript
this.action({
    title: 'Kneel Grey Wind to kill a character',
    phase: 'challenge'
    // ...
});
```

#### Limiting the number of uses

Some actions have text limiting the number of times they may be used in a given period. You can pass an optional `limit` property using one of the duration-specific ability limiters.

```javascript
this.action({
    title: 'Put a card with printed cost of 5 or lower in play',
    limit: ability.limit.perPhase(1)
    // ...
});
```

#### Actions outside of play

Certain actions, such as those for Dolorous Edd, can only be activated while the character is in hand. Such actions should be defined by specifying the `location` property with the location from which the ability may be activated. The player can then activate the ability by simply clicking the card. If there is a conflict (e.g. both the ability and normal marshaling can occur), then the player will be prompted.

```javascript
this.action({
    title: 'Add Dolorous Edd as a defender',
    location: 'hand'
    // ...
});
```

### Triggered abilities

Triggered abilities include all card abilities that have **Interrupt**, **Forced Interrupt**, **Reaction**, **Forced Reaction**, or **When Revealed**. For full documentation of properties, see `/server/game/promptedtriggeredability.js` and `/server/game/forcedtriggeredability.js`. Here are some common scenarios:

#### Defining the triggering condition

Each triggered ability has an associated triggering condition. This is done using the `when` property. This should be an object whose sub-property is the name of the event, and whose value is a function called with the event and the ability context. When the function returns `true`, the ability will be executed. The events and the parameters each one carries are listed in [server/game/Constants/Events.js](../server/game/Constants/Events.js); outside production, listening for an event that isn't listed throws.

```javascript
this.interrupt({
    when: {
        // when the challenges phase ends and the card is not kneeled
        onPhaseEnded: (event, context) => event.phase === 'challenge' && !context.source.kneeled
    },
    handler: () => {
        // handler code.
    }
});
```

In rare cases, there may be multiple triggering conditions for the same ability. For example, WotN Catelyn Stark gains power whenever a character is killed OR sacrificed. In these cases, just defined an additional event on the `when` object.

```javascript
this.reaction({
    when: {
        onSacrificed: (event) => isStarkCharacter(event.card),
        onCharacterKilled: (event) => isStarkCharacter(event.card)
    },
    handler: () => {
        // gain power
    }
});
```

There may also be scenarios where the triggering conditions need to be aggregated or grouped to determine whether the ability should be executed. For example, The Warden of the West draws a number of cards which are discarded simultaneously from an opponent's hand or deck. In these cases, you can `aggregateBy` within the event defined in the `when` object, with the triggering condition passed to the `condition` function. When that function returns `true` the ability will be executed, and all valid events will be accessible within `context.events`.

```javascript
this.reaction({
    when: {
        onCardDiscarded: {
            // Aggregate by the controller of the discarded cards, and the location they were discarded in
            aggregateBy: (event, context) => ({
                controller: event.cardStateWhenDiscarded.controller,
                location: event.cardStateWhenDiscarded.location
            }),
            // Check if this ability should trigger using the aggregate details defined above
            condition: (aggregate, events, context) =>
                aggregate.controller !== this.controller &&
                ['hand', 'draw deck'].includes(aggregate.location)
        }
    },
    handler: (context) => {
        // Draw context.events.length worth of cards
    }
});
```

#### Forced reactions and interrupts

Forced reactions and interrupts do not provide the player with a choice - unless cancelled, the provided `handler` method will always be executed.

To declare a forced reaction, use the `forcedReaction` method:

```javascript
// After you lose an unopposed challenge, kneel The Wall.
this.forcedReaction({
    when: {
        // lost an unopposed challenge
    },
    handler: () => {
        // kneel the Wall.
    }
});
```

To declare a forced interrupt, use the `forcedInterrupt` method.

```javascript
// When a phase ends in which Gold Cloaks entered play using ambush, discard it from play (cannot be saved)
this.forcedInterrupt({
    when: {
        // the card entered play via ambush
    },
    handler: () => {
        // discard the card
    }
});
```

#### Cancelling or replacing events with interrupts

Some cards (primarily saving cards) allow the player to cancel an effect. The `handler` method is always passed a `context` object that allows the handler to cancel the `event` within it. Such abilities must also be passed `canCancel: true` in the declaration.

```javascript
this.interrupt({
    when: {
        // attached character would be killed + allowed to save
    },
    canCancel: true,
    handler: (context) => {
        context.event.cancel();
        // sacrifice the Bodyguard
    }
});
```

An interrupt whose trigger says "would" and that is not a save or cancel declares `would: true`,
so it is offered before forced interrupts (Rules Reference: Triggering Condition). The
[wouldInterrupts.spec.js](../test/server/tools/wouldInterrupts.spec.js) check fails if a card's
declarations don't match its text.

When the text says "instead", the event still happens but its effect is replaced. Use
`GameActions.replaceEvent` with the game action that happens instead. The ability is only offered
when the replacement could change the game state.

```javascript
this.interrupt({
    when: {
        onCardDiscarded: (event) => event.card === this
    },
    location: ['hand', 'draw deck'],
    message:
        '{player} uses {source} to put {source} into play instead of placing it in their discard pile',
    gameAction: GameActions.replaceEvent((context) => ({
        event: context.event,
        replacement: GameActions.putIntoPlay({ card: context.source })
    }))
});
```

When only the event's amount changes ("discard 3 cards instead"), use
`GameActions.changeEventAmount({ event, amount })`, as Scouting Vessel does.

#### Yes / no reactions and interrupts

Most reactions and interrupt are a yes / no choice on whether the player wants to activate the ability or not. For these, it's only necessary to provide a `when` event listener and the `handler` method, similar to forced reactions and interrupts.

To declare a reaction, use the `reaction` method.

```javascript
this.reaction({
    when: {
        // triggering event condition
    }
    handler: () => {
        // code to implement the ability
    }
});
```

To declare an interrupt, use the `interrupt` method.

```javascript
this.interrupt({
    when: {
        // triggering event condition
    }
    handler: () => {
        // code to implement the ability
    }
});
```

#### Multiple choice reactions and interrupts

A few cards provide reactions or interrupts that have more than a yes or no choice. For example, the Great Kraken can be used to draw a card, gain power, or declined. In these cases, instead of sending a `handler` method, a `choices` object may be provided. Each property under the `choices` object will be used as the prompt button text, while the value will be the function to be executed if the player chooses that option. The option to decline / cancel the ability is provided automatically and does not need to be added to the `choices` object.

```javascript
this.reaction({
    when: {
        // unopposed win
    },
    choices: {
        'Draw 1 card': () => {
            // code to draw a card
        },
        'Gain 1 power': () => {
            // code to gain 1 power
        }
    }
});
```

#### Paying additional costs for reactions and interrupts

Some abilities have an additional cost, such as kneeling the card. In these cases, specify the `cost` parameter. The ability will check if the cost can be paid. If it can't, the ability will not prompt the player. If it can, costs will be paid automatically and then the ability will execute.

For a full list of costs, look at `/server/game/costs.js`.

```javascript
this.interrupt({
    when: {
        // condition for the Wall.
    }
    // This card must be knelt as a cost for the action.
    cost: ability.costs.kneelSelf(),
    handler: () => {
        // Gain 2 power for your faction.
    }
});
```

If a card has multiple costs, an array of cost objects may be sent using the `cost` property.

```javascript
this.reaction({
    when {
        // condition for Ghaston Grey
    }
    // This card must be knelt AND sacrificed as a cost for the action.
    cost: [
        ability.costs.kneelSelf(),
        ability.costs.sacrificeSelf()
    ],
    handler: () => {
        // Choose and return an attacking character to your opponent's hand.
    }
});
```

#### Limiting the number of uses

Some abilities have text limiting the number of times they may be used in a given period. You can pass an optional `limit` property using one of the duration-specific ability limiters.

```javascript
this.reaction({
    when: {
        // the attached character gains power
    },
    // limit once per phase
    limit: ability.limit.perPhase(1),
    handler: () => {
        // stand the attached character
    }
});
```

#### Abilities outside of play

Certain abilities, such as those for The Prince's Plan, can only be activated in non-play locations. Such reactions should be defined by specifying the `location` property with the location from which the ability may be activated. The player can then activate the ability when prompted.

```javascript
this.reaction({
    location: 'discard pile'
    // Implementation for The Prince's Plan
});
```

#### Abilities another player triggers

By default the card's controller triggers its reactions and interrupts. When the text lets another
player do so, give a `player` function. It receives the triggering event and a context with
`game` and `source`, as [Turncloak](../server/game/cards/10-SoD/Turncloak.js) does:

```javascript
this.reaction({
    when: {
        afterChallenge: (event, context) => event.challenge.isParticipating(context.source.parent)
    },
    player: (event) => event.challenge.winner
    // ...
});
```

#### When revealed abilities

When implementing plot cards that have a **When Revealed** ability, use the `whenRevealed` method. It will automatically listen to the correct event for you and all that must be provided is a `handler` method.

```javascript
this.whenRevealed({
    handler: () => {
        // code to implement the ability
    }
});
```

### Ability limits

Actions, reactions, and interrupts can have limits on how many times they may be used within a certain period. These limits can be set by setting the `limit` property on the ability. The `ability` object has a limit helper with methods for the different periods.

To limit an ability per challenge, use `ability.limit.perChallenge(x)`.

To limit an ability per phase, use `ability.limit.perPhase(x)`.

To limit an ability per challenge, use `ability.limit.perRound(x)`.

In each case, `x` should be the number of times the ability is allowed to be used.

### Language

#### Game messages should begin with the player doing the action

Game messages should begin with the name of the player to ensure a uniform format and make it easy to see who triggered an ability.

- **Bad**: Tyrion Lannister triggers to gain 2 gold for Player1
- **Good**: Player1 uses Tyrion Lannister to gain 2 gold

#### Game messages should not end in punctuation

No game messages should end in a period, exclaimation point or question mark.

- **Bad**: Player1 draws 2 cards.
- **Good**: Player1 draws 2 cards

#### Game messages should use present tense.

All game messages should use present tense.

- **Bad**: Player1 has used Ser Gregor Clegane to kill The Red Viper
- **Bad**: Player1 killed The Red Viper
- **Good**: Player1 uses Ser Gregor Clegane to kill The Red Viper
- **Good**: Player1 kills The Red Viper

#### Targeting prompts should use the format "Select a \<card type\>" where possible.

Targeting prompts should ask the player to select a card or a card of particular type to keep prompt titles relatively short, without specifying the final goal of card selection.

- **Bad**: Select a character to return to hand
- **Good**: Select a character

**Exception:** If a card requires the player to select multiple cards, such as Renly's Pavillion, you can add context about which one they should be selecting. Just keep it as short as reasonably possible.

As valid selections are already presented to the user via visual clues, targeting prompts should not repeat selection rules in excessive details. Specifying nothing more and nothing less than the eligible card type (if any) is the good middle ground.

- **Bad**: Select a Knight
- **Good**: Select a character

- **Bad**: Select a defending Night's Watch character
- **Good**: Select a character

- **Bad**: Select a card from your discard pile
- **Good**: Select a card

- **Good**: Select an attachment or location
