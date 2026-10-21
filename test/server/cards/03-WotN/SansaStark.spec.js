describe('Sansa Stark (WotN)', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                inPlay: ['Sansa Stark (WotN)'],
                deadPile: [
                    'Tumblestone Knight',
                    'Winterfell Steward',
                    'Arya Stark (Core)',
                    'Bran Stark (Core)'
                ]
            }
        });
    });

    it('gets -1 STR for each [stark] character in your dead pile, and gains insight while her STR is 0', function () {
        expect(this.sansaStark.getStrength()).toBe(0);
        expect(this.sansaStark.hasKeyword('Insight')).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});
