describe('Broken Men', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { hand: ['Broken Men'], inPlay: ['Tumblestone Knight', 'The Kingsroad'] },
            player2: { inPlay: ['Free Brothers (ATT)', 'Ser Jaime Lannister (Core)'] }
        });
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.player2.clickCard(this.freeBrothers);
        this.player2.clickCard(this.serJaimeLannister);
        this.player2.clickPrompt('Done');
        this.skipActionWindow();
        this.player1.triggerAbility(this.brokenMen);
    });

    it('sacrifices a location to discard a participating Army character or one with printed cost 4 or lower after you lose a military challenge', function () {
        this.player1.clickCard(this.theKingsroad);

        expect(this.player1).not.toBeAbleToSelect(this.serJaimeLannister);

        this.player1.clickCard(this.freeBrothers);

        expect(this.theKingsroad.location).toBe('discard pile');
        expect(this.freeBrothers.location).toBe('discard pile');
        expect(this.player1).isReadyToTakeAction();
    });
});
