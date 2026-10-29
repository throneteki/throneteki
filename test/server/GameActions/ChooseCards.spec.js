import AbilityContext from '../../../server/game/AbilityContext.js';
import GameActions from '../../../server/game/GameActions/index.js';

describe('chooseCards game action', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Tumblestone Knight', { card: 'House Dayne Knight', kneeling: true }],
                discard: ['Hedge Knight']
            },
            player2: {
                faction: 'martell',
                inPlay: ['Bastard in Hiding', 'Palace Spearman'],
                discard: ['Castle Guard']
            }
        });

        this.context = new AbilityContext({
            game: this.game,
            player: this.player1Object,
            source: this.tumblestoneKnight
        });
        this.kneeled = [];
        this.game.on('onCardKneeled', (event) => this.kneeled.push(event.card));
        this.chooseAndKneel = (players) =>
            GameActions.chooseCards({
                players,
                title: 'Select a character to kneel',
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.controller === context.choosingPlayer,
                gameAction: (card) => GameActions.kneelCard({ card })
            });
    });

    describe('when each player chooses', function () {
        beforeEach(function () {
            this.game.resolveGameAction(
                this.chooseAndKneel(() => [this.player1Object, this.player2Object]),
                this.context
            );
            this.game.continue();
        });

        it('prompts each player in turn, only for cards the action could affect', function () {
            expect(this.player1).toHavePrompt('Select a character to kneel');
            expect(this.player1).toBeAbleToSelect(this.tumblestoneKnight);
            expect(this.player1).not.toBeAbleToSelect(this.houseDayneKnight);
            expect(this.player1).not.toBeAbleToSelect(this.bastardInHiding);
            expect(this.player2).not.toHavePrompt('Select a character to kneel');
        });

        it('resolves every chosen card together once everyone has chosen', function () {
            this.player1.clickCard(this.tumblestoneKnight);

            expect(this.tumblestoneKnight.kneeled).toBe(false);
            expect(this.player2).toBeAbleToSelect(this.bastardInHiding);
            expect(this.player2).not.toBeAbleToSelect(this.tumblestoneKnight);

            this.player2.clickCard(this.palaceSpearman);

            expect(this.kneeled).toEqual([this.tumblestoneKnight, this.palaceSpearman]);
            expect(this.bastardInHiding.kneeled).toBe(false);
            expect(this.game.getPlainTextLog()).toContain('player1 kneels Tumblestone Knight');
            expect(this.game.getPlainTextLog()).toContain('player2 kneels Palace Spearman');
        });
    });

    describe('when the card lists the players out of player order', function () {
        beforeEach(function () {
            this.game.resolveGameAction(
                this.chooseAndKneel(() => [this.player2Object, this.player1Object]),
                this.context
            );
            this.game.continue();
        });

        it('still asks the first player first', function () {
            expect(this.player1).toHavePrompt('Select a character to kneel');
            expect(this.player2).not.toHavePrompt('Select a character to kneel');
        });

        it('does not let a player skip the choice', function () {
            expect(this.player1).not.toHavePromptButton('Done');

            expect(this.player1).toHavePrompt('Select a character to kneel');
        });
    });

    describe('when a player has nothing the action could affect', function () {
        beforeEach(function () {
            this.game.resolveGameAction(
                GameActions.kneelCard({ card: this.tumblestoneKnight }),
                this.context
            );
            this.game.continue();
            this.kneeled = [];

            this.game.resolveGameAction(
                this.chooseAndKneel(() => [this.player1Object, this.player2Object]),
                this.context
            );
            this.game.continue();
        });

        it('skips them', function () {
            expect(this.player1).not.toHavePrompt('Select a character to kneel');
            expect(this.player2).toHavePrompt('Select a character to kneel');
        });
    });

    it('lets a player choose no cards when the choice is optional', function () {
        this.game.resolveGameAction(
            GameActions.chooseCards({
                mode: 'upTo',
                numCards: 1,
                optional: true,
                title: 'Select a character to kneel',
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.controller === context.choosingPlayer,
                gameAction: (card) => GameActions.kneelCard({ card })
            }),
            this.context
        );
        this.game.continue();

        this.player1.clickPrompt('Done');

        expect(this.player1).not.toHavePrompt('Select a character to kneel');
        expect(this.kneeled).toEqual([]);
    });

    it('lets a player decline an optional single-card choice without resolving an action', function () {
        this.game.resolveGameAction(
            GameActions.chooseCards({
                optional: true,
                title: 'Select a character to kneel',
                cardCondition: (card, context) =>
                    card.location === 'play area' && card.controller === context.choosingPlayer,
                gameAction: (card) => GameActions.kneelCard({ card })
            }),
            this.context
        );
        this.game.continue();
        this.player1.clickPrompt('Done');

        expect(this.context.chosenCards).toEqual([]);
        expect(this.kneeled).toEqual([]);
        expect(this.tumblestoneKnight.kneeled).toBe(false);
        expect(this.player1).isReadyToTakeAction();
    });

    it('continues to the next player when an optional single-card choice is declined', function () {
        this.game.resolveGameAction(
            GameActions.chooseCards({
                players: () => [this.player1Object, this.player2Object],
                optional: true,
                title: 'Select a character to kneel',
                cardCondition: (card, context) =>
                    card.location === 'play area' && card.controller === context.choosingPlayer,
                gameAction: (card) => GameActions.kneelCard({ card })
            }),
            this.context
        );
        this.game.continue();
        this.player1.clickPrompt('Done');
        expect(this.player2).toHavePrompt('Select a character to kneel');
        this.player2.clickCard(this.bastardInHiding);

        expect(this.context.chosenCards).toEqual([this.bastardInHiding]);
        expect(this.kneeled).toEqual([this.bastardInHiding]);
        expect(this.tumblestoneKnight.kneeled).toBe(false);
        expect(this.player1).isReadyToTakeAction();
    });

    it('cannot change the game state when no player has a card it could affect', function () {
        const action = this.chooseAndKneel(() => [this.player1Object]);
        this.game.resolveGameAction(
            GameActions.kneelCard({ card: this.tumblestoneKnight }),
            this.context
        );
        this.game.continue();

        expect(action.allow(this.context)).toBe(false);
    });

    it('passes the card condition properties the context inherits', function () {
        const action = GameActions.chooseCards({
            player: (context) => context.opponent,
            cardCondition: (card, context) =>
                card.location === 'play area' && card.controller === context.player,
            gameAction: (card) => GameActions.kneelCard({ card })
        });
        const candidate = Object.create(this.context);
        candidate.opponent = this.player2Object;

        expect(action.allow(candidate)).toBe(true);
    });

    it('can restrict a multi-card choice to one controller', function () {
        this.game.resolveGameAction(
            GameActions.chooseCards({
                mode: 'upTo',
                numCards: 5,
                singleController: true,
                cardCondition: (card) => card.location === 'discard pile',
                gameAction: (card) => GameActions.removeFromGame({ card })
            }),
            this.context
        );
        this.game.continue();

        expect(this.player1).toBeAbleToSelect(this.hedgeKnight);
        expect(this.player1).toBeAbleToSelect(this.castleGuard);
        this.player1.clickCard(this.hedgeKnight);
        expect(this.player1).not.toBeAbleToSelect(this.castleGuard);
        this.player1.clickPrompt('Done');

        expect(this.hedgeKnight.location).toBe('out of game');
        expect(this.castleGuard.location).toBe('discard pile');
        expect(this.player1).isReadyToTakeAction();
    });
});

describe('chooseCards game action with revealTargets', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Tumblestone Knight'] },
            player2: { hand: ['Hot Pie (FFH)', 'Burned Men'] }
        });

        const context = new AbilityContext({
            game: this.game,
            player: this.player1Object,
            source: this.tumblestoneKnight
        });
        this.game.resolveGameAction(
            GameActions.chooseCards({
                revealTargets: true,
                cardCondition: (card) => card.location === 'hand',
                gameAction: (card) => GameActions.discardCard({ card })
            }),
            context
        );
        this.game.continue();
    });

    it('shows the choosable cards to the choosing player only while they choose', function () {
        expect(this.game.cardVisibility.isVisible(this.burnedMen, this.player1Object)).toBe(true);
        expect(this.game.cardVisibility.isVisible(this.burnedMen, this.player2Object)).toBe(true);

        this.player1.clickCard(this.hotPie);

        expect(this.hotPie.location).toBe('discard pile');
        expect(this.game.cardVisibility.isVisible(this.burnedMen, this.player1Object)).toBe(false);
    });
});
