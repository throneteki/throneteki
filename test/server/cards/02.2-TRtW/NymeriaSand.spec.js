describe('Nymeria Sand (TRtW)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { faction: 'martell', inPlay: ['Nymeria Sand (TRtW)', 'Tyene Sand (TS)'] },
            player2: { inPlay: ['Burned Men'] }
        });
        this.player1.clickPrompt('Intrigue');
        this.player1.clickCard(this.tyeneSand);
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.nymeriaSand);
        this.player1.clickCard(this.burnedMen);
        this.player1.clickPrompt('Military');
    });

    it("makes an opponent's character lose a challenge icon of your choice and gives that icon to each Sand Snake character you control", function () {
        expect(this.burnedMen.hasIcon('military')).toBe(false);
        expect(this.tyeneSand.hasIcon('military')).toBe(true);
        expect(this.nymeriaSand.hasIcon('military')).toBe(true);
        expect(this.player2).isReadyToTakeAction();
    });
});
