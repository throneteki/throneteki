describe('Muster', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                hand: ['Muster'],
                inPlay: ['Tumblestone Knight'],
                drawDeck: ['House Dayne Knight']
            }
        });

        this.player1.clickCard(this.muster);
        this.player1.clickCard(this.tumblestoneKnight);
    });

    it('kneels a Knight character to search your deck for a Knight character and add it to your hand', function () {
        expect(this.tumblestoneKnight.kneeled).toBe(true);

        this.player1.clickCard(this.houseDayneKnight);

        expect(this.houseDayneKnight.location).toBe('hand');
        expect(this.player1).isReadyToTakeAction();
    });
});
