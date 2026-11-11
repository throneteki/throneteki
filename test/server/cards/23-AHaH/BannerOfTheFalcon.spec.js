describe('Banner of the Falcon', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                agenda: 'Banner of the Falcon',
                inPlay: ['Sweetrobin', 'Sansa Stark (WotN)']
            }
        });
    });

    it('gives -2 initiative and +1 reserve, and +1 STR to each loyal character while you control more House Arryn cards than your initiative', function () {
        expect(this.player1Object.getReserve()).toBe(7);
        expect(this.sansaStark.getStrength()).toBe(5);
        expect(this.player1).isReadyToTakeAction();
    });
});
