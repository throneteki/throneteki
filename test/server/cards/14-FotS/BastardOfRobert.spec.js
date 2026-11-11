describe('Bastard of Robert', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                faction: 'baratheon',
                inPlay: ['Robert Baratheon (Core)'],
                hand: ['Bastard of Robert'],
                drawDeck: ['Hot Pie (FFH)'],
                gold: 0
            }
        });
        this.player1.clickCard(this.bastardOfRobert);
        this.player1.triggerAbility(this.bastardOfRobert);
    });

    it('costs 2 less to marshal while you control Robert Baratheon, and draws 1 card after it enters play while you control a King', function () {
        expect(this.bastardOfRobert.location).toBe('play area');
        expect(this.hotPie.location).toBe('hand');
        expect(this.player1).isReadyToTakeAction();
    });
});
