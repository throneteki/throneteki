describe('Mountains of the Moon', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { inPlay: ['Mountains of the Moon'], hand: ['Burned Men'], gold: 2 }
        });
        this.player1.clickCard(this.burnedMen);
        this.player1.triggerAbility(this.mountainsOfTheMoon);
        this.player1.clickPrompt('Intrigue');
    });

    it('gives a Clansman character a challenge icon of your choice after it enters play', function () {
        expect(this.burnedMen.hasIcon('intrigue')).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});
