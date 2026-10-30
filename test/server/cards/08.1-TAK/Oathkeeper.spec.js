describe('Oathkeeper', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: [{ card: 'Khal Drogo (Core)', attachments: ['Oathkeeper'] }],
                drawDeck: ['Courtesan of the Rose', 'House Dayne Knight']
            }
        });
    });

    it('gives the attached character +2 STR', function () {
        expect(this.khalDrogo.getStrength()).toBe(7);
        expect(this.player1).isReadyToTakeAction();
    });

    it('sacrifices to search your deck for a non-[tyrell] character after you win by 5 or more with the attached character', function () {
        this.unopposedChallenge(this.player1, 'Power', this.khalDrogo);
        this.player1.triggerAbility(this.oathkeeper);

        expect(this.oathkeeper.location).toBe('discard pile');
        expect(this.player1).not.toBeAbleToSelect(this.courtesanOfTheRose);

        this.player1.clickCard(this.houseDayneKnight);

        expect(this.houseDayneKnight.location).toBe('hand');
        expect(this.player1).isReadyToTakeAction();
    });
});
