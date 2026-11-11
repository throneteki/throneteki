describe('Arbor Marketplace', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { faction: 'tyrell', inPlay: ['Arbor Marketplace', 'Tumblestone Knight'] }
        });
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.arborMarketplace);
        this.player1.clickCard(this.tumblestoneKnight);
    });

    it('kneels to give a participating character +1 STR until the end of the challenge', function () {
        expect(this.arborMarketplace.kneeled).toBe(true);
        expect(this.tumblestoneKnight.getStrength()).toBe(3);
        expect(this.player2).isReadyToTakeAction();
    });
});
