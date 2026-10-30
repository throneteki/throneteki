describe('Doubting Septa', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Doubting Septa', 'Cersei Lannister (Core)'] }
        });
        this.unopposedChallenge(this.player1, 'Intrigue', this.cerseiLannister);
        this.player1.triggerAbility(this.doubtingSepta);
    });

    it('is sacrificed to have a character you control gain 1 power after you win an intrigue challenge', function () {
        this.player1.clickCard(this.cerseiLannister);

        expect(this.doubtingSepta.location).toBe('discard pile');
        expect(this.cerseiLannister.power).toBe(1);
        expect(this.player1).isReadyToTakeAction();
    });
});
