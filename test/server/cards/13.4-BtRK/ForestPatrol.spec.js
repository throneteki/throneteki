describe('Forest Patrol', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'thenightswatch',
                inPlay: ['Tumblestone Knight', "Brandon's Gift"],
                shadows: ['Forest Patrol'],
                gold: 0
            }
        });
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.forestPatrol);
        this.player1.clickCard(this.brandonsGift);
    });

    it('kneels a thenightswatch location to put itself into play from shadows', function () {
        expect(this.brandonsGift.kneeled).toBe(true);
        expect(this.forestPatrol.location).toBe('play area');
        expect(this.player2).isReadyToTakeAction();
    });
});
