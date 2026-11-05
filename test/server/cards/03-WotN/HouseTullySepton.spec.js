describe('House Tully Septon', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                inPlay: [{ card: 'House Tully Septon', power: 1 }],
                hand: ['Tumblestone Knight'],
                gold: 0
            }
        });
        this.player1.clickCard(this.houseTullySepton);
        this.player1.clickCard(this.houseTullySepton);
    });

    it('discards 1 power from a character you control to reduce the cost of the next House Tully or The Seven character by 2', function () {
        this.player1.clickCard(this.tumblestoneKnight);

        expect(this.houseTullySepton.power).toBe(0);
        expect(this.tumblestoneKnight.location).toBe('play area');
        expect(this.player1).isReadyToTakeAction();
    });
});
