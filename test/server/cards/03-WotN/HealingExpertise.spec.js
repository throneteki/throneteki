describe('Healing Expertise', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                hand: ['Healing Expertise'],
                inPlay: ['Maester Lomys', 'Tumblestone Knight']
            },
            player2: { inPlay: ['Burned Men'] }
        });
        this.player1.clickPrompt('Done');
        this.unopposedChallenge(this.player2, 'Military', this.burnedMen);
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.triggerAbility(this.healingExpertise);
        this.player1.clickCard(this.maesterLomys);
    });

    it('kneels a Maester to save a non-Army character you control that would be killed', function () {
        expect(this.maesterLomys.kneeled).toBe(true);
        expect(this.tumblestoneKnight.location).toBe('play area');
        expect(this.player2).isReadyToTakeAction();
    });
});
