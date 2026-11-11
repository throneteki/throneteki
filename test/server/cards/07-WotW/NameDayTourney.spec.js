describe('Name Day Tourney', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                plot: 'Name Day Tourney',
                inPlay: ['Tumblestone Knight', 'Eddard Stark (Core)']
            }
        });
        this.unopposedChallenge(this.player1, 'Military', this.tumblestoneKnight);
        this.player1.triggerAbility(this.nameDayTourney);
        this.player1.clickCard(this.eddardStark);
    });

    it('gives a Lord or Lady character you control 1 power after you win a challenge with a Knight participating alone', function () {
        expect(this.eddardStark.power).toBe(1);
        expect(this.player1).isReadyToTakeAction();
    });
});
