describe('Growing Strong', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Margaery Tyrell (Core)', 'Tumblestone Knight'],
                hand: ['Growing Strong'],
                gold: 1
            }
        });
        this.player1.clickCard(this.growingStrong);
        this.player1.clickCard(this.margaeryTyrell);
        this.player1.clickPrompt('Done');
    });

    it('gives up to three tyrell characters +2 STR until the end of the phase', function () {
        expect(this.margaeryTyrell.getStrength()).toBe(5);
        expect(this.tumblestoneKnight.getStrength()).toBe(2);
        expect(this.player1).isReadyToTakeAction();
    });
});
