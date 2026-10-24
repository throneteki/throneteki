describe('Dornish Spy', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { hand: ['Dornish Spy'], gold: 3 },
            player2: { inPlay: ['Tumblestone Knight'] }
        });
        this.player1.clickCard(this.dornishSpy);
        this.player1.triggerAbility(this.dornishSpy);
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickPrompt('Military');
    });

    it('makes a character lose a challenge icon of your choice after it enters play', function () {
        expect(this.tumblestoneKnight.hasIcon('military')).toBe(false);
        expect(this.tumblestoneKnight.hasIcon('power')).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});
