describe('The Bounty of Highgarden', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { hand: ['The Bounty of Highgarden'], gold: 2 }
        });
        this.player1.clickCard(this.theBountyOfHighgarden);
    });

    it('gains 5 gold', function () {
        expect(this.player1Object.gold).toBe(5);
        expect(this.player1).isReadyToTakeAction();
    });
});
