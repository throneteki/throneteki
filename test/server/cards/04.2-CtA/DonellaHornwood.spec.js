describe('Donella Hornwood', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                inPlay: ['Donella Hornwood'],
                hand: ['Sansa Stark (WotN)', 'Tumblestone Knight']
            }
        });
    });

    it('reduces the cost of the first loyal card you marshal or play each round by 1', function () {
        this.player1.clickCard(this.tumblestoneKnight);

        expect(this.player1Object.gold).toBe(3);

        this.player1.clickCard(this.sansaStark);

        expect(this.sansaStark.location).toBe('play area');
        expect(this.player1Object.gold).toBe(2);
        expect(this.player1).isReadyToTakeAction();
    });
});
