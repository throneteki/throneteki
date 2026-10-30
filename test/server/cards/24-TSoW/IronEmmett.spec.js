describe('Iron Emmett (TSoW)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: [{ card: 'Iron Emmett (TSoW)', kneeling: true }],
                hand: ['Tumblestone Knight', 'House Maester']
            }
        });
    });

    it('stops characters with a [military] icon entering play during the challenges phase while he is kneeling', function () {
        expect(this.player1Object.canPutIntoPlay(this.tumblestoneKnight)).toBe(false);
        expect(this.player1Object.canPutIntoPlay(this.houseMaester)).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});
