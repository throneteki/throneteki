describe('Rogue Wildling', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { hand: ['Rogue Wildling'], inPlay: ['Wildling Scout'], gold: 5 }
        });
        this.player1.clickPrompt('Intrigue');
        this.player1.clickCard(this.wildlingScout);
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.rogueWildling);
        this.player1.triggerAbility(this.rogueWildling);
        this.player1.clickCard(this.wildlingScout);
    });

    it('stands a Wildling character you control after it enters play', function () {
        expect(this.wildlingScout.kneeled).toBe(false);
        expect(this.player2).isReadyToTakeAction();
    });
});
