describe('Thoren Smallwood', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Thoren Smallwood'] },
            player2: { inPlay: ['Tumblestone Knight'] }
        });
        this.player1.clickPrompt('Done');
        this.player2.clickPrompt('Military');
        this.player2.clickCard(this.tumblestoneKnight);
        this.player2.clickPrompt('Done');
        this.skipActionWindow();
        this.player1.clickCard(this.thorenSmallwood);
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.player1.triggerAbility(this.thorenSmallwood);
    });

    it('gains 1 power for your faction after you win a challenge as the defender', function () {
        expect(this.player1Object.faction.power).toBe(1);
        expect(this.player2).isReadyToTakeAction();
    });
});
