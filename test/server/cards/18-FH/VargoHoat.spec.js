import { Tokens } from '../../../../server/game/Constants/index.js';

describe('Vargo Hoat', function () {
    integration(function () {
        beforeEach(function () {
            const deck1 = this.buildDeck('tyrell', [
                'Marching Orders',
                'Vargo Hoat',
                'Planky Town Trader',
                'Golden Company'
            ]);
            this.player1.selectDeck(deck1);
            this.player2.selectDeck(deck1);
            this.startGame();
            this.keepStartingHands();

            this.vargo = this.player1.findCardByName('Vargo Hoat');
            this.bestowChud = this.player1.findCardByName('Planky Town Trader');
            this.company = this.player2.findCardByName('Golden Company');
            this.player2.clickCard(this.company);
            this.completeSetup();

            this.selectFirstPlayer(this.player1);
        });

        describe('after a card with bestow enters play', function () {
            beforeEach(function () {
                //marshal
                this.player1.clickCard(this.vargo);
            });

            it('it should put a gold on it from the treasury', function () {
                expect(this.player1).toHavePrompt('Select bestow amount for Vargo Hoat');
                this.player1.clickPrompt('1');
                expect(this.player1).toHavePrompt('Any reactions to Vargo Hoat entering play?');
                this.player1.clickCard(this.vargo);
                expect(this.vargo.tokens[Tokens.gold]).toBe(2);
                this.player1.clickCard(this.bestowChud);
                expect(this.player1).toHavePrompt('Select bestow amount for Planky Town Trader');
                this.player1.clickPrompt('1');
                expect(this.player1).toHavePrompt(
                    'Any reactions to Planky Town Trader entering play?'
                );
                this.player1.clickCard(this.vargo);
                expect(this.bestowChud.tokens[Tokens.gold]).toBe(2);
            });
        });

        describe('after a Vargo Hoat moves gold to a character', function () {
            beforeEach(function () {
                //marshal
                this.player1.clickCard(this.vargo);
                this.player1.clickPrompt('1');
                this.player1.clickCard(this.vargo);
                this.player1.clickMenu(this.vargo, 'Move 1 gold to character');
            });

            it('it should give Vargo Hoat that characters keywords', function () {
                expect(this.company.getKeywords()).toContain('bestow (1)');
                expect(this.vargo.getKeywords()).toContain('bestow (2)');
                expect(this.player1).toHavePrompt('Select a character');
                this.player1.clickCard(this.company);
                expect(this.company.getKeywords()).toContain('renown');
                expect(this.vargo.getKeywords()).toContain('renown');
                expect(this.company.hasToken('gold')).toBe(true);
                expect(this.vargo.tokens['gold']).toBe(1);
            });
        });
    });
});
