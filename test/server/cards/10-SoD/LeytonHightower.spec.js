describe('Leyton Hightower', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                inPlay: ['Leyton Hightower'],
                hand: ['Garden Caretaker', 'Highgarden Honor Guard']
            }
        });
        this.player1.clickCard(this.leytonHightower);
    });

    it('kneels to put a non-limited tyrell card with printed cost 4 or lower into play knelt', function () {
        expect(this.player1).not.toAllowSelect(this.highgardenHonorGuard);
        this.player1.clickCard(this.gardenCaretaker);

        expect(this.gardenCaretaker.location).toBe('play area');
        expect(this.gardenCaretaker.kneeled).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});
