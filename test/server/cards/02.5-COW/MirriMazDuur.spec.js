describe('Mirri Maz Duur', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Mirri Maz Duur', 'The Hound (TtB)'] },
            player2: { inPlay: [{ card: 'Targaryen Loyalist', kneeling: true }] }
        });
    });

    it('kills a character of the loser instead of the normal claim when attacking alone', function () {
        this.unopposedChallenge(this.player1, 'Power', this.mirriMazDuur);
        this.player1.triggerAbility('Mirri Maz Duur');
        this.player1.clickCard(this.targaryenLoyalist);

        expect(this.targaryenLoyalist.location).toBe('dead pile');
        expect(this.player1).isReadyToTakeAction();
    });

    it('counts as attacking alone once the other attacker has left play', function () {
        this.player1.clickPrompt('Power');
        this.player1.clickCard(this.mirriMazDuur);
        this.player1.clickCard(this.theHound);
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.player2.clickPrompt('Done');
        this.skipActionWindow();

        expect(this.theHound.location).toBe('hand');
        expect(this.player1).toAllowAbilityTrigger('Mirri Maz Duur');
    });
});
