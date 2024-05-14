import { Tokens } from '../../../../server/game/Constants/index.js';

describe('Harwin', function () {
    integration(function () {
        beforeEach(function () {
            const deck1 = this.buildDeck('tyrell', [
                'Marching Orders',
                'Harwin',
                'Robert Baratheon (Core)'
            ]);
            this.player1.selectDeck(deck1);
            this.player2.selectDeck(deck1);
            this.startGame();
            this.keepStartingHands();

            this.harwin = this.player1.findCardByName('Harwin');
            this.robert = this.player1.findCardByName('Robert Baratheon');
            this.player1.clickCard(this.robert);
            this.completeSetup();

            this.selectFirstPlayer(this.player1);
        });

        describe('after Harwin´s action is used', function () {
            beforeEach(function () {
                this.player1.clickCard(this.harwin);
                this.player1.clickPrompt('1');
                this.completeMarshalPhase();
                this.player1.clickPrompt('Military');
                this.player1.clickCard(this.harwin);
                this.player1.clickPrompt('Done');
                this.player1.clickMenu(this.harwin, 'Discard 1 gold');
            });

            it('it should add the chosen character to the challenge', function () {
                expect(this.player1).toHavePrompt('Select a character');
                expect(this.robert.isParticipating()).toBe(false);
                this.player1.clickCard(this.robert);
                expect(this.robert.isParticipating()).toBe(true);
                expect(this.harwin.hasToken(Tokens.gold)).toBe(false);
            });
        });
    });
});
