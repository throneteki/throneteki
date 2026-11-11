import AbilityContext from '../../server/game/AbilityContext.js';
import Effects from '../../server/game/effects.js';
import GameActions from '../../server/game/GameActions/index.js';

describe('delayed effects', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Tumblestone Knight', 'House Dayne Knight'] },
            player2: { faction: 'martell', inPlay: ['Bastard in Hiding'] }
        });

        this.context = new AbilityContext({
            game: this.game,
            player: this.player1Object,
            source: this.houseDayneKnight
        });
        this.addDelayedEffect = (properties) => {
            this.game.resolveGameAction(GameActions.delayedEffect(properties), this.context);
            this.game.continue();
        };
        this.drawWhenKneeled = (card, duration = 'untilEndOfPhase') =>
            this.addDelayedEffect({
                duration,
                when: { onCardKneeled: (event) => event.card === card },
                message: '{player} draws 1 card for {source}',
                gameAction: GameActions.drawCards((context) => ({
                    player: context.player,
                    amount: 1
                }))
            });
    });

    it('resolves after its condition occurs', function () {
        this.drawWhenKneeled(this.tumblestoneKnight);

        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickPrompt('Done');

        expect(this.player1Object.hand).toHaveLength(1);
        expect(this.game.getPlainTextLog()).toContain(
            'player1 draws 1 card for House Dayne Knight'
        );
    });

    it('does not resolve for other events', function () {
        this.drawWhenKneeled(this.bastardInHiding);

        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickPrompt('Done');

        expect(this.player1Object.hand).toHaveLength(0);
    });

    it('resolves only once', function () {
        this.addDelayedEffect({
            when: { onCardKneeled: () => true },
            gameAction: GameActions.drawCards((context) => ({ player: context.player, amount: 1 }))
        });

        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickCard(this.houseDayneKnight);
        this.player1.clickPrompt('Done');

        expect(this.player1Object.hand).toHaveLength(1);
    });

    it('resolves although its source has left play', function () {
        this.drawWhenKneeled(this.tumblestoneKnight);
        this.game.resolveGameAction(
            GameActions.discardCard({ card: this.houseDayneKnight }),
            this.context
        );
        this.game.continue();

        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickPrompt('Done');

        expect(this.houseDayneKnight.location).toBe('discard pile');
        expect(this.player1Object.hand).toHaveLength(1);
    });

    it('expires at the end of its duration', function () {
        this.drawWhenKneeled(this.tumblestoneKnight, 'untilEndOfChallenge');
        this.unopposedChallenge(this.player1, 'Military', this.houseDayneKnight);
        this.player2.clickCard(this.bastardInHiding);

        expect(this.game.effectEngine.delayedEffects).toEqual([]);

        this.player1.clickPrompt('Power');
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickPrompt('Done');

        expect(this.player1Object.hand).toHaveLength(0);
    });

    it('waits until its condition occurs when it lasts until triggered', function () {
        this.drawWhenKneeled(this.tumblestoneKnight, 'untilTriggered');
        this.game.effectEngine.onPhaseEnded();
        this.game.effectEngine.onRoundEnded();

        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickPrompt('Done');

        expect(this.player1Object.hand).toHaveLength(1);
        expect(this.game.effectEngine.delayedEffects).toEqual([]);
    });

    it('expires when an event in its until occurs', function () {
        this.addDelayedEffect({
            duration: 'custom',
            when: { onCardKneeled: (event) => event.card === this.houseDayneKnight },
            until: { onCardKneeled: (event) => event.card === this.tumblestoneKnight },
            gameAction: GameActions.drawCards((context) => ({ player: context.player, amount: 1 }))
        });

        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickPrompt('Done');

        expect(this.game.effectEngine.delayedEffects).toEqual([]);
    });

    it('rejects durations it does not support', function () {
        expect(() =>
            this.addDelayedEffect({
                duration: 'persistent',
                when: {},
                gameAction: GameActions.drawCards({ player: this.player1Object, amount: 1 })
            })
        ).toThrow("'persistent' is not a valid delayed effect duration");
    });
});

describe('lasting effect game action', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Tumblestone Knight', 'House Dayne Knight'] }
        });

        this.game.resolveGameAction(
            GameActions.lastingEffect(() => ({
                duration: 'untilEndOfPhase',
                match: this.tumblestoneKnight,
                effect: Effects.modifyStrength(2)
            })),
            new AbilityContext({
                game: this.game,
                player: this.player1Object,
                source: this.houseDayneKnight
            })
        );
        this.game.continue();
    });

    it('applies the effect for its duration', function () {
        expect(this.tumblestoneKnight.getStrength()).toBe(4);
        expect(this.houseDayneKnight.getStrength()).toBe(2);

        this.player1.clickPrompt('Done');
        this.player2.clickPrompt('Done');

        expect(this.tumblestoneKnight.getStrength()).toBe(2);
    });
});

describe('name a trait game action', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['House Dayne Knight'] }
        });

        this.context = new AbilityContext({
            game: this.game,
            player: this.player1Object,
            source: this.houseDayneKnight
        });
        this.game.resolveGameAction(
            GameActions.nameTrait({
                message: '{player} names the {trait} trait',
                gameAction: GameActions.drawCards((context) => ({
                    player: context.player,
                    amount: context.namedTrait === 'Knight' ? 2 : 1
                }))
            }),
            this.context
        );
        this.game.continue();
    });

    it('prompts the player to name a trait', function () {
        expect(this.player1).toHavePrompt('Name a trait');
    });

    it('resolves its game action with the named trait', function () {
        this.player1.nameTrait('Knight');

        expect(this.context.namedTrait).toBe('Knight');
        expect(this.player1Object.hand).toHaveLength(2);
        expect(this.game.getPlainTextLog()).toContain('player1 names the Knight trait');
        expect(this.player1).isReadyToTakeAction();
    });
});

describe('name a card game action', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['House Dayne Knight'] }
        });

        this.context = new AbilityContext({
            game: this.game,
            player: this.player1Object,
            source: this.houseDayneKnight
        });
        this.game.resolveGameAction(
            GameActions.nameCard({
                message: '{player} names {cardName}',
                gameAction: GameActions.drawCards((context) => ({
                    player: context.player,
                    amount: context.namedCard === 'Hedge Knight' ? 2 : 1
                }))
            }),
            this.context
        );
        this.game.continue();
    });

    it('prompts the player to name a card', function () {
        expect(this.player1).toHavePrompt('Name a card');
    });

    it('does not accept a name that is not a card', function () {
        this.player1.nameCard('Not A Card');

        expect(this.player1).toHavePrompt('Name a card');
    });

    it('resolves its game action with the named card', function () {
        this.player1.nameCard('Hedge Knight');

        expect(this.context.namedCard).toBe('Hedge Knight');
        expect(this.player1Object.hand).toHaveLength(2);
        expect(this.game.getPlainTextLog()).toContain('player1 names Hedge Knight');
        expect(this.player1).isReadyToTakeAction();
    });
});
