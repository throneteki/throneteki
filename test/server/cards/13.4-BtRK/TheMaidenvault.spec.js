describe('The Maidenvault', function () {
    it('stands a participating Lady and removes her from the challenge after it comes out of shadows', function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Margaery Tyrell (HoT)'],
                shadows: ['The Maidenvault'],
                gold: 1
            }
        });
        this.player1.clickPrompt('Power');
        this.player1.clickCard(this.margaeryTyrell);
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.theMaidenvault);
        this.player1.triggerAbility('The Maidenvault');
        this.player1.clickCard(this.margaeryTyrell);
        expect(this.margaeryTyrell.kneeled).toBe(false);
        expect(this.game.currentChallenge.isParticipating(this.margaeryTyrell)).toBe(false);
    });

    it('kneels to return to shadows when the challenges phase ends', function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['The Maidenvault'] }
        });
        this.completeChallengesPhase();
        this.player1.triggerAbility('The Maidenvault');
        expect(this.theMaidenvault.location).toBe('shadows');
    });
});
