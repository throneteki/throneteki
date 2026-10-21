describe('Greatjon Umber', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'stark',
                inPlay: ['Greatjon Umber', 'Tumblestone Knight']
            },
            player2: {
                inPlay: ['Bastard in Hiding', 'House Maester']
            }
        });
    });

    it('stands after you win a [military] challenge in which he is attacking', function () {
        this.unopposedChallenge(this.player1, 'Military', this.greatjonUmber);
        this.player1.triggerAbility(this.greatjonUmber);

        expect(this.greatjonUmber.kneeled).toBe(false);
        expect(this.game.getPlainTextLog()).toContain(
            'player1 uses Greatjon Umber to stand Greatjon Umber'
        );

        this.player2.clickCard(this.bastardInHiding);
        this.player1.clickCard(this.houseMaester);

        expect(this.player1).isReadyToTakeAction();
    });

    it('cannot be triggered after a [power] challenge', function () {
        this.unopposedChallenge(this.player1, 'Power', this.greatjonUmber);

        expect(this.player1).not.toAllowAbilityTrigger(this.greatjonUmber);
    });

    it('cannot be triggered when he is not attacking', function () {
        this.unopposedChallenge(this.player1, 'Military', this.tumblestoneKnight);

        expect(this.player1).not.toAllowAbilityTrigger(this.greatjonUmber);
    });
});
