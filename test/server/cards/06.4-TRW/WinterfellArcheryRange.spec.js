describe('Winterfell Archery Range', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Winterfell Archery Range'] },
            player2: { inPlay: ['Tumblestone Knight'] }
        });
        this.player1.clickPrompt('Done');
        this.player2.clickPrompt('Military');
        this.player2.clickCard(this.tumblestoneKnight);
        this.player2.clickPrompt('Done');
        this.player1.clickCard(this.winterfellArcheryRange);
        this.player1.clickCard(this.tumblestoneKnight);
    });

    it('kneels to remove a participating character with STR 3 or lower from a military challenge', function () {
        expect(this.tumblestoneKnight.isParticipating()).toBe(false);
        expect(this.player2).isReadyToTakeAction();
    });
});
