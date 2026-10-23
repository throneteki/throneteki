describe('Highgarden Honor Guard', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { hand: ['Highgarden Honor Guard'], inPlay: ['Rose Garden'], gold: 10 }
        });
        this.player1.clickCard(this.highgardenHonorGuard);
    });

    it('costs 1 less to ambush for each The Reach location you control', function () {
        expect(this.highgardenHonorGuard.location).toBe('play area');
        expect(this.player1Object.gold).toBe(5);
        expect(this.player1).isReadyToTakeAction();
    });
});
