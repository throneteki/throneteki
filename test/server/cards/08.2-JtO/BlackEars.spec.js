describe('Black Ears', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'lannister',
                inPlay: ['Tumblestone Knight'],
                hand: ['Black Ears'],
                gold: 2
            },
            player2: { inPlay: ['Burned Men'] }
        });
        this.unopposedChallenge(this.player1, 'Military', this.tumblestoneKnight);
        this.player2.clickCard(this.burnedMen);
        this.player1.triggerAbility(this.blackEars);
    });

    it('pays 2 gold to put itself into play from your hand after a character is killed', function () {
        expect(this.blackEars.location).toBe('play area');
        expect(this.player1).isReadyToTakeAction();
    });
});
