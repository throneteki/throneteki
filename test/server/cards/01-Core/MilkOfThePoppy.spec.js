describe('Milk of the Poppy', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { hand: ['Milk of the Poppy'] },
            player2: { inPlay: ['Hedge Knight', 'Tumblestone Knight'] }
        });
    });

    it('treats the attached character as having a blank text box, except for Traits', function () {
        expect(this.hedgeKnight.getStrength()).toBe(3);

        this.player1.clickCard(this.milkOfThePoppy);
        this.player1.clickCard(this.hedgeKnight);

        expect(this.hedgeKnight.getStrength()).toBe(2);
        expect(this.hedgeKnight.hasTrait('Knight')).toBe(true);
        expect(this.tumblestoneKnight.getStrength()).toBe(2);
        expect(this.player1).isReadyToTakeAction();
    });

    it('is discarded when the attached character leaves play', function () {
        expect(this.milkOfThePoppy.hasKeyword('terminal')).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});
