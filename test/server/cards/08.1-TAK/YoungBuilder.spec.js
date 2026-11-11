describe('Young Builder', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                faction: 'thenightswatch',
                inPlay: [{ card: 'Young Builder', gold: 1 }],
                hand: ["Brandon's Gift"],
                drawDeck: ['Hot Pie (FFH)'],
                gold: 2
            }
        });
        this.player1.clickCard(this.brandonsGift);
        this.player1.triggerAbility(this.youngBuilder);
    });

    it('discards 1 gold to draw 1 card after a thenightswatch location or attachment enters play under your control', function () {
        expect(this.youngBuilder.gold).toBe(0);
        expect(this.hotPie.location).toBe('hand');
        expect(this.player1).isReadyToTakeAction();
    });
});
