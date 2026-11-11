describe('Mina Redwyne (HMW)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                faction: 'tyrell',
                inPlay: ['Mina Redwyne (HMW)'],
                hand: ['Arbor Knight'],
                drawDeck: ['Hot Pie (FFH)'],
                gold: 2
            }
        });
        this.player1.clickCard(this.arborKnight);
        this.player1.triggerAbility(this.minaRedwyne);
    });

    it('draws 1 card after a House Redwyne card enters play under your control', function () {
        expect(this.hotPie.location).toBe('hand');
        expect(this.player1).isReadyToTakeAction();
    });
});
