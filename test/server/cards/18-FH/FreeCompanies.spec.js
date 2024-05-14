import { Tokens } from '../../../../server/game/Constants/index.js';

describe('Free Companies', function () {
    integration(function () {
        beforeEach(function () {
            const deck1 = this.buildDeck('lannister', [
                'Free Companies',
                'Time of Plenty',
                'Brown Ben Plumm',
                'Hedge Knight'
            ]);
            this.player1.selectDeck(deck1);
            this.player2.selectDeck(deck1);
            this.startGame();
            this.keepStartingHands();

            this.player1.clickCard('Brown Ben Plumm', 'hand');
            this.player1.clickCard('Hedge Knight', 'hand');
            this.completeSetup();
            this.selectFirstPlayer(this.player1);

            this.ben = this.player1.findCardByName('Brown Ben Plumm');
            this.hedge = this.player1.findCardByName('Hedge Knight');
        });

        describe('when the place gold action is used', function () {
            beforeEach(function () {
                this.player1.clickMenu('Free Companies', 'Place gold');
            });

            it('should allow to target a mercenary', function () {
                expect(this.ben.hasToken(Tokens.gold)).toBe(false);
                this.player1.clickCard(this.ben);
                expect(this.ben.hasToken(Tokens.gold)).toBe(true);
            });

            it('should allow to target a card without gold', function () {
                expect(this.hedge.hasToken(Tokens.gold)).toBe(false);
                expect(this.hedge.getStrength()).toBe(1);
                this.player1.clickCard(this.hedge);
                expect(this.hedge.hasToken(Tokens.gold)).toBe(true);
                expect(this.hedge.getStrength()).toBe(2);
            });

            it('should allow to target a mercenary with gold', function () {
                expect(this.ben.hasToken(Tokens.gold)).toBe(false);
                this.ben.tokens.gold = 1;
                this.player1.clickCard(this.ben);
                expect(this.ben.tokens.gold).toBe(2);
            });

            it('should NOT allow to target a character with gold', function () {
                expect(this.hedge.hasToken(Tokens.gold)).toBe(false);
                this.hedge.tokens.gold = 1;
                this.player1.clickCard(this.hedge);
                expect(this.hedge.tokens.gold).toBe(1);
                expect(this.player1).toHavePrompt('Select a character');
            });
        });
    });
});
