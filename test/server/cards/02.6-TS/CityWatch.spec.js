describe('City Watch', function () {
    describe('while you have more power on your faction card than an opponent', function () {
        beforeEach(function () {
            this.setupTest({ phase: 'challenge', player1: { power: 1, hand: ['City Watch'] } });
            this.goldBefore = this.player1Object.gold;
            this.player1.clickCard(this.cityWatch);
        });

        it('reduces the cost to ambush it by 2', function () {
            expect(this.cityWatch.location).toBe('play area');
            expect(this.player1Object.gold).toBe(this.goldBefore - 4);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
