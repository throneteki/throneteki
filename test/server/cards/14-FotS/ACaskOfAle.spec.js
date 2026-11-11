describe('"A Cask of Ale"', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Courtesan of the Rose'], hand: ['"A Cask of Ale"'], gold: 5 },
            player2: { inPlay: [{ card: 'Hedge Knight', power: 2 }, 'Castle Guard'] }
        });
        this.unopposedChallenge(this.player1, 'Power', this.courtesanOfTheRose);
        this.player1.triggerAbility('"A Cask of Ale"');
        this.player1.clickCard(this.hedgeKnight);
    });

    it('moves up to 2 power between 2 cards controlled by the same player after you win a power challenge', function () {
        expect(this.player1).not.toAllowSelect(this.courtesanOfTheRose);
        this.player1.clickCard(this.castleGuard);
        this.player1.clickPrompt('2');
        expect(this.hedgeKnight.power).toBe(0);
        expect(this.castleGuard.power).toBe(2);
    });
});
