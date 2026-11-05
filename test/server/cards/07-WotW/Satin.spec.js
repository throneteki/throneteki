describe('Satin', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'thenightswatch',
                inPlay: ['Satin', { card: 'Steward at the Wall', kneeling: true }]
            }
        });
        this.player1.clickPrompt('Intrigue');
        this.player1.clickCard(this.satin);
        this.player1.clickPrompt('Done');
        this.player1.triggerAbility(this.satin);
        this.player1.clickCard(this.stewardAtTheWall);
    });

    it('stands another Steward character after she kneels', function () {
        expect(this.stewardAtTheWall.kneeled).toBe(false);
        expect(this.player1).isReadyToTakeAction();
    });
});
