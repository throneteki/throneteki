describe('"Wolf in the Night"', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { hand: ['"Wolf in the Night"'], inPlay: ['Tumblestone Knight'], gold: 1 }
        });
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.wolfInTheNight);
        this.player1.clickCard(this.tumblestoneKnight);
    });

    it('gives a stark character attacking alone +3 STR and renown until the end of the challenge', function () {
        expect(this.tumblestoneKnight.getStrength()).toBe(5);
        expect(this.tumblestoneKnight.hasKeyword('renown')).toBe(true);
        expect(this.player2).isReadyToTakeAction();
    });
});
