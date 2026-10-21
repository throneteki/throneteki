describe('Ser Talbert Serry', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { inPlay: ['Ser Talbert Serry'] },
            player2: { inPlay: ["The Hand's Solar", 'Burned Men'] }
        });
        this.player1.clickPrompt('Done');
        this.player2.clickCard(this.theHandsSolar);
        this.player2.clickCard(this.burnedMen);
        this.player1.triggerAbility(this.serTalbertSerry);
    });

    it('gets +2 STR until the end of the phase after an opponent triggers a location ability', function () {
        expect(this.serTalbertSerry.getStrength()).toBe(5);
        expect(this.player2).isReadyToTakeAction();
    });
});
