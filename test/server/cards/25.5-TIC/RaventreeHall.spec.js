describe('Raventree Hall', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Raventree Hall', 'Eddard Stark (Core)'] }
        });
        this.unopposedChallenge(this.player1, 'Power', this.eddardStark);
        this.startingGold = this.player1Object.gold;
        this.player1.triggerAbility(this.raventreeHall);
    });

    it('gains 1 gold after power is gained by a character you control', function () {
        expect(this.player1Object.gold).toBe(this.startingGold + 1);
        expect(this.player1).isReadyToTakeAction();
    });
});
