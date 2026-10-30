describe('Septa Mordane', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                inPlay: ['Septa Mordane', 'Sansa Stark (WotN)', 'Arya Stark (Core)']
            }
        });
    });

    it("gives Sansa Stark +2 STR and renown, and Arya Stark an [intrigue] icon and immunity to opponents' plot effects", function () {
        expect(this.sansaStark.getStrength()).toBe(6);
        expect(this.sansaStark.hasKeyword('Renown')).toBe(true);
        expect(this.aryaStark.hasIcon('intrigue')).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});
