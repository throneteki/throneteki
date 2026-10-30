describe('Support of the People', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Khal Drogo (Core)'],
                hand: ['Support of the People'],
                drawDeck: ['Heart Tree Grove']
            }
        });

        this.unopposedChallenge(this.player1, 'Power', this.khalDrogo);
        this.player1.triggerAbility(this.supportOfThePeople);
    });

    it('searches your deck for a location with printed cost 3 or lower and puts it into play after you win a [power] challenge by 5 or more', function () {
        this.player1.clickCard(this.heartTreeGrove);

        expect(this.heartTreeGrove.location).toBe('play area');
        expect(this.player1).isReadyToTakeAction();
    });
});
