describe('Rains of Autumn', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                plot: 'Rains of Autumn',
                inPlay: ['Lannisport Moneylender', 'The Arbor']
            },
            player2: {
                inPlay: ['Lannisport Moneylender']
            }
        });
    });

    it('stops characters and locations providing positive gold modifiers', function () {
        expect(this.player1Object.getIncome()).toBe(4);
        expect(this.player2Object.getIncome()).toBe(5);
        expect(this.player1).isReadyToTakeAction();
    });
});
