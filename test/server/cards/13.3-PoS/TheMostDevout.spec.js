describe('The Most Devout', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            firstPlayer: 'player2',
            player1: { inPlay: ['The Most Devout'] },
            player2: { hand: ['Hedge Knight', 'Winterfell Steward'] }
        });
        this.player2.clickCard(this.hedgeKnight);
        this.player2.clickCard(this.winterfellSteward);
        this.player1.triggerAbility('The Most Devout');
    });

    it('gains 1 power after a second character enters play under an opponent this phase', function () {
        expect(this.theMostDevout.power).toBe(1);
        expect(this.player2).isReadyToTakeAction();
    });
});
