describe('Ser Alliser Thorne', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'thenightswatch',
                hand: ['Ser Alliser Thorne'],
                inPlay: ['Steward at the Wall'],
                gold: 4
            },
            player2: { inPlay: ['Burned Men'] }
        });
        this.player1.clickPrompt('Done');
        this.player2.clickPrompt('Military');
        this.player2.clickCard(this.burnedMen);
        this.player2.clickPrompt('Done');
        this.player1.triggerAbility(this.serAlliserThorne);
    });

    it('kneels your faction card and pays 4 gold to come into play after a military challenge is initiated against you, and gives thenightswatch characters a military icon while you defend', function () {
        expect(this.player1Object.faction.kneeled).toBe(true);
        expect(this.serAlliserThorne.location).toBe('play area');
        expect(this.stewardAtTheWall.hasIcon('military')).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});
