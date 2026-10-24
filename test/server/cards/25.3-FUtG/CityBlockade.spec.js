describe('City Blockade (FUtG)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                inPlay: ['Tumblestone Knight'],
                hand: ['Lannisport Moneylender']
            },
            player2: { plot: 'City Blockade (FUtG)' }
        });
    });

    it('stops limited cards being marshaled, played or put into play', function () {
        expect(this.player1Object.canPutIntoPlay(this.lannisportMoneylender, 'marshal')).toBe(
            false
        );
        expect(this.player1Object.canPutIntoPlay(this.tumblestoneKnight, 'marshal')).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});
