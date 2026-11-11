describe('Loot', function () {
    function setup(plot) {
        this.setupTest({
            phase: 'challenge',
            player1: { plot, inPlay: ['Hedge Knight'], hand: ['Loot'] },
            player2: { drawDeck: Array(8).fill('Castle Guard'), gold: 5 }
        });
        this.startingGold = this.player1Object.gold;
        this.opponentGold = this.player2Object.gold;
        this.unopposedChallenge(this.player1, 'Military', this.hedgeKnight);
        this.player1.triggerAbility('Loot');
    }

    it("pays X gold from the losing opponent's gold pool to discard the top X cards of their deck", function () {
        setup.call(this, 'Filler Plot');
        this.player1.selectValue('5');

        expect(this.player1Object.gold).toBe(this.startingGold);
        expect(this.player2Object.gold).toBe(this.opponentGold - 5);
        expect(this.player2Object.discardPile.length).toBe(5);
        expect(this.player1).isReadyToTakeAction();
    });

    it('applies cost reductions to the opponent paying', function () {
        setup.call(this, "Littlefinger's Meddling (R)");
        this.player1.selectValue('6');

        expect(this.player2Object.gold).toBe(this.opponentGold - 4);
        expect(this.player2Object.discardPile.length).toBe(6);
    });
});
