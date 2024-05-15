import { Tokens } from '../../../../server/game/Constants/index.js';

describe('Power Behind the Throne', function () {
    integration(function () {
        beforeEach(function () {
            const deck = this.buildDeck('lannister', [
                'Power Behind the Throne',
                'Cersei Lannister (LoCR)'
            ]);
            this.player1.selectDeck(deck);
            this.player2.selectDeck(deck);
            this.startGame();
            this.keepStartingHands();

            this.plot = this.player1.findCardByName('Power Behind the Throne');
            this.cersei = this.player1.findCardByName('Cersei Lannister (LoCR)');

            this.player1.clickCard(this.cersei);
            this.completeSetup();

            this.selectFirstPlayer(this.player1);

            // Resolve plot order
            this.selectPlotOrder(this.player1);

            // Manually kneel Cersei
            this.player1.clickCard(this.cersei);
            expect(this.cersei.kneeled).toBe(true);
        });

        it('should place a stand token', function () {
            expect(this.plot.tokens[Tokens.stand]).toBe(1);
        });

        describe('when using the stand action', function () {
            beforeEach(function () {
                this.player1.clickMenu(this.plot, 'Discard a stand token');
                this.player1.clickCard(this.cersei);
            });

            it('should allow a character to be stood', function () {
                expect(this.cersei.kneeled).toBe(false);
            });

            it('should spend the stand token', function () {
                // We delete tokens once they reach 0.
                expect(this.plot.tokens[Tokens.stand]).toBeUndefined();
            });
        });
    });
});
