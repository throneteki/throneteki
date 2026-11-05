describe('Alerie Tyrell', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                hand: ['Alerie Tyrell'],
                drawDeck: ['Tumblestone Knight', 'Courtesan of the Rose']
            }
        });

        this.player1.clickCard(this.alerieTyrell);
        this.player1.triggerAbility(this.alerieTyrell);
    });

    it('searches the top 10 cards for a [tyrell] character with printed cost 3 or lower after she enters play', function () {
        expect(this.player1).not.toBeAbleToSelect(this.tumblestoneKnight);

        this.player1.clickCard(this.courtesanOfTheRose);

        expect(this.courtesanOfTheRose.location).toBe('hand');
        expect(this.player1).isReadyToTakeAction();
    });
});
