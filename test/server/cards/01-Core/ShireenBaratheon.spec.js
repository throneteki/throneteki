describe('Shireen Baratheon (Core)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { faction: 'baratheon', inPlay: ['Shireen Baratheon (Core)'] },
            player2: { inPlay: ['Burned Men', 'Tumblestone Knight'] }
        });
        this.player1.clickPrompt('Done');
        this.player2.clickPrompt('Military');
        this.player2.clickCard(this.burnedMen);
        this.player2.clickPrompt('Done');
        this.skipActionWindow();
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.player1.clickCard(this.shireenBaratheon);
        this.player1.triggerAbility(this.shireenBaratheon);
        this.player1.clickCard(this.tumblestoneKnight);
    });

    it('kneels a character when she is killed', function () {
        expect(this.shireenBaratheon.location).toBe('dead pile');
        expect(this.tumblestoneKnight.kneeled).toBe(true);
        expect(this.player2).isReadyToTakeAction();
    });
});
