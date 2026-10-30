describe('Starfall Cavalry', function () {
    function setup(usedPlots) {
        this.setupTest({
            phase: 'marshal',
            player1: {
                hand: ['Starfall Cavalry'],
                usedPlots,
                drawDeck: Array(3).fill('Hedge Knight'),
                gold: 6
            }
        });
        this.handSize = this.player1Object.hand.length;
        this.player1.clickCard(this.starfallCavalry);
        this.player1.triggerAbility(this.starfallCavalry);
    }

    it('draws 1 card after it enters play', function () {
        setup.call(this, []);
        expect(this.player1Object.hand.length).toBe(this.handSize - 1 + 1);
        expect(this.player1).isReadyToTakeAction();
    });

    it('draws 3 cards instead with 3 or more plots in your used pile', function () {
        setup.call(this, ['A Noble Cause', 'Sneak Attack', 'Famine']);
        expect(this.player1Object.hand.length).toBe(this.handSize - 1 + 3);
        expect(this.player1).isReadyToTakeAction();
    });
});
