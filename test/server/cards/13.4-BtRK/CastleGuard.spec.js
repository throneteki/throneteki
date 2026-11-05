describe('Castle Guard', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { shadows: ['Castle Guard', 'Catspaw'], gold: 5 }
        });
        this.player1.clickCard(this.catspaw);
        this.player1.clickPrompt('Pass');
        this.player1.clickCard(this.castleGuard);
        this.player1.triggerAbility(this.castleGuard);
        this.player1.clickCard(this.catspaw);
    });

    it('returns another character that came out of shadows this phase to shadows after it comes out of shadows', function () {
        expect(this.catspaw.location).toBe('shadows');
        expect(this.castleGuard.location).toBe('play area');
        expect(this.player1).isReadyToTakeAction();
    });
});
