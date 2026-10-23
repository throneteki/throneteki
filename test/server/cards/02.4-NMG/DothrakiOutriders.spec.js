describe('Dothraki Outriders', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { hand: ['Dothraki Outriders'], inPlay: ['Braided Warrior'], gold: 10 }
        });
        this.player1.clickCard(this.dothrakiOutriders);
    });

    it('costs 1 less to marshal for each Dothraki character you control', function () {
        expect(this.dothrakiOutriders.location).toBe('play area');
        expect(this.player1Object.gold).toBe(3);
        expect(this.player1).isReadyToTakeAction();
    });
});
