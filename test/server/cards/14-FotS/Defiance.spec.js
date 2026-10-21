describe('Defiance', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                hand: ['Defiance'],
                inPlay: [{ card: 'Tumblestone Knight', kneeling: true }]
            }
        });
        this.player1.clickCard(this.defiance);
        this.player1.clickCard(this.tumblestoneKnight);
    });

    it('stands a character that has not participated in a challenge this phase', function () {
        expect(this.tumblestoneKnight.kneeled).toBe(false);
        expect(this.player1).isReadyToTakeAction();
    });
});
