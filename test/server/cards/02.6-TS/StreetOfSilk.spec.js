describe('Street of Silk', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Street of Silk', 'Joffrey Baratheon (Core)'],
                drawDeck: ['Tumblestone Knight', 'Steward at the Wall']
            }
        });

        this.unopposedChallenge(this.player1, 'Power', this.joffreyBaratheon);
        this.player1.triggerAbility(this.streetOfSilk);
    });

    it('searches the top 5 cards for an Ally or Companion after you win a challenge with a participating Lord or Lady', function () {
        expect(this.player1).not.toBeAbleToSelect(this.tumblestoneKnight);

        this.player1.clickCard(this.stewardAtTheWall);

        expect(this.stewardAtTheWall.location).toBe('hand');
        expect(this.player1).isReadyToTakeAction();
    });
});
