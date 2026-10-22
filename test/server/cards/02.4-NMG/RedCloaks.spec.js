describe('Red Cloaks', function () {
    beforeEach(function () {
        this.setupTest({ phase: 'challenge', player1: { inPlay: ['Red Cloaks'], gold: 1 } });
        this.player1.clickCard(this.redCloaks);
        this.player1.clickPrompt('Intrigue');
        this.player1.clickCard(this.redCloaks);
        this.player1.clickPrompt('Done');
    });

    it('moves 1 gold from your gold pool to itself, and gets +1 STR for each gold on it during intrigue challenges', function () {
        expect(this.redCloaks.gold).toBe(1);
        expect(this.player1Object.gold).toBe(0);
        expect(this.redCloaks.getStrength()).toBe(3);
        expect(this.player1).isReadyToTakeAction();
    });
});
