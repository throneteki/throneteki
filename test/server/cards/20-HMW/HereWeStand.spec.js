describe('Here We Stand', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                hand: ['Here We Stand'],
                inPlay: ['Dacey Mormont'],
                drawDeck: ['Bearskin Cloak', 'Tumblestone Knight', 'Maege Mormont']
            }
        });

        this.player1.togglePromptedActionWindow('dominance', true);
        this.completeChallengesPhase();
        this.player1.clickCard(this.hereWeStand);
    });

    it('searches the top 10 cards for any number of Bear Island, Bearskin Cloak and House Mormont cards', function () {
        expect(this.player1).not.toBeAbleToSelect(this.tumblestoneKnight);

        this.player1.clickCard(this.bearskinCloak);
        this.player1.clickCard(this.maegeMormont);
        this.player1.clickPrompt('Done');

        expect(this.bearskinCloak.location).toBe('hand');
        expect(this.maegeMormont.location).toBe('hand');

        this.player2.clickPrompt('Pass');
        this.player1.clickPrompt('Pass');

        expect(this.player1).isReadyToTakeAction();
    });
});
