describe('Summerhall (ChoS)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                inPlay: ['Summerhall (ChoS)'],
                hand: ['Visited by Shadows']
            },
            player2: {
                inPlay: ['Steward at the Wall']
            }
        });

        this.player1.clickCard(this.visitedByShadows);
        this.player1.clickCard(this.stewardAtTheWall);
    });

    it('kneels to kill a character after its STR is reduced to 0 by a card effect', function () {
        this.player1.triggerAbility(this.summerhall);

        expect(this.summerhall.kneeled).toBe(true);
        expect(this.stewardAtTheWall.location).toBe('dead pile');
        expect(this.player1).isReadyToTakeAction();
    });
});
