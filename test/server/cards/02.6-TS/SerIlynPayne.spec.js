describe('Ser Ilyn Payne', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { faction: 'lannister', inPlay: ['Ser Ilyn Payne'] },
            player2: { inPlay: ['Burned Men'] }
        });
        this.player1.clickCard(this.serIlynPayne);
        this.player1.clickCard(this.burnedMen);
    });

    it('kneels to kill a character with printed cost 3 or lower', function () {
        expect(this.serIlynPayne.kneeled).toBe(true);
        expect(this.burnedMen.location).toBe('dead pile');
        expect(this.player1).isReadyToTakeAction();
    });
});
