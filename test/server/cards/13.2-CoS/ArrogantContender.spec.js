describe('Arrogant Contender', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Arrogant Contender'] },
            player2: { inPlay: ['Steward at the Wall', 'Black Walder'] }
        });
        this.player1.clickPrompt('Intrigue');
        this.player1.clickCard(this.arrogantContender);
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.player2.clickCard(this.stewardAtTheWall);
        this.player2.clickCard(this.blackWalder);
        this.player2.clickPrompt('Done');
    });

    it('gets +1 STR for each participating character an opponent controls', function () {
        expect(this.arrogantContender.getStrength()).toBe(
            this.arrogantContender.getPrintedStrength() + 2
        );
    });

    it('gains power equal to the number of opposing participants after winning alone', function () {
        this.skipActionWindow();
        this.player1.triggerAbility('Arrogant Contender');
        expect(this.arrogantContender.power).toBe(2);
    });
});
