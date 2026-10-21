describe('The Stormlands', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['The Stormlands', 'Cersei Lannister (Core)', 'Tumblestone Knight'] }
        });
        this.unopposedChallenge(this.player1, 'Power', this.cerseiLannister);
        this.player1.triggerAbility(this.theStormlands);
    });

    it('lets you initiate an additional power challenge, and kneels to stand a participating Queen after you win a power challenge', function () {
        this.player1.clickCard(this.cerseiLannister);

        expect(this.cerseiLannister.kneeled).toBe(false);

        this.unopposedChallenge(this.player1, 'Power', this.tumblestoneKnight);

        expect(this.tumblestoneKnight.kneeled).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});
