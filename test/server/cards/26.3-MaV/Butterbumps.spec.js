describe('Butterbumps (MaV)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Butterbumps (MaV)', 'Cersei Lannister (Core)'] }
        });
        this.player1.clickPrompt('Intrigue');
        this.player1.clickCard(this.butterbumps);
        this.player1.clickCard(this.cerseiLannister);
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.butterbumps);
    });

    it('returns to shadows to stand and remove a participating character with higher STR from the challenge', function () {
        this.player1.clickCard(this.cerseiLannister);

        expect(this.butterbumps.location).toBe('shadows');
        expect(this.cerseiLannister.kneeled).toBe(false);
        expect(this.cerseiLannister.isParticipating()).toBe(false);

        this.player2.clickPrompt('Pass');
        this.player1.clickPrompt('Pass');
        this.player2.clickPrompt('Done');
        this.skipActionWindow();
        expect(this.player1).isReadyToTakeAction();
    });
});
