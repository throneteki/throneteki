describe('Offer of a Peach', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Margaery Tyrell (Core)'], hand: ['Offer of a Peach'], gold: 1 },
            player2: { inPlay: ['Khal Drogo (Core)'] }
        });
        this.player1.clickPrompt('Done');
        this.player2.clickPrompt('Military');
        this.player2.clickCard(this.khalDrogo);
        this.player2.clickPrompt('Done');
        this.player1.clickCard(this.offerOfAPeach);
        this.player1.clickCard(this.khalDrogo);
    });

    it('stands an attacking character and removes it from the challenge', function () {
        expect(this.khalDrogo.kneeled).toBe(false);
        expect(this.khalDrogo.isParticipating()).toBe(false);
        expect(this.player2).isReadyToTakeAction();
    });
});
