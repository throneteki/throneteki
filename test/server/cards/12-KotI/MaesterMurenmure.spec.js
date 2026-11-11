describe('Maester Murenmure', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { faction: 'greyjoy', inPlay: ['Maester Murenmure'] },
            player2: { inPlay: ["The Hand's Solar", 'Burned Men'] }
        });
        this.player1.clickPrompt('Done');
        this.player2.clickCard(this.theHandsSolar);
        this.player2.clickCard(this.burnedMen);
        this.player1.triggerAbility(this.maesterMurenmure);
    });

    it('kneels to cancel the effects of a triggered location ability', function () {
        expect(this.maesterMurenmure.kneeled).toBe(true);
        expect(this.burnedMen.hasIcon('intrigue')).toBe(false);
        expect(this.player2).isReadyToTakeAction();
    });
});
