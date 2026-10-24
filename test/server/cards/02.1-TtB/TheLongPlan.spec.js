describe('The Long Plan', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { faction: 'martell', plot: 'The Long Plan' },
            player2: { inPlay: ['Ser Jaime Lannister (Core)'] }
        });
        this.player1.clickPrompt('Done');
        this.unopposedChallenge(this.player2, 'Intrigue', this.serJaimeLannister);
        this.startingGold = this.player1Object.gold;
        this.player1.triggerAbility(this.theLongPlan);
    });

    it('gains 1 gold after you lose a challenge, and keeps unspent gold in the taxation phase', function () {
        expect(this.player1Object.gold).toBe(this.startingGold + 1);
        expect(this.player2).isReadyToTakeAction();
    });
});
