describe('Oldtown (R2)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Oldtown (R2)'],
                drawDeck: ['Tumblestone Knight']
            }
        });

        this.player1.togglePromptedActionWindow('dominance', true);
        this.completeChallengesPhase();
        this.player1.clickCard(this.oldtown);
        this.player1.clickPrompt('Character');
    });

    it('draws the revealed card and gains 1 power if it has the named cardtype', function () {
        expect(this.tumblestoneKnight.location).toBe('hand');
        expect(this.player1Object.faction.power).toBe(1);

        this.player2.clickPrompt('Pass');
        this.player1.clickPrompt('Pass');

        expect(this.player1).isReadyToTakeAction();
    });
});
