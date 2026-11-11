describe('Seductive Promise', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { hand: ['Seductive Promise'], inPlay: ['Khal Drogo (Core)'] },
            player2: { inPlay: ['Tumblestone Knight', 'Ser Jaime Lannister (Core)'] }
        });
        this.unopposedChallenge(this.player1, 'Power', this.khalDrogo);
        this.player1.triggerAbility(this.seductivePromise);
    });

    it('takes control of a non-unique character the losing opponent controls after you win a power challenge by 5 or more', function () {
        expect(this.player1).not.toBeAbleToSelect(this.serJaimeLannister);

        this.player1.clickCard(this.tumblestoneKnight);

        expect(this.tumblestoneKnight.controller).toBe(this.player1Object);
        expect(this.player1).isReadyToTakeAction();
    });
});
