describe('The Gift of Mercy', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { agenda: 'The Gift of Mercy', inPlay: ['Ser Jaime Lannister (Core)'] },
            player2: { inPlay: [{ card: 'Tumblestone Knight', tokens: { valarmorghulis: 2 } }] }
        });
        this.unopposedChallenge(this.player1, 'Military', this.serJaimeLannister);
        this.player1.triggerAbility(this.theGiftOfMercy);
        this.player1.clickCard(this.tumblestoneKnight);
    });

    it('places a Valar Morghulis token on a character the losing opponent controls, and gives you 2 power when a character with 3 or more leaves play', function () {
        expect(this.tumblestoneKnight.tokens.valarmorghulis).toBe(3);

        this.startingPower = this.player1Object.faction.power;
        this.player2.clickCard(this.tumblestoneKnight);
        this.player1.triggerAbility(this.theGiftOfMercy);

        expect(this.player1Object.faction.power).toBe(this.startingPower + 2);
        expect(this.player1).isReadyToTakeAction();
    });
});
