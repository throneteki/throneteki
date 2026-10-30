describe('Beguiled', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: [{ card: 'Tumblestone Knight', attachments: ['Beguiled'] }] }
        });
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.beguiled);
        this.player1.clickPrompt('Military');
    });

    it('kneels to make the attached character lose a challenge icon of your choice', function () {
        expect(this.beguiled.kneeled).toBe(true);
        expect(this.tumblestoneKnight.hasIcon('military')).toBe(false);
        expect(this.player2).isReadyToTakeAction();
    });
});
