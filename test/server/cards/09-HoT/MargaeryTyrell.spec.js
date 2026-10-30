describe('Margaery Tyrell (HoT)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Margaery Tyrell (HoT)'] },
            player2: { inPlay: ['Castle Guard'] }
        });
        this.player1.clickPrompt('Power');
        this.player1.clickCard(this.margaeryTyrell);
        this.player1.clickPrompt('Done');
        this.player1.triggerAbility('Margaery Tyrell');
        this.player1.clickCard(this.castleGuard);
    });

    it('kneels a character of the defending player to have it defend, and gets +1 STR for each defender', function () {
        expect(this.castleGuard.kneeled).toBe(true);
        expect(this.game.currentChallenge.isDefending(this.castleGuard)).toBe(true);
        expect(this.margaeryTyrell.getStrength()).toBe(
            this.margaeryTyrell.getPrintedStrength() + 1
        );
    });
});
