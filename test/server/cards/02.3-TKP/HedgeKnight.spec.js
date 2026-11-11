describe('Hedge Knight', function () {
    describe('while you control another Knight', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'marshal',
                player1: { inPlay: ['Hedge Knight', 'Tumblestone Knight'] }
            });
        });

        it('gets +1 STR and gains a power icon', function () {
            expect(this.hedgeKnight.getStrength()).toBe(3);
            expect(this.hedgeKnight.hasIcon('power')).toBe(true);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('without another Knight', function () {
        beforeEach(function () {
            this.setupTest({ phase: 'marshal', player1: { inPlay: ['Hedge Knight'] } });
        });

        it('gets no bonus', function () {
            expect(this.hedgeKnight.getStrength()).toBe(2);
            expect(this.hedgeKnight.hasIcon('power')).toBe(false);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
