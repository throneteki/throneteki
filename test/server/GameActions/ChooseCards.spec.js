import AbilityContext from '../../../server/game/AbilityContext.js';
import GameActions from '../../../server/game/GameActions/index.js';

describe('chooseCards game action', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Tumblestone Knight', { card: 'House Dayne Knight', kneeling: true }]
            },
            player2: { faction: 'martell', inPlay: ['Bastard in Hiding', 'Palace Spearman'] }
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
            this.player1.clickPrompt('Done');

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

    it('cannot change the game state when no player has a card it could affect', function () {
        const action = this.chooseAndKneel(() => [this.player1Object]);
        this.game.resolveGameAction(
            GameActions.kneelCard({ card: this.tumblestoneKnight }),
            this.context
        );
        this.game.continue();

        expect(action.allow(this.context)).toBe(false);
    });
});
