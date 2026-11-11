describe('Orkmont Elite', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Orkmont Elite'] },
            player2: { discard: ['Mercenary Contract'], drawDeck: ['Sweet Cersei'] }
        });
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.orkmontElite);
        this.player1.clickPrompt('Done');
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.player2.clickPrompt('Done');
        this.skipActionWindow();
        this.player1.triggerAbility(this.orkmontElite);
    });

    it("puts an attachment from the losing opponent's discard pile into play on a character you control after it pillages, and gains renown while it has an attachment", function () {
        this.player1.clickCard(this.mercenaryContract);
        this.player1.clickCard(this.orkmontElite);

        expect(this.mercenaryContract.parent).toBe(this.orkmontElite);
        expect(this.orkmontElite.hasKeyword('renown')).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});
