describe('The Black Gate', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                inPlay: ['The Black Gate', 'Maester Harmune'],
                hand: ['Maester Cressen (WK)', 'Tumblestone Knight']
            }
        });
        this.player1.clickCard(this.theBlackGate);
        this.player1.clickCard(this.maesterHarmune);
    });

    it('kneels and sacrifices a thenightswatch character to put a cheaper character sharing a Trait into play from your hand or shadows', function () {
        expect(this.player1).not.toBeAbleToSelect(this.tumblestoneKnight);

        this.player1.clickCard(this.maesterCressen);

        expect(this.maesterHarmune.location).toBe('discard pile');
        expect(this.maesterCressen.location).toBe('play area');
        expect(this.player1).isReadyToTakeAction();
    });
});
