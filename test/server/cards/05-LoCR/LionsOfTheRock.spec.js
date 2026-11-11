describe('Lions of the Rock', function () {
    beforeEach(function () {
        this.setupTest({ phase: 'marshal', player1: { plot: 'Lions of the Rock' } });
        this.startingGold = this.player1Object.gold;
        this.completeMarshalPhase();
        this.player1.triggerAbility(this.lionsOfTheRock);
    });

    it('gains 3 gold after the challenges phase begins', function () {
        expect(this.player1Object.gold).toBe(this.startingGold + 3);
        expect(this.player1).isReadyToTakeAction();
    });
});
