describe('Ser Gregor Clegane (FotS)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'lannister',
                inPlay: ['Ser Gregor Clegane (FotS)', 'Tumblestone Knight']
            }
        });
        this.unopposedChallenge(this.player1, 'Power', this.serGregorClegane);
        this.player1.clickCard(this.tumblestoneKnight);
    });

    it('must kill a character you control after you win a challenge he is participating in', function () {
        expect(this.tumblestoneKnight.location).toBe('dead pile');
        expect(this.player1).isReadyToTakeAction();
    });
});
