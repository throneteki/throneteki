describe('Ser Axell Florent', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { faction: 'baratheon', inPlay: [{ card: 'Ser Axell Florent', gold: 1 }] },
            player2: { inPlay: ['Tumblestone Knight'] }
        });
        this.unopposedChallenge(this.player1, 'Power', this.serAxellFlorent);
        this.player1.triggerAbility(this.serAxellFlorent);
        this.player1.clickCard(this.tumblestoneKnight);
    });

    it('discards 1 gold to kneel a character without attachments after you win a challenge he is participating in', function () {
        expect(this.serAxellFlorent.gold).toBe(0);
        expect(this.tumblestoneKnight.kneeled).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});
