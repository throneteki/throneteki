describe('Unbridled Generosity', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Tumblestone Knight'], hand: ['Unbridled Generosity'] }
        });
        this.player1.clickCard(this.unbridledGenerosity);
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickPrompt('Done');
    });

    it('moves 1 gold from the treasury to each of up to 3 cards', function () {
        expect(this.tumblestoneKnight.gold).toBe(1);
        expect(this.player1).isReadyToTakeAction();
    });
});
