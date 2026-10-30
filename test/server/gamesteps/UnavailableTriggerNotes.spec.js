describe('notes on triggers that could not resolve', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { faction: 'martell', inPlay: ['Maester of Sunspear'] },
            player2: { inPlay: ['Tyrion Lannister (Core)'] }
        });
        this.player1.clickPrompt('Intrigue');
        this.player1.clickCard(this.maesterOfSunspear);
        this.player1.clickPrompt('Done');
        this.player2.clickPrompt('Pass');
        this.skipActionWindow();
        this.player2.clickCard(this.tyrionLannister);
        this.player2.clickPrompt('Done');
        this.skipActionWindow();
    });

    it('are recorded when a reaction triggers without a legal target', function () {
        expect([...this.game.unavailableAbilityReasons.values()]).toContainEqual(
            expect.objectContaining({ card: this.maesterOfSunspear, reason: 'target' })
        );
    });

    it('stop showing once the challenge ends', function () {
        expect(this.game.currentChallenge).toBeFalsy();
        expect(
            this.game.getUnavailableAbilityReasons(this.maesterOfSunspear, this.player1.player)
        ).toBeUndefined();
    });
});
