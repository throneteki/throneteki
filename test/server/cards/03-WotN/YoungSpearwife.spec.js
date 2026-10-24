describe('Young Spearwife', function () {
    describe('while you have less power on your faction card than an opponent', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'marshal',
                player1: { inPlay: ['Young Spearwife'] },
                player2: { power: 1 }
            });
        });

        it('gains stealth', function () {
            expect(this.youngSpearwife.hasKeyword('Stealth')).toBe(true);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('while you do not have less power', function () {
        beforeEach(function () {
            this.setupTest({ phase: 'marshal', player1: { inPlay: ['Young Spearwife'] } });
        });

        it('does not gain stealth', function () {
            expect(this.youngSpearwife.hasKeyword('Stealth')).toBe(false);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
