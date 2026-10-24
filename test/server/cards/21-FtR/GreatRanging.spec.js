describe('Great Ranging (FtR)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                gold: 10,
                hand: ['Great Ranging (FtR)'],
                drawDeck: ['Fist of the First Men']
            }
        });

        this.player1.clickCard(this.greatRanging);
        this.player1.triggerAbility(this.greatRanging);
    });

    it('puts Fist of the First Men into play after you marshal it, and gives +1 reserve', function () {
        this.player1.clickCard(this.fistOfTheFirstMen);

        expect(this.fistOfTheFirstMen.location).toBe('play area');
        expect(this.player1Object.getReserve()).toBe(7);
        expect(this.player1).isReadyToTakeAction();
    });
});
