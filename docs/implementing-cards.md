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

Lasting effects are declared through `GameActions.lastingEffect`. The property factory receives
an ability context; the `ability` DSL comes from `setupCardAbilities(ability)`. Set the duration
explicitly to `untilEndOfChallenge`, `untilEndOfPhase`, `untilEndOfRound`, or `custom`.

```javascript
GameActions.lastingEffect((context) => ({
    duration: 'untilEndOfChallenge',
    match: context.source.parent,
    effect: ability.effects.modifyStrength(3)
}));
```

For an action that happens **at** the end of a phase, use `GameActions.delayedEffect`.
The old `atEndOfPhase`, `atEndOfChallenge`, and `atEndOfRound` effect durations and helpers
have been removed. A delayed effect participates in first-player ordering, rather than running
as a side effect of undoing a stat modifier:

```javascript
GameActions.delayedEffect((context) => {
    const card = context.target;
    return {
        duration: 'untilTriggered',
        title: card.name,
        when: { onAtEndOfPhase: () => true },
        until: { onCardLeftPlay: (event) => event.card === card },
        gameAction: GameActions.ifCondition({
            condition: () => card.location === 'play area',
            thenAction: GameActions.discardCard({ card, allowSave: false })
        })
    };
});
```

The property factory runs once when the delayed effect is created. Capture the affected card
there, rather than reading a later ability context's target. The optional `title` distinguishes
multiple pending effects from the same source. Leave-play expiry prevents the effect from
applying to a card that leaves and reenters play.

When one delayed instruction affects several cards, per-card tracking can share a `group` token
and a `groupTitle`. Use the original resolution context as the group token. The engine presents
one ordering choice for that instruction and resolves its surviving card actions simultaneously.
Independent uses of an ability have different contexts and remain separate choices.


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

A delayed effect limited to some other window ("during the next plot phase", Nightfire Visions)
uses `duration: 'custom'` with an `until` map of event conditions; it expires as soon as one of
them occurs.

Text of the form "If <card> leaves play, <effect>" that follows an ability (Jaqen H'ghar, Hornvale,
The Great Pyramid) is a delayed effect that the ability creates, with `duration: 'untilTriggered'`
and `when: { onCardLeftPlay: (event, context) => event.card === context.source }`. It has no
expiry, and it resolves after the card has left play, so it acts only on what that resolution
placed (`context.target`, or the cards in `context.events`) and checks it is still there. Cards
underneath a card stay under it when it leaves play.

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

### Event checks

Constant text that applies an effect when something happens, with no bold trigger ("If you win
this challenge, gain 1 power for your faction" on The Lord of the Crossing), is an event check. Use
`this.eventCheck` with a `when` like a reaction's. It resolves automatically right after the event,
with delayed effects and before reactions, so it can't be cancelled or declined, and it doesn't
count towards limits. It applies only while the card is in play, the agenda, the active plot or the
title, faceup and not blank. The context's `player` is the card's controller, `source` is the card
and `event` is the triggering event.

```javascript
this.eventCheck({
    when: {
        afterChallenge: (event, context) =>
            event.challenge.winner === context.player && event.challenge.number === 3
    },
    message: '{player} gains 1 power from {source}',
    gameAction: GameActions.gainPower((context) => ({ card: context.player.faction, amount: 1 }))
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
apply, since a facedown card has none of its own. Outside setup, a facedown card in play has no
title (`name` is undefined), traits or faction of its own, only what the attaching ability grants
(Rules Reference: Facedown Cards). The engine's own uniqueness and duplicate checks, and
`isCopyOf`, still use the printed title, because playing the card turns it faceup.

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
});
```

### Placing cards in any order

Cards placed in the same pile at once are ordered by the player resolving the effect (the owner
for a discard or dead pile), and cards placed in a draw deck are shown to that player while they
choose. Pass `orderable: false` for a random or fixed order. "Place the others on top, in any
order" (The Bear and the Maiden Fair) passes `orderable: true` so the card already on top is
ordered with the rest.

### Marshaling as a duplicate

`GameActions.marshalAsDuplicate({ card, parent, player })` raises `onCardMarshalled` with
`type: 'dupe'` and places the card on `parent` as a duplicate, at no cost (Lady-in-Waiting).

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

Declare an action with a title and a game action. The game-action factory receives `context.player`,
`context.source`, and any resolved targets. Handler properties are rejected.

```javascript
this.action({
    title: 'Stand attached character',
    cost: ability.costs.kneelSelf(),
    gameAction: GameActions.standCard((context) => ({ card: context.source.parent }))
});
```

#### Ability messages

The engine builds a default message from the resolved game action and paid costs. Cancelled,
saved, and prevented parts are omitted. Override wording with a declarative `message` template:

```javascript
this.action({
    title: 'Stand attached character',
    cost: ability.costs.kneelSelf(),
    message: '{player} kneels {source} and {gameAction}',
    gameAction: GameActions.standCard((context) => ({ card: context.source.parent }))
});
```

`{player}`, `{source}`, and `{target}` come from the context. Additional arguments use
`message: { format, args }`, with each argument a context function. Prefer `{gameAction}` to
wording that could claim a prevented effect happened. Prompting actions such as `search`,
`choose`, `ifCondition`, `may`, `nameCard`, and `nameTrait` log their own messages. A cancelled
ability only gets the plain uses/plays line.

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

The chosen card is `context.target`. For multiple targets, name each target and give it its own
game action. Each selection is then filtered by what its action can affect:

```javascript
this.action({
    title: 'Modify the strength of two characters',
    targets: {
        toLower: {
            cardCondition: (card) =>
                card.location === 'play area' && card.getType() === 'character',
            gameAction: GameActions.lastingEffect((context) => ({
                duration: 'untilEndOfPhase',
                match: context.targets.toLower,
                effect: ability.effects.modifyStrength(-1)
            }))
        },
        toRaise: {
            cardCondition: (card) =>
                card.location === 'play area' && card.getType() === 'character',
            gameAction: GameActions.lastingEffect((context) => ({
                duration: 'untilEndOfPhase',
                match: context.targets.toRaise,
                effect: ability.effects.modifyStrength(1)
            }))
        }
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

Use `GameActions.cancelEffects({ event })` from a qualifying interrupt. A cancellation after
initiation keeps costs paid and counts towards limits. Conditions and game-action eligibility
prevent an unavailable action from initiating; returning a boolean from an ability handler is
not an API for cancellation.

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

Reactions, interrupts, forced abilities, and When Revealed abilities declare game actions just
like actions. `when` predicates receive `(event, context)` and must have no side effects.
[Constants/Events.js](../server/game/Constants/Events.js) lists the supported events and parameters.

#### Defining the triggering condition

```javascript
this.reaction({
    when: {
        afterChallenge: (event, context) =>
            event.challenge.winner === context.player && context.source.isParticipating()
    },
    gameAction: GameActions.drawCards((context) => ({ player: context.player, amount: 1 }))
});
```

A `when` object can name several events. For grouped events, use `aggregateBy` and a `condition`
inside the event definition. Matching events are available as `context.events`:

```javascript
this.reaction({
    when: {
        onCardDiscarded: {
            aggregateBy: (event) => ({
                controller: event.cardStateWhenDiscarded.controller,
                location: event.cardStateWhenDiscarded.location
            }),
            condition: (aggregate, _events, context) =>
                aggregate.controller !== context.player &&
                ['hand', 'draw deck'].includes(aggregate.location)
        }
    },
    gameAction: GameActions.drawCards((context) => ({
        player: context.player,
        amount: context.events.length
    }))
});
```

#### Forced reactions and interrupts

Use `forcedReaction` or `forcedInterrupt` for mandatory triggered text. Their effects still use
`gameAction`. Constant text that resolves when an event occurs uses `eventCheck`; an ongoing
condition uses `stateCheck`.

```javascript
this.forcedReaction({
    when: {
        afterChallenge: (event, context) =>
            event.challenge.loser === context.player && event.challenge.isUnopposed()
    },
    gameAction: GameActions.kneelCard((context) => ({ card: context.source }))
});
```

#### Cancelling or replacing events with interrupts

Saves and cancels declare `canCancel: true`. Use `saveCard` for a save and `cancelEffects` for a
cancel. An interrupt that says ?would? and is not a save/cancel declares `would: true`.

```javascript
this.interrupt({
    canCancel: true,
    when: {
        onCharacterKilled: (event, context) =>
            event.card === context.source.parent && event.allowSave
    },
    cost: ability.costs.sacrificeSelf(),
    gameAction: GameActions.saveCard((context) => ({ event: context.event }))
});
```

?Instead? leaves the event in place and replaces its effect:

```javascript
this.interrupt({
    location: ['hand', 'draw deck'],
    when: { onCardDiscarded: (event, context) => event.card === context.source },
    gameAction: GameActions.replaceEvent((context) => ({
        event: context.event,
        replacement: GameActions.putIntoPlay({ card: context.source })
    }))
});
```

Use `changeEventAmount` when only an event's amount changes.

A kill made to satisfy [military] claim has `event.isClaim` set, and a burn kill has
`event.isBurn`. Use `event.isClaim` for text such as "killed for [military] claim", rather than
checking whether claim is being applied: other kills can happen while claim is applied (Podrick
Payne's kill, for example), and they are kills by a card effect.

#### Yes / no reactions and interrupts

Optional `reaction` and `interrupt` abilities automatically let the player decline to trigger.
Use `GameActions.may` when an optional choice is part of resolving an effect.

#### Multiple choice reactions and interrupts

A `choices` object maps button labels to game actions or `{ gameAction, message, condition }`
objects. Functions that perform an effect are rejected.

```javascript
this.reaction({
    when: { afterChallenge: (event, context) => event.challenge.winner === context.player },
    choices: {
        'Draw 1 card': GameActions.drawCards((context) => ({ player: context.player, amount: 1 })),
        'Gain 1 power': GameActions.gainPower((context) => ({ card: context.player.faction }))
    }
});
```

#### Paying additional costs for reactions and interrupts

Use the same `cost` and `limit` properties as actions. Several costs form an array and must all
be payable before initiation. See [costs.js](../server/game/costs.js). `ability.limit.perChallenge`,
`perPhase`, and `perRound` define limits at their respective timing scopes.

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

Use `whenRevealed` and declare a game action; the engine supplies the reveal trigger.

```javascript
this.whenRevealed({
    gameAction: GameActions.drawCards((context) => ({ player: context.player, amount: 2 }))
});
```

### Ability limits

Actions, reactions, and interrupts can have limits on how many times they may be used within a certain period. These limits can be set by setting the `limit` property on the ability. The `ability` object has a limit helper with methods for the different periods.

To limit an ability per challenge, use `ability.limit.perChallenge(x)`.

To limit an ability per phase, use `ability.limit.perPhase(x)`.

To limit an ability per round, use `ability.limit.perRound(x)`.

In each case, `x` should be the number of times the ability is allowed to be used. Limits are
counted per player (Rules Reference: Limits and Maxima): when another player takes control of the
card, they can use the ability up to its limit even if its previous controller already has.

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

### Naming cards and factions during agenda setup

Use `afterAgendasAnnounced` for an agenda's setup instruction, so the engine resolves it
before drawing the starting hands. `GameActions.nameCard` validates the entered title against
the card database. Set `remember: true` to retain the valid choice as `context.source.namedCard`
for the agenda's later abilities; the default keeps the choice only on `context.namedCard`.

`GameActions.nameFaction({ count: 2 })` requires two distinct factions (the default count is 1),
logs the announcement, and retains their faction codes as `context.source.namedFactions`.
Neutral is not a faction choice. The choices do not reveal the contents of either deck.

Cost reducer match predicates receive `(card, context)`, where `context.source` is the card
providing the reducer. Use that context when matching the current controller's faction.

### Engine modernization (24 October 2026)

Abilities and choices accept declarative game actions. An ability's `handler` property and
function-valued choice actions are rejected. `GameActions.genericHandler` is reserved for
engine test fixtures and requires an explicit game-state predicate; card rules prohibit it in
card implementations. Use `GameActions.decline()` for a choice that explicitly declines an
optional effect. It is only available within a choice or an ability continuation.

Removal costs, placement in the dead pile from hand, and variable gold-token payments now raise
their game-action events and participate in cost-prevention tracking. Removal costs cannot be saved. `GameActions.placeInDeadPile({ card })` handles instructions to
place a character there without killing or discarding it, including leave-play consequences
for its attachments and duplicates.

Stealth and assault queue their declared game actions until challenge redirection is complete.
Intimidate and duplicate saves declare their game actions directly.

Strength modifiers are computed by `CardStat`. Simultaneous application and expiry coalesce
strength-change notifications, including old and new plot effects during a plot reveal. Burn is
checked against the resulting state; there is no positive/negative sorting or reverse-expiry
workaround. Multiple burn sources are tracked independently.

Plot selection follows advance-information dependencies. Independent players choose together;
a viewer waits for the player whose plot they can inspect. The first player breaks dependency
cycles. Confirmed choices cannot be changed, and plot selection in tests uses the same click and
Done flow as the client. These rules follow the [Bloodraven FAQ](https://thronesdb.com/card/25017).
