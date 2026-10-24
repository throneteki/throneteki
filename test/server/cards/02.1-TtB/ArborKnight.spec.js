describe('Arbor Knight', function () {
    beforeEach(function () {
        this.setupTest({ phase: 'challenge', player1: { inPlay: ['Arbor Knight'], gold: 1 } });
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.arborKnight);
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.arborKnight);
        this.player1.clickCard(this.arborKnight);
    });

    it('pays 1 gold to give a participating House Redwyne character +1 STR until the end of the challenge', function () {
        expect(this.player1Object.gold).toBe(0);
        expect(this.arborKnight.getStrength()).toBe(2);
        expect(this.player2).isReadyToTakeAction();
    });
});
