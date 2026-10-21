describe('standing restrictions', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: [
                    'Stannis Baratheon (Core)',
                    { card: 'Tumblestone Knight', kneeling: true },
                    { card: 'House Maester', kneeling: true },
                    { card: 'Bastard in Hiding', kneeling: true }
                ]
            }
        });

        this.completeChallengesPhase();
    });

    it('make the player choose which characters stand, and cannot be skipped', function () {
        expect(this.player1).toHavePrompt('Select 2 cards to stand');

        this.player1.clickPrompt('Done');

        expect(this.player1).toHavePrompt('Select 2 cards to stand');

        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickCard(this.houseMaester);
        this.player1.clickPrompt('Done');

        expect(this.tumblestoneKnight.kneeled).toBe(false);
        expect(this.houseMaester.kneeled).toBe(false);
        expect(this.bastardInHiding.kneeled).toBe(true);
    });
});
