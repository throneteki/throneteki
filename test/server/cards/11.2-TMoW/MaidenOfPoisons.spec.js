describe('Maiden of Poisons', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { faction: 'martell', inPlay: ['Maiden of Poisons'] },
            player2: { inPlay: ['Maester Aemon (Core)'] }
        });
        this.player1.clickPrompt('Intrigue');
        this.player1.clickCard(this.maidenOfPoisons);
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.player2.clickCard(this.maesterAemon);
        this.player2.clickPrompt('Done');
        this.skipActionWindow();
        this.player1.triggerAbility(this.maidenOfPoisons);
        this.player1.clickCard(this.maesterAemon);
    });

    it("sacrifices itself to return a participating character with fewer than 2 challenge icons to its owner's hand after you lose a challenge it is participating in", function () {
        expect(this.maidenOfPoisons.location).toBe('discard pile');
        expect(this.maesterAemon.location).toBe('hand');
        expect(this.player1).isReadyToTakeAction();
    });
});
