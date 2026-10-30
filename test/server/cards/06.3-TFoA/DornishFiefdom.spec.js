describe('Dornish Fiefdom', function () {
    describe('when you are the first player', function () {
        beforeEach(function () {
            this.setupTest({ phase: 'marshal', player1: { inPlay: ['Dornish Fiefdom'] } });
            this.goldBefore = this.player1Object.gold;
            this.player1.clickMenu(this.dornishFiefdom, 'Gain gold');
        });

        it('kneels to gain 1 gold', function () {
            expect(this.player1Object.gold).toBe(this.goldBefore + 1);
            expect(this.dornishFiefdom.kneeled).toBe(true);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('when you are not the first player', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'marshal',
                firstPlayer: 'player2',
                player1: { inPlay: ['Dornish Fiefdom'] }
            });
            this.player2.clickPrompt('Done');
            this.goldBefore = this.player1Object.gold;
            this.player1.clickMenu(this.dornishFiefdom, 'Gain gold');
        });

        it('kneels to gain 2 gold', function () {
            expect(this.player1Object.gold).toBe(this.goldBefore + 2);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
