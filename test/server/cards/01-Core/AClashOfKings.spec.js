describe('A Clash of Kings', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { plot: 'A Clash of Kings', inPlay: ['Tumblestone Knight'] },
            player2: { power: 2 }
        });
        this.unopposedChallenge(this.player1, 'Power', this.tumblestoneKnight);
        this.player1.triggerAbility(this.aClashOfKings);
    });

    it("moves 1 power from the losing opponent's faction card to yours after you win a power challenge", function () {
        expect(this.player2Object.faction.power).toBe(0);
        expect(this.player1Object.faction.power).toBe(3);
        expect(this.player1).isReadyToTakeAction();
    });
});
