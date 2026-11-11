describe('Roseroad Patrol', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                inPlay: ['Roseroad Patrol']
            },
            player2: { inPlay: ['Tumblestone Knight'] }
        });
    });

    it('gains stealth while you control a character with the highest STR in play', function () {
        expect(this.roseroadPatrol.hasKeyword('Stealth')).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});
