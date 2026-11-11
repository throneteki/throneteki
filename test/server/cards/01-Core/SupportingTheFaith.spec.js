describe('Supporting the Faith', function () {
    beforeEach(function () {
        this.setupTest({ phase: 'marshal', player1: { plot: 'Supporting the Faith' } });
        this.completeMarshalPhase();
    });

    it('makes each player return all gold in their gold pool to the treasury after the challenges phase begins', function () {
        expect(this.player1Object.gold).toBe(0);
        expect(this.player2Object.gold).toBe(0);
        expect(this.player1).isReadyToTakeAction();
    });
});
