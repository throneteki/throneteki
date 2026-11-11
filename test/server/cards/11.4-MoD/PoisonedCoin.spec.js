describe('Poisoned Coin', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { shadows: ['Poisoned Coin'], inPlay: ['Scheming Snake (ATT)'] },
            player2: { inPlay: ['Tumblestone Knight'] }
        });
        this.unopposedChallenge(this.player1, 'Intrigue', this.schemingSnake);
        this.player1.triggerAbility(this.poisonedCoin);
        this.player1.clickCard(this.tumblestoneKnight);
    });

    it('poisons a character without shadow controlled by the losing opponent after you win an unopposed challenge with a shadow attacker', function () {
        expect(this.tumblestoneKnight.location).toBe('play area');

        this.completeChallengesPhase();

        expect(this.tumblestoneKnight.location).toBe('dead pile');
        expect(this.player1).isReadyToTakeAction();
    });
});
