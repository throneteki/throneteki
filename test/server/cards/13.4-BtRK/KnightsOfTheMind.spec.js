describe('Knights of the Mind', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                hand: ['Knights of the Mind'],
                inPlay: ['Tumblestone Knight', 'Maester Lomys'],
                gold: 1
            }
        });
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.knightsOfTheMind);
    });

    it('gives each Maester character you control a military icon until the end of the phase', function () {
        expect(this.maesterLomys.hasIcon('military')).toBe(true);
        expect(this.player2).isReadyToTakeAction();
    });
});
