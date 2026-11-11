describe('Joffrey Baratheon (GoH)', function () {
    describe('after you marshal a loyal character', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'marshal',
                player1: { inPlay: ['Joffrey Baratheon (GoH)'], hand: ['Catelyn Stark (Core)'] },
                player2: { inPlay: ['Hedge Knight'] }
            });
            this.player1.clickCard(this.catelynStark);
            this.player1.triggerAbility(this.joffreyBaratheon);
            this.player1.clickCard(this.hedgeKnight);
        });

        it('kneels it and your faction card to kill a non-King character with a lower printed cost', function () {
            expect(this.catelynStark.kneeled).toBe(true);
            expect(this.player1Object.faction.kneeled).toBe(true);
            expect(this.hedgeKnight.location).toBe('dead pile');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
