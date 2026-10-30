describe('Bowen Marsh (WotW)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Bowen Marsh (WotW)']
            }
        });

        this.player1.clickPrompt('Intrigue');
        this.player1.clickCard(this.bowenMarsh);
        this.player1.clickPrompt('Done');
    });

    it('gives each Steward character you control insight during [intrigue] challenges, and gives +1 reserve', function () {
        expect(this.bowenMarsh.hasKeyword('Insight')).toBe(true);
        expect(this.player1Object.getReserve()).toBe(7);

        this.skipActionWindow();
        this.player2.clickPrompt('Done');
        this.skipActionWindow();

        expect(this.player1).isReadyToTakeAction();
    });
});
