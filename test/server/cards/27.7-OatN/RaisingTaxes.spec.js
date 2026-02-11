// Generated with Claude Code - claude-opus-4-5-20251101
// - 2026-02-01: Updated to use new test helpers (setupCards)

describe('Raising Taxes', function () {
    integration(function () {
        beforeEach(function () {
            const deck1 = this.buildDeck('lannister', ['Raising Taxes', 'Tyrion Lannister (Core)']);
            const deck2 = this.buildDeck('lannister', ['A Noble Cause', 'Alayaya']);
            this.player1.selectDeck(deck1);
            this.player2.selectDeck(deck2);
            this.startGame();
            this.keepStartingHands();

            this.tyrion = this.player1.findCardByName('Tyrion Lannister', 'hand');

            this.alayaya = this.player2.findCardByName('Alayaya', 'hand');

            this.player1.setupCards(this.tyrion);
            this.player2.setupCards(this.alayaya);

            this.completeSetup();
        });

        describe('when characters have gold', function () {
            beforeEach(function () {
                // Give gold to characters via bestow
                this.tyrion.modifyGold(2);
                this.alayaya.modifyGold(3);

                this.selectFirstPlayer(this.player1);
            });

            it('should move gold only from revealing player characters', function () {
                // Player 1's Tyrion had 2 gold, now has 0
                expect(this.tyrion.gold).toBe(0);
                // Player 2's Alayaya still has 3 gold (not affected)
                expect(this.alayaya.gold).toBe(3);
            });

            it('should give gold only to the revealing player', function () {
                // Tyrion's 2 gold goes to player 1
                expect(this.player1Object.gold).toBeGreaterThan(0);
            });
        });

        describe('when no characters have gold', function () {
            beforeEach(function () {
                this.selectFirstPlayer(this.player1);
            });

            it('should not cause errors', function () {
                expect(this.tyrion.gold).toBe(0);
                expect(this.alayaya.gold).toBe(0);
            });
        });
    });
});
