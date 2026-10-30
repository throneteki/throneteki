describe('Mag the Mighty', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Mag the Mighty', 'Hedge Knight'] },
            player2: { inPlay: ['Castle Guard', 'Winterfell Steward'] }
        });
        this.unopposedChallenge(this.player1, 'Military', this.magTheMighty);
        this.player1.clickCard(this.hedgeKnight);
        this.player2.clickCard(this.castleGuard);
        this.player2.clickCard(this.winterfellSteward);
    });

    it('kills a character you control, then the loser kills one of theirs', function () {
        expect(this.hedgeKnight.location).toBe('dead pile');
        expect(this.castleGuard.location).toBe('dead pile');
    });
});
