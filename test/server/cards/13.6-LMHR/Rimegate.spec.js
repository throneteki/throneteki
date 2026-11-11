describe('Rimegate', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { faction: 'thenightswatch', inPlay: ['Rimegate', "Brandon's Gift"] },
            player2: { faction: 'greyjoy', hand: ['Newly-Made Lord'], gold: 4 }
        });
        this.player1.clickPrompt('Done');
        this.player2.clickCard(this.newlyMadeLord);
        this.player2.triggerAbility(this.newlyMadeLord);
        this.player2.clickCard(this.brandonsGift);
        this.player1.triggerAbility(this.rimegate);
    });

    it('kneels to save another location you control that would be discarded', function () {
        expect(this.rimegate.kneeled).toBe(true);
        expect(this.brandonsGift.location).toBe('play area');
        expect(this.player2).isReadyToTakeAction();
    });
});
