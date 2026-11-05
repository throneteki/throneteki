describe('Dreadfort Maester', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Dreadfort Maester', 'Tumblestone Knight'] }
        });
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickPrompt('Done');
        this.player1.triggerAbility(this.dreadfortMaester);
    });

    it('sacrifices itself to raise your claim by 1 after you initiate a military or intrigue challenge', function () {
        expect(this.dreadfortMaester.location).toBe('discard pile');
        expect(this.player1Object.getClaim()).toBe(2);
        expect(this.player1).isReadyToTakeAction();
    });
});
