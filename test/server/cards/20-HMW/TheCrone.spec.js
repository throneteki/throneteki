describe('The Crone (HMW)', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                inPlay: ['Steward at the Wall', 'Tumblestone Knight']
            },
            player2: { plot: 'The Crone (HMW)' }
        });
    });

    it('stops each character with printed STR 1 or lower leaving play', function () {
        expect(this.stewardAtTheWall.allowGameAction('kill')).toBe(false);
        expect(this.stewardAtTheWall.allowGameAction('discard')).toBe(false);
        expect(this.stewardAtTheWall.allowGameAction('returnToHand')).toBe(false);
        expect(this.tumblestoneKnight.allowGameAction('kill')).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});
