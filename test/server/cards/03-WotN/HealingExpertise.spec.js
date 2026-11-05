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
        this.player2.clickPrompt('Military');
        this.player2.clickCard(this.burnedMen);
        this.player2.clickPrompt('Done');
        this.skipActionWindow();
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
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
