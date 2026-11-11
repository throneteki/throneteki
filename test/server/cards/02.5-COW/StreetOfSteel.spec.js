describe('Street of Steel', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Street of Steel', 'Ser Jaime Lannister (Core)'],
                drawDeck: ['Tumblestone Knight', 'Longclaw']
            }
        });

        this.unopposedChallenge(this.player1, 'Military', this.serJaimeLannister);
        this.player1.triggerAbility(this.streetOfSteel);
    });

    it('kneels your faction card to search the top 10 cards for a Weapon or Item attachment after you win a [military] challenge', function () {
        expect(this.player1Object.faction.kneeled).toBe(true);
        expect(this.player1).not.toBeAbleToSelect(this.tumblestoneKnight);

        this.player1.clickCard(this.longclaw);

        expect(this.longclaw.location).toBe('hand');
        expect(this.player1).isReadyToTakeAction();
    });
});
