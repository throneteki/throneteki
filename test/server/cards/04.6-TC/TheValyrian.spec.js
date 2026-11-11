describe('The Valyrian', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['The Valyrian', 'Tumblestone Knight'] },
            player2: { gold: 3 }
        });
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.theValyrian);
        this.player1.clickCard(this.tumblestoneKnight);
    });

    it("kneels to give an attacking character +1 STR for each gold in the defending player's gold pool", function () {
        expect(this.theValyrian.kneeled).toBe(true);
        expect(this.tumblestoneKnight.getStrength()).toBe(5);
        expect(this.player2).isReadyToTakeAction();
    });
});
