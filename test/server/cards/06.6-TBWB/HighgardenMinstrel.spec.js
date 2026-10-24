describe('Highgarden Minstrel', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { inPlay: ['Highgarden Minstrel'], hand: ['"Lord Renly\'s Ride"'], gold: 1 }
        });
        this.player1.clickCard(this.lordRenlysRide);
        this.player1.clickCard(this.highgardenMinstrel);
        this.player1.triggerAbility(this.highgardenMinstrel);
    });

    it('gains 1 gold after you play a Song event', function () {
        expect(this.player1Object.gold).toBe(1);
        expect(this.player1).isReadyToTakeAction();
    });
});
