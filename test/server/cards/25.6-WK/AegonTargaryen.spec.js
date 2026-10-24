describe('Aegon Targaryen (WK)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: [{ card: 'Aegon Targaryen (WK)', kneeling: true }],
                shadows: ['Brazen Beast'],
                gold: 3
            }
        });
        this.player1.clickCard(this.brazenBeast);
        this.player1.triggerAbility(this.aegonTargaryen);
    });

    it('stands after a non-loyal targaryen character enters play during the challenges phase', function () {
        expect(this.aegonTargaryen.kneeled).toBe(false);
        expect(this.player1).isReadyToTakeAction();
    });
});
