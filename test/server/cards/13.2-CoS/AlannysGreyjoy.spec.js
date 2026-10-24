describe('Alannys Greyjoy (CoS)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                faction: 'greyjoy',
                inPlay: ['Alannys Greyjoy (CoS)'],
                hand: ['Iron Fleet Scout'],
                drawDeck: ['Hot Pie (FFH)'],
                gold: 0
            }
        });
        this.player1.clickCard(this.ironFleetScout);
        this.player1.triggerAbility(this.alannysGreyjoy);
    });

    it('draws 1 card after a greyjoy location enters play under your control', function () {
        expect(this.hotPie.location).toBe('hand');
        expect(this.player1).isReadyToTakeAction();
    });
});
