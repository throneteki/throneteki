describe('Hightower Knight', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'tyrell',
                inPlay: ['Littlefinger (Core)', 'Tumblestone Knight'],
                hand: ['Hightower Knight']
            }
        });
        this.player1.clickPrompt('Intrigue');
        this.player1.clickCard(this.littlefinger);
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.hightowerKnight);
        this.player1.clickCard(this.tumblestoneKnight);
    });

    it('kneels a non-tyrell Knight to put itself into play from your hand', function () {
        expect(this.tumblestoneKnight.kneeled).toBe(true);
        expect(this.hightowerKnight.location).toBe('play area');
        expect(this.player2).isReadyToTakeAction();
    });
});
