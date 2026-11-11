describe('Shierak Qiya', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { faction: 'targaryen', hand: ['Shierak Qiya'], inPlay: ['Khal Drogo (Core)'] }
        });
        this.unopposedChallenge(this.player1, 'Power', this.khalDrogo);
        this.player1.triggerAbility(this.shierakQiya);
        this.player1.clickCard(this.khalDrogo);
    });

    it('kneels your faction card to stand a participating character after you win a power challenge by 5 or more STR', function () {
        expect(this.player1Object.faction.kneeled).toBe(true);
        expect(this.khalDrogo.kneeled).toBe(false);
        expect(this.player1).isReadyToTakeAction();
    });
});
